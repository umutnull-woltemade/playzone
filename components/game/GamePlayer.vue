<script setup lang="ts">
import type { Game } from '~/types/game'

interface Props {
  game: Game
}

const props = defineProps<Props>()

const isLoading = ref(true)
const hasError = ref(false)
const isFullscreen = ref(false)
const isMuted = ref(false)
const playerContainer = ref<HTMLDivElement | null>(null)
const gameIframe = ref<HTMLIFrameElement | null>(null)

/**
 * Build the proper embed URL with tracking parameters
 */
const embedUrl = computed(() => {
  if (!props.game.embedUrl) return ''

  try {
    const url = new URL(props.game.embedUrl)
    // Add publisher tracking if not present
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'playzone')
    }
    return url.toString()
  } catch {
    return props.game.embedUrl
  }
})

/**
 * Toggle fullscreen mode
 */
const toggleFullscreen = async () => {
  if (!playerContainer.value) return

  try {
    if (!document.fullscreenElement) {
      await playerContainer.value.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (error) {
    console.error('Fullscreen error:', error)
  }
}

/**
 * Handle iframe load event
 */
const onIframeLoad = () => {
  isLoading.value = false
  hasError.value = false
}

/**
 * Handle iframe error
 */
const onIframeError = () => {
  isLoading.value = false
  hasError.value = true
}

/**
 * Reload the game
 */
const reloadGame = () => {
  isLoading.value = true
  hasError.value = false
  if (gameIframe.value) {
    gameIframe.value.src = embedUrl.value
  }
}

// Listen for fullscreen changes
onMounted(() => {
  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
  }

  document.addEventListener('fullscreenchange', handleFullscreenChange)

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })
})
</script>

<template>
  <div
    ref="playerContainer"
    class="game-player relative bg-bg-void rounded-xl overflow-hidden"
    :class="{ 'fixed inset-0 z-50 rounded-none': isFullscreen }"
  >
    <!-- Player Container -->
    <div
      class="relative"
      :class="isFullscreen ? 'h-full' : 'aspect-video'"
    >
      <!-- Game iFrame -->
      <iframe
        v-if="embedUrl"
        ref="gameIframe"
        :src="embedUrl"
        :title="game.title"
        class="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope"
        allowfullscreen
        loading="eager"
        @load="onIframeLoad"
        @error="onIframeError"
      />

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-bg-void text-text-secondary"
      >
        <div class="relative">
          <div class="w-16 h-16 border-4 border-bg-subtle border-t-accent-primary rounded-full animate-spin" />
          <Icon
            name="ph:game-controller-fill"
            class="absolute inset-0 m-auto w-8 h-8 text-accent-primary"
          />
        </div>
        <div class="text-center">
          <p class="text-lg font-medium text-text-primary">Loading {{ game.title }}</p>
          <p class="text-sm text-text-muted mt-1">Powered by GamePix</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-if="hasError && !isLoading"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-bg-void text-text-secondary"
      >
        <Icon name="ph:warning-circle" class="w-16 h-16 text-error" />
        <div class="text-center">
          <p class="text-lg font-medium text-text-primary">Failed to load game</p>
          <p class="text-sm text-text-muted mt-1">Please try again or choose another game</p>
        </div>
        <button
          class="mt-4 px-5 py-2 bg-accent-primary text-bg-void font-semibold rounded-md hover:bg-accent-hover transition-colors"
          @click="reloadGame"
        >
          <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2 inline" />
          Retry
        </button>
      </div>

      <!-- Provider Badge -->
      <div
        v-if="game.provider === 'gamepix'"
        class="absolute top-3 left-3 z-20 px-2 py-1 bg-bg-void/80 text-xs text-text-muted rounded backdrop-blur-sm"
      >
        Powered by GamePix
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="absolute bottom-4 right-4 z-20 flex gap-2">
      <button
        class="p-2 bg-bg-void/80 text-text-secondary rounded-lg backdrop-blur-sm transition-all hover:bg-bg-surface hover:text-text-primary"
        title="Toggle Fullscreen"
        @click="toggleFullscreen"
      >
        <Icon v-if="!isFullscreen" name="ph:arrows-out" class="w-5 h-5" />
        <Icon v-else name="ph:arrows-in" class="w-5 h-5" />
      </button>
      <button
        class="p-2 bg-bg-void/80 text-text-secondary rounded-lg backdrop-blur-sm transition-all hover:bg-bg-surface hover:text-text-primary"
        title="Reload Game"
        @click="reloadGame"
      >
        <Icon name="ph:arrow-clockwise" class="w-5 h-5" />
      </button>
      <button
        class="p-2 bg-bg-void/80 text-text-secondary rounded-lg backdrop-blur-sm transition-all hover:bg-bg-surface hover:text-text-primary"
        title="Report Issue"
      >
        <Icon name="ph:flag" class="w-5 h-5" />
      </button>
    </div>

    <!-- Orientation Hint (for mobile) -->
    <div
      v-if="game.orientation === 'landscape'"
      class="absolute bottom-4 left-4 z-20 px-3 py-1.5 bg-bg-void/80 text-xs text-text-muted rounded backdrop-blur-sm md:hidden flex items-center gap-2"
    >
      <Icon name="ph:device-rotate" class="w-4 h-4" />
      <span>Rotate for best experience</span>
    </div>
  </div>
</template>

<style scoped>
.game-player:fullscreen {
  background: #000;
}

.game-player:fullscreen iframe {
  width: 100vw;
  height: 100vh;
}
</style>
