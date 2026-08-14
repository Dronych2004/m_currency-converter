/**
 * ЦЕНТРАЛИЗОВАННЫЙ СЛОВАРЬ МЕТАДАННЫХ ВАЛЮТ
 *
 * Все данные о валютах в одном месте:
 * - Названия (ru, en)
 * - Символы ($, €, ₽)
 * - Флаги (эмодзи + код страны для CDN)
 * - Столицы (координаты, часовые пояса)
 * - Крипто-специфика (город привязки)
 *
 * При добавлении новой валюты достаточно править ТОЛЬКО ЭТОТ ФАЙЛ.
 */

// ============================================
// ТИПЫ
// ============================================

export interface CurrencyMeta {
  /** Код валюты: "USD", "BTC" */
  code: string;
  /** Название на ru и en */
  name: { ru: string; en: string };
  /** Символ валюты: "$", "€", "₿" */
  symbol: string;
  /** Эмодзи флага или иконка крипты */
  flag: string;
  /** Код страны для flag-icons CDN (только фиат) */
  countryCode: string;
  /** Столица / город привязки */
  capital: {
    name: string;
    nameEn: string;
    lat: number;
    lon: number;
    timezone: string;
  };
  /** Только для криптовалют — город для отображения погоды/часов */
  crypto?: {
    cityCode: string;
    cityRu: string;
    cityEn: string;
  };
}

// ============================================
// ФИАТНЫЕ ВАЛЮТЫ
// ============================================

