<!--
 * @Author: Router
 * @Description: 普通赛事的投注弹框
-->
<template>
  <div class="bet-mix-box-child2">
    <!-- 多注顶部蒙层 -->
    <div v-if="false" class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fixed full-shadow2" @touchmove.prevent></div>

    <div style="display: none;">{{ BetData.bet_data_class_version }} {{BetViewDataClass.bet_view_version}}</div>

    <div class="content-box">

      <!-- 头部 -->
      <bet-bar @click="pack_up"></bet-bar>

      <!-- 中间可滚动区域 -->
      <div class="scroll-box scroll-box-center" ref="scroll_box" :style="{ 'max-height': `${max_height1}px` }"
        @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
          <bet-mix-box-child3 :item="BetData.bet_single_list[0]" :key='index'></bet-mix-box-child3>
      </div>

      <!-- 投注前 -->
      <div v-if="BetViewDataClass.bet_order_status == 1">
        <!-- 单关金额输入框 v-bind="$attrs"-->
        <!-- 输入框 与键盘 -->
        <bet-single-detail :item="BetData.bet_single_list[0]" :index="0"/>

        <!-- 键盘 -->
        <key-board v-show="BetViewDataClass.bet_keyboard_show" :item="BetData.bet_single_list[0]" :index="0"></key-board>
     
        <div class="dele-wrap yb_px12 yb_py10 row"  @touchmove.prevent>
          <!-- 右 自动接受跟好赔率 -->
          <span>
            <i class="img2" :class="{ 'img3': BetData.bet_is_accept }" @click="toggle_accept"></i>
            <span :class="{ 'auto-text': BetData.bet_is_accept }" class="yb_mx4 err-msg2" style="max-width:2.1rem"
              @click="toggle_accept">{{ $t("ac_rules.auto") }}</span>
            <!-- <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_accept" class="img1" -->
            <span class="img1" :style="compute_css_obj('icon-issue')"></span>
          </span>

          <!-- 接受更好赔率的规则弹窗 -->
          <acceptRules v-if="BetData.better_rules_show"></acceptRules>
        </div>
      </div>

      <!-- 点击投注后 -->
      <div class="scroll-box" ref="scroll_box" v-if="BetViewDataClass.bet_order_status != 1">
        <bet-mix-box-child4></bet-mix-box-child4>
      </div>
      <div class="yb_px12" v-if="get_mix_bet_flag">
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8 yb_fontsize14 fw_600 bet-mix-show">
          <div>{{ $t('bet.total_income') }}</div>
          <div>{{ $t('bet.total_bet') }} <span v-if="bet_num > 0">{{ bet_num }}</span></div>
        </div>
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8">
          <div class="yellow-color yb_fontsize16">{{ (award_total) }}</div>
          <div class="yb_fontsize16 bet-mix-show">{{ BetData.bet_money_total.toFixed(2) }}</div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="row yb_px10 yb_pb8 justify-between" @touchmove.prevent>

        <!-- 左边， 3种情况-->
        <!-- 保留选项 -->
        <div class="add-box add-box2" :class="{ 'add-box2': BetData.is_bet_success_status, 'add-box3': calc_class }"
          @click.stop="pack_up(4)" v-if="BetData.is_bet_success_status">{{ $t('bet.save') }}</div>
        <!-- 单关 -->
        <div v-else-if="true" class="bet-add-box text-bold display_center one_text_color"
          :class="{ 'add-box3': calc_class }" @click.stop="pack_up(5)">
          <div class="bet-add-new bet_margin_left"></div>
          <div class="bet_text_left bet-one">{{ $t('bet.kushikatsu') }}</div>
        </div>
        <!-- 串关+ -->
        <div v-else-if="!hide_bet_series_but()" class="bet-add-box text-bold display_center linkUp_text_color"
          :class="{ 'add-box3': calc_class }" @click.stop="pack_up(6)">
          <div class="bet_text_right">{{ $t('bet.kushikatsu') }}</div>
          <div class="bet-add-new bet-linkUp"></div>
        </div>

        <!-- 右边 -->
        <div class="bet-box">
          <template v-if="exist_code == '666'">
            <p @click="go_record" class="yb_fontsize16">{{ $t('bet.msg13') }}</p>
          </template>
          <template v-else-if="is_conflict">
            <!-- 投注 -->
            <div class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{ $t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ format_money2(BetData.bet_money_total.toFixed(2)) }}</p>
            </div>
          </template>
          <template v-else>
            <!-- 投注 -->
            <div v-if="btn_show == 0" @click="submit_order" :class="{ 'set-opacity': true }"
              class="row justify-center items-center content-center">
              <p class="yb_fontsize12 yb_mr10">{{ $t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ bet_amount }}</p>
            </div>
            <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
            <div v-if="btn_show == 5" class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{ $t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ format_money2(500) }}</p>
            </div>
            <!-- 确定 -->
            <p v-if="btn_show == 1" @click="pack_up" class="yb_fontsize16">{{ $t('common.ok') }}</p>
            <!-- 处理中 -->
            <div v-if="btn_show == 2" class="yb_fontsize16 row justify-center items-center">
              <p class="yb_mr8">{{ $t('bet_record.submitting_bet') }}</p>
              <ball-spin />
            </div>
            <!-- 接受变化 -->
            <p v-if="btn_show == 3" @click="agree_change" class="yb_fontsize16">{{ $t('bet.agree_change') }}</p>
            <!-- 接受变化并投注 -->
            <p v-if="btn_show == 4" @click="submit_order" class="yb_fontsize16">{{ $t('bet.agree_change2') }}</p>
          </template>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import betMixBoxChild3 from './bet_mix_box_child3.vue';
