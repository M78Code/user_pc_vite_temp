<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show" @click="handleonmousedown">
    <!-- 失效蒙层 -->
    <div class="locked-shadow" v-if="(pankou_change == 2 || hids || has_pre.own_)"></div>
   <div class="row justify-start items-center"
      :class="[BetViewDataClass.bet_order_status ? 'yb_px14' : 'yb_pl12 yb_pr18', { 'bet-mix-show2': is_conflict }]">
      <!-- <div class="yb_mr12 dele-left" v-if="!BetData_H5.is_bet_success_status">
        <img src="image/wwwassets/bw3/svg/bet_xuanx.svg" @click.stop="remove_(value_show.id_)">
      </div> -->
      <div style="flex:1;">

        <!-- 上 -->
        <div class="row justify-between items-center yb_fontsize16 content-t yb_mb6 yb_mt8">
          <div class="col-9 row">
            <span class="fw_600">
              <!-- 投注成功后的展示值用接口返回的 -->
              <template v-if="bet_success_obj.playOptionName && [3, 6].includes(+get_bet_status)">{{
                bet_success_obj.playOptionName }}
              </template>
              <template v-else>
                <span v-show="value_show.value1" class="yb_mr4">{{ value_show.value1 }}</span>
                <span :class="pankou_change == 1 ? 'pankou-change' : null" v-show="value_show.value2">{{ value_show.value2
                }}</span>
              </template>
              [{{ hptype }}]
            </span>
          </div>

          <div class="col-3 row justify-end items-center">
            <span class="yb_fontsize22" :class="{ 'red': odds_change == 1, 'green': odds_change == 2 }">
              <template v-if="get_bet_status == 3 && bet_success_obj.oddsValues">{{
                format_odds(value_show.csid, bet_success_obj.oddsValues) }}</template>
              <!-- <template v-else>{{ odds_value() }}</template> -->
            </span>
            <!-- 红升绿降 -->
            <span :class="{ 'red-up': odds_change == 1, 'green-down': odds_change == 2 }" class="odd-change yb_ml4"
              v-if="!BetViewDataClass.bet_order_status"></span>
          </div>
        </div>

        <!-- 中 -->
        <div class="row justify-between yb_my4 yb_fontsize14">
          <span :class="UserCtr.lang == 'vi' && BetViewDataClass.bet_order_status ? 'col-6' : 'col-7'">
            <template v-if="lodash.get(value_show, 'hps[0].hl[0].hmt') == 0">{{ i18n_t('bet_record.ing')
            }}&thinsp;</template>
            <template v-if="get_is_champion">{{ lodash.get(value_show, 'hps[0].hl[0].hps') }}</template>
            <!-- 投注成功后的玩法名称用接口返回的 -->
            <!--<template v-else-if="bet_success_obj.playName && [3, 6].includes(+get_bet_status)">{{bet_success_obj.playName}}</template>-->
            <template v-else>{{ value_show.hps[0].hpnb || value_show.hps[0].hpn }}</template>
            <!-- 基准分 -->
            <template
              v-if="(value_show.csid == 1 || value_show.csid == 2) && !((pre_or_bet === 0 || pre_or_bet) && pre_order_status)">
              <div>
                <template v-if="bet_success_obj.scoreBenchmark">{{ calc_bifen2(
                  bet_success_obj.scoreBenchmark) }}</template>
                <template v-else>{{ calc_bifen(value_show) }}</template>
              </div>
            </template>
          </span>
          <template v-if="BetViewDataClass.bet_order_status && !(BetData.is_bet_single && BetData.bet_list.length > 1)">
            <template v-if="(pre_or_bet === 0 || pre_or_bet) && pre_order_status">
              <!-- 预约成功 -->
              <span class="color1"><img src="image/wwwassets/bw3/svg/bet_chengg.svg" class="img0">{{
                i18n_t('pre_record.booked') }}</span>
            </template>
            <template v-else>
              <!-- 投注成功 -->
              <span v-if="order_status == 1" class="color1"><img src="image/wwwassets/bw3/svg/bet_chengg.svg"
                  class="img0">{{ i18n_t('bet.bet_suc') }}</span>
              <!-- 投注失败 -->
              <span v-if="order_status == 0" class="color3"><img src="image/wwwassets/bw3/svg/bet_shib.svg"
                  class="img0">{{ i18n_t('bet.bet_err') }}</span>
              <!-- 提交成功 -->
              <span v-if="order_status == 2" class="color2">
                <i class="img0 img1" :style="compute_css_obj('icon-tijiao')"></i>
                {{ i18n_t('bet.submitted_successfully') }}</span>
            </template>
          </template>
          <template v-else>
            <!-- 不支持串关 -->
            <span v-if="hids" class="invalid-span2">{{ i18n_t('bet.invalidation2') }}</span>
            <!-- 失效 -->
            <span v-else-if="pankou_change == 2" class="invalid-span">{{ i18n_t('bet.invalidation') }}</span>
          </template>
        </div>

        <!-- 联赛名称 -->
        <div class="xia" v-if="value_show.tn && !get_is_champion">{{ value_show.tn }}</div>

        <!-- 下 -->
        <div class="xia row justify-between flex-end yb_my4" style="min-height: 0.22rem">
          <div class="col-9 row" :class="{ 'col-12': !(authorityOptionFlag || show_pre) }">
            <template v-if="get_is_champion">{{ value_show.onTn || value_show.tn }}</template>
            <template v-else-if="BetViewDataClass.bet_order_status && bet_success_obj.matchInfo">{{
              bet_success_obj.matchInfo }}</template>
            <template v-else>{{ value_show.mhn }}<span class="q-mx-xs">v</span>{{ value_show.man }}{{ score }}</template>
          </div>
          <div v-if="authorityOptionFlag" class="col-3 row subscribe-button" @click.stop="handlePre(true)">
            +{{ i18n_t('pre_record.book') }}</div>
          <div v-if="show_pre"><span class="pre-text">[{{ i18n_t('pre_record.book') }}]</span></div>
        </div>
        <div class="yb_px10 half-border-bottom" v-if="show_border"></div>
      </div>
    </div>

    <!-- 开发环境调试，不要放开到线上环境 -->
    <p style="padding-left: 10px;color:red;" v-if="0">
      oid: <i>{{ bet_obj_item.cs.oid }}</i> hpid: <i>{{ value_show.hps[0].hpid }}</i> mid: <i>{{ value_show.hps[0].mid
      }}</i><br />
      id_：<i>{{ bet_obj_item.cs.id_ }}</i> hid: <i>{{ value_show.hps[0].hl[0].hid }}</i> <br />
      mhs: <i>{{ value_show.mhs }}</i> hs: <i>{{ value_show.hps[0].hl[0].hs }}</i> os: <i>{{ bet_obj_item.cs.os }}</i>
      get_bet_status: <i>{{ get_bet_status }}</i>
    </p>

    <!-- 预约投注相关 -->
    <div class="subscribe-wrap" v-if="!BetData.is_bet_single && show_pre && pre_switch">
      <div class="operation-line" v-if="is_show_market"></div>
      <!-- 调整盘口 -->
      <div class="subscribe-operation" v-if="is_show_market">
        <span class="label">{{ i18n_t('pre_record.handicap') }}</span>
        <div class="operation">
          <span class="reduce" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(3)"
            :class="show_market_shadow ? 'shadow-show' : null">
            <img class="img" :style="compute_img_url('bet-reduce')">
          </span>
          <div class="odd" @click.stop="focus_market">
            <div class="odd_text">{{ pre_market_value || 0 }}</div>
            <span class="money-span" ref="money_span_market"
              :class="{ 'money-span2': !(BetData.active_index == 'market' + index_) }"></span>
          </div>
          <span class="add" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(4)"
            :class="show_market_shadow_max ? 'shadow-show' : null">
            <img class="img" :style="compute_img_url('icon-add')">
          </span>
        </div>
        <span class="delete"><img src="image/wwwassets/bw3/common/delete.png" @click.stop="handlePre(false)" /></span>
      </div>
      <div class="operation-line half-border-bottom"></div>
      <!-- 调整赔率 -->
      <div class="subscribe-operation">
        <span class="label">{{ i18n_t('pre_record.odds') }}</span>
        <div class="operation">
          <span class="reduce" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(1)"
            :class="pre_shadow_flag ? 'shadow-show' : null">
            <img class="img" :style="compute_img_url('bet-reduce')">
          </span>
          <div class="odd" @click.stop="focus_odds">
            <!-- <div class="odd_text">{{ (pre_odds ? pre_odds : (pre_odds === 0 || pre_odds === '0' ? '0' : '')) ||
              odds_value(true) }}</div> -->
            <span class="money-span" ref="money_span"
              :class="{ 'money-span2': !(BetData.active_index == 'pre' + index_) }"></span>
          </div>
          <span class="add" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(2)"
            :class="pre_shadow_max_flag ? 'shadow-show' : null">
            <img class="img" :style="compute_img_url('icon-add')">
  
          </span>
        </div>
        <span class="delete"><img src="image/wwwassets/bw3/common/delete.png" v-if="!is_show_market"
            @click.stop="handlePre(false)" /></span>
      </div>
    </div>

    <!-- 对应单关多个注单样式 -->
    <template v-if="![11, 100, 900, 3000].includes(900)">
      <!-- 单关金额输入框 -->
      <bet-single-detail ref="bet_single_detail" v-if="!(BetViewDataClass.bet_order_status || BetData.is_bet_single)"
        v-bind="$attrs" :name_="name_" :index_="index_"></bet-single-detail>
      <template v-if="BetViewDataClass.bet_order_status && !BetData.is_bet_single && bet_success_obj">
        <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
        <div class="bottom-bar row justify-between yb_px14 yb_fontsize14 yb_mb8 ">
          <!--左边， 最高可赢 -->
          <p><span>{{ i18n_t('bet_record.bet_max_win') }}</span><span class="bottom-bar-sp yb_fontsize14 yb_ml8 ">{{
            (bet_success_obj.maxWinMoney / 100).toFixed(2) }}</span></p>
          <!--右边， 投注金额 -->
          <p><span>{{ i18n_t('bet.bet_val') }}</span><span class="bottom-bar-sp2 yb_fontsize14 yb_ml8 ">
              {{ (bet_success_obj.betMoney / 100).toFixed(2) }}</span></p>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
 
