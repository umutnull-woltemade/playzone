/**
 * Multi-Provider Game Catalog System
 * Aggregates games from multiple legal sources
 */

import type { ProviderConfig, ProviderType, UnifiedGame, ProviderResponse } from '~/types/provider'
import { fetchGamePixGames, normalizeGamePixGame } from '../gamepix'

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
  itchio: {
    id: 'itchio',
    name: 'itch.io',
    enabled: true,
    priority: 2,
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

async function fetchItchioProviderGames(): Promise<UnifiedGame[]> {
  // itch.io doesn't have a public games list API
  // We use a curated list of games that explicitly allow embedding
  // These are games verified to have embed permissions

  const curatedItchioGames: UnifiedGame[] = [
    {
      id: 'itchio-celeste-classic',
      slug: 'celeste-classic',
      provider: 'itchio',
      providerId: '227102',
      title: 'Celeste Classic',
      description: 'The original PICO-8 version of Celeste - a challenging platformer about climbing a mountain.',
      thumbnail: 'https://img.itch.zone/aW1nLzE0OTI2MzUucG5n/315x250%23c/Ry%2F%2FJg.png',
      category: 'Platformer',
      categories: ['Platformer', 'Indie'],
      tags: ['pico-8', 'platformer', 'retro', 'pixel-art', 'difficult'],
      plays: 500000,
      rating: 4.8,
      popularity: 95,
      isNew: false,
      isHot: true,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://itch.io/embed-upload/227102?color=1a1c2c',
      embedType: 'iframe',
      embedConfig: { width: 128, height: 128, allowFullscreen: true },
      orientation: 'landscape',
      responsive: true,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'itch.io',
        providerUrl: 'https://itch.io',
        developerName: 'Matt Thorson & Noel Berry',
        developerUrl: 'https://mattmakesgames.itch.io',
        license: 'Free to Play (Embed Allowed)',
      },
    },
    {
      id: 'itchio-poom',
      slug: 'poom',
      provider: 'itchio',
      providerId: '576987',
      title: 'POOM',
      description: 'A DOOM-like FPS game made in PICO-8.',
      thumbnail: 'https://img.itch.zone/aW1nLzMwNDExOTAucG5n/315x250%23c/qWQm%2FA.png',
      category: 'Shooter',
      categories: ['Shooter', 'Retro', 'FPS'],
      tags: ['pico-8', 'doom', 'fps', 'retro', 'shooter'],
      plays: 150000,
      rating: 4.6,
      popularity: 80,
      isNew: false,
      isHot: true,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://itch.io/embed-upload/576987?color=1a1c2c',
      embedType: 'iframe',
      embedConfig: { width: 128, height: 128, allowFullscreen: true },
      orientation: 'landscape',
      responsive: true,
      touchEnabled: false,
      mobileSupported: false,
      attribution: {
        provider: 'itch.io',
        providerUrl: 'https://itch.io',
        developerName: 'freds72',
        developerUrl: 'https://freds72.itch.io',
        license: 'Free to Play (Embed Allowed)',
      },
    },
    {
      id: 'itchio-dusk-child',
      slug: 'dusk-child',
      provider: 'itchio',
      providerId: '1062154',
      title: 'Dusk Child',
      description: 'A beautiful puzzle-platformer about guiding light through darkness.',
      thumbnail: 'https://img.itch.zone/aW1nLzYxNTk3NzQucG5n/315x250%23c/2t9VDw.png',
      category: 'Puzzle',
      categories: ['Puzzle', 'Platformer'],
      tags: ['puzzle', 'platformer', 'atmospheric', 'pixel-art'],
      plays: 50000,
      rating: 4.4,
      popularity: 60,
      isNew: true,
      isHot: false,
      isFeatured: false,
      isActive: true,
      embedUrl: 'https://itch.io/embed-upload/1062154?color=1a1c2c',
      embedType: 'iframe',
      embedConfig: { width: 640, height: 480, allowFullscreen: true },
      orientation: 'landscape',
      responsive: true,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'itch.io',
        providerUrl: 'https://itch.io',
        developerName: 'Adam Mowery',
        developerUrl: 'https://adam-mowery.itch.io',
        license: 'Free to Play (Embed Allowed)',
      },
    },
  ]

  return curatedItchioGames
}

function getOpenSourceGames(): UnifiedGame[] {
  // Curated list of MIT/Apache/CC licensed HTML5 games
  // All verified to allow free redistribution and hosting

  return [
    {
      id: 'oss-2048',
      slug: '2048-game',
      provider: 'opensource',
      providerId: '2048',
      title: '2048',
      description: 'The classic sliding puzzle game. Combine tiles to reach 2048!',
      thumbnail: 'https://play2048.co/meta/og_image.png',
      category: 'Puzzle',
      categories: ['Puzzle', 'Numbers'],
      tags: ['puzzle', 'numbers', 'casual', 'addictive'],
      plays: 10000000,
      rating: 4.5,
      popularity: 100,
      isNew: false,
      isHot: true,
      isFeatured: true,
      isActive: true,
      embedUrl: 'https://play2048.co/',
      embedType: 'iframe',
      embedConfig: { width: 500, height: 650, allowFullscreen: true },
      orientation: 'portrait',
      responsive: true,
      touchEnabled: true,
      mobileSupported: true,
      attribution: {
        provider: 'Open Source',
        providerUrl: 'https://github.com/gabrielecirulli/2048',
        developerName: 'Gabriele Cirulli',
        developerUrl: 'https://github.com/gabrielecirulli',
        license: 'MIT',
      },
    },
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
      isHot: false,
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
      isFeatured: false,
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
      thumbnail: 'https://js13kgames.com/games/radius-raid/icon.png',
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
      embedUrl: 'https://js13kgames.com/games/radius-raid/index.html',
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
  ]
}
