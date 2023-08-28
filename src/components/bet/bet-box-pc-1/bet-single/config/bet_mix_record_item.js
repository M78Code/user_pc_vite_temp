/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注项
 */

import betting from "src/public/mixins/betting/betting.js";
import { format_str } from "src/core/format/index.js";

export default {
  name: "bet-mix-item",
  mixins: [betting],
  data() {
    return {
      odds_change_up: false, // 赔率是否上升
      odds_change_down: false, // 赔率是否下降
      mouseover_info: false, // 鼠标是否移入
      season: '', //联赛赛季名称
      timer_obj: {},   // 延时器对象
      home: '', // 主队名称
      away: '', // 客队名称
      league_name: '', // 联赛名称
      part1: '', //第一部分
      part2: '' //第二部分
    };
  },
  props: {
 
    // 投注项id
    oid: {
      type: String | Object,
      default: () => {
        return "0"
      }
    },
    // 投注项对象
    item_obj: {
      type: [Object, String],
      default: () => { }
    },
  },
  created() {
    // 通过投注项oid获取投注项id
    this.id = BetCommonHelper.get_id( this.oid);
    this.play_id = BetCommonHelper.get_play_id();
    // console.log('this.play_id======', this.play_id);
    // 获取赛季
    this.season = BetCommonHelper.get_season();
    let item_obj = this.item_obj;
    if (item_obj) {
      if(item_obj.matchName) {
        // 联赛名称
        this.league_name = item_obj.matchName;
      }
      if (item_obj.matchInfo && item_obj.matchInfo.includes(' v ')) {
        // 解析主客队
        let teams = item_obj.matchInfo.split(' v ');
        // 获取主队名称
        this.home = teams[0];
        // 获取客队名称
        this.away = teams[1];
      } else if (item_obj.home && item_obj.away) {
        // 获取主队名称
        this.home = item_obj.home;
        // 获取客队名称
        this.away = item_obj.away;
      }
      // 投注项名称
      let playOptionName = _.trim(this.item_obj.playOptionName);
      //全场独赢不用分为两部分，直接过滤掉
      if(this.item_obj.playOptionName && _.trim(playOptionName).includes(" ")  && !['1', '17'].includes(this.play_id)) {      
        let spliter = playOptionName.lastIndexOf(' ');
        this.part1 = playOptionName.substring(0,spliter);
        this.part2 = playOptionName.substring(spliter,playOptionName.length+1);
      } else {
        this.part1 =  _.trim(playOptionName);
      }
    }  
  },
  computed: {

    /**
     * @description: 当前盘口名称 欧洲盘/香港盘
     * @param {undefined} undefined
     * @return {String} 
     */
    handicap_name() {
      return `[${i18n.t('odds')[this.item_obj.marketType]}]`;
    },
    /**
     * @description: 赔率
     * @param {undefined} undefined
     * @return {String} 
     */
    odds_value() {
      return this.item_obj.oddsValues;
    },
    /**
     * @description: 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘
     * @param {undefined} undefined
     * @return {String} 
     */
    match_type() {
      return this.item_obj.matchType;
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
     * @description: 投注项状态
     * @param {undefined} undefined
     * @return {String} 投注项状态
     */
    active() {
      return BetCommonHelper.get_active();
    },
    /**
     * @description: 赛事时间
     * @param {undefined} undefined
     * @return {undefined} 
     */
    match_time() {
      let obj_bs = _.get(this.BetData.bet_obj,`${this.id}.bs`);
      if(_.isPlainObject(obj_bs)) {
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
     * @description: 监控当前赔率
     * @param {Number} new_ 当前赔率
     * @param {Number} old_ 上次赔率
     * @return {undefined} undefined
     */
    odds_value(new_, old_) {
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
      clearTimeout(this.timer_obj['odds_values']);
      this.timer_obj['odds_values'] = setTimeout(() => {
        this.odds_change_up = false;
        this.odds_change_down = false;
      }, 3000);
    }
  },
  destroyed () {
    clearTimeout(this.timer_obj['odds_values']);
    this.timer_obj = {};
  }
}