import betSingleDetail from './bet_single_detail.vue';
import BetData from "src/core/bet/class/bet-data-class.js";
 
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js";
 
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { compute_value_by_cur_odd_type } from "src/output/index.js"
import { useMittOn,compute_img_url,UserCtr, useMittEmit, MITT_TYPES } from "src/output/index.js"

import lodash from 'lodash'



let odds_change = ref(0)    //0-正常，1-赔率升，2-赔率降
let pankou_change = ref(0)   //0-盘口未变化，1-盘口值变化，2-盘口失效(封盘和关盘)，3-锁盘
let is_suspend_watch = ref(false) // 是否暂停监听赔率盘口变化
let order_status = ref(1)  //1-投注成功  2-投注确认中  0-投注失败
let pre_ov = ref(0) // 预约投注赔率(原始的欧洲赔率)
let pre_odds = ref('') //键盘带过来的预约值
let pre_market_value = ref('') //预约投注盘
let pre_switch = ref(0)//当前投注项预约开关
let flicker_timer = ref(null)     //光标闪动计时器
let low_odds = ref(0)//最低赔率
let daxiao_market_value = ref(0.5) //大小玩法最低盘口值，初始最低0.5
let daxiao_market_value_max = ref(30) //大小玩法最大盘口值
let rq_market_value_max = ref(10)  //让球类玩法最大盘口值
let rq_market_value_min = ref(-10) //让球类玩法最小盘口值
let market_value_unit = ref(0.25)//盘口变动值，默认足球0.25，篮球是0.5
let focus_type = ref(0) // 光标聚焦到哪里

const show_pre = ref(false)   //预约投注相关

const bet_mix_detail = ref()  // ref组件
const money_span = ref()  // ref组件
const money_span_market = ref()  // ref组件

const score = ref('ssss')
const view_ctr_obj = ref({})
const update_tips = BetData.update_tips
const bet_list = BetData.bet_list
const get_is_champion = ref(true)

let timer = null;
let timer2 = null;
let timer3 = null;

