<script setup lang="ts">
useSeoMeta({
  title: 'About - PlayZone',
  description: 'Learn about PlayZone - your destination for free online games.',
})
</script>

<template>
  <div class="max-w-screen-md mx-auto px-4 md:px-6 py-12">
    <h1 class="text-3xl font-bold text-text-primary font-display mb-6">About PlayZone</h1>

    <div class="prose prose-invert max-w-none">
      <p class="text-text-secondary text-lg mb-6">
        PlayZone is your destination for free online games. We offer hundreds of games across all genres - action, puzzle, racing, sports, and more.
      </p>

      <div class="grid sm:grid-cols-3 gap-6 my-10">
        <div class="p-6 bg-bg-surface rounded-xl text-center">
          <Icon name="ph:game-controller-fill" class="w-10 h-10 text-accent-primary mx-auto mb-3" />
          <h3 class="text-xl font-semibold text-text-primary mb-1">500+</h3>
          <p class="text-sm text-text-secondary">Free Games</p>
        </div>
        <div class="p-6 bg-bg-surface rounded-xl text-center">
          <Icon name="ph:users-fill" class="w-10 h-10 text-accent-primary mx-auto mb-3" />
          <h3 class="text-xl font-semibold text-text-primary mb-1">1M+</h3>
          <p class="text-sm text-text-secondary">Monthly Players</p>
        </div>
        <div class="p-6 bg-bg-surface rounded-xl text-center">
          <Icon name="ph:globe-fill" class="w-10 h-10 text-accent-primary mx-auto mb-3" />
          <h3 class="text-xl font-semibold text-text-primary mb-1">150+</h3>
          <p class="text-sm text-text-secondary">Countries</p>
        </div>
      </div>

      <h2 class="text-xl font-semibold text-text-primary mt-8 mb-4">Our Mission</h2>
      <p class="text-text-secondary mb-4">
        We believe gaming should be accessible to everyone. That's why all our games are:
      </p>
      <ul class="space-y-2 text-text-secondary mb-6">
        <li class="flex items-center gap-2">
          <Icon name="ph:check-circle-fill" class="w-5 h-5 text-success shrink-0" />
          <span>Completely free to play</span>
        </li>
        <li class="flex items-center gap-2">
          <Icon name="ph:check-circle-fill" class="w-5 h-5 text-success shrink-0" />
          <span>No downloads or installations required</span>
        </li>
        <li class="flex items-center gap-2">
          <Icon name="ph:check-circle-fill" class="w-5 h-5 text-success shrink-0" />
          <span>No signup or login needed</span>
        </li>
        <li class="flex items-center gap-2">
          <Icon name="ph:check-circle-fill" class="w-5 h-5 text-success shrink-0" />
          <span>Playable on any device with a browser</span>
        </li>
      </ul>

      <h2 class="text-xl font-semibold text-text-primary mt-8 mb-4">For Developers</h2>
      <p class="text-text-secondary mb-4">
        Are you a game developer? We're always looking for quality games to add to our platform. Get your game in front of millions of players.
      </p>
      <NuxtLink
        to="/developers"
        class="inline-flex items-center gap-2 px-5 py-3 bg-accent-primary text-bg-void font-semibold rounded-md hover:bg-accent-hover transition-colors"
      >
        Submit Your Game
        <Icon name="ph:arrow-right" class="w-5 h-5" />
      </NuxtLink>
    </div>
  </div>
</template>
