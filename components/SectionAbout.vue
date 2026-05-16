<template>
  <!--
    About section — design rhythm mirrors hero:
    - Eyebrow pill with pulse dot
    - Large headline (one tone, no decoration — restrained for a section heading)
    - Two-column body / stats split, mirroring hero's text-left / visual-right
    - Apple HIG-aligned spacing on an 8pt grid
    - Subtle accent atmosphere (blob + grid) for visual continuity with hero
  -->
  <section
    id="about"
    class="relative scroll-mt-20 overflow-hidden bg-[var(--color-surface)]
           py-24 md:py-32 lg:py-40
           px-6 md:px-8 lg:px-16"
  >
    <!-- ── Background atmosphere (mirrors hero treatment) ───────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Soft accent blob, top-right -->
      <div
        class="absolute"
        style="top: -10%; right: -5%; width: 700px; height: 700px;
               background: #FF5C1F; opacity: 0.035;
               filter: blur(140px); border-radius: 50%;
               animation: blob-drift-1 32s ease-in-out infinite;
               will-change: transform;"
      />
      <!-- Faint grid -->
      <div
        class="absolute inset-0"
        style="background-image:
                 linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px);
               background-size: 80px 80px;
               mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%);"
      />
    </div>

    <!-- Top divider — soft gradient line for section boundary -->
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
        ABOUT · 02
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
          text="Solo. Fast."
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
          text="AI-augmented."
          split="chars"
          :stagger="20"
          :delay="280"
          :duration="700"
          :y-offset="14"
          :blur="5"
        />
      </h2>

      <!-- ── Body + Stats grid (mirrors hero text-left / visual-right) ─ -->
      <div class="mt-16 md:mt-20 lg:mt-24 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        <!-- Body column (lg: 6 of 12) -->
        <div
          ref="bodyEl"
          class="reveal lg:col-span-6"
          :class="{ 'is-visible': bodyVisible }"
          :style="bodyStyle"
        >
          <p class="text-body-lg text-[var(--color-text-muted)] leading-relaxed max-w-xl">
            I build consumer apps, SaaS platforms, and production infrastructure. Recent work
            spans an AI-powered consumer iOS app, a service-business SaaS, and a 54-microservice
            fleet telematics platform with FMCSA compliance.
          </p>

          <p class="mt-6 text-body-lg text-[var(--color-text-muted)] leading-relaxed max-w-xl">
            I work fast because I work with modern AI tooling — Claude, Cursor, and Windsurf
            are part of my daily workflow. That means I ship in days what used to take weeks.
          </p>

          <!-- Live indicator — matches hero rhythm -->
          <div class="inline-flex items-center gap-2.5 mt-10">
            <span class="pulse-dot" aria-hidden="true" />
            <span class="font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-dim)]">
              Operating from Addison, IL · Est. 2015 · UNCC Inc.
            </span>
          </div>
        </div>

        <!-- Stats column (lg: 5 of 12, offset 1) -->
        <div class="lg:col-span-5 lg:col-start-8">
          <div class="stat-stack">
            <div
              v-for="(stat, i) in stats"
              :key="stat.label"
              :ref="(el) => { if (el) statEls[i] = el as HTMLElement }"
              class="reveal stat-card"
              :class="{ 'is-visible': statVisible[i] }"
              :style="{ transitionDelay: `${(i + 1) * 120}ms` }"
            >
              <div class="stat-content">
                <div class="stat-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</div>

                <p class="stat-label">{{ stat.label }}</p>

                <p class="stat-value">{{ stat.value }}</p>

                <p v-if="stat.detail" class="stat-detail">{{ stat.detail }}</p>
              </div>
            </div>
          </div>
        </div>

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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useSpotlight } from '~/composables/useSpotlight'

interface Stat {
  label: string
  value: string
  detail?: string
}

const stats: Stat[] = [
  { label: 'Products shipped', value: '03', detail: 'OMENORA · Reachify Labs · Fleet platform' },
  { label: 'Stack breadth',    value: 'Web · Mobile · Infra', detail: 'Vue · Nuxt · Swift · Go · Postgres' },
  { label: 'Response time',    value: '< 4H',  detail: 'Async-first, deep-work blocks' },
]

const { el: eyebrowEl, isVisible: eyebrowVisible, style: eyebrowStyle } = useScrollReveal({ delay: 0 })
const { el: bodyEl,    isVisible: bodyVisible,    style: bodyStyle    } = useScrollReveal({ delay: 240 })

const statEls = ref<HTMLElement[]>([])
const statVisible = ref(stats.map(() => false))

useSpotlight(statEls)

let observers: IntersectionObserver[] = []

onMounted(() => {
  if (typeof window === 'undefined') return
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  statEls.value.forEach((el, i) => {
    if (!el) { statVisible.value[i] = true; return }
    if (prefersReduced) { statVisible.value[i] = true; return }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          statVisible.value[i] = true
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(el)
    observers.push(obs)
  })
})

onBeforeUnmount(() => {
  observers.forEach(o => o.disconnect())
  observers = []
})
</script>

<style scoped>
/* ── Stat stack ─────────────────────────────────────────────────────────── */
.stat-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  /* Borders drawn via card-level border-top so they read as a connected list */
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.stat-card {
  position: relative;
  padding: 0;
  border-bottom: 1px solid var(--color-border);
  transition: background 320ms cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.stat-card:last-child {
  border-bottom: none;
}

/* Inner content uses the actual grid layout — separated from the card
   so the spotlight ::after can sit underneath. */
.stat-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto;
  column-gap: 20px;
  row-gap: 4px;
  padding: 28px 4px;
}

/* Spotlight cursor — same vocabulary as ServiceCard */
.stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    380px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
    rgba(255, 92, 31, 0.07),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 400ms ease;
  pointer-events: none;
  z-index: 0;
}

.stat-card:hover {
  background: linear-gradient(
    90deg,
    rgba(255, 92, 31, 0.04) 0%,
    transparent 80%
  );
}

.stat-card:hover::after {
  opacity: 1;
}

.stat-card:hover .stat-index {
  color: var(--color-accent);
}

/* Stat index — small mono numeral on the left */
.stat-index {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  align-self: start;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--color-text-dim);
  padding-top: 8px;
  transition: color 320ms ease;
  min-width: 24px;
}

.stat-label {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dim);
  padding-top: 8px;
}

.stat-value {
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  margin-top: 6px;
  font-size: 1.875rem;       /* display-sm equivalent */
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.stat-detail {
  grid-row: 3 / 4;
  grid-column: 2 / 3;
  margin-top: 10px;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-text-dim);
  line-height: 1.5;
}

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (min-width: 768px) {
  .stat-card {
    padding: 32px 8px;
    column-gap: 28px;
  }
  .stat-value {
    font-size: 2.25rem;        /* slightly larger on tablet+ */
  }
}

@media (min-width: 1024px) {
  .stat-card {
    padding: 36px 8px;
  }
  .stat-value {
    font-size: 2.5rem;         /* display-md on desktop */
  }
}
</style>
