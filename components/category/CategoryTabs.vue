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
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150"
        :class="!active
          ? 'bg-accent-muted text-accent-primary border border-accent-primary/30'
          : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary'"
      >
        <Icon name="ph:squares-four-fill" class="w-4 h-4" />
        <span>All</span>
      </NuxtLink>

      <!-- Categories -->
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/category/${category.slug}`"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150"
        :class="active === category.slug
          ? 'bg-accent-muted text-accent-primary border border-accent-primary/30'
          : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary'"
      >
        <Icon :name="category.icon" class="w-4 h-4" />
        <span>{{ category.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
