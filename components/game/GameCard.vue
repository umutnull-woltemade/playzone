<script setup lang="ts">
import type { Game } from '~/types/game'

interface Props {
  game: Game
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const isHovering = ref(false)

// Size classes for responsive cards
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'aspect-[4/3]'
    case 'lg':
      return 'aspect-[16/10] md:col-span-2'
    case 'xl':
      return 'aspect-[16/9] md:col-span-2 md:row-span-2'
    default:
      return 'aspect-[4/3]'
  }
})

// Format play count for display
function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`
  return plays.toString()
}
</script>

<template>
  <NuxtLink
    :to="`/game/${game.slug}`"
    class="game-card group relative flex flex-col rounded-xl overflow-hidden cursor-pointer"
    :class="sizeClasses"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Thumbnail -->
    <div class="absolute inset-0">
      <img
        :src="game.thumbnail"
        :alt="game.title"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      <!-- Hover Glow Effect -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-t from-accent-primary/20 via-transparent to-transparent" />
        <div class="absolute inset-x-0 bottom-0 h-1 bg-accent-primary shadow-glow" />
      </div>
    </div>

    <!-- Badges (Top Left) -->
    <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
      <span
        v-if="game.isHot"
        class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-warm-accent text-white shadow-lg"
      >
        🔥 Hot
      </span>
      <span
        v-if="game.isNew"
        class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-fresh-primary text-bg-void shadow-lg"
      >
        New
      </span>
      <span
        v-if="game.isFeatured && !game.isHot && !game.isNew"
        class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-accent-primary text-white shadow-lg"
      >
        ⭐ Featured
      </span>
    </div>

    <!-- Play Count (Top Right) -->
    <div class="absolute top-2.5 right-2.5 z-10">
      <div class="flex items-center gap-1 px-2 py-1 bg-bg-void/70 backdrop-blur-sm rounded-md text-[11px] text-text-secondary">
        <Icon name="ph:play-circle-fill" class="w-3.5 h-3.5 text-accent-primary" />
        {{ formatPlays(game.plays) }}
      </div>
    </div>

    <!-- Content (Bottom) -->
    <div class="absolute bottom-0 left-0 right-0 p-3 z-10">
      <!-- Title & Category -->
      <h3 class="text-sm font-bold text-text-primary leading-tight line-clamp-1 group-hover:text-white transition-colors">
        {{ game.title }}
      </h3>
      <p class="text-[11px] text-text-muted mt-0.5 line-clamp-1">
        {{ game.category }}
      </p>
    </div>

    <!-- Hover Play Button -->
    <div class="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <div class="transform scale-75 group-hover:scale-100 transition-transform duration-300 ease-out">
        <div class="flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-full shadow-glow transition-all">
          <Icon name="ph:play-fill" class="w-5 h-5" />
          <span>Play</span>
        </div>
      </div>
    </div>

    <!-- Card Border Glow on Hover -->
    <div class="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-accent-primary/50 transition-colors duration-300 pointer-events-none" />
  </NuxtLink>
</template>

<style scoped>
.game-card {
  background: linear-gradient(135deg, #14151F 0%, #1C1D2A 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(104, 66, 255, 0.25);
}
</style>
