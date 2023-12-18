<!--
    ms: 0开 1封 2关 11锁
    hs: 0开 1封 2关 11锁
    os: 1开 2封 3隐藏不显示不占地方 按ol循环，不考虑按tittle循环

    平局退款
-->

<script setup name="play-template-3">
import BetData from "src/core/bet/class/bet-data-class.js";
// import {computed, defineProps} from "vue";
import {computed} from "vue";
import olStatus from "../ol_status.vue";
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/output/index.js"
import ResultOlItem from "../../result/ResultOlItem.vue";
import lockImg from "../lock_img.vue";
const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({}),
    }
})
const emits = defineEmits(["bet_click_"]);
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
}
setTimeout(function (){
    if(props.item_data?.title){
        // console.log(props.item_data,"props.item_data==有title")
    }else {
        // console.log(props.item_data,"props.item_data==没有title")
    }
},1200)
</script>
<template>
    <span v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</span>
    <section class="component play-template play-template-3 template3" v-if="item_data?.hl[0]?.ol">
<!--        <template v-if="item_data?.title"></template>-->
<!--        <template v-else></template>-->
        <ul class="list">
            <template v-for="olChild of item_data.hl[0].ol" :key="olChild?.oid">
                <template v-if="olChild.result != (void 0)">
                    <ResultOlItem class="list-item result-ol-item" :value="olChild" :hpt="3"></ResultOlItem>
                </template>
                <template v-else>
                    <li v-if="olChild.os == 1 &&  olChild?._hs != 1" class="list-item" @click="go_betting(olChild)"
                        :class="{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }"
                    >
                        <span class="on-text textOverflow2">{{ olChild?.on || olChild?.ott }}</span>
                        <span class="ov-text">{{ compute_value_by_cur_odd_type(olChild.ov, olChild._hpid, olChild._hsw, MatchDetailCalss.params.sportId) }}</span>
                        <olStatus :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )"/>
                    </li>
                    <li v-else class="list-item">
                        <lockImg :ol_item="olChild" />
                    </li>
                </template>
            </template>
        </ul>
    </section>
</template>

<style lang="scss" scoped>
@import "basicTemplateStyle";
.template3{
    overflow: hidden;
    padding: 8px 0;
    box-sizing: border-box;
    .list{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2,1fr);
        &-item{
            flex: 1;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--q-gb-bg-c-2);
            border: 1px solid var(--q-gb-bd-c-10);
        }
        .result-ol-item{
            height: 48px;
        }
    }
}
</style>