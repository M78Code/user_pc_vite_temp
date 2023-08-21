/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注项组件minxin 正常
 */

import betting from "src/public/mixins/betting/betting.js";
export default {
  name: "bet-mix-item",
  mixins: [betting],
  data() {
    return {
      sport_id: "", // 球种id
      oid: "", // 球种id
      is_change_odds: false, // 是否切换赔率
      //赛事栏目
      odds_change_up: false, // 赔率上升
      odds_change_down: false, // 赔率下降
      handicap_change: false, //盘口是否变化
      odds_status_change: false, // 赔率是否变化
      mouseover_info: false, // 鼠标是否移入
      season: '', // 赛季
      team_name: '', // 队伍名称
      play_name: '', // 玩法名称
      match_update: false, // 赛事是否被替换
      old_hv: null, // 上次的盘口值
      new_hv: null, // 最新的盘口值
      timer_obj: {}, // 定时器对象
      home: '', // 主队名称
      away: '', // 客队名称
      league_name:'' // 联赛名称
    };
  },
  created() {  

//生成事件监听
this.handle_generat_emitters()

    //更新主客队信息  
    this.update_home_away();
    // 赛事需要更新并且投注项列表中有多余一个投注项
    if(this.match_update && this.BetData.bet_list.length > 1) {
      let self = this;
      clearTimeout(this.timer_obj[`created_${this.id}`]);
      // 更新标志3s后恢复初始值
      this.timer_obj[`created_${this.id}`] = setTimeout(() => {
        self.match_update = false;
        let obj = _.cloneDeep(self.BetData.bet_obj[self.id]);
        if(obj) {
          obj.key = self.id;
          if(obj.cs) {
            obj.cs.match_update = false;
          }
          self.BetDataCtr.bet_obj_add_attr(obj);
        }      
      }, 3000);
    }
  },
  beforeUnmount() {
    //清除定时器
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    this.timer_obj = {};
     //移除相应监听事件 //视图销毁钩子函数内执行
    if(this.emitters_off){this.emitters_off()}  


  },
  props: {
 
    // 投注项id
    id: {
      type: String | Object,
      default: () => {
        return "0"
      }
    },
    // 是否关闭
    is_close: {
      type: Boolean,
      default: true
    },
    // 投注项对象
    item_obj: {
      type: [Object, String],
      default: () => { }
    }
  },
  computed: {

    /**
     * @description: 赛事类型 match_type: 3 冠军赛
     * @param {undefined} undefined
     * @return {undefined}
     */
    match_type() {
      // 默认为普通赛
      return _.get(this.BetData.bet_obj,`${this.id}.cs.match_type`);
    },
    /**
     * @description: 赛事状态 0未开赛 滚球:进行中
     * @param {undefined} undefined
     * @return {undefined}
     */
    market_type() {
      return _.get(this.BetData.bet_obj, `${this.id}.cs.market_type`);
    },
    /**
     * @description: 盘口和赔率是否一起变化
     * @param {undefined} undefined
     * @return {String}
     */
    hv_ov_change() {
      return BetCommonHelper.get_hv_ov_change();
    },
    /**
     * @description: 赛事比分
     * @param {undefined} undefined
     * @return {String} 返回比分格式为: (主队得分-客队得分)
     */
    basic_score() {
      // 获取及时比分 格式: (主队比分-客队比分)
      return BetCommonHelper.get_score_info();
    },
    /**
     * @description:及时比分
     * @param {undefined} undefined
     * @return {undefined}
     */
    timerly_basic_score() {
      return BetCommonHelper.get_timerly_score_info();
    },
    /**
     * @description: 赔率值
     * @param {undefined} undefined
     * @return {String} 赔率值
     */
    odds_value() {
      //赔率计算
      return BetCommonHelper.get_odds_value();
    },
    /**
     * @description: 盘口id
     * @param {undefined} undefined
     * @return {undefined}
     */
    handicap_id() {
      return BetCommonHelper.get_handicap_id();
    },
  /**
   * @description: 当前盘口名称 欧洲盘/香港盘
   * @param {undefined} undefined
   * @return {String}
   */
    handicap_name() {
      // 获取赔率支持的类型
      let hsw = _.get(this.BetData.bet_obj,`${this.id}.bs.hps[0].hsw`);
      // 盘口名称和盘口值映射
      if(hsw) {
        let odds_table = {
          EU: '1',
          HK: '2',
          MY: '3',
          GB: '4',
          US: '5',
          ID: '6'
        }
        // 盘口名称值存在
        if(hsw.includes(odds_table[this.BetData.cur_odd])) {
          // 盘口类型
          return `[${i18n.t('odds')[this.BetData.cur_odd]}]`;
        }
      }
      // 欧洲盘
      return `[${i18n.t('odds')['EU']}]`;
    },
    /**
     * @description: 盘口值
     * @param {undefined} undefined
     * @return {String} 盘口值
     */
    handicap() {
      //获取盘口值
      return BetCommonHelper.get_handicap();
    },
    /**
     * @description: 是否有盘口值
     * @param {undefined} undefined
     * @return {undefined}
     */
    has_handicap_value() {
      let bet_obj = this.BetData.bet_obj[this.id];
      if(bet_obj) {
        return _.trim(_.get(bet_obj, 'cs.handicap_value')) !== '';
      }
      return false;
    },
    /**
     * @description: 投注项状态
     * @param {undefined} undefined
     * @return {String} 投注项状态
     */
    active() {
      return BetCommonHelper.get_active();
    },
    /**
     * @description: tips icon的id
     * @param {undefined} undefined
     * @return {undefined}
     */
    icon_id() {
      let icon_id_ = '';
      if(this.id && this.id.includes(':')) {
        icon_id_ = this.id.replace(/:/g, '_');
      } else {
        icon_id_ = this.id;
      }
      return icon_id_;
    },
    /**
     * @description: 是否可以进行串关
     * @param {undefined} undefined
     * @return {undefined}
     */
    is_serial() {
      return BetCommonHelper.get_serial();
    },
    /**
     * @description: 串关类型
     * @param {undefined} undefined
     * @returns {undefined}
     */
    serial_type() {
      return BetCommonHelper.get_serial_type();
    },
    /**
     * @description:下注数量
     * @param {undefined} undefined
     * @returns {number} 下注数量 默认0
     */
    bet_item_count() {
      return this.BetData.bet_list.length || 0;
    },
    /**
     * @description:赛事时间
     * @param {undefined} undefined
     * @returns {string} 格式化后的时间
     */
    match_time() {
      let obj_bs = _.get(this.BetData.bet_obj,`${this.id}.bs`);
      if(_.isPlainObject(obj_bs)) {
        let date,month,day,hour,minute;
        let format_str = BetCommonHelper.format_str;
        if(this.match_type == 3 && obj_bs.med) { // 赛事结束时间
          date = new Date(parseInt(obj_bs.med));
          // 获取显示月份
          month = format_str(date.getMonth() + 1);
          // 获取显示天
          day = format_str(date.getDate()); 
          // 获取显示小时数 
          hour = format_str(date.getHours());
          // 获取显示分钟数
          minute = format_str(date.getMinutes());               
        } else if(obj_bs.mgt) { // 赛事开始时间
          date = new Date(parseInt(obj_bs.mgt));
          // 获取显示月份
          month = format_str(date.getMonth() + 1);
          // 获取显示天
          day = format_str(date.getDate());
          // 获取显示小时数 
          hour = format_str(date.getHours());
          // 获取显示分钟数
          minute = format_str(date.getMinutes());
        }
        // 中文简体或者繁体时显示时间格式
        if(['zh','tw'].includes(this.lang)) {
          return `${month}月${day}日 ${hour}:${minute}`;
        } else {
          // 非中文时显示时间格式
          return `${month}/${day} ${hour}:${minute}`; 
        }
      }            
      return '';
    }
  },
  watch: {
    /**
     * @description: 监控赔率是否切换(欧洲盘是否切换成其他盘)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    "BetData.cur_odd"() {
      this.is_change_odds = true;
    },
    /**
     * @description: 监控当前赔率
     * @param {new_} 当前赔率
     * @param {old_} 上次的赔率
     * @return {undefined} undefined
     */
    odds_value(new_, old_) {
      if (!this.is_change_odds) {
        this.change_odds_value(new_, old_);
        // console.log(`===============new:${new_}==============old:${old_}`);
        if(this.view_ctr_obj.is_submit_result) return;
        this.view_ctr_obj.bet_data_change = true;
        let count = BetCommonHelper.get_deactive_count();   
        // console.log(`===========odds_value==============count:${count}`);   
        if(count == 0 && this.is_serial && this.view_ctr_obj.error_code != '0400532'){
          this.view_ctr_obj.error_code = "0402027";
        }
        // console.log(`===============error_code:${this.view_ctr_obj.error_code}==============is_serial:${this.is_serial}`);
        this.set_message(count);
        // console.log(`=====================11111111======================odds_value================${new_}`);
        // console.log(`====odds_value===========11111=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        // 重新计算最高可赢额
        useMittEmit(MITT_TYPES.EMIT_MAX_WIN_MONEY_CMD);
        // console.log(`====odds_value===========33333=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      }
    },
    /**
     * @description: 监控盘口id变化
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    handicap_id() {
      // 发送C2订阅
      useMittEmit(MITT_TYPES.EMIT_SCMD_C2_CMD);
      if(this.bet_item_count > 1) {
        // 获取最大最小值
        useMittEmit(MITT_TYPES.EMIT_MIN_MAX_MONEY_CMD);
      }
      this.old_hv = null;
      this.new_hv = null;      
    },
    /**
     * @description: 监控盘口值变化
     * @param {String} new_ 最新的盘口值
     * @return {undefined} undefined
     */
    handicap(new_, old_) {
      this.old_hv = old_;
      this.new_hv = new_;
      // 新的盘口值存在并且有变化
      if(!isNaN(Number(new_)) && new_ != old_) {
        this.handicap_change = true;
        if(this.view_ctr_obj.is_submit_result) return; 
        this.view_ctr_obj.bet_data_change = true;
        // 获取失效的投注项数量
        let count = BetCommonHelper.get_deactive_count();
        // console.log(`===========handicap==============count:${count}`);
        // 没有失效的投注项并且支持串关
        if(count == 0 && this.is_serial) { 
          // 盘口变化错误码
          this.view_ctr_obj.error_code = "0402010"; 
        }
        // 设置提示信息        
        this.set_message(count);
        // console.log(`====handicap===========22222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      }
    },
    /**
     * @description: 监听投注项状态
     * @param {String} new_ 最新的注项状态
     * @return {undefined} undefined
     */
    active: {
      handler(new_){
        // 当前是单关时不做任何处理
        if(this.BetDataCtr.is_bet_single) return;
        // 是否有效
        let is_effect;
        // 如果投注项状态是开盘或者是锁盘
        if (new_ == 1 || new_ == 4) {
          // 投注项有效
          is_effect = true;        
        } else {
          // 投注项无效
          is_effect = false;
        }
        let bet_obj = this.BetData.bet_obj[this.id]; 
        let obj = _.cloneDeep(bet_obj);
        if(obj && obj.cs) {
          // 更新投注项有效无效的标识
          obj.cs.effect = is_effect;
          // 重新设置到存储的对象(对此字段进行更新)
          BetCommonHelper.set_bet_obj_value( obj);
        }   
        // 若为开盘状态并且可以串关
        if(new_ == 1 && this.is_serial) {
          // 清除定时器 
          clearTimeout(this.timer_obj[`timer_${this.id}`]); 
          // 初始化提示信息
          BetCommonHelper.init_message(); 
          // 赔率是否上升
          this.odds_change_up = false;
          // 赔率是否下降
          this.odds_change_down = false;
          // 盘口是否变化
          this.handicap_change = false;
          // 投注项数据有变化标识
          this.view_ctr_obj.bet_data_change = true;
        } else {
          // 盘口状态有变化
          this.odds_status_change = true;
          // 如果提交中则不处理
          if(this.view_ctr_obj.is_submit_result) return;
          // 投注项数据有变化标识 
          this.view_ctr_obj.bet_data_change = true;
          // 锁盘状态并且可以串关
          if(new_ == 4 && this.is_serial) {
            // 对应提示错误码
            this.view_ctr_obj.error_code = "M400004";           
          }
          // 获取失效的投注项数量
          let count = BetCommonHelper.get_deactive_count();
          // console.log(`============active=========count:${count}`); 
          // 设置提示信息
          this.set_message(count);
          //console.log(`====active===========22222=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        } 
      },
      immediate:true           
    },
    /**
     * @description: 监听盘口和赔率是否一起变化
     * @param {String} new_ 最新的变化标志
     * @return {undefined} undefined
     */
    hv_ov_change(new_) {
      // console.log(`==========hv_ov_change======new:${new_}======old:${old_}`);
      if(new_) {
        // 投注项数据有变化标识
        this.view_ctr_obj.bet_data_change = true;
        // 盘口有变化
        this.handicap_change = true;
        // 获取失效的投注项数量
        let count = BetCommonHelper.get_deactive_count();
        // console.log(`===========hv_ov_change==============count:${count}`);
        // 可以串关并且没有失效的投注项
        if(this.is_serial && count == 0) {
          // 设置对应的错误码
          this.view_ctr_obj.error_code = "0402028";
        }
        // 设置提示信息
        this.set_message(count);
        // console.log(`===================hv_ov_change===========error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
      }
    },
    /**
     * @description: 当前错误码
     * @param {String} new_ 错误码
     * @return {undefined} undefined
     */
    "view_ctr_obj.error_code"(new_) {
      if (new_ && new_.startsWith('M') || new_ == "") {
        this.odds_change_up = false; // 赔率是否上升
        this.odds_change_down = false; // 赔率是否下降
        this.handicap_change = false; // 盘口是否变化
      }
    },
    /**
     * @description:是否可以进行串关
     * @param {String} new_ 
     * @return {undefined} undefined
     */
    is_serial: {
      handler(new_) {
        // 不能进行串关时
        if(!new_) {
          // 设置错误码
          this.view_ctr_obj.error_code = "0400477";
          // 设置提示信息
          this.view_ctr_obj.error_message = i18n.t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;
        }
      },
      immediate: true
    },
    /**
     * @description:语言改变的时候
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    "BetData.lang_change"() {
      // 重新设置赛季
      this.season = BetCommonHelper.get_season();
      // 重新设置玩法名称
      this.play_name = BetCommonHelper.get_play_name();
      // 重新设置队伍名称
      this.team_name = BetCommonHelper.get_team_name();
    },
    /**
     * @description:是否支持串关
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    serial_type: {
      handler(new_) {
        // 不支持串关时
        if(!new_) {
          // 设置错误码
          this.view_ctr_obj.error_code = "0400477";
          // 设置提示信息
          this.view_ctr_obj.error_message = i18n.t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;
        }
      },
      immediate: true
    }
  },
  methods: {

    
    /**
* 生成事件监听  
*/
handle_generat_emitters(){
  let event_pairs=  [
// 重置串关红升绿降状态
{ type:MITT_TYPES.EMIT_BET_MIX_ITEM_RESET_CMD, callback: this.bet_mix_reset} ,
// 更改串关的match_update字段值
{ type:MITT_TYPES.EMIT_BET_MIX_CHANGE_MATCH_UPDATE, callback: this.change_match_update} ,
//更新串关投注项上的match_udpate字段
{ type:MITT_TYPES.EMIT_BET_MIX_MATCH_UPDATE, callback: this.reset_match_update} ,        
//更新主客队信息(主要用于国际化切换时调用} ,
{ type:MITT_TYPES.EMIT_UPDATE_HOME_AWAY_CMD, callback: this.update_home_away} , 

  ]
  let  { emitters_off } =  useMittEmitterGenerator(event_pairs)
  this.emitters_off=emitters_off
    //移除相应监听事件 //视图销毁钩子函数内执行
    // if(this.emitters_off){this.emitters_off()}  
},
 
    /**
     * @description: 删除投注项
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    del_bet_item() {
      if(this.id == "" || this.id == undefined) {
        let index = _.findIndex(this.BetData.bet_list,item => item == this.id);
        if(index > -1) {
          //移除对应的键值对
          this.BetDataCtr.set_bet_obj_remove_attr(this.id);
          //移除对应的数据
          this.BetDataCtr.bet_list_remove(index);
        }
      } else {
        //初始化提示信息
        BetCommonHelper.del_bet_item();
      }
      //判断是否还有失效的投注项
      if(BetCommonHelper.has_disable_item()) {
        //串关失效投注项的个数
        let count = BetCommonHelper.get_deactive_count();
        this.set_message(count);
      } else {
        //初始化提示信息
        BetCommonHelper.init_message(); 
      }   
      if(this.bet_item_count == 0) {

        clearTimeout(this.timer_obj[`timer_${this.id}`]);
        this.BetDataCtr.set_layout_left_show('menu');
        // 移除了串关数据后发现单关里面也存在此投注项，且仅剩下一个那么移除数据
        if(this.BetData.is_bet_merge || (this.BetData.bet_single_list.length == 1 && this.id == this.BetData.bet_single_list[0])) {
          this.BetDataCtr.bet_single_clear();
        }
        if(this.BetDataCtr.cur_menu_type.type_name != 'bet') {
          this.$nextTick(()=>{       
            this.BetDataCtr.set_is_bet_merge(false);    //是否合并
            this.BetDataCtr.set_is_bet_single(true);    //是否单关
          });
        }
      }
    },
    /**
     * @description:赔率变化时设置标志
     * @param {Number} new_ 当前赔率
     * @param {Number} old_ 上次赔率
     * @return {undefined} undefined
     */
    change_odds_value(new_, old_) {  
      if (new_ > old_) {
        // 设置赔率上升的样式
        this.odds_change_up = true;
        this.odds_change_down = false;
      } else if (new_ < old_) {
        this.odds_change_up = false;
        // 设置赔率下降的样式
        this.odds_change_down = true;
      }
    },
    /**
     * @description:设置提示信息
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_message(count = 0) {
      // 处理串关冲突时，赔率或者盘口的变化样式持续时间
      if(!this.is_serial || ["0400477","0400478"].includes(this.view_ctr_obj.error_code)) {
        let code;
        if(this.odds_change_up || this.odds_change_down) {
          code = "0402027"; // 赔率变化
        }
        if(this.handicap_change) {
          code = "0402010"; // 盘口变化
        }
        if(this.hv_ov_change) {
          code = "0402028"; // 赔率和盘口一起变化时
        }
        if(code) {
          this.bet_mix_reset_flag(code);
        }  
        clearTimeout(this.timer_obj[`timer_${this.id}`]); 
        this.timer_obj[`timer_${this.id}`] = setTimeout(() => {
          this.odds_change_up = false; // 赔率是否上升
          this.odds_change_down = false; // 赔率是否下降
          this.handicap_change = false; // 盘口是否变化
          this.odds_status_change = false; // 状态是否变化
        }, 3 * 1000);       
        return;
      }
      clearTimeout(this.timer_obj['message']);
      //console.log("==========================bet_mix_item=====================set_message=============");
      // 可以串关并且为不是封盘或者关盘状态且没有无效的投注项
      if(this.is_serial && this.active != 2 && this.active != 3 && count == 0) {
        // 设置错误信息
        this.view_ctr_obj.error_message = i18n.t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2;      
        // 获取错误信息延迟显示的时间
        let delay = this.error_mapping.ERROR_CODE_DELAY[this.view_ctr_obj.error_code];
        // console.log(`===============333333333=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        // 获取到延迟时间
        if(delay) {
          // 调用延迟后恢复消息的方法
          BetCommonHelper.delay_reset_message( delay, ()=>{
            // 如果投注失败
            if(this.view_ctr_obj.bet_fail_flag) {
              // 设置订单确认标识为默认值
              this.view_ctr_obj.order_confirm_complete = 0;
            }
          });
        }    
      } else if((this.is_serial && (this.active == 2 || this.active == 3)) || count > 0){ // 可以串关并且投注项为失效状态2或者有无效的投注项3
        // 错误码时空的并且支持串关
        if(this.view_ctr_obj.error_code == "" && this.serial_type) {
          // 失效提示的错误码
          this.view_ctr_obj.error_code = "0402049";
        } else if(!this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(this.view_ctr_obj.error_code)) { // 错误码不是失效错误提示信息
          // 设置为失效错误码
          this.view_ctr_obj.error_code = "0402022";
        } 
        // 设置提示信息
        this.view_ctr_obj.error_message = i18n.t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg2; 
        // console.log(`===============44444444=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);   
        // 3s后取消提示信息    
        this.timer_obj['message'] = setTimeout(() => {          
          this.bet_mix_reset();
          if(this.view_ctr_obj.bet_fail_flag) {
            this.view_ctr_obj.order_confirm_complete = 0;
          }
        }, 3 * 1000);
      } else {
        // console.log(`===============5555555=====error_code:${this.view_ctr_obj.error_code}========error_message:${this.view_ctr_obj.error_message}`);
        this.timer_obj['message'] = setTimeout(() => {
          this.bet_mix_reset();
          // 如果投注失败
          if(this.view_ctr_obj.bet_fail_flag) {
            // 设置订单确认标识为默认值
            this.view_ctr_obj.order_confirm_complete = 0;
          }
        }, 3 * 1000);
      }    
    },
    /**
     * @description:重置串关投注项组件的标志
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_mix_reset() {  
      // 设置赔率上升的样式
      this.odds_change_up = false;
      // 设置赔率下降的样式
      this.odds_change_down = false; 
      // 盘口是否变化
      this.handicap_change = false;
      // 状态是否变化
      this.odds_status_change = false;    
    },
    /**
     * @description: 根据code码重置串关投注项组件的标志
     * @param {*} code
     * @return {*}
     */
    bet_mix_reset_flag(code) {
      // console.log(`=========bet_mix_reset_flag===========code:${code}`);
      clearTimeout(this.timer_obj[`timer_${this.id}`]);
      // 获取错误码对应消息提示的时长
      let delay = this.error_mapping.ERROR_CODE_DELAY[code];
      // 时长存在
      if(delay) {
        // 在delay时长后对标识进行复位
        this.timer_obj[`timer_${this.id}`] = setTimeout(() => {
          // console.log(`=========bet_mix_reset===========timer_:${this.timer_obj[`timer_${this.id}`]}`);
          //重置串关投注项组件的标志
          this.bet_mix_reset();
          // 清除对应的定时器
          clearTimeout(this.timer_obj[`timer_${this.id}`]);
        }, delay);
      }
    },
    /**
     * @description: 赛事是否被替换
     * @param {number} oid 
     * @return {undefined} undefined
     */
    change_match_update(oid) {
      if(this.oid == oid) {
        let obj = _.cloneDeep(this.BetData.bet_obj);
        obj.match_update = true;
        this.match_update = obj.match_update;
        this.BetDataCtr.bet_obj_add_attr(obj);
      }
    },
    /**
     * @description:重置match_update标志
     * @param {*} oid 
     * @return {undefined} undefined
     */
    reset_match_update(oid) {
      if(this.oid == oid) {
        let obj = _.cloneDeep(this.BetData.bet_obj);
        obj.match_update = false;
        this.match_update = obj.match_update;
        this.BetDataCtr.bet_obj_add_attr(obj);
      }      
    },
    /**
     * @description:更新主客队以及联赛名称(语言变化时调用)
     *  @param {undefined} undefined
     * @return {undefined} undefined
     */
    update_home_away() {
       // 获取赛季名称 
      this.season = BetCommonHelper.get_season();
      // 获取玩法名称
      this.play_name = BetCommonHelper.get_play_name();
      // 获取队伍名称
      this.team_name = BetCommonHelper.get_team_name();
      let bs = _.get(this.BetData.bet_obj,`${this.id}.bs`);
      let cs = _.get(this.BetData.bet_obj,`${this.id}.cs`);
      // bs如果是个对象
      if(_.isPlainObject(bs)) {
        // 获取联赛名称
        this.league_name = bs.tn;
      }
      // cs如果是个普通对象
      if(_.isPlainObject(cs)) {
        // 投注项oid
        this.oid = cs.oid;
        // 赛事是否需要更新
        this.match_update = cs.match_update;
        // 球种id
        this.sport_id = cs.sport_id;
        // 主队名称
        this.home = cs.home;
        // 客队名称
        this.away = cs.away;
      }
    }
  }
}