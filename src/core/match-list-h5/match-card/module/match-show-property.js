import MatchCtr from "src/core/match-list-h5/match-class/match-ctr.js";
import store from "src/store-redux/index.js";
import { MenuData} from "src/output/project/index.js"
import PageSourceData from "src/core/page-source/page-source.js";

const main_menu_type = 3
//是否显示次要玩法头部
let is_show_secondary_head = (i) => {
  let match = MatchCtr.match_list_data_sources[i];
  let {
    cosCorner,
    cosOvertime,
    cosPenalty,
    cosPromotion,
    cosBold,
    cosOutright,
    cosPunish,
    hpsAdd,
    cos15Minutes,
    cos5Minutes,
  } = match;
  let flag =
    cosCorner ||
    cosOvertime ||
    cosPenalty ||
    cosPromotion ||
    cosBold ||
    cosOutright ||
    cosPunish ||
    cos15Minutes ||
    cos5Minutes ||
    (hpsAdd && hpsAdd.length);
  if (PageSourceData.get_newer_standard_edition() == 1) {
    flag = false;
  }
  if (
    ["detail_match_list", "home_hot_page_schedule"].includes(
      PageSourceData.page_source
    )
  ) {
    flag = false;
  }
  return flag;
};
//显示体育类型
let show_sport_type = (i) => {
  let match = MatchCtr.match_list_data_sources[i];
  let flag = false;
  if (
    [1, 2, 3, 4, 11, 12, 28, 30, 3000].includes(main_menu_type) ||
    (_.get(MenuData.current_menu, "main") == 28 &&
      _.get(MenuData.current_menu, "sub.menuType") == 29)
  ) {
    if (i > 0) {
      let p = MatchCtr.match_list_data_sources[i - 1],
        c = MatchCtr.match_list_data_sources[i];
      if (p && c) {
        flag = p.csid !== c.csid;
      }
    } else {
      flag = true;
    }
  } else {
    flag = false;
  }
  if (flag) {
    match.show_sport_type = true;
  } else {
    match.show_sport_type = false;
  }
  return flag;
};
//是否显示联赛
let is_show_league = (i) => {
  let match = MatchCtr.match_list_data_sources[i];
  let flag = false;
  // 当前赛事
  let curr = MatchCtr.match_list_data_sources[i];
  // 虚拟体育没有tid而是tnameCode
  let property_key = "tnameCode";
  if (!curr[property_key]) {
    property_key = "tid";
  }
  if (i == 0) {
    flag = true;
  } else {
    // 前一个赛事
    let prev = MatchCtr.match_list_data_sources[i - 1];
    // 如果显示  赛事未开赛标题， 或者是  上一次和这一次tid 不一样  则显示联赛标题高度
    if (is_show_no_play(i) || curr[property_key] != prev[property_key]) {
      flag = true;
    }
  }
  if (flag) {
    match.is_show_league = true;
  } else {
    match.is_show_league = false;
  }
  return flag;
};
//赛事未开赛标题
let is_show_no_play = (i) => {

  let match = MatchCtr.match_list_data_sources[i];
  let result = false;
  // 详情页，或者  非今日串关不显示
  if (
    PageSourceData.page_source == "detail_match_list" ||
    ![3, 11].includes(main_menu_type)
  ) {
    return false;
  }
  //串关时,日期为今日才显示
  else if (main_menu_type == 11) {
    let third_m_id = _.get(MenuData.current_menu, "date_menu.field1");
    //串关今日id为0或'0'
    if (third_m_id !== 0 && third_m_id !== "0") {
      return result;
    }
  }
  if (match) {
    //如果大于第一个赛事
    if (i > 0) {
      let prev_match = MatchCtr.match_list_data_sources[i - 1]; // 上一个赛事
      //当前赛事是 1:已开赛（滚球）  110:即将开赛  不显示未开赛标题
      //当前赛事是进行中,不显示未开赛标题
      if ([1, 110].includes(+match.ms)) {
        result = false;
      } else if (
        ![1, 110].includes(+match.ms) &&
        [1, 110].includes(+prev_match.ms)
      ) {
        //否则当前赛事为未开赛并且上一赛事是进行中则,显示未开赛标题
        result = true;
      }
    }
    //如果是第一个赛事并且是未开赛则显示未开赛标题
    else if (i == 0 && ![1, 110].includes(+match.ms)) {
      result = true;
    }
  }
  if (result) {
    match.is_show_no_play = true;
  } else {
    match.is_show_no_play = false;
  }
  return result;
};
// 是折叠
let is_collapse = (i) => {
  const state = store.getState()
  let match = MatchCtr.match_list_data_sources[i];
  let flag = false;
  let collapse_key = match.tid;
  if (state.topMenuReducer.collapse_map_match[collapse_key] == 1) {
    //折叠
    flag = true;
  } else {
    //展开
    flag = false;
  }
  return flag;
};
//显示次要玩法投注项
let show_secondary_play_list = (i) => {
  const state = store.getState()
  let result = 0;
  if (is_collapse(i)) {
    return result;
  }
  let match = MatchCtr.match_list_data_sources[i];
  // 次要玩法展开映射
  let mapping = state.matchReducer.secondary_unfold_map[match.mid];
  if (mapping) {
    let list_play_id = mapping.split("-")[0];
    let status = mapping.split("-")[1];
    // 如果是展开
    if (status == 1) {
      result = list_play_id;
      // 如果是波胆玩法，获取 投注项的 数量
      if (result == 18) {
        number_of_bets = mapping.split("-")[2];
      } else if (result == 19) {
        number_of_bets = mapping.split("-")[2];
        // 时间超过30分钟（含）后
        if (number_of_bets == 4 && match.mst >= 30 * 60) {
          number_of_bets = 3;
        }
      }
    }
  }
  // 赛果,精选赛事,简版,首页热门赛事,详情页推荐赛事都不显示次要玩法
  if (
    ["detail_match_list", "home_hot_page_schedule"].includes(
      PageSourceData.page_source
    ) ||
    main_menu_type == 28 ||
    PageSourceData.get_newer_standard_edition() == 1
  ) {
    result = 0;
  }
  if (!is_show_secondary_head(i)) {
    result = 0;
  }
  return result;
};
const is_show_time_title = () => {
  return (
    PageSourceData.page_source == "home_hot_page_schedule" && match.time_title
  );
};
// 获取赛事对应的dom显示区域属性
export const get_match_dom_show_property = (i) => {
  let main_menu_type = +MenuData.get_menu_type();
  let match = MatchCtr.match_list_data_sources[i];
  // 5分钟玩法，波胆玩法 要展开的行数
  let number_of_bets = 0;
  if (!match) {
    return {};
  }
  return {
    mid: match.mid,
    is_show_league: is_show_league(i),
    is_show_secondary_head: is_show_secondary_head(i),
    is_collapse: is_collapse(i),
    is_show_no_play: is_show_no_play(i),
    show_sport_type: show_sport_type(i),
    show_secondary_play_list: show_secondary_play_list(i),
    menu_type: main_menu_type,
    is_newer_edition: PageSourceData.get_newer_standard_edition() == 1,
    is_show_time_title: is_show_time_title(),
    invok_source: PageSourceData.page_source,
    sub_menu_type: MenuData.get_current_lv_2_menu_type(),
    index: i,
    number_of_bets: number_of_bets,
  };
};


