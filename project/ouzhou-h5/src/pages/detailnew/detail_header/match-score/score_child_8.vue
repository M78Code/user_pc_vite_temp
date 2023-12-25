<script setup name="score_child_8">
import {computed} from "vue"
const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})

// 兵乓球比分集合
const score_array = computed(() => {
    const score_arr = []
    const msc_obj = props.detail_data?.msc_obj || {};
    const msc_obj_keys = Object.keys(msc_obj).filter( key=> ( Number(key.replace(/[Ss]/g, '')) > 119 && Number(key.replace(/[Ss]/g, '')) < 160 ) )
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