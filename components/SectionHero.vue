<template>
  <!--
    Layout follows Apple HIG-style rhythm:
    - 8pt grid for all spacing
    - Section padding scales: 24/20 (mobile) → 32/24 (tablet) → 48/24 (desktop)
    - Top safe area allows nav clearance (96 → 128 → 160)
    - Body container max-w-7xl with consistent 24px horizontal safe-area
  -->
  <section
    class="relative min-h-screen flex items-center overflow-x-clip
           pt-24 pb-20 px-6
           md:pt-28 md:pb-24 md:px-8
           lg:pt-32 lg:pb-24 lg:px-16"
  >
    <HeroBackground />

    <div class="relative z-10 max-w-7xl mx-auto w-full">
      <div class="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

        <!-- Left: Text — vertical rhythm uses 8pt multiples (24/32/40) -->
        <div class="order-2 lg:order-1">
          <!-- Personal byline — sits as a brand mark above the status pill -->
          <p
            ref="nameEl"
            class="font-mono text-caption text-[var(--color-text)] mb-3 opacity-0 inline-flex items-center gap-3"
          >
            <span class="byline-line" aria-hidden="true" />
            miki jokovic
          </p>

          <!-- Status pill -->
          <p
            ref="statusPillEl"
            class="block font-mono text-caption uppercase tracking-widest text-[var(--color-text-muted)] mb-6 md:mb-8 opacity-0"
          >
            <span class="inline-flex items-center gap-2.5">
              <span class="pulse-dot" aria-hidden="true" />
              AVAILABLE FOR NEW PROJECTS · JUNE 2026
            </span>
          </p>

          <!-- Headline — Large Title hierarchy, generous breathing room -->
          <h1 class="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] text-[var(--color-text)]">
            <span class="block">
              <span :ref="(el) => collectWord(el)" data-headline-word class="inline-block mr-[0.3em] opacity-0">I</span>
              <span :ref="(el) => collectWord(el)" data-headline-word class="inline-block opacity-0">build</span>
            </span>
            <span class="block">
              <span :ref="(el) => collectWord(el)" data-headline-word class="relative inline-block opacity-0 text-[var(--color-accent)]">
                production
                <!-- SVG wavy underline -->
                <svg
                  class="absolute left-0 pointer-events-none"
                  style="bottom: -6px; width: 100%; height: 10px;"
                  viewBox="0 0 400 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    ref="underlinePathEl"
                    d="M 4 6 Q 100 2 200 6 T 396 6"
                    fill="none"
                    stroke="var(--color-accent)"
                    stroke-width="3"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
            </span>
            <span class="block">
              <span :ref="(el) => collectWord(el)" data-headline-word class="inline-block mr-[0.3em] opacity-0">web</span>
              <span :ref="(el) => collectWord(el)" data-headline-word class="inline-block mr-[0.3em] opacity-0">and</span>
              <span :ref="(el) => collectWord(el)" data-headline-word class="inline-block mr-[0.3em] opacity-0">mobile</span>
              <span :ref="(el) => collectWord(el)" data-headline-word class="inline-block opacity-0">apps.</span>
            </span>
          </h1>

          <!-- Subhead (Body 17 size for readability) -->
          <p
            ref="subheadEl"
            class="font-mono text-[0.9375rem] md:text-body-sm text-[var(--color-text-muted)] max-w-xl mt-8 leading-relaxed opacity-0"
          >
            Solo full-stack engineer. Recent work: OMENORA, Reachify Labs,
            Northrive Studio, Boni Transportation, fleet platform.
            AI-augmented workflow with Claude + Cursor + Windsurf.
          </p>

          <!-- Live indicator -->
          <div
            ref="liveIndicatorEl"
            class="inline-flex items-center gap-2 mt-6 opacity-0"
          >
            <span class="relative inline-flex h-2 w-2 flex-shrink-0" aria-hidden="true">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--color-accent);" />
              <span class="relative inline-flex rounded-full h-2 w-2" style="background-color: var(--color-accent);" />
            </span>
            <span class="font-mono text-[11px] uppercase tracking-widest text-[var(--color-text-dim)]">
              Building now — OMENORA iOS — deploying to TestFlight
            </span>
          </div>

          <!-- CTAs — HIG min touch target 44pt; primary uses py-3.5 (56px tall w/ text) -->
          <div class="flex flex-wrap items-center gap-x-6 gap-y-4 mt-8">
            <a
              ref="primaryCtaEl"
              href="#contact"
              class="group inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-full px-6 py-3 min-h-[44px] text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors duration-200 opacity-0"
              style="box-shadow: 0 0 40px -12px var(--color-accent), 0 0 80px -24px var(--color-accent), 0 0 0 1px rgba(255,92,31,0.3);"
            >
              Book a call
              <IconArrow />
            </a>
            <a
              ref="secondaryCtaEl"
              href="#work"
              class="inline-flex items-center min-h-[44px] text-[var(--color-text-muted)] text-sm underline underline-offset-4 decoration-[var(--color-border-strong)] hover:text-[var(--color-text)] hover:decoration-[var(--color-text)] transition-colors duration-200 opacity-0"
            >
              See my work
            </a>
          </div>

          <!-- Stats row — refined hierarchy with mobile-friendly sizing -->
          <div
            ref="statsContainerEl"
            class="grid grid-cols-3 gap-4 sm:gap-6 mt-10 md:mt-12 max-w-xl opacity-0"
          >
            <div class="border-l border-[var(--color-border)] pl-3 sm:pl-4">
              <p class="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">Products shipped</p>
              <p class="text-2xl sm:text-3xl font-medium text-[var(--color-text)] mt-1.5 tracking-tight leading-none">
                <span :ref="(el) => collectStat(el)" data-target="5" data-suffix="">0</span>
              </p>
            </div>
            <div class="border-l border-[var(--color-border)] pl-3 sm:pl-4">
              <p class="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">Technologies</p>
              <p class="text-2xl sm:text-3xl font-medium text-[var(--color-text)] mt-1.5 tracking-tight leading-none">
                <span :ref="(el) => collectStat(el)" data-target="12" data-suffix="+">0</span>
              </p>
            </div>
            <div class="border-l border-[var(--color-border)] pl-3 sm:pl-4">
              <p class="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">Response time</p>
              <p class="text-2xl sm:text-3xl font-medium text-[var(--color-text)] mt-1.5 tracking-tight leading-none">
                <span :ref="(el) => collectStat(el)" data-target="<4H" data-suffix=""><4H</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Right column / Top on mobile: carousel.
             Single instance — responsive via internal media queries. -->
        <div
          ref="stackWrapEl"
          class="order-1 lg:order-2 flex items-center justify-center opacity-0"
        >
          <HeroScreenshotStack ref="screenshotStackEl" />
        </div>
      </div>
    </div>

    <!-- Vertical meta text (desktop only) -->
    <div
      class="relative z-[3] hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none"
      aria-hidden="true"
      style="transform: translateY(-50%) rotate(90deg); transform-origin: center;"
    >
      <span class="font-mono text-micro uppercase tracking-widest text-[var(--color-text-dim)] whitespace-nowrap">
        v1.0.0 · ADDISON, IL · EST. 2015
      </span>
    </div>

    <!-- Scroll indicator (desktop only — mobile is tall enough that this competes with the carousel) -->
    <a
      href="#about"
      class="relative z-10 absolute bottom-8 left-1/2 hidden md:inline-flex flex-col items-center gap-2 text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] transition-colors duration-200"
      style="transform: translateX(-50%); animation: bounce-y 2s ease-in-out infinite;"
      aria-label="Scroll to content"
    >
      <span class="font-mono text-[10px] uppercase tracking-widest">scroll</span>
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
        <line x1="6" y1="0" x2="6" y2="11" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" />
        <polyline points="1,8 6,13 11,8" stroke="currentColor" stroke-width="1.25" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  </section>
