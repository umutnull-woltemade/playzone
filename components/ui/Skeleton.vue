<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string
  height?: string
  animation?: 'pulse' | 'shimmer' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rectangular',
  animation: 'shimmer',
})

const variantClasses = {
  text: 'rounded h-4',
  circular: 'rounded-full aspect-square',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg',
}

const animationClasses = {
  pulse: 'animate-pulse',
  shimmer: 'skeleton-shimmer',
  none: '',
}
</script>

<template>
  <div
    class="skeleton"
    :class="[variantClasses[variant], animationClasses[animation]]"
    :style="{
      width: width,
      height: height,
    }"
  />
</template>

<style scoped>
.skeleton {
  @apply bg-bg-subtle;
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer::after {
    animation: none;
  }

  .skeleton {
    @apply animate-none;
  }
}
</style>
