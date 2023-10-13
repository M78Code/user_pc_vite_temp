/*
 * @Author: Coooper
 * @Date: 2023-08-15 17:13:55
 * @Description: 赛事盘口的mixins
 */
import { DetailTemp0 } from "src/base-pc/components/match-detail/template0/index.js";
import { DetailTemp1 } from "src/base-pc/components/match-detail/template1/index.js";
import { DetailTemp2 } from "src/base-pc/components/match-detail/template2/index.js";
import { DetailTemp3 } from "src/base-pc/components/match-detail/template3/index.js";
import { DetailTemp4 } from "src/base-pc/components/match-detail/template4/index.js";
import { DetailTemp5 } from "src/base-pc/components/match-detail/template5/index.js";
import { DetailTemp6 } from "src/base-pc/components/match-detail/template6/index.js";
import { DetailTemp7 } from "src/base-pc/components/match-detail/template7/index.js";
import { DetailTemp8 } from "src/base-pc/components/match-detail/template8/index.js";
import { DetailTemp9 } from "src/base-pc/components/match-detail/template9/index.js";
import { DetailTemp10 } from "src/base-pc/components/match-detail/template10/index.js";
import { DetailTemp11 } from "src/base-pc/components/match-detail/template11/index.js";
import { DetailTemp12 } from "src/base-pc/components/match-detail/template12/index.js";
import { DetailTemp18 } from "src/base-pc/components/match-detail/template18/index.js";
import { DetailTemp51 } from "src/base-pc/components/match-detail/template51/index.js";
import goTop from "src/components/go-top/go-top.vue";

// 电竞玩法模板


// import { api_details } from "src/api/index";
// import format from "src/project/yabo/mixins/match_details/index";
// import time_format_mixin from "/mixins/common/time_format";

export default {
  // mixins: [format, time_format_mixin],
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
