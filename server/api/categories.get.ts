import { getAllProviderGames } from '~/server/utils/providers'

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
  shooter: 'ph:crosshair-fill',
  shooting: 'ph:crosshair-fill',
  arcade: 'ph:game-controller-fill',
  board: 'ph:checkerboard-fill',
  card: 'ph:cards-fill',
  cards: 'ph:cards-fill',
  casual: 'ph:smiley-fill',
  educational: 'ph:graduation-cap-fill',
  girls: 'ph:heart-fill',
  kids: 'ph:baby-fill',
  junior: 'ph:baby-fill',
  multiplayer: 'ph:users-fill',
  io: 'ph:globe-fill',
  clicker: 'ph:cursor-click-fill',
  simulation: 'ph:buildings-fill',
  hypercasual: 'ph:sparkle-fill',
  classic: 'ph:clock-clockwise-fill',
  classics: 'ph:clock-clockwise-fill',
  retro: 'ph:clock-clockwise-fill',
  memory: 'ph:brain-fill',
  mahjong: 'ph:squares-four-fill',
  solitaire: 'ph:cards-fill',
  'bubble-shooter': 'ph:circles-three-fill',
  'match-3': 'ph:squares-four-fill',
  'hidden-object': 'ph:magnifying-glass-fill',
  default: 'ph:squares-four-fill',
}

// Normalize category names for consistency
function normalizeCategory(cat: string): string {
  const normalized = cat.toLowerCase().trim()
  const aliases: Record<string, string> = {
    'puzzles': 'puzzle',
    'shooting': 'shooter',
    'cards': 'card',
    'classics': 'classic',
    'bubble shooter': 'bubble-shooter',
    'match 3 games': 'match-3',
    'match 3': 'match-3',
    'hidden object games': 'hidden-object',
    'hidden object': 'hidden-object',
    'mahjong solitaire': 'mahjong',
    'solitaire games': 'solitaire',
    'card games': 'card',
    'board games': 'board',
    '2048 & merge': 'puzzle',
    'tile games': 'puzzle',
    'sorting games': 'puzzle',
    'connect 3': 'puzzle',
    'daily puzzles': 'puzzle',
  }
  return aliases[normalized] || normalized
}

export default defineEventHandler(async () => {
  const now = Date.now()

  if (cachedCategories.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    try {
      // Fetch games from ALL providers
      const allGames = await getAllProviderGames()
      console.log(`[Categories] Processing ${allGames.length} games from all providers`)

      // Count games per category
      const categoryCount: Record<string, number> = {}

      allGames.forEach(game => {
        const category = normalizeCategory(game.category || 'other')
        categoryCount[category] = (categoryCount[category] || 0) + 1

        // Also count sub-categories
        game.categories?.forEach(cat => {
          const catNormalized = normalizeCategory(cat)
          if (catNormalized !== category) {
            categoryCount[catNormalized] = (categoryCount[catNormalized] || 0) + 1
          }
        })
      })

      // Convert to array and sort by count
      cachedCategories = Object.entries(categoryCount)
        .filter(([name]) => name !== 'other' && name.length > 1)
        .map(([name, count]) => ({
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
          count,
          icon: categoryIcons[name.toLowerCase()] || categoryIcons.default,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 25) // Top 25 categories

      cacheTimestamp = now
      console.log(`[Categories] Found ${cachedCategories.length} categories`)
    } catch (error) {
      console.error('[Categories] Failed to fetch:', error)
    }
  }

  return {
    categories: cachedCategories,
  }
})
