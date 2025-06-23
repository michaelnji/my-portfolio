<script setup lang="ts">
import type { PortableTextComponentProps } from '@portabletext/vue';
import VCodeBlock from '@wdns/vue-code-block';
defineProps<PortableTextComponentProps<{
    code: string
    langue: string
}>>();

</script>
<template>
    <VCodeBlock class="rounded-3xl" :code="value.code" highlightjs :lang="value.langue" theme="dracula" />
</template>
