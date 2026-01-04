<script setup lang="ts">
// Quick filter categories with icons - static for performance
const quickFilters = [
  { label: 'All', path: '/category/all', icon: 'ph:squares-four-fill', color: 'brand' },
  { label: 'Action', path: '/category/action', icon: 'ph:lightning-fill', color: 'warm' },
  { label: 'Puzzle', path: '/category/puzzle', icon: 'ph:puzzle-piece-fill', color: 'cyan' },
  { label: 'Shooter', path: '/category/shooter', icon: 'ph:crosshair-fill', color: 'error' },
  { label: 'Racing', path: '/category/racing', icon: 'ph:car-fill', color: 'fresh' },
  { label: 'Sports', path: '/category/sports', icon: 'ph:soccer-ball-fill', color: 'warning' },
  { label: 'Arcade', path: '/category/arcade', icon: 'ph:game-controller-fill', color: 'pink' },
  { label: 'Adventure', path: '/category/adventure', icon: 'ph:compass-fill', color: 'cyan' },
  { label: 'Multiplayer', path: '/category/multiplayer', icon: 'ph:users-fill', color: 'fresh' },
  { label: 'Strategy', path: '/category/strategy', icon: 'ph:chess-fill', color: 'brand' },
]

const route = useRoute()
const currentCategory = computed(() => {
  const path = route.path
  if (path.startsWith('/category/')) {
    return path.replace('/category/', '')
  }
  return null
})
</script>

<template>
  <div class="quick-filters-container">
    <div class="quick-filters-scroll">
      <NuxtLink
        v-for="filter in quickFilters"
        :key="filter.path"
        :to="filter.path"
        class="filter-chip"
        :class="{
          'filter-chip-active': currentCategory === filter.path.replace('/category/', ''),
          [`filter-chip-${filter.color}`]: true
        }"
      >
        <Icon :name="filter.icon" class="w-4 h-4" />
        <span>{{ filter.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.quick-filters-container {
  @apply -mx-4 md:mx-0;
}

.quick-filters-scroll {
  @apply flex gap-2 px-4 md:px-0 overflow-x-auto pb-2;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.quick-filters-scroll::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  @apply flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap;
  @apply transition-all duration-200 shrink-0;
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.12);
  color: var(--text-secondary);
}

.filter-chip:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.25);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.filter-chip-active {
  color: white !important;
  border-color: transparent !important;
}

/* Color variants */
.filter-chip-brand.filter-chip-active {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
}

.filter-chip-warm.filter-chip-active {
  background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
}

.filter-chip-cyan.filter-chip-active {
  background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
}

.filter-chip-fresh.filter-chip-active {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
}

.filter-chip-warning.filter-chip-active {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
}

.filter-chip-pink.filter-chip-active {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);
}

.filter-chip-error.filter-chip-active {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
}

/* Icon colors when not active */
.filter-chip-brand:not(.filter-chip-active) .iconify { color: #a78bfa; }
.filter-chip-warm:not(.filter-chip-active) .iconify { color: #fb923c; }
.filter-chip-cyan:not(.filter-chip-active) .iconify { color: #22d3ee; }
.filter-chip-fresh:not(.filter-chip-active) .iconify { color: #34d399; }
.filter-chip-warning:not(.filter-chip-active) .iconify { color: #fbbf24; }
.filter-chip-pink:not(.filter-chip-active) .iconify { color: #f472b6; }
.filter-chip-error:not(.filter-chip-active) .iconify { color: #f87171; }
</style>
