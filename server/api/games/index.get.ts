import { getAllProviderGames, getProviderGames, PROVIDERS } from '~/server/utils/providers'
import type { UnifiedGame, ProviderType } from '~/types/provider'
import type { Game } from '~/types/game'

// Unified cache for all providers
let cachedGames: Game[] = []
let cacheTimestamp = 0
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

/**
 * Convert UnifiedGame to the existing Game type for backward compatibility
 */
function unifiedToGame(unified: UnifiedGame): Game {
  return {
    id: unified.id,
    slug: unified.slug,
    title: unified.title,
    description: unified.description,
    thumbnail: unified.thumbnail,
    category: unified.category,
    categories: unified.categories,
    tags: unified.tags,
    plays: unified.plays,
    rating: unified.rating,
    isNew: unified.isNew,
    isHot: unified.isHot,
    isFeatured: unified.isFeatured,
    embedUrl: unified.embedUrl,
    provider: unified.provider,
    isActive: unified.isActive,
    width: unified.embedConfig?.width,
    height: unified.embedConfig?.height,
    orientation: unified.orientation,
    responsive: unified.responsive,
    touch: unified.touchEnabled,
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Parse query parameters
  const category = query.category as string | undefined
  const provider = query.provider as ProviderType | undefined
  const limit = parseInt(query.limit as string) || 100
  const page = parseInt(query.page as string) || 1
  const sort = (query.sort as string) || 'popular'
  const featured = query.featured === 'true'
  const hot = query.hot === 'true'

  // Check cache
  const now = Date.now()
  if (cachedGames.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    console.log('[Catalog] Fetching games from all providers...')

    try {
      let unifiedGames: UnifiedGame[] = []

      if (provider && PROVIDERS[provider]) {
        // Fetch from specific provider
        const response = await getProviderGames(provider)
        unifiedGames = response.games
        console.log(`[Catalog] Fetched ${unifiedGames.length} games from ${provider}`)
      } else {
        // Fetch from all enabled providers
        unifiedGames = await getAllProviderGames()
        console.log(`[Catalog] Fetched ${unifiedGames.length} games from all providers`)
      }

      // Convert to Game type for backward compatibility
      cachedGames = unifiedGames.map(unifiedToGame)
      cacheTimestamp = now
    } catch (error) {
      console.error('[Catalog] Failed to fetch games:', error)

      // Return cached data if available, even if stale
      if (cachedGames.length > 0) {
        console.log('[Catalog] Using stale cache')
      }
    }
  }

  // Filter by category if specified
  let filteredGames = [...cachedGames]

  if (category) {
    const categoryLower = category.toLowerCase()
    filteredGames = filteredGames.filter(game =>
      game.category.toLowerCase() === categoryLower ||
      game.categories.some(c => c.toLowerCase() === categoryLower)
    )
  }

  // Filter by provider if specified
  if (provider) {
    filteredGames = filteredGames.filter(game => game.provider === provider)
  }

  // Filter featured/hot
  if (featured) {
    filteredGames = filteredGames.filter(game => game.isFeatured)
  }
  if (hot) {
    filteredGames = filteredGames.filter(game => game.isHot)
  }

  // Sort games
  switch (sort) {
    case 'popular':
      filteredGames.sort((a, b) => b.plays - a.plays)
      break
    case 'rating':
      filteredGames.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      filteredGames.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return b.plays - a.plays
      })
      break
    case 'name':
      filteredGames.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'provider':
      filteredGames.sort((a, b) => {
        const priorityA = PROVIDERS[a.provider as ProviderType]?.priority || 99
        const priorityB = PROVIDERS[b.provider as ProviderType]?.priority || 99
        return priorityA - priorityB
      })
      break
  }

  // Paginate
  const perPage = Math.min(limit, 100)
  const startIndex = (page - 1) * perPage
  const paginatedGames = filteredGames.slice(startIndex, startIndex + perPage)

  return {
    games: paginatedGames,
    total: filteredGames.length,
    page,
    perPage,
    totalPages: Math.ceil(filteredGames.length / perPage),
    providers: Object.values(PROVIDERS).filter(p => p.enabled).map(p => ({
      id: p.id,
      name: p.name,
      priority: p.priority,
    })),
  }
})
