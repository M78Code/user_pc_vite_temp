/*
 * @Author: Cooper
 * @Date: 2020-08-04 17:13:55
 * @Description:
 */


import _ from 'lodash'
/**
 * 秒转化时分秒
 * @return {undefined} undefined
 */
export const formatSeconds = (value) => {
  var theTime = parseInt(value); // 秒
  var middle = 0; // 分
  var hour = 0; // 小时

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (middle > 60) {
      hour = parseInt(middle / 60);
      middle = parseInt(middle % 60);
    }
  }
  var result = "" + (theTime + "").padStart(2, 0);
  if (middle > 0) {
    result = "" + (middle + "").padStart(2, 0) + ":" + result;
  }
  if (hour > 0) {
    result = "" + (hour + "").padStart(2, 0) + ":" + result;
  }
  return result;
};
/**
 * 重组胜平负三列包含其他的模板数据
 * params(match_details)
 * @return {undefined} undefined
 */
export const format_three_data = (data) => {
  let formatData = {
    home: [],
    dogfall: [],
    away: [],
    other: {},
  };
  let title = data.title;
  if (title.length) {
    let hl = data.hl;
    hl.forEach((item, i) => {
      item.ol.forEach((list, j) => {
        // os-3关盘的情况不处理
        if (list.os != 3) {
          list.hl_index = i;
          list.ol_index = j;
          if (list.otd == title[0].otd) {
            formatData.home.push(list);
          } else if (list.otd == title[1].otd) {
            formatData.dogfall.push(list);
          } else if (list.otd == title[2].otd) {
            formatData.away.push(list);
          } else {
            formatData.other = list;
          }
        }
      });
    });
  } else {
    let hl = data.hl[0].ol;

    hl.forEach((item, i) => {
      item.hl_index = 0;
      item.ol_index = i;
      if (item.otd == -1) {
        formatData.other = item;
      } else {
        let arr = item.on.split("-");
        // os-3关盘的情况不处理
        if (item.os != 3) {
          if (arr[0] > arr[1]) {
            formatData.home.push(item);
          } else if (arr[0] == arr[1]) {
            formatData.dogfall.push(item);
          } else if (arr[0] < arr[1]) {
            formatData.away.push(item);
          }
        }
      }
    });
  }
  return formatData;
};

/**
 * @description: 删除关盘的投注项
 * @param {Object} plays 盘口数据 1开盘、2封盘、3关盘、4锁盘
 * @return {undefined} 仅开盘的投注项
 */
export const format_plays = (plays) => {
  let hls = plays.hl;
  if (hls.length) {
    for (var i = 0; i < hls.length; i++) {
      if (hls[i].ol.length) {
        let status = hls[i].ol.every((item) => {
          return item.os == 3;
        });
        hls[i].hs = status ? 2 : hls[i].hs;
      } else {
        hls[i].hs = 2;
      }

      if (hls[i].hs == 2 || !hls[i].ol.length) {
        if (hls.length == 1) {
          hls = [];
        } else {
          hls.splice(i, 1);
          i--;
        }
      }
    }
  }

  plays.hl = hls;
  plays.show_hl = check_plays(plays);
  return plays;
};

/**
 * @判断玩法是否关盘
 * @param {Object} plays 盘口数据
 * @return {undefined} 是否展示模板
 */
export const check_plays = (plays) => {
  let data = plays.hl;
  let is_show = false;
  if (data.length) {
    if (data.length > 1) {
      //多盘口
      let more_show = false;
      data.forEach((item) => {
        if (item.hs != 2) {
          more_show = true;
        }
      });
      return more_show;
    } else {
      //单盘口
      if (data[0].hs == 2) {
        is_show = false;
      } else {
        is_show = true;
      }
    }
  }

  return is_show;
};

/**
 * 投注项ol排序
 * params(match_details)
 * @return {undefined} undefined
 */
export const format_sort_data = (data) => {
  if (!data.hl || !data.hl.length) return false;
  var newData = data;
  // return newData
  for (var i in data.hl) {
    let newArr = [];
    // '36','148','150','151','152', '211'重新排序
    // 35 首个进球球员 不需要重新排序
    if (
      data.title.length &&
      _.get(data, `hl[${i}].ol[0].otd`) != _.get(data, "title[0].otd") &&
      ![
        "35",
        "36",
        "148",
        "150",
        "151",
        "152",
        "211",
        "339",
        "360",
        "361",
        "362",
      ].includes(data.hpid)
    ) {
      for (var j in data.hl[i].ol) {
        newArr.unshift(data.hl[i].ol[j]);
      }
    } else {
      newArr = data.hl[i].ol;
    }
    newData.hl[i].ol = newArr;
  }
  return newData;
};
/**
 * @赛事阶段
 *
 */
