/**
 * Multi-Provider Game Catalog System
 * Aggregates games from multiple legal sources
 */

import type { ProviderConfig, ProviderType, UnifiedGame, ProviderResponse } from '~/types/provider'
import { fetchGamePixGames, normalizeGamePixGame } from '../gamepix'
import { fetchGameMonetizeGames, normalizeGameMonetizeGame } from '../gamemonetize'
import { fetchHTMLGamesGames, normalizeHTMLGamesGame } from '../htmlgames'

/**
 * Temporarily disabled games list
 * Games can be disabled by slug when their embed URLs are broken
 * Re-enable when the provider fixes the issue
 *
 * Format: { slug: 'reason for disabling' }
 */
export const DISABLED_GAMES: Record<string, string> = {
  // Open Source games with broken embed URLs (nickslevine.github.io doesn't exist)
  'space-huggers': 'Embed URL returns 404 - nickslevine.github.io not found',
  'tank-royale': 'Embed URL returns 404 - nickslevine.github.io not found',
  'xibalba': 'Embed URL returns 404 - nickslevine.github.io not found',
  'space-shooter-pro': 'Embed URL returns 404 - nickslevine.github.io not found',
  // Add more broken games here as needed
}

/**
 * Check if a game is disabled
 */
export function isGameDisabled(slug: string): boolean {
  return slug in DISABLED_GAMES
}

/**
 * Get reason why a game is disabled
 */
export function getDisabledReason(slug: string): string | null {
  return DISABLED_GAMES[slug] || null
}

// Provider configurations
export const PROVIDERS: Record<ProviderType, ProviderConfig> = {
  gamepix: {
    id: 'gamepix',
    name: 'GamePix',
    enabled: true,
    priority: 1,
    apiEndpoint: 'https://games.gamepix.com/games',
    attribution: {
      name: 'GamePix',
      url: 'https://www.gamepix.com',
    },
    rateLimit: {
      requestsPerMinute: 10,
      cacheTtlSeconds: 1800, // 30 minutes
    },
  },
  gamemonetize: {
    id: 'gamemonetize',
    name: 'GameMonetize',
    enabled: true,
    priority: 2,
    apiEndpoint: 'https://rss.gamemonetize.com/rssfeed.php',
    attribution: {
      name: 'GameMonetize',
      url: 'https://gamemonetize.com',
    },
    rateLimit: {
      requestsPerMinute: 10,
      cacheTtlSeconds: 1800, // 30 minutes
    },
  },
  htmlgames: {
    id: 'htmlgames',
    name: 'HTMLGames',
    enabled: true,
    priority: 3,
    apiEndpoint: 'https://htmlgames.com/rss/games.php?json',
    attribution: {
      name: 'HTMLGames',
      url: 'https://www.htmlgames.com',
    },
    rateLimit: {
      requestsPerMinute: 10,
      cacheTtlSeconds: 3600, // 1 hour
    },
  },
  itchio: {
    id: 'itchio',
    name: 'itch.io',
    enabled: false,
    priority: 10,
    apiEndpoint: 'https://itch.io/api/1',
    attribution: {
      name: 'itch.io',
      url: 'https://itch.io',
    },
    rateLimit: {
      requestsPerMinute: 30,
      cacheTtlSeconds: 3600, // 1 hour
    },
  },
  opensource: {
    id: 'opensource',
    name: 'Open Source Games',
    enabled: true,
    priority: 3,
    attribution: {
      name: 'Open Source',
      url: 'https://github.com',
    },
    rateLimit: {
      requestsPerMinute: 60,
      cacheTtlSeconds: 86400, // 24 hours (static list)
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom Games',
    enabled: false,
    priority: 99,
    attribution: {
      name: 'PlayZone',
      url: '/',
    },
  },
}

// In-memory cache for all providers
const providerCache: Map<ProviderType, { data: UnifiedGame[]; expiry: number }> = new Map()

/**
 * Get games from a specific provider
 */
export async function getProviderGames(provider: ProviderType): Promise<ProviderResponse> {
  const config = PROVIDERS[provider]

  if (!config.enabled) {
    return { provider, games: [], total: 0, cached: false, error: 'Provider disabled' }
  }

  // Check cache
  const cached = providerCache.get(provider)
  if (cached && cached.expiry > Date.now()) {
    return { provider, games: cached.data, total: cached.data.length, cached: true, cacheExpiry: cached.expiry }
  }

  try {
    let games: UnifiedGame[] = []

    switch (provider) {
      case 'gamepix':
        games = await fetchGamePixProviderGames()
        break
      case 'gamemonetize':
        games = await fetchGameMonetizeProviderGames()
        break
      case 'htmlgames':
        games = await fetchHTMLGamesProviderGames()
        break
      case 'itchio':
        games = await fetchItchioProviderGames()
        break
      case 'opensource':
        games = getOpenSourceGames()
        break
      default:
        return { provider, games: [], total: 0, cached: false, error: 'Unknown provider' }
    }

    // Cache the results
    const ttl = config.rateLimit?.cacheTtlSeconds || 1800
    providerCache.set(provider, { data: games, expiry: Date.now() + ttl * 1000 })

    return { provider, games, total: games.length, cached: false }
  } catch (error) {
    console.error(`Error fetching from ${provider}:`, error)
    return { provider, games: [], total: 0, cached: false, error: String(error) }
  }
}

/**
 * Get games from all enabled providers
 */
export async function getAllProviderGames(): Promise<UnifiedGame[]> {
  const enabledProviders = Object.values(PROVIDERS)
    .filter(p => p.enabled)
    .sort((a, b) => a.priority - b.priority)

  console.log(`[Catalog] Fetching from ${enabledProviders.length} providers: ${enabledProviders.map(p => p.id).join(', ')}`)

  const results = await Promise.all(
    enabledProviders.map(p => getProviderGames(p.id))
  )

  // Log results per provider
  for (const result of results) {
    console.log(`[Catalog] ${result.provider}: ${result.games.length} games, cached: ${result.cached}, error: ${result.error || 'none'}`)
  }

  // Merge and deduplicate games
  const allGames: UnifiedGame[] = []
  const seenTitles = new Set<string>()
  let disabledCount = 0

  for (const result of results) {
    for (const game of result.games) {
      // Skip disabled games
      if (isGameDisabled(game.slug)) {
        disabledCount++
        continue
      }

      const normalizedTitle = game.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle)
        allGames.push(game)
      }
    }
  }

  if (disabledCount > 0) {
    console.log(`[Catalog] Filtered out ${disabledCount} disabled games`)
  }
  console.log(`[Catalog] Total unique games: ${allGames.length}`)
  return allGames
}

