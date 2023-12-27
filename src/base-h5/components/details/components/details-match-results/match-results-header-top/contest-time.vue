<script setup>
import { formatTime } from "src/output/index.js"
import {useRoute} from "vue-router";
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
const Route = useRoute()
</script>

<template>
    <span class="team-time" v-if="['result_details', 'match_result'].includes(Route?.name)">
        {{ formatTime(+detail_data?.mgt, 'mm/dd HH:MM')}}
    </span>
</template>

<style lang="scss" scoped>
.team-time{
    height: .32rem;
    color: var(--q-gb-t-c-5);
}
</style>