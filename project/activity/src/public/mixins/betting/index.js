/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注工具类引入
 */
import odds_conversion_mixin from "project/activity/src/public/mixins/odds_conversion/odds_conversion_mixin.js";
import betting_data_ctr from "project/activity/src/public/mixins/betting/betting_data_ctr.js";
import betting from "project/activity/src/public/mixins/betting/betting.js";
import betting_data_ctr2 from "project/activity/src/public/mixins/betting/betting_data_ctr2.js";
import betting2 from "project/activity/src/public/mixins/betting/betting2.js";
export default {
  mixins:[
    // 赔率转换列表
    odds_conversion_mixin,
    // 投注数据组装
    betting_data_ctr,
    // 投注接口部分
    betting,
    // 虚拟体育投注数据组装
    betting_data_ctr2,
    // 虚拟体育投注接口部分
    betting2,
  ]
};
