<template>
  <section id="work" class="py-32 scroll-mt-20">
    <p class="text-caption uppercase tracking-widest text-[var(--color-accent)] mb-6">
      Selected Work
    </p>

    <h2 class="font-display text-display-md text-[var(--color-ink)] mb-24">
      Things I've built.
    </h2>

    <div class="space-y-24">
      <CaseStudy
        v-for="(project, index) in projects"
        :key="project.name"
        v-bind="project"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Project {
  name: string
  tagline: string
  description: string
  stack: string[]
  year: string
  link: string | null
  layout: 'image-left' | 'image-right'
}

const projects: Project[] = [
  {
    name: 'OMENORA',
    tagline: 'AI-powered consumer iOS app for personalized guidance.',
    description:
      'A subscription mobile app built with React Native and Nuxt 3, integrating Claude AI for personalized content generation and real astronomical calculations. Live web product, iOS launching within days.',
    stack: ['Nuxt 3', 'React Native', 'Supabase', 'Claude API', 'Stripe', 'RevenueCat'],
    year: '2025–2026',
    link: 'https://omenora.com',
    layout: 'image-left',
  },
  {
    name: 'Reachify Labs',
    tagline: 'AI receptionist and CRM for local service businesses.',
    description:
      'A full SaaS platform serving plumbers, HVAC techs, and contractors with AI call handling, lead management, and review automation. Tiered subscription pricing, white-label capable.',
    stack: ['Nuxt 3', 'Node.js', 'Twilio', 'ElevenLabs', 'Stripe'],
    year: '2024–2025',
    link: 'https://reachifylabs.com',
    layout: 'image-right',
  },
  {
    name: 'TMS / ELD Platform',
    tagline: '54-microservice fleet platform with FMCSA compliance.',
    description:
      'Production system handling Hours of Service compliance, dispatch, geofencing, and digital DQ files for fleet operations. Built with Kafka, Kubernetes, gRPC, and PostgreSQL. Driver app in React Native with offline-first SQLite.',
    stack: ['TypeScript', 'Fastify', 'Kafka', 'Kubernetes', 'PostgreSQL', 'React Native'],
    year: '2023–2025',
    link: null,
    layout: 'image-left',
  },
]
</script>
