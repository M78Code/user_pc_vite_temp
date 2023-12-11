<script setup name="score_child_5">
import {defineProps, computed} from "vue"

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
// 第一盘比分，第二盘比分，第三盘比分，第四盘比分，第五盘比分;
const msc_array = ['S23', 'S39', 'S55', 'S71', 'S87'];
// 第一盘，第二盘，第三盘，第四盘，第五盘;
const mmp_arr = ['8', '9', '10', '11', '12', '999'];

const scoreArray = computed(() => {
    let {msc_obj} = props.detail_data
    let score_arr = [];
    msc_array.forEach(item => {
        if (msc_obj[item]) {
            score_arr.push(msc_obj[item])
        }
    })
    return score_arr;
})
</script>

<template>
    <ul class="score_child_5" v-if="scoreArray.length > 0">
        <li v-for="(item, key) of scoreArray" :key="key" class="score">
            <span>{{ item.home }}</span>
            <span>-</span>
            <span>{{ item.away }}</span>
        </li>
    </ul>
</template>

<style scoped lang="scss">
.score_child_5 {
    width: 100%;
    height: 32px;
    display: flex;
    background: #ffffff;
    align-items: center;
    padding: 0 17px;
    font-size: 14px;
    border-top: 1px solid #F5F5F5;
    .score{
        margin-right: 20px;
       
    }
}
</style>