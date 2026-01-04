import type { GameMonetizeGame } from '~/types/provider'

/**
 * GameMonetize Configuration
 */
export const GAMEMONETIZE_CONFIG = {
  baseUrl: 'https://rss.gamemonetize.com/rssfeed.php',
  defaultParams: {
    format: 'json',
    type: '0', // 0 = HTML5 games
    company: 'All',
  },
}

/**
 * Fetch games from GameMonetize API
 */
export async function fetchGameMonetizeGames(options: {
  category?: string
  amount?: number
} = {}): Promise<GameMonetizeGame[]> {
  const { category = 'All', amount = 500 } = options

  const params = new URLSearchParams({
    ...GAMEMONETIZE_CONFIG.defaultParams,
    category,
    amount: String(amount),
  })

  const url = `${GAMEMONETIZE_CONFIG.baseUrl}?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlayZone/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`GameMonetize API error: ${response.status}`)
    }

    const data = await response.json()

    // API returns array directly
    const games: GameMonetizeGame[] = Array.isArray(data) ? data : []

    return games
  } catch (error) {
    console.error('Failed to fetch GameMonetize games:', error)
    return []
  }
}

/**
 * Create URL-friendly slug from title
 */
function createSlug(title: string, id: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return `${baseSlug}-gm${id}`
}

/**
 * Normalize category name
 */
function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'Puzzles': 'Puzzle',
    'Hypercasual': 'Casual',
    'Girls': 'Casual',
    'Clicker': 'Casual',
    'Multiplayer': 'Multiplayer',
    'Action': 'Action',
    'Adventure': 'Adventure',
    'Arcade': 'Arcade',
    'Shooting': 'Shooter',
    'Racing': 'Racing',
    'Sports': 'Sports',
    'Strategy': 'Strategy',
    'Simulation': 'Simulation',
  }

  return categoryMap[category] || category
}

/**
 * Parse tags from comma-separated string
 */
function parseTags(tagsString: string): string[] {
  if (!tagsString) return []

  return tagsString
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length < 30)
    .slice(0, 8)
}

/**
 * Normalize GameMonetize game data to unified format
 */
export function normalizeGameMonetizeGame(game: GameMonetizeGame, index: number) {
  const width = parseInt(game.width) || 800
  const height = parseInt(game.height) || 600
  const orientation = width > height ? 'landscape' : 'portrait'

  // Determine flags based on position
  const isHot = index < 30
  const isFeatured = index < 10
  const isNew = false

  // Estimate plays based on position (higher ranked = more plays)
  const estimatedPlays = Math.max(10000, 500000 - index * 1000)

  // Calculate rating (4.0 - 4.8 range based on position)
  const rating = Math.min(4.8, Math.max(4.0, 4.5 - index * 0.005))

  return {
    id: `gm-${game.id}`,
    slug: createSlug(game.title, game.id),
    title: game.title,
    description: game.description || `Play ${game.title} online for free!`,
    thumbnail: game.thumb,
    category: normalizeCategory(game.category),
    categories: [normalizeCategory(game.category)],
    tags: parseTags(game.tags),
    plays: estimatedPlays,
    rating: Math.round(rating * 10) / 10,
    isNew,
    isHot,
    isFeatured,
    embedUrl: game.url,
    provider: 'gamemonetize' as const,
    isActive: true,
    width,
    height,
    orientation,
    responsive: true,
    touch: true,
  }
}
