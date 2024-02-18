import BetCountJointNumber from "src/core/bet/common-helper/module/bet-countjoint-number.js"
import BetData from "src/core/bet/class/bet-data-class.js";
import lodash_ from "lodash"

/**
 * @description: 获取投注模块-统计串关数
 * @param {Function} callback 回调函数
 * @return {undefined} undefined
 */
export const getSeriesCountJointNumber = (callback) => {
  let bet_s_list_count = BetData.bet_s_list.length
  
  let data = BetCountJointNumber.getBetCountJoint(bet_s_list_count);
  // if (bet_s_list_count <= 10) {
  //   data = data.filter((item) => {
  //     return Number(item.id.slice(0, 1)) >= bet_s_list_count || ['10串1', '10串1013'].includes(item.name)
  //   });
  // } else if (bet_s_list_count == 10) {
  //   data = [data[0]];
  // } else {
  //   data = [];
  // }
  if (lodash_.isFunction(callback)) {
    callback(200, data);
  }
}