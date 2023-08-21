/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 单关投注记录 正常
 */
import { mapGetters } from "vuex";
import betting from "src/public/mixins/betting/betting.js";
import play_mapping from "src/public/config/mapping/play_mapping.js";
export default {
  name: "bet-single-record",
  mixins: [betting], // 押注相关功能
  data() {
    return {
      oid: "",  // 投注项id
      odds_change_up: false,    // 设置赔率上升的样式
      odds_change_down: false,  // 设置赔率下降的样式
      mouseover_info: false,    //悬浮显示tips
      timer_obj: {}, //定时器对象
      season: '', // 赛季
      home: '', // 主队名称
      away: '', // 客队名称
      league_name: '', // 联赛名称
      part1: '', // 第一部分
      part2: '', // 第二部分
      play_mapping: {},//玩法集
    }
  },
  props: {
  
    single_record_obj: Object, // 投注结果对象信息
    type: {
      type: String,
      default: ''
    }
  },
  created() {
     this.play_mapping = play_mapping;
    // 投注项oid
    this.oid = _.get(this.single_record_obj,'playOptionsId');
    // 通过投注项的oid获取投注项id
    this.id = BetCommonHelper.get_id( this.oid);
    this.play_id = BetCommonHelper.get_play_id();
    console.log('this.play_id======', this.play_id);
    let item_obj = this.single_record_obj;
    if (item_obj.matchInfo) {
      // 如果赛事信息中存在 v 则表示有主队v客队的形式存在
      if(item_obj.matchInfo.includes(' v ')) {
        // 将matchInfo转换成数组
        let teams = item_obj.matchInfo.split(' v ');
        // 主队名称
        this.home = teams[0];
        // 客队名称
        this.away = teams[1];
      } else {
        //赛季
        this.season = item_obj.matchInfo;
      }
    } else if (item_obj.home && item_obj.away) {
       // 主队名称
      this.home = item_obj.home;
      // 客队名称
      this.away = item_obj.away;
    }
    if(item_obj.matchName) {
      // 联赛名称
      this.league_name = item_obj.matchName;
    }
    // 投注项名称 这里要不要搞个兜底处理 playOptionName 为空字符串时 取 oddType
    let playOptionName = _.trim(this.single_record_obj.playOptionName);
    let reg = /^(\d[+])|([+,-]{0,1}\d[.]{0,1}\d{0,}\/\d[.]\d)|([+,-]{0,1}\d[.]{0,1}[\d]{0,1})$/
    //名称颜色要求显示不同所以分两部分处理part1, part2 340净胜分比较特数据原因走这里会显示两种颜色故屏蔽
    if(this.single_record_obj.playOptionName && _.trim(playOptionName).includes(" ") && reg.test(playOptionName) && !['1', '17', '340', '362'].includes(this.play_id)) {      
      let spliter = playOptionName.lastIndexOf(' ');
      this.part1 = playOptionName.substring(0,spliter);
      this.part2 = playOptionName.substring(spliter,playOptionName.length + 1);
    } else {
      this.part1 =  _.trim(playOptionName);
    }
  },
  filters: {
    /**
     * @description: 金额格式过滤器
     * @param {String} value 当前金额  
     * @return {Number} 
     */
    format_money(value) {
      if (value && parseFloat(value) > 0) {
        return "+" + value;
      } else if (value && parseFloat(value) < 0) {
        return value;
      } else {
        return 0;
      }
    }
  },  
  computed: {
    ...mapGetters({
      vx_cur_odd: "get_cur_odd",   //当前赔率
      vx_cur_menu_type: "get_cur_menu_type",  // 当前菜单类型
      get_menu_obj: "get_menu_obj",   // 菜单对象
      vx_get_theme: "get_theme",   // 皮肤
      vx_get_bet_single_obj: "get_bet_single_obj",   // 单关对象
      lang: "get_lang"  // 国际化
    }),
    /**
     * @description: 是否为印尼盘
     * @param {undefined} undefined
     * @return {Boolean} 
     */
    is_indonesia() {
      if (this.single_record_obj.addition && this.single_record_obj.addition != "0" && this.single_record_obj.addition != "0.0") {
        return true;
      }
      return false;
    },
    /**
     * @description: 盘口类型
     * @param {undefined} undefined
     * @return {String} 
     */
    match_type() {
      // 1: 早盘 2: 滚球
      return this.single_record_obj.matchType;
    },
    /**
     * @description: tips icon的id
     * @param {undefined} undefined
     * @return {string} icon的id
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
     * @description:是否还有确认中状态
     * @param {undefined} undefined
     * @return {boolean} 是否确认中状态
     */
    has_confirm_status() {
      return _.findIndex(this.view_ctr_obj.order_detail_data, item => item.orderStatusCode == 2) > -1;
    },
    /**
     * @description: 赛事时间
     * @param {undefined} undefined
     * @return {string} 处理后的赛事时间
     */
    match_time() {
      let obj_bs = _.get(this.vx_get_bet_single_obj,`${this.id}.bs`);
      //是不是个普通对象
      if(_.isPlainObject(obj_bs)) {
        let date, month, day, hour, minute;
        let format_str = BetCommonHelper.format_str;
        //冠军
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
    },
    /**
     * @description: 投注项状态
     * @param {undefined} undefined
     * @return {String} 投注项状态
    */
    active() {
      let flag = BetCommonHelper.get_active();
      return flag
    }, 
  },
  watch: {
    /**
     * @description: 监控投注记录赔率
     * @param {new_} 当前赔率
     * @param {old_} 上次的赔率
     * @return {undefined} undefined
     */
    "single_record_obj.oddsValues": {
      handler(new_, old_){
        // 赔率没有切换的时候发生变化，才处理     
        if (new_ > old_) {
          // 设置赔率上升的样式
          this.odds_change_up = true;
          this.odds_change_down = false;
        } else if (new_ < old_) {
          // 设置赔率下降的样式
          this.odds_change_up = false;
          this.odds_change_down = true;
        } 
        //定时器先清除再使用 
        clearTimeout(this.timer_obj['odds_values']);
        this.timer_obj['odds_values'] = setTimeout(() => {
          this.odds_change_up = false;
          this.odds_change_down = false;
        }, 3000);
      }
    },
    /**
     * @description: 监控订单状态
     * @param {new_} 当前投注记录状态
     * @return {undefined} undefined
     */
    has_confirm_status(new_) {
      if(!new_) {
        let success_count = 0; // 注单提交成功的个数
        let fail_count = 0; // 注单失败的个数
        _.forEach(this.view_ctr_obj.order_detail_data, item => {

          if(item.orderStatusCode == 0) {  //失败
            // 失败订单统计
            fail_count++;
          } else if(item.orderStatusCode == 1) { //成功
            // 成功订单统计
            success_count++;                    
          }
        });

        // 注单全部成功
        if(success_count == this.view_ctr_obj.order_detail_data.length) {
          this.view_ctr_obj.order_confirm_complete = 2;      
          // 清除超时定时器
          if(this.timer_obj['time_over']) {
            clearTimeout(this.timer_obj['time_over']);
          }
          // 清除定时器
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
        }

        // 注单全部失败
        if(fail_count == this.view_ctr_obj.order_detail_data.length) {
          this.view_ctr_obj.order_confirm_complete = 3; 
          // 清除超时定时器
          if(this.timer_obj['time_over']) {
            clearTimeout(this.timer_obj['time_over']);
          }
          // 清除定时器
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
        }
        // 全部注单已完成 有成功有失败的
        if(fail_count > 0 && success_count > 0 && ((fail_count+success_count) == this.view_ctr_obj.order_detail_data.length)) {
          this.view_ctr_obj.order_confirm_complete = 4; 
          // 清除超时定时器
          if(this.timer_obj['time_over']) {
            clearTimeout(this.timer_obj['time_over']);
          }
          // 清除定时器
          if(this.view_ctr_obj.timer_) {
            clearTimeout(this.view_ctr_obj.timer_);
            this.view_ctr_obj.timer_ = undefined;
          }
        }
      }
    }
  },
  methods: {   
    /**
     * @description: 订单结算状态
     * @param {Number} 状态 
     * @return {type} 
     */
    order_status(type) {
      switch (type) {
        case 0:
          // 投注失败
          return i18n.t('bet.bet_fail');
        case 1:
          // 投注成功
          return i18n.t('bet.bet_suc');
        case 2:
          // 确认中
          return i18n.t('bet.bet_confirm');
      }
    }    
  },
  destroyed () {
    //清除计时器对象
    clearTimeout(this.timer_obj['odds_value']);
    this.timer_obj = {};
  }
}