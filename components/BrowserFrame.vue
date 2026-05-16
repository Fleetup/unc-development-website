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

    <!-- Browser body -->
    <div
      class="relative overflow-hidden"
      style="
        border-radius: 12px;
        background: #1C1C1E;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,0.07),
          0 24px 60px rgba(0,0,0,0.55),
          0 6px 16px rgba(0,0,0,0.35);
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
      "
    >
      <!-- Chrome bar -->
      <div
        class="flex items-center gap-3 flex-shrink-0"
        style="height: 40px; padding: 0 14px; background: #1C1C1E; border-bottom: 1px solid rgba(255,255,255,0.06);"
      >
        <!-- Traffic lights -->
        <div class="flex items-center gap-[6px]" aria-hidden="true">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #FF5F57;" />
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #FEBC2E;" />
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #28C840;" />
        </div>

        <!-- URL bar -->
        <div
          class="flex-1 flex items-center justify-center"
          style="max-width: 260px; margin: 0 auto;"
        >
          <div
            class="flex items-center gap-1.5 w-full"
            style="
              background: #2A2A2D;
              border-radius: 9999px;
              padding: 3px 10px;
            "
          >
            <!-- Lock icon -->
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="2" y="4.5" width="6" height="4.5" rx="1" fill="rgba(255,255,255,0.35)" />
              <path d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5" stroke="rgba(255,255,255,0.35)" stroke-width="1" fill="none" />
            </svg>
            <span style="font-family: var(--font-mono); font-size: 10px; color: rgba(255,255,255,0.45); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              {{ url }}
            </span>
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div style="flex: 1; padding: 0; overflow: hidden;">
        <div class="w-full h-full overflow-hidden">
          <slot>
            <div
              class="w-full h-full flex items-center justify-center"
              style="background: linear-gradient(140deg, #1a0a05 0%, #0A0A0F 70%);"
            >
              <span style="font-family: var(--font-mono); font-size: 13px; color: rgba(255,255,255,0.3);">preview</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
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
  url?: string
  width?: string
}>(), {
  tilt: () => ({ rotateY: 0, rotateX: 0 }),
  glow: false,
  url: 'localhost',
  width: '500px',
})

const containerStyle = computed(() => {
  const ry = props.tilt?.rotateY ?? 0
  const rx = props.tilt?.rotateX ?? 0
  return {
    width: props.width,
    aspectRatio: '16 / 10',
    transform: `rotateY(${ry}deg) rotateX(${rx}deg)`,
    transformStyle: 'preserve-3d' as const,
    willChange: 'transform',
  }
})
</script>
