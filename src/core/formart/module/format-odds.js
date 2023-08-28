/**
 *@description 赔率展示优化，见优化单 13807,电竞不走这个逻辑
 *@param {Number|String} val 最终赔率 30.40 100.00
 *@param {Number|String} csid 球类id
 *@return {String} 优化后的赔率，30.4 100
 */
export const format_odds = function (val, csid) {
  val = (val || "0").toString();
  if (!val.includes(".") || [100, 101, 102, 103].includes(+csid)) return val;
  if (val >= 100) {
    if (val.split(".")[1] == "00") {
      return val.split(".")[0];
    } else {
      return val;
    }
  }
  if (val >= 10) {
    if (val.split(".")[1][1] == "0") {
      return val.slice(0, val.length - 1);
    } else {
      return val;
    }
  }
  return val;
};

/**
 * @description: 赔率展示格式化
 * @param {string} val 赔率值
 * @return {String}
 */
export const format_odds_2 = (val) => {
  if (val == "" || val == undefined) {
    return "";
  }
  val = (val || "0").toString();
  let ret = val;
  if (val.includes(".")) {
    if (val >= 100) {
      if (val.split(".")[1] == "00") {
        ret = val.split(".")[0];
      } else {
        let len = val.length;
        if (val.indexOf(".0") == len - 2) {
          ret = val.substring(0, len - 2);
        } else {
          ret = val;
        }
      }
    } else if (val >= 10) {
      if (val.split(".")[1][1] == "0") {
        ret = val.slice(0, val.length - 1);
      } else {
        ret = val;
      }
    }
  }
  return ret;
};


 