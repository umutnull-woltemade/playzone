<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Service - PlayZone',
  description: 'Read the terms and conditions for using PlayZone gaming platform.',
})
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
        <p class="text-text-secondary">Last updated: January 2025</p>
      </div>

      <!-- Content -->
      <div class="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">1. Acceptance of Terms</h2>
          <p class="text-text-secondary leading-relaxed">
            By accessing and using PlayZone, you accept and agree to be bound by the terms and provisions
            of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">2. Description of Service</h2>
          <p class="text-text-secondary leading-relaxed">
            PlayZone is a free online gaming platform that provides access to HTML5 games from various
            third-party providers. We aggregate games from licensed sources including GamePix, GameMonetize,
            and HTMLGames, making them accessible through our website.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">3. User Conduct</h2>
          <p class="text-text-secondary leading-relaxed mb-4">When using PlayZone, you agree not to:</p>
          <ul class="list-disc list-inside text-text-secondary space-y-2">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>Use automated systems or bots to access the service</li>
            <li>Reproduce, duplicate, or exploit any part of the service without permission</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">4. Intellectual Property</h2>
          <p class="text-text-secondary leading-relaxed">
            All games on PlayZone are provided by third-party developers and publishers. Each game remains
            the intellectual property of its respective owner. PlayZone does not claim ownership of any
            games displayed on the platform. Our website design, logo, and original content are protected
            by copyright.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">5. Third-Party Content</h2>
          <p class="text-text-secondary leading-relaxed">
            Games on PlayZone are embedded from third-party providers. We do not control and are not
            responsible for the content, privacy policies, or practices of these third-party services.
            You acknowledge and agree that PlayZone is not liable for any damage or loss caused by your
            use of third-party content.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">6. Advertisements</h2>
          <p class="text-text-secondary leading-relaxed">
            PlayZone may display advertisements provided by third-party ad networks. These advertisements
            may use cookies and similar technologies to serve relevant ads. By using our service, you
            consent to the display of advertisements.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">7. Disclaimer of Warranties</h2>
          <p class="text-text-secondary leading-relaxed">
            PlayZone is provided "as is" and "as available" without warranties of any kind, either express
            or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
            We make no warranties regarding the accuracy or reliability of any games or content.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">8. Limitation of Liability</h2>
          <p class="text-text-secondary leading-relaxed">
            To the maximum extent permitted by law, PlayZone shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from your use of the service.
            This includes but is not limited to loss of data, profits, or goodwill.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">9. Age Requirements</h2>
          <p class="text-text-secondary leading-relaxed">
            PlayZone is intended for users of all ages. However, some games may contain content suitable
            for specific age groups. Parents and guardians are encouraged to monitor their children's
            gaming activities. If you are under 13 years old, please use our service under parental supervision.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">10. Modifications to Service</h2>
          <p class="text-text-secondary leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any part of our service at any time
            without prior notice. We may also update these Terms of Service from time to time. Continued
            use of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">11. Governing Law</h2>
          <p class="text-text-secondary leading-relaxed">
            These terms shall be governed by and construed in accordance with applicable laws, without
            regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">12. Contact</h2>
          <p class="text-text-secondary leading-relaxed">
            If you have any questions about these Terms of Service, please contact us through our
            <NuxtLink to="/contact" class="text-accent-primary hover:underline">Contact page</NuxtLink>.
          </p>
        </section>
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
