/**
 * УТИЛИТЫ ДЛЯ РАБОТЫ С ФЛАГАМИ СТРАН
 * 
 * Здесь мы храним информацию о флагах для каждой валюты.
 * Используем эмодзи флагов - они работают везде и не требуют загрузки картинок.
 * 
 * Формат эмодзи флага: две буквы кода страны в Unicode
 * Например: US = 🇺🇸, EU = 🇪🇺, RU = 🇷🇺
 */

// Объект с флагами для каждой валюты
// Ключ - код валюты, значение - эмодзи флага
export const currencyFlags: Record<string, string> = {
  USD: '🇺🇸',  // США
  EUR: '🇪🇺',  // Европейский союз
  GBP: '🇬🇧',  // Великобритания
  JPY: '🇯🇵',  // Япония
  CNY: '🇨🇳',  // Китай
  RUB: '🇷🇺',  // Россия
  BYN: '🇧🇾',  // Беларусь
  UAH: '🇺🇦',  // Украина
  KZT: '🇰🇿',  // Казахстан
  GEL: '🇬🇪',  // Грузия
  AMD: '🇦🇲',  // Армения
  AZN: '🇦🇿',  // Азербайджан
  KRW: '🇰🇷',  // Южная Корея
  INR: '🇮🇳',  // Индия
  BRL: '🇧🇷',  // Бразилия
  CAD: '🇨🇦',  // Канада
  AUD: '🇦🇺',  // Австралия
  CHF: '🇨🇭',  // Швейцария
  SEK: '🇸🇪',  // Швеция
  NOK: '🇳🇴',  // Норвегия
  DKK: '🇩🇰',  // Дания
  PLN: '🇵🇱',  // Польша
  CZK: '🇨🇿',  // Чехия
  HUF: '🇭🇺',  // Венгрия
  RON: '🇷🇴',  // Румыния
  BGN: '🇧🇬',  // Болгария
  HRK: '🇭🇷',  // Хорватия
  TRY: '🇹🇷',  // Турция
  ILS: '🇮🇱',  // Израиль
  AED: '🇦🇪',  // ОАЭ
  SAR: '🇸🇦',  // Саудовская Аравия
  QAR: '🇶🇦',  // Катар
  KWD: '🇰🇼',  // Кувейт
  BHD: '🇧🇭',  // Бахрейн
  OMR: '🇴🇲',  // Оман
  JOD: '🇯🇴',  // Иордания
  LBP: '🇱🇧',  // Ливан
  EGP: '🇪🇬',  // Египет
  ZAR: '🇿🇦',  // ЮАР
  NGN: '🇳🇬',  // Нигерия
  KES: '🇰🇪',  // Кения
  GHS: '🇬🇭',  // Гана
  TZS: '🇹🇿',  // Танзания
  UGX: '🇺🇬',  // Уганда
  ETB: '🇪🇹',  // Эфиопия
  MAD: '🇲🇦',  // Марокко
  TND: '🇹🇳',  // Тунис
  DZD: '🇩🇿',  // Алжир
  LYD: '🇱🇾',  // Ливия
  MMK: '🇲🇲',  // Мьянма
  THB: '🇹🇭',  // Таиланд
  VND: '🇻🇳',  // Вьетнам
  MYR: '🇲🇾',  // Малайзия
  SGD: '🇸🇬',  // Сингапур
  IDR: '🇮🇩',  // Индонезия
  PHP: '🇵🇭',  // Филиппины
  PKR: '🇵🇰',  // Пакистан
  BDT: '🇧🇩',  // Бангладеш
  LKR: '🇱🇰',  // Шри-Ланка
  NPR: '🇳🇵',  // Непал
  MVR: '🇲🇻',  // Мальдивы
  AFN: '🇦🇫',  // Афганистан
  IQD: '🇮🇶',  // Ирак
  IRR: '🇮🇷',  // Иран
  SYP: '🇸🇾',  // Сирия
  YER: '🇾🇪',  // Йемен
};

/**
 * Получить флаг по коду валюты
 * Если флаг не найден, возвращаем флаг globe (🌐)
 */
export function getFlagByCurrencyCode(code: string): string {
  return currencyFlags[code] || '🌐';
}

/**
 * Получить название столицы по коду валюты
 * Нужно для запроса погоды и отображения времени
 */
