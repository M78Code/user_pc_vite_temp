<!--
 * @Author: Router
 * @Description: 虚拟体育、电竞和冠军玩法的投注弹框
-->
<template>
  <div class="bet-mix-box-child1">
    <!-- 多注顶部蒙层 -->
    <div class="full-shadow" @click.self="pack_up" @touchmove.prevent></div>
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fixed full-shadow2" @touchmove.prevent></div>

    <div class="content-box">
      <!-- 头部 -->
      <bet-bar @click.native="pack_up"></bet-bar>

      <!-- 中间可滚动区域 -->
      <div class="scroll-box" ref="scroll_box" :style="{ 'max-height': `${max_height1}px` }"
        @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
        <!-- 上部纯展示组件 -->
        <div v-for="(value, name) in get_bet_obj" :key="name" class="mix-show-box">
          <!-- 虚拟体育 -->
          <template v-if="get_menu_type == 900">
            <bet-mix-show2 :name_="name" :order_detail_resp_list="order_detail_resp_list" :odds_value2="odds_value2"
              :play_optionname2="play_optionname" :playname2="playname2"></bet-mix-show2>
          </template>
          <!-- 非虚拟体育 -->
          <template v-else>
            <bet-mix-show :name_="name" :order_detail_resp_list="order_detail_resp_list"
              :query_order_obj="query_order_obj"></bet-mix-show>
          </template>
        </div>

        <!-- 串关投注成功组件 -->
        <template v-if="btn_show == 1 || mixnew_bet || part_bet">
          <div v-show="btn_show == 1 && !mixnew_bet || part_bet">
            <div v-for="(item, index) in series_order_respList" :key="index">
              <betSuccessBar :item_="item" @update_money="update_money" :query_order_obj="query_order_obj"
                :len='series_order_respList.length'></betSuccessBar>
            </div>
          </div>
        </template>

        <!-- 单关 -->
        <template v-if="get_bet_list.length == 1">
          <template v-if="get_bet_success">
            <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
            <div class="row justify-between yb_px14 yb_fontsize14 yb_mb8 bottom-bar">
              <p><span>{{ $root.$t('bet_record.bet_max_win') }}</span><span class="yb_fontsize14 yb_ml8 bottom-bar-sp">{{
                (max_winmoney / 100).toFixed(2) }}</span></p>
              <p><span>{{ $root.$t('bet.bet_val') }}</span><span class="yb_fontsize14 yb_ml8 bottom-bar-sp2">{{ (bet_money
                / 100).toFixed(2) }}</span></p>
            </div>
          </template>
          <template v-else>
            <!-- 单关金额输入框 -->
            <bet-single-detail ref="bet_single_detail" :tips_msg.sync="tips_msg"
              :name_="get_bet_list[0]"></bet-single-detail>
          </template>
        </template>

        <!-- 串关主体 金额输入框-->
        <template v-if="get_bet_list.length != 1 && ![3, 6].includes(+get_bet_status)">
          <bet-mix-detail :value_="item" :index_="index" v-for="(item, index) of get_s_count_data" :key="index"
            :tips_msg.sync="tips_msg"></bet-mix-detail>
        </template>

        <!-- 串关投注完成后底部的显示 先注释掉，需要用到再放开-->
        <!-- <template v-if="btn_show == 1 && series_order_respList.length > 1 || mixnew_bet"> -->
        <!-- <template v-if="0">
          <div v-show="btn_show == 1 && series_order_respList.length > 1 && !mixnew_bet" class="row order-ok yb_px14 yb_py8 yb_fontsize14">
            <div class="col-6">
              <span style="font-weight:600">{{ $root.$t('bet_record.total_winable_amount') }}</span>
              <p class="yb_fontsize18 moey-p">{{(max_win_money_total/100).toFixed(2)}}</p>
            </div>
            <div class="col-6 text-right">
              <span style="font-weight:600">{{ $root.$t('bet_record.total_bet_amount') }}</span>
              <p class="yb_fontsize18 moey-p2">{{(bet_money_total/100).toFixed(2)}}</p>
            </div>
          </div>
        </template> -->
      </div>

      <!-- 提示信息 -->
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
          :style="{ 'min-height': [3, 6, 8].includes(+get_bet_status) ? '0.38rem' : '0.3rem' }" @touchmove.prevent
          @click="nothing">
          <template v-if="tips_msg"><span class="text-center yb_py4">{{ (tips_msg) }}</span></template>
          <template v-else-if="!tips_msg && [1, 2, 7].includes(+get_bet_status)">
            <!-- 左 -->
            <i class="img2" :class="{ 'img3': get_is_accept != 2 }" @click="toggle_accept"></i>
            <span :class="{ 'auto-text': get_is_accept == 2, 'ac-rules': get_bet_list.length > 1 }" class="yb_mx4"
              style="max-width:1.6rem" @click="toggle_accept">{{ $root.$t("ac_rules.auto") }}</span>
            <img src="image/wwwassets/bw3/svg/rules2.svg" @click="change_accept" class="img1"
              v-if="get_theme.includes('theme01')" />
            <img src="image/wwwassets/bw3/svg/rules3.svg" @click="change_accept" class="img1" v-else />
            <!-- 右 -->
            <span v-if="get_bet_list.length == 1">
              <i class="img2" :class="{ 'img3': get_used_money != 0 }" @click="change_used_money"></i>
              <span class="yb_ml4" :class="get_used_money == 0 && 'auto-text'" @click="change_used_money">{{
                $root.$t('bet.used_money2') }}</span>
            </span>
            <span @click.stop="spread_options"
              :class="{ 'opacity-m': get_bet_list.length == 2 || get_s_count_data.length == 1, 'col-5 text-right': get_bet_list.length > 1 }"
              v-else>
              {{ get_is_spread ? $root.$t('bet.msg04') : $root.$t('bet.msg05') }}
              <i class="arrow" :class="{ 'arrow2': !get_is_spread }"></i>
            </span>
          </template>
        </div>
      </template>

      <key-board v-show="get_keyboard_show"></key-board>

      <!-- 底部按钮 -->
      <div class="row yb_px10 yb_pb8 justify-between" @touchmove.prevent>
        <!-- 左边 -->
        <div class="add-box" :class="{ 'add-box2': get_bet_list.length >= 2 || get_bet_success, 'add-box3': calc_class }"
          @click.stop="pack_up(2)">
          <template v-if="!get_bet_success">
            <span v-if="get_bet_list.length > 1">{{ $root.$t('bet.delete_all') }}</span>
            <span class="kushikatsu-text" v-else>
              {{ $root.$t('bet.kushikatsu') }}
              <i class="bet-add"></i>
            </span>
          </template>
          <template v-else>
            <span>{{ $root.$t('bet.save') }}</span>
          </template>
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
import betMixShow from './bet_mix_show.vue';
import betMixShow2 from './bet_mix_show2.vue';
import betMixDetail from './bet_mix_detail.vue';
import betSingleDetail from './bet_single_detail.vue';
import betSuccessBar from './bet_success_bar.vue';
// import betting from 'src/project/mixins/betting/betting.js';
import keyBoard from './keyboard.vue';
import ballSpin from './ball_spin.vue';
import betBar from "./bet_bar.vue";
// import utils from 'src/public/utils/utils.js';
// import { api_betting } from "src/project/api/index.js";
import {useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt/"
import store from "src/store-redux/index.js";

const btn_show = ref(0)  //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
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
const is_loading_balance = ref(false)  // 金额刷新中？

const store_state = store.getState()
const get_update_tips = ref(store_state.get_update_tips)
const get_odds_change = ref(store_state.get_odds_change)
const get_mix_bet_flag = ref(store_state.get_mix_bet_flag)
const get_money_total = ref(store_state.get_money_total)
const get_s_count_data = ref(store_state.get_s_count_data)
const get_bet_list = ref(store_state.get_bet_list)
const get_is_accept = ref(store_state.get_is_accept)
const get_order_ing = ref(store_state.get_order_ing)
const get_is_spread = ref(store_state.get_is_spread)
const get_is_mix = ref(store_state.get_is_mix)
const get_current_menu = ref(store_state.get_current_menu)
const get_m_id_list = ref(store_state.get_m_id_list)
const get_bet_status = ref(store_state.get_bet_status)
const get_money_notok_list = ref(store_state.get_money_notok_list)
const get_user = ref(store_state.get_user)
const get_detail_data = ref(store_state.get_detail_data)
const get_is_show_settle_tab = ref(store_state.get_is_show_settle_tab)
const get_change_list = ref(store_state.get_change_list)
const get_active_index = ref(store_state.get_active_index)
const get_keyboard_show = ref(store_state.get_keyboard_show)
const get_new_bet = ref(store_state.get_new_bet)
const get_order_los = ref(store_state.get_order_los)
const get_bet_obj = ref(store_state.get_bet_obj)
const get_order_suc = ref(store_state.get_order_suc)
const get_money_notok_list2 = ref(store_state.get_money_notok_list2)
const get_theme = ref(store_state.get_theme)
const get_used_money = ref(store_state.get_used_money)
const get_is_champion = ref(store_state.get_is_champion)
const get_invalid_ids = ref(store_state.get_invalid_ids)
const get_cannot_mix_len = ref(store_state.get_cannot_mix_len)
const get_order_no = ref(store_state.get_order_no)
const get_bet_success = ref(store_state.get_bet_success)


const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
   const new_state = store.getState()
   get_update_tips.value = new_state.get_update_tips
   get_odds_change.value = new_state.get_odds_change
   get_mix_bet_flag.value = new_state.get_mix_bet_flag
   get_money_total.value = new_state.get_money_total
   get_s_count_data.value = new_state.get_s_count_data
   get_bet_list.value = new_state.get_bet_list
   get_is_accept.value = new_state.get_is_accept
   get_order_ing.value = new_state.get_order_ing
   get_is_spread.value = new_state.get_is_spread
   get_is_mix.value = new_state.get_is_mix
   get_current_menu.value = new_state.get_current_menu
   get_m_id_list.value = new_state.get_m_id_list
   get_bet_status.value = new_state.get_bet_status
   get_money_notok_list.value = new_state.get_money_notok_list
   get_user.value = new_state.get_user
   get_detail_data.value = new_state.get_detail_data
   get_is_show_settle_tab.value = new_state.get_is_show_settle_tab
   get_change_list.value = new_state.get_change_list
   get_active_index.value = new_state.get_active_index
   get_keyboard_show.value = new_state.get_keyboard_show
   get_new_bet.value = new_state.get_new_bet
   get_order_los.value = new_state.get_order_los
   get_bet_obj.value = new_state.get_bet_obj
   get_order_suc.value = new_state.get_order_suc
   get_money_notok_list2.value = new_state.get_money_notok_list2
   get_theme.value = new_state.get_theme
   get_used_money.value = new_state.get_used_money
   get_is_champion.value = new_state.get_is_champion
   get_invalid_ids.value = new_state.get_invalid_ids
   get_cannot_mix_len.value = new_state.get_cannot_mix_len
   get_order_no.value = new_state.get_order_no
   get_bet_success.value = new_state.get_bet_success
}


