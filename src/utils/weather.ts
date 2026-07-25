/**
 * УТИЛИТЫ ДЛЯ РАБОТЫ С КОДАМИ ПОГОДЫ
 * 
 * Open-Meteo API использует числовые коды для описания погоды.
 * Этот модуль преобразует коды в человекочитаемые описания и эмодзи.
 * 
 * Коды погоды Open-Meteo:
 * https://open-meteo.com/en/docs
 */

// Объект с описаниями погоды для каждого кода
// Ключ - числовой код, значение - объект с описанием и эмодзи
export const weatherDescriptions: Record<number, { description: string; icon: string }> = {
  // Ясная погода
  0: { description: 'Ясно', icon: '☀️' },
  1: { description: 'Преимущественно ясно', icon: '🌤️' },
  2: { description: 'Переменная облачность', icon: '⛅' },
  3: { description: 'Пасмурно', icon: '☁️' },
  
  // Туман
  45: { description: 'Туман', icon: '🌫️' },
  48: { description: 'Изморозь', icon: '🌫️' },
  
  // Морось
  51: { description: 'Лёгкая морось', icon: '🌦️' },
  53: { description: 'Умеренная морось', icon: '🌦️' },
  55: { description: 'Сильная морось', icon: '🌧️' },
  
  // Ледяная морось
  56: { description: 'Лёгкая ледяная морось', icon: '🌧️' },
  57: { description: 'Сильная ледяная морось', icon: '🌧️' },
  
  // Дождь
  61: { description: 'Слабый дождь', icon: '🌦️' },
  63: { description: 'Умеренный дождь', icon: '🌧️' },
  65: { description: 'Сильный дождь', icon: '🌧️' },
  
  // Ледяной дождь
  66: { description: 'Слабый ледяной дождь', icon: '🌧️' },
  67: { description: 'Сильный ледяной дождь', icon: '🌧️' },
  
  // Снег
  71: { description: 'Слабый снег', icon: '🌨️' },
  73: { description: 'Умеренный снег', icon: '🌨️' },
  75: { description: 'Сильный снег', icon: '❄️' },
  77: { description: 'Снежные зёрна', icon: '🌨️' },
  
  // Ливень
  80: { description: 'Слабый ливень', icon: '🌦️' },
  81: { description: 'Умеренный ливень', icon: '🌧️' },
  82: { description: 'Сильный ливень', icon: '🌧️' },
  
  // Снежный ливень
  85: { description: 'Слабый снежный ливень', icon: '🌨️' },
  86: { description: 'Сильный снежный ливень', icon: '❄️' },
  
  // Гроза
  95: { description: 'Гроза', icon: '⛈️' },
  96: { description: 'Гроза с градом', icon: '⛈️' },
  99: { description: 'Сильная гроза с градом', icon: '⛈️' },
};

/**
 * Получить описание погоды по коду
 * Если код не найден, возвращаем "Неизвестно"
 */
export function getWeatherDescription(code: number): { description: string; icon: string } {
  return weatherDescriptions[code] || { description: 'Неизвестно', icon: '❓' };
}

/**
 * Конвертер温度 из Кельвинов в Цельсии
 * Open-Meteo по умолчанию отдаёт температуру в Кельвинах
 */
export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

/**
 * Форматирование времени из ISO строки
 * Пример: "2024-01-15T14:30:00" → "14:30"
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Форматирование даты из ISO строки
 * Пример: "2024-01-15" → "15 января 2024"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
