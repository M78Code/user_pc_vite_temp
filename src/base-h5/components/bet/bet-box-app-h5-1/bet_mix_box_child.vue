<!--
 * @Author: Router
 * @Description: 普通赛事的投注弹框
-->
<template>
  <div class="bet-mix-box-child2">
    <!-- 多注顶部蒙层 -->

    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <!-- <div v-if="get_bet_status == 2" class="fixed full-shadow2" @touchmove.prevent></div> -->

    <div v-show="false">{{ BetData.bet_data_class_version }} {{BetViewDataClass.bet_view_version}}</div>

    <div class="content-box">
      <div>
        <!-- 头部 -->
        <bet-bar @click="pack_up" v-if="BetViewDataClass.bet_order_status == 1"></bet-bar>
        <!--
          ** 投注后的状态 单||串 成功失败与否 提示信息样式不同
          单关投注 BetData.is_bet_single
            原组件 --  bet-after-status
          串关投注 BetData.bet_s_list
            新增组件 --
        -->
        <div v-else>
          <bet-after-status v-if="!!BetData.is_bet_single"></bet-after-status>
          <bevisBettedStatus v-else></bevisBettedStatus>
        </div>
      </div>

      <!-- 中间可滚动区域 -->
      <div class="scroll-box scroll-box-center" ref="scroll_box" :style="{ 'max-height': `${max_height1}px` }"
        @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
        
          <div v-if="BetData.is_bet_single">
            <!-- 单关投注项列表 -->
            <bet-mix-box-single-pass :item="BetData.bet_single_list[0]" :key='0'></bet-mix-box-single-pass>
          </div>
          <div v-else>
            <!--
                ** 串关投注项列表 样式更改
                原来 --  bet-conflict-tips
                现在 --  bevisBettedConfig
                 <bet-conflict-tips v-for="(item,index) in BetData.bet_s_list" :item="item" :key='index'></bet-conflict-tips>
            -->
            <bevisBettedConfig v-for="(item,index) in BetData?.bet_s_list ?? []" :item="item" :key='index'></bevisBettedConfig>
          </div>
      </div>

      <!-- 投注详情 不论成功失败都会显示 -->
      <!--<betInfoList v-if="get_bet_status != 1"></betInfoList>-->
      <!-- <div>{{BetData.bet_s_list.length}}---{{BetData.is_bet_single}}---{{BetViewDataClass.bet_order_status}}</div> -->
      <!-- 串关输入框 -->
      <template v-if="BetData.bet_s_list.length > 0 && !BetData.is_bet_single &&  BetViewDataClass.bet_order_status == 1 ">
      <!-- <div>12313123</div> -->
        <bet-collusion-input></bet-collusion-input>
      </template>

      <!-- 投注前 -->
      <div v-if="BetViewDataClass.bet_order_status == 1 && BetData.is_bet_single">
        <!-- 单关金额输入框 v-bind="$attrs"-->
        <!-- 输入框 与键盘 -->
        <bet-single-detail :item="BetData.bet_single_list[0]" :index="0"/>

        <!-- 键盘 -->
        <key-board v-if="BetData.bet_keyboard_show" :config="BetData.bet_single_list[0]" :index="0"></key-board>
        <div class="tip component bet-btn-item" v-if="BetViewDataClass.error_message">
          <div class="bet-error">
          {{ BetViewDataClass.error_code_list.includes(BetViewDataClass.error_code) ? i18n_t(BetViewDataClass.error_message) : BetViewDataClass.error_message }}
          </div>
        </div>
        <div class="dele-wrap yb_py8 row"  @touchmove.prevent>
          <!-- 右 自动接受跟好赔率 -->
          <span>
            <i class="img2" :class="{ 'img3': BetData.bet_is_accept }" @click="toggle_accept"></i>
            <span :class="{ 'auto-text': BetData.bet_is_accept }" class="yb_mx4 err-msg2" style="max-width:2.1rem"
              @click="toggle_accept">{{ i18n_t("ac_rules.auto") }}</span>
            <!-- <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_accept" class="img1" -->
            <span class="img1" :style="compute_css_obj('icon-issue')"></span>
          </span>

          <!-- 接受更好赔率的规则弹窗 -->
          <acceptRules v-if="BetData.better_rules_show"></acceptRules>
        </div>
      </div>

      <!-- 点击投注后 -->
      <div class="scroll-box" ref="scroll_box" v-if="BetViewDataClass.bet_order_status != 1">
        <div v-if="BetData.is_bet_pre">
          <!--投注成功后的预约金额和可用金额-->
          <bet-mix-box-successful-betting></bet-mix-box-successful-betting>
        </div>
        <!-- 常规投注11 -->
        <div v-else>
          <bet-mix-box-convention v-if=" BetViewDataClass.orderNo_bet_obj.length "></bet-mix-box-convention>
        </div>
      </div>

      <div class="yb_px12" v-if="get_mix_bet_flag">
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8 yb_fontsize14 fw_600 bet-mix-show">
          <div>{{ i18n_t('bet.total_income') }}</div>
          <div>{{ i18n_t('bet.total_bet') }} <span v-if="bet_num > 0">{{ bet_num }}</span></div>
        </div>
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8">
          <div class="yellow-color yb_fontsize16">{{ (award_total) }}</div>
          <div class="yb_fontsize16 bet-mix-show">{{ BetData.bet_money_total.toFixed(2) }}</div>
        </div>
      </div>
      <!-- {{BetViewDataClass.bet_order_status}} --- -->
      <!-- 底部按钮 -->
      <div class="row yb_pb8 justify-between" @touchmove.prevent v-if="BetViewDataClass.bet_order_status == 1">

          <div v-if="!BetData.is_bet_single" @click.stop="pack_up(4)" class="yb_delete">
            {{i18n_t('app_h5.bet.delete')}}
          </div>
          <!-- 右边 -->
          <div class="bet-box">
            <template v-if="exist_code == '666'">
              <p @click="go_record" class="yb_fontsize16">{{ i18n_t('bet.msg13') }}</p>
            </template>
            <template v-else-if="is_conflict">
              <!-- 投注 -->
              <div class="row justify-center items-center content-center set-opacity">
                <p class="yb_fontsize12 yb_mr10">{{ i18n_t('bet_record.bet_val') }}</p>
                <p class="yb_fontsize20">{{ format_money2(BetData.bet_money_total.toFixed(2)) }}</p>
              </div>
            </template>
            
            <template v-else>
              <!-- 投注 -->
              <!--  @click="submit_order"  -->
              <div v-if="BetViewDataClass.bet_order_status == 1" :class="{ 'set-opacity': true }"
                class="row justify-center items-center content-center yb-info">
                <q-page-sticky ref="silider" position="bottom-left" :offset="fabPos">
                  <div class="jiantou" :disable="draggingFab" v-touch-pan.right.prevent.mouse="handle_silider"><img :src="compute_local_project_file_path('/image/bet/right-arrow.svg')" alt="" draggable="false"></div>
                </q-page-sticky>
                <div class="middle">
                  {{ i18n_t('bet.betting') }}
                  <span class="yb-info-money">
                    <!-- {{ i18n_t('app_h5.bet.bet_win').replace("%s", "0.00") }} -->
                  <span>{{i18n_t('bet.total_win2')}}</span>
                  <span>
                        {{ formatMoney(mathJs.subtract(mathJs.multiply(BetData.bet_amount,BetData.bet_single_list?.[0]?.oddFinally), BetData.bet_amount)) || '0.00' }}
                  </span>
                  </span>
                </div>
                <div class="roll-right"><img :src="compute_local_project_file_path('/image/gif/roll-right.gif')" alt=""></div>
              </div>
              <!-- <slider v-if="BetViewDataClass.bet_order_status == 1"></slider> -->
              <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
              <div v-if="BetViewDataClass.bet_order_status == 5" class="row justify-center items-center content-center yb-info yb-info-hui">
                <div class="jiantou jiantouhui"><img :src="compute_local_project_file_path('/image/bet/right-arrow.svg')" alt=""></div>
                <div class="middle">{{ i18n_t('bet.betting') }}<span class="yb-info-money">{{ i18n_t('app_h5.bet.bet_win').replace("%s", "0.00") }}</span></div>
                <div class="roll-right"><img :src="compute_local_project_file_path('/image/gif/roll-right.gif')" alt=""></div>
              </div>
            </template>
          </div>

          <!--串关-->
          <div v-if="BetData.is_bet_single">
            <div :class="BetViewDataClass.bet_order_status == 1 && BetData.is_bet_single?'yb-strand':'yb-nostrand'" @click.stop="set_chain_bet(true)">+串</div>
          </div>
          <div class="yb-dan-btn" v-else @click="set_chain_bet(false)">
            <div>{{ i18n_t('common.single') }}</div>
          </div>
        </div>

      <!--投注后的 确定按钮 -->
      <!--<div v-else @click="set_clear()" class="nonebox4-sub">{{ i18n_t('app_h5.bet.confirm')}}</div>-->

      <!-- 投注按钮 -->
      <bevisBettedButton @bindClick="set_clear()" v-else></bevisBettedButton>

    </div>
  </div>
