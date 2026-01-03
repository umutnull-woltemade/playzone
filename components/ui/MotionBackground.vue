<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'

type Variant = 'calm' | 'energetic' | 'minimal'

interface Props {
  variant?: Variant
  showParticles?: boolean
  showNoise?: boolean
  enableParallax?: boolean
  particleCount?: number
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'calm',
  showParticles: true,
  showNoise: true,
  enableParallax: true,
  particleCount: 30,
  interactive: true,
})

const containerRef = ref<HTMLElement | null>(null)
const prefersReducedMotion = ref(false)
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(containerRef)

// Check for reduced motion preference
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches

  const handler = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }
  mediaQuery.addEventListener('change', handler)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handler)
  })
})

// Parallax offset based on mouse position
const parallaxOffset = computed(() => {
  if (!props.enableParallax || prefersReducedMotion.value || isOutside.value) {
    return { x: 0, y: 0 }
  }

  const centerX = elementWidth.value / 2
  const centerY = elementHeight.value / 2
  const offsetX = ((elementX.value - centerX) / centerX) * 20
  const offsetY = ((elementY.value - centerY) / centerY) * 20

  return { x: offsetX, y: offsetY }
})

// Generate particles with random properties
const particles = computed(() => {
  if (prefersReducedMotion.value) return []

  return Array.from({ length: props.particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 10 + 15,
    opacity: Math.random() * 0.3 + 0.1,
    color: ['accent', 'cyan', 'pink'][Math.floor(Math.random() * 3)],
  }))
})

// Variant-specific gradient styles
const gradientStyle = computed(() => {
  const baseOffset = `translate(${parallaxOffset.value.x}px, ${parallaxOffset.value.y}px)`

  const variants = {
    calm: {
      background: `
        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse 60% 80% at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse 50% 60% at 60% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)
      `,
    },
    energetic: {
      background: `
        radial-gradient(ellipse 100% 60% at 10% 30%, rgba(124, 58, 237, 0.2) 0%, transparent 50%),
        radial-gradient(ellipse 80% 100% at 90% 10%, rgba(6, 182, 212, 0.18) 0%, transparent 50%),
        radial-gradient(ellipse 70% 80% at 50% 90%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse 60% 50% at 70% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)
      `,
    },
    minimal: {
      background: `
        radial-gradient(ellipse 100% 100% at 50% 0%, rgba(124, 58, 237, 0.06) 0%, transparent 60%)
      `,
    },
  }

  return {
    ...variants[props.variant],
    transform: prefersReducedMotion.value ? 'none' : baseOffset,
    transition: 'transform 0.3s ease-out',
  }
})

// Animated orbs for energetic variant
const orbs = computed(() => {
  if (props.variant !== 'energetic' || prefersReducedMotion.value) return []

  return [
    { id: 1, color: 'accent', size: 400, x: 15, y: 20, delay: 0 },
    { id: 2, color: 'cyan', size: 350, x: 75, y: 15, delay: 2 },
    { id: 3, color: 'pink', size: 300, x: 60, y: 70, delay: 4 },
  ]
})
</script>

<template>
  <div
    ref="containerRef"
    class="motion-background"
  >
    <!-- Base gradient layer -->
    <div
      class="gradient-layer"
      :style="gradientStyle"
    />

    <!-- Animated orbs (energetic only) -->
    <div
      v-for="orb in orbs"
      :key="orb.id"
      class="orb"
      :class="`orb-${orb.color}`"
      :style="{
        width: `${orb.size}px`,
        height: `${orb.size}px`,
        left: `${orb.x}%`,
        top: `${orb.y}%`,
        animationDelay: `${orb.delay}s`,
      }"
    />

    <!-- Floating particles -->
    <div v-if="showParticles && !prefersReducedMotion" class="particles-layer">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :class="`particle-${particle.color}`"
        :style="{
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          opacity: particle.opacity,
          animationDelay: `${particle.delay}s`,
          animationDuration: `${particle.duration}s`,
        }"
      />
    </div>

    <!-- Noise texture overlay -->
    <div v-if="showNoise" class="noise-layer" />

    <!-- Content slot -->
    <div class="content-layer">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.motion-background {
  @apply relative min-h-screen w-full overflow-hidden bg-bg-void;
}

.gradient-layer {
  @apply absolute inset-0 pointer-events-none;
  will-change: transform;
}

.orb {
  @apply absolute rounded-full pointer-events-none;
  filter: blur(80px);
  animation: orbFloat 20s ease-in-out infinite;
  will-change: transform, opacity;
}

.orb-accent {
  background: radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%);
}

.orb-cyan {
  background: radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%);
}

.orb-pink {
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(-45%, -55%) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-55%, -45%) scale(0.9);
    opacity: 0.5;
  }
  75% {
    transform: translate(-48%, -52%) scale(1.05);
    opacity: 0.7;
  }
}

.particles-layer {
  @apply absolute inset-0 pointer-events-none overflow-hidden;
}

.particle {
  @apply absolute rounded-full;
  animation: particleDrift linear infinite;
  will-change: transform;
}

.particle-accent {
  background: rgba(124, 58, 237, 0.8);
  box-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
}

.particle-cyan {
  background: rgba(6, 182, 212, 0.8);
  box-shadow: 0 0 6px rgba(6, 182, 212, 0.5);
}

.particle-pink {
  background: rgba(236, 72, 153, 0.8);
  box-shadow: 0 0 6px rgba(236, 72, 153, 0.5);
}

@keyframes particleDrift {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-25vh) translateX(10px) rotate(90deg);
  }
  50% {
    transform: translateY(-50vh) translateX(-10px) rotate(180deg);
  }
  75% {
    transform: translateY(-75vh) translateX(5px) rotate(270deg);
  }
  100% {
    transform: translateY(-100vh) translateX(0) rotate(360deg);
  }
}

.noise-layer {
  @apply absolute inset-0 pointer-events-none opacity-[0.03];
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.content-layer {
  @apply relative z-10;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .orb,
  .particle {
    animation: none !important;
  }

  .gradient-layer {
    transition: none !important;
  }
}
</style>
