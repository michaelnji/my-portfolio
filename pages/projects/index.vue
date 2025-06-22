<script lang="ts" setup>
import { ProjectsOSS } from '#components';

definePageMeta({
    layout: 'other'
})
const activeTab = ref<"featured" | "personal" | "oss">('featured')
</script>

<template>
    <div class="container mx-auto px-6 xl:max-w-7xl">
        <div class="flex flex-col md:flex-row gap-8 lg:gap-12 py-6  ">
            <div class="!h-max p-6 rounded-box bg-base-200 w-full max-w-1/3 sticky top-12 hidden md:block">
                <h2 class="font-bold text-2xl opacity-70">
                    Projects
                </h2>
                <p class="mt-2 text-sm opacity-80">
                    These are my projects I've been working on since 2023.
                </p>
                <div class="mt-12 space-y-2 w-full">
                    <button @click="activeTab = 'featured'"
                        :class="{ '!bg-base-300 !rounded-box': activeTab === 'featured' }"
                        class="flex w-full cursor-pointer items-center rounded-full group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                        <Icon name="solar:verified-check-bold-duotone" size="28"
                            :class="{ '!text-primary': activeTab === 'featured' }" />
                        <p class="font-bold text-lg">Featured </p>
                    </button>
                    <button @click="activeTab = 'personal'"
                        :class="{ '!bg-base-300 !rounded-box': activeTab === 'personal' }"
                        class="flex w-full cursor-pointer items-center rounded-full group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                        <Icon name="solar:star-fall-minimalistic-bold-duotone" size="28"
                            :class="{ '!text-primary': activeTab === 'personal' }" />
                        <p class="font-bold text-lg">Personal </p>
                    </button>
                    <button @click="activeTab = 'oss'" :class="{ '!bg-base-300 !rounded-box': activeTab === 'oss' }"
                        class="flex w-full cursor-pointer items-center rounded-full group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                        <Icon name="ph:git-branch-duotone" size="28"
                            :class="{ '!text-primary': activeTab === 'oss' }" />
                        <p class="font-bold text-lg">Open source</p>
                    </button>
                </div>
                <div class="mt-16">
                    <button class="btn btn-ghost btn-secondary !flex !items-center w-full">

                        See my Github
                        <Icon name="ph:share" size="24" />
                    </button>
                </div>
            </div>
            <div v-auto-animate class="md:w-3/4 md:pt-12 ">
                <h2 class="font-bold mb-6 text-4xl md:hidden font-display">
                    My Projects
                </h2>
                <div class=" md:hidden space-y-8">
                    <ProjectsFeatured />
                    <ProjectsPersonal />
                    <ProjectsOSS />
                </div>
                <div v-auto-animate class="hidden md:block">
                    <ProjectsFeatured v-if="activeTab === 'featured'" />
                    <ProjectsPersonal v-if="activeTab === 'personal'" />
                    <ProjectsOSS v-if="activeTab === 'oss'" />
                </div>
                <div class="mt-16">
                    <CtaCard />
                </div>
            </div>

        </div>
    </div>
</template>

