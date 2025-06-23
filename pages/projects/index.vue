<script lang="ts" setup>
import { ProjectsOSS } from '#components';

definePageMeta({
    layout: 'other'
})
const activeTab = ref<"featured" | "personal" | "oss">('featured')
</script>

<template>
    <div class="container mx-auto  xl:max-w-7xl">
        <div class=" space-y-12 py-6  ">
            <div class="mx-3">
                <div class="  p-3 rounded-box max-w-xl bg-base-200 w-full  ">

                    <div class=" flex gap-4 w-full">
                        <button @click="activeTab = 'featured'"
                            :class="{ '!bg-base-300 !rounded-box': activeTab === 'featured' }"
                            class="flex w-full cursor-pointer items-center rounded-full justify-center  group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                            <Icon name="solar:verified-check-bold-duotone" size="24"
                                :class="{ '!text-primary': activeTab === 'featured' }" />
                            <p class="font-bold text-xs md:text-base">Featured </p>
                        </button>
                        <button @click="activeTab = 'personal'"
                            :class="{ '!bg-base-300 !rounded-box': activeTab === 'personal' }"
                            class="flex w-full cursor-pointer items-center rounded-full justify-center  group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                            <Icon name="solar:star-fall-minimalistic-bold-duotone" size="24"
                                :class="{ '!text-primary': activeTab === 'personal' }" />
                            <p class="font-bold text-xs md:text-base">Personal </p>
                        </button>
                        <button @click="activeTab = 'oss'" :class="{ '!bg-base-300 !rounded-box': activeTab === 'oss' }"
                            class="flex w-full cursor-pointer items-center rounded-full justify-center  group transition-all duration-300  p-2 md:p-3 gap-x-2 hover:bg-base-300">

                            <Icon name="ph:git-branch-duotone" size="24"
                                :class="{ '!text-primary': activeTab === 'oss' }" />
                            <p class="font-bold hidden md:inline">Open source</p>
                            <p class="font-bold text-xs  md:hidden">OSS</p>
                        </button>
                    </div>

                </div>
            </div>
            <div v-auto-animate class="min-h-screen px-6">

                <ProjectsFeatured v-if="activeTab === 'featured'" />
                <ProjectsPersonal v-if="activeTab === 'personal'" />
                <ProjectsOSS v-if="activeTab === 'oss'" />

                <!-- <div class="mt-16">
                    <CtaCard />
                </div> -->
            </div>

        </div>
    </div>
</template>

