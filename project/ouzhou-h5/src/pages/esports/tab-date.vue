<template>
    <div class="header">
        <!-- 七天时间 -->
        <div class="date_time">
            <q-virtual-scroll ref="scrollDateRef" :items="dateList" virtual-scroll-horizontal v-slot="{ item, index }">
                <div @click="changeDatetab(item, index)" class="week"
                    :class="defaultVal == item.val ? 'active' : ''">
                    <span>
                        <span>{{ item.name }}</span>
                    </span>
                    <span class="border_right"></span>
                </div>
            </q-virtual-scroll>
        </div>
    </div>
</template>
  
<script setup>
import {
    ref,
    defineEmits,
} from "vue";
const emit = defineEmits(["changeDate"]);
const scrollDateRef = ref(null);
const props = defineProps({
    dateList: {
      type: Array,
      default: [],
    },
    defaultVal:{
      type: String,
      default: "",
    },
})
/**
 * 时间点击
 * @param {*} item 
 * @param {*} index 
 */
const changeDatetab = (item, index) =>{
    emit("changeDate",item)
}
</script>
<style lang="scss" scoped>
.header {
    font-size: 16px;
    font-family: Roboto;
    // 七天时间tabs样式
    .date_time {
        height:55px;
        min-width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // padding-left: 2px;
        overflow-y: hidden;
        font-size: 14px;

        &::-webkit-scrollbar {
            display: none;
            /* Chrome Safari */
        }

        .week {
            padding-left: 16px;
            text-align: center;
            color: rgba(138, 137, 134, 1);
            font-weight: 400;
            height: 0.45rem;
            white-space: nowrap;
            display: flex;
            align-items: center;
            line-height: 15px;

            .din_font {
                font-family: DIN;
            }

            .border_right {
                margin-left: 16px;
                height: 12px;
                border-right: 1px solid rgba(217, 217, 217, 1);
            }
        }

        .week.active {
            font-weight: 500;
            color: rgba(26, 26, 26, 1);
            position: relative;
        }

        .week.active::after {
            display: block;
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: absolute;
            text-align: center;
            bottom: -4px;
            left: 43%;
            background: linear-gradient(rgba(255, 112, 0, 1), rgba(255, 112, 0, 0));
        }
    }

}
</style>