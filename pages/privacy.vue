<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy - PlayZone',
  description: 'Learn how PlayZone collects, uses, and protects your personal information.',
})
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
        <p class="text-text-secondary">Last updated: January 2025</p>
      </div>

      <!-- Content -->
      <div class="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">1. Introduction</h2>
          <p class="text-text-secondary leading-relaxed">
            Welcome to PlayZone. We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and safeguard your information when you use our website.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
          <p class="text-text-secondary leading-relaxed mb-4">We may collect the following types of information:</p>
          <ul class="list-disc list-inside text-text-secondary space-y-2">
            <li><strong class="text-text-primary">Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and games played.</li>
            <li><strong class="text-text-primary">Device Information:</strong> Browser type, operating system, device type, and screen resolution.</li>
            <li><strong class="text-text-primary">Cookies:</strong> Small files stored on your device to improve your experience.</li>
            <li><strong class="text-text-primary">IP Address:</strong> For analytics and security purposes.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
          <p class="text-text-secondary leading-relaxed mb-4">We use collected information to:</p>
          <ul class="list-disc list-inside text-text-secondary space-y-2">
            <li>Provide and maintain our gaming platform</li>
            <li>Improve user experience and website functionality</li>
            <li>Analyze usage patterns to optimize performance</li>
            <li>Display relevant advertisements</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">4. Third-Party Services</h2>
          <p class="text-text-secondary leading-relaxed mb-4">
            We use third-party services that may collect information about you:
          </p>
          <ul class="list-disc list-inside text-text-secondary space-y-2">
            <li><strong class="text-text-primary">Game Providers:</strong> GamePix, GameMonetize, and HTMLGames provide the games on our platform.</li>
            <li><strong class="text-text-primary">Analytics:</strong> We may use analytics services to understand website usage.</li>
            <li><strong class="text-text-primary">Advertising:</strong> Third-party ad networks may serve ads based on your browsing behavior.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">5. Cookies</h2>
          <p class="text-text-secondary leading-relaxed">
            We use cookies to enhance your experience. You can control cookies through your browser settings.
            For more details, please see our <NuxtLink to="/cookies" class="text-accent-primary hover:underline">Cookie Policy</NuxtLink>.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">6. Data Security</h2>
          <p class="text-text-secondary leading-relaxed">
            We implement appropriate security measures to protect your information. However, no method of
            transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">7. Children's Privacy</h2>
          <p class="text-text-secondary leading-relaxed">
            Our service is intended for general audiences. We do not knowingly collect personal information
            from children under 13. If you believe we have collected such information, please contact us.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">8. Your Rights</h2>
          <p class="text-text-secondary leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
          <ul class="list-disc list-inside text-text-secondary space-y-2">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of certain data collection</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">9. Changes to This Policy</h2>
          <p class="text-text-secondary leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any changes by
            posting the new policy on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-text-primary mb-4">10. Contact Us</h2>
          <p class="text-text-secondary leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through our
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