/** --------------------------onmounted开始 ---------------*/
onMounted(() => {
  timer = null;
  timer2 = null;
  timer3 = null;
  timer_count = null;
  timer_count_1 = null;
  timer_count_2 = null;
  //高度计算
  let rem_1 = window.innerWidth * 100 / 375;
  max_height1.value = window.innerHeight - rem_1 * 3.9


  set_is_spread(false);
  // 5秒计时
  clearTimeout(timer)
  timer = setTimeout(() => {
    is_5s.value = true;
  }, 5000);

  //获取最大最小金额
  fetch_limit_money();
  if (+get_menu_type !== 900) {
    check_odds_beforebet2.value();    //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
  }

  set_new_bet(false)

  scroll_box_ele.value = $refs.scroll_box
})

/** --------------------------onmounted结束 ---------------*/
//单关的数据对象
const single_item = computed(() => {
  if (get_bet_list.value[0]) {
    return get_bet_obj.value[get_bet_list.value[0]].bs
  } else {
    return {}
  }
})
//是否有重复的球员id或者球队id
const is_conflict = computed(() => {
  return !(_.uniq(get_m_id_list.value).length == get_m_id_list.value.length)
})

// 是否展示不支持串关提示
const is_conflict2 = computed(() => {
  let flag =
    (get_cannot_mix_len.value || get_invalid_ids.value.length) &&
    get_bet_list.value.length > 1 &&
    ![900, 3000].includes(+get_menu_type)

  if (flag) {
    btn_show.value = 5
  } else if (get_bet_status.value == 1) {
    btn_show.value = 0
  }
  return flag
})
//串关新流程且在注单确认中
// const   mixnew_bet = computed(()=>{
//   get() {
//     return get_new_bet.value && get_is_mix.value
//   }
// }
//计算样式，下面几种情况左下角按钮需要置灰不让点击
const calc_class = computed(() => {
  let flag = [2, 4].includes(+get_bet_status.value)
    || get_is_champion.value(this) && !get_bet_success.value
    || get_bet_status.value == 5 && get_bet_list.value.length == 1
    || get_menu_type == 3000 && _.get(single_item, 'hps[0].hl[0].hipo') != 1 && !get_bet_success.value
    || get_menu_type != 3000 && _.get(single_item, 'hps[0].hids') == 0 && !get_bet_success.value
    || btn_show.value == 5;
  return flag
})
//是否进入串关部分投注成功流程
const part_bet = computed(() => {
  return get_order_los.value.length && get_order_suc.value.length && !get_order_ing.value.length
})

