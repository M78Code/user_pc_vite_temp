<!--
    区分主客的玩法
    最后进球球员
    --用于无盘口&区分主客的多个投注项玩法 比如最后进球球员
-->
<script setup name="play-template-6">
import { defineProps } from "vue"
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({}),
    },
    active: {
        type: Number,
        default: 0,
    }
})

</script>

<template>
    <section class="template6">
        <nav>
            <div></div>
            <div></div>
        </nav>
    </section>

</template>

<style scoped lang="scss">

</style>