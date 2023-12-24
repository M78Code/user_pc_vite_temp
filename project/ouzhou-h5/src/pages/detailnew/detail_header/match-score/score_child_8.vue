<script setup name="score_child_8">
import {computed, nextTick, onMounted} from "vue"
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})
// mmp rule array: 乒乓球：301第一盘/局结束, 302第二盘/局结束, 303第三盘/局结束, 304第四盘/局结束, 305第五盘/局结束, 306第六盘/局结束;
const mmp_arr = ['301', '302', '303', '304', '305', '306'];
// mmp rule array; 乒乓球: 8第一盘/局, 9第二盘/局, 10第三盘/局, 11第四盘/局, 12第五盘/局, 441第六局, 442第七局;
const mmp_arr2 = ['8', '9', '10', '11', '12', '441', '442'];
// 兵乓球比分集合
const score_array = computed(() => {
    const score_arr = []
    const msc_obj = props.detail_data?.msc_obj || {};
    const msc_obj_keys = Object.keys(msc_obj).filter( key=> ( Number(key.replace(/[Ss]/g, '')) > 119 && Number(key.replace(/[Ss]/g, '')) < 160 ) )
    console.log(msc_obj_keys,"detail_data=====msc_obj_keys")
    lodash.forEach(msc_obj_keys,item=>{
        score_arr.push(msc_obj[item])
    })
    return score_arr
})
</script>

<template>
    <ul class="score_child_8" v-if="(score_array || []).length">
        <li v-for="item of (score_array || [])" :key="item" class="score">
            <span>{{ item?.home }}</span>
            <span>-</span>
            <span>{{ item?.away }}</span>
        </li>
    </ul>
</template>


<style scoped lang="scss">
.score_child_8{
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    box-sizing: border-box;
    gap: 4px;
}
</style>