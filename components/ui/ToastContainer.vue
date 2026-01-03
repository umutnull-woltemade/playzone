<script setup lang="ts">
import { ref } from 'vue'

export interface ToastItem {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<ToastItem[]>([])
let toastId = 0

const addToast = (toast: Omit<ToastItem, 'id'>) => {
  const id = toastId++
  const duration = toast.duration ?? 5000

  toasts.value.push({ ...toast, id })

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods for external use
defineExpose({
  addToast,
  removeToast,
  success: (message: string, title?: string) =>
    addToast({ type: 'success', message, title }),
  error: (message: string, title?: string) =>
    addToast({ type: 'error', message, title }),
  warning: (message: string, title?: string) =>
    addToast({ type: 'warning', message, title }),
  info: (message: string, title?: string) =>
    addToast({ type: 'info', message, title }),
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          @dismiss="removeToast(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  @apply fixed top-4 right-4 z-[100] flex flex-col gap-3;
  @apply w-full max-w-sm;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

/* List transitions */
.toast-list-enter-active {
  transition: all 0.3s ease-out;
}

.toast-list-leave-active {
  transition: all 0.2s ease-in;
  position: absolute;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
