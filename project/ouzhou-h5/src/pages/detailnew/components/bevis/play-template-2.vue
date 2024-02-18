<script setup name="play-template-2">
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
const emits = defineEmits(['bet_click_'])
const go_betting = (data) => {
    if (data.os == 2) return
    emits("bet_click_", data, props.item_data.hpn);
};
</script>
<!-- _hs == 1 要锁盘啊-->
<template>
    <div v-show="false">{{ BetData.bet_data_class_version }}{{ MatchDetailCalss.details_data_version.version }}</div>
    <section class="component play-template play-template-2 template2">
        <nav class="title" v-if="item_data?.title">
            <div class="text-title textOverflow1">{{ item_data.title[0].osn }}</div>
            <div class="text-title textOverflow1">{{ item_data.title[1].osn }}</div>
        </nav>
        <ul class="bet" v-for="(hlChild,hlIndex) of item_data.hl" :key="hlIndex">
            <template v-if="!!hlChild">
                <template v-for="olChild of hlChild.ol.filter(i=>i.os != 3)" :key="olChild.oid">
                    <li class="bet-item" :class="[{ 'is-active': BetData.bet_oid_list.includes(olChild?.oid ) }]">
                        <template v-if="olChild.os == 1 && olChild?._hs  != 1 ">
                            <span class="on-text textOverflow1" @click="go_betting(olChild)">
                                {{ olChild.on }}
                            </span>
                                <span class="ov-text" @click="go_betting(olChild)">
                                {{ compute_value_by_cur_odd_type(olChild.ov, olChild._hpid, olChild._hsw, MatchDetailCalss.params.sportId) }}
                            </span>
                            <olStatus :item_ol_data="olChild" :active="BetData.bet_oid_list.includes(olChild?.oid )" @click="go_betting(olChild)"/>
                        </template>
                        <!-- <template v-if="olChild.os == 2 || olChild._hs == 1">
                            <img class="lock" :src="odd_lock_ouzhou" alt="lock"/>
                        </template> -->
                        <lockImg :ol_item="olChild"  @click="go_betting(olChild)"/>
                        <ResultOlItem :value="olChild" :hpt="2" @click="go_betting(olChild)"></ResultOlItem>
                </li>
                </template>
            </template>
        </ul>
    </section>
</template>

<style scoped lang="scss">
@import "basicTemplateStyle";
.template2 {
    width: 100%;
    padding: 8px 0;
    box-sizing: border-box;
    .title{
        display: flex;
        height: 40px;
        .text-title{
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: var(--q-gb-bg-c-10);
            color: var(--q-gb-t-c-4);
            font: {
                size: 12px;
            }
        }
    }

    .bet {
        height: 48px;
        display: flex;

        &-item {
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid var(--q-gb-bd-c-10);
        }
    }
}
</style>