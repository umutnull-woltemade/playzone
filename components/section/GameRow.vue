<script setup lang="ts">
import type { Game } from '~/composables/useGames'

interface Props {
  title: string
  icon?: string
  games: Game[]
  href?: string
}

defineProps<Props>()
</script>

<template>
  <section class="mb-10">
    <SectionHeader :title="title" :icon="icon" :href="href" />
    <GameGrid>
      <GameCard v-for="game in games" :key="game.id" :game="game" />
    </GameGrid>
  </section>
</template>
