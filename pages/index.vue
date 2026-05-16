<template>
  <div>
    <SectionHero />
    <SectionAbout />
    <MarqueeBand :items="marqueeItems" :duration="52" />
    <SectionWork />
    <SectionServices />
    <SectionProcess />
    <SectionContact />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const marqueeItems = [
  'Building with AI',
  'Shipping fast',
  'OMENORA',
  'Reachify Labs',
  '54 microservices',
  'Solo full-stack',
  'Claude · Cursor · Windsurf',
  'Addison, IL',
  'Est. 2015',
  'Available June 2026',
]
</script>
