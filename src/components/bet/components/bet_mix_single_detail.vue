<!--
 * @Author: Iverson
 * @Description: 处理单关多项输入框
-->
<template>
  <div class="bet_mix_single_detail" ref="bet_mix_detail">
    <div class="locked-shadow" v-if="has_pre"></div>
    <div class="content-box2 yb_px14 row items-center">
      <!-- 左 -->
      <div class="content-t">
        <p class="yb_fontsize16 black-color">{{$root.$t('bet.single_more')}}</p>
        <p style="font-size:0.11rem">{{$root.$t('bet.total_win2')}} <span :class="{'red-color':!(max_win_money == '0.00' || money_ok),'yellow-color':money_ok && money}"
            class="yb_fontsize12">&thinsp;{{ max_win_money | four_five_six_double | format_money2 }}</span></p>
      </div>
      <!-- 右 -->
      <div class="content-b" :class="{'red-color':!money_ok,'content-b2':!(get_active_index == index_ && [1, 7].includes(+get_bet_status))}" @click="change_kbdshow">
        <span class="intro-other yb_fontsize16">{{get_bet_list.length}}&nbsp;X</span>
        <span v-if="money" class="yb_fontsize20 money-number">{{money | format_money3}}</span>
        <span class="money-span" ref="money_span" :class="{'money-span2':!(get_active_index == index_ && [1, 7].includes(+get_bet_status))}"></span>
        <span v-if="!money && max_money_back" class="yb_fontsize14 limit-txt">{{get_money_format()}}</span>
        <span @click.stop="clear_money" class="money-close" :style="{opacity:money>0?'1':'0'}">x</span>
      </div>
    </div>
  </div>
</template>

<script>
import compute_max_win_money from 'src/public/mixins/odds_conversion/compute_max_win_money.js';
import betting from 'src/project/mixins/betting/betting.js';
import { mapGetters, mapMutations } from "vuex";
const licia_format = require('licia/format');
import global_filters from 'src/boot/global_filters.js';

