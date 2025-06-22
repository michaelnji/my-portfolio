// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/app.css"],
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    // '@nuxt/scripts',
    // '@nuxt/test-utils',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    // '@unocss/nuxt',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/sanity',
  ],
  icon: {
    customCollections: [
      {
        prefix: 'kira',
        dir: './assets/icons'
      },
    ],
    clientBundle: {
      // list of icons to include in the client bundle
      icons: [
        'solar:info-circle-broken',
        'solar:hand-shake-broken',
        'solar:code-broken',
        'solar:bookmark-square-minimalistic-broken',
        'simple-icons:github',
        'simple-icons:whatsapp',
        'simple-icons:gmail',
        'simple-icons:discord',
        'logos:vue',
        'logos:typescript-icon',
        'logos:nuxt-icon',
        'logos:supabase-icon',
        'logos:tailwindcss-icon',
        'logos:bun',
        'logos:nodejs-icon-alt',
        'logos:git-icon',
        'simple-icons:git',
        'ph:book-bookmark-duotone',
        'simple-icons:gitbook',
        'solar:gameboy-line-duotone',
        'solar:verified-check-bold-duotone',
        'solar:star-fall-minimalistic-bold-duotone',
        'ph:git-branch-duotone',
        'ph:share',
        'solar:calendar-add-line-duotone',
        'solar:home-2-bold-duotone',
        'ph:laptop-duotone',
        // ''


      ],
      // include all custom collections in the client bundle
      includeCustomCollections: true,
    },
  },
  image: {
    format: ['webp', 'png', 'jpeg'],
    // define your own presets
    presets: {
      avatar: {
        modifiers: {
          format: 'jpg',
          width: 50,
          height: 50
        }
      },
      rect: {
        modifiers: {
          format: 'webp',
          quality: 80
        }
      }
    }
  },
  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],

    },
    // use ~public/fonts for your font files
    provider: 'local'
  },
  runtimeConfig: {
    sanityToken: '',
    public: {
      sanityProjectId: process.env.NUXT_SANITY_ID
    }
  },
  sanity: {
    projectId: process.env.NUXT_SANITY_ID,
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-05-23',
    token: process.env.NUXT_SANITY_TOKEN,
    perspective: 'published'
  },
})