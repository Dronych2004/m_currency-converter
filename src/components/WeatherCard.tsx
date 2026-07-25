/**
 * КАРТОЧКА ПОГОДЫ - ПРОДВИНУТЫЙ ДИЗАЙН
 */

import type { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData | null;
  cityName: string;
}

export function WeatherCard({ weather, cityName }: WeatherCardProps) {
  if (!weather) {
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
  
  return (
    <div className="info-card">
      {/* Иконка */}
      <div className="info-icon">
        <span>{weather.icon}</span>
      </div>
      
      {/* Информация */}
      <div className="flex-1">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          <span style={{ marginRight: '6px' }}>🌍</span>{cityName}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {weather.temperature}°C
          </span>
          <span className="text-sm text-slate-400">
            {weather.description}
          </span>
        </div>
      </div>
      
      {/* Ветер */}
      <div className="text-right">
        <div className="text-xs text-slate-500 mb-1">Ветер</div>
        <div className="text-sm font-medium text-slate-300">
          💨 {weather.windSpeed} км/ч
        </div>
      </div>
    </div>
  );
}
