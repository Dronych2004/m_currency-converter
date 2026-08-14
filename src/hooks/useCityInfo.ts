import { useMemo } from 'react';
import type { Currency } from '../types';
import { currencies as currencyMeta } from '../data/currencies';
import { useLanguage } from '../i18n/LanguageContext';

interface CityInfo {
  cityCode: string;
  cityName: string;
  cityNameEn: string;
  capital: { name: string; nameEn: string; lat: number; lon: number; timezone: string } | null;
}

export function useCityInfo(currency: Currency | null): CityInfo {
  const { lang } = useLanguage();

  return useMemo(() => {
    if (!currency) {
      const fallback = lang === 'ru' ? 'Город не определён' : 'City unavailable';
      return { cityCode: '', cityName: fallback, cityNameEn: fallback, capital: null };
    }

    const meta = currencyMeta[currency.code];
    const cityCode = meta?.crypto?.cityCode || currency.code;
    const capital = currencyMeta[cityCode]?.capital || null;

    const cityUnavailable = lang === 'ru' ? 'Город не определён' : 'City unavailable';
    const cityName = meta?.crypto?.cityRu || capital?.name || cityUnavailable;
    const cityNameEn = meta?.crypto?.cityEn || capital?.nameEn || cityUnavailable;

    return { cityCode, cityName, cityNameEn, capital };
  }, [currency, lang]);
}
