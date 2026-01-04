<script setup lang="ts">
import type { Game } from '~/types/game'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Map special slugs to display names
const specialCategories: Record<string, { title: string; icon: string }> = {
  all: { title: 'All Games', icon: 'ph:game-controller-fill' },
  trending: { title: 'Trending Games', icon: 'ph:fire-fill' },
  popular: { title: 'Most Played', icon: 'ph:trophy-fill' },
  new: { title: 'New Releases', icon: 'ph:sparkle-fill' },
}

// Valid game categories
const validCategories = [
  'all', 'trending', 'popular', 'new',
  'action', 'adventure', 'arcade', 'puzzle', 'racing',
  'sports', 'strategy', 'shooter', 'shooting', 'multiplayer',
  'io', 'casual', 'simulation', 'junior', 'classic', 'retro',
]

// Normalize category slug (handle shooter/shooting variants)
const normalizedCategory = computed(() => {
  const s = slug.value.toLowerCase()
  if (s === 'shooter' || s === 'shooting') return 'shooter'
  return s
})

// Determine API query based on slug
const apiQuery = computed(() => {
  const base = { limit: 100 }

  if (slug.value === 'all' || slug.value === 'popular') {
    return { ...base, sort: 'popular' }
  }
  if (slug.value === 'trending') {
    return { ...base, sort: 'popular' }
  }
  if (slug.value === 'new') {
    return { ...base, sort: 'newest' }
  }

  // Regular category - use normalized value
  return { ...base, category: normalizedCategory.value }
})

// Fetch games from API
const { data, pending, error } = await useFetch('/api/games', {
  query: apiQuery,
  watch: [slug],
})

const games = computed(() => data.value?.games || [])

// Page metadata
const pageTitle = computed(() => {
  if (specialCategories[slug.value]) {
    return specialCategories[slug.value].title
  }
  // Capitalize category name
  return slug.value.charAt(0).toUpperCase() + slug.value.slice(1) + ' Games'
})

const pageIcon = computed(() => {
  if (specialCategories[slug.value]) {
    return specialCategories[slug.value].icon
  }
  // Map common categories to icons
  const categoryIcons: Record<string, string> = {
    action: 'ph:lightning-fill',
    puzzle: 'ph:puzzle-piece-fill',
    racing: 'ph:car-fill',
    sports: 'ph:soccer-ball-fill',
    strategy: 'ph:chess-fill',
    adventure: 'ph:compass-fill',
    shooter: 'ph:crosshair-fill',
    shooting: 'ph:crosshair-fill',
    arcade: 'ph:game-controller-fill',
    io: 'ph:globe-fill',
    multiplayer: 'ph:users-fill',
  }
  return categoryIcons[slug.value] || 'ph:squares-four-fill'
})

useSeoMeta({
  title: () => `${pageTitle.value} - Free Online Games | Andromeda Games`,
  description: () => `Play free ${pageTitle.value.toLowerCase()} online. No downloads required.`,
})

// Sort options
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'A-Z' },
]
const selectedSort = ref('popular')

const sortedGames = computed(() => {
  const gamesCopy = [...games.value]
  switch (selectedSort.value) {
    case 'popular':
      return gamesCopy.sort((a: Game, b: Game) => b.plays - a.plays)
    case 'rating':
      return gamesCopy.sort((a: Game, b: Game) => b.rating - a.rating)
    case 'name':
      return gamesCopy.sort((a: Game, b: Game) => a.title.localeCompare(b.title))
    default:
      return gamesCopy
  }
})
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
    <!-- Category Tabs -->
    <div class="mb-6">
      <CategoryTabs :active="slug" />
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-bg-surface rounded animate-pulse" />
        <div class="space-y-2">
          <div class="h-6 w-40 bg-bg-surface rounded animate-pulse" />
          <div class="h-4 w-24 bg-bg-surface rounded animate-pulse" />
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <GameCardSkeleton v-for="i in 12" :key="i" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <Icon name="ph:warning-circle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-text-primary mb-2">Failed to load games</h2>
      <p class="text-text-secondary mb-6">Please try again later.</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-5 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
      >
        <Icon name="ph:house" class="w-5 h-5" />
        Back to Home
      </NuxtLink>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-brand/20 rounded-xl">
            <Icon :name="pageIcon" class="w-7 h-7 text-brand-light" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-text-primary font-display">{{ pageTitle }}</h1>
            <p class="text-sm text-text-muted">{{ games.length }} games</p>
          </div>
        </div>

        <!-- Sort Dropdown -->
        <div class="flex items-center gap-2">
          <label for="sort" class="text-sm text-text-secondary">Sort by:</label>
          <select
            id="sort"
            v-model="selectedSort"
            class="px-3 py-2 bg-bg-surface border border-brand/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-brand/50 transition-colors"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Games Grid -->
      <GameGrid v-if="sortedGames.length > 0">
        <GameCard v-for="game in sortedGames" :key="game.id" :game="game" />
      </GameGrid>

      <!-- Empty State / Invalid Category -->
      <div v-else class="text-center py-16">
        <Icon
          :name="validCategories.includes(slug.toLowerCase()) ? 'ph:game-controller' : 'ph:warning-circle'"
          class="w-16 h-16 mx-auto mb-4"
          :class="validCategories.includes(slug.toLowerCase()) ? 'text-text-muted' : 'text-warning'"
        />
        <h2 class="text-xl font-semibold text-text-primary mb-2">
          {{ validCategories.includes(slug.toLowerCase()) ? 'No games found' : 'Category not found' }}
        </h2>
        <p class="text-text-secondary mb-6">
          {{ validCategories.includes(slug.toLowerCase())
            ? 'Check back later for new games in this category.'
            : 'This category doesn\'t exist. Try browsing our available categories.'
          }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-5 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
          >
            <Icon name="ph:house" class="w-5 h-5" />
            Back to Home
          </NuxtLink>
          <NuxtLink
            to="/category/all"
            class="inline-flex items-center gap-2 px-5 py-3 bg-bg-surface text-text-primary font-semibold rounded-xl hover:bg-bg-elevated border border-brand/20 transition-colors"
          >
            <Icon name="ph:squares-four" class="w-5 h-5" />
            Browse All Games
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>
