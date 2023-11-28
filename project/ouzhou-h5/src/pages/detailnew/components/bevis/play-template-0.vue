<!-- 
    ms: 0开 1封 2关 11锁 
    hs: 0开 1封 2关 11锁
    os: 1开 2封 3隐藏不显示不占地方
    有title的情况按照title循环 
    没有title的情况按ol循环
-->

<script setup>
import olStatus from "../ol_status.vue";
import {defineEmits, defineProps} from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/core/index.js"
import ResultOlItem from "../../result/ResultOlItem.vue";

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
    <div class="component play-template play-template-0 template0">
        <ul class="list">
            <template v-for="hlChild in item_data.hl" :key="hlChild.hid">
                <li v-for="olChild in hlChild.ol.filter(i=>i.os != 3)" :key="olChild?.oid" @click="go_betting(olChild)"
                    :class="[{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]"
                    class="list-item"
                >
                    <template v-if="olChild?.os == 1 && olChild._hs != 11">
                        <span class="on-text textOverflow2">
                            {{ olChild?.on || olChild?.ott }}
                        </span>
                        <span class="ov-text">
                            {{ compute_value_by_cur_odd_type(olChild.ov, olChild._hpid, '', MatchDetailCalss.params.sportId) }}
                        </span>
                        <olStatus :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )"/>
                    </template>
                    <span v-if="olChild?.os == 2 || olChild._hs == 11">
                        <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
                    </span>
                    <ResultOlItem :value="olChild" :hpt="0"></ResultOlItem>
                </li>
            </template>
        </ul>
    </div>

</template>

<style lang="scss" scoped>
@import "basicTemplateStyle";
.template0{
    display: grid;
    padding: 8px 0;
    box-sizing: border-box;
    overflow: hidden;
    .list{
        display: grid;
        grid-template-columns: repeat(4,1fr);
        .list-item{
            width: 100%;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--q-gb-bg-c-2);
            border: 1px solid var(--q-gb-bd-c-10);
            gap: 4px;
            padding: 0 2px;
            box-sizing: border-box;
            overflow: hidden;
            .on-text{
                color: var(--q-gb-t-c-4);
                text-align: center;
                //line-height: 1;
            }
            .ov-text{
                color: var(--q-gb-t-c-1);
                text-align: center;
            }
        }
    }

}
</style>

