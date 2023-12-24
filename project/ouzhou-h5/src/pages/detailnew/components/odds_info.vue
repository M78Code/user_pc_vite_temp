<!--
 * @Description:copy bevis_odds_info.vue 供赛果详情使用
-->
<template>
    <div class="component odds-info match-detail-odds ">
        <template v-if="match_odds_info && match_odds_info.length > 0">
            <template v-for="(item, index) in match_odds_info" :key="item.topKey">
                <div class="odds-wrap" v-if="!(item.hl.every(item=>item.hs == 2))">
                    <q-separator color="orange" v-if="index != 0"/>
                    <div class="odds-hpn" @click="expend_toggle(item)">
                        <span class="odds-hpn-text">{{ item.hpn }}</span>
                        <span class="odds-hpn-icon"
                              :class="topKey_active[item.topKey] || props.allCloseState?'up':'down'"></span>
                    </div>
                    <!-- {{ computedPlayComponent(item.hpt) }} -->
                    <div :class="[{ 'is-expend': topKey_active[item.topKey] || props.allCloseState }, 'odds-expend']">
                        <component :is="playComponent[computedPlayComponent(item.hpt)]"
                                   :item_data="item" @bet_click_="bet_click_" />
                    </div>
                </div>
            </template>

        </template>
        <template v-else>
            <div v-if="!loading">
                <img class="no-data" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/bet/no-data.png`" alt="">
                <div class="no-data-text">No Data</div>
            </div>
        </template>
    </div>
</template>

<script setup>
import {onMounted, ref, markRaw, watch, nextTick} from "vue";
import temp3 from "./template/tem3.vue";
import temp5 from "./template/tem5.vue";
import tem_other from "./template/tem_other.vue";

import {playTemplate0, playTemplate1, playTemplate2, playTemplate3, playTemplate4, playTemplate5} from "./bevis/index.js"

import {set_bet_obj_config} from "src/core/bet/class/bet-box-submit.js"
// import EMITTER from "src/global/mitt.js";
import {useMittEmit, MITT_TYPES} from "src/core/mitt"
import {LOCAL_PROJECT_FILE_PREFIX} from "src/output/index.js";
import {MatchDetailCalss} from "src/output/index.js"
import _ from "lodash"

// /** @type {{match_odds_info:Array<{hl:Array<TYPES.Hl>}}} */
const props = defineProps({
    match_odds_info: {
        type: Array,
        default: () => [],
    },
    match_detail: {
        type: Object,
        default: () => {
        },
    },
    loading: {
        type: Boolean,
        default: () => false,
    },
    /** 全部收起状态 */
    allCloseState: {
        type: Boolean,
        default: false
    }
});

/*setTimeout(function (){
    let baseData = []
    baseData = _.groupBy(props.match_odds_info,'hpt')
    console.log(baseData,"baseData")
    console.log(props.match_odds_info,"props.match_odds_info")
},2000)*/
const emit = defineEmits(["change", "update:allCloseState"]);
const active = ref(1);
/*
* 新组件使用hpid 玩法集ID
* 原来组件使用hpt 玩法展示模板
* 【0, 1, 5, 10】
* */
/*
* 新组件使用hpid 玩法集ID
* 原来组件使用hpt 玩法展示模板
* 【0, 1, 5, 10】
* */
const playComponent = ref({
    template0: markRaw(playTemplate0),
    template1: markRaw(playTemplate1),
    template2: markRaw(playTemplate2),
    template3: markRaw(playTemplate3),
    template4: markRaw(playTemplate4),
    template5: markRaw(temp5),
    template_other: markRaw(tem_other)
})
const hptArr = [0,1,2,3,5,4]
const computedPlayComponent = function (hpt) {
    let componentName = '';
    if (hptArr.includes(hpt)) {
        componentName = `template${hpt}`
    } else if(hpt == 10){
        componentName = 'template3'
    } else {
        componentName = 'template_other'
    }
    return componentName
}
// 事件执行函数
const topKey_active = ref({});

useWatchAllCloseState.watch = (val) => {
    if (!val) topKey_active.value = {}
}
let watchAllCloseStateHandle = useWatchAllCloseState()
/** 切换展开/收起 */
const expend_toggle = (item) => {
    if (props.allCloseState) {
        watchAllCloseStateHandle()
        emit('update:allCloseState', false)
        props.match_odds_info.forEach(v => topKey_active.value[v.topKey] = true)
        delete topKey_active.value[item.topKey]
        nextTick(() => watchAllCloseStateHandle = useWatchAllCloseState())
        return
    }
    if (topKey_active.value[item.topKey]) {
        delete topKey_active.value[item.topKey]
    } else {
        topKey_active.value[item.topKey] = true
    }
    if (Object.keys(topKey_active.value).length == props.match_odds_info.length) {
        emit('update:allCloseState', true)
    }
}

/** 监听一键展开/收起 */
function useWatchAllCloseState() {
    return watch(() => props.allCloseState, useWatchAllCloseState.watch)
}

const bet_click_ = (data, play_name) => {
    active.value = +data.oid;
    // storage_bet_info({
    //   payload: {
    //     ...data.payload,
    //     ...props.match_detail,
    //   },
    //   ol: {
    //     ...data.ol,
    //     hps: {
    //       ...data.payload
    //     },
    //     ...data.hl,
    //     ov: get_oddv(data.ol.ov / 100000)
    //   },
    // })
    // useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true)
    let params = {
        oid: data.oid, // 投注项id ol_obj
        _hid: data._hid, // hl_obj
        _hn: data._hn,  // hn_obj
        _mid: data._mid,  //赛事id mid_obj
    }
    console.log("odds_info.vue", data, params);
    let other = {
        is_detail: true,
        // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
        // 根据赛事纬度判断当前赛事属于 那种投注类型
        bet_type: 'common_bet',
        // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        device_type: 1,
        // 数据仓库类型
        match_data_type: "h5_detail", // h5_detail
        // match_data_type: "h5_list", // h5_detail
        play_name
    }
    set_bet_obj_config(params, other)
}
// 处理赔率截取两位小数点
const get_oddv = (num) => {
    const re = /([0-9]+\.[0-9]{2})[0-9]*/;
    return num.toString().replace(re, "$1");
}
/**
 *@description 监听到关闭投注框
 *@param {*}
 *@return {*}
 */
const clear_score_active = () => {
    active.value = 0;
}
onMounted(() => {
    // EMITTER.on("clear_score_active", () => {
    //   clear_score_active()
    // })
});
</script>

<style lang="scss" scoped>
.match-detail-odds {
    // background: #F1F1F1;
    min-height: 100%;
    // border-bottom: 40px solid #F1F1F1;
    .no-data {
        width: 140px;
        height: 140px;
        margin-left: 50%;
        transform: translate(-70px);
    }

    .no-data-text {
        text-align: center;
        color: #A1A3A5;
        font-size: 16px;
    }
}

.odds-wrap {
    background-color: var(--q-gb-bg-c-2);
    box-sizing: border-box;

    .odds-hpn {
        font-weight: 500;
        font-size: 14px;
        line-height: 45px;
        height: 45px;
        padding: 0 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .odds-hpn-text {
            width: 90%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--q-gb-t-c-4);
            font-weight: 800; //设计图的500无效
        }

        .odds-hpn-icon {
            width: 14px;
            height: 14px;
            background: url($SCSSPROJECTPATH+ "/image/detail/down.png") no-repeat center;
            transition: transform .5s cubic-bezier(0, 0.2, 0, 1);

            &.up {
                transform: scaleY(-1);
            }
        }
    }

    .is-expend {
        display: none;
    }

    .match-detail-odds-bottom {
        width: 100vw;
        height: 30px;
        background: red;
    }
}
</style>src/output