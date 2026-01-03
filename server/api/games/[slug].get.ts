import { fetchGamePixGames, normalizeGamePixGame } from '~/server/utils/gamepix'
import type { Game } from '~/types/game'

// Shared cache with the list endpoint
let cachedGames: Game[] = []
let cacheTimestamp = 0
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Game slug is required',
    })
  }

  // Refresh cache if needed
  const now = Date.now()
  if (cachedGames.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    try {
      const gpxGames = await fetchGamePixGames({
        order: 'q',
        limit: 100,
      })

      cachedGames = gpxGames.map((game, index) =>
        normalizeGamePixGame(game, index)
      )

      cacheTimestamp = now
    } catch (error) {
      console.error('[GamePix] Failed to fetch games:', error)
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
    .slice(0, 6)

  return {
    game,
    similarGames,
  }
})
