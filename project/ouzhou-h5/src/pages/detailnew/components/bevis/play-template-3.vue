<!--
hpid == 玩法ID =>
    7, 367, 341, 368, 342, 369
  - 全场波胆 (hpid：7)
  - 全场反波胆 (hpid：367)
  - 上半场-波胆(hpid：341)
  - 上半场-反波胆(hpid：368)
  - 下半场-波胆(hpid：342)
  - 下半场-反波胆(hpid：369)

hpt == 玩法展示模板 => 4

ms: 赛事状态 0未开赛 1 进行中
hs: 盘口状态 0 开盘 1 封盘, 2 关盘, 3 已结算, 4 已取消, 5 盘口的中间状态，该状态的盘口后续不会有赔率过来 11:锁盘状态
os: 1 开盘 ，2 封盘
-->

<!-- ms: 0开 1封 2关 11锁 -->
<!-- hs: 0开 1封 2关 11锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方-->
<!-- 按ol循环，不考虑按tittle循环-->


<script setup name="play-template-3">
import olStatus from "../ol_status.vue";
import {defineProps, computed, defineEmits} from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type} from "src/core/index.js"
import { odd_lock_ouzhou } from "src/base-h5/core/utils/local-image.js";
import _ from "lodash"

const props = defineProps({
    play: {
        type: Object,
        default: () => ({})
    },
    sport_id: {
        type: [String, Number],
        default: ''
    },
    active: {
        type: Number,
        default: () => 0,
    },
})
const AssembleData = computed(()=>{

})
setTimeout(function (){
    console.log('play-template-3',props.play)
},1200)
</script>


<template>
    <div></div>
    <div></div>
</template>

<style scoped lang="scss"></style>