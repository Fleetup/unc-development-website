<template>
  <!--
    Case study card. Alternates bg between bg/surface for vertical rhythm.
    Layout mirrors hero/about: text-left / visual-right (or reversed for odd
    indices) with HIG-aligned spacing on an 8pt grid.
  -->
  <article
    ref="el"
    :id="`work-${slug}`"
    class="reveal relative overflow-hidden border-t border-[var(--color-border)]
           py-24 md:py-32 lg:py-40
           px-6 md:px-8 lg:px-16"
    :class="[
      { 'is-visible': isVisible },
      index % 2 === 0 ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-surface)]',
    ]"
    :style="revealStyle"
  >
    <!-- Subtle atmosphere (positioned to whichever side the mockup is on) -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute"
        :style="atmosphereStyle"
      />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">

      <!-- ── Top meta row: project number + year ─────────────────────── -->
      <div class="flex items-center gap-4 mb-10 md:mb-12 lg:mb-16">
        <span class="font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
          Project {{ String(index + 1).padStart(2, '0') }}
          <span class="text-[var(--color-text-dim)]">/ {{ String(total).padStart(2, '0') }}</span>
        </span>
        <span
          class="flex-1 h-px"
          style="background: linear-gradient(90deg, var(--color-border-strong), transparent);"
          aria-hidden="true"
        />
        <span class="font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-dim)]">
          {{ year }}
        </span>
      </div>

      <!-- ── Main 2-col grid: details + mockup ───────────────────────── -->
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        <!-- Details column -->
        <div
          class="lg:col-span-5"
          :class="isReverse ? 'lg:order-2 lg:col-start-8' : 'lg:order-1'"
        >
          <h3
            class="text-[2rem] sm:text-display-sm md:text-display-md
                   font-medium tracking-tight leading-[1.1] text-[var(--color-text)]"
          >
            {{ name }}
          </h3>

          <p class="mt-4 text-body-lg text-[var(--color-text-muted)] leading-relaxed max-w-md">
            {{ tagline }}
          </p>

          <p class="mt-6 text-body text-[var(--color-text-muted)] leading-relaxed max-w-md">
            {{ description }}
          </p>

          <!-- Stack -->
          <div class="mt-8">
            <p class="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
              Built with
            </p>
            <p class="mt-2 font-mono text-body-sm leading-relaxed">
              <template v-for="(tech, i) in stack" :key="tech">
                <span v-if="i > 0" class="text-[var(--color-border-strong)]"> · </span>
                <span
                  :class="accentStack.includes(tech)
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)]'"
                >{{ tech }}</span>
              </template>
            </p>
          </div>

          <!-- Actions — 44pt min touch target -->
          <div class="flex flex-wrap items-center gap-4 mt-10">
            <a
              v-if="link"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center justify-center gap-2
                     min-h-[44px] px-5 py-2.5
                     bg-[var(--color-surface-elevated)] text-[var(--color-text)]
                     border border-[var(--color-border)]
                     hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
                     transition-colors duration-200
                     font-mono text-caption rounded-full"
            >
              View live <IconArrow />
            </a>
            <span
              v-else
              class="inline-flex items-center min-h-[44px] font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-dim)]"
            >
              // private project
            </span>
          </div>
        </div>

        <!-- Mockup column -->
        <div
          class="lg:col-span-7"
          :class="isReverse ? 'lg:order-1' : 'lg:order-2 lg:col-start-6'"
        >
          <div ref="mockupWrapEl" class="mockup-wrap">
            <!-- Tilt layer — useTilt writes --tilt-x / --tilt-y to .mockup-wrap;
                 this inner div consumes them in a transform (separate layer
                 because BrowserFrame applies its own inline transform). -->
            <div class="mockup-tilt">
              <!-- Real browser frame for projects with a screenshot -->
              <BrowserFrame
                v-if="screenshot"
                :url="screenshotUrl ?? 'localhost'"
                :glow="true"
                width="100%"
                class="mockup-frame"
              >
                <img
                  :src="screenshot"
                  :alt="`${name} — preview`"
                  class="mockup-img"
                  loading="lazy"
                  draggable="false"
                />
              </BrowserFrame>

              <!-- Stylized placeholder for private projects (no screenshot) -->
              <div v-else class="mockup-placeholder">
                <BrowserFrame url="private.internal" width="100%">
                  <div class="placeholder-inner">
                    <span class="placeholder-tag">// private · not published</span>
                    <p class="placeholder-name">{{ name }}</p>
                    <span class="placeholder-meta">{{ tagline }}</span>
                  </div>
                </BrowserFrame>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Metrics row — full-width, editorial 3-column list ────────── -->
      <div class="metrics-row mt-16 md:mt-20">
        <div
          v-for="(metric, i) in metrics"
          :key="metric.label"
          :ref="(el) => { if (el) metricCellEls[i] = el as HTMLElement }"
          class="metric-cell"
        >
          <div class="metric-content">
            <span class="metric-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="metric-label">{{ metric.label }}</p>
            <p class="metric-value">{{ metric.value }}</p>
          </div>
        </div>
      </div>

    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useSpotlight } from '~/composables/useSpotlight'
