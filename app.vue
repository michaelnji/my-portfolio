<script lang="ts" setup>
import '~/assets/css/custom.css';
const postsStore = usePostsStore()
onMounted(async () => {
  await callOnce(async () => {
    try {
      await postsStore.fetchPosts()
    } catch (error) {

    }
  })
})
</script>
<template>
  <div class="
  ">
    <NuxtLayout>
      <div data-theme="mine">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
