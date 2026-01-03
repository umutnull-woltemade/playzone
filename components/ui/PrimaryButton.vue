<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'gradient'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'gradient',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonRef = ref<HTMLButtonElement | null>(null)
const ripples = ref<Array<{ id: number; x: number; y: number }>>([])
let rippleId = 0

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return

  // Create ripple effect
  const button = buttonRef.value
  if (button) {
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const id = rippleId++
    ripples.value.push({ id, x, y })

    setTimeout(() => {
      ripples.value = ripples.value.filter((r) => r.id !== id)
    }, 600)
  }

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
    class="primary-button"
    :class="[
      sizeClasses[size],
      variant,
      fullWidth && 'w-full',
      (disabled || loading) && 'disabled',
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Glow effect -->
    <div class="button-glow" />

    <!-- Content -->
    <div class="button-content">
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
      <span class="relative z-10">
        <slot />
      </span>

      <!-- Right icon -->
      <Icon
        v-if="!loading && icon && iconPosition === 'right'"
        :name="icon"
        :size="iconSizes[size]"
      />
    </div>

    <!-- Ripple effects -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="ripple"
      :style="{
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
      }"
    />
  </button>
</template>

<style scoped>
.primary-button {
  @apply relative inline-flex items-center justify-center font-semibold rounded-lg overflow-hidden;
  @apply transition-all duration-300 ease-out;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void;
}

.primary-button.solid {
  @apply bg-accent text-white;
  box-shadow:
    0 2px 8px rgba(124, 58, 237, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.primary-button.gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #ec4899 100%);
  background-size: 200% 200%;
  @apply text-white;
  box-shadow:
    0 2px 12px rgba(124, 58, 237, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.button-glow {
  @apply absolute inset-0 opacity-0 transition-opacity duration-300;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
}

.button-content {
  @apply relative z-10 flex items-center justify-center gap-2;
}

/* Hover states */
.primary-button:not(.disabled):hover {
  transform: translateY(-1px);
}

.primary-button.solid:not(.disabled):hover {
  @apply bg-accent-light;
  box-shadow:
    0 4px 16px rgba(124, 58, 237, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.primary-button.gradient:not(.disabled):hover {
  background-position: 100% 100%;
  box-shadow:
    0 4px 20px rgba(124, 58, 237, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.primary-button:not(.disabled):hover .button-glow {
  opacity: 1;
}

/* Active/pressed state */
.primary-button:not(.disabled):active {
  transform: translateY(0) scale(0.98);
}

/* Disabled state */
.primary-button.disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Ripple effect */
.ripple {
  @apply absolute rounded-full pointer-events-none;
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -100px;
  background: rgba(255, 255, 255, 0.3);
  animation: rippleExpand 0.6s ease-out forwards;
}

@keyframes rippleExpand {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