import { useTilt } from '~/composables/useTilt'

interface Metric {
  label: string
  value: string
}

const props = defineProps<{
  name: string
  tagline: string
  description: string
  stack: string[]
  accentStack: string[]
  metrics: Metric[]
  year: string
  link: string | null
  index: number
  total: number
  screenshot?: string
  screenshotUrl?: string
}>()

const { el, isVisible, style: revealStyle } = useScrollReveal({ delay: 0 })

const metricCellEls = ref<HTMLElement[]>([])
useSpotlight(metricCellEls)

const mockupWrapEl = ref<HTMLElement | null>(null)
useTilt(mockupWrapEl, { max: 6 })

// Alternate layout direction so case studies feel editorial, not repetitive
const isReverse = computed(() => props.index % 2 === 1)

const slug = computed(() =>
  props.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
)

// Atmosphere blob positioned opposite the mockup to add depth without crowding
const atmosphereStyle = computed(() => {
  const side = isReverse.value ? 'left: -5%;' : 'right: -5%;'
  return `top: 30%; ${side} width: 540px; height: 540px;
          background: #FF5C1F; opacity: 0.04;
          filter: blur(120px); border-radius: 50%;`
})
</script>

<style scoped>
/* ── Mockup wrap ─────────────────────────────────────────────────────── */
.mockup-wrap {
  position: relative;
  width: 100%;
  /* Subtle accent glow underneath, matches carousel center glow */
  filter: drop-shadow(0 28px 50px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 60px rgba(255, 92, 31, 0.08));
  /* 3D tilt — useTilt composable writes --tilt-x / --tilt-y from mousemove */
  perspective: 1500px;
  transform-style: preserve-3d;
}

/* The tilt layer reads the CSS vars written by useTilt on .mockup-wrap.
   Separating tilt from .mockup-frame avoids fighting BrowserFrame's
   own inline transform. */
.mockup-tilt {
  transform:
    rotateX(var(--tilt-x, 0deg))
    rotateY(var(--tilt-y, 0deg))
    translateZ(0);
  transform-origin: center center;
  transform-style: preserve-3d;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

/* While the cursor is over the wrap, shorten the transition so the tilt
   tracks the cursor responsively. On mouseleave, useTilt resets the vars
   to 0deg and the long transition glides back to neutral. */
.mockup-wrap:hover .mockup-tilt {
  transition: transform 100ms cubic-bezier(0.22, 1, 0.36, 1);
}

.mockup-frame {
  display: block;
}

.mockup-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

/* ── Private project placeholder ─────────────────────────────────────── */
.placeholder-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255, 92, 31, 0.08), transparent 70%),
    linear-gradient(140deg, #1a0a05 0%, #0A0A0F 70%);
  position: relative;
}

.placeholder-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 92, 31, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 92, 31, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%);
  pointer-events: none;
}

.placeholder-tag {
  position: relative;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-dim);
}

.placeholder-name {
  position: relative;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: var(--color-accent);
  text-align: center;
  padding: 0 24px;
  text-shadow: 0 0 40px rgba(255, 92, 31, 0.4);
}

.placeholder-meta {
  position: relative;
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--color-text-dim);
  text-align: center;
  max-width: 60%;
  line-height: 1.5;
}

/* ── Metrics row — editorial 3-column list ───────────────────────────── */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  gap: 0;
}

.metric-cell {
  position: relative;
  padding: 0;
  transition: background 320ms cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
}

.metric-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
  row-gap: 6px;
  padding: 28px 16px;
}

.metric-cell + .metric-cell {
  border-left: 1px solid var(--color-border);
}

/* Spotlight cursor */
.metric-cell::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    320px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
    rgba(255, 92, 31, 0.08),
    transparent 55%
  );
  opacity: 0;
  transition: opacity 400ms ease;
  pointer-events: none;
  z-index: 0;
}

.metric-cell:hover {
  background: linear-gradient(180deg, rgba(255, 92, 31, 0.04), transparent 80%);
}

.metric-cell:hover::after { opacity: 1; }

.metric-cell:hover .metric-index {
  color: var(--color-accent);
}

.metric-index {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  align-self: start;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--color-text-dim);
  padding-top: 6px;
  transition: color 320ms ease;
  min-width: 22px;
}

.metric-label {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dim);
  padding-top: 4px;
}

.metric-value {
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  font-size: 1.75rem;
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

/* Responsive sizing for metric values */
@media (min-width: 768px) {
  .metric-content {
    padding: 32px 20px;
    column-gap: 20px;
  }
  .metric-value { font-size: 2rem; }
}

@media (min-width: 1024px) {
  .metric-content {
    padding: 36px 24px;
  }
  .metric-value { font-size: 2.25rem; }
}

/* ── Mobile — metrics stack vertically ───────────────────────────────── */
@media (max-width: 639px) {
  .metrics-row {
    grid-template-columns: 1fr;
  }
  .metric-content {
    padding: 22px 8px;
  }
  .metric-cell + .metric-cell {
    border-left: none;
    border-top: 1px solid var(--color-border);
  }
}
</style>