</template>

<script setup>
import betMixBoxSinglePass from './bet_mix_box_single_pass.vue';
import betMixBoxConvention from './bet_mix_box_convention.vue';
import betMixBoxSuccessfulBetting from './bet_mix_box_successful_betting.vue';
import betAfterStatus from './bet-after-status.vue';

// import betInfoList from "./bet_info_list.vue";
import bevisBettedStatus from "./bevis/bevis-betted_status.vue"
import bevisBettedButton from "./bevis/bevis-betted-button.vue"
import bevisBettedConfig from "./bevis/bevis-betted-config.vue"
import slider from "./bevis/slider.vue"


import betMixShow from './bet_mix_show3.vue';
import keyBoard from './bet-keyboard.vue';
import ballSpin from './ball-spin.vue';
import betBar from "./bet-bar.vue";
import betSingleDetail from './bet-single-detail.vue';
import betConflictTips from './bet-conflict-tips.vue'
import betCollusionInput from './bet-collusion-input.vue'
// import betCollusionInput1 from './bet-collusion-input1.vue'
// import betCollusionInput2 from './bet-collusion-input2.vue'



import mathJs from 'src/core/bet/common/mathjs.js'
import BetData from "src/core/bet/class/bet-data-class.js";
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
import { i18n_t, compute_css_obj,useMittOn, useMittEmit, MITT_TYPES, compute_local_project_file_path,formatMoney } from "src/output/index.js";
import { ref, onMounted, watch, computed, onUnmounted, reactive } from 'vue';
import { get_query_bet_amount_common, submit_handle } from "src/core/bet/class/bet-box-submit.js"
import lodash from 'lodash'
import { format_money3, format_money2 } from 'src/output/index.js'
import acceptRules from "./accept-rules.vue"
//串关的按钮
const is_strand = ref(true)
const scroll_box = ref()
const series_order_respList = ref([])
const award_total = ref()
const bet_list_data = ref([])
const tips_msg = ref('失效')  // 提示信息

