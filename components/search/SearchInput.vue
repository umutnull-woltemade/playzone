<script setup lang="ts">
const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
const isFocused = ref(false)
const { games } = useGames()

const results = computed(() => {
  if (!query.value || query.value.length < 2) return []
  const searchTerm = query.value.toLowerCase()
  return games.value
    .filter(game => game.title.toLowerCase().includes(searchTerm))
    .slice(0, 5)
})

const handleSelect = (slug: string) => {
  query.value = ''
  isFocused.value = false
  emit('search', slug)
  navigateTo(`/game/${slug}`)
}
</script>

<template>
  <div class="relative">
    <div
      class="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border rounded-lg transition-all duration-200"
      :class="isFocused ? 'border-accent-primary/50 ring-2 ring-accent-primary/20' : 'border-bg-subtle'"
    >
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
        class="px-1.5 py-0.5 text-xs text-text-muted bg-bg-elevated rounded border border-bg-subtle hidden sm:block"
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
    <div
      v-if="isFocused && results.length > 0"
      class="absolute top-full left-0 right-0 mt-2 p-2 bg-bg-surface border border-bg-subtle rounded-lg shadow-lg-dark max-h-[400px] overflow-y-auto z-50"
    >
      <button
        v-for="game in results"
        :key="game.id"
        class="w-full flex items-center gap-3 p-2 rounded-md hover:bg-bg-elevated transition-colors text-left"
        @click="handleSelect(game.slug)"
      >
        <img
          :src="game.thumbnail"
          :alt="game.title"
          class="w-12 h-9 object-cover rounded"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-text-primary truncate">{{ game.title }}</p>
          <p class="text-xs text-text-muted">{{ game.category }}</p>
        </div>
      </button>
    </div>

    <!-- No Results -->
    <div
      v-if="isFocused && query.length >= 2 && results.length === 0"
      class="absolute top-full left-0 right-0 mt-2 p-4 bg-bg-surface border border-bg-subtle rounded-lg shadow-lg-dark z-50"
    >
      <p class="text-sm text-text-muted text-center">No games found for "{{ query }}"</p>
    </div>
  </div>
</template>
