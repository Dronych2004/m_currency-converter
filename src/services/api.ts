/**
 * СЕРВИСЫ API ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ
 * 
 * Здесь мы封装 все запросы к внешним API.
 * Это удобно по нескольким причинам:
 * 1. Все запросы в одном месте - легко найти и изменить
 * 2. Легко заменить API на другое, если нужно
 * 3. Легко добавить обработку ошибок и кэширование
 * 
 * Используемые API:
 * - open.er-api.com - бесплатные курсы валют (без ключа!)
 * - open-meteo.com - бесплатные данные о погоде (без ключа!)
 */

import type { Currency, WeatherData, TimezoneData, ExchangeRateResponse } from '../types';
import { isOpenMeteoResponse } from '../types';
import { getFlagByCurrencyCode, capitalCities } from '../utils/flags';
import { getWeatherDescription, getMetNoWeatherInfo, getWttrWeatherInfo } from '../utils/weather';
import { createCache } from '../utils/cache';
import { getCurrencyName, getCurrencySymbol } from '../data/currencies';
import type { Lang } from '../i18n/translations';
import { fetchCryptoRates, cryptoCodes } from './crypto';

// Валюты, которые мы поддерживаем (есть в capitalCities)
const SUPPORTED_CURRENCIES = new Set(Object.keys(capitalCities));

// ============================================
// КОНСТАНТЫ
// ============================================

// Основной API курсов валют
const EXCHANGE_RATE_API_BASE = 'https://open.er-api.com/v6/latest';
// Резервный API (fallback при недоступности основного)
const EXCHANGE_RATE_FALLBACK_BASE = 'https://api.frankfurter.app/latest';

// API погоды
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
// Резервные провайдеры погоды (Open-Meteo может быть заблокирован в некоторых сетях)
const METNO_API_BASE = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
const WTTR_API_BASE = 'https://wttr.in';

// Таймаут одного запроса к API погоды — чтобы быстро переходить к резервному провайдеру
const WEATHER_TIMEOUT_MS = 8000;

/** fetch с таймаутом: при превышении времени запрос прерывается (AbortError) */
async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Запрос с fallback на резервный сервис */
async function fetchWithFallback(url: string, fallbackUrl: string): Promise<ExchangeRateResponse> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    console.warn('Основной API недоступен, пробуем резервный...');
    const fallbackResponse = await fetch(fallbackUrl);
    if (!fallbackResponse.ok) throw new Error(`Fallback API тоже недоступен: ${fallbackResponse.status}`);
    return await fallbackResponse.json();
  }
}

// ============================================
// СЕРВИС КУРСОВ ВАЛЮТ
// ============================================

/**
 * Получить список всех доступных валют с их курсами
 * 
 * Как это работает:
 * 1. Делаем GET запрос к API
 * 2. Получаем JSON с курсами
 * 3. Преобразуем данные в наш формат Currency[]
 * 4. Возвращаем список валют
 */
export async function fetchCurrencies(lang: Lang = 'ru'): Promise<Currency[]> {
  try {
    const data = await fetchWithFallback(
      `${EXCHANGE_RATE_API_BASE}/USD`,
      `${EXCHANGE_RATE_FALLBACK_BASE}?from=USD`
    );

    const currencies: Currency[] = Object.entries(data.rates)
      .filter(([code]) => SUPPORTED_CURRENCIES.has(code))
      .map(([code, rate]) => ({
        code,
        name: getCurrencyName(code, lang),
        flag: getFlagByCurrencyCode(code),
        symbol: getCurrencySymbol(code),
        rate,
      }));

    return currencies;
  } catch (error) {
    console.error('Ошибка при загрузке валют:', error);
    throw error;
  }
}

/**
 * Конвертировать валюту
 *
 * @param from - код исходной валюты (например, "USD")
 * @param to - код целевой валюты (например, "EUR")
 * @param amount - сумма для конвертации
 * @returns - сколько получим в целевой валюте
 */