onMounted(() => {
  timer = null;
  timer2 = null;
  timer3 = null;

  flicker_();
  //监听键盘赔率改变事件
  useMittOn(MITT_TYPES.EMIT_CHANGE_ODDS, change_odds_handle)
  //监听键盘盘口改变事件
  useMittOn(MITT_TYPES.EMIT_CHANGE_MARKET, change_market_handle)
  if (bet_obj_mhs == 11 || bet_obj_hs == 11) {
    set_bet_status(7);
  };





  if (value_show.value.csid != 1) {
    daxiao_market_value.value = 0.5//大小玩法最低盘口值，初始最低0.5
    daxiao_market_value_max.value = 400//大小玩法最大盘口值
    rq_market_value_max.value = 99.5 //让球类玩法最大盘口值
    rq_market_value_min.value = -99.5//让球类玩法最小盘口值
    market_value_unit.value = 0.5
  }
  // 初始化预约投注的赔率和盘口
  if (show_pre.value) {
    pre_ov.value = view_ctr_obj[props.name_].pre_odds
    low_odds.value = view_ctr_obj[props.name_].min_odds || bet_obj_ov
    pre_market_value.value = view_ctr_obj[props.name_].pre_market_value
  }
  //设置当前预约投注索引
  if (!has_pre.own_ && has_pre.others) {
    set_active_index(index_)
  }

})

const props = defineProps({
  name_: String | Number,
  index_: Number,
  order_detail_resp_list: {
    type: Array,
    default: () => {
      return []
    }
  },
  query_order_obj: {
    type: Array,
    default: () => {
      return []
    }
  },
  bet_view_obj: {
    type: Object,
    default: () => {
      return {}
    }
  }
})


/** --------------------------watch开始 ---------------*/

//检测比分，设置大小类玩法最低盘口值
// watch(() => score, (new_) => {
//   return '36.5'
//   const ol_obj = lodash.get(value_show.value, 'hps[0].hl[0].ol[0]')
//   const hps_obj = lodash.get(value_show.value, 'hps[0]')
//   if (!BetData.bet_is_mix && show_pre.value.value&& pre_switch.value && new_) {
//     const method_type = ol_obj.ot
//     const new_arr = new_.replace(/\(/,'').replace(/\)/,'').split('-') || []
//     if (['Over', 'Under'].includes(method_type) && new_arr.length > 1) {
//       const homeTeamMethodList = [ //主队进球大小玩法
//         '10', '87', '88', '115', '123', '314', '316'
//       ]
//       const awayMethodList = [
//         '11', '97', '98', '116', '124', '315', '317'
//       ] //客队进球大小玩法
//       let temp_value = 0
//       if (homeTeamMethodList.includes(hps_obj.hpid)) {
//         temp_value = +new_arr[0]
//       } else if (awayMethodList.includes(hps_obj.hpid)) {
//         temp_value = +new_arr[1]
//       } else {
//         temp_value = +new_arr[0] + +new_arr[1]
//       }
//       daxiao_market_value.value = acc_add(temp_value, 0.5)
//     }
//   } else {
//     return
//   }
// }, {
//   immediate: true,
//   deep: true
// })

// //监控投注项
// watch(() => view_ctr_obj, (new_) => {
//   pre_switch.value = new_[props.name_].pre_switch
//   if (new_[props.name_].market_tips == 1) {
//     pre_market_value.value = new_[props.name_].pre_market_value
//     if (BetData.active_index == 'market' + index_) {
//       send_market_to_keyboard()
//     }
//     tips_msg_update(i18n_t('pre_record.market_error_info_low'))
//     let bet_obj = lodash.cloneDeep(view_ctr_obj)
//     bet_obj[props.name_].market_tips = 0
//     set_bet_obj(bet_obj)
//     clearTimeout(timer3)
//     timer3 = setTimeout(() => {
//       tips_msg_update('')
//     }, 3000);
//     return
//   }
//   if (new_[props.name_].pre_odds && new_[props.name_].pre_odds > pre_ov.value) {
//     pre_odds.value = ''
//     pre_ov.value = new_[props.name_].pre_odds
//     tips_msg_update(i18n_t('error_msg_info.0400540.client_msg'))
//     clearTimeout(timer3)
//     timer3 = setTimeout(() => {
//       tips_msg_update('')
//     }, 3000);
//   }
// }, {
//   deep: true,
//   immediate: true
// })
// //检测预约赔率变化，更新至投注对象
// watch(() => pre_ov, (new_) => {
//   let bet_obj = lodash.cloneDeep(view_ctr_obj)
//   bet_obj[props.name_].pre_odds = new_
//   set_bet_obj(bet_obj)
// })

// // 解决投注项数量减少会导致位置移动，错误显示盘口赔率变化
// watch(() => bet_list, (newVal, oldVal) => {
//   if (newVal > oldVal) return

//   is_suspend_watch.value = true
//   nextTick(() => {
//     is_suspend_watch.value = false

//   })
// })
// //监听赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
// watch(() => update_tips, (new_) => {
//   if (
//     [3, 4, 6].includes(+get_bet_status.value) ||
//     is_suspend_watch.value
//   ) {
//     return
//   }

//   if (new_ == 0) {
//     set_invalid_ids({ type: 2, val: value_show.value.mid }) // 删除赛事和盘口级别正常的id
//     pankou_change.value = 0
//     set_bet_status(1);
//     set_odds_change(false);
//   }

//   if (new_ == 11) {
//     set_invalid_ids({ type: 2, val: value_show.value.mid }) // 删除赛事和盘口级别正常的id
//     pankou_change.value = 0
//     set_bet_status(7);
//     set_odds_change(false);
//   }

//   if ([1, 2].includes(+new_)) {
//     pankou_change.value = 2;
//     set_invalid_ids({ type: 1, val: value_show.value.mid }) // 对应赛事和盘口级别失效时记录id
//     set_odds_change(true);
//   }
// })
// //监听盘口级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
// watch(() => bet_obj_hs, (new_) => {
//   if (
//     [3, 4, 6].includes(+get_bet_status.value) ||
//     is_suspend_watch.value
//   ) {
//     return
//   }

//   if (new_ == 0) {
//     set_invalid_ids({ type: 2, val: value_show.value.mid }) // 删除赛事和盘口级别正常的id
//     pankou_change.value = 0
//     set_bet_status(1);
//     set_odds_change(false);
//   }

