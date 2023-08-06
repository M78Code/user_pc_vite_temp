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
      <div class="scroll-box" ref="scroll_box" :style="{'max-height':`${max_height1}px`}" @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
        <!-- 上部纯展示组件 -->
        <div v-for="(value,name) in get_bet_obj" :key="name" class="mix-show-box">
          <!-- 虚拟体育 -->
          <template v-if="get_menu_type == 900">
            <bet-mix-show2 :name_="name" :order_detail_resp_list="order_detail_resp_list" :odds_value2="odds_value2" :play_optionname2="play_optionname" :playname2="playname2"></bet-mix-show2>
          </template>
          <!-- 非虚拟体育 -->
          <template v-else>
            <bet-mix-show :name_="name" :order_detail_resp_list="order_detail_resp_list" :query_order_obj="query_order_obj"></bet-mix-show>
          </template>
        </div>

        <!-- 串关投注成功组件 -->
        <template v-if="btn_show == 1 || mixnew_bet || part_bet">
          <div v-show="btn_show == 1 && !mixnew_bet || part_bet">
            <div v-for="(item,index) in series_order_respList" :key="index">
              <betSuccessBar :item_="item" @update_money="update_money" :query_order_obj="query_order_obj" :len='series_order_respList.length'></betSuccessBar>
            </div>
          </div>
        </template>

        <!-- 单关 -->
        <template v-if="get_bet_list.length == 1">
          <template v-if="get_bet_success">
            <!-- 单关投注完成后底部的显示（包括投注失败8，投注成功3，提交成功6） -->
            <div class="row justify-between yb_px14 yb_fontsize14 yb_mb8 bottom-bar">
              <p><span>{{ $root.$t('bet_record.bet_max_win') }}</span><span class="yb_fontsize14 yb_ml8 bottom-bar-sp">{{(max_winmoney/100).toFixed(2)}}</span></p>
              <p><span>{{ $root.$t('bet.bet_val') }}</span><span class="yb_fontsize14 yb_ml8 bottom-bar-sp2">{{(bet_money/100).toFixed(2)}}</span></p>
            </div>
          </template>
          <template v-else>
            <!-- 单关金额输入框 -->
            <bet-single-detail ref="bet_single_detail" :tips_msg.sync="tips_msg" :name_="get_bet_list[0]"></bet-single-detail>
          </template>
        </template>

        <!-- 串关主体 金额输入框-->
        <template v-if="get_bet_list.length != 1 && ![3, 6].includes(+get_bet_status)">
          <bet-mix-detail :value_="item" :index_="index" v-for="(item,index) of get_s_count_data" :key="index" :tips_msg.sync="tips_msg"></bet-mix-detail>
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
        <div class="yb_px14 row items-center yb_fontsize12 justify-center err-msg" style="min-height:0.3rem" @touchmove.prevent>
          <span class="text-center yb_py4">{{$root.$t('bet.msg10')}}</span>
        </div>
      </template>
      <!-- 不支持串关提示 -->
      <template v-else-if="is_conflict2">
        <div class="err-msg3 yb_px14 text-center" @touchmove.prevent @click="reomve_invalid">
          <i class="close yb_mr4"></i>
          <!-- 移除无效投注 -->
          {{$root.$t('bet.msg11')}}
        </div>
      </template>
      <!-- 失效和赔率变化 或者 正常状态 -->
      <template v-else>
        <div class="yb_px14 row items-center yb_fontsize12" :class="tips_msg ? 'justify-center err-msg':'justify-end err-msg2'"
          :style="{'min-height': [3, 6, 8].includes(+get_bet_status) ? '0.38rem':'0.3rem'}" @touchmove.prevent @click="nothing">
          <template v-if="tips_msg "><span class="text-center yb_py4">{{(tips_msg)}}</span></template>
          <template v-else-if="!tips_msg && [1, 2, 7].includes(+get_bet_status)">
            <!-- 左 -->
            <i class="img2" :class="{'img3': get_is_accept != 2}" @click="toggle_accept"></i>
            <span
                :class="{'auto-text':get_is_accept == 2,'ac-rules':get_bet_list.length > 1}"
                class="yb_mx4"
                style="max-width:1.6rem"
                @click="toggle_accept"
            >{{$root.$t("ac_rules.auto")}}</span>
            <img  src="image/wwwassets/bw3/svg/rules2.svg"  @click="change_accept" class="img1" v-if="get_theme.includes('theme01')"/>
            <img  src="image/wwwassets/bw3/svg/rules3.svg" @click="change_accept" class="img1" v-else />
            <!-- 右 -->
            <span v-if="get_bet_list.length==1">
              <i class="img2" :class="{'img3': get_used_money != 0}" @click="change_used_money"></i>
              <span class="yb_ml4" :class="get_used_money == 0 && 'auto-text'" @click="change_used_money">{{$root.$t('bet.used_money2')}}</span>
            </span>
            <span @click.stop="spread_options" :class="{'opacity-m':get_bet_list.length == 2 || get_s_count_data.length == 1,'col-5 text-right':get_bet_list.length > 1}" v-else>
              {{ get_is_spread ? $root.$t('bet.msg04') : $root.$t('bet.msg05')}}
              <i class="arrow" :class="{'arrow2': !get_is_spread}"></i>
            </span>
          </template>
        </div>
      </template>

      <key-board v-show="get_keyboard_show"></key-board>

      <!-- 底部按钮 -->
      <div class="row yb_px10 yb_pb8 justify-between" @touchmove.prevent>
        <!-- 左边 -->
        <div class="add-box" :class="{'add-box2':get_bet_list.length >= 2 || get_bet_success,'add-box3':calc_class}" @click.stop="pack_up(2)">
          <template v-if="!get_bet_success">
            <span v-if="get_bet_list.length > 1">{{$root.$t('bet.delete_all')}}</span>
            <span class="kushikatsu-text" v-else>
              {{$root.$t('bet.kushikatsu')}}
              <i class="bet-add"></i>
            </span>
          </template>
          <template v-else>
            <span>{{$root.$t('bet.save')}}</span>
          </template>
        </div>
        <!-- 右边 -->
        <div class="bet-box">
          <template v-if="exist_code == '666'">
            <p @click="go_record" class="yb_fontsize16">{{$root.$t('bet.msg13')}}</p>
          </template>
          <template v-else-if="is_conflict">
            <!-- 投注 -->
            <div class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{$root.$t('bet_record.bet_val')}}</p>
              <p class="yb_fontsize20">{{get_money_total.toFixed(2) | format_money2}}</p>
            </div>
          </template>
          <template v-else>
            <!-- 投注 -->
            <div v-if="btn_show == 0" @click="submit_order" :class="{'set-opacity':get_money_notok_list.length}" class="row justify-center items-center content-center">
              <p class="yb_fontsize12 yb_mr10">{{$root.$t('bet_record.bet_val')}}</p>
              <p class="yb_fontsize20">{{get_money_total.toFixed(2) | format_money2}}</p>
            </div>
            <!-- 投注 有投注项失效后点击接受变化的置灰样式-->
            <div v-if="btn_show == 5" class="row justify-center items-center content-center set-opacity">
              <p class="yb_fontsize12 yb_mr10">{{$root.$t('bet_record.bet_val')}}</p>
              <p class="yb_fontsize20">{{get_money_total.toFixed(2) | format_money2}}</p>
            </div>
            <!-- 确定 -->
            <p v-if="btn_show == 1" @click="pack_up" class="yb_fontsize16">{{$root.$t('common.ok')}}</p>
            <!-- 处理中 -->
            <div v-if="btn_show == 2" class="yb_fontsize16 row justify-center items-center">
              <p class="yb_mr8">{{$root.$t('bet_record.submitting_bet')}}</p>
              <ball-spin />
            </div>
            <!-- 接受变化 -->
            <p v-if="btn_show == 3" @click="agree_change" class="yb_fontsize16">{{$root.$t('bet.agree_change')}}</p>
            <!-- 接受变化并投注 -->
            <p v-if="btn_show == 4" @click="submit_order" class="yb_fontsize16">{{$root.$t('bet.agree_change2')}}</p>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import betMixShow from 'src/project/components/bet/bet_mix_show.vue';