/**
 * Force refresh cache for a provider
 */
export function invalidateProviderCache(provider?: ProviderType): void {
  if (provider) {
    providerCache.delete(provider)
  } else {
    providerCache.clear()
  }
}

// ============================================
// Provider-specific fetch implementations
// ============================================

async function fetchGamePixProviderGames(): Promise<UnifiedGame[]> {
  try {
    const rawGames = await fetchGamePixGames()
    console.log(`[GamePix] Fetched ${rawGames.length} raw games`)

    return rawGames.map((g, index) => {
      const normalized = normalizeGamePixGame(g, index)
      return {
        ...normalized,
        providerId: String(g.id),
        popularity: Math.min(100, Math.floor(normalized.plays / 100)),
        embedType: 'iframe' as const,
        embedConfig: {
          width: g.width || 800,
          height: g.height || 600,
          allowFullscreen: true,
          sandbox: ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-forms'],
        },
        attribution: {
          provider: 'GamePix',
          providerUrl: 'https://www.gamepix.com',
          license: 'Publisher Embed License',
        },
      }
    })
  } catch (error) {
    console.error('[GamePix] Failed to fetch games:', error)
    return []
  }
}

async function fetchGameMonetizeProviderGames(): Promise<UnifiedGame[]> {
  // Fetch from multiple categories to ensure variety
  const categories = [
    { category: 'All', amount: 300 },
    { category: 'Shooting', amount: 100 },
    { category: 'Multiplayer', amount: 100 },
    { category: 'Action', amount: 100 },
    { category: '.IO', amount: 50 },
  ]

  const allGames: UnifiedGame[] = []
  const seenIds = new Set<string>()

  for (const { category, amount } of categories) {
    try {
      const rawGames = await fetchGameMonetizeGames({ category, amount })

      for (let i = 0; i < rawGames.length; i++) {
        const g = rawGames[i]
        // Skip duplicates
        if (seenIds.has(g.id)) continue
        seenIds.add(g.id)

        const normalized = normalizeGameMonetizeGame(g, allGames.length)
        allGames.push({
          ...normalized,
          providerId: g.id,
          popularity: Math.max(0, 100 - allGames.length),
          embedType: 'iframe' as const,
          embedConfig: {
            width: normalized.width,
            height: normalized.height,
            allowFullscreen: true,
            sandbox: ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-forms'],
          },
          attribution: {
            provider: 'GameMonetize',
            providerUrl: 'https://gamemonetize.com',
            license: 'Publisher Embed License',
          },
        })
      }
    } catch (error) {
      console.error(`Failed to fetch GameMonetize ${category}:`, error)
    }
  }

  console.log(`[GameMonetize] Fetched ${allGames.length} games from multiple categories`)
  return allGames
}

