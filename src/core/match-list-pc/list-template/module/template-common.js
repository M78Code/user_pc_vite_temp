

/**
 *   ols 下单个项目  这四个维度不共存 
 *    empty:1, _hpid: 174,     _hpid_fn:(obj)=>{ return 174},
 *    _hpid: 174,  ======    _hpid_fn:(obj)=>174,
 *  场景说明：
 *   empty： 永远空模板 占位 不可能有数据 
 *   _hpid： 单一玩法ID 不变的 
 *   _hpid_fn: 动态计算 
 *             单一时间节点 可能共存的 几个玩法ID  需要根据特殊要求计算的 
 *             单一时间节点 永远不可能共存的 几个玩法ID ，根据 实际赛事阶段计算
 *             
 * 
 * 
 */




import lodash from "lodash";
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'

/**
 * @Description 设置默认模板
 * @param {Number} num 列数
 * @param {Number} ol_count 投注项数量
 */
export const set_default_tpl = (num, ol_count = 3) => {
  let tpl_arr = [];
  if(num){
    for (let index = 0; index < num; index++) {
      let ols = [];
      for (let i = 0; i < ol_count; i++) {
        ols.push({ empty:1});
      }
      tpl_arr.push({ ols });
    }
  }else{
    for (let i = 0; i < ol_count; i++) {
      tpl_arr.push({ empty:1});
    }
  }

  return tpl_arr;
};
/**
 * @Description 修改模板玩法id
 * @param {Number} hpid  玩法id
 * @param {Array} temp_arr  原始模板
 * @param {String} calssName  添加样式
 */
export const update_tpl_hpid = (hpid, temp_arr, calssName) => {
  let new_temp_arr = [];
  lodash.each(temp_arr, (hl) => {
    let ols = [];
    lodash.each(hl.ols, (ol) => {
      let cur_ol_template = { ...ol };
      ol._hpid && (cur_ol_template._hpid = hpid);
      if (calssName && ol.ot === "Other") {
        cur_ol_template.other_class += ` ${calssName}`;
      }
      ols.push(cur_ol_template);
    });
    new_temp_arr.push({ ols });
  });
  return new_temp_arr;
};
/**
 * @Description 克隆数组
 * @param {Array} arr  克隆数组的数组
 */
export const clone_arr = (arr) => {
  let new_arr = [];
  lodash.merge(new_arr, arr || []);
  return new_arr;
};
/**
 * @Description 构建足球附加盘
 * @param {Array} main_temp 主盘
 * @return {Array} add_temp 附加盘
 */
export const created_add_temp_config = (main_temp) => {
  let add_temp = [];
  lodash.each(main_temp, (col) => {
    let ols = col.ols.slice(0, 2);
    add_temp.push({ ols });
  });
  return add_temp;
};
// 投注项模板
export const ol_template = {
  // 投注项ID
  oid: 0,
  // 玩法ID
  _hpid: 0,
  // 投注项ot
  ot: 0,
  // 赔率
  ov: "",
  // 投注项状态
  os: 0,
  // 盘口值
  onb: "",
  // 盘口值
  onbl: "",
  // 盘口ID
  _hid: 0,
  // 盘口状态
  _hs: 0,
  // 赛事级别盘口状态
  _mhs: 0,
  // 投注项坑位
  _hn: "",
  // 投注项自定义class类   'no-handicap' : 无盘口值
  class: "",
  // 附加盘合并到主盘标识  2 3
  // hn:""
};
//单节15分钟玩法
export const hps_15_minute = [
  {
    _hpid: 32,
    ols: [
      {  _hpid: 32, ot: "1", otb: '主胜' },
      {  _hpid: 32, ot: "X", otb: '平局' },
      {  _hpid: 32, ot: "2", otb: '客胜' },
    ],
  },
  {
    _hpid: 33,
    ols: [
      {  _hpid: 33, ot: "1" },
      {  _hpid: 33, ot: "2" },
      { empty:1}
    ],
  },
  {
    _hpid: 34,
    ols: [
      {  _hpid: 34, ot: "Over" },
      {  _hpid: 34, ot: "Under" },
      { empty:1}
    ],
  },
];
// 投注项模板
export const width_config_template = {
  //是否是 iframe 内嵌
  is_iframe: window.frames.length != parent.frames.length,
  // 赛事阶段区域宽度
  process_width: 0,
  // 主客队信息区域宽度
  team_width: 0,
  // 赛事阶段加主客队宽度
  process_team_width: 0,
  // 投注项宽度
  bet_width: 0,
  // 视频按钮区域宽度
  media_width: 0,
  // 投注项数量
  bet_col_count: 4,
};
/**
 * @Description 设置模板table宽度
 * @param {number} total_width 列表总宽度
 */