export const capitalCities: Record<string, { name: string; nameEn: string; lat: number; lon: number; timezone: string }> = {
  USD: { name: 'Вашингтон', nameEn: 'Washington', lat: 38.9072, lon: -77.0369, timezone: 'America/New_York' },
  EUR: { name: 'Брюссель', nameEn: 'Brussels', lat: 50.8503, lon: 4.3517, timezone: 'Europe/Brussels' },
  GBP: { name: 'Лондон', nameEn: 'London', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  JPY: { name: 'Токио', nameEn: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  CNY: { name: 'Пекин', nameEn: 'Beijing', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
  RUB: { name: 'Москва', nameEn: 'Moscow', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
  BYN: { name: 'Минск', nameEn: 'Minsk', lat: 53.9045, lon: 27.5615, timezone: 'Europe/Minsk' },
  UAH: { name: 'Киев', nameEn: 'Kyiv', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
  KZT: { name: 'Астана', nameEn: 'Astana', lat: 51.1694, lon: 71.4491, timezone: 'Asia/Almaty' },
  GEL: { name: 'Тбилиси', nameEn: 'Tbilisi', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
  AMD: { name: 'Ереван', nameEn: 'Yerevan', lat: 40.1792, lon: 44.4991, timezone: 'Asia/Yerevan' },
  AZN: { name: 'Баку', nameEn: 'Baku', lat: 40.4093, lon: 49.8671, timezone: 'Asia/Baku' },
  KRW: { name: 'Сеул', nameEn: 'Seoul', lat: 37.5665, lon: 126.978, timezone: 'Asia/Seoul' },
  INR: { name: 'Нью-Дели', nameEn: 'New Delhi', lat: 28.6139, lon: 77.209, timezone: 'Asia/Kolkata' },
  BRL: { name: 'Бразилиа', nameEn: 'Brasilia', lat: -15.7975, lon: -47.8919, timezone: 'America/Sao_Paulo' },
  CAD: { name: 'Оттава', nameEn: 'Ottawa', lat: 45.4215, lon: -75.6972, timezone: 'America/Toronto' },
  AUD: { name: 'Канберра', nameEn: 'Canberra', lat: -35.2809, lon: 149.13, timezone: 'Australia/Sydney' },
  CHF: { name: 'Берн', nameEn: 'Bern', lat: 46.948, lon: 7.4474, timezone: 'Europe/Zurich' },
  SEK: { name: 'Стокгольм', nameEn: 'Stockholm', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm' },
  NOK: { name: 'Осло', nameEn: 'Oslo', lat: 59.9139, lon: 10.7522, timezone: 'Europe/Oslo' },
  DKK: { name: 'Копенгаген', nameEn: 'Copenhagen', lat: 55.6761, lon: 12.5683, timezone: 'Europe/Copenhagen' },
  PLN: { name: 'Варшава', nameEn: 'Warsaw', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
  CZK: { name: 'Прага', nameEn: 'Prague', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' },
  HUF: { name: 'Будапешт', nameEn: 'Budapest', lat: 47.4979, lon: 19.0402, timezone: 'Europe/Budapest' },
  RON: { name: 'Бухарест', nameEn: 'Bucharest', lat: 44.4268, lon: 26.1025, timezone: 'Europe/Bucharest' },
  BGN: { name: 'София', nameEn: 'Sofia', lat: 42.6977, lon: 23.3219, timezone: 'Europe/Sofia' },
  HRK: { name: 'Загреб', nameEn: 'Zagreb', lat: 45.815, lon: 15.9819, timezone: 'Europe/Zagreb' },
  TRY: { name: 'Анкара', nameEn: 'Ankara', lat: 39.9334, lon: 32.8597, timezone: 'Europe/Istanbul' },
  ILS: { name: 'Иерусалим', nameEn: 'Jerusalem', lat: 31.7683, lon: 35.2137, timezone: 'Asia/Jerusalem' },
  AED: { name: 'Абу-Даби', nameEn: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' },
  SAR: { name: 'Эр-Рияд', nameEn: 'Riyadh', lat: 24.7136, lon: 46.6753, timezone: 'Asia/Riyadh' },
  QAR: { name: 'Доха', nameEn: 'Doha', lat: 25.2854, lon: 51.531, timezone: 'Asia/Qatar' },
  KWD: { name: 'Эль-Кувейт', nameEn: 'Kuwait City', lat: 29.3759, lon: 47.9774, timezone: 'Asia/Kuwait' },
  BHD: { name: 'Манама', nameEn: 'Manama', lat: 26.2285, lon: 50.586, timezone: 'Asia/Bahrain' },
  OMR: { name: 'Маскат', nameEn: 'Muscat', lat: 23.588, lon: 58.3829, timezone: 'Asia/Muscat' },
  JOD: { name: 'Амман', nameEn: 'Amman', lat: 31.9454, lon: 35.9284, timezone: 'Asia/Amman' },
  LBP: { name: 'Бейрут', nameEn: 'Beirut', lat: 33.8938, lon: 35.5018, timezone: 'Asia/Beirut' },
  EGP: { name: 'Каир', nameEn: 'Cairo', lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
  ZAR: { name: 'Претория', nameEn: 'Pretoria', lat: -25.7479, lon: 28.2293, timezone: 'Africa/Johannesburg' },
  NGN: { name: 'Абуджа', nameEn: 'Abuja', lat: 9.0579, lon: 7.4951, timezone: 'Africa/Lagos' },
  KES: { name: 'Найроби', nameEn: 'Nairobi', lat: -1.2921, lon: 36.8219, timezone: 'Africa/Nairobi' },
  GHS: { name: 'Аккра', nameEn: 'Accra', lat: 5.6037, lon: -0.187, timezone: 'Africa/Accra' },
  TZS: { name: 'Додома', nameEn: 'Dodoma', lat: -6.163, lon: 35.7516, timezone: 'Africa/Dar_es_Salaam' },
  UGX: { name: 'Кампала', nameEn: 'Kampala', lat: 0.3476, lon: 32.5825, timezone: 'Africa/Kampala' },
  ETB: { name: 'Аддис-Абеба', nameEn: 'Addis Ababa', lat: 9.025, lon: 38.7469, timezone: 'Africa/Addis_Ababa' },
  MAD: { name: 'Рабат', nameEn: 'Rabat', lat: 34.0209, lon: -6.8416, timezone: 'Africa/Casablanca' },
  TND: { name: 'Тунис', nameEn: 'Tunis', lat: 36.8065, lon: 10.1815, timezone: 'Africa/Tunis' },
  DZD: { name: 'Алжир', nameEn: 'Algiers', lat: 36.7538, lon: 3.0588, timezone: 'Africa/Algiers' },
  LYD: { name: 'Триполи', nameEn: 'Tripoli', lat: 32.8872, lon: 13.1913, timezone: 'Africa/Tripoli' },
  MMK: { name: 'Нейпьидо', nameEn: 'Naypyidaw', lat: 19.7633, lon: 96.0785, timezone: 'Asia/Yangon' },
  THB: { name: 'Бангкок', nameEn: 'Bangkok', lat: 13.7563, lon: 100.5018, timezone: 'Asia/Bangkok' },
  VND: { name: 'Ханой', nameEn: 'Hanoi', lat: 21.0285, lon: 105.8542, timezone: 'Asia/Ho_Chi_Minh' },
  MYR: { name: 'Куала-Лумпур', nameEn: 'Kuala Lumpur', lat: 3.139, lon: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  SGD: { name: 'Сингапур', nameEn: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  IDR: { name: 'Джакарта', nameEn: 'Jakarta', lat: -6.2088, lon: 106.8456, timezone: 'Asia/Jakarta' },
  PHP: { name: 'Манила', nameEn: 'Manila', lat: 14.5995, lon: 120.9842, timezone: 'Asia/Manila' },
  PKR: { name: 'Исламабад', nameEn: 'Islamabad', lat: 33.6844, lon: 73.0479, timezone: 'Asia/Karachi' },
  BDT: { name: 'Дакка', nameEn: 'Dhaka', lat: 23.8103, lon: 90.4125, timezone: 'Asia/Dhaka' },
  LKR: { name: 'Шри-Джаяварденепура-Котте', nameEn: 'Sri Jayawardenepura Kotte', lat: 6.9271, lon: 79.8612, timezone: 'Asia/Colombo' },
  NPR: { name: 'Катманду', nameEn: 'Kathmandu', lat: 27.7172, lon: 85.324, timezone: 'Asia/Kathmandu' },
  MVR: { name: 'Мале', nameEn: 'Malé', lat: 4.1755, lon: 73.5093, timezone: 'Indian/Maldives' },
  AFN: { name: 'Кабул', nameEn: 'Kabul', lat: 34.5553, lon: 69.2075, timezone: 'Asia/Kabul' },
  IQD: { name: 'Багдад', nameEn: 'Baghdad', lat: 33.3152, lon: 44.3661, timezone: 'Asia/Baghdad' },
  IRR: { name: 'Тегеран', nameEn: 'Tehran', lat: 35.6892, lon: 51.389, timezone: 'Asia/Tehran' },
  SYP: { name: 'Дамаск', nameEn: 'Damascus', lat: 33.5138, lon: 36.2765, timezone: 'Asia/Damascus' },
  YER: { name: 'Сана', nameEn: 'Sana', lat: 15.3694, lon: 44.191, timezone: 'Asia/Aden' },
};
