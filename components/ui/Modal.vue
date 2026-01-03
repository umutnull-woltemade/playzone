<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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
const isAnimating = ref(false)

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
      isAnimating.value = true
      isVisible.value = true
      document.body.style.overflow = 'hidden'
    } else {
      isAnimating.value = true
      setTimeout(() => {
        isVisible.value = false
        isAnimating.value = false
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
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="modal-overlay"
        :class="{ 'modal-open': modelValue }"
        @click.self="handleOverlayClick"
      >
        <div class="modal-container" :class="[sizeClasses[size]]">
          <!-- Close button -->
          <button
            v-if="showClose"
            class="modal-close"
            aria-label="Close modal"
            @click="close"
          >
            <Icon name="ph:x" :size="20" />
          </button>

          <!-- Header slot -->
          <div v-if="$slots.header" class="modal-header">
            <slot name="header" />
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
  background: rgba(10, 11, 16, 0.8);
  backdrop-filter: blur(4px);
}

.modal-container {
  @apply relative w-full rounded-xl overflow-hidden;
  background: linear-gradient(
    135deg,
    rgba(26, 27, 40, 0.95) 0%,
    rgba(18, 19, 28, 0.98) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.modal-close {
  @apply absolute top-4 right-4 p-2 rounded-lg;
  @apply text-text-secondary hover:text-text-primary;
  @apply hover:bg-bg-subtle/50;
  @apply transition-all duration-200;
  @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50;
  z-index: 10;
}

.modal-close:hover {
  transform: scale(1.05);
}

.modal-close:active {
  transform: scale(0.95);
}

.modal-header {
  @apply px-6 pt-6 pb-4;
  @apply border-b border-white/5;
}

.modal-body {
  @apply px-6 py-6;
}

.modal-footer {
  @apply px-6 pb-6 pt-4;
  @apply border-t border-white/5;
  @apply flex items-center justify-end gap-3;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-to .modal-container,
.modal-leave-from .modal-container {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