let bet_show_single = ref(true)  // 单关显示
const get_bet_status = ref(0) // 投注状态
const btn_show = ref(0) // 投注状态2
const max_height1 = ref(160) // 投注赛事高度
const max_other_height1 = ref(300)
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

// 串关
const set_chain_bet = (state) =>{
  BetData.set_is_bet_single(state)
  pack_up()
}
// 投注事件
const pack_up = (val) => {
  console.error('关弹窗');
  // TODO: 临时调试用
  BetData.set_bet_state_show(false)
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX, false);
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
  BetData.set_bet_data_class_version()
}

// 滑块初始化坐标
const fabPos = ref([20, 11])
// 处理单关和串关投注的silider位置
const init_silider_position = () => {
  if(BetData.is_bet_single) {
    fabPos.value[0] = 20
    silider.value.offset[0] = 20
  } else {
    fabPos.value[0] = 77
    silider.value.offset[0] = 77
  }
}
const draggingFab = ref(false)
const silider = ref(null)
// 向右滑动投注
const handle_silider = (e) => {
  draggingFab.value = e.isFirst !== true && e.isFinal !== true
  fabPos.value[0] = e.distance.x
  silider.value.offset[0] = e.distance.x
  if (e.distance.x > 234 || e.isFinal) {
    reset_silider()
    return
  }
  // console.log('e', e, silider);
  if(e.distance.x > '180') {
    submit_handle()
    reset_silider()
  }
}

// 重置solider位置
let timer;
const reset_silider = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      init_silider_position()
    }, 300)
}

const submit_order = (type) => {
  
  console.error('touzhule')
  // submit_handle()
}

//切换是否接受更好赔率
BetData.bet_is_accept = true // 默认选中接受
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

onMounted(() => {
  init_silider_position()
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money)
  let munu_type = true
  if (munu_type) {
    // get_query_bet_amount_common()
  }
})

