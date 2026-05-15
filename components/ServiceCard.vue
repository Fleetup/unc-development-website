<template>
  <article class="p-8 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-colors duration-200 flex flex-col">
    <p class="text-caption uppercase tracking-widest text-[var(--color-muted)]">
      {{ type }}
    </p>

    <h3 class="font-display text-display-sm text-[var(--color-ink)] mt-3">
      {{ name }}
    </h3>

    <p class="text-body text-[var(--color-muted)] mt-3 flex-1">
      {{ description }}
    </p>

    <p class="text-body text-[var(--color-ink)] font-medium mt-6">
      {{ pricing }}
    </p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  description: string
  pricing: string
  type: string
}>()
</script>
