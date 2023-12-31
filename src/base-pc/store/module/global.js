import { api_common } from "src/api/index.js";
import BaseUserInfo from "src/core/user-config/base-user-info.js";
import { get } from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { DEFAULT_VERSION_NAME } = BUILDIN_CONFIG;
const initialState = {
  version_name: "zhuanye",
  // 当前网站是否处于后台运行中
  vue_hidden_run: false,
 
  // 赛事列表排序 1:按联赛排序 2:按时间排序
  match_sort: 1,
 

  //全局点击事件数
  global_click: 0,
  //catch错误数据
  error_data: "",
  // 是否为非常规菜单选择（搜索关键词点击）
  menu_special_choose: false,
  is_show_banner: false, // 是否显示banner
  is_roll_show_banner: false, // 滚动时是否显示banner
  is_first_introduce_write: false, // 是否完成引导页
  is_unfold_multi_column: false, //是否展开多列玩法
  //列表滚动数据
  retain_scroll_obj: {
    status: false,
    height: 0,
  },
 
  //视频是否展开状态
  is_fold_status: true,
  champion_fold_obj: {},
};
export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    // 设置是否展开多列玩法
    case "SET_UNFOLD_MULTI_COLUMN":
      return {...state, is_unfold_multi_column: action.data };
    // 设置视频是否展开状态
    case "SET_IS_FOLD_STATUS":
      return { ...state, is_fold_status: action.data };
    // 设置保存的滚动数据
    case "SET_RETAIN_SCROLL_OBJ":
      return { ...state, retain_scroll_obj: action.data };
    //全局开关
  
    // //是否展开多列玩法
    case "SET_UNFOLD_MULTI_COLUMN":
      return { ...state, is_unfold_multi_column: action.data };

    // //设置非常规菜单选择（搜索关键词点击）
    case "SET_MENU_SPECIAL_CHOOSE":
      return { ...state, menu_special_choose: action.data };
 
    // //初始化列表排序
    case "SET_INIT_MATCH_SORT":
      // let match_sort = localStorage.getItem("match_sort") || state.match_sort
      // localStorage.setItem("match_sort", match_sort)
      // state.match_sort = match_sort
      return state;

    // // 设置列表排序
    case "SET_MATCH_SORT":
      localStorage.setItem("match_sort", action.data);
      return { ...state, match_sort: action.data };
    //设置版本名称
    case "SET_VERSION_NAME":
      localStorage.setItem("version_name", action.data);
      return { ...state, version_name: action.data };

    // //初始化设置版本名称
    case "INIT_VERSION_NAME":
      let version_name = localStorage.getItem("version_name");
      if (!version_name) {
        version_name = DEFAULT_VERSION_NAME;
        localStorage.setItem("version_name", version_name);
      }
      return { ...state, version_name: version_name };
    // //设置网站是否处于后台运行中
    case "SET_VUE_HIDDEN_RUN":
      return { ...state, vue_hidden_run: action.data };
    //设置全局点击事件
    case "SET_GLOBAL_CLICK":
      return { ...state, global_click: state.global_click + 1 };
    // //设置catch错误数据
    case "SET_ERROR_DATA":
      const data = action.data;
      let error_data;
      if (data == "delete") {
        error_data = "";
      } else {
        data.error = data.error || "";
        let error = data.error.toString();
        if (error == "[object Object]") {
          error = JSON.stringify(data.error);
        }
        error_data += "\n" + data.site + "\n" + error;
      }
      return { ...state, error_data };
    // //设置显示列表状态
    case "SET_IS_SHOW_BANNER":
      return { ...state, is_show_banner: action.data };
    // //设置滚动时显示列表状态
    case "SET_IS_ROLL_SHOW_BANNER":
      return { ...state, is_roll_show_banner: state.data };
    // //设置是否完成引导页
    case "SET_IS_FIRST_INTRODUCE_WRITE":
      return { ...state, SET_INIT_ODD: state.data };
    // //设置视频是否展开状态
    case "SET_IS_FOLD_STATUS":
      return { ...state, is_fold_status: state.data };
    //设置冠军卡片收起展开
    case "SET_CHAMPION_FOLD":
      return { ...state, champion_fold_obj: state.data };
    default:
      return { ...state };
  }
}
 