const set_ref_data_bet_money = () => {
  // let markInfo = lodash.get(BetData, 'bet_single_list')
  bet_show_single.value = true
}

// 清空数据
const set_clear = () => {
  // 关闭弹窗 清空数据
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX)
  BetData.set_clear_bet_info()
  BetViewDataClass.set_clear_bet_view_config()
}

onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_REF_DATA_BET_MONEY, set_ref_data_bet_money).off()
  timer = null
})
</script>
<style lang="scss" scoped>
.tip{
  color: var(--q-gb-bd-c-4);
  text-align: center;
  font-size: 0.14rem;
  width: 100%;
  height: .36rem;
  line-height: 0.36rem;

 .bet-error {
    color: #FF0000;
  }

  .bet-success {
    color: var(--q-gb-t-c-16);
  }
}
.middle {
  margin-left: .55rem;
}
.jiantou{
  height: 0.44rem;
  width: 0.44rem;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--q-gb-t-c-1);
  font-size: 0.2rem;
  border: 3px solid #50B5FF;
  margin-right: -.2rem;
}
.roll-right {
  height: 0.5rem;
  img {
    width: 0.5rem;
    margin-left: -.66rem;
  }
}

.jiantouhui{
  color: var(--q-gb-t-c-5);
}
.yb_delete{
  width: 0.5rem;
  height: 0.5rem;
  background: var(--q-gb-t-c-7);
  color: var(--q-gb-t-c-1);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 0.08rem;
}
.yb-dan-btn{
  width: 0.5rem;
  height: 0.5rem;
  padding: 0 0.13rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 0.1rem;
  background: var(--q-gb-t-c-7);
  color: var(--q-gb-t-c-1);
  font-weight: bold;
}
.yb-nostrand{
  margin-left: 0.1rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2rem;
  color: var(--q-gb-t-c-9);
  background: var(--q-gb-t-c-7);
}
.yb-strand{
  margin-left: 0.08rem;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.2rem;
  color: var(--q-gb-t-c-1);
  background: #E8F5FF;
}
.yb-info{
  background: linear-gradient(358deg, #179CFF 1.96%, #45B0FF 98.3%) !important;
  display: flex;
  justify-content: space-between;
  // padding-right: 0.26rem;
  border-radius: 0.7rem;
  color: var(--q-gb-t-c-14);
  font-size: 0.14rem;
  // padding-left: 0.08rem;
}
.yb-info-hui{
background: var(--q-gb-t-c-5) !important;
}
.yb-info-money{
  font-size: 0.12rem;
  color:rgba(255, 255, 255, 0.6);
  margin-left: 0.05rem;
}

.yb-info-one{
  color: var(--q-gb-t-c-6);
}
.yb-info-two{
  color: var(--q-gb-t-c-7);
}
.nonebox4-sub{
    padding: 0.08rem 0;
    margin-top: 0.08rem;
    width: 100%;
    font-size: 16px;
    text-align: center;
    color: #FFFFFF;
    background-color: var(--q-gb-t-c-1);
    border-radius: 12px;
    margin-bottom: .2rem ;
}
.bet-mix-box-child2 {
  .used-money {
    color: var(--q-gb-t-c-2);
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
  padding: 0 0.14rem;
  -webkit-overflow-scrolling: touch;
  border-radius: 24px 24px 0 0;
  //border: 1px solid;
  background-color: var(--q-gb-bg-c-15);

  .yb_pl14 {
    margin-right: 0.01rem;

    img {
      width: 0.11rem;
    }
  }
}

.dele-wrap {
  justify-content: flex-start;
  width: 100%;
  color: var(--q-gb-t-c-11);
}

.full-shadow {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 550;
  // backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.5);
}

.scroll-box {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -1px;
  //background-color: var(--q-gb-t-c-7);
  //padding: 12px;
  //border-radius: 0.04rem;
}
.scroll-box-center{
  //margin: 0 0 0.1rem 0;
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
  flex: 1;
  border-radius: 4px;
  height: 0.5rem;
  line-height: 0.49rem;
  overflow: hidden;
}

.bet-box>p {
  height: 100%;
  text-align: center;
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
  background-image: url($SCSSPROJECTPATH+"/image/bet/select_fuke.svg");
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
  margin-left: 0.1rem;
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
  color: #99A3B1 !important;
  border: 1px solid #CBCED8;
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
.set-opacity{
  background:var(--q-gb-bg-c-9)
}
</style>