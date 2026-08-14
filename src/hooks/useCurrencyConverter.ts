import { useState, useEffect, useCallback, useRef } from 'react';
import type { Currency, WeatherData } from '../types';
import { fetchCurrencies, convertCurrency, fetchWeather } from '../services/api';
import { fetchCryptoRates, getCryptoName, getCryptoSymbol, getCryptoIcon } from '../services/crypto';
import { currencies as currencyMeta } from '../data/currencies';
import { createCache, createPersistentCache } from '../utils/cache';
import { useLanguage } from '../i18n/LanguageContext';
import type { CurrencyType } from '../types';

export interface UseCurrencyConverterReturn {
  currencies: Currency[];
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  amount: string;
  convertedAmount: number | null;
  exchangeRate: number | null;
  isLoading: boolean;
  error: string | null;
  fromWeather: WeatherData | null;
  toWeather: WeatherData | null;
  currencyType: CurrencyType;
  setFromCurrency: (currency: Currency) => void;
  setToCurrency: (currency: Currency) => void;
  setAmount: (amount: string) => void;
  swapCurrencies: () => void;
  setCurrencyType: (type: CurrencyType) => void;
}

// Кэш погоды на 10 минут (in-memory — погода часто меняется)
const weatherCache = createCache<WeatherData>(10 * 60 * 1000);
// Кэш курсов на 24 часа (persistent — курсы обновляются раз в день)
const rateCache = createPersistentCache<{ rate: number; result: number }>(24 * 60 * 60 * 1000, 'cc-rates');

