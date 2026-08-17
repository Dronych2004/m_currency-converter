import { useLanguage } from '../i18n/LanguageContext'
import type { FavoritePair } from '../hooks/useFavorites'

interface FavoritesCardProps {
  favorites: FavoritePair[]
  onSelect: (fromCode: string, toCode: string) => void
  onRemove: (fromCode: string, toCode: string) => void
}

export function FavoritesCard({ favorites, onSelect, onRemove }: FavoritesCardProps) {
  const { t } = useLanguage()

  if (favorites.length === 0) {
    return null
  }

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⭐</span>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          {t('favorites')}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {favorites.map(fav => (
          <div
            key={`${fav.fromCode}-${fav.toCode}`}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all"
          >
            <button
              onClick={() => onSelect(fav.fromCode, fav.toCode)}
              className="flex items-center gap-1.5"
            >
              <span className="text-sm">{fav.fromFlag}</span>
              <span className="text-xs font-medium text-slate-300">{fav.fromCode}/{fav.toCode}</span>
              <span className="text-sm">{fav.toFlag}</span>
            </button>
            <button
              onClick={() => onRemove(fav.fromCode, fav.toCode)}
              className="opacity-0 group-hover:opacity-100 ml-1 text-slate-500 hover:text-red-400 transition-all text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
