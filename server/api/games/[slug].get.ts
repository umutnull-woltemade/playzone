import { getAllProviderGames, isGameDisabled, getDisabledReason } from '~/server/utils/providers'
import type { UnifiedGame } from '~/types/provider'
import type { Game } from '~/types/game'

// Shared cache with the list endpoint
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
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Game slug is required',
    })
  }

  // Check if game is temporarily disabled
  if (isGameDisabled(slug)) {
    const reason = getDisabledReason(slug)
    console.log(`[GameSlug] Game "${slug}" is disabled: ${reason}`)
    throw createError({
      statusCode: 404,
      message: 'Game is temporarily unavailable',
    })
  }

  // Refresh cache if needed
  const now = Date.now()
  if (cachedGames.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    try {
      const unifiedGames = await getAllProviderGames()
      cachedGames = unifiedGames.map(unifiedToGame)
      cacheTimestamp = now
      console.log(`[GameSlug] Cached ${cachedGames.length} games from all providers`)
    } catch (error) {
      console.error('[GameSlug] Failed to fetch games:', error)
    }
  }

  // Find game by slug
  const game = cachedGames.find(g => g.slug === slug)

  if (!game) {
    throw createError({
      statusCode: 404,
      message: 'Game not found',
    })
  }

  // Find similar games (same category, excluding current game)
  const similarGames = cachedGames
    .filter(g =>
      g.id !== game.id &&
      (g.category === game.category ||
        g.categories.some(c => game.categories.includes(c)))
    )
    .slice(0, 12)

  return {
    game,
    similarGames,
  }
})