export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<{ rate: number; result: number }> {
  try {
    // Если конвертируем в ту же валюту - возвращаем 1:1
    if (from === to) {
      return { rate: 1, result: amount };
    }

    const fromIsCrypto = cryptoCodes.has(from);
    const toIsCrypto = cryptoCodes.has(to);

    // Если обе валюты фиатные - используем существующий API
    if (!fromIsCrypto && !toIsCrypto) {
      const data = await fetchWithFallback(
        `${EXCHANGE_RATE_API_BASE}/${from}`,
        `${EXCHANGE_RATE_FALLBACK_BASE}?from=${from}`
      );
      const rate = data.rates[to];
      if (!rate) {
        throw new Error(`Валюта ${to} не найдена`);
      }
      return { rate, result: amount * rate };
    }

    // Если есть криптовалюта - используем CoinGecko
    const cryptoRates = await fetchCryptoRates();

    // Получаем цены в USD
    const fromRateUSD = fromIsCrypto
      ? (cryptoRates.find(c => c.code === from)?.rate || 0)
      : (await getFiatRateToUSD(from));

    const toRateUSD = toIsCrypto
      ? (cryptoRates.find(c => c.code === to)?.rate || 0)
      : (await getFiatRateToUSD(to));

    if (!fromRateUSD || !toRateUSD) {
      throw new Error('Не удалось получить курс');
    }

    // Конвертируем через USD
    // amount in from -> USD -> to
    const amountInUSD = amount * fromRateUSD;
    const result = amountInUSD / toRateUSD;
    const rate = result / amount;

    return { rate, result };
  } catch (error) {
    console.error('Ошибка конвертации:', error);
    throw error;
  }
}

// Кэш фиатных курсов к USD (обновляются раз в день, кэшируем на час)
const fiatRateCache = createCache<number>(60 * 60 * 1000);

// Получить стоимость 1 единицы фиатной валюты в USD
async function getFiatRateToUSD(code: string): Promise<number> {
  if (code === 'USD') return 1;

  const cacheKey = `fiat-usd-${code}`;
  const cached = fiatRateCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const data = await fetchWithFallback(
    `${EXCHANGE_RATE_API_BASE}/USD`,
    `${EXCHANGE_RATE_FALLBACK_BASE}?from=USD`
  );
  const unitsPerUSD = data.rates[code] || 0;
  const result = unitsPerUSD > 0 ? 1 / unitsPerUSD : 0;
  fiatRateCache.set(cacheKey, result);
  return result;
}

// ============================================
// СЕРВИС ПОГОДЫ
// ============================================

/**
 * Получить данные о погоде для столицы страны
 *
 * Используется цепочка провайдеров:
 * 1. Open-Meteo — основной
 * 2. MET Norway (api.met.no) — резервный
 * 3. wttr.in — последний шанс
 *
 * Если провайдер не ответил за WEATHER_TIMEOUT_MS или вернул ошибку —
 * автоматически пробуем следующего.
 *
 * @param latitude - широта столицы
 * @param longitude - долгота столицы
 * @returns - объект с данными о погоде
 */
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  // Проверяем координаты — не отправляем запрос в Атлантику
  if (!latitude && !longitude) {
    return {
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      weatherCode: -1,
      description: '',
      icon: '',
    };
  }

  const providers: ((lat: number, lon: number) => Promise<WeatherData>)[] = [
    fetchWeatherOpenMeteo,
    fetchWeatherMetNo,
    fetchWeatherWttr,
  ];

  let lastError: unknown = null;
  for (const provider of providers) {
    try {
      return await provider(latitude, longitude);
    } catch (error) {
      lastError = error;
      console.warn('Провайдер погоды недоступен, пробуем следующий...', error);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Все провайдеры погоды недоступны');
}

/**
 * Open-Meteo API:
 * https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current_weather=true
 */
async function fetchWeatherOpenMeteo(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  // Формируем URL с параметрами
  const url = new URL(WEATHER_API_BASE);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('current', 'relative_humidity_2m');
  url.searchParams.set('timezone', 'auto');

  const response = await fetchWithTimeout(url.toString(), WEATHER_TIMEOUT_MS);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!isOpenMeteoResponse(data)) {
    throw new Error('Неожиданный формат ответа Open-Meteo');
  }

  // Извлекаем данные о текущей погоде
  const currentWeather = data.current_weather;
  const current = data.current as { relative_humidity_2m?: number } | undefined;

  // Получаем описание погоды по коду
  const weatherInfo = getWeatherDescription(currentWeather.weathercode);

  return {
    temperature: currentWeather.temperature,
    humidity: current?.relative_humidity_2m ?? 0,
    windSpeed: currentWeather.windspeed,
    weatherCode: currentWeather.weathercode,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
  };
}