//   if (new_ == 11) {
//     set_invalid_ids({ type: 2, val: value_show.value.mid }) // 删除赛事和盘口级别正常的id
//     pankou_change.value = 0
//     set_bet_status(7);
//     set_odds_change(false);
//   }

//   if ([1, 2].includes(+new_)) {
//     pankou_change.value = 2;
//     set_invalid_ids({ type: 1, val: value_show.value.mid }) // 对应赛事和盘口级别失效时记录id
//     set_odds_change(true);
//   }
// }, {
//   immediate: true
// })
// //监听投注项状态变化,socket对应1.开盘，2封盘，3详情页投注项需要隐藏(用失效对应)
// watch(() => bet_obj_os, (new_) => {
//   if (
//     [3, 4, 6].includes(+get_bet_status.value) ||
//     is_suspend_watch.value
//   ) {
//     return
//   }

//   if ([2, 3].includes(+new_)) {
//     pankou_change.value = 2;
//     set_odds_change(true);
//   }
// })
// //监听盘口值变化
// watch(() => bet_obj_on, (new_) => {
//   if (
//     [3, 4, 6].includes(+get_bet_status.value) ||
//     is_suspend_watch.value
//   ) {
//     return
//   }

//   if (pankou_change.value != 2) {  //盘口失效时盘口值变化不给颜色变化
//     pankou_change.value = 1;
//   }

//   set_odds_change(true);

//   // 3秒后重置样式,盘口失效（关盘或者封盘）时盘口值变化，不用3秒后回到盘口正常状态
//   clearTimeout(timer)
//   timer = setTimeout(() => {
//     if (![1, 2].includes(+bet_obj_hs)) {
//       pankou_change.value = 0;
//     }
//   }, 3000);

//   if (BetData.bet_is_mix) {    //串关盘口值变更后拉取最新限额
//     fetch_limit_money();
//   }
// })
//监听赔率变化  get_bet_status.value == 2在C106的地方做了一层过滤
// watch(() => bet_obj_ov, (new_, old_) => {
//   calc_mixcount(false)
//   if (
//     [2, 3].includes(+get_bet_status.value) &&
//     lodash.get(value_show.value, 'hps[0].hl[0].ol[0].ov2')
//   ) {
//     bet_success_obj.oddsValues = lodash.get(value_show.value, 'hps[0].hl[0].ol[0].ov2')
//     return
//   }

//   if (
//     ![1, 5, 6, 7].includes(+get_bet_status.value) ||
//     pankou_change.value == 2 ||
//     is_suspend_watch.value
//   ) {
//     return
//   }

//   clearTimeout(timer2)
//   // 3秒后重置样式
//   timer2 = setTimeout(() => {
//     odds_change.value = 0;
//   }, 3000);

//   if (get_bet_status.value == 6) {   //提交成功状态，如果选择的是自动接受任何赔率变动跟着变，如果选的是接受更好的赔率，当赔率更好了跟着变
//     if (
//       [1, 3].includes(+BetData.bet_is_accept) &&
//       old_ && new_ - old_ >= 1000
//     ) {
//       odds_change.value = 1;
//     }

//     if (BetData.bet_is_accept == 2) {
//       if (old_ && new_ - old_ >= 1000) {
//         odds_change.value = 1;
//       } else if (old_ - new_ >= 1000) {
//         odds_change.value = 2;
//       }
//     }

//     return;
//   }

//   if (new_ < 101000) {   //原始欧赔小于101000,失效处理
//     pankou_change.value = 2;
//     set_odds_change(true);
//     return;
//   }

//   if (old_ && new_ - old_ >= 1000) {
//     odds_change.value = 1;
//     set_odds_change(true);
//   } else if (old_ - new_ >= 1000) {
//     odds_change.value = 2;
//     set_odds_change(true);
//   }
// })

// // 记录投注项失效的id_集合
// watch(() => pankou_change, (new_) => {
//   if (new_ != 2) {
//     set_invalid_ids({ type: 2, val: value_show.value.mid })
//   }
// })

// watch(() => query_order_obj, (new_) => {
//   query_order_obj_handle()
// })


/** --------------------------watch结束 ---------------*/

