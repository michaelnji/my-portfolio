<script lang="ts" setup>
import '~/assets/css/custom.css';
// import '~/assets/css/dracula.css';
import '@catppuccin/highlightjs/css/catppuccin-mocha.css'
import { toast, Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import { generateHumanMessage } from 'nexus-req';
const online = useOnline()
const postsStore = usePostsStore()
const categoriesStore = useCategoriesStore()
async function retry() {

  await postsStore.fetchPosts()
  await categoriesStore.fetchCategories()

}
onMounted(async () => {
  await callOnce(async () => {
    try {
      await postsStore.fetchPosts()
      await categoriesStore.fetchCategories()
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
