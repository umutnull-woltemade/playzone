<script setup lang="ts">
useSeoMeta({
  title: 'Design System Demo - PlayZone',
})

const showModal = ref(false)
const showDrawer = ref(false)
const showBottomSheet = ref(false)

const toast = inject('toast') as any
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-16">
    <!-- Header -->
    <header class="text-center space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold">
        <span class="gradient-text">Design System</span>
      </h1>
      <p class="text-text-secondary text-lg max-w-2xl mx-auto">
        A showcase of premium UI components with motion backgrounds, glass effects, and smooth animations.
      </p>
    </header>

    <!-- Motion Background Variants -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Motion Background Variants</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="relative h-48 rounded-xl overflow-hidden">
          <MotionBackground variant="calm" :particle-count="10" class="absolute inset-0">
            <div class="flex items-center justify-center h-full">
              <span class="text-text-primary font-semibold">Calm</span>
            </div>
          </MotionBackground>
        </div>
        <div class="relative h-48 rounded-xl overflow-hidden">
          <MotionBackground variant="energetic" :particle-count="20" class="absolute inset-0">
            <div class="flex items-center justify-center h-full">
              <span class="text-text-primary font-semibold">Energetic</span>
            </div>
          </MotionBackground>
        </div>
        <div class="relative h-48 rounded-xl overflow-hidden">
          <MotionBackground variant="minimal" :particle-count="5" class="absolute inset-0">
            <div class="flex items-center justify-center h-full">
              <span class="text-text-primary font-semibold">Minimal</span>
            </div>
          </MotionBackground>
        </div>
      </div>
    </section>

    <!-- Buttons -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Buttons</h2>

      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-text-secondary">Primary Buttons</h3>
        <div class="flex flex-wrap gap-4">
          <PrimaryButton size="sm">Small</PrimaryButton>
          <PrimaryButton>Medium</PrimaryButton>
          <PrimaryButton size="lg">Large</PrimaryButton>
          <PrimaryButton icon="ph:play-fill">With Icon</PrimaryButton>
          <PrimaryButton loading>Loading</PrimaryButton>
          <PrimaryButton disabled>Disabled</PrimaryButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-text-secondary">Secondary Buttons</h3>
        <div class="flex flex-wrap gap-4">
          <SecondaryButton>Outline</SecondaryButton>
          <SecondaryButton color="accent">Accent</SecondaryButton>
          <SecondaryButton color="cyan">Cyan</SecondaryButton>
          <SecondaryButton variant="ghost">Ghost</SecondaryButton>
          <SecondaryButton variant="ghost" color="accent">Ghost Accent</SecondaryButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-text-secondary">Icon Buttons</h3>
        <div class="flex flex-wrap gap-4">
          <IconButton icon="ph:heart" label="Like" />
          <IconButton icon="ph:share" variant="solid" label="Share" />
          <IconButton icon="ph:gear" variant="glass" label="Settings" />
          <IconButton icon="ph:bell" color="accent" label="Notifications" />
          <IconButton icon="ph:star" variant="solid" color="cyan" label="Favorite" />
          <IconButton icon="ph:trash" variant="solid" color="pink" label="Delete" />
        </div>
      </div>
    </section>

    <!-- Glass Cards -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Glass Cards</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <h3 class="text-lg font-bold text-text-primary mb-2">Default Card</h3>
          <p class="text-text-secondary text-sm">A basic glass card with subtle blur and border effects.</p>
        </GlassCard>
        <GlassCard glow="accent">
          <h3 class="text-lg font-bold text-text-primary mb-2">Accent Glow</h3>
          <p class="text-text-secondary text-sm">Card with purple accent glow on hover.</p>
        </GlassCard>
        <GlassCard glow="cyan">
          <h3 class="text-lg font-bold text-text-primary mb-2">Cyan Glow</h3>
          <p class="text-text-secondary text-sm">Card with cyan accent glow on hover.</p>
        </GlassCard>
      </div>
    </section>

    <!-- Stat Pills -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Stat Pills</h2>
      <div class="flex flex-wrap gap-4">
        <StatPill value="1.2M" label="plays" icon="ph:play-circle" />
        <StatPill value="4.8" label="rating" icon="ph:star" color="accent" />
        <StatPill value="256" trend="up" trend-value="+12%" color="success" />
        <StatPill value="128" trend="down" trend-value="-5%" color="warning" />
        <StatPill value="Online" color="cyan" size="lg" />
      </div>
    </section>

    <!-- Skeletons -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Skeleton Loaders</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div class="space-y-4">
            <Skeleton variant="circular" width="48px" height="48px" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </div>
        </GlassCard>
        <GlassCard>
          <div class="space-y-4">
            <Skeleton variant="rounded" height="120px" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
        </GlassCard>
        <GlassCard>
          <div class="flex items-center gap-4">
            <Skeleton variant="circular" width="64px" height="64px" />
            <div class="flex-1 space-y-2">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        </GlassCard>
      </div>
    </section>

    <!-- Toasts & Banners -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Toasts & Banners</h2>

      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-text-secondary">Trigger Toasts</h3>
        <div class="flex flex-wrap gap-4">
          <SecondaryButton color="cyan" @click="toast?.info('This is an info message')">
            Info Toast
          </SecondaryButton>
          <SecondaryButton @click="toast?.success('Operation completed successfully!')">
            Success Toast
          </SecondaryButton>
          <SecondaryButton @click="toast?.warning('Please check your input')">
            Warning Toast
          </SecondaryButton>
          <SecondaryButton @click="toast?.error('Something went wrong')">
            Error Toast
          </SecondaryButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-text-secondary">Status Banners</h3>
        <div class="space-y-4">
          <StatusBanner type="info" title="Information">
            This is an informational message about something important.
          </StatusBanner>
          <StatusBanner type="success" title="Success">
            Your changes have been saved successfully.
          </StatusBanner>
          <StatusBanner type="warning" title="Warning" dismissible>
            Please review your settings before continuing.
          </StatusBanner>
          <StatusBanner type="error" title="Error">
            There was a problem processing your request.
          </StatusBanner>
        </div>
      </div>
    </section>

    <!-- Overlays -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary">Overlays</h2>
      <div class="flex flex-wrap gap-4">
        <PrimaryButton @click="showModal = true">Open Modal</PrimaryButton>
        <SecondaryButton @click="showDrawer = true">Open Drawer</SecondaryButton>
        <SecondaryButton color="cyan" @click="showBottomSheet = true">Open Bottom Sheet</SecondaryButton>
      </div>
    </section>

    <!-- Modal -->
    <Modal v-model="showModal" size="md">
      <template #header>
        <h3 class="text-xl font-bold text-text-primary">Modal Title</h3>
      </template>

      <p class="text-text-secondary">
        This is a modal dialog with glass styling and smooth animations.
        It supports header, content, and footer slots.
      </p>

      <template #footer>
        <SecondaryButton @click="showModal = false">Cancel</SecondaryButton>
        <PrimaryButton @click="showModal = false">Confirm</PrimaryButton>
      </template>
    </Modal>

    <!-- Drawer -->
    <Drawer v-model="showDrawer" side="right">
      <template #header>
        <h3 class="text-xl font-bold text-text-primary">Drawer Panel</h3>
      </template>

      <div class="space-y-4">
        <p class="text-text-secondary">
          A slide-in drawer panel that can appear from left or right.
        </p>

        <div class="space-y-2">
          <div class="p-4 rounded-lg bg-bg-elevated">
            <p class="text-text-primary font-medium">Item 1</p>
          </div>
          <div class="p-4 rounded-lg bg-bg-elevated">
            <p class="text-text-primary font-medium">Item 2</p>
          </div>
          <div class="p-4 rounded-lg bg-bg-elevated">
            <p class="text-text-primary font-medium">Item 3</p>
          </div>
        </div>
      </div>
    </Drawer>

    <!-- Bottom Sheet -->
    <BottomSheet v-model="showBottomSheet">
      <template #header>
        <h3 class="text-xl font-bold text-text-primary">Bottom Sheet</h3>
      </template>

      <div class="space-y-4">
        <p class="text-text-secondary">
          A mobile-friendly bottom sheet that slides up from the bottom.
        </p>

        <div class="grid grid-cols-3 gap-4">
          <GlassCard padding="sm" class="text-center">
            <Icon name="ph:share" class="w-6 h-6 text-accent mx-auto mb-2" />
            <p class="text-sm text-text-primary">Share</p>
          </GlassCard>
          <GlassCard padding="sm" class="text-center">
            <Icon name="ph:heart" class="w-6 h-6 text-pink mx-auto mb-2" />
            <p class="text-sm text-text-primary">Like</p>
          </GlassCard>
          <GlassCard padding="sm" class="text-center">
            <Icon name="ph:bookmark" class="w-6 h-6 text-cyan mx-auto mb-2" />
            <p class="text-sm text-text-primary">Save</p>
          </GlassCard>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>
