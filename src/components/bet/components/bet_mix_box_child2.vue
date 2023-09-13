<!--
 * @Author: Router
 * @Description: 普通赛事的投注弹框
-->
<template>
  <div class="bet-mix-box-child2">
    <!-- 多注顶部蒙层 -->
    <div v-if="false" class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fixed full-shadow2" @touchmove.prevent></div>

    <div class="content-box">

      <!-- 头部 -->
      <bet-bar @click.native="pack_up"></bet-bar>
      <div class="dele-wrap yb_px12 yb_py10 row" v-if="!BetData.is_bet_success_status" @touchmove.prevent>
        <!-- 左 删除全部 -->
        <span style="margin-right:auto" @click="pack_up(3)"><img src="image/wwwassets/bw3/svg/close3.svg"
            class="yb_mr4 img1" />{{ $t('bet.delete_all') }}</span>
        <!-- 右 自动接受跟好赔率 -->
        <span>
          <i class="img2" :class="{ 'img3': BetData.bet_is_accept != 2 }" @click="toggle_accept"></i>
          <span :class="{ 'auto-text': BetData.bet_is_accept == 2 }" class="yb_mx4 err-msg2" style="max-width:2.1rem"
            @click="toggle_accept">{{ $t("ac_rules.auto") }}</span>
          <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_accept" class="img1"
            v-if="UserCtr.theme.includes('theme01')" />
          <img src="image/wwwassets/bw3/svg/rules3.svg" @click="change_accept" class="img1" v-else />
        </span>
      </div>

      <!-- 中间可滚动区域 -->
      <div class="scroll-box" ref="scroll_box" :style="{ 'max-height': `${max_height1}px` }"
        @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
        <!-- 上部纯展示组件 展示盘口赔率玩法对阵信息-->
        <!-- <bet-mix-show v-for="(value, name, index1) in view_ctr_obj" :order_detail_resp_list="order_detail_resp_list"
          :query_order_obj="query_order_obj" :key="name" :index_="index1" :name_="name">
        </bet-mix-show> -->
        <bet-mix-show
        :bet_view_obj="bet_view_obj"
        :name_ ="'3532443'"
        >
        </bet-mix-show>

        <!-- 串关投注成功组件 单个几串几的信息展示-->
        <template v-if="btn_show == 1 || mixnew_bet || part_bet">
          <div v-show="btn_show == 1 && !mixnew_bet || part_bet">
            <div v-for="(item, index) in series_order_respList" :key="index">
              <betSuccessBar :item_="item" @update_money="update_money" :query_order_obj="query_order_obj"
                :len='series_order_respList.length'></betSuccessBar>
            </div>
          </div>
        </template>

        <!-- 串关主体 金额输入框-->
        <!-- <template>
          <bet-mix-detail :value_="item" :index_="index" v-for="(item, index) of get_s_count_data" :key="index"
            :tips_msg.sync="tips_msg" @max-win-money-emit="max_win_money_emit" :bet_min_max_money="bet_min_max_money">
          </bet-mix-detail>
        </template> -->

        <!-- 多项单注 金额输入框-->
        <!-- <template v-if="!BetData.bet_is_mix && BetData.bet_list.length > 1 && view_ctr_obj.bet_is_combine && ![3, 6].includes(+get_bet_status)">
          <bet-mix-single-detail :tips_msg.sync="tips_msg"></bet-mix-single-detail>
        </template> -->

        <!-- 串关投注完成后底部的显示 -->
        <!-- <template v-if="btn_show == 1 && series_order_respList.length > 1 || mixnew_bet"> -->
        <template v-if="0">
          <div v-show="btn_show == 1 && series_order_respList.length > 1 && !mixnew_bet"
            class="order-ok row yb_px14 yb_py8 yb_fontsize14">
            <div class="col-6">
              <!-- 可赢总金额 -->
              <span style="font-weight:600">{{ $t('bet_record.total_winable_amount') }}</span>
              <p class="yb_fontsize18 moey-p">{{ (max_win_money_total / 100).toFixed(2) }}</p>
            </div>
            <div class="col-6 text-right">
              <!-- 投注总金额 -->
              <span style="font-weight:600">{{ $t('bet_record.total_bet_amount') }}</span>
              <p class="yb_fontsize18 moey-p2">{{ (bet_money_total / 100).toFixed(2) }}</p>
            </div>
          </div>
        </template>
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
      <!-- 提示信息  分3种情况-->
      <!-- 求队球员冲突优先处理 -->
      <template v-if="is_conflict">
        <div class="yb_px14 row items-center yb_fontsize12 justify-center err-msg" style="min-height:0.3rem"
          @touchmove.prevent>
          <span class="text-center yb_py4">错误</span>
        </div>
      </template>

      <!-- 不支持串关提示 -->
      <template v-else-if="is_conflict2">
        <div class="err-msg3 yb_px14 text-center" @touchmove.prevent @click="reomve_invalid">
          <i class="close yb_mr4"></i>
          <!-- 移除无效投注 -->
          {{ $t('bet.msg11') }}
        </div>
      </template>
      <!-- 失效和赔率变化 或者 正常状态 -->
      <template v-else>
        <div class="yb_px14 row items-center yb_fontsize12"
          :class="tips_msg ? 'justify-center err-msg' : 'justify-end err-msg2'"
          :style="{ 'min-height': BetData.is_bet_success_status ? '0.38rem' : '0.3rem' }" @touchmove.prevent
          @click="nothing">
          <template v-if="tips_msg"><span class="text-center yb_py4">{{ (tips_msg) }}</span></template>
          <template v-else-if="!tips_msg && [1, 2, 7].includes(+get_bet_status)">
            <!-- 左， 合并投注项 -->
            <span :style="{ 'opacity': calc_combine_show ? '0' : '1', 'margin-right': 'auto' }">
              <i class="img2" :class="{ 'img3': view_ctr_obj.bet_is_combine }" @click="change_is_combine"></i>
              <span class="yb_mx4" :class="{ 'auto-text': !view_ctr_obj.bet_is_combine }" @click="change_is_combine">{{
                i18n_t("tips.msg1") }}</span>
              <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_tips_show" class="img1"
                v-if="UserCtr.theme.includes('theme01')" />
              <img src="image/wwwassets/bw3/svg/rules3.svg" @click="change_tips_show" class="img1" v-else />
            </span>
            <!-- 右 -->
            <!-- 常用金额 -->
            <span v-if="BetData.bet_list.length == 1">
              <i class="img2" :class="{ 'img3': get_used_money != 0 }" @click="change_used_money"></i>
              <span class="yb_ml4" :class="get_used_money == 0 && 'auto-text'" @click="change_used_money">{{
                i18n_t('bet.used_money2') }}</span>
            </span>
            <!-- 更多串关类型 -->
            <span v-else-if="BetData.bet_is_mix" @click.stop="spread_options"
              :class="{ 'opacity-m': BetData.bet_list.length == 2 || get_s_count_data.length == 1, 'col-8 text-right': BetData.bet_list.length > 1 }">
              {{ get_is_spread ? i18n_t('bet.msg04') : i18n_t('bet.msg05') }}
              <i class="arrow" :class="{ 'arrow2': !get_is_spread }"></i>
            </span>
          </template>
        </div>
      </template>

      <!-- 键盘 -->
      <key-board v-show="bet_keyboard_show" :bet_min_max_money="bet_min_max_money"></key-board>

      <!-- 底部按钮 -->
      <div class="row yb_px10 yb_pb8 justify-between" @touchmove.prevent>

        <!-- 左边， 3种情况-->
        <!-- 保留选项 -->
        <div class="add-box add-box2" :class="{ 'add-box2': BetData.is_bet_success_status, 'add-box3': calc_class }"
          @click.stop="pack_up(4)" v-if="BetData.is_bet_success_status">{{ $t('bet.save') }}</div>
        <!-- 单关 -->
        <div v-else-if="BetData.bet_is_mix" class="bet-add-box text-bold display_center one_text_color"
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
            <div v-if="btn_show == 0" @click="submit_order" :class="{ 'set-opacity': get_money_notok_list.length }"
              class="row justify-center items-center content-center">
              <p class="yb_fontsize12 yb_mr10">{{ $t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ format_money2(BetData.bet_money_total.toFixed(2)) }}</p>
            </div>
            <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
            <div v-if="btn_show == 5" class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{ $t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ format_money2(BetData.bet_money_total.toFixed(2)) }}</p>
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
// import betMixShow from 'src/components/bet/components/bet_mix_show.vue';
import betMixShow from 'src/components/bet/components/bet_mix_show3.vue';
// import betMixShow2 from 'src/components/bet/components/bet_mix_show2.vue';
import betMixDetail from 'src/components/bet/components/bet_mix_detail.vue';
// import betMixSingleDetail from 'src/components/bet/components/bet_mix_single_detail.vue';
import betSuccessBar from 'src/components/bet/components/bet_success_bar.vue';
// import betting from 'src/mixins/betting/betting.js';
import keyBoard from 'src/components/bet/components/bet-keyboard.vue';
// import ballSpin from 'src/components/bet/components/ball_spin.vue';
import betBar from "src/components/bet/components/bet-bar.vue";

