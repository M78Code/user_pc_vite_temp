<!-- 
    ms: 0开 1封 2关 11锁 
    hs: 0开 1封 2关 11锁
    os: 1开 2封 3隐藏不显示不占地方
    有title的情况按照title循环 
    没有title的情况按ol循环
-->

<script setup name="play-template-0">
import olStatus from "../ol_status.vue";
// import {computed, defineEmits, defineProps} from "vue";
import {computed} from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
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

const emits = defineEmits(["bet_click_"])
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
};
</script>


<template>
    <div v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</div>
    <section class="play-template-0" v-if="item_data?.hl">
        <ul v-for="hlChild of item_data.hl" :key="hlChild?.hid" class="list">
            <template v-for="olChild of hlChild?.ol" :key="olChild?.oid">
                    <li class="list-item onePxBorder"
                        @click="go_betting(olChild)"
                        :class="[{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]"
                    >
                        <span class="on-text textOverflow1">
                            {{ olChild?.on || olChild.ott }}
                        </span>
                        <span class="ov-text" v-if="olChild.os == 1 && compute_value_by_cur_odd_type(olChild.ov, olChild._hpid, olChild._hsw, MatchDetailCalss.params.sportId) > 0">
                            {{ compute_value_by_cur_odd_type(olChild.ov, olChild._hpid, '', MatchDetailCalss.params.sportId) }}
                        </span>
                        <lockImg :ol_item="olChild" />
                        <olStatus style="position: absolute;right: 2%;" :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )"/>
                    </li>
                <ResultOlItem class="list-item onePxBorder" :value="olChild" :hpt="0"></ResultOlItem>
            </template>
        </ul>
    </section>

</template>

<style lang="scss" scoped>
@import "basicTemplateStyle";
.play-template-0{
    padding: 0;
    .list{
        .list-item{
            width: 100%;

            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px;
            box-sizing: border-box;
            overflow: hidden;

            /*&:not(nth-last-child){
                border-bottom: 1px solid var(--q-gb-bd-c-10);
            }*/
        }
    }

}
.onePxBorder{
    background-color: var(--q-gb-bg-c-2);
    border: 1px solid var(--q-gb-bd-c-10);
}

.lockBox{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
}
</style>

src/output/index.js