export const socre_dict = (csid) => {
  // 3棒、4冰、5网、6美足、7斯诺克、8乒乓、9排球、10羽毛球
  var dict = {
    //棒球
    3: {
      401: "S120", // "第1局上",
      // 421: "S120",// 第一局中场休息
      402: "S120", // "第1局下",

      // 422: "S121",// 第一，二局局间休息
      403: "S121", // "第2局上",
      // 423: "S121",// 第二局中场休息
      404: "S121", // "第2局下",

      // 424: "S122",// 第二，三局间休息
      405: "S122", // "第3局上",
      // 425: "S122",// 第三局中场休息
      406: "S122", // "第3局下",

      // 426: "S123",// 第三、四局间休息
      407: "S123", // "第4局上",
      // 427: "S123",// 第四局中场休息
      408: "S123", // "第4局下",

      // 428: "S124",// 第四，五局局间休息
      409: "S124", // "第5局上",
      // 429: "S124",// 第五局中场休息
      410: "S124", // "第5局下",

      // 430: "S125",// 第五，六局局间休息
      411: "S125", // "第6局上",
      // 431: "S125",// 第六局中场休息
      412: "S125", // "第6局下",

      // 432: "S126",// 第六，七局局间休息
      413: "S126", // "第7局上",
      // 433: "S126",// 第七局中场休息
      414: "S126", // "第7局下",

      // 434: "S127",// 第七，八局局间休息
      415: "S127", // "第8局上",
      // 435: "S127",// 第八局中场休息
      416: "S127", // "第8局下",

      // 436: "S128",// 第八，九局局间休息
      417: "S128", // "第9局上",
      // 437: "S128",// 第九局中场休息
      418: "S128", // "第9局下",

      // 438: "S129",//等待加时赛
      41910: "S129", // "第10局上",
      // 43910: "S129",// 第十局中场休息
      42010: "S129", // "第10局下",

      // 43810: "S130",// 第十，十一局局间休息
      41911: "S130", // "第11局上",
      // 43911: "S130",// 第十一局中场休息
      42011: "S130", // "第11局下",

      // 43811: "S131",// 第十一，十二局局间休息
      41912: "S131", // "第12局上",
      // 43912: "S131",// 第十二局中场休息
      42012: "S131", // "第12局下",

      // 41812: "S132",// 第十二，十三局局间休息
      41913: "S132", // "第13局上",
      // 43913: "S132",// 第十三局中场休息
      42013: "S132", // "第13局下",

      // 41813: "S133",// 第十三，十四局局间休息
      41914: "S133", // "第14局上",
      // 43914: "S133",// 第十四局中场休息
      42014: "S133", // "第14局下",

      // 41814: "S134",// 第十四，十五局局间休息
      41915: "S134", // "第15局上",
      // 43915: "S134",// 第十五局中场休息
      42015: "S134", // "第15局下",

      // 41815: "S135",// 第十五，十六局局间休息
      41916: "S135", // "第16局上",
      // 43916: "S135",// 第十六局中场休息
      42016: "S135", // "第16局下",

      // 41816: "S136",// 第十六，十七局局间休息
      41917: "S136", // "第17局上"
      // 43917: "S136",// 第十七局中场休息
      42017: "S136", // "第17局下"

      // 41817: "S137",// 第十七，十八局局间休息
      41918: "S137", // "第18局上"
      // 43918: "S137",// 第十八局中场休息
      42018: "S137", // "第18局下"

      // 41818: "S138",// 第十八，十九局局间休息
      41919: "S138", // "第19局上"
      // 43919: "S138",// 第十九局中场休息
      42019: "S138", // "第19局下"

      // 41819: "S139",// 第十九，二十局局间休息
      41920: "S139", // "第20局上"
      // 43920: "S139",// 第二十局中场休息
      42020: "S139", // "第20局下"
    },
    //冰球
    4: {
      1: "S120",
      301: "S121", //第1节休息
      2: "S121",
      302: "S122", //第2节休息
      3: "S122",
    },
    //【网球】——根据mmp
    5: {
      8: "S23",
      9: "S39",
      10: "S55",
      11: "S71",
      12: "S87",
    },
    //美足
    6: {
      13: "S19",
      301: "S20", //第1节休息
      14: "S20",
      302: "S21", //第2节休息
      15: "S21",
      303: "S22", //第3节休息
      16: "S22",
    },
    //【斯诺克】——根据mct
    7: {
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
    },
    //【乒乓球】——根据mmp
    8: {
      // 第1局
      8: "S120",
      // 第1局间休息|第2局
      301: "S121",
      9: "S121",
      // 第2局间休息|第3局
      302: "S122",
      10: "S122",
      // 第3局间休息|第4局
      303: "S123",
      11: "S123",
      // 第4局间休息|第5局
      304: "S124",
      12: "S124",
      // 第5局间休息|第6局
      305: "S125",
      441: "S125",
      // 第6局间休息|第7局
      306: "S126",
      442: "S126",
    },
    //排球
    9: {
      // 第1局
      8: "S120",
      // 第1局间休息|第2局
      301: "S121",
      9: "S121",
      // 第2局间休息|第3局
      302: "S122",
      10: "S122",
      // 第3局间休息|第4局
      303: "S123",
      11: "S123",
      // 第4局间休息|第5局
      304: "S124",
      12: "S124",
      // 第5局间休息|第6局
      305: "S125",
      441: "S125",
      // 第6局间休息|第7局
      306: "S126",
      442: "S126",
    },
    //【羽毛球】——根据mmp
    10: {
      // 第1盘
      8: "S120",
      // 第1盘间休息、第2盘
      301: "S121",
      9: "S121",
      // 第2盘间休息、第3盘
      302: "S122",
      10: "S122",
      // 第3盘间休息、第4盘
      303: "S123",
      11: "S123",
      // 第4盘间休息、第5盘
      304: "S124",
      12: "S124",
    },
  };
  return dict[csid];
};

