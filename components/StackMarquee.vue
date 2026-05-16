<template>
  <div class="stack-marquee" aria-label="Technology stack" role="region">
    <div class="stack-marquee-track">
      <span v-for="copy in 4" :key="copy" class="stack-marquee-group" :aria-hidden="copy > 1">
        <span
          v-for="tech in STACK"
          :key="`${copy}-${tech.name}`"
          class="stack-marquee-item"
          :title="tech.name"
        >
          <span class="stack-icon-wrap">
            <img
              :src="tech.src"
              :alt="tech.name"
              class="stack-icon"
              width="40"
              height="40"
              loading="lazy"
              draggable="false"
            />
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TechEntry {
  name: string
  src: string
}

const STACK: TechEntry[] = [
  { name: 'TypeScript',   src: '/Icons/typescript.svg' },
  { name: 'Nuxt',         src: '/Icons/nuxt.svg' },
  { name: 'Vue',          src: '/Icons/vuedotjs.svg' },
  { name: 'React Native', src: '/Icons/react.svg' },
  { name: 'Node.js',      src: '/Icons/nodedotjs.svg' },
  { name: 'PostgreSQL',   src: '/Icons/postgresql.svg' },
  { name: 'Supabase',     src: '/Icons/supabase.svg' },
  { name: 'Tailwind CSS', src: '/Icons/tailwindcss.svg' },
  { name: 'Stripe',       src: '/Icons/stripe.svg' },
  { name: 'Docker',       src: '/Icons/docker.svg' },
  { name: 'Kubernetes',   src: '/Icons/kubernetes.svg' },
  { name: 'Kafka',        src: '/Icons/apachekafka.svg' },
  { name: 'Vite',         src: '/Icons/vite.svg' },
  { name: 'tRPC',         src: '/Icons/trpc.svg' },
  { name: 'Expo',         src: '/Icons/expo.svg' },
  { name: 'GitHub',       src: '/Icons/github.svg' },
  { name: 'Google Cloud', src: '/Icons/googlecloud.svg' },
  { name: 'JavaScript',   src: '/Icons/javascript.svg' },
]
</script>

<style scoped>
/* ── Outer band ─────────────────────────────────────────────────────────── */
.stack-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 28px 0;
  /* Edge fade matching MarqueeBand */
  mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 6%,
    black 94%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0,
    black 6%,
    black 94%,
    transparent 100%
  );
}

/* ── Scrolling track ────────────────────────────────────────────────────── */
.stack-marquee-track {
  display: flex;
  width: max-content;
  animation: stack-scroll 55s linear infinite;
  will-change: transform;
}

/* Pause on hover */
.stack-marquee:hover .stack-marquee-track {
  animation-play-state: paused;
}

.stack-marquee-group {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── Individual item ────────────────────────────────────────────────────── */
.stack-marquee-item {
  display: inline-flex;
  align-items: center;
  padding: 0 36px;
  opacity: 0.4;
  transition: opacity 280ms ease;
  cursor: default;
}

.stack-marquee:hover .stack-marquee-item:hover {
  opacity: 0.9;
}

/* ── Icon ───────────────────────────────────────────────────────────────── */
.stack-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.stack-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  /* Convert coloured SVGs to muted white — matches the dark theme */
  filter: brightness(0) invert(1);
  display: block;
}

/* ── Keyframe ───────────────────────────────────────────────────────────── */
@keyframes stack-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-25%, 0, 0); }
}

/* ── Reduced motion ─────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .stack-marquee-track {
    animation: none;
  }
}
</style>
