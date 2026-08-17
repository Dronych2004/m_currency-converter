import { useState, useCallback } from 'react'

export interface FavoritePair {
  fromCode: string
  toCode: string
  fromFlag: string
  toFlag: string
}

const FAVORITES_KEY = 'cc-favorites'
const MAX_FAVORITES = 10

function loadFavorites(): FavoritePair[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as FavoritePair[]
  } catch {
    return []
  }
}

function saveFavorites(favorites: FavoritePair[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch {
    // localStorage переполнен
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePair[]>(loadFavorites)

  const isFavorite = useCallback((fromCode: string, toCode: string) => {
    return favorites.some(f => f.fromCode === fromCode && f.toCode === toCode)
  }, [favorites])

  const toggleFavorite = useCallback((
    fromCode: string,
    toCode: string,
    fromFlag: string,
    toFlag: string
  ) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.fromCode === fromCode && f.toCode === toCode)

      let newFavorites: FavoritePair[]
      if (exists) {
        newFavorites = prev.filter(f => !(f.fromCode === fromCode && f.toCode === toCode))
      } else {
        if (prev.length >= MAX_FAVORITES) {
          newFavorites = [...prev.slice(0, MAX_FAVORITES - 1), { fromCode, toCode, fromFlag, toFlag }]
        } else {
          newFavorites = [...prev, { fromCode, toCode, fromFlag, toFlag }]
        }
      }

      saveFavorites(newFavorites)
      return newFavorites
    })
  }, [])

  const removeFavorite = useCallback((fromCode: string, toCode: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => !(f.fromCode === fromCode && f.toCode === toCode))
      saveFavorites(newFavorites)
      return newFavorites
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite, removeFavorite }
}
