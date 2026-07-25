import { useLanguage } from '../i18n/LanguageContext';

interface StatsDisplayProps {
  visits: number;
  conversions: number;
}

export function StatsDisplay({ visits, conversions }: StatsDisplayProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-6 text-sm">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
        <span className="text-slate-400">{t('visits')}</span>
        <span className="font-semibold text-white">{visits}</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5">
        <span className="text-slate-400">{t('conversions')}</span>
        <span className="font-semibold text-white">{conversions}</span>
      </div>
    </div>
  );
}