import betMixShow2 from 'src/project/components/bet/bet_mix_show2.vue';
import betMixDetail from 'src/project/components/bet/bet_mix_detail.vue';
import betSingleDetail from 'src/project/components/bet/bet_single_detail.vue';
import betSuccessBar from 'src/project/components/bet/bet_success_bar.vue';
import betting from 'src/project/mixins/betting/betting.js';
import keyBoard from 'src/project/components/bet/keyboard.vue';
import ballSpin from 'src/project/components/bet/ball_spin.vue';
import betBar from "src/project/components/bet/bet_bar.vue";
import { mapMutations, mapGetters } from "vuex";
import utils from 'src/public/utils/utils.js';
import { api_betting } from "src/project/api/index.js";
export default {
  name: "bet-mix-box-child1",
  mixins: [betting],
  data() {
    return {
      // get_bet_status: 0,放到全局了
      // 单注的状态 0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
      btn_show: 0, //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
      exist_code: 0,    //投注后是否返回code码
      series_order_respList: [],    //串关投注成功后的返回(包含订单号、金额···)
      order_detail_resp_list: [],    // 单关和串关投注成功后的返回(投注项信息，赔率、盘口···)
      bet_money_total: 0,    //串关投注成功后的总投注额
      max_win_money_total: 0,    //串关投注成功后的总最高可赢
      query_order_obj: [],   //queryOrderStatus接口返回数据
      is_5s: false, //弹框弹起来有没有5秒,到了5秒就用默认的5000作限额,不作弹框提示
      max_winmoney: 0,   //单关投注成功后接口返回的最高可赢
      odds_value2: "",   //单关投注成功后接口返回的赔率
      playname2: "",   //单关投注成功后接口返回的玩法名称
      bet_money: 0,    //单关投注成功后接口返回的投注金额
      play_optionname: "",   //单关投注成功后接口返回的playOptionName
      max_height1: 230,   //滚动区域的最大高
      is_new_bet: false,  //get_orderstatus 接口返回是否是新流程
      need_bet_again: false,  //是否需要重新发起投注
      check_odds_beforebet2: this.debounce(this.check_odds_beforebet, 200), //防抖处理
      scroll_box_ele: null,  // dom元素
      is_loading_balance: false, // 金额刷新中？
    };
  },

  components: { betMixShow, betMixDetail, betSuccessBar, betSingleDetail, keyBoard, betMixShow2, ballSpin, betBar },

  computed: {
    ...mapGetters(["get_update_tips","get_odds_change","get_mix_bet_flag", "get_money_total", "get_s_count_data", "get_bet_list", "get_is_accept", "get_order_ing", "get_is_spread", "get_is_mix", "get_current_menu", "get_m_id_list", "get_bet_status",
      "get_money_notok_list", "get_user", "get_detail_data", "get_is_show_settle_tab", "get_change_list",   "get_active_index", "get_keyboard_show", "get_new_bet", "get_order_los", "get_bet_obj",
      "get_order_suc", "get_money_notok_list2", "get_theme", "get_used_money", "get_is_champion", "get_invalid_ids", "get_cannot_mix_len", "get_order_no", "get_bet_success"]),
    //单关的数据对象
    single_item() {
      if (this.get_bet_list[0]) {
        return this.get_bet_obj[this.get_bet_list[0]].bs
      } else {
        return {}
      }
    },
    //是否有重复的球员id或者球队id
    is_conflict() {
      return !(_.uniq(this.get_m_id_list).length == this.get_m_id_list.length)
    },
    // 是否展示不支持串关提示
    is_conflict2() {
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
    },
    //串关新流程且在注单确认中
    mixnew_bet: {
      get() {
        return this.get_new_bet && this.get_is_mix
      },
      set() { }
    },
    //计算样式，下面几种情况左下角按钮需要置灰不让点击
    calc_class() {
      let flag = [2, 4].includes(+this.get_bet_status)
        || this.get_is_champion(this) && !this.get_bet_success
        || this.get_bet_status == 5 && this.get_bet_list.length == 1
        || this.get_menu_type == 3000 && _.get(this.single_item, 'hps[0].hl[0].hipo') != 1 && !this.get_bet_success
        || this.get_menu_type != 3000 && _.get(this.single_item, 'hps[0].hids') == 0 && !this.get_bet_success
        || this.btn_show == 5;
      return flag
    },
    //是否进入串关部分投注成功流程
    part_bet() {
      return this.get_order_los.length && this.get_order_suc.length && !this.get_order_ing.length
    },
  },
  created() {
    // 延时器
    this.timer = null;
    this.timer2 = null;
    this.timer3 = null;
    this.timer_count = null;
    this.timer_count_1 = null;
    this.timer_count_2 = null;
    //高度计算
    let rem_1 = window.innerWidth * 100 / 375;
    this.max_height1 = window.innerHeight - rem_1 * 3.9
  },

  mounted() {
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
  },
  destroyed() {
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

  },
  watch: {
    //更新提示消息
    get_update_tips(new_){
      this.tips_msg = new_
    },
    'get_money_notok_list.length': {
      handler(new_) {
        if (new_) {
          this.tips_msg = this.$root.$t('bet_record.bet_amount_betting_limit')
          // 提示信息展示3秒
          clearTimeout(this.timer3)
          this.timer3 = setTimeout(() => {
            this.tips_msg = ''
          }, 3000);
        }
      },
      immediate: true
    },
    'get_money_notok_list2.length': {
      handler(new_) {
        if (!new_ && !this.get_money_notok_list.length && this.get_bet_list.length > 2) {
          this.tips_msg = ''
        }
      },
      immediate: true
    },
    /**
     *@description 监听确认中的订单号数量
     *@return {Undefined} undefined
     */
    'get_order_ing.length'(new_, old_) {
      if (new_ == 0 && old_) {
        if (this.get_order_los.length) {  //所有订单确认时，如果新流程有失败的订单回到状态1
          this.series_order_respList = this.series_order_respList.filter(item => {
            return this.get_order_suc.includes(item.orderNo)
          }, this)

          let s_count_data = this.get_s_count_data.filter(item => {
            return this.get_order_los.includes(item.orderno) || item.money == 0
          })

          let money_remain = s_count_data.reduce((pre, cur) => {
            return pre + cur.money * cur.count
          }, 0)

          // 同步程序走完后再设置总金额
          this.$nextTick(() => {
            this.set_money_total('clear_')
            this.set_money_total(money_remain)
          })

          this.set_s_count_data(s_count_data)
          this.set_bet_status(1);

          if (this.is_new_bet) {
            if (!this.tips_msg) {
              this.tips_msg = this.$root.$t('bet.err_msg03')  //新流程queryOrderStatus 接口返回的投注失败提示语先写死
            }
            this.check_odds_beforebet2();  //重新拉取投注前校验盘口信息接口
            this.need_bet_again = true
            this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
          }
        } else {
          this.set_bet_status(3);
        }
        this.set_new_bet(false)
      }
    },
    // 是否有赔率和盘口的变化
    get_odds_change(new_) {
      if (new_) {
        this.set_bet_status(5);
        this.tips_msg = this.$root.$t('bet.msg08')
      } else {
        this.tips_msg = ''
      }
    },
    'get_change_list.length'(new_, old_) {
      if (new_ == 0 && old_ > 0 && this.get_bet_status == 5) {
        this.agree_change();
      }
    },

    // 投注框状态
    get_bet_status: {
      handler(new_) {
        switch (new_) {
          case 1:
            this.set_new_bet(false)
          case 7:
            this.btn_show = 0;
            break;
          case 2:
            this.btn_show = 2;
            this.tips_msg = '';

            clearTimeout(this.timer2)
            this.timer2 = setTimeout(() => {    // 10秒没有code码返回，红字提示网络异常,点击确定移除投注项
              if (!this.exist_code) {
                this.exist_code = '666'
                if (this.get_bet_list.length) {
                  this.set_bet_status(1);
                  this.tips_msg = this.$root.$t('bet.err_msg13');
                }
              }
            }, 10000);

            break;
          case 3:
          case 8:
            this.tips_msg = '';
            this.set_keyboard_show(false)
          case 4:
            this.btn_show = 1;
            clearTimeout(this.timer_count_2);
            this.timer_count_2 = null;
            break;
          case 6:
            this.btn_show = 1;
            this.set_keyboard_show(false)
            break;
          case 5:
            if (this.get_invalid_ids.length) {  // 有投注项失效时优先显示失效
              this.btn_show = 5
            } else if (this.need_bet_again) {  // 没有失效需要二次投注时显示“接受变化并投注”
              this.btn_show = 4
            } else {
              this.btn_show = 3;  // 接受变化
            }
            break;
          default:
            break;
        }
      },
      immediate: true
    },
  },

  methods: {
    ...mapMutations(['set_toast', "set_bet_status", "set_bet_obj", "set_accept_show", "set_is_accept", "set_order_ing", "set_is_mix", "set_order_no", "set_keyboard_show", "set_new_bet", "set_order_los",
      "set_bet_list", "set_s_count_data", "set_is_spread", "set_money_total", "set_odds_change", "set_money_notok_list", "set_active_index",
      "set_change_list", "add_orderno", "set_used_money", "clear_single_money", 'set_detail_data']),
        // 去注单记录页查看
    go_record() {
      this.set_bet_list([])
      this.$root.$emit(this.emit_cmd.EMIT_CHANGE_RECORD_SHOW, true);
    },
    /**
     * 点击事件占位处理，，防止三星屏幕误触
     */
    nothing() { },
    /**
     * 切换是否接受更好赔率
     */
    toggle_accept() {
      this.set_is_accept()
      this.$forceUpdate()
    },
    /**
     * 切换是否使用常用金额
     */
    change_used_money() {
      this.set_used_money(null)
      this.$forceUpdate()
    },
    /**
     *@description 点击添加比赛、顶部蒙层、向下箭头、确定和完成
     *@param {Number} val 点击的哪个按钮，2代表是投注框左下角按钮
     */
    pack_up(val) {
      if ([0, 2].includes(+this.get_bet_status)) {return};  //投注提交中不能点击

      if (val == 2 && this.calc_class) {   // 有些情况(冠军玩法、单关失效...)不能点击串关+
        return
      }

      // 保留选项
      if (val == 2 && this.get_bet_success) {
        this.set_keyboard_show(true)
        this.set_is_spread(false);
        this.tips_msg = ''
        this.clear_single_money()
        this.set_bet_status(1)
        this.set_money_total('clear_')
        this.set_active_index(0)
        clearInterval(this.timer_count)
        clearTimeout(this.timer_count_1)
        return
      }

      // 冠军玩法没有串关，清空数据处理
      if (this.get_is_champion(this)) {
        this.set_bet_list([]);
        return
      }

      // 删除全部
      if (val == 2 && this.get_bet_list.length >= 2) {
        this.set_bet_list([]);
        return
      }

      //串关+
      if (val == 2 && this.get_bet_list.length == 1) {
        this.set_bet_status(0);
        this.set_is_mix(true)
      }

      if (
          this.get_is_mix && [1, 5, 7].includes(+this.get_bet_status)
      ) {
        this.set_bet_status(0);
        return
      }

      // 投注后点击蒙层，X ，或者确定直接删除，或者单关点蒙层
      if (
          [3, 4, 6, 8].includes(+this.get_bet_status) ||
          this.get_bet_list.length == 1 && val != 2
      ) {
        this.set_bet_list([]);
        return
      }
    },
    /**
     *@description 单关投注后，c201消息的处理
     *@param {Array} : newTotalMaxWinAmount - 最高可赢金额， ov - 赔率， emit_http - 触发哪些接口请求， msg - 提示消息
     */
    c201_update_handler1([newTotalMaxWinAmount, ov, emit_http, msg]) {
      //emit_http 是1或者2时都是投注失败
      if (emit_http == 1) {
        msg && (this.tips_msg = msg)
        // 重新拉取投注前校验盘口信息接口
        if (this.check_odds_beforebet2) {
          this.check_odds_beforebet2()
        } else {
          this.check_odds_beforebet()
        }
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
      } else if (emit_http == 2) {
        msg && (this.tips_msg = msg)
        // 重新拉取投注前校验盘口信息接口
        if (this.check_odds_beforebet2) {
          this.check_odds_beforebet2()
        } else {
          this.check_odds_beforebet()
        }
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
        this.fetch_limit_money(); // 更新单关查询最大最小金额
      } else {
        this.max_winmoney = newTotalMaxWinAmount * 100;
        this.odds_value2 = ov;
      }
      clearInterval(this.timer_count);
      this.timer_count = null;
    },
    /**
     *@description 串关投注后，c201消息的处理
     *@param {Array} : emit_http - 触发哪些接口请求， msg - 提示消息
     */
    c201_update_handler2([emit_http, msg]) {
      //emit_http 是1或者2时都是投注失败
      if (emit_http == 1) {
        msg && (this.tips_msg = msg)
        if (this.check_odds_beforebet2) {
          this.check_odds_beforebet2()
        } else {
          this.check_odds_beforebet()
        }
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
      } else if (emit_http == 2) {
        msg && (this.tips_msg = msg)
        if (this.check_odds_beforebet2) {
          this.check_odds_beforebet2()
        } else {
          this.check_odds_beforebet()
        }
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
        this.fetch_limit_money();
      }
      clearInterval(this.timer_count);
      this.timer_count = null;
      clearTimeout(this.timer_count_1);
      this.timer_count_1 = null;
      // this.set_new_bet(false)
    },
    /**
     *@description 展开串关类型
     *@return {Undefined} undefined
     */
    spread_options() {
      let ele = this.scroll_box_ele
      if (!ele) {return}

      if (this.get_bet_list.length == 2) {return};

      let ch = ele.clientHeight,
        sh = ele.scrollHeight,
        rem_1 = window.innerWidth * 100 / 375;

      this.set_is_spread(!this.get_is_spread);
      //设置投注项滚动距离，同步程序走完后再处理逻辑
      this.$nextTick(() => {
        if (this.get_is_spread) {
          ele.scrollTop = sh + 0.56 * rem_1 - ch;
        } else {
          ele.scrollTop = sh - ch;
        }

      })
    },
    /**
     *@description 点击移除无效注单
     */
    reomve_invalid() {
      this.$root.$emit(this.emit_cmd.EMIT_REMOVE_INVALID_)
    },
    /**
     *@description 点击投注
     */
    submit_order() {
      if (this.btn_show == 4) {   //接受变化并投注点击时，要先接受变化
        this.set_odds_change(false);
        this.set_change_list({ status: 0 });
        if (this.get_active_index == -1) {
          this.set_active_index(0)
        }
      }
      this.exist_code = ''
      //校验是否是串关，并且删除后是否小于最小串关数量
      if(this.get_is_mix && !this.vilidata_mix_count()){return}
      this.set_order_los([]);
      this.set_new_bet(false)

      this.series_order_respList = []
      this.is_new_bet = false;
      this.need_bet_again = false

      clearTimeout(this.timer_count_2);
      this.timer_count_2 = null;
      clearTimeout(this.timer_count_1);
      this.timer_count_1 = null;

      if (this.get_money_notok_list.length || this.is_conflict) {return};

      // 这种情况放过，让钱投注出去
      let _flag2 = this.get_money_total == this.get_user.balance
      if (this.get_money_notok_list2.length && !_flag2) {
        //点击投注后当输入金额小于最低限额时，默认转化为最低限额。并提示“最小单笔投注金额为 xx.” 3s消失。
        this.set_money_notok_list({ status: 0 })
        return
      }

      this.set_active_index(-1);

      if (this.get_bet_status == 7) {   //锁盘
        this.set_toast({ 'txt': this.$root.$t('bet.odd_upd') });
        return;
      }

      if (this.get_money_total > +this.get_user.balance || this.get_user.balance == 0) {    //弹窗提示：“余额不足，请您先充值”
        this.set_toast({ 'txt': this.$root.$t('bet.err_msg05') });
        return;
      }
      if (this.get_money_total < 0.01) {  //请输入金额
        this.set_toast({ 'txt': this.$root.$t('bet.input_v') })
        return;
      }

      //限额获取中,请稍后
      let bet_dom = this.$refs.bet_single_detail
      let flag = (this.get_is_mix && this.get_s_count_data[0] && !this.get_s_count_data[0].orderMaxPay
        || !this.get_is_mix && bet_dom && !bet_dom.max_money_back) && !this.is_5s
      if (flag) {
        this.set_toast({ 'txt': this.$root.$t('bet.err_msg06') });
        return
      }


      if (this.get_mix_bet_flag) {
        this.mix_bet()  //串关投注
      } else {
        this.single_bet() //单关投注
      }
    },
    /**
     *@description 单关投注后的逻辑处理
     *@return {Undefined} undefined
     */
    single_bet() {
      this.submit_betlist((code, data, msg) => {
        if (this.exist_code == '666') {return};  // 10秒没有code码返回状态不做跟新

        this.exist_code = code;

        if (code == 200 && data) {  //投注成功
          this.order_detail_resp_list = data.orderDetailRespList;
          switch (data.orderDetailRespList[0].orderStatusCode) {
            case 0:   //投注失败
              this.set_bet_status(8);
              break;
            case 1:   //投注成功
              this.set_bet_status(3);
              break;
            case 2:   //注单确认中(提交成功)
              this.set_order_no(data.orderDetailRespList[0].orderNo);//记录订单号

              if (data.lock == 1) {   //进入投注新流程
                this.set_new_bet(true)
                clearTimeout(this.timer_count_2)
                this.timer_count_2 = setTimeout(() => {   //25秒还是有订单在确认中，直接给状态让去注单记录中查看
                  if (this.get_new_bet) {
                    this.set_bet_status(1);
                    this.mixnew_bet = true;
                    this.tips_msg = this.$root.$t('bet.err_msg08');
                    clearInterval(this.timer_count)
                    this.timer_count = null;
                  }
                }, 25000);
              } else {
                this.set_bet_status(6);
                this.tips_msg = this.$root.$t('bet.err_msg07');
              }
              // 隔5秒后，每2秒调用异常接口
              clearTimeout(this.timer_count_1)
              this.timer_count_1 = setTimeout(() => {
                clearInterval(this.timer_count)
                this.timer_count = setInterval(() => {
                  if (this.get_bet_status == 6 || this.get_new_bet) {
                    this.query_order();
                  }
                }, 2000);
              }, 5000);
              // c201消息处理
              this.$root.$on(this.emit_cmd.EMIT_C201_UPDATE, this.c201_update_handler1)
              break;
            default:
              break;
          }
          this.max_winmoney = data.orderDetailRespList[0].maxWinMoney;
          this.odds_value2 = data.orderDetailRespList[0].oddsValues;
          this.bet_money = data.orderDetailRespList[0].betMoney;
          this.play_optionname = data.orderDetailRespList[0].playOptionName;
          this.playname2 = data.orderDetailRespList[0].playName;

          // this.collect_match()

        } else {  //投注失败在 back_msg 方法中查看注释
          this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
          this.back_msg({ code, data, msg }, (status, msg) => {
            switch (status) {
              case 1:
                this.need_bet_again = true
                // 同步程序走完后再处理逻辑
                this.$nextTick(() => {
                  if (!this.get_odds_change) {
                    this.set_bet_status(1);
                  }
                })
                break;
              case 2:
                this.set_bet_status(4);
                this.tips_msg = msg;
                break;
              case 3:
                this.set_bet_status(1);
                this.tips_msg = msg;
                break;
              case 4:
                this.need_bet_again = true
                this.set_bet_status(1);//设置投注框为初始状态
                break;
              default:
                break;
            }
          });
        }
      })

    },
    /**
     *@description 串关投注后的逻辑处理
     *@return {Undefined} undefined
     */
    mix_bet() {
      this.submit_betlist((code, data, msg) => {
        if (this.exist_code == '666') {return};  // 10秒没有code码返回状态不做跟新

        this.exist_code = code;

        if (code == 200) {
          this.series_order_respList = data.seriesOrderRespList;
          let order_ing_ = [];

          this.series_order_respList.forEach(item => {
            this.add_orderno({ count: item.seriesSum, num: item.orderNo }) //将订单号存到对象集合中
            if (item.orderStatusCode == 2) {
              order_ing_.push(item.orderNo)
            }
          })
          this.set_order_ing({ change_: 1, value_: order_ing_ })

          this.order_detail_resp_list = data.orderDetailRespList;
          this.bet_money_total = data.betMoneyTotal;
          this.max_win_money_total = data.maxWinMoneyTotal;

          if (data.lock == 1 && order_ing_.length) {  //新流程
            this.set_new_bet(true)
            clearTimeout(this.timer_count_2)
            this.timer_count_2 = setTimeout(() => {   //25秒还是有订单在确认中，直接给状态让去注单记录中查看
              if (this.get_new_bet) {
                this.mixnew_bet = true
                this.set_bet_status(1);
                this.tips_msg = this.$root.$t('bet.err_msg08');
                clearInterval(this.timer_count);
                this.timer_count = null;
              }
            }, 25000);

            // c201消息处理
            this.$root.$on(this.emit_cmd.EMIT_C201_UPDATE, this.c201_update_handler2)

            clearTimeout(this.timer_count_1)
            this.timer_count_1 = setTimeout(() => {    //5秒socket没有返回订单状态的话，调接口拉取
              clearInterval(this.timer_count)
              this.timer_count = setInterval(() => {
                if (this.get_order_ing.length) {
                  let param = this.get_order_ing.toString();
                  api_betting.get_orderstatus({ orderNos: param }).then(res => {
                    if (res.code == 200 && this.get_bet_status != 1 && res.data) {
                      this.query_order_obj = res.data

                      this.query_order_obj.forEach(item => {
                        if (item.status == 4) {   //新流程失败了需要记录
                          this.is_new_bet = true
                        }
                      })
                    }
                  })
                } else {
                  clearInterval(this.timer_count);
                  this.timer_count = null;
                  clearTimeout(this.timer_count_1);
                  this.timer_count_1 = null;
                  clearTimeout(this.timer_count_2);
                  this.timer_count_2 = null;
                }
              }, 2000);
            }, 5000);

          } else {  //老流程
            if (order_ing_.length) {
              this.set_bet_status(6);
              this.tips_msg = this.$root.$t('bet.err_msg07');

              clearTimeout(this.timer_count_1)
              this.timer_count_1 = setTimeout(() => {    //5秒socket没有返回订单状态的话，调接口拉取
                clearInterval(this.timer_count)
                this.timer_count = setInterval(() => {
                  if (this.get_order_ing.length) {
                    let param = this.get_order_ing.toString();
                    api_betting.get_orderstatus({ orderNos: param }).then(res => {
                      if (res.code == 200 && res.data) {
                        this.query_order_obj = res.data
                      }
                    })
                  } else {
                    clearInterval(this.timer_count);
                    this.timer_count = null;
                  }
                }, 2000);
              }, 5000);
            } else {
              this.set_bet_status(3);
            }
            // this.collect_match()
          }

        } else {
          this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
          this.back_msg({ code, data, msg }, (status, msg) => {
            switch (status) {
              case 1:
                this.need_bet_again = true
                // 同步程序走完后再处理逻辑
                this.$nextTick(() => {
                  if (!this.get_odds_change) {
                    this.set_bet_status(1);
                  }
                })

                break;
              case 2:   //对应红色提示语的情况,点击确定移除投注项
                this.set_bet_status(4);
                this.tips_msg = msg;
                break;
              case 3:
                this.set_bet_status(1);
                this.tips_msg = msg;
                break;
              case 4:
                this.need_bet_again = true
                this.set_bet_status(1);
                break;
              default:
                break;
            }
          });
        }
      })

    },
    /**
     * @description 投注后自动收藏相应赛事
     */
    /*collect_match() {
      let mids = [];
      _.forIn(this.get_bet_obj, function(item, key) {
        if (item.mid) {
          mids.push(item.mid)
        }else {
          if ( item.bs && item.bs.mid){
            mids.push(item.bs.mid);
          }
        }
      });
      if (!mids.length) return

      this.set_match_id_bet_success(mids.join(',') + '-' + Math.random());  // 收藏投注成功的赛事

      if (this.get_detail_data && !this.get_detail_data.mf) {
        const detail_data = _.cloneDeep(this.get_detail_data)
        Object.assign(detail_data, { mf: true })
        this.set_detail_data(detail_data)
      }
    },*/

    //单关5秒后还是在确认中状态的话，轮询查询订单信息
    query_order() {
      let param = {
        orderNos: this.get_order_no
      }

      if (!param.orderNos) {return}

      api_betting.get_orderstatus(param).then(res => {
        if (!(this.get_bet_status == 6 || this.get_new_bet)) {return}

        this.query_order_obj = res.data

        let data = _.get(res, 'data[0]');
        let code = _.get(res, 'code');

        if (code != 200 || !res.data) {return};

        if (data.status == 0) {   //投注成功
          clearInterval(this.timer_count);
          this.timer_count = null;
          this.set_bet_status(3);

          if (data.orderNo && data.orderNo == this.get_order_no) {
            this.max_winmoney = data.newMaxWinAmount;
            let oid = _.get(this.single_item, 'hps[0].hl[0].ol[0].oid', '')
            if (data.oddsChangeList && data.oddsChangeList[0] && data.oddsChangeList[0].playOptionsId == oid) {
              this.odds_value2 = data.oddsChangeList[0].usedOdds;
            }
          }
          this.set_new_bet(false)
        } else if (data.status == 4) {   //投注失败
          if (this.get_new_bet) {
            this.set_bet_status(1);
            this.mixnew_bet = true;
            this.tips_msg = this.$root.$t('bet.err_msg03')  //单关新流程失败后的 对应queryOrderStatus接口的红字提示
            this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
          } else {
            this.set_bet_status(8);
          }
          clearInterval(this.timer_count);
          this.timer_count = null;
        }
      })
    },
    /**
     *@description 接受变化
     *@param {Number} val 有值表示手动触发
     *@return {Undefined} undefined
     */
    agree_change(val) {
      this.set_odds_change(false);
      this.set_bet_status(1);
      this.set_change_list({ status: 0 });
      if (this.get_active_index == -1) {
        this.set_active_index(0)
      }
    },
    /**
     *@description 自动接受跟好赔率规则展示
     */
    change_accept() {
      this.set_accept_show(true);
    },
    /**
     *@description 串关注单状态变动需要跟新最高可盈
     *@param {Number} value 最高可赢变动多少
     *@param {Number} value2 总投注额变动多少
     *@return {Undefined} undefined
     */
    update_money(value = 0, value2 = 0) {
      this.max_win_money_total += value * 100;
      this.bet_money_total += value2 * 100;
    },
    // 清除当前组件所有定时器
    clear_timer() {
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
    },
  }
}

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
  max-width:3.78rem;
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
  max-width:3.78rem;
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
  max-width:3.78rem;
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
.bet-box > p {
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
