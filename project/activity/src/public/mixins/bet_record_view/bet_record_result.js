/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注记录的投注项部分
 */
import { mapGetters } from "vuex";
import betting from "src/public/mixins/betting/betting.js";
import { api_betting } from "src/public/api/index";
import formartmixin from "src/public/mixins/common/time_format";

export default {
  name: "bet-record-result",
  mixins: [betting,formartmixin],
  data() {
    return {
      more_index: -1,//查看更多按钮index
      pre_order_list: [],//查看提前结算详情
      cur_bet_pre: {},
      toast: false,
      timer_obj: {}, // 定时器
      money_obj: {}, // 金额对象(用于存储金额的最大最小值,滑块拖动后当前金额的值)
      bet_pre_code: 0, // 提前结算编码 0 未结算 1 结算成功 其他结算失败 0400524(提示结算为通过审核) 0400500(按钮置灰)
      setup_single_info: {}, // 存储配置信息
      // probabilities: 1, // 结算概率
      cash_out_status: 1, // 结算状态
      settleAmount: "0.00", // 结算金额
      frontSettleAmount: 0.00, // 最高可以结算的金额
      amount: 1.00, // 按钮上的显示金额
      response_code: '', // 接口返回的code码
      response_amount: 0.00, // 接口返回的金额
      is_cancel: false // 是否被拒单过（ws）
    }
  },
  props: {
    index: Number,    //当前第几个
    selected: Number, // 0:未结算 1:已结算 2: 预约
    item_obj: Object,  //数据源
    orderNo_data_obj: Array,  // 提前结算状态item
    orderNo_data_list: Array, // 提前结算状态单号
    bet_pre_amount: Number, // 提前结算数量
    order_amount: Number, // 订单金额
    win_amount: Number,  // 盈的金额
    profit_amount: Number,  //利润金额
    back_amount: Number, //返还金额
    addition: Number, //印尼马来盘附加金额，如果大于0需要前端同学在金额前加“+”号
    out_come: Number	//赢结算状态2是走水，3-输，4-赢，5-半赢，6-半输				
  },
  filters: {
    /**
     * 格式化金额
     */
    format_balance(num) {
			if(num) {
				let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)
        if(_.isArray(_split)) {
          // 保留两位小数
          let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"

          let _num = _split[1] + '.' + decimal
        
          return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
				return '0.00'
			}
			return '0.00';
    }
  },
  created() {
    // 最高可以结算的金额
    this.frontSettleAmount = _.get(this.item_obj, 'maxCashout') || 0;
    //获取结算金额
    this.get_amount();
    // 获取提前结算按钮上的金额
    this.$root.$on(this.emit_cmd.EMIT_GET_PRE_AMOUNT_CMD, this.get_amount);
    // 监听更新提前结算订单数据
    this.$root.$on(this.emit_cmd.EMIT_UPD_CASHOUT_MAX_AMOUNT_LIST_CMD, this.upd_cashout_max_amount_list);
  },
  computed: {
    ...mapGetters({
      vx_get_theme: "get_theme", //当前皮肤
      vx_get_user: "get_user" // 用户
    }),
    // 滑块是否显示
    show_count_operate() {
      // 计算金额是否大于最小投注额
     return _.get(this.item_obj,'preSettleBetAmount')>_.get(this.money_obj,'min_money',10);
    },
    // 提前结算可用次数
    betPreCount() {
      let preSettleBetAmount = _.get(this.item_obj,'preSettleBetAmount');
      let min_money = _.get(this.money_obj,'min_money',10)
      if(preSettleBetAmount<=min_money) {
        return 1;
      } else {
        return this.item_obj.preBetAmount?1:2;
      }
    }
  },
  watch: {
    /**
     * 注单状态变化时对按钮进行处理(设置提前结算成功或者提前结算失败)
     * @param {*} new_ 
     */
    "item_obj.settle_status"(new_) {
      if(new_==1) {
        // 重置过滤未结算和是提前结算定时器
        this.$emit('res_timer_get_cashout')
        clearTimeout(this.timer_obj['settle_status']); 
        this.$set(this.cur_bet_pre,'show_operate', '');
        // 注单提交成功设置提前结算按钮成功设置
        this.$set(this.item_obj,'bet_confirm',false);     
        this.$set(this.item_obj,'bet_status','end_bet_pre');
        this.re_settlement(200); // 200 为成功时的code吗
      } else if(new_==2) {
        clearTimeout(this.timer_obj['settle_status']);
        this.$set(this.cur_bet_pre,'show_operate', '');
        // 注单提交失败设置提前结算按钮回复默认(code码设置后显示对应的提示并在5s后提示恢复)
        this.bet_pre_code = 999;
        this.$set(this.item_obj,'bet_status','default');
        this.$set(this.item_obj,'bet_confirm',false);
        this.reset_bet_code('bet_pre_999');
        this.is_cancel = true
      }
    },
        /**
     * 监听ws  hs  的变化  判断提前结算当前是否暂停状态
     * @param {*} new_ 
     */

    "item_obj.orderVOS.0.hs"(new_) {
     if (new_===0) {
      this.is_cancel = false
     }
    },
    /**
     * 提前结算实时查询返回最新数据
     * @param {*} new_ 
     */
    orderNo_data_list:{
      handler(new_){
       // 确认按钮状态不是 ‘确认中...|确认提前结算’
      let bet_confirm = _.get(this.item_obj,'bet_confirm')
      let bet_status = _.get(this.item_obj,'bet_status')
      if(new_ && new_.length>0 && !bet_confirm &&bet_status!='end_bet_pre') {
        // 提前结算实时查询 更新数据
        this.get_max_cashout()
      }
     },
     immediate: true,
     // deep:true
     }
  },
  methods: {
    /**
     * @description: 更新提前结算金额
     */
    upd_cashout_max_amount_list(obj){
      if(obj && _.get(this.item_obj,'orderNo')){
        // 进行遍历比对订单
          const pre_settle_max_win = _.get(obj,'preSettleAmount');
          // 比对订单id
          if(_.get(this.item_obj,'orderNo')==_.get(obj,'orderNo') && pre_settle_max_win){
            // 更新提前结算金额
            this.item_obj.maxCashout=pre_settle_max_win;
            this.frontSettleAmount = _.get(this.item_obj, 'maxCashout') || 0;
            this.get_amount();
            this.amount = pre_settle_max_win;
            let orderStatus = _.get(obj,'orderStatus');
            if (orderStatus == 1) {
              // 成功
              this.$set(this.item_obj,'bet_status','end_bet_pre');
            } else if (orderStatus == 2) {
              // 失败
              this.$set(this.item_obj,'bet_status','default');
            }
          }
      }
    },
   /**
		* @description: 展开/折叠调整结算金额滑动
		*/
		show_bet_pre(index){
      // 如果当前是展开的则进行折叠设置
			if(_.get(this.cur_bet_pre,'show_operate')){
        this.$set(this.cur_bet_pre,'show_operate', '');
        this.money_obj.slider_index = -1;
        this.more_index = -1;
				return false;
			}
      // 记录当前操作的索引
      this.more_index = index;
      // 金额改变设置为true
			this.item_obj.changeMoney = true;
      // 设置结算按钮
      this.$set(this.cur_bet_pre, 'show_operate', 'bet_pre');
      // 当金额不为空则需要设置滑块显示默认
      if(this.money_obj.money) {
        this.$nextTick(()=>{
          let slider = this.yabo_common.get_refs_info(`vue-slider-${index}`, null, this);
          if(!slider) return;
          let slider_index = slider.getIndex();
          // 如果滑块所在的index值为-1则需要对默认设置重新设置值
          // 根据金额算滑块的当前应该所处的比率
          let rat = (this.money_obj.money/this.money_obj.max_money) * 100;
          rat = Math.floor(rat); // 对所算的比率向下取整
          // 组件百分比和索引的映射关系
          let obj_index = {
            "25": 1,
            "50": 2,
            "75": 3,
            "100": 4
          }
          if(obj_index[rat]) {
            slider_index = obj_index[rat]
          } else {
            slider_index = 0;
          }
          this.money_obj.slider_index = slider_index;
          //获取结算金额
          this.get_amount()
          // 设置组件默认选中的进度
          slider.setIndex(slider_index);
          slider = null;
        });
        return false;
      }
      // 设置默认为最大金额
      this.$set(this.money_obj,'money',_.round(this.money_obj.max_money,2));
      this.$nextTick(()=>{
        let slider = this.yabo_common.get_refs_info(`vue-slider-${index}`, null, this); 
        if (slider) {
          slider.setIndex(4);        
        }       
      });
      this.money_obj.slider_index = 4;
      //获取结算金额
      this.get_amount()
		},
    /**
		* @description: 提前结算实时查询 更新数据
		*/
    get_max_cashout() {
      // 提前结算实时查询 是否包含该条数据
      let num = _.findIndex(this.orderNo_data_obj, { 'orderNo': this.item_obj.orderNo })
      if(num>-1) {
        let maxCashout = _.get(this.orderNo_data_obj,`${num}.preSettleMaxWin`) || 0;
        let preBetAmount = _.get(this.orderNo_data_obj,`${num}.preBetAmount`);
        let orderStatus = _.get(this.orderNo_data_obj,`${num}.orderStatus`);
        let maxCashout_ = _.get(this.item_obj,'maxCashout')
        let preBetAmount_ = _.get(this.item_obj,'preBetAmount')
        let orderStatus_ = _.get(this.item_obj,'orderStatus')
        // 数据是否有更新，有更新则替换数据
        if(maxCashout != maxCashout_ || orderStatus != orderStatus_ || preBetAmount != preBetAmount_) {
          this.$set(this.item_obj, 'maxCashout', maxCashout)
          // 注单剩余本金
          this.$set(this.item_obj, 'preSettleBetAmount', this.$mathjs.subtract(this.order_amount, preBetAmount_||preBetAmount||0))
          this.$set(this.item_obj, 'preBetAmount', preBetAmount)
          this.$set(this.item_obj, 'orderStatus', orderStatus)
          // 最高可以结算的金额
          this.frontSettleAmount = maxCashout
          //获取结算金额
          this.get_amount();
        }
      }
    },
    /**
		* @description: 初次点击提前结算
		* @param {}
		* @return {}
		*/
		start_bet_pre(){
      // 设置按钮为开始结算按钮
      this.$set(this.cur_bet_pre,'show_operate','start_bet_pre');
      // 由于此时按钮处于开始结算状态，确认按钮设置默认状态为false
      this.$set(this.item_obj,'bet_confirm',false);
      // 设置结算状态
      this.$set(this.item_obj,'bet_status','start_bet_pre');      
      clearTimeout(this.item_obj['bet_pre_timer']);  
      // 清除过滤未结算和是提前结算定时器
      this.$emit('clear_timer_get_cashout')    
      this.more_index = -1;
      // 如果按钮指点过一次，一直处于开始结算状态，5s后恢复为结算按钮初态
			this.item_obj['bet_pre_timer'] = setTimeout(()=>{
        this.$set(this.cur_bet_pre,'show_operate', '');
        this.$set(this.item_obj,'bet_status','default');
        // 重置过滤未结算和是提前结算定时器
        this.$emit('res_timer_get_cashout')
			}, 5000)
		},
    /**
		* @description: 确认提前结算
		* @return {}
		*/
		bet_handle(orderNo){
			clearTimeout(this.item_obj['bet_pre_timer'])
      // 如果当前结算状态处于确认中，那么按钮还是保持原状态(放置重复提交)
			if(this.item_obj.bet_confirm) return;
      // 设置结算状态
      this.item_obj.bet_confirm = true;
      // 结算状态为3:结算中
      this.item_obj.settle_status = 3;      
      this.settleAmount = "0.00";
      // 如果结算金额没有改变则却默认的结算金额，如果有改变则从money_obj中取值
      if(_.get(this.item_obj,'changeMoney', false)) {        
        this.settleAmount = this.money_obj.money.toFixed(2);
      } else {
        this.settleAmount = this.item_obj.setBetAmount.toFixed(2);
      }
      //获取结算金额
      let amount = this.get_amount();
      if(this.response_code=='0400537') {
        amount = this.response_amount;
        this.amount = Number(this.response_amount).toFixed(2);
        this.response_code = '';
        this.response_amount = 0.00;
      }
			let params = {
				orderNo: orderNo,  //订单号
				settleAmount: this.settleAmount,  //需要结算金额
        deviceType:2, //设备类型
        frontSettleAmount: amount  // 最高可以结算的金额
			}
      // 调用提前结算接口
			api_betting.post_pre_bet_order(params).then(res =>{
				const code = _.get(res, "data.code");
        const data = _.get(res, "data.data");
				if(code == 200){
          this.bet_pre_code = 1;  
          // 确认按钮状态恢复   
          this.$set(this.item_obj,'bet_confirm',false);   
          // 显示结算成功按钮  
          this.$set(this.item_obj,'bet_status','end_bet_pre');
          this.re_settlement(code);          
				} else if(['0400500','0400527','0400537'].includes(code)) {
          this.bet_pre_code = code;
          // 确认按钮状态恢复
          this.$set(this.item_obj,"bet_confirm", false);
          // 恢复默认按钮状态
          this.$set(this.item_obj,'bet_status','default');
          if(code=='0400537' && data) {
            this.response_amount = Number(data).toFixed(2);
            this.amount = Number(this.response_amount).toFixed(2);
            this.response_code = code;
          }
          this.reset_bet_code(`bet_pre_${code}`);
        } else if(code!=='0400524') {
          this.bet_pre_code = code;
          // 恢复默认按钮状态
          this.$set(this.item_obj,'bet_status','default');
          // 确认按钮状态恢复
          this.$set(this.item_obj,'bet_confirm',false);
          this.reset_bet_code(`bet_pre_${code}`);
        }
        if(code=='0400524') {
          clearTimeout(this.timer_obj['settle_status']);
          // 提前结算接口如果超过310S后ws没有返回最终状态 拉取一次接口进行最终状态更改
          this.timer_obj['settle_status'] = setTimeout(() => {
            this.order_pre_settle_confirm((code,data)=>{
              if(code==200 && _.isArray(data)) {
                let obj = _.find(data, item=>item.orderNo == orderNo);
                if(obj) {
                  if(obj.preSettleOrderStatus==1) {
                    this.bet_pre_code = 1;  
                    // 确认按钮状态恢复   
                    this.$set(this.item_obj,'bet_confirm',false);   
                    // 显示结算成功按钮  
                    this.$set(this.item_obj,'bet_status','end_bet_pre');
                    this.re_settlement(code);
                    // 更新用户账号金额
                    this.$root.$emit(this.emit_cmd.EMIT_GET_BALANCE_CMD);
                  } else if(obj.preSettleOrderStatus==2) { // 拒单
                    // 提前结算单被拒
                    this.is_cancel = true
                    this.bet_pre_code = '0400500';
                    // 恢复默认按钮状态
                    this.$set(this.item_obj,'bet_status','default');
                    // 确认按钮状态恢复
                    this.$set(this.item_obj,"bet_confirm", false);
                  }
                }
              }
            });
          }, 310 * 1000);
        }
			}).catch(err=>{
        // 提前结算code设置为 999
        this.bet_pre_code = 999;
        // 状态恢复
        this.$set(this.item_obj,'bet_status','default');
        this.$set(this.item_obj,'bet_confirm',false);
        this.reset_bet_code('bet_pre_999');
				console.log(err)
			})
		},
    /**
     * 部分结算后显示提前结算详情
     */
		show_bet_pre_info(orderNo) {
      // 提前结算详情折叠
			if(_.get(this.cur_bet_pre,'show_detail')){
				this.$set(this.cur_bet_pre, 'show_detail', false);
				return false
			}		
      // 展开提前结算详情
			this.$set(this.cur_bet_pre, 'show_detail', true);
      this.get_info_data(orderNo);
		},
    /**
     * 根据订单号拉去提前结算详情
     * @param {*} orderNo 
     */
    get_info_data(orderNo){
      api_betting.get_pre_settle_order_detail({orderNo}).then(res=>{
        const code = _.get(res, 'data.code')
        let result= _.get(res, 'data.data')
        if(code == 200){
          // 设置提前结算详情数据
          this.pre_order_list = result;
        }
      })
    },
    /**
		* @description: 滑动投注金额，计算结算金额
		* @param {}
		* @return {}
		*/
		change_slider(val) {
      // 获取最小结算金额
      let min_money = _.get(this.money_obj,'min_money', 0);
      let max_money = _.get(this.money_obj,'max_money', 0); 
      this.$nextTick(()=>{
        let slider = this.yabo_common.get_refs_info(`vue-slider-${this.more_index}`, null, this);
        if(slider) {
          // 获取滑块所在节点索引
          let index = slider.getIndex();
          // 如果没有获取到节点索引
          if(index==-1) {
            // 计算结算比率
            let rat = (val/this.money_obj.max_money) * 100;
            rat = Math.floor(rat); // 对所算的比率向下取整
            // 组件百分比和索引的映射关系
            let obj_index = {
              "25": 1,
              "50": 2,
              "75": 3,
              "100": 4
            }
            // 通过结算比率获取节点所在索引
            if(obj_index[rat]) {
              index = obj_index[rat]
            } else {
              // 默认索引为0
              index = 0;
            }
            // 设置组件默认选中的进度
            slider.setIndex(index);
            // 记录滑块所在的节点索引
            this.money_obj.slider_index = index;
            //获取结算金额
            this.get_amount();
          }
          slider = null;
        }
      });
     
      // 如果最小结算金额比结算金额值大，滑块所在的结算金额已经小于最小的结算金额，那么是指结算金额为最小的结算金额
      if(val < min_money && (this.item_obj.setBetAmount > min_money) && val != max_money) {
        this.money_obj.money = min_money;
        this.money_obj.slider_index = 0;
        //获取结算金额
        this.get_amount()
        return false;
      } else if(val == max_money){
        // 对结算金额进行四舍五入      
        this.money_obj.money = _.round(val,2);
      } else {
        this.money_obj.money = Math.round(val);
      }
      this.money_obj.slider_index = val/this.money_obj.step;
      //获取结算金额
      this.get_amount()
		},
    /**
     * @点击复制单号
     * @param data：单号
     */
    copy(data) {
      let oInput = document.createElement("input");
      oInput.value = data;
      document.body.appendChild(oInput);
      oInput.select();
      this.toast = true;
      clearTimeout(this.timer_obj['toast']);
      this.timer_obj['toast'] = setTimeout(() => {
        this.toast = false;
      }, 1500);
      document.execCommand("Copy");
      oInput.remove();
    },
    reset_bet_code(filed='') {
      clearTimeout(this.timer_obj[filed]);
      this.timer_obj[filed] = setTimeout(()=>{
        this.bet_pre_code = 0;
      },5000);
    },
     /**
    * @description: 取消原因
    * @return {}
    */
    item_cancelType(cancelType){
      switch (parseInt(cancelType)) {
        case 1:
          return this.$root.$t("bet_record.match_cancel2"); //"比赛取消";;
        case 2:
          return this.$root.$t("bet_record.match_delay"); //"比赛延期";
        case 3:
          return this.$root.$t("bet_record.match_interrupt"); //"比赛中断";
        case 4:
          return this.$root.$t("bet_record.match_rematch"); //比赛重赛
        case 5:
          return this.$root.$t("bet_record.match_waist"); //"比赛腰斩";
        case 6:
          return this.$root.$t("bet_record.match_give_up"); //"比赛放弃";
        case 17:
          return this.$root.$t("bet_record.match_advance"); //"赛事提前";
        case 20:
          return this.$root.$t("bet_record.match_delay2"); //"比赛延迟";
        default: 
          return this.$root.$t("bet.invalid") //注单无效
      }
    },
    /**
     * 初始化滑块数据
     */
    init_slider_data() {
      // money_obj为空则说明滑块未设置数据      
      if(_.isEmpty(this.money_obj)) {       
        // 计算金额步长 
        let step = _.round(this.item_obj.setBetAmount,2)/4;
        //  滑块上五个点数据设置
        let bet_amount_data = [
          {id: 0, name: '0'},
          {id: step * 1, name: '25'},
          {id: step * 2, name: '50'},
          {id: step * 3, name: '75'},
          {id: step * 4, name: '100'}
        ];
        // 默认为10元
        let min_money = 10;
        if(_.isEmpty(this.setup_single_info)) {
          // 获取用户的配置
          this.setup_single_info = _.get(this.vx_get_user, 'cvo.single');
        }
        // 从用户配置中获取配置的最小金额
        if(!_.isEmpty(this.setup_single_info) && _.isPlainObject(this.setup_single_info)) {
          min_money = this.setup_single_info.min;
        }
        // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
        this.$set(this,'money_obj',{
          min_money,
          max_money: _.round(this.item_obj.setBetAmount,2),
          step,
          bet_amount_data
        });
      }
    },
    /**
     * 重新结算
     * code 接口返回的状态码
     */
    re_settlement(code) {
      clearTimeout(this.timer_obj[`bet_pre_${code}`]);
      // 第一次部分结算后按钮回复出事状态
      if(_.get(this.item_obj,'changeMoney', false) && 
        this.order_amount>this.settleAmount && 
        !this.item_obj.preBetAmount) {
        // 被ws推送拒单过，是二次结算，不走下面逻辑
        if(this.is_cancel||this.item_obj.preBetAmount==0) return;
        // 5S后回复出事状态
        this.timer_obj[`bet_pre_${code}`] = setTimeout(()=>{
          // 设置默认结算code码
          this.bet_pre_code = 0;
          // 重新计算订单剩余可结算金额
          let order_amount = this.order_amount - this.settleAmount;
          // 提前结算的金额四舍五入保留两位小数
          let money = _.round(order_amount, 2);
          this.$set(this.item_obj, 'preBetAmount', this.settleAmount);
          this.$set(this.item_obj, 'frontSettleAmount', order_amount);
          this.$set(this.item_obj, 'settleType', 4); //部分结算
          // 设置按钮结算状态
          this.$set(this.item_obj, 'bet_status','default');
          // 设置订单结算状态
          this.$set(this.item_obj, 'settle_status',0); // 恢复至初始状态
          // 计算金额步长 
          let step = money/4;
          //  滑块上五个点数据设置
          let bet_amount_data = [
            {id: 0, name: '0'}, // 0%
            {id: step * 1, name: '25'}, // 25% 
            {id: step * 2, name: '50'}, // 50%
            {id: step * 3, name: '75'}, // 75%
            {id: step * 4, name: '100'} // 100%
          ];
          // 默认为10元
          let min_money = this.setup_single_info.min || 10;
          // 设置金额对象(最小值，最大值，滑块金额的步长, 此单金额对应的滑块数据)
          this.$set(this,'money_obj',{
            min_money,
            max_money: money,
            money,
            step,
            bet_amount_data
          });
          // 前端计算 重新计算金额
          // this.frontSettleAmount = _.get(this.item_obj, 'maxCashout') - Number(this.amount).toFixed(2);
          let maxCashout = _.get(this.item_obj,'maxCashout')
          let preBetAmount = _.get(this.item_obj,'preBetAmount')
          let preSettleBetAmount = _.get(this.item_obj,'preSettleBetAmount')
          // 注单剩余本金
          this.$set(this.item_obj, 'preSettleBetAmount', this.$mathjs.subtract(this.order_amount, preBetAmount||0))
          this.frontSettleAmount = this.money_obj.money * maxCashout/preSettleBetAmount
          this.$set(this.item_obj, 'maxCashout', this.frontSettleAmount);
          //获取结算金额
          this.get_amount()
        },5000);
      } 
    },
    /**
     * 获取结算金额
     * @returns 
     */
    get_amount() {
      let amount = 0;
         let show_operate =  _.get(this.cur_bet_pre,'show_operate');
        // 按钮显示金额
        if(this.money_obj && show_operate) {
          let ratio;
          if(this.money_obj.slider_index>0) {            
            let settlement_ratio_obj = {
              1: 0.25,
              2: 0.50,
              3: 0.75,
              4: 1.00
            }
            ratio = settlement_ratio_obj[this.money_obj.slider_index]; 
          } else if(this.money_obj.slider_index==0) {
            ratio = this.money_obj.min_money/this.money_obj.max_money;
          }
            amount = this.get_btn_amount(ratio)
        } else {
          amount = this.frontSettleAmount;
        }
      this.amount = Number(amount).toFixed(2);
      return Number(amount).toFixed(2);
    },
    /**
     * 按钮显示金额
     */
    get_btn_amount(ratio) {
      ratio = ratio || 1
      let maxCashout = _.get(this.item_obj,'maxCashout')
      let preSettleBetAmount = _.get(this.item_obj,'preSettleBetAmount')
      if (ratio===1) {
        return this.frontSettleAmount * ratio;
      } else if (ratio>0) {
        let money = this.money_obj.money * maxCashout/preSettleBetAmount
        return money;
      } else {
        return this.frontSettleAmount;
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      // 初始化滑块数据
      this.init_slider_data();
    });
  },
  destroyed(){
    this.$root.$off(this.emit_cmd.EMIT_GET_PRE_AMOUNT_CMD, this.get_amount);
    this.$root.$off(this.emit_cmd.EMIT_UPD_CASHOUT_MAX_AMOUNT_LIST_CMD, this.upd_cashout_max_amount_list);
    // 定时器清空
    for(let key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    // 清空定时器对象
    this.timer_obj = {};
    // 金额对象清空
    this.money_obj = {};
    // 当前结算对象清空
    this.cur_bet_pre = {};
    // 提前结算详情数据清空
    this.pre_order_list = null;
    // 单关配置信息清空
    this.setup_single_info = {};
  },
}