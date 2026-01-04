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
    class="game-card group"
    :class="sizeClasses"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Thumbnail -->
    <div class="absolute inset-0 overflow-hidden rounded-2xl">
      <img
        :src="game.thumbnail"
        :alt="game.title"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <!-- Gradient Overlay -->
      <div class="card-overlay" />

      <!-- Hover Glow Effect -->
      <div class="hover-glow">
        <div class="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-brand via-pink to-cyan rounded-b-2xl" />
      </div>
    </div>

    <!-- Shimmer on hover -->
    <div class="shimmer-effect" />

    <!-- Badges (Top Left) -->
    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
      <span v-if="game.isHot" class="badge badge-hot">
        <Icon name="ph:fire-fill" class="w-3 h-3" />
        Hot
      </span>
      <span v-if="game.isNew" class="badge badge-new">
        <Icon name="ph:sparkle-fill" class="w-3 h-3" />
        New
      </span>
      <span v-if="game.isFeatured && !game.isHot && !game.isNew" class="badge badge-featured">
        <Icon name="ph:star-fill" class="w-3 h-3" />
        Featured
      </span>
    </div>

    <!-- Play Count (Top Right) -->
    <div class="absolute top-3 right-3 z-10">
      <div class="stat-badge">
        <Icon name="ph:play-circle-fill" class="w-3.5 h-3.5 text-brand-light" />
        {{ formatPlays(game.plays) }}
      </div>
    </div>

    <!-- Content (Bottom) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 z-10">
      <h3 class="text-sm font-bold text-text-primary leading-tight line-clamp-1 group-hover:text-white transition-colors duration-200">
        {{ game.title }}
      </h3>
      <p class="text-[11px] text-text-muted mt-1 line-clamp-1 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-light"></span>
        {{ game.category }}
      </p>
    </div>

    <!-- Hover Play Button -->
    <div class="play-button-wrapper">
      <div class="play-button">
        <Icon name="ph:play-fill" class="w-5 h-5" />
        <span>Play Now</span>
      </div>
    </div>

    <!-- Card Border Glow -->
    <div class="card-border" />
  </NuxtLink>
</template>

<style scoped>
.game-card {
  @apply relative flex flex-col rounded-2xl overflow-hidden cursor-pointer;
  background: linear-gradient(135deg, rgba(22, 15, 42, 0.9) 0%, rgba(15, 10, 31, 0.95) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.game-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(139, 92, 246, 0.3),
    0 0 40px rgba(139, 92, 246, 0.15);
}

.card-overlay {
  @apply absolute inset-0 transition-opacity duration-500;
  background: linear-gradient(
    to top,
    rgba(15, 10, 31, 0.95) 0%,
    rgba(15, 10, 31, 0.4) 40%,
    rgba(15, 10, 31, 0.1) 100%
  );
}

.game-card:hover .card-overlay {
  background: linear-gradient(
    to top,
    rgba(15, 10, 31, 0.98) 0%,
    rgba(15, 10, 31, 0.6) 50%,
    rgba(15, 10, 31, 0.3) 100%
  );
}

.hover-glow {
  @apply absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none;
}

.game-card:hover .hover-glow {
  @apply opacity-100;
}

.shimmer-effect {
  @apply absolute inset-0 pointer-events-none opacity-0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(139, 92, 246, 0.05) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: opacity 0.3s ease;
}

.game-card:hover .shimmer-effect {
  @apply opacity-100;
  animation: shimmerSlide 1.5s ease-out;
}

@keyframes shimmerSlide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.badge {
  @apply flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg;
  backdrop-filter: blur(8px);
}

.badge-hot {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  @apply text-white;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

.badge-new {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  @apply text-white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.badge-featured {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  @apply text-white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.stat-badge {
  @apply flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-text-secondary;
  background: rgba(15, 10, 31, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.play-button-wrapper {
  @apply absolute inset-0 flex items-center justify-center z-10;
  @apply opacity-0 transition-all duration-300;
}

.game-card:hover .play-button-wrapper {
  @apply opacity-100;
}

.play-button {
  @apply flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c084fc 100%);
  background-size: 200% 200%;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
  transform: scale(0.85);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.game-card:hover .play-button {
  transform: scale(1);
}

.play-button:hover {
  background-position: 100% 100%;
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.6);
}

.card-border {
  @apply absolute inset-0 rounded-2xl pointer-events-none;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.game-card:hover .card-border {
  border-color: rgba(139, 92, 246, 0.4);
}
</style>
