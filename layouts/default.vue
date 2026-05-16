<template>
  <div
    class="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans"
    :style="glowStyle"
  >
    <div
      v-if="isActive"
      class="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style="background: radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(255,92,31,0.06), transparent 40%)"
      aria-hidden="true"
    />
    <div class="relative z-10">
      <AppHeader />
      <main class="pt-16">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCursorGlow } from '~/composables/useCursorGlow'

const { mouseX, mouseY, isActive } = useCursorGlow()

const glowStyle = computed(() => ({
  '--glow-x': `${mouseX.value}px`,
  '--glow-y': `${mouseY.value}px`,
}))
</script>
