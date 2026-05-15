<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'border-b border-[var(--color-border)]' : 'border-b border-transparent'"
  >
    <div
      class="bg-[var(--color-cream)]/80 backdrop-blur-md"
    >
      <div class="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 flex items-center justify-between h-16">
        <a
          href="/"
          class="font-display text-[20px] text-[var(--color-ink)] leading-none tracking-tight"
        >
          Miki Jokovic
        </a>

        <nav class="hidden sm:flex items-center gap-8">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-[var(--color-muted)] text-sm hover:text-[var(--color-ink)] transition-colors duration-200"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { computed } from 'vue'

const { y } = useScroll(typeof window !== 'undefined' ? window : null)

const scrolled = computed(() => y.value > 20)

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]
</script>
