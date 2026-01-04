type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  message: string
  title?: string
  type: ToastType
}

// Global toast state (singleton)
const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  const show = (message: string, type: ToastType = 'info', title?: string, duration = 4000) => {
    const id = ++toastId
    toasts.value.push({ id, message, title, type })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string) => show(message, 'success', title)
  const error = (message: string, title?: string) => show(message, 'error', title)
  const info = (message: string, title?: string) => show(message, 'info', title)
  const warning = (message: string, title?: string) => show(message, 'warning', title)

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    info,
    warning,
  }
}
