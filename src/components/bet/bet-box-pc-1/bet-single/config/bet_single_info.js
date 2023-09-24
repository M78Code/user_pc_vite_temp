 

// import odds_conversion from "src/public/mixins/odds_conversion/compute_max_win_money";
// import betting from "src/public/mixins/betting/betting.js";
// import BetKeyboard from "src/public/components/bet/bet_keyboard.vue";
import { BASKETBALL_BY_APPOINTMENT_let,BASKETBALL_BY_APPOINTMENT_total,MARKET_AWAY_PLAY_LIST,FOOTBALL_PLAY_LET_BALL,MARKET_BIG_SMALL_PLAY_LIST,MARKET_HOME_PLAY_LIST } from "src/core/constant/config/play-mapping.js";

// import * as bet_utils from "src/public/mixins/bet/bet_utils.js";
import { format_str } from "src/core/format/index.js";
import { UserCtr } from "src/core/index.js";

export default {
  name: "bet-single-info",
  // mixins: [odds_conversion, betting],
  data() {
    return {
      sport_id: '', // 球种id
      oid: "",   // 投注项id
      source: "", // 投注项来源
      money: null,  //钱
      is_change_odds: false, // 是否切换赔率
      odds_change_up: false, // 赔率上升
      odds_change_down: false, // 赔率下降
      handicap_change: false,   // 盘口变化
      odds_status_change: false, // 投注状态改变
      mouseover_info: false,//是否悬浮显示tips
      keyboard_data: [//键盘数据
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
      input_max_flag: 0, //输入最大值
      play_id: '', //玩法id
      season: '', // 赛季
      team_name: '',//队名
      play_name: '',//玩家名

      match_update: false, //赛事更新
      value_range: { //最小值
        min: 0
      },
      input_max: null, //输入最大值
      is_clear_input: true,//清空输入项
      old_hv: null, //老的盘口值
      new_hv: null,//新的盘口值
      setup_single_info: {}, //单关配置信息


      appoint: false, // 是否开启预约投注
      appoint_odds_value: null, // 预约赔率
      appoint_ball_head: null, // 预约球头
      init_ball_head: null, // 初始化时的球头
      init_odds_value: null, // 初始化时的赔率
      min_odds_value: null, //最小赔率
      pre_min_odds_value: null, //预约最小赔率


      timer_obj: {},//计时器对象
      home: '',//主队
      away: '',//客队
      league_name: '',// 联赛名称
      ball_score: -1, // 球分

      is_show_tip: false,  //显示提示
      show_tip_times:0,  // 显示提示次数
      first_click:1,  //第一次点击

      min_head_value: 0, //最下盘口值
      max_head_value: 0, //最大盘口值
      marketConfigValue:0, //预约投注系统开关value值 0关1开
      bookBet:0, // 预约投注开关
      bookMarketSwitch:0, //足球预约盘口开关
      bookMarketSwitchBasketball:0 //篮球预约盘口开关
    };
  },
  props: {
  
    index: { //第几个
      type: Number,
      default: -1
    },
    id: {   //赛事id
      type: String,
      default: "0"
    },
    common_amount: Number | String,
    is_common_amount: Boolean,
    user_bet_prefer: Boolean
  },
  components: {
    "bet-keyboard": BetKeyboard
  },
  created() {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.BUILDIN_CONFIG.LOCAL_FUNCTION_SWITCH.DOM_ID_SHOW;
 //生成事件监听
this.handle_generat_emitters()

    this.setup_single_info = _.get(this.BetData.user, 'cvo.single'); // 获取用户单关配置信息
    if(!_.isEmpty(this.setup_single_info) && _.isObject(this.setup_single_info) && (!this.$route.params.video_size || this.$route.params.video_size != '1')) { // 非大视频
      this.keyboard_data = this.get_keyboard_data();
    } else if(this.$route.params.video_size == '1') { // 大视频
      this.keyboard_data = this.big_keyboard_data();
    }
    //id映射
    //玩法id
    this.play_id = BetCommonHelper.get_play_id();
    console.log('this.play_id===', this.play_id);
    // console.log('this.appoint===', this.appoint);
    // console.log('this.team_name===', this.team_name);
    // console.log('this.handicap===', this.handicap);
    // 初始化投注项列表数据
    this.init_bet_list_item();
    // console.log('basic_score===', this.basic_score);
    // console.log('timerly_basic_score===', this.timerly_basic_score);
    // console.log('appoint_ball_head===', this.appoint_ball_head);
    //先读取显示次数
    if(localStorage.getItem('show_tip_times')) {
      this.show_tip_times = localStorage.getItem('show_tip_times')*1;
    }
    //先读取点击状态
    if(localStorage.getItem('first_click')){
      this.first_click = localStorage.getItem('first_click')*1;
    }
    //初始化最大最小球头和赔率值（篮球）
    if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)){
      //让球玩法预约时最大球头99.5， 最小球头-99.5
      this.min_head_value = -99.5;
      this.max_head_value = 99.5;
    }
    if(BASKETBALL_BY_APPOINTMENT_total.includes(this.play_id)) {
      //大小玩法预约时最大球头400， 最小球头-0.5
      this.min_head_value = 50.5;
      this.max_head_value = 400.5;
    }
    // this.img_mouseleave = this.debounce(this.img_mouseleave, 500);
    // this.img_mouseenter = this.debounce(this.img_mouseenter, 500);
    //初始化后台开关权重按顺序排列
    this.marketConfigValue = _.get(this.BetData.user, 'configVO.marketConfigValue', 0);
    this.bookBet = _.get(this.BetData.user, 'configVO.bookBet', 0);
    this.bookMarketSwitch = _.get(this.BetData.user, 'configVO.bookMarketSwitch', 0);
    this.bookMarketSwitchBasketball = _.get(this.BetData.user, 'configVO.bookMarketSwitchBasketball', 0);
  },
  beforeUnmount() {
    //清除计时器对象
    for (const key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
    this.timer_obj = {};
    //键盘数据清除
    this.keyboard_data = null;
    this.setup_single_info = {};
    this.value_range = {};
  //移除相应监听事件 //视图销毁钩子函数内执行
 if(this.emitters_off){this.emitters_off()}  
     //取消防抖和节流
    //  this.debounce_throttle_cancel(this.img_mouseleave);
    //  this.debounce_throttle_cancel(this.img_mouseenter);
  },
  computed: {
   

    /**
     * @Description 根据开关来判断是不是开启
     * @param {undefined} undefined
     * @return {boolean} 
     */
    get_open_value() {
      //第一层开关
      if(this.marketConfigValue == 0) {
        return false;
      }
      //第二层开关
      if(this.marketConfigValue == 1 && this.bookBet == 0) {
        return false;
      }
      //第三层开关
      //足球
      if(1 == this.sport_id){
        if(this.marketConfigValue == 1 && this.bookBet == 1 && this.bookMarketSwitch == 0) {
          return false;
        }
      }
      //篮球
      if(2 == this.sport_id) {
        if(this.marketConfigValue == 1 && this.bookBet == 1 && (!this.bookMarketSwitchBasketball)) {
          return false;
        }
      }
      return true; 
    },
    /**
     * @Description 球头加样式
     * @param {undefined} undefined
     * @returns {boolen}
     */
    head_add_style() {
      let sty = false;
      if('1' == this.sport_id) {
        if(FOOTBALL_PLAY_LET_BALL.includes(this.play_id) ) {
          if(this.appoint_ball_head >= 10){
            sty = true;
          }
        }else{
          if(this.appoint_ball_head >= 30){
            sty = true;
          }
        }
      }else if('2' == this.sport_id) {
        if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)) {//让球
           if(this.appoint_ball_head >= 99.5) {
              sty = true;
           }
        }else if(BASKETBALL_BY_APPOINTMENT_total.includes(this.play_id)) {//大小
          if(this.appoint_ball_head >= 400.5) {
            sty = true;
         }
        }
      }
      return sty;
    },
    /**
     * @Description 球头减样式
     * @param {undefined} undefined
     * @returns {boolen}
     */
    head_sub_style() {
      let sty = false;
      if('1' == this.sport_id) {
        if(FOOTBALL_PLAY_LET_BALL.includes(this.play_id) ) {
          if(this.appoint_ball_head<=-10){
            sty = true;
          }
        }else{
          // sty = (!FOOTBALL_PLAY_LET_BALL.includes(this.play_id) && this.appoint_ball_head<=0) ||
          if((MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id) || 
          MARKET_HOME_PLAY_LIST.includes(this.play_id) || 
          MARKET_AWAY_PLAY_LIST.includes(this.play_id)) && 
          this.appoint_ball_head <= this.ball_score) {
            sty = true;
          }else if( this.appoint_ball_head<=0) {
            sty = true;
          }
        }
      }else if('2' == this.sport_id) {
        if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)) {//让球
            if(this.appoint_ball_head <= -99.5) {
              sty = true;
            }
        }else if(BASKETBALL_BY_APPOINTMENT_total.includes(this.play_id)) {//大小
          if(this.appoint_ball_head <= 50.5) {
            sty = true;
          }
        }
      }
      return sty;
    },
    /**
     * @description: 赛事类型 match_type: 3 冠军赛
     * @param {undefined} undefined
     * @returns {string} 赛事类型
     */
    match_type() {
      // 默认为普通赛
      return _.get(this.BetData.bet_single_obj, `${this.id}.cs.match_type`);
    },
    /**
     * @description: 赛事状态 0未开赛 滚球:进行中
     * @param {undefined} undefined
     * @returns {string} 赛事类型
     */
    market_type() {
      let match_type = _.get(this.BetData.bet_single_obj, `${this.id}.cs.match_type`);
      if(match_type!=3) {
        return _.get(this.BetData.bet_single_obj, `${this.id}.cs.market_type`);
      }
      return '';
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
      return BetCommonHelper.get_score_info();
    },
    /**
     * @description:计时比分
     * @param {undefined} undefined
     * @return {String} 返回比分格式为: (主队得分-客队得分)
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
      return BetCommonHelper.get_odds_value();
    },
    /**
     * @description: 盘口id
     * @param {undefined} undefined
     * @return {String}
     */
    handicap_id() {
      return BetCommonHelper.get_handicap_id();
    },
    /**
     * @description: 盘口值
     * @param {undefined} undefined
     * @return {String} 盘口值
     */
    handicap() {
      return BetCommonHelper.get_handicap();
    },
    /**
     * @description: 是否有盘口值
     * @param {undefined} undefined
     * @return {boolean}
     */
    has_handicap_value() {
      let bet_obj = this.BetData.bet_single_obj[this.id];
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
     * @description: 当前盘口名称 欧洲盘/香港盘
     * @param {undefined} undefined
     * @return {String}
     */
    handicap_name() {
      let cs = _.get(this.BetData.bet_single_obj,`${this.id}.cs`);
      let odds_table = {
        EU: '1',//欧盘
        HK: '2',//香港盘
        MY: '3',
        GB: '4',
        US: '5',//美盘
        ID: '6'
      }
      let _odd = ''
      //聊天室跟单特殊处理
      if(this.source == 'is_chat_room'){
        _odd = this.BetData.chat_room_type;
        BetDataCtr.set_cur_odd(_odd);
        return `[${i18n_t('odds')[_odd]}]`;
      }
      // 根据odds_switch字段显示对应的盘口名称
      if(cs && cs.odds_switch && cs.odds_switch.includes(odds_table[this.BetData.cur_odd])) {
        return `[${i18n_t('odds')[this.BetData.cur_odd]}]`;
      }
      // 默认显示欧洲盘
      return `[${i18n_t('odds')['EU']}]`
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
     * @return {string}
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
     * @description: 最小值
     * @param {undefined} undefined
     * @return {String}
     */
    min_money() {
      let min_money =  _.get(this.BetData.bet_single_obj,`${this.id}.cs.min_money`, '');
      return `${min_money}`
    },
    /**
     * @description: 最大值
     * @param {undefined} undefined
     * @return {String}
     */
    max_money() {
      let max_money =  _.get(this.BetData.bet_single_obj,`${this.id}.cs.max_money`, '');
      return `${max_money}`;
    },
    /**
     * @description:赛事时间
     * @param {undefined} undefined
     * @return {String}
     */
    match_time() {
      let obj_bs = _.get(this.BetData.bet_single_obj,`${this.id}.bs`);
      if(_.isPlainObject(obj_bs)) {

        // 赛事时间显示日期，月份，天，小时，分钟
        let date, month, day, hour, minute;
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
        // 中文简体，繁体显示的格式
        if(['zh','tw'].includes(this.lang)) {
          return `${month}月${day}日 ${hour}:${minute}`;
        } else {
          // 其他余元显示的格式
          return `${month}/${day} ${hour}:${minute}`; 
        }
      }            
      return '';
    },
    /**
     * @description:计算球头 预约投注初始展示为0/0.5，每次调整为0.25.
     * @param {undefined} undefined
     * @returns {undefined}
     */
    computed_appoint_ball_head:{ 
      get:function(){
        let ball_head = '';
        if(this.sport_id == 1){
          if(!_.isNull(this.appoint_ball_head)) {
            if(this.appoint_ball_head % 0.5 == 0) {
              ball_head = this.appoint_ball_head;
            } else {
              let unit = (this.appoint_ball_head * 2 - 0.5)/2;
              //FOOTBALL_PLAY_LET_BALL
              if(this.appoint_ball_head>0) {
                ball_head =  `${unit}/${Math.abs(unit + 0.5)}`;
              } else if(unit<0 && (unit+0.5) >= 0){
                ball_head =  `-${unit+0.5}/${Math.abs(unit)}`;
              } else {
                ball_head =  `${unit+0.5}/${Math.abs(unit)}`;
              }
            }
          }
          //显示球头值得玩法 中的所有让球玩法 且不是-号开头 且不等于0
          if(MARKET_RANG_FLAG_LIST.includes(this.play_id) && !_.startsWith(ball_head,'-') && ball_head != 0) {
            ball_head = '+' + ball_head
          }
        }else if(this.sport_id == 2){
          if(!_.isNull(this.appoint_ball_head)) {
            //这里判断
                // if(this.appoint_ball_head < this.min_head_value){
                //   this.appoint_ball_head = this.min_head_value;
                // }else
                // if(this.appoint_ball_head > this.max_head_value){
                //   this.appoint_ball_head = this.max_head_value;
                // }
            ball_head = this.appoint_ball_head;
          }
          if(!(this.$refs['ball-head-input'] && this.$refs['ball-head-input'] == document.activeElement)){
            if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id) && !_.startsWith(ball_head,'-') && !_.startsWith(ball_head,'+') && ball_head != 0) {
              ball_head = '+' + ball_head
            }
          }
        }
        return ball_head;
      },
      set: function(new_){
        this.appoint_ball_head = new_
      }
    },
     /**
     * @description:最高可盈额
     * @param {undefined} undefined
     * @returns {number} 
     */
    win_money() {
      let bet_obj = this.BetData.bet_single_obj && this.BetData.bet_single_obj[this.id];
      let temp = 0.00;
      if (this.money && bet_obj && bet_obj.bs) {
        let item = bet_obj.bs;        
        if(this.appoint_odds_value==null) {
          // 通过输入金额计算最高限额
          temp = this.compute_money_by_cur_odd_type(
            this.$mathjs.divide(_.get(item, 'hps[0].hl[0].ol[0].ov'), 100000),
            this.$mathjs.divide(_.get(item, 'hps[0].hl[0].ol[0].obv'), 100000),
            _.get(item, 'hps[0].hsw'),
            this.money
          );
        } else {
          let hsw = _.get(item, 'hps[0].hsw'); 
          let marketTypeFinally = "EU";
          //赔率
          if (hsw && hsw != '') {
            let support_odds = [];
           
            hsw = hsw.split(',');
            let hsw_len = hsw.length;
            for (let i = 0; i < hsw_len; i++) {
              for (let [key, value] of Object.entries(this.oddsTable)) {
                if (value == hsw[i]) {
                  support_odds.push(key);
                }
              }
            }
            if (support_odds.includes(_.get('BetData.cur_odd'))) {
              //最终盘口类型
              marketTypeFinally = _.get('BetData.cur_odd');
            } else {
              //最终盘口类型
              marketTypeFinally = "EU";
            }
          } else {
            //最终盘口类型
            marketTypeFinally = _.get('BetData.cur_odd');
          }


          let new_cur_odd = this.cur_odd == 'EU' ? this.appoint_odds_value : (marketTypeFinally == 'EU' ? this.appoint_odds_value:this.appoint_odds_value + 1);
          // 通过输入金额计算最高限额
          temp = this.compute_money_by_cur_odd_type(
            new_cur_odd,
            new_cur_odd,
            _.get(item, 'hps[0].hsw'),
            this.money
          );
        }
        temp = Number.isNaN(temp) ? 0.00 : temp;
      }
      return bet_utils.four_five_six_double(temp,2)
    },
    /**
     * @description:是否支持预约 0 关闭 1 支持
     * @param {undefined} undefined
     * @returns {number}
     */
    pending_order_status() {
      let bet_obj = this.BetData.bet_single_obj[this.id];
      if(bet_obj) {
        return _.get(bet_obj, 'cs.pending_order_status')
      }
      return 0;
    },
  },
  watch: {
    /**
     * @description: 监听球头变化
     * @param {Object} new_ 
     * @returns {undefined} undefined
     */
    'BetData.bet_appoint_obj'(new_) {
      if(_.isNull(new_)) return;
      this.appoint_odds_value = new_.appoint_odds_value
    },
    /**
     * @description: 监控赔率是否切换(欧洲盘是否切换成其他盘)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
   'BetData.cur_odd'() {
      this.is_change_odds = true;
      this.cancel_operate();
    },
    /**
     * @description: 监控当前最高可赢额
     * @param {new_} 当前最高可赢额
     * @return {undefined} undefined
     */
    win_money(new_) {
      if(new_) {
        this.set_bet_obj_value("win_money", Number(new_));
        useMittEmit(MITT_TYPES.EMIT_BET_TOTAL_WIN_MONEY_CMD);
      }
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
        // console.log(`============odds_value=====oid:${this.oid}=========id:${this.id}`);
        // 赔率没有切换的时候发生变化，才处理
        this.change_odds_value(new_, old_);
        let count = BetCommonHelper.get_deactive_count();
        // console.log(`===========odds_value==============count:${count}`);  
        if(count == 0 && this.view_ctr_obj.error_code != '0400532') {
          this.view_ctr_obj.error_code = "0402027";
        }
        this.set_message(count);
        // console.log(`======bet_single_info========odds_value=========>${this.hv_ov_change}========error_code:${this.view_ctr_obj.error_code}`);
        // 同步赛事列表,赛事详情中的数据(主要针对投注时,后台before接口拿到新数据后同步)
        if(this.money == null) {
          this.view_ctr_obj.is_effect = false;
        } else {
          this.view_ctr_obj.is_effect = true;
        }
        this.$emit("get_button_text", true);

      }
      // 如果预约赔率以及预约初始化的赔率小于当前赔率，那么更新预约赔率以及预约初始化赔率
      // if(this.appoint_odds_value) {
       
        // this.init_odds_value = Number(new_);
        // this.appoint_odds_value = Number(new_);
        // this.search_odds_value_by_ball_head()
       
      // }
    },
    /**
     * @description: 监控盘口id变化
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    handicap_id() {
      // 发送C2订阅
      useMittEmit(MITT_TYPES.EMIT_SCMD_C2_CMD);
      // 获取最大最小值
      useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
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
      if(!isNaN(Number(new_)) && new_ != old_) {
        this.handicap_change = true;
        this.view_ctr_obj.bet_data_change = true;
        let count = BetCommonHelper.get_deactive_count();
        // console.log(`===========handicap==============count:${count}`);
        // console.log(`============handicap=====oid:${this.oid}=========id:${this.id}`);
        if(count == 0) {
          this.view_ctr_obj.error_code = "0402010";
        }
        // 同步赛事列表,赛事详情中的数据(主要针对投注时,后台before接口拿到新数据后同步)
        this.set_message(count);
        // console.log(`======bet_single_info========handicap=========>${this.hv_ov_change}========error_code:${this.view_ctr_obj.error_code}`);
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

        // console.log(`============active=====oid:${this.oid}=========id:${this.id}`);
        // 从关盘到开盘移除提示 PS-10762
        if(new_ == 1) {
          clearTimeout(this.timer_obj[`timer_${this.id}`]);
          BetCommonHelper.init_message();
          this.odds_change_up = false;
          this.odds_change_down = false;
          this.handicap_change = false;
        } else {
          if(new_ == 4) {
            this.view_ctr_obj.error_code = "M400004";
          }
          let count = BetCommonHelper.get_deactive_count();
          // console.log(`===========handicap==============count:${count}`);
          this.set_message(count);
          this.odds_status_change = true;
          this.view_ctr_obj.bet_data_change = true;
        }
        this.set_bet_obj_value("effect", this.view_ctr_obj.is_effect);
      },
      immediate:true
    },
    /**
     * @description: 监听盘口和赔率是否一起变化
     * @param {String} new_ 最新的变化标志
     * @return {undefined} undefined
     */
    hv_ov_change(new_) {
      // console.log(`==============hv_ov_change==============>>>new_:${new_}`);
      if(new_) {
        this.view_ctr_obj.bet_data_change = true;
        this.handicap_change = true;
        // 获取失效投注项数量
        let count = BetCommonHelper.get_deactive_count();
        // console.log(`============hv_ov_change==============count:${count}`);
        // console.log(`============hv_ov_change=====oid:${this.oid}=========id:${this.id}`);
        // 没有失效的投注项
        if(count==0) {
          // 盘口值变化的错误码设置
          this.view_ctr_obj.error_code = "0402028";
        }
        // 设置提示信息
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
        this.handicap_change = false; // 盘口变化
      }
    },
    /**
     * @Description :语言改变后需要更新赛季，玩法名称，队伍名称
     * @param {undefined} undefined
     * @return {undefined} 
     */
   "BetData.lang_change"() {
      this.season = BetCommonHelper.get_season();
      this.play_name = BetCommonHelper.get_play_name();
      this.team_name = BetCommonHelper.get_team_name();
    },
    /**
     * @Description :勾选合并是设置键盘按键的状态
     * @param {undefined} undefined
     * @return {undefined} 
     */
    "BetData.is_bet_merge": {
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
     * @Description :最大值变化时重新设置存储的金额
     * @param {*} new_ 
     * @return {undefined} 
     */
    max_money:{
      handler(new_) {
        let input = this.$refs[`input-${this.id}`];
        if(new_ && input && input.value) {
          this.set_bet_obj_value("money", parseFloat(input.value));
          input = null;
          this.check_money(this.money);
          this.$nextTick(() => {
            if(this.win_money) {
              this.set_bet_obj_value("win_money", this.win_money);
            }
          });
        }
      },     
      immediate: true
    },
     /**
     * @Description :计算预约球头
     * @param {*} new_ 
     * @return {undefined} 
     */
    computed_appoint_ball_head(new_) {
        let obj = _.cloneDeep(this.BetData.bet_appoint_obj);
        if(_.isNull(obj)) return;
        obj.computed_appoint_ball_head = new_; // 计算的球头(分数形式)
        obj.appoint_ball_head = this.appoint_ball_head; // 球头(小数形式)
        obj.is_head_eq_hadicap = this.appoint_ball_head == this.init_ball_head; // 球头和盘口值是否一样
         // 设置预约投注项
        BetDataCtr.set_bet_appoint_obj(obj);
        return obj;
    },
    appoint_ball_head(new_) {
      return;
      let obj = _.cloneDeep(this.BetData.bet_appoint_obj);
      if(_.isNull(obj)) return;
      obj.computed_appoint_ball_head = new_; // 计算的球头(分数形式)
      obj.appoint_ball_head = this.appoint_ball_head; // 球头(小数形式)
      obj.is_head_eq_hadicap = this.appoint_ball_head == this.init_ball_head; // 球头和盘口值是否一样
       // 设置预约投注项
      BetDataCtr.set_bet_appoint_obj(obj);
    },
    /**
     * @Description :计算预约赔率
     * @param {*} new_ 
     * @return {undefined} 
     */
    appoint_odds_value(new_) {
      //  赔率大于355给个提示
       if (this.appoint_odds_value>355) {
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_max_booked_odds')}`);
      }
      let obj = _.cloneDeep(this.BetData.bet_appoint_obj);
      if(obj) {
        obj.appoint_odds_value = new_;
          // 设置预约投注项
        BetDataCtr.set_bet_appoint_obj(obj);
      }
    },
    money(new_,old){
      // 监听当是合并项的时候给money赋值
      if (new_===null&& this.BetData.is_bet_merge) {
        this.money = this.BetData.bet_current_money_obj[this.id]||null
      }
    }
  },
  beforeDestroy () {
  //  将输入框金额保存在vuex 待切换成小框使用
    if (this.money&&this.BetData.bet_single_list.length>0) {
      this.set_bet_current_money_obj({id:this.id,value:this.money}) 
    }else{
      this.set_bet_current_money_obj({id:this.id,value:null}) 
    }
  },
  methods: {


        /**
* 生成事件监听  
*/
handle_generat_emitters(){
  let event_pairs=  [
    { type:MITT_TYPES.EMIT_BET_SINGLE_CHECK_MONEY_CMD, callback: this.check_money} ,    //单关的校验金额
    { type:MITT_TYPES.EMIT_BET_SINGLE_RESET_CMD, callback: this.bet_single_reset} ,//重置单关红升绿降状态
    { type:MITT_TYPES.EMIT_BET_SINGLE_MIN_MONEY, callback: this.set_min_money} ,//设置单关最小金额
    { type:MITT_TYPES.EMIT_SINGLE_UPDATE_KEYBOARD_STATUS_CMD, callback: this.update_keyboard_status} ,// 更新键盘状态
    { type:MITT_TYPES.EMIT_UPDATE_HOME_AWAY_CMD, callback: this.update_home_away} ,//更新主客队信息(主要用于国际化切换时调用} ,
    { type:MITT_TYPES.EMIT_BET_SET_MONEY, callback: this.set_money} , // 设置输入框
    { type:MITT_TYPES.EMIT_INIT_BET_LIST_ITEM_CMD, callback: this.init_bet_list_item} ,// 初始化联赛名称 赛季 玩法名称 队伍名称
    { type:MITT_TYPES.EMIT_CLOSE_BIG_VIDEO_BET, callback: this.del_bet_item} , //关闭大视频投注
    { type:MITT_TYPES.EMIT_NET_ERR, callback: this.net_err_fun} ,//无网络事件
  ]
  let  { emitters_off } =  useMittEmitterGenerator(event_pairs)
  this.emitters_off=emitters_off
    //移除相应监听事件 //视图销毁钩子函数内执行
    // if(this.emitters_off){this.emitters_off()}  
},
 

    /**
     * @description:网络错误时触发方法 用于最大最小值接口错误时 设置默认最大最小值
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    net_err_fun(){
      let obj = _.cloneDeep(_.get(this.BetData.bet_single_obj, `${this.id}`));
      if(!obj) return;
      obj.key = this.id;
      obj.cs.max_money = '8888';
      obj.cs.min_money = '10'
      BetDataCtr.bet_single_obj_attr(obj);
    },

    /**
     * @description:鼠标移出
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    img_mouseleave() {
      this.is_show_tip = false;
    },

    /**
     * @description:鼠标移入
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    img_mouseenter() {
      if(2 == this.first_click) return;
      this.show_tip_times++;
      localStorage.setItem('show_tip_times', this.show_tip_times)
      if(this.show_tip_times > 3) return;
      this.is_show_tip = true;
    },

    /**
     * @description:最小最大值
     * @param {*} bet_single_obj 
     * @param {*} data 
     */
    min_max_handle(bet_single_obj, data) {
      //最小投注额
      let min_money = "10";
      //最大投注额 之前是2000 世界杯改为8888
      let max_money = "8888";
      let len = this.BetData.bet_single_list.length;
      _.forEach(data, item =>{
        if(item.playOptionsId) {               
          let obj;
          if(bet_single_obj[item.playOptionsId]) {
            obj = bet_single_obj[item.playOptionsId];
          } else {
            for(let bet_obj of Object.values(bet_single_obj)) {
              let oid = _.get(bet_obj,'cs.oid');
              if(oid == item.playOptionsId) {
                obj = bet_obj;
                break;
              }
            }
          }
          if(obj) {
            min_money = _.get(item, 'minBet', '10');
            max_money = this.round_money(min_money,item.orderMaxPay);
            if(parseFloat(max_money) < parseFloat(min_money)) {
              max_money = item.orderMaxPay;
            }
            if(parseFloat(max_money) == 0) {
              this.view_ctr_obj.bet_order_status = 5;  //投注项失败
              this.view_ctr_obj.error_code = "M400009"; //"该选项当前不可投注，请选择其他选项"
              this.view_ctr_obj.error_message = i18n_t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1;
            }
            obj.cs.min_money = min_money;
            obj.cs.max_money = max_money;
            if(len == 1 && this.is_common_amount && parseFloat(this.common_amount) > 0) {
              obj.cs.money = parseFloat(this.common_amount);
            }
            if(max_money && obj.cs.money && obj.cs.money > parseFloat(max_money)) {
              obj.cs.money = parseFloat(max_money);
            }
            BetCommonHelper.set_bet_obj_value(obj);
          }                
        }
      });
      this.view_ctr_obj.input_max_flag = 2;
      useMittEmit(MITT_TYPES.EMIT_SINGLE_UPDATE_KEYBOARD_STATUS_CMD); //更新键盘状态
    },
    /**
     * @description:预约调用预约限额接口
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    init_pre(){
      this.query_pre_bet_amount((code, betAmountInfo) => {
        if(200 == code) {
          this.bet_reset_money_msg();
          if(code == 200 && betAmountInfo && betAmountInfo.length > 0) {       
            let bet_single_obj = _.cloneDeep(this.BetData.bet_single_obj);       
            this.min_max_handle(bet_single_obj, betAmountInfo);
          }
        }
      });
    },
    /**
     * @description: 输入事件事件
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    keyup_handle(event) {
      //按钮失效
      useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE, false)
      // 重置消息
      this.reset_input_empty_message();
      // 设置限额标识为默认
      this.view_ctr_obj.input_money_state = 0;
      // 是否满额为默认值(不满额)
      this.set_bet_obj_value("full_bet", 0);
      // 获取输入值
      let value = event.target.value;
      if(value && value.startsWith('-')) {
        event.target.value = '';
        return;
      }
      if(value && value.includes(",")) {
        value = parseFloat(value.replace(/,/g,''));
      }
      // 转换输入值
      this.money = parseFloat(value);
      // 存储输入的值
      localStorage.setItem("common_amount", value);
      if(this.max_money=="") {
        // 最大最小值正在获取中
        this.view_ctr_obj.input_money_state = -3;
        // 设置提示信息
        BetCommonHelper.check_result_msg( 'single');
      }
      if(this.min_money !="" && _.lte(this.money, parseFloat(this.min_money))) {
        // 设置按钮上的显示文字
        this.$emit("get_button_text", true);
      }
      let user = this.BetData.user;
      // 最高限额比用户余额小
      if(this.max_money!="" &&
        parseFloat(this.max_money) < parseFloat(user.balance) &&
        // 输入金额大于等于最大限额自动转换输入金额为最大限额
        _.gte(value, parseFloat(this.max_money))) {
          // 设置输入金额为最大限额值
          this.money = parseFloat(this.max_money);
          // 设置按钮上的显示文字
          this.$emit("get_button_text", true);
          // 设置为满额投注
          this.set_bet_obj_value("full_bet", 1);
      } else if(_.gte(value, parseFloat(user.balance))){ // 输入金额大约等于用户余额
        // 输入金额转换为用户余额
        this.money = parseFloat(user.balance);
        // 设置限额标识为超出用户余额
        this.view_ctr_obj.input_money_state = 2;
        // 设置提示信息
        BetCommonHelper.check_result_msg( 'single');
      }
      let cs_money = this.money || '';
      // 存储用户金额
      this.set_bet_obj_value("money", cs_money);
      // 限额标识为没有超出用户余额
      if(this.view_ctr_obj.input_money_state!=2) {
        // 校验用户金额
        this.check_money(value);
      }
      // 金额存在
      if(!isNaN(this.money)) {
        // 更新键盘状态
        this.update_keyboard_status();
      }
    },
    /**
     * @description: 获取焦点清除输入金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    focus_handle() {
      // 常用金额复选框选中并且常用金额大于0
      if(this.is_common_amount && parseFloat(this.common_amount)>0) {
        // 设置输入金额为常用金额
        this.money = parseFloat(this.common_amount);
      } else {
        //  this.money = null;
      }
      let input = this.$refs[`input-${this.id}`];
      if(input) {
        // 金额输入框获得焦点
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
      // 赛季
      this.season = BetCommonHelper.get_season();
      // 玩法名称
      this.play_name = BetCommonHelper.get_play_name();
      // 队伍名称
      this.team_name = BetCommonHelper.get_team_name();
      let bs = _.get(this.BetData.bet_single_obj,`${this.id}.bs`);
      let cs = _.get(this.BetData.bet_single_obj,`${this.id}.cs`);
      if(_.isPlainObject(bs)) {
        this.league_name = bs.tn;
      }
      // 如果是对象
      if(_.isPlainObject(cs)) {
        // 投注项id
        this.oid = cs.oid;
        // 投注项来源(来自列表还是详情)
        this.source = cs.source;
        // 球种类型
        this.sport_id = cs.sport_id;
        // 主队名称
        this.home = cs.home;
        // 客队名称
        this.away = cs.away;
      }
      // if(this.money) {
      //   this.win_money = this.get_max_win_money();
      // }
    },
    /**
     * @description: 获取最高可赢额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    get_max_win_money() {   
      let bet_obj = this.BetData.bet_single_obj && this.BetData.bet_single_obj[this.id];
      if (bet_obj && bet_obj.bs) {
        let item = bet_obj.bs;
        // 通过输入金额计算最高限额
        let temp = this.compute_money_by_cur_odd_type(
          _.get(item, 'hps[0].hl[0].ol[0].ov') / 100000,
          _.get(item, 'hps[0].hl[0].ol[0].obv') / 100000,
          _.get(item, 'hps[0].hsw'),
          this.money
        );
        return Number.isNaN(temp) ? 0.00 : temp;
      }
      return 0.00;
    },

    /**
     * @description: 删除投注项
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    del_bet_item() {
      BetCommonHelper.del_bet_item();
      // 如果删除的是当前预约的投注项，则回复预约投注项id为初始值
      if(this.BetData.bet_appoint_obj && this.BetData.bet_appoint_obj.bet_appoint_id==this.id) {
         // 置空预约投注项
        BetDataCtr.set_bet_appoint_obj(null);
      }
    },
    /**
     * @description: 键盘处理时间
     * @param {Object} data_ 按键对象
     * @return {undefined} undefined
     */
    keypress_handle(data_) {
      this.reset_input_empty_message();
      let bet_obj = this.BetData.bet_single_obj && this.BetData.bet_single_obj[this.id];
      if (bet_obj && bet_obj.cs) {
        let money_ = _.get(bet_obj.cs, 'money', null);
        let user = this.BetData.user;
        // 从键盘上获取值赋给组件
        if (money_ && this.max_money!="" && user.balance) {
          // 输入的金额 最高限额 用户金额存在
          this.money = parseFloat(money_);
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
        // 设置常用金额
        localStorage.setItem("common_amount", this.money);
         // 存储输入金额
        this.set_bet_obj_value("money", this.money); 
        if(this.max_money=="") {
          this.view_ctr_obj.input_money_state = -3; // 最大最小值正在获取中
          // 设置提示错误信息
          BetCommonHelper.check_result_msg( 'single');
        }
        // 更新键盘按键的状态
        this.update_keyboard_status();
        // 校验输入金额
        this.check_money(this.money);
      }
    },
    /**
     * @description:点击MAX按钮写入最大金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    input_max_money() {
      if(userCtr.show_fail_alert() || this.view_ctr_obj.input_money_state == -3) {
        return;
      }
      this.bet_reset_money_msg();
      let user = this.BetData.user;
      this.set_bet_obj_value("full_bet", 0);
      // 首先判断用户余额是不是比max_money多，多的话就是max_money
      // 比max_money少的话，就显示剩余金额
      if (user && user.balance>=0 && this.max_money > parseFloat(user.balance)) {
        // 转换输入金额为用户账户金额       
        this.money = Number(user.balance);
      } else {
        // 转换输入金额为最大限额
        this.money = Number(this.max_money);
        // 设置满额投注标识
        this.set_bet_obj_value("full_bet", 1);
      }
      // 存储输入金额
      this.set_bet_obj_value("money", this.money);
      // 设置常用金额  
      localStorage.setItem("common_amount", this.money);
      // 设置限额范围标识为正常默认值    
      this.view_ctr_obj.input_money_state = 0;
      // 更新键盘状态  
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
    set_bet_obj_value(k, v) {
      if (!this.BetData.bet_single_list.includes(this.id)) {
        return;
      }
      let bet_obj = this.BetData.bet_single_obj && this.BetData.bet_single_obj[this.id];
      if (bet_obj) {
        let obj = _.cloneDeep(bet_obj);
        obj.key = this.id;
        obj.cs[k] = v;
        obj.is_update_single = true; //更新金钱数量
        BetDataCtr.bet_single_obj_attr(obj);
      }
    },
    /**
     * @description:校验金额
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    check_money(value) {
      try {
        if(this.view_ctr_obj.input_max_flag == 1) {
          // 最大最小值正在获取中
          this.view_ctr_obj.input_money_state = -3;
          // 设置提示信息 
          BetCommonHelper.check_result_msg( 'single');
          return;
        }
        // 统计为输入金额的投注项个数
        let empty_count = 0;
        this.view_ctr_obj.error_code = "";
        this.BetData.bet_single_list.forEach(item => {
          let cs = this.BetData.bet_single_obj && this.BetData.bet_single_obj[item] && this.BetData.bet_single_obj[item].cs;
          // 存储的金额为空并且输入金额不为0
          if ((cs &&(cs.money === null || cs.money === '')) && this.money !== 0) {
            // 统计计入到位输入投注项金额中
            empty_count++;
          }
        });
        // 所有的投注项都没有输入金额时
        if (empty_count == this.BetData.bet_single_list.length) {
          // 设置限额标识为输入为空
          this.view_ctr_obj.input_money_state = -2;
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
          let user = this.BetData.user;
          // 用户余额为0
          if(parseFloat(user.balance) == 0.00) {
          } else if(parseFloat(this.min_money) > input_amount) { // 输入金额比最小金额还小
            this.view_ctr_obj.input_money_state = -4;
          } else if(parseFloat(this.max_money) < input_amount) { // 输入金额比最大限额还大
            // 设置单关限额标识为 大于最大金额
            this.view_ctr_obj.input_money_state = 1; 
          } else {
            // 设置为默认
            this.view_ctr_obj.input_money_state = 0;
          }
          // 金额是否为空标识为false
          this.view_ctr_obj.is_empty_money = false;
        }
        // 校验单关限额范围，不通过则提示
        BetCommonHelper.check_result_msg( 'single');
        // 转换成最大金额
        if(this.view_ctr_obj.error_code == "M400011") {
          this.money = parseFloat(this.max_money);
          this.set_bet_obj_value("money", this.money);
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
      // 金额重置
      this.money = null;
      // vuex中的金额重置
      this.set_bet_obj_value("money", this.money);
      // 金额是否为空标识设置为true
      this.view_ctr_obj.is_empty_money = true;
      // 更新键盘状态
      this.update_keyboard_status();     
    },
    /**
     * @description:设置提示信息
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    set_message(count=0) {
      clearTimeout(this.timer_obj[`timer_${this.id}`]);
      // 当投注项状态不为封盘和关盘并且没有无效投注项时
      if(this.active != 2 && this.active != 3 && count == 0) {
        // 设置提示信息
        this.view_ctr_obj.error_message = i18n_t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1;
        // 获取错误码需要显示的时长
        let delay = this.error_mapping.ERROR_CODE_DELAY[this.view_ctr_obj.error_code];
        //console.log('==================delay=========================' + delay);
        // 获取的到需要显示的时长
        if(delay) {
          // 在delay时间之后清除提示信息重置盘口信息
          this.timer_obj[`timer_${this.id}`] = setTimeout(() => {
            clearTimeout(this.timer_obj[`timer_${this.id}`]);
            // 复位盘口及赔率的变换标志
            BetCommonHelper.reset_odds_handicap_change();
            // 重置提示信息
            BetCommonHelper.init_message();
            this.bet_single_reset();
            // 投注失败，投注项为状态变化后恢复提示的同时移除投注失败字样
            if(this.view_ctr_obj.bet_fail_flag) {
              // 订单确认完成标识设置为0
              this.view_ctr_obj.order_confirm_complete = 0;
            }
          }, delay);
        }
      } else if(this.active == 2 || this.active == 3){ // 当投注项状态为封盘或者关盘时
        // 定时器对象存在时
        if(this.timer_obj[`timer_${this.id}`]) {
          // 清除定时器对象
          clearTimeout(this.timer_obj[`timer_${this.id}`]);
          // 重置定时器对象
          this.timer_obj[`timer_${this.id}`] = undefined;
        }
        // 错误码不存在或者为赔率变化的错误码
        if(!this.view_ctr_obj.error_code || this.view_ctr_obj.error_code=="0402027") {
          // 设置为投注项无效对应的错误码
          this.view_ctr_obj.error_code = "0402049";
        } else if(!this.error_mapping.ERROR_CODE_ODDS_CLOSE.includes(this.view_ctr_obj.error_code)) { // 错误码不是无效投注项对应的错误码
          // 设置为投注项无效对应的错误码2
          this.view_ctr_obj.error_code = "0402022";
        }
        // 设置错误提示信息
        this.view_ctr_obj.error_message = i18n_t(`error_msg_info.${this.view_ctr_obj.error_code}`).client_msg1;
        // 3s后重置赔率，盘口，投注项状态变化的标识
        this.timer_obj[`timer_${this.id}`] = setTimeout(() => {
          // 重重置单关组件标志
          this.bet_single_reset();
          // 投注失败，投注项为失效状态则3秒后移除投注失败的提示信息
          if(this.view_ctr_obj.bet_fail_flag) {
            this.view_ctr_obj.order_confirm_complete = 0;
          }
        }, 3 * 1000);
      }
    },
    /**
     * @description:重置单关组件标志
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    bet_single_reset() {
      // 赔率上升标识设置
      this.odds_change_up = false;
      // 赔率下降标识设置
      this.odds_change_down = false;
      // 盘口变化标识设置
      this.handicap_change = false;
      // 投注项状态变化标识设置
      this.odds_status_change = false;
    },
    /**
     * @description: 重置获取金额后的标记以及消息提示信息
     * @param {*}
     * @return {*}
     */
    bet_reset_money_msg() {
      // 清除定时器
      clearTimeout(this.timer_obj['min_max_timer']);
      // 限额标识设置为默认
      this.view_ctr_obj.input_money_state = 0;
      // 设置为最大最小值获取完成标识
      this.view_ctr_obj.input_max_flag = 2;
      // 大于最大金额,小于最小金额,金额为空,最大最小值正在获取中的code码
      if(["M400011","M400010","M400005","M400012","M400009"].includes(this.view_ctr_obj.error_code)) {
        // 初始化提示信息
        BetCommonHelper.init_message();
      }
    },
    /**
     * @description:更新键盘是不是可点击
     * @param {*} value 新值
     * @return {undefined} undefined
     */
    update_keyboard(value) {
      _.forEach(this.keyboard_data, item => {
        // 当value值小于键盘按键值或者点击的是MAX按键并且勾选了合并则按键置灰
        if(item.value>value || (item.text=='MAX' && this.BetData.is_bet_merge)) {
          item.disabled = true;
        } else {
          // 按键正常状态
          item.disabled = false;
        }
      });
    },
    /**
     * @description:设置最小金额
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    set_min_money() {
      if(this.money !== null) {
        // 限额最小金额给输入金额
        this.money = parseFloat(this.min_money);
        // 设置单关最低限额标识
        this.view_ctr_obj.input_money_state = -1;
        // 存储输入金额
        this.set_bet_obj_value("money", this.money);
        // 设置常用金额
        localStorage.setItem("common_amount", this.money);
        // 设置提示信息
        BetCommonHelper.check_result_msg( 'single', this.money);
      }
    },
    /**
     * @description:更新键盘按键状态
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    update_keyboard_status() {
      let user = this.BetData.user;
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
      //更新键盘状态
      this.update_keyboard(init_money);
    },
    /**
     * @description: 清除输入为空的提示
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    reset_input_empty_message() {
      clearTimeout(this.timer_obj['empty_message']);
      this.timer_obj['empty_message'] = setTimeout(() => {
        if(this.money != null && this.view_ctr_obj.error_code == "M400005") {
          // 清除提示信息
          BetCommonHelper.reset_message_info();
          // 限额标识设置为默认
          this.view_ctr_obj.input_money_state = 0;
        }
      },0);
    },
    /**
     * @description: 选中文本
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    select_money() {
      this.view_ctr_obj.is_empty_money = false;
      let input = this.$refs[`input-${this.id}`];
      if(input && this.BetData.bet_single_list.length == 1) {
        // 设置选中
        input.$el.select();
        input = null;
        this.set_bet_obj_value("money", this.money);
        this.$nextTick(()=>{
          if(this.win_money) {
            this.set_bet_obj_value("win_money", this.win_money);
          }
        });
      }
    },
    /**
     * @description:获取键盘数据
     * @param {undefined} undefined
     * @return {Array}  keyboard_data 返回键盘数据
     */
    get_keyboard_data() {
      let keyboard_data = [];
      // keys取部分getUserInfo接口cvo对象的single对象的key中的，其实就是键盘按键配置
      let keys = ['qon','qtw','qth','qfo','qfi'];
      _.forEach(keys, key => {        
        this.board_data(keyboard_data, key);
      });
      // 设置键盘按键对象
      keyboard_data.push({
        text: 'MAX',
        cur_btn: false,
        disabled: false
      });      
      return keyboard_data;
    },
    /**
     * @description:键盘数据设置
     * @param {Array} keyboard_data 键盘数据
     * @param {String} key 键盘按键对应的key
     */
    board_data(keyboard_data, key) {      
      let value = _.get(this.setup_single_info,`${key}`);
      if(value) {
        let text = _.toString(value);
        text = text.replace(/\d+/, function(n){ // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function($1){
            return $1+",";
          });
        });
        // 设置键盘按键对象
        keyboard_data.push({
          value,
          text,
          cur_btn: false,
          disabled: false
        });
      }
    },
    /**
     * @description: 取整
     * @param {String} min_money 最低限额(整数)
     * @param {String} max_money 最高小值(非整数)
     * @return {String} 最大金额
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
      if(min_len >= 4) {
        min_len = 4;
      }
      // 最高限额整数位和最低限额整数位数相同时, 取整为减少一位
      if(max_len == min_len) {
        min_len = min_len - 1;
      }
      max_integral = max_integral.substr(0, max_len - min_len);
      max_money = _.padEnd(max_integral,(max_integral.length + min_len),'0');
      return max_money;
    },
    /**
     * @description:更新主客队信息(主要用于国际化切换时调用)
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    update_home_away() {
      let bs = _.get(this.BetData.bet_single_obj,`${this.id}.bs`);
      let cs = _.get(this.BetData.bet_single_obj,`${this.id}.cs`);
      if(_.isPlainObject(bs)) {
        // 联赛名称
        this.league_name = bs.tn;
      }
      if(_.isPlainObject(bs)) {
        // 主队
        this.home = cs.home;
        // 客队
        this.away = cs.away;
      }
    },
    /**
     * @description:设置输入金额
     * @param {string} 金额
     * @return {undefined} undefined
     */
    set_money(value) {
      this.money = value;
      this.set_bet_obj_value("money", this.money);
      this.update_keyboard_status();
    },
    /**
     * @description:大视频处的键盘数据
     * @param {undefined} undefined
     * @return {Array} 键盘数据
     */
    big_keyboard_data() {
      return [
        // {
        //   text: "5",
        //   value: 5,
        //   disabled: false
        // },
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
        // {
        //   text: "25",
        //   value: 25,
        //   disabled: false
        // },
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
    },
    appoint_odds_head_handle(event) {
      // if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)){//让球
      //   min_head_value = 99.5;
      //   max_head_value = -99.5;
       
      //   this.appoint_ball_head = 
      // }if(BASKETBALL_BY_APPOINTMENT_total.includes(this.play_id)) {//大小
      //   min_head_value = 0;
      //   max_head_value = 400;
      // }

      let new_value = Number(event.target.value);
      if(_.isNaN(new_value)) {
        return;
      }
      if(_.startsWith(new_value, "+")) {
        new_value = new_value.slice(1);
      }
      this.appoint_ball_head = Number(event.target.value) ? Number(event.target.value).toFixed(1):Number(event.target.value);
      if(new_value > this.max_head_value) {
        this.appoint_ball_head = this.max_head_value
        if(_.isNaN(this.appoint_odds_value)) {
          this.appoint_odds_value = max_head_value //预约赔率可输入最大值
        }
      }
      if(new_value < this.min_head_value) {
        this.appoint_ball_head = this.min_head_value
        if(_.isNaN(this.appoint_odds_value)) {
          this.appoint_odds_value = min_head_value //预约赔率可输入最大值
        }
      }
    },
    /**
     * @description:输入的预约赔率
     * @param {*} event 
     * @return {undefined} undefined
     */
    appoint_odds_value_handle(event) {
      this.appoint_odds_value = Number(event.target.value);
      if(_.isNaN(this.appoint_odds_value)) {
        this.appoint_odds_value = 355.00 //预约赔率可输入最大值
      }
      if(Number(event.target.value) < this.min_odds_value) {
        this.pre_min_odds_value = this.min_odds_value;
        this.min_odds_value = -1000;//这里输入的值如果小于最小值的话，给个很小的值，目的不让当前输入值变成最小值
      }
    },
    /**
     * @description:点击加号(球头或者赔率)的修改逻辑
     * @param {string} type  赔率还是球头
     * @param {index} index  位置
     * @return {undefined} undefined
     */
    add_handle(type, index=1) {
      //赔率加
      if(type == 'odds_value') {
        let aov = this.appoint_odds_value;
        this.appoint_odds_value = aov + 0.01;
        //获取当前需要添加焦点的输入框，如果存在输入框，则获取焦点
        let input = index == 0 ? this.$refs.currency_input_single.$el:this.$refs.currency_input.$el
        if(input) input.focus();
      }
      //球头加
      if(type =='ball_head') {      
        let step = this.sport_id == '1' ? 0.25:0.5;
        let new_num = this.appoint_ball_head*1;
        this.appoint_ball_head = new_num + step;
        console.log('球头加', this.appoint_ball_head);
        const max_rang = 10;
        const max_big = 30;
        //足球
        if('1' == this.sport_id) { 
          if(MARKET_RANG_FLAG_LIST.includes(this.play_id)) {//让球
            if(this.appoint_ball_head >= max_rang){
              this.appoint_ball_head = max_rang
            //给出弹框提示（已为最高预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_hight_adjust')}`);
            }
          }else{//大小球
            if(this.appoint_ball_head >= max_big){
              this.appoint_ball_head = max_big
            //给出弹框提示（已为最高预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_hight_adjust')}`);//
            }
          }
        //篮球
        }else if('2' == this.sport_id){
          let max_let = 99.5;
          let max_small = 400.5;
          if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)){//让球
            if(this.appoint_ball_head >= max_let){
              this.appoint_ball_head = max_let
            //给出弹框提示（已为最高预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_hight_adjust')}`);
            }
          }else {
            if(this.appoint_ball_head >= max_small){
              this.appoint_ball_head = max_small
            //给出弹框提示（已为最高预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_hight_adjust')}`);
            }
          }
        }
        this.$nextTick(() => {
          this.search_odds_value_by_ball_head();
        })
      }
    },
    /**
     * @description:点击减号(球头或者赔率)的修改逻辑
     * @param {string} type  赔率还是球头
     * @param {index} index  位置
     * @return {undefined} undefined
     */
    sub_handle(type, index=1) {
      if(this.min_odds_value == -1000) {
        this.min_odds_value = this.pre_min_odds_value;
      }
      // if(type == 'odds_value' && this.appoint_odds_value > this.min_odds_value) {
      //   let aov = this.appoint_odds_value;
      //   this.appoint_odds_value = aov - 0.01;
      //   // useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
      // }
      if(type == 'odds_value') {
        if(this.appoint_odds_value > this.min_odds_value) {
          let aov = this.appoint_odds_value;
          this.appoint_odds_value = aov - 0.01;
          let input = index == 0 ? this.$refs.currency_input_single.$el:this.$refs.currency_input.$el
          if(input) input.focus();
        }else{
           //给出弹框提示（已为最低预约盘口值，请重新调整）
           useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('error_msg_info.0400540.client_msg1')}`);
        }
      }
        // useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
      if(type=='ball_head') {
        let new_num = this.appoint_ball_head;
        let step = this.sport_id == 1 ? 0.25:0.5;
        this.appoint_ball_head = new_num - step;
        console.log('market_type===', this.market_type);
        console.log('basic_score===', this.basic_score);
        console.log('timerly_basic_score===', this.timerly_basic_score);
        if('1' == this.sport_id) { //足球
          // let nnn = '2-3'
          // let ball_score = nnn ? Math.max(nnn.split('-')[0], nnn.split('-')[1]) + 0.5: 0.5;
          //规则又改了，全场是主客队分数相加再加0.5， 非全场是主客队对应得分数加0.5，这里有三种情况，全场， 主队和客队
          let arr = this.timerly_basic_score.split('-');
          if(MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id)) {
            this.ball_score = this.timerly_basic_score ? parseInt(arr[0]) +  parseInt(arr[1]) + 0.5: 0.5;
          }else if(MARKET_HOME_PLAY_LIST.includes(this.play_id)) {
            this.ball_score = this.timerly_basic_score ? parseInt(arr[0]) + 0.5: 0.5;
          }else if(MARKET_AWAY_PLAY_LIST.includes(this.play_id)) {
            this.ball_score = this.timerly_basic_score ? parseInt(arr[1]) + 0.5: 0.5;
          }
          //下面还有一种获取分数的渠道，那就是直接在betpreamount接口获取
          // let new_score =  _.get(this.BetData.pre_bet_list, 'currentMarket.preBetBenchmarkScore', '')
          // this.ball_score = -1;
          // if(MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id)) {
          //   this.ball_score = new_score ? parseInt(new_score.split('-')[0]) +  parseInt(new_score.split('-')[1]) + 0.5: 0.5;
          // }else if(MARKET_HOME_PLAY_LIST.includes(this.play_id)) {
          //   this.ball_score = new_score ? parseInt(new_score.split('-')[0]) + 0.5: 0.5;
          // }else if(MARKET_AWAY_PLAY_LIST.includes(this.play_id)) {
          //   this.ball_score = new_score ? parseInt(new_score.split('-')[1]) + 0.5: 0.5;
          // }
          // console.log('this.ball_score===', this.ball_score); 
  
          //玩法id在MARKET_BIG_SMALL_PLAY_LIST里面的，球头下限要限制在当前进球数+0.5
          const mix_rang = -10;
          if((MARKET_BIG_SMALL_PLAY_LIST.includes(this.play_id) || MARKET_HOME_PLAY_LIST.includes(this.play_id) || MARKET_AWAY_PLAY_LIST.includes(this.play_id)) && this.appoint_ball_head <= this.ball_score) {
            this.appoint_ball_head =  this.ball_score;
            console.log('this.appoint_ball_head====', this.appoint_ball_head);
            console.log('basic_score===', this.basic_score);
            //给出弹框提示（已为最低预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_adjust')}`);
          }else if(FOOTBALL_PLAY_LET_BALL.includes(this.play_id)){
              if(this.appoint_ball_head <= mix_rang) {
                this.appoint_ball_head = mix_rang
                useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_adjust')}`);
              }
          }
          else
          if(this.appoint_ball_head<0 && !FOOTBALL_PLAY_LET_BALL.includes(this.play_id)) {
            this.appoint_ball_head = 0;
          }
        }else if('2' == this.sport_id){//篮球
          let mix_let = -99.5;
          let mix_small = 50.5;
          if(BASKETBALL_BY_APPOINTMENT_let.includes(this.play_id)){//让球
            if(this.appoint_ball_head < mix_let){
              this.appoint_ball_head = mix_let
            //给出弹框提示（已为最低预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_adjust')}`);
            }
          }else {
            if(this.appoint_ball_head < mix_small){
              this.appoint_ball_head = mix_small
            //给出弹框提示（已为最低预约盘口值，请重新调整）
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD,`${i18n_t('bet.bet_header_adjust')}`);//
            }
          }
        }
        console.log('球头减');
        this.$nextTick(()=>{
          this.search_odds_value_by_ball_head();
        })
      }
    },
    /**
     * @description:这里是点击加减的时候，处理对应盘口搜索对应赔率逻辑
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    search_odds_value_by_ball_head() {
      let head = this.BetData.bet_appoint_obj.computed_appoint_ball_head;
      let list = this.BetData.pre_bet_list;
      if(!list || _.isNull(list.marketList)) return;
      let playOptionsId = '';
      let marketId = ''
      // console.log('外围数据BetData.pre_bet_list===', list);
      // console.log('外围数据head===', head);
      //让球处理
      if(MARKET_RANG_FLAG_LIST.includes(this.play_id)) {
        let cur_i = -1;
        let ml_len = list.marketList.length;
        for(let i = 0; i < ml_len; i++) {
          let ml_item = list.marketList[i];
          let odd_len = ml_item.marketOddsList.length;
          for(let j = 0; j < odd_len; j++) {
            let odd_item = ml_item.marketOddsList[j];
              if(_.get(list, 'currentMarket.marketOddsList[0].oddsType',-1) == odd_item.oddsType && odd_item.playOptions == head) {
                playOptionsId = odd_item.id; //投注项id
                cur_i = i;
                if(odd_item) {
                  let ve = Number((this.$mathjs.divide(odd_item.oddsValue, 100000)).toFixed(2));
                  let vu = this.cur_odd == 'HK'? Number(this.$mathjs.subtract(ve, 1)) : ve
                  console.log('当前赔率前===',  vu);
                  console.log('当前盘口前===', vu);
                  if(vu > this.appoint_odds_value) {
                    this.appoint_odds_value = vu;
                    console.log('当前最小值等于1', this.min_odds_value);
                  }
                  this.min_odds_value = vu;
                  //设置输入框最小值
                  BetDataCtr.set_pre_min_odd_value(this.min_odds_value)
                  console.log('当前赔率===',  this.appoint_odds_value);
                  console.log('当前盘口===', odd_item.playOptions);
                  break;
                }
            }
          }
        }
      }else { //非让球处理
          //这里要调整下
          let dl_fillter = list.marketList.filter(item => item.marketValue == this.BetData.bet_appoint_obj.computed_appoint_ball_head)[0];
          //盘口id 预约需要筛选
          marketId = _.get(dl_fillter, 'id', '');
          let parr = _.get(dl_fillter, 'marketOddsList', []);
          let filter_arr = parr.filter(item => item.oddsType == _.get(list, 'currentMarket.marketOddsList[0].oddsType',-1));
          //投注项id 预约需要筛选
          playOptionsId = filter_arr[0] ? filter_arr[0]['id'] : '';
          if(filter_arr[0]) {
            let ve = Number((this.$mathjs.divide(filter_arr[0].oddsValue, 100000)).toFixed(2));
            
            
            let vu = this.cur_odd == 'HK'? Number(this.$mathjs.subtract(ve, 1)) : ve
            // console.log('当前赔率3333前===',  vu)
            // console.log('当前盘口3333前===', vu);
            if(vu > this.appoint_odds_value) {
              this.appoint_odds_value  = vu
              // console.log('当前最小值等于2', this.min_odds_value);
            }
            this.min_odds_value = vu
            //设置输入框最小值
            BetDataCtr.set_pre_min_odd_value(this.min_odds_value)
            // console.log('当前赔率3333===',  this.appoint_odds_value)
            // console.log('当前盘口3333===', filter_arr[0].playOptions);
          }
      }
      if(_.isEmpty(playOptionsId) && _.isEmpty(marketId)) {
        if(this.cur_odd == 'EU') {
          this.min_odds_value = 1.01
          // this.appoint_odds_value  = 1.01
        }else{
          this.min_odds_value = 0.01
          // this.appoint_odds_value  = 0.01
        } 
        //设置输入框最小值
        BetDataCtr.set_pre_min_odd_value(this.min_odds_value)
        // console.log('当前最小值等于3', this.min_odds_value); 
      }
      // console.log('当前赔率等于1', this.appoint_odds_value);
      // console.log('当前最小值等于4', this.min_odds_value);
    },
    /**
     * @description:点击预约按钮调用的方法
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    appoint_handle() {
      localStorage.setItem('first_click', 2)
      //设置锁定状态
      // this.$emit('get_lock_index', this.index)
      this.appoint = true;
      // 预约时的初始赔率
      this.init_odds_value = Number(this.odds_value);
      this.min_odds_value = Number(this.odds_value)
      //设置输入框最小值默认值
      BetDataCtr.set_pre_min_odd_value(this.min_odds_value)
      // 预约赔率
      this.appoint_odds_value = Number(this.odds_value);      
      // 球头处理
      let handicap = _.toString(this.handicap);
      if(handicap && handicap.includes('/')) {
        let arr = handicap.split('/');
        this.init_ball_head = (Math.abs(Number(arr[0])) + Math.abs(Number(arr[1])))/2;
        if(handicap.startsWith('-')) {
          this.init_ball_head *= -1;
        }
      } else if(handicap || handicap == '0') {
        this.init_ball_head = Number(handicap);          
      }
      // 预约时的球头(小数形式)
      this.appoint_ball_head = this.init_ball_head;
      // 预约的投注项id
      BetDataCtr.set_bet_appoint_obj({
        bet_appoint_id: this.id,  //3162815_18_1_Over
        appoint_ball_head: this.appoint_ball_head, // 球头(小数形式)
        appoint_odds_value: this.appoint_odds_value,  //赔率
        computed_appoint_ball_head: this.computed_appoint_ball_head, //计算的球头值
        is_head_eq_hadicap: true, //当预约投注的球头与盘口值相等
        appoint_init_odds_value: this.init_odds_value //初始化的赔率
      });
      //预约调用预约限额接口
      this.init_pre();
      //输入金额不存在且记住常用金额未选中
      if(!this.money && !this.max_money) {
        useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE, true) 
      }
    },
    /**
     * @description:点击取消预约时调用的方法
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    cancel_operate() {
      //按钮失效
      useMittEmit(MITT_TYPES.EMIT_BTN_CHANGE, false);
      //还原初始状态
      // this.$emit('get_lock_index', -1)
      this.appoint = false;
      this.appoint_ball_head = this.init_ball_head;
      this.appoint_odds_value = this.init_odds_value;

      let cs = _.get(this.BetData.bet_single_obj,`${this.id}.cs`);
      let odds_table = {
        EU: '1',//欧盘
        HK: '2',//香港盘
        MY: '3',
        GB: '4',
        US: '5',//美盘
        ID: '6'
      }
      // 根据odds_switch字段显示对应的盘口名称 且是香港盘才加1
      /* if(cs && cs.odds_switch && cs.odds_switch.includes(odds_table[this.BetData.cur_odd]) && this.cur_odd == 'HK') {
        this.set_bet_obj_value("odds_value", this.$mathjs.multiply(this.init_odds_value + 1, 100000));
      } else  {
          this.set_bet_obj_value("odds_value", this.$mathjs.multiply(this.init_odds_value, 100000));
      } */
     
      // this.query_bet_amount();
      //重新调用单关最大最小值接口
      useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_RECALL_MONEY_CMD, this.id);
      // 置空预约投注项
      BetDataCtr.set_bet_appoint_obj(null)
      //置空当前盘口下所有的投注项
      BetDataCtr.set_pre_bet_list(null)
    },

    /**
     * @description: 根据多语言来获取提示显示的位置坐标
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    getArr() {
      // console.log('UserCtr.lang ==', UserCtr.lang);
      if(UserCtr.lang == 'zh' || UserCtr.lang == 'tw') {
        return [-45, 133]
      }
      if(UserCtr.lang == 'th') {
        return [-45, 190]
      } 
      if(UserCtr.lang == 'en' || UserCtr.lang == 'ad') {
        return [-45, 253]
      } 
      return [-45, 210]
    }
  },
  mounted() {
    // 获取投注数量
    let len = this.BetData.bet_single_list.length;
    // 投注数量大于0时
    if(len > 0) {
      // 设置焦点
      this.focus_handle();
      // 当切换小窗口或内嵌版投注栏金额要保留
      this.$nextTick(()=>{
        if (this.BetData.bet_current_money_obj[this.id] && this.is_common_amount) {
          this.money = this.BetData.bet_current_money_obj[this.id]
        } 
      })

      let user = this.BetData.user;
      // 输入金额大于最高限额
      if(this.max_money && this.money > parseFloat(this.max_money)) {
        // 转换最高限额为输入金额
        this.money = parseFloat(this.max_money);
      }
      // 获取用户余额
      let balance = parseFloat(user.balance) || 0.00;
      // 用户余额存在
      if(this.money > balance && balance>0) {
        // 转换用户余额为输入金额
        this.money = balance;
      }
      
      if(this.max_money) {
        // 用户余额比最高限额大
        if(balance > parseFloat(this.max_money)) {
          // 输入最最大值转换为限额最大值
          this.input_max = parseFloat(this.max_money);
        } else if(balance <= parseFloat(this.max_money)) {
          // 输入最最大值转换为用户余额
          this.input_max = balance;
        }
      }
      // 更新输入框限额
      this.value_range.max = this.input_max;
      // 更新键盘状态
      this.update_keyboard_status();
      // 当勾选了常用金额
      if(this.is_common_amount) {
        this.$nextTick(() => {
          // 金额存在      
          if(this.money) {
            // 调用选中金额方法
            this.select_money();
            // 校验金额
            this.check_money();
          }
        });
      }
    }
  }
}