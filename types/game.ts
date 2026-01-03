/**
 * Normalized game interface used throughout the application
 */
export interface Game {
  id: string
  slug: string
  title: string
  description: string
  thumbnail: string
  category: string
  categories: string[]
  tags: string[]
  plays: number
  rating: number
  isNew: boolean
  isHot: boolean
  isFeatured: boolean
  embedUrl: string
  provider: 'gamepix' | 'internal' | 'other'
  isActive: boolean
  width?: number
  height?: number
  orientation?: 'landscape' | 'portrait'
  responsive?: boolean
  touch?: boolean
}

/**
 * Raw GamePix API response structure
 * Based on official GamePix API documentation
 */
export interface GamePixGame {
  id: number
  title: string
  description: string
  category: string
  categories?: string[]
  author?: string
  thumbnailUrl: string
  thumbnailUrl100?: string
  url: string
  rkScore: number // Ranking score for popularity
  width?: number
  height?: number
  orientation?: 'landscape' | 'portrait'
  responsive?: boolean
  touch?: boolean
}

export interface GamePixCategory {
  id: number
  name: string
  slug: string
}

export interface GamePixApiResponse {
  games?: GamePixGame[]
  data?: GamePixGame[]
  total?: number
  page?: number
  perPage?: number
}

/**
 * GamePix publisher configuration
 * These values come from your GamePix publisher dashboard
 */
export interface GamePixConfig {
  sid: string        // Site ID from publisher dashboard
  pid?: string       // Publisher ID (optional)
  baseUrl: string    // API base URL
}
