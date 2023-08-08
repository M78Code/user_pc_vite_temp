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
// import betMixShow from 'src/project/components/bet/bet_mix_show.vue';
// import betMixShow2 from 'src/project/components/bet/bet_mix_show2.vue';
// import betMixDetail from 'src/project/components/bet/bet_mix_detail.vue';
// import betSingleDetail from 'src/project/components/bet/bet_single_detail.vue';
// import betSuccessBar from 'src/project/components/bet/bet_success_bar.vue';
// import betting from 'src/project/mixins/betting/betting.js';
// import keyBoard from 'src/project/components/bet/keyboard.vue';
// import ballSpin from 'src/project/components/bet/ball_spin.vue';
// import betBar from "src/project/components/bet/bet_bar.vue";
// import { mapMutations, mapGetters } from "vuex";
// import utils from 'src/public/utils/utils.js';
// import { api_betting } from "src/project/api/index.js";

const btn_show = ref(0)  //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
const exist_code = ref(0)    //投注后是否返回code码
const series_order_respList = ref([])   //串关投注成功后的返回(包含订单号、金额···)
const order_detail_resp_list = ref([])    // 单关和串关投注成功后的返回(投注项信息，赔率、盘口···)
const bet_money_total = ref(0),    //串关投注成功后的总投注额
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

// ...mapGetters(["get_update_tips","get_odds_change","get_mix_bet_flag", "get_money_total", "get_s_count_data", "get_bet_list", "get_is_accept", "get_order_ing", "get_is_spread", "get_is_mix", "get_current_menu", "get_m_id_list", "get_bet_status",
//       "get_money_notok_list", "get_user", "get_detail_data", "get_is_show_settle_tab", "get_change_list",   "get_active_index", "get_keyboard_show", "get_new_bet", "get_order_los", "get_bet_obj",
//       "get_order_suc", "get_money_notok_list2", "get_theme", "get_used_money", "get_is_champion", "get_invalid_ids", "get_cannot_mix_len", "get_order_no", "get_bet_success"]),

/** --------------------------onmounted开始 ---------------*/
onMounted(() => {
  this.timer = null;
  this.timer2 = null;
  this.timer3 = null;
  this.timer_count = null;
  this.timer_count_1 = null;
  this.timer_count_2 = null;
  //高度计算
  let rem_1 = window.innerWidth * 100 / 375;
  this.max_height1 = window.innerHeight - rem_1 * 3.9


  this.set_is_spread(false);
  // 5秒计时
  clearTimeout(this.timer)
  this.timer = setTimeout(() => {
    this.is_5s = true;
  }, 5000);

  //获取最大最小金额
  this.fetch_limit_money();
  if (+this.get_menu_type !== 900) {
    this.check_odds_beforebet2();    //投注前拉取最新的盘口赔率状态(应对socket推送不及时)
  }

  this.set_new_bet(false)

  this.scroll_box_ele = this.$refs.scroll_box
})

/** --------------------------onmounted结束 ---------------*/
//单关的数据对象
const single_item = computed(() => {
  if (this.get_bet_list[0]) {
    return this.get_bet_obj[this.get_bet_list[0]].bs
  } else {
    return {}
  }
})
//是否有重复的球员id或者球队id
const is_conflict = computed(() => {
  return !(_.uniq(this.get_m_id_list).length == this.get_m_id_list.length)
})

// 是否展示不支持串关提示
const is_conflict2 = computed(() => {
  let flag =
    (this.get_cannot_mix_len || this.get_invalid_ids.length) &&
    this.get_bet_list.length > 1 &&
    ![900, 3000].includes(+this.get_menu_type)

  if (flag) {
    this.btn_show = 5
  } else if (this.get_bet_status == 1) {
    this.btn_show = 0
  }
  return flag
})
//串关新流程且在注单确认中
// const   mixnew_bet = computed(()=>{
//   get() {
//     return this.get_new_bet && this.get_is_mix
//   }
// }
//计算样式，下面几种情况左下角按钮需要置灰不让点击
const calc_class = computed(() => {
  let flag = [2, 4].includes(+this.get_bet_status)
    || this.get_is_champion(this) && !this.get_bet_success
    || this.get_bet_status == 5 && this.get_bet_list.length == 1
    || this.get_menu_type == 3000 && _.get(this.single_item, 'hps[0].hl[0].hipo') != 1 && !this.get_bet_success
    || this.get_menu_type != 3000 && _.get(this.single_item, 'hps[0].hids') == 0 && !this.get_bet_success
    || this.btn_show == 5;
  return flag
})
//是否进入串关部分投注成功流程
const part_bet = computed(() => {
  return this.get_order_los.length && this.get_order_suc.length && !this.get_order_ing.length
})

onUnmounted(() => {
  this.clear_timer()

  this.set_order_ing({ change_: 1, value_: [] })
  this.set_order_no('')

  utils.del(this.series_order_respList);

  this.set_active_index(0);//活动子项置为初始值
  this.set_keyboard_show(true)

  this.$root.$off(this.emit_cmd.EMIT_C201_UPDATE, this.c201_update_handler1)
  this.$root.$off(this.emit_cmd.EMIT_C201_UPDATE, this.c201_update_handler2)

  this.debounce_throttle_cancel(this.check_odds_beforebet2);

  for (const key in this.$data) {
    this.$data[key] = null
  }
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
