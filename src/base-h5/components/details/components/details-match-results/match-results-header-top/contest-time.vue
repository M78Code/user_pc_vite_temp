<script setup>
import { formatTime } from "src/output/index.js"
import { computed } from "vue";
import {useRoute} from "vue-router";
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
const Route = useRoute()
const format_time = computed(()=>{
    return props.detail_data?.mgt ?? Date.now()
})
</script>

<template>
    <span class="team-time" v-if="['result_details', 'match_result'].includes(Route?.name)">
        {{ formatTime(format_time, 'mm/dd HH:MM')}}
    </span>
</template>

<style lang="scss" scoped>
.team-time{
    height: .32rem;
    //color: var(--q-gb-t-c-5);
    color: var(--q-gb-t-c-14);
}
</style>