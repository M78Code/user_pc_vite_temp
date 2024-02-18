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

<!-- ms: 0开 1封 2关 11锁 11整个都是锁 -->
<!-- hs: 0开 1封 2关 11锁盘   1和11挂锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方 2挂锁 -->
<!-- 按ol循环，不考虑按tittle循环-->


<script setup name="template4">
import olStatus from "../ol_status.vue";
// import {defineProps, computed, defineEmits, ref} from "vue"
import {computed, ref} from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/output/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import _ from "lodash"
import ResultOlItem from "../../result/ResultOlItem.vue";
import lockImg from "../lock_img.vue";
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({})
    }
})

/*
*
* hl 里面所有的ol都需要渲染
*
* */
const isLocked = ref(false)


const AssembleData = computed(() => {
    let betInformation = {
        others: [],
        assemble: [],
    }
    const {hl = [], title} = props.item_data;
    const baseData = lodash.groupBy(hl[0].ol.filter(ol_item => ol_item.os != 3),'otd')
    title.forEach(item => {
        betInformation.assemble.push({
            osn: item.osn,
            otd: item.otd,
            information: baseData[item.otd]
        })
    })
    if(!!baseData['-1']){
        betInformation.others = baseData['-1']
    }
    return betInformation
})

const emits = defineEmits(["bet_click_"]);
const go_betting = (data) => {
    // 为2的时候封盘挂锁
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
};
</script>

<template>
    <div v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</div>
    <section class="component play-template play-template-4 template4" v-if="!!AssembleData.assemble">
        <div class="assemble">
            <ul v-for="item of AssembleData.assemble" :key="item.otd" class="list">
                <li class="list-title textOverflow2">{{ item.osn }}</li>
                <li v-for="_item of item.information" :key="_item.oid" @click="go_betting(_item)"
                    :class="[{ 'is-active': BetData.bet_oid_list.includes(_item?.oid ) }]"
                    class="list-bet"
                >
                    <template v-if="_item?.os == 1 && _item._hs != 11 && _item._hs != 1">
                        <span class="on-text textOverflow2">{{ _item.on ?? _item.ott }}</span>
                        <span class="ov-text">{{compute_value_by_cur_odd_type(_item.ov, _item._hpid, _item._hsw, MatchDetailCalss.params.sportId) }}</span>
                        <olStatus style="position: absolute;right: 16px;" :item_ol_data="_item"
                                  :active="BetData.bet_oid_list.includes(_item?.oid )"/>
                    </template>
                    <lockImg :ol_item="_item" />
                    <ResultOlItem :value="_item" :hpt="4"></ResultOlItem>
                </li>
            </ul>
        </div>
        <div v-for="_item of AssembleData.others" :key="_item.oid" @click="go_betting(_item)"
             class="other"
             :class="{ 'is-active': BetData.bet_oid_list.includes(_item?.oid ) }">
            <template v-if="_item?.os == 1 && _item._hs != 11 && _item._hs != 1">
                <span class="on-text">{{ _item.on ?? _item.ott }}</span>
                <span class="ov-text">{{compute_value_by_cur_odd_type(_item.ov, _item._hpid, _item._hsw, MatchDetailCalss.params.sportId) }}</span>
                <olStatus :item_ol_data="_item" :active="BetData.bet_oid_list.includes(_item?.oid )"/>
            </template>
            <lockImg :ol_item="_item" />
            <ResultOlItem :value="_item" :hpt="4"></ResultOlItem>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "basicTemplateStyle";
.template4{
    padding: 8px 0;
    box-sizing: border-box;
}
.assemble {
    display: flex;


    .list {
        flex: 1;
        overflow: hidden;

        &-title {
            height: 48px;
            line-height: 48px;
            text-align: center;
            color: #8A8986;
            background: var(--q-gb-bg-c-10);
            font: {
                size: 14px;
                family: Roboto;
                weight: 500;
            }
            text-transform: capitalize;
            word-wrap: break-word

        }

        &-bet {
            height: 48px;
            // line-height: 48px;
            background-color: var(--q-gb-bg-c-2);
            border: 1px solid var(--q-gb-bd-c-10);
            font-weight: 500;
            gap: 6px;
            color: var(--q-gb-t-c-1);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            span {
                font: {
                    size: 12px;
                    family: DIN;
                    weight: 500;
                }
            }
        }
    }


}

.other {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--q-gb-bg-c-2);
    border: 1px solid var(--q-gb-bd-c-10);
    gap: 8px;

    span {
        text-align: center;
        font: {
            size: 12px;
            family: DIN;
            weight: 500;
        }
    }
    .on-text {
        color: var(--q-gb-t-c-4);
    }

    .ov-text {
        color: var(--q-gb-t-c-1);
    }
}
</style>