/** --------------------------watch开始 ---------------*/
watch(() => get_update_tips.value, (new_) => {
  tips_msg = new_
})

watch(() => get_money_notok_list2.value.length, (new_) => {
  if (!new_ && !get_money_notok_list.value.length && get_bet_list.value.length > 2) {
    tips_msg = ''
  }
})

/**
   *@description 监听确认中的订单号数量
  *@return {Undefined} undefined
*/
watch(() => get_order_ing.value.length, (new_, old_) => {
  if (new_ == 0 && old_) {
    if (get_order_los.value.length) {  //所有订单确认时，如果新流程有失败的订单回到状态1
      series_order_respList.value = series_order_respList.value.filter(item => {
        return get_order_suc.value.includes(item.orderNo)
      }, this)

      let s_count_data = get_s_count_data.value.filter(item => {
        return get_order_los.includes(item.orderno) || item.money == 0
      })

      let money_remain = s_count_data.reduce((pre, cur) => {
        return pre + cur.money * cur.count
      }, 0)

      // 同步程序走完后再设置总金额
      $nextTick(() => {
        set_money_total('clear_')
        set_money_total(money_remain)
      })

      set_s_count_data(s_count_data)
      set_bet_status(1);

      if (is_new_bet.value) {
        if (!tips_msg) {
          tips_msg = $root.$t('bet.err_msg03')  //新流程queryOrderStatus 接口返回的投注失败提示语先写死
        }
        check_odds_beforebet2.value();  //重新拉取投注前校验盘口信息接口
        need_bet_again.value = true
        set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
      }
    } else {
      set_bet_status(3);
    }
    set_new_bet(false)
  }
})

