<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: is404.value ? 'Page Not Found - Andromeda Games' : 'Error - Andromeda Games',
})
</script>

<template>
  <div class="min-h-screen bg-bg-void flex items-center justify-center px-4">
    <!-- Background Effects -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink/10 rounded-full blur-3xl" />
    </div>

    <div class="relative text-center max-w-lg">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-bg-surface border border-brand/20">
          <Icon
            :name="is404 ? 'ph:planet' : 'ph:warning-circle'"
            class="w-16 h-16"
            :class="is404 ? 'text-brand-light' : 'text-error'"
          />
        </div>
      </div>

      <!-- Error Code -->
      <h1 class="text-7xl md:text-8xl font-bold mb-4">
        <span class="gradient-text">{{ error.statusCode }}</span>
      </h1>

      <!-- Error Message -->
      <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-4">
        {{ is404 ? 'Lost in Space' : 'Houston, We Have a Problem' }}
      </h2>

      <p class="text-text-secondary text-lg mb-8 max-w-md mx-auto">
        {{ is404
          ? "The page you're looking for has drifted off into another galaxy."
          : "Something went wrong. Don't worry, our team is on it!"
        }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          class="inline-flex items-center gap-3 px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand/30 hover:shadow-brand/50"
          @click="handleError"
        >
          <Icon name="ph:house-fill" class="w-5 h-5" />
          Back to Home
        </button>

        <NuxtLink
          to="/category/all"
          class="inline-flex items-center gap-3 px-8 py-4 bg-bg-surface hover:bg-bg-elevated text-text-primary font-semibold rounded-xl border border-brand/20 hover:border-brand/40 transition-all"
        >
          <Icon name="ph:game-controller" class="w-5 h-5" />
          Browse Games
        </NuxtLink>
      </div>

      <!-- Dev Error Details (only in dev) -->
      <div v-if="error.stack" class="mt-12 text-left">
        <details class="bg-bg-surface rounded-xl border border-brand/10 overflow-hidden">
          <summary class="px-4 py-3 text-sm text-text-muted cursor-pointer hover:bg-bg-elevated">
            Error Details (Dev Only)
          </summary>
          <pre class="p-4 text-xs text-text-muted overflow-auto max-h-48">{{ error.stack }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #c084fc 0%, #a78bfa 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-bg-void {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
    #0f0a1f;
}
</style>
