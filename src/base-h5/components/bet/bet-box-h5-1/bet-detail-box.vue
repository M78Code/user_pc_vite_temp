<!--
 * @Author: Router
 * @Description: 详情页视频全屏时横屏的投注弹框，只处理常规赛事,类名加bd是为了防止和全局类名冲突
-->
<template>
  <div class="bet-detail-box column" @click.self="pack_up">
    <!-- 投注中的蒙层，所有不能点击 -->
    <div v-if="get_bet_status == 2" class="fullscreen"></div>
    <div class="content yb_px16">
      <hr class="line">

      <!-- 投注单和金额 -->
      <div class="title row justify-between yb_fontsize14">
        <template v-if="BetData.is_bet_success_status">
          <span>{{ i18n_t("bet.bet_information") }}</span>
          <img src="image/wwwassets/bw3/svg/bet_close.svg" alt="" @click.stop="remove">
        </template>
        <template v-else>
          <div class="left">{{ i18n_t("bet.bet_record") }}</div>
          <div class="right">
            <span class="yb_fontsize10">{{ i18n_t('common.money') }}：</span>
            <span class="money-span">{{ format_money2(UserCtr.balance) }}</span>
          </div>
        </template>
      </div>

      <!-- 展示投注项名称、赔率、玩法名称、对阵信息 -->
      <div class="detail row yb_py8" :class="{ 'detail2': pankou_change == 2 }">
        <div class="imgbox yb_mr6 yb_pt4" v-if="!BetData.is_bet_success_status">
          <img src="image/wwwassets/bw3/svg/bet_xuanx.svg" @click.stop="remove">
        </div>
        <div style="flex:1">
          <!-- 上 -->
          <div class="shang row justify-between items-center">
            <div class="col-9">
              <!-- 投注成功后的展示值用接口返回的 -->
              <template v-if="play_optionname && [3, 6].includes(+get_bet_status)">{{ play_optionname }} </template>
              <template v-else>
                <!-- 拜仁慕尼黑 -->
                <span v-show="value_show.value1" class="yb_fontsize14">{{ value_show.value1 }}</span>
                <!-- +0/0.5 -->
                <span :class="{ 'change': pankou_change == 1 }" v-show="value_show.value2"
                  class="yb_px2 yb_py2">{{ value_show.value2 }}</span>
              </template>
            </div>
            <div class="oddwrap col-3 text-right yb_fontsize16"
              :class="{ 'sheng': odds_change == 1, 'jiang': odds_change == 2 }">
              <i class="yb_mr8" v-if="!BetData.is_bet_success_status"></i>
              <span>
                <template v-if="get_bet_status == 3">
                  {{ format_odds(value_show.csid, odds_value2) }}
                </template>
                <template v-else>{{ odds_value }}</template>
              </span>
            </div>
          </div>
          <!-- 中 -->
          <div class="zhong row justify-between items-center">
            <!-- 左 -->
            <span class="col-7">
              <!-- 滚球 -->
              <template v-if="hl0.hmt == 0">{{ i18n_t('bet_record.ing') }}&thinsp;</template>
              <!-- 投注成功后的玩法名称用接口返回的 -->
              <template v-if="playname && [3, 6].includes(+get_bet_status)">{{ playname }}</template>
              <template v-else>{{ value_show.hps[0].hpnb || value_show.hps[0].hpn }}</template>
              <!-- 基准分 -->
              <template v-if="value_show.csid == 1">&ensp;{{ calc_bifen(value_show) }}</template>
            </span>
            <!-- 右 -->
            <template v-if="[3, 6, 8].includes(+get_bet_status)">
              <!-- 投注成功 -->
              <span v-if="get_bet_status == 3" class="color1"><img src="image/wwwassets/bw3/svg/bet_chengg.svg">{{
                i18n_t('bet.bet_suc') }}</span>
              <!-- 投注失败 -->
              <span v-if="get_bet_status == 8" class="color3"><img src="image/wwwassets/bw3/svg/bet_shib.svg">{{
                i18n_t('bet.bet_err') }}</span>
              <!-- 提交成功 -->
              <span v-if="get_bet_status == 6" class="color2">
                <img class="img" :src="compute_img_url('icon-tojiao')">{{
                    i18n_t('bet.submitted_successfully') }}</span>
            </template>
            <template v-else-if="pankou_change == 2">
              <!-- 失效 -->
              <span class="invalidation">{{ i18n_t('bet.invalidation') }}</span>
            </template>
          </div>
          <!-- 下 -->
          <div class="xia">
            <template v-if="BetData.is_bet_success_status && match_info">{{ match_info }}</template>
            <template v-else>{{ value_show.mhn }}<span class="q-mx-xs">v</span>{{ value_show.man }}
              {{ calc_now_score(value_show) }}</template>
          </div>
        </div>
      </div>

      <template v-if="BetData.is_bet_success_status">
        <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
        <div class="bet-after row justify-between yb_fontsize12">
          <p><span>{{ i18n_t('bet_record.bet_max_win') }}:</span><span class="color3 yb_ml8">{{ (max_winmoney /
            100).toFixed(2) }}</span></p>
          <p><span>{{ i18n_t('bet.bet_val') }}:</span><span class="color4 yb_ml8">{{ (bet_money / 100).toFixed(2) }}</span>
          </p>
        </div>
      </template>
      <template v-else>
        <!-- 金额输入框 -->
        <div class="ipt yb_mb8 yb_pl8">
          <template v-if="!money && max_money_back">
            <i class="cursor" ref="cursor_line" :style="{ opacity: get_bet_status == 1 ? '1' : '0' }"></i>
            <span v-if="!money && max_money_back" class="limit-txt yb_fontsize12 ">{{ get_money_format() }}</span>

          </template>
          <template v-if="money">
            <span v-if="money" class="yb_fontsize14">{{ format_money3(money) }}</span>
            <i class="cursor" ref="cursor_line" :style="{ opacity: get_bet_status == 1 ? '1' : '0' }"></i>
          </template>
        </div>

        <!-- 最高可赢和常用金额 -->
        <div class="win row justify-between yb_mb6">
          <div>{{ i18n_t('bet.total_win2') }}

            <span :class="{ 'color2': money_ok && money }">{{ format_money2(max_win_money) }}</span>
          </div>
          <div class="usedmoney">
            <i class="select" :class="{ 'select2': get_used_money != 0 }" @click="set_used_money(null)"></i>
            {{ i18n_t('bet.used_money2') }}
          </div>
        </div>

        <!-- 小键盘 -->
        <div class="keyboard text-center yb_fontsize18 row justify-between items-start"
          @click.stop="_handleKeyPress($event)">
          <div data-num="1">1</div>
          <div data-num="2">2</div>
          <div data-num="3">3</div>
          <div data-num="4">4</div>
          <div data-num="5">5</div>
          <div data-num=".">.</div>
          <div data-num="6">6</div>
          <div data-num="7">7</div>
          <div data-num="8">8</div>
          <div data-num="9">9</div>
          <div data-num="0">0</div>
          <div data-num="x" class="delkey"><img src="image/wwwassets/bw3/svg/bd_delete.svg" alt=""></div>
          <p data-num="100" :class="{ 'shadow-show': prevent_click(100) }">+100</p>
          <p data-num="200" :class="{ 'shadow-show': prevent_click(200) }">+200</p>
          <p data-num="500" :class="{ 'shadow-show': prevent_click(500) }">+500</p>
          <p data-num="max">MAX</p>
        </div>

        <!-- 自动接受更好赔率 -->
        <div class="accept yb_my4">
          <i class="select" :class="{ 'select2': BetData.bet_is_accept == 2 }" @click="BetData.bet_is_accept"></i>
          <span class="yb_mx4">{{ i18n_t("ac_rules.auto") }}</span>
          <img src="image/wwwassets/bw3/svg/bd_xuanzhong2.svg" alt="" @click="change_accept">
        </div>
      </template>

      <!-- 提示信息 -->
      <div class="tips text-center">
        <span v-if="tips_msg">{{ tips_msg }}</span>
      </div>

      <!-- 底部按钮 -->
      <div class="btn-box yb_mb12 row yb_fontsize14">

        <!-- 左边 -->
        <div class="save yb_mr10 row text-center" @click.stop="bet_save" v-if="BetData.is_bet_success_status">
          <span>{{ i18n_t('bet.save') }}</span>
        </div>
        <!-- 右边 -->
        <div class="btn row" :class="{ 'btn2': btn_show == 5 }">
          <!-- 投注 -->
          <div v-if="btn_show == 0" @click="submit_order" style="flex:1" class="text-center">
            <p class="yb_fontsize12">{{ i18n_t('common.bet') }}</p>
          </div>
          <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
          <div v-if="btn_show == 5">
            <p class="yb_fontsize12">{{ i18n_t('common.bet') }}</p>
          </div>
          <!-- 确定 -->
          <div v-if="btn_show == 1" @click="bet_end" style="flex:1" class="text-center">{{ i18n_t('common.ok') }}</div>
          <!-- 处理中 -->
          <div v-if="btn_show == 2" class="row justify-center items-center">
            <p class="yb_mr8">{{ i18n_t('bet_record.submitting_bet') }} </p>
            <ball-spin />
          </div>
          <!-- 接受变化 -->
          <p v-if="btn_show == 3" @click="agree_change" style="flex:1" class="text-center">{{ i18n_t('bet.agree_change') }}</p>
          <!-- 接受变化并投注 -->
          <p v-if="btn_show == 4" @click="submit_order" style="flex:1" class="text-center">{{ i18n_t('bet.agree_change2') }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import ballSpin from './ball_spin.vue';
import { useMittOn, useMittEmit, MITT_TYPES,compute_img_url,UserCtr } from "src/output/index.js"
import store from "src/store-redux/index.js";
import BetData from "src/core/bet/class/bet-data-class.js";
import { format_odds, calc_bifen } from 'src/output/index.js'
import { ref, onMounted, watch, computed, onUnmounted,nextTick } from 'vue';





const money = ref('')//金额
// const get_bet_status = 1,    //0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
const odds_change = ref('0')    //0-正常，1-赔率升，2-赔率降
const pankou_change = ref('0')  //0-盘口未变化，1-盘口值变化，2-盘口失效(封盘和关盘)，3-锁盘
const money_ok = ref('true')   //金额是否合适
const min_money = ref('10')  //最低投注金额
const max_money = ref('0')   //最高可投金额
const is_watch = ref('true')    //组件渲染时是否监听money
const max_money_back = ref('false')   //最高可赢金额的接口是否有返回(不管成功与失败)
const btn_show = ref('0') //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
const is_exist_code = ref('false')   //投注后是否返回code码
const tips_msg = ref('')  // 提示信息
const need_bet_again = ref('false')  //是否需要重新发起投注
// const check_odds_beforebet2 = debounce(check_odds_beforebet, 200) //防抖处理
let check_odds_beforebet2 = ref('')

const max_winmoney = ref('0')   //单关投注成功后接口返回的最高可赢
const odds_value2 = ref('')  //单关投注成功后接口返回的赔率
const playname = ref('')   //单关投注成功后接口返回的玩法名称
const bet_money = ref('0')    //单关投注成功后接口返回的投注金额
const play_optionname = ref('')   //单关投注成功后接口返回的playOptionName
const match_info = ref('')   //单关投注成功后接口返回的matchInfo 


const store_state = store.getState()
const get_bet_status = ref(store_state.get_bet_status)
const get_detail_data = ref(store_state.get_detail_data)
const get_is_show_settle_tab = ref(store_state.get_is_show_settle_tab)
const get_change_list = ref(store_state.get_change_list)
const get_new_bet = ref(store_state.get_new_bet)
const get_used_money = ref(store_state.get_used_money)
const get_invalid_ids = ref(store_state.get_invalid_ids)
const get_order_no = ref(store_state.get_order_no)
const get_bet_show = ref(store_state.get_bet_show)

const unsubscribe = store.subscribe(() => {
  update_state()
})

const update_state = () => {
  const new_state = store.getState()
  get_bet_status.value = new_state.get_bet_status
  get_detail_data.value = new_state.get_detail_data
  get_is_show_settle_tab.value = new_state.get_is_show_settle_tab
  get_change_list.value = new_state.get_change_list
  get_new_bet.value = new_state.get_new_bet
  get_used_money.value = new_state.get_used_money
  get_invalid_ids.value = new_state.get_invalid_ids
  get_order_no.value = new_state.get_order_no
  get_bet_show.value = new_state.get_bet_show
}
// mixins: [odd_convert, betting, compute_max_win_money],
// onmounted开始
/**            onmounted开始              */
onMounted(() => {
  flicker()
  // 调用合并后接口还是分开调用
  if (is_exist_pa_operate()) {
    fetch_limit_money_and_odd_info()
  } else {
    //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
    check_odds_beforebet().then(() => {
      // 获取最大最小金额
      fetch_limit_money();
    })
  }

  // 5秒后没有金额返回就用默认值
  timer_5000_2 = setTimeout(() => {
    if (!max_money.value) {
      max_money.value = 8888;
      // 获取接口返回的单关最小投注金额
      min_money = _.get(UserCtr, 'cvo.single.min', 10)
      if (max_money.value < min_money.value) {
        min_money.value = max_money.value
      }
      max_money.value = true;
      check_moneyok(money.value)
    }
  }, 5000);
  unsubscribe()
})

/**            onmounted结束            土豆 * 1  凉面 * 4  大鸡排 *3  雪花鸡柳 * 1 炸豆腐 *1 */
/**
 *@description 投注完成后点击确定按钮
 */
const bet_end = () => {
  set_bet_list([]);
}

/**
*@description 保留选项
*/
const bet_save = () => {
  tips_msg.value = ''
  set_bet_status(1)
  money.value = ''
}
/**
 *@description 自动接受跟好赔率规则展示
 */
const constchange_accept = () => {
  set_accept_show(true);
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
}
/**
 *@description 点击蒙层收起
 */
const pack_up = () => {
  if ([3, 4, 6, 8].includes(+get_bet_status.value)) {
    set_bet_list([]);
    return
  }
}

/**
 *@description 单关投注后，c201消息的处理
 *@param {Array} : newTotalMaxWinAmount - 最高可赢金额， ov - 赔率， emit_http - 触发哪些接口请求， msg - 提示消息,  code - c201的refuseCode
 */
const c201_update_handler1 = ([newTotalMaxWinAmount, ov, emit_http, msg, code]) => {
  //emit_http 是1或者2时都是投注失败
  if (code == '0400532') {
    is_0400532 = true
  }
  if (emit_http == 1) {
    msg && (tips_msg.value = msg)
    check_odds_beforebet2();  //重新拉取投注前校验盘口信息接口
    need_bet_again.value = true
    set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
  } else if (emit_http == 2) {
    msg && (tips_msg.value = msg)
    check_odds_beforebet2();  //重新拉取投注前校验盘口信息接口
    need_bet_again.value = true
    set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
    fetch_limit_money() // 更新单关查询最大最小金额
  } else {
    max_winmoney.value = newTotalMaxWinAmount * 100;
    odds_value2.value = ov;
  }
  clearInterval(timer_2000);
}

/**
*@description 点击投注
*/
const submit_order = () => {
  if (btn_show.value == 4) {   //接受变化并投注点击时，要先接受变化
    set_odds_change(false);
    set_change_list({ status: 0 });
  }
  is_exist_code.value = false
  is_0400532 = false
  set_new_bet(false)
  need_bet_again.value = false

  clearInterval(timer_25000);
  clearInterval(timer_5000);
  clearInterval(timer_5000_2);

  set_order_no('')
  is_exist_code.value = false

  // 这种情况放过，让钱投注出去
  let _flag2 = money.value == UserCtr.balance

  if (!_flag2) {
    check_moneyok2(money.value)
    if (!money_ok.value) { return }
  }
  if (get_bet_status.value == 7) {   //锁盘
    set_toast({ 'txt': i18n_t('bet.odd_upd') });
    return;
  }

  if (Number(money.value) < 0.01) {  //请输入金额
    set_toast({ 'txt': i18n_t('bet.input_v') })
    return;
  }
  if (Number(money.value) > +UserCtr.balance) {    //弹窗提示：“余额不足，请您先充值”
    set_toast({ 'txt': i18n_t('bet.err_msg05') });
    return;
  }
  if (!max_money.value) {   // 5秒内限额接口没有返回的话，提示 限额获取中,请稍后
    set_toast({ 'txt': i18n_t('bet.err_msg06') });
    return
  }

  set_bet_status(2);
  timer_25000 = setTimeout(() => {    // 25秒没有code码返回，红字提示服务繁忙
    if (!is_exist_code.value) {
      is_exist_code.value = true
      set_bet_status(1);
      tips_msg.value = i18n_t('bet.err_msg08');
    }
  }, 25000);

  single_bet() //单关投注
}

/**
 *@description 单关投注后的逻辑处理
 */
const single_bet = () => {
  submit_betlist((code, data, msg) => {
    if (is_exist_code.value) { return };  //25秒后返回数据不处理

    is_exist_code.value = true;

    if (code == 200 && data) {  // 投注成功
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
            clearTimeout(timer_25000)
            timer_25000 = setTimeout(() => {   //25秒还是有订单在确认中，直接给状态让去注单记录中查看
              if (get_new_bet.value) {
                set_bet_status(1);
                tips_msg.value = i18n_t('bet.err_msg08');
                clearInterval(timer_2000)
              }
            }, 25000);
          } else {
            set_bet_status(6);
            tips_msg.value = i18n_t('bet.err_msg07');
          }
          // 隔5秒后，每2秒调用异常接口
          timer_5000 = setTimeout(() => {
            timer_2000 = setInterval(() => {
              query_order();
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
      playname.value = data.orderDetailRespList[0].playName;
      match_info.value = data.orderDetailRespList[0].matchInfo;

      if (get_detail_data.value.mid && !get_is_show_settle_tab.value) {   //详情页需要拉取玩法集接口
        useMittEmit(MITT_TYPES.EMIT_REFRESH_DETAILS_TAB_BET)
      }
    } else {  // 投注失败在 back_msg 方法中查看注释
      set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
      back_msg({ code, data, msg }, (status, msg) => {
        switch (status) {
          case 1:
            need_bet_again.value = true
            // 同步程序走完后再处理逻辑
            nextTick(() => {
              if (!BetData.odds_change) {
                set_bet_status(1);
              }
            })
            break;
          case 2:
            set_bet_status(4);
            tips_msg.value = msg;
            break;
          case 3:
            set_bet_status(1);
            tips_msg.value = msg;
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
 *@description 检查金额是否合适
 *@param {Number} val 金额
 *@return {Undefined} undefined
 */
const check_moneyok = (val) => {
  //当输入金额超出用户余额时，默认转化为用户余额；并提示“余额不足，已转换为最大可投注金额” 3s消失
  if (+val > +UserCtr.balance) {
    money.value = UserCtr.balance.toString()
    tips_msg.value = i18n_t('bet.err_msg09')
    clearTimeout(timer_3000)
    // 3秒后重置样式
    timer_3000 = setTimeout(() => {
      tips_msg.value = ''
    }, 3000);
    return
  }
}

/**
*@description 投注前检查金额是否合适
*@param {Number} val 金额
*@return {Undefined} undefined
*/
const check_moneyok2 = (val) => {
  if ((val > max_money.value) && (val >= 0.01 || val === '0.00') && max_money.value) {
    // 已转换为最大可投注金额
    tips_msg.value = i18n_t('bet_record.bet_amount_betting_limit')
    clearTimeout(timer_3000)
    timer_3000 = setTimeout(() => {
      tips_msg.value = ''
    }, 3000);
    money.value = max_money.value.toString()
    money_ok.value = false
  } else if ((val < min_money.value) && (val >= 0.01 || val === '0.00') && max_money.value) {
    // 最小单笔投注金额为 xxx
    tips_msg.value = i18n_t('bet.err_msg10', [min_money.value])
    clearTimeout(timer_3000)
    timer_3000 = setTimeout(() => {
      tips_msg.value = ''
    }, 3000);
    money.value = min_money.value.toString()
    money_ok.value = false
  } else {
    money_ok.value = true;
  };
}

/**
 *@description 删除一个投注项
 */
const remove = () => {
  set_change_list({ value: value_show.id_, status: 2 });
  set_invalid_ids({ type: 2, val: value_show.mid })
  remove_item(value_show.id_);
}
/**
 *@description 光标闪动，animation有兼容问题，用函数替代
 *@return {Undefined} undefined
 */
const flicker = () => {
  timer_700 = setInterval(() => {
    $refs.cursor_line && $refs.cursor_line.classList.toggle('cursor2')
  }, 700);
}
/**
 *@description 格式化后的金额
 *@return {Undefined} undefined
 */
const get_money_format = () => {
  let mi = global_filters.format_money3(min_money.value)
  let ma = global_filters.format_money3(max_money.value)
  return licia_format(i18n_t('bet.money_limit2'), mi, ma);
}

// 单关5秒后还是在确认中状态的话，轮询查询订单信息
const query_order = () => {
  if (get_order_no.value && get_bet_status.value == 6 || get_new_bet.value) {
    let param = {
      orderNos: get_order_no.value
    }
    api_betting.query_order_status(param).then(res => {
      if (!(get_bet_status.value == 6 || get_new_bet.value)) { return }

      let data = _.get(res, 'data[0]');
      let code = _.get(res, 'code');

      if (code != 200 || !data) { return };

      if (data.status == 0) {   //投注成功
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
        if (get_new_bet) {
          set_bet_status(1);

          if (data.refuseCode == '0400532') {
            tips_msg.value = i18n_t('error_msg_info.0400532.client_msg')
          } else {
            tips_msg.value = i18n_t('bet.err_msg03')  //单关新流程失败后的 对应queryOrderStatus接口的红字提示
          }

          set_toast({ 'txt': i18n_t('bet.bet_err'), hide_time: 3000 });
        } else {
          set_bet_status(8);
        }
      }
      if ([0, 4].includes(+data.status)) {   //老流程删除确认中的订单号
        clearInterval(timer_2000);
      }
    })

  }
}

// 小键盘 处理按键
const _handleKeyPress = (evt) => {
  evt.preventDefault();
  if (evt.target.className.includes("shadow-show")) return;

  let num = evt.target.dataset.num;
  switch (num) {
    //最大
    case "max":
      _handmaxKey();
      break;
    //小数点
    case ".":
      _handleDecimalPoint();
      break;
    //删除键
    case "x":
      _handleDeleteKey();
      break;
    default:
      _handleNumberKey(num);
      break;
  }
}

// 小键盘 处理小数点函数
const _handleDecimalPoint = () => {
  //如果包含小数点，直接返回
  if (money.value.indexOf(".") > -1) { return false };
  //如果小数点是第一位，补0
  if (!money.value.length) money.value = "0.";
  //如果不是，添加一个小数点
  else money.value = money.value + ".";
}
// 小键盘 删除键
const _handleDeleteKey = () => {
  let S = money.value;
  //如果没有输入，直接返回
  if (!S.length) { return false };
  if (delete_all) {
    S = "";
    delete_all = false;
  }
  //否则删除最后一个
  money.value = S.substring(0, S.length - 1);
  // S = Number(S).toFixed(2);
}
// 小键盘 MAX键
const _handmaxKey = () => {
  money.value = max_money.value >= +UserCtr.balance ? UserCtr.balance.toFixed(2) : max_money.value.toFixed(2);
}
// 小键盘 处理数字
const _handleNumberKey = (num) => {
  if (!num) return;

  if ([100, 200, 500].includes(+num)) {
    money.value = (money.value / 1 + num / 1).toString();
    return;
  }

  let S = money.value;
  if (S == '0.00' || S > 10000000) { return };

  if (delete_all) {
    S = "";
    delete_all = false;
  }

  //如果有小数点且小数点位数不小于2
  if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length < 2)
    money.value = S + num;

  //没有小数点
  if (!(S.indexOf(".") > -1)) {
    //如果第一位是0，只能输入小数点
    if (num == 0 && S.length == 0) money.value = "0.";
    else {
      if (S.length && Number(S.charAt(0)) === 0) { return };
      money.value = S + num;
    }
  }
}


</script>
<style lang="scss" scoped>
.bet-detail-box {
  position: fixed;
  width: 2.8rem;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;

  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
}

.line {
  background-color: #ffb001;
  margin: 0 -0.16rem;
  padding-top: 2px;
  border: none;
}

.title {
  color: #ffffff;
  line-height: 0.28rem;
  border-bottom: 0.5px solid #585858;

  img {
    width: 0.12rem;
  }
}

/* ************** 中间区域颜色相关样式 ************** -S */
.money.value-span {
  color: #ffb001;
}

.shang {
  color: #ffffff;
}

.zhong,
.xia {
  color: #999999;
}

/* ************** 中间区域颜色相关样式 ************** -E */
.imgbox {
  width: 0.14rem;

  img {
    width: 0.14rem;
  }
}

.content {
  background-color: #262626;
}

.detail {
  max-height: 0.76rem;
  overflow-y: auto;
}

.detail2 {

  div,
  span {
    opacity: 0.8;
  }
}

.ipt {
  height: 0.32rem;
  line-height: 0.32rem;
  border: 0.5px solid #ffb001;
  border-radius: 4px;
  color: #fff;
  background-color: #202020;
}

.win {
  color: #999999;
  font-size: 0.11rem;
  background-color: unset !important;
}

.btn-box {
  min-height: 0.3rem;
}

.btn {
  color: #ffffff;
  background-image: linear-gradient(-44deg, #ff9124 0%, #feb001 100%);
  border-radius: 4px;
  overflow: hidden;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.btn2 {
  background-image: linear-gradient(0deg, #bdc5cf 0%, #bdc5cf 100%);
}

.accept {
  color: #999999;

  img {
    height: 0.12rem;
    vertical-align: -0.02rem;
  }
}

.color2 {
  color: #e93d3d;
}

.cursor {
  display: inline-block;
  width: 0.02rem;
  height: 0.16rem;
  background-color: #ffb001;
  margin-bottom: -3px;
}

.cursor2 {
  background-color: transparent;
}

.limit-txt {
  color: #666;
}

.tips {
  color: #e93d3d;
  min-height: 0.16rem;
  line-height: 1;
  font-size: 0.11rem;
  margin-bottom: 2px;
}

.save {
  width: 0.84rem;
  border: 1px solid #999;
  border-radius: 4px;
  color: #999;
  justify-content: center;
  align-items: center;
  line-height: 1;
}

.usedmoney {
  img {
    height: 0.12rem;
    vertical-align: -2px;
  }
}

.oddwrap {
  i {
    display: inline-block;
    width: 0.06rem;
    height: 0.1rem;
  }
}

.sheng {
  color: #ff2a2a;

  i {
    background: var(--q-color-com-img-bg-59) no-repeat center / 100% 100%;
  }
}

.jiang {
  color: #50c042;

  i {
    background: var(--q-color-com-img-bg-60) no-repeat center / 100% 100%;
  }
}

/* ************** 投注成功或者失败后的颜色展示 ************** -S */
.color1 {
  color: #66a754;
}

.color2 {
  color: #ff9124;
}

.color3 {
  color: #ff2a2a;
}

.color4 {
  color: #ffffff;
}

/* ************** 投注成功或者失败后的颜色展示 ************** -E */
[class*="color"] {
  img {
    vertical-align: -1px;
    margin-right: 0.04rem;
  }
}

.invalidation {
  color: #e93d3d;
}

.bet-after {
  color: #999;
}

.change {
  background-color: #ffb001;
  color: #333333;
  border-radius: 2px;
}

.select {
  display: inline-block;
  vertical-align: -0.02rem;
  width: 0.12rem;
  height: 0.12rem;
  background: var(--q-color-com-img-bg-61) no-repeat center / contain;
}

.select2 {
  background-image: var(--q-color-com-img-bg-62);
}

/* ************** 小键盘样式 ************** -S */
.keyboard {
  -webkit-overflow-scrolling: touch;
  background-color: #262626;
  color: #ffffff;
  margin: 0 -0.16rem;

  div {
    line-height: 0.32rem;
    flex: 1 1 16%;
    border-right: 1px solid #262626;
    border-bottom: 1px solid #262626;
    background-color: #383838;

    &[data-num="."],
    &[data-num="x"] {
      border-right: none;
    }
  }

  p {
    line-height: 0.32rem;
    flex: 1;
    border-right: 1px solid #262626;
    background-color: #484848;

    &[data-num="max"] {
      border-right: none;
    }
  }

  img {
    height: 0.18rem;
    pointer-events: none;
    transform: translateY(3px);
  }

  .shadow-show {
    background-color: #282828;
    color: #666;
  }

  /* ************** 小键盘样式 ************** -E */
}</style>