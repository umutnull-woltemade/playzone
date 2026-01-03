import { PROVIDERS, getProviderGames } from '~/server/utils/providers'
import type { ProviderType } from '~/types/provider'

/**
 * Get list of available game providers
 * GET /api/providers
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const includeStats = query.stats === 'true'

  const providers = await Promise.all(
    Object.values(PROVIDERS)
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority)
      .map(async (provider) => {
        const base = {
          id: provider.id,
          name: provider.name,
          priority: provider.priority,
          attribution: provider.attribution,
        }

        if (includeStats) {
          const response = await getProviderGames(provider.id)
          return {
            ...base,
            gameCount: response.games.length,
            cached: response.cached,
            error: response.error,
          }
        }

        return base
      })
  )

  return {
    providers,
    total: providers.length,
  }
})
