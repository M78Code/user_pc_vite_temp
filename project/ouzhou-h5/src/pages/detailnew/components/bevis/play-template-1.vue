<!--
hpid == 玩法ID
hpt == 玩法展示模板 => 1
    双重机会 (id: 6)
ms: 赛事状态 0未开赛 1 进行中
hs: 盘口状态 0 开盘 1 封盘, 2 关盘, 3 已结算, 4 已取消, 5 盘口的中间状态，该状态的盘口后续不会有赔率过来 11:锁盘状态
os: 投注项目状态 1 开盘 2 封盘 3隐藏不显示不占地方

按ol循环，不考虑按tittle循环

3-全场让球赛果  69-上半场让球赛果  71-下半场让球赛果
          220-球员得分 221-球员三分球 271-球员助攻 272-球员篮板
          171-独赢&总局数 13-独赢&进球大小 101-独赢&两队都进球  106-下半场独赢&下半场两队都进球 105-上半场独赢&上半场两队都进球 216-独赢&总分 102-进球大小&两队都进球
          107-双重机会&两队都进球
          339-拳击的独赢&准确回合数
-->


<script setup name="play-template-1">
import olStatus from "../ol_status.vue";
// import {defineProps, defineEmits, computed} from "vue"
import {computed} from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/output/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import ResultOlItem from "../../result/ResultOlItem.vue";
import lockImg from "../lock_img.vue";
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({})
    }
})
const useOtv = [ '3', '69', '71', '220', '221', '271', '272', '171', '13', '101', '106', '105', '216', '102', '107', '339' ]
const emits = defineEmits(['bet_click_'])
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
};

const AssembleData = computed(() => {
    let betInformation = {
        others: [],
        assemble: [],
        haveTitle: true
    }
    let ol_list = []
    const {hl = [], title} = props.item_data
    hl.forEach(hl_item => {
        ol_list.push(...hl_item.ol)
    })

    if (!!title) {
        betInformation.haveTitle = true
        let baseData = lodash.groupBy(ol_list.filter(i => i.os != 3), 'otd')
        title.forEach(title_item => {
            betInformation.assemble.push({
                osn: title_item.osn,
                otd: title_item.otd,
                information: baseData[title_item.otd]
            })
        })
    } else {
        betInformation.haveTitle = false
        betInformation.assemble = ol_list.filter(i => i.os != 3)
    }
    return betInformation
})
</script>

<template>
    <span v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</span>
    <section class="component play-template play-template-1 haveTitle" v-if="AssembleData?.haveTitle">
        <ul class="list textOverflow1" v-for="(item,index) of AssembleData.assemble" :key="index">
            <li class="list-title textOverflow1">{{ item.osn }}</li>
            <template v-for="_item of item.information" :key="_item.oid">
                <li :class="{ 'is-active': BetData.bet_oid_list.includes(_item?.oid ) }"
                    class="list-item onePxBorder"
                    @click="go_betting(_item)"
                >
                    <template v-if="_item.os == 1 && _item._hs != 1 ">
                        <span class="ov-text">
                            {{ compute_value_by_cur_odd_type(_item.ov, _item._hpid, _item._hsw, MatchDetailCalss.params.sportId) }}
                        </span>
                        <olStatus :item_ol_data="_item" :active="BetData.bet_oid_list.includes(_item?.oid )"/>
                    </template>
                    <lockImg :ol_item="_item" />
                    <ResultOlItem :value="_item" :hpt="1"></ResultOlItem>    
                </li>
            </template>
        </ul>
    </section>
    <section v-else class="component play-template play-template-1 noTitle">
        <ul class="list textOverflow1" v-for="(_item,index) of AssembleData.assemble" :key="index">
            <li :class="{ 'is-active': BetData.bet_oid_list.includes(_item?.oid ) }"
                class="list-item onePxBorder"
                @click="go_betting(_item)"
            >
                <template v-if="_item.os == 1 && compute_value_by_cur_odd_type(_item.ov, _item._hpid,_item._hsw, MatchDetailCalss.params.sportId) > 0">
                    <span class="on-text textOverflow1">
                        {{ useOtv.includes(_item._hpid) ? `${_item.otv}` : `${_item?.on}${_item?.ott}` }}
                    </span>
                    <span class="ov-text">
                        {{ compute_value_by_cur_odd_type(_item.ov, _item._hpid, _item._hsw, MatchDetailCalss.params.sportId) }}
                    </span>
                    <olStatus :item_ol_data="_item" :active="BetData.bet_oid_list.includes(_item?.oid )"/>
                </template>
                <template v-if="_item?.os == 2 || compute_value_by_cur_odd_type(_item.ov, _item._hpid, _item._hsw, MatchDetailCalss.params.sportId) == 0 || _item?._hs == 1 ">
                    <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
                </template>
                <ResultOlItem :value="_item" :hpt="1"></ResultOlItem>
            </li>
        </ul>
    </section>
</template>

<style scoped lang="scss">
@import "basicTemplateStyle";

.component.play-template-1 {
    --private-container-padding: 0px 4px;
}

.haveTitle{
    display: flex;
    .list {
        flex: 1;
        li{
            height: 48px;
        }
        &-title{
            text-align: center;
            line-height: 48px;
            background: var(--q-gb-bg-c-10);
        }
        &-item{
            display: flex;
            align-items: center;
            justify-content: center;
            /** 会引起ResultOlItem无法占满元素 */
            // padding: 0 4px;
            box-sizing: border-box;
            height: 48px;
        }
    }
}

.noTitle{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    .list-item{
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

}

.play-template-1 {
    overflow: hidden;
}

.lockBox {
    display: flex;
    align-items: center;
    border: 1px solid var(--q-gb-bd-c-10);
}

</style>