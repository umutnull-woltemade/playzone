import type { HTMLGamesGame } from '~/types/provider'

/**
 * HTMLGames Configuration
 */
export const HTMLGAMES_CONFIG = {
  feedUrl: 'https://htmlgames.com/rss/games.php?json',
}

/**
 * Fetch games from HTMLGames JSON feed
 */
export async function fetchHTMLGamesGames(): Promise<HTMLGamesGame[]> {
  try {
    const response = await fetch(HTMLGAMES_CONFIG.feedUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlayZone/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`HTMLGames API error: ${response.status}`)
    }

    const data = await response.json()

    // API returns array directly
    const games: HTMLGamesGame[] = Array.isArray(data) ? data : []

    return games
  } catch (error) {
    console.error('Failed to fetch HTMLGames games:', error)
    return []
  }
}

/**
 * Create URL-friendly slug from game name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-hg'
}

/**
 * Normalize category name
 */
function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'Bubble Shooter': 'Arcade',
    'Mahjong Solitaire': 'Puzzle',
    'Card Games': 'Cards',
    'Solitaire Games': 'Cards',
    '2048 & Merge': 'Puzzle',
    'Match 3 Games': 'Puzzle',
    'Hidden Object Games': 'Puzzle',
    'Puzzle Games': 'Puzzle',
    'Memory': 'Puzzle',
    'Daily Puzzles': 'Puzzle',
    'Tile Games': 'Puzzle',
    'Sorting Games': 'Puzzle',
    'Board': 'Board',
    'Retro': 'Classic',
    'Connect 3': 'Puzzle',
    'Sudoku': 'Puzzle',
  }

  return categoryMap[category] || category
}

/**
 * Generate tags from category and name
 */
function generateTags(game: HTMLGamesGame): string[] {
  const tags: string[] = []

  // Add category as tag
  tags.push(game.category.toLowerCase().replace(/\s+/g, '-'))

  // Add common keywords from name
  const name = game.name.toLowerCase()
  if (name.includes('mahjong')) tags.push('mahjong')
  if (name.includes('solitaire')) tags.push('solitaire')
  if (name.includes('bubble')) tags.push('bubble')
  if (name.includes('puzzle')) tags.push('puzzle')
  if (name.includes('memory')) tags.push('memory')
  if (name.includes('match')) tags.push('match')
  if (name.includes('card')) tags.push('cards')
  if (name.includes('hidden')) tags.push('hidden-object')

  return [...new Set(tags)].slice(0, 5)
}

/**
 * Normalize HTMLGames game data to unified format
 */
export function normalizeHTMLGamesGame(game: HTMLGamesGame, index: number) {
  const orientation = game.width > game.height ? 'landscape' : 'portrait'

  // Determine flags based on date and position
  const createDate = new Date(game.create_date)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24))

  const isNew = daysDiff <= 30
  const isHot = index < 20
  const isFeatured = index < 10

  // Estimate plays based on age (older = more plays)
  const estimatedPlays = Math.max(10000, 100000 + daysDiff * 500)

  // Rating based on position
  const rating = Math.min(4.7, Math.max(4.0, 4.4 - index * 0.01))

  return {
    id: `hg-${createSlug(game.name)}`,
    slug: createSlug(game.name),
    title: game.name,
    description: game.description || `Play ${game.name} online for free!`,
    thumbnail: game.thumb5 || game.thumb4 || game.thumb3, // Use medium-sized thumb
    category: normalizeCategory(game.category),
    categories: [normalizeCategory(game.category)],
    tags: generateTags(game),
    plays: estimatedPlays,
    rating: Math.round(rating * 10) / 10,
    isNew,
    isHot,
    isFeatured,
    embedUrl: game.url,
    provider: 'htmlgames' as const,
    isActive: true,
    width: game.width,
    height: game.height,
    orientation,
    responsive: true,
    touch: true,
  }
}
