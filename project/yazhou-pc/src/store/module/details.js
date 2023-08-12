/**
 * @Author: cooper
 * @Date: 2023-08-11 18:13:55
 * @Description: 详情页相关状态管理器
 */

const initialState = {
  search_isShow: false, //是否显示搜索组件
  is_back_btn_click: false, //// 点返回按钮 返到列表
  is_unfold_multi_column: false, //是否展开多列玩法
};

export default function detailsReducer(state = initialState, action) {
  switch (action.type) {
    //保存显示搜索组件状态
    case "SET_SEARCH_STATUS":
      return { ...state, search_isShow: action.data };
    // 告知列表是否是从详情页返回的
    case "SET_IS_BACK_BTN_CLICK":
      return { ...state, is_back_btn_click: action.data };
     //收起右侧详情 展开多列玩法
    case "set_unfold_multi_column":
      return { ...state, is_unfold_multi_column: action.data };
    default:
      return state;
  }
}
