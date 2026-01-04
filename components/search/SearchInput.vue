<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
const debouncedQuery = ref('')
const isFocused = ref(false)
const { games } = useGames()

// Debounce search input to avoid filtering on every keystroke
const updateDebouncedQuery = useDebounceFn((value: string) => {
  debouncedQuery.value = value
}, 300)

// Watch query changes and debounce
watch(query, (newValue) => {
  updateDebouncedQuery(newValue)
})

const results = computed(() => {
  if (!debouncedQuery.value || debouncedQuery.value.length < 2) return []
  const searchTerm = debouncedQuery.value.toLowerCase()
  return games.value
    .filter(game => game.title.toLowerCase().includes(searchTerm))
    .slice(0, 5)
})

const handleSelect = (slug: string) => {
  query.value = ''
  debouncedQuery.value = ''
  isFocused.value = false
  emit('search', slug)
  navigateTo(`/game/${slug}`)
}
</script>

<template>
  <div class="relative">
    <div class="search-container" :class="{ 'search-focused': isFocused }">
      <Icon name="ph:magnifying-glass" class="w-5 h-5 text-text-muted shrink-0" />
      <input
        v-model="query"
        type="text"
        placeholder="Search games..."
        class="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-sm"
        @focus="isFocused = true"
        @blur="setTimeout(() => isFocused = false, 200)"
      />
      <kbd
        v-if="!isFocused && !query"
        class="px-1.5 py-0.5 text-xs text-text-muted bg-bg-elevated rounded-md border border-brand/20 hidden sm:block"
      >
        /
      </kbd>
      <button
        v-if="query"
        class="p-1 text-text-muted hover:text-text-primary transition-colors"
        @click="query = ''"
      >
        <Icon name="ph:x" class="w-4 h-4" />
      </button>
    </div>

    <!-- Dropdown Results -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isFocused && results.length > 0"
        class="search-dropdown"
      >
        <button
          v-for="game in results"
          :key="game.id"
          class="search-result"
          @click="handleSelect(game.slug)"
        >
          <img
            :src="game.thumbnail"
            :alt="game.title"
            class="w-12 h-9 object-cover rounded-lg"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ game.title }}</p>
            <p class="text-xs text-text-muted">{{ game.category }}</p>
          </div>
          <Icon name="ph:arrow-right" class="w-4 h-4 text-brand-light opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </Transition>

    <!-- No Results -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isFocused && query.length >= 2 && results.length === 0"
        class="search-dropdown p-4"
      >
        <p class="text-sm text-text-muted text-center">No games found for "{{ query }}"</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-container {
  @apply flex items-center gap-2 px-4 py-2.5 rounded-xl;
  background: rgba(22, 15, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.1);
  transition: all 0.2s ease;
}

.search-focused {
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
}

.search-dropdown {
  @apply absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl max-h-[400px] overflow-y-auto z-50;
  background: rgba(20, 15, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1);
}

.search-result {
  @apply w-full flex items-center gap-3 p-2 rounded-xl text-left;
  @apply transition-all duration-200;
}

.search-result:hover {
  background: rgba(139, 92, 246, 0.15);
}
</style>
