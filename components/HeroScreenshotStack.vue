<template>
  <div
    ref="containerEl"
    class="carousel"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousemove="onMouseMove"
  >
    <!-- 3D stage -->
    <div class="stage">
      <div
        v-for="(card, idx) in CARDS"
        :key="card.id"
        class="slot"
        :data-slot="getSlot(idx)"
        :class="{
          'is-wrapping-fwd':     wrapState[idx] === 'fwd',
          'is-wrapping-bwd':     wrapState[idx] === 'bwd',
          'is-wrapping-fwd-off': wrapState[idx] === 'fwd-off',
          'is-wrapping-bwd-on':  wrapState[idx] === 'bwd-on',
          'is-active': idx === activeIdx,
        }"
        :aria-hidden="getSlot(idx) !== 'center'"
        @click="onCardClick(idx)"
      >
        <ScreenshotCard
          :src="card.src"
          :label="card.label"
          :type="card.type"
          :ariaLabel="card.ariaLabel"
          @activate="onCardClick(idx)"
        />
      </div>
    </div>

    <!-- Meta row: label + counter -->
    <div class="meta" aria-live="polite">
      <div class="meta-row">
        <span :key="`name-${activeIdx}`" class="meta-name">
          <span class="meta-name-text">{{ activeCard.metaName }}</span>
          <span class="meta-name-kind">· {{ activeCard.metaKind }}</span>
        </span>
        <span :key="`count-${activeIdx}`" class="meta-counter">
          {{ String(activeIdx + 1).padStart(2, '0') }}
          <span class="meta-counter-sep">/</span>
          {{ String(CARDS.length).padStart(2, '0') }}
        </span>
      </div>

      <!-- Progress bar -->
      <div class="progress" aria-hidden="true">
        <div
          v-if="hasStarted"
          :key="`prog-${cycleEpoch}`"
          class="progress-fill"
          :class="{ 'is-paused': isPaused }"
          :style="{ animationDuration: `${CYCLE_MS}ms` }"
        />
      </div>

      <!-- Dots -->
      <div class="dots" role="tablist" aria-label="Projects">
        <button
          v-for="(card, idx) in CARDS"
          :key="card.id"
          class="dot"
          :class="{ 'dot--active': idx === activeIdx }"
          :aria-label="`Show ${card.metaName}`"
          :aria-selected="idx === activeIdx"
          role="tab"
          type="button"
          @click="goTo(idx)"
        >
          <span class="dot-track">
            <span class="dot-fill" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// ── Card data ────────────────────────────────────────────────────────────────
interface CardDef {
  id: number
  src: string
  label: string
  type: 'web' | 'mobile'
  ariaLabel: string
  metaName: string
  metaKind: string
}

const CARDS: CardDef[] = [
  {
    id: 0,
    src: '/frames/Omenora-Homepage.webp',
    label: 'omenora.com',
    type: 'web',
    ariaLabel: 'View OMENORA web',
    metaName: 'OMENORA',
    metaKind: 'WEB',
  },
  {
    id: 1,
    src: '/frames/Reachify-Homepage.webp',
    label: 'reachifylabs.com',
    type: 'web',
    ariaLabel: 'View Reachify Labs',
    metaName: 'REACHIFY LABS',
    metaKind: 'WEB',
  },
  {
    id: 2,
    src: '/frames/Omenora-Mobile.webp',
    label: 'OMENORA · iOS',
    type: 'mobile',
    ariaLabel: 'View OMENORA iOS app',
    metaName: 'OMENORA',
    metaKind: 'IOS',
  },
  {
    id: 3,
    src: '/frames/Omnia-Dashboard.webp',
    label: 'fleet.internal',
    type: 'web',
    ariaLabel: 'View Omnia fleet platform',
    metaName: 'OMNIA · FLEET',
    metaKind: 'WEB',
  },
  {
    id: 4,
    src: '/frames/Northrive-Studio.webp',
    label: 'northrivestudio.com',
    type: 'web',
    ariaLabel: 'View Northrive Studio',
    metaName: 'NORTHRIVE STUDIO',
    metaKind: 'WEB',
  },
  {
    id: 5,
    src: '/frames/boni-transportation.webp',
    label: 'bonytrans.com',
    type: 'web',
    ariaLabel: 'View Boni Transportation',
    metaName: 'BONI TRANSPORTATION',
    metaKind: 'WEB',
  },
]
const N = CARDS.length

