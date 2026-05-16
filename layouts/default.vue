<template>
  <div
    class="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans"
    :style="glowStyle"
  >
    <div
      v-if="isActive"
      class="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style="background: radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(255,92,31,0.06), transparent 40%)"
      aria-hidden="true"
    />
    <div class="relative z-10">
      <AppHeader />
      <main class="pt-16">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCursorGlow } from '~/composables/useCursorGlow'

const { mouseX, mouseY, isActive } = useCursorGlow()

const glowStyle = computed(() => ({
  '--glow-x': `${mouseX.value}px`,
  '--glow-y': `${mouseY.value}px`,
}))

// ── SEO — meta tags ────────────────────────────────────────────────────────
useSeoMeta({
  title: 'Miki Jokovic — Full-Stack Developer | UNC Development',
  description:
    'Solo full-stack engineer based in Addison, IL. I build production-ready web and mobile apps — MVP builds, SaaS products, AI integrations, and monthly retainers. Available for new projects.',
  ogTitle: 'Miki Jokovic — Full-Stack Developer | UNC Development',
  ogDescription:
    'Solo full-stack engineer. I build production web & mobile apps — MVPs, SaaS, AI integrations. Recent work: OMENORA, Reachify Labs, 54-microservice fleet platform.',
  ogImage: 'https://uncdevelopment.com/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'UNC Development — Miki Jokovic, Full-Stack Developer',
  ogUrl: 'https://uncdevelopment.com/',
  ogType: 'website',
  ogSiteName: 'UNC Development',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Miki Jokovic — Full-Stack Developer | UNC Development',
  twitterDescription:
    'Solo full-stack engineer. Production web & mobile apps — MVPs, SaaS, AI integrations. Based in Addison, IL. Available for new projects.',
  twitterImage: 'https://uncdevelopment.com/og-image.png',
  twitterImageAlt: 'UNC Development — Miki Jokovic, Full-Stack Developer',
  robots: 'index, follow',
  themeColor: '#0A0A0F',
  colorScheme: 'dark',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://uncdevelopment.com/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://uncdevelopment.com/#website',
            url: 'https://uncdevelopment.com/',
            name: 'UNC Development',
            description: 'Full-stack web and mobile development by Miki Jokovic.',
            inLanguage: 'en-US',
          },
          {
            '@type': 'Person',
            '@id': 'https://uncdevelopment.com/#person',
            name: 'Miki Jokovic',
            url: 'https://uncdevelopment.com/',
            jobTitle: 'Full-Stack Developer',
            description:
              'Solo full-stack engineer specialising in production web and mobile apps, MVP builds, SaaS products, and AI integrations.',
            worksFor: {
              '@type': 'Organization',
              name: 'UNC Development',
              url: 'https://uncdevelopment.com/',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Addison',
              addressRegion: 'IL',
              addressCountry: 'US',
            },
            knowsAbout: [
              'Web Development',
              'Mobile App Development',
              'Full-Stack Engineering',
              'AI Integration',
              'SaaS Products',
              'MVP Development',
            ],
            sameAs: [
              'https://github.com/Fleetup',
            ],
          },
          {
            '@type': 'ProfessionalService',
            '@id': 'https://uncdevelopment.com/#service',
            name: 'UNC Development',
            url: 'https://uncdevelopment.com/',
            description:
              'Full-stack web and mobile app development services — MVP builds, SaaS products, AI integrations, codebase audits, and monthly retainers.',
            founder: { '@id': 'https://uncdevelopment.com/#person' },
            areaServed: 'US',
            serviceType: 'Software Development',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Addison',
              addressRegion: 'IL',
              addressCountry: 'US',
            },
            email: 'developmentteam@uncdevelopment.com',
            knowsAbout: [
              'Web Application Development',
              'Mobile App Development',
              'MVP Build',
              'AI Integration',
              'Software Architecture',
            ],
          },
        ],
      }),
    },
  ],
})
</script>
