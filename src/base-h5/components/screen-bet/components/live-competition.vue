<template>
    <div class="live-component">
        <p>直播中的赛事</p>
        <ul>
            <li v-for="(item, i) in props.data" :key="i">
                
            </li>
        </ul>
    </div>
    
</template>

<script setup>
import { watch } from "vue"
const props = defineProps({
    data: {
        type: Array,
        default: () => ([])
    }
})

watch(() => props.data, (v) => {
    console.log(v, "列表数据");
})
</script>

<style lang="scss" scoped></style>