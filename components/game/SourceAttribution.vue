<script setup lang="ts">
import type { Game } from '~/types/game'

interface Props {
  game: Game
  variant?: 'inline' | 'card' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'inline',
})

// Provider display info
const providerInfo = computed(() => {
  switch (props.game.provider) {
    case 'gamepix':
      return {
        name: 'GamePix',
        url: 'https://www.gamepix.com',
        icon: 'ph:game-controller-fill',
        color: 'text-cyan-primary',
        bgColor: 'bg-cyan-muted',
      }
    case 'itchio':
      return {
        name: 'itch.io',
        url: 'https://itch.io',
        icon: 'ph:storefront-fill',
        color: 'text-warm-accent',
        bgColor: 'bg-warm-muted',
      }
    case 'opensource':
      return {
        name: 'Open Source',
        url: 'https://github.com',
        icon: 'ph:code-fill',
        color: 'text-fresh-primary',
        bgColor: 'bg-fresh-muted',
      }
    default:
      return {
        name: props.game.provider,
        url: '#',
        icon: 'ph:globe-fill',
        color: 'text-accent-primary',
        bgColor: 'bg-accent-muted',
      }
  }
})
</script>

<template>
  <!-- Minimal Badge -->
  <a
    v-if="variant === 'minimal'"
    :href="providerInfo.url"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-opacity hover:opacity-80"
    :class="[providerInfo.bgColor, providerInfo.color]"
  >
    <Icon :name="providerInfo.icon" class="w-3 h-3" />
    {{ providerInfo.name }}
  </a>

  <!-- Inline Attribution -->
  <a
    v-else-if="variant === 'inline'"
    :href="providerInfo.url"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
  >
    <Icon :name="providerInfo.icon" class="w-3.5 h-3.5" :class="providerInfo.color" />
    <span>Powered by {{ providerInfo.name }}</span>
    <Icon name="ph:arrow-square-out" class="w-3 h-3 opacity-50" />
  </a>

  <!-- Card Attribution -->
  <div
    v-else-if="variant === 'card'"
    class="p-4 bg-bg-surface rounded-xl border border-bg-subtle"
  >
    <div class="flex items-start gap-3">
      <div
        class="p-2 rounded-lg"
        :class="providerInfo.bgColor"
      >
        <Icon :name="providerInfo.icon" class="w-5 h-5" :class="providerInfo.color" />
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-text-primary">
          Provided by {{ providerInfo.name }}
        </p>
        <p class="text-xs text-text-muted mt-0.5">
          This game is hosted and served via {{ providerInfo.name }}'s platform
        </p>

        <div class="flex items-center gap-3 mt-3">
          <a
            :href="providerInfo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-medium hover:underline"
            :class="providerInfo.color"
          >
            Visit {{ providerInfo.name }}
            <Icon name="ph:arrow-square-out" class="w-3 h-3" />
          </a>

          <span class="text-xs text-text-muted">•</span>

          <span class="text-xs text-text-muted">
            License: Publisher Embed
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
