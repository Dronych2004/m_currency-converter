/**
 * ТИПЫ (TYPES) ДЛЯ ПРОЕКТА КОНВЕРТАЦИИ ВАЛЮТ
 * 
 * Здесь мы определяем "формы" данных, которые используем в приложении.
 * TypeScript помогает нам не ошибаться в коде - если где-то не хватает
 * поля или неправильный тип, редактор сразу покажет ошибку.
 */

// ============================================
// ТИПЫ ДЛЯ ВАЛЮТ
// ============================================

/**
 * Интерфейс для одной валюты в我们的 списке
 * Поля:
 * - code: код валюты (например, "USD", "EUR", "RUB")
 * - name: полное название (например, "Доллар США")
 * - flag: URL флага страны (используем эмодзи или API флагов)
 * - symbol: символ валюты ($, €, ₽)
 * - rate: текущий курс к базовой валюте (доллару)
 */
export interface Currency {
  code: string;        // Код валюты: "USD", "EUR", "RUB"
  name: string;        // Название: "Доллар США"
  flag: string;        // Эмодзи флага: "🇺🇸"
  symbol: string;      // Символ: "$"
  rate?: number;       // Курс к доллару (опционально, пока не загрузили)
}

/**
 * Ответ от API курсов валют
 * open.er-api.com возвращает данные в таком формате
 */
export interface ExchangeRateResponse {
  result: string;          // "success" или "error"
  documentation: string;   // Ссылка на документацию
  terms_of_use: string;    // Условия использования
  time_last_update_utc: string;  // Время последнего обновления
  time_next_update_utc: string;  // Время следующего обновления
  base_code: string;       // Базовая валюта (обычно "USD")
  target_code?: string;    // Целевая валюта (если запрашивали конкретную)
  rates: Record<string, number>;  // Объект с курсами: { "EUR": 0.85, "RUB": 73.5, ... }
}

// ============================================
// ТИПЫ ДЛЯ ПОГОДЫ
// ============================================

/**
 * Данные о погоде для столицы страны
 */
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  icon: string;
}

/**
 * Сырой ответ Open-Meteo API (current_weather)
 */
export interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

/** Runtime-guard: проверяет, что ответ Open-Meteo имеет нужную форму */
export function isOpenMeteoResponse(data: unknown): data is OpenMeteoResponse {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (!obj.current_weather || typeof obj.current_weather !== 'object') return false;
  const cw = obj.current_weather as Record<string, unknown>;
  return (
    typeof cw.temperature === 'number' &&
    typeof cw.windspeed === 'number' &&
    typeof cw.weathercode === 'number'
  );
}

// ============================================
// ТИПЫ ДЛЯ ЧАСОВОГО ПОЯСА
// ============================================

/**
 * Информация о часовом поясе и времени в столице
 */
export interface TimezoneData {
  timezone: string;         // Название часового пояса (например, "Europe/Moscow")
  currentTime: string;      // Текущее время (формат: "14:30:00")
  utcOffset: number;        // Смещение от UTC в часах (например, +3)
  date: string;             // Текущая дата (формат: "2024-01-15")
}

// ============================================
// ТИПЫ ДЛЯ СТРАНЫ
// ============================================

/**
 * Полная информация о стране для отображения
 * Включает валюту, погоду и время
 */
export interface CountryInfo {
  currency: Currency;       // Информация о валюте
  weather: WeatherData | null;  // Данные о погоде (null пока не загрузили)
  timezone: TimezoneData | null;  // Информация о времени (null пока не загрузили)
  capital: string;          // Название столицы
  coordinates: {            // Координаты столицы (для запроса погоды)
    latitude: number;
    longitude: number;
  };
}

// ============================================
// ТИПЫ ДЛЯ СОСТОЯНИЯ ПРИЛОЖЕНИЯ
// ============================================

/**
 * Состояние всего приложения
 * Это то, что хранится в useState в главном компоненте
 */
export interface AppState {
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  amount: string;
  convertedAmount: number | null;
  exchangeRate: number | null;
  currencies: Currency[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// ТИПЫ ДЛЯ ВЫБОРА ТИПА ВАЛЮТЫ
// ============================================

export type CurrencyType = 'traditional' | 'crypto';
