<template>
  <!--
    Footer — aligned with section design system:
    - Atmospheric background (accent blob + faint grid)
    - Top gradient divider matching all sections
    - Apple HIG spacing on 8pt grid
    - Brand block matches AppHeader (logo + UNC Development wordmark)
    - Premium link interactions (slide-in arrow, accent hover)
    - Closing ghost-wordmark as a brand stamp
  -->
  <footer
    class="footer relative overflow-hidden bg-[var(--color-bg)]
           pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20
           px-6 md:px-8 lg:px-16"
  >
    <!-- ── Background atmosphere ────────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Soft accent blob, bottom-center for visual anchor at the page end -->
      <div
        class="absolute"
        style="bottom: -25%; left: 50%; width: 900px; height: 700px;
               background: #FF5C1F; opacity: 0.04;
               filter: blur(160px); border-radius: 50%;
               transform: translateX(-50%);"
      />
      <!-- Faint grid -->
      <div
        class="absolute inset-0"
        style="background-image:
                 linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px);
               background-size: 80px 80px;
               mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 100%);
               -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 100%);"
      />
    </div>

    <!-- Top divider -->
    <div
      class="absolute top-0 left-0 right-0 h-px pointer-events-none"
      aria-hidden="true"
      style="background: linear-gradient(90deg, transparent, var(--color-border-strong) 50%, transparent);"
    />

    <div class="relative z-10 max-w-7xl mx-auto">

      <!-- ── Top: 4-column grid ──────────────────────────────────────── -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">

        <!-- Brand block (lg: 5 of 12) -->
        <div class="lg:col-span-5">
          <a
            href="/"
            class="brand inline-flex items-center gap-2.5 text-[var(--color-text)] leading-none transition-colors duration-200"
            aria-label="UNC Development — home"
          >
            <svg
              class="logo-svg"
              viewBox="0 0 482.87 267.54"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon class="logo-primary" points="226.2 57.28 0 114.57 0 57.28 226.2 0 226.2 57.28" />
              <polygon class="logo-primary" points="241.43 267.54 0 210.07 0 152.6 241.43 210.07 241.43 267.54" />
              <polygon class="logo-accent"  points="241.43 267.54 482.87 210.07 482.87 152.6 241.43 210.07 241.43 267.54" />
              <polygon class="logo-primary" points="241.43 171.98 482.87 114.51 482.87 57.04 241.43 114.51 241.43 171.98" />
              <polygon class="logo-accent"  points="241.43 171.98 0 114.51 0 57.04 241.43 114.51 241.43 171.98" />
            </svg>
            <span class="brand-wordmark">
              <span class="brand-name">UNC</span>
              <span class="brand-suffix">Development</span>
            </span>
          </a>

          <p class="brand-tagline">
            Solo full-stack engineering studio. Building production web and mobile apps
            in Addison, IL since 2015.
          </p>

          <p class="brand-byline">
            <span class="byline-line" aria-hidden="true" />
            miki jokovic — solo full-stack engineer
          </p>
        </div>

        <!-- Sitemap (lg: 2 of 12) -->
        <div class="lg:col-span-2">
          <p class="col-eyebrow">Sitemap</p>
          <nav>
            <ul class="link-list">
              <li v-for="link in sitemapLinks" :key="link.href">
                <a :href="link.href" class="footer-link">{{ link.label }}</a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Elsewhere (lg: 2 of 12) -->
        <div class="lg:col-span-2">
          <p class="col-eyebrow">Elsewhere</p>
          <nav>
            <ul class="link-list">
              <li v-for="link in elsewhereLinks" :key="link.href">
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-link footer-link--external"
                >
                  {{ link.label }}
                  <span class="footer-link-arrow" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M3 8L8 3M8 3H4M8 3V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Status (lg: 3 of 12) -->
        <div class="lg:col-span-3">
          <p class="col-eyebrow">Status</p>
          <div class="status-row">
            <span class="pulse-dot" aria-hidden="true" />
            <span class="status-label">Available for projects</span>
          </div>
          <p class="status-detail">Replying within 4 hours.</p>
          <p class="status-detail">Booking new work for June 2026.</p>

          <a
            href="#contact"
            class="status-cta"
          >
            Start a conversation
            <span class="footer-link-arrow" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5H9M9 5.5L5.5 2M9 5.5L5.5 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
        </div>

      </div>

      <!-- ── Bottom meta row ─────────────────────────────────────────── -->
      <div class="bottom-row mt-16 md:mt-20 lg:mt-24 pt-8 border-t border-[var(--color-border)]">
        <p class="meta-text">
          © 2026 <span class="meta-text-bright">UNC Development</span>
          <span class="meta-sep">·</span>
          Addison, IL
          <span class="meta-sep">·</span>
          Est. 2015
        </p>

        <div class="bottom-row-right">
          <span class="meta-text" aria-live="polite" aria-atomic="true">
            <span class="text-[var(--color-text-dim)]">Chicago —</span>
            <span class="meta-text-bright font-variant-numeric-tabular">{{ time }}</span>
          </span>

          <button
            type="button"
            class="back-to-top"
            @click="scrollToTop"
            aria-label="Back to top"
          >
            Back to top
            <span class="back-to-top-arrow" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 9V2M5.5 2L2 5.5M5.5 2L9 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- ── Closing ghost wordmark — brand stamp ─────────────────────── -->
      <div class="ghost-wordmark" aria-hidden="true">
        UNC&nbsp;Development
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import { useChicagoTime } from '~/composables/useChicagoTime'
import { useNuxtApp } from '#app'