export function useCurrencyConverter(): UseCurrencyConverterReturn {
  const { lang } = useLanguage();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);
  const [amount, setAmount] = useState<string>('1');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fromWeather, setFromWeather] = useState<WeatherData | null>(null);
  const [toWeather, setToWeather] = useState<WeatherData | null>(null);
  const [currencyType, setCurrencyType] = useState<CurrencyType>('traditional');

  // AbortController для отмены устаревших запросов конвертации
  const convertAbortRef = useRef<AbortController | null>(null);

  // Отслеживаем предыдущий currencyType чтобы понять: сброс при смене типа или обновление имён при смене языка
  const prevTypeRef = useRef(currencyType);

  // Загрузка валют при смене типа или языка
  useEffect(() => {
    async function loadCurrencies() {
      try {
        setIsLoading(true);
        setError(null);

        // Сбрасываем выбор ТОЛЬКО при смене типа (traditional ↔ crypto)
        const typeChanged = prevTypeRef.current !== currencyType;
        prevTypeRef.current = currencyType;

        let currenciesData: Currency[];

        if (currencyType === 'crypto') {
          const [cryptoData, fiatData] = await Promise.all([
            fetchCryptoRates(),
            fetchCurrencies(lang),
          ]);

          const translatedCrypto = cryptoData.map(c => ({
            ...c,
            name: getCryptoName(c.code, lang),
            symbol: getCryptoSymbol(c.code),
            flag: getCryptoIcon(c.code),
          }));

          currenciesData = [...translatedCrypto, ...fiatData];
        } else {
          currenciesData = await fetchCurrencies(lang);
        }

        setCurrencies(currenciesData);

        // Устанавливаем валюты по умолчанию ТОЛЬКО при первом загрузке или смене типа
        if (typeChanged || !fromCurrency || !toCurrency) {
          if (currencyType === 'crypto') {
            const btc = currenciesData.find(c => c.code === 'BTC');
            const usd = currenciesData.find(c => c.code === 'USD');
            if (btc) setFromCurrency(btc);
            if (usd) setToCurrency(usd);
          } else {
            const usd = currenciesData.find(c => c.code === 'USD');
            const eur = currenciesData.find(c => c.code === 'EUR');
            if (usd) setFromCurrency(usd);
            if (eur) setToCurrency(eur);
          }
        } else {
          // При смене языка — обновляем объекты fromCurrency/toCurrency новыми переводами
          setFromCurrency(prev => {
            if (!prev) return prev;
            return currenciesData.find(c => c.code === prev.code) || prev;
          });
          setToCurrency(prev => {
            if (!prev) return prev;
            return currenciesData.find(c => c.code === prev.code) || prev;
          });
        }
      } catch (err) {
        setError(lang === 'ru'
          ? 'Не удалось загрузить курсы валют. Проверьте подключение к интернету.'
          : 'Failed to load exchange rates. Check your internet connection.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrencies();
  }, [currencyType, lang]);

  // Конвертация с debounce 300ms и кэшированием
  useEffect(() => {
    if (!fromCurrency || !toCurrency || !amount) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber < 0) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    // Ключ кэша: пара + сумма
    const cacheKey = `${fromCurrency.code}:${toCurrency.code}:${amount}`;
    const cached = rateCache.get(cacheKey);
    if (cached) {
      setConvertedAmount(cached.result);
      setExchangeRate(cached.rate);
      return;
    }

    // Отменяем предыдущий запрос
    convertAbortRef.current?.abort();
    const controller = new AbortController();
    convertAbortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await convertCurrency(
          fromCurrency.code,
          toCurrency.code,
          amountNumber
        );

        if (!controller.signal.aborted) {
          rateCache.set(cacheKey, result);
          setConvertedAmount(result.result);
          setExchangeRate(result.rate);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(lang === 'ru' ? 'Ошибка конвертации. Попробуйте снова.' : 'Conversion error. Please try again.');
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [fromCurrency, toCurrency, amount, lang]);

  // Погода с кэшированием
  useEffect(() => {
    async function loadWeather() {
      if (!fromCurrency || !toCurrency) return;

      const fromMeta = currencyMeta[fromCurrency.code];
      const toMeta = currencyMeta[toCurrency.code];

      const fromCityCode = fromMeta?.crypto?.cityCode || fromCurrency.code;
      const toCityCode = toMeta?.crypto?.cityCode || toCurrency.code;

      const fromCapital = currencyMeta[fromCityCode]?.capital;
      const toCapital = currencyMeta[toCityCode]?.capital;

      const fromKey = `${fromCapital?.lat},${fromCapital?.lon}`;
      const toKey = `${toCapital?.lat},${toCapital?.lon}`;

      // Проверяем кэш
      const cachedFrom = weatherCache.get(fromKey);
      const cachedTo = weatherCache.get(toKey);

      if (cachedFrom) setFromWeather(cachedFrom);
      if (cachedTo) setToWeather(cachedTo);

      // Загружаем только то, чего нет в кэше
      const promises: Promise<WeatherData>[] = [];

      if (!cachedFrom && fromCapital) {
        promises.push(
          fetchWeather(fromCapital.lat, fromCapital.lon).then(data => {
            weatherCache.set(fromKey, data);
            return data;
          })
        );
      }
      if (!cachedTo && toCapital) {
        promises.push(
          fetchWeather(toCapital.lat, toCapital.lon).then(data => {
            weatherCache.set(toKey, data);
            return data;
          })
        );
      }

      if (promises.length === 0) return;

      try {
        const results = await Promise.all(promises);
        let idx = 0;
        if (!cachedFrom && fromCapital) {
          setFromWeather(results[idx++]);
        }
        if (!cachedTo && toCapital) {
          setToWeather(results[idx++]);
        }
      } catch (err) {
        console.error('Ошибка загрузки погоды:', err);
      }
    }

    loadWeather();
  }, [fromCurrency, toCurrency]);

  const swapCurrencies = useCallback(() => {
    const tempFrom = fromCurrency;
    const tempTo = toCurrency;
    setFromCurrency(tempTo);
    setToCurrency(tempFrom);
  }, [fromCurrency, toCurrency]);

  return {
    currencies,
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount,
    exchangeRate,
    isLoading,
    error,
    fromWeather,
    toWeather,
    currencyType,
    setFromCurrency,
    setToCurrency,
    setAmount,
    swapCurrencies,
    setCurrencyType,
  };
}