import betMixBoxChild4 from './bet_mix_box_child4.vue';

// import betMixShow from './/bet_mix_show.vue';
import betMixShow from './bet_mix_show3.vue';
// import betMixShow2 from './/bet_mix_show2.vue';
// import betMixDetail from './/bet-mix-detail.vue';
// import betMixSingleDetail from './/bet-mix-single-detail.vue';
// import betSuccessBar from './/bet-success-bar.vue';
// import betting from 'src/mixins/betting/betting.js';
import keyBoard from './/bet-keyboard.vue';
import ballSpin from './/ball-spin.vue';
import betBar from ".//bet-bar.vue";
import betSingleDetail from './bet-single-detail.vue';

// import {utils } from 'src/core/index.js';
// import { api_betting } from "src/api/index.js";
// import {useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { UserCtr,compute_css_obj,useMittOn, useMittEmit, MITT_TYPES  } from "src/core/index.js";
// import { hide_bet_series_but } from "src/core/bet/index.js"
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { get_query_bet_amount_common } from "src/core/bet/class/bet-box-submit.js"
import lodash from 'lodash'
import { format_money3, format_money2 } from 'src/core/format/index.js'
import { submit_handle } from "src/core/bet/class/bet-box-submit.js"
import acceptRules from ".//accept-rules.vue"

const scroll_box = ref()
const series_order_respList = ref([])
const award_total = ref()
const bet_list_data = ref([])
const tips_msg = ref('失效')  // 提示信息

let bet_show_single = ref(true)  // 单关显示
const get_bet_status = ref(0) // 投注状态
const btn_show = ref(0) // 投注状态2
const max_height1 = ref(150) // 投注赛事高度
const get_mix_bet_flag = ref(false) // 最小投注开关
const exist_code = ref(555)
const bet_amount = ref(0)

const hide_bet_series_but = () => {
  let res = false;
  // 单关时,获取投注列表数据
  if (!BetData.bet_is_mix && lodash.get(BetData, 'bet_list.length')) {
    // 遍历投注列表数据,检测是否红猫赛事
    for (let i = 0; i < BetData.bet_list.length; i++) {
      // 获取投注项id
      let id = lodash.get(BetData, `bet_list[${i}]`);
      // 获取投注项的数据源
      let cds = lodash.get(BetData, `bet_obj[${id}].bs.cds`);
      if (cds == "C01") {
        // C301赛事时,隐藏串关按钮
        res = true;
        break;
      }
    }
  }
  return res;
}

