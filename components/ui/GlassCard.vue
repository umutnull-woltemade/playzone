<script setup lang="ts">
interface Props {
  hover?: boolean
  glow?: 'accent' | 'cyan' | 'pink' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'lg' | 'xl'
  blur?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hover: true,
  glow: 'none',
  padding: 'md',
  rounded: 'lg',
  blur: 'md',
  interactive: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
}

const roundedClasses = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
}

const glowClasses = {
  none: '',
  accent: 'hover:shadow-glow',
  cyan: 'hover:shadow-glow-cyan',
  pink: 'hover:shadow-glow-pink',
}
</script>

<template>
  <div
    class="glass-card"
    :class="[
      paddingClasses[padding],
      roundedClasses[rounded],
      blurClasses[blur],
      hover && 'glass-card-hover',
      glow !== 'none' && glowClasses[glow],
      interactive && 'cursor-pointer',
    ]"
    @click="emit('click', $event)"
  >
    <!-- Inner glow border -->
    <div class="glass-card-border" :class="roundedClasses[rounded]" />

    <!-- Content -->
    <div class="relative z-10">
      <slot />
    </div>

    <!-- Shimmer effect on hover -->
    <div v-if="hover" class="glass-card-shimmer" :class="roundedClasses[rounded]" />
  </div>
</template>

<style scoped>
.glass-card {
  @apply relative overflow-hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.glass-card-border {
  @apply absolute inset-0 pointer-events-none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glass-card-shimmer {
  @apply absolute inset-0 pointer-events-none opacity-0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: opacity 0.3s ease;
}

.glass-card-hover:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.glass-card-hover:hover .glass-card-border {
  opacity: 1;
}

.glass-card-hover:hover .glass-card-shimmer {
  opacity: 1;
  animation: shimmerSlide 1s ease forwards;
}

@keyframes shimmerSlide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Focus state for accessibility */
.glass-card:focus-visible {
  @apply outline-none ring-2 ring-accent/50 ring-offset-2 ring-offset-bg-void;
}
</style>
