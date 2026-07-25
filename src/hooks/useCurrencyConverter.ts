import { useState, useEffect, useCallback } from 'react';
import type { Currency, WeatherData, TimezoneData } from '../types';
import { fetchCurrencies, convertCurrency, fetchWeather, getCurrentTime } from '../services/api';
import { fetchCryptoRates, getCryptoName, getCryptoSymbol, getCryptoIcon } from '../services/crypto';
import { capitalCities } from '../utils/flags';
import { useLanguage } from '../i18n/LanguageContext';
import type { CurrencyType } from '../components/CurrencyTypeSwitcher';

// Карта криптовалют к столицам (для погоды/времени)
const CRYPTO_TO_CITY: Record<string, string> = {
  BTC: 'US', ETH: 'US', USDT: 'US', USDC: 'US', BNB: 'SG',
  XRP: 'US', SOL: 'US', ADA: 'JP', DOGE: 'US', TRX: 'SG',
  DOT: 'US', LINK: 'US', MATIC: 'US', LTC: 'US', UNI: 'US',
};

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
  fromTimezone: TimezoneData | null;
  toTimezone: TimezoneData | null;
  currencyType: CurrencyType;
  setFromCurrency: (currency: Currency) => void;
  setToCurrency: (currency: Currency) => void;
  setAmount: (amount: string) => void;
  swapCurrencies: () => void;
  setCurrencyType: (type: CurrencyType) => void;
}

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
  const [fromTimezone, setFromTimezone] = useState<TimezoneData | null>(null);
  const [toTimezone, setToTimezone] = useState<TimezoneData | null>(null);
  const [currencyType, setCurrencyType] = useState<CurrencyType>('traditional');

  // Загрузка валют при смене типа или языка
  useEffect(() => {
    async function loadCurrencies() {
      try {
        setIsLoading(true);
        setError(null);

        let currenciesData: Currency[];

        if (currencyType === 'crypto') {
          // Загружаем криптовалюты + базовые fiat для конвертации
          const [cryptoData, fiatData] = await Promise.all([
            fetchCryptoRates(),
            fetchCurrencies(lang),
          ]);

          // Криптовалюты с переводами
          const translatedCrypto = cryptoData.map(c => ({
            ...c,
            name: getCryptoName(c.code, lang),
            symbol: getCryptoSymbol(c.code),
            flag: getCryptoIcon(c.code),
          }));

          // Все фиатные валюты
          currenciesData = [...translatedCrypto, ...fiatData];
        } else {
          currenciesData = await fetchCurrencies(lang);
        }

        setCurrencies(currenciesData);

        // Устанавливаем валюты по умолчанию
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

  // Конвертация
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

    async function convert() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await convertCurrency(
          fromCurrency!.code,
          toCurrency!.code,
          amountNumber
        );

        setConvertedAmount(result.result);
        setExchangeRate(result.rate);
      } catch (err) {
        setError(lang === 'ru' ? 'Ошибка конвертации. Попробуйте снова.' : 'Conversion error. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    convert();
  }, [fromCurrency, toCurrency, amount, lang]);

  // Погода
  useEffect(() => {
    async function loadWeather() {
      if (!fromCurrency || !toCurrency) return;

      const fromCityCode = CRYPTO_TO_CITY[fromCurrency.code] || fromCurrency.code;
      const toCityCode = CRYPTO_TO_CITY[toCurrency.code] || toCurrency.code;

      try {
        const [fromWeatherData, toWeatherData] = await Promise.all([
          fetchWeather(
            capitalCities[fromCityCode]?.lat || 0,
            capitalCities[fromCityCode]?.lon || 0
          ),
          fetchWeather(
            capitalCities[toCityCode]?.lat || 0,
            capitalCities[toCityCode]?.lon || 0
          ),
        ]);

        setFromWeather(fromWeatherData);
        setToWeather(toWeatherData);
      } catch (err) {
        console.error('Ошибка загрузки погоды:', err);
      }
    }

    loadWeather();
  }, [fromCurrency, toCurrency]);

  // Время
  useEffect(() => {
    function updateTime() {
      if (!fromCurrency || !toCurrency) return;

      const fromCityCode = CRYPTO_TO_CITY[fromCurrency.code] || fromCurrency.code;
      const toCityCode = CRYPTO_TO_CITY[toCurrency.code] || toCurrency.code;

      const fromTimezoneData = getCurrentTime(
        capitalCities[fromCityCode]?.timezone || 'UTC'
      );

      const toTimezoneData = getCurrentTime(
        capitalCities[toCityCode]?.timezone || 'UTC'
      );

      setFromTimezone(fromTimezoneData);
      setToTimezone(toTimezoneData);
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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
    fromTimezone,
    toTimezone,
    currencyType,
    setFromCurrency,
    setToCurrency,
    setAmount,
    swapCurrencies,
    setCurrencyType,
  };
}
