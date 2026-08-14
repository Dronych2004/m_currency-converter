/**
 * Переэкспорт из централизованного словаря для обратной совместимости.
 * Данные живут в src/data/currencies.ts — правьте ТОЛЬКО там.
 */
import {
  capitalCities as _capitalCities,
  getFlagByCurrencyCode as _getFlagByCurrencyCode,
  CURRENCY_TO_COUNTRY as _CURRENCY_TO_COUNTRY,
  CURRENCY_FLAG_EMOJI as _CURRENCY_FLAG_EMOJI,
} from '../data/currencies';

/** Обратная совместимость: currencyFlags[код] → эмодзи */
export const currencyFlags = _CURRENCY_FLAG_EMOJI;

/** Обратная совместимость: capitalCities[код] → { name, nameEn, lat, lon, timezone } */
export const capitalCities = _capitalCities;

export function getFlagByCurrencyCode(code: string): string {
  return _getFlagByCurrencyCode(code);
}
