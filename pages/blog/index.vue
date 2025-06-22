<script lang="ts" setup>

const postsStore = usePostsStore()
const isLoading = ref(true)
definePageMeta({
    layout: 'other'
})
onMounted(async () => {
    if (!postsStore.posts) {
        isLoading.value = true
        await postsStore.fetchPosts()
        isLoading.value = false
    }
    console.log(postsStore.posts)
})
</script>

<template>
    <div :class="{ '!max-h-screen !overflow-clip': isLoading }" class=" w-full p-6">
        <div class="container max-w-6xl mx-auto">
            <div class="grid w-full h-screen place-items-center">
                <!-- <Icon name="svg-spinners:" /> -->
            </div>
        </div>
    </div>
</template>

