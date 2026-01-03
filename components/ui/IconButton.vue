<script setup lang="ts">
interface Props {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'solid' | 'glass'
  color?: 'default' | 'accent' | 'cyan' | 'pink'
  disabled?: boolean
  loading?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'ghost',
  color: 'default',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
}
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :class="[
      sizeClasses[size],
      variant,
      `color-${color}`,
      (disabled || loading) && 'disabled',
    ]"
    :disabled="disabled || loading"
    :aria-label="label"
    :title="label"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      :width="iconSizes[size]"
      :height="iconSizes[size]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        class="opacity-25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        class="opacity-75"
      />
    </svg>

    <!-- Icon -->
    <Icon v-else :name="icon" :size="iconSizes[size]" />
  </button>
</template>

<style scoped>
.icon-button {
  @apply relative inline-flex items-center justify-center rounded-lg;
  @apply transition-all duration-200 ease-out;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void;
}

/* Ghost variant */
.icon-button.ghost {
  @apply bg-transparent;
}

.icon-button.ghost.color-default {
  @apply text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50;
  @apply focus-visible:ring-text-secondary;
}

.icon-button.ghost.color-accent {
  @apply text-accent-light hover:text-accent hover:bg-accent-muted;
  @apply focus-visible:ring-accent;
}

.icon-button.ghost.color-cyan {
  @apply text-cyan-light hover:text-cyan hover:bg-cyan-muted;
  @apply focus-visible:ring-cyan;
}

.icon-button.ghost.color-pink {
  @apply text-pink-light hover:text-pink hover:bg-pink-muted;
  @apply focus-visible:ring-pink;
}

/* Solid variant */
.icon-button.solid {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.icon-button.solid.color-default {
  @apply bg-bg-elevated text-text-primary hover:bg-bg-hover;
  @apply focus-visible:ring-text-secondary;
}

.icon-button.solid.color-accent {
  @apply bg-accent text-white hover:bg-accent-light;
  @apply focus-visible:ring-accent;
  box-shadow: 0 2px 12px rgba(124, 58, 237, 0.3);
}

.icon-button.solid.color-cyan {
  @apply bg-cyan text-white hover:bg-cyan-light;
  @apply focus-visible:ring-cyan;
  box-shadow: 0 2px 12px rgba(6, 182, 212, 0.3);
}

.icon-button.solid.color-pink {
  @apply bg-pink text-white hover:bg-pink-light;
  @apply focus-visible:ring-pink;
  box-shadow: 0 2px 12px rgba(236, 72, 153, 0.3);
}

/* Glass variant */
.icon-button.glass {
  @apply backdrop-blur-md;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.icon-button.glass.color-default {
  @apply text-text-primary;
  @apply focus-visible:ring-text-secondary;
}

.icon-button.glass.color-accent {
  @apply text-accent-light;
  @apply focus-visible:ring-accent;
}

.icon-button.glass.color-cyan {
  @apply text-cyan-light;
  @apply focus-visible:ring-cyan;
}

.icon-button.glass.color-pink {
  @apply text-pink-light;
  @apply focus-visible:ring-pink;
}

.icon-button.glass:not(.disabled):hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.12);
}

/* Hover animation */
.icon-button:not(.disabled):hover {
  transform: scale(1.05);
}

/* Active/pressed state */
.icon-button:not(.disabled):active {
  transform: scale(0.95);
}

/* Disabled state */
.icon-button.disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
