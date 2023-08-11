/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 单关投注记录
 */
import { mapGetters } from "vuex";
import betting from "src/public/mixins/betting/betting.js";
import play_mapping from "src/public/config/mapping/play_mapping.js";
export default {
  name: "bet-single-record",
  mixins: [betting],
  data() {
    return {
      oid: "",// 投注项id
      odds_change_up: false,  // 设置赔率上升的样式
      odds_change_down: false, // 设置赔率下降的样式
      mouseover_info: false, //悬浮显示tips
      sport_id: '',//球种id
      play_id: '',//玩法id
      play_name: '',//玩家名字
      team_name: '',//队伍名字
      play_mapping: {},//玩法集
      has_winner: false,
      timer_obj: {}, //定时器对象
      home: '',//主队
      away: '',//客队
      part1: '',//第一部分
      part2: ''//第二部分
    }
  },
  props: {
    view_ctr_obj: {
      type: Object,
      default: {}
    },
    single_record_obj: Object
  },
  created() {
    this.oid = _.get(this.single_record_obj,'playOptionsId');
    this.id = this.virtual_common.get_id(this,this.oid);
    this.sport_id = this.virtual_common.get_sport_id(this);
    this.play_id = this.virtual_common.get_play_id(this);
    this.play_name = this.virtual_common.get_play_name(this);
    this.team_name = this.virtual_common.get_team_name(this);
    this.play_mapping = play_mapping;
    this.has_winner = $menu.menu_data.is_esports_champion

    let item_obj = this.single_record_obj;
    if (item_obj.matchInfo) {
      if(item_obj.matchInfo.includes(' v ')) {
        let team = item_obj.matchInfo.split(' v ');
        this.home = team[0];
        this.away = team[1];
      }
    } else if (item_obj.home && item_obj.away) {
      this.home = item_obj.home;
      this.away = item_obj.away;
    }
    let playOptionName = _.trim(this.single_record_obj.playOptionName);
    // console.log('this.play_id===', this.play_id);
    if(this.single_record_obj.playOptionName && _.trim(playOptionName).includes(" ") && !['30001','30006'].includes(this.play_id)) { //电竞全局获胜和单局获胜不分两部分     
      let spliter = playOptionName.lastIndexOf(' ');
      this.part1 = playOptionName.substring(0,spliter);
      this.part2 = playOptionName.substring(spliter,playOptionName.length+1);
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
      vx_cur_odd: "get_cur_odd",
      vx_cur_menu_type: "get_cur_menu_type",
      get_menu_obj: "get_menu_obj",
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      vx_get_theme: "get_theme"
    }),
    /**
     * 是否显示主队 v 客队
     * @returns 
     */
    show_home_away() {
      return !window.$menu.menu_data.is_esports_champion;
    },
    /**
     * @description: 是否为印尼盘
     * @param {undefined} undefined
     * @return {Boolean} 
     */
    is_indonesia() {
      if (this.single_record_obj.addition && this.single_record_obj.addition != "0") {
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
      // 1: 早盘 2: 滚球 3:冠军赛事
      return this.single_record_obj.matchType;
    },
    /**
     * 电竞赛事下区分1.早盘，滚球，冠军
     * @returns 
     */
    match_detail_type() {
      // 电竞赛事下区分1.早盘，滚球，冠军
      return this.single_record_obj.matchDetailType;
    },
    /**
     * @description: tips icon的id
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
    handicap_name() {
      let bet_single_obj = this.vx_get_bet_single_obj[this.id];
      let cs = _.get(bet_single_obj, 'cs');
      let odds_table = {
        EU: '1',
        HK: '2',
        MY: '3',
        GB: '4',
        US: '5',
        ID: '6'
      }
      if(cs && cs.odds_switch && cs.odds_switch.includes(odds_table[this.vx_cur_odd])) {
        return `[${this.$root.$t('odds')[this.vx_cur_odd]}]`;
      }
      return `[${this.$root.$t('odds')['EU']}]`
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
    "single_record_obj.orderStatusCode": {
      handler(new_) {      
        if(new_==0) {
          this.view_ctr_obj.order_confirm_complete = 3;
          clearTimeout(this.view_ctr_obj.timer_);
        } else if(new_==1) {
          this.view_ctr_obj.order_confirm_complete = 2;
          clearTimeout(this.view_ctr_obj.timer_);
        } else if(new_==2){
          this.view_ctr_obj.order_confirm_complete = 1;
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
          return this.$root.$t('bet.bet_fail');
        case 1:
          return this.$root.$t('bet.bet_suc');
        case 2:
          return this.$root.$t('bet.bet_confirm');
      }
    },
    /**
     * @description: 获取编码序号
     * @param {*}
     * @return {*}
     */
    get_numbers() {
      if(this.single_record_obj.oddsType) {
        if(this.single_record_obj.oddsType.includes('/')) {
          return this.single_record_obj.oddsType.split('/');
        }
        return [this.single_record_obj.oddsType];
      }
      return [];
    }
  },
  destroyed () {
    clearTimeout(this.timer_obj['odds_values']);
    this.timer_obj = {};
  }
}