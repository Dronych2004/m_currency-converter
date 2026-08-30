import { useLanguage } from '../i18n/LanguageContext'

export function PromoBanner() {
  const { t } = useLanguage()

  return (
    <div className="mt-6 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.65s', opacity: 0, animationFillMode: 'forwards' }}>
      <a
        href="https://calccenter.ru"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg4VjI4aDI4em0tMjgtNHYySDZ2LTJoNnptMjggMTZ2Mkg4VjQ0aDI4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative flex items-center justify-center gap-3 py-4 px-6">
          <span className="text-2xl">🧮</span>
          <span className="text-white font-semibold text-lg tracking-wide drop-shadow-lg">
            {t('promoBanner') || 'Центр калькуляторов'}
          </span>
          <svg
            className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
      </a>
    </div>
  )
}
