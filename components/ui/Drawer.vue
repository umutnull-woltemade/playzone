<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  side: 'right',
  size: 'md',
  closeOnOverlay: true,
  closeOnEscape: true,
  showClose: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const isVisible = ref(false)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      isVisible.value = true
      document.body.style.overflow = 'hidden'
    } else {
      setTimeout(() => {
        isVisible.value = false
        document.body.style.overflow = ''
      }, 300)
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})

const sizeClasses = {
  sm: 'w-72',
  md: 'w-80 md:w-96',
  lg: 'w-full max-w-lg',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="isVisible"
        class="drawer-overlay"
        :class="{ 'drawer-open': modelValue }"
        @click.self="handleOverlayClick"
      >
        <div
          class="drawer-container"
          :class="[
            sizeClasses[size],
            side === 'left' ? 'drawer-left' : 'drawer-right',
            modelValue ? 'drawer-visible' : 'drawer-hidden',
          ]"
        >
          <!-- Close button -->
          <button
            v-if="showClose"
            class="drawer-close"
            aria-label="Close drawer"
            @click="close"
          >
            <Icon name="ph:x" :size="20" />
          </button>

          <!-- Header slot -->
          <div v-if="$slots.header" class="drawer-header">
            <slot name="header" />
          </div>

          <!-- Body -->
          <div class="drawer-body">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="drawer-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  @apply fixed inset-0 z-50;
  background: rgba(10, 11, 16, 0.7);
  backdrop-filter: blur(2px);
}

.drawer-container {
  @apply fixed top-0 h-full flex flex-col;
  background: linear-gradient(
    180deg,
    rgba(26, 27, 40, 0.98) 0%,
    rgba(18, 19, 28, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 0 48px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-left {
  @apply left-0 border-r;
}

.drawer-right {
  @apply right-0 border-l;
}

.drawer-left.drawer-hidden {
  transform: translateX(-100%);
}

.drawer-right.drawer-hidden {
  transform: translateX(100%);
}

.drawer-visible {
  transform: translateX(0);
}

.drawer-close {
  @apply absolute top-4 right-4 p-2 rounded-lg;
  @apply text-text-secondary hover:text-text-primary;
  @apply hover:bg-bg-subtle/50;
  @apply transition-all duration-200;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50;
  z-index: 10;
}

.drawer-close:hover {
  transform: scale(1.05);
}

.drawer-header {
  @apply px-6 py-5;
  @apply border-b border-white/5;
}

.drawer-body {
  @apply flex-1 px-6 py-4 overflow-y-auto;
}

.drawer-footer {
  @apply px-6 py-4;
  @apply border-t border-white/5;
}

/* Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
