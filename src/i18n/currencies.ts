/**
 * Переэкспорт из централизованного словаря для обратной совместимости.
 * Данные живут в src/data/currencies.ts — правьте ТОЛЬКО там.
 */
import { currencies, getCurrencyName as _getCurrencyName, type CurrencyMeta } from '../data/currencies';

export type { CurrencyMeta };
export const currencyNames: Record<string, { ru: string; en: string }> = Object.fromEntries(
  Object.values(currencies).map(c => [c.code, c.name])
);

export function getCurrencyName(code: string, lang: 'ru' | 'en'): string {
  return _getCurrencyName(code, lang);
}