/**
 * @description: 当前高亮局
 * @param {String} csid：赛事id mmp：阶段状态 mct：当前局
 */
export const stage_dict = (csid, mmp, mct) => {
  let mmp_dict = {
    //冰球
    4: [
      { mmp: "1", stage: 1 },
      { mmp: "301", stage: 2 },
      { mmp: "2", stage: 2 },
      { mmp: "302", stage: 3 },
      { mmp: "3", stage: 3 },
    ],
    //网球
    5: [
      { mmp: "8", stage: 1 },
      { mmp: "9", stage: 2 },
      { mmp: "10", stage: 3 },
      { mmp: "11", stage: 4 },
      { mmp: "12", stage: 5 },
    ],
    //美足
    6: [
      { mmp: "13", stage: 1 },
      { mmp: "301", stage: 2 },
      { mmp: "14", stage: 2 },
      { mmp: "302", stage: 3 },
      { mmp: "15", stage: 3 },
      { mmp: "303", stage: 4 },
      { mmp: "16", stage: 4 },
    ],
    //乒乓球
    8: [
      { mmp: "8", stage: 1 },
      { mmp: "301", stage: 2 },
      { mmp: "9", stage: 2 },
      { mmp: "302", stage: 3 },
      { mmp: "10", stage: 3 },
      { mmp: "303", stage: 4 },
      { mmp: "11", stage: 4 },
      { mmp: "304", stage: 5 },
      { mmp: "12", stage: 5 },
      { mmp: "305", stage: 6 },
      { mmp: "441", stage: 6 },
      { mmp: "306", stage: 7 },
      { mmp: "442", stage: 7 },
    ],
    //排球
    9: [
      { mmp: "8", stage: 1 },
      { mmp: "301", stage: 2 },
      { mmp: "9", stage: 2 },
      { mmp: "302", stage: 3 },
      { mmp: "10", stage: 3 },
      { mmp: "303", stage: 4 },
      { mmp: "11", stage: 4 },
      { mmp: "304", stage: 5 },
      { mmp: "12", stage: 5 },
      { mmp: "305", stage: 6 },
      { mmp: "441", stage: 6 },
      { mmp: "306", stage: 7 },
      { mmp: "442", stage: 7 },
    ],
    // 羽毛球
    10: [
      { mmp: "8", stage: 1 },
      { mmp: "301", stage: 2 },
      { mmp: "9", stage: 2 },
      { mmp: "302", stage: 3 },
      { mmp: "10", stage: 3 },
      { mmp: "303", stage: 4 },
      { mmp: "11", stage: 4 },
      { mmp: "304", stage: 5 },
      { mmp: "12", stage: 5 },
    ],
  };
  let dict = mmp_dict[csid];
  let stage = mct;
  dict.forEach((item) => {
    if (item.mmp == mmp) {
      stage = item.stage;
    }
  });
  return stage;
};

//【斯诺克】——根据mct
// 7: [0, ...many_key],
