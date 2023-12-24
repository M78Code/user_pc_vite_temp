<script setup name="score_child_9">
import {computed, onMounted, ref, watch} from "vue"
import {useMittEmit, MITT_TYPES} from "src/core/mitt/index.js";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})

const msc_array = ref([])

const score_array = computed(() => {
    const score_arr = []
    const msc_obj = props.detail_data?.msc_obj || {};
    const msc_obj_keys = Object.keys(msc_obj).filter(key => (Number(key.replace(/[Ss]/g, '')) > 119 && Number(key.replace(/[Ss]/g, '')) < 160))
    lodash.forEach(msc_obj_keys, item => {
        score_arr.push(msc_obj[item])
    })
    return score_arr
})

watch(() => props.detail_data, (newValue) => {
    validate_stage(newValue.mmp)
}, {deep: true})


const validate_stage = function (mmp){
    switch(mmp){
        case '301':  //301   第一局结束 S121显示第二局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
        case '9':    //9     第二局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S121|0:0')
            break;
        case '302':  //302   第二局结束 S122显示第三局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
        case '10':   //10    第三局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S122|0:0')
            break;
        case '303':  //303   第三局结束 S123显示第四局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
            break;
        case '11':   //11    第四局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S123|0:0')
            break;
        case '304':  //304   第四局结束 S124显示第五局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
            break;
        case '12':   //12    第五局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S124|0:0')
            break;
        case '305':  //305   第五局结束 S125显示第六局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
            break;
        case '441':  //441   第六局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S125|0:0')
            break;
        case '306':  //306   第六局结束 S126显示第七局比分0:0
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
            break;
        case '442':  //442   第七局开始
            useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, 'S126|0:0')
            break;
    }
}

onMounted(() => {
    console.log(props.detail_data,"props.detail_data")
    validate_stage(props.detail_data.mmp)
})
</script>

<template>
    <ul class="score_child_8" v-if="(score_array || []).length">
        <li v-for="item of score_array" :key="item" class="score">
            <span>{{ item?.home }}</span>
            <span>-</span>
            <span>{{ item?.away }}</span>
        </li>
    </ul>
</template>


<style scoped lang="scss">
.score_child_8 {
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    box-sizing: border-box;
    gap: 4px;
}
</style>