<script setup lang="ts">
import type { Game } from '~/types/game'

interface Props {
  games: Game[]
}

const props = defineProps<Props>()

const currentIndex = ref(0)
const isAutoPlaying = ref(true)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const currentGame = computed(() => props.games[currentIndex.value])

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.games.length
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + props.games.length) % props.games.length
}

function goToSlide(index: number) {
  currentIndex.value = index
}

function pauseAutoPlay() {
  isAutoPlaying.value = false
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

function resumeAutoPlay() {
  isAutoPlaying.value = true
  startAutoPlay()
}

function startAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(() => {
    if (isAutoPlaying.value) {
      nextSlide()
    }
  }, 5000)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})

function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`
  return plays.toString()
}
</script>

<template>
  <div
    class="featured-carousel relative rounded-2xl overflow-hidden"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- Main Slide -->
    <div class="relative aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1]">
      <!-- Background Image -->
      <transition name="fade" mode="out-in">
        <div :key="currentGame?.id" class="absolute inset-0">
          <img
            v-if="currentGame"
            :src="currentGame.thumbnail"
            :alt="currentGame.title"
            class="w-full h-full object-cover"
          />
          <!-- Overlays -->
          <div class="absolute inset-0 bg-gradient-to-r from-bg-void via-bg-void/70 to-transparent" />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-void via-transparent to-transparent opacity-80" />
        </div>
      </transition>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="w-full max-w-2xl px-6 md:px-10 lg:px-14">
          <transition name="slide-up" mode="out-in">
            <div :key="currentGame?.id" class="space-y-4">
              <!-- Badges -->
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-accent-primary text-white rounded-md">
                  Featured
                </span>
                <span v-if="currentGame?.isHot" class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-warm-accent text-white rounded-md">
                  🔥 Trending
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {{ currentGame?.title }}
              </h2>

              <!-- Description -->
              <p class="text-sm md:text-base text-text-secondary line-clamp-2 max-w-lg">
                {{ currentGame?.description }}
              </p>

              <!-- Meta -->
              <div class="flex items-center gap-4 text-sm text-text-muted">
                <span class="flex items-center gap-1.5">
                  <Icon name="ph:game-controller-fill" class="w-4 h-4 text-accent-primary" />
                  {{ currentGame?.category }}
                </span>
                <span class="flex items-center gap-1.5">
                  <Icon name="ph:play-circle-fill" class="w-4 h-4 text-accent-primary" />
                  {{ formatPlays(currentGame?.plays || 0) }} plays
                </span>
              </div>

              <!-- CTA Button -->
              <NuxtLink
                v-if="currentGame"
                :to="`/game/${currentGame.slug}`"
                class="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-xl shadow-glow transition-all duration-300 hover:scale-105 mt-2"
              >
                <Icon name="ph:play-fill" class="w-5 h-5" />
                Play Now
              </NuxtLink>
            </div>
          </transition>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-bg-void/60 hover:bg-bg-void/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        :class="{ 'opacity-100': !isAutoPlaying }"
        @click="prevSlide"
      >
        <Icon name="ph:caret-left-bold" class="w-5 h-5" />
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-bg-void/60 hover:bg-bg-void/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        :class="{ 'opacity-100': !isAutoPlaying }"
        @click="nextSlide"
      >
        <Icon name="ph:caret-right-bold" class="w-5 h-5" />
      </button>

      <!-- Dots Indicator -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          v-for="(game, index) in games"
          :key="game.id"
          class="relative h-1.5 rounded-full transition-all duration-300"
          :class="index === currentIndex ? 'w-8 bg-accent-primary' : 'w-1.5 bg-white/40 hover:bg-white/60'"
          @click="goToSlide(index)"
        />
      </div>

      <!-- Thumbnail Strip (Desktop) -->
      <div class="absolute bottom-4 right-4 hidden lg:flex items-center gap-2">
        <button
          v-for="(game, index) in games"
          :key="game.id"
          class="relative w-16 h-10 rounded-lg overflow-hidden transition-all duration-300"
          :class="index === currentIndex ? 'ring-2 ring-accent-primary scale-110' : 'opacity-60 hover:opacity-100'"
          @click="goToSlide(index)"
        >
          <img :src="game.thumbnail" :alt="game.title" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-carousel {
  background: linear-gradient(135deg, #14151F 0%, #0C0D14 100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
