/*
 * @Author: cooper
 * @Date: 2023-07-29 14:33:39
 * @FilePath: \user-pc-vite\src\core\match-detail\match-detail.js
 * @Description:
 */
import lodash from "lodash";
import { MatchDetailCalss }  from "src/output/module/project-single.js"
import GlobalAccessConfig from "src/core/access-config/access-config.js"
import GlobalSwitchClass  from "src/core/global/global.js";
import {
  UserCtr
 } from "src/output/index.js";
//统计分析URL
const signal_url = "https://s5.sir.swiftscore.com";

  /**
  * @Description:给比分设置初始值
  * @param {Object} score 比分数据
  * @param {array} key  比分key
  * @param {boolean} is_zero 比分无数据是否设置为0
  */
 const init_score=(score,key,is_zero)=>{
    let zero = is_zero ? {home:0,away:0} : {home:'',away:''}
    key.forEach( item => {
      if(!score[item]){
        score[item] = zero
      }
    })
  }
/**
 *
 * @param {*} data 接口返回的整个 data 对象
 * @returns msc: ["S1|48:52"] => msc: {S1:{home: 48,away: 52}}
 * @Description: 主要是将详情数据msc 转化为 对象形式，便于数据分析与比分榜使用
 */
const build_msc = (data) => {
  let obj = {};
  let msc = lodash.get(data, "msc", []);
  if (!lodash.isEmpty(msc) && lodash.isArray(msc)) {
    let msc_array = lodash.cloneDeep(msc);
    lodash.forEach(msc_array, (item) => {
      let format = item.split("|");
      // 比分格式判断
      if (
        !lodash.isEmpty(format) &&
        !lodash.isEmpty(format[0]) &&
        !lodash.isEmpty(format[1]) &&
        lodash.includes(format[1], ":")
      ) {
        let score_type = format[0]; // 比分类型
        let score_arr = format[1].split(":"); // 比分类型对应的比分
        // 主队比分
        let home = lodash.get(score_arr, "0", "0");
        // 客队比分
        let away = lodash.get(score_arr, "1", "0");
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

/**
 * @是否显示赛事分析统计版块
 * @param {Object} match_infoData 赛事详情数据
 * @return {boolean} 筛选后的玩法数据
 * @Description:global_switch 全局开关，到时候修改为状态管理引入
 */
const show_wrap_total = (match_infoData) => {
  return (
    match_infoData.mcg == 1 &&
    [1, 2, 3, 4, 6, 5, 7, 9, 10].includes(
      +lodash.get(match_infoData, "csid")
    ) &&
    GlobalSwitchClass.global_switch.statistics_switch &&
    match_infoData.cds !== "RC"
  );
};

/**
 * @Description:sr 分析数据点击跳转
 * @Author Cable
 * @param:match 赛事详情
 * @return:
 */
const sr_click_handle = (match) => {

  let full_url = get_full_sr_url(match); // seid,match.srid
  if (!GlobalAccessConfig.get_statisticsSwitch())
    return window.vue.useMittEmit(
      window.vue.MITT_TYPES.EMIT_SHOW_TOAST_CMD,
      window.vue.i18n_t("msg.msg_09")
    );
  if ([1, 2].includes(match.csid * 1)) {
    full_url = `/#/analysis_header/${match.csid}/${match.mid}`; // seid,match.srid
     // 保存数据,用于接口报错时填充
     MatchDetailCalss.set_active_detail((match))
  }

  let _window_width = 1000;
  let _window_height = 650;
  let _window_offset_left = (screen.width - _window_width) / 2;
  let _window_offset_top = (screen.height - _window_height) / 2;
  if (full_url) {
    window.open(
      full_url,
      "",
      `height=${_window_height}, width=${_window_width},
      top=${_window_offset_top}, left=${_window_offset_left},
      toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
    );
    return full_url;
  }
};
/**
 * @Description:获取数据分析url
 * @Author Cable
 * @param:match 赛事详情
 * @return:
 */
const get_full_sr_url = (match) => {
  let csid = lodash.get(match, "csid");
  let srid = lodash.get(match, "srid");
  if (!csid || !srid) return "";

  let csid_translate = csid,
    sr_prev = "";
  csid *= 1;
  switch (csid) {
    case 1: // 足球
    case 2: // 篮球
    case 5: // 网球
      csid_translate = csid;
      break;
    case 7:
      csid_translate = 19; // 斯诺克
      break;
    case 8:
      csid_translate = 20; // 乒乓球
      break;

    case 3:
      csid_translate = 3; // 棒球
      break;
    case 4:
      csid_translate = 4; // 冰球
      break;
    case 6:
      csid_translate = 16; // 美式足球
      break;
    case 9:
      csid_translate = 23; // 排球球
      break;

    case 10:
      csid_translate = 31; // 羽毛球
      break;
  }
  let sr_lang = get_src_lang();
  sr_prev = `/kaihongman/${sr_lang}/${csid_translate}/match/${srid}`;
  //`https://s5.sir.swiftscore.com/kaihongman/zh/${csid_translate}/match/${srid}`

  return `${signal_url}${sr_prev}`;
};
/**
 * @description: 将PC的语言类型转换成SR对应的语言类型
 */
const get_src_lang = () => {
  let all_sr_lang = {
    en: "en", // 英文
    th: "th",
    zh: "zh", // 简体中文
    tw: "zht", // 繁体中文
    vi: "vi",
    ms: "ms", // 马来语
    de: "de",
    fr: "fr",
    ko: "ko",
    ja: "ja",
    es: "es",
    ad: "ad", // 印尼语
  };
  return all_sr_lang[UserCtr.lang]; 
};

/**
 * 玩法集瀑布流，设置单列或双列的数据[[]] / [[],[]]
 * @return {undefined} undefined
 *
 * is_hide_panel 判断列表是否是全部展开或收起状态
 * 如果是全部收起，就直接把玩法左右各放一半
 * 如果不是，就左右各放一个然后计算高度栏判断放在哪一边
 */
const set_waterfall = (res, is_hide_panel) => {
  if (!res.length) return;
  // 双列左边
  let left_array = [];
  // 双列右边
  let right_array = [];
  // 左侧玩法个数
  let left_row = 0;
  // 右侧玩法个数
  let right_row = 0;
  //收起状态
  if (is_hide_panel) {
    res.forEach((item, index) => {
      if (index % 2) {
        right_array.push(item);
      } else {
        left_array.push(item);
      }
    });
  } else {
    //展开状态
    res.forEach((item, index) => {
      if (index == 0) {
        //第一条数据插入左边
        left_array.push(item);
        left_row = get_play_rows(item);
      } else if (index == 1) {
        //第二条数据插入右边
        right_array.push(item);
        right_row += get_play_rows(item);
      } else {
        //从第三条开始计算左右总高度，判断插入
        if (left_row <= right_row) {
          left_row += get_play_rows(item);
          left_array.push(item);
        } else {
          right_row += get_play_rows(item);
          right_array.push(item);
        }
      }
    });
  }
  return [left_array, right_array];
};
/**
 * 获取单个玩法的行数
 * @return {undefined} undefined
 */
const get_play_rows = (data) => {
  let num = 0; //玩法条数
  let row = 0; //玩法显示的行数
  data.hl.forEach((item) => {
    if (item && item.ol) {
      num += item.ol.length;
    }
  });
  if ([0, 2, 3, 5, 6].includes(data.hpt)) {
    [5, 6].includes(data.hpt)
      ? (row = Math.ceil(num / 2) + 1)
      : (row = Math.ceil(num / 2));
  } else if ([1, 4, 7, 8, 10].includes(data.hpt)) {
    [4, 8].includes(data.hpt)
      ? (row = Math.ceil(num / 3) + 1)
      : (row = Math.ceil(num / 3));
  } else if ([9].includes(data.hpt)) {
    row = Math.ceil(num / 5) + 1;
  }
  return row;
};

/**
  * @Description:根据球种id获取球种英文名
  * @Author Cable
  * @param:csid 球种id
  * @return:球种英文名
  */
const get_sports_en = (csid)=>{
  if(csid == 1) return 'football'         //足球
  if(csid == 2) return 'basketball'     //篮球
  if(csid == 3) return 'baseball'     //棒球
  if(csid == 4) return 'iceball'       //冰球
  if(csid == 5) return 'tennis'        //网球
  if(csid == 6) return 'americaball'   //美式足球
  if(csid == 7) return 'snooker'       //斯诺克
  if(csid == 8) return 'pingpong'      //兵乓球
  if(csid == 9) return 'volleyball'    //排球
  if(csid == 10) return 'badminton'     //羽毛球
  if(csid == 17) return 'gaming'        //竞技
  return ''
};

export default {
  build_msc,
  check_plays,
  use_polling_mst,
  show_wrap_total,
  sr_click_handle,
  set_waterfall,
  init_score,
  get_sports_en
};
