/*
 * @Author: cooper
 * @Date: 2023-07-29 14:33:39
 * @FilePath: \user-pc-vite\src\core\match-detail\match-detail.js
 * @Description:
 */
import _ from "lodash";

/**
 *
 * @param {*} data 接口返回的整个 data 对象
 * @returns msc: ["S1|48:52"] => msc: {S1:{home: 48,away: 52}}
 * @Description: 主要是将详情数据msc 转化为 对象形式，便于数据分析与比分榜使用
 */
const build_msc = (data) => {
  let obj = {};
  let msc = _.get(data, "msc", []);
  if (!_.isEmpty(msc) && _.isArray(msc)) {
    let msc_array = _.cloneDeep(msc);
    _.forEach(msc_array, (item) => {
      let format = item.split("|");
      // 比分格式判断
      if (
        !_.isEmpty(format) &&
        !_.isEmpty(format[0]) &&
        !_.isEmpty(format[1]) &&
        _.includes(format[1], ":")
      ) {
        let score_type = format[0]; // 比分类型
        let score_arr = format[1].split(":"); // 比分类型对应的比分
        // 主队比分
        let home = _.get(score_arr, "0", "0");
        // 客队比分
        let away = _.get(score_arr, "1", "0");
        // 比分对象
        obj[score_type] = {
          home,
          away,
          percentage: 0,
        };
        // 主队和客队必须有一个不为0
        if (!(home == 0 && away == 0)) {
          //统计面板百分比计算
          // 计算主队得分的所占百分比
          if (
            ["S17", "S18", "S1101", "S108", "S107", "S110"].includes(score_type)
          ) {
            obj[score_type].percentage = parseInt(
              (parseInt(obj[score_type].home) /
                (
                  parseInt(obj[score_type].home) +
                  parseInt(obj[score_type].away)
                ).toFixed(2)) *
                100
            );
          } else {
            // 计算客队得分所占的百分比
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
      }
    });
  }
  return obj;
};

/**
 * @判断玩法是否关盘
 * @param {Object} plays 盘口数据
 * @return {undefined} 是否展示模板
 */
const check_plays = (plays) => {
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
 * @根据分类id过滤玩法数据
 * @param {Object} id tabs id
 * @return {detail_list} 筛选后的玩法数据
 * @Description:category_list 分类列表，all_list 所有玩法数据
 */
const getDetaillist = (value) => {
  const detail_list = [];
  const plays = category_list.find((item) => item.orderNo == value).plays;
  let list = all_list.filter((item) => plays.includes(Number(item.hpid)));
  list = list.filter((i) => i.hpn);
  detail_list = list || [];
  return detail_list;
};

/**
 * @name 开赛时间自动加1
 * @param
 * @param {*} t
 */
const use_polling_mst = (payload, mst_timer) => {
  if (Number(payload.mst) <= 0 || payload.ms !== 1) {
    return;
  }
  // payload.mst = Number(payload.mst)+10
  mst_timer = setInterval(() => {
    if (payload.csid == 1) {
      payload.mst++;
    } else if (payload.csid == 2) {
      if (Number(payload.mst) == 1) {
        clearInterval(mst_timer);
      }
      payload.mst--;
    }
    payload.mstValue = format_mst_data(payload.mst);
  }, 1000);
};

// 开赛时间转换 分：秒
const format_mst_data = (mst) => {
  const m = String(Math.floor(mst / 60)).padStart(2, "0");
  const s = String(Math.floor(mst % 60)).padStart(2, "0");
  return `${m}:${s}`;
};

export default {
  build_msc,
  check_plays,
  getDetaillist,
  use_polling_mst,
};
