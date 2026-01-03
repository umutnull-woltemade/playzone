import { invalidateProviderCache, getAllProviderGames, PROVIDERS } from '~/server/utils/providers'
import type { ProviderType, CatalogSyncResult } from '~/types/provider'

/**
 * Admin API: Force sync game catalog from providers
 * POST /api/admin/sync
 *
 * Query params:
 * - provider: Specific provider to sync (optional, syncs all if not specified)
 * - force: Force refresh even if cache is valid (default: true)
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const provider = query.provider as ProviderType | undefined
  const force = query.force !== 'false'

  // In production, add authentication here
  // const authHeader = getHeader(event, 'Authorization')
  // if (!authHeader || !validateAdminToken(authHeader)) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' })
  // }

  const syncStartTime = Date.now()
  const results: CatalogSyncResult[] = []

  try {
    // Invalidate cache
    if (force) {
      if (provider) {
        invalidateProviderCache(provider)
        console.log(`[Admin] Invalidated cache for ${provider}`)
      } else {
        invalidateProviderCache()
        console.log('[Admin] Invalidated all provider caches')
      }
    }

    // Fetch fresh data
    const games = await getAllProviderGames()

    // Count games by provider
    const providerCounts: Record<string, number> = {}
    for (const game of games) {
      const prov = game.provider
      providerCounts[prov] = (providerCounts[prov] || 0) + 1
    }

    // Generate results
    for (const [provId, count] of Object.entries(providerCounts)) {
      results.push({
        provider: provId as ProviderType,
        success: true,
        gamesAdded: count,
        gamesUpdated: 0,
        gamesRemoved: 0,
        errors: [],
        syncedAt: new Date().toISOString(),
      })
    }

    const syncDuration = Date.now() - syncStartTime

    return {
      success: true,
      message: `Synced ${games.length} games from ${Object.keys(providerCounts).length} providers`,
      totalGames: games.length,
      syncDurationMs: syncDuration,
      results,
      providers: Object.values(PROVIDERS)
        .filter(p => p.enabled)
        .map(p => ({
          id: p.id,
          name: p.name,
          gameCount: providerCounts[p.id] || 0,
        })),
    }
  } catch (error) {
    console.error('[Admin] Sync failed:', error)

    return {
      success: false,
      message: String(error),
      totalGames: 0,
      syncDurationMs: Date.now() - syncStartTime,
      results,
      error: String(error),
    }
  }
})
