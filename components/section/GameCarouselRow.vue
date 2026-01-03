<script setup lang="ts">
import type { Game } from '~/types/game'

interface Props {
  title: string
  icon?: string
  games: Game[]
  href?: string
  showPlayCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'ph:game-controller-fill',
  showPlayCount: true,
})

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function checkScrollPosition() {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

function scrollBy(direction: 'left' | 'right') {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.8
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  })
}

onMounted(() => {
  checkScrollPosition()
  scrollContainer.value?.addEventListener('scroll', checkScrollPosition)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', checkScrollPosition)
})

function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`
  return plays.toString()
}
</script>

<template>
  <section class="game-row">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-accent-muted rounded-lg">
          <Icon :name="icon" class="w-5 h-5 text-accent-primary" />
        </div>
        <h2 class="text-lg md:text-xl font-bold text-text-primary">{{ title }}</h2>
      </div>

      <div class="flex items-center gap-2">
        <!-- Scroll Buttons -->
        <button
          :disabled="!canScrollLeft"
          class="p-2 rounded-lg bg-bg-surface hover:bg-bg-elevated text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          @click="scrollBy('left')"
        >
          <Icon name="ph:caret-left-bold" class="w-4 h-4" />
        </button>
        <button
          :disabled="!canScrollRight"
          class="p-2 rounded-lg bg-bg-surface hover:bg-bg-elevated text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          @click="scrollBy('right')"
        >
          <Icon name="ph:caret-right-bold" class="w-4 h-4" />
        </button>

        <!-- View All Link -->
        <NuxtLink
          v-if="href"
          :to="href"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent-primary hover:text-accent-hover hover:bg-accent-muted rounded-lg transition-all"
        >
          View All
          <Icon name="ph:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Scrollable Game List -->
    <div class="relative">
      <!-- Left Fade -->
      <div
        v-show="canScrollLeft"
        class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-void to-transparent z-10 pointer-events-none"
      />

      <!-- Right Fade -->
      <div
        v-show="canScrollRight"
        class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-void to-transparent z-10 pointer-events-none"
      />

      <!-- Games -->
      <div
        ref="scrollContainer"
        class="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
      >
        <NuxtLink
          v-for="game in games"
          :key="game.id"
          :to="`/game/${game.slug}`"
          class="game-card group flex-shrink-0 w-36 md:w-44 lg:w-48"
        >
          <!-- Thumbnail -->
          <div class="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
            <img
              :src="game.thumbnail"
              :alt="game.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-bg-void/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <!-- Play Button -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div class="p-3 bg-accent-primary rounded-full shadow-glow transform scale-75 group-hover:scale-100 transition-transform">
                <Icon name="ph:play-fill" class="w-5 h-5 text-white" />
              </div>
            </div>

            <!-- Badges -->
            <div class="absolute top-2 left-2 flex gap-1">
              <span
                v-if="game.isHot"
                class="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-warm-accent text-white rounded"
              >
                Hot
              </span>
              <span
                v-else-if="game.isNew"
                class="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-fresh-primary text-bg-void rounded"
              >
                New
              </span>
            </div>

            <!-- Play Count -->
            <div v-if="showPlayCount" class="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-bg-void/70 backdrop-blur-sm rounded text-[10px] text-text-secondary">
              <Icon name="ph:play" class="w-3 h-3" />
              {{ formatPlays(game.plays) }}
            </div>

            <!-- Border on Hover -->
            <div class="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-accent-primary/50 transition-colors pointer-events-none" />
          </div>

          <!-- Title -->
          <h3 class="text-sm font-medium text-text-primary truncate group-hover:text-white transition-colors">
            {{ game.title }}
          </h3>
          <p class="text-xs text-text-muted truncate">{{ game.category }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.game-card {
  transition: transform 0.2s ease;
}

.game-card:hover {
  transform: translateY(-2px);
}
</style>
