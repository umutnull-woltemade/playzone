<script setup lang="ts">
const footerLinks = {
  games: [
    { label: 'Action', path: '/category/action' },
    { label: 'Puzzle', path: '/category/puzzle' },
    { label: 'Shooter', path: '/category/shooter' },
    { label: 'Racing', path: '/category/racing' },
    { label: 'Sports', path: '/category/sports' },
  ],
  explore: [
    { label: 'New Games', path: '/category/new' },
    { label: 'Popular', path: '/category/popular' },
    { label: 'All Games', path: '/category/all' },
    { label: 'Favorites', path: '/favorites' },
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
  <footer class="footer-wrapper">
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 py-16">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-3 text-text-primary mb-5">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center logo-icon">
              <Icon name="ph:planet-fill" class="w-5 h-5 text-white" />
            </div>
            <div class="flex flex-col leading-none">
              <span class="text-base font-bold gradient-text-brand">ANDROMEDA</span>
              <span class="text-[10px] font-medium text-text-muted uppercase tracking-widest">GAMES</span>
            </div>
          </NuxtLink>
          <p class="text-sm text-text-secondary leading-relaxed">
            Play free online games instantly. No downloads, no signup required. Your galaxy of games awaits.
          </p>
        </div>

        <!-- Games -->
        <div>
          <h4 class="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Categories</h4>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.games" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-brand-light transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Explore -->
        <div>
          <h4 class="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Explore</h4>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.explore" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-brand-light transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Company</h4>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.company" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-brand-light transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Legal</h4>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.legal" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="text-sm text-text-secondary hover:text-brand-light transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="mt-16 pt-8 border-t border-brand-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-text-muted">
          &copy; {{ new Date().getFullYear() }} Andromeda Games. All rights reserved.
        </p>
        <div class="flex items-center gap-3 text-sm text-text-muted">
          <span>Made with</span>
          <Icon name="ph:heart-fill" class="w-4 h-4 text-pink" />
          <span>for gamers</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  background: linear-gradient(to bottom, rgba(22, 15, 42, 0.5) 0%, rgba(15, 10, 31, 1) 100%);
  border-top: 1px solid rgba(139, 92, 246, 0.1);
  margin-top: 4rem;
}

.logo-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c084fc 100%);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.gradient-text-brand {
  background: linear-gradient(135deg, #c084fc 0%, #a78bfa 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

</style>