// ── Timing ──────────────────────────────────────────────────────────────────
const CYCLE_MS = 6000
const WRAP_MS = 950

// ── State ────────────────────────────────────────────────────────────────────
const containerEl = ref<HTMLElement | null>(null)

// Wrap variants:
//   'fwd'      — left → right via off-stage (N=3 forward, both ends visible)
//   'bwd'      — right → left via off-stage (N=3 backward, both ends visible)
//   'fwd-off'  — left → far-right (N=4 forward, destination hidden)
//   'bwd-on'   — far-right → left (N=4 backward, source hidden)
type WrapKind = 'fwd' | 'bwd' | 'fwd-off' | 'bwd-on' | null

const activeIdx = ref(0)
const wrapState = ref<WrapKind[]>(Array(N).fill(null))
const isAnimating = ref(false)
const isPaused = ref(false)
const hasStarted = ref(false)
const cycleEpoch = ref(0)

// Parallax (desktop hover only)
const parallaxCurrent = ref({ x: 0, y: 0 })
const parallaxTarget = ref({ x: 0, y: 0 })

const activeCard = computed(() => CARDS[activeIdx.value])

// ── Slot resolution ──────────────────────────────────────────────────────────
type SlotName = 'center' | 'left' | 'right' | 'far-left' | 'far-right'

function getSlot(cardIdx: number, refIdx: number = activeIdx.value): SlotName {
  let diff = (cardIdx - refIdx + N) % N
  if (diff > Math.floor(N / 2)) diff -= N
  if (diff === 0) return 'center'
  if (diff === 1) return 'right'
  if (diff === -1) return 'left'
  return diff > 0 ? 'far-right' : 'far-left'
}

// ── Advance / navigate ──────────────────────────────────────────────────────
function advance(direction: 1 | -1 = 1) {
  if (isAnimating.value) return
  const next = (activeIdx.value + direction + N) % N
  goTo(next, direction)
}

function goTo(newIdx: number, hintDirection?: 1 | -1) {
  if (newIdx === activeIdx.value || isAnimating.value) return
  const oldIdx = activeIdx.value

  let direction: 1 | -1
  if (hintDirection) {
    direction = hintDirection
  } else {
    const forwardDist = (newIdx - oldIdx + N) % N
    direction = forwardDist <= N / 2 ? 1 : -1
  }

  // Detect cards that would visually cross through center during a normal
  // transition — those need to be routed via off-stage instead.
  const newWrap: WrapKind[] = Array(N).fill(null)
  for (let cardIdx = 0; cardIdx < N; cardIdx++) {
    const fromName = getSlot(cardIdx, oldIdx)
    const toName   = getSlot(cardIdx, newIdx)

    if (direction === 1) {
      // Forward: cards travel leftward. A card on the LEFT side moving to
      // the RIGHT side (visible or hidden) wraps via far-left → far-right.
      if (fromName === 'left' && toName === 'right')      newWrap[cardIdx] = 'fwd'
      else if (fromName === 'left' && toName === 'far-right') newWrap[cardIdx] = 'fwd-off'
    } else {
      // Backward: cards travel rightward. A card on the RIGHT side moving
      // to the LEFT side wraps via far-right → far-left.
      if (fromName === 'right'     && toName === 'left') newWrap[cardIdx] = 'bwd'
      else if (fromName === 'far-right' && toName === 'left') newWrap[cardIdx] = 'bwd-on'
    }
  }

  isAnimating.value = true
  wrapState.value = newWrap
  activeIdx.value = newIdx
  cycleEpoch.value++

  clearCycle()
  setTimeout(() => {
    wrapState.value = Array(N).fill(null)
    isAnimating.value = false
    scheduleCycle()
  }, WRAP_MS + 20)
}

