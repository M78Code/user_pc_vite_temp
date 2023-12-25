import lodash from "lodash";
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";

/**
 * @Description 设置默认模板
 * @param {Number} num 列数
 * @param {Number} ol_count 投注项数量
 */
export const set_default_tpl = (num,  ol_count = 3) => {
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
};
//单节15分钟玩法
export const hps_15_minute = [
  {
    ols: [
      {  _hpid: 32, ot: "1" },
      {  _hpid: 32, ot: "2" },
      {  _hpid: 32, ot: "X" },
    ],
  },
  {
    ols: [
      {  _hpid: 33, ot: "1" },
      {  _hpid: 33, ot: "2" },
      { empty:1}
    ],
  },
  {
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
  bet_col_count: 6,
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
  if (is_iframe) {
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
  if (is_iframe) {
    config.team_width = config.process_team_width - 56;
  } else {
    config.team_width = config.process_team_width - 77;
  }
  return config;
};


// yazhou-h5 赛事样式模板
const match_style_template_yazhou = {
  // 赛事阶段高度 （开赛、未开赛）
  match_stage_height: 25,
  // 球种标题高度
  ball_title_height: 20,
  // 联赛标题高度
  show_league_height: 40,
  // 赛事标题高度
  match_title_height: 30,
  // 主盘口高度
  main_handicap_height: 110,
  // 次要玩法标题高度
  play_title_height: 36,
  // 次要玩法盘口默认高度
  tab_play_total_height: 111,
  // 是否需要动态计算高度
  is_dynamic_compute_height: false,
  // 需要减去的缓冲容器高度， 避免 margin 导致的骨架图漏光； 作用： 使赛事之间想叠
  reduce_buffer_height: 5
}

// app-h5 赛事样式模板
const match_style_template_app = {
  // 赛事阶段高度 （开赛、未开赛）
  match_stage_height: 25,
  // 球种标题高度
  ball_title_height: 20,
  // 联赛标题高度
  show_league_height: 25,
  // 玩法标题高度
  playing_title_height: 20,
  // 主盘口高度
  main_handicap_height: 133,
  // 需要减去的缓冲容器高度， 避免 margin 导致的骨架图漏光； 作用： 使赛事之间想叠
  reduce_buffer_height: 8
}

// ouzhou-h5 赛事样式模板
const match_style_template_ouzhou = {
  // 球种标题高度
  ball_title_height: 50,
  // 联赛标题高度
  show_league_height: 36,
  // 玩法标题高度
  playing_title_height: 0,
  // 主盘口高度
  main_handicap_height: 90,
  // 因欧洲版不需要 margin 所以缓冲容器 为 0
  reduce_buffer_height: 0
}

const template_config = {
  'app-h5': match_style_template_app,
  'yazhou-h5': match_style_template_yazhou,
  'ouzhou-h5': match_style_template_ouzhou,
}

const { PROJECT_NAME = 'yazhou-h5' } = BUILD_VERSION_CONFIG

export const match_style_template = template_config[PROJECT_NAME]

// 赛事样式模板
// export const match_style_template = {
//   // 角球标题高度
//   tab_play_title_height: 0,
//   // 角球盘口高度
//   tab_play_handicap_height: 0,
//   // 主盘口高度
//   main_handicap_height: 110,
//   // 当前局玩法高度
//   cur_handicap_height:0,
//   // 是否需要动态计算高度
//   is_dynamic_compute_height:false,
// }