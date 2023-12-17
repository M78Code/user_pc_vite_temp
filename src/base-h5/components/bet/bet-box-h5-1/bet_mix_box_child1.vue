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
        <div v-for="(value, name) in view_ctr_obj" :key="name" class="mix-show-box">
          <!-- 虚拟体育 -->
          <!-- <template v-if="get_menu_type == 900">
            <bet-mix-show2 :name_="name" :order_detail_resp_list="order_detail_resp_list" :odds_value2="odds_value2"
              :play_optionname2="play_optionname" :playname2="playname2"></bet-mix-show2>
          </template> -->
          <!-- 非虚拟体育 -->
          <!-- <template v-else>
            <bet-mix-show :name_="name" :order_detail_resp_list="order_detail_resp_list"
              :query_order_obj="query_order_obj"></bet-mix-show>
          </template> -->
        </div>

        <!-- 串关投注成功组件 -->
        <template v-if="btn_show == 1 || mixnew_bet || part_bet">
          <div v-show="btn_show == 1 && !mixnew_bet || part_bet">
            <div v-for="(item, index) in series_order_respList" :key="index">
              <!-- <betSuccessBar :item_="item" @update_money="update_money" :query_order_obj="query_order_obj"
                :len='series_order_respList.length'></betSuccessBar> -->
            </div>
          </div>
        </template>

        <!-- 单关 -->
        <template v-if="BetData.bet_list.length == 1">
          <template v-if="BetData.is_bet_success_status">
            <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
            <div class="row justify-between yb_px14 yb_fontsize14 yb_mb8 bottom-bar">
              <p><span>{{ i18n_t('bet_record.bet_max_win') }}</span><span class="yb_fontsize14 yb_ml8 bottom-bar-sp">{{
                (max_winmoney / 100).toFixed(2) }}</span></p>
              <p><span>{{ i18n_t('bet.bet_val') }}</span><span class="yb_fontsize14 yb_ml8 bottom-bar-sp2">{{ (bet_money
                / 100).toFixed(2) }}</span></p>
            </div>
          </template>
          <template v-else>
            <!-- 单关金额输入框 -->
            <bet-single-detail ref="bet_single_detail" :tips_msg.sync="tips_msg"
              :name_="BetData.bet_list[0]"></bet-single-detail>
          </template>
        </template>

        <!-- 串关主体 金额输入框-->
        <template v-if="BetData.bet_list.length != 1 && ![3, 6].includes(+get_bet_status)">
          <bet-mix-detail :value_="item" :index_="index" v-for="(item, index) of get_s_count_data" :key="index"
            :tips_msg.sync="tips_msg"></bet-mix-detail>
        </template>
      </div>
      <!-- 提示信息组件 -->
      <betConflictTips />

      <key-board v-show="get_keyboard_show"></key-board>

      <!-- 底部按钮 -->
      <div class="row yb_px10 yb_pb8 justify-between" @touchmove.prevent>
        <!-- 左边 -->
        <div class="add-box" :class="{ 'add-box2': BetData.bet_list.length >= 2 || BetData.is_bet_success_status, 'add-box3': calc_class }"
          @click.stop="pack_up(2)">
          <template v-if="!BetData.is_bet_success_status">
            <span v-if="BetData.bet_list.length > 1">{{ i18n_t('bet.delete_all') }}</span>
            <span class="kushikatsu-text" v-else>
              {{ i18n_t('bet.kushikatsu') }}
              <i class="bet-add"></i>
            </span>
          </template>
          <template v-else>
            <span>{{ i18n_t('bet.save') }}</span>
          </template>
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
              <p class="yb_fontsize20">{{  format_money2(BetData.bet_money_total.toFixed(2))}}</p>
            </div>
          </template>
          <template v-else>
            <!-- 投注 -->
            <div v-if="btn_show == 0" @click="submit_order" :class="{ 'set-opacity': get_money_notok_list.length }"
              class="row justify-center items-center content-center">
              <p class="yb_fontsize12 yb_mr10">{{ i18n_t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{  format_money2(BetData.bet_money_total.toFixed(2)) }}</p>
            </div>
            <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
            <div v-if="btn_show == 5" class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{ i18n_t('bet_record.bet_val') }}</p>
              <p class="yb_fontsize20">{{ format_money2(BetData.bet_money_total.toFixed(2)) }}</p>
            </div>
            <!-- 确定 -->
            <p v-if="btn_show == 1" @click="pack_up" class="yb_fontsize16">{{ i18n_t('common.ok') }}</p>
            <!-- 处理中 -->
            <div v-if="btn_show == 2" class="yb_fontsize16 row justify-center items-center">
              <p class="yb_mr8">{{ i18n_t('bet_record.submitting_bet') }}</p>
              <ball-spin />
            </div>
            <!-- 接受变化 -->
            <p v-if="btn_show == 3" @click="agree_change" class="yb_fontsize16">{{ i18n_t('bet.agree_change') }}</p>
            <!-- 接受变化并投注 -->
            <p v-if="btn_show == 4" @click="submit_order" class="yb_fontsize16">{{ i18n_t('bet.agree_change2') }}</p>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// import betMixShow from './bet_mix_show.vue';
