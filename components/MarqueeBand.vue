<template>
  <div class="marquee" :class="{ 'is-reverse': reverse }" aria-hidden="true">
    <div class="marquee-track" :style="{ animationDuration: `${duration}s` }">
      <!--
        Duplicated 4× to give the keyframe enough material to translate -25%
        while keeping the loop seamless. The animation translates the track by
        exactly one copy width — visually continuous.
      -->
      <span v-for="i in 4" :key="i" class="marquee-group">
        <span v-for="item in items" :key="item" class="marquee-item">
          <span class="marquee-text">{{ item }}</span>
          <span class="marquee-sep" aria-hidden="true">●</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: string[]
  /** Seconds for one full loop. Lower = faster. */
  duration?: number
  /** Reverse scroll direction */
  reverse?: boolean
}

withDefaults(defineProps<Props>(), {
  duration: 48,
  reverse: false,
})
</script>

<style scoped>
.marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  padding: 18px 0;
  /* Edge fade — gives the band a premium "letterbox" feel */
  mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 8%,
    black 92%,
    transparent 100%
  );
}

@media (min-width: 768px) {
  .marquee {
    padding: 22px 0;
  }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll linear infinite;
  will-change: transform;
}

.marquee.is-reverse .marquee-track {
  animation-direction: reverse;
}

/* Pause on hover for legibility */
.marquee:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-group {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
}

.marquee-text {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 0 28px;
  white-space: nowrap;
  transition: color 240ms ease;
}

.marquee:hover .marquee-text {
  color: var(--color-text);
}

.marquee-sep {
  display: inline-block;
  color: var(--color-accent);
  font-size: 6px;
  line-height: 1;
  transform: translateY(-1px);
  opacity: 0.7;
}

@keyframes marquee-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-25%, 0, 0); } /* one of four copies */
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
