import BaseUserInfo from "src/core/user-config/base-user-info.js";

const initialState = {
  //即将开赛筛选时间
  open_select_time: null,    
  // 显隐联赛筛选弹层
  show_filter_popup: false,
  // 选择的筛选数据
  filter_select_obj: [],
  // 上次筛选信息
  pre_filter_select_obj: [],
  //联赛筛选是否全选
  filter_checked_all:true,
  pre_filter_checked_all:true,
  // 获取选中的赛事数量(列表右上角赛选功能)
  checked_count: 0,
  collect_count:0  //收藏数量
}

export default function filterReducer(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    // 设置语言
    case "设置收藏数量":
      return {...state, collect_count: data };
    // 设置显示联赛筛选框显示状态
    case "SET_SHOW_FILTER_POPUP":
      return { ...state, show_filter_popup: data };
    // 保存选择的筛选数据
    case "SET_FILTER_SELECT_OBJ":
      return { 
        ...state, 
        checked_count: data.length, 
        filter_select_obj: data, 
        pre_filter_select_obj: data, 
      };
    // 设置联赛筛选全选状态
    case "SET_FILTER_CHECKED_ALL":
      return { 
        ...state, 
        pre_filter_checked_all: state.filter_checked_all,
        filter_checked_all: data,
      };
    // 清空筛选数据 设置全选
    case "SET_REMOVE_FILTER_CONDITION":
      return { 
        ...state, 
        filter_select_obj: [],
        filter_checked_all: true,
        pre_filter_checked_all: true,
        checked_count: 0
      };
    // 清空上次筛选数据
    case "REMOVE_PRE_FILTER_SELECT_OBJ":
      return { ...state, pre_filter_select_obj: [] };
    // 保存赛事选中数量
    case "SET_CHECKED_COUNT":
      return { ...state, checked_count: data || 0 };
    default:
      return state;
  }
}