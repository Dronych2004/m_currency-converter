import { useLanguage } from '../i18n/LanguageContext';
import type { CurrencyType } from '../types';

export type { CurrencyType };

interface CurrencyTypeSwitcherProps {
  value: CurrencyType;
  onChange: (type: CurrencyType) => void;
}

export function CurrencyTypeSwitcher({ value, onChange }: CurrencyTypeSwitcherProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <span className="text-base font-semibold text-slate-400 uppercase tracking-wide">
        {t('currencyType')}
      </span>
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
        <button
          onClick={() => onChange('traditional')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-base font-medium transition-all ${
            value === 'traditional'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('traditional')}
        </button>
        <button
          onClick={() => onChange('crypto')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-base font-medium transition-all ${
            value === 'crypto'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('crypto')}
        </button>
      </div>
      <span className="text-sm text-slate-300 text-center max-w-sm">
        {t('cryptoHint')}
      </span>
    </div>
  );
}
