<script setup lang="ts">
const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Home', path: '/', icon: 'ph:house-fill' },
  { label: 'New', path: '/category/new', icon: 'ph:sparkle-fill' },
  { label: 'Popular', path: '/category/popular', icon: 'ph:fire-fill' },
  { label: 'Favorites', path: '/favorites', icon: 'ph:heart-fill' },
]

const moreCategories = [
  { label: 'Action', path: '/category/action', icon: 'ph:lightning-fill' },
  { label: 'Shooter', path: '/category/shooter', icon: 'ph:crosshair-fill' },
  { label: 'Puzzle', path: '/category/puzzle', icon: 'ph:puzzle-piece-fill' },
  { label: 'Racing', path: '/category/racing', icon: 'ph:car-fill' },
  { label: 'Sports', path: '/category/sports', icon: 'ph:soccer-ball-fill' },
  { label: 'Adventure', path: '/category/adventure', icon: 'ph:compass-fill' },
  { label: 'Arcade', path: '/category/arcade', icon: 'ph:game-controller-fill' },
  { label: 'Multiplayer', path: '/category/multiplayer', icon: 'ph:users-fill' },
  { label: 'Strategy', path: '/category/strategy', icon: 'ph:chess-fill' },
]

const showCategories = ref(false)

// Close dropdown when clicking outside
const closeDropdown = () => {
  setTimeout(() => {
    showCategories.value = false
  }, 150)
}
</script>

<template>
  <header class="navbar">
    <div class="max-w-screen-2xl mx-auto h-full px-4 md:px-6 flex items-center gap-4">
      <!-- Logo -->
      <NuxtLink to="/" class="logo-link group">
        <div class="logo-icon">
          <Icon name="ph:planet-fill" class="w-5 h-5 text-white" />
        </div>
        <div class="hidden sm:flex flex-col leading-none">
          <span class="text-base font-bold tracking-tight gradient-text-brand">ANDROMEDA</span>
          <span class="text-[10px] font-medium text-text-muted uppercase tracking-widest">GAMES</span>
        </div>
      </NuxtLink>

      <!-- Navigation (Desktop) -->
      <nav class="hidden lg:flex items-center gap-1 ml-6">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="nav-link-active"
        >
          <Icon :name="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </NuxtLink>

        <!-- Categories Dropdown -->
        <div class="relative">
          <button
            class="nav-link"
            @click="showCategories = !showCategories"
            @blur="closeDropdown"
          >
            <Icon name="ph:squares-four-fill" class="w-4 h-4" />
            Categories
            <Icon name="ph:caret-down" class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': showCategories }" />
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-2"
          >
            <div v-if="showCategories" class="dropdown-menu">
              <div class="p-2 grid grid-cols-2 gap-1">
                <NuxtLink
                  v-for="cat in moreCategories"
                  :key="cat.path"
                  :to="cat.path"
                  class="dropdown-item"
                  @click="showCategories = false"
                >
                  <Icon :name="cat.icon" class="w-4 h-4 text-brand-primary" />
                  {{ cat.label }}
                </NuxtLink>
              </div>
            </div>
          </Transition>
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
          class="action-btn md:hidden"
          aria-label="Search"
          @click="isSearchOpen = !isSearchOpen"
        >
          <Icon name="ph:magnifying-glass" class="w-5 h-5" />
        </button>

        <!-- Menu Toggle (Mobile) -->
        <button
          class="action-btn lg:hidden"
          aria-label="Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Search -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isSearchOpen" class="mobile-panel md:hidden">
        <div class="p-4">
          <SearchInput @search="isSearchOpen = false" />
        </div>
      </div>
    </Transition>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="mobile-panel lg:hidden max-h-[80vh] overflow-y-auto">
        <nav class="p-4 space-y-1">
          <!-- Main Nav -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
            @click="isMobileMenuOpen = false"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </NuxtLink>

          <!-- Divider -->
          <div class="h-px bg-white/5 my-3" />

          <!-- Categories -->
          <p class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-muted">Categories</p>
          <NuxtLink
            v-for="cat in moreCategories"
            :key="cat.path"
            :to="cat.path"
            class="mobile-nav-link"
            @click="isMobileMenuOpen = false"
          >
            <Icon :name="cat.icon" class="w-5 h-5 text-brand-primary" />
            {{ cat.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.navbar {
  @apply fixed top-0 left-0 right-0 z-50 h-16;
  background: rgba(15, 10, 31, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.logo-link {
  @apply flex items-center gap-3 text-text-primary shrink-0;
}

.logo-icon {
  @apply relative w-10 h-10 rounded-xl flex items-center justify-center;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c084fc 100%);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  transition: all 0.3s ease;
}

.logo-link:hover .logo-icon {
  box-shadow: 0 6px 28px rgba(139, 92, 246, 0.6);
  transform: scale(1.05) rotate(-5deg);
}

.gradient-text-brand {
  background: linear-gradient(135deg, #c084fc 0%, #a78bfa 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-link {
  @apply flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-secondary rounded-xl;
  @apply transition-all duration-200;
}

.nav-link:hover {
  @apply text-text-primary;
  background: rgba(139, 92, 246, 0.1);
}

.nav-link-active {
  color: #c084fc !important;
  background: rgba(139, 92, 246, 0.15);
}

.dropdown-menu {
  @apply absolute top-full left-0 mt-2 w-72 rounded-2xl overflow-hidden;
  background: rgba(20, 15, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1);
}

.dropdown-item {
  @apply flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary rounded-xl;
  @apply transition-all duration-200;
}

.dropdown-item:hover {
  @apply text-text-primary;
  background: rgba(139, 92, 246, 0.15);
}

.action-btn {
  @apply p-2.5 text-text-secondary rounded-xl;
  @apply transition-all duration-200;
}

.action-btn:hover {
  @apply text-text-primary;
  background: rgba(139, 92, 246, 0.1);
}

.mobile-panel {
  @apply absolute top-16 left-0 right-0;
  background: rgba(15, 10, 31, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.mobile-nav-link {
  @apply flex items-center gap-3 px-4 py-3 text-sm font-semibold text-text-secondary rounded-xl;
  @apply transition-all duration-200;
}

.mobile-nav-link:hover {
  @apply text-text-primary;
  background: rgba(139, 92, 246, 0.1);
}

.mobile-nav-link-active {
  color: #c084fc !important;
  background: rgba(139, 92, 246, 0.15);
}

.text-brand-primary {
  color: #a78bfa;
}
</style>
