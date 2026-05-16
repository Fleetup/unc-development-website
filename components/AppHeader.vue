<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300"
    :class="scrolled
      ? 'bg-[var(--color-bg)]/70 backdrop-blur-xl border-b border-[var(--color-border)]'
      : 'bg-transparent border-b border-transparent'"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-16 flex items-center justify-between h-full">
      <!-- Brand: logo + wordmark -->
      <a
        href="/"
        class="brand inline-flex items-center gap-2.5 text-[var(--color-text)] leading-none transition-colors duration-200"
        aria-label="UNC Development — home"
      >
        <!-- Inline SVG so we can drive the fills with our palette
             (gray polygons → currentColor; blue polygons → accent) -->
        <svg
          class="logo-svg"
          viewBox="0 0 482.87 267.54"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon class="logo-primary" points="226.2 57.28 0 114.57 0 57.28 226.2 0 226.2 57.28" />
          <polygon class="logo-primary" points="241.43 267.54 0 210.07 0 152.6 241.43 210.07 241.43 267.54" />
          <polygon class="logo-accent"  points="241.43 267.54 482.87 210.07 482.87 152.6 241.43 210.07 241.43 267.54" />
          <polygon class="logo-primary" points="241.43 171.98 482.87 114.51 482.87 57.04 241.43 114.51 241.43 171.98" />
          <polygon class="logo-accent"  points="241.43 171.98 0 114.51 0 57.04 241.43 114.51 241.43 171.98" />
        </svg>

        <span class="brand-wordmark">
          <span class="brand-name">UNC</span>
          <span class="brand-suffix">Development</span>
        </span>
      </a>

      <div class="hidden sm:flex items-center gap-8">
        <nav class="flex items-center gap-8">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="font-mono text-[var(--color-text-muted)] text-[13px] hover:text-[var(--color-accent)] transition-colors duration-150"
          >
            {{ link.label }}
          </a>
        </nav>

        <a
          href="#contact"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 hover:bg-[var(--color-success)]/10 transition-colors duration-150"
        >
          <span class="pulse-dot" aria-hidden="true" style="width:0.375rem;height:0.375rem;" />
          <span class="font-mono text-[var(--color-success)] text-[11px] whitespace-nowrap">available · replying in 4h</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { computed } from 'vue'

const { y } = useScroll(typeof window !== 'undefined' ? window : null)
const scrolled = computed(() => y.value > 50)

const navLinks = [
  { label: 'work', href: '#work' },
  { label: 'services', href: '#services' },
  { label: 'process', href: '#process' },
  { label: 'contact', href: '#contact' },
]
</script>

<style scoped>
/* ── Logo SVG ───────────────────────────────────────────────────────── */
.logo-svg {
  /* Logo aspect ≈ 1.805. At 18px tall it sits cleanly against the
     14-15px wordmark caps and leaves room in the 64px header. */
  height: 18px;
  width: auto;
  flex-shrink: 0;
  color: var(--color-text);
  transition: color 200ms ease;
}

.logo-primary {
  fill: currentColor;
  transition: fill 220ms ease;
}

.logo-accent {
  fill: var(--color-accent);
  transition: fill 220ms ease;
}

/* On hover: primary blocks tint slightly toward muted so the accent
   pops more — keeps the brand visually "alive" without an obvious flip. */
.brand:hover .logo-primary {
  fill: var(--color-text-muted);
}

.brand:hover .logo-accent {
  fill: var(--color-accent-hover);
}

/* ── Wordmark ───────────────────────────────────────────────────────── */
.brand-wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.04em;
  line-height: 1;
  transition: color 200ms ease;
}

.brand-name {
  color: var(--color-text);
  font-weight: 500;
  letter-spacing: 0.08em;
}

.brand-suffix {
  color: var(--color-text-muted);
  font-weight: 400;
}

.brand:hover .brand-name,
.brand:hover .brand-suffix {
  color: var(--color-accent);
}

/* On very small screens, drop the suffix to keep the header clean */
@media (max-width: 380px) {
  .brand-suffix {
    display: none;
  }
}
</style>