export const set_template_width_base = (
  total_width,
  config,
  middle_fn = () => {}
) => {
  // 基础信息宽度
  config.process_team_width = parseInt(total_width * 0.292);
  //设置最小宽度
  if (config.process_team_width < 238) {
    config.process_team_width = 238;
  }
  // 视频按钮区域宽度
  config.media_width = parseInt(total_width * 0.06);
  if (total_width < 930) {
    config.media_width = 40;
  }
  if (utils_info.is_iframe) {
    config.process_team_width = 56 + 182;
    config.media_width = 44;
  }
  //  中间方法
  middle_fn(config);
  // 设置投注项宽度
  config.bet_width = parseInt(
    (total_width - config.process_team_width - config.media_width) /
      config.bet_col_count
  );
  // 设置视频区域宽度
  config.media_width =
    total_width -
    config.process_team_width -
    config.bet_width * config.bet_col_count;
  // 设置赛事阶段加主客队宽度
  config.process_team_width = config.process_team_width;
  // 设置主客队信息宽度
  if (utils_info.is_iframe) {
    config.team_width = config.process_team_width - 56;
  } else {
    config.team_width = config.process_team_width - 77;
  }
  return config;
};

/**
 * @Description 设置欧洲版模板table宽度
 * @param {number} total_width 列表总宽度
 * @param {boolean} more_width 是否是滚球
 */
export const set_ouzhou_template_width_base = (
  total_width,
  config,
  more_width
) => {
  // 基础信息宽度
  config.process_team_width = 340;
  // 视频按钮区域宽度
  config.media_width = 46;
  config.play_icon_width = more_width ? 106 : 115;
  // 设置投注项宽度
  config.bet_width = more_width ? 264 : 330;
  // 联赛标题高度
  config.league_title_height = 40;
  return config;
};

// 赛事样式模板
export const match_style_template = {
  // 角球标题高度
  tab_play_title_height: 0,
  // 角球盘口高度
  tab_play_handicap_height: 0,
  // 主盘口高度
  main_handicap_height:105,
  // 附加盘高度
  add_handicap_height:0,
  // 当前局玩法高度
  cur_handicap_height:0,
  // 是否需要动态计算高度
  is_dynamic_compute_height:false,
}

// 欧洲版赛事样式模板
export const match_style_template_ouzhou = {
  // 主盘口高度
  main_handicap_height:80,
  is_dynamic_compute_height: true
}

// 因为我们的欧洲版 
// 赔率模板是不固定的 
// 所以需要抛出一个方法  
// 用于 拿取当前 用户选择的赔率模板
// 这里传入的 是我们的玩法id
export const get_current_odds_list = (main_handicap_list, { first_hpid, second_hpid }) => {
  let first_odds_list = null;
  let second_odds_list = null;
  main_handicap_list.forEach(item => {
    if (first_hpid == item._hpid) {
      first_odds_list = item
    }
    if (second_hpid == item._hpid) {
      second_odds_list = item
    }
  })
  if (!first_odds_list || !second_odds_list) {
    return null
  }
  return [ first_odds_list, second_odds_list ]
}

// 获取hots赔率模板
export const get_hots_odds_list = (main_handicap_list) => {
  return main_handicap_list[0].ols
}