// ── Auto-cycle ───────────────────────────────────────────────────────────────
let cycleTimer: ReturnType<typeof setTimeout> | null = null
let isReduced = false
let isHidden = false

function scheduleCycle() {
  clearCycle()
  if (isReduced || isPaused.value || isHidden) return
  cycleTimer = setTimeout(() => advance(1), CYCLE_MS)
}

function clearCycle() {
  if (cycleTimer !== null) {
    clearTimeout(cycleTimer)
    cycleTimer = null
  }
}

// ── Interactions ─────────────────────────────────────────────────────────────
function onCardClick(idx: number) {
  const slotName = getSlot(idx)
  if (slotName === 'center') return
  if (slotName === 'right') goTo(idx, 1)
  if (slotName === 'left')  goTo(idx, -1)
}

function onMouseEnter() {
  isPaused.value = true
  clearCycle()
  startParallaxLoop()
}

function onMouseLeave() {
  isPaused.value = false
  parallaxTarget.value = { x: 0, y: 0 }
  cycleEpoch.value++
  scheduleCycle()
}

function onMouseMove(e: MouseEvent) {
  if (!containerEl.value || isReduced) return
  const rect = containerEl.value.getBoundingClientRect()
  const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
  parallaxTarget.value = {
    x: Math.max(-1, Math.min(1, nx)),
    y: Math.max(-1, Math.min(1, ny)),
  }
}

// ── Parallax loop (mouse only — applies tilt to center card via CSS var) ────
let parallaxRafId: number | null = null
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function startParallaxLoop() {
  if (parallaxRafId !== null) return
  function tick() {
    const c = parallaxCurrent.value
    const t = parallaxTarget.value
    const nx = lerp(c.x, t.x, 0.1)
    const ny = lerp(c.y, t.y, 0.1)
    parallaxCurrent.value = { x: nx, y: ny }

    if (containerEl.value) {
      containerEl.value.style.setProperty('--parallax-x', String(nx))
      containerEl.value.style.setProperty('--parallax-y', String(ny))
    }

    const settled = !isPaused.value
      && Math.abs(nx - t.x) < 0.001
      && Math.abs(ny - t.y) < 0.001
    if (settled) {
      parallaxCurrent.value = { x: 0, y: 0 }
      if (containerEl.value) {
        containerEl.value.style.setProperty('--parallax-x', '0')
        containerEl.value.style.setProperty('--parallax-y', '0')
      }
      parallaxRafId = null
      return
    }
    parallaxRafId = requestAnimationFrame(tick)
  }
  parallaxRafId = requestAnimationFrame(tick)
}

// ── Visibility (pause when tab hidden) ──────────────────────────────────────
function onVisibilityChange() {
  isHidden = document.hidden
  if (isHidden) clearCycle()
  else if (!isPaused.value) scheduleCycle()
}

// ── Expose ──────────────────────────────────────────────────────────────────
defineExpose({
  startCycle: () => {
    hasStarted.value = true
    cycleEpoch.value++
    nextTick(() => scheduleCycle())
  },
})

// ── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(() => {
  isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  clearCycle()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (parallaxRafId !== null) cancelAnimationFrame(parallaxRafId)
})
</script>

<style scoped>
/* ── Carousel container ──────────────────────────────────────────────────── */
.carousel {
  position: relative;
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32px;
  --parallax-x: 0;
  --parallax-y: 0;
}

@media (min-width: 1280px) {
  .carousel { max-width: 640px; }
}

/* ── 3D stage ──────────────────────────────────────────────────────────── */
.stage {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 11;
  perspective: 2200px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  overflow: visible;
}

/* ── Slots — base ────────────────────────────────────────────────────────── */
.slot {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  will-change: transform, opacity, filter;
  transition:
    transform 750ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 600ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 600ms cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
}

