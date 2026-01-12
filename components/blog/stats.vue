<script lang="ts" setup>
import type { ServerResponse, StatusCodes } from 'nexus-req';
import type { StatTable } from '~/server/types/index.types';
import errorSound from '../../assets/sounds/error-pop.mp3';
import click from '../../assets/sounds/pop-click.mp3';
import successSound from '../../assets/sounds/success.mp3';
const props = defineProps<{
    id: string
}>()
const stats = ref<StatTable | null>(null)
const playSounds = usePlaySound()
const { play } = useSound(click, {
    volume: 0.7
})
const target = ref('')
const { play: playSuccess } = useSound(successSound, {
    volume: 0.7
})
const { play: playError } = useSound(errorSound, {
    volume: 0.7
})
const isLoading = ref(true)
const isLoading2 = ref(false)
const playSound = () => {
    if (playSounds.value) play()
}
const playSuccessSound = () => {
    if (playSounds.value) playSuccess()
}
const playErrorSound = () => {
    if (playSounds.value) playError()
}

const updateStats = async (data: unknown) => {
    try {
        target.value = ''
        playSound()
        isLoading2.value = true
        const resp = await $fetch<ServerResponse<StatusCodes, StatTable>>('/api/neondb/stats/update-by-id', {
            method: "POST",
            body: {
                id: props.id,
                data: data
            },
            retry: 0,
            retryDelay: 0
        })
        console.log(resp)
        if (resp.ok && resp.data) {
            isLoading2.value = false
            playSuccessSound()
            stats.value = resp.data
        }
    } catch (error) {
        setTimeout(() => {
            playErrorSound()
            isLoading2.value = false
            console.error('Failed to update stats:', error)
        }, 1000)
    }

}
onMounted(async () => {
    try {
        const resp = await $fetch<ServerResponse<StatusCodes, StatTable>>('/api/neondb/stats/fetch-by-id', {
            method: "POST",
            body: {
                id: props.id
            }
        })
        if (resp.ok && resp.data) {
            stats.value = resp.data
            isLoading.value = false
        }
    } catch (error) {
        console.log(error)
    }
})
</script>
<template>
    <div class="">
        <h3 class="font-medium transition-all group-hover:rotate-12 text-xl md:text-2xl mb-4">
            Stats about this post
        </h3>
        <div v-if="!isLoading" class="flex gap-4 flex-wrap ">
            <div
                class="flex items-center  py-1 px-3 text-lg   rounded-box bg-base-content text-base-100 shadow-md shadow-base-content/30 gap-x-2 group">
                {{ stats?.views }} views
            </div>
            <button :disabled="isLoading2" @click="async () => {

                if (stats) {

                    await updateStats({
                        hearts: stats.hearts + 1
                    })
                    target = 'hearts'
                }
            }"
                class="flex disabled:pointer-events-none disabled:opacity-90 items-center min-w-22  py-1 px-3 border border-transparent transition-all cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-error/30 hover:border-error rounded-box bg-base-300/50 gap-x-2 group">
                <Icon :class="{ 'jello-horizontal': target === 'hearts' }" name="solar:heart-angle-bold" size="28"
                    class="transition-all group-hover:rotate-12 text-error" />
                {{ stats?.hearts }}
            </button>

            <button :disabled="isLoading2" @click="async () => {

                if (stats) {

                    await updateStats({
                        claps: stats.claps + 1
                    })
                    target = 'claps'
                }
            }"
                class="flex disabled:pointer-events-none min-w-22 disabled:opacity-90 items-center  py-1 px-3 border border-transparent transition-all cursor-pointer active:scale-95 hover:shadow-lg hover:border-secondary hover:shadow-secondary/30 rounded-box bg-base-300/50 gap-x-2 group">
                <Icon :class="{ 'jello-horizontal': target === 'claps' }" name="ph:hands-clapping-fill" size="28"
                    class="transition-all group-hover:rotate-12 text-secondary" /> {{ stats?.claps }}
            </button>
            <button :disabled="isLoading2" @click="async () => {

                if (stats) {

                    await updateStats({
                        stars: stats.stars + 1
                    })
                    target = 'stars'
                }
            }"
                class="flex disabled:pointer-events-none min-w-22 disabled:opacity-90 items-center  py-1 px-3 border border-transparent transition-all cursor-pointer active:scale-95 hover:shadow-lg hover:border-warning hover:shadow-warning/30 rounded-box bg-base-300/50 gap-x-2 group">
                <Icon :class="{ 'jello-horizontal': target === 'stars' }" name="ph:star-fill" size="28"
                    class="transition-all group-hover:rotate-12 text-warning" /> {{
                        stats?.stars }}
            </button>
            <button :disabled="isLoading2" @click="async () => {

                if (stats) {

                    await updateStats({
                        dislikes: stats.dislikes + 1
                    })
                    target = 'dislikes'
                }
            }"
                class="flex disabled:pointer-events-none min-w-22 disabled:opacity-90 items-center  py-1 px-3 border border-transparent transition-all hover:shadow-info/30 cursor-pointer active:scale-95 hover:shadow-lg hover:border-info rounded-box bg-base-300/50 gap-x-2 group">
                <Icon :class="{ 'jello-horizontal': target === 'dislikes' }" name="ph:thumbs-down-fill" size="28"
                    class="transition-all group-hover:rotate-12 text-info" />
                {{ stats?.dislikes }}
            </button>



        </div>
        <div v-if="isLoading" class="flex flex-wrap gap-4">
            <div class="p-4 py-4.5 rounded-box w-22 skeleton" v-for="i in [0, 1, 2, 3, 4]"></div>
        </div>
    </div>
</template>
