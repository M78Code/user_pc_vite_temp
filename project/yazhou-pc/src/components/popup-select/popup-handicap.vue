<!--
 * @Description: 切换盘口组件
-->

<template>
    <div class="popup-wrap" :class="{ active: is_active }">
        <div class="text-wrap" @click="on_popup">
            <div class="popup-text" :class="{ active: is_active }">{{ $root.$t('odds')[vx_cur_odd] }}</div>
            <div class="yb-icon-arrow"></div>
        </div>
        <div class="relative-position">
            <div class="item-wrap">
                <div class="triangle"></div>
                <template v-for="(item, index) in odds_constant">
                    <div v-if="['EU', 'HK'].includes(item.value)" :key="index" class="item"
                        :class="vx_cur_odd == item.value && 'active'" @click="on_click_handicap(item)">{{ item.label }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch, defineComponent, getCurrentInstance, onUnmounted } from 'vue'
import odds_conversion_mixin from "src/core/odds_conversion/odds_conversion_mixin.js";
import { api_betting } from "src/api/index.js";
import store from "src/store-redux/index.js";

/** 获取mixins */
const { proxy } = getCurrentInstance()

/** 点击数 */
const hits = ref(0)
/** 盘口切换弹窗是否激活 */
const is_active = ref(false)

const vx_cur_odd = ref('')

/**
* @Description:显示切换盘口弹层
* @return {undefined} undefined
*/
function on_popup() {
    hits.value++;
    if (vx_get_is_single_handle.value || vx_get_is_handle.value) return; // 单关或者串关投注正在进行中，禁止切换
    // 冠军
    let is_winner = $menu.menu_data.match_tpl_number == 18
    let type_name = vx_cur_menu_type.value.type_name;
    // 串关 && 冠军 不能切换赔率 电竞冠军菜单
    if (["winner_top"].includes(type_name) ||
        (is_winner && type_name != 'virtual_sport') ||
        ($menu.menu_data.is_esports && !vx_is_bet_single.value) ||
        $menu.menu_data.is_esports_champion) {
        return;
    }
    is_active.value = !is_active.value
}

/**
 * @Description:切换盘口
 * @param {object} row 盘口数据
 * @return {undefined} undefined
 */
function on_click_handicap(row) {
    if (vx_cur_odd.value != row.value) {
        set_user_preference(row.value);
    }
}

function set_user_preference(curr_odd) {
    if (curr_odd) {
        let old_odd = vx_cur_odd.value
        let old_pre_odd = proxy.vx_get_pre_odd
        set_pre_odd(curr_odd);
        set_cur_odd(curr_odd);
        // 设置用户偏好    
        api_betting.record_user_preference({ userMarketPrefer: curr_odd }).then((res) => {
            let code = _.get(res, 'data.code');
            if (code != 200) {
                set_pre_odd(old_pre_odd);
                set_cur_odd(old_odd);
            }
        }).catch(err => {
            console.error(err);
            set_pre_odd(old_pre_odd);
            set_cur_odd(old_odd);
        });
    }
}

/** 获取当前菜单类型 */
const vx_cur_menu_type = ref({})
watch(
    () => vx_cur_menu_type.value.type_name,
    (new_, old_) => {
        // console.log(`=======type_name========new:${new_}=========old:${old_}`);
        if (new_ == 'winner_top') {
            let cur_odd = 'EU'
            if (get_cur_odd.value !== cur_odd) {
                set_cur_odd(cur_odd);
            }
        }
    }
)
/** 全局点击事件数 */
const global_click = ref(0)
watch(
    () => get_global_click.value,
    () => {
        if (hits.value % 2 == 1) {
            hits.value++;
            return;
        }
        is_active.value = false
    }
)
/** 当前赔率 */
const get_cur_odd = ref(0)
/** 单关 是否正在处理中 */
const vx_get_is_single_handle = ref(false)
/** 串关 是否正在处理中 */
const vx_get_is_handle = ref(false)
/** true: 单关投注 false: 串关投注 */
const vx_is_bet_single = ref(true)
/** stroe仓库 */
const unsubscribe = store.subscribe(() => {
    const new_state = store.getState()
    vx_cur_menu_type.value = new_state.cur_menu_type
    global_click.value = new_state.global_click
    get_cur_odd.value = new_state.cur_odd
    vx_get_is_single_handle.value = new_state.is_single_handle
    vx_get_is_handle.value = new_state.is_handle
    vx_is_bet_single.value = new_state.is_bet_single
})
onUnmounted(unsubscribe)

/** 设置当前赔率 */
const set_cur_odd = (data) => store.dispatch({
    type: 'set_cur_odd',
    data
})

/** 设置上次盘口偏好 */
const set_pre_odd = (data) => store.dispatch({
    type: 'set_pre_odd',
    data
})


</script>
<script>
export default defineComponent({
    name: 'popup-handicap',
    mixins: [odds_conversion_mixin],
})
</script>
<script>

import { mapGetters, mapActions } from "vuex";
export default {

    methods: {
        ...mapActions(["set_cur_odd", "set_pre_odd"]),
        
    },

};
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
  