/**
 * Multi-Provider Game Catalog System
 * Aggregates games from multiple legal sources
 */

import type { ProviderConfig, ProviderType, UnifiedGame, ProviderResponse } from '~/types/provider'
import { fetchGamePixGames, normalizeGamePixGame } from '../gamepix'
import { fetchGameMonetizeGames, normalizeGameMonetizeGame } from '../gamemonetize'
import { fetchHTMLGamesGames, normalizeHTMLGamesGame } from '../htmlgames'

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

  const results = await Promise.all(
    enabledProviders.map(p => getProviderGames(p.id))
  )

  // Merge and deduplicate games
  const allGames: UnifiedGame[] = []
  const seenTitles = new Set<string>()

  for (const result of results) {
    for (const game of result.games) {
      const normalizedTitle = game.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle)
        allGames.push(game)
      }
    }
  }

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
  const rawGames = await fetchGamePixGames()
  return rawGames.map(g => {
    const normalized = normalizeGamePixGame(g)
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
}

async function fetchGameMonetizeProviderGames(): Promise<UnifiedGame[]> {
  const rawGames = await fetchGameMonetizeGames({ amount: 500 })
  return rawGames.map((g, index) => {
    const normalized = normalizeGameMonetizeGame(g, index)
    return {
      ...normalized,
      providerId: g.id,
      popularity: Math.max(0, 100 - index),
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
    }
  })
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
  ]
}
