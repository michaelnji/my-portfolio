<script lang="ts" setup>
import { PortableText } from '@portabletext/vue';
import { formatDate } from 'date-fns';
import BlogImage from '~/components/BlogImage.vue';
import BlogLink from '~/components/BlogLink.vue';
import CustomHeading from '~/components/CustomHeading.vue';
import Gotcha from '~/components/Gotcha.vue';
import Hint from '~/components/Hint.vue';
import Quote from '~/components/Quote.vue';
import SoftwareBlock from '~/components/SoftwareBlock.vue';
import CodeBlock from '~/components/codeBlock.vue';

const route = useRoute()
const postsStore = usePostsStore()
const selectedPost = computed(() => postsStore.posts?.find((x) => x.slug === route.params.slug))
const isLoading = ref(false)
definePageMeta({
    layout: 'other'
})
onMounted(async () => {
    if (!postsStore.posts) {
        try {
            isLoading.value = true
            await postsStore.fetchPosts()
            isLoading.value = false
        } catch (error) {

        }
    }

})
</script>
<template>
    <div>
        <div class=" continer max-w-[100rem] md:p-8 xl:p-0 !pb-48 mx-auto">
            <div v-if="isLoading" class="grid w-full h-screen place-items-center">
                <div class="flex items-center gap-x-6">
                    <div class="loader"></div>
                    <span class="opacity-60">Loading</span>
                </div>

            </div>

            <div v-if="!isLoading && postsStore.posts">
                <div class="flex flex-col lg:flex-row gap-8">
                    <div class="lg:w-2/3">
                        <div class="px-6 md:px-0 mt-6        lg:mt-12">
                            <div class="">
                                <NuxtImg loading="lazy" :src="$urlFor(selectedPost?.imgUrl).format('webp').url()"
                                    :alt="selectedPost?.title" :custom="true"
                                    class="!rounded-box  border border-base-300 max-w-full"
                                    v-slot="{ src, isLoaded, imgAttrs }">

                                    <img height="700" width="1400" v-if="isLoaded" v-bind="imgAttrs" :src="src"
                                        class="w-full object-cover">

                                    <div class="skeleton p-1  bg-base-300 lg:bg-base-200 w-full h-[400px] rounded-box border border-base-300"
                                        v-if="!isLoaded">
                                    </div>
                                </NuxtImg>
                            </div>
                            <p class="mt-6 md:mt-12 text-lg md:text-2xl opacity-80 flex items-center gap-2">
                                <span>
                                    {{ formatDate(selectedPost?.publishedAt ?? '', 'EEEE, do MMMM yyyy') }}
                                </span>
                            </p>
                            <h1 class="font-bold mt-4  font-display text-5xl md:text-6xl text-pretty lg:text-7xl">
                                {{ selectedPost?.title }}
                            </h1>


                            <p class="mt-4 md:text-xl flex items-center gap-2">
                                <Icon name="solar:user-circle-bold" />
                                <span>
                                    Posted by <span class="text-primary">{{ selectedPost?.authorInfo.name }}</span>
                                </span>
                            </p>
                        </div>
                        <div v-if="!isLoading && selectedPost"
                            class="mt-8 p-6 md:p-8 lg:p-6 bg-base-300/30 md:border border-base-300 rounded-t-2xl md:rounded-3xl">
                            <div
                                class="!min-w-full !opacity-100   prose-p:!min-w-full  prose prose-lg md:!prose-xl prose-img:!my-0  prose-invert prose-headings:font-extrabold prose-headings prose-pre:!p-0 prose-pre:whitespace-pre-wrap prose-p:text-pretty prose-pre:!bg-inherit prose-pre:!text-base prose-pre:!rounded-box md:prose-pre:!text-lg lg:prose-pre:!text-xl">
                                <PortableText v-if="selectedPost && selectedPost.body"
                                    :value="selectedPost?.body as any[]" :components="{
                                        types: {
                                            code: CodeBlock,
                                            image: BlogImage,
                                            img: BlogImage
                                        },
                                        marks: {
                                            // color: ColorBlock,
                                            // code: InlineCodeBlock,
                                            link: (props: any, { slots }: any) => h(BlogLink, props, slots.default?.()),

                                            software: (props: any) => h(SoftwareBlock, { pt: props.text }),

                                        },
                                        block: {
                                            h1: CustomHeading,
                                            h2: CustomHeading,
                                            h3: CustomHeading,
                                            h4: CustomHeading,
                                            h5: CustomHeading,
                                            h6: CustomHeading,
                                            blockquote: Quote,
                                            hint: Hint,
                                            gotcha: Gotcha,
                                        }
                                    }" />

                            </div>

                        </div>
                    </div>
                    <div class="lg:w-1/3">
                        <div class="md:sticky md:top-12 space-y-12 px-6 md:px-0">

                            <BlogStats />
                            <CtaCard />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
