// Дублирует логику генерации пар из src/utils/seoGenerator.ts
// для использования в prerender-скрипте (Node.js, без TypeScript)

const PRIORITY_FIAT = [
  'USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CNY', 'KZT', 'UAH', 'BYN',
  'TRY', 'EGP', 'GEL', 'AMD', 'AZN', 'KRW', 'INR', 'BRL', 'CAD',
  'AUD', 'CHF',
]

const PRIORITY_CRYPTO = [
  'BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'XRP', 'SOL', 'ADA',
  'DOGE', 'TRX', 'DOT', 'LINK', 'MATIC', 'LTC', 'UNI',
]

export function generateSeoRoutes() {
  const pairs = []
  const seen = new Set()

  const addPair = (from, to) => {
    if (from === to) return
    const key = `${from}-${to}`
    if (seen.has(key)) return
    seen.add(key)
    pairs.push([from, to])
  }

  // Fiat × Fiat: все комбинации топ-20
  for (const from of PRIORITY_FIAT) {
    for (const to of PRIORITY_FIAT) {
      addPair(from, to)
    }
  }

  // Crypto × Fiat: крипто против топ-5 фиатных
  const topFiat = PRIORITY_FIAT.slice(0, 5)
  for (const crypto of PRIORITY_CRYPTO) {
    for (const fiat of topFiat) {
      addPair(crypto, fiat)
    }
  }

  // Fiat × Crypto: фиат против топ-5 крипто
  const topCrypto = PRIORITY_CRYPTO.slice(0, 5)
  for (const fiat of PRIORITY_FIAT) {
    for (const crypto of topCrypto) {
      addPair(fiat, crypto)
    }
  }

  // Crypto × Crypto: топ-5 × все крипто
  for (const from of topCrypto) {
    for (const to of PRIORITY_CRYPTO) {
      addPair(from, to)
    }
  }

  return pairs.map(([from, to]) => `/${from.toLowerCase()}-${to.toLowerCase()}`)
}
