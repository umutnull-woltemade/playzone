<script setup lang="ts">
// Use the global toast composable
const { toasts, remove } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          @dismiss="remove(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  @apply fixed top-4 right-4 z-[100] flex flex-col gap-3;
  @apply w-full max-w-sm;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

/* List transitions */
.toast-list-enter-active {
  transition: all 0.3s ease-out;
}

.toast-list-leave-active {
  transition: all 0.2s ease-in;
  position: absolute;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
