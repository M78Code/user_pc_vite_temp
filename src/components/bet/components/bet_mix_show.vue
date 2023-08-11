<!--
* @Author: Router
* @Description: 常规赛事的单关和串关投注信息展示组件
-->

<template>
  <div class="bet-mix-show" v-show="is_show_successed_item" @click="handleonmousedown">
    <!-- 失效蒙层 -->
    <div class="locked-shadow" v-if="(pankou_change == 2 || hids || has_pre.own_)"></div>
    <div class="row justify-start items-center"
      :class="[get_bet_success ? 'yb_px14' : 'yb_pl12 yb_pr18', { 'bet-mix-show2': is_conflict }]">
      <div class="yb_mr12 dele-left" v-if="!get_bet_success">
        <img src="image/wwwassets/bw3/svg/bet_xuanx.svg" @click.stop="remove_(value_show.id_)">
      </div>
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
              <template v-if="get_bet_status == 3 && bet_success_obj.oddsValues">{{ bet_success_obj.oddsValues |
                format_odds(value_show.csid) }}</template>
              <template v-else>{{ odds_value() }}</template>
            </span>
            <!-- 红升绿降 -->
            <span :class="{ 'red-up': odds_change == 1, 'green-down': odds_change == 2 }" class="odd-change yb_ml4"
              v-if="!get_bet_success"></span>
          </div>
        </div>

        <!-- 中 -->
        <div class="row justify-between yb_my4 yb_fontsize14">
          <span :class="get_lang == 'vi' && get_bet_success ? 'col-6' : 'col-7'">
            <template v-if="_.get(value_show, 'hps[0].hl[0].hmt') == 0">{{ $root.$t('bet_record.ing')
            }}&thinsp;</template>
            <template v-if="get_is_champion(this)">{{ _.get(value_show, 'hps[0].hl[0].hps') }}</template>
            <!-- 投注成功后的玩法名称用接口返回的 -->
            <!--<template v-else-if="bet_success_obj.playName && [3, 6].includes(+get_bet_status)">{{bet_success_obj.playName}}</template>-->
            <template v-else>{{ value_show.hps[0].hpnb || value_show.hps[0].hpn }}</template>
            <!-- 基准分 -->
            <template
              v-if="(value_show.csid == 1 || value_show.csid == 2) && !((pre_or_bet === 0 || pre_or_bet) && pre_order_status)">&ensp;
              <template v-if="bet_success_obj.scoreBenchmark">{{ bet_success_obj.scoreBenchmark | calc_bifen2
              }}</template>
              <template v-else>{{ value_show | calc_bifen }}</template>
            </template>
          </span>
          <template v-if="get_bet_success && !(get_is_mix && get_bet_list.length > 1)">
            <template v-if="(pre_or_bet === 0 || pre_or_bet) && pre_order_status">
              <!-- 预约成功 -->
              <span class="color1"><img src="image/wwwassets/bw3/svg/bet_chengg.svg" class="img0">{{
                $root.$t('pre_record.booked') }}</span>
            </template>
            <template v-else>
              <!-- 投注成功 -->
              <span v-if="order_status == 1" class="color1"><img src="image/wwwassets/bw3/svg/bet_chengg.svg"
                  class="img0">{{ $root.$t('bet.bet_suc') }}</span>
              <!-- 投注失败 -->
              <span v-if="order_status == 0" class="color3"><img src="image/wwwassets/bw3/svg/bet_shib.svg"
                  class="img0">{{ $root.$t('bet.bet_err') }}</span>
              <!-- 提交成功 -->
              <span v-if="order_status == 2" class="color2"><img
                  :src="(`${$g_image_preffix}/image/wwwassets/bw3/svg/bet_tijiao${get_theme.includes('y0') ? '2' : ''}.svg`)"
                  class="img0 img1">{{ $root.$t('bet.submitted_successfully') }}</span>
            </template>
          </template>
          <template v-else>
            <!-- 不支持串关 -->
            <span v-if="hids" class="invalid-span2">{{ $root.$t('bet.invalidation2') }}</span>
            <!-- 失效 -->
            <span v-else-if="pankou_change == 2" class="invalid-span">{{ $root.$t('bet.invalidation') }}</span>
          </template>
        </div>

        <!-- 联赛名称 -->
        <div class="xia" v-if="value_show.tn && !get_is_champion(this)">{{ value_show.tn }}</div>

        <!-- 下 -->
        <div class="xia row justify-between flex-end yb_my4" style="min-height: 0.22rem">
          <div class="col-9 row" :class="{ 'col-12': !(authorityOptionFlag || show_pre) }">
            <template v-if="get_is_champion(this)">{{ value_show.onTn || value_show.tn }}</template>
            <template v-else-if="get_bet_success && bet_success_obj.matchInfo">{{ bet_success_obj.matchInfo }}</template>
            <template v-else>{{ value_show.mhn }}<span class="q-mx-xs">v</span>{{ value_show.man }} {{ score }}</template>
          </div>
          <div v-if="authorityOptionFlag" class="col-3 row subscribe-button" @click.stop="handlePre(true)">
            +{{ $root.$t('pre_record.book') }}</div>
          <div v-if="show_pre"><span class="pre-text">[{{ $root.$t('pre_record.book') }}]</span></div>
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
    <div class="subscribe-wrap" v-if="!get_is_mix && show_pre && pre_switch">
      <div class="operation-line" v-if="is_show_market"></div>
      <!-- 调整盘口 -->
      <div class="subscribe-operation" v-if="is_show_market">
        <span class="label">{{ $root.$t('pre_record.handicap') }}</span>
        <div class="operation">
          <span class="reduce" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(3)"
            :class="show_market_shadow ? 'shadow-show' : null">
            <img v-if="get_theme.includes('theme01')" src="image/wwwassets/bw3/common/reduce_black.png" />
            <img v-else src="image/wwwassets/bw3/common/reduce_white.png" />
          </span>
          <div class="odd" @click.stop="focus_market">
            <div class="odd_text">{{ pre_market_value || 0 }}</div>
            <span class="money-span" ref="money_span_market"
              :class="{ 'money-span2': !(get_active_index == 'market' + index_) }"></span>
          </div>
          <span class="add" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(4)"
            :class="show_market_shadow_max ? 'shadow-show' : null">
            <img v-if="get_theme.includes('theme01')" src="image/wwwassets/bw3/common/add_black.png" />
            <img v-else src="image/wwwassets/bw3/common/add_white.png" />
          </span>
        </div>
        <span class="delete"><img src="image/wwwassets/bw3/common/delete.png" @click.stop="handlePre(false)" /></span>
      </div>
      <div class="operation-line half-border-bottom"></div>
      <!-- 调整赔率 -->
      <div class="subscribe-operation">
        <span class="label">{{ $root.$t('pre_record.odds') }}</span>
        <div class="operation">
          <span class="reduce" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(1)"
            :class="pre_shadow_flag ? 'shadow-show' : null">
            <img v-if="get_theme.includes('theme01')" src="image/wwwassets/bw3/common/reduce_black.png" />
            <img v-else src="image/wwwassets/bw3/common/reduce_white.png" />
          </span>
          <div class="odd" @click.stop="focus_odds">
            <div class="odd_text">{{ (pre_odds ? pre_odds : (pre_odds === 0 || pre_odds === '0' ? '0' : '')) ||
              odds_value(true) }}</div>
            <span class="money-span" ref="money_span"
              :class="{ 'money-span2': !(get_active_index == 'pre' + index_) }"></span>
          </div>
          <span class="add" v-touch-repeat:0:300:200.mouse.enter.space.72.104="gtouchstart(2)"
            :class="pre_shadow_max_flag ? 'shadow-show' : null">
            <img v-if="get_theme.includes('theme01')" src="image/wwwassets/bw3/common/add_black.png" />
            <img v-else src="image/wwwassets/bw3/common/add_white.png" />
          </span>
        </div>
        <span class="delete"><img src="image/wwwassets/bw3/common/delete.png" v-if="!is_show_market"
            @click.stop="handlePre(false)" /></span>
      </div>
    </div>

    <!-- 对应单关多个注单样式 -->
    <template v-if="![11, 100, 900, 3000].includes(+get_menu_type)">
      <!-- 单关金额输入框 -->
      <bet-single-detail ref="bet_single_detail" v-if="!(get_bet_success || get_is_mix)" v-bind="$attrs" :name_="name_"
        :index_="index_"></bet-single-detail>
      <template v-if="get_bet_success && !get_is_mix && bet_success_obj">
        <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
        <div class="bottom-bar row justify-between yb_px14 yb_fontsize14 yb_mb8 ">
          <!--左边， 最高可赢 -->
          <p><span>{{ $root.$t('bet_record.bet_max_win') }}</span><span class="bottom-bar-sp yb_fontsize14 yb_ml8 ">{{
            (bet_success_obj.maxWinMoney / 100).toFixed(2) }}</span></p>
          <!--右边， 投注金额 -->
          <p><span>{{ $root.$t('bet.bet_val') }}</span><span class="bottom-bar-sp2 yb_fontsize14 yb_ml8 ">
              {{ (bet_success_obj.betMoney / 100).toFixed(2) }}</span></p>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
