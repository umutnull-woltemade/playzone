export interface Category {
  slug: string
  name: string
  icon: string
  count: number
}

const categories: Category[] = [
  { slug: 'action', name: 'Action', icon: 'ph:lightning-fill', count: 156 },
  { slug: 'puzzle', name: 'Puzzle', icon: 'ph:puzzle-piece-fill', count: 203 },
  { slug: 'racing', name: 'Racing', icon: 'ph:car-fill', count: 89 },
  { slug: 'sports', name: 'Sports', icon: 'ph:soccer-ball-fill', count: 67 },
  { slug: 'strategy', name: 'Strategy', icon: 'ph:chess-fill', count: 112 },
  { slug: 'adventure', name: 'Adventure', icon: 'ph:compass-fill', count: 95 },
  { slug: 'shooting', name: 'Shooting', icon: 'ph:crosshair-fill', count: 78 },
  { slug: 'multiplayer', name: 'Multiplayer', icon: 'ph:users-fill', count: 134 },
]

export function useCategories() {
  return {
    categories,
    getCategoryBySlug: (slug: string) => categories.find(c => c.slug === slug),
  }
}
