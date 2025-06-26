<script lang="ts" setup>
import '~/assets/css/custom.css';
import '~/assets/css/dracula.css';
import { toast, Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import { generateHumanMessage } from 'nexus-req';
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
    <NuxtLayout>
      <div data-theme="mine">
        <NuxtPage />

      </div>
    </NuxtLayout>
    <BottomBar />
  </div>
</template>