// import { mapMutations, mapGetters } from "vuex";
// import odd_convert from "src/public/mixins/odds_conversion/odds_conversion.js";
// import betting from 'src/project/mixins/betting/betting.js';
import betSingleDetail from './bet_single_detail.vue';
const FOOTBALL_PLAY_LET_BALL = [
  '3', // 全场让球胜平负
  '4', // 全场让球
  '19', // 上半场让球
  '33', // 15分钟进球-让球({a}-{b})
  '69', // 上半场让球胜平负
  '71', // 下半场让球胜平负
  '113',// 角球让球盘
  '121', // 上半场角球让球
  '128', // 加时赛上半场
  '130', // 加时赛-上半场让球
  '143', // 下半场让球
  '232', // 15分钟角球让球
  '269', // 全场让球
  '270', // 半场让球
  '334' // 点球大战-让球
]
const BASKETBALL_PLAY_LET_BALL = [
  '4',
  '19',
  '39',
  '46',
  '52',
  '58',
  '64',
  '143'
]
// 足球可以预约盘口的玩法id集合
const market_flag_list = [
  '2', '3', '4', '10', '11', '18', '19', '26', '33', '34', '71', '87', '88', '97', '98', '113', '114', '115',
  '116', '121', '122', '123', '124', '127', '128', '130', '134', '143', '232', '233', '269', '270',
  '69', '306', '307', '308', '309', '314', '315', '316', '317', '324', '325', '327', '328', '331', '332', '334', '335'
]
// 篮球可以预约盘口的玩法id集合
const market_flag_basketball_list = [
  '2', '4', '10', '11', '18', '19', '26', '38', '39', '45', '46', '51', '52', '57', '58',
  '63', '64', '87', '88', '97', '98', '143', '145', '146', '198', '199', '220', '221', '271', '272'
]