watch(() => get_odds_change.value, (new_) => {
  if (new_) {
    set_bet_status(5);
    tips_msg = $root.$t('bet.msg08')
  } else {
    tips_msg = ''
  }
})

watch(() => get_change_list.value.length, (new_, old_) => {
  if (new_ == 0 && old_ > 0 && get_bet_status.value == 5) {
    agree_change();
  }
})

watch(() => get_bet_status.value, (new_) => {
  switch (new_) {
    case 1:
      set_new_bet(false)
    case 7:
      btn_show.value = 0;
      break;
    case 2:
      btn_show.value = 2;
      tips_msg = '';

      clearTimeout(timer2)
      timer2 = setTimeout(() => {    // 10秒没有code码返回，红字提示网络异常,点击确定移除投注项
        if (!exist_code.value) {
          exist_code.value = '666'
          if (get_bet_list.value.length) {
            set_bet_status(1);
            tips_msg = $root.$t('bet.err_msg13');
          }
        }
      }, 10000);

      break;
    case 3:
    case 8:
      tips_msg = '';
      set_keyboard_show(false)
    case 4:
      btn_show.value = 1;
      clearTimeout(timer_count_2);
      timer_count_2 = null;
      break;
    case 6:
      btn_show.value = 1;
      set_keyboard_show(false)
      break;
    case 5:
      if (get_invalid_ids.value.length) {  // 有投注项失效时优先显示失效
        btn_show.value = 5
      } else if (need_bet_again.value) {  // 没有失效需要二次投注时显示“接受变化并投注”
        btn_show.value = 4
      } else {
        btn_show.value = 3;  // 接受变化
      }
      break;
    default:
      break;
  }
})


/** --------------------------watch结束 ---------------*/

// 去注单记录页查看
const go_record = () => {
  set_bet_list([])
  useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
}
/**
 * 切换是否接受更好赔率
 */
const toggle_accept = () => {
  set_is_accept()
  $forceUpdate()
},
/**
 * 切换是否使用常用金额
 */
const change_used_money = () => {
  set_used_money(null)
  $forceUpdate()
}

/**
 *@description 点击添加比赛、顶部蒙层、向下箭头、确定和完成
 *@param {Number} val 点击的哪个按钮，2代表是投注框左下角按钮
 */
