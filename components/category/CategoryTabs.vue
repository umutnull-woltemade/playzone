<script setup lang="ts">
const { categories } = useCategories()

interface Props {
  active?: string
}

const props = withDefaults(defineProps<Props>(), {
  active: '',
})

const emit = defineEmits<{
  select: [slug: string]
}>()
</script>

<template>
  <div class="relative -mx-4 px-4 overflow-x-auto scrollbar-hide">
    <div class="flex gap-2 pb-2">
      <!-- All Games -->
      <NuxtLink
        to="/"
        class="category-tab"
        :class="!active ? 'category-tab-active' : ''"
      >
        <Icon name="ph:squares-four-fill" class="w-4 h-4" />
        <span>All</span>
      </NuxtLink>

      <!-- Categories -->
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/category/${category.slug}`"
        class="category-tab"
        :class="active === category.slug ? 'category-tab-active' : ''"
      >
        <Icon :name="category.icon" class="w-4 h-4" />
        <span>{{ category.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.category-tab {
  @apply flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap;
  @apply bg-bg-surface text-text-secondary;
  @apply transition-all duration-200;
  border: 1px solid transparent;
}

.category-tab:hover {
  @apply bg-bg-elevated text-text-primary;
  border-color: rgba(139, 92, 246, 0.2);
}

.category-tab-active {
  @apply text-brand-light;
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
}
</style>