const odds_change = ref(0)    //0-正常，1-赔率升，2-赔率降
const pankou_change = ref(0)   //0-盘口未变化，1-盘口值变化，2-盘口失效(封盘和关盘)，3-锁盘
const is_suspend_watch = ref(false) // 是否暂停监听赔率盘口变化
const order_status = ref(1)  //1-投注成功  2-投注确认中  0-投注失败
const pre_ov = ref(0) // 预约投注赔率(原始的欧洲赔率)
const pre_odds = ref('') //键盘带过来的预约值
const pre_market_value = ref('') //预约投注盘
const pre_switch = ref(0)//当前投注项预约开关
const flicker_timer = ref(null)     //光标闪动计时器
const low_odds = ref(0)//最低赔率
const daxiao_market_value = ref(0.5) //大小玩法最低盘口值，初始最低0.5
const daxiao_market_value_max = ref(30) //大小玩法最大盘口值
const rq_market_value_max = ref(10)  //让球类玩法最大盘口值
const rq_market_value_min = ref(-10) //让球类玩法最小盘口值
const market_value_unit = ref(0.25)//盘口变动值，默认足球0.25，篮球是0.5
const focus_type = ref(0) // 光标聚焦到哪里

onMounted(() => {
  this.timer = null;
  this.timer2 = null;
  this.timer3 = null;

  this.flicker_();
  //监听键盘赔率改变事件
  this.$root.$on(this.emit_cmd.EMIT_CHANGE_ODDS, this.change_odds_handle)
  //监听键盘盘口改变事件
  this.$root.$on(this.emit_cmd.EMIT_CHANGE_MARKET, this.change_market_handle)
  if (this.bet_obj_mhs == 11 || this.bet_obj_hs == 11) {
    this.set_bet_status(7);
  };

  this.$root.$on(this.emit_cmd.EMIT_REMOVE_INVALID_, this.reomve_invalid_handle)
  this.$root.$on(this.emit_cmd.EMIT_C201_UPDATE2, this.c201_update2_handle)
  if (this.value_show.csid != 1) {
    this.daxiao_market_value = 0.5//大小玩法最低盘口值，初始最低0.5
    this.daxiao_market_value_max = 400//大小玩法最大盘口值
    this.rq_market_value_max = 99.5 //让球类玩法最大盘口值
    this.rq_market_value_min = -99.5//让球类玩法最小盘口值
    this.market_value_unit = 0.5
  }
  // 初始化预约投注的赔率和盘口
  if (this.show_pre) {
    this.pre_ov = this.get_bet_obj[this.name_].pre_odds
    this.low_odds = this.get_bet_obj[this.name_].min_odds || this.bet_obj_ov
    this.pre_market_value = this.get_bet_obj[this.name_].pre_market_value
  }
  //设置当前预约投注索引
  if (!this.has_pre.own_ && this.has_pre.others) {
    this.set_active_index(this.index_)
  }

})

