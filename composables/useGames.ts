import type { Game } from '~/types/game'

interface GamesApiResponse {
  games: Game[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

interface GameDetailResponse {
  game: Game
  similarGames: Game[]
}

export function useGames() {
  // Reactive state
  const games = ref<Game[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch games from API
   */
  async function fetchGames(options: {
    category?: string
    limit?: number
    page?: number
    sort?: 'popular' | 'rating' | 'newest' | 'name'
  } = {}): Promise<GamesApiResponse> {
    isLoading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (options.category) params.set('category', options.category)
      if (options.limit) params.set('limit', options.limit.toString())
      if (options.page) params.set('page', options.page.toString())
      if (options.sort) params.set('sort', options.sort)

      const response = await $fetch<GamesApiResponse>(`/api/games?${params.toString()}`)

      games.value = response.games
      return response
    } catch (e) {
      error.value = 'Failed to load games'
      console.error('Error fetching games:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get a single game by slug
   */
  async function fetchGameBySlug(slug: string): Promise<GameDetailResponse> {
    isLoading.value = true
    error.value = null

    try {
      return await $fetch<GameDetailResponse>(`/api/games/${slug}`)
    } catch (e) {
      error.value = 'Game not found'
      console.error('Error fetching game:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties for filtering
  const featuredGames = computed(() =>
    games.value.filter(g => g.isFeatured).slice(0, 4)
  )

  const trendingGames = computed(() =>
    games.value.filter(g => g.isHot).slice(0, 6)
  )

  const newGames = computed(() =>
    games.value.filter(g => g.isNew).slice(0, 6)
  )

  const popularGames = computed(() =>
    [...games.value].sort((a, b) => b.plays - a.plays).slice(0, 6)
  )

  /**
   * Get game by slug from loaded games
   */
  function getGameBySlug(slug: string): Game | undefined {
    return games.value.find(g => g.slug === slug)
  }

  /**
   * Get games by category from loaded games
   */
  function getGamesByCategory(category: string): Game[] {
    return games.value.filter(g =>
      g.category.toLowerCase() === category.toLowerCase() ||
      g.categories?.some(c => c.toLowerCase() === category.toLowerCase())
    )
  }

  /**
   * Get similar games
   */
  function getSimilarGames(game: Game): Game[] {
    return games.value
      .filter(g =>
        g.id !== game.id &&
        (g.category === game.category ||
          g.categories?.some(c => game.categories?.includes(c)))
      )
      .slice(0, 6)
  }

  /**
   * Format play count for display
   */
  function formatPlays(plays: number): string {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
    if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`
    return plays.toString()
  }

  return {
    // State
    games,
    isLoading,
    error,

    // Computed
    featuredGames,
    trendingGames,
    newGames,
    popularGames,

    // Methods
    fetchGames,
    fetchGameBySlug,
    getGameBySlug,
    getGamesByCategory,
    getSimilarGames,
    formatPlays,
  }
}

/**
 * SSR-friendly composable that fetches games on mount
 */
export function useGamesData(options: {
  category?: string
  limit?: number
  autoFetch?: boolean
} = {}) {
  const { autoFetch = true, ...fetchOptions } = options
  const { games, isLoading, error, fetchGames, ...rest } = useGames()

  // Fetch data using useAsyncData for SSR support
  const { pending, refresh } = useAsyncData(
    `games-${options.category || 'all'}`,
    () => fetchGames(fetchOptions),
    {
      immediate: autoFetch,
      watch: false,
    }
  )

  return {
    games,
    isLoading: pending,
    error,
    refresh,
    ...rest,
  }
}
