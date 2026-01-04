<script setup lang="ts">
useSeoMeta({
  title: 'Contact Us - PlayZone',
  description: 'Get in touch with the PlayZone team for questions, feedback, or business inquiries.',
})

const form = reactive({
  name: '',
  email: '',
  subject: 'general',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'bug', label: 'Report a Bug' },
  { value: 'game', label: 'Game Issue' },
  { value: 'business', label: 'Business Partnership' },
  { value: 'dmca', label: 'DMCA / Copyright' },
  { value: 'other', label: 'Other' },
]

async function handleSubmit() {
  if (!form.name || !form.email || !form.message) return

  isSubmitting.value = true

  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000))

  isSubmitting.value = false
  isSubmitted.value = true
}
</script>

<template>
  <div class="min-h-screen">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
        <p class="text-text-secondary">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                <Icon name="ph:envelope" class="w-5 h-5 text-accent-primary" />
              </div>
              <h3 class="font-semibold text-text-primary">Email</h3>
            </div>
            <p class="text-text-secondary text-sm">contact@playzone.com</p>
          </div>

          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                <Icon name="ph:clock" class="w-5 h-5 text-accent-primary" />
              </div>
              <h3 class="font-semibold text-text-primary">Response Time</h3>
            </div>
            <p class="text-text-secondary text-sm">We typically respond within 24-48 hours.</p>
          </div>

          <div class="bg-surface-secondary/30 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center">
                <Icon name="ph:question" class="w-5 h-5 text-accent-primary" />
              </div>
              <h3 class="font-semibold text-text-primary">FAQ</h3>
            </div>
            <p class="text-text-secondary text-sm">Check our FAQ section for quick answers to common questions.</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="md:col-span-2">
          <div v-if="isSubmitted" class="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
            <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Icon name="ph:check-circle" class="w-8 h-8 text-green-500" />
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-2">Message Sent!</h3>
            <p class="text-text-secondary mb-6">Thank you for contacting us. We'll get back to you soon.</p>
            <button
              @click="isSubmitted = false; form.name = ''; form.email = ''; form.message = ''"
              class="text-accent-primary hover:underline"
            >
              Send another message
            </button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium text-text-secondary mb-2">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-surface-secondary/50 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 bg-surface-secondary/50 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-text-secondary mb-2">Subject</label>
              <select
                id="subject"
                v-model="form.subject"
                class="w-full px-4 py-3 bg-surface-secondary/50 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
              >
                <option v-for="subject in subjects" :key="subject.value" :value="subject.value">
                  {{ subject.label }}
                </option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-text-secondary mb-2">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="6"
                class="w-full px-4 py-3 bg-surface-secondary/50 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-8 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="isSubmitting" name="ph:spinner" class="w-5 h-5 animate-spin" />
              <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
            </button>
          </form>
        </div>
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
