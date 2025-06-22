    <script lang="ts" setup>
    const props = defineProps<{
        details: {

            image: string
            title: string,
            link: string,
            type: string,
            description: string,
            duration: string
            status: "complete" | "wip" | "abandoned",
            note?: string
        }

    }>()
</script>
<template>
    <NuxtLink :to="details.link" target="_blank" class="w-full">
        <div
            class="bg-base-200 shadow-xl hover:shadow-primary/10 w-full rounded-box hover:border-primary transition-all group border border-base-300 p-3">
            <div class="mb-2">

                <NuxtImg loading="lazy" preset="rect" :src="`/images/${details.image}`" :alt="details.title"
                    :custom="true" class="rounded-box border border-base-300" v-slot="{ src, isLoaded, imgAttrs }">

                    <!-- Show the actual image when loaded -->
                    <img height="200" width="400" v-if="isLoaded" v-bind="imgAttrs" :src="src"
                        class="w-full !object-cover !h-[200px]">

                    <!-- Show a placeholder while loading -->
                    <div class="skeleton p-1  bg-base-300 lg:bg-base-200 w-full h-[200px]" v-if="!isLoaded"></div>
                </NuxtImg>
            </div>
            <div class="flex gap-3 items-center my-4">
                <span
                    class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-sm font-medium capitalize    border-base-content/30 font-mono flex items-center gap-2 ">
                    <!-- <Icon size="24" name="ph:eye-closed-duotone" v-if="details.type === 'closed source'" />
                        <Icon size="24" name="ph:git-pull-request-duotone" v-if="details.type === 'open source'" /> -->
                    {{ details.type }}
                </span>
                <span
                    class="!py-1 px-3 rounded-lg bg-base-200  inline-flex shadow-xl border-1 border-dashed text-sm font-medium capitalize    border-base-content/30 font-mono flex items-center gap-2 ">

                    {{ details.status }}
                    <!-- <Icon size="24" name="solar:check-circle-bold" v-if="details.status === 'complete'" />
                        <Icon size="24" name="solar:clock-circle-bold" v-if="details.status === 'wip'" />
                        <Icon size="24" name="solar:sad-circle-bold" v-if="details.status === 'abandoned'" /> -->
                </span>
            </div>
            <p v-if="details.note" class="my-2  flex gap-x-2 items-center text-primary text-sm">
                <Icon name="solar:info-circle-broken" />
                {{ details.note }}
            </p>
            <h2 class="font-bold transition-all group-hover:text-primary text-2xl">
                {{ details.title }}
            </h2>
            <p class="mt-2">
                {{ details.description }}
            </p>
            <p class="mt-4 flex items-center gap-2">
                <Icon size="24" name="solar:calendar-add-line-duotone" />
                <span class="opacity-60">
                    {{ details.duration }}
                </span>
            </p>
        </div>
    </NuxtLink>
</template>