const { time } = useChicagoTime()

const sitemapLinks = [
  { label: 'Work',     href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process',  href: '#process' },
  { label: 'Contact',  href: '#contact' },
]

const elsewhereLinks = [
  { label: 'GitHub',      href: 'https://github.com/miroslav-jokovic' },
  { label: 'LinkedIn',    href: 'https://linkedin.com/in/miroslavjokovic' },
  { label: 'X / Twitter', href: 'https://x.com/mikijokovic' },
]

function scrollToTop(): void {
  if (typeof window === 'undefined') return
  // Use Lenis if available for buttery smooth-scroll; fall back to native.
  const nuxt = useNuxtApp() as any
  const lenis = nuxt?.$lenis as { scrollTo: (target: number, opts?: any) => void } | undefined
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.6 })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* ── Brand block ────────────────────────────────────────────────────── */
.logo-svg {
  height: 22px;
  width: auto;
  flex-shrink: 0;
  color: var(--color-text);
  transition: color 200ms ease;
}

.logo-primary {
  fill: currentColor;
  transition: fill 220ms ease;
}

.logo-accent {
  fill: var(--color-accent);
  transition: fill 220ms ease;
}

.brand:hover .logo-primary  { fill: var(--color-text-muted); }
.brand:hover .logo-accent   { fill: var(--color-accent-hover); }

.brand-wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.04em;
  line-height: 1;
}

.brand-name {
  color: var(--color-text);
  font-weight: 500;
  letter-spacing: 0.08em;
}

.brand-suffix {
  color: var(--color-text-muted);
  font-weight: 400;
}

.brand:hover .brand-name,
.brand:hover .brand-suffix {
  color: var(--color-accent);
}

.brand-tagline {
  margin-top: 20px;
  max-width: 28rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.brand-byline {
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.byline-line {
  display: inline-block;
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
  flex-shrink: 0;
}

/* ── Column eyebrow ─────────────────────────────────────────────────── */
.col-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-dim);
  margin-bottom: 18px;
}

/* ── Link list ──────────────────────────────────────────────────────── */
.link-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-muted);
  transition: color 200ms ease, gap 200ms ease;
  width: fit-content;
  /* Underline appears on hover */
  background-image: linear-gradient(to right, currentColor, currentColor);
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: color 200ms ease, background-size 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.footer-link:hover {
  color: var(--color-accent);
  background-size: 100% 1px;
}

/* External-link arrow — slides up-right on hover */
.footer-link--external .footer-link-arrow {
  display: inline-flex;
  opacity: 0.6;
  transform: translate(0, 0);
  transition:
    opacity 240ms ease,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    color 200ms ease;
}

.footer-link--external:hover .footer-link-arrow {
  opacity: 1;
  transform: translate(2px, -2px);
}

/* ── Status block ───────────────────────────────────────────────────── */
.status-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.status-label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-success);
  font-weight: 500;
}

.status-detail {
  font-size: 13px;
  line-height: 1.55;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.status-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--color-accent);
  padding: 10px 14px;
  border: 1px solid rgba(255, 92, 31, 0.25);
  border-radius: 999px;
  background: rgba(255, 92, 31, 0.04);
  transition:
    background 240ms ease,
    border-color 240ms ease,
    color 240ms ease,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.status-cta:hover {
  background: rgba(255, 92, 31, 0.1);
  border-color: rgba(255, 92, 31, 0.5);
  color: var(--color-accent-hover);
  transform: translateY(-1px);
}

.status-cta .footer-link-arrow {
  display: inline-flex;
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.status-cta:hover .footer-link-arrow {
  transform: translateX(2px);
}

/* ── Bottom meta row ────────────────────────────────────────────────── */
.bottom-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .bottom-row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
}

.bottom-row-right {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-text {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.meta-text-bright {
  color: var(--color-text);
}

.meta-sep {
  color: var(--color-text-dim);
  margin: 0 6px;
}

.font-variant-numeric-tabular {
  font-variant-numeric: tabular-nums;
}

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  transition: color 200ms ease;
}

.back-to-top:hover {
  color: var(--color-accent);
}

.back-to-top-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.02);
  transition:
    background 200ms ease,
    border-color 200ms ease,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.back-to-top:hover .back-to-top-arrow {
  background: rgba(255, 92, 31, 0.08);
  border-color: rgba(255, 92, 31, 0.4);
  transform: translateY(-2px);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: 999px;
}

/* ── Closing ghost wordmark — brand stamp ───────────────────────────── */
.ghost-wordmark {
  margin-top: 64px;
  font-family: var(--font-sans);
  font-size: clamp(3.5rem, 16vw, 11rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.95;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
  /* Outlined treatment — premium "watermark" feel */
  color: transparent;
  -webkit-text-stroke: 1px var(--color-border-strong);
  /* Gentle vertical fade so the wordmark dissolves into the page edge */
  mask-image: linear-gradient(180deg, rgba(0,0,0,0.6) 30%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,0.6) 30%, transparent 100%);
  overflow: hidden;
}

@media (min-width: 768px) {
  .ghost-wordmark {
    margin-top: 96px;
  }
}
</style>
