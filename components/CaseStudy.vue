<template>
  <article class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
    <div
      class="aspect-[4/3] bg-[var(--color-cream-dark)] rounded-2xl"
      :class="layout === 'image-right' ? 'lg:order-2' : 'lg:order-1'"
    />

    <div :class="layout === 'image-right' ? 'lg:order-1' : 'lg:order-2'">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-caption text-[var(--color-accent)] font-medium">{{ year }}</span>
        <span
          v-for="tech in stack"
          :key="tech"
          class="text-caption text-[var(--color-muted)] bg-[var(--color-cream-dark)] px-2.5 py-0.5 rounded-full"
        >
          {{ tech }}
        </span>
      </div>

      <h3 class="font-display text-display-sm text-[var(--color-ink)] mt-4">
        {{ name }}
      </h3>

      <p class="text-body-lg text-[var(--color-ink)] mt-3">
        {{ tagline }}
      </p>

      <p class="text-body text-[var(--color-muted)] mt-6">
        {{ description }}
      </p>

      <div class="mt-8">
        <a
          v-if="link"
          :href="link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-body text-[var(--color-ink)] font-medium hover:text-[var(--color-accent)] transition-colors duration-200"
        >
          View project →
        </a>
        <span
          v-else
          class="text-caption text-[var(--color-muted)] uppercase tracking-widest"
        >
          Private project
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  tagline: string
  description: string
  stack: string[]
  year: string
  link: string | null
  layout: 'image-left' | 'image-right'
}>()
</script>