// 投注成功，最高可赢 滚动条需下拉到底
const update_scroll_top = () => {
  if (scroll_box.value) {
    scrollTop.value = scrollTop.value.scrollHeight
  }
}

const max_win_money_emit = (val) => {
  award_total.value = val
}


/**
    * 串关时检查是否有C01赛事
    */
const is_bet_check_rc = () => {
  let res = false;
  if (this.get_is_mix && this.get_bet_list.length > 1) {
    // 串关时
    for (let i = 0; i < this.get_bet_list.length; i++) {
      // 检测是否C01赛事
      if (_.get(this.get_bet_obj, `[${this.get_bet_list[i]}].cs.cds`) == "C01") {
        res = true;
        break;
      }
    }
  }
  return res;
}

// 投注事件
const pack_up = (val) => {
  // TODO: 临时调试用
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
}

const submit_order = (type) => {
  submit_handle()
}

//切换是否接受更好赔率
const toggle_accept = () => {
  BetData.set_bet_is_accept()
}

//更好赔率规则
const change_accept = () => {
  BetData.set_accept_show(true)
}

//是否有重复的球员id或者球队id，有的话要禁止串关
const is_conflict = computed(() => {
  return false
})

// 是否展示不支持串关提示
const is_conflict2 = computed(() => {
  return true
  let flag =
    (get_cannot_mix_len.value || get_invalid_ids.value.length) &&
    BetData.bet_list.length > 1 &&
    ![900, 3000].includes(+get_menu_type)

  if (flag) {
    btn_show.value = 5
  } else if (get_bet_status.value == 1) {
    btn_show.value = 0
  }
  return flag
})

//计算样式，下面几种情况左下角按钮需要置灰不让点击
const calc_class = computed(() => {
  return true
  let flag = [2, 4].includes(+get_bet_status.value)
    || get_is_champion.value() && !BetData.is_bet_success_status
    || get_bet_status.value == 5 && BetData.bet_list.length == 1
    || get_menu_type == 3000 && lodash.get(single_item, 'hps[0].hl[0].hipo') != 1 && !BetData.is_bet_success_status
    || get_menu_type != 3000 && lodash.get(single_item, 'hps[0].hids') == 0 && !BetData.is_bet_success_status
    || btn_show.value == 5;
  return flag
})
// 投注金额赋值
const change_money_handle = (val) => {
  bet_amount.value = format_money2(val)
  // console.log("投注金额",bet_amount.value)
}
onMounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle)
  let munu_type = true
  if (munu_type) {
    // get_query_bet_amount_common()
  }
})

const set_ref_data_bet_money = () => {
  // let markInfo = lodash.get(BetData, 'bet_single_list')
  console.error('bet_single_list', BetData.bet_single_list);
  bet_show_single.value = true
}
onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
  useMittOn(MITT_TYPES.EMIT_INPUT_BET_MONEY, change_money_handle).off
})
</script>
<style lang="scss" scoped>
.bet-mix-box-child2 {
  .used-money {
    color: var(--q-gb-t-c-14);
  }

  .err-msg3 {
    height: 0.3rem;
    line-height: 0.3rem;

    img {
      vertical-align: -0.026rem;
      width: 0.14rem;
    }
  }
}

.content-box {
  position: fixed;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 600;
  overflow: hidden;
  width: 100%;
  padding: 0 0.15rem;
  -webkit-overflow-scrolling: touch;
  border-radius: 24px 24px 0 0;
  //border: 1px solid;
  background-color: var(--q-gb-t-c-14);
  ;

  .yb_pl14 {
    margin-right: 0.01rem;

    img {
      width: 0.11rem;
    }
  }
}

.dele-wrap2 {
  justify-content: flex-start;
  width: 100%;
}