</template>

<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue'
import { useHeroIntro } from '~/composables/useHeroIntro'
import { useMagneticCursor } from '~/composables/useMagneticCursor'

// ─── Left column refs ─────────────────────────────────────────────────────
const nameEl = ref<HTMLElement | null>(null)
const statusPillEl = ref<HTMLElement | null>(null)
const wordEls: HTMLElement[] = []
const underlinePathEl = ref<SVGPathElement | null>(null)
const subheadEl = ref<HTMLElement | null>(null)
const liveIndicatorEl = ref<HTMLElement | null>(null)
const primaryCtaEl = ref<HTMLElement | null>(null)
const secondaryCtaEl = ref<HTMLElement | null>(null)
const statsContainerEl = ref<HTMLElement | null>(null)
const statNumberEls: HTMLElement[] = []

// ─── Right column: screenshot stack refs ───────────────────────────────
const stackWrapEl = ref<HTMLElement | null>(null)
const screenshotStackEl = ref<{ startCycle: () => void } | null>(null)

// ─── Ref collectors ────────────────────────────────────────────────────────
type VueRefEl = Element | ComponentPublicInstance | null

function collectWord(el: VueRefEl) {
  if (el instanceof HTMLElement && !wordEls.includes(el)) {
    wordEls.push(el)
  }
}

function collectStat(el: VueRefEl) {
  if (el instanceof HTMLElement && !statNumberEls.includes(el)) {
    statNumberEls.push(el)
  }
}

// ─── Composables ────────────────────────────────────────────────────────
useHeroIntro(() => ({
  nameEl: nameEl.value,
  statusPill: statusPillEl.value,
  wordEls,
  underlinePath: underlinePathEl.value,
  subhead: subheadEl.value,
  liveIndicator: liveIndicatorEl.value,
  ctaEls: [primaryCtaEl.value, secondaryCtaEl.value].filter(Boolean) as HTMLElement[],
  statsContainer: statsContainerEl.value,
  statNumbers: statNumberEls,
  screenshotStack: stackWrapEl.value,
  onStackIntroComplete: () => screenshotStackEl.value?.startCycle(),
}))

useMagneticCursor(primaryCtaEl)
</script>

<style scoped>
/* Small accent rule before the personal byline — visual nod to a signature.
   Stays subtle: 24px gradient line in accent → fades to nothing. */
.byline-line {
  display: inline-block;
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  flex-shrink: 0;
}
</style>
