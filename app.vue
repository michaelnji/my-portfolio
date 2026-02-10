<script lang="ts" setup>
import '~/assets/css/custom.css';
import { Analytics } from '@vercel/analytics/nuxt'
import { useHead } from '#imports';
import '@catppuccin/highlightjs/css/catppuccin-mocha.css';
import { generateHumanMessage } from 'nexus-req';
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';

useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', href: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  ],
  meta: [
    // used on some mobile browsers
    { name: 'theme-color', content: '#b4ff22' },
    // choose light or dark (or both, see Light + Dark Mode)
    { name: 'color-scheme', content: 'dark' },
  ]
})

const online = useOnline()
const postsStore = usePostsStore()
const categoriesStore = useCategoriesStore()
async function retry() {
  try {
    await Promise.all([await postsStore.fetchPosts(),
    await $fetch('/api/neondb/stats/setup')])
  } catch (error) {
    reloadNuxtApp()
  }
}
onMounted(async () => {
  await callOnce(async () => {
    try {
      await Promise.all([await postsStore.fetchPosts(),
      await $fetch('/api/neondb/stats/setup')])

    } catch (error) {
      toast.error(generateHumanMessage(`${error}`), {
        duration: 7000,
        action: {
          label: 'Retry',
          onClick: () => toast.promise(retry, {
            loading: 'Fetching...',
            success: 'Data has been loaded successfully',
            error: 'An error has occured, please reload this page'



          })
        },
      })

    }
  })
})
</script>
<template>
  <div class="
  ">
    <Analytics />
    <Toaster position="bottom-right" theme="dark" richColors :toastOptions="{

      class: '!p-3 !rounded-box  !items-start  ',
      descriptionClass: 'text-sm '
    }" />
    <div class="w-full px-6 py-3 border-b border-base-300 flex justify-between items-center gap-x-4 bg-base-200 ">
      <Logo />

      <div class="flex items-center gap-x-4">
        <div class=" gap-x-4 text-xs mr-3 bg-base-300 rounded-box px-3 py-1">
          <div class="inline-grid *:[grid-area:1/1]">
            <div v-if="!online" class="status status-error animate-ping"></div>
            <div v-if="!online" class="status status-error"></div>
            <div v-if="online" class="status status-success animate-ping"></div>
            <div v-if="online" class="status status-success"></div>
          </div>
          {{ online ? "You're online" : "You're offline" }}
        </div>

        <NuxtLink to="https://github.com/michaelnji" target="_blank">
          <Icon name="simple-icons:github" size="18" />
        </NuxtLink>
        <Sound />

      </div>
    </div>
    <NuxtLayout>
      <div data-theme="mine">
        <NuxtPage />

      </div>
    </NuxtLayout>
    <BottomBar />
  </div>
</template>
