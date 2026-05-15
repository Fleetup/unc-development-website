<template>
  <footer class="border-t border-[var(--color-border)] py-16">
    <div class="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      <div class="grid md:grid-cols-3 gap-12 md:gap-8">
        <div>
          <p class="font-display text-[var(--color-ink)] text-[20px] leading-none tracking-tight">
            Miki Jokovic
          </p>
          <p class="text-caption text-[var(--color-muted)] mt-3 leading-relaxed">
            Operating under UNC Development<br />
            (UNCC Inc.), Addison IL
          </p>
        </div>

        <nav class="flex flex-col gap-3">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-caption text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200 w-fit"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex flex-col gap-3">
          <a
            href="mailto:hello@uncdevelopment.com"
            class="text-caption text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200 w-fit"
          >
            hello@uncdevelopment.com
          </a>
          <a
            href="https://linkedin.com/in/miroslavjokovic"
            target="_blank"
            rel="noopener noreferrer"
            class="text-caption text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200 w-fit"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-16 pt-8 border-t border-[var(--color-border)]">
        <p class="text-caption text-[var(--color-muted)]">
          © 2026 Miki Jokovic
        </p>
        <p class="text-caption text-[var(--color-muted)]">
          Built with Nuxt 3 and Tailwind
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]
</script>
