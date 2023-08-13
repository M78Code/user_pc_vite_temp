<!--
 * @Author: Router
 * @Description: 普通赛事的投注弹框
-->
<template>
  <div class="bet-mix-box-child2">
    <!-- 多注顶部蒙层 -->
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fixed full-shadow2" @touchmove.prevent></div>

    <div class="content-box">

      <!-- 头部 -->
      <bet-bar @click.native="pack_up"></bet-bar>
      <div class="dele-wrap yb_px12 yb_py10 row" v-if="!get_bet_success" @touchmove.prevent>
        <!-- 左 删除全部 -->
        <span style="margin-right:auto" @click="pack_up(3)"><img src="image/wwwassets/bw3/svg/close3.svg"
            class="yb_mr4 img1" />{{ $root.$t('bet.delete_all') }}</span>
        <!-- 右 自动接受跟好赔率 -->
        <span>
          <i class="img2" :class="{ 'img3': get_is_accept != 2 }" @click="toggle_accept"></i>
          <span :class="{ 'auto-text': get_is_accept == 2 }" class="yb_mx4 err-msg2" style="max-width:2.1rem"
            @click="toggle_accept">{{ $root.$t("ac_rules.auto") }}</span>
          <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_accept" class="img1"
            v-if="get_theme.includes('theme01')" />
          <img src="image/wwwassets/bw3/svg/rules3.svg" @click="change_accept" class="img1" v-else />
        </span>
      </div>

      <!-- 中间可滚动区域 -->
      <div class="scroll-box" ref="scroll_box" :style="{ 'max-height': `${max_height1}px` }"
        @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
        <!-- 上部纯展示组件 展示盘口赔率玩法对阵信息-->
        <bet-mix-show v-for="(value, name, index1) in get_bet_obj" :order_detail_resp_list="order_detail_resp_list"
          :query_order_obj="query_order_obj" :key="name" :index_="index1" :name_="name">
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
        <template v-if="get_mix_bet_flag && ![3, 6].includes(+get_bet_status)">
          <bet-mix-detail :value_="item" :index_="index" v-for="(item, index) of get_s_count_data" :key="index"
            :tips_msg.sync="tips_msg" @max-win-money-emit="max_win_money_emit"></bet-mix-detail>
        </template>

        <!-- 多项单注 金额输入框-->
        <template v-if="!get_is_mix && get_bet_list.length > 1 && get_is_combine && ![3, 6].includes(+get_bet_status)">
          <bet-mix-single-detail :tips_msg.sync="tips_msg"></bet-mix-single-detail>
        </template>

        <!-- 串关投注完成后底部的显示 -->
        <!-- <template v-if="btn_show == 1 && series_order_respList.length > 1 || mixnew_bet"> -->
        <template v-if="0">
          <div v-show="btn_show == 1 && series_order_respList.length > 1 && !mixnew_bet"
            class="order-ok row yb_px14 yb_py8 yb_fontsize14">
            <div class="col-6">
              <!-- 可赢总金额 -->
              <span style="font-weight:600">{{ $root.$t('bet_record.total_winable_amount') }}</span>
              <p class="yb_fontsize18 moey-p">{{ (max_win_money_total / 100).toFixed(2) }}</p>
            </div>
            <div class="col-6 text-right">
              <!-- 投注总金额 -->
              <span style="font-weight:600">{{ $root.$t('bet_record.total_bet_amount') }}</span>
              <p class="yb_fontsize18 moey-p2">{{ (bet_money_total / 100).toFixed(2) }}</p>
            </div>
          </div>
        </template>
      </div>
      <div class="yb_px12" v-if="get_mix_bet_flag">
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8 yb_fontsize14 fw_600 bet-mix-show">
          <div>{{ $root.$t('bet.total_income') }}</div>
          <div>{{ $root.$t('bet.total_bet') }} <span v-if="bet_num > 0">{{ bet_num }}</span></div>
        </div>
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8">
          <div class="yellow-color yb_fontsize16">{{ (award_total) }}</div>
          <div class="yb_fontsize16 bet-mix-show">{{ get_money_total.toFixed(2) }}</div>
        </div>
      </div>
      <!-- 提示信息  分3种情况-->
      <!-- 求队球员冲突优先处理 -->
      <template v-if="is_conflict">
        <div class="yb_px14 row items-center yb_fontsize12 justify-center err-msg" style="min-height:0.3rem"
          @touchmove.prevent>
          <span class="text-center yb_py4">{{ $root.$t('bet.msg10') }}</span>
        </div>
      </template>

      <!-- 不支持串关提示 -->
      <template v-else-if="is_conflict2">
        <div class="err-msg3 yb_px14 text-center" @touchmove.prevent @click="reomve_invalid">
          <i class="close yb_mr4"></i>
          <!-- 移除无效投注 -->
          {{ $root.$t('bet.msg11') }}
        </div>
      </template>
      <!-- 失效和赔率变化 或者 正常状态 -->
      <template v-else>
        <div class="yb_px14 row items-center yb_fontsize12"
          :class="tips_msg ? 'justify-center err-msg' : 'justify-end err-msg2'"
          :style="{ 'min-height': get_bet_success ? '0.38rem' : '0.3rem' }" @touchmove.prevent @click="nothing">
          <template v-if="tips_msg"><span class="text-center yb_py4">{{ (tips_msg) }}</span></template>
          <template v-else-if="!tips_msg && [1, 2, 7].includes(+get_bet_status)">
            <!-- 左， 合并投注项 -->
            <span :style="{ 'opacity': calc_combine_show ? '0' : '1', 'margin-right': 'auto' }">
              <i class="img2" :class="{ 'img3': get_is_combine }" @click="change_is_combine"></i>
              <span class="yb_mx4" :class="{ 'auto-text': !get_is_combine }" @click="change_is_combine">{{
                $root.$t("tips.msg1") }}</span>
              <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_tips_show" class="img1"
                v-if="get_theme.includes('theme01')" />
              <img src="image/wwwassets/bw3/svg/rules3.svg" @click="change_tips_show" class="img1" v-else />
            </span>
            <!-- 右 -->
            <!-- 常用金额 -->
            <span v-if="get_bet_list.length == 1">
              <i class="img2" :class="{ 'img3': get_used_money != 0 }" @click="change_used_money"></i>
              <span class="yb_ml4" :class="get_used_money == 0 && 'auto-text'" @click="change_used_money">{{
                $root.$t('bet.used_money2') }}</span>
            </span>
            <!-- 更多串关类型 -->
            <span v-else-if="get_is_mix" @click.stop="spread_options"
              :class="{ 'opacity-m': get_bet_list.length == 2 || get_s_count_data.length == 1, 'col-8 text-right': get_bet_list.length > 1 }">
              {{ get_is_spread ? $root.$t('bet.msg04') : $root.$t('bet.msg05') }}
              <i class="arrow" :class="{ 'arrow2': !get_is_spread }"></i>
            </span>
          </template>
        </div>
      </template>

      <!-- 键盘 -->
      <key-board v-show="get_keyboard_show"></key-board>

      <!-- 底部按钮 -->
      <div class="row yb_px10 yb_pb8 justify-between" @touchmove.prevent>

        <!-- 左边， 3种情况-->
        <!-- 保留选项 -->
        <div class="add-box add-box2" :class="{ 'add-box2': get_bet_success, 'add-box3': calc_class }"
          @click.stop="pack_up(4)" v-if="get_bet_success">{{ $root.$t('bet.save') }}</div>
        <!-- 单关 -->
        <div v-else-if="get_is_mix" class="bet-add-box text-bold display_center one_text_color"
          :class="{ 'add-box3': calc_class }" @click.stop="pack_up(5)">
          <div class="bet-add-new bet_margin_left"></div>
          <div class="bet_text_left bet-one">{{ $root.$t('bet.kushikatsu') }}</div>
        </div>
        <!-- 串关+ -->
        <div v-else-if="!hide_bet_series_but()" class="bet-add-box text-bold display_center linkUp_text_color"
          :class="{ 'add-box3': calc_class }" @click.stop="pack_up(6)">
          <div class="bet_text_right">{{ $root.$t('bet.kushikatsu') }}</div>
          <div class="bet-add-new bet-linkUp"></div>
        </div>

        <!-- 右边 -->
        <div class="bet-box">
          <template v-if="exist_code == '666'">
            <p @click="go_record" class="yb_fontsize16">{{ $root.$t('bet.msg13') }}</p>
          </template>
          <template v-else-if="is_conflict">
            <!-- 投注 -->
            <div class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{ $root.$t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ get_money_total.toFixed(2) | format_money2 }}</p>
            </div>
          </template>
          <template v-else>
            <!-- 投注 -->
            <div v-if="btn_show == 0" @click="submit_order" :class="{ 'set-opacity': get_money_notok_list.length }"
              class="row justify-center items-center content-center">
              <p class="yb_fontsize12 yb_mr10">{{ $root.$t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ get_money_total.toFixed(2) | format_money2 }}</p>
            </div>
            <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
            <div v-if="btn_show == 5" class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{ $root.$t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ get_money_total.toFixed(2) | format_money2 }}</p>
            </div>
            <!-- 确定 -->
            <p v-if="btn_show == 1" @click="pack_up" class="yb_fontsize16">{{ $root.$t('common.ok') }}</p>
            <!-- 处理中 -->
            <div v-if="btn_show == 2" class="yb_fontsize16 row justify-center items-center">
              <p class="yb_mr8">{{ $root.$t('bet_record.submitting_bet') }}</p>
              <ball-spin />
            </div>
            <!-- 接受变化 -->
            <p v-if="btn_show == 3" @click="agree_change" class="yb_fontsize16">{{ $root.$t('bet.agree_change') }}</p>
            <!-- 接受变化并投注 -->
            <p v-if="btn_show == 4" @click="submit_order" class="yb_fontsize16">{{ $root.$t('bet.agree_change2') }}</p>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// import betMixShow from 'src/project/components/bet/bet_mix_show.vue';