export default {
  name: "bet_mix_single_detail",
  mixins: [betting,compute_max_win_money],
  data() {
    return {
      money: '',  //输入框金额
      money_ok: true,   //金额是否合适
      min_money: 1,   //最低投注金额
      max_money: 0,   //最高可投金额
      is_watch: true,    //组件渲染时是否监听money，后期再优化
      max_money_back: false,   //最高可赢金额的接口是否有返回(不管成功与失败)
      index_:-1 //光标默认索引
    };
  },
  computed: {
    ...mapGetters(["get_active_index", "get_is_spread", "get_bet_list", "get_s_count_data", "get_bet_status", "get_order_los", 
    "get_user", "get_money_notok_list2","get_menu_type","get_money_total","get_bet_obj"]),
    has_pre(){//判断投注项里面是否存在预约单
      const item_name = _.findKey(this.get_bet_obj, function(o) { return o.show_pre })
      if(item_name){
        return true
      }else{
        return false
      }
    },
    // 计算最高可赢
    max_win_money() {
      let max_win = 0
      
      Object.keys(this._item).map((key)=>{
          let vl = 
              this.compute_money_by_cur_odd_type(
                   _.get(this._item[key],'bs.hps[0].hl[0].ol[0].ov') / 100000,
                  null, 
                  this._item[key].bs.hps[0].hsw, 
                  this.money, 
                  this._item[key].bs.csid
              )
        
          max_win += vl*10000
      })
      
      return max_win / 10000
    },
    _item(){
      return this.get_bet_obj
    }
  },
  watch: {
    "_item":{
      handler(new_){
        if(new_){
          let num = 0
          //获取最大最小限额
          const tempNew = Object
                            .keys(new_)
                            .map((key)=>{
                              if(!new_[key].orderMaxPay){
                                 num++
                              }
                              
                              return {
                                minBet: _.toNumber(new_[key].minBet),
                                maxBet: _.toNumber(new_[key].orderMaxPay),
                                money: new_[key].money
                              }
                            })
          
          this.change_others_money_(tempNew)
          
          if(num>0){
            return
          }
          // 最低可投注金额取每个投注框最低可投注金额中的最大值，
          // 最高可投注金额取每个投注框最高可投注金额中的最小值
          this.min_money = _.maxBy(tempNew,(item)=>{return item.minBet}).minBet * 1
          this.max_money = _.minBy(tempNew, (item)=>{return item.maxBet}).maxBet * 1
          
          if (this.max_money > this.min_money) {
            this.max_money = this.round_money(this.min_money, this.max_money)
          } else {
            this.min_money = this.max_money
          }
          
          if(!this.max_money){
            this.max_money = 8888
          }
          
          this.max_money_back = true
        }
      },
        immediate:true,
        deep:true
    },
    // //点击投注后当输入金额小于最低限额时，默认转化为最低限额
    "get_money_notok_list2.length"(new_) {
      if(this.get_active_index == this.index_){
        if (new_) {return}

        if (this.money < this.min_money && this.money >= 0.01) {
          this.money = this.min_money.toString()

          this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
          this.tips_msg_update(this.$root.$t('bet.err_msg10', [this.min_money]))

          clearTimeout(this.timer2)
          // 提示信息展示3秒
          this.timer2 = setTimeout(() => {
            this.tips_msg_update()
          }, 3000);
        }
      }
    },
    // 监听金额的变化
    money(new_, old_) {
      if (this.get_active_index != this.index_) {
        return
      }

      this.check_moneyok(new_)

      if (this.get_active_index == this.index_) {
        this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
      }

      if (!this.is_watch) {return}

      // 缓存金额到vuex
      let temp_bet_obj = _.cloneDeep(this.get_bet_obj)
      Object.keys(temp_bet_obj).map((key)=>{
        temp_bet_obj[key].money = this.money
        temp_bet_obj[key].full_bet = this.get_bet_obj[key].max_money == this.money ? 1 : 0
      })
      this.set_bet_obj(temp_bet_obj)
    },
    //将金额和最高可投传递给键盘
    max_money() {
      if (this.get_active_index == this.index_) {
        this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
      }
    }
  },
  created() {
    this.timer = null  // 计时器
    this.timer2 =  null  // 计时器2
    this.flicker_timer = undefined     //光标闪动计时器
    const newArr = []
    Object.keys(this.get_bet_obj).map((key)=>{
        newArr.push(this.get_bet_obj[key].money)
    })
    
    let rst = newArr.every(item=>newArr.every(it=>it==item ? true:false))
    if(rst){
      this.money = newArr.length>0 && (newArr[0]||'')
    }
  },
  mounted() {
     // 5秒后没有限额金额返回就用默认值
    this.timer = setTimeout(() => {
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

    //投注项大于1时，光标聚焦到多项单关输入框
    if (this.get_bet_list.length > 1 && !this.has_pre) {
      this.set_active_index(-1);
    }

    if(this.get_active_index === this.index_){
      this.flicker_();
    }

    //监听键盘金额改变事件
    this.$root.$on(this.emit_cmd.EMIT_CHANGE_MONEY, this.change_money_)

    //将金额和最高可投传递给键盘
    this.$nextTick(() => {
      if (this.get_active_index == this.index_) {
        this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
      }
    })
  },
  methods: {
    ...mapMutations(["set_active_index", "set_bet_obj", "set_money_notok_list", "set_keyboard_show", "set_money_notok_list2"]),
    /**
     *@description 点击删除按钮，清空金额
     *@return {Undefined} undefined
     */
    clear_money(){
      this.money = 0
    },
    //格式化后的金额
    get_money_format() {
      let mi = global_filters.format_money3(this.min_money)
      let ma = global_filters.format_money3(this.max_money)
      return licia_format(this.$root.$t('bet.money_limit2'), mi, ma);
    },
    flicker_() {    //光标闪动，animation有兼容问题，用函数替代
      this.flicker_timer = setInterval(() => {
        let ele = this.$refs.money_span
    
        if (ele) {
          ele.classList.toggle('money-span3')
        }
      }, 700);
    },
    //判断单关输入金额是否一致，并处理
    change_others_money_() {
      const newArr = []
      Object.keys(this.get_bet_obj).map((key)=>{
          newArr.push(this.get_bet_obj[key].money)
      })
      //判断每个投注项输入框的金额是否一致
      let rst = newArr.every(item=>newArr.every(it=>it==item ? true:false))
    
      if(rst){
        this.money = newArr.length>0 && (newArr[0]||'') || ''
      }else{
        this.money = ''
      }
    },
    /**
     *@description 金额改变事件
     *@param {Number} new_money 最新金额值
     */
    change_money_(new_money) {
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
      //当输入金额超出用户余额时，默认转化为用户余额；并提示“余额不足，已转换为最大可投注金额” 3s消失
      if (val > +this.get_user.balance) {
        this.money = this.get_user.balance.toString()

        this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })

        this.tips_msg = this.$root.$t('bet.err_msg09')

        clearTimeout(this.timer2)
        // 3秒后取消提示信息
        this.timer2 = setTimeout(() => {
          this.tips_msg = ''
        }, 3000);

        return
      }

      if (
          val > this.max_money &&
          (val >= 0.01 || val === '0.00') &&
          this.max_money_back
      ) {
        this.set_money_notok_list({ value: this.get_bet_list[0], status: 1 })
        this.money = this.max_money.toString()
        this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
      }
      else if (
          val < this.min_money &&
          (val >= 0.01 || val === '0.00') &&
          this.max_money_back
      ) {
        this.set_money_notok_list2({ value: this.get_bet_list[0], status: 1 })
      }
      else {
        this.money_ok = true;
        this.set_money_notok_list({ value: this.get_bet_list[0], status: 2 });
      };

    },
    //改变键盘显示
    change_kbdshow() {
      this.set_keyboard_show(true)

      if ([4, 5].includes(+this.get_bet_status)) {return};

      this.set_active_index(this.index_);

      let ele = this.$refs.bet_mix_detail

      ele && ele.scrollIntoView({ block: "nearest" })

      //将金额和最高可投传递给键盘
      if (this.get_active_index == this.index_) {
        // 同步程序走完后再处理逻辑
        this.$nextTick(() => {
          this.$root.$emit(this.emit_cmd.EMIT_SEND_VALUE, { money: this.money, max_money: this.max_money })
        })
      }
    },
    // 清除当前组件所有定时器
    clear_timer() {
      // timeout定时器列表
      const timeout_timer_arr = [
        'timer',
        'timer2',
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
    },
  },
  destroyed() {
    this.clear_timer()

    this.$root.$off(this.emit_cmd.EMIT_CHANGE_MONEY, this.change_money_);

    for (const key in this.$data) {
      this.$data[key] = null
    }

  }
}

</script>
<style scoped lang="scss">
.bet_mix_single_detail{
  /* ************** 失效蒙层 ************** -S */
  position: relative;
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
  .content-box2{
    margin-top: 0.06rem;
    min-height: 0.56rem;
    position: relative;
  }
  /* ************** 左边内容 ************** -S */
  .content-b{
    width: 1.6rem;
    height: 0.4rem;
    border-radius: 4px;
    font-size: 0.16rem;
    padding-left: 0.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .intro-other{
      position: absolute;
      left: -0.33rem;
    }
  }
  /* ************** 右边内容 ************** -E */

  .set-opacity{
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
  .content-t{
    padding-left: 0.12rem;
    margin-right: auto;
    p:nth-child(1){
      position: relative;
      font-weight: 500;
      &::after{
        content: '';
        width: 3px;
        height: 0.12rem;
        border-radius: 2px;
        position: absolute;
        left: -0.08rem;
        top: 50%;
        transform: translateY(-58%);
      }
    }  
    p:nth-child(2){
      font-size: 0.11rem;
      line-height: 0.14rem;
    }
  }
  /* ************** 左边内容 ************** -E */  
  .content-m{
    min-width: 0.4rem;
    text-align: right;
  }
  .content-t2{
    position: relative;
  }
}
</style>
