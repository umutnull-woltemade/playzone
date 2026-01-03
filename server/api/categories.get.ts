import { fetchGamePixGames, normalizeGamePixGame } from '~/server/utils/gamepix'

// Cache for categories derived from games
let cachedCategories: { slug: string; name: string; count: number; icon: string }[] = []
let cacheTimestamp = 0
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

// Map category names to icons
const categoryIcons: Record<string, string> = {
  action: 'ph:lightning-fill',
  puzzle: 'ph:puzzle-piece-fill',
  racing: 'ph:car-fill',
  sports: 'ph:soccer-ball-fill',
  strategy: 'ph:chess-fill',
  adventure: 'ph:compass-fill',
  shooting: 'ph:crosshair-fill',
  arcade: 'ph:game-controller-fill',
  board: 'ph:checkerboard-fill',
  card: 'ph:cards-fill',
  casual: 'ph:smiley-fill',
  educational: 'ph:graduation-cap-fill',
  girls: 'ph:heart-fill',
  kids: 'ph:baby-fill',
  multiplayer: 'ph:users-fill',
  io: 'ph:globe-fill',
  clicker: 'ph:cursor-click-fill',
  simulation: 'ph:buildings-fill',
  hypercasual: 'ph:sparkle-fill',
  default: 'ph:squares-four-fill',
}

export default defineEventHandler(async () => {
  const now = Date.now()

  if (cachedCategories.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    try {
      // Fetch games to derive categories
      const gpxGames = await fetchGamePixGames({
        order: 'q',
        limit: 100,
      })

      // Count games per category
      const categoryCount: Record<string, number> = {}

      gpxGames.forEach(game => {
        const category = game.category?.toLowerCase() || 'other'
        categoryCount[category] = (categoryCount[category] || 0) + 1

        // Also count sub-categories
        game.categories?.forEach(cat => {
          const catLower = cat.toLowerCase()
          if (catLower !== category) {
            categoryCount[catLower] = (categoryCount[catLower] || 0) + 1
          }
        })
      })

      // Convert to array and sort by count
      cachedCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          count,
          icon: categoryIcons[name.toLowerCase()] || categoryIcons.default,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20) // Top 20 categories

      cacheTimestamp = now
    } catch (error) {
      console.error('[Categories] Failed to fetch:', error)
    }
  }

  return {
    categories: cachedCategories,
  }
})
