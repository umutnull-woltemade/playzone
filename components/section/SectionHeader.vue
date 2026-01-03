<script setup lang="ts">
interface Props {
  title: string
  icon?: string
  count?: number
  href?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center gap-3">
      <Icon v-if="icon" :name="icon" class="w-6 h-6 text-accent-primary" />
      <h2 class="text-xl font-semibold text-text-primary font-display">{{ title }}</h2>
      <span
        v-if="count"
        class="px-2 py-0.5 text-xs font-medium text-text-muted bg-bg-elevated rounded-full"
      >
        {{ count }}
      </span>
    </div>
    <NuxtLink
      v-if="href"
      :to="href"
      class="flex items-center gap-1 text-sm font-medium text-accent-primary transition-colors hover:text-accent-hover"
    >
      See All
      <Icon name="ph:caret-right" class="w-4 h-4" />
    </NuxtLink>
  </div>
</template>
