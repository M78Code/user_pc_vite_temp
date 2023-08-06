<!--
 * @Author: Router
 * @Date: 2020-11-12 11:46:40
 * @Description: 单关矩形金额输入框
-->
<template>
  <!-- 混合过关投注选项 -->
  <div class="bet-single-detail yb_px14 row items-center" ref="bet_single_detail">
    <!-- 左 -->
    <div class="yb_fontsize16 content-t">
      <p>{{ $root.$t('bet.bet') }}</p>
      <p>{{$root.$t('bet.total_win2')}}
        <span :class="{'red-color':!(max_win_money == '0.00' || money_ok),'yellow-color':money_ok && money}">{{max_win_money | four_five_six_double(2) | format_money2}}</span>
      </p>
    </div>

    <!-- 右 -->
    <div class="content-b" :class="{'red-color':!money_ok,'content-b2':!(get_active_index === index_ && [1, 7].includes(+get_bet_status))}" @click.stop="input_click">
      <span v-if="money" class="yb_fontsize20 money-number">{{money | format_money3}}</span>
      <span class="money-span" ref="money_span" :style="{opacity:get_active_index === index_ && [1, 7].includes(+get_bet_status) ? '1':'0'}"></span>
      <span v-if="!money && max_money_back" class="yb_fontsize14 limit-txt">{{get_money_format()}}</span>
      <span @click.stop="clear_money" class="money-close" :style="{opacity:money>0?'1':'0'}">x</span>
    </div>
  </div>
</template>

<script>
import compute_max_win_money from 'src/public/mixins/odds_conversion/compute_max_win_money.js';
import betting from 'src/project/mixins/betting/betting.js';
import global_filters from 'src/boot/global_filters.js';
import { mapGetters, mapMutations } from "vuex";
const licia_format = require('licia/format');

