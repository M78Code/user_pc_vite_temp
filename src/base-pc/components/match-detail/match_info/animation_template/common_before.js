/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共的动画模板
 */
import {formatTime,is_eports_csid,i18n_t, format_string } from 'src/output/index.js';
import lodash from 'lodash'
// import {MatchProcessFullVersionWapper} from "src/components/match-process/index.js";
// const licia_format = require('licia/format');
export default {
  components: {
    // "match-date": MatchProcessFullVersionWapper
  },
  name: "football_before",
  data() {
    return {
      
      lodash,
      i18n_t,
      is_eports_csid,
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
          format_string(i18n_t("time.time_date_1"), "mm", "dd")
        ), //"mm月dd日"
        formatTime(this.match_info.mgt, "hh:MM")
      ];
    }
  }
};