// import betMixShow2 from './bet_mix_show2.vue';
// import betMixDetail from './bet_mix_detail.vue';
// import betSingleDetail from './bet_single_detail.vue';
// import betSuccessBar from './bet_success_bar.vue';
// import keyBoard from './keyboard.vue';
// import ballSpin from './ball_spin.vue';
// import betBar from "./bet_bar.vue";
// import betConflictTips from './bet-conflict-tips'
// 
// import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
// import BetData from "src/core/bet/class/bet-data-class.js";
// import BetData_H5 from "src/core/bet/class/bet-data-class-h5.js";
import { format_money2 } from "src/output/index.js"
import { ref, onMounted,watch,computed,onUnmounted,nextTick } from 'vue';
import lodash from 'lodash'

const btn_show = ref(0)  //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
const exist_code = ref(0)    //投注后是否返回code码
const series_order_respList = ref([])   //串关投注成功后的返回(包含订单号、金额···)
const order_detail_resp_list = ref([])    // 单关和串关投注成功后的返回(投注项信息，赔率、盘口···)
// const bet_money_total = ref(0)    //串关投注成功后的总投注额
// const max_win_money_total = ref(0)     //串关投注成功后的总最高可赢
const query_order_obj = ref([])   //queryOrderStatus接口返回数据
const is_5s = ref(false)  //弹框弹起来有没有5秒,到了5秒就用默认的5000作限额,不作弹框提示
const max_winmoney = ref(0)    //单关投注成功后接口返回的最高可赢
const odds_value2 = ref('')    //单关投注成功后接口返回的赔率
const playname2 = ref('')  //单关投注成功后接口返回的玩法名称
const bet_money = ref(0)   //单关投注成功后接口返回的投注金额
const play_optionname = ref('')   //单关投注成功后接口返回的playOptionName
const max_height1 = ref(230)   //滚动区域的最大高
const is_new_bet = ref(false)   //query_order_status 接口返回是否是新流程
const need_bet_again = ref(false)  //是否需要重新发起投注
// const check_odds_beforebet2 = debounce(check_odds_beforebet, 200) //防抖处理
const check_odds_beforebet2 = ref('') //防抖处理
const scroll_box_ele = ref(null)   // dom元素

/** --------------------------onmounted开始 ---------------*/
onMounted(() => {
  console.error('1213ssssssss',BetData)
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
  if (BetData.bet_list[0]) {
    return view_ctr_obj.bs
  } else {
    return {}
  }
})
//是否有重复的球员id或者球队id
const is_conflict = computed(() => {
  return !(lodash.uniq(get_m_id_list.value).length == get_m_id_list.value.length)
})

// 是否展示不支持串关提示
const is_conflict2 = computed(() => {
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
  let flag = [2, 4].includes(+get_bet_status.value)
    || get_is_champion.value() && !BetData.is_bet_success_status
    || get_bet_status.value == 5 && BetData.bet_list.length == 1
    || get_menu_type == 3000 && lodash.get(single_item, 'hps[0].hl[0].hipo') != 1 && !BetData.is_bet_success_status
    || get_menu_type != 3000 && lodash.get(single_item, 'hps[0].hids') == 0 && !BetData.is_bet_success_status
    || btn_show.value == 5;
  return flag
})
//是否进入串关部分投注成功流程
const part_bet = computed(() => {
  return get_order_los.value.length && get_order_suc.value.length && !get_order_ing.value.length
})

/** --------------------------watch开始 ---------------*/

// watch(() => BetData_H5.money_notok_list2.value.length, (new_) => {
//   if (!new_ && !get_money_notok_list.value.length && BetData.bet_list.length > 2) {
//     tips_msg = ''
//   }
// })

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
      nextTick(() => {
        set_money_total('clear_')
        set_money_total(money_remain)
      })

      set_s_count_data(s_count_data)
      set_bet_status(1);

      if (is_new_bet.value) {
        if (!tips_msg) {
          tips_msg = i18n_t('bet.err_msg03')  //新流程queryOrderStatus 接口返回的投注失败提示语先写死
        }
        check_odds_beforebet();  //重新拉取投注前校验盘口信息接口
        need_bet_again.value = true
        set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
      }
    } else {
      set_bet_status(3);
    }
    set_new_bet(false)
  }
})

watch(() => BetData.odds_change, (new_) => {
  if (new_) {
    set_bet_status(5);
    tips_msg = i18n_t('bet.msg08')
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
          if (BetData.bet_list.length) {
            set_bet_status(1);
            tips_msg = i18n_t('bet.err_msg13');
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




onUnmounted(() => {
  clear_timer()

  set_order_ing({ change_: 1, value_: [] })
  set_order_no('')

  del(series_order_respList.value);

  set_active_index(0);//活动子项置为初始值
  set_keyboard_show(true)

  useMittOn(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler1).off
  useMittOn(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler2).off

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
.mix-show-box:nth-last-child(1) :deep( .content_box) {
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