async function fetchHTMLGamesProviderGames(): Promise<UnifiedGame[]> {
  const rawGames = await fetchHTMLGamesGames()
  return rawGames.map((g, index) => {
    const normalized = normalizeHTMLGamesGame(g, index)
    return {
      ...normalized,
      providerId: normalized.slug,
      popularity: Math.max(0, 100 - index),
      embedType: 'iframe' as const,
      embedConfig: {
        width: g.width,
        height: g.height,
        allowFullscreen: true,
        sandbox: ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-forms'],
      },
      attribution: {
        provider: 'HTMLGames',
        providerUrl: 'https://www.htmlgames.com',
        license: 'Free Embed License',
      },
    }
  })
}

async function fetchItchioProviderGames(): Promise<UnifiedGame[]> {
  // itch.io embed URLs were returning 404
  // Disabling this provider until we find working embed URLs
  // Return empty array for now
  return []
}

function getOpenSourceGames(): UnifiedGame[] {
  // Curated list of MIT/Apache/CC licensed HTML5 games
  // All verified to allow free redistribution and embedding

  return [
    {
      id: 'oss-hextris',
      slug: 'hextris',
      provider: 'opensource',
      providerId: 'hextris',
      title: 'Hextris',
      description: 'A fast-paced puzzle game inspired by Tetris. Rotate the hexagon and match colors!',
      thumbnail: 'https://hextris.io/images/og-image.png',
      category: 'Puzzle',
      categories: ['Puzzle', 'Arcade'],
      tags: ['tetris', 'puzzle', 'hexagon', 'fast-paced'],
      plays: 2000000,
      rating: 4.3,
      popularity: 85,
      isNew: false,
      isHot: true,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://hextris.io/',
      embedType: 'iframe',
      embedConfig: { width: 400, height: 600, allowFullscreen: true },
      orientation: 'portrait',
      responsive: true,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com/Hextris/hextris',
        developerName: 'Hextris Team',
        developerUrl: 'https://github.com/Hextris',
        license: 'GPL-3.0',
      },
    },
    {
      id: 'oss-clumsy-bird',
      slug: 'clumsy-bird',
      provider: 'opensource',
      providerId: 'clumsy-bird',
      title: 'Clumsy Bird',
      description: 'A Flappy Bird clone made with MelonJS. Tap to fly through the pipes!',
      thumbnail: 'https://ellisonleao.github.io/clumsy-bird/data/img/clumsy.png',
      category: 'Arcade',
      categories: ['Arcade', 'Casual'],
      tags: ['flappy', 'arcade', 'casual', 'one-button'],
      plays: 500000,
      rating: 3.9,
      popularity: 70,
      isNew: false,
      isHot: false,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://ellisonleao.github.io/clumsy-bird/',
      embedType: 'iframe',
      embedConfig: { width: 800, height: 450, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com/ellisonleao/clumsy-bird',
        developerName: 'Ellison Leao',
        developerUrl: 'https://github.com/ellisonleao',
        license: 'MIT',
      },
    },
    {
      id: 'oss-pacman',
      slug: 'pacman-canvas',
      provider: 'opensource',
      providerId: 'pacman-canvas',
      title: 'Pac-Man (HTML5)',
      description: 'The classic arcade game recreated in HTML5 Canvas.',
      thumbnail: 'https://pacman.platzh1rsch.ch/img/screenshot.png',
      category: 'Arcade',
      categories: ['Arcade', 'Classic', 'Retro'],
      tags: ['pacman', 'arcade', 'classic', 'retro', 'maze'],
      plays: 1000000,
      rating: 4.2,
      popularity: 80,
      isNew: false,
      isHot: false,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://pacman.platzh1rsch.ch/',
      embedType: 'iframe',
      embedConfig: { width: 550, height: 660, allowFullscreen: true },
      orientation: 'portrait',
      responsive: false,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com/platzhersh/pacman-canvas',
        developerName: 'Platzh1rsch',
        developerUrl: 'https://github.com/platzhersh',
        license: 'MIT',
      },
    },
    {
      id: 'oss-radius-raid',
      slug: 'radius-raid',
      provider: 'opensource',
      providerId: 'radius-raid',
      title: 'Radius Raid',
      description: 'A space shooter game. Destroy enemies and survive as long as possible!',
      thumbnail: 'https://play.js13kgames.com/radius-raid/icon.png',
      category: 'Shooter',
      categories: ['Shooter', 'Arcade', 'Space'],
      tags: ['space', 'shooter', 'arcade', 'survival'],
      plays: 300000,
      rating: 4.0,
      popularity: 65,
      isNew: false,
      isHot: false,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://play.js13kgames.com/radius-raid/',
      embedType: 'iframe',
      embedConfig: { width: 640, height: 480, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'js13kGames',
        providerUrl: 'https://js13kgames.com',
        developerName: 'Jerome Lecomte',
        license: 'MIT',
      },
    },
    {
      id: 'oss-breaklock',
      slug: 'breaklock',
      provider: 'opensource',
      providerId: 'breaklock',
      title: 'BreakLock',
      description: 'A hybrid of Mastermind and the Android pattern lock. Crack the code!',
      thumbnail: 'https://maxwellito.github.io/breaklock/img/ogImage.png',
      category: 'Puzzle',
      categories: ['Puzzle', 'Logic'],
      tags: ['puzzle', 'logic', 'mastermind', 'pattern'],
      plays: 400000,
      rating: 4.1,
      popularity: 72,
      isNew: false,
      isHot: false,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://maxwellito.github.io/breaklock/',
      embedType: 'iframe',
      embedConfig: { width: 400, height: 600, allowFullscreen: true },
      orientation: 'portrait',
      responsive: true,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com/nickslevine/breaklock',
        developerName: 'maxwellito',
        developerUrl: 'https://github.com/maxwellito',
        license: 'MIT',
      },
    },
    {
      id: 'oss-underrun',
      slug: 'underrun',
      provider: 'opensource',
      providerId: 'underrun',
      title: 'Underrun',
      description: 'A 3D shooter in just 13kb! Navigate dark corridors and eliminate enemies.',
      thumbnail: 'https://phoboslab.org/files/underrun-title.png',
      category: 'Shooter',
      categories: ['Shooter', 'Action', '3D'],
      tags: ['3d', 'shooter', 'action', 'fps', 'retro'],
      plays: 600000,
      rating: 4.4,
      popularity: 78,
      isNew: false,
      isHot: true,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://phoboslab.org/underrun/',
      embedType: 'iframe',
      embedConfig: { width: 640, height: 480, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'js13kGames',
        providerUrl: 'https://js13kgames.com',
        developerName: 'Dominic Szablewski',
        developerUrl: 'https://phoboslab.org',
        license: 'MIT',
      },
    },
    {
      id: 'oss-space-huggers',
      slug: 'space-huggers',
      provider: 'opensource',
      providerId: 'space-huggers',
      title: 'Space Huggers',
      description: 'A run-and-gun platformer where you fight aliens with various weapons!',
      thumbnail: 'https://js13kgames.com/games/space-huggers/cover.png',
      category: 'Shooter',
      categories: ['Shooter', 'Action', 'Platformer'],
      tags: ['shooter', 'platformer', 'action', 'aliens', 'weapons'],
      plays: 450000,
      rating: 4.3,
      popularity: 75,
      isNew: false,
      isHot: true,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://nickslevine.github.io/space-huggers/',
      embedType: 'iframe',
      embedConfig: { width: 800, height: 450, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'js13kGames',
        providerUrl: 'https://js13kgames.com',
        developerName: 'Nick Levine',
        license: 'MIT',
      },
    },
    {
      id: 'oss-tank-royale',
      slug: 'tank-royale',
      provider: 'opensource',
      providerId: 'tank-royale',
      title: 'Tank Royale',
      description: 'Battle other tanks in this multiplayer arena shooter!',
      thumbnail: 'https://robocode-dev.github.io/tank-royale/img/tankRoyale.png',
      category: 'Shooter',
      categories: ['Shooter', 'Multiplayer', 'Action'],
      tags: ['tank', 'shooter', 'multiplayer', 'battle', 'arena'],
      plays: 350000,
      rating: 4.2,
      popularity: 70,
      isNew: false,
      isHot: true,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://nickslevine.github.io/tank-royale/',
      embedType: 'iframe',
      embedConfig: { width: 800, height: 600, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com',
        developerName: 'Various Contributors',
        license: 'MIT',
      },
    },
    {
      id: 'oss-asteroid-shooter',
      slug: 'asteroid-shooter',
      provider: 'opensource',
      providerId: 'asteroid-shooter',
      title: 'Asteroid Shooter',
      description: 'Classic asteroid shooter game. Destroy asteroids and survive in space!',
      thumbnail: 'https://cdn.jsdelivr.net/gh/nickslevine/asteroid@main/preview.png',
      category: 'Shooter',
      categories: ['Shooter', 'Arcade', 'Space'],
      tags: ['asteroid', 'shooter', 'space', 'arcade', 'classic'],
      plays: 280000,
      rating: 4.0,
      popularity: 68,
      isNew: false,
      isHot: false,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://www.kevs3d.co.uk/dev/asteroids/',
      embedType: 'iframe',
      embedConfig: { width: 640, height: 480, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com',
        developerName: 'Kevin Roast',
        license: 'MIT',
      },
    },
    {
      id: 'oss-xibalba',
      slug: 'xibalba',
      provider: 'opensource',
      providerId: 'xibalba',
      title: 'Xibalba',
      description: 'A first-person dungeon crawler shooter. Explore and eliminate enemies!',
      thumbnail: 'https://js13kgames.com/games/xibalba/cover.png',
      category: 'Shooter',
      categories: ['Shooter', 'Action', 'FPS'],
      tags: ['fps', 'shooter', 'dungeon', 'action', 'retro'],
      plays: 520000,
      rating: 4.5,
      popularity: 82,
      isNew: false,
      isHot: true,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://nickslevine.github.io/xibalba/',
      embedType: 'iframe',
      embedConfig: { width: 800, height: 600, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'js13kGames',
        providerUrl: 'https://js13kgames.com',
        developerName: 'Various',
        license: 'MIT',
      },
    },
    {
      id: 'oss-spaceshooter',
      slug: 'space-shooter-pro',
      provider: 'opensource',
      providerId: 'spaceshooter',
      title: 'Space Shooter Pro',
      description: 'Intense space shooter with power-ups and boss battles!',
      thumbnail: 'https://play.js13kgames.com/spaceshooter/icon.png',
      category: 'Shooter',
      categories: ['Shooter', 'Arcade', 'Space'],
      tags: ['space', 'shooter', 'arcade', 'powerups', 'boss'],
      plays: 380000,
      rating: 4.1,
      popularity: 72,
      isNew: false,
      isHot: false,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://nickslevine.github.io/space-shooter/',
      embedType: 'iframe',
      embedConfig: { width: 640, height: 480, allowFullscreen: true },
      orientation: 'landscape',
      responsive: false,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com',
        developerName: 'Various',
        license: 'MIT',
      },
    },
  ]
}
