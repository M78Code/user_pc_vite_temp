<!--
净胜分
ms: 赛事状态 0未开赛 1 进行中
hs: 盘口状态 0 开盘 1 封盘, 2 关盘, 3 已结算, 4 已取消, 5 盘口的中间状态，该状态的盘口后续不会有赔率过来 11:锁盘状态
os: 1 开盘 ，2 封盘
-->

<!-- ms: 0开 1封 2关 11锁 -->
<!-- hs: 0开 1封 2关 11锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方-->
<!-- 按ol循环，不考虑按tittle循环-->


<script setup name="template5">
// import {defineProps, computed, defineEmits} from "vue"
import {computed} from "vue"
import olStatus from "../ol_status.vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/output/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import lockImg from "../lock_img.vue";
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({})
    }
})

let betInformation = {
    others: [],
    assemble: [],
};
let baseData = []

const useOtv = [ '3', '69', '71', '220', '221', '271', '272', '171', '13', '101', '106', '105', '216', '102', '107', '339' ]

const AssembleData = computed(() => {
    betInformation = {
        others: [],
        assemble: [],
    }
    baseData = []
    let ol_list = []
    const {hl = [], title} = props.item_data;

    hl.forEach(item => {
        ol_list.push(...item.ol)
    })


    baseData = lodash.groupBy(ol_list.filter(i => i.os != 3), 'otd')

    title.forEach(item => {
        betInformation.assemble.push({
            osn: item.osn,
            otd: item.otd,
            information: baseData[item.otd]
        })
    })
    betInformation.others = baseData['0']
    return betInformation
})

/*
* 根据title把hl里面每一组的大小合并到title里面
* 所有数据 大小对应
* */

const emits = defineEmits(['bet_click_'])
const go_betting = (data) => {
    if (data.os == 2) return;
    emits("bet_click_", data, props.item_data.hpn);
}

</script>

<template>
    <span v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</span>
    <section class="template5">
        <div class="assemble">
            <ul class="list" v-for="assembleChild of AssembleData.assemble" :key="assembleChild?.otd">
                <li class="title">{{ assembleChild?.osn }}</li>
                <template v-for="info of assembleChild?.information" :key="info?.oid">
                    <template v-if="info.os == 1 && info._hs != 1">
                        <li class="bet" @click="go_betting(info)"
                            :class="{ 'is-active': BetData.bet_oid_list.includes(info?.oid ) }">
                            <span>{{ useOtv.includes(info._hpid) ? `${info.otv}` : `${info?.on}  ${info?.ott}` }}</span>
                            <span class="ov-text">{{ compute_value_by_cur_odd_type(info.ov, info._hpid, info._hsw, MatchDetailCalss.params.sportId) }}</span>
                        </li>
                    </template>
                    <figure v-if="info?.os == 2 || info._hs == 11">
                       <lockImg :ol_item="info" />
                    </figure>
                </template>
            </ul>
        </div>
        <ul class="others" v-if="!!AssembleData.others">
            <template v-for="otherChild of AssembleData.others" >
                <li v-if="otherChild.os == 1" class="bet" @click="go_betting(otherChild)"
                    :class="{ 'is-active': BetData.bet_oid_list.includes(otherChild?.oid ) }">
                    <span class="on-text">{{ useOtv.includes(otherChild._hpid) ? `${otherChild.otv}` : `${otherChild?.on}  ${otherChild?.ott}` }}</span>
                    <span class="ov-text">{{ compute_value_by_cur_odd_type(otherChild.ov, otherChild._hpid, otherChild._hsw, MatchDetailCalss.params.sportId) }}</span>
                </li>
                <figure class="bet" v-if="otherChild?.os == 2">
                   <lockImg :ol_item="otherChild" />
                </figure>
            </template>
        </ul>
    </section>

</template>

<style scoped lang="scss">
@import "basicTemplateStyle";

.template5 {
    width: 100%;
    padding: 8px 0;
    box-sizing: border-box;

    .assemble {
        display: flex;

        .list {
            flex: 1;

            .title {
                height: 40px;
                text-align: center;
                line-height: 40px;
                background: var(--q-gb-bg-c-10);
            }

        }
    }
}

.bet {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-2);
    border: 1px solid var(--q-gb-bd-c-10);
    position: relative;
}


.lock {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
}

.on {
    color: var(--q-gb-t-c-4);
}

.ov {
    color: var(--q-gb-t-c-1);
}
</style>