// import betMixShow2 from 'src/project/components/bet/bet_mix_show2.vue';
// import betMixDetail from 'src/project/components/bet/bet_mix_detail.vue';
// import betMixSingleDetail from 'src/project/components/bet/bet_mix_single_detail';
// import betSuccessBar from 'src/project/components/bet/bet_success_bar.vue';
// import betting from 'src/project/mixins/betting/betting.js';
// import keyBoard from 'src/project/components/bet/keyboard.vue';
// import ballSpin from 'src/project/components/bet/ball_spin.vue';
// import betBar from "src/project/components/bet/bet_bar.vue";
// import { mapMutations, mapGetters } from "vuex";
// import utils from 'src/public/utils/utils.js';
// import { api_betting } from "src/project/api/index.js";
import {useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/"

// 此文件需抽离重构

//onst btn_show = ref(0)  / / 右下角显示状态，0投注，1确定（知道了），2注单处理中..., 3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
const exist_code = ref(0)    //投注后是否返回code码
const series_order_respList = ref([])   //串关投注成功后的返回(包含订单号、金额···)
const order_detail_resp_list = ref([])    // 单关和串关投注成功后的返回(投注项信息，赔率、盘口···)
const bet_money_total = ref(0)    //串关投注成功后的总投注额
const max_win_money_total = ref(0)     //串关投注成功后的总最高可赢
const query_order_obj = ref([])   //queryOrderStatus接口返回数据
const is_5s = ref(false)  //弹框弹起来有没有5秒,到了5秒就用默认的5000作限额,不作弹框提示
const max_winmoney = ref(0)    //单关投注成功后接口返回的最高可赢
const odds_value2 = ref('')    //单关投注成功后接口返回的赔率
const playname2 = ref('')  //单关投注成功后接口返回的玩法名称
const bet_money = ref(0)   //单关投注成功后接口返回的投注金额
const play_optionname = ref('')   //单关投注成功后接口返回的playOptionName
const max_height1 = ref(230)   //滚动区域的最大高
const is_new_bet = ref(false)   //get_orderstatus 接口返回是否是新流程
const need_bet_again = ref(false)  //是否需要重新发起投注
const check_odds_beforebet2 = debounce(check_odds_beforebet, 200) //防抖处理
const scroll_box_ele = ref(null)   // dom元素

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