const pack_up = (val) => {
  if ([0, 2].includes(+get_bet_status.value)) { return };  //投注提交中不能点击

  if (val == 2 && calc_class) {   // 有些情况(冠军玩法、单关失效...)不能点击串关+
    return
  }

  // 保留选项
  if (val == 2 && get_bet_success.value) {
    set_keyboard_show(true)
    set_is_spread(false);
    tips_msg = ''
    clear_single_money()
    set_bet_status(1)
    set_money_total('clear_')
    set_active_index(0)
    clearInterval(timer_count)
    clearTimeout(timer_count_1)
    return
  }

  // 冠军玩法没有串关，清空数据处理
  if (get_is_champion.value(this)) {
    set_bet_list([]);
    return
  }

  // 删除全部
  if (val == 2 && get_bet_list.value.length >= 2) {
    set_bet_list([]);
    return
  }

  //串关+
  if (val == 2 && get_bet_list.value.length == 1) {
    set_bet_status(0);
    set_is_mix(true)
  }

  if (
    get_is_mix.value && [1, 5, 7].includes(+get_bet_status.value)
  ) {
    set_bet_status(0);
    return
  }

  // 投注后点击蒙层，X ，或者确定直接删除，或者单关点蒙层
  if (
    [3, 4, 6, 8].includes(+get_bet_status.value) ||
    get_bet_list.value.length == 1 && val != 2
  ) {
    set_bet_list([]);
    return
  }
}
/**
 *@description 单关投注后，c201消息的处理
 *@param {Array} : newTotalMaxWinAmount - 最高可赢金额， ov - 赔率， emit_http - 触发哪些接口请求， msg - 提示消息
 */
const c201_update_handler1 = ([newTotalMaxWinAmount, ov, emit_http, msg]) => {
  //emit_http 是1或者2时都是投注失败
  if (emit_http == 1) {
    msg && (tips_msg = msg)
    // 重新拉取投注前校验盘口信息接口
    if (check_odds_beforebet2.value) {
      check_odds_beforebet2.value()
    } else {
      check_odds_beforebet()
    }
    need_bet_again.value = true
    set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
  } else if (emit_http == 2) {
    msg && (tips_msg = msg)
    // 重新拉取投注前校验盘口信息接口
    if (check_odds_beforebet2.value) {
      check_odds_beforebet2.value()
    } else {
      check_odds_beforebet()
    }
    need_bet_again.value = true
    set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
    fetch_limit_money(); // 更新单关查询最大最小金额
  } else {
    max_winmoney.value = newTotalMaxWinAmount * 100;
    odds_value2.value = ov;
  }
  clearInterval(timer_count);
  timer_count = null;
}
/**
 *@description 串关投注后，c201消息的处理
 *@param {Array} : emit_http - 触发哪些接口请求， msg - 提示消息
 */
const c201_update_handler2 = ([emit_http, msg]) => {
  //emit_http 是1或者2时都是投注失败
  if (emit_http == 1) {
    msg && (tips_msg = msg)
    if (check_odds_beforebet2.value) {
      check_odds_beforebet2.value()
    } else {
      check_odds_beforebet()
    }
    need_bet_again.value = true
    set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
  } else if (emit_http == 2) {
    msg && (tips_msg = msg)
    if (check_odds_beforebet2.value) {
      check_odds_beforebet2.value()
    } else {
      check_odds_beforebet()
    }
    need_bet_again.value = true
    set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
    fetch_limit_money();
  }
  clearInterval(timer_count);
  timer_count = null;
  clearTimeout(timer_count_1);
  timer_count_1 = null;
  // set_new_bet(false)
}
/**
 *@description 展开串关类型
 *@return {Undefined} undefined
 */
const spread_options = () => {
  let ele = scroll_box_ele.value
  if (!ele) { return }

  if (get_bet_list.value.length == 2) { return };

  let ch = ele.clientHeight,
    sh = ele.scrollHeight,
    rem_1 = window.innerWidth * 100 / 375;

  set_is_spread(!get_is_spread.value);
  //设置投注项滚动距离，同步程序走完后再处理逻辑
  $nextTick(() => {
    if (get_is_spread.value) {
      ele.scrollTop = sh + 0.56 * rem_1 - ch;
    } else {
      ele.scrollTop = sh - ch;
    }

  })
}
/**
 *@description 点击移除无效注单
 */
const reomve_invalid = () => {
  useMittEmit(MITT_TYPES.EMIT_REMOVE_INVALID_)
}
/**
 *@description 点击投注
 */
