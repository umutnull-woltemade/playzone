<script setup lang="ts">
import type { Game } from '~/types/game'

useSeoMeta({
  title: 'PlayZone - Free Online Games | Play Instantly',
  description: 'Play the best free online games instantly. No downloads, no signup. Action, puzzle, racing, sports and more!',
})

// Fetch games from API
const { data, pending, error } = await useFetch('/api/games', {
  query: { limit: 100, sort: 'popular' },
})

// Derived game lists
const games = computed(() => data.value?.games || [])

const featuredGames = computed(() =>
  games.value.filter((g: Game) => g.isFeatured).slice(0, 5)
)

const trendingGames = computed(() =>
  games.value.filter((g: Game) => g.isHot).slice(0, 12)
)

const popularGames = computed(() =>
  [...games.value].sort((a: Game, b: Game) => b.plays - a.plays).slice(0, 12)
)

const newGames = computed(() =>
  games.value.filter((g: Game) => g.isNew).slice(0, 12)
)

const puzzleGames = computed(() =>
  games.value.filter((g: Game) =>
    g.category.toLowerCase() === 'puzzle'
  ).slice(0, 12)
)

const actionGames = computed(() =>
  games.value.filter((g: Game) =>
    g.category.toLowerCase() === 'action'
  ).slice(0, 12)
)

const arcadeGames = computed(() =>
  games.value.filter((g: Game) =>
    g.category.toLowerCase() === 'arcade'
  ).slice(0, 12)
)

// "Top picks for you" - mix of popular and featured
const topPicks = computed(() => {
  const picks = [...games.value]
    .sort((a: Game, b: Game) => {
      // Prioritize featured, then hot, then by plays
      const aScore = (a.isFeatured ? 1000 : 0) + (a.isHot ? 500 : 0) + a.plays / 1000
      const bScore = (b.isFeatured ? 1000 : 0) + (b.isHot ? 500 : 0) + b.plays / 1000
      return bScore - aScore
    })
    .slice(0, 18)
  return picks
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 space-y-8">
      <!-- Featured Skeleton -->
      <div class="aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] bg-bg-surface rounded-2xl animate-pulse" />

      <!-- Quick Filters Skeleton -->
      <div class="flex gap-2 overflow-hidden">
        <div v-for="i in 8" :key="i" class="h-10 w-24 bg-bg-surface rounded-full animate-pulse flex-shrink-0" />
      </div>

      <!-- Rows Skeleton -->
      <div v-for="i in 3" :key="i" class="space-y-4">
        <div class="h-8 w-48 bg-bg-surface rounded animate-pulse" />
        <div class="flex gap-3 overflow-hidden">
          <div v-for="j in 6" :key="j" class="flex-shrink-0 w-44">
            <div class="aspect-[4/3] bg-bg-surface rounded-xl animate-pulse" />
            <div class="h-4 w-32 bg-bg-surface rounded mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-screen-2xl mx-auto px-4 md:px-6 py-16 text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-6">
        <Icon name="ph:warning-circle" class="w-10 h-10 text-error" />
      </div>
      <h2 class="text-2xl font-bold text-text-primary mb-2">Failed to load games</h2>
      <p class="text-text-secondary mb-6">Please try refreshing the page.</p>
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-xl transition-all"
        @click="() => refreshNuxtData()"
      >
        <Icon name="ph:arrow-clockwise" class="w-5 h-5" />
        Retry
      </button>
    </div>

    <!-- Content -->
    <template v-else>
      <div class="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 space-y-8">
        <!-- Featured Carousel -->
        <FeaturedCarousel v-if="featuredGames.length > 0" :games="featuredGames" />

        <!-- Quick Category Filters -->
        <QuickFilters />

        <!-- Top Picks Grid -->
        <section>
          <div class="flex items-center gap-3 mb-5">
            <div class="p-2 bg-accent-muted rounded-lg">
              <Icon name="ph:star-fill" class="w-5 h-5 text-accent-primary" />
            </div>
            <h2 class="text-lg md:text-xl font-bold text-text-primary">Top picks for you</h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            <GameCard
              v-for="(game, index) in topPicks.slice(0, 12)"
              :key="game.id"
              :game="game"
              :size="index === 0 ? 'lg' : 'md'"
            />
          </div>
        </section>

        <!-- Trending Now -->
        <GameCarouselRow
          v-if="trendingGames.length > 0"
          title="Trending Now"
          icon="ph:fire-fill"
          :games="trendingGames"
          href="/category/trending"
        />

        <!-- Most Popular -->
        <GameCarouselRow
          v-if="popularGames.length > 0"
          title="Most Popular"
          icon="ph:trophy-fill"
          :games="popularGames"
          href="/category/popular"
        />

        <!-- New Games -->
        <GameCarouselRow
          v-if="newGames.length > 0"
          title="New Releases"
          icon="ph:sparkle-fill"
          :games="newGames"
          href="/category/new"
        />

        <!-- Puzzle Games -->
        <GameCarouselRow
          v-if="puzzleGames.length > 0"
          title="Puzzle Games"
          icon="ph:puzzle-piece-fill"
          :games="puzzleGames"
          href="/category/puzzle"
        />

        <!-- Action Games -->
        <GameCarouselRow
          v-if="actionGames.length > 0"
          title="Action Games"
          icon="ph:lightning-fill"
          :games="actionGames"
          href="/category/action"
        />

        <!-- Arcade Games -->
        <GameCarouselRow
          v-if="arcadeGames.length > 0"
          title="Arcade Classics"
          icon="ph:game-controller-fill"
          :games="arcadeGames"
          href="/category/arcade"
        />

        <!-- All Games Section -->
        <section class="pt-4">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-cyan-muted rounded-lg">
                <Icon name="ph:squares-four-fill" class="w-5 h-5 text-cyan-primary" />
              </div>
              <div>
                <h2 class="text-lg md:text-xl font-bold text-text-primary">All Games</h2>
                <p class="text-sm text-text-muted">{{ games.length }} games available</p>
              </div>
            </div>
            <NuxtLink
              to="/category/all"
              class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-accent-primary hover:text-accent-hover bg-accent-muted hover:bg-accent-primary/20 rounded-lg transition-all"
            >
              View All
              <Icon name="ph:arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            <GameCard v-for="game in games.slice(0, 24)" :key="game.id" :game="game" />
          </div>

          <div class="text-center mt-8">
            <NuxtLink
              to="/category/all"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-bg-surface hover:bg-bg-elevated text-text-primary font-semibold rounded-xl border border-bg-subtle hover:border-accent-primary/30 transition-all hover:shadow-lg"
            >
              <Icon name="ph:squares-four" class="w-5 h-5" />
              Browse All Games
              <Icon name="ph:arrow-right" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
