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
        <li class="score" v-for="(item,index) of (score_array || [])" :key="item">
            <span>&ensp;</span>
            <span :class="{'active-text':(score_array.length == ++index && detail_data.mo != 1)}">
                {{ item?.home }} - {{ item?.away }}
            </span>
            <span>&ensp;</span>
        </li>
    </ul>
</template>


<style scoped lang="scss">
.score_child_8{
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    box-sizing: border-box;

    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: auto;
    white-space: nowrap;

    font:{
        size: .14rem;
        weight: bold;
    }

    .active-text {
        color: var(--q-gb-t-c-1);
    }
}

</style>