<script setup lang="ts">
interface FilterItem {
  id: string
  label: string
  icon: string
  href: string
  color?: string
}

interface Props {
  activeFilter?: string
}

defineProps<Props>()

const filters: FilterItem[] = [
  { id: 'all', label: 'All', icon: 'ph:squares-four-fill', href: '/category/all' },
  { id: 'trending', label: 'Trending', icon: 'ph:fire-fill', href: '/category/trending', color: 'warm' },
  { id: 'new', label: 'New', icon: 'ph:sparkle-fill', href: '/category/new', color: 'fresh' },
  { id: 'action', label: 'Action', icon: 'ph:lightning-fill', href: '/category/action' },
  { id: 'puzzle', label: 'Puzzle', icon: 'ph:puzzle-piece-fill', href: '/category/puzzle' },
  { id: 'racing', label: 'Racing', icon: 'ph:car-fill', href: '/category/racing' },
  { id: 'sports', label: 'Sports', icon: 'ph:soccer-ball-fill', href: '/category/sports' },
  { id: 'adventure', label: 'Adventure', icon: 'ph:compass-fill', href: '/category/adventure' },
  { id: 'arcade', label: 'Arcade', icon: 'ph:game-controller-fill', href: '/category/arcade' },
  { id: 'multiplayer', label: 'Multiplayer', icon: 'ph:users-fill', href: '/category/multiplayer' },
]

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
  const scrollAmount = 200
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  })
}

onMounted(() => {
  checkScrollPosition()
  scrollContainer.value?.addEventListener('scroll', checkScrollPosition)
})
</script>

<template>
  <div class="relative">
    <!-- Left Arrow -->
    <button
      v-show="canScrollLeft"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-bg-surface/90 hover:bg-bg-elevated rounded-full shadow-lg transition-all"
      @click="scrollBy('left')"
    >
      <Icon name="ph:caret-left-bold" class="w-4 h-4 text-text-secondary" />
    </button>

    <!-- Right Arrow -->
    <button
      v-show="canScrollRight"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-bg-surface/90 hover:bg-bg-elevated rounded-full shadow-lg transition-all"
      @click="scrollBy('right')"
    >
      <Icon name="ph:caret-right-bold" class="w-4 h-4 text-text-secondary" />
    </button>

    <!-- Filter Pills -->
    <div
      ref="scrollContainer"
      class="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-6 -mx-6"
    >
      <NuxtLink
        v-for="filter in filters"
        :key="filter.id"
        :to="filter.href"
        class="filter-pill flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
        :class="[
          activeFilter === filter.id
            ? 'bg-accent-primary text-white shadow-glow'
            : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
          filter.color === 'warm' && activeFilter !== filter.id ? 'hover:text-warm-accent' : '',
          filter.color === 'fresh' && activeFilter !== filter.id ? 'hover:text-fresh-primary' : '',
        ]"
      >
        <Icon
          :name="filter.icon"
          class="w-4 h-4"
          :class="[
            filter.color === 'warm' && activeFilter !== filter.id ? 'text-warm-accent' : '',
            filter.color === 'fresh' && activeFilter !== filter.id ? 'text-fresh-primary' : '',
            activeFilter === filter.id ? 'text-white' : 'text-accent-primary',
          ]"
        />
        {{ filter.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.filter-pill:hover {
  transform: translateY(-1px);
}
</style>
