<template>
  <section id="process" class="py-32 scroll-mt-20">
    <p class="text-caption uppercase tracking-widest text-[var(--color-accent)] mb-6">
      Process
    </p>

    <h2 class="font-display text-display-md text-[var(--color-ink)] mb-20">
      Simple. Fast.
    </h2>

    <div class="grid md:grid-cols-3 gap-12">
      <div
        v-for="step in steps"
        :key="step.number"
      >
        <span class="font-display text-display-lg text-[var(--color-accent)] leading-none">
          {{ step.number }}
        </span>
        <h3 class="font-display text-display-sm text-[var(--color-ink)] mt-4">
          {{ step.title }}
        </h3>
        <p class="text-body text-[var(--color-muted)] mt-3">
          {{ step.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Step {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Free call',
    description: '30-minute call to understand what you\'re building, your timeline, and whether we\'re a fit.',
  },
  {
    number: '02',
    title: 'Quote within 24 hours',
    description: 'Clear scope, flat fee or hourly rate, and a realistic timeline. No back-and-forth.',
  },
  {
    number: '03',
    title: 'We build',
    description: 'Weekly demos. You see progress every week. Final delivery when it\'s ready.',
  },
]
</script>
