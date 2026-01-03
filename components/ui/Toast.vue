<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  showIcon?: boolean
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  showIcon: true,
  dismissible: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const icons = {
  info: 'ph:info',
  success: 'ph:check-circle',
  warning: 'ph:warning',
  error: 'ph:x-circle',
}

const colorClasses = computed(() => {
  const colors = {
    info: {
      bg: 'bg-info/10',
      border: 'border-info/30',
      icon: 'text-info',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      icon: 'text-success',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      icon: 'text-warning',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error/30',
      icon: 'text-error',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    },
  }
  return colors[props.type]
})
</script>

<template>
  <div
    class="toast"
    :class="[colorClasses.bg, colorClasses.border, colorClasses.glow]"
    role="alert"
  >
    <!-- Icon -->
    <div v-if="showIcon" class="toast-icon" :class="colorClasses.icon">
      <Icon :name="icons[type]" :size="20" />
    </div>

    <!-- Content -->
    <div class="toast-content">
      <p v-if="title" class="toast-title">{{ title }}</p>
      <p class="toast-message">{{ message }}</p>
    </div>

    <!-- Dismiss button -->
    <button
      v-if="dismissible"
      class="toast-dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <Icon name="ph:x" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.toast {
  @apply flex items-start gap-3 p-4 rounded-lg border;
  @apply backdrop-blur-md;
  animation: toastSlideIn 0.3s ease-out;
}

.toast-icon {
  @apply flex-shrink-0 mt-0.5;
}

.toast-content {
  @apply flex-1 min-w-0;
}

.toast-title {
  @apply font-semibold text-text-primary text-sm mb-0.5;
}

.toast-message {
  @apply text-text-secondary text-sm;
}

.toast-dismiss {
  @apply flex-shrink-0 p-1 -mr-1 rounded;
  @apply text-text-muted hover:text-text-secondary;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20;
}

@keyframes toastSlideIn {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
