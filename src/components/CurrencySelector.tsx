import { useState, useRef, useEffect, useMemo, memo } from 'react';
import type { Currency } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { CURRENCY_TO_COUNTRY, CURRENCY_FLAG_EMOJI } from '../data/currencies';

function FlagImage({ code, emoji }: { code: string; emoji: string }) {
  const countryCode = CURRENCY_TO_COUNTRY[code];

  // Используем openmoji как основной сервис (надёжнее)
  const flagUrl = countryCode
    ? `https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/1x1/${countryCode}.svg`
    : '';

  if (!flagUrl) {
    return <span style={{ fontSize: '24px' }}>{emoji}</span>;
  }

  return (
    <img
      src={flagUrl}
      alt={code}
      width="32"
      height="22"
      loading="lazy"
      decoding="async"
      style={{ borderRadius: '3px', flexShrink: 0 }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentNode;
        if (parent && !parent.querySelector('.flag-fallback')) {
          const span = document.createElement('span');
          span.className = 'flag-fallback';
          span.textContent = emoji;
          span.style.fontSize = '24px';
          parent.insertBefore(span, target);
        }
      }}
    />
  );
}

interface CurrencySelectorProps {
  currencies: Currency[];
  selected: Currency | null;
  onSelect: (currency: Currency) => void;
  label: string;
  id: string;
}

export const CurrencySelector = memo(function CurrencySelector({
  currencies,
  selected,
  onSelect,
  label,
  id,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;
    const searchLower = searchTerm.toLowerCase();
    return currencies.filter(currency =>
      currency.code.toLowerCase().includes(searchLower) ||
      currency.name.toLowerCase().includes(searchLower)
    );
  }, [currencies, searchTerm]);

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedEmoji = selected ? (CURRENCY_FLAG_EMOJI[selected.code] || '🏳️') : '';

  return (
    <div className="relative" ref={containerRef}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold mb-3 tracking-wide uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="currency-btn"
        style={{
          borderColor: isOpen ? 'var(--accent-1)' : undefined,
          boxShadow: isOpen ? '0 0 25px var(--accent-glow)' : undefined,
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selected ? (
          <>
            <FlagImage code={selected.code} emoji={selectedEmoji} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-3xl text-white">
                {selected.code}
              </div>
              <div className="text-lg text-slate-400">
                {selected.name}
              </div>
            </div>
            <div className="text-2xl font-light text-slate-300">
              {selected.symbol}
            </div>
          </>
        ) : (
          <span className="text-slate-400">{t('selectCurrency')}</span>
        )}

        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="dropdown absolute z-50 w-full mt-3"
          role="listbox"
        >
          <div className="p-3 border-b border-white/5">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              autoFocus
            />
          </div>

          <div className="max-h-72 overflow-y-auto">
            {filteredCurrencies.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                {t('currencyNotFound')}
              </div>
            ) : (
              filteredCurrencies.map((currency) => {
                const emoji = CURRENCY_FLAG_EMOJI[currency.code] || '🏳️';
                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleSelect(currency)}
                    className={`dropdown-item w-full ${selected?.code === currency.code ? 'selected' : ''}`}
                    role="option"
                    aria-selected={selected?.code === currency.code}
                  >
                    <FlagImage code={currency.code} emoji={emoji} />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-lg text-white">{currency.code}</div>
                      <div className="text-base text-slate-400">{currency.name}</div>
                    </div>
                    <span className="text-lg font-medium text-slate-300">{currency.symbol}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
});
