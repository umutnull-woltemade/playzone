<script setup lang="ts">
import type { Game } from '~/types/game'

useSeoMeta({
  title: 'My Favorites - Andromeda Games',
  description: 'Your favorite games collection. Play your saved games anytime!',
})

// Favorites from localStorage
const favorites = ref<string[]>([])
const isLoading = ref(true)

// Load favorites on mount
onMounted(() => {
  const stored = localStorage.getItem('andromeda-favorites')
  if (stored) {
    try {
      favorites.value = JSON.parse(stored)
    } catch {
      favorites.value = []
    }
  }
  isLoading.value = false
})

// Fetch all games to filter favorites
const { data, pending } = await useFetch('/api/games', {
  query: { limit: 500 },
})

const allGames = computed(() => data.value?.games || [])

// Filter games that are in favorites
const favoriteGames = computed(() => {
  if (!allGames.value.length) return []
  return allGames.value.filter((game: Game) => favorites.value.includes(game.slug))
})

const toast = useToast()

// State for confirmation modal
const showClearConfirm = ref(false)

// Remove from favorites
function removeFromFavorites(slug: string) {
  favorites.value = favorites.value.filter(s => s !== slug)
  localStorage.setItem('andromeda-favorites', JSON.stringify(favorites.value))
  toast.success('Removed from favorites')
}

// Clear all favorites
function clearAllFavorites() {
  favorites.value = []
  localStorage.setItem('andromeda-favorites', JSON.stringify([]))
  showClearConfirm.value = false
  toast.success('All favorites cleared')
}
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-pink/20 rounded-xl">
            <Icon name="ph:heart-fill" class="w-7 h-7 text-pink" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-text-primary">My Favorites</h1>
            <p class="text-text-muted mt-1">
              {{ favoriteGames.length }} {{ favoriteGames.length === 1 ? 'game' : 'games' }} saved
            </p>
          </div>
        </div>

        <button
          v-if="favoriteGames.length > 0"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
          @click="showClearConfirm = true"
        >
          <Icon name="ph:trash" class="w-4 h-4" />
          Clear All
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pending || isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        <div v-for="i in 12" :key="i" class="aspect-[4/3] bg-bg-surface rounded-xl animate-pulse" />
      </div>

      <!-- Empty State -->
      <div v-else-if="favoriteGames.length === 0" class="py-20 text-center">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-bg-surface mb-6">
          <Icon name="ph:heart" class="w-12 h-12 text-text-muted" />
        </div>
        <h2 class="text-xl font-bold text-text-primary mb-2">No favorites yet</h2>
        <p class="text-text-secondary mb-6 max-w-md mx-auto">
          Start exploring games and tap the heart icon to add them to your favorites!
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand/30"
        >
          <Icon name="ph:game-controller" class="w-5 h-5" />
          Browse Games
        </NuxtLink>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        <div v-for="game in favoriteGames" :key="game.id" class="relative group">
          <GameCard :game="game" />

          <!-- Remove Button -->
          <button
            class="absolute top-2 right-2 z-20 p-2 bg-bg-void/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
            title="Remove from favorites"
            @click.prevent.stop="removeFromFavorites(game.slug)"
          >
            <Icon name="ph:x" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Clear Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showClearConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-bg-void/80 backdrop-blur-sm" @click="showClearConfirm = false" />

          <!-- Modal -->
          <div class="relative bg-bg-surface border border-brand/20 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <Icon name="ph:warning-circle-fill" class="w-8 h-8 text-red-400" />
              </div>
              <h3 class="text-xl font-bold text-text-primary mb-2">Clear All Favorites?</h3>
              <p class="text-text-secondary mb-6">
                This will remove all {{ favoriteGames.length }} games from your favorites. This action cannot be undone.
              </p>
              <div class="flex gap-3">
                <button
                  class="flex-1 px-4 py-3 text-sm font-semibold text-text-primary bg-bg-elevated hover:bg-bg-hover rounded-xl transition-colors"
                  @click="showClearConfirm = false"
                >
                  Cancel
                </button>
                <button
                  class="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                  @click="clearAllFavorites"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
