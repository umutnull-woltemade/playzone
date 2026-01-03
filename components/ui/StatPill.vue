<script setup lang="ts">
interface Props {
  value: string | number
  label?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'accent' | 'cyan' | 'pink' | 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'default',
})

const sizeClasses = {
  sm: 'px-2.5 py-1 text-xs gap-1.5',
  md: 'px-3 py-1.5 text-sm gap-2',
  lg: 'px-4 py-2 text-base gap-2.5',
}

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
}

const colorClasses = {
  default: 'bg-bg-elevated border-bg-subtle text-text-primary',
  accent: 'bg-accent-muted border-accent/30 text-accent-light',
  cyan: 'bg-cyan-muted border-cyan/30 text-cyan-light',
  pink: 'bg-pink-muted border-pink/30 text-pink-light',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
}

const trendIcons = {
  up: 'ph:trend-up',
  down: 'ph:trend-down',
  neutral: 'ph:minus',
}

const trendColors = {
  up: 'text-success',
  down: 'text-error',
  neutral: 'text-text-muted',
}
</script>

<template>
  <div
    class="stat-pill"
    :class="[sizeClasses[size], colorClasses[color]]"
  >
    <!-- Icon -->
    <Icon v-if="icon" :name="icon" :size="iconSizes[size]" class="opacity-70" />

    <!-- Value -->
    <span class="font-semibold">{{ value }}</span>

    <!-- Label -->
    <span v-if="label" class="text-text-secondary font-normal">{{ label }}</span>

    <!-- Trend -->
    <div v-if="trend" class="flex items-center gap-0.5" :class="trendColors[trend]">
      <Icon :name="trendIcons[trend]" :size="iconSizes[size]" />
      <span v-if="trendValue" class="text-2xs font-medium">{{ trendValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-pill {
  @apply inline-flex items-center rounded-full border;
  @apply transition-all duration-200;
}

.stat-pill:hover {
  @apply brightness-110;
}
</style>
