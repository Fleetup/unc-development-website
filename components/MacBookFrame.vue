<template>
  <div
    class="relative inline-block"
    :style="containerStyle"
  >
    <!-- Glow -->
    <div
      v-if="glow"
      class="absolute pointer-events-none"
      style="
        inset: -60px;
        background: radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,92,31,0.12), transparent 70%);
        z-index: 0;
      "
      aria-hidden="true"
    />

    <!--
      Screen content slot — absolutely positioned to match the Laptop.svg screen area.
      SVG viewBox: 0 0 498.85 311.03
      Screen area measured: x=201.52 y=7.86 w=289.03 h=234.15
      Percentages: left=40.4% top=2.53% width=57.93% height=75.44%
      z-index:1 so SVG frame (z-index:2) renders on top.
      The laptop SVG screen is a tilted polygon (perspective view),
      so a slight 2px inset on all sides avoids edge bleed.
    -->
    <div
      class="absolute overflow-hidden"
      style="
        left: 40.4%;
        top: 2.53%;
        width: 57.93%;
        height: 75.44%;
        border-radius: 1.5%;
        background: #0A0A0F;
        z-index: 1;
      "
      aria-label="Screen content"
    >
      <slot>
        <div
          class="w-full h-full flex items-center justify-center"
          style="background: linear-gradient(140deg, #0d0520 0%, #0A0A0F 70%);"
        >
          <span style="font-family: var(--font-mono); font-size: 13px; color: rgba(255,255,255,0.3);">preview</span>
        </div>
      </slot>
    </div>

    <!--
      Inline SVG device frame — .st77 (white screen) overridden to transparent
      so slot content behind the SVG is visible through the screen area.
      z-index:2 so bezels render on top of slot content.
    -->
    <div
      v-if="svgContent"
      class="absolute inset-0 w-full h-full"
      style="z-index: 2; pointer-events: none;"
      aria-hidden="true"
      v-html="svgContent"
    />
    <!-- Fallback img while SVG loads -->
    <img
      v-else
      src="/frames/Laptop.svg"
      alt=""
      draggable="false"
      class="absolute inset-0 w-full h-full"
      style="z-index: 2; pointer-events: none; user-select: none; display: block;"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tilt {
  rotateY?: number
  rotateX?: number
}

const props = withDefaults(defineProps<{
  tilt?: Tilt
  glow?: boolean
  width?: string
}>(), {
  tilt: () => ({ rotateY: 0, rotateX: 0 }),
  glow: false,
  width: '600px',
})

// Fetch pre-transformed SVG from server route (/api/frames/laptop).
// The route reads Laptop.svg, sets .st77 fill to none, and returns SVG text.
// This works in both SSR and CSR contexts.
const { data: svgContent } = await useFetch<string>('/api/frames/laptop', {
  key: 'laptop-svg',
  parseResponse: (txt: string) => {
    // Ensure the inline SVG scales to fill its container div
    return txt.replace('<svg ', '<svg style="width:100%;height:100%;display:block;" ')
  },
})

const containerStyle = computed(() => {
  const ry = props.tilt?.rotateY ?? 0
  const rx = props.tilt?.rotateX ?? 0
  return {
    width: props.width,
    aspectRatio: '498.85 / 311.03',
    display: 'block',
    position: 'relative' as const,
    transform: `rotateY(${ry}deg) rotateX(${rx}deg)`,
    transformStyle: 'preserve-3d' as const,
    willChange: 'transform',
  }
})
</script>
