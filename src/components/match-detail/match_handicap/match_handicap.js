/*
 * @Author: Coooper
 * @Date: 2023-08-15 17:13:55
 * @Description: 赛事盘口的mixins
 */
import { DetailTemp0 } from "src/components/match-detail/template0/index.js";
import { DetailTemp1 } from "src/components/match-detail/template1/index.js";
import { DetailTemp2 } from "src/components/match-detail/template2/index.js";
import { DetailTemp3 } from "src/components/match-detail/template3/index.js";
import { DetailTemp4 } from "src/components/match-detail/template4/index.js";
import { DetailTemp5 } from "src/components/match-detail/template5/index.js";
import { DetailTemp6 } from "src/components/match-detail/template6/index.js";
import { DetailTemp7 } from "src/components/match-detail/template7/index.js";
import { DetailTemp8 } from "src/components/match-detail/template8/index.js";
import { DetailTemp9 } from "src/components/match-detail/template9/index.js";
import { DetailTemp10 } from "src/components/match-detail/template10/index.js";
import { DetailTemp11 } from "src/components/match-detail/template11/index.js";
import { DetailTemp12 } from "src/components/match-detail/template12/index.js";
import { DetailTemp18 } from "src/components/match-detail/template18/index.js";
import { DetailTemp51 } from "src/components/match-detail/template51/index.js";
import goTop from "src/components/go-top/go-top.vue";

// 电竞玩法模板


import { api_details } from "src/public/api/index";
import format from "src/project/yabo/mixins/match_details/index";
import time_format_mixin from "src/public/mixins/common/time_format";

