<script setup>
// import { defineProps } from "vue"
import { format_odds } from "src/output/index.js"

const props = defineProps({
    item: {},
    conflict_tips: {
        type: String,
        default: '',
    },
    single:{
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <nav class="information">
        <p class="title">
            <span>{{ item.tid_name }}</span>
            <span>@{{ format_odds(item.oddFinally, item.sportId) }}</span>
        </p>
        <div class="others">
            <p>{{item.playName}} </p>
            <p>{{ item.home }} VS {{ item.away }}</p>
        </div>
    </nav>
</template>

<style scoped lang="scss">
.information{
    padding: 0.08rem 0.12rem;
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--q-gb-t-c-3);
        font-size: 14px;
        font-weight: 500;
        span:nth-last-child(1){
            font-weight: bold;
            font-size: 22px;
            color: var(--q-gb-t-c-18);
        }
    }
    .others{
        border-left: 2px solid var(--q-gb-bg-c-13);
        padding-left: 4px;
        box-sizing: border-box;
        height: 0.38rem;
        font-size: 0.12rem;
    }
}
</style>