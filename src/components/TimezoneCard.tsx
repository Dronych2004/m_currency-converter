/**
 * КАРТОЧКА ЧАСОВОГО ПОЯСА - ПРОДВИНУТЫЙ ДИЗАЙН
 */

import type { TimezoneData } from '../types';

interface TimezoneCardProps {
  timezone: TimezoneData | null;
  cityName: string;
  currencyCode: string;
}

export function TimezoneCard({ timezone, cityName }: TimezoneCardProps) {
  if (!timezone) {
    return (
      <div className="info-card">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    );
  }
  
  const offsetSign = timezone.utcOffset >= 0 ? '+' : '';
  const offsetString = `${offsetSign}${timezone.utcOffset}`;
  
  return (
    <div className="info-card">
      {/* Иконка часов */}
      <div className="info-icon">
        <span>🕐</span>
      </div>
      
      {/* Информация */}
      <div className="flex-1">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          <span style={{ marginRight: '6px' }}>🕐</span>{cityName}
        </div>
        <div className="text-2xl font-bold text-white font-mono tracking-wider">
          {timezone.currentTime}
        </div>
        <div className="text-sm text-slate-400 mt-1">
          {timezone.date}
        </div>
      </div>
      
      {/* Часовой пояс */}
      <div className="text-right">
        <div className="text-xs text-slate-500 mb-1">Часовой пояс</div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <span className="text-sm font-semibold text-indigo-400">
            UTC{offsetString}
          </span>
        </div>
      </div>
    </div>
  );
}