export default {
  mixins: [format, time_format_mixin],
  components: {
    "template0":DetailTemp0,
    "template1":DetailTemp1,
    "template2":DetailTemp2,
    "template3":DetailTemp3,
    "template4":DetailTemp4,
    "template5":DetailTemp5,
    "template6":DetailTemp6,
    "template7":DetailTemp7,
    "template8":DetailTemp8,
    "template9":DetailTemp9,
    "template10":DetailTemp10,
    "template11":DetailTemp11,
    "template12":DetailTemp12,
    "template18":DetailTemp18,
    "template51":DetailTemp51,
    "go-top": goTop,
  },
  props: {
    // 判断当前在哪个详情页
    pageType: String,
    // 详情数据
    match_info: Object,
    //页面展开的对象
    is_list: Boolean,
    //玩法集
    category_list: Array,
    //盘口详情
    match_details: Array,
    // 关闭全部玩法
    close_all_handicap: Boolean,
    // 数据加载状态
    handicap_state: String,
    refs_tabs_bar: HTMLDivElement,
    // 组件加载类型
    load_type: String,
    // 选中玩法集的盘口玩法集
    plays_list: Array,
    // 电竞当前回合
    currentRound: {
      type: [Object, Number],
    },
  },


  methods: {
    ...mapActions({
      set_top_id: "set_top_id", //设置置顶的玩法id
      set_layout_statu: "set_layout_statu", //设置玩法列表单双列 0单列， 1双列
    }),

    /**
     * @description: 盘口级别状态转换投注项级别状态
     * 参考文档 src/public/mixins/details/README.md
     * @param {String} hs 盘口级别状态
     */
    transfer_status(status) {
      let transfer = 1;
      switch (status) {
        case 1:
          transfer = 2;
          break;
        case 2:
          transfer = 3;
          break;
        case 11:
          transfer = 4;
          break;
      }
      return transfer;
    },


    /**
     * @Description:设置玩法是否展开
     * @return {undefined} undefined
     */
    set_panel_status(isHandle = null) {
      let status = false;
      this.waterfall &&
        this.waterfall.forEach((list) => {
          list.forEach((item) => {
            if (item.is_show) {
              status = true;
            }
            //是否有附加盘
            if (item.has_plus && item.is_show_plus) {
              status = true;
            }
          });
        });
      // 接收用户点击的玩法的状态
      if (isHandle) {
        this.userHandleStatus({
          id: isHandle.handle.topKey,
          hshow: isHandle.handle.hshow,
        });
      }
      //所有玩法都已收起
      if (!status) {
        this.panel_status = "hide";
      } else {
        this.panel_status = "default";
      }
      // 储存用户操作后的玩法状态，静态刷新后需要保持该状态
      window.sessionStorage.setItem(
        "handle_state",
        JSON.stringify(this.handle_)
      );
    },
    /**
     * 接收用户点击的玩法的状态保存或移除
     * 移除或存储用户点击的玩法
     * @param {Object} item 用户点击的玩法
     */
    userHandleStatus(handle) {
      if (this.handle_) {
        // 如果缓存里已有该 id 就移除，否则就保存
        let flag = this.handle_.findIndex((i) => i.id == handle.id);
        if (flag != -1) {
          this.handle_.splice(flag, 1);
        } else {
          this.handle_.push({ id: handle.id, hshow: handle.hshow });
        }
      }
    },

    /**
     * 展开|收起投注列表
     * @return {undefined} undefined
     */
    toggle_panel() {
      this.panel_status == "open" || this.panel_status == "default"
        ? (this.panel_status = "hide")
        : (this.panel_status = "open");
      this.set_go_top_show();
    },

    /**
     * 详情页玩法展示单双列切换
     * @return {undefined} undefined
     */
    toggele_layout(statu) {
      if (statu == this.get_layout_statu) {
        return false;
      }

      this.set_layout_statu(statu); //设置玩法列表单双列 0单列， 1双列
      this.layout_statu = statu ? true : false;
      if (statu) {
        this.set_waterfall(this.details_data);
      } else {
        this.waterfall = [this.details_data];
      }
      // 判断是否显示【返回顶部】按钮
      this.set_go_top_show();
      // 设置玩法展开和折叠状态
      this.int_is_show();
    },


    /**
     * 玩法置顶排序
     * @return {undefined} undefined
     */
    sort_index(titleData) {
      let type = titleData[0]; // true取消置顶, false置顶
      let index = titleData[1];
      let handicap = this.details_data;
      let params = {
        cuid: this.get_uid,
        playId: handicap[index].hpid,
        matchId: handicap[index].mid,
        topKey: handicap[index].topKey,
        status: type ? 1 : 0,
      };
      api_details.set_playTop(params).then((res) => {
        const code = _.get(res, "data.code");
        if (code == 200) {
          if (!params.status) {
            //置顶
            if (handicap[index].hton == "0") {
              handicap[index].hton = new Date().getTime() + "";
            }
            handicap.unshift(handicap.splice(index, 1)[0]);
          } else {
            //取消置顶
            handicap[index].hton = "0";
            let arr = []; //暂存置顶的数据
            for (var i = 0; i < handicap.length; i++) {
              if (handicap[i].hton != "0") {
                arr.unshift(handicap.splice(i, 1)[0]);
                i--;
              }
            }
            //根据hpon排序
            handicap.sort(function (a, b) {
              return a.hpon - b.hpon;
            });
            //插入置顶的数据
            for (var i in arr) {
              handicap.unshift(arr[i]);
            }
          }
          // 保存置顶玩法的 id
          this.set_top_id({
            id: params.topKey,
            type: !params.status,
          });
          this.set_current_index(handicap);
          // 计算单双列玩法
          this.set_waterfall(handicap);
        }
      });
    },
    /**
     * 设置渲染模板单个玩法的index，用于置顶
     * @return {undefined} undefined
     */
    set_current_index(handicap) {
      handicap.forEach((item, index) => {
        item.index = index;
      });
      this.details_data = handicap;
    },
    /**
     * 一栏/两栏布局按钮在页面宽度 < 1680 不显示
     * @return {undefined} undefined
     */
    check_half() {
      if (
        (this.$route.name == "details" &&
          this.get_layout_list_size.width >= 1680) ||
        (this.$route.name == "virtual_details" &&
          this.match_info.csid == "1001")
      ) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * @Description:返回顶部
     * @return {Undefined} Undefined
     */
    on_go_top() {
      this.$emit("on_go_top");
    },

    /**
     * @Description 获取当前选中详情玩法集
     * @param {undefined} undefined
     */
    get_active_details_play_tab(callback) {
      let item = this.category_list.filter(
        (item) => this.get_tabs_active_id == item.id
      )[0];
      callback(item);
    },
    /**
     * @Description 设置数据加载状态
     * @param {undefined} undefined
     */
    set_load_state(data) {
      let statu;
      if (typeof data == "object") {
        if (data.mid == this.match_info.mid) {
          statu = data.status;
        }
      } else {
        statu = data;
      }
      if (!statu) {
        return;
      }

      if (this.load_type == "details") {
        this.$emit("set_handicap_state", statu);
      } else {
        this.load_detail_statu = statu;
      }
    },
    is_component_show(item) {
      // 电竞赛事第几局
      if (this.$utils.is_eports_csid(this.sportId) && !!this.currentRound) {
        return this.current_list.includes(String(item.chpid));
      } else {
        // 常规赛事或电竞非局数
        return this.plays_list.includes(item.hpid / 1);
      }
    },
  },
  created() {
    let { csid: sportId } = this.$route.params;
    this.sportId = sportId;
    // 设置玩法集 tab_hover 防抖
    this.tabs_hover = this.debounce(this.tabs_hover, 100);
    this.reset_toggle = Math.random();
    this.toggle_play = this.throttle(this.toggle_play, 500);
    // 监听数据加载状态
    this.$root.$on("set_match_detail_load_state", this.set_load_state);

    // 监听用户点击玩法   折叠或收起
    this.$root.$on("set_panel_status", this.set_panel_status);
    this.$root.$on(
      "get_active_details_play_tab",
      this.get_active_details_play_tab
    );
  },
  destroyed() {
    this.$root.$off("set_match_detail_load_state", this.set_load_state);
    this.$root.$off(
      "get_active_details_play_tab",
      this.get_active_details_play_tab
    );
    this.debounce_throttle_cancel(this.toggle_play);
    this.debounce_throttle_cancel(this.tabs_hover);
    this.$root.$off("set_panel_status", this.set_panel_status);
    this.handle_ = null;
    // this.offsetTop = null;
    this.waterfall = null;
    this.details_data = null;
  },
  mounted() {
    this.$emit("set_handicap_this", this);
  },

  filters: {
    template_id(num) {
      switch (num) {
        case 0:
          return "0";
        case 1:
          return "1";
        case 2:
          return "0";
        case 3:
          return "3";
        case 4:
          return "4";
        case 5:
          return "1";
        case undefined:
          return "2";
        default:
          return "";
      }
    },
  },
};
