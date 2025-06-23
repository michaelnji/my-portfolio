<script lang="ts" setup>
import type { PortableTextComponentProps } from '@portabletext/vue';
import { Icon } from '#components'

const props = defineProps<
    { pt: string }
>();
const icon = computed(() => {
    if (props.pt.includes('?symbol')) return `https://cdn.brandfetch.io/${props.pt.split('?symbol')[0]}/w/400/h/400/symbol?c=1idunDyDtbQdblaeYsE`
    return `https://cdn.brandfetch.io/${props.pt}/w/400/h/400?c=1idunDyDtbQdblaeYsE`
})

</script>
<template>
    <div class="!inline-flex mx-2   items-start !p-0">
        <div class="  capitalize ">
            <div class="size-5 overflow-hidden inline-flex mt-2 mr-2">
                <img :src="icon" alt="" class="!my-0 !py-0">
            </div>
            <span class="opacity-90 font-bold !leading-0">{{ props.pt.toLowerCase().split('.')[0] }}</span>
        </div>
    </div>
</template>
