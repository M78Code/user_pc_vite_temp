<!-- ms: 0开 1封 2关 11锁 -->
<!-- hs: 0开 1封 2关 11锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方-->
<!-- 按ol循环，不考虑按tittle循环-->

<script setup>
import olStatus from "../ol_status.vue";
import {defineEmits, defineProps} from "vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import {compute_value_by_cur_odd_type, MatchDetailCalss} from "src/core/index.js"

const props = defineProps({
    play: {
        type: Object,
        default: () => {
        },
    },
    active: {
        type: Number,
        default: () => 0,
    },
    sport_id: {
        type: [String, Number],
        default: ''
    },
})

const emits = defineEmits(["bet_click_"])
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.play.hpn);
};
</script>


<template>
    <div v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</div>
    <div class="template0">
        <ul class="list">
            <template v-for="hl_item in play.hl" :key="hl_item.hid">
                <li v-for="ol_item in hl_item.ol.filter(i=>i.os != 3)" :key="ol_item?.oid" @click="go_betting(ol_item)"
                    :class="[{ 'is-active': BetData.bet_oid_list.includes(ol_item?.oid ) }, 'list-item']">
                    <template v-if="ol_item?.os == 1 && ol_item._hs != 11">
                        <span class="on-text textOverflow2">
                            {{ ol_item?.on || ol_item?.ott }}
                        </span>
                        <span class="ov-text">
                            {{ compute_value_by_cur_odd_type(ol_item.ov, '', '', sport_id) }}
                        </span>
                        <olStatus :item_ol_data="ol_item" :active="BetData.bet_oid_list.includes(ol_item?.oid )"/>
                    </template>
                    <span v-if="ol_item?.os == 2 || ol_item._hs == 11">
                        <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
                    </span>
                </li>
            </template>
        </ul>
    </div>

</template>

<style lang="scss" scoped>
.template0{
    display: grid;
    padding: 8px;
    box-sizing: border-box;
    overflow: hidden;
    .list{
        display: grid;
        grid-template-columns: repeat(3,1fr);
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

.is-active {
    background-color: var(--q-gb-bg-c-1) !important;
    color: var(--q-gb-t-c-2) !important;

    .ov-text {
        color: var(--q-gb-t-c-2) !important;
    }
}

.lock {
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
}

.textOverflow1{}
.textOverflow2{
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>

