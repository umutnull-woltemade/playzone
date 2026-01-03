<script setup lang="ts">
interface Props {
  density?: 'default' | 'compact' | 'comfortable' | 'featured'
}

withDefaults(defineProps<Props>(), {
  density: 'default',
})
</script>

<template>
  <div
    class="grid gap-4"
    :class="{
      'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6': density === 'default',
      'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8': density === 'compact',
      'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5': density === 'comfortable',
      'grid-cols-2 md:grid-cols-4 lg:grid-cols-6': density === 'featured',
    }"
  >
    <slot />
  </div>
</template>
