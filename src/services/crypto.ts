import type { Currency } from '../types';
import type { Lang } from '../i18n/translations';
import { currencies, CRYPTO_CODES } from '../data/currencies';

export function getCryptoName(code: string, lang: Lang): string {
  return currencies[code]?.name[lang] ?? code;
}

export function getCryptoSymbol(code: string): string {
  return currencies[code]?.symbol ?? code;
}

export function getCryptoIcon(code: string): string {
  return currencies[code]?.flag ?? '🪙';
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

    const result: Currency[] = Object.entries(idToCode)
      .map(([id, code]): Currency | null => {
        const price = data[id]?.usd;
        if (!price) return null;
        const meta = currencies[code];
        return {
          code,
          name: meta?.name.en ?? code,
          flag: meta?.flag ?? '🪙',
          symbol: meta?.symbol ?? code,
          rate: price,
        };
      })
      .filter((c): c is Currency => c !== null);

    return result;
  } catch (error) {
    console.error('Ошибка при загрузке криптовалют:', error);
    throw error;
  }
}

/** Множество кодов криптовалют для проверки в api.ts */
export const cryptoCodes = CRYPTO_CODES;
