/**
 * 初始化一些数据js
 */

/**
 *映射store内部的方法
 */
import { api_common } from "src/api/";
const methods_map_store = [
  "set_odds_coversion_map",
  "SET_INIT_ODD",
  "SET_INIT_MATCH_SORT",
  "SET_SHOW_FILTER_POPUP",
  "SET_MATCH_DETAILS_PARAMS",
  "SET_GLOBAL_SWITCH",
].reduce((obj, type) => {
  obj[type] = (data) => {
    store.dispatch({ type, data });
  };
  return obj;
}, {});
/**
 * @description 获取赔率转换表数据
 * @return {undefined} undefined
 */
(function () {
  api_common.get_fetch_odds_conversion().then((res) => {
    let code = get(res, "data.code") || "";
    if (code == 200) {
      let data = get(res, "data.data") || "";
      methods_map_store["set_odds_coversion_map"](data);
    }
  });
});
//初始化盘口偏好
methods_map_store["SET_INIT_ODD"]();
//初始化列表排序
methods_map_store["SET_INIT_MATCH_SORT"]();
//设置显示联赛筛选框显示状态
methods_map_store["SET_SHOW_FILTER_POPUP"](false);
//详情右侧参数
methods_map_store["SET_MATCH_DETAILS_PARAMS"]({});
// // 进入首页
//gtag打点
// utils.gtag_view_send('PC_home', '/home')
data_ref.first_load = true;
get_access_config();

/**
 * @Description 获取全局配置开关
 * @param {undefined} undefined
 */
(function () {
  api_common
    .get_access_config()
    .then((res) => {
      let data = get(res, "data.data", {});
      if (!data) return;
      let {
        //热门推荐
        hotRecommend: hot_recommend = true,
        //统计
        statisticsSwitch: statistics_switch = true,
        //收藏
        collectSwitch: collect_switch = true,
        //近期
        recentSwitch: recent_switch = true,
        //活动
        activitySwitch: activity_switch = true,
        //搜索
        searchSwitch: search_switch = true,
        //联赛筛选
        filterSwitch: filter_switch = true,
        //盘口数量
        handicapNum: handicap_num = true,
        //热门赛事
        hotMatchNum: hot_match_num = true,
        //排序
        sortCut: sort_cut = true,
        //滚球全部
        playAllShow: play_all_show = true,
        //多列
        multiColumn: multi_column = true,
      } = data;
      methods_map_store["SET_GLOBAL_SWITCH"]({
        hot_recommend,
        statistics_switch,
        collect_switch,
        recent_switch,
        activity_switch,
        search_switch,
        filter_switch,
        handicap_num,
        hot_match_num,
        sort_cut,
        play_all_show,
        multi_column,
      });
    })
    .catch((err) => console.error(err));
});
