<template>
  <!--
    Services section — same design rhythm as hero / about / work:
    - Eyebrow pill with accent pulse dot
    - Two-tone headline
    - Mono subhead
    - Atmospheric background + top divider
    - Apple HIG-aligned spacing on 8pt grid
  -->
  <section
    id="services"
    class="relative scroll-mt-20 overflow-hidden bg-[var(--color-bg)]
           py-24 md:py-32 lg:py-40
           px-6 md:px-8 lg:px-16"
  >
    <!-- ── Background atmosphere ────────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Soft accent blob, bottom-right -->
      <div
        class="absolute"
        style="bottom: -10%; right: -8%; width: 720px; height: 720px;
               background: #FF5C1F; opacity: 0.035;
               filter: blur(140px); border-radius: 50%;
               animation: blob-drift-1 36s ease-in-out infinite;
               will-change: transform;"
      />
      <!-- Faint grid -->
      <div
        class="absolute inset-0"
        style="background-image:
                 linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px);
               background-size: 80px 80px;
               mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 100%);"
      />
    </div>

    <!-- Top divider -->
    <div
      class="absolute top-0 left-0 right-0 h-px pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(90deg, transparent, var(--color-border-strong) 50%, transparent);"
    />

    <div class="relative z-10 max-w-7xl mx-auto">

      <!-- ── Eyebrow ─────────────────────────────────────────────────── -->
      <p
        ref="eyebrowEl"
        class="reveal inline-flex items-center gap-2.5 font-mono text-caption uppercase tracking-widest text-[var(--color-accent)]"
        :class="{ 'is-visible': eyebrowVisible }"
        :style="eyebrowStyle"
      >
        <span class="pulse-dot" style="background-color: var(--color-accent);" aria-hidden="true" />
        SERVICES · 04
      </p>

      <!-- ── Headline ────────────────────────────────────────────────── -->
      <h2
        class="mt-6 md:mt-8
               text-[2.5rem] sm:text-5xl md:text-6xl lg:text-display-lg
               font-medium tracking-tight leading-[1.05]
               text-[var(--color-text)] max-w-4xl"
      >
        <SplitText
          tag="span"
          text="How we can work together."
          split="chars"
          :stagger="16"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
        <br />
        <SplitText
          tag="span"
          class="text-[var(--color-text-muted)]"
          text="Flat-fee. Hourly. Retainer."
          split="chars"
          :stagger="16"
          :delay="340"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
      </h2>

      <!-- ── Subhead ─────────────────────────────────────────────────── -->
      <p
        ref="leadEl"
        class="reveal mt-8 font-mono text-[0.9375rem] md:text-body-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed"
        :class="{ 'is-visible': leadVisible }"
        :style="leadStyle"
      >
        Six ways to engage. From a 2-week productized sprint to a long-term part-time
        engineering retainer. All work is solo, AI-augmented, and shipped fast.
      </p>

      <!-- ── Service grid ─────────────────────────────────────────────── -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-20 lg:mt-24">
        <ServiceCard
          v-for="(service, i) in services"
          :key="service.name"
          v-bind="service"
          :card-index="i + 1"
          :reveal-delay="i * 80"
        />
      </div>
    </div>

    <!-- Bottom divider -->
    <div
      class="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(90deg, transparent, var(--color-border-strong) 50%, transparent);"
    />
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

interface Service {
  name: string
  description: string
  pricing: string
  pricingUnit?: string
  type: string
}

const services: Service[] = [
  {
    name: 'MVP Build',
    description: "I'll build your full MVP from idea to deployed product in 2–4 weeks. Web app, mobile app, or both.",
    pricing: '$3,500',
    type: 'Project-based',
  },
  {
    name: 'Web App Development',
    description: 'Hourly engagement to build, ship, or extend a custom web application.',
    pricing: '$65',
    pricingUnit: '/hr',
    type: 'Hourly',
  },
  {
    name: 'Mobile App Development',
    description: 'Hourly engagement for React Native / Expo iOS and Android applications.',
    pricing: '$65',
    pricingUnit: '/hr',
    type: 'Hourly',
  },
  {
    name: 'Monthly Retainer',
    description: 'I become your part-time engineer. 30–40 hours per month of new features, fixes, and infrastructure work.',
    pricing: '$3,500',
    pricingUnit: '/mo',
    type: 'Retainer',
  },
  {
    name: 'Codebase Audit & Roadmap',
    description: 'Three-day codebase review with a written report covering architecture, security, scalability, and recommended next steps.',
    pricing: '$1,500',
    type: 'Productized',
  },
  {
    name: 'AI Integration Sprint',
    description: 'Two-week sprint to add production AI features to your existing application. Claude, OpenAI, or custom workflows.',
    pricing: '$2,500',
    type: 'Productized',
  },
]

const { el: eyebrowEl, isVisible: eyebrowVisible, style: eyebrowStyle } = useScrollReveal({ delay: 0 })
const { el: leadEl,    isVisible: leadVisible,    style: leadStyle    } = useScrollReveal({ delay: 240 })
</script>
