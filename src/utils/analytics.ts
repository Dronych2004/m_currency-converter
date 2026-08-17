/**
 * Отслеживание целей в Яндекс.Метрике
 *
 * Цели настраиваются в кабинете Метрики:
 * https://metrika.yandex.ru/111108791/settings/goals
 */

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

const METRIKA_ID = 111108791

function sendGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(METRIKA_ID, 'reachGoal', goal, params)
  }
}

/** Пользователь получил результат конвертации */
export function trackConversion(from: string, to: string, amount: number, result: number) {
  sendGoal('conversion', { from, to, amount, result })
}

/** Пользователь нажал кнопку обмена валют */
export function trackSwap(from: string, to: string) {
  sendGoal('swap', { from, to })
}

/** Пользователь выбрал валюту */
export function trackSelectCurrency(code: string, position: 'from' | 'to') {
  sendGoal('select_currency', { code, position })
}

/** Пользователь сменил язык */
export function trackLanguageChange(lang: string) {
  sendGoal('language_change', { lang })
}

/** Пользователь перешёл на SEO-страницу */
export function trackSeoPageVisit(pair: string) {
  sendGoal('seo_page_visit', { pair })
}

/** Пользователь добавил пару в избранное */
export function trackAddFavorite(from: string, to: string) {
  sendGoal('add_favorite', { from, to })
}

/** Пользователь удалил пару из избранного */
export function trackRemoveFavorite(from: string, to: string) {
  sendGoal('remove_favorite', { from, to })
}

/** Пользователь нажал на быструю пару валют */
export function trackQuickPair(from: string, to: string) {
  sendGoal('quick_pair', { from, to })
}
