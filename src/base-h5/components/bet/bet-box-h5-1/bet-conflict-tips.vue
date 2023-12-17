<!--
 * @Description: 投注栏位提示
-->

<template>
    <div>
        <!-- 提示信息 -->
        <!-- 求队球员冲突优先处理 -->
        <template v-if="is_conflict">
            <div class="yb_px14 row items-center yb_fontsize12 justify-center err-msg" style="min-height:0.3rem"
                @touchmove.prevent>
                <span class="text-center yb_py4">{{ i18n_t('bet.msg10') }}</span>
            </div>
        </template>
        <!-- 不支持串关提示 -->
        <template v-else-if="is_conflict2">
            <div class="err-msg3 yb_px14 text-center" @touchmove.prevent @click="reomve_invalid">
                <i class="close yb_mr4"></i>
                <!-- 移除无效投注 -->
                {{ i18n_t('bet.msg11') }}
            </div>
        </template>
        <!-- 失效和赔率变化 或者 正常状态 -->
        <template v-else>
            <div class="yb_px14 row items-center yb_fontsize12"
                :class="tips_msg ? 'justify-center err-msg' : 'justify-end err-msg2'"
                :style="{ 'min-height': [3, 6, 8].includes(+get_bet_status) ? '0.38rem' : '0.3rem' }" @touchmove.prevent
                @click="nothing">
                <template v-if="tips_msg"><span class="text-center yb_py4">{{ (tips_msg) }}</span></template>
                <template v-else-if="!tips_msg && [1, 2, 7].includes(+get_bet_status)">
                    <!-- 左 -->
                    <i class="img2" :class="{ 'img3': BetData.bet_is_accept != 2 }" @click="toggle_accept"></i>
                    <span :class="{ 'auto-text': BetData.bet_is_accept == 2, 'ac-rules': BetData.bet_list.length > 1 }" class="yb_mx4"
                        style="max-width:1.6rem" @click="toggle_accept">{{ i18n_t("ac_rules.auto") }}</span>
                        <i class="img1" @click="change_accept" :style="compute_css_obj('icon-issue')"></i>
                     <!-- 右 -->
                    <span v-if="BetData.bet_list.length == 1">
                        <i class="img2" :class="{ 'img3': get_used_money != 0 }" @click="change_used_money"></i>
                        <span class="yb_ml4" :class="get_used_money == 0 && 'auto-text'"
                            @click="change_used_money">{{ i18n_t('bet.used_money2') }}</span>
                    </span>
                    <span @click.stop="spread_options"
                        :class="{ 'opacity-m': BetData.bet_list.length == 2 || get_s_count_data.length == 1, 'col-5 text-right': BetData.bet_list.length > 1 }"
                        v-else>
                        {{ get_is_spread ? i18n_t('bet.msg04') : i18n_t('bet.msg05') }}
                        <i class="arrow" :class="{ 'arrow2': !get_is_spread }"></i>
                    </span>
                </template>
            </div>
        </template>
    </div>
</template>


<script setup>
import { ref, onMounted,watch,computed,onUnmounted } from 'vue';
import lodash from 'lodash'

import { UserCtr,compute_css_obj,useMittOn, useMittEmit, MITT_TYPES  } from "src/output/index.js";

const props = defineProps({
    is_show_conflict: {
        type: String,
        default: 'conflict',
    },
    conflict_tips: {
        type: String,
        default: '',
    }
})
/**
 *@description 点击移除无效注单
 */
const reomve_invalid = () =>{
    useMittEmit(MITT_TYPES.EMIT_REMOVE_INVALID_)
}

// 三星防误触
const nothing = () =>{

}

/**
 * 切换是否接受更好赔率
 */
 const toggle_accept = () => {
    BetData.set_is_accept()
}

/**
 *@description 自动接受跟好赔率规则展示
 */
 const change_accept = () => {
  set_accept_show(true);
}
/**
 * 切换是否使用常用金额
 */
 const change_used_money = () => {
  set_used_money(null)
}

</script>

<style scoped lang="scss">  


</style>