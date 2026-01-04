<script setup lang="ts">
// Toast system is handled via useToast() composable - no provide/inject needed
</script>

<template>
  <MotionBackground variant="calm" :particle-count="25">
    <div class="min-h-screen flex flex-col">
      <AppNavbar />
      <main class="flex-1 pt-16">
        <slot />
      </main>
      <AppFooter />
    </div>

    <!-- Global toast container -->
    <ToastContainer />
  </MotionBackground>
</template>
