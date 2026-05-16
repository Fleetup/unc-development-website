<template>
  <!--
    Process section — same design rhythm as hero / about / work / services:
    - Eyebrow pill with accent pulse dot
    - Two-tone headline
    - Mono subhead
    - Atmospheric background + top divider
    - Apple HIG-aligned spacing on 8pt grid
  -->
  <section
    id="process"
    class="relative scroll-mt-20 overflow-hidden bg-[var(--color-surface)]
           py-24 md:py-32 lg:py-40
           px-6 md:px-8 lg:px-16"
  >
    <!-- ── Background atmosphere ────────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Soft accent blob, top-left -->
      <div
        class="absolute"
        style="top: -10%; left: -8%; width: 720px; height: 720px;
               background: #FF5C1F; opacity: 0.035;
               filter: blur(140px); border-radius: 50%;
               animation: blob-drift-2 34s ease-in-out infinite;
               will-change: transform;"
      />
      <!-- Faint grid -->
      <div
        class="absolute inset-0"
        style="background-image:
                 linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px);
               background-size: 80px 80px;
               mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, black 0%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 35%, black 0%, transparent 100%);"
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
        PROCESS · 05
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
          text="Simple. Fast."
          split="chars"
          :stagger="22"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
        <br />
        <SplitText
          tag="span"
          class="text-[var(--color-text-muted)]"
          text="Idea to first deploy."
          split="chars"
          :stagger="18"
          :delay="300"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
      </h2>

      <!-- ── Subhead ─────────────────────────────────────────────────── -->
      <p
        ref="subEl"
        class="reveal mt-8 font-mono text-[0.9375rem] md:text-body-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed"
        :class="{ 'is-visible': subVisible }"
        :style="subStyle"
      >
        Three steps from first message to first deployment. No agency overhead,
        no decision-by-committee, no scope-creep theater.
      </p>

      <!-- ── Steps grid ──────────────────────────────────────────────── -->
      <div class="grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 mt-16 md:mt-20 lg:mt-24">
        <ProcessStep
          v-for="(step, i) in steps"
          :key="step.number"
          v-bind="step"
          :is-last="i === steps.length - 1"
          :reveal-delay="i * 120"
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

interface Step {
  number: string
  title: string
  description: string
  annotation: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Discovery call',
    description: "30-minute call to understand what you're building, your timeline, and whether we're a fit.",
    annotation: '30 minutes · free',
  },
  {
    number: '02',
    title: 'Quote in 24 hours',
    description: 'Clear scope, flat fee or hourly rate, and a realistic timeline. No back-and-forth.',
    annotation: 'Scope · price · timeline',
  },
  {
    number: '03',
    title: 'Build + weekly demos',
    description: "Weekly demos. You see progress every week. Final delivery when it's ready.",
    annotation: 'Deploy when ready',
  },
]

const { el: eyebrowEl, isVisible: eyebrowVisible, style: eyebrowStyle } = useScrollReveal({ delay: 0 })
const { el: subEl,     isVisible: subVisible,     style: subStyle     } = useScrollReveal({ delay: 240 })
</script>