.full-shadow {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 550;
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.5);
}

.scroll-box {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -1px;
  background-color: var(--q-gb-t-c-7);
  padding: 12px;
  border-radius: 12px;
}
.scroll-box-center{
  margin: 0.1rem 0;
}

.full-shadow2 {
  opacity: 0;
  width: 100%;
  max-width: 3.78rem;
  height: calc(var(--vh, 1vh) * 100);
  bottom: 0;
  z-index: 7100;

  .opacity-m {
    opacity: 0.4;
  }
}

/* ************** 底部左侧按钮 ************** -S */
.add-box {
  font-size: 0.16rem;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 0.85rem;
  border: 1px solid;
  border-radius: 4px;
  margin-right: 0.1rem;
  text-align: center;

  img {
    margin-left: 0.02rem;
    width: 0.12rem;
  }
}

/* ************** 底部左侧按钮 ************** -E */

/* ************** 底部左侧投注成功后保留选项按钮 ************** -S */
.add-box2 {
  font-size: 0.14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.14rem;
}

/* ************** 底部左侧投注成功后保留选项按钮 ************** -E */

/* ************** 底部右侧按钮 ************** -S */
.bet-box {
  flex: auto;
  border-radius: 4px;
  height: 0.5rem;
  line-height: 0.51rem;
  overflow: hidden;
}

.bet-box>p {
  height: 100%;
  text-align: center;
  line-height: 0.52rem;
}

/* ************** 底部右侧按钮 ************** -E */

/* ************** 删除全部图标 ************** -S */
.img1 {
  vertical-align: text-bottom;
  width: 0.14rem;
}

/* ************** 接收更好赔率图标 ************** -S */
.img2 {
  display: inline-block;
  background: url($SCSSPROJECTPATH+"/image/bet/select_b.svg") no-repeat center / contain;
  // background: var(--q-color-com-img-bg-69) no-repeat center / contain;
  vertical-align: text-bottom;
  width: 0.14rem;
  height: 0.14rem;
}

/* ************** 选中状态 **************  */
.img3 {
  background-image: url($SCSSPROJECTPATH+"/image/bet/select_a.svg");
  // background-image: var(--q-color-com-img-bg-68);
}

/* ************** 接收更好赔率按钮 ************** -E */

/* ************** 串关双箭头图标 ************** -S */
.arrow {
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  background: var(--q-color-com-img-bg-67) no-repeat center / contain;
}

.arrow2 {
  transform: scaleY(-1);
}

/* ************** 串关双箭头图标 ************** -E */

/* ************** 串关+号图标 ************** -S */
.bet-add {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  background: no-repeat center;
}

/* ************** 串关+号图标 ************** -E */

/* ************** 移除投注项删除图标 ************** -S */
.bet-add-box {
  font-size: 0.16rem;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 0.85rem;
  border: 1px solid;
  border-radius: 4px;
  margin-right: 0.1rem;
  text-align: center;

}

.bet-add-new {
  display: inline-block;
  width: 24px;
  height: 44px;
  border: 0.5px solid;
}

.bet_text_left {
  margin-left: 13px;
}

.bet_margin_left {
  margin-left: 3px;
  background: #CBCED8;
  box-shadow: 0px 1px 2px 0px #00000033;
}

.bet_text_right {
  margin: 0 13px;
}

.display_center {
  display: flex;
  align-items: center;
}

.one_text_color {
  color: #99A3B1 !important;
  border: 1px solid #CBCED8;
}

.linkUp_text_color {
  color: #FFFFFF !important;
  border: 0.5px solid #FFFFFF !important;
}

.close {
  display: inline-block;
  vertical-align: -0.026rem;
  width: 0.14rem;
  height: 0.14rem;
  background: var(--q-color-img-bg-98) no-repeat center / contain;
}

/* ************** 移除投注项删除图标 ************** -E */
.yellow-color {
  color: var(--q-color-fs-color-116);
}
</style>