const FIAT_CURRENCIES: Record<string, CurrencyMeta> = {
  USD: {
    code: 'USD',
    name: { ru: 'Доллар США', en: 'US Dollar' },
    symbol: '$',
    flag: '🇺🇸',
    countryCode: 'us',
    capital: { name: 'Вашингтон', nameEn: 'Washington', lat: 38.9072, lon: -77.0369, timezone: 'America/New_York' },
  },
  EUR: {
    code: 'EUR',
    name: { ru: 'Евро', en: 'Euro' },
    symbol: '€',
    flag: '🇪🇺',
    countryCode: 'eu',
    capital: { name: 'Брюссель', nameEn: 'Brussels', lat: 50.8503, lon: 4.3517, timezone: 'Europe/Brussels' },
  },
  GBP: {
    code: 'GBP',
    name: { ru: 'Фунт стерлингов', en: 'British Pound' },
    symbol: '£',
    flag: '🇬🇧',
    countryCode: 'gb',
    capital: { name: 'Лондон', nameEn: 'London', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  },
  JPY: {
    code: 'JPY',
    name: { ru: 'Японская иена', en: 'Japanese Yen' },
    symbol: '¥',
    flag: '🇯🇵',
    countryCode: 'jp',
    capital: { name: 'Токио', nameEn: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  },
  CNY: {
    code: 'CNY',
    name: { ru: 'Китайский юань', en: 'Chinese Yuan' },
    symbol: '¥',
    flag: '🇨🇳',
    countryCode: 'cn',
    capital: { name: 'Пекин', nameEn: 'Beijing', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
  },
  RUB: {
    code: 'RUB',
    name: { ru: 'Российский рубль', en: 'Russian Ruble' },
    symbol: '₽',
    flag: '🇷🇺',
    countryCode: 'ru',
    capital: { name: 'Москва', nameEn: 'Moscow', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
  },
  BYN: {
    code: 'BYN',
    name: { ru: 'Белорусский рубль', en: 'Belarusian Ruble' },
    symbol: 'Br',
    flag: '🇧🇾',
    countryCode: 'by',
    capital: { name: 'Минск', nameEn: 'Minsk', lat: 53.9045, lon: 27.5615, timezone: 'Europe/Minsk' },
  },
  UAH: {
    code: 'UAH',
    name: { ru: 'Украинская гривна', en: 'Ukrainian Hryvnia' },
    symbol: '₴',
    flag: '🇺🇦',
    countryCode: 'ua',
    capital: { name: 'Киев', nameEn: 'Kyiv', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
  },
  KZT: {
    code: 'KZT',
    name: { ru: 'Казахстанский тенге', en: 'Kazakhstani Tenge' },
    symbol: '₸',
    flag: '🇰🇿',
    countryCode: 'kz',
    capital: { name: 'Астана', nameEn: 'Astana', lat: 51.1694, lon: 71.4491, timezone: 'Asia/Almaty' },
  },
  GEL: {
    code: 'GEL',
    name: { ru: 'Грузинский лари', en: 'Georgian Lari' },
    symbol: '₾',
    flag: '🇬🇪',
    countryCode: 'ge',
    capital: { name: 'Тбилиси', nameEn: 'Tbilisi', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
  },
  AMD: {
    code: 'AMD',
    name: { ru: 'Армянский драм', en: 'Armenian Dram' },
    symbol: '֏',
    flag: '🇦🇲',
    countryCode: 'am',
    capital: { name: 'Ереван', nameEn: 'Yerevan', lat: 40.1792, lon: 44.4991, timezone: 'Asia/Yerevan' },
  },
  AZN: {
    code: 'AZN',
    name: { ru: 'Азербайджанский манат', en: 'Azerbaijani Manat' },
    symbol: '₼',
    flag: '🇦🇿',
    countryCode: 'az',
    capital: { name: 'Баку', nameEn: 'Baku', lat: 40.4093, lon: 49.8671, timezone: 'Asia/Baku' },
  },
  KRW: {
    code: 'KRW',
    name: { ru: 'Южнокорейская вона', en: 'South Korean Won' },
    symbol: '₩',
    flag: '🇰🇷',
    countryCode: 'kr',
    capital: { name: 'Сеул', nameEn: 'Seoul', lat: 37.5665, lon: 126.978, timezone: 'Asia/Seoul' },
  },
  INR: {
    code: 'INR',
    name: { ru: 'Индийская рупия', en: 'Indian Rupee' },
    symbol: '₹',
    flag: '🇮🇳',
    countryCode: 'in',
    capital: { name: 'Нью-Дели', nameEn: 'New Delhi', lat: 28.6139, lon: 77.209, timezone: 'Asia/Kolkata' },
  },
  BRL: {
    code: 'BRL',
    name: { ru: 'Бразильский реал', en: 'Brazilian Real' },
    symbol: 'R$',
    flag: '🇧🇷',
    countryCode: 'br',
    capital: { name: 'Бразилиа', nameEn: 'Brasilia', lat: -15.7975, lon: -47.8919, timezone: 'America/Sao_Paulo' },
  },
  CAD: {
    code: 'CAD',
    name: { ru: 'Канадский доллар', en: 'Canadian Dollar' },
    symbol: 'CA$',
    flag: '🇨🇦',
    countryCode: 'ca',
    capital: { name: 'Оттава', nameEn: 'Ottawa', lat: 45.4215, lon: -75.6972, timezone: 'America/Toronto' },
  },
  AUD: {
    code: 'AUD',
    name: { ru: 'Австралийский доллар', en: 'Australian Dollar' },
    symbol: 'A$',
    flag: '🇦🇺',
    countryCode: 'au',
    capital: { name: 'Канберра', nameEn: 'Canberra', lat: -35.2809, lon: 149.13, timezone: 'Australia/Sydney' },
  },
  CHF: {
    code: 'CHF',
    name: { ru: 'Швейцарский франк', en: 'Swiss Franc' },
    symbol: 'CHF',
    flag: '🇨🇭',
    countryCode: 'ch',
    capital: { name: 'Берн', nameEn: 'Bern', lat: 46.948, lon: 7.4474, timezone: 'Europe/Zurich' },
  },
  SEK: {
    code: 'SEK',
    name: { ru: 'Шведская крона', en: 'Swedish Krona' },
    symbol: 'kr',
    flag: '🇸🇪',
    countryCode: 'se',
    capital: { name: 'Стокгольм', nameEn: 'Stockholm', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm' },
  },
  NOK: {
    code: 'NOK',
    name: { ru: 'Норвежская крона', en: 'Norwegian Krone' },
    symbol: 'kr',
    flag: '🇳🇴',
    countryCode: 'no',
    capital: { name: 'Осло', nameEn: 'Oslo', lat: 59.9139, lon: 10.7522, timezone: 'Europe/Oslo' },
  },
  DKK: {
    code: 'DKK',
    name: { ru: 'Датская крона', en: 'Danish Krone' },
    symbol: 'kr',
    flag: '🇩🇰',
    countryCode: 'dk',
    capital: { name: 'Копенгаген', nameEn: 'Copenhagen', lat: 55.6761, lon: 12.5683, timezone: 'Europe/Copenhagen' },
  },
  PLN: {
    code: 'PLN',
    name: { ru: 'Польский злотый', en: 'Polish Zloty' },
    symbol: 'zł',
    flag: '🇵🇱',
    countryCode: 'pl',
    capital: { name: 'Варшава', nameEn: 'Warsaw', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
  },
  CZK: {
    code: 'CZK',
    name: { ru: 'Чешская крона', en: 'Czech Koruna' },
    symbol: 'Kč',
    flag: '🇨🇿',
    countryCode: 'cz',
    capital: { name: 'Прага', nameEn: 'Prague', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' },
  },
  HUF: {
    code: 'HUF',
    name: { ru: 'Венгерский форинт', en: 'Hungarian Forint' },
    symbol: 'Ft',
    flag: '🇭🇺',
    countryCode: 'hu',
    capital: { name: 'Будапешт', nameEn: 'Budapest', lat: 47.4979, lon: 19.0402, timezone: 'Europe/Budapest' },
  },
  RON: {
    code: 'RON',
    name: { ru: 'Румынский лей', en: 'Romanian Leu' },
    symbol: 'lei',
    flag: '🇷🇴',
    countryCode: 'ro',
    capital: { name: 'Бухарест', nameEn: 'Bucharest', lat: 44.4268, lon: 26.1025, timezone: 'Europe/Bucharest' },
  },
  BGN: {
    code: 'BGN',
    name: { ru: 'Болгарский лев', en: 'Bulgarian Lev' },
    symbol: 'лв',
    flag: '🇧🇬',
    countryCode: 'bg',
    capital: { name: 'София', nameEn: 'Sofia', lat: 42.6977, lon: 23.3219, timezone: 'Europe/Sofia' },
  },
  HRK: {
    code: 'HRK',
    name: { ru: 'Хорватская куна', en: 'Croatian Kuna' },
    symbol: 'kn',
    flag: '🇭🇷',
    countryCode: 'hr',
    capital: { name: 'Загреб', nameEn: 'Zagreb', lat: 45.815, lon: 15.9819, timezone: 'Europe/Zagreb' },
  },
  TRY: {
    code: 'TRY',
    name: { ru: 'Турецкая лира', en: 'Turkish Lira' },
    symbol: '₺',
    flag: '🇹🇷',
    countryCode: 'tr',
    capital: { name: 'Анкара', nameEn: 'Ankara', lat: 39.9334, lon: 32.8597, timezone: 'Europe/Istanbul' },
  },
  ILS: {
    code: 'ILS',
    name: { ru: 'Израильский шекель', en: 'Israeli Shekel' },
    symbol: '₪',
    flag: '🇮🇱',
    countryCode: 'il',
    capital: { name: 'Иерусалим', nameEn: 'Jerusalem', lat: 31.7683, lon: 35.2137, timezone: 'Asia/Jerusalem' },
  },
  AED: {
    code: 'AED',
    name: { ru: 'ОАЭ дирхам', en: 'UAE Dirham' },
    symbol: 'د.إ',
    flag: '🇦🇪',
    countryCode: 'ae',
    capital: { name: 'Абу-Даби', nameEn: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' },
  },
  SAR: {
    code: 'SAR',
    name: { ru: 'Саудовский риял', en: 'Saudi Riyal' },
    symbol: '﷼',
    flag: '🇸🇦',
    countryCode: 'sa',
    capital: { name: 'Эр-Рияд', nameEn: 'Riyadh', lat: 24.7136, lon: 46.6753, timezone: 'Asia/Riyadh' },
  },
  QAR: {
    code: 'QAR',
    name: { ru: 'Катарский риял', en: 'Qatari Riyal' },
    symbol: 'ر.ق',
    flag: '🇶🇦',
    countryCode: 'qa',
    capital: { name: 'Доха', nameEn: 'Doha', lat: 25.2854, lon: 51.531, timezone: 'Asia/Qatar' },
  },
  KWD: {
    code: 'KWD',
    name: { ru: 'Кувейтский динар', en: 'Kuwaiti Dinar' },
    symbol: 'د.ك',
    flag: '🇰🇼',
    countryCode: 'kw',
    capital: { name: 'Эль-Кувейт', nameEn: 'Kuwait City', lat: 29.3759, lon: 47.9774, timezone: 'Asia/Kuwait' },
  },
  BHD: {
    code: 'BHD',
    name: { ru: 'Бахрейнский динар', en: 'Bahraini Dinar' },
    symbol: 'د.ب',
    flag: '🇧🇭',
    countryCode: 'bh',
    capital: { name: 'Манама', nameEn: 'Manama', lat: 26.2285, lon: 50.586, timezone: 'Asia/Bahrain' },
  },
  OMR: {
    code: 'OMR',
    name: { ru: 'Оманский риял', en: 'Omani Rial' },
    symbol: 'ر.ع.',
    flag: '🇴🇲',
    countryCode: 'om',
    capital: { name: 'Маскат', nameEn: 'Muscat', lat: 23.588, lon: 58.3829, timezone: 'Asia/Muscat' },
  },
  JOD: {
    code: 'JOD',
    name: { ru: 'Иорданский динар', en: 'Jordanian Dinar' },
    symbol: 'د.ا',
    flag: '🇯🇴',
    countryCode: 'jo',
    capital: { name: 'Амман', nameEn: 'Amman', lat: 31.9454, lon: 35.9284, timezone: 'Asia/Amman' },
  },
  LBP: {
    code: 'LBP',
    name: { ru: 'Ливанский фунт', en: 'Lebanese Pound' },
    symbol: 'ل.ل',
    flag: '🇱🇧',
    countryCode: 'lb',
    capital: { name: 'Бейрут', nameEn: 'Beirut', lat: 33.8938, lon: 35.5018, timezone: 'Asia/Beirut' },
  },
  EGP: {
    code: 'EGP',
    name: { ru: 'Египетский фунт', en: 'Egyptian Pound' },
    symbol: 'E£',
    flag: '🇪🇬',
    countryCode: 'eg',
    capital: { name: 'Каир', nameEn: 'Cairo', lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
  },
  ZAR: {
    code: 'ZAR',
    name: { ru: 'Южноафриканский ранд', en: 'South African Rand' },
    symbol: 'R',
    flag: '🇿🇦',
    countryCode: 'za',
    capital: { name: 'Претория', nameEn: 'Pretoria', lat: -25.7479, lon: 28.2293, timezone: 'Africa/Johannesburg' },
  },
  NGN: {
    code: 'NGN',
    name: { ru: 'Нигерийская найра', en: 'Nigerian Naira' },
    symbol: '₦',
    flag: '🇳🇬',
    countryCode: 'ng',
    capital: { name: 'Абуджа', nameEn: 'Abuja', lat: 9.0579, lon: 7.4951, timezone: 'Africa/Lagos' },
  },
  KES: {
    code: 'KES',
    name: { ru: 'Кенийский шиллинг', en: 'Kenyan Shilling' },
    symbol: 'KSh',
    flag: '🇰🇪',
    countryCode: 'ke',
    capital: { name: 'Найроби', nameEn: 'Nairobi', lat: -1.2921, lon: 36.8219, timezone: 'Africa/Nairobi' },
  },
  GHS: {
    code: 'GHS',
    name: { ru: 'Ганский седи', en: 'Ghanaian Cedi' },
    symbol: 'GH₵',
    flag: '🇬🇭',
    countryCode: 'gh',
    capital: { name: 'Аккра', nameEn: 'Accra', lat: 5.6037, lon: -0.187, timezone: 'Africa/Accra' },
  },
  TZS: {
    code: 'TZS',
    name: { ru: 'Танзанийский шиллинг', en: 'Tanzanian Shilling' },
    symbol: 'TSh',
    flag: '🇹🇿',
    countryCode: 'tz',
    capital: { name: 'Додома', nameEn: 'Dodoma', lat: -6.163, lon: 35.7516, timezone: 'Africa/Dar_es_Salaam' },
  },
  UGX: {
    code: 'UGX',
    name: { ru: 'Угандийский шиллинг', en: 'Ugandan Shilling' },
    symbol: 'USh',
    flag: '🇺🇬',
    countryCode: 'ug',
    capital: { name: 'Кампала', nameEn: 'Kampala', lat: 0.3476, lon: 32.5825, timezone: 'Africa/Kampala' },
  },
  ETB: {
    code: 'ETB',
    name: { ru: 'Эфиопский быр', en: 'Ethiopian Birr' },
    symbol: 'Br',
    flag: '🇪🇹',
    countryCode: 'et',
    capital: { name: 'Аддис-Абеба', nameEn: 'Addis Ababa', lat: 9.025, lon: 38.7469, timezone: 'Africa/Addis_Ababa' },
  },
  MAD: {
    code: 'MAD',
    name: { ru: 'Марокканский дирхам', en: 'Moroccan Dirham' },
    symbol: 'د.م.',
    flag: '🇲🇦',
    countryCode: 'ma',
    capital: { name: 'Рабат', nameEn: 'Rabat', lat: 34.0209, lon: -6.8416, timezone: 'Africa/Casablanca' },
  },
  TND: {
    code: 'TND',
    name: { ru: 'Тунисский динар', en: 'Tunisian Dinar' },
    symbol: 'د.ت',
    flag: '🇹🇳',
    countryCode: 'tn',
    capital: { name: 'Тунис', nameEn: 'Tunis', lat: 36.8065, lon: 10.1815, timezone: 'Africa/Tunis' },
  },
  DZD: {
    code: 'DZD',
    name: { ru: 'Алжирский динар', en: 'Algerian Dinar' },
    symbol: 'د.ج',
    flag: '🇩🇿',
    countryCode: 'dz',
    capital: { name: 'Алжир', nameEn: 'Algiers', lat: 36.7538, lon: 3.0588, timezone: 'Africa/Algiers' },
  },
  LYD: {
    code: 'LYD',
    name: { ru: 'Ливийский динар', en: 'Libyan Dinar' },
    symbol: 'ل.د',
    flag: '🇱🇾',
    countryCode: 'ly',
    capital: { name: 'Триполи', nameEn: 'Tripoli', lat: 32.8872, lon: 13.1913, timezone: 'Africa/Tripoli' },
  },
  MMK: {
    code: 'MMK',
    name: { ru: 'Мьянманский кьят', en: 'Myanmar Kyat' },
    symbol: 'K',
    flag: '🇲🇲',
    countryCode: 'mm',
    capital: { name: 'Нейпьидо', nameEn: 'Naypyidaw', lat: 19.7633, lon: 96.0785, timezone: 'Asia/Yangon' },
  },
  THB: {
    code: 'THB',
    name: { ru: 'Тайский бат', en: 'Thai Baht' },
    symbol: '฿',
    flag: '🇹🇭',
    countryCode: 'th',
    capital: { name: 'Бангкок', nameEn: 'Bangkok', lat: 13.7563, lon: 100.5018, timezone: 'Asia/Bangkok' },
  },
  VND: {
    code: 'VND',
    name: { ru: 'Вьетнамский донг', en: 'Vietnamese Dong' },
    symbol: '₫',
    flag: '🇻🇳',
    countryCode: 'vn',
    capital: { name: 'Ханой', nameEn: 'Hanoi', lat: 21.0285, lon: 105.8542, timezone: 'Asia/Ho_Chi_Minh' },
  },
  MYR: {
    code: 'MYR',
    name: { ru: 'Малайзийский ринггит', en: 'Malaysian Ringgit' },
    symbol: 'RM',
    flag: '🇲🇾',
    countryCode: 'my',
    capital: { name: 'Куала-Лумпур', nameEn: 'Kuala Lumpur', lat: 3.139, lon: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  },
  SGD: {
    code: 'SGD',
    name: { ru: 'Сингапурский доллар', en: 'Singapore Dollar' },
    symbol: 'S$',
    flag: '🇸🇬',
    countryCode: 'sg',
    capital: { name: 'Сингапур', nameEn: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  },
  IDR: {
    code: 'IDR',
    name: { ru: 'Индонезийская рупия', en: 'Indonesian Rupiah' },
    symbol: 'Rp',
    flag: '🇮🇩',
    countryCode: 'id',
    capital: { name: 'Джакарта', nameEn: 'Jakarta', lat: -6.2088, lon: 106.8456, timezone: 'Asia/Jakarta' },
  },
  PHP: {
    code: 'PHP',
    name: { ru: 'Филиппинское песо', en: 'Philippine Peso' },
    symbol: '₱',
    flag: '🇵🇭',
    countryCode: 'ph',
    capital: { name: 'Манила', nameEn: 'Manila', lat: 14.5995, lon: 120.9842, timezone: 'Asia/Manila' },
  },
  PKR: {
    code: 'PKR',
    name: { ru: 'Пакистанская рупия', en: 'Pakistani Rupee' },
    symbol: '₨',
    flag: '🇵🇰',
    countryCode: 'pk',
    capital: { name: 'Исламабад', nameEn: 'Islamabad', lat: 33.6844, lon: 73.0479, timezone: 'Asia/Karachi' },
  },
  BDT: {
    code: 'BDT',
    name: { ru: 'Бангладешская така', en: 'Bangladeshi Taka' },
    symbol: '৳',
    flag: '🇧🇩',
    countryCode: 'bd',
    capital: { name: 'Дакка', nameEn: 'Dhaka', lat: 23.8103, lon: 90.4125, timezone: 'Asia/Dhaka' },
  },
  LKR: {
    code: 'LKR',
    name: { ru: 'Шри-ланкийская рупия', en: 'Sri Lankan Rupee' },
    symbol: 'Rs',
    flag: '🇱🇰',
    countryCode: 'lk',
    capital: { name: 'Шри-Джаяварденепура-Котте', nameEn: 'Sri Jayawardenepura Kotte', lat: 6.9271, lon: 79.8612, timezone: 'Asia/Colombo' },
  },
  NPR: {
    code: 'NPR',
    name: { ru: 'Непальская рупия', en: 'Nepalese Rupee' },
    symbol: 'Rs',
    flag: '🇳🇵',
    countryCode: 'np',
    capital: { name: 'Катманду', nameEn: 'Kathmandu', lat: 27.7172, lon: 85.324, timezone: 'Asia/Kathmandu' },
  },
  MVR: {
    code: 'MVR',
    name: { ru: 'Мальдивская руфия', en: 'Maldivian Rufiyaa' },
    symbol: 'Rf',
    flag: '🇲🇻',
    countryCode: 'mv',
    capital: { name: 'Мале', nameEn: 'Malé', lat: 4.1755, lon: 73.5093, timezone: 'Indian/Maldives' },
  },
  AFN: {
    code: 'AFN',
    name: { ru: 'Афганский афгани', en: 'Afghan Afghani' },
    symbol: '؋',
    flag: '🇦🇫',
    countryCode: 'af',
    capital: { name: 'Кабул', nameEn: 'Kabul', lat: 34.5553, lon: 69.2075, timezone: 'Asia/Kabul' },
  },
  IQD: {
    code: 'IQD',
    name: { ru: 'Иракский динар', en: 'Iraqi Dinar' },
    symbol: 'ع.د',
    flag: '🇮🇶',
    countryCode: 'iq',
    capital: { name: 'Багдад', nameEn: 'Baghdad', lat: 33.3152, lon: 44.3661, timezone: 'Asia/Baghdad' },
  },
  IRR: {
    code: 'IRR',
    name: { ru: 'Иранский риал', en: 'Iranian Rial' },
    symbol: '﷼',
    flag: '🇮🇷',
    countryCode: 'ir',
    capital: { name: 'Тегеран', nameEn: 'Tehran', lat: 35.6892, lon: 51.389, timezone: 'Asia/Tehran' },
  },
  SYP: {
    code: 'SYP',
    name: { ru: 'Сирийский фунт', en: 'Syrian Pound' },
    symbol: '£S',
    flag: '🇸🇾',
    countryCode: 'sy',
    capital: { name: 'Дамаск', nameEn: 'Damascus', lat: 33.5138, lon: 36.2765, timezone: 'Asia/Damascus' },
  },
  YER: {
    code: 'YER',
    name: { ru: 'Йеменский риал', en: 'Yemeni Rial' },
    symbol: '﷼',
    flag: '🇾🇪',
    countryCode: 'ye',
    capital: { name: 'Сана', nameEn: 'Sana', lat: 15.3694, lon: 44.191, timezone: 'Asia/Aden' },
  },
};

// ============================================
// КРИПТОВАЛЮТЫ
// ============================================

const CRYPTO_CURRENCIES: Record<string, CurrencyMeta> = {
  BTC: {
    code: 'BTC',
    name: { ru: 'Биткоин', en: 'Bitcoin' },
    symbol: '₿',
    flag: '₿',
    countryCode: '',
    capital: { name: 'Сатоши-Сити', nameEn: 'Satoshi City', lat: 38.9072, lon: -77.0369, timezone: 'America/New_York' },
    crypto: { cityCode: 'USD', cityRu: 'Сатоши-Сити', cityEn: 'Satoshi City' },
  },
  ETH: {
    code: 'ETH',
    name: { ru: 'Эфириум', en: 'Ethereum' },
    symbol: 'Ξ',
    flag: 'Ξ',
    countryCode: '',
    capital: { name: 'Сан-Франциско', nameEn: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Сан-Франциско', cityEn: 'San Francisco' },
  },
  USDT: {
    code: 'USDT',
    name: { ru: 'Тетер', en: 'Tether' },
    symbol: '₮',
    flag: '₮',
    countryCode: '',
    capital: { name: 'Пало-Альто', nameEn: 'Palo Alto', lat: 37.4419, lon: -122.143, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Пало-Альто', cityEn: 'Palo Alto' },
  },
  USDC: {
    code: 'USDC',
    name: { ru: 'USD Коин', en: 'USD Coin' },
    symbol: '$',
    flag: '$',
    countryCode: '',
    capital: { name: 'Бостон', nameEn: 'Boston', lat: 42.3601, lon: -71.0589, timezone: 'America/New_York' },
    crypto: { cityCode: 'USD', cityRu: 'Бостон', cityEn: 'Boston' },
  },
  BNB: {
    code: 'BNB',
    name: { ru: 'Бинанскоин', en: 'BNB' },
    symbol: 'BNB',
    flag: '◆',
    countryCode: '',
    capital: { name: 'Сингапур', nameEn: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
    crypto: { cityCode: 'SGD', cityRu: 'Сингапур', cityEn: 'Singapore' },
  },
  XRP: {
    code: 'XRP',
    name: { ru: 'Рипл', en: 'XRP' },
    symbol: 'XRP',
    flag: '✕',
    countryCode: '',
    capital: { name: 'Сан-Франциско', nameEn: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Сан-Франциско', cityEn: 'San Francisco' },
  },
  SOL: {
    code: 'SOL',
    name: { ru: 'Солана', en: 'Solana' },
    symbol: 'SOL',
    flag: '◎',
    countryCode: '',
    capital: { name: 'Сан-Франциско', nameEn: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Сан-Франциско', cityEn: 'San Francisco' },
  },
  ADA: {
    code: 'ADA',
    name: { ru: 'Кардано', en: 'Cardano' },
    symbol: 'ADA',
    flag: '◇',
    countryCode: '',
    capital: { name: 'Токио', nameEn: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
    crypto: { cityCode: 'JPY', cityRu: 'Токио', cityEn: 'Tokyo' },
  },
  DOGE: {
    code: 'DOGE',
    name: { ru: 'Догикоин', en: 'Dogecoin' },
    symbol: 'Ð',
    flag: 'Ð',
    countryCode: '',
    capital: { name: 'Пало-Альто', nameEn: 'Palo Alto', lat: 37.4419, lon: -122.143, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Пало-Альто', cityEn: 'Palo Alto' },
  },
  TRX: {
    code: 'TRX',
    name: { ru: 'Трон', en: 'TRON' },
    symbol: 'TRX',
    flag: '▶',
    countryCode: '',
    capital: { name: 'Сингапур', nameEn: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
    crypto: { cityCode: 'SGD', cityRu: 'Сингапур', cityEn: 'Singapore' },
  },
  DOT: {
    code: 'DOT',
    name: { ru: 'Полкадот', en: 'Polkadot' },
    symbol: 'DOT',
    flag: '●',
    countryCode: '',
    capital: { name: 'Берлин', nameEn: 'Berlin', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
    crypto: { cityCode: 'USD', cityRu: 'Берлин', cityEn: 'Berlin' },
  },
  LINK: {
    code: 'LINK',
    name: { ru: 'Чейнлинк', en: 'Chainlink' },
    symbol: 'LINK',
    flag: '⬡',
    countryCode: '',
    capital: { name: 'Нью-Йорк', nameEn: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
    crypto: { cityCode: 'USD', cityRu: 'Нью-Йорк', cityEn: 'New York' },
  },
  MATIC: {
    code: 'MATIC',
    name: { ru: 'Полигон', en: 'Polygon' },
    symbol: 'MATIC',
    flag: '⬡',
    countryCode: '',
    capital: { name: 'Сан-Франциско', nameEn: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Сан-Франциско', cityEn: 'San Francisco' },
  },
  LTC: {
    code: 'LTC',
    name: { ru: 'Лайткоин', en: 'Litecoin' },
    symbol: 'Ł',
    flag: 'Ł',
    countryCode: '',
    capital: { name: 'Сан-Франциско', nameEn: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' },
    crypto: { cityCode: 'USD', cityRu: 'Сан-Франциско', cityEn: 'San Francisco' },
  },
  UNI: {
    code: 'UNI',
    name: { ru: 'Юнисвап', en: 'Uniswap' },
    symbol: 'UNI',
    flag: '🦄',
    countryCode: '',
    capital: { name: 'Нью-Йорк', nameEn: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
    crypto: { cityCode: 'USD', cityRu: 'Нью-Йорк', cityEn: 'New York' },
  },
};

// ============================================
// ОБЪЕДИНЁННЫЙ СЛОВАРЬ
// ============================================

export const currencies: Record<string, CurrencyMeta> = {
  ...FIAT_CURRENCIES,
  ...CRYPTO_CURRENCIES,
};

// ============================================
// УДОБНЫЕ СПРАВОЧНИКИ (обратная совместимость)
// ============================================

/** Множество кодов фиатных валют */
export const FIAT_CODES = new Set(Object.keys(FIAT_CURRENCIES));

/** Множество кодов криптовалют */
export const CRYPTO_CODES = new Set(Object.keys(CRYPTO_CURRENCIES));

/** Коды страны по коду валюты (для flag-icons CDN) */
export const CURRENCY_TO_COUNTRY: Record<string, string> = Object.fromEntries(
  Object.values(FIAT_CURRENCIES).map(c => [c.code, c.countryCode])
);

/** Эмодзи-флаги для всех валют */
export const CURRENCY_FLAG_EMOJI: Record<string, string> = Object.fromEntries(
  Object.values(currencies).map(c => [c.code, c.flag])
);

/** Символы валют */
export const CURRENCY_SYMBOLS: Record<string, string> = Object.fromEntries(
  Object.values(currencies).map(c => [c.code, c.symbol])
);

/** Столицы (обратная совместимость с旧 flags.ts) */
export const capitalCities: Record<string, { name: string; nameEn: string; lat: number; lon: number; timezone: string }> = Object.fromEntries(
  Object.values(currencies).map(c => [c.code, c.capital])
);

// ============================================
// ХЕЛПЕРЫ
// ============================================

export function getCurrencyMeta(code: string): CurrencyMeta | undefined {
  return currencies[code];
}

export function getCurrencyName(code: string, lang: 'ru' | 'en'): string {
  return currencies[code]?.name[lang] ?? code;
}

export function getCurrencySymbol(code: string): string {
  return currencies[code]?.symbol ?? code;
}

export function getFlagByCurrencyCode(code: string): string {
  return currencies[code]?.flag ?? '🌐';
}

export function getCountryCode(code: string): string {
  return currencies[code]?.countryCode ?? '';
}

export function isCrypto(code: string): boolean {
  return CRYPTO_CODES.has(code);
}

export function isFiat(code: string): boolean {
  return FIAT_CODES.has(code);
}
