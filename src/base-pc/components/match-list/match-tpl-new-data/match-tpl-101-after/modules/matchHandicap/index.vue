<template>
    <div>
        <div class="odds_td_box flex item-center">
            <div v-for="item in common_td_list" :key="item.hid">
                <div class="commoon-td-match-card" v-show="item.ol.length === 3">
                    <div  class="td-match-card din_font" v-for="option in item.ol"
                        :key="option.oid" @click="checked_current_td({ payload: card_info, hps: item, ol: option })">
                        <div class="odds_box" :class="{
                            'up': option.is_up_or_down === 1,
                            'down': option.is_up_or_down === 2,
                            'checked': option.oid == current_check_betId,
                        }">
                            <!-- <img class="vector" src="../../assets/images/vector.png" alt="" v-show="item.hs"> -->
                            <span v-show="!item.hs">{{ Math.floor(option.ov / 1000) / 100 }}</span>
                            <img v-show="option.is_up_or_down" class="odds_icon"
                                :src="option.is_up_or_down === 2 && option.id == current_check_betId ? high_light_src : option.icon"
                                alt="">
                        </div>
                    </div>
                </div>
                <div class="special-td-match-card"  v-show="item.ol.length === 2">
                    <div class="td-match-card special din_font" v-for="option in item.ol"
                        :key="option.oid" @click="checked_current_td({ payload: card_info, hps: item, ol: option })"
                        :class="{ 'checked': option.oid == current_check_betId }">
                        <!-- <img class="vector" src="../../assets/images/vector.png" alt="" v-show="item.hs"> -->
                        <div>{{ item.hv }}</div>
                        <div class="common">{{ Math.floor(option.ov / 1000) / 100 }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';
const current_check_betId = ref('')
const common_td_list = ref(
    [
    {
        "hid": "148524445659450149",
        "hs": 1,
        "hv": null,
        "hmt": 0,
        "hn": null,
        "ol": [
            {
                "oid": "140630308910815454",
                "os": 1,
                "otd": 225,
                "ot": "1",
                "ov": 1050000,
                "on": "",
                "onb": "",
                "cds": "S01",
                "ots": "T1"
            },
            {
                "oid": "140912104574020113",
                "os": 2,
                "otd": 226,
                "ot": "2",
                "ov": 100775,
                "on": "",
                "onb": "",
                "cds": "S01",
                "ots": "T2"
            }
        ],
        "hpid": "37"
    },
    {
        "hid": "140330302421145295",
        "hs": 1,
        "hv": "90.5",
        "hmt": 0,
        "hn": 1,
        "ol": [
            {
                "oid": "144671125430230561",
                "os": 1,
                "otd": 153,
                "ot": "Over",
                "ov": 206000,
                "onb": "O 90.5",
                "on": "over 90.5",
                "cds": "S01",
                "ots": "T1"
            },
            {
                "oid": "146022137325461103",
                "os": 1,
                "otd": 154,
                "ot": "Under",
                "ov": 174000,
                "onb": "U 90.5",
                "on": "under 90.5",
                "cds": "S01",
                "ots": "T2"
            }
        ],
        "hpid": "38"
    }
]
)

</script>

<style lang="scss">
.special-td-match-card {
    display: flex;
    align-items: center;
    width: v-bind('tr_width');
    flex-shrink: 0;
    justify-content: space-around;

    .special {
        display: flex;
        width: 78px;
        height: 48px;
        border-radius: 2px;
        justify-content: center;
        align-items: center;

        &:hover {
            background: rgba(255, 112, 0, 0.1);
        }

        div {
            color: var(--q-gb-t-c-8);
            margin-right: 5px;
        }

        .common {
            // color: #FF7000;
            color: var(--q-gb-t-c-2);
        }
    }

    .checked {
        // background: #FF7000;  
        background: var(--q-gb-bg-c-1);
        div {
            color: var(--q-gb-t-c-4);
        }

        &:hover {
            // background: #FF7000;
            background: var(--q-gb-bg-c-1);
            color: var(--q-gb-t-c-4);
        }

        .common {
            // background: #FF7000;
            background: var(--q-gb-bg-c-1);
            // color: #FFFFFF;
            color: var(--q-gb-t-c-1);
        }
    }
}

.commoon-td-match-card {
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    width: 133px;
    flex-shrink: 0;
    box-sizing: border-box;

    .td-match-card {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 5px;

        .odds_box {
            position: relative;
            width: 78px;
            height: 48px;
            border-radius: 2px;
            text-align: center;
            line-height: 48px;
            font-family: DIN;
            font-size: 14px;
            font-weight: 500;
            line-height: 48px;
            letter-spacing: 0px;
            // color: #FF7000;
            color: var(--q-gb-t-c-2);
            &:hover {
                background: rgba(255, 112, 0, 0.1);
            }

            .odds_icon {
                position: absolute;
                right: 15px;
                top: 50%;
                margin-top: -5px;
                width: 6px;
                height: 10px;
                display: block;
            }
        }

        .checked {
            // background: #FF7000;
            // color: #FFFFFF;
            background: var(--q-gb-bg-c-1);
            color: var(--q-gb-t-c-1) ;

            &:hover {
                // background: #FF7000;
                // color: #FFFFFF;
                background: var(--q-gb-bg-c-1);
                color: var(--q-gb-t-c-1) ;
            }
        }
    }
}
</style>