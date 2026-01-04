<script setup lang="ts">
import type { Game } from '~/types/game'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Fetch game data from API
const { data, pending, error } = await useFetch(`/api/games/${slug.value}`)

const game = computed(() => data.value?.game as Game | undefined)
const similarGames = computed(() => data.value?.similarGames || [])

// Game state
const isPlaying = ref(false)

// Favorites state
const favorites = ref<string[]>([])
const isFavorite = computed(() => game.value ? favorites.value.includes(game.value.slug) : false)

// Load favorites from localStorage on mount
onMounted(() => {
  const stored = localStorage.getItem('playzone-favorites')
  if (stored) {
    try {
      favorites.value = JSON.parse(stored)
    } catch {
      favorites.value = []
    }
  }
})

// Toggle favorite
function toggleFavorite() {
  if (!game.value) return

  const gameSlug = game.value.slug
  if (favorites.value.includes(gameSlug)) {
    favorites.value = favorites.value.filter(s => s !== gameSlug)
  } else {
    favorites.value = [...favorites.value, gameSlug]
  }

  localStorage.setItem('playzone-favorites', JSON.stringify(favorites.value))
}

// Share game
async function shareGame() {
  if (!game.value) return

  const shareData = {
    title: `${game.value.title} - PlayZone`,
    text: game.value.description,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  } catch (err) {
    // User cancelled share or error occurred
    console.log('Share failed:', err)
  }
}

// 404 if game not found (after loading)
if (!pending.value && error.value) {
  throw createError({
    statusCode: 404,
    message: 'Game not found',
  })
}

