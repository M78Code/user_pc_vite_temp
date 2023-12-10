import lodash from 'lodash'
/**
 * @description: 比分合并
 * @param {Array} msc  原来的msc字段比分
 * @param {Object} skt_data 推送对象
 * @return {Array} msc 合并后的新比分数组
 */
export const merge_msc_array = (msc, skt_data) => {
  // 使用对象临时存放比分
  let score_obj = {};
  for (let i = 0; i < msc.length; i++) {
    let msc_item = msc[i];
    let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
    if (check_msc_item) {
      let mcs_item_arr = msc[i].split('|');
      // 将比分转换成 score_obj={"S1": "0:0"} 的格式(可以进行去重)
      score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
      if (lodash.isArray(skt_data.msc)) {
        skt_data.msc.forEach(skt_item => {
          if (skt_item && skt_item.includes('|')) {
            let skt_item_arr = skt_item.split('|');
            if (mcs_item_arr[0] == skt_item_arr[0]) {
              score_obj[mcs_item_arr[0]] = skt_item_arr[1];
            } else {
              score_obj[skt_item_arr[0]] = skt_item_arr[1];
            }
          }
        });
      }
    }
  }
  msc = [];
  // 将比分对象重新组合成列表接口中msc中的格式
  for (let [key, value] of Object.entries(score_obj)) {
    let item = `${key}|${value}`;
    msc.push(item);
  }
  if (msc.length==0) {
    msc = skt_data.msc || [];
  }
  return msc;
}
/**
 * @description: 将比分转换成数组中指定格式
 * @param {Array} msc 比分
 * @return {Array} msc 合并后的新比分对象
 */
export const msc_obj_arry = (msc) => {
  if (lodash.isArray(msc)) return msc;
  let arr = [],is_s1 = false;
  if(msc) {
    for (let [key, value] of Object.entries(msc)) {
      let obj = `${key}|${value.home}:${value.away}`;
      if(key=='S1') {
        is_s1 = true;
      }
      arr.push(obj);
    }
    // 如果不包含S1比分,则默认给0:0
    if(!is_s1) {
      arr.unshift('S1|0:0');
    }
  }
  return arr;
}
/**
 * @description: 将比分数组转换成对象中指定格式
 * @param {Array} msc 比分
 * @param {String} score_type 比分默认为S1
 * @return {Object} msc 合并后的新比分对象
 */
export const msc_array_obj = (msc,score_type="S1") => {
  let score_obj = {};
  if (msc instanceof Array) {
    msc.forEach(msc_item=>{
      let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
      if(check_msc_item) {
        let msc_arr = msc_item.split('|');
        if(!lodash.isEmpty(msc_arr[0])&&!lodash.isEmpty(msc_arr[1])) {
          score_type = msc_arr[0];
          let team = msc_arr[1];
          let home = team.split(':')[0] ||'0';
          let away = team.split(':')[1] ||'0';
          let obj = {};
          obj[score_type] = {
            home,
            away,
            percentage: 0
          }
          if(!(home==0 && away==0)) {
            //统计面板百分比计算
            if (["S17", "S18"].includes(score_type)) {
              obj[score_type].percentage = parseInt(
                (parseInt(obj[score_type].home) /
                  (
                    parseInt(obj[score_type].home) +
                    parseInt(obj[score_type].away)
                  ).toFixed(2)) *
                  100
              );
            } else {
              obj[score_type].percentage = parseInt(
                (parseInt(obj[score_type].away) /
                  (
                    parseInt(obj[score_type].home) +
                    parseInt(obj[score_type].away)
                  ).toFixed(2)) *
                  100
              );
            }
          }
          Object.assign(score_obj, obj);
        }
      }
    });
  }
  return score_obj;
}

export const score_format = function (str) {
  return str.replace(/:/, "-");
};
export const format_score = function (str) {
  return str.split(":").join("-");
};

/**
 * 比分格式设置 (注单历史)
 */
export const format_score_t = (res) => {
  let str = "";
  if (res.indexOf("|") != -1) {
    let arr = res.split("|");
    str = arr[1].split(":");
  } else if (res.indexOf(":") != -1) {
    str = res.split(":");
  }
  return `${str[0]} - ${str[1]}`;
};

/**
 *@description 根据不同赛事阶段取不同的比分
 *@param {Object} match 赛事数据对象
 *@param {Number} num 0-主队  1-客队
 *@param {String} key 比赛结束显示指定比分
 *@return {Number} 主队或客队得分
 */
export const format_total_score = function (match, num, key) {
  try {
    if (!(match.msc && Array.isArray(match.msc) && match.msc.length)) return 0;
    let score_,
      mscmap = new Map(
        match.msc.map((item) => [
          item.split("|")[0],
          item.split("|")[1].split(":"),
        ])
      );
    if (match.csid == "1" || match.csid == "11") {
      //足球和手球
      switch (String(match.mmp)) {
        //  41 加时赛上半场  33 加时休息  42 加时下半场 110 加时赛结束
        case "41":
        case "33":
        case "42":
        case "110":
          score_ = mscmap.get("S7");
          break;
        // 50 点球大战  120 点球大战结束
        case "50":
        case "120":
          score_ = mscmap.get("S170");
          break;
        // 即将加时和等待点球的阶段固定取0
        case "32":
        case "34":
          score_ = 0;
          break;
        //全场结束,取点球大战比分，加时赛比分或者全场比分
        case "999":
          score_ = mscmap.get("S170") || mscmap.get("S7") || mscmap.get("S1");
          key && key.includes("S") && (score_ = mscmap.get(key));
          break;
        default:
          score_ = mscmap.get("S1");
          break;
      }
    } else {
      score_ = mscmap.get("S1");
    }
    return (score_ && score_[num]) || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

/**
 * @description 序列化比分
 * @param  {Array} msc
 * @return {object}
 */
export const serialized_score = (msc = [], is_init = false) => {
  let score_obj = {};
  if (is_init) {
    score_obj = {
      S11: {
        home: "",
        away: "",
      },
      S103: {
        home: "0",
        away: "0",
      },
      S5: {
        home: "",
        away: "",
      },
      S10102: {
        home: "",
        away: "",
      },
    };
  }
  // 遍历接口比分数据 转成比分对象
  lodash.each(msc, (score_str) => {
    let [key, value] = score_str.split("|");
    if (value) {
      let [home, away] = value.split(":");
      score_obj[key] = { home, away };
    }
  });
  return score_obj;
};
