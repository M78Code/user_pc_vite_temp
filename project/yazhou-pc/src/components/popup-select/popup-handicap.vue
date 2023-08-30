<!--
 * @Description: 切换盘口组件
-->

<template>
    <div class="popup-wrap" :class="{ active: is_active }">
        <div class="text-wrap" @click="on_popup">
            <div class="popup-text" :class="{ active: is_active }">{{ i18n_t(`odds.${cur_odd}`) }}</div>
            <div class="yb-icon-arrow"></div>
        </div>
        <div class="relative-position">
            <div class="item-wrap">
                <div class="triangle"></div>
                <template v-for="(item, index) in odds_constant">
                    <div v-if="['EU', 'HK'].includes(item.value)" :key="index" class="item"
                        :class="cur_odd == item.value && 'active'" @click="on_click_handicap(item)">{{ item.label }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue'
import lodash from 'lodash'
// import odds_conversion_mixin from "src/core/odds_conversion/odds_conversion_mixin.js";
import { api_betting } from "src/api/index.js";
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "src/core/bet/class/bet-data-class.js";

const odds_constant = [
    { label: i18n_t('odds.EU'), value: "EU", icon: 'panda-icon-contryEU', id: 1 },//欧洲盘
    { label: i18n_t('odds.ID'), value: "ID", icon: 'panda-icon-contryYN', id: 6 },//印尼盘
    { label: i18n_t('odds.US'), value: "US", icon: 'panda-icon-contryUS', id: 5 },//美式盘
    { label: i18n_t('odds.MY'), value: "MY", icon: 'panda-icon-contryML', id: 3 },//马来盘
    { label: i18n_t('odds.GB'), value: "GB", icon: 'panda-icon-contryUK', id: 4 },//英式盘
    { label: i18n_t('odds.HK'), value: "HK", icon: 'panda-icon-contryHK', id: 2 },//香港盘
]

/** 点击数 */
const hits = ref(0)
/** 盘口切换弹窗是否激活 */
const is_active = ref(false)

/** 当前赔率 */
const cur_odd = ref(UserCtr.odds.cur_odd || 'EU')
/** 获取上次选择的盘口类型(盘口切换时使用) */
const pre_odd = ref(UserCtr.odds.pre_odds || 'EU')
/** 单关 是否正在处理中 */
const is_single_handle = ref(false)
/** 是否正在处理投注 */
const is_handle = ref(false)
/** true: 单关投注 false: 串关投注 */
const is_bet_singl = ref(false)

/**
* @Description:显示切换盘口弹层
* @return {undefined} undefined
*/
function on_popup() {
    hits.value++;
    if (is_single_handle.value || is_handle.value) return; // 单关或者串关投注正在进行中，禁止切换
    // 冠军
    // let is_winner = $menu.menu_data.match_tpl_number == 18
    let type_name = cur_menu_type.type_name;
    // 串关 && 冠军 不能切换赔率 电竞冠军菜单
    // if (["winner_top"].includes(type_name) ||
    //     (is_winner && type_name != 'virtual_sport') ||
    //     ($menu.menu_data.is_esports && !is_bet_singl.value) ||
    //     $menu.menu_data.is_esports_champion) {
    //     return;
    // }
    is_active.value = !is_active.value
}

/**
 * @Description:切换盘口
 * @param {object} row 盘口数据
 * @return {undefined} undefined
 */
function on_click_handicap(row) {
    if (cur_odd.value != row.value) {
        set_user_preference(row.value);
    }
}

function set_user_preference(curr_odd) {
    if (curr_odd) {
        set_pre_odd(curr_odd);
        BetData.set_cur_odd(curr_odd);
        // 设置用户偏好    
        api_betting.record_user_preference({ userMarketPrefer: curr_odd }).then((res) => {
            let code = lodash.get(res, 'data.code');
            if (code != 200) {
                set_pre_odd(pre_odd.value);
                BetData.set_cur_odd(cur_odd.value);
            }
        }).catch(err => {
            console.error(err);
            set_pre_odd(pre_odd.value);
            BetData.set_cur_odd(cur_odd.value);
        });
    }
}

/** 获取当前菜单类型 */
let cur_menu_type = reactive({
    type_name: ''
})
watch(
    () => cur_menu_type.type_name,
    (new_, old_) => {
        // console.log(`=======type_name========new:${new_}=========old:${old_}`);
        if (new_ == 'winner_top') {
            if (cur_odd.value !== 'EU') {
                BetData.set_cur_odd(cur_odd);
            }
        }
    }
)

</script>

  
<style lang="scss" scoped>
.item-wrap {
    border-radius: 4px;
    padding: 5px 0;
    display: none;
    width: 96px;
    left: -30px;

    .triangle {
        left: 46px;
    }

    .item {
        width: 96px;
        height: 26px;
        line-height: 26px;
        cursor: pointer;
        padding: 0 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.popup-wrap.active .item-wrap {
    display: block;
}
</style>
  