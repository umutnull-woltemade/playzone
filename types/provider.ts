/**
 * Unified Game Provider Types
 * Supports multiple legal game sources with priority and fallback
 */

export type ProviderType = 'gamepix' | 'gamemonetize' | 'htmlgames' | 'itchio' | 'opensource' | 'custom'

export interface ProviderConfig {
  id: ProviderType
  name: string
  enabled: boolean
  priority: number // Lower = higher priority
  apiEndpoint?: string
  attribution: {
    name: string
    url: string
    logo?: string
  }
  rateLimit?: {
    requestsPerMinute: number
    cacheTtlSeconds: number
  }
}

export interface UnifiedGame {
  // Core identifiers
  id: string
  slug: string
  provider: ProviderType
  providerId: string // Original ID from provider

  // Display info
  title: string
  description: string
  thumbnail: string
  thumbnailLarge?: string

  // Categorization
  category: string
  categories: string[]
  tags: string[]

  // Metrics
  plays: number
  rating: number
  popularity: number // Normalized 0-100

  // Flags
  isNew: boolean
  isHot: boolean
  isFeatured: boolean
  isActive: boolean

  // Embed
  embedUrl: string
  embedType: 'iframe' | 'script' | 'direct'
  embedConfig?: {
    width?: number
    height?: number
    allowFullscreen?: boolean
    sandbox?: string[]
  }

  // Technical
  orientation?: 'landscape' | 'portrait' | 'any'
  responsive?: boolean
  touchEnabled?: boolean
  mobileSupported?: boolean

  // Attribution (required for compliance)
  attribution: {
    provider: string
    providerUrl: string
    developerName?: string
    developerUrl?: string
    license?: string
  }

  // Timestamps
  createdAt?: string
  updatedAt?: string
}

export interface ProviderResponse {
  provider: ProviderType
  games: UnifiedGame[]
  total: number
  cached: boolean
  cacheExpiry?: number
  error?: string
}

export interface CatalogSyncResult {
  provider: ProviderType
  success: boolean
  gamesAdded: number
  gamesUpdated: number
  gamesRemoved: number
  errors: string[]
  syncedAt: string
}

// Provider-specific raw types

export interface ItchioGame {
  id: number
  title: string
  short_text?: string
  cover_url: string
  url: string
  classification: string
  type: string
  embed?: {
    width: number
    height: number
    fullscreen: boolean
  }
  user: {
    id: number
    username: string
    url: string
  }
  views_count?: number
  downloads_count?: number
  published_at?: string
}

export interface OpenSourceGame {
  id: string
  name: string
  description: string
  thumbnail: string
  gameUrl: string
  sourceUrl: string
  license: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'CC0' | 'CC-BY' | 'CC-BY-SA' | 'Public Domain'
  author: string
  authorUrl?: string
  category: string
  tags: string[]
  year?: number
}

export interface GameMonetizeGame {
  id: string
  title: string
  description: string
  instructions: string
  url: string
  category: string
  tags: string
  thumb: string
  width: string
  height: string
}

export interface HTMLGamesGame {
  name: string
  category: string
  create_date: string
  description: string
  url: string
  youtube?: string | null
  embed: string
  width: number
  height: number
  thumb1: string
  thumb2: string
  thumb3: string
  thumb4: string
  thumb5: string
  thumb6: string
  thumb7: string
  thumb8: string
}