/** --------------------------computed 开始---------------*/
//足球或者篮球的让球玩法集合
const rq_play_list = computed(() => {
  return value_show.value.csid == 1 ? FOOTBALL_PLAY_LET_BALL : BASKETBALL_PLAY_LET_BALL
})
//赛事id或者球员id是否冲突
const is_conflict = computed(() => {
  return false
  return get_is_conflict.value([value_show.value.maid, value_show.value.mhid])
})
//判断调整后的赔率是否小于最低赔率
const pre_shadow_flag = computed(() => {
  if (pre_ov.value <= low_odds.value) {
    return true
  } else {
    return pre_ov.value <= 101000
  }
})
// 计算是否展示盘口预约功能
const is_show_market = computed(() => {
  let bookMarketSwitch = lodash.get(UserCtr, 'configVO.bookMarketSwitch')
  let bookMarketSwitchBasketball = lodash.get(UserCtr, 'configVO.bookMarketSwitchBasketball', 0)
  if (value_show.value.csid == 1) {
    return market_flag_list.includes(value_show.value.hps[0].hpid) && bookMarketSwitch == 1
  } else {
    return market_flag_basketball_list.includes(value_show.value.hps[0].hpid) && bookMarketSwitchBasketball
  }
})
//判断让球、大小类盘口值是否低于最低盘口值
const show_market_shadow = computed(() => {
  if (['Over', 'Under'].includes(lodash.get(value_show.value, 'hps[0].hl[0].ol[0].ot'))) {
    const split_value = lodash.words(pre_market_value.value, /[^+,/ ]+/g)
    if (split_value.length > 1) {
      return (Number(split_value[0]) + Number(split_value[1])) / 2 <= daxiao_market_value.value
    } else {
      return pre_market_value.value <= daxiao_market_value.value
    }
  } else {
    const split_value = lodash.words(pre_market_value.value, /[^+,/ ]+/g)
    if (split_value.length > 1) {
      return (Number(split_value[0]) + Number(split_value[1])) / 2 <= rq_market_value_min.value
    } else {
      return pre_market_value.value <= rq_market_value_min.value
    }
  }
})
//判断大小类,让球盘口值是否高于最大盘口值
const show_market_shadow_max = computed(() => {
  const compaire_val = ['Over', 'Under'].includes(lodash.get(value_show.value, 'hps[0].hl[0].ol[0].ot')) ? daxiao_market_value_max.value : rq_market_value_max.value;
  const split_value = lodash.words(pre_market_value.value, /[^+,/ ]+/g)
  if (split_value.length > 1) {
    return (Number(split_value[0]) + Number(split_value[1])) / 2 >= compaire_val
  } else {
    return pre_market_value.value >= compaire_val
  }
})
//预约投注开关
const authorityOptionFlag = computed(() => {
  return (!BetData.bet_is_mix) && pre_switch.value && (!BetViewDataClass.bet_order_status) && authorityFlag && (!show_pre.value)
})
//判断该商户是否有权限预约投注
const authorityFlag = computed(() => {
  const bookBet = lodash.get(UserCtr, 'configVO.bookBet')
  const marketConfigValue = lodash.get(UserCtr, 'configVO.marketConfigValue')
  return bookBet == 1 && (value_show.value.csid == 1 || value_show.value.csid == 2) && marketConfigValue == 1
})
//判断投注成功后是否是预约投注
const pre_order_status = computed(() => {
  const success_pre = lodash.find(props.order_detail_resp_list, (item) => {
    return lodash.get(item, 'is_pre')
  })
  return success_pre
})
// 判断是走正常投注还是预约
const pre_or_bet = computed(() => {
  let status = ''
  props.order_detail_resp_list.map(item => {
    status = item.preOrderDetailStatus
  })
  return status
})
const bet_obj_item = computed(() => {
  return view_ctr_obj[props.name_]
})
//投注对象数据
const value_show = computed(() => {
  return props.bet_view_obj;
})
//判断当前投注项里面是否是预约单
const has_pre = computed(() => {
  return 'false'
  const item_name = lodash.findKey(view_ctr_obj, function (o) { return o.show_pre.value.value })
  if (item_name) {
    if (item_name == props.name_) {
      return {
        own_: false,
        others: true
      }
    } else {
      return {
        own_: true,
        others: true
      }
    }
  } else {
    return {
      own_: false,
      others: false
    }
  }
})
// 满足下面条件（单关没有输入金额）的投注项在投注成功后不展示,单关多注接口只返回提交成功的注单，所以只展示提交成功的订单
const is_show_successed_item = computed(() => {
  let flag = BetData.bet_list.length == 1
    || !BetViewDataClass.bet_order_status
    || BetData.bet_is_mix
    || BetViewDataClass.bet_order_status && !BetData.bet_is_mix && BetData.bet_list.length > 1 && bet_obj_item.money >= 0.01 && bet_success_obj
  return true
})
//将赔率映射为计算属性
const bet_obj_ov = computed(() => {
  return lodash.get(value_show.value, 'hps[0].hl[0].ol[0].ov')
})
//将列表页盘口值 on  映射为计算属性
const bet_obj_on = computed(() => {
  return lodash.get(value_show.value, 'hps[0].hl[0].ol[0].on')
})
// 将 普通赛事是否支持串关 映射为计算属性
const hids = computed(() => {
  return (BetData.bet_is_mix && lodash.get(bet_obj_item, 'cs.cds') == "C01") || (lodash.get(value_show.value, 'hps[0].hids') == 0 &&
    BetData.bet_list.length > 1 &&
    get_menu_type.value != 3000 &&
    BetData.bet_is_mix)
})
//将赛事级别盘口状态映射为计算属性
const bet_obj_mhs = computed(() => {
  return value_show.value.mhs;
})
//将盘口状态映射为计算属性
const bet_obj_hs = computed(() => {
  return value_show.value.hps[0].hl[0].hs;
})
//盘口值
const bet_obj_hv = computed(() => {
  if (!rq_play_list.includes(lodash.get(value_show.value, 'hps[0].hpid'))) {
    return lodash.get(value_show.value, 'hps[0].hl[0].hv')
  }
  return lodash.get(value_show.value, 'hps[0].hl[0].ol[0].on')
})
//将投注项状态状态映射为计算属性
const bet_obj_os = computed(() => {
  return lodash.get(value_show.value, 'hps[0].hl[0].ol[0].os')
})
//是否显示下边线
const show_border = computed(() => {
  return BetData.bet_list[BetData.bet_list.length - 1] != props.name_ && BetData.bet_is_mix
})
// 每个投注项赔率和盘口状态是否正常
const status_normal = computed(() => {
  return [1, 2].includes(+odds_change.value) || [1, 2].includes(+pankou_change.value)
})
/**
    *@description 赔率转换
    *@param {String} value 原始的欧洲赔率
    *@param {String} hsw 支持赔率转换的类型，逗号分隔
    *@param {Boolean} is_pre 是否预约投注的赔率
    *@return {String} 转换后的赔率
    */
const odds_value = computed(() => {
  console.error('ssss9988', value_show.value)
  console.error('ssss4444444', props.name_)
  return '1'
  return (is_pre) => {
    let val = (is_pre ? pre_ov.value : bet_obj_ov) / 100000,
      hsw = value_show.value.hps[0].hsw;

    if (get_is_champion.value) {   //冠军玩法不支持赔率转化
      hsw = '1'
    }

    let S = compute_value_by_cur_odd_type(val, null, hsw, null, value_show.value.csid);
    return S ? S : '';
  }
})
// 单关投注成功后的bet接口返回的数据
const bet_success_obj = computed(() => {
  return props.order_detail_resp_list.find(item => {
    if (pre_order_status) {
      if (pre_or_bet === 0 || pre_or_bet) {
        order_status.value = item.preOrderDetailStatus;
      } else {
        order_status.value = item.orderStatusCode;
      }
      return true
    }
    let flag = item.playOptionsId == bet_obj_item.cs.oid
    if (flag) {
      order_status.value = item.orderStatusCode;
    }
    return flag
  }) || ''
})
// 展示欧洲盘还是香港盘
const hptype = computed(() => {
  let type = 'EU'
  if (BetData.cur_odd == 'HK' && lodash.get(value_show.value, 'hps[0].hsw').includes('2')) {
    type = 'HK'
  }
  return type
})

/** --------------------------computed结束 ---------------*/

/** --------------------------事件开始 ---------------*/

