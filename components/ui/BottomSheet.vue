<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  height?: 'auto' | 'half' | 'full'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showHandle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
  closeOnOverlay: true,
  closeOnEscape: true,
  showHandle: true,
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

const heightClasses = {
  auto: 'max-h-[85vh]',
  half: 'h-1/2',
  full: 'h-[95vh]',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="isVisible"
        class="sheet-overlay"
        :class="{ 'sheet-open': modelValue }"
        @click.self="handleOverlayClick"
      >
        <div
          class="sheet-container"
          :class="[
            heightClasses[height],
            modelValue ? 'sheet-visible' : 'sheet-hidden',
          ]"
        >
          <!-- Handle -->
          <div v-if="showHandle" class="sheet-handle-wrapper">
            <div class="sheet-handle" />
          </div>

          <!-- Header slot -->
          <div v-if="$slots.header" class="sheet-header">
            <slot name="header" />
          </div>

          <!-- Body -->
          <div class="sheet-body">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="sheet-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-overlay {
  @apply fixed inset-0 z-50 flex items-end justify-center;
  background: rgba(10, 11, 16, 0.7);
  backdrop-filter: blur(2px);
}

.sheet-container {
  @apply w-full flex flex-col;
  @apply rounded-t-2xl overflow-hidden;
  background: linear-gradient(
    180deg,
    rgba(26, 27, 40, 0.98) 0%,
    rgba(18, 19, 28, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: none;
  box-shadow:
    0 -8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-hidden {
  transform: translateY(100%);
}

.sheet-visible {
  transform: translateY(0);
}

.sheet-handle-wrapper {
  @apply flex justify-center py-3;
}

.sheet-handle {
  @apply w-10 h-1 rounded-full;
  background: rgba(255, 255, 255, 0.2);
}

.sheet-header {
  @apply px-6 pb-4;
  @apply border-b border-white/5;
}

.sheet-body {
  @apply flex-1 px-6 py-4 overflow-y-auto;
}

.sheet-footer {
  @apply px-6 py-4;
  @apply border-t border-white/5;
  /* Safe area for mobile */
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0));
}

/* Transitions */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
</style>
