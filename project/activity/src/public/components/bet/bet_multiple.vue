<!--
 * @Author: 
 * @Date: 2022-04-05 14:38:19
 * @Description: 多项单注投注 
 * @Path: 
-->
<template>
	<q-card flat class="relative-position bet-multiple bet-card"
  >
    <!--这个地方是个遮罩层，单关合并只能有一个能预约，其余用遮罩遮住-->
    <div class="cathectic-appoint" v-if="!_.isEmpty(vx_get_bet_appoint_obj)"></div>
		<q-card-section>
      <!--竖线以及多项单注-->
			<div class="row">
        <div class="line"></div>
        <div class="col">
          <!--多项单注-->
          {{$root.$t('bet.bet_multiple')}}
        </div>
			</div>
      <!--单关数量以及输入框-->
			<div class="row bet-multiple-input yb-flex-nowrap">
				<div class="col bet-count">
          <span>{{vx_get_bet_single_list.length}}</span><span class="operation-symbol">X</span>
        </div>
				<div class="col-auto right-input" :data-check-money="view_ctr_obj.single_range_money">
          <!--投注金额输入框-->
          <currency-input
            :id="`but-${vx_get_bet_single_list.length}`"
            :ref="'but-input-'+vx_get_bet_single_list.length"
            class="bet-input input-border"
            :class="{'input-money': !is_empty_money,'input-border-red':![-4,0].includes(view_ctr_obj.single_range_money)}"
            :placeholder="`${$root.$t('bet.money_range')} ${ min_money.replace(/\B(?=(\d{3})+$)/g, ',') || 10} ~ ${max_money.replace(/\B(?=(\d{3})+$)/g, ',') || 8888}`"
            v-model="money"
            :value="money"
            @keyup="keyup_handle"
            :distractionFree="{
              hideCurrencySymbol: true
            }"
            :precision="{
              min:0,
              max:2
            }"
            :currency="null"
            :valueRange="value_range"
            maxLength="11"
            autocomplete="off"
            locale="zh"/>
          <!--清除输入金额按钮-->
          <div class="bet-input-close" @click.stop="bet_clear_handle" v-show="!is_empty_money"><icon name="icon-failure" size="12px"/></div>
				</div>
			</div>
      <!--最高可赢-->
			<div class="row bet-win yb-fontsize12">
				<div class="col df-jb">
					<!--最高可赢额-->
					{{$root.$t('common.maxn_amount_val')}}
				</div>
				<div class="col-auto bet-win-money yb-number-bold">{{win_money | four_five_six_double(2) | format_currency}}</div>
			</div>
      <!--键盘-->
			<div class="row bet-keyboard bet-keyboard-content">
				<div class="col">
					<bet-keyboard
							ref="bet-keyboard"
							@keypress_handle="keypress_handle"
							@update_keyboard="update_keyboard"
							@input_max_money="input_max_money"
							:keyboard_data="keyboard_data" 
              :min_max_money="max_money"
					></bet-keyboard>
				</div>
			</div>
		</q-card-section>

    <!-- <div class="mask-appointment" v-if="is_forward != -1"></div> -->

	</q-card>
