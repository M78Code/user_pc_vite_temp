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
//赔率展示格式化
export const format_odds2 = (val)=> {
  if (val == '' || val == undefined) {
    return '';
  }
  val = (val || '0').toString();
  let ret = val;
  if (val.includes('.')) {
    if (val >= 100) {
      if (val.split('.')[1] == '00') {
        ret = val.split('.')[0];
      } else {
        let len = val.length;
        if (val.indexOf('.0') == (len - 2)) {
          ret = val.substring(0, len - 2);
        } else {
          ret = val;
        }
      }
    } else if (val >= 10) {
      if (val.split('.')[1][1] == '0') {
        ret = val.slice(0, val.length - 1);
      } else {
        ret = val;
      }
    }
  }
  return ret;
}

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

/**
    * @description: 胜平负、大小走水格式化
    * @return {}
    */
export const result_filter = (type, value) =>{
  //  2平3输4赢, 2走水3小4大
  if( type == 'cls'){
    switch(value){
      case 2: return 'dogfall';
      case 3: return 'lose';
      case 4: return 'win';
      default: return 'default';
    }
  } else if(type == 'resultLabel'){
    switch(value){
      case 2: return this.$root.$t("analysis.level");
      case 3: return this.$root.$t("analysis.lose");
      case 4: return this.$root.$t("analysis.win");
    }
  } else if(type == 'resultwinlose'){
    switch(value){
      case 2: return this.$root.$t("analysis.flat");
      case 3: return this.$root.$t("analysis.negative");
      case 4: return this.$root.$t("analysis.victory");
      default: return this.$root.$t("analysis.no_data")
    }
  } else if(type == 'overunderLabel'){
    switch(value){
      case 2: return this.$root.$t("analysis.level");
      case 3: return this.$root.$t("analysis.small");
      case 4: return this.$root.$t("analysis.big");
      default: return this.$root.$t("analysis.no_data")
    }
  }
}


/**
 * @description: 比分格式处理(投注时用到)
 * @param {Array} msc 比分
 * @param {Integer} csid 球种id
 * @param {Integer} ms 赛事状态
 * @param {Integer} hpid 玩法id
 * @return {String} 比分格式为: (主队比分-客队比分)
 */
export const calc_bifen = (msc, csid, ms, hpid) => {   
  //只有足球滚球展示基准分
  if (!msc[0] || csid != 1 || !ms || ms == 0) return "";
  let S;
  if (hpid == 128) {
    S = msc.toString().match(/S7\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 130) {
    S = msc.toString().match(/S701\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 143) {
    S = msc.toString().match(/S3\|[0-9]+\:[0-9]+/);
  }
  if (['4','27','29','269','336'].includes(`${hpid}`)) {
    S = msc.toString().match(/S1\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 19) {
    S = msc.toString().match(/S2\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 113) {
    S = msc.toString().match(/S5\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 121) {
    S = msc.toString().match(/S15\|[0-9]+\:[0-9]+/);
  }
  if (S) return S[0].split('|')[1];
  return "";
}