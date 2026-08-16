import { memo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const LanguageSwitcher = memo(function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed top-8 right-8 z-50">
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
        <button
          onClick={() => setLang('ru')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all ${
            lang === 'ru'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/1x1/ru.svg"
            alt="RU"
            width="20"
            height="14"
            loading="lazy"
            decoding="async"
            style={{ borderRadius: '2px' }}
          />
          RU
        </button>
        <button
          onClick={() => setLang('en')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all ${
            lang === 'en'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/1x1/gb.svg"
            alt="EN"
            width="20"
            height="14"
            loading="lazy"
            decoding="async"
            style={{ borderRadius: '2px' }}
          />
          EN
        </button>
      </div>
    </div>
  );
});
