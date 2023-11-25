<!--
hpid == 玩法ID
hpt == 玩法展示模板 => 1
    双重机会 (id: 6)
ms: 赛事状态 0未开赛 1 进行中
hs: 盘口状态 0 开盘 1 封盘, 2 关盘, 3 已结算, 4 已取消, 5 盘口的中间状态，该状态的盘口后续不会有赔率过来 11:锁盘状态
os: 1 开盘 ，2 封盘
-->

<!-- ms: 0开 1封 2关 11锁 -->
<!-- hs: 0开 1封 2关 11锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方-->
<!-- 按ol循环，不考虑按tittle循环-->


<script setup name="template6">
import olStatus from "../ol_status.vue";
import {defineProps, defineEmits} from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type} from "src/core/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";

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

const emits = defineEmits(['bet_click_'])
const go_betting = (data) => {
    if(data.os == 2) return
    emits("bet_click_", data,props.play.hpn);
};
</script>

<template>
    <div v-for="olChild of play.hl[0].ol.filter(i=>i.os != 3)" :key="olChild.oid" @click="go_betting(olChild)"
         :class="['template1',{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]">
        <div class="left">{{ olChild.otv }}</div>
        <div class="right" v-if="olChild.os == 1">
            <p>{{ compute_value_by_cur_odd_type(olChild.ov, '', '', sport_id) }}</p>
            <olStatus :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )"/>
        </div>
        <div v-if="olChild.os == 2">
            <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.template1 {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    box-sizing: border-box;

    .left {
        word-wrap: break-word;
        color: #1A1A1A;
        font-size: 14px;
        font-family: Roboto;
        font-weight: 400;
    }

    .right {
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        word-wrap: break-word;
        position: relative;
        display: flex;
        align-items: center;
    }



    .red {
        color: #FF4646;
    }

    .green {
        color: #17A414;
    }
}

.is-active {
    background-color: var(--q-gb-bg-c-1) !important;
    color: var(--q-gb-t-c-2) !important;
}

.lock {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
}
</style>