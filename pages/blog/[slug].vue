<script lang="ts" setup>
import { PortableText } from '@portabletext/vue'
import { formatDate } from 'date-fns';
import BlogImage from '~/components/BlogImage.vue';
import BlogLink from '~/components/BlogLink.vue';
import CodeBlock from '~/components/codeBlock.vue';
import CustomHeading from '~/components/CustomHeading.vue';
import Gotcha from '~/components/Gotcha.vue';
import Hint from '~/components/Hint.vue';
import Quote from '~/components/Quote.vue';
import SoftwareBlock from '~/components/SoftwareBlock.vue';

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
        <div class=" continer max-w-[100rem]  p-6 md:p-12 !pb-48 mx-auto">
            <div v-if="isLoading" class="grid w-full h-screen place-items-center">
                <div class="flex items-center gap-x-6">
                    <div class="loader"></div>
                    <span class="opacity-60">Loading</span>
                </div>

            </div>

            <div v-if="!isLoading && postsStore.posts">
                <div class="flex gap-8">
                    <div class="w-2/3">
                        <NuxtImg loading="lazy" :src="$urlFor(selectedPost?.imgUrl).format('webp').url()"
                            :alt="selectedPost?.title" :custom="true" class="rounded-box border border-base-300"
                            v-slot="{ src, isLoaded, imgAttrs }">

                            <img height="700" width="1400" v-if="isLoaded" v-bind="imgAttrs" :src="src"
                                class="w-full object-cover">

                            <div class="skeleton p-1  bg-base-300 lg:bg-base-200 w-full h-[400px] rounded-box border border-base-300"
                                v-if="!isLoaded">
                            </div>
                        </NuxtImg>
                        <p class="mt-6 md:mt-12  text-2xl opacity-80 flex items-center gap-2">
                            <span>
                                {{ formatDate(selectedPost?.publishedAt ?? '', 'EEEE, do MMMM yyyy') }}
                            </span>
                        </p>
                        <h1 class="font-medium mt-4  font-display text-5xl md:text-6xl text-pretty lg:text-7xl">
                            {{ selectedPost?.title }}
                        </h1>

                        <!-- <div class="flex justify-center mt-4 gap-2 items-center">
                        <div v-for="(tag, i) in selectedPost?.tags" :key="i">
                            <span v-if="i < 2"
                                class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl  border line-clamp-1  font-medium capitalize    border-base-content/20 font-mono flex items-center gap-2 ">

                                {{ tag.title.replaceAll('-', ' ') }}
                            </span>


                        </div>
                    </div> -->
                        <p class="mt-4 text-xl flex items-center gap-2">
                            <Icon name="solar:user-circle-bold" />
                            <span>
                                Posted by <span class="text-primary">{{ selectedPost?.authorInfo.name }}</span>
                            </span>
                        </p>
                        <div v-if="!isLoading && selectedPost"
                            class="mt-8 p-12 bg-base-300/30 border border-base-300 rounded-3xl">
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
                </div>
            </div>
        </div>
    </div>
</template>
