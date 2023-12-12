/*
 * @
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:23
 * @Description: src/public/mixins/results/index
 */
import lodash from 'lodash'
import { formatTime } from 'src/output/module/constant-utils.js'
import { i18n_t } from "src/boot/i18n.js";
import { nextTick } from "vue";
import UserCtr from "src/core/user-config/user-ctr.js";
export default {
  data() {
    return {
      formatTime,
      i18n_t,
      timer: null,
      show_loading: false,
      snoke_score_data:{
        // 第一局比分
        // 第...局比分
        1: "S120",
        2: "S121",
        3: "S122",
        4: "S123",
        5: "S124",
        6: "S125",
        7: "S126",
        8: "S127",
        9: "S128",
        10: "S129",
        11: "S130",
        12: "S131",
        13: "S132",
        14: "S133",
        15: "S134",
        16: "S135",
        17: "S136",
        18: "S137",
        19: "S138",
        20: "S139",
        21: "S140",
        22: "S141",
        23: "S142",
        24: "S143",
        25: "S144",
        26: "S145",
        27: "S146",
        28: "S147",
        29: "S148",
        30: "S149",
        31: "S150",
        32: "S151",
        33: "S152",
        34: "S153",
        35: "S154",
        36: "S155",
        37: "S156",
        38: "S157",
        39: "S158",
        40: "S159",
        timer_ac:null //定时器
      },
      play_id: ''
    }
  },
  props: {
    load_data_state: {//loading状态
      type: String,
      default: "loading",
    },
    details_load: {//loading状态
      type: String,
      default: "loading",
    },
    results_list: {//表格数据
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    results_order_list: {//点击行详情
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    results_playback_list: {//点击行精彩回放详情
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    is_sortUp: Boolean,//是否升序
    activeIndex: Number,//查看表格内详细的index
    // 版本名
    versions: String,
    // 球种id
    sportType: {
      type: String,
      default: ''
    }
  },
  created() {
    // 从链接获取 id
    let { playId } = this.$route.query;
    this.play_id = playId;
  },
  computed: {
    cur_row() {
      return lodash.findIndex(this.results_order_list, item =>item.playId==this.play_id);
    },
    lang() {
      return UserCtr.lang;
    },
  },
  watch: {
    cur_row: {
      handler(new_) {
        if(new_>0) {
          nextTick(()=>{
            let top = this.cur_row * 40;
            let obj = this.yabo_common.get_refs_info('scrollArea', null, this);
            obj && obj.setScrollPosition(top);
          });
        }
      },
      immediate:true
    },
    load_data_state:{
      handler(val){
        this.$refs.scrollArea.setScrollPosition('vertical', 0)
      }
    }
  },
  methods: {
    /**
    * @description: 格式化结算状态
    * @param {String} res 接口scoreResult字段
    * @return {String} 状态名称
    */
    format_name(res) {
      let str = "";
      switch (res) {
        // "2", "4", "5", "6"
        case "2":
          str = {class: 'lose-color', name:i18n_t("bet_record.effective_water_")}//走水
          break;
        case "4":
          str = {class: 'win-color', name:i18n_t("bet_record.win")}//赢
          break;
        case "5":
          str = {class: 'win-color', name:i18n_t("bet_record.win_half")}//赢半
          break;
        case "6":
          str = {class: 'lose-color', name:i18n_t("bet_record.lose_half")}//输半
          break;
      }
      return str;
    },

    /**
     * @获取点击行赛事的投注项赛果详情
     * @param {Object} item 当前行数据
     * @param {String} index 当前行下标
     */
    get_tr_detail(item, index) {
      this.$emit('get_tr_detail', item, index)
    },
    /**
    * @description: 升降排序
    */
    change_sort() {
      this.$emit("change_sort")
    },

    /**
    * @description: 转化比赛状态
    * @param {String} matchStatus 比赛阶段
    * @param {String} matchPeriodId 比赛状态
    * @return {}
    */
    format_mmp(matchPeriodId, matchStatus){
      let match_stage = ""
      if([61, 80, 90].includes(matchPeriodId)){
        switch (matchPeriodId){
          case 61: match_stage =i18n_t("bet_record.match_delay2");break;//比赛延迟
          case 80: match_stage =i18n_t("bet_record.match_interrupt");break;//比赛中断
          case 90: match_stage =i18n_t("bet_record.match_give_up");break;//比赛放弃
        }
        return match_stage
      }

      if([1, 2, 5, 7, 8, 9, 10, 11].includes(matchStatus)){
        switch (matchStatus){
          case 1: match_stage =i18n_t("menu.match_playing");break;//滚球
          case 2: match_stage =i18n_t("bet_record.match_pause");break;//比赛暂停
          case 5: match_stage =i18n_t("bet_record.match_cancel2");break;//比赛取消
          case 7: match_stage =i18n_t("bet_record.match_delay2");break;//比赛延迟
          case 8: match_stage =i18n_t("bet_record.match_unknown");break;//未知状态
          case 9: match_stage =i18n_t("bet_record.match_delay3");break;//比赛延期
          case 10: match_stage =i18n_t("bet_record.match_interrupt");break;//比赛中断
          case 11: match_stage =i18n_t("bet_record.match_unknown");break;//未知状态
        }
        return match_stage
      }
      return match_stage
    },
    /**
    * @description: 初始化滚动条
    * @return {}
    */
     set_scroll(){
      if (this.timer_ac) {
        clearTimeout(this.timer_ac);
        this.timer_ac = undefined;
      }
     this.timer_ac = setTimeout(() => {
        let _ref = this.$refs
        nextTick(()=>{
          this.scroll_wrap_width = _ref.ref_scorll && _ref.ref_scorll.length && _ref.ref_scorll[0].offsetWidth
          this.content_width = _ref.ref_content && _ref.ref_content.length && _ref.ref_content[0].offsetWidth
          if(this.content_width > this.scroll_wrap_width){
            this.show_arrow = true
            this.tabs_bar_left = 41
          } else {
            this.show_arrow = false
            this.tabs_bar_left = 0
          }
        })
      },200)
    },
    /**
    * @description: 切换精彩回放数据
    */
    change_playback_type(tab) {
      this.$emit("change_playback_type",tab)
    },
  }
};
