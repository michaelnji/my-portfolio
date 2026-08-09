<script setup lang="ts">
import type { PortableTextComponentProps } from '@portabletext/vue';
import VCodeBlock from '@wdns/vue-code-block';
const props = defineProps<PortableTextComponentProps<{
    code: string
    langue: string
}>>();

const trackEvent = useTrackEvent()
function onCopyStatus(status: 'copy' | 'success' | 'failed') {
    if (status === 'success') trackEvent('copy_code', { lang: props.value.langue })
}
</script>
<template>
    <VCodeBlock class="rounded-3xl" :code="value.code" highlightjs :lang="value.langue" theme="dracula"
        :copy-button="true" @update:copy-status="onCopyStatus" />
</template>