const submit_order = () => {
  if (btn_show.value == 4) {   //接受变化并投注点击时，要先接受变化
    set_odds_change(false);
    set_change_list({ status: 0 });
    if (get_active_index.value == -1) {
      set_active_index(0)
    }
  }
  exist_code.value = ''
  //校验是否是串关，并且删除后是否小于最小串关数量
  if (get_is_mix.value && !vilidata_mix_count()) { return }
  set_order_los([]);
  set_new_bet(false)

  series_order_respList.value = []
  is_new_bet.value = false;
  need_bet_again.value = false

  clearTimeout(timer_count_2);
  timer_count_2 = null;
  clearTimeout(timer_count_1);
  timer_count_1 = null;

  if (get_money_notok_list.value.length || is_conflict) { return };

  // 这种情况放过，让钱投注出去
  let _flag2 = get_money_total.value == get_user.value.balance
  if (get_money_notok_list2.value.length && !_flag2) {
    //点击投注后当输入金额小于最低限额时，默认转化为最低限额。并提示“最小单笔投注金额为 xx.” 3s消失。
    set_money_notok_list({ status: 0 })
    return
  }

  set_active_index(-1);

  if (get_bet_status.value == 7) {   //锁盘
    set_toast({ 'txt': $root.$t('bet.odd_upd') });
    return;
  }

  if (get_money_total.value > +get_user.value.balance || get_user.value.balance == 0) {    //弹窗提示：“余额不足，请您先充值”
    set_toast({ 'txt': $root.$t('bet.err_msg05') });
    return;
  }
  if (get_money_total.value < 0.01) {  //请输入金额
    set_toast({ 'txt': $root.$t('bet.input_v') })
    return;
  }

  //限额获取中,请稍后
  let bet_dom = $refs.bet_single_detail
  let flag = (get_is_mix.value && get_s_count_data.value[0] && !get_s_count_data.value[0].orderMaxPay
    || !get_is_mix.value && bet_dom && !bet_dom.max_money_back) && !is_5s.value
  if (flag) {
    set_toast({ 'txt': $root.$t('bet.err_msg06') });
    return
  }


  if (get_mix_bet_flag.value) {
    mix_bet()  //串关投注
  } else {
    single_bet() //单关投注
  }
}
/**
 *@description 单关投注后的逻辑处理
 *@return {Undefined} undefined
 */
const single_bet = () => {
  submit_betlist((code, data, msg) => {
    if (exist_code.value == '666') { return };  // 10秒没有code码返回状态不做跟新

    exist_code.value = code;

    if (code == 200 && data) {  //投注成功
      order_detail_resp_list.value = data.orderDetailRespList;
      switch (data.orderDetailRespList[0].orderStatusCode) {
        case 0:   //投注失败
          set_bet_status(8);
          break;
        case 1:   //投注成功
          set_bet_status(3);
          break;
        case 2:   //注单确认中(提交成功)
          set_order_no(data.orderDetailRespList[0].orderNo);//记录订单号

          if (data.lock == 1) {   //进入投注新流程
            set_new_bet(true)
            clearTimeout(timer_count_2)
            timer_count_2 = setTimeout(() => {   //25秒还是有订单在确认中，直接给状态让去注单记录中查看
              if (get_new_bet.value) {
                set_bet_status(1);
                mixnew_bet = true;
                tips_msg = $root.$t('bet.err_msg08');
                clearInterval(timer_count)
                timer_count = null;
              }
            }, 25000);
          } else {
            set_bet_status(6);
            tips_msg = $root.$t('bet.err_msg07');
          }
          // 隔5秒后，每2秒调用异常接口
          clearTimeout(timer_count_1)
          timer_count_1 = setTimeout(() => {
            clearInterval(timer_count)
            timer_count = setInterval(() => {
              if (get_bet_status.value == 6 || get_new_bet.value) {
                query_order();
              }
            }, 2000);
          }, 5000);
          // c201消息处理
          useMittOn(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler1)
          break;
        default:
          break;
      }
      max_winmoney.value = data.orderDetailRespList[0].maxWinMoney;
      odds_value2.value = data.orderDetailRespList[0].oddsValues;
      bet_money.value = data.orderDetailRespList[0].betMoney;
      play_optionname.value = data.orderDetailRespList[0].playOptionName;
      playname2.value = data.orderDetailRespList[0].playName;

      // collect_match()

    } else {  //投注失败在 back_msg 方法中查看注释
      set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
      back_msg({ code, data, msg }, (status, msg) => {
        switch (status) {
          case 1:
            need_bet_again.value = true
            // 同步程序走完后再处理逻辑
            $nextTick(() => {
              if (!get_odds_change.value) {
                set_bet_status(1);
              }
            })
            break;
          case 2:
            set_bet_status(4);
            tips_msg = msg;
            break;
          case 3:
            set_bet_status(1);
            tips_msg = msg;
            break;
          case 4:
            need_bet_again.value = true
            set_bet_status(1);//设置投注框为初始状态
            break;
          default:
            break;
        }
      });
    }
  })

}
/**
 *@description 串关投注后的逻辑处理
 *@return {Undefined} undefined
 */
