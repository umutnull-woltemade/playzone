<script setup lang="ts">
const footerLinks = {
  games: [
    { label: 'Action', path: '/category/action' },
    { label: 'Puzzle', path: '/category/puzzle' },
    { label: 'Racing', path: '/category/racing' },
    { label: 'Sports', path: '/category/sports' },
    { label: 'Strategy', path: '/category/strategy' },
  ],
  company: [
    { label: 'Developers', path: '/developers' },
    { label: 'Contact', path: '/contact' },
  ],
  legal: [
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
}
</script>

<template>
  <footer class="bg-bg-surface border-t border-bg-subtle mt-16">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2 text-text-primary mb-4">
            <div class="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
              <Icon name="ph:game-controller-fill" class="w-5 h-5 text-bg-void" />
            </div>
            <span class="text-lg font-bold tracking-wide font-display">PLAYZONE</span>
          </NuxtLink>
          <p class="text-sm text-text-secondary">
            Play free online games instantly. No downloads, no signup required.
          </p>
        </div>

        <!-- Games -->
        <div>
          <h4 class="text-sm font-semibold text-text-primary mb-4">Games</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.games" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-accent-primary transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="text-sm font-semibold text-text-primary mb-4">Company</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.company" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-accent-primary transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-sm font-semibold text-text-primary mb-4">Legal</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks.legal" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-accent-primary transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="mt-12 pt-8 border-t border-bg-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-text-muted">
          &copy; {{ new Date().getFullYear() }} PlayZone. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <a href="#" class="text-text-muted hover:text-accent-primary transition-colors">
            <Icon name="ph:twitter-logo" class="w-5 h-5" />
          </a>
          <a href="#" class="text-text-muted hover:text-accent-primary transition-colors">
            <Icon name="ph:discord-logo" class="w-5 h-5" />
          </a>
          <a href="#" class="text-text-muted hover:text-accent-primary transition-colors">
            <Icon name="ph:youtube-logo" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
