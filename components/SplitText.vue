<template>
  <component
    :is="tag"
    ref="rootEl"
    class="split-text"
    :class="{ 'is-visible': isVisible }"
    :data-split-type="split"
    :style="rootStyle"
  >
    <!--
      Each unit (char/word/line) is wrapped in an outer mask span and an inner
      moving span so it can slide in from below while clipped at the baseline.
      Spaces preserved between words for natural copy/select behavior.
    -->
    <template v-for="(line, lineIdx) in lines" :key="`l${lineIdx}`">
      <span class="split-line">
        <template v-for="(unit, unitIdx) in line" :key="`l${lineIdx}u${unitIdx}`">
          <span
            class="split-mask"
            :style="{ '--i': cumulativeIndex(lineIdx, unitIdx) }"
            aria-hidden="true"
          >
            <span class="split-inner">{{ unit.text }}</span>
          </span>
          <span v-if="unit.trailingSpace" class="split-space">&nbsp;</span>
        </template>
      </span>
      <!-- Force line break between explicit lines -->
      <br v-if="lineIdx < lines.length - 1" aria-hidden="true" />
    </template>

    <!-- Screen readers get plain text, not the per-char garble -->
    <span class="sr-only">{{ srText }}</span>
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  text?: string
  /** Array of lines for multi-line headlines (preferred over text for <br/> control) */
  lines?: string[]
  /** What to split into */
  split?: 'chars' | 'words'
  /** Tag to render */
  tag?: string
  /** Stagger between units in ms */
  stagger?: number
  /** Initial delay before stagger starts (ms) */
  delay?: number
  /** Per-unit animation duration (ms) */
  duration?: number
  /** Y offset of each unit while hidden (px) */
  yOffset?: number
  /** Blur amount while hidden (px) */
  blur?: number
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  lines: undefined,
  split: 'chars',
  tag: 'span',
  stagger: 24,
  delay: 0,
  duration: 700,
  yOffset: 18,
  blur: 6,
})

// ── Split logic ──────────────────────────────────────────────────────────
interface Unit { text: string; trailingSpace: boolean }

const sourceLines = computed<string[]>(() => {
  if (props.lines && props.lines.length) return props.lines
  return [props.text]
})

const srText = computed(() => sourceLines.value.join(' '))

const lines = computed<Unit[][]>(() => {
  return sourceLines.value.map((line) => {
    if (props.split === 'words') {
      const words = line.split(/(\s+)/).filter((w) => w !== '')
      const out: Unit[] = []
      for (const w of words) {
        if (/^\s+$/.test(w)) {
          // Attach trailing space to the previous unit
          if (out.length) out[out.length - 1].trailingSpace = true
        } else {
          out.push({ text: w, trailingSpace: false })
        }
      }
      return out
    }
    // chars: split each line into chars but keep spaces as trailingSpace
    const out: Unit[] = []
    for (const ch of Array.from(line)) {
      if (ch === ' ') {
        if (out.length) out[out.length - 1].trailingSpace = true
        else out.push({ text: '', trailingSpace: true })
      } else {
        out.push({ text: ch, trailingSpace: false })
      }
    }
    return out
  })
})

// Index helpers — compute global unit index so stagger flows across all lines
function cumulativeIndex(lineIdx: number, unitIdx: number): number {
  let i = unitIdx
  for (let l = 0; l < lineIdx; l++) i += lines.value[l].length
  return i
}

// ── Reveal trigger (IntersectionObserver) ────────────────────────────────
const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined') return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !rootEl.value || typeof IntersectionObserver === 'undefined') {
    isVisible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
          observer = null
          break
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )
  observer.observe(rootEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

// ── Style: expose CSS vars for stagger/duration so styling stays in CSS ──
const rootStyle = computed(() => ({
  '--split-stagger': `${props.stagger}ms`,
  '--split-delay': `${props.delay}ms`,
  '--split-duration': `${props.duration}ms`,
  '--split-y': `${props.yOffset}px`,
  '--split-blur': `${props.blur}px`,
}))
</script>

<style scoped>
.split-text {
  /* Allow overflow on each line so the mask can clip cleanly */
  display: inline-block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.split-line {
  display: inline;
}

.split-space {
  display: inline-block;
  width: 0.25em;
}

.split-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  /* Slight bottom padding so descenders aren't clipped */
  padding-bottom: 0.05em;
  line-height: inherit;
}

.split-inner {
  display: inline-block;
  transform: translateY(var(--split-y, 18px));
  opacity: 0;
  filter: blur(var(--split-blur, 6px));
  transition:
    transform var(--split-duration, 700ms) cubic-bezier(0.22, 1, 0.36, 1),
    opacity var(--split-duration, 700ms) cubic-bezier(0.22, 1, 0.36, 1),
    filter var(--split-duration, 700ms) cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(
    var(--split-delay, 0ms) + var(--i, 0) * var(--split-stagger, 24ms)
  );
  will-change: transform, opacity, filter;
}

/* Chars: tighten the mask so chars sit flush */
[data-split-type="chars"] .split-mask {
  padding-bottom: 0.1em;
}

.is-visible .split-inner {
  transform: translateY(0);
  opacity: 1;
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .split-inner {
    transform: none;
    opacity: 1;
    filter: none;
    transition: none;
  }
}
</style>