/* ── Slot positions ──────────────────────────────────────────────────────── */
.slot[data-slot="center"] {
  transform:
    translateX(-50%)
    rotateY(calc(var(--parallax-x) * 4deg))
    rotateX(calc(var(--parallax-y) * -2deg))
    scale(1);
  opacity: 1;
  filter: none;
  z-index: 30;
  cursor: default;
}

.slot[data-slot="right"] {
  transform: translateX(-50%) translateX(62%) rotateY(-16deg) scale(0.62);
  opacity: 0.38;
  filter: brightness(0.78) blur(1.5px);
  z-index: 20;
}

.slot[data-slot="left"] {
  transform: translateX(-50%) translateX(-62%) rotateY(16deg) scale(0.62);
  opacity: 0.38;
  filter: brightness(0.78) blur(1.5px);
  z-index: 20;
}

.slot[data-slot="far-right"],
.slot[data-slot="far-left"] {
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.slot[data-slot="far-right"] {
  transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
  filter: brightness(0.6) blur(4px);
}

.slot[data-slot="far-left"] {
  transform: translateX(-50%) translateX(-130%) rotateY(24deg) scale(0.5);
  filter: brightness(0.6) blur(4px);
}

/* Hover lift on side cards */
.slot[data-slot="left"]:hover,
.slot[data-slot="right"]:hover {
  filter: brightness(0.95) blur(0.5px);
  opacity: 0.55;
}

/* Premium glow under the active card */
.slot.is-active::before {
  content: '';
  position: absolute;
  inset: 4% -4% -8% -4%;
  background:
    radial-gradient(ellipse 65% 55% at 50% 60%, rgba(255, 92, 31, 0.22), transparent 70%),
    radial-gradient(ellipse 85% 30% at 50% 100%, rgba(0, 0, 0, 0.55), transparent 70%);
  filter: blur(10px);
  z-index: -1;
  pointer-events: none;
  opacity: 1;
  transition: opacity 600ms ease;
}

.slot:not(.is-active)::before { opacity: 0; }

/* ── Wrap animations (override transition with keyframes) ───────────────── */
.slot.is-wrapping-fwd {
  animation: wrap-fwd 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: none;
}

.slot.is-wrapping-bwd {
  animation: wrap-bwd 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: none;
}

/* N=4 forward: card exits visibly off LEFT, settles invisibly at far-right */
.slot.is-wrapping-fwd-off {
  animation: wrap-fwd-off 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: none;
}

/* N=4 backward: card teleports from far-right via far-left, fades in at left */
.slot.is-wrapping-bwd-on {
  animation: wrap-bwd-on 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: none;
}

@keyframes wrap-fwd {
  0% {
    transform: translateX(-50%) translateX(-62%) rotateY(16deg) scale(0.62);
    opacity: 0.38;
    filter: brightness(0.78) blur(1.5px);
  }
  49% {
    transform: translateX(-50%) translateX(-130%) rotateY(24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  51% {
    transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  100% {
    transform: translateX(-50%) translateX(62%) rotateY(-16deg) scale(0.62);
    opacity: 0.38;
    filter: brightness(0.78) blur(1.5px);
  }
}

@keyframes wrap-bwd {
  0% {
    transform: translateX(-50%) translateX(62%) rotateY(-16deg) scale(0.62);
    opacity: 0.38;
    filter: brightness(0.78) blur(1.5px);
  }
  49% {
    transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  51% {
    transform: translateX(-50%) translateX(-130%) rotateY(24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  100% {
    transform: translateX(-50%) translateX(-62%) rotateY(16deg) scale(0.62);
    opacity: 0.38;
    filter: brightness(0.78) blur(1.5px);
  }
}

/* N=4 forward — from visible LEFT to hidden FAR-RIGHT.
   Card slides off-stage left while fading out, then teleports to far-right
   (where it remains hidden). */
@keyframes wrap-fwd-off {
  0% {
    transform: translateX(-50%) translateX(-62%) rotateY(16deg) scale(0.62);
    opacity: 0.38;
    filter: brightness(0.78) blur(1.5px);
  }
  49% {
    transform: translateX(-50%) translateX(-130%) rotateY(24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  51% {
    transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  100% {
    transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
}

/* N=4 backward — from hidden FAR-RIGHT to visible LEFT.
   Card teleports invisibly to far-left, then slides in to its left slot. */
@keyframes wrap-bwd-on {
  0% {
    transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  49% {
    transform: translateX(-50%) translateX(130%) rotateY(-24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  51% {
    transform: translateX(-50%) translateX(-130%) rotateY(24deg) scale(0.5);
    opacity: 0;
    filter: brightness(0.6) blur(4px);
  }
  100% {
    transform: translateX(-50%) translateX(-62%) rotateY(16deg) scale(0.62);
    opacity: 0.38;
    filter: brightness(0.78) blur(1.5px);
  }
}

/* ── Meta row ──────────────────────────────────────────────────────────── */
.meta {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 4px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.meta-name {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  animation: meta-fade 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.meta-name-text {
  color: var(--color-text);
  font-weight: 500;
  letter-spacing: 0.16em;
}

.meta-name-kind {
  color: var(--color-text-dim);
  font-size: 10px;
}

.meta-counter {
  color: var(--color-text-dim);
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  animation: meta-fade 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.meta-counter-sep {
  margin: 0 4px;
  opacity: 0.5;
}

@keyframes meta-fade {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Progress bar ─────────────────────────────────────────────────────── */
.progress {
  position: relative;
  height: 1px;
  width: 100%;
  background: var(--color-border);
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  inset: 0;
  width: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
  transform-origin: left center;
  transform: scaleX(0);
  animation: progress-grow linear forwards;
  box-shadow: 0 0 12px rgba(255, 92, 31, 0.5);
}

.progress-fill.is-paused { animation-play-state: paused; }

@keyframes progress-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/* ── Dot indicators (HIG-friendly 44pt-tall touch target) ─────────────── */
.dots {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  height: 44px;
  margin-left: -8px;
  margin-right: -8px;
}

.dot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
}

.dot-track {
  position: relative;
  display: block;
  width: 28px;
  height: 2px;
  border-radius: 1px;
  background: var(--color-border-strong);
  overflow: hidden;
  transition: background 300ms ease;
}

.dot-fill {
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  border-radius: 1px;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 300ms ease;
}

.dot--active .dot-track {
  background: rgba(255, 92, 31, 0.2);
  box-shadow: 0 0 8px rgba(255, 92, 31, 0.4);
}

.dot--active .dot-fill {
  transform: scaleX(1);
}

.dot:hover .dot-track {
  background: var(--color-text-muted);
}

.dot--active:hover .dot-track {
  background: rgba(255, 92, 31, 0.3);
}

.dot:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ── Tablet ───────────────────────────────────────────────────────────── */
@media (min-width: 768px) and (max-width: 1023px) {
  .carousel { max-width: 460px; gap: 24px; }
}

/* ── Mobile: single-card crossfade slideshow ─────────────────────────── */
@media (max-width: 767px) {
  .carousel {
    max-width: 360px;
    gap: 20px;
  }
  .stage {
    aspect-ratio: 16 / 11;
    perspective: none;
    transform-style: flat;
    overflow: hidden;
    border-radius: 16px;
  }
  .slot {
    transform: translateX(-50%) !important;
    transition: opacity 500ms ease;
    pointer-events: auto !important;
    animation: none !important;
    cursor: default;
  }
  .slot[data-slot="center"] {
    opacity: 1;
    z-index: 30;
    filter: none;
  }
  .slot:not([data-slot="center"]) {
    opacity: 0;
    z-index: 10;
    filter: none;
    pointer-events: none !important;
  }
  .slot.is-active::before { display: none; }
  .meta { padding: 0 8px; }
  .meta-row { gap: 12px; }
}

/* ── Reduced motion ───────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .slot { transition: none; }
  .slot.is-wrapping-fwd, .slot.is-wrapping-bwd { animation: none; }
  .progress-fill { animation: none; transform: scaleX(0); }
  .meta-name, .meta-counter { animation: none; }
}
</style>