const props = defineProps({
  name_: String,
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
  }
})


/** --------------------------watch开始 ---------------*/

//检测比分，设置大小类玩法最低盘口值
watch(() => score, (new_) => {
  const ol_obj = _.get(this.value_show, 'hps[0].hl[0].ol[0]')
  const hps_obj = _.get(this.value_show, 'hps[0]')
  if (!this.get_is_mix && this.show_pre && this.pre_switch && new_) {
    const method_type = ol_obj.ot
    const new_arr = new_.replace(/\(/, '').replace(/\)/, '').split('-') || []
    if (['Over', 'Under'].includes(method_type) && new_arr.length > 1) {
      const homeTeamMethodList = [ //主队进球大小玩法
        '10', '87', '88', '115', '123', '314', '316'
      ]
      const awayMethodList = [
        '11', '97', '98', '116', '124', '315', '317'
      ] //客队进球大小玩法
      let temp_value = 0
      if (homeTeamMethodList.includes(hps_obj.hpid)) {
        temp_value = +new_arr[0]
      } else if (awayMethodList.includes(hps_obj.hpid)) {
        temp_value = +new_arr[1]
      } else {
        temp_value = +new_arr[0] + +new_arr[1]
      }
      this.daxiao_market_value = this.acc_add(temp_value, 0.5)
    }
  } else {
    return
  }
}, {
  immediate: true,
  deep: true
})