// Format play count for display
function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`
  return plays.toString()
}

function startPlaying() {
  isPlaying.value = true
}

useSeoMeta({
  title: () => game.value ? `${game.value.title} - Play Free Online | PlayZone` : 'Loading...',
  description: () => game.value?.description || '',
  ogImage: () => game.value?.thumbnail || '',
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-screen-xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <!-- Breadcrumb Skeleton -->
      <div class="flex items-center gap-2">
        <div class="h-4 w-16 bg-bg-surface rounded animate-pulse" />
        <div class="h-4 w-4 bg-bg-surface rounded animate-pulse" />
        <div class="h-4 w-20 bg-bg-surface rounded animate-pulse" />
        <div class="h-4 w-4 bg-bg-surface rounded animate-pulse" />
        <div class="h-4 w-32 bg-bg-surface rounded animate-pulse" />
      </div>

      <!-- Player Skeleton -->
      <div class="aspect-video bg-bg-surface rounded-2xl animate-pulse flex items-center justify-center">
        <div class="w-16 h-16 border-4 border-bg-subtle border-t-accent-primary rounded-full animate-spin" />
      </div>

      <!-- Info Skeleton -->
      <div class="p-6 bg-bg-surface rounded-2xl space-y-4">
        <div class="h-8 w-64 bg-bg-subtle rounded animate-pulse" />
        <div class="h-4 w-48 bg-bg-subtle rounded animate-pulse" />
        <div class="h-20 w-full bg-bg-subtle rounded animate-pulse" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-screen-xl mx-auto px-4 md:px-6 py-16 text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bg-surface mb-6">
        <Icon name="ph:game-controller" class="w-10 h-10 text-text-muted" />
      </div>
      <h2 class="text-2xl font-bold text-text-primary mb-2">Game not found</h2>
      <p class="text-text-secondary mb-6">The game you're looking for doesn't exist or has been removed.</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-xl transition-all"
      >
        <Icon name="ph:house" class="w-5 h-5" />
        Back to Home
      </NuxtLink>
    </div>

    <!-- Game Content -->
    <template v-else-if="game">
      <!-- Hero Section with Play CTA (shown when not playing) -->
      <div v-if="!isPlaying" class="relative">
        <!-- Background -->
        <div class="absolute inset-0 h-[500px]">
          <img
            :src="game.thumbnail"
            :alt="game.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/80 to-bg-void/40" />
          <div class="absolute inset-0 bg-gradient-to-r from-bg-void/90 via-bg-void/50 to-transparent" />
        </div>

        <!-- Content -->
        <div class="relative max-w-screen-xl mx-auto px-4 md:px-6 pt-8 pb-16">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-text-secondary mb-8">
            <NuxtLink to="/" class="hover:text-accent-primary transition-colors">Home</NuxtLink>
            <Icon name="ph:caret-right" class="w-4 h-4" />
            <NuxtLink
              :to="`/category/${game.category.toLowerCase()}`"
              class="hover:text-accent-primary transition-colors"
            >
              {{ game.category }}
            </NuxtLink>
            <Icon name="ph:caret-right" class="w-4 h-4" />
            <span class="text-text-primary">{{ game.title }}</span>
          </nav>

          <!-- Hero Content -->
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Left: Game Info -->
            <div class="space-y-6">
              <!-- Badges -->
              <div class="flex flex-wrap gap-2">
                <span v-if="game.isHot" class="px-3 py-1 text-xs font-bold uppercase bg-warm-accent text-white rounded-lg">
                  Trending
                </span>
                <span v-if="game.isNew" class="px-3 py-1 text-xs font-bold uppercase bg-fresh-primary text-bg-void rounded-lg">
                  New
                </span>
                <span v-if="game.isFeatured" class="px-3 py-1 text-xs font-bold uppercase bg-accent-primary text-white rounded-lg">
                  Featured
                </span>
              </div>

              <!-- Title -->
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {{ game.title }}
              </h1>

              <!-- Meta -->
              <div class="flex flex-wrap items-center gap-4 text-sm">
                <span class="flex items-center gap-1.5 text-text-secondary">
                  <Icon name="ph:folder-fill" class="w-4 h-4 text-accent-primary" />
                  {{ game.category }}
                </span>
                <span class="flex items-center gap-1.5 text-text-secondary">
                  <Icon name="ph:play-circle-fill" class="w-4 h-4 text-accent-primary" />
                  {{ formatPlays(game.plays) }} plays
                </span>
                <span class="flex items-center gap-1.5 text-text-secondary">
                  <Icon name="ph:star-fill" class="w-4 h-4 text-warning" />
                  {{ game.rating.toFixed(1) }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-text-secondary text-lg leading-relaxed line-clamp-3">
                {{ game.description }}
              </p>

              <!-- Play Button -->
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <button
                  class="play-btn inline-flex items-center gap-3 px-8 py-4 bg-accent-primary hover:bg-accent-hover text-white font-bold text-lg rounded-2xl shadow-glow transition-all hover:scale-105"
                  @click="startPlaying"
                >
                  <Icon name="ph:play-fill" class="w-6 h-6" />
                  Play Now
                </button>

                <div class="flex items-center gap-2">
                  <button
                    class="p-3 bg-bg-surface/80 backdrop-blur-sm rounded-xl hover:bg-bg-surface transition-all"
                    :class="isFavorite ? 'text-warm-accent' : 'text-text-secondary hover:text-warm-accent'"
                    :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
                    @click="toggleFavorite"
                  >
                    <Icon :name="isFavorite ? 'ph:heart-fill' : 'ph:heart'" class="w-5 h-5" />
                  </button>
                  <button
                    class="p-3 bg-bg-surface/80 backdrop-blur-sm text-text-secondary rounded-xl hover:text-accent-primary hover:bg-bg-surface transition-all"
                    title="Share Game"
                    @click="shareGame"
                  >
                    <Icon name="ph:share-network" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Features -->
              <div class="flex flex-wrap gap-3 pt-2">
                <span v-if="game.touch" class="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface/60 backdrop-blur-sm rounded-lg text-sm text-text-secondary">
                  <Icon name="ph:hand-tap" class="w-4 h-4 text-cyan-primary" />
                  Touch Controls
                </span>
                <span v-if="game.responsive" class="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface/60 backdrop-blur-sm rounded-lg text-sm text-text-secondary">
                  <Icon name="ph:devices" class="w-4 h-4 text-cyan-primary" />
                  Responsive
                </span>
                <span v-if="game.orientation" class="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface/60 backdrop-blur-sm rounded-lg text-sm text-text-secondary">
                  <Icon name="ph:device-rotate" class="w-4 h-4 text-cyan-primary" />
                  {{ game.orientation === 'landscape' ? 'Landscape' : 'Portrait' }}
                </span>
              </div>
            </div>

            <!-- Right: Game Preview -->
            <div class="hidden lg:block">
              <div class="relative aspect-video rounded-2xl overflow-hidden shadow-lg-dark group cursor-pointer" @click="startPlaying">
                <img
                  :src="game.thumbnail"
                  :alt="game.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-bg-void/40 flex items-center justify-center group-hover:bg-bg-void/60 transition-colors">
                  <div class="w-20 h-20 rounded-full bg-accent-primary flex items-center justify-center shadow-glow transform group-hover:scale-110 transition-all">
                    <Icon name="ph:play-fill" class="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Player (shown when playing) -->
      <div v-else class="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-text-muted mb-4">
          <NuxtLink to="/" class="hover:text-accent-primary transition-colors">Home</NuxtLink>
          <Icon name="ph:caret-right" class="w-4 h-4" />
          <NuxtLink
            :to="`/category/${game.category.toLowerCase()}`"
            class="hover:text-accent-primary transition-colors"
          >
            {{ game.category }}
          </NuxtLink>
          <Icon name="ph:caret-right" class="w-4 h-4" />
          <span class="text-text-secondary">{{ game.title }}</span>
        </nav>

        <!-- Player -->
        <GamePlayer :game="game" />

        <!-- Game Info Bar -->
        <div class="mt-4 p-4 bg-bg-surface rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-text-primary">{{ game.title }}</h1>
            <div class="hidden md:flex items-center gap-3 text-sm text-text-muted">
              <span class="flex items-center gap-1">
                <Icon name="ph:folder" class="w-4 h-4" />
                {{ game.category }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="ph:play" class="w-4 h-4" />
                {{ formatPlays(game.plays) }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="ph:star-fill" class="w-4 h-4 text-warning" />
                {{ game.rating.toFixed(1) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="p-2 bg-bg-elevated rounded-lg transition-colors"
              :class="isFavorite ? 'text-warm-accent' : 'text-text-secondary hover:text-warm-accent'"
              :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
              @click="toggleFavorite"
            >
              <Icon :name="isFavorite ? 'ph:heart-fill' : 'ph:heart'" class="w-5 h-5" />
            </button>
            <button
              class="p-2 bg-bg-elevated text-text-secondary rounded-lg hover:text-accent-primary transition-colors"
              title="Share Game"
              @click="shareGame"
            >
              <Icon name="ph:share-network" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Content -->
      <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-8 space-y-10">
        <!-- Game Details Card (only when playing) -->
        <div v-if="isPlaying" class="p-6 bg-bg-surface rounded-2xl">
          <h2 class="text-lg font-bold text-text-primary mb-3">About this game</h2>
          <p class="text-text-secondary mb-4">{{ game.description }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6">
            <NuxtLink
              v-for="tag in game.tags"
              :key="tag"
              :to="`/category/${tag}`"
              class="px-3 py-1.5 text-sm bg-bg-elevated text-text-secondary rounded-lg hover:bg-bg-hover hover:text-text-primary transition-colors"
            >
              {{ tag }}
            </NuxtLink>
          </div>

          <!-- Source Attribution -->
          <div class="pt-4 border-t border-bg-subtle">
            <SourceAttribution :game="game" variant="card" />
          </div>
        </div>

        <!-- Similar Games -->
        <section v-if="similarGames.length > 0">
          <GameCarouselRow
            title="Similar Games"
            icon="ph:squares-four-fill"
            :games="similarGames"
            :href="`/category/${game.category.toLowerCase()}`"
          />
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.play-btn {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(104, 66, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(104, 66, 255, 0.6);
  }
}
</style>
