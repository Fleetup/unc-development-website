<template>
  <article
    ref="el"
    class="service-card reveal group"
    :class="{ 'is-visible': isVisible }"
    :style="style"
    tabindex="0"
  >
    <!-- Top row: index + type pill -->
    <div class="service-top">
      <span class="service-index" aria-hidden="true">
        {{ String(cardIndex).padStart(2, '0') }}
      </span>
      <span class="service-type">{{ type }}</span>
    </div>

    <!-- Title -->
    <h3 class="service-title">{{ name }}</h3>

    <!-- Description -->
    <p class="service-desc">{{ description }}</p>

    <!-- Pricing footer -->
    <div class="service-footer">
      <div class="service-pricing">
        <span class="service-pricing-label">Starting at</span>
        <span class="service-pricing-value">
          {{ pricing }}<span v-if="pricingUnit" class="service-pricing-unit">{{ pricingUnit }}</span>
        </span>
      </div>
      <span class="service-arrow" aria-hidden="true">
        <IconArrow />
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useSpotlight } from '~/composables/useSpotlight'

const props = defineProps<{
  name: string
  description: string
  pricing: string
  pricingUnit?: string
  type: string
  cardIndex: number
  revealDelay?: number
}>()

const { el, isVisible, style } = useScrollReveal({ delay: props.revealDelay ?? 0 })
useSpotlight(el)
</script>

<style scoped>
/* ── Card shell ─────────────────────────────────────────────────────────── */
.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 320px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  transition:
    border-color 320ms cubic-bezier(0.22, 1, 0.36, 1),
    background 320ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1);
  outline: none;
  cursor: pointer;
  overflow: hidden;
}

/* Soft accent halo on hover/focus — matches carousel/phone/web glow */
.service-card:hover,
.service-card:focus-visible {
  background: var(--color-surface-elevated);
  border-color: rgba(255, 92, 31, 0.4);
  transform: translateY(-2px);
  box-shadow:
    0 18px 40px -12px rgba(0, 0, 0, 0.55),
    0 6px 14px -4px rgba(0, 0, 0, 0.35),
    0 0 60px -10px rgba(255, 92, 31, 0.22),
    inset 0 0 0 1px rgba(255, 92, 31, 0.08);
}

.service-card:focus-visible {
  border-color: var(--color-accent);
}

/* Subtle gradient sheen at the top — only shows on hover */
.service-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 92, 31, 0.5), transparent);
  opacity: 0;
  transition: opacity 320ms ease;
  pointer-events: none;
  z-index: 1;
}

.service-card:hover::before,
.service-card:focus-visible::before {
  opacity: 1;
}

/* Spotlight cursor effect — radial gradient follows cursor within bounds.
   useSpotlight composable writes --mouse-x / --mouse-y on mousemove. */
.service-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    420px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px),
    rgba(255, 92, 31, 0.12),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 400ms ease;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}

.service-card:hover::after,
.service-card:focus-visible::after {
  opacity: 1;
}

/* Lift card content above the spotlight overlay */
.service-card > * {
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .service-card {
    padding: 28px;
    min-height: 340px;
  }
}

@media (min-width: 1024px) {
  .service-card {
    padding: 32px;
  }
}

/* ── Top row ───────────────────────────────────────────────────────────── */
.service-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
}

.service-index {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--color-text-dim);
  transition: color 320ms ease;
}

.service-card:hover .service-index,
.service-card:focus-visible .service-index {
  color: var(--color-accent);
}

.service-type {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dim);
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  transition:
    border-color 320ms ease,
    color 320ms ease,
    background 320ms ease;
}

.service-card:hover .service-type,
.service-card:focus-visible .service-type {
  border-color: var(--color-border-strong);
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.03);
}

/* ── Title + description ───────────────────────────────────────────────── */
.service-title {
  font-size: 1.5rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: var(--color-text);
}

@media (min-width: 768px) {
  .service-title {
    font-size: 1.625rem;
  }
}

.service-desc {
  margin-top: 12px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  flex: 1;
}

/* ── Footer (pricing + arrow) ─────────────────────────────────────────── */
.service-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  transition: border-color 320ms ease;
}

.service-card:hover .service-footer,
.service-card:focus-visible .service-footer {
  border-top-color: var(--color-border-strong);
}

.service-pricing {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-pricing-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dim);
}

.service-pricing-value {
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.service-pricing-unit {
  margin-left: 2px;
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-text-muted);
  letter-spacing: 0;
}

@media (min-width: 768px) {
  .service-pricing-value { font-size: 2rem; }
}

.service-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  color: var(--color-text-dim);
  opacity: 0;
  transform: translateX(-8px);
  transition:
    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 320ms ease,
    color 320ms ease,
    background 320ms ease;
}

.service-card:hover .service-arrow,
.service-card:focus-visible .service-arrow {
  opacity: 1;
  transform: translateX(0);
  border-color: rgba(255, 92, 31, 0.4);
  background: rgba(255, 92, 31, 0.08);
  color: var(--color-accent);
}
</style>