const mix_bet = () => {
  submit_betlist((code, data, msg) => {
    if (exist_code.value == '666') { return };  // 10秒没有code码返回状态不做跟新

    exist_code.value = code;

    if (code == 200) {
      series_order_respList.value = data.seriesOrderRespList;
      let order_ing_ = [];

      series_order_respList.value.forEach(item => {
        add_orderno({ count: item.seriesSum, num: item.orderNo }) //将订单号存到对象集合中
        if (item.orderStatusCode == 2) {
          order_ing_.push(item.orderNo)
        }
      })
      set_order_ing({ change_: 1, value_: order_ing_ })

      order_detail_resp_list.value = data.orderDetailRespList;
      bet_money_total.value = data.betMoneyTotal;
      max_win_money_total.value = data.maxWinMoneyTotal;

      if (data.lock == 1 && order_ing_.length) {  //新流程
        set_new_bet(true)
        clearTimeout(timer_count_2)
        timer_count_2 = setTimeout(() => {   //25秒还是有订单在确认中，直接给状态让去注单记录中查看
          if (get_new_bet.value) {
            mixnew_bet = true
            set_bet_status(1);
            tips_msg = $root.$t('bet.err_msg08');
            clearInterval(timer_count);
            timer_count = null;
          }
        }, 25000);

        // c201消息处理
        useMittOn(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler2)

        clearTimeout(timer_count_1)
        timer_count_1 = setTimeout(() => {    //5秒socket没有返回订单状态的话，调接口拉取
          clearInterval(timer_count)
          timer_count = setInterval(() => {
            if (get_order_ing.value.length) {
              let param = get_order_ing.value.toString();
              api_betting.get_orderstatus({ orderNos: param }).then(res => {
                if (res.code == 200 && get_bet_status.value != 1 && res.data) {
                  query_order_obj.value = res.data

                  query_order_obj.value.forEach(item => {
                    if (item.status == 4) {   //新流程失败了需要记录
                      is_new_bet.value = true
                    }
                  })
                }
              })
            } else {
              clearInterval(timer_count);
              timer_count = null;
              clearTimeout(timer_count_1);
              timer_count_1 = null;
              clearTimeout(timer_count_2);
              timer_count_2 = null;
            }
          }, 2000);
        }, 5000);

      } else {  //老流程
        if (order_ing_.length) {
          set_bet_status(6);
          tips_msg = $root.$t('bet.err_msg07');

          clearTimeout(timer_count_1)
          timer_count_1 = setTimeout(() => {    //5秒socket没有返回订单状态的话，调接口拉取
            clearInterval(timer_count)
            timer_count = setInterval(() => {
              if (get_order_ing.value.length) {
                let param = get_order_ing.value.toString();
                api_betting.get_orderstatus({ orderNos: param }).then(res => {
                  if (res.code == 200 && res.data) {
                    query_order_obj.value = res.data
                  }
                })
              } else {
                clearInterval(timer_count);
                timer_count = null;
              }
            }, 2000);
          }, 5000);
        } else {
          set_bet_status(3);
        }
        // collect_match()
      }

    } else {
      set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
      back_msg({ code, data, msg }, (status, msg) => {
        switch (status) {
          case 1:
            need_bet_again.value = true
            // 同步程序走完后再处理逻辑
            $nextTick(() => {
              if (!get_odds_change.value) {
                set_bet_status(1);
              }
            })

            break;
          case 2:   //对应红色提示语的情况,点击确定移除投注项
            set_bet_status(4);
            tips_msg = msg;
            break;
          case 3:
            set_bet_status(1);
            tips_msg = msg;
            break;
          case 4:
            need_bet_again.value = true
            set_bet_status(1);
            break;
          default:
            break;
        }
      });
    }
  })

}