// import {utils } from 'src/core/index.js';
// import { api_betting } from "src/api/index.js";
// import {useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/"
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { UserCtr } from "src/core/index.js";
// import { hide_bet_series_but } from "src/core/bet/index.js"
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { get_query_bet_amount_common } from "src/core/bet/class/bet-box-submit.js"
import lodash from 'lodash'
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"



const bet_keyboard_show = ref(true)
const scroll_box = ref()
const series_order_respList = ref([])
const award_total = ref()
const bet_min_max_money = ref()  // 投注限额
const bet_list_data = ref([])
const tips_msg = ref('失效')  // 提示信息

const bet_view_obj = ref()  // 多个投注对象 调试

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

onMounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
  let munu_type = true
  if (munu_type) {
    // get_query_bet_amount_common()
  }
})

const set_ref_data_bet_money = () => {
 
  // let markInfo = lodash.get(BetViewDataClass, 'bet_special_h5')
  let markInfo = lodash.get(BetData, 'bet_list')
  console.error('BetViewDataClass', markInfo)
  console.error('BetData.bet_list', BetData.bet_list)
  // markInfo.forEach(item => {
  //   let obj = {
  //     bs: {
  //       'playName': item.playName,  // 玩法名称
  //       'playId': item.playId,   // 玩法id
  //       'away': item.away,  // 客队
  //       'home': item.home,  // 主队
  //     }
  //   }
  //   bet_list_data.value.push(obj)
  // });
  // bet_min_max_money.value = BetViewDataClass.bet_min_max_money
  bet_view_obj.value = markInfo
  // console.error('sssssss', bet_view_obj.value)

}
onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off
})
</script>
<style lang="scss" scoped>
.bet-mix-box-child2 {
  .used-money {
    color: #5a6074;
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
  max-width: 3.78rem;
  -webkit-overflow-scrolling: touch;
  border-radius: 0.158rem 0.158rem 0 0;
  border: 1px solid;
  background-color: #ffffff;
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
  max-width: 3.78rem;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 550;
}

.scroll-box {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -1px;
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
  background: var(--q-color-com-img-bg-69) no-repeat center / contain;
  vertical-align: text-bottom;
  width: 0.14rem;
  height: 0.14rem;
}

/* ************** 选中状态 **************  */
.img3 {
  background-image: var(--q-color-com-img-bg-68);
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
