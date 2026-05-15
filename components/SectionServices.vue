<template>
  <section id="services" class="py-32 scroll-mt-20">
    <p class="text-caption uppercase tracking-widest text-[var(--color-accent)] mb-6">
      Services
    </p>

    <h2 class="font-display text-display-md text-[var(--color-ink)]">
      How we can work together.
    </h2>

    <p class="text-body-lg text-[var(--color-muted)] mt-4 max-w-2xl">
      Flat-fee projects for clearly scoped work. Hourly for ongoing development. Retainers for the long term.
    </p>

    <div class="grid lg:grid-cols-2 gap-12 mt-16">
      <div class="flex flex-col gap-6">
        <ServiceCard
          v-for="service in leftServices"
          :key="service.name"
          v-bind="service"
        />
      </div>
      <div class="flex flex-col gap-6">
        <ServiceCard
          v-for="service in rightServices"
          :key="service.name"
          v-bind="service"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Service {
  name: string
  description: string
  pricing: string
  type: string
}

const leftServices: Service[] = [
  {
    name: 'MVP Build',
    description: "I'll build your full MVP from idea to deployed product in 2–4 weeks. Web app, mobile app, or both.",
    pricing: 'from $3,500',
    type: 'Project-based',
  },
  {
    name: 'Web App Development',
    description: 'Hourly engagement to build, ship, or extend a custom web application.',
    pricing: 'from $65/hr',
    type: 'Hourly',
  },
  {
    name: 'Mobile App Development',
    description: 'Hourly engagement for React Native / Expo iOS and Android applications.',
    pricing: 'from $65/hr',
    type: 'Hourly',
  },
  {
    name: 'Codebase Audit & Roadmap',
    description: 'Three-day codebase review with a written report covering architecture, security, scalability, and recommended next steps.',
    pricing: '$1,500 flat',
    type: 'Productized',
  },
]

const rightServices: Service[] = [
  {
    name: 'Monthly Retainer',
    description: 'I become your part-time engineer. 30–40 hours per month of new features, fixes, and infrastructure work.',
    pricing: 'from $3,500/mo',
    type: 'Retainer',
  },
  {
    name: 'AI Integration Sprint',
    description: 'Two-week sprint to add production AI features to your existing application. Claude, OpenAI, or custom workflows.',
    pricing: 'from $2,500',
    type: 'Productized',
  },
  {
    name: 'Architecture Consulting',
    description: 'Hourly advisory for technical decisions, system design, and tooling for non-technical founders or junior teams.',
    pricing: 'from $95/hr',
    type: 'Hourly',
  },
]
</script>