// ...mapMutations(["set_pre_market_data","set_keyboard_show","set_odds_change","set_active_index", "set_bet_status", "set_change_list", "set_invalid_ids", "set_order_ing", "set_order_los", "set_money_total"]),
// 格式化比分
const calc_bifen2 = (value) => {
  return '(' + String(value).replace(':', '-') + ')';
}

const calc_mixcount = () => {
  console.error(111)
}
//长按事件（起始）
const gtouchstart = (type) => {
  if (type == 1) {
    return reduce_odd
  } else if (type == 2) {
    return add_odd
  } else if (type == 3) {
    return reduce_market_value
  } else if (type == 4) {
    return add_market_value
  }
}
//展示栏点击事件
const handleonmousedown = () => {
  set_active_index('')
  set_keyboard_show(false)
}


let emitters_off
//生成事件监听 
const handle_generat_emitters = () => {
  let event_pairs = [


    { type: MITT_TYPES.EMIT_REMOVE_INVALID_, callback: reomve_invalid_handle },
    { type: MITT_TYPES.EMIT_C201_UPDATE2, callback: c201_update2_handle },
    { type: MITT_TYPES.EMIT_CHANGE_ODDS, callback: change_odds_handle },
    { type: MITT_TYPES.EMIT_CHANGE_MARKET, callback: change_market_handle },

  ]
  let obj = useMittEmitterGenerator(event_pairs)
  emitters_off = obj.emitters_off

}

/**
 *@description 赔率改变事件
 *@param {Number} new_odds 最新赔率
 */
const change_odds_handle = (new_odds) => {
  pre_odds.value = new_odds || 0
  const hswObj = value_show.value.hps[0].hsw
  if (BetData.cur_odd == 'HK' && hswObj && hswObj.split(',').includes('2')) {
    pre_ov.value = Number($mathjs.multiply(acc_add(1, new_odds), 100000))
  } else {
    pre_ov.value = Number($mathjs.multiply(new_odds, 100000))
  }
}
const change_market_handle = (new_market) => {
  pre_market_value.value = new_market || ''
}
// 将当前活动项的赔率传递给键盘
const send_odds_to_keyboard = () => {
  useMittEmit(MITT_TYPES.EMIT_SEND_PRE_ODDS, { odds_value: pre_odds.value || odds_value(true) })
}
// 将当前活动项的盘口传递给键盘
const send_market_to_keyboard = () => {
  useMittEmit(MITT_TYPES.EMIT_SEND_PRE_MARKET, { odds_value: pre_market_value.value })
}
//点击盘口输入框，光标聚焦
const focus_market = () => {
  // if(valu e_show.csid == 2 && ['Over','Under'].includes(lodash.get(value_show.value,'hps[0].hl[0].ol[0].ot'))){
  if (value_show.value.csid == 2) {
    market_value_unit.value = 1
    set_keyboard_show(true)
    let ele = bet_mix_detail.value
    ele && ele.scrollIntoView({ block: "nearest" })
    if (BetData.active_index == 'market' + index_) { return }
    send_market_to_keyboard()
    set_active_index('market' + index_)
  }
}
//点击赔率输入框，光标聚焦
const focus_odds = () => {
  market_value_unit.value = 0
  set_keyboard_show(true)
  let ele = bet_mix_detail.value
  ele && ele.scrollIntoView({ block: "nearest" })
  if (BetData.active_index == 'pre' + index_) { return }
  send_odds_to_keyboard()
  set_active_index('pre' + index_)
}
const flicker_ = () => {    //光标闪动，animation有兼容问题，用函数替代
  clearInterval(flicker_timer.value)
  flicker_timer.value = setInterval(() => {
    let ele = !market_value_unit.value ? money_span.value : money_span_market.value

    if (ele) {
      ele.classList.toggle('money-span3')
    }
  }, 700);
}
/**
*@description 删除一个投注项
*@param {String} id_ 投注项id或者坑位id
*@return {Undefined} undefined
*/
const remove_ = (id_) => {
  //校验是否是串关，并且删除后是否小于最小串关数量
  if (BetData.bet_is_mix && !vilidata_mix_count(true)) { return }
  let _money = view_ctr_obj[id_].money
  if (_money >= 0.01 && BetData.bet_list.length > 1) {
    set_money_total(0 - _money)
  }
  set_change_list({ value: id_, status: 2 });
  set_invalid_ids({ type: 2, val: value_show.value.mid })
  remove_item(id_);
}
/**
 *@description 点击预约投注icon事件
 *@param del 当为false时表示删除，默认为true
 */
const handlePre = (del) => {
  //将预约状态更新至投注项缓存
  if (show_pre.value.value && del) { return }
  let bet_obj = lodash.cloneDeep(view_ctr_obj)
  pre_odds.value = ''
  bet_obj[props.name_].show_pre.value.value = del
  if (del) {
    fetch_pre_limit_money_and_odd_info()
    pre_ov.value = Number(bet_obj_ov)
    low_odds.value = Number(bet_obj_ov)
    pre_market_value.value = bet_obj_hv
    // 清空单关多项其他金额以及总金额
    Object.keys(bet_obj).map((key) => {
      if (key != props.name_) {
        bet_obj[key].money = 0
        bet_obj[key].full_bet = 0
      } else {
        bet_obj[key].pre_odds = pre_ov.value
        bet_obj[key].pre_market_value = pre_market_value.value
      }
    })
  } else {
    fetch_limit_money_and_odd_info()
    delete bet_obj[props.name_].pre_odds
    delete bet_obj[props.name_].pre_market_value
    delete bet_obj[props.name_].min_odds
    set_pre_market_data([])
  }
  set_bet_obj(bet_obj)
  set_active_index(index_)
}
/**
 *@description 预约投注点击减号减少赔率
 */
const reduce_odd = () => {
  timeOutEvent = 0;
  if (pre_shadow_flag) { return }
  pre_odds.value = ''
  if (BetData.active_index != 'pre' + index_) {
    send_odds_to_keyboard()
    set_active_index('pre' + index_)
  }
  if (pre_ov.value <= 101000) { return }
  const reduceValue = pre_ov.value - 1000
  pre_ov.value = reduceValue
}
/**
 * @description 预约投注点击加号增加赔率
 */
