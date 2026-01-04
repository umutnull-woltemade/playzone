<script setup lang="ts">
import type { Game } from '~/types/game'

useSeoMeta({
  title: 'Recently Played - Andromeda Games',
  description: 'Continue playing your recent games. Pick up where you left off!',
})

// Recently played from localStorage
const recentSlugs = ref<string[]>([])
const isLoading = ref(true)

// Load recent on mount
onMounted(() => {
  const stored = localStorage.getItem('andromeda-recent')
  if (stored) {
    try {
      recentSlugs.value = JSON.parse(stored)
    } catch {
      recentSlugs.value = []
    }
  }
  isLoading.value = false
})

// Fetch all games to filter recent
const { data, pending } = await useFetch('/api/games', {
  query: { limit: 500 },
})

const allGames = computed(() => data.value?.games || [])

// Filter games that are in recent - maintain order
const recentGames = computed(() => {
  if (!allGames.value.length || !recentSlugs.value.length) return []

  const gameMap = new Map<string, Game>()
  allGames.value.forEach((game: Game) => {
    gameMap.set(game.slug, game)
  })

  return recentSlugs.value
    .map(slug => gameMap.get(slug))
    .filter((game): game is Game => !!game)
})

// Remove from recent
function removeFromRecent(slug: string) {
  recentSlugs.value = recentSlugs.value.filter(s => s !== slug)
  localStorage.setItem('andromeda-recent', JSON.stringify(recentSlugs.value))
}

// Clear all recent
function clearAllRecent() {
  if (confirm('Are you sure you want to clear your play history?')) {
    recentSlugs.value = []
    localStorage.setItem('andromeda-recent', JSON.stringify([]))
  }
}
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cyan/20 rounded-xl">
            <Icon name="ph:clock-counter-clockwise-fill" class="w-7 h-7 text-cyan" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-text-primary">Recently Played</h1>
            <p class="text-text-muted mt-1">
              {{ recentGames.length }} {{ recentGames.length === 1 ? 'game' : 'games' }} in history
            </p>
          </div>
        </div>

        <button
          v-if="recentGames.length > 0"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
          @click="clearAllRecent"
        >
          <Icon name="ph:trash" class="w-4 h-4" />
          Clear History
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pending || isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        <div v-for="i in 12" :key="i" class="aspect-[4/3] bg-bg-surface rounded-xl animate-pulse" />
      </div>

      <!-- Empty State -->
      <div v-else-if="recentGames.length === 0" class="py-20 text-center">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-bg-surface mb-6">
          <Icon name="ph:clock-counter-clockwise" class="w-12 h-12 text-text-muted" />
        </div>
        <h2 class="text-xl font-bold text-text-primary mb-2">No games played yet</h2>
        <p class="text-text-secondary mb-6 max-w-md mx-auto">
          Start playing games and they'll appear here for quick access!
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand/30"
        >
          <Icon name="ph:game-controller" class="w-5 h-5" />
          Browse Games
        </NuxtLink>
      </div>

      <!-- Recent Games Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        <div v-for="game in recentGames" :key="game.id" class="relative group">
          <GameCard :game="game" />

          <!-- Remove Button -->
          <button
            class="absolute top-2 right-2 z-20 p-2 bg-bg-void/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
            title="Remove from history"
            @click.prevent.stop="removeFromRecent(game.slug)"
          >
            <Icon name="ph:x" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
