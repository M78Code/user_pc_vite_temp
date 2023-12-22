<!--
    区分主客的玩法
    最后进球球员
    --用于无盘口&区分主客的多个投注项玩法 比如最后进球球员
-->
<script setup name="play-template-6">
import {computed, onMounted, reactive, ref} from "vue"
import lodash from "lodash";
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({}),
    }
})

const showMore = ref(true)
const element = ref(null)

const stateStore = reactive({
    ol_list_0: [],
    ol_list_1: [],
    ol_list_2: [],
    other_item_list: [],
    max_count_ol: [],
})
const hide_show_more_layout = computed(()=>{
    let ret = true;
    let len = lodash.get(props.item_data,'hl[0].ol.length');
    if(!len) len = 0;
    ret = !(len>10)
    return ret;
})

const get_ol_list = () =>{
    let max = 0,
        hl = props.item_data.hl[0],
        ol_list = hl.ol;

    props.item_data.title.forEach((tit,i) => {
        let other_items = ol_list.filter(ol_item => ol_item.ot == 'Other');
        if(other_items.length){
            // 合并数据，根据id去重
            const arr = [...other_items,...other_item_list.value]
            const uniq_arr = lodash.uniqWith(arr, (arr_val, oth_val)=>{
                if(arr_val.id_ === oth_val.id_ ) {
                    return true
                }
                return false
            });
            other_item_list.value = uniq_arr
        }
        //os等于3需要隐藏投注项
        let filtered = ol_list.filter(ol_item => ol_item.otd == tit.otd && ol_item.ot != 'Other' && ol_item.os != 3 );
        if(i == 0){
            stateStore.ol_list_0 = filtered;
        }
        else if(i == 1){
            stateStore.ol_list_1 = filtered;
        }
        else if(i == 2){
            stateStore.ol_list_2 = filtered;
        }
        let m_len = filtered.length;
        if(m_len > max) max = m_len;
    });
    return max;
}

onMounted(() => {
    // 根据指定模板,对模板下数据量大的玩法进行折叠处理
    // 获取玩法下的数量
    let temp = lodash.get(props.item_data,'hl[0].ol.length');
    if(temp && temp>10){
        showMore.value = false;
    }
    stateStore.max_count_ol = get_ol_list();
})
</script>

<template>
    <section class="component play-template play-template-6 template6">
        <nav class="title">
            <div></div>
            <div></div>
        </nav>
    </section>

</template>

<style scoped lang="scss">
.title{
    width: 100%;
    display: flex;
}
</style>