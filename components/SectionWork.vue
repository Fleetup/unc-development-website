<template>
  <!--
    Work section — same design rhythm as hero / about:
    - Eyebrow pill with accent pulse dot
    - Two-line headline (full white + muted second line)
    - Body subhead in mono
    - Atmospheric background + top divider
    - Apple HIG-aligned spacing on 8pt grid
  -->
  <section
    id="work"
    class="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)]"
  >
    <!-- ── Background atmosphere ────────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Soft accent blob, mid-left -->
      <div
        class="absolute"
        style="top: 20%; left: -8%; width: 700px; height: 700px;
               background: #FF5C1F; opacity: 0.035;
               filter: blur(140px); border-radius: 50%;
               animation: blob-drift-2 38s ease-in-out infinite;
               will-change: transform;"
      />
      <!-- Faint grid -->
      <div
        class="absolute inset-0"
        style="background-image:
                 linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px);
               background-size: 80px 80px;
               mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%);"
      />
    </div>

    <!-- Top divider -->
    <div
      class="absolute top-0 left-0 right-0 h-px pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(90deg, transparent, var(--color-border-strong) 50%, transparent);"
    />

    <!-- ── Section header ───────────────────────────────────────────────── -->
    <div
      class="relative z-10 max-w-7xl mx-auto
             px-6 md:px-8 lg:px-16
             py-24 md:py-32 lg:py-40"
    >
      <!-- Eyebrow -->
      <p
        ref="eyebrowEl"
        class="reveal inline-flex items-center gap-2.5 font-mono text-caption uppercase tracking-widest text-[var(--color-accent)]"
        :class="{ 'is-visible': eyebrowVisible }"
        :style="eyebrowStyle"
      >
        <span class="pulse-dot" style="background-color: var(--color-accent);" aria-hidden="true" />
        SELECTED WORK · 03
      </p>

      <!-- Headline — two-tone like about -->
      <h2
        class="mt-6 md:mt-8
               text-[2.5rem] sm:text-5xl md:text-6xl lg:text-display-lg
               font-medium tracking-tight leading-[1.05]
               text-[var(--color-text)] max-w-4xl"
      >
        <SplitText
          tag="span"
          text="Things I've shipped."
          split="chars"
          :stagger="18"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
        <br />
        <SplitText
          tag="span"
          class="text-[var(--color-text-muted)]"
          text="Real systems. Real users."
          split="chars"
          :stagger="16"
          :delay="320"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
      </h2>

      <!-- Subhead -->
      <p
        ref="subEl"
        class="reveal mt-8 font-mono text-[0.9375rem] md:text-body-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed"
        :class="{ 'is-visible': subVisible }"
        :style="subStyle"
      >
        Production systems. Real users. Real revenue. From AI-powered consumer apps to
        54-microservice fleet platforms.
      </p>
    </div>

    <!-- ── Case studies ─────────────────────────────────────────────────── -->
    <CaseStudy
      v-for="(project, i) in projects"
      :key="project.name"
      v-bind="project"
      :index="i"
      :total="projects.length"
    />
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

interface Metric {
  label: string
  value: string
}

interface Project {
  name: string
  tagline: string
  description: string
  stack: string[]
  accentStack: string[]
  metrics: Metric[]
  year: string
  link: string | null
  screenshot?: string
  screenshotUrl?: string
}

const projects: Project[] = [
  {
    name: 'OMENORA',
    tagline: 'AI-powered consumer iOS app for personalized guidance.',
    description:
      'A subscription mobile app built with React Native and Nuxt 3, integrating Claude AI for personalized content generation and real astronomical calculations. Live web product, iOS launching within days.',
    stack: ['Nuxt 3', 'React Native', 'Supabase', 'Claude API', 'Stripe', 'RevenueCat'],
    accentStack: ['Nuxt 3', 'React Native', 'Claude API'],
    metrics: [
      { label: 'Stack',     value: '12+' },
      { label: 'Deploy',    value: 'Web + iOS' },
      { label: 'AI model',  value: 'Claude' },
    ],
    year: '2025–2026',
    link: 'https://omenora.com',
    screenshot: '/frames/Omenora-Homepage.webp',
    screenshotUrl: 'omenora.com',
  },
  {
    name: 'Reachify Labs',
    tagline: 'AI receptionist and CRM for local service businesses.',
    description:
      'A full SaaS platform serving plumbers, HVAC techs, and contractors with AI call handling, lead management, and review automation. Tiered subscription pricing, white-label capable.',
    stack: ['Nuxt 3', 'Node.js', 'Twilio', 'ElevenLabs', 'Stripe'],
    accentStack: ['Twilio', 'ElevenLabs'],
    metrics: [
      { label: 'Features',     value: '8 mod' },
      { label: 'Integrations', value: '5' },
      { label: 'Pricing',      value: '$197–597' },
    ],
    year: '2024–2025',
    link: 'https://reachifylabs.com',
    screenshot: '/frames/Reachify-Homepage.webp',
    screenshotUrl: 'reachifylabs.com',
  },
  {
    name: 'Northrive Studio',
    tagline: 'Brand identity and web presence for a creative studio.',
    description:
      'Full-stack marketing site and brand system for a boutique creative studio. Built with Nuxt 3 and Tailwind CSS, with a focus on performance, animation, and a refined visual identity.',
    stack: ['Nuxt 3', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    accentStack: ['Nuxt 3', 'Tailwind CSS'],
    metrics: [
      { label: 'Performance', value: '100' },
      { label: 'Deploy',      value: 'Vercel' },
      { label: 'Type',        value: 'Studio' },
    ],
    year: '2025',
    link: 'https://northrivestudio.com',
    screenshot: '/frames/Northrive-Studio.webp',
    screenshotUrl: 'northrivestudio.com',
  },
  {
    name: 'TMS / ELD Platform',
    tagline: '54-microservice fleet platform with FMCSA compliance.',
    description:
      'Production system handling Hours of Service compliance, dispatch, geofencing, and digital DQ files for fleet operations. Built with Kafka, Kubernetes, gRPC, and PostgreSQL. Driver app in React Native with offline-first SQLite.',
    stack: ['TypeScript', 'Fastify', 'Kafka', 'Kubernetes', 'PostgreSQL', 'React Native'],
    accentStack: ['Kafka', 'Kubernetes', 'TypeScript'],
    metrics: [
      { label: 'Services',   value: '54' },
      { label: 'Fleet size', value: '200' },
      { label: 'Compliance', value: 'FMCSA' },
    ],
    year: '2023–2025',
    link: null,
    screenshot: '/frames/Omnia-Dashboard.webp',
    screenshotUrl: 'fleet.internal',
  },
]

const { el: eyebrowEl, isVisible: eyebrowVisible, style: eyebrowStyle } = useScrollReveal({ delay: 0 })
const { el: subEl,     isVisible: subVisible,     style: subStyle     } = useScrollReveal({ delay: 240 })
</script>