export default {
  name: "bet_single_detail",
  mixins: [betting, compute_max_win_money],
  props: {
    index_: {
      type: Number,
      default: 0
    },
    name_: {
      type: String,
    }
  },
  data() {
    return {
      money: '',  //输入框金额
      money_ok: true,   //金额是否合适
      min_money: 10,   //最低投注金额
      max_money: 0,   //最高可投金额
      is_watch: false,    //组件渲染时是否监听money
      max_money_back: false,   //最高可赢金额的接口是否有返回(不管成功与失败)
      obj_pre_max_money: undefined, // 单关预约最高可投注金额
    };
  },
  computed: {
    ...mapGetters(["get_cur_odd","get_bet_list", "get_money_total", "get_user", "get_bet_status", "get_bet_obj", "get_used_money", "get_money_notok_list2", "get_active_index"]),
    item_() {
      return this.get_bet_obj[this.name_].bs;
    },
    // 计算单关最高可赢
    max_win_money() {
      let ov = (this.get_bet_obj[this.name_].show_pre ? this.get_bet_obj[this.name_].pre_odds : _.get(this.item_,'hps[0].hl[0].ol[0].ov')) / 100000
      return this.compute_money_by_cur_odd_type(ov, null, _.get(this.item_,'hps[0].hsw'), this.money, this.item_.csid)
    },
    // 转化过后的坑位id
    hn_id() {
      return this.get_bet_list[this.index_]
    },
    // 单关监听最高可投注金额
    obj_max_money() {
      return this.get_bet_obj[this.name_].orderMaxPay
    },
    // 单关监听多项单关输入值
    obj_bet_money(){      
      return this.get_bet_obj[this.name_].money
    }
  },
  watch: {
    obj_bet_money(news_){
      this.money = news_
    },
    obj_max_money: {
      handler(newVal) {
        if(!newVal){return}
        if(+this.money > +newVal){
          this.money = newVal
          this.tips_msg_update(this.$root.$t('bet_record.bet_amount_betting_limit'))
        }
        this.max_money = +newVal
        this.min_money = +this.get_bet_obj[this.name_].minBet
        if (this.max_money > this.min_money) {
          this.max_money = this.round_money(this.min_money, newVal)
        } else {
          this.min_money = this.max_money
        }
        
        this.max_money_back = true;
      },
      immediate: true
    },
    money(new_, old_) {
      this.check_moneyok(new_)
      this.send_money_to_keyboard()
      
      if (!this.is_watch) {return}
      
      this.set_money_total(new_ - old_);

      // 缓存金额到vuex
      this.set_http_update({
        money_obj: {
          hn_id: this.hn_id,
          obj: {
            money: new_,
            full_bet: this.max_money == this.money ? 1 : 0
          }
        }
      })
    },
    // 最大可投注金额返回后，填充常用金额, 或者将最大可投传递给键盘
    // 有3种情况会改变这里的值，1 - 接口返回了最高可赢 2 - 5秒计时到了时间  3 - 串关时投注项数量改变时，需要重新获取数据，所有要先设为false
    max_money_back(new_) {
      if (
          this.get_used_money > 0 &&
          this.get_bet_list.length == 1 &&
          this.money < 0.01 &&
          !this.get_money_total &&
          new_
      ) {
        this.money = (this.get_used_money > this.max_money ? this.max_money : this.get_used_money).toString()
      } else {
        this.send_money_to_keyboard()
      }
    },
    // 点击投注后当输入金额小于最低限额时，默认转化为最低限额
    "get_money_notok_list2.length"(new_) {
      if (new_) {return}
      
      if (this.money < this.min_money && this.money >= 0.01) {
        if(this.get_active_index === -1){
          //获取最大最小限额
          const tempNew = 
                  Object
                  .keys(this.get_bet_obj)
                  .map((key)=>{
                    return {
                      minBet: _.toNumber(this.get_bet_obj[key].minBet),
                    }
                  })
          this.money = _.maxBy(tempNew,(item)=>{return item.minBet}).minBet * 1
        }else{
          this.money = this.min_money.toString()
        }
        
        this.tips_msg_update(this.$root.$t('bet.err_msg10', [this.min_money]))
        
        clearTimeout(this.timer1)
        // 3秒后重置样式
        this.timer1 = setTimeout(() => {
          this.tips_msg_update()
        }, 3000);
      }
    },
    // 多注单项，删除投注项时，需要清空金额
    "get_bet_list.length"(newVal, oldVal) {
      if (newVal < oldVal) {
        this.money = this.get_money_total && this.get_bet_obj[this.name_].money || ''
        
        this.is_watch = false
        this.$nextTick(() => {
          this.is_watch = true;
        })
      }
    },
    // 兜底处理，当总金额为0时，所有投注项金额也设为0
    get_money_total(newVal) {
      if (newVal == 0) {
        this.money = ''
        this.send_money_to_keyboard()
      }
    },
  },
  created() {
    // 延时器
    this.timer1 = null;
    this.timer3 = null;
    this.timer4 = null;
    this.flicker_timer = null  //光标闪动计时器
    
    this.money = this.get_money_total && this.get_bet_obj[this.name_].money || ''
    
    // 同步程序走完后再处理逻辑
    this.$nextTick(() => {
      this.is_watch = true;
    })
  },
  mounted() {
    this.cursor_flashing();

    // 5秒后没有限额金额返回就用默认值
    this.timer3 = setTimeout(() => {
      if (!this.max_money_back) {
        this.max_money = 8888;
        // 获取接口返回的单关最小投注金额
        this.min_money = _.get(this.get_user, 'cvo.single.min', 10)

        if (this.max_money < this.min_money) {
          this.min_money = this.max_money
        }

        this.max_money_back = true;
      }
    }, 5000);

    //监听键盘金额改变事件
    this.$root.$on(this.emit_cmd.EMIT_CHANGE_MONEY, this.change_money_handle)
  },
  methods: {
    ...mapMutations(['set_money_total', "set_money_notok_list", "set_keyboard_show", "set_money_notok_list2", "set_active_index", "set_http_update"]),
    /**
     *@description 点击删除按钮，清空金额
     *@return {Undefined} undefined
     */
    clear_money(){
      this.money = 0
    },
    /**
     *@description 格式化后的金额
     *@return {Undefined} undefined
     */
    get_money_format() {
      let mi = global_filters.format_money3(this.min_money)
      let ma = global_filters.format_money3(this.max_money)
      return licia_format(this.$root.$t('bet.money_limit2'), mi, ma);
    },
    /**
     *@description 光标闪动，animation有兼容问题，用函数替代
     *@return {Undefined} undefined
     */
    cursor_flashing() {
      clearInterval(this.flicker_timer)
      this.flicker_timer = setInterval(() => {
        this.$refs.money_span && this.$refs.money_span.classList.toggle('money-span3')
      }, 700);
    },
    /**
     *@description 金额改变事件
     *@param {Number} new_money 最新金额值
     */
    change_money_handle(new_money) {
      if (this.index_ != this.get_active_index) {return};
      
      if (this.max_money < 0.01 && this.max_money_back) {
        if (new_money) {
          this.money = '0.00';
          this.money_ok = false;
          this.set_money_notok_list({ value: this.get_bet_list[0], status: 1 });
        } else {
          this.money = '';
          this.money_ok = true;
          this.set_money_notok_list({ value: this.get_bet_list[0], status: 2 });
        }
        
        return;
      }
      
      this.money = new_money;
    },
    /**
     *@description 检查金额是否合适
     *@param {Number} val 金额
     *@return {Undefined} undefined
     */
    check_moneyok(val) {
      // 当输入金额超出用户余额时，默认转化为用户余额；并提示“余额不足，已转换为最大可投注金额” 3s消失
      if (+val > +this.get_user.balance) {
        this.money = this.get_user.balance.toString()
        this.tips_msg_update(this.$root.$t('bet.err_msg09'))
        
        clearTimeout(this.timer4)
        // 3秒后重置样式
        this.timer4 = setTimeout(() => {
          this.tips_msg_update('')
        }, 3000);
        
        return
      }
      
      // 金额高于最高和低于最低都要记录
      if (
          (val > this.max_money) && 
          (val >= 0.01 || val === '0.00') && 
          this.max_money_back
      ) {
        this.set_money_notok_list({ value: this.get_bet_list[0], status: 1 })
        this.money = this.max_money.toString()
      } 
      else if (
          (val < this.min_money) && 
          (val >= 0.01 || val === '0.00') && 
          this.max_money_back
      ) {
        this.set_money_notok_list2({ value: this.get_bet_list[0], status: 1 })
      } 
      else {
        this.money_ok = true; this.set_money_notok_list({ value: this.get_bet_list[0], status: 2 });
      }
    },
    /**
     *@description 金额输入框点击
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    input_click(evnet) {
      event.preventDefault()
      this.set_keyboard_show(true)

      if ([4, 5].includes(+this.get_bet_status)) {return};

      this.set_active_index(this.index_);

      let ele = this.$refs.bet_single_detail
      ele && ele.scrollIntoView({ block: "nearest" })

      this.send_money_to_keyboard()
    },
    // 将当前活动项的金额和最高可投金额传递给键盘
    send_money_to_keyboard() {
      if (this.get_active_index == this.index_) {
        this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
      }
    }
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_CHANGE_MONEY, this.change_money_handle)

    for (const key in this) {
      if (key.includes('timer')) {
        clearTimeout(this[key])
        clearInterval(this[key])
        this[key] = null
      }
    }
    
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
}

</script>
<style lang="scss" scoped>
.bet-single-detail {
  height: 0.56rem;
  position: relative;
}
/* ************** 右边内容 ************** -S */
.content-b {
  width: 1.6rem;
  height: 0.4rem;
  border-radius: 4px;
  font-size: 0.16rem;
  overflow: hidden;
  padding-left: 0.1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
/* ************** 右边内容 ************** -E */

.set-opacity {
  opacity: 0.2;
  pointer-events: none;
}
.money-number{
  margin-top: 1px;
}
.money-span {
  width: 0.02rem;
  height: 0.16rem;
  margin: 0 1px;
}
.money-close{
    position: absolute;
    top: 50%;
    right: 0.08rem;
    width: 0.15rem;
    height: 0.15rem;
    line-height: 0.15rem;
    text-align: center;
    margin-top: -0.09rem;
    background: gray;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 13px;
}
/* ************** 左边内容 ************** -S */
.content-t {
  padding-left: 0.12rem;
  margin-right: auto;

  p:nth-child(1) {
    position: relative;
    &::after {
      content: "";
      width: 3px;
      height: 0.12rem;
      border-radius: 2px;
      position: absolute;
      left: -0.08rem;
      top: 50%;
      transform: translateY(-58%);
    }
  }

  p:nth-child(2) {
    font-size: 0.11rem;
    line-height: 0.14rem;
  }
}
/* ************** 左边内容 ************** -E */
</style>
