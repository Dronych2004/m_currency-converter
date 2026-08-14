import { useState, useEffect } from 'react';
import type { WeatherData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { CURRENCY_TO_COUNTRY, CURRENCY_FLAG_EMOJI, CRYPTO_CODES, currencies as currencyMeta } from '../data/currencies';
import { getCurrentTime } from '../services/api';

interface CityInfoCardProps {
  weather: WeatherData | null;
  cityName: string;
  cityNameEn: string;
  currencyCode: string;
}

export function CityInfoCard({ weather, cityName, cityNameEn, currencyCode }: CityInfoCardProps) {
  const { lang } = useLanguage();
  const isLoading = !weather;

  // Время обновляется здесь, а не в хуке — не перерендеривает весь App
  const [timeStr, setTimeStr] = useState('--:--:--');
  const [dateStr, setDateStr] = useState('--.--.----');
  const [utcOffset, setUtcOffset] = useState(0);

  useEffect(() => {
    // Определяем timezone из currencyMeta
    const meta = currencyMeta[currencyCode];
    const cityCode = meta?.crypto?.cityCode || currencyCode;
    const tz = currencyMeta[cityCode]?.capital?.timezone || 'UTC';

    function tick() {
      const t = getCurrentTime(tz);
      setTimeStr(t.currentTime);
      setDateStr(t.date);
      setUtcOffset(t.utcOffset);
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [currencyCode]);

  if (isLoading) {
    return (
      <div className="info-card neon-card">
        <div className="skeleton w-full h-32 rounded-xl" />
      </div>
    );
  }

  const offsetSign = utcOffset >= 0 ? '+' : '';
  const offsetString = `${offsetSign}${utcOffset}`;

  const isCrypto = CRYPTO_CODES.has(currencyCode);
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode];
  const fiatFlag = CURRENCY_FLAG_EMOJI[currencyCode] || '🏳️';
  const cryptoIcon = CURRENCY_FLAG_EMOJI[currencyCode] || '🪙';
  const flagUrl = countryCode ? `https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/1x1/${countryCode}.svg` : '';

  const displayName = lang === 'en' ? cityNameEn : cityName;

  return (
    <div className="info-card neon-card" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        {isCrypto ? (
          <div style={{
            width: '48px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
            borderRadius: '4px', flexShrink: 0,
          }}>
            {cryptoIcon}
          </div>
        ) : flagUrl ? (
          <img
            src={flagUrl}
            alt={displayName}
            width="48" height="32"
            style={{ borderRadius: '4px', flexShrink: 0 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentNode?.querySelector('.flag-fallback')?.remove();
              const span = document.createElement('span');
              span.className = 'flag-fallback';
              span.textContent = fiatFlag;
              span.style.fontSize = '32px';
              target.parentNode?.insertBefore(span, target);
            }}
          />
        ) : (
          <span style={{ fontSize: '32px' }}>{fiatFlag}</span>
        )}
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{displayName}</div>
          {isCrypto && (
            <div style={{ fontSize: '12px', color: '#818cf8' }}>{currencyCode}</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '28px' }}>{weather!.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{weather!.temperature}°C</span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{weather!.description}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            💨 {weather!.windSpeed} {lang === 'en' ? 'km/h' : 'км/ч'}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '8px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px' }}>🕐</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
            {timeStr}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{dateStr}</div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#818cf8' }}>UTC{offsetString}</div>
        </div>
      </div>
    </div>
  );
}
