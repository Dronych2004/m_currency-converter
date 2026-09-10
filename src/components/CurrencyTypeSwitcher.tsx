import { memo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CurrencyType } from '../types';

export type { CurrencyType };

interface CurrencyTypeSwitcherProps {
  value: CurrencyType;
  onChange: (type: CurrencyType) => void;
}

export const CurrencyTypeSwitcher = memo(function CurrencyTypeSwitcher({ value, onChange }: CurrencyTypeSwitcherProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-1.5 mb-3 md:mb-4">
      <div className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
        <div className="tooltip-wrapper">
          <button
            onClick={() => onChange('traditional')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              value === 'traditional'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('traditionalShort')}
          </button>
          <span className="tooltip-text">{t('traditionalHint')}</span>
        </div>
        <div className="tooltip-wrapper">
          <button
            onClick={() => onChange('crypto')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              value === 'crypto'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('cryptoShort')}
          </button>
          <span className="tooltip-text">{t('cryptoHint')}</span>
        </div>
      </div>
    </div>
  );
});