const add_odd = () => {
  if (BetData.active_index != 'pre' + index_) {
    send_odds_to_keyboard()
    set_active_index('pre' + index_)
  }
  const hswObj = value_show.value.hps[0].hsw
  if (BetData.cur_odd == 'HK' && hswObj && hswObj.split(',').includes('2')) {//香港盘的最大赔率
    if (pre_ov.value >= 35600000) { return }
  } else {//欧洲盘的的最大赔率
    if (pre_ov.value >= 35500000) { return }
  }

  pre_odds.value = ''
  pre_ov.value = acc_add(pre_ov.value, 1000)
}
/**
 * @description 预约投注点击减号减少盘口值
 */
const reduce_market_value = () => {
  if (show_market_shadow) {
    set_toast({ 'txt': i18n_t('pre_record.market_error_info'), hide_time: 3000 });
    return
  }
  let realValue = ''
  //足球让球类盘口值计算
  if (rq_play_list.includes(value_show.value.hps[0].hpid)) {
    if (pre_market_value.value == '-' || pre_market_value.value == '+' || !pre_market_value.value) {
      pre_market_value.value = '0'
    }
    const split_value = lodash.words(pre_market_value.value || '0', /[^+,/ ]+/g)
    if (split_value.length > 1) {
      if (split_value[0].indexOf('-') > -1) {
        realValue = ((+split_value[0] - (+split_value[1]))) / 2 - market_value_unit.value
      } else {
        realValue = ((+split_value[0] + (+split_value[1]))) / 2 - market_value_unit.value
      }
      realValue = realValue > 0 ? ('+' + realValue) : realValue
    } else {
      if (split_value[0].indexOf('-') > -1) {
        const withValue = (+split_value[0] - 0.5)
        if (value_show.value.csid == 1) {
          realValue = split_value[0] + '/' + Math.abs(withValue)
        } else {
          realValue = withValue
        }
      } else {
        if (split_value[0] == 0) {
          const withValue = (+split_value[0] - 0.5)
          if (value_show.value.csid == 1) {
            realValue = '-0' + '/' + Math.abs(withValue)
          } else {
            realValue = -0.5
          }
        } else {
          const withValue = (+split_value[0] - 0.5)
          if (value_show.value.csid == 1) {
            realValue = (withValue >= 0 ? '+' : '') + withValue + '/' + split_value[0]
          } else {
            realValue = (withValue >= 0 ? '+' : '') + withValue
          }

        }

      }
    }
  } else {//大小类盘口值计算
    const split_value = lodash.words(pre_market_value.value || '0', /[^/ ]+/g)
    if (split_value.length > 1) {
      realValue = ((+split_value[0] + (+split_value[1]))) / 2 - market_value_unit.value
    } else {
      //如果当前值为0，不操作
      if (split_value[0] == 0) {
        return
      }
      const withValue = (+split_value[0] - 0.5)
      if (value_show.value.csid == 1) {
        realValue = withValue + '/' + split_value[0]
      } else {
        realValue = withValue
      }
    }
  }
  if (realValue == '+0' || realValue == '-0') {
    realValue = '0'
  }
  pre_market_value.value = realValue
  if (BetData.active_index == 'market' + index_) {
    send_market_to_keyboard()
  }
}
/**
 * @description 预约投注点击加号增加盘口值
 */
const add_market_value = () => {
  if (show_market_shadow_max) {
    set_toast({ 'txt': i18n_t('pre_record.market_error_info_max'), hide_time: 3000 });
    return
  }
  let realValue = ''
  if (pre_market_value.value == '-' || pre_market_value.value == '+' || !pre_market_value.value) {
    pre_market_value.value = '0'
  }
  if (rq_play_list.includes(lodash.get(value_show.value, 'hps[0].hpid'))) {
    const split_value = lodash.words(pre_market_value.value || '0', /[^+,/ ]+/g)
    if (split_value.length > 1) {
      if (split_value[0].indexOf('-') > -1) {
        realValue = acc_add(((+split_value[0] - (+split_value[1]))) / 2, market_value_unit.value)
      } else {
        realValue = acc_add(((+split_value[0] + (+split_value[1]))) / 2, market_value_unit.value)
      }
      realValue = realValue > 0 ? ('+' + realValue) : realValue
    } else {
      if (split_value[0].indexOf('-') > -1) {
        const withValue = acc_add(+split_value[0], 0.5)
        if (value_show.value.csid == 1) {
          realValue = (withValue == 0 ? '-' : '') + withValue + '/' + Math.abs(split_value[0])
        } else {
          realValue = (withValue == 0 ? '-' : '') + withValue
        }
      } else {
        const withValue = (+split_value[0] + 0.5)
        if (value_show.value.csid == 1) {
          realValue = '+' + split_value[0] + '/' + withValue
        } else {
          realValue = '+' + withValue
        }
      }
    }
  } else {//大小类盘口值计算
    const split_value = pre_market_value.value ? lodash.words(pre_market_value.value, /[^/ ]+/g) : '0'
    if (split_value.length > 1) {
      realValue = acc_add(((+split_value[0] + (+split_value[1]))) / 2, market_value_unit.value)
    } else {
      const withValue = acc_add(+split_value[0], 0.5)
      if (value_show.value.csid == 1) {
        realValue = +split_value[0] + '/' + withValue
      } else {
        realValue = withValue
      }
    }
  }
  if (realValue == '+0' || realValue == '-0') {
    realValue = '0'
  }
  pre_market_value.value = realValue
  if (BetData.active_index == 'market' + index_) {
    send_market_to_keyboard()
  }
}
/**
 *@description 点击移除无效注单
 *@return {Undefined} undefined
 */
