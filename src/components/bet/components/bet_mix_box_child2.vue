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
        <span style="margin-right:auto" @click="pack_up(3)"><img  src="image/wwwassets/bw3/svg/close3.svg" class="yb_mr4 img1" />{{$root.$t('bet.delete_all')}}</span>
        <!-- 右 自动接受跟好赔率 -->
        <span>
          <i class="img2" :class="{'img3': get_is_accept != 2}" @click="toggle_accept"></i>
          <span :class="{'auto-text':get_is_accept == 2}" class="yb_mx4 err-msg2" style="max-width:2.1rem" @click="toggle_accept">{{$root.$t("ac_rules.auto")}}</span>
          <img  src="image/wwwassets/bw3/svg/rules2.svg" @click="change_accept" class="img1" v-if="get_theme.includes('theme01')" />
          <img  src="image/wwwassets/bw3/svg/rules3.svg" @click="change_accept" class="img1" v-else />
        </span>
      </div>

      <!-- 中间可滚动区域 -->
      <div class="scroll-box" ref="scroll_box" :style="{'max-height':`${max_height1}px`}" @touchmove="touchmove_handle($event)" @touchstart="touchstart_handle($event)">
        <!-- 上部纯展示组件 展示盘口赔率玩法对阵信息-->
          <bet-mix-show
          v-for="(value, name, index1) in get_bet_obj"
          :order_detail_resp_list="order_detail_resp_list"
          :query_order_obj="query_order_obj"
          :key="name"
          :index_="index1"
          :name_="name">
          </bet-mix-show>

        <!-- 串关投注成功组件 单个几串几的信息展示-->
        <template v-if="btn_show == 1 || mixnew_bet || part_bet">
          <div v-show="btn_show == 1 && !mixnew_bet || part_bet">
            <div v-for="(item,index) in series_order_respList" :key="index">
              <betSuccessBar :item_="item" @update_money="update_money" :query_order_obj="query_order_obj" :len='series_order_respList.length'></betSuccessBar>
            </div>
          </div>
        </template>

        <!-- 串关主体 金额输入框-->
        <template v-if="get_mix_bet_flag && ![3, 6].includes(+get_bet_status)">
          <bet-mix-detail :value_="item" :index_="index" v-for="(item,index) of get_s_count_data" :key="index" :tips_msg.sync="tips_msg" @max-win-money-emit="max_win_money_emit"></bet-mix-detail>
        </template>

        <!-- 多项单注 金额输入框-->
        <template v-if="!get_is_mix && get_bet_list.length  > 1 && get_is_combine && ![3, 6].includes(+get_bet_status)">
          <bet-mix-single-detail :tips_msg.sync="tips_msg"></bet-mix-single-detail>
        </template>

        <!-- 串关投注完成后底部的显示 -->
        <!-- <template v-if="btn_show == 1 && series_order_respList.length > 1 || mixnew_bet"> -->
        <template v-if="0">
          <div v-show="btn_show == 1 && series_order_respList.length > 1 && !mixnew_bet" class="order-ok row yb_px14 yb_py8 yb_fontsize14">
            <div class="col-6">
              <!-- 可赢总金额 -->
              <span style="font-weight:600">{{ $root.$t('bet_record.total_winable_amount') }}</span>
              <p class="yb_fontsize18 moey-p">{{(max_win_money_total/100).toFixed(2)}}</p>
            </div>
            <div class="col-6 text-right">
              <!-- 投注总金额 -->
              <span style="font-weight:600">{{ $root.$t('bet_record.total_bet_amount') }}</span>
              <p class="yb_fontsize18 moey-p2">{{(bet_money_total/100).toFixed(2)}}</p>
            </div>
          </div>
        </template>
      </div>
      <div class="yb_px12" v-if="get_mix_bet_flag">
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8 yb_fontsize14 fw_600 bet-mix-show">
          <div>{{$root.$t('bet.total_income')}}</div>
          <div>{{$root.$t('bet.total_bet')}} <span v-if="bet_num>0">{{bet_num}}</span></div>
        </div>
        <div class="row justify-between items-center content-t yb_mb6 yb_mt8">
          <div class="yellow-color yb_fontsize16">{{(award_total)}}</div>
          <div class="yb_fontsize16 bet-mix-show">{{get_money_total.toFixed(2)}}</div>
        </div>
      </div>
      <!-- 提示信息  分3种情况-->
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
          :style="{'min-height':get_bet_success? '0.38rem':'0.3rem'}" @touchmove.prevent @click="nothing">
          <template v-if="tips_msg "><span class="text-center yb_py4">{{(tips_msg)}}</span></template>
          <template v-else-if="!tips_msg && [1, 2, 7].includes(+get_bet_status)">
            <!-- 左， 合并投注项 -->
            <span :style="{'opacity':calc_combine_show?'0':'1','margin-right':'auto'}">
              <i class="img2" :class="{'img3': get_is_combine}" @click="change_is_combine"></i>
              <span class="yb_mx4" :class="{'auto-text':!get_is_combine}" @click="change_is_combine">{{$root.$t("tips.msg1")}}</span>
              <img  src="image/wwwassets/bw3/svg/rules2.svg" @click="change_tips_show" class="img1" v-if="get_theme.includes('theme01')" />
              <img  src="image/wwwassets/bw3/svg/rules3.svg" @click="change_tips_show" class="img1" v-else />
            </span>
            <!-- 右 -->
            <!-- 常用金额 -->
            <span v-if="get_bet_list.length==1">
              <i class="img2" :class="{'img3': get_used_money != 0}" @click="change_used_money"></i>
              <span class="yb_ml4" :class="get_used_money == 0 && 'auto-text'" @click="change_used_money">{{$root.$t('bet.used_money2')}}</span>
            </span>
            <!-- 更多串关类型 -->
            <span
                v-else-if="get_is_mix"
                @click.stop="spread_options"
                :class="{'opacity-m':get_bet_list.length == 2  || get_s_count_data.length == 1,'col-8 text-right':get_bet_list.length > 1}"
            >
              {{ get_is_spread ? $root.$t('bet.msg04') : $root.$t('bet.msg05')}}
              <i class="arrow" :class="{'arrow2': !get_is_spread}"></i>
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
        <div class="add-box add-box2" :class="{'add-box2':get_bet_success,'add-box3':calc_class}" @click.stop="pack_up(4)" v-if="get_bet_success">{{$root.$t('bet.save')}}</div>
        <!-- 单关 -->
        <div v-else-if="get_is_mix" class="bet-add-box text-bold display_center one_text_color" :class="{'add-box3':calc_class}" @click.stop="pack_up(5)">
            <div class="bet-add-new bet_margin_left"></div>
            <div class="bet_text_left bet-one">{{$root.$t('bet.kushikatsu')}}</div>
          </div>
          <!-- 串关+ -->
          <div v-else-if="!hide_bet_series_but()" class="bet-add-box text-bold display_center linkUp_text_color" :class="{'add-box3':calc_class}" @click.stop="pack_up(6)">
            <div class="bet_text_right">{{$root.$t('bet.kushikatsu')}}</div>
            <div class="bet-add-new bet-linkUp"></div>
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
import betMixSingleDetail from 'src/project/components/bet/bet_mix_single_detail';
import betSuccessBar from 'src/project/components/bet/bet_success_bar.vue';
import betting from 'src/project/mixins/betting/betting.js';
import keyBoard from 'src/project/components/bet/keyboard.vue';
import ballSpin from 'src/project/components/bet/ball_spin.vue';
import betBar from "src/project/components/bet/bet_bar.vue";
import { mapMutations, mapGetters } from "vuex";
import utils from 'src/public/utils/utils.js';
import { api_betting } from "src/project/api/index.js";
export default {
  name: "bet-mix-box-child2",
  mixins: [betting],
  data() {
    return {
      // get_bet_status: 0,放到全局了
      // 单注的状态 0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
      btn_show: 0, //右下角显示状态，0投注，1确定（知道了），2注单处理中...,3接受变化  4 接受变化并投注 5 有投注项失效后点击接受变化的置灰样式
      exist_code: 0,    //投注后是否返回code码
      series_order_respList: [],    //串关投注成功后的返回(包含订单号、金额···)
      order_detail_resp_list: [],    // 单关或者串关投注成功后的返回(投注项信息，赔率、盘口···)
      bet_money_total: 0,    //串关投注成功后的总投注额
      max_win_money_total: 0,    //串关投注成功后的总最高可赢
      query_order_obj: [],   //queryOrderStatus接口返回数据
      is_5s: false, //弹框弹起来有没有5秒,到了5秒就用默认的5000作限额,不作弹框提示
      max_height1: 192,   //滚动区域的最大高
      is_new_bet: false,  //get_orderstatus 接口返回是否是新流程
      need_bet_again: false,  //是否需要重新发起投注
      check_odds_beforebet2: this.debounce(this.check_odds_beforebet, 200), //防抖处理
      scroll_box_ele: null,  // dom元素
      is_loading_balance: false, // 金额刷新中？
      award_total: 0,
      bet_num: 0
    };
  },

  components: { betMixShow,betMixSingleDetail, betMixDetail, betSuccessBar, keyBoard, betMixShow2, ballSpin, betBar },

  computed: {
    ...mapGetters(["get_update_tips","get_odds_change","get_mix_bet_flag", "get_money_total", "get_s_count_data", "get_bet_list", "get_is_accept", "get_order_ing", "get_is_spread", "get_is_mix", "get_m_id_list", "get_bet_obj", "get_bet_status",
      "get_money_notok_list", "get_user", "get_detail_data", "get_is_show_settle_tab", "get_change_list",   "get_active_index", "get_keyboard_show", "get_new_bet", "get_order_los",
      "get_order_suc", "get_money_notok_list2", "get_theme", "get_used_money", "get_is_champion", "get_invalid_ids", "get_cannot_mix_len", "get_is_combine", "get_bet_success"]),
    //单关的数据对象
    single_item() {
      if (this.get_bet_list[0]) {return this.get_bet_obj[this.get_bet_list[0]].bs};
      return {};
    },
    //是否有重复的球员id或者球队id，有的话要禁止串关
    is_conflict() {
      return !(_.uniq(this.get_m_id_list).length == this.get_m_id_list.length) && this.get_is_mix
    },
    // 是否展示不支持串关提示
    is_conflict2() {
      // 串关时检查是否有C01赛事
      let has_rc = this.is_bet_check_rc();
      // 设置C01不支持串关
      let flag = has_rc || ((this.get_cannot_mix_len || this.get_invalid_ids.length) &&
          this.get_bet_list.length > 1 &&
          ![900, 3000].includes(+this.get_menu_type))

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
        || this.btn_show == 5;
      return flag
    },
    //是否进入串关部分投注成功流程
    part_bet() {
      return this.get_order_los.length && this.get_order_suc.length && !this.get_order_ing.length
    },
    // 以下情况不显示合并按钮
    calc_combine_show() {
      return this.get_is_mix || [900, 3000].includes(+this.get_menu_type)
    },
  },
  created() {
    //高度计算
    let rem_1 = window.innerWidth * 100 / 375;
    this.max_height1 = window.innerHeight - rem_1 * 4.28
  },

  mounted() {
    // 延时器
    this.timer = null;
    this.timer2 = null;
    this.timer3 = null;
    this.timer_count = null;
    this.timer_count_1 = null;
    this.timer_count_2 = null;

    this.set_is_spread(false);

    // 5秒计时
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.is_5s = true;
    }, 5000);

    if (this.get_menu_type == 900) {
      this.fetch_limit_money()
    } else if (this.is_exist_pa_operate()) {
      this.fetch_limit_money_and_odd_info()
      const has_pre = _.findKey(this.get_bet_obj, function(o) { return o.show_pre })
      if(has_pre){
        this.fetch_pre_limit_money_and_odd_info()
      }

    } else {
      // 投注前拉取最新的盘口赔率状态(应对socket推送不及时)
      // 获取最大最小金额
      this.check_odds_beforebet().then(() => {
        this.fetch_limit_money();
      })

    }
    this.set_new_bet(false)

    this.scroll_box_ele = this.$refs.scroll_box
    if(this.get_active_index === -1){
        let ele = this.$refs.scroll_box
        ele.scrollTop = ele.scrollHeight
    }
    // this.get_award_data()
    let s_count_data = this.get_s_count_data.filter(item => {
      return this.get_order_los.includes(item.orderno) || item.money == 0
    })
    let money_remain = s_count_data.reduce((pre, cur) => {
      return pre + cur.money * cur.count
    }, 0)

    this.$nextTick(() => {
      // 是否有金额标识
      let flag = this.get_s_count_data.some(item=>{
        return item.money>0
      })
      if(!flag){
        // this.set_money_total('clear_')
        // this.set_money_total(money_remain)
        this.award_total = 0
        this.bet_num = 0
      }
    })
  },
  destroyed() {
    this.clear_timer()

    this.set_order_ing({ change_: 1, value_: [] })
    this.set_order_no('')

    utils.del(this.series_order_respList);

    this.set_active_index(0);// 活动子项置为初始值
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
    //当光标聚焦到多项单注时，页面需滚动到多项单注位置
    get_active_index(new_){
      if(new_ === -1){
        let ele = this.$refs.scroll_box
        ele.scrollTop = ele.scrollHeight
      }
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

          if (this.get_mix_bet_flag) {  // 串关新流程失败后的逻辑处理
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
          }

          this.set_bet_status(1);

          if (this.is_new_bet) {
            if (!this.tips_msg) {
              this.tips_msg = this.$root.$t('bet.err_msg03')  //新流程queryOrderStatus 接口返回的投注失败提示语先写死
            }
            this.check_odds_beforebet2();  //重新拉取投注前校验盘口信息接口
            this.need_bet_again = true
            this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
          }
        } else if (this.get_bet_status != 1) {
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
    get_money_total(new_, old_) {
      this.get_award_data()
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
            this.timer2 = setTimeout(() => {    // 10秒没有code码返回，红字提示网络异常
              if (!this.exist_code) {
                this.exist_code = '666'
                if (this.get_bet_list.length) {
                  if(this.get_bet_status != 1){
                    this.tips_msg = this.$root.$t('bet.err_msg13');
                  }
                  this.set_bet_status(1);
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
            clearTimeout(this.timer_count_2)
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
              // 有预约投注打开时，赔率盘口变化投注按钮不变
              let is_show_pre_open = Object.values(this.get_bet_obj).find(item => item.show_pre === true)
              if (!is_show_pre_open) {
                this.btn_show = 3;  // 接受变化
              }
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
      "set_bet_list", "set_s_count_data", "set_is_spread", "set_money_total", "set_odds_change", "set_money_notok_list", "set_active_index", "set_is_combine", "set_http_update","set_settle_dialog_bool",
      "set_change_list", "add_orderno", "set_used_money", "set_combine_tips_show", "clear_single_money", 'set_detail_data']),
    get_award_data() {
      this.bet_num = this.get_s_count_data.filter(item=>item.money>0).length
      // this.award_total = 0
      // let odds = 0
      // this.get_s_count_data.filter(item=>item.money>0).map((item, i)=>{
      //   if(i==0){
      //     odds = item.odds
      //   }
      //   this.award_total = odds*item.money + this.award_total
      // })
    },
    
    /**
     * 串关时检查是否有C01赛事
     */
    is_bet_check_rc(){
      let res = false;
      if(this.get_is_mix && this.get_bet_list.length>1){
        // 串关时
        for (let i = 0; i < this.get_bet_list.length; i++) {
          // 检测是否C01赛事
          if(_.get(this.get_bet_obj,`[${this.get_bet_list[i]}].cs.cds`) == "C01"){
            res = true;
            break;
          }
        }
      }
      return res;
    },
    max_win_money_emit(val){
      this.award_total = val
    },
    // 去注单记录页查看
    go_record() {
      this.set_bet_list([])
      this.$root.$emit(this.emit_cmd.EMIT_CHANGE_RECORD_SHOW, true);
    },
    /**
     * 点击事件占位处理，防止三星屏幕误触
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
     *@description 设置是否合并投注项
     */
    change_is_combine() {
      this.set_is_combine(!this.get_is_combine)
      // 点击取消合并时单关只保留一个投注项
      this.remove_item4()

      // 埋点跟踪
      if (this.get_is_combine) {
        this.zhuge_track_is_combine()
      }
      this.$forceUpdate()
    },
    /**
     *@description 展示合并投注项提示弹框
     */
    change_tips_show() {
      this.set_combine_tips_show(true)
    },
    /**
     *@description 点击添加比赛、顶部蒙层、向下箭头、确定和完成
     *@param {Number} val 点击的哪个按钮，3 - 删除全部，4 - 保留选项， 5 - 单关， 6 - 串关+
     */
    pack_up(val) {
      if ([0, 2].includes(+this.get_bet_status)) {return};  //投注提交中不能点击

      if ([4, 5, 6].includes(+val) && this.calc_class) {   // 有些情况(冠军玩法、单关失效...)不能点击左下角按钮
        return
      }
      // 左下角，保留选项
      if (val == 4) {
        setTimeout(()=>{
          this.award_total = 0
          this.bet_num = 0
        },100)
        this.set_keyboard_show(true)
        this.set_is_spread(false);

        this.tips_msg = ''

        this.set_money_total('clear_')

        this.clear_single_money()

        this.set_bet_status(1)
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

      // 左上角，删除全部
      if (val == 3) {
        this.set_bet_list([]);
        return
      }

      // 左下角，单关
      if (val == 5) {
        this.tips_msg = ''


        this.set_s_count_data([])

        this.set_money_notok_list({ status: 0 })

        this.remove_item4('first')

        this.set_is_mix(false)
        this.set_active_index(0)
        this.set_money_total("clear_");

        // 串关切换到单关时，如果没有获取过最大最小金额，就调用一遍接口
        if (!this.get_bet_obj[this.get_bet_list[0]].orderMaxPay) {
          this.fetch_limit_money()
        }
        return
      }

      // 左下角，串关+
      if (val == 6) {
        this.tips_msg = ''
        //清空预约信息
        let temp_bet_obj = _.cloneDeep(this.get_bet_obj)
        Object.keys(temp_bet_obj).map((key)=>{
          if(temp_bet_obj[key].show_pre){
            delete temp_bet_obj[key].pre_odds
            delete temp_bet_obj[key].pre_market_value
            temp_bet_obj[key].show_pre = false
          }
        })
        this.set_bet_obj(temp_bet_obj)
        this.set_money_notok_list({ status: 0 })
        if (this.get_bet_list.length == 1) {
          this.set_bet_status(0);
        }

        // 至少选择几场比赛
        let min_num = _.get(this.get_user, 'configVO.minSeriesNum', 2)
        if (this.get_bet_list.length < min_num && this.get_bet_list.length > 1) {
          this.set_toast({ 'txt': this.$root.$t('bet.match_min', [min_num]) });
          return
        }

        this.set_active_index(this.get_bet_list.length>1?-1:0)
        this.set_is_mix(true)
        this.set_money_total("clear_");

        this.clear_single_money()

        // 单关切换到串关时，如果没有获取过最大最小金额，就调用一遍接口
        if (this.get_s_count_data[0] && !this.get_s_count_data[0].orderMaxPay) {
          this.fetch_limit_money()
        }
        return
      }

      // 这几种情况要收起投注栏
      if ([1, 5, 7].includes(+this.get_bet_status)) {
        this.set_bet_status(0);
        return
      }

      // 这几种情况要清除所有投注数据
      if (this.get_bet_success || this.get_bet_status == 4) {
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
        if (this.is_exist_pa_operate()) {
          this.fetch_limit_money_and_odd_info()
        } else {
          // 获取最大最小金额
          this.fetch_limit_money();
          // 重新拉取投注前校验盘口信息接口
          if (this.check_odds_beforebet2) {
            this.check_odds_beforebet2()
          } else {
            this.check_odds_beforebet()
          }
        }
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
      }
    },
    /**
     *@description 串关投注后，c201消息的处理
     *@param {Array} : emit_http - 触发哪些接口请求， msg - 提示消息
     */
    c201_update_handler2([emit_http, msg]) {
      //emit_http 是1或者2时都是投注失败
      if (emit_http == 1) {
        msg && (this.tips_msg = msg)
        this.check_odds_beforebet2();  //重新拉取投注前校验盘口信息接口
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
      } else if (emit_http == 2) {
        msg && (this.tips_msg = msg)
        this.check_odds_beforebet2();  //重新拉取投注前校验盘口信息接口
        this.need_bet_again = true
        this.set_toast({ 'txt': this.$root.$t('bet.bet_err'), hide_time: 3000 });
        this.fetch_limit_money();
      }
      clearInterval(this.timer_count);
      this.timer_count = null;
      clearTimeout(this.timer_count_1)
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
        this.set_odds_change(false); //赔率和盘口不变化
        this.set_change_list({ status: 0 });//赔率和盘口发生了变化的投注项id集合
        if (this.get_active_index == -1) {// 处于活动的投注项子项
          this.set_active_index(0)
        }
      }
      this.exist_code = ''
      //校验是否是串关，并判断投注项是否小于最小串关数量
      if(this.get_is_mix && !this.vilidata_mix_count()){
        return
      }
      this.set_order_los([]);
      this.set_new_bet(false)

      this.series_order_respList = []

      this.is_new_bet = false;
      this.need_bet_again = false

      clearTimeout(this.timer_count_2)
      this.timer_count_2 = null;
      clearTimeout(this.timer_count_1)
      this.timer_count_1 = null;
      // 串关时检查是否有C01赛事
	    let has_rc = this.is_bet_check_rc();
      if (this.get_money_notok_list.length || this.is_conflict || has_rc) {
      	if(has_rc){
      		// 有投注项失效后点击接受变化的置灰样式
        	this.btn_show = 5;
      	}
        return
      };

      // 这种情况放过，让钱投注出去
      let _flag2 = this.get_money_total == this.get_user.balance
      if (this.get_money_notok_list2.length && !_flag2) {
        //点击投注后当输入金额小于最低限额时，默认转化为最低限额。并提示“最小单笔投注金额为 xx.” 3s消失。
        this.set_money_notok_list({ status: 0 })
        return
      }

      this.set_active_index(-1);

      // 单关一个投注项锁盘时，才提示
      let _num = this.check_locked_num()
      let _flag = _num && (this.get_bet_list.length == _num && !this.get_is_mix || this.get_is_mix)

      if (_flag) {   //锁盘
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
      let flag = !this.is_5s && (this.get_is_mix && this.get_s_count_data[0] && !this.get_s_count_data[0].orderMaxPay || !this.get_is_mix && !this.get_bet_obj[this.get_bet_list[0]].orderMaxPay)
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
     *@description 单关投注后的逻辑处理,
     */
    single_bet() {
      this.submit_betlist((code, data, msg) => {
        if (this.exist_code == '666') {return};  // 10秒没有code码返回状态不做跟新

        this.exist_code = code;

        if (code == 200 && data) {  //投注成功
          //投注成功清空预约信息
          let pre_flag = false
          let temp_bet_obj = _.cloneDeep(this.get_bet_obj)
          Object.keys(temp_bet_obj).map((key)=>{
            if(temp_bet_obj[key].show_pre){
              pre_flag = true
              delete temp_bet_obj[key].pre_odds
              delete temp_bet_obj[key].pre_market_value
              temp_bet_obj[key].show_pre = false
            }
          })
          this.set_bet_obj(temp_bet_obj)
          this.order_detail_resp_list = data.orderDetailRespList
          if(pre_flag){//只能有一个预约单
            this.order_detail_resp_list[0].is_pre = true
          }
          // 将确认中的订单号存到 vuex 的 get_bet_obj 里面
          let order_ing_ = [];

          this.order_detail_resp_list.forEach(item => {
            this.set_http_update({
              orderno_arr: [
                item.playOptionsId,
                item.orderNo
              ]
            })
            if (item.orderStatusCode == 2) {
              order_ing_.push(item.orderNo)
            }
          })

          this.set_order_ing({ change_: 1, value_: order_ing_ })

          // 记录订单关单注的订单单号
          if (this.get_bet_list.length == 1 && order_ing_.length == 1) {
            this.set_order_no(data.orderDetailRespList[0].orderNo);
          }

          // 单关单注时对应新流程，单关多注不对应新流程
          if (order_ing_.length) {
            if (data.lock == 1 && this.get_bet_list.length == 1) {
              this.set_new_bet(true)
              // 25秒还是有订单在确认中，直接给状态让去注单记录中查看
              clearTimeout(this.timer_count_2)
              this.timer_count_2 = setTimeout(() => {
                if (this.get_new_bet && this.get_bet_status == 2) {
                  this.set_bet_status(1);
                  this.tips_msg = this.$root.$t('bet.err_msg08');
                  clearInterval(this.timer_count)
                  this.timer_count = null;
                }
              }, 25000);
            } else {
              this.tips_msg = this.$root.$t('bet.err_msg07');
              this.set_bet_status(6);
            }
            clearTimeout(this.timer_count_1)
            this.timer_count_1 = setTimeout(() => {    //5秒socket没有返回订单状态的话，调接口拉取
              clearInterval(this.timer_count)
              this.timer_count = setInterval(() => {
                if (this.get_order_ing.length) {
                  let param = this.get_order_ing.toString();
                  api_betting.get_orderstatus({ orderNos: param }).then(res => {
                    if (res.code == 200 && res.data && this.get_bet_status != 1) {
                      this.query_order_obj = res.data
                    }
                  })
                } else {
                  clearInterval(this.timer_count);
                  clearTimeout(this.timer_count_1)
                  clearTimeout(this.timer_count_2)
                  this.timer_count = null;
                  this.timer_count_1 = null;
                  this.timer_count_2 = null;
                }
              }, 2000);
            }, 5000);

            // c201消息处理
            this.$root.$on(this.emit_cmd.EMIT_C201_UPDATE, this.c201_update_handler1)
          } else {
            this.set_bet_status(3);
          }
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
     * @description 投注后自动收藏相应赛事
     */
    /*collect_match() {
      let mids = [];
      for (let item of Object.values(this.get_bet_obj)) {
        if (item.mid) {
          mids.push(item.mid)
        }else {
          if ( item.bs && item.bs.mid){
            mids.push(item.bs.mid);
          }
        }
      }

      if (!mids.length) return

      this.set_match_id_bet_success(mids.join(',') + '-' + Math.random());  // 收藏投注成功的赛事

      if (this.get_detail_data && !this.get_detail_data.mf) {
        const detail_data = _.cloneDeep(this.get_detail_data)
        Object.assign(detail_data, { mf: true })
        this.set_detail_data(detail_data)
      }
    },*/
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
          this.order_detail_resp_list = data.orderDetailRespList;
          this.bet_money_total = data.betMoneyTotal;
          this.max_win_money_total = data.maxWinMoneyTotal;
          this.award_total = (data.maxWinMoneyTotal/100).toFixed(2)

          let order_ing_ = [];
          this.series_order_respList.forEach(item => {
            this.add_orderno({ count: item.seriesSum, num: item.orderNo }) //将订单号存到对象集合中
            if (item.orderStatusCode == 2) {
              order_ing_.push(item.orderNo)
            }
          })

          this.set_order_ing({ change_: 1, value_: order_ing_ })

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
                    if (res.code == 200 && res.data && this.get_bet_status != 1) {
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
                  clearTimeout(this.timer_count_1)
                  this.timer_count_1 = null;
                  clearTimeout(this.timer_count_2)
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
     *@description 接受变化
     *@return {Undefined} undefined
     */
    agree_change() {
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
.dele-wrap2{
  justify-content: flex-start;
  width:100%;
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
.bet-box > p {
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
.bet_text_left{
  margin-left: 13px;
}
.bet_margin_left{
  margin-left: 3px;
  background: #CBCED8;
  box-shadow: 0px 1px 2px 0px #00000033;
}
.bet_text_right{
  margin: 0 13px;
}
.display_center{
  display: flex;
  align-items: center;
}
.one_text_color{
  color: #99A3B1 !important;
  border: 1px solid #CBCED8;
}
.linkUp_text_color{
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
.yellow-color{
  color: var(--q-color-fs-color-116);
}
</style>