//监控投注项
watch(() => get_bet_obj, (new_) => {
  this.pre_switch = new_[this.name_].pre_switch
  if (new_[this.name_].market_tips == 1) {
    this.pre_market_value = new_[this.name_].pre_market_value
    if (this.get_active_index == 'market' + this.index_) {
      this.send_market_to_keyboard()
    }
    this.tips_msg_update(this.$root.$t('pre_record.market_error_info_low'))
    let bet_obj = _.cloneDeep(this.get_bet_obj)
    bet_obj[this.name_].market_tips = 0
    this.set_bet_obj(bet_obj)
    clearTimeout(this.timer3)
    this.timer3 = setTimeout(() => {
      this.tips_msg_update('')
    }, 3000);
    return
  }
  if (new_[this.name_].pre_odds && new_[this.name_].pre_odds > this.pre_ov) {
    this.pre_odds = ''
    this.pre_ov = new_[this.name_].pre_odds
    this.tips_msg_update(this.$root.$t('error_msg_info.0400540.client_msg'))
    clearTimeout(this.timer3)
    this.timer3 = setTimeout(() => {
      this.tips_msg_update('')
    }, 3000);
  }
}, {
  deep: true,
  immediate: true
})
//检测预约赔率变化，更新至投注对象
watch(() => pre_ov, (new_) => {
  let bet_obj = _.cloneDeep(this.get_bet_obj)
  bet_obj[this.name_].pre_odds = new_
  this.set_bet_obj(bet_obj)
})
//检测预约盘口变化，更新至投注对象
watch(() => get_update_tips, (new_) => {
  //盘口值有存在为0的情况
  if (!newVal && newVal !== 0 && newVal !== '0') {
    return;
  }
  const ol_obj = _.get(this.value_show, 'hps[0].hl[0].ol[0]')
  const hps_obj = _.get(this.value_show, 'hps[0]')
  const marketList = this.get_pre_market_data.filter((o) => {
    return o.matchInfoId == this.value_show.hps[0].mid && o.playId == this.value_show.hps[0].hpid
  })
  let bet_obj = _.cloneDeep(this.get_bet_obj)
  //处理当盘口值变化时，赔率的变化
  if (marketList.length > 0) {
    const marketItem = marketList[0].marketList
    let hasEqualMarket = false//是否相同盘口，用来判断赋值最低赔率
    marketItem.map((item) => {
      const otObj = _.find(item.marketOddsList, (o) => { return o.oddsType == ol_obj.ot })
      if (!this.rq_play_list.includes(hps_obj.hpid)) {//大小比较方式
        if (item.marketValue == newVal && otObj) {
          hasEqualMarket = true
          this.low_odds = otObj.oddsValue
          bet_obj[this.name_].min_odds = otObj.oddsValue
          //当变更后的盘口，赔率大于当前赔率时处理
          if (otObj.oddsValue > this.pre_ov) {
            this.pre_odds = ''
            this.pre_ov = Number(otObj.oddsValue)
            if (this.get_active_index == 'pre' + this.index_) {
              this.send_odds_to_keyboard()
            }
          }
        }
      } else {//让球比较方式
        if (otObj && otObj.playOptions == newVal) {
          hasEqualMarket = true
          this.low_odds = otObj.oddsValue
          bet_obj[this.name_].min_odds = otObj.oddsValue
          //当变更后的盘口，赔率大于当前赔率时处理
          if (otObj.oddsValue >= this.pre_ov) {
            this.pre_odds = ''
            this.pre_ov = Number(otObj.oddsValue)
            if (this.get_active_index == 'pre' + this.index_) {
              this.send_odds_to_keyboard()
            }
          }
        }
      }
    })
    if (!hasEqualMarket) {
      this.low_odds = 0
    }
  }
  bet_obj[this.name_].pre_market_value = newVal
  this.set_bet_obj(bet_obj)
})
// 解决投注项数量减少会导致位置移动，错误显示盘口赔率变化
watch(() => get_bet_list.length, (newVal, oldVal) => {
  if (newVal > oldVal) return

  this.is_suspend_watch = true
  this.$nextTick(() => {
    this.is_suspend_watch = false

  })
})
//监听赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
bet_obj_mhs(() => get_update_tips, (new_) => {
  tips_msg = new_
})
watch(() => get_update_tips, (new_) => {
  if (
    [3, 4, 6].includes(+this.get_bet_status) ||
    this.is_suspend_watch
  ) {
    return
  }

  if (new_ == 0) {
    this.set_invalid_ids({ type: 2, val: this.value_show.mid }) // 删除赛事和盘口级别正常的id
    this.pankou_change = 0
    this.set_bet_status(1);
    this.set_odds_change(false);
  }

  if (new_ == 11) {
    this.set_invalid_ids({ type: 2, val: this.value_show.mid }) // 删除赛事和盘口级别正常的id
    this.pankou_change = 0
    this.set_bet_status(7);
    this.set_odds_change(false);
  }

  if ([1, 2].includes(+new_)) {
    this.pankou_change = 2;
    this.set_invalid_ids({ type: 1, val: this.value_show.mid }) // 对应赛事和盘口级别失效时记录id
    this.set_odds_change(true);
  }
})
//监听盘口级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
watch(() => bet_obj_hs, (new_) => {
  if (
    [3, 4, 6].includes(+this.get_bet_status) ||
    this.is_suspend_watch
  ) {
    return
  }

  if (new_ == 0) {
    this.set_invalid_ids({ type: 2, val: this.value_show.mid }) // 删除赛事和盘口级别正常的id
    this.pankou_change = 0
    this.set_bet_status(1);
    this.set_odds_change(false);
  }

  if (new_ == 11) {
    this.set_invalid_ids({ type: 2, val: this.value_show.mid }) // 删除赛事和盘口级别正常的id
    this.pankou_change = 0
    this.set_bet_status(7);
    this.set_odds_change(false);
  }

  if ([1, 2].includes(+new_)) {
    this.pankou_change = 2;
    this.set_invalid_ids({ type: 1, val: this.value_show.mid }) // 对应赛事和盘口级别失效时记录id
    this.set_odds_change(true);
  }
}, {
  immediate: true
})
//监听投注项状态变化,socket对应1.开盘，2封盘，3详情页投注项需要隐藏(用失效对应)
watch(() => bet_obj_os, (new_) => {
  if (
    [3, 4, 6].includes(+this.get_bet_status) ||
    this.is_suspend_watch
  ) {
    return
  }

  if ([2, 3].includes(+new_)) {
    this.pankou_change = 2;
    this.set_odds_change(true);
  }
})
//监听盘口值变化
watch(() => bet_obj_on, (new_) => {
  if (
    [3, 4, 6].includes(+this.get_bet_status) ||
    this.is_suspend_watch
  ) {
    return
  }

  if (this.pankou_change != 2) {  //盘口失效时盘口值变化不给颜色变化
    this.pankou_change = 1;
  }

  this.set_odds_change(true);

  // 3秒后重置样式,盘口失效（关盘或者封盘）时盘口值变化，不用3秒后回到盘口正常状态
  clearTimeout(this.timer)
  this.timer = setTimeout(() => {
    if (![1, 2].includes(+this.bet_obj_hs)) {
      this.pankou_change = 0;
    }
  }, 3000);

  if (this.get_is_mix) {    //串关盘口值变更后拉取最新限额
    this.fetch_limit_money();
  }
})
//监听赔率变化  get_bet_status == 2在C106的地方做了一层过滤
watch(() => bet_obj_ov, (new_, old_) => {
  this.calc_mixcount(false)
  if (
    [2, 3].includes(+this.get_bet_status) &&
    _.get(this.value_show, 'hps[0].hl[0].ol[0].ov2')
  ) {
    this.bet_success_obj.oddsValues = _.get(this.value_show, 'hps[0].hl[0].ol[0].ov2')
    return
  }

  if (
    ![1, 5, 6, 7].includes(+this.get_bet_status) ||
    this.pankou_change == 2 ||
    this.is_suspend_watch
  ) {
    return
  }

  clearTimeout(this.timer2)
  // 3秒后重置样式
  this.timer2 = setTimeout(() => {
    this.odds_change = 0;
  }, 3000);

  if (this.get_bet_status == 6) {   //提交成功状态，如果选择的是自动接受任何赔率变动跟着变，如果选的是接受更好的赔率，当赔率更好了跟着变
    if (
      [1, 3].includes(+this.get_is_accept) &&
      old_ && new_ - old_ >= 1000
    ) {
      this.odds_change = 1;
    }

    if (this.get_is_accept == 2) {
      if (old_ && new_ - old_ >= 1000) {
        this.odds_change = 1;
      } else if (old_ - new_ >= 1000) {
        this.odds_change = 2;
      }
    }

    return;
  }

  if (new_ < 101000) {   //原始欧赔小于101000,失效处理
    this.pankou_change = 2;
    this.set_odds_change(true);
    return;
  }

  if (old_ && new_ - old_ >= 1000) {
    this.odds_change = 1;
    this.set_odds_change(true);
  } else if (old_ - new_ >= 1000) {
    this.odds_change = 2;
    this.set_odds_change(true);
  }
})
//状态变为0、1时作初始化处理
watch(() => get_update_tips, (new_, old_) => {
  if (new_ == 1) {
    this.odds_change = 0;
    this.pankou_change = 0;
    this.set_invalid_ids({ type: 0 })
  };

  //状态变为正常时，可能是 1 也能是 7
  if (
    new_ == 1 &&
    old_ == 5 &&
    (this.bet_obj_hs == 11 || this.bet_obj_mhs == 11)
  ) {
    this.set_bet_status(7)
  }
})
//监听状态变化来设置赔率或盘口变化的id_集合
watch(() => get_update_tips, (new_) => {
  if (new_ && this.get_bet_status != 6) {
    this.set_change_list({ value: _.get(this.value_show, 'hps[0].hl[0].ol[0].id_'), status: 1 });
  } else {
    this.set_change_list({ value: _.get(this.value_show, 'hps[0].hl[0].ol[0].id_'), status: 2 });
  }
})
// 记录投注项失效的id_集合
watch(() => pankou_change, (new_) => {
  if (new_ != 2) {
    this.set_invalid_ids({ type: 2, val: this.value_show.mid })
  }
})