</template>
<script>
import { mapGetters } from "vuex";
import betting from "src/public/mixins/betting/betting.js";
import BetKeyboard from "src/public/components/bet/bet_keyboard.vue";
export default {
	mixins: [betting],
	data() {		
		return {
			money: null,
			value_range: {
				min: 0
			},
      //键盘数据
			keyboard_data: [
        {
          text: "100",
          value: 100,
          disabled: false
        },
        {
          text: "500",
          value: 500,
          disabled: false
        },
        {
          text: "1,000",
          value: 1000,
          disabled: false
        },
        {
          text: "2,000",
          value: 2000,
          disabled: false
        },
        {
          text: "5,000",
          value: 5000,
          disabled: false
        },
        {
          text: "MAX",
          disabled: false
        }
      ],
		}
	},
	props: {
		view_ctr_obj: {
			type: Object,
			default: {}
		},
    // is_forward: {
    //   type: Number,
    //   default: -1
    // }
	},
	components: {
		"bet-keyboard": BetKeyboard 
	},
  created() {
    //清空多项输入
    this.$root.$on(this.emit_cmd.EMIT_CLEAR_BET_MULTIPLE_CMD,this.clear_bet_multiple);
    // 更新键盘状态
    this.update_keyboard_status();
  },
  destroyed() {
    clearTimeout(this.timer);
    this.$root.$off(this.emit_cmd.EMIT_CLEAR_BET_MULTIPLE_CMD,this.clear_bet_multiple);
  },
	computed: {
		...mapGetters({
      vx_get_bet_appoint_obj: "get_bet_appoint_obj", // 被预约的投注项id
			vx_get_bet_single_list: "get_bet_single_list", //单关列表
			vx_get_bet_single_obj: "get_bet_single_obj", //单关对象
			vx_get_user: "get_user"  //用户信息
		}),
		/**
     * @description: 当前金额是否为空字符串
     * @param {undefined} undefined
     * @return {Boolean}
     */
    is_empty_money() {
      let is_empty_money_ = this.money===null;
      this.view_ctr_obj.is_empty_money = is_empty_money_;
      return is_empty_money_;
    },
		/**
     * @description: 最小值
     * @param {undefined} undefined
     * @return {String}
     */
    min_money() {
			let array = Object.values(this.vx_get_bet_single_obj);
			let data = _.sortBy(array, function(o) { return parseFloat(o.cs.min_money); });		
      return `${(_.last(data)).cs.min_money}`
    },
    /**
     * @description: 最大值
     * @param {undefined} undefined
     * @return {String}
     */
     max_money() {
     	let array = Object.values(this.vx_get_bet_single_obj);
			let data = _.sortBy(array, function(o) { return parseFloat(o.cs.max_money); });
      return `${data[0].cs.max_money}`
    },
     /**
     * @description: 最高可赢额
     * @param {undefined} undefined
     * @return {String}
     */
		win_money() {
			if(this.money) {
				let array = Object.values(this.vx_get_bet_single_obj);
				let win_money_ = _.reduce(array, function(sum, n) {
					let cs_win_money = n.cs.win_money || 0.00;
					return sum + Number(Number(cs_win_money).toFixed(2));
				}, 0);
				return win_money_ || 0.00
			}			
			return 0.00
		},
    /**
     * @description: 当前金额是否为空字符串
     * @param {undefined} undefined
     * @return {Boolean}
     */
    is_empty_money() {
      let is_empty_money_ = this.money===null;
      return is_empty_money_;
    }    
	},
  watch: {
    /**
     * 勾选合并是设置键盘按键的状态
     * 设置max键状态
     */
    vx_get_is_bet_merge: {
      handler(new_) {
        this.$nextTick(() => {
          let last_obj =  _.last(this.keyboard_data);
          if(new_) {       
            last_obj.disabled = true;
          } else {
            last_obj.disabled = false;
          }
        });
      },
      immediate: true
    },
    
    /**
     * 监听单关列表变化
    */
    vx_get_bet_single_list: {
      handler(_new) {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          if(this.vx_get_is_bet_merge) {
            this.bet_clear_handle();
          }
        }, 1000)
      },
      immediate: true
    },
    /**
     * 监听错误码
     */ 
    'view_ctr_obj.error_code'(new_) {
      // 转换成最大金额
      if(new_ == "M400010") {
        this.money = parseFloat(this.min_money);
      }
      // 转换成最大金额
      if(new_== "M400011") {
        this.money = parseFloat(this.max_money);
      }
    }
  },
	methods: {
    /**
     * @description: 清空投注状态
     * @param {undefined} undefined
     * @return {undefined} undefined
    */
		bet_clear_handle() {
			// 金额重置
      this.money = null;
			// 金额是否为空标识设置为true
      this.view_ctr_obj.is_empty_money = true;
      // 更新键盘状态
      this.update_keyboard_status();
			this.$root.$emit(this.emit_cmd.EMIT_BET_SET_MONEY, this.money);
		},

    /**
     * @description: 键盘抬起事件处理
     * @param {object} event
     * @return {undefined} undefined
    */
		keyup_handle(event) {
			// 设置限额标识为默认
      this.view_ctr_obj.single_range_money = 0;
      // 获取输入值
      let value = event.target.value;
      //减号开头
      if(value && value.startsWith('-')) {
        event.target.value = '';
        return;
      }
      //包含逗号
      if(value && value.includes(",")) {
        value = parseFloat(value.replace(/,/g,''));
      }
      // 转换输入值
      this.money = parseFloat(value);			
       if(this.view_ctr_obj.single_range_money != 2) {
        // 校验用户金额
        this.check_money(value);
      }
      // 金额存在
      if(!isNaN(this.money)) {
        // 更新键盘状态
        this.update_keyboard_status();
      }
      //设置输入框金额
			this.$root.$emit(this.emit_cmd.EMIT_BET_SET_MONEY, this.money);
		},

    /**
     * @description: 键盘按下事件处理
     * @param {object} event
     * @return {undefined} undefined
    */
		keypress_handle(data_) {      
      let user = this.vx_get_user;
      this.money = this.money || 0;
      // 从键盘上获取值赋给组件
      if (this.max_money!="" && user.balance) {        
        // 计算总的输入金额
        let total_money = this.money + parseFloat(data_.number);
        // 最高限额小于用户账户金额且总金额没有最高限额大
        if ((parseFloat(this.max_money) < parseFloat(user.balance)) && (total_money <= this.max_money)) {
          // 更新输入金额为总的金额
          this.money = Number(total_money);
        } else if((parseFloat(this.max_money) > parseFloat(user.balance)) && (total_money <= parseFloat(user.balance))) { // 用户余额没有最高限额多 并且总金额小于等于用户余额
          // 更新输入金额为总金额
          this.money = Number(total_money);
        }
      } else {
        // 设置输入金额为按键金额
        this.money = Number(data_.number);
      }
      this.$root.$emit(this.emit_cmd.EMIT_BET_SET_MONEY, this.money);
      // 更新键盘按键的状态
      this.update_keyboard_status();
		},

    
    /**
     * @description: 更新键盘按钮状态
     * @param {object} value 键盘对应数值
     * @return {undefined} undefined
    */
		update_keyboard(value) {
      _.forEach(this.keyboard_data, item => {
        // 当value值小于键盘按键值或者点击的是MAX按键并且勾选了合并则按键置灰
        if(item.value>value ||item.text=='MAX') {
          item.disabled = true;
        } else {
          // 按键正常状态
          item.disabled = false;
        }
      });
		},

     /**
     * @description: 更新键盘状态
     * @param {undefined} undefined 
     * @return {undefined} undefined
    */
		update_keyboard_status() {
      let user = this.vx_get_user;
      // 获取用户余额
      let init_money = parseFloat(user.balance) || 0.00;
      // 输入的金额存在并且用户有余额
      if(!_.isNull(this.money) && init_money!=0) {
        // 输入余额比用户金额多时取输入金额否则还是取用户余额
        init_money = this.money > init_money? this.money : init_money;
      }
      // init_money比最大限额大时，自动转换问最大限额
      if(this.max_money && init_money > parseFloat(this.max_money)) {
        init_money = parseFloat(this.max_money);
      }
      // 根据输入的金额和用户余额计算键盘更新键盘按键
      init_money = init_money - this.money;
      this.update_keyboard(init_money);
		},

    /**
     * @description: 根据用户输入金额以及max_money转换
     * @param {undefined} undefined 
     * @return {undefined} undefined
    */
		input_max_money() {
			if(this.show_fail_alert() || this.view_ctr_obj.single_range_money==-3) {
        return;
      }
      let user = this.vx_get_user;
      this.set_bet_obj_value("full_bet", 0);
      // 首先判断用户余额是不是比max_money多，多的话就是max_money
      // 比max_money少的话，就显示剩余金额
      if (user && user.balance>=0 && this.max_money > parseFloat(user.balance)) {
        // 转换输入金额为用户账户金额       
        this.money = Number(user.balance);
      } else {
        // 转换输入金额为最大限额
        this.money = Number(this.max_money);
      }
      // 设置限额范围标识为正常默认值    
      this.view_ctr_obj.single_range_money = 0;
      // 更新键盘状态  
      this.update_keyboard_status();
		},

    
    /**
     * @description: 检测金额
     * @param {object} value 值
     * @return {undefined} undefined
    */
    check_money(value) {
      try {
        // 统计为输入金额的投注项个数
        let empty_count = 0;
        this.view_ctr_obj.error_code = "";
        if(this.money==null && (value===null || value==='')) {
            // 统计计入到位输入投注项金额中
          empty_count++;
        }
        // 所有的投注项都没有输入金额时
        if (empty_count == 1) {
          // 设置限额标识为输入为空
          this.view_ctr_obj.single_range_money = -2;
          this.view_ctr_obj.is_empty_money = true;
        } else {
          // 输入金额
          let input_amount = null;
          if(value) {
             // 传入了使用传入的value
            input_amount = parseFloat(value);
          } else {
            // 没有传入使用this.money的值
            input_amount = parseFloat(this.money);
          }
          // 输入金额比最小金额还小
          if(input_amount<this.min_money) {
            this.view_ctr_obj.single_range_money = -4;
          } else if(input_amount>this.max_money) {
            // 输入金额比最大限额还大
            this.view_ctr_obj.single_range_money = 1; 
          } else {
            // 设置为默认
            this.view_ctr_obj.single_range_money = 0;
          }
          // 金额是否为空标识为false
          this.view_ctr_obj.is_empty_money = false;

          // 校验单关限额范围，不通过则提示
         this.yabo_common.check_result_msg(this, 'single');
          // 转换成最大金额
          if(this.view_ctr_obj.error_code == "M400010") {
            this.money = parseFloat(this.min_money);
          }
          // 转换成最大金额
          if(this.view_ctr_obj.error_code == "M400011") {
            this.money = parseFloat(this.max_money);
          }
        }
      } catch(e) {
        console.error(e)
      }
    },
    /**
     * @description:清空多项输入(不用把金额同步到其他输入框中)
     * @param {object} value 值
     * @return {undefined} undefined
     */
    clear_bet_multiple(value) {
      let flag = false;
      let len = this.vx_get_bet_single_list.length;
      for(let i = 0; i < len; i++) {
        let next_money = _.get(this.vx_get_bet_single_obj, `${this.vx_get_bet_single_list[i]}.cs.money`);
        if(value !== next_money) {
          flag = true;
          break;
        }
      }
      if(flag) {
        // 金额重置
        this.money = null;
        // 更新键盘状态
        this.update_keyboard_status();
      }
    }
	}
}
</script>
<style scoped lang="stylus">
/**遮罩层**/
.mask-appointment {
  background: #F0F5FC !important;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10000;
  opacity: 0.6;
}
/**多项单注投注整体**/
.bet-card
  line-height 0 !important
  /* *卡片组件样式重写* */
  >>>.q-card__section
    margin 0
    padding 0
    line-height 1
.ie-browser
  .bet-input-close
    top 9.5px

</style>