<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  dismissible?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const defaultIcons = {
  info: 'ph:info',
  success: 'ph:check-circle',
  warning: 'ph:warning',
  error: 'ph:x-circle',
}

const iconName = computed(() => props.icon || defaultIcons[props.type])

const colorClasses = computed(() => {
  const colors = {
    info: {
      bg: 'bg-info/5',
      border: 'border-info/20',
      icon: 'text-info',
      title: 'text-info',
    },
    success: {
      bg: 'bg-success/5',
      border: 'border-success/20',
      icon: 'text-success',
      title: 'text-success',
    },
    warning: {
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      icon: 'text-warning',
      title: 'text-warning',
    },
    error: {
      bg: 'bg-error/5',
      border: 'border-error/20',
      icon: 'text-error',
      title: 'text-error',
    },
  }
  return colors[props.type]
})
</script>

<template>
  <div
    class="status-banner"
    :class="[colorClasses.bg, colorClasses.border]"
    role="status"
  >
    <!-- Icon -->
    <div class="banner-icon" :class="colorClasses.icon">
      <Icon :name="iconName" :size="20" />
    </div>

    <!-- Content -->
    <div class="banner-content">
      <p v-if="title" class="banner-title" :class="colorClasses.title">
        {{ title }}
      </p>
      <div class="banner-message">
        <slot />
      </div>
    </div>

    <!-- Actions slot -->
    <div v-if="$slots.actions" class="banner-actions">
      <slot name="actions" />
    </div>

    <!-- Dismiss button -->
    <button
      v-if="dismissible"
      class="banner-dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <Icon name="ph:x" :size="18" />
    </button>
  </div>
</template>

<style scoped>
.status-banner {
  @apply flex items-start gap-3 p-4 rounded-lg border;
  animation: bannerFadeIn 0.3s ease-out;
}

.banner-icon {
  @apply flex-shrink-0 mt-0.5;
}

.banner-content {
  @apply flex-1 min-w-0;
}

.banner-title {
  @apply font-semibold text-sm mb-1;
}

.banner-message {
  @apply text-text-secondary text-sm;
}

.banner-actions {
  @apply flex-shrink-0 flex items-center gap-2;
}

.banner-dismiss {
  @apply flex-shrink-0 p-1 -mr-1 rounded;
  @apply text-text-muted hover:text-text-secondary;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20;
}

@keyframes bannerFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
