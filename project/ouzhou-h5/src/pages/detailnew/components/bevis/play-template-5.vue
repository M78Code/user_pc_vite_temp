<!--
hpid == 玩法ID =>
    "2"
  - 全场大小 (hpid：2)

hpt == 玩法展示模板 => 5

ms: 赛事状态 0未开赛 1 进行中
hs: 盘口状态 0 开盘 1 封盘, 2 关盘, 3 已结算, 4 已取消, 5 盘口的中间状态，该状态的盘口后续不会有赔率过来 11:锁盘状态
os: 1 开盘 ，2 封盘
-->

<!-- ms: 0开 1封 2关 11锁 -->
<!-- hs: 0开 1封 2关 11锁 -->
<!-- os: 1开 2封 3隐藏不显示不占地方-->
<!-- 按ol循环，不考虑按tittle循环-->


<script setup name="template5">
import {defineProps, computed, defineEmits} from "vue"
import olStatus from "../ol_status.vue";
import BetData from "src/core/bet/class/bet-data-class.js";
import {compute_value_by_cur_odd_type} from "src/core/index.js"
import {odd_lock_ouzhou} from "src/base-h5/core/utils/local-image.js";
import _ from "lodash"

const props = defineProps({
    item_data: {
        type: Object,
        default: () => ({})
    },
    sport_id: {
        type: [String, Number],
        default: ''
    },
    active: {
        type: Number,
        default: () => 0,
    },
})
const AssembleData = computed(() => {
    let betInformation = {
        others: [],
        assemble: [],
    };
    const {hl = [], title} = props.item_data;
    const others = hl[0].ol.filter(ol_item => ol_item.ot == 'Other');
    const assemble = hl[0].ol.filter(ol_item => ol_item.ot != 'Other');
    if (others.length) {
        betInformation.others = lodash.uniqWith(others, 'oid')
    }
    const baseArr = _.groupBy(assemble.filter(i => i.os != 3), 'otd')

    title.forEach(item => {
        betInformation.push({
            osn: item.osn,
            otd: item.otd,
            information: baseArr[item.otd]
        })
    })

    return betInformation
})

/*
* 根据title把hl里面每一组的大小合并到title里面
* 所有数据 大小对应
* */
const matchInfo = computed(() => {
    const {title, hl} = props.item_data
    title.forEach(titleChild => {
        titleChild.information = new Array()
        hl.forEach(hlChild => {
            if (!!hlChild && (hlChild.ol || []).length) {
                titleChild.information.push(hlChild.ol.find(olChild => olChild.otd == titleChild.otd))
            }
        })
    })

    console.log(title, "template5--title")
    return title

    /*
    hl.forEach((item) => {
        if (item && item.ol.length > 0) {
            item.ol.forEach((i) => {
                if (!obj[i.on]) {
                    obj[i.on] = [];
                    obj[i.on] = [i];
                } else {
                    obj[i.on] = [...obj[i.on], i];
                }
            });
        }
    });
    return {
        title,
        information: obj
    };
    */
})

const emits = defineEmits(['bet_click_'])
const go_betting = (data) => {
    if (data.os == 2) return;
    emits("bet_click_", data, props.item_data.hpn);
}
</script>

<template>
    <section class="template5" v-if="item_data.title && item_data.title.length">
        <div class="list" v-for="item of matchInfo" :key="item.otd">
            <aside class="list-title">{{ item.osn }}</aside>
            <ul class="list-bet">
                <li :class="[{ 'is-active': item.oid == active },'list-bet--item']"
                    v-for="item of item.information" :key="item.oid" @click="go_betting(item)">
                    <span class="on">{{ item.on }}</span>
                    <span class="ov">{{ compute_value_by_cur_odd_type(item?.ov, '', '', sport_id) }}</span>
                    <olStatus style="position: absolute;right: 8%" :item_ol_data="item"
                              :active="BetData.bet_oid_list.includes(item?.oid)"/>
                </li>
            </ul>
        </div>
    </section>
    <section v-else></section>

</template>

<style scoped lang="scss">
.template5 {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;

    .list {
        display: flex;
        height: 48px;

        &-title {
            width: 120px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            background: var(--q-gb-bg-c-10);
            flex-shrink: 0;
        }

        &-bet {
            flex: 1;
            height: 48px;
            display: flex;
            overflow-x: scroll;

            &--item {
                min-width: 88px;
                max-width: 100%;
                height: 48px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: var(--q-gb-bg-c-2);
                border: 1px solid var(--q-gb-bd-c-10);

                span {
                    font: {
                        size: 13px;
                        family: DIN;
                        weight: 500;
                    }

                    &:nth-child(1) {
                        color: var(--q-gb-t-c-4);
                        overflow: hidden;
                    }

                    &:nth-last-child(2) {
                        font-size: 12px;
                    }
                }

                /*&:hover {
                    background: #fff1e6;
                }*/
            }

            .is-active {
                background-color: var(--q-gb-bg-c-1);
                color: var(--q-gb-t-c-2);

                span {

                    &:nth-child(1) {
                        color: var(--q-gb-t-c-4);
                        overflow: hidden;
                    }

                    &:nth-last-child(2) {
                        color: var(--q-gb-bd-c-2);
                    }
                }
            }
        }
    }

    .title {
        width: 120px;

        &-item {
            width: 100%;
            height: 48px;
            text-align: center;
            line-height: 48px;
            border: 1px solid var(--q-color-border-color-56);
        }
    }


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