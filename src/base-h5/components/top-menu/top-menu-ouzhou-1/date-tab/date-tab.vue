<template>
    <div class="date-tab">
        <section>
            <div v-for="(item,index) in dateList" :key="item.val" class="time-list-item">
                <div @click="time_tab(item,index)" :class="[{ 'time_active': defaultVal == item.val }, 'item-text']">{{ item.name }}
                </div>
            </div>
        </section>
    </div>
</template>
  
<script setup>
import MatchFold from 'src/core/match-fold/index.js'
// import { dateWeekFormat } from "../utils.js";
const props = defineProps({
    reverse: {
        type: Boolean,
        default: false
    },
    dateList:{
        type: Array,
        default: []
    },
    defaultVal:{
        type: String,
        default: ""
    },
    changeDate:{
        type: Function,
        default: ()=>{}
    }
})
const emits = defineEmits(['changeDate']);
// console.log(props.dateList)
//时间列表
// const dateListNav = props.dateList || dateWeekFormat(new Date(), props.reverse);
// const time_active = ref(props.defaultVal);
/**
 * 时间选择
 * @param {*} item 
 */
const time_tab = (item,index) => {
    // if(time_active.value === item.val)return;
    // time_active.value = item.val;
    MatchFold.clear_fold_info()
    emits('changeDate',item,index)
    // 设置日期
    // MenuData.set_date_time(props.dataList[i].val)
}
</script>
  
<style lang="scss" scoped>
.date-tab {
    section {
        overflow: hidden;
        display: flex;
        overflow-x: auto;
        padding: 0 10px;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid var(--q-gb-bg-c-1);
        &::-webkit-scrollbar {
            display: none;
            /* Chrome Safari */
        }

        .time-list-item {
            display: flex;
            align-items: center;
            // flex: 1;
            width: 14.2857%;
            .item-text {
                height: 25px;
                line-height: 25px;
                margin: 0 auto;
                border-radius: 15px;
            }

            .time_active {
                background: var(--q-gb-bg-c-1);
                color: #fff;
                padding: 0 0.1rem;
            }
        }
    }
}</style>