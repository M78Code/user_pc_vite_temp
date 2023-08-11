/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 串关投注项
 */
import { mapGetters } from "vuex";
import betting from "src/public/mixins/betting/betting2.js";
import play_mapping from "src/public/config/mapping/play_mapping.js";
export default {
  name: "bet-mix-item",
  mixins: [betting],
  data() {
    return {
      odds_change_up: false,
      odds_change_down: false,
      mouseover_info: false,
      id: '',
      season: '',  // 联赛赛季名称
      match_type: '', // 盘口类型 1:赛前盘，2: 滚球盘 3: 冠军盘
      play_id: '',
      sport_id: '', //球种id
      play_name: '', // 玩法名称
      team_name: '', // 投注项名称
      play_mapping: {},
      timer_obj: {},
      home: '',
      away: '',
      part1: '',
      part2: ''
    };
  },
  props: {
    view_ctr_obj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    oid: {
      type: String | Object,
      default: () => {
        return "0"
      }
    },
    item_obj: {
      type: [Object, String],
      default: () => { }
    },
  },
  created() {
    this.id = this.virtual_common.get_id(this, this.oid);
    this.sport_id = this.virtual_common.get_sport_id(this);
    this.play_id = this.virtual_common.get_play_id(this);
    this.play_name = this.virtual_common.get_play_name(this);
    this.team_name = this.virtual_common.get_team_name(this);
    this.play_mapping = play_mapping;
    let item_obj = _.get(this.vx_get_virtual_bet_obj,`${this.id}.cs`);
    if (item_obj) {
      if (item_obj.matchInfo && item_obj.matchInfo.includes(' v ')) {
        let teams = item_obj.matchInfo.split(' v ');
        this.home = teams[0];
        this.away = teams[1];
      } else if (item_obj.home && item_obj.away) {
        this.home = item_obj.home;
        this.away = item_obj.away;
      }
    }
    let playOptionName = _.trim(this.item_obj.playOptionName);
    if(this.item_obj.playOptionName && _.trim(playOptionName).includes(" ") && !['30001', '30006'].includes(this.play_id)) {      
      let spliter = playOptionName.lastIndexOf(' ');
      this.part1 = playOptionName.substring(0,spliter);
      this.part2 = playOptionName.substring(spliter,playOptionName.length+1);
    } else {
      this.part1 =  _.trim(playOptionName);
    }
  },
  computed: {
    ...mapGetters({
      vx_get_virtual_bet_list: "get_virtual_bet_list",//虚拟体育投注列表
      vx_get_virtual_bet_obj: "get_virtual_bet_obj",
      vx_cur_menu_type: "get_cur_menu_type",
      get_menu_obj: "get_menu_obj"
    }),

    /**
     * @description: 当前盘口名称 欧洲盘/香港盘
     * @param {undefined} undefined
     * @return {String} 
     */
    handicap_name() {
      return `[${this.$root.$t('odds')[this.item_obj.marketType]}]`;
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
    /**
     * @description: 投注项状态
     * @param {undefined} undefined
     * @return {String} 投注项状态
     */
    active() {
      return this.yabo_common.get_active(this);;
    },
    /**
     * @description: 判断是否为个别特定玩法
     * @param {*}
     * @return {*}
     */
    is_individual_play() {
      return [
        this.play_mapping.VIURTUAL_SPORT.horse,
        this.play_mapping.VIURTUAL_SPORT.dog,
        this.play_mapping.VIURTUAL_SPORT.mudland_motorcycle,
        this.play_mapping.VIURTUAL_SPORT.motorcycle
      ].includes(`${this.sport_id}`);
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
      clearTimeout(this.timer_obj['odds_value']);
      this.timer_obj['odds_value'] = setTimeout(() => {
        this.odds_change_up = false;
        this.odds_change_down = false;
      }, 3000);
    }
  },
  methods: {
    /**
     * @description: 获取编码序号
     * @param {*}
     * @return {*}
     */
    get_numbers() {
      if(this.item_obj.oddsType) {
        if(this.item_obj.oddsType.includes('/')) {
          return this.item_obj.oddsType.split('/');
        }
        return [this.item_obj.oddsType];
      }
      return [];
    }
  },
  destroyed () {
    clearTimeout(this.timer_obj['odds_value']);
    this.timer_obj = {};
    this.play_mapping = {};
  }
}