const reomve_invalid_handle = () => {
  // 如果是封盘或者关盘或者不支持串关，则删除对应投注项
  if (
    [1, 2].includes(+bet_obj_hs) ||
    [2, 3].includes(+bet_obj_os) ||
    [1, 2].includes(+bet_obj_mhs) ||
    bet_obj_ov < 101000 ||
    hids
  ) {
    remove_(value_show.value.id_)
  }
}
// 单关单注成功和单关多注消息处理
const c201_update2_handle = ({ isOddsChange, newTotalMaxWinAmount, orderNo, orderOddsVos, status } = {}) => {
  if (orderNo != bet_obj_item.orderno) return

  if (status == 1) {  // 成功
    if (
      isOddsChange &&
      orderOddsVos &&
      orderOddsVos[0] &&
      bet_obj_item.cs.oid == orderOddsVos[0].oid
    ) {
      bet_success_obj.oddsValues = orderOddsVos[0].ov
      bet_success_obj.maxWinMoney = newTotalMaxWinAmount * 100
    }
    order_status.value = 1
  } else if (status == 2) {  // 失败
    if (get_new_bet && BetData.bet_list.length == 1) {  // 单关新流程时记录失败的订单号
      set_order_los(orderNo)
      set_bet_status(1);
      set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
      tips_msg_update(i18n_t('bet.err_msg03'))
    }
    order_status.value = 0
  }
  if ([1, 2].includes(+status)) {
    set_order_ing({ change_: 0, value_: orderNo })
  }
}
// 查询订单信息接口响应数据处理， 对于串关投注，只需要在这里更新赔率就行
const query_order_obj_handle = (val) => {
  if (!Array.isArray(val)) return;

  for (const item of val) {
    // 去2个地方找注单号
    if (
      !([bet_obj_item.orderno + '', get_order_no.value + ''].includes(item.orderNo + '') ||
        BetData.bet_is_mix && BetData.bet_list.length > 1
      )
    ) {
      continue
    }

    if (item.status == 0) {  //投注成功,更新赔率和最高可赢
      order_status.value = 1
      bet_success_obj.maxWinMoney = item.newMaxWinAmount

      if (
        item.isOddsChange &&
        item.oddsChangeList &&
        item.oddsChangeList.length
      ) {
        item.oddsChangeList.forEach(item1 => {
          if (item1.playOptionsId == lodash.get(bet_obj_item, 'cs.oid')) {
            bet_success_obj.oddsValues = item1.usedOdds
          }
        })
      }
    } else if (item.status == 4) {   //投注失败
      if (get_new_bet && BetData.bet_list.length == 1) {  // 单关新流程时记录失败的订单号
        set_order_los(item.orderNo)
        set_bet_status(1);
        set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
        tips_msg_update(i18n_t('bet.err_msg03'))
      }
      order_status.value = 0
    }
    if ([0, 4].includes(+item.status)) {
      set_order_ing({ change_: 0, value_: item.orderNo })
    }
  }
}
// 清除当前组件所有定时器
const clear_timer = () => {
  // timeout定时器列表
  const timeout_timer_arr = [
    'timer',
    'timer2',
    'timer3',
  ]

  // interval定时器列表
  const interval_timer_arr = [
    'flicker_timer'
  ]

  // 批量清除timeout定时器
  for (const timer of timeout_timer_arr) {
    clearTimeout(this[timer])
    this[timer] = null
  }

  // 批量清除interval定时器
  for (const timer of interval_timer_arr) {
    clearInterval(this[timer])
    this[timer] = null
  }
}




/** --------------------------事件结束 ---------------*/


// onUnmounted(() => {
//   clear_timer()





//   for (const key in $data) {
//     $data[key] = null
//   }

//   //移除相应监听事件 //视图销毁钩子函数内执行
//   if (emitters_off) { emitters_off() }


// })


</script>
<style lang="scss" scoped>
.bet-mix-show {
  position: relative;
  line-height: 1.2;
}

/* ************** 失效蒙层 ************** -S */
.locked-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}

/* ************** 失效蒙层 ************** -E */

.content-t {
  line-height: 0.2rem;
}

.dele-left {
  z-index: 2;
  width: 0.14rem;
  height: 0.14rem;

  img {
    width: 99%;
    height: 99%;
  }
}

.pankou-change {
  border-radius: 2px;
  padding-left: 0.02rem;
  padding-right: 0.02rem;
}

/* ************** 红升绿降 ************** -S */
.odd-change {
  display: inline-block;
  width: 0.06rem;
  height: 0.1rem;
  background-repeat: no-repeat;
  background-size: contain;

  &.green-down {
    background-image: var(--q-color-com-img-bg-18);
  }

  &.red-up {
    background-image: var(--q-color-com-img-bg-19);
  }
}

/* ************** 红升绿降 ************** -E */
.invalid-span {
  border-radius: 2px;
  text-align: center;
  width: 0.4rem;
  line-height: 0.2rem;
  font-size: 0.13rem;
  margin-right: 0.1rem;
  height: min-content;
}

.invalid-span2 {
  border-radius: 2px;
  max-width: 1.1rem;
  line-height: 0.2rem;
  font-size: 0.13rem;
  height: min-content;
}

.xia {
  line-height: 1.2;
  font-size: 0.14rem;

  .pre-text {
    margin-right: 0.1rem;
  }
}

/* ************** 预约投注按钮 ************** -S */
.flex-end {
  align-items: flex-end;
}

.subscribe-button {
  width: 0.58rem;
  height: 0.22rem;
  border-radius: 0.14rem;
  font-size: 0.13rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-right: 0.1rem;
}

/* ************** 预约投注按钮 ************** -E */

/* ************** 预约投注操作栏 ************** -S */
.subscribe-wrap {
  margin-top: 0.12rem;

  .operation-line {
    margin: 0 12px 12px 12px;
    height: 1px;
  }
}

.subscribe-operation {
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.12rem 0.28rem;
  justify-content: space-between;

  .label {
    font-size: 14px;
    width: 0.62rem;
    max-width: 0.62rem;
  }

  .operation {
    width: 1.8rem;
    height: 0.32rem;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .odd {
      flex: 1;
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;

      .odd_text {
        height: 0.16rem;
      }

      .money-span {
        // position: absolute;
        // top: 50%;
        // right: 0.08rem;
        width: 0.02rem;
        height: 0.16rem;
        margin-left: 0.05rem;
      }
    }

    .reduce,
    .add {
      width: 0.3rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        pointer-events: none;
        width: 0.11rem;
        height: auto;
      }
    }

    .shadow-show {
      opacity: 0.4;
    }
  }

  .delete {
    width: 0.13rem;

    img {
      width: 100%;
      height: auto;
    }
  }

}

/* ************** 预约投注操作栏 ************** -E */

/* ************** 投注完成后的颜色展示 ************** -S */
.img0 {
  margin-right: 0.06rem;
  width: 0.158rem;
  vertical-align: -3px;
}

.img1 {
  transform: rotate(0);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(1turn);
  }
}

/* ************** 投注完成后的颜色展示 ************** -E */
.line {
  height: 1px;
  transform: scaleY(0.5);
}
</style>