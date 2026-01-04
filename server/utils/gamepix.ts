import type { GamePixGame, GamePixConfig, Game } from '~/types/game'

/**
 * GamePix Publisher Configuration
 *
 * IMPORTANT: Replace these values with your actual GamePix publisher credentials
 * from https://partners.gamepix.com/publishers
 *
 * The SID (Site ID) is required to:
 * 1. Track your statistics in the GamePix dashboard
 * 2. Receive ad revenue share
 * 3. Access the full game catalog
 */
export const GAMEPIX_CONFIG: GamePixConfig = {
  // Replace with your actual Site ID from GamePix publisher dashboard
  sid: process.env.GAMEPIX_SID || 'DEMO',
  pid: process.env.GAMEPIX_PID || undefined,
  baseUrl: 'https://games.gamepix.com',
}

/**
 * Fetch games from GamePix API
 *
 * @param options - Query options
 * @returns Array of GamePix games
 */
export async function fetchGamePixGames(options: {
  order?: 'q' | 'd'  // q = quality/popularity, d = date/newest
  category?: string
  limit?: number
  page?: number
} = {}): Promise<GamePixGame[]> {
  const { order = 'q', category, limit = 500, page = 1 } = options

  // Build the API URL with required SID parameter
  const params = new URLSearchParams({
    sid: GAMEPIX_CONFIG.sid,
    order,
    ...(category && { category }),
  })

  const url = `${GAMEPIX_CONFIG.baseUrl}/games?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlayZone/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`GamePix API error: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats
    const games: GamePixGame[] = Array.isArray(data)
      ? data
      : (data.games || data.data || [])

    // Sort by rkScore (popularity) and limit
    return games
      .sort((a, b) => (b.rkScore || 0) - (a.rkScore || 0))
      .slice(0, limit)

  } catch (error) {
    console.error('Failed to fetch GamePix games:', error)
    return []
  }
}

/**
 * Fetch categories from GamePix API
 */
export async function fetchGamePixCategories(): Promise<{ id: number; name: string }[]> {
  const url = `${GAMEPIX_CONFIG.baseUrl}/categories`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`GamePix API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch GamePix categories:', error)
    return []
  }
}

/**
 * Create URL-friendly slug from title
 */
function createSlug(title: string, id: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return `${baseSlug}-${id}`
}

/**
 * Normalize GamePix game data to our internal Game format
 */
export function normalizeGamePixGame(gpxGame: GamePixGame, rank: number): Game {
  // Determine if game is "hot" based on ranking
  const isHot = rank < 20
  const isNew = false // GamePix doesn't provide this directly
  const isFeatured = rank < 5

  // Generate estimated plays from rkScore
  // rkScore is a relative popularity metric
  const estimatedPlays = Math.round((gpxGame.rkScore || 0) * 10000)

  // Calculate rating based on rkScore (normalize to 1-5 scale)
  const rating = Math.min(5, Math.max(3.5, 3.5 + (gpxGame.rkScore || 0) / 500))

  return {
    id: `gpx-${gpxGame.id}`,
    slug: createSlug(gpxGame.title, gpxGame.id),
    title: gpxGame.title,
    description: gpxGame.description || `Play ${gpxGame.title} online for free!`,
    thumbnail: gpxGame.thumbnailUrl,
    category: capitalizeFirst(gpxGame.category || 'Games'),
    categories: gpxGame.categories || [gpxGame.category || 'Games'],
    tags: generateTags(gpxGame),
    plays: estimatedPlays,
    rating: Math.round(rating * 10) / 10,
    isNew,
    isHot,
    isFeatured,
    embedUrl: gpxGame.url,
    provider: 'gamepix',
    isActive: true,
    width: gpxGame.width,
    height: gpxGame.height,
    orientation: gpxGame.orientation,
    responsive: gpxGame.responsive,
    touch: gpxGame.touch,
  }
}

/**
 * Generate tags from game data
 */
function generateTags(game: GamePixGame): string[] {
  const tags: string[] = []

  // Add category as tag
  if (game.category) {
    tags.push(game.category.toLowerCase())
  }

  // Add additional categories
  if (game.categories) {
    game.categories.forEach(cat => {
      if (!tags.includes(cat.toLowerCase())) {
        tags.push(cat.toLowerCase())
      }
    })
  }

  // Add device support tags
  if (game.touch) tags.push('mobile')
  if (game.responsive) tags.push('responsive')

  // Add orientation tag
  if (game.orientation) tags.push(game.orientation)

  return tags.slice(0, 5)
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Build embed URL with tracking parameters
 */
export function buildEmbedUrl(gameUrl: string): string {
  const url = new URL(gameUrl)

  // Add tracking parameters if not present
  if (GAMEPIX_CONFIG.sid && !url.searchParams.has('sid')) {
    url.searchParams.set('sid', GAMEPIX_CONFIG.sid)
  }

  return url.toString()
}
