<template>
    <AnnounceWapper use_component_key="announce-h5"></AnnounceWapper>
</template>

<script setup>
import { AnnounceWapper } from 'src/components/announce'
</script>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'notice'
})
</script>