watch(() => query_order_obj, (new_) => {
  query_order_obj_handle()
})


/** --------------------------watch结束 ---------------*/

/** --------------------------computed ---------------*/
// ...mapGetters(['get_cur_odd','get_pre_market_data','get_is_conflict','get_user','get_active_index', 'get_theme', 'get_lang', 'get_is_champion', 'get_menu_type', 'get_is_combine', 'get_new_bet', 'get_bet_status', 'get_order_no',
//      'get_bet_status', 'get_bet_list', 'get_bet_obj', 'get_is_accept', 'get_is_mix', 'get_bet_success']),
//足球或者篮球的让球玩法集合
const rq_play_list = computed(() => {
  return this.value_show.csid == 1 ? FOOTBALL_PLAY_LET_BALL : BASKETBALL_PLAY_LET_BALL
})
//赛事id或者球员id是否冲突
const is_conflict = computed(() => {
  return this.get_is_conflict([this.value_show.maid, this.value_show.mhid])
})
//判断调整后的赔率是否小于最低赔率
const pre_shadow_flag = computed(() => {
  if (this.pre_ov <= this.low_odds) {
    return true
  } else {
    return this.pre_ov <= 101000
  }
})
// 计算是否展示盘口预约功能
const is_show_market = computed(() => {
  let bookMarketSwitch = _.get(this.get_user, 'configVO.bookMarketSwitch')
  let bookMarketSwitchBasketball = _.get(this.get_user, 'configVO.bookMarketSwitchBasketball', 0)
  if (this.value_show.csid == 1) {
    return market_flag_list.includes(this.value_show.hps[0].hpid) && bookMarketSwitch == 1
  } else {
    return market_flag_basketball_list.includes(this.value_show.hps[0].hpid) && bookMarketSwitchBasketball
  }
})
//判断让球、大小类盘口值是否低于最低盘口值
const show_market_shadow = computed(() => {
  if (['Over', 'Under'].includes(_.get(this.value_show, 'hps[0].hl[0].ol[0].ot'))) {
    const split_value = _.words(this.pre_market_value, /[^+,/ ]+/g)
    if (split_value.length > 1) {
      return (Number(split_value[0]) + Number(split_value[1])) / 2 <= this.daxiao_market_value
    } else {
      return this.pre_market_value <= this.daxiao_market_value
    }
  } else {
    const split_value = _.words(this.pre_market_value, /[^+,/ ]+/g)
    if (split_value.length > 1) {
      return (Number(split_value[0]) + Number(split_value[1])) / 2 <= this.rq_market_value_min
    } else {
      return this.pre_market_value <= this.rq_market_value_min
    }
  }
})
//判断大小类,让球盘口值是否高于最大盘口值
const show_market_shadow_max = computed(() => {
  const compaire_val = ['Over', 'Under'].includes(_.get(this.value_show, 'hps[0].hl[0].ol[0].ot')) ? this.daxiao_market_value_max : this.rq_market_value_max;
  const split_value = _.words(this.pre_market_value, /[^+,/ ]+/g)
  if (split_value.length > 1) {
    return (Number(split_value[0]) + Number(split_value[1])) / 2 >= compaire_val
  } else {
    return this.pre_market_value >= compaire_val
  }
})
//预约投注开关
const authorityOptionFlag = computed(() => {
  return (!this.get_is_mix) && this.pre_switch && (!this.get_bet_success) && this.authorityFlag && (!this.show_pre)
})
//判断该商户是否有权限预约投注
const authorityFlag = computed(() => {
  const bookBet = _.get(this.get_user, 'configVO.bookBet')
  const marketConfigValue = _.get(this.get_user, 'configVO.marketConfigValue')
  return bookBet == 1 && (this.value_show.csid == 1 || this.value_show.csid == 2) && marketConfigValue == 1
})
//判断投注成功后是否是预约投注
const pre_order_status = computed(() => {
  const success_pre = _.find(this.order_detail_resp_list, (item) => {
    return _.get(item, 'is_pre')
  })
  return success_pre
})
// 判断是走正常投注还是预约
const pre_or_bet = computed(() => {
  let status = ''
  this.order_detail_resp_list.map(item => {
    status = item.preOrderDetailStatus
  })
  return status
})
const bet_obj_item = computed(() => {
  return this.get_bet_obj[this.name_]
})
//投注对象数据
const value_show = computed(() => {
  return this.bet_obj_item.bs;
})
//判断当前投注项里面是否是预约单
const has_pre = computed(() => {
  const item_name = _.findKey(this.get_bet_obj, function (o) { return o.show_pre })
  if (item_name) {
    if (item_name == this.name_) {
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
  let flag = this.get_bet_list.length == 1
    || !this.get_bet_success
    || this.get_is_mix
    || this.get_bet_success && !this.get_is_mix && this.get_bet_list.length > 1 && this.bet_obj_item.money >= 0.01 && this.bet_success_obj
  return flag
})
//将赔率映射为计算属性
const bet_obj_ov = computed(() => {
  return _.get(this.value_show, 'hps[0].hl[0].ol[0].ov')
})
//将列表页盘口值 on  映射为计算属性
const bet_obj_on = computed(() => {
  return _.get(this.value_show, 'hps[0].hl[0].ol[0].on')
})
// 将 普通赛事是否支持串关 映射为计算属性
const hids = computed(() => {
  return (this.get_is_mix && _.get(this.bet_obj_item, 'cs.cds') == "C01") || (_.get(this.value_show, 'hps[0].hids') == 0 &&
    this.get_bet_list.length > 1 &&
    this.get_menu_type != 3000 &&
    this.get_is_mix)
})
//将赛事级别盘口状态映射为计算属性
const bet_obj_mhs = computed(() => {
  return this.value_show.mhs;
})
//将盘口状态映射为计算属性
const bet_obj_hs = computed(() => {
  return this.value_show.hps[0].hl[0].hs;
})
//盘口值
const bet_obj_hv = computed(() => {
  if (!this.rq_play_list.includes(_.get(this.value_show, 'hps[0].hpid'))) {
    return _.get(this.value_show, 'hps[0].hl[0].hv')
  }
  return _.get(this.value_show, 'hps[0].hl[0].ol[0].on')
})
//将投注项状态状态映射为计算属性
const bet_obj_os = computed(() => {
  return _.get(this.value_show, 'hps[0].hl[0].ol[0].os')
})
//是否显示下边线
const show_border = computed(() => {
  return this.get_bet_list[this.get_bet_list.length - 1] != this.name_ && this.get_is_mix
})
// 每个投注项赔率和盘口状态是否正常
const status_normal = computed(() => {
  return [1, 2].includes(+this.odds_change) || [1, 2].includes(+this.pankou_change)
})
/**
    *@description 赔率转换
    *@param {String} value 原始的欧洲赔率
    *@param {String} hsw 支持赔率转换的类型，逗号分隔
    *@param {Boolean} is_pre 是否预约投注的赔率
    *@return {String} 转换后的赔率
    */
const odds_value = computed(() => {
  return (is_pre) => {
    let val = (is_pre ? this.pre_ov : this.bet_obj_ov) / 100000,
      hsw = this.value_show.hps[0].hsw;

    if (this.get_is_champion(this)) {   //冠军玩法不支持赔率转化
      hsw = '1'
    }

    let S = this.compute_value_by_cur_odd_type(val, null, hsw, null, this.value_show.csid);
    return S ? S : '';
  }
})
// 单关投注成功后的bet接口返回的数据
const bet_success_obj = computed(() => {
  return this.order_detail_resp_list.find(item => {
    if (this.pre_order_status) {
      if (this.pre_or_bet === 0 || this.pre_or_bet) {
        this.order_status = item.preOrderDetailStatus;
      } else {
        this.order_status = item.orderStatusCode;
      }
      return true
    }
    let flag = item.playOptionsId == this.bet_obj_item.cs.oid
    if (flag) {
      this.order_status = item.orderStatusCode;
    }
    return flag
  }) || ''
})
// 展示欧洲盘还是香港盘
const hptype = computed(() => {
  let type = 'EU'
  if (this.get_cur_odd == 'HK' && _.get(this.value_show, 'hps[0].hsw').includes('2')) {
    type = 'HK'
  }
  return this.$root.$t(`odds.${type}`)
})

/** --------------------------computed结束 ---------------*/

/** --------------------------事件开始 ---------------*/
/** --------------------------事件结束 ---------------*/


onUnmounted(() => {
  this.clear_timer()

  this.$root.$off(this.emit_cmd.EMIT_REMOVE_INVALID_, this.reomve_invalid_handle)
  this.$root.$off(this.emit_cmd.EMIT_C201_UPDATE2, this.c201_update2_handle)
  this.$root.$off(this.emit_cmd.EMIT_CHANGE_ODDS, this.change_odds_handle)
  this.$root.$off(this.emit_cmd.EMIT_CHANGE_MARKET, this.change_market_handle)
  for (const key in this.$data) {
    this.$data[key] = null
  }
})


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
