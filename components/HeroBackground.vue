<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

    <!-- LAYER 1: Base radial gradient -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-bg) 0%, var(--color-bg-deep) 50%, var(--color-bg-deeper) 100%);"
    />

    <!-- LAYER 2: SVG noise texture -->
    <div
      class="absolute inset-0"
      :style="noiseStyle"
    />

    <!-- LAYER 3: Faint grid -->
    <div
      class="absolute inset-0"
      style="
        background-image:
          linear-gradient(to right, var(--color-grid-line) 1px, transparent 1px),
          linear-gradient(to bottom, var(--color-grid-line) 1px, transparent 1px);
        background-size: 80px 80px;
        mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 0%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 0%, transparent 100%);
      "
    />

    <!-- LAYER 4a: Accent blob — top right -->
    <div
      style="
        position: absolute;
        top: 10%;
        right: 5%;
        width: 800px;
        height: 800px;
        background: #FF5C1F;
        opacity: 0.06;
        filter: blur(120px);
        border-radius: 50%;
        animation: blob-drift-1 30s ease-in-out infinite;
        will-change: transform;
        transform: translate3d(0, 0, 0);
      "
    />

    <!-- LAYER 4b: Purple blob — bottom left -->
    <div
      style="
        position: absolute;
        bottom: 5%;
        left: -10%;
        width: 600px;
        height: 600px;
        background: rgba(74, 31, 184, 1);
        opacity: 0.04;
        filter: blur(120px);
        border-radius: 50%;
        animation: blob-drift-2 35s ease-in-out infinite;
        will-change: transform;
        transform: translate3d(0, 0, 0);
      "
    />

  </div>
</template>

<script setup lang="ts">
const noiseStyle = {
  opacity: '0.015',
  mixBlendMode: 'overlay' as const,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  backgroundSize: '256px 256px',
}
</script>
