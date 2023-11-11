<template>
    <div class="date-tab">
        <section>{{currentSlideValue}}
            <div v-for="item in dateList" :key="item.val" class="time-list-item">
                <div @click="time_tab(item)" :class="[{ 'time_active': defaultVal == item.val }, 'item-text']">{{ item.name }}
                </div>
            </div>
        </section>
    </div>
</template>
  
<script setup>
import { dateWeekFormat } from "../utils.js";
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
const time_tab = (item) => {
    // if(time_active.value === item.val)return;
    // time_active.value = item.val;
    emits('changeDate',item)
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

        //   border-bottom: 1px solid #ff7000;
        &::-webkit-scrollbar {
            display: none;
            /* Chrome Safari */
        }

        .time-list-item {
            display: flex;
            align-items: center;
            flex: 1;
            .item-text {
                height: 25px;
                line-height: 25px;
                margin: 0 auto;
                border-radius: 15px;
            }

            .time_active {
                background: #ff7000;
                color: #fff;
                padding: 0 0.1rem;
            }
        }
    }
}</style>