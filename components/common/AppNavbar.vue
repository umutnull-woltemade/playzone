<script setup lang="ts">
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Home', path: '/', icon: 'ph:house-fill' },
  { label: 'New', path: '/category/new', icon: 'ph:sparkle-fill' },
  { label: 'Popular', path: '/category/popular', icon: 'ph:trophy-fill' },
  { label: 'Updated', path: '/category/trending', icon: 'ph:clock-fill' },
]

const moreCategories = [
  { label: 'Action', path: '/category/action', icon: 'ph:lightning-fill' },
  { label: 'Puzzle', path: '/category/puzzle', icon: 'ph:puzzle-piece-fill' },
  { label: 'Racing', path: '/category/racing', icon: 'ph:car-fill' },
  { label: 'Sports', path: '/category/sports', icon: 'ph:soccer-ball-fill' },
  { label: 'Adventure', path: '/category/adventure', icon: 'ph:compass-fill' },
  { label: 'Arcade', path: '/category/arcade', icon: 'ph:game-controller-fill' },
  { label: 'Multiplayer', path: '/category/multiplayer', icon: 'ph:users-fill' },
]

const showCategories = ref(false)
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-16 bg-bg-void/95 backdrop-blur-lg border-b border-bg-subtle/50">
    <div class="max-w-screen-2xl mx-auto h-full px-4 md:px-6 flex items-center gap-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 text-text-primary shrink-0 group">
        <div class="relative w-9 h-9 bg-gradient-to-br from-accent-primary to-accent-hover rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all">
          <Icon name="ph:game-controller-fill" class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-extrabold tracking-wide hidden sm:block">
          <span class="text-text-primary">PLAY</span><span class="text-accent-primary">ZONE</span>
        </span>
      </NuxtLink>

      <!-- Navigation (Desktop) -->
      <nav class="hidden lg:flex items-center gap-1 ml-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-secondary rounded-lg transition-all hover:text-text-primary hover:bg-bg-surface"
          active-class="!text-accent-primary !bg-accent-muted"
        >
          <Icon :name="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </NuxtLink>

        <!-- Categories Dropdown -->
        <div class="relative">
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-secondary rounded-lg transition-all hover:text-text-primary hover:bg-bg-surface"
            @click="showCategories = !showCategories"
            @blur="setTimeout(() => showCategories = false, 150)"
          >
            <Icon name="ph:squares-four-fill" class="w-4 h-4" />
            Categories
            <Icon name="ph:caret-down" class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showCategories }" />
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-2"
          >
            <div
              v-if="showCategories"
              class="absolute top-full left-0 mt-2 w-56 bg-bg-surface rounded-xl border border-bg-subtle shadow-lg-dark overflow-hidden"
            >
              <div class="p-2">
                <NuxtLink
                  v-for="cat in moreCategories"
                  :key="cat.path"
                  :to="cat.path"
                  class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary rounded-lg hover:text-text-primary hover:bg-bg-elevated transition-colors"
                  @click="showCategories = false"
                >
                  <Icon :name="cat.icon" class="w-4 h-4 text-accent-primary" />
                  {{ cat.label }}
                </NuxtLink>
              </div>
            </div>
          </transition>
        </div>
      </nav>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Search (Desktop) -->
      <div class="hidden md:block w-full max-w-sm">
        <SearchInput />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Search Toggle (Mobile) -->
        <button
          class="p-2.5 text-text-secondary rounded-lg transition-all hover:text-text-primary hover:bg-bg-surface md:hidden"
          aria-label="Search"
          @click="isSearchOpen = !isSearchOpen"
        >
          <Icon name="ph:magnifying-glass" class="w-5 h-5" />
        </button>

        <!-- Menu Toggle (Mobile) -->
        <button
          class="p-2.5 text-text-secondary rounded-lg transition-all hover:text-text-primary hover:bg-bg-surface lg:hidden"
          aria-label="Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Search -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isSearchOpen"
        class="absolute top-16 left-0 right-0 p-4 bg-bg-void/95 backdrop-blur-lg border-b border-bg-subtle md:hidden"
      >
        <SearchInput @search="isSearchOpen = false" />
      </div>
    </transition>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute top-16 left-0 right-0 bg-bg-void/95 backdrop-blur-lg border-b border-bg-subtle lg:hidden max-h-[80vh] overflow-y-auto"
      >
        <nav class="p-4 space-y-1">
          <!-- Main Nav -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-text-secondary rounded-lg transition-all hover:text-text-primary hover:bg-bg-surface"
            active-class="!text-accent-primary !bg-accent-muted"
            @click="isMobileMenuOpen = false"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </NuxtLink>

          <!-- Divider -->
          <div class="h-px bg-bg-subtle my-3" />

          <!-- Categories -->
          <p class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-muted">Categories</p>
          <NuxtLink
            v-for="cat in moreCategories"
            :key="cat.path"
            :to="cat.path"
            class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary rounded-lg transition-all hover:text-text-primary hover:bg-bg-surface"
            @click="isMobileMenuOpen = false"
          >
            <Icon :name="cat.icon" class="w-5 h-5 text-accent-primary" />
            {{ cat.label }}
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </header>
</template>
