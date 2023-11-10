<template>
    <div class="date-tab">
        <section>
            <div v-for="item in dateList" :key="item.val" class="time-list-item">
                <div @click="time_tab(item)" :class="[{ 'time_active': time_active == item.val }, 'item-text']">{{ item.name }}
                </div>
            </div>
        </section>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { dateWeekFormat } from "../utils.js";
const props = defineProps({
    reverse: {
        type: Boolean,
        default: false
    }
})
//时间列表
const dateList = dateWeekFormat(new Date(), props.reverse);
const time_active = ref(dateList[0].val);
/**
 * 时间选择
 * @param {*} item 
 */
const time_tab = (item) => {
    if(time_active.value === item.val)return;
    time_active.value = item.val;
}
onMounted(() => { });
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