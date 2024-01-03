/**
 * 初始化一些数据js
 */

/**
 *映射store内部的方法
 */
import { api_common } from "src/api/";
// import store from "src/store-redux/index.js";
const methods_map_store = [
 
  "SET_INIT_ODD",
  "SET_INIT_MATCH_SORT",
  "SET_SHOW_FILTER_POPUP",
  "SET_MATCH_DETAILS_PARAMS",
 
].reduce((obj, type) => {
  obj[type] = (data) => {
    // store.dispatch({ type, data });
  };
  return obj;
}, {});
 
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
// gtag_view_send('PC_home', '/home')
 