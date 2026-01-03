<script setup lang="ts">
import { ref, provide } from 'vue'

const toastRef = ref<InstanceType<typeof ToastContainer> | null>(null)

// Provide toast methods globally
provide('toast', {
  success: (message: string, title?: string) => toastRef.value?.success(message, title),
  error: (message: string, title?: string) => toastRef.value?.error(message, title),
  warning: (message: string, title?: string) => toastRef.value?.warning(message, title),
  info: (message: string, title?: string) => toastRef.value?.info(message, title),
})
</script>

<template>
  <MotionBackground variant="calm" :particle-count="25">
    <div class="min-h-screen flex flex-col">
      <AppNavbar />
      <main class="flex-1 pt-16">
        <slot />
      </main>
      <AppFooter />
    </div>

    <!-- Global toast container -->
    <ToastContainer ref="toastRef" />
  </MotionBackground>
</template>
