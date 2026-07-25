import type { Currency } from '../types';
import type { Lang } from '../i18n/translations';

export const cryptoCurrencies: Record<string, { ru: string; en: string; symbol: string; icon: string }> = {
  BTC: { ru: 'Биткоин', en: 'Bitcoin', symbol: '₿', icon: '₿' },
  ETH: { ru: 'Эфириум', en: 'Ethereum', symbol: 'Ξ', icon: 'Ξ' },
  USDT: { ru: 'Тетер', en: 'Tether', symbol: '₮', icon: '₮' },
  USDC: { ru: 'USD Коин', en: 'USD Coin', symbol: '$', icon: '$' },
  BNB: { ru: 'Бинанскоин', en: 'BNB', symbol: 'BNB', icon: '◆' },
  XRP: { ru: 'Рипл', en: 'XRP', symbol: 'XRP', icon: '✕' },
  SOL: { ru: 'Солана', en: 'Solana', symbol: 'SOL', icon: '◎' },
  ADA: { ru: 'Кардано', en: 'Cardano', symbol: 'ADA', icon: '◇' },
  DOGE: { ru: 'Догикоин', en: 'Dogecoin', symbol: 'Ð', icon: 'Ð' },
  TRX: { ru: 'Трон', en: 'TRON', symbol: 'TRX', icon: '▶' },
  DOT: { ru: 'Полкадот', en: 'Polkadot', symbol: 'DOT', icon: '●' },
  LINK: { ru: 'Чейнлинк', en: 'Chainlink', symbol: 'LINK', icon: '⬡' },
  MATIC: { ru: 'Полигон', en: 'Polygon', symbol: 'MATIC', icon: '⬡' },
  LTC: { ru: 'Лайткоин', en: 'Litecoin', symbol: 'Ł', icon: 'Ł' },
  UNI: { ru: 'Юнисвап', en: 'Uniswap', symbol: 'UNI', icon: '🦄' },
};

export function getCryptoName(code: string, lang: Lang): string {
  const crypto = cryptoCurrencies[code];
  if (crypto) {
    return crypto[lang];
  }
  return code;
}

export function getCryptoSymbol(code: string): string {
  const crypto = cryptoCurrencies[code];
  if (crypto) {
    return crypto.symbol;
  }
  return code;
}

export function getCryptoIcon(code: string): string {
  const crypto = cryptoCurrencies[code];
  if (crypto) {
    return crypto.icon;
  }
  return '🪙';
}

// Получить курсы криптовалют к USD
export async function fetchCryptoRates(): Promise<Currency[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,ripple,solana,cardano,dogecoin,tron,polkadot,chainlink,matic-network,litecoin,uniswap&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const idToCode: Record<string, string> = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      tether: 'USDT',
      'usd-coin': 'USDC',
      binancecoin: 'BNB',
      ripple: 'XRP',
      solana: 'SOL',
      cardano: 'ADA',
      dogecoin: 'DOGE',
      tron: 'TRX',
      polkadot: 'DOT',
      chainlink: 'LINK',
      'matic-network': 'MATIC',
      litecoin: 'LTC',
      uniswap: 'UNI',
    };

    const currencies: Currency[] = Object.entries(idToCode)
      .map(([id, code]): Currency | null => {
        const price = data[id]?.usd;
        if (!price) return null;
        return {
          code,
          name: getCryptoName(code, 'en'),
          flag: getCryptoIcon(code),
          symbol: getCryptoSymbol(code),
          rate: price,
        };
      })
      .filter((c): c is Currency => c !== null);

    return currencies;
  } catch (error) {
    console.error('Ошибка при загрузке криптовалют:', error);
    throw error;
  }
}