/**
 * MET Norway (api.met.no) — резервный провайдер погоды
 * https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=55.75&lon=37.62
 */
async function fetchWeatherMetNo(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = `${METNO_API_BASE}?lat=${latitude}&lon=${longitude}`;

  const response = await fetchWithTimeout(url, WEATHER_TIMEOUT_MS, {
    headers: { 'User-Agent': 'cconverter.ru/1.0 (info@cconverter.ru)' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const details = data?.properties?.timeseries?.[0]?.data?.instant?.details;
  if (typeof details?.air_temperature !== 'number') {
    throw new Error('Неожиданный формат ответа MET Norway');
  }

  // Символ погоды: ближайший час, иначе ближайшие 6 часов
  const timeseriesData = data.properties.timeseries[0].data;
  const symbolCode: string =
    timeseriesData?.next_1_hours?.summary?.symbol_code ??
    timeseriesData?.next_6_hours?.summary?.symbol_code ??
    '';

  const weatherInfo = getMetNoWeatherInfo(symbolCode);

  return {
    temperature: Math.round(details.air_temperature),
    humidity: Math.round(details.relative_humidity ?? 0),
    // MET Norway отдаёт ветер в м/с, мы показываем в км/ч
    windSpeed: Math.round((details.wind_speed ?? 0) * 3.6),
    weatherCode: -1,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
  };
}

/**
 * wttr.in — последний резервный провайдер погоды
 * https://wttr.in/55.75,37.62?format=j1
 */
async function fetchWeatherWttr(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = `${WTTR_API_BASE}/${latitude},${longitude}?format=j1`;

  const response = await fetchWithTimeout(url, WEATHER_TIMEOUT_MS);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const current = data?.current_condition?.[0];
  const temperature = Number(current?.temp_C);
  if (!current || Number.isNaN(temperature)) {
    throw new Error('Неожиданный формат ответа wttr.in');
  }

  const descEn: string = current.weatherDesc?.[0]?.value ?? '';
  const weatherInfo = getWttrWeatherInfo(descEn);

  return {
    temperature,
    humidity: Number(current.humidity) || 0,
    windSpeed: Number(current.windspeedKmph) || 0,
    weatherCode: Number(current.weatherCode) || -1,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
  };
}

// ============================================
// СЕРВИС ЧАСОВОГО ПОЯСА
// ============================================

/**
 * Получить текущее время для столицы страны
 * 
 * Мы используем JavaScript Intl API для получения времени
 * Это не требует внешнего API - всё работает на стороне клиента
 * 
 * @param timezone - название часового пояса (например, "Europe/Moscow")
 * @returns - объект с данными о времени
 */
export function getCurrentTime(timezone: string): TimezoneData {
  try {
    // Создаём объект Date для текущего момента
    const now = new Date();
    
    // Используем Intl.DateTimeFormat для получения времени в нужном часовом поясе
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,  // 24-часовой формат
    });
    
    const timeString = formatter.format(now);
    
    // Получаем дату
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    const dateString = dateFormatter.format(now);
    
    // Вычисляем смещение от UTC
    // Получаем время в UTC и в目标ном часовом поясе
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const utcOffset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    
    return {
      timezone,
      currentTime: timeString,
      utcOffset,
      date: dateString,
    };
  } catch (error) {
    console.error('Ошибка при получении времени:', error);
    // Возвращаем дефолтные данные в случае ошибки
    return {
      timezone,
      currentTime: '--:--:--',
      utcOffset: 0,
      date: '--.--.----',
    };
  }
}


