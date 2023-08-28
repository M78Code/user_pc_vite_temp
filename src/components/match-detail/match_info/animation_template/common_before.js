/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共的动画模板
 */
// import format from "src/project/yabo/mixins/match_details/index";
import { formatTime } from "src/core/format/index.js"
import { t } from "src/boot/i18n";;
import utils from "src/core/utils/utils";
import lodash from 'lodash'
import {MatchProcessFullVersionWapper} from "src/components/match-process/index.js";
// const licia_format = require('licia/format');
import licia_format from 'licia/format'
export default {
  components: {
    "match-date": MatchProcessFullVersionWapper
  },
  name: "football_before",
  // mixins: [, format],
  data() {
    return {
      utils,
      lodash,
      t:t,
      background_img: "", // 球种背景图片
    };
  },
  props: {
    match_info: Object,
    screen: String,
    is_new: Boolean,
    is_virtual: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    date() {
      return [
        // 格式化时间
        formatTime(
          this.match_info.mgt,
          licia_format(this.t("time.time_date_1"), "mm", "dd")
        ), //"mm月dd日"
        formatTime(this.match_info.mgt, "hh:MM")
      ];
    }
  }
};