//单关5秒后还是在确认中状态的话，轮询查询订单信息
const query_order = () => {
  let param = {
    orderNos: get_order_no.value
  }

  if (!param.orderNos) { return }

  api_betting.get_orderstatus(param).then(res => {
    if (!(get_bet_status.value == 6 || get_new_bet.value)) { return }

    query_order_obj.value = res.data

    let data = _.get(res, 'data[0]');
    let code = _.get(res, 'code');

    if (code != 200 || !res.data) { return };

    if (data.status == 0) {   //投注成功
      clearInterval(timer_count);
      timer_count = null;
      set_bet_status(3);

      if (data.orderNo && data.orderNo == get_order_no.value) {
        max_winmoney.value = data.newMaxWinAmount;
        let oid = _.get(single_item, 'hps[0].hl[0].ol[0].oid', '')
        if (data.oddsChangeList && data.oddsChangeList[0] && data.oddsChangeList[0].playOptionsId == oid) {
          odds_value2.value = data.oddsChangeList[0].usedOdds;
        }
      }
      set_new_bet(false)
    } else if (data.status == 4) {   //投注失败
      if (get_new_bet.value) {
        set_bet_status(1);
        mixnew_bet = true;
        tips_msg = $root.$t('bet.err_msg03')  //单关新流程失败后的 对应queryOrderStatus接口的红字提示
        set_toast({ 'txt': $root.$t('bet.bet_err'), hide_time: 3000 });
      } else {
        set_bet_status(8);
      }
      clearInterval(timer_count);
      timer_count = null;
    }
  })
}

/**
 *@description 接受变化
 *@param {Number} val 有值表示手动触发
 *@return {Undefined} undefined
 */
const agree_change = (val) => {
  set_odds_change(false);
  set_bet_status(1);
  set_change_list({ status: 0 });
  if (get_active_index.value == -1) {
    set_active_index(0)
  }
}

/**
 *@description 自动接受跟好赔率规则展示
 */
const change_accept = () => {
  set_accept_show(true);
}

/**
 *@description 串关注单状态变动需要跟新最高可盈
 *@param {Number} value 最高可赢变动多少
 *@param {Number} value2 总投注额变动多少
 *@return {Undefined} undefined
 */
const update_money = (value = 0, value2 = 0) => {
  max_win_money_total.value += value * 100;
  bet_money_total.value += value2 * 100;
}

// 清除当前组件所有定时器
const clear_timer = () => {
  // timeout定时器列表
  const timeout_timer_arr = [
    'timer',
    'timer2',
    'timer3',
    'timer_count_1',
    'timer_count_2',
  ]

  // interval定时器列表
  const interval_timer_arr = [
    'timer_count'
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



onUnmounted(() => {
  clear_timer()

  set_order_ing({ change_: 1, value_: [] })
  set_order_no('')

  utils.del(series_order_respList.value);

  set_active_index(0);//活动子项置为初始值
  set_keyboard_show(true)

  $root.$off(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler1)
  $root.$off(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler2)

  debounce_throttle_cancel(check_odds_beforebet2.value);

  for (const key in $data) {
    $data[key] = null
  }

  unsubscribe()
})


</script>
<style lang="scss" scoped>
.bet-mix-box-child1 {
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

  .ac-rules {
    max-width: 41%;
  }
}

/* ************** 底部按钮 ************** -S */
.add-box {
  font-size: 0.16rem;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 0.85rem;
  border: 1px solid;
  border-radius: 4px;
  margin-right: 0.1rem;
  text-align: center;

  .kushikatsu-text {
    font-weight: 600;

    img {
      margin-left: 0.04rem;
      width: 0.12rem;
    }
  }
}

.add-box2 {
  font-size: 0.14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.14rem;
}

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

/* ************** 底部按钮 ************** -E */
.mix-show-box:nth-last-child(1) ::v-deep .content_box {
  border-bottom: 1px solid transparent !important;
}

.img1 {
  vertical-align: text-bottom;
  width: 0.14rem;
  margin-right: auto;
}

.img2 {
  display: inline-block;
  background: var(--q-color-com-img-bg-69) no-repeat center / contain;
  vertical-align: text-bottom;
  width: 0.14rem;
  height: 0.14rem;
}

.img3 {
  background-image: var(--q-color-com-img-bg-68);
}

.arrow {
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  background: var(--q-color-com-img-bg-67) no-repeat center / contain;
}

.arrow2 {
  transform: scaleY(-1);
}

.bet-add {
  display: inline-block;
  width: 0.12rem;
  height: 0.12rem;
  background: no-repeat center;
}

.close {
  display: inline-block;
  vertical-align: -0.026rem;
  width: 0.14rem;
  height: 0.14rem;
  background: var(--q-color-img-bg-98) no-repeat center / contain;
}
</style>
