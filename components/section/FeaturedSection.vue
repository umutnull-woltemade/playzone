<script setup lang="ts">
const { featuredGames } = useGames()
</script>

<template>
  <section class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Main Featured Game -->
      <NuxtLink
        v-if="featuredGames[0]"
        :to="`/game/${featuredGames[0].slug}`"
        class="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-xl overflow-hidden"
      >
        <img
          :src="featuredGames[0].thumbnail"
          :alt="featuredGames[0].title"
          class="w-full h-full object-cover min-h-[300px] lg:min-h-[400px] transition-transform duration-500 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-void/40 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <span class="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase bg-accent-primary text-bg-void rounded">
            Featured
          </span>
          <h2 class="text-2xl lg:text-3xl font-bold text-text-primary font-display mb-2">
            {{ featuredGames[0].title }}
          </h2>
          <p class="text-text-secondary text-sm line-clamp-2 mb-4 max-w-lg">
            {{ featuredGames[0].description }}
          </p>
          <span class="inline-flex items-center gap-2 px-5 py-3 bg-accent-primary text-bg-void font-semibold rounded-md transition-all group-hover:bg-accent-hover group-hover:shadow-glow">
            <Icon name="ph:play-fill" class="w-5 h-5" />
            Play Now
          </span>
        </div>
      </NuxtLink>

      <!-- Side Featured Games -->
      <div class="hidden lg:flex flex-col gap-4">
        <NuxtLink
          v-for="game in featuredGames.slice(1, 3)"
          :key="game.id"
          :to="`/game/${game.slug}`"
          class="group relative flex-1 rounded-xl overflow-hidden"
        >
          <img
            :src="game.thumbnail"
            :alt="game.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-void/90 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-lg font-semibold text-text-primary font-display">{{ game.title }}</h3>
            <span class="text-sm text-text-secondary">{{ game.category }}</span>
          </div>
          <!-- Play overlay on hover -->
          <div class="absolute inset-0 bg-bg-void/60 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <span class="px-4 py-2 bg-accent-primary text-bg-void font-semibold rounded-md">
              Play
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
