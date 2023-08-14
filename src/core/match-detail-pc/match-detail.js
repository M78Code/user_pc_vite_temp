/*
 * @Author: cooper
 * @Date: 2023-07-29 14:33:39
 * @FilePath: \user-pc-vite\src\core\match-detail\match-detail.js
 * @Description:
 */
import lodash from "lodash";


  //统计分析URL
 const signal_url = 'https://s5.sir.swiftscore.com'

/**
 * 初始化数据
 */
const init = async () => {
  await get_category(); // 获取玩法集
  await get_detail(); // 获取赛事详情数据
  await get_detail_lists(); // 获取玩法列表
};

/**
 * 获取赛玩法集数据
 * @param {*} mid 赛事id,sportId 球种id
 */
const get_category = async (sportId,mid) => {
  try {
    const params = {
      sportId,
      mid,
      t: new Date().getTime(),
    };
    const res = await get_detail_category(params);
    category_list.value = res.data.data || [];
    const list = res.data.data.filter((i) => i.marketName);
    tabList.value = list.map((item) => ({
      label: item.marketName,
      value: item.orderNo,
    }));
  } catch (error) {}
};

  /**
   * 获取赛事玩法列表数据
   * @param {*} mid 赛事id
   */
  const get_detail_lists = async (mid) => {
    return new Promise(async (resolve)=>{
      const params = {
        mcid: 0,
        cuid: userInfo.userId,
        mid,
        newUser: 0,
        t: new Date().getTime(),
      };
      const res = await get_detail_list(params);
      resolve(res.data.data || [])
    }).catch(err=>{})
  };

   /**
   * 获取赛事详情数据
   * @param {*} mid 赛事id
   */
   const get_detail = async (mid) => {
    return new Promise(async (resolve)=>{
      const params = {
        mid,
        cuid: userInfo.userId,
        t: new Date().getTime(),
      };
      const res = await get_detail_data(params);
      resolve(res.data.data || [])
    }).catch(err=>{})
  };

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
 * @根据分类id过滤玩法数据
 * @param {Object} id tabs id
 * @return {detail_list} 筛选后的玩法数据
 * @Description:category_list 分类列表，all_list 所有玩法数据
 */
const getDetaillist = (value) => {
  let detail_list = [];
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

/**
 * @是否显示赛事分析统计版块
 * @param {Object} match_infoData 赛事详情数据
 * @return {boolean} 筛选后的玩法数据
 * @Description:get_global_switch 全局开关，到时候修改为状态管理引入
 */
const show_wrap_total = (match_infoData) => {
  return (
    match_infoData.mcg == 1 &&
    [1, 2, 3, 4, 6, 5, 7, 9, 10].includes(+lodash.get(match_infoData, "csid")) &&
    get_global_switch.statistics_switch &&
    match_infoData.cds !== "RC"
  );
};

 /**
  * @Description:sr 分析数据点击跳转
  * @Author Cable
  * @param:match 赛事详情
  * @return:
  */
const sr_click_handle=(match)=> {
  let full_url = get_full_sr_url(match) // seid,match.srid
  if(!store.getters.get_global_switch.statistics_switch) return window.vue.$root.$emit(window.vue.emit_cmd.EMIT_SHOW_TOAST_CMD, window.vue.$root.$t("msg.msg_09")); 
  if([1,2].includes(match.csid*1)){
    full_url = `/#/analysis_header/${match.csid}/${match.mid}` // seid,match.srid
    store.dispatch("set_active_detail", match)
  }
  
  let _window_width = 1000
  let _window_height = 650
  let _window_offset_left = (screen.width - _window_width) / 2
  let _window_offset_top = (screen.height - _window_height) / 2

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
  
}
  /**
  * @Description:获取数据分析url
  * @Author Cable
  * @param:match 赛事详情
  * @return:
  */
 const get_full_sr_url=(match)=> {
    let csid = lodash.get(match,'csid')
    let srid = lodash.get(match,'srid')
    if(!csid || !srid) return ''

    let csid_translate = csid, sr_prev = '';
    csid *= 1;
    switch (csid) {
      case 1:                    // 足球
      case 2:                    // 篮球
      case 5:                    // 网球
        csid_translate = csid;
        break;
      case 7:
        csid_translate = 19;   // 斯诺克
        break;
      case 8:
        csid_translate = 20;   // 乒乓球
        break;

      case 3:
        csid_translate = 3;   // 棒球
        break;
      case 4:
        csid_translate = 4;   // 冰球
        break;
      case 6:
        csid_translate = 16;   // 美式足球
        break;
      case 9:
        csid_translate = 23;   // 排球球
        break;

      case 10:
        csid_translate = 31;   // 羽毛球
        break;
    }
    let sr_lang =  get_src_lang();
    sr_prev = `/kaihongman/${sr_lang}/${csid_translate}/match/${srid}`;
    //`https://s5.sir.swiftscore.com/kaihongman/zh/${csid_translate}/match/${srid}`

    return `${signal_url}${sr_prev}`;
  }
    /**
   * @description: 将PC的语言类型转换成SR对应的语言类型
   */
   const get_src_lang=()=> {
      let all_sr_lang = {
        en: "en", // 英文
        th: "th", 
        zh: "zh", // 简体中文
        tw: "zht", // 繁体中文
        vi: "vi",
        ms: "ms",// 马来语
        de: "de", 
        fr: "fr", 
        ko: "ko", 
        ja: "ja", 
        es: "es",
        ad: "ad", // 印尼语
      }
      return all_sr_lang[store.getters.get_lang];  // TODO
    }

export default {
  build_msc,
  check_plays,
  getDetaillist,
  use_polling_mst,
  show_wrap_total,
  sr_click_handle
};
