<template>
  <div
    ref="el"
    class="step reveal"
    :class="{ 'is-visible': isVisible }"
    :style="style"
  >
    <!-- Header: dot + step label + gradient connector line -->
    <div class="step-header">
      <span class="step-dot" aria-hidden="true" />
      <span class="step-label">Step {{ number }}</span>
      <span class="step-connector" aria-hidden="true" />
    </div>

    <!-- Large numeral — visual anchor for each step -->
    <p class="step-numeral">{{ number }}</p>

    <!-- Title + description -->
    <h3 class="step-title">{{ title }}</h3>
    <p class="step-description">{{ description }}</p>

    <!-- Annotation footer -->
    <div class="step-annotation">
      <span class="step-annotation-dot" aria-hidden="true" />
      <span>{{ annotation }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const props = defineProps<{
  number: string
  title: string
  description: string
  annotation: string
  isLast?: boolean
  revealDelay?: number
}>()

const { el, isVisible, style } = useScrollReveal({ delay: props.revealDelay ?? 0 })
</script>

<style scoped>
/* ── Step container ─────────────────────────────────────────────────────── */
.step {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ── Header row: dot + label + connector line ──────────────────────────── */
.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(255, 92, 31, 0.6);
  flex-shrink: 0;
}

.step-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.step-connector {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--color-accent),
    rgba(255, 92, 31, 0.3) 40%,
    transparent 100%
  );
}

/* ── Large numeral ─────────────────────────────────────────────────────── */
.step-numeral {
  font-family: var(--font-mono, monospace);
  font-size: 3.5rem;
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 500;
  color: var(--color-accent);
  margin-bottom: 28px;
}

@media (min-width: 768px) {
  .step-numeral {
    font-size: 4rem;
  }
}

@media (min-width: 1024px) {
  .step-numeral {
    font-size: 4.5rem;
  }
}

/* ── Title + description ───────────────────────────────────────────────── */
.step-title {
  font-size: 1.625rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-weight: 500;
  color: var(--color-text);
}

@media (min-width: 768px) {
  .step-title {
    font-size: 1.75rem;
  }
}

.step-description {
  margin-top: 12px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  max-width: 28rem;
}

@media (min-width: 768px) {
  .step-description {
    font-size: 1rem;
  }
}

/* ── Annotation footer ─────────────────────────────────────────────────── */
.step-annotation {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-dim);
}

.step-annotation-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--color-text-dim);
  flex-shrink: 0;
}
</style>
