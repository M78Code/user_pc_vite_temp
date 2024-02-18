<script setup name="score_child_9">
import {nextTick, onMounted, reactive, watch, watchEffect} from "vue"
import {useMittEmit, MITT_TYPES} from "src/core/mitt/index.js";

const props = defineProps({
    detail_data: {
        type: Object,
        default: () => ({})
    }
})

const state = reactive({
    score_array: []
})

const InitScore = function (){
    const score_arr = []
    const msc_obj = props.detail_data?.msc_obj;
    const msc_obj_keys = Object.keys(msc_obj).filter(key => (Number(key.replace(/[Ss]/g, '')) > 119 && Number(key.replace(/[Ss]/g, '')) < 160))
    lodash.forEach(msc_obj_keys, item => {
        score_arr.push(msc_obj[item])
    })
    console.log(score_arr,"score_arr")
    state.score_array = score_arr
}

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

watchEffect(()=>{
    InitScore()
})

watch(() => props.detail_data, (newValue) => {
    validate_stage(newValue?.mmp)
}, {deep: true,immediate:true})

onMounted(() => {
    validate_stage(props.detail_data.mmp)
    nextTick(()=>{
        InitScore()
    })
})
</script>

<template>
    <ul class="score_child_9" v-if="state.score_array">
        <li v-for="(item,index) of state.score_array" :key="item" class="score">
            <span>&ensp;</span>
            <span :class="{'active-text': ((state.score_array || []).length == ++index && detail_data?.mo != 1) }">
                {{ item?.home }} - {{ item?.away }}
            </span>
            <span>&ensp;</span>
        </li>
    </ul>
</template>


<style scoped lang="scss">
.score_child_9 {
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