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
import {defineProps, defineEmits, computed} from "vue"
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/core/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import ResultOlItem from "../../result/ResultOlItem.vue";
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({})
    }
})

const emits = defineEmits(['bet_click_'])
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
};

setTimeout(function (){
    console.log(props.item_data,"item-data")
},1200)
</script>

<template>
    <span v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</span>
<!--    <section class="template1" v-if="item_data?.hl">
        <ul class="title">
            <li class="title-item textOverflow1" v-for="titleChild of item_data?.title" :key="titleChild.otd">
                {{ titleChild?.osn }}
            </li>
        </ul>
        <ul class="list" v-for="hlChild of item_data?.hl" :key="hlChild.hid">
            <li class="bet" v-for="olChild of hlChild.ol" :key="olChild.oid" @click="go_betting(olChild)"
                :class="[{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]">

                <template v-if="olChild.result != (void 0)">
                    <div class="component play-template play-template-1">
                        <ResultOlItem :value="olChild" :hpt="1"></ResultOlItem>
                    </div>
                </template>

                <template v-else >
                    <template v-if="olChild.os == 1">
                        <span class="on-text textOverflow2">{{olChild.ott || olChild.on}}</span>
                        <span class="ov-text">{{ compute_value_by_cur_odd_type(olChild.ov, olChild._hpid, '', MatchDetailCalss.params.sportId) }}</span>
                        <olStatus :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )"/>
                    </template>
                    <template v-if="olChild.os == 2">
                        <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
                    </template>
                </template>
            </li>
        </ul>
    </section>-->

    <section class="component play-template play-template-1 template1" v-if="item_data?.hl">
        <template v-for="hlChild of item_data?.hl" :key="hlChild.hid">
            <template class="bet" v-for="olChild of hlChild.ol" :key="olChild.oid"
                      :class="[{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]">
                <template v-if="olChild.result != (void 0)">
                    <div>
                        <ResultOlItem :value="olChild" :hpt="1"></ResultOlItem>
                    </div>
                </template>
                <div class="list" v-else @click="go_betting(olChild)" v-if="olChild.os == 1"
                     :class="[{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]">
                    <p class="on-text list-item">{{olChild.ott || olChild.on}}</p>
                    <p class="ov-text list-item">{{ compute_value_by_cur_odd_type(olChild.ov, '', '', MatchDetailCalss.params.sportId) }}</p>
                    <olStatus style="position: absolute;right: 0" :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )"/>
                </div>
                <div v-if="olChild.os == 2" class="lockBox">
                    <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
                </div>
            </template>

        </template>
    </section>

</template>

<style scoped lang="scss">
@import "basicTemplateStyle";
.component.play-template-1{
    --private-container-padding: 8px 16px;
}
.template1{
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
    .list{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;
        box-sizing: border-box;
        height: 40px;
        position: relative;
    }
}
/*.template1{
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    overflow: hidden;

    .title{
        display: flex;
        background: var(--q-gb-bg-c-10);
        &-item{
            height: 48px;
            flex: 1;
            text-align: center;
            line-height: 48px;
        }
    }

    .list {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--private-container-padding);
        box-sizing: border-box;

        .bet{
            flex: 1;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;

        }
    }
}*/

.lockBox{
    display: flex;
    align-items: center;
    border: 1px solid var(--q-gb-bd-c-10);
}

</style>