<script setup lang="ts">
useSeoMeta({
  title: 'For Developers - PlayZone',
  description: 'Learn how to submit your HTML5 games to PlayZone and reach millions of players.',
})

const features = [
  {
    icon: 'ph:users',
    title: 'Reach More Players',
    description: 'Get your game in front of thousands of daily players looking for new games to play.',
  },
  {
    icon: 'ph:chart-line-up',
    title: 'Analytics Dashboard',
    description: 'Track your game performance with detailed play counts and engagement metrics.',
  },
  {
    icon: 'ph:currency-dollar',
    title: 'Monetization',
    description: 'Earn revenue through integrated ad solutions and revenue sharing programs.',
  },
  {
    icon: 'ph:globe',
    title: 'Global Audience',
    description: 'Reach players from around the world with our multi-language platform.',
  },
]

const requirements = [
  'HTML5/JavaScript games that run in modern browsers',
  'Games must be responsive or have fixed dimensions',
  'No malicious code, malware, or inappropriate content',
  'You must own the rights or have permission to distribute',
  'Games should load within reasonable time (< 10 seconds)',
  'Touch support is recommended for mobile players',
]

const providers = [
  {
    name: 'GamePix',
    url: 'https://www.gamepix.com/developers',
    description: 'Submit through GamePix developer program',
  },
  {
    name: 'GameMonetize',
    url: 'https://gamemonetize.com/upload-game',
    description: 'Upload your game to GameMonetize platform',
  },
  {
    name: 'HTMLGames',
    url: 'https://www.htmlgames.com/submit',
    description: 'Submit HTML5 games to HTMLGames',
  },
]
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">For Game Developers</h1>
        <p class="text-text-secondary text-lg max-w-2xl mx-auto">
          Submit your HTML5 games to PlayZone and reach thousands of players worldwide.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid sm:grid-cols-2 gap-6 mb-12">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-surface-secondary/30 rounded-xl p-6 hover:bg-surface-secondary/50 transition-colors"
        >
          <div class="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center mb-4">
            <Icon :name="feature.icon" class="w-6 h-6 text-accent-primary" />
          </div>
          <h3 class="text-lg font-semibold text-text-primary mb-2">{{ feature.title }}</h3>
          <p class="text-text-secondary text-sm">{{ feature.description }}</p>
        </div>
      </div>

      <!-- How to Submit -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-text-primary mb-6">How to Submit Your Game</h2>
        <p class="text-text-secondary mb-6">
          PlayZone aggregates games from trusted providers. To get your game featured on our platform,
          submit it through one of our partner networks:
        </p>

        <div class="space-y-4">
          <a
            v-for="provider in providers"
            :key="provider.name"
            :href="provider.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block bg-surface-secondary/30 rounded-xl p-6 hover:bg-surface-secondary/50 transition-colors group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                  {{ provider.name }}
                </h3>
                <p class="text-text-secondary text-sm">{{ provider.description }}</p>
              </div>
              <Icon name="ph:arrow-square-out" class="w-5 h-5 text-text-secondary group-hover:text-accent-primary transition-colors" />
            </div>
          </a>
        </div>
      </div>

      <!-- Requirements -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-text-primary mb-6">Game Requirements</h2>
        <div class="bg-surface-secondary/30 rounded-xl p-6">
          <ul class="space-y-3">
            <li v-for="req in requirements" :key="req" class="flex items-start gap-3">
              <Icon name="ph:check-circle" class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span class="text-text-secondary">{{ req }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- FAQ -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <h3 class="font-semibold text-text-primary mb-2">How long does it take for my game to appear?</h3>
            <p class="text-text-secondary text-sm">
              Once approved by our partner networks, games typically appear on PlayZone within 24-48 hours
              as our catalog refreshes regularly.
            </p>
          </div>

          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <h3 class="font-semibold text-text-primary mb-2">Do I retain ownership of my game?</h3>
            <p class="text-text-secondary text-sm">
              Yes, you retain full ownership. We only embed and display your game through our partner
              networks' embed systems.
            </p>
          </div>

          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <h3 class="font-semibold text-text-primary mb-2">How does monetization work?</h3>
            <p class="text-text-secondary text-sm">
              Revenue is generated through ads displayed during gameplay. The revenue share depends on
              the provider you submit through. Check each provider's terms for details.
            </p>
          </div>

          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <h3 class="font-semibold text-text-primary mb-2">Can I remove my game from PlayZone?</h3>
            <p class="text-text-secondary text-sm">
              Yes. Simply remove your game from the provider network, and it will be removed from our
              platform during the next catalog refresh.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-gradient-to-r from-accent-primary/20 to-purple-500/20 rounded-xl p-8 text-center">
        <h2 class="text-2xl font-bold text-text-primary mb-4">Have Questions?</h2>
        <p class="text-text-secondary mb-6">
          We're here to help. Reach out to discuss partnerships or get technical support.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold rounded-lg transition-colors"
        >
          <Icon name="ph:envelope" class="w-5 h-5" />
          Contact Us
        </NuxtLink>
      </div>

      <!-- Back Button -->
      <div class="mt-12">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4" />
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
