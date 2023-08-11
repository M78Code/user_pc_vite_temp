/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 单关投注信息组件 minxin
 */
import { mapGetters, mapActions } from "vuex";
import odds_conversion from "src/public/mixins/odds_conversion/compute_max_win_money";
import betting from "src/public/mixins/betting/betting2.js";
import BetKeyboard from "src/public/components/bet/bet_keyboard.vue";
import play_mapping from "src/public/config/mapping/play_mapping.js";
import time_format from "src/public/mixins/common/time_format";
export default {
  name: "bet-single-info",
  mixins: [odds_conversion, betting, time_format],
  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
      oid: "",//投注项id
      money: null,
      win_money: "", // 可赢额
      min_money: "", // 最小金额
      max_money: "", // 最大金额
      is_change_odds: false, // 是否切换赔率
      odds_change_up: false, // 赔率上升
      odds_change_down: false, // 赔率下降
      is_valid_money: false,
      handicap_change: false, // 盘口变化
      odds_status_change: false,// 投注状态改变
      mouseover_info: false, //是否悬浮显示tips
      keyboard_data: [ //键盘数据
        {
          text: "100",
          value: 100,
          cur_btn: false,
          disabled: false
        },
        {
          text: "500",
          value: 500,
          cur_btn: false,
          disabled: false
        },
        {
          text: "1,000",
          value: 1000,
          cur_btn: false,
          disabled: false
        },
        {
          text: "2,000",
          value: 2000,
          cur_btn: false,
          disabled: false
        },
        {
          text: "5,000",
          value: 5000,
          cur_btn: false,
          disabled: false
        },
        {
          text: "MAX",
          cur_btn: false,
          disabled: false
        }
      ],
      timer_: undefined, //计时器
      sport_id: '',// 球种id
      play_id: '',//玩法id
      play_name: '',//玩家名
      season: '',// 赛季
      no: '',
      batch_no: '', //批次
      team_name: '',//队名
      play_mapping: {},//玩法集
      remote_time: 0,
      mgt: 0,
      match_update: false,
      value_range:{ //最小值
        min: 0
      },
      input_max: null,//输入最大值
      old_hv: null,//老的盘口值
      new_hv: null,//新的盘口值
      setup_single_info: {},//单关配置信息
      timer_obj: {},//计时器对象
      home: '',//主队
      away: ''//客队
    };
  },
  props: {
    view_ctr_obj: { //数据源
      type: Object,
      default: {}
    },
    index: { //第几个
      type: Number,
      default: -1
    },
    id: {
      type: String,
      default: "0"
    },
    common_amount: Number | String,
    is_common_amount: Boolean
  },
  components: {
    "bet-keyboard": BetKeyboard
  },
  created() {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
    clearTimeout(this.timer_obj[`timer_${this.id}`]);
    this.timer_obj[`timer_${this.id}`] = undefined;
    this.$root.$on(this.emit_cmd.EMIT_BET_SINGLE_CHECK_MONEY_CMD, this.check_money); //单关的校验金额
    this.$root.$on(this.emit_cmd.EMIT_BET_SINGLE_RESET_CMD, this.bet_single_reset); //重置单关红升绿降状态
    this.$root.$on(this.emit_cmd.EMIT_BET_SINGLE_MIN_MONEY, this.set_min_money); //设置单关最小金额
    this.$root.$on(this.emit_cmd.EMIT_INIT_BET_LIST_ITEM_CMD, this.init_bet_list_item); // 初始化联赛名称 赛季 玩法名称 队伍名称
    if(this.vx_get_virtual_bet_list.length==1) {
      this.setup_single_info = _.get(this.vx_get_user, 'cvo.single');
      if(!_.isEmpty(this.setup_single_info) && _.isObject(this.setup_single_info) && (!this.$route.params.video_size || this.$route.params.video_size!='1')) { // 非大视频
        this.keyboard_data = this.get_keyboard_data();
      } else if(this.$route.params.video_size=='1') {// 大视频
        this.keyboard_data = this.big_keyboard_data();
      }
      // 初始化投注项列表数据
      this.init_bet_list_item();
    }    
       
  },
  destroyed() {
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    this.timer_obj = {};
    this.keyboard_data = null;
    this.setup_single_info = {};
    this.value_range = {};
    this.$root.$off(this.emit_cmd.EMIT_BET_SINGLE_CHECK_MONEY_CMD, this.check_money);
    this.$root.$off(this.emit_cmd.EMIT_BET_SINGLE_RESET_CMD, this.bet_single_reset);
    this.$root.$off(this.emit_cmd.EMIT_BET_SINGLE_MIN_MONEY, this.set_min_money);
    this.$root.$off(this.emit_cmd.EMIT_INIT_BET_LIST_ITEM_CMD, this.init_bet_list_item);
  },
  computed: {
    ...mapGetters({
      vx_get_virtual_bet_list: "get_virtual_bet_list",//虚拟体育投注列表
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",//虚拟体育投注对象
      vx_get_user: "get_user", //用户信息
      vx_cur_menu_type: "get_cur_menu_type", //当前菜单类型 
      vx_get_cur_odd: "get_cur_odd", // 当前赔率
      vx_get_lang_change: "get_lang_change"  //国际话是不是改变
    }),
    /**
     * @description:电竞只能输入整数
     * @param {undefined} undefined
     * @returns {null} 
     */
    has_input_integer() {
      return this.menu_data.is_esports;
    },
    /**
     * @description: 盘口和赔率是否一起变化
     * @param {undefined} undefined
     * @return {String}
     */
    hv_ov_change() {
      return this.virtual_common.get_hv_ov_change(this);
    },
    /**
     * @description: 赔率值
     * @param {undefined} undefined
     * @return {String} 赔率值
     */
    odds_value() {
      return this.virtual_common.get_odds_value(this);
    },
    /**
     * @description: 盘口id
     * @param {undefined} undefined.
     * @return {String} 盘口id
     */
    handicap_id() {
      return this.virtual_common.get_handicap_id(this);
    },
    /**
     * @description: 盘口值
     * @param {undefined} undefined
     * @return {String} 盘口值
     */
    handicap() {
      return this.virtual_common.get_handicap(this);
    },
    /**
     * @description: 是否有盘口值
     * @param {undefined} undefined
     * @return {boolean} 
     */
    has_handicap_value() {
      let bet_obj = this.vx_get_virtual_bet_obj[this.id];
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
      return this.virtual_common.get_active(this);
    },
    /**
     * @description:是否显示主客队
     * @param {undefined} undefined
     * @returns {boolean} 
     */
    show_home_away() {
      return !this.menu_data.is_esports || !this.menu_data.is_esports_champion;
    },
   /**
     * @description: 当前盘口名称 欧洲盘/香港盘
     * @param {undefined} undefined
     * @return {String} 
     */
    handicap_name() {
      let cs = _.get(this.vx_get_virtual_bet_obj,`${this.id}.cs`);
      let odds_table = {
        EU: '1',
        HK: '2',
        MY: '3',
        GB: '4',
        US: '5',
        ID: '6'
      }
      if(cs && cs.odds_switch && cs.odds_switch.includes(odds_table[this.vx_get_cur_odd])) {
        return `[${this.$root.$t('odds')[this.vx_get_cur_odd]}]`;
      }
      return `[${this.$root.$t('odds')['EU']}]`;
    },      
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
     * @description: tips icon的id
     * @param {undefined} undefined
     * @return {String} 
     */
    icon_id() {
      let icon_id_ = '';
      if(this.id && this.id.includes(':')) {
        icon_id_ = this.id.replace(/:/g, '_');
      } else {
        icon_id_ = this.id;
      }
      return icon_id_;
    }
  },
  watch: {
    /**
     * @description: 监控赔率是否切换(欧洲盘是否切换成其他盘)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    vx_get_cur_odd() {
      this.is_change_odds = true;
    },
    /**
     * @description: 监控当前最高可赢额 
     * @param {new_} 当前最高可赢额
     * @return {undefined} undefined
     */
    win_money(new_) {
      this.set_virtual_bet_obj_value("win_money", new_);
      this.$root.$emit(this.emit_cmd.EMIT_BET_TOTAL_WIN_MONEY_CMD);
    },
    /**
     * @description: 监控当前赔率
     * @param {new_} 当前赔率
     * @param {old_} 上次的赔率
     * @return {undefined} undefined
     */
    odds_value(new_, old_) {
      if (!this.is_change_odds) { 
        this.view_ctr_obj.bet_data_change = true;
        // 赔率没有切换的时候发生变化，才处理     
        this.change_odds_value(new_, old_);
        if(!this.hv_ov_change){
          this.view_ctr_obj.error_code = "0402027"; 
          this.set_message();
        } 
        //console.log(`======bet_single_info========odds_value=========>${this.hv_ov_change}========error_code:${this.view_ctr_obj.error_code}`); 
        // 同步赛事列表,赛事详情中的数据(主要针对投注时,后台before接口拿到新数据后同步)
        this.get_max_win_money();   
        if(this.money==null) {
          this.view_ctr_obj.is_effect = false;
        } else {
          this.view_ctr_obj.is_effect = true;
        }
        this.$emit("get_button_text", true);         
      } 
    },
    /**
     * @description: 监控盘口id变化
     * @param {undefined} undefined
     * @return {null}
     */
    handicap_id() {
      // 发送C2订阅
      this.$root.$emit(this.emit_cmd.EMIT_SCMD_C2_CMD);
      // 获取最大最小值
      this.set_min_max_money();
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
      if(!isNaN(Number(new_)) && new_!=old_) {
        this.handicap_change = true;
        this.view_ctr_obj.bet_data_change = true;
        let count = this.virtual_common.get_deactive_count(this);  
        if(!this.hv_ov_change && count==0) {
          this.view_ctr_obj.error_code = "0402010";
          // 同步赛事列表,赛事详情中的数据(主要针对投注时,后台before接口拿到新数据后同步)        
        }
        this.set_message(count);       
        //console.log(`======bet_single_info========handicap=========>${this.hv_ov_change}========error_code:${this.view_ctr_obj.error_code}`); 
      }
    },
    /**
     * @description: 监听投注项状态
     * @param {String} new_ 最新的注项状态
     * @return {undefined} undefined
     */
    active: {
      handler(new_){
        if (new_ == 1 || new_ == 4) {      
          this.view_ctr_obj.is_effect = true;
          this.$emit("get_button_text", true);        
        } else {           
          this.view_ctr_obj.is_effect = false;
          this.$emit("get_button_text", false);
        }   
        //console.log('==================active=========================');
        // 从关盘到开盘移除提示 PS-10762
        if(new_==1) {      
          clearTimeout(this.timer_obj[`timer_${this.id}`]);
          this.virtual_common.init_message(this);
          this.odds_change_up = false;
          this.odds_change_down = false;
          this.handicap_change = false;
        } else {        
          if(new_ == 4) {
            this.view_ctr_obj.error_code = "M400004";
          }
          let count = this.virtual_common.get_deactive_count(this);
          this.set_message(count);
          this.odds_status_change = true;       
          this.view_ctr_obj.bet_data_change = true;
        }
        this.set_virtual_bet_obj_value("effect", this.view_ctr_obj.is_effect);
      },
      immediate:true
    },
    /**
     * @description: 监听盘口和赔率是否一起变化
     * @param {String} new_ 最新的变化标志
     * @return {undefined} undefined
     */
    hv_ov_change(new_) {
      if(new_) {
        this.view_ctr_obj.bet_data_change = true;
        this.handicap_change = true;
        let count = this.virtual_common.get_deactive_count(this);
        if(count==0) {
          this.view_ctr_obj.error_code = "0402028";         
        }
        this.set_message(count);
      }
    },
    /**
     * @description: 当前错误码
     * @param {String} new_ 错误码
     * @return {undefined} undefined
     */
    "view_ctr_obj.error_code"(new_) {
      if (new_ && new_.startsWith('M')) {
        this.odds_change_up = false; // 赔率上升
        this.odds_change_down = false; // 赔率下降
        this.handicap_change = false;
      }
    },
    /**
     * @description: 投注项
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    oid() {
      let is_empty_money_ = this.money==null;
      this.view_ctr_obj.is_empty_money = is_empty_money_;
    },
    /**
     * @description: 获取语言改变
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    vx_get_lang_change() {
      this.season = this.virtual_common.get_season(this);
      this.play_name = this.virtual_common.get_play_name(this);
      this.team_name = this.virtual_common.get_team_name(this);
      this.no = this.virtual_common.get_no(this);
      this.batch_no = this.virtual_common.get_batch_no(this);
    },
    /**
     * @description:最大可盈额
     * @param {*} new_  新值
     * @return {undefined}
     */
    max_money(new_){      
      let input = this.$refs[`input-${this.index+1}`];
      if(new_ && input && input.value) {
        this.set_virtual_bet_obj_value("max_money", parseFloat(input.value));
        input = null;
      }
    }
  },
  methods: {
    ...mapActions({
      vx_virtual_bet_obj_add: "virtual_bet_obj_add",  //虚拟投注添加对象
      vx_virtual_bet_obj_del: "virtual_bet_obj_del",  // 虚拟投注删除对象
      vx_set_is_virtual_handle: 'set_is_virtual_handle', //是不是虚拟体育投注处理中
      vx_set_virtual_error_info: 'set_virtual_error_info' // 设置虚拟投注错误信息
    }),
    /**
     * @description: 输入事件事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    keyup_handle(event) {
      this.reset_input_empty_message();
      this.view_ctr_obj.single_range_money = 0;
      this.set_virtual_bet_obj_value("full_bet", 0);
      let value = event.target.value; 
      if(value && value.startsWith('-')) {
        event.target.value = '';
        return;
      }
      if(value && value.includes(",")) {
        value = parseFloat(value.replace(/,/g,''));
      }
      this.money = parseFloat(value);
      localStorage.setItem("common_amount", value);
      if(this.max_money=="") {
        this.view_ctr_obj.single_range_money = -3; // 最大最小值正在获取中
        this.yabo_common.check_result_msg(this, 'single');
      }
      if(this.min_money !="" && _.lte(this.money, parseFloat(this.min_money))) {
        this.$emit("get_button_text", true);        
      }    
      let user = this.vx_get_user;
      if(this.max_money!="" && 
        parseFloat(this.max_money) < parseFloat(user.balance) && 
        _.gte(this.money, parseFloat(this.max_money))) {
          // 电竞的只能输入整数，向下取整
          if(this.menu_data.is_esports) {
            this.money = Math.floor(this.max_money);
          } else {
            this.money = parseFloat(this.max_money);
          } 
          this.$emit("get_button_text", true);
          this.set_virtual_bet_obj_value("full_bet", 1);          
      } else if(_.gte(this.money, parseFloat(user.balance))){    
        // 电竞的只能输入整数，向下取整            
        if(this.menu_data.is_esports) {
          this.money = Math.floor(user.balance);
        } else {
          this.money = parseFloat(user.balance);
        }
        this.view_ctr_obj.single_range_money = 2;
        this.virtual_common.check_result_msg(this, 'single');
      }
      let cs_money = this.money || '';
      this.set_virtual_bet_obj_value("money", cs_money);
      if(this.view_ctr_obj.single_range_money != 2) {
        this.check_money(value);
      }
      if(!isNaN(this.money)) {
        this.update_keyboard_status();
      }
    },
    /**
     * @param {undefined} undefined
     * @description: 获取焦点清除输入金额
     * @return {undefined} undefined
     */	
     focus_handle() {
      if(this.is_common_amount && parseFloat(this.common_amount)>0) {
        this.money = parseFloat(this.common_amount);
      } else {
        this.money = null;
      }
      let input = this.$refs[`input-${this.id}`];
      if(input) {
        input.$el.focus();
        input = null;
      }
    },
    /**
     * @description: 初始化投注项列表数据
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    init_bet_list_item() {
      this.view_ctr_obj.input_max_flag = 1;
      this.set_min_max_money();
      this.view_ctr_obj.bet_order_status = 1;
      this.vx_set_is_virtual_handle(false);
      this.sport_id = this.virtual_common.get_sport_id(this);
      this.play_id = this.virtual_common.get_play_id(this);
      this.play_name = this.virtual_common.get_play_name(this);
      this.season = this.virtual_common.get_season(this);
      this.no = this.virtual_common.get_no(this);
      this.batch_no = this.virtual_common.get_batch_no(this);
      this.team_name = this.virtual_common.get_team_name(this);
      this.play_mapping = play_mapping;
      this.remote_time = this.mx_get_remote_time();
      this.mgt = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.mgt`);
      let type_name = _.get(this.vx_cur_menu_type,'type_name','');
      let cs = _.get(this.vx_get_virtual_bet_obj,`${this.id}.cs`);
      if(_.isPlainObject(cs)) {
        this.oid = cs.oid;
        this.home = cs.home;
        this.away = cs.away;
      } 
      if(type_name=='virtual_sport') {
        if (Number(this.mgt) < this.remote_time) {
          let mid = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.mid`); 
          // 投注栏 投注项失效
          this.virtual_common.update_bet_item_status(this, {
            mid,
            status: 1,
          }); 
        } else {
          this.start_time();
        }
      }
    },
    /**
     * @description: 获取最高可赢额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_max_win_money() {
      let bet_obj = this.vx_get_virtual_bet_obj && this.vx_get_virtual_bet_obj[this.id];
      if (bet_obj && bet_obj.bs) {
        let item = bet_obj.bs;
        let temp = this.compute_money_by_cur_odd_type(
          _.get(item, 'hps[0].hl[0].ol[0].ov') / 100000,
          _.get(item, 'hps[0].hl[0].ol[0].obv') / 100000,
          _.get(item, 'hps[0].hsw'),
          this.money,
          _.get(item, 'csid')
        );
        this.win_money = Number.isNaN(temp) ? 0.00 : temp;
        return this.win_money;
      }
      return 0.00;
    },
    /**
     * @description: 设置最大最小值金额
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    set_min_max_money() {
      if(this.money!==null) {            
        this.select_money();
      }
      let user = this.vx_get_user;
      let balance = parseFloat(user.balance) || 0.00;
      try {
        clearTimeout(this.timer_obj['min_max_timer'])
        this.timer_obj['min_max_timer'] = setTimeout(() => {
          this.bet_reset_money_msg();   
          //最小投注额   
          this.min_money = "10";
          //最大投注额 之前是2000 世界杯改为8888
          this.max_money = "8888";
          this.set_virtual_bet_obj_value("min_money", this.min_money);
          this.set_virtual_bet_obj_value("max_money", this.max_money);          
          if(balance > parseFloat(this.max_money)) {
            this.input_max = parseFloat(this.max_money);
          } else if(balance <= parseFloat(this.max_money)) {
            this.input_max = balance;
          }
          this.bet_reset_money_msg();
          this.update_keyboard_status();  
          this.$nextTick(()=>{
            if(this.money!==null) {  
              this.select_money();          
              if(_.isEmpty(this.view_ctr_obj.error_code)) {        
                this.check_money();
              }
            }
          });        
        }, 5 * 1000);      
        this.get_virtual_min_max_money([this.id], 1, (code, data) => {
          this.bet_reset_money_msg(); 
          if (code == 200 && data && Array.isArray(data)) {
            this.min_money = _.get(data, '0.minBet', '10');
            /* //单关最大和最小值
            if (data[0] && !isNaN(parseFloat(data[0].minBet))) {
              // 可以押注最小金额
              this.set_virtual_bet_obj_value("min_money", parseFloat(data[0].minBet));
              this.min_money = parseFloat(data[0].minBet);
            } */            
            if (data[0] && !isNaN(parseFloat(data[0].orderMaxPay))) {
              this.max_money = this.round_money(this.min_money,data[0].orderMaxPay);
              if(parseFloat(this.max_money)<parseFloat(this.min_money)) {
                this.max_money = data[0].orderMaxPay;
              }
              // 可以押注最小金额
              this.set_virtual_bet_obj_value("min_money", parseFloat(this.min_money));
              // 可以押注最大金额
              this.set_virtual_bet_obj_value("max_money", parseFloat(this.max_money)); 
              if(this.is_common_amount) {
                this.set_virtual_bet_obj_value("money", parseFloat(this.common_amount)); 
              }           
              if(parseFloat(this.max_money)==0) {
                this.view_ctr_obj.bet_order_status = 5;
                this.view_ctr_obj.error_code = "M400009";
                this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1; 
              }
            }            
          } else {
            this.min_money = '10';
            this.max_money = '2000';
            this.set_virtual_bet_obj_value("min_money", this.min_money);
            this.set_virtual_bet_obj_value("max_money", this.max_money); 
            //0400510：代理单场剩余额度不足 0400511：代理玩法剩余额度不足 0400512：用户玩法剩余额度不足
            /* if(['0400510','0400511','0400512'].includes(`${code}`)) {
              this.view_ctr_obj.error_code = code;
              this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${code}`).client_msg1;
            } */    
          }
          if(this.max_money && this.money > parseFloat(this.max_money)) {
            this.money = parseFloat(this.max_money);
          }
          if(this.max_money) {            
            if(balance > parseFloat(this.max_money)) {
              this.input_max = parseFloat(this.max_money);
            } else if(balance <= parseFloat(this.max_money)) {
              this.input_max = balance;
            }
          }
          this.bet_reset_money_msg();    
          this.update_keyboard_status();
          this.$nextTick(()=>{
            if(this.money!==null) {  
              this.select_money();          
              if(_.isEmpty(this.view_ctr_obj.error_code)) {        
                this.check_money();
              } else if (this.view_ctr_obj.error_code=='0400517') {
                this.view_ctr_obj.single_range_money=-4;
              }
            }
          });            
        });
      } catch (e) {
        console.error(e); 
        this.bet_reset_money_msg();   
        this.min_money = '10';
        this.max_money = '2000';
        this.set_virtual_bet_obj_value("min_money", this.min_money);
        this.set_virtual_bet_obj_value("max_money", this.max_money);
        if(balance > parseFloat(this.max_money)) {
          this.input_max = parseFloat(this.max_money);
        } else if(balance <= parseFloat(this.max_money)) {
          this.input_max = balance;
        }
        this.bet_reset_money_msg();
        this.update_keyboard_status();
        this.$nextTick(()=>{
          if(this.money!==null) {  
            //选中文本
            this.select_money();          
            if(_.isEmpty(this.view_ctr_obj.error_code)) {        
              this.check_money();
            } else if (this.view_ctr_obj.error_code=='0400517') {
              this.view_ctr_obj.single_range_money=-4;
            }
          }
        });
      }
    },
    /**
     * @description: 删除投注项
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    del_bet_item() {
      this.virtual_common.del_bet_item(this);
      clearTimeout(this.timer_obj[`timer_${this.id}`]);
      this.timer_obj[`timer_${this.id}`] = undefined;
      this.$root.$emit(this.emit_cmd.EMIT_SINGLE_CANCEL_HANDLE_CMD);
    },
    /**
     * @description: 键盘处理时间
     * @param {Object} data_ 按键对象
     * @return {undefined} undefined
     */
    keypress_handle(data_) {
      this.reset_input_empty_message();       
      let bet_obj = this.vx_get_virtual_bet_obj && this.vx_get_virtual_bet_obj[this.id];
      if (bet_obj && bet_obj.cs) {
        let money_ = _.get(bet_obj.cs, 'money');
        // 从键盘上获取值赋给组件
        if (money_ && this.max_money!="") {
          this.money = parseFloat(money_);
          let total_money = this.money + parseFloat(data_.number);
          if (total_money <= this.max_money) {
            this.money = Number(total_money);           
          }          
        } else {
          this.money = Number(data_.number);         
        }
        localStorage.setItem("common_amount", this.money);
        this.set_virtual_bet_obj_value("money", this.money);
        if(this.max_money!="" && _.gte(this.money, parseFloat(this.max_money))) {
          this.set_virtual_bet_obj_value("full_bet", 1);
        } else {
          this.set_virtual_bet_obj_value("full_bet", 0);
        }
        if(this.max_money=="") {
          this.view_ctr_obj.single_range_money = -3; // 最大最小值正在获取中
          this.virtual_common.check_result_msg(this, 'single');
        }
        this.update_keyboard_status();
        this.check_money(this.money);
      }
    },
    /**
     * @description:点击MAX按钮写入最大金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    input_max_money() {
      if(this.show_fail_alert() || this.view_ctr_obj.single_range_money==-3) {
        return;
      }
      this.bet_reset_money_msg();
      let user = this.vx_get_user;
      this.set_virtual_bet_obj_value("full_bet", 0);
      // 首先判断用户余额是不是比max_money多，多的话就是max_money
      // 比max_money少的话，就显示剩余金额
      if (user && user.balance>=0 && this.max_money > parseFloat(user.balance)) {       
        this.money = Number(user.balance);
      } else {
        this.money = Number(this.max_money);    
        this.set_virtual_bet_obj_value("full_bet", 1);   
      } 
      if(this.menu_data.is_esports) {
        this.money = Math.floor(this.money);
      }
      this.set_virtual_bet_obj_value("money", this.money);   
      localStorage.setItem("common_amount", this.money);
      this.view_ctr_obj.single_range_money = 0;
      this.update_keyboard_status();
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
        // 设置赔率下降的样式
        this.odds_change_up = false;
        this.odds_change_down = true;
      }   
    },
    /**
     * @description:设置投注项对象
     * @param {String} k 投注项的key值
     * @param {String} v 投注项key值对应的值
     * @return {undefined} undefined
     */
    set_virtual_bet_obj_value(k, v) {
      if (!this.vx_get_virtual_bet_list.includes(this.id)) {
        return;
      }
      let bet_obj = this.vx_get_virtual_bet_obj && this.vx_get_virtual_bet_obj[this.id];
      if (bet_obj) {
        let obj = _.cloneDeep(bet_obj);
        obj.key = this.id;
        obj.cs[k] = v;
        this.vx_virtual_bet_obj_add(obj);
      }
    },
    /**
     * @description:校验金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
     check_money(value) {
      try {
        if(this.view_ctr_obj.input_max_flag==1) {
          this.view_ctr_obj.single_range_money = -3; // 最大最小值正在获取中
          this.virtual_common.check_result_msg(this, 'single');   
          return;
        }
        let empty_count = 0;
        this.view_ctr_obj.error_code = "";
        this.vx_get_virtual_bet_list.forEach(item => {
          let cs = this.vx_get_virtual_bet_obj && this.vx_get_virtual_bet_obj[item] && this.vx_get_virtual_bet_obj[item].cs;
          if ((cs &&(cs.money===null || cs.money==='')) && this.money!==0) {        
            empty_count++;
          }
        });
        if (empty_count == this.vx_get_virtual_bet_list.length) {
          this.view_ctr_obj.single_range_money = -2;  
          this.view_ctr_obj.is_empty_money = true;        
        } else {
          let input_amount = null;
          if(value) {
            input_amount = value;
          } else {
            input_amount = this.money;
          }         
          let user = this.vx_get_user;
          if(parseFloat(user.balance)==0.00) {
          } else if(parseFloat(this.min_money)>this.money) {
            this.view_ctr_obj.single_range_money = -4;
          } else if(parseFloat(this.max_money)<input_amount) {
            this.view_ctr_obj.single_range_money = 1; // 输入金额超出最大限额时
          } else {
            this.view_ctr_obj.single_range_money = 0;
          }
          this.view_ctr_obj.is_empty_money = false;
        }
        this.virtual_common.check_result_msg(this, 'single');
        // 转换成最大金额
        if(this.view_ctr_obj.error_code == "M400011") {
          this.money = parseFloat(this.max_money);
          this.set_virtual_bet_obj_value("money", this.money);
        }
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * @description:清空投注金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_clear_handle() {
      this.money = null;
      this.set_virtual_bet_obj_value("money", this.money);
      this.view_ctr_obj.is_empty_money = true;
      this.max_btn_hide = false;
      this.update_keyboard_status();
    },
    /**
     * @description:设置提示信息
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_message(count=0) {
      clearTimeout(this.timer_obj[`timer_${this.id}`]);
      if(this.active!=2 && this.active!=3 && count==0) {   
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1;    
        let delay = this.error_mapping.ERROR_CODE_DELAY[this.view_ctr_obj.error_code];
        //console.log('==================delay=========================' + delay);
        if(delay) {
          this.timer_obj[`timer_${this.id}`] = setTimeout(() => {
            clearTimeout(this.timer_obj[`timer_${this.id}`]);
            this.virtual_common.reset_odds_handicap_change(this);
            this.virtual_common.init_message(this); 
            this.bet_single_reset();
          }, delay);
        }   
      } else if(this.active ==2 || this.active==3){
        this.timer_obj[`timer_${this.id}`] = undefined;
        if(!this.view_ctr_obj.error_code || this.view_ctr_obj.error_code=="0402027") {
          this.view_ctr_obj.error_code = "0402049";
        } else if(!this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(this.view_ctr_obj.error_code)) {
          this.view_ctr_obj.error_code = "0402022";
        } 
        this.view_ctr_obj.error_message = this.$root.$t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1;    
      }
      this.vx_set_virtual_error_info({
        error_code: this.view_ctr_obj.error_code,
        error_message: this.view_ctr_obj.error_message
      });      
    },
    /**
     * @description:重置单关组件标志
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_single_reset() {     
      this.odds_change_up = false;
      this.odds_change_down = false;
      this.handicap_change = false;
      this.odds_status_change = false;        
    },
    /**
     * @description: 重置获取金额后的标记以及消息提示信息
     * @param {*}
     * @return {*}
     */
    bet_reset_money_msg() {
      clearTimeout(this.timer_obj['min_max_timer']);
      this.view_ctr_obj.single_range_money = 0;
      this.view_ctr_obj.input_max_flag = 2;
      // 大于最大金额,小于最小金额,金额为空,最大最小值正在获取中的code码
      if(["M400011","M400010","M400005","M400012"].includes(this.view_ctr_obj.error_code)) {
        this.virtual_common.init_message(this);
      }
    },
    /**
     * @description: 获取编码序号
     * @param {*}
     * @return {*}
     */
    get_numbers() {
      return this.virtual_common.get_numbers(this);
    },
    /**
     * @description: 开始时间
     * @param {undefined} undefined
     * @return {undefined}
     */
    start_time() {
      clearTimeout(this.timer_obj['start_time']);      
      this.timer_obj['start_time'] = setTimeout(() => {
        this.remote_time+=1000;
        let second = (Number(this.mgt) - this.remote_time)/1000;
        if (second < 10) {
          let mid = _.get(this.vx_get_virtual_bet_obj,`${this.id}.bs.mid`); 
          // 投注栏 投注项失效
          this.virtual_common.update_bet_item_status(this, {
            mid,
            status: 1,
          });
          return;
        }      
        this.start_time();
      }, 1000);
    },
    /**
     * @description: 更新键盘数据
     * @param {number} 键盘新值
     * @return {undefined}
     */
    update_keyboard(value) {
      _.forEach(this.keyboard_data, item => {        
        if(item.value>value) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },
    /**
     * @description:设置最小金额
     * @param {undefined} undefined
     * @return {undefined}
     */
    set_min_money() {
      if(this.money!==null) {
        this.money = parseFloat(this.min_money);
        this.view_ctr_obj.single_range_money = -1;
        this.set_virtual_bet_obj_value("money", this.money);
        localStorage.setItem("common_amount", this.money);
        this.virtual_common.check_result_msg(this, 'single', this.money);
      }
    },
    /**
     * @description:更新键盘按键状态
     * @param {undefined} undefined
     * @return {undefined}
     */
    update_keyboard_status() {
      let user = this.vx_get_user;
      let init_money = parseFloat(user.balance) || 0.00;
      if(!_.isNull(this.money) && init_money!=0) {
        init_money = this.money > init_money? this.money : init_money;
      }
      if(this.max_money && init_money > parseFloat(this.max_money)) {            
        init_money = parseFloat(this.max_money); 
      }
      init_money = init_money - this.money;
      this.update_keyboard(init_money);    
    },
    /**
     * @description: 清除输入为空的提示
     * @param {*}
     * @return {*}
     */    
    reset_input_empty_message() {
      clearTimeout(this.timer_obj['empty_message']);
      this.timer_obj['empty_message']= setTimeout(() => {
        if(this.money!=null && this.view_ctr_obj.error_code=="M400005") {
          this.virtual_common.reset_message_info(this);
          this.view_ctr_obj.single_range_money = 0;
        }
      },0);
    },
    /**
     * @description: 选中文本
     * @param {*}
     * @return {*}
     */    
    select_money() {
      this.view_ctr_obj.is_empty_money = false;
      let input = this.$refs[`input-${this.id}`];
      if(input) {
        input.$el.select();
        input = null;
        this.set_virtual_bet_obj_value("money", this.money);
      }    
    },
    /**
     * @description:获取键盘数据
     * @param {undefined} undefined
     * @return {undefined}
     */
    get_keyboard_data() {
      let keyboard_data = [];
      let keys = ['qon','qtw','qth','qfo','qfi'];      
      _.forEach(keys, key => {
        let value = _.get(this.setup_single_info,`${key}`);
        let text = _.toString(value);
        text = text.replace(/\d+/, function(n){ // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function($1){
             return $1+",";
           });
        });
        keyboard_data.push({
          value,
          text,
          cur_btn: false,
          disabled: false
        }); 
      }); 
      keyboard_data.push({
        text: 'MAX',
        cur_btn: false,
        disabled: false
      });     
      return keyboard_data;
    },
    /**
     * @description: 取整
     * @param{String} min_money 最低限额(整数)
     * @param{String} max_money 最高小值(非整数)
     * @return{String}
     */
    round_money(min_money, max_money) {
      let min_interal='', max_integral = '', min_len = 0, max_len = 0; //max_integral:最大金额整数部分 min_len:最小值的长度，max_len:最大值的长度
      if(!_.isEmpty(min_money) && !_.isEmpty(max_money)) {   
        min_interal = min_money.split('.')[0]   
        min_len= min_interal.length; // 最小值整数部分长度
        max_integral = max_money.split('.')[0]; // 最大值整数部分的长度
        max_len = max_integral.length;
      }
      // 最低投注金额数值为四位及以上
      if(min_len>=4) {
        min_len = 4;
      }
      // 最高限额整数位和最低限额整数位数相同时, 取整为减少一位
      if(max_len==min_len) {
        min_len = min_len - 1;
      }
      max_integral = max_integral.substr(0, max_len - min_len);
      max_money = _.padEnd(max_integral,(max_integral.length + min_len),'0');    
      return max_money;
    },
    /**
     * @description:大视频处的键盘数据
     * @param {undefined} undefined
     * @returns {Array} 键盘数据
     */
     big_keyboard_data() {
      return [
        {
          text: "5",
          value: 5,
          disabled: false
        },
        {
          text: "10",
          value: 10,
          disabled: false
        },
        {
          text: "20",
          value: 20,
          disabled: false
        },
        {
          text: "25",
          value: 25,
          disabled: false
        },
        {
          text: "50",
          value: 50,
          disabled: false
        },
        {
          text: "100",
          value: 100,
          disabled: false
        },
        {
          text: "200",
          value: 200,
          disabled: false
        },
        {
          text: "500",
          value: 500,
          disabled: false
        },
        {
          text: "1000",
          value: 1000,
          disabled: false
        },
        {
          text: "MAX",
          disabled: false
        }
      ]
    }
  },
  mounted() {
    //获取焦点清除输入金额
    this.focus_handle();
    //用户信息
    let user = this.vx_get_user;
    //最大数小于自己的钱数，取最大值
    if(this.max_money && this.money > parseFloat(this.max_money)) {
      this.money = parseFloat(this.max_money);
    }
    let balance = parseFloat(user.balance) || 0.00;
    if(this.money > balance && balance>0) {
      this.money = balance;
    }
    if(this.max_money) {
      if(balance > parseFloat(this.max_money)) {
        this.input_max = parseFloat(this.max_money);
      } else if(balance <= parseFloat(this.max_money)) {
        this.input_max = balance;
      }
    }
    this.value_range.max = this.input_max;
    this.update_keyboard_status();
    if(this.is_common_amount) {
      this.$nextTick(()=>{
        if(this.money) {  
          this.select_money();          
          this.check_money();
        }
      });
    }
  }
}