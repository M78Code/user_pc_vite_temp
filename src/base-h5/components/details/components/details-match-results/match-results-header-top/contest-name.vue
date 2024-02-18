<script setup>
import { format_total_score } from "src/output/index.js"
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
</script>

<template>
    <div class="team_name">
        <span class="ellipsis">{{ detail_data?.mhn }} v {{ detail_data?.man }}</span>
        <span>{{ format_total_score(detail_data, 0) }}-{{ format_total_score(detail_data, 1) }}</span>
    </div>
</template>

<style lang="scss" scoped>
.team_name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0.51rem;
    font-weight: 600;
    span {
        letter-spacing: 0;
        font-size: 0.16rem;
        //color: var(--q-gb-t-c-5);
        color: var(--q-gb-t-c-14);

        &:nth-child(2) {
            min-width: 0.5rem;
            text-align: right;
            white-space: nowrap;
        }
    }
}
</style>