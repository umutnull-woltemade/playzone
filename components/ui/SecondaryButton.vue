<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'ghost'
  color?: 'default' | 'accent' | 'cyan'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'outline',
  color: 'default',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonRef = ref<HTMLButtonElement | null>(null)

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const sizeClasses = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-base gap-2',
  lg: 'h-14 px-8 text-lg gap-2.5',
}

const iconSizes = {
  sm: 16,
  md: 18,
  lg: 22,
}
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    class="secondary-button"
    :class="[
      sizeClasses[size],
      variant,
      `color-${color}`,
      fullWidth && 'w-full',
      (disabled || loading) && 'disabled',
    ]"
    :disabled="disabled || loading"
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

    <!-- Left icon -->
    <Icon
      v-else-if="icon && iconPosition === 'left'"
      :name="icon"
      :size="iconSizes[size]"
    />

    <!-- Label -->
    <span>
      <slot />
    </span>

    <!-- Right icon -->
    <Icon
      v-if="!loading && icon && iconPosition === 'right'"
      :name="icon"
      :size="iconSizes[size]"
    />
  </button>
</template>

<style scoped>
.secondary-button {
  @apply relative inline-flex items-center justify-center font-semibold rounded-lg;
  @apply transition-all duration-200 ease-out;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void;
}

/* Outline variant */
.secondary-button.outline {
  @apply bg-transparent border-2;
}

.secondary-button.outline.color-default {
  @apply border-bg-subtle text-text-primary;
  @apply focus-visible:ring-text-secondary;
}

.secondary-button.outline.color-default:not(.disabled):hover {
  @apply border-text-muted bg-bg-subtle/50;
}

.secondary-button.outline.color-accent {
  @apply border-accent/50 text-accent-light;
  @apply focus-visible:ring-accent;
}

.secondary-button.outline.color-accent:not(.disabled):hover {
  @apply border-accent bg-accent-muted;
}

.secondary-button.outline.color-cyan {
  @apply border-cyan/50 text-cyan-light;
  @apply focus-visible:ring-cyan;
}

.secondary-button.outline.color-cyan:not(.disabled):hover {
  @apply border-cyan bg-cyan-muted;
}

/* Ghost variant */
.secondary-button.ghost {
  @apply bg-transparent border-0;
}

.secondary-button.ghost.color-default {
  @apply text-text-secondary;
  @apply focus-visible:ring-text-secondary;
}

.secondary-button.ghost.color-default:not(.disabled):hover {
  @apply text-text-primary bg-bg-subtle/50;
}

.secondary-button.ghost.color-accent {
  @apply text-accent-light;
  @apply focus-visible:ring-accent;
}

.secondary-button.ghost.color-accent:not(.disabled):hover {
  @apply text-accent bg-accent-muted;
}

.secondary-button.ghost.color-cyan {
  @apply text-cyan-light;
  @apply focus-visible:ring-cyan;
}

.secondary-button.ghost.color-cyan:not(.disabled):hover {
  @apply text-cyan bg-cyan-muted;
}

/* Hover animation */
.secondary-button:not(.disabled):hover {
  transform: translateY(-1px);
}

/* Active/pressed state */
.secondary-button:not(.disabled):active {
  transform: translateY(0) scale(0.98);
}

/* Disabled state */
.secondary-button.disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
