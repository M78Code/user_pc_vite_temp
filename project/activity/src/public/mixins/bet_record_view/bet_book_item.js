/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注记录的投注项部分
 */
import play_mapping from "src/public/config/mapping/play_mapping";
export default {
  name: "bet-record-item",
  data() {
    return {
      bookShow: false,
      odds_change_up: false,   // 赔率升
      odds_change_down: false,  //赔率降
      play_mapping: {},   //  玩法集
      home: '',   // 主队
      away: '',   //客队
      part1: '',  //第一部分
      part2: '', // 第二部分
      book_loading: false, // 取消预约投注确认中
    }
  },
  props: {
    selected: Number,
    appoint_status: Number,
    appoint_order_status: Number,
    index: {
      type: Number,
      default: 0
    },
    addition: {
      type: [Number, String],
      default: "0.00"
    },
    order_status: Number|String,
    ac_code: String,
    series_type: String,
    lang_code:String,
    out_come: Number|String,
    pre_bet_amount:Number|String,
    orderNo:Number|String,
    order: {
      type: Object,
      default: () => {
        return {
          no: "",
          batchNo: "",
          beginTime: "",
          marketValue: "",
          marketType: "",
          matchInfo: "",
          matchName: "",
          oddFinally: "",
          oddsValue: "",
          playName: "",
          playOptions: "",
          score: "",
          scoreBenchmark: "",
          settleScore: "",
          settleTime: null,
          sportName: "",
          matchType: "",
          betResult: "",
          betStatus: "",
          sportId: "",
          matchDay: "",
          legOrder: ""
        }
      }
    }
  },
  created() {
    // 防抖
    this.cancel_book_handle = this.debounce(this.cancel_book_handle,100)
    this.play_mapping = play_mapping;
    let item_obj = this.order;
    if (item_obj) {
      this.get_team_name(item_obj)
      // 投注项名称获取
      let playOptionName = _.trim(this.order.playOptionName);
      // 投注项中间是否包含空格
      if(this.order.playOptionName && _.trim(playOptionName).includes(" ") && ![362].includes(this.order.playId)) {      
        // 获取投注项中间最后一个空格所在位置
        let spliter = playOptionName.lastIndexOf(' ');
        // 截取第一部分
        this.part1 = playOptionName.substring(0,spliter);
        // 截取第二部分
        this.part2 = playOptionName.substring(spliter,playOptionName.length+1);
      } else {
        // 默认投注项名称为第一部分
        this.part1 =  _.trim(playOptionName);
      }
    }
  },
  updated() {
    this.get_team_name(this.order)
  },
  computed: {
    /**
     * @description: 赔率
     * @param {undefined} undefined
     * @param {undefined} undefined
     * @return {String} 
     */
    odds_value() {
      return this.order.oddFinally;
    },
    match_time() {
      // 赛事时间获取 日期，月份，天，小时数，分钟
      let date, month, day, hour, minute;
      let format_str = this.yabo_common.format_str;
      date = new Date(parseInt(this.order.beginTime));
      month = format_str(date.getMonth() + 1);
      day = format_str(date.getDate()); 
      hour = format_str(date.getHours());
      minute = format_str(date.getMinutes());     
      // 若为中文或者繁体显示格式 
      if(['zh','tw'].includes(this.lang_code)) {
        return `${month}月${day}日 ${hour}:${minute}`;
      } else {
        // 其他语言显示格式
        return `${month}/${day} ${hour}:${minute}`; 
      }
    }
  },
  watch: {
    /**
     * @description: 监控当前赔率
     * @param {new_} 当前赔率
     * @param {old_} 上次的赔率
     * @return {undefined} undefined
     */
    odds_value(new_, old_) {
      if (new_ > old_) {
        // 设置赔率上升的样式
        this.odds_change_up = true;
        this.odds_change_down = false;
      } else if (new_ < old_) {
        // 设置赔率下降的样式
        this.odds_change_up = false;
        this.odds_change_down = true;
      }
      clearTimeout(this.odds_value_timer); 
      this.odds_value_timer = setTimeout(() => {
        this.odds_change_up = false;
        this.odds_change_down = false;
      }, 3000); 
    },
  },
  filters: {
    /**
     * @description: 比分格式
     * @param {String} value 比分
     * @return {String} 转换后的比分格式
     */
    socre_format(value) {
      return `(${value.replace(':','-')})`
    },
    //赔率展示格式化
    format_odds(val) {
      if(val == '' || val == undefined){
        return '';
      }
      val = (val || '0').toString();
      let ret = val;
      if (val.includes('.')){
        if (val >= 100) {
          if (val.split('.')[1] == '00') {
            ret = val.split('.')[0];
          } else {
            let len = val.length;
            if(val.indexOf('.0') == (len-2)){
              ret = val.substring(0,len-2);
            } else {
              ret = val;
            }
          }
        } else if (val >= 10) {
          if (val.split('.')[1][1] == '0') {
            ret = val.slice(0,val.length-1);
          } else {
            ret = val;
          }
        }
      }
      return ret;
    }
  },
  methods: {
    /**
     * MARKET_RANG_FLAG_LIST里面让球玩法预约时不显示基准分
     * @returns boolean
     */
    is_display_score() {
      return ((this.order.scoreBenchmark!='') && 
              !(this.appoint_order_status==0 && this.play_mapping.MARKET_RANG_FLAG_LIST.includes(this.order.playId+'')))
    },
    /**
     * @description: 输赢结算状态
     * @param {Number} bet_status 投注项状态
     * @param {Number} bet_result 投注结果
     * @param {Number} cancel_type 取消类型
     * @return {String} 需要显示的html 
     */
    bet_result(bet_status, bet_result, cancel_type) {
      let html = "";      
      if(this.selected == 0) {
        // 未结算
        if(this.order_status == 0) {
          //串关
          if(this.series_type != 1) {
            if(bet_status == 1) {
              switch (bet_result) {
                case 2:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.effective_water_")+"</span>"; //"走水";
                  break;
                case 3:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.lose")+"</span>"; // "输"      
                  break;      
                case 4:
                  html = "<span class='win'>"+this.$root.$t("bet_record.win")+"</span>"; // "赢"
                  break;
                case 5:
                  html = "<span class='win'>" +this.$root.$t("bet_record.win_half")+"</span>"; //"赢半";
                  break;            
                case 6:
                  html = "<span class='lose'>" +this.$root.$t("bet_record.lose_half")+"</span>"; //"输半";
                  break;
                case 7:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_cancel2")+"</span>"; //"赛事取消";
                  break;            
                case 8:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay")+"</span>";//"赛事延期";
                  break;            
                case 11:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay2")+"</span>"; //"比赛延迟";
                  break;            
                case 12:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_interrupt")+"</span>"; //"比赛中断";
                  break;            
                case 13:
                  html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>"; //"未知" 显示无效; 
                  break;           
                case 15:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_give_up")+"</span>"; //"比赛放弃";
                  break; 
                case 16:
                  html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>"; //"盘口异常" 显示无效;
                  break;         
              }
            } else if (bet_status == 3 || bet_status == 4) {
              if(play_mapping.CANCEL_TYPE.includes(cancel_type)) {
                //比赛类型
                html = this.cancel_type_msg(cancel_type);                 
              } else {
                html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>"; 
              }
            }
          }
        }
      } else if(this.selected == 1) { // 已结算
        if(this.order_status == 1) { // 投注成功
          switch (bet_result) {
            case 2:
              html = "<span class='lose'>"+this.$root.$t("bet_record.effective_water_")+"</span>"; //"走水";
              break;
            case 3:
              html = "<span class='lose'>"+this.$root.$t("bet_record.lose")+"</span>"; // "输"      
              break;      
            case 4:
              html = "<span class='win'>"+this.$root.$t("bet_record.win")+"</span>"; // "赢"
              break;
            case 5:
              html = "<span class='win'>" +this.$root.$t("bet_record.win_half")+"</span>"; //"赢半";
              break;            
            case 6:
              html = "<span class='lose'>" +this.$root.$t("bet_record.lose_half")+"</span>"; //"输半";
              break;
            case 7:
              html = "<span class='lose'>"+this.$root.$t("bet_record.match_cancel2")+"</span>"; //"赛事取消";
              break;            
            case 8:
              html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay")+"</span>";//"赛事延期";
              break;            
            case 11:
              html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay2")+"</span>"; //"比赛延迟";
              break;            
            case 12:
              html = "<span class='lose'>"+this.$root.$t("bet_record.match_interrupt")+"</span>"; //"比赛中断";
              break;            
            case 13:
              html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>"; //"未知" 显示无效; 
              break;           
            case 15:
              html = "<span class='lose'>"+this.$root.$t("bet_record.match_give_up")+"</span>"; //"比赛放弃";
              break; 
            case 16:
              html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>"; //"盘口异常" 显示无效;
              break;
          }
          if(this.series_type!=1 && (bet_status==3 || bet_status==4)) {
            if(play_mapping.CANCEL_TYPE.includes(cancel_type)) {
              //比赛类型
              html = this.cancel_type_msg(cancel_type);
            } else {
              // 无效
              html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>";  
            }
          }
        } else if(this.order_status == 2) { // 注单无效
          if(this.series_type == 1) {
            if(bet_status == 1) {
              switch (bet_result) {
                case 7:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_cancel2")+"</span>"; //"赛事取消";
                  break;            
                case 8:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay")+"</span>";//"赛事延期";
                  break;            
                case 11:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay2")+"</span>"; //"比赛延迟";
                  break;            
                case 12:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_interrupt")+"</span>"; //"比赛中断";
                  break;                      
                case 15:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_give_up")+"</span>"; //"比赛放弃";
                  break; 
              }
            }
          } else {
            if(bet_status == 1) {
              switch (bet_result) {
                case 7:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_cancel2")+"</span>"; //"赛事取消";
                  break;            
                case 8:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay")+"</span>";//"赛事延期";
                  break;            
                case 11:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay2")+"</span>"; //"比赛延迟";
                  break;            
                case 12:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_interrupt")+"</span>"; //"比赛中断";
                  break;                    
                case 15:
                  html = "<span class='lose'>"+this.$root.$t("bet_record.match_give_up")+"</span>"; //"比赛放弃";
                  break;
                default:
                  html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>";  // 无效
                  break;          
              }
            }            
          }
          if(bet_status == 3 || bet_status == 4) {
            if(play_mapping.CANCEL_TYPE.includes(cancel_type)) {
              //比赛类型
              html = this.cancel_type_msg(cancel_type);
            } else if(this.series_type != 1){
              html = "<span class='lose'>"+this.$root.$t("bet.invalid")+"</span>";  
            }
          }
        }
      }
      return html;     
    },
    /**
     * 
     * @param {Object} payload
     * @description 获取主客队队名 
     */
    get_team_name(payload) {
      // 赛事信息字段是否包含v，用来拆分主客队
      if (payload.matchInfo && payload.matchInfo.includes(' v ')) {
        let teams = payload.matchInfo.split(' v ');
        // 获取主队名称
        this.home = teams[0];
        // 获取客队名称
        this.away = teams[1];
      } else if (payload.home && payload.away) {
        this.home = payload.home;
        this.away = payload.away;
      }
    },
    /**
     * 输赢状态calss
     * @param betResult: records.orderVOS.betResult
     */
     item_class(betResult) {
      switch (parseInt(betResult)) {
        case 2:
          return "lose"; //"走水";
        case 3:
          return "lose"; //输
        case 4:
          return "win"; //赢
        case 5:
          return "win"; //"赢半";
        case 6:
          return "lose"; //"输半";
        case 7:
          return "lose"; //"赛事取消";
        case 8:
          return "lose"; //"赛事延期";
        case 11:
          return "lose"; //"比赛延迟";
        case 12:
          return "lose"; //"比赛中断";
        case 13:
          return "lose"; //"无效";
        case 16:
          return "lose"; //"无效";
        case 15:
          return "lose"; //"比赛放弃";
      }
      return "";
    },
    /**
     * 输赢状态
     * @param type: records.orderVOS.betResult
     */
     item_status(type) {
      switch (parseInt(type)) {
        case 2:
          return this.$root.$t("bet_record.effective_water_"); //"走水";
        case 3:
          return this.$root.$t("bet_record.lose"); //输
        case 4:
          return this.$root.$t("bet_record.win"); //赢
        case 5:
          return this.$root.$t("bet_record.win_half"); //"赢半";
        case 6:
          return this.$root.$t("bet_record.lose_half"); //"输半";
        case 7:
          return this.$root.$t("bet_record.match_cancel2"); //"赛事取消";
        case 8:
          return this.$root.$t("bet_record.match_delay"); //"赛事延期";
        case 11:
          return this.$root.$t("bet_record.match_delay2"); //"比赛延迟";
        case 12:
          return this.$root.$t("bet_record.match_interrupt"); //"比赛中断";
        case 13:
          return this.$root.$t("bet.invalid"); //"无效";
        case 16:
          return this.$root.$t("bet.invalid"); //"无效";
        case 15:
          return this.$root.$t("bet_record.match_give_up"); //"比赛放弃";
        default:
          return '';
      }
    },
    /**
     * @description:  比赛类型
     * @param {*} cancel_type
     * @return {*}
     */
    cancel_type_msg(cancel_type) {
      let html = '';
      switch(cancel_type) {
        case 1:
          html = "<span class='lose'>"+this.$root.$t("bet_record.match_cancel2")+"</span>"; //"比赛取消";
          break;
        case 2:
          html = "<span class='lose'>"+this.$root.$t("bet_record.match_delay3")+"</span>"; //"比赛延期";
          break;
        case 3:
          html = "<span class='lose'>"+this.$root.$t("bet_record.match_interrupt")+"</span>"; // "比赛中断	"      
          break;      
        case 4:
          html = "<span class='lose'>"+this.$root.$t("bet_record.match_rematch")+"</span>"; // "比赛重赛"
          break;
        case 5:
          html = "<span class='lose'>" +this.$root.$t("bet_record.match_waist")+"</span>"; //"比赛腰斩";
          break;            
        case 6:
          html = "<span class='lose'>" +this.$root.$t("bet_record.match_give_up")+"</span>"; //"比赛放弃";
          break;
        case 17:
          html = "<span class='lose'>" +this.$root.$t("bet_record.match_advance")+"</span>"; //"赛事提前";
          break;            
        case 20:
          html = "<span class='lose'>" +this.$root.$t("bet_record.match_delay2")+"</span>"; //"比赛延迟";
          break;
      }
      return html;
    },
    /**
     * @description: 赛事类型
     * @param {String} type 类型
     * @param {String} lang_code 语种信息
     * @return {String} 需要显示的类型文本
     */
    match_type(type, langCode = this.$i18n.locale) {
      let text = '';
      switch (parseInt(type)) {
        case 1:
          text = this.$root.$t(`common_lang.${langCode}.bet.morning_session`); //"早盘赛事";
          break;
        case 2:
          text = this.$root.$t(`common_lang.${langCode}.bet.bowls`); //"滚球盘赛事";
          break;
      }
      return text;
    },
    cancel_book_msg(match, msg) {
        if(match) {
          let match_ = match.replace(/ v /i, ' VS ')
          const arr = msg.split('[x]')
          return arr[0] + match_ + arr[1];
        }
      },  
    /**
     * @description: 获取编码序号
     * @param {*}
     * @return {*}
     */
    get_numbers() {
      if(this.order.playOptions) {
        if(this.order.playOptions.includes('/')) {
          return this.order.playOptions.split('/');
        }
        return [this.order.playOptions];
      }
      return [];
    },
    /**
     * @description: 当前盘口名称 欧洲盘/香港盘
     * @param {undefined} undefined
     * @return {String} 
     */
    handicap_name(type, langCode='zh') {
      var res = "";
      if(type && langCode) {
        switch (type) {
          case "EU":
            res = this.$root.$t(`common_lang.${langCode}.odds.EU`); //"欧洲盘";
            break;
          case "HK":
            res = this.$root.$t(`common_lang.${langCode}.odds.HK`); //"香港盘";
            break;
          case "US":
            res = this.$root.$t(`common_lang.${langCode}.odds.US`); //"美式盘";
            break;
          case "ID":
            res = this.$root.$t(`common_lang.${langCode}.odds.ID`); //"印尼盘";
            break;
          case "MY":
            res = this.$root.$t(`common_lang.${langCode}.odds.MY`); //"马来盘";
            break;
          case "GB":
            res = this.$root.$t(`common_lang.${langCode}.odds.GB`); //"英式盘";
            break;
          default:
            res = "";
            break;
        }
      }      
      return res;
    },
    /**
     * 打开弹窗，关闭预约中定时器
     */
     cancel_appoint() {
       this.bookShow = true
       this.$root.$emit(this.emit_cmd.EMIT_DEL_BOOK_HISTORY_RECORD_CMD, 0, this.bookShow);
      },
    /**
     * 关闭弹窗，重启预约中定时器
     */
      close_book_dialog() {
        this.bookShow = false
        this.$root.$emit(this.emit_cmd.EMIT_DEL_BOOK_HISTORY_RECORD_CMD, 0, this.bookShow);
      },
    cancel_book_handle() {
      // 调用接口取消注单后在回调投注记录接口
      this.book_loading = true
      const params = { orderNo: this.orderNo }
      this.cancel_book_record_order(params, (code, data, msg) => {
        if (code == 200) {
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD,`${this.$root.$t('bet.bet_book2')}${this.$root.$t('bet.bet_book_canceled')}`);
          this.bookShow = false
          // 获取注单历史记录
          this.$root.$emit(this.emit_cmd.EMIT_DEL_BOOK_HISTORY_RECORD_CMD, this.orderNo, this.bookShow);
        } else if (code == '0400546') {
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t('bet.bet_book_error_msg_0400546'));
          this.close_book_dialog()
        } else if (code == '0400547') {
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t('bet.bet_book_error_msg_0400547'));
          this.close_book_dialog()
        } else if (code == '0401038') {
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t('bet.bet_book_error_msg_0401038'));
          this.close_book_dialog()
        }
        else {
          // 错误提示
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, msg);
          this.close_book_dialog()
        }
        this.book_loading = false
      })
    }
  },
  destroyed () {
    clearTimeout(this.odds_value_timer);
    this.play_mapping = {};
    this.debounce_throttle_cancel(this.cancel_book_handle)
  }
}