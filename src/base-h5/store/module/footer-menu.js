/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 欧宝底部菜单
 */

  const initialState = {
    // 排序类型 1-热门排序,2-时间排序 默认是热门排序
    sort_type: 1,
    // 注单弹框
    settle_dialog_bool:false,
    // 滚到顶部
    goto_list_top: 0,
    // 页脚子菜单id
    footer_sub_menu_id :'',
    // 页脚子菜单变化
    footer_sub_changing:false,
    // 显示收藏列表
    show_favorite_list:false,
    // 显示筛选功能
    show_match_filter:false,
  }
  export default function footerMenuReducer(state = initialState, action) {
    switch (action.type) {
      // 设置主题
      case "SET_SORT_TYPE":
        return { ...state, sort_type: action.data };
      case "SET_SETTLE_DIALOG_BOOL":
        return { ...state, settle_dialog_bool: action.data };
      case "SET_GOTO_LIST_TOP":
        return { ...state, goto_list_top: action.data };
      case "SET_FOOTER_SUB_MENU_ID":
        return { ...state, footer_sub_menu_id: action.data };
      case "SET_FOOTER_SUB_IDCHANGING":
        return { ...state, footer_sub_changing: action.data };
      case "SET_SHOW_FAVORITE_LIST":
        return { ...state, show_favorite_list: action.data };
      case "SET_SHOW_MATCH_FILTER":
        return { ...state, show_match_filter: action.data };
      default:
        return state;
    }
  }
  // getters: {
  //   get_show_match_filter(state){
  //     return state.show_match_filter;
  //   },
  //   get_show_favorite_list(state){
  //     return state.show_favorite_list;
  //   },
  //   get_footer_sub_menu_id(state){
  //     return state.footer_sub_menu_id;
  //   },
  //   get_footer_sub_changing(state){
  //     return state.footer_sub_changing;
  //   },
  //   get_sort_type(state) {
  //     return state.sort_type;
  //   },
  //   get_settle_dialog_bool(state) {
  //     return state.settle_dialog_bool;
  //   },
  //   get_goto_list_top(state){
  //     return state.goto_list_top;
  //   }
  // },
  // actions: {
  //   set_sort_type({ commit }, obj) {
  //     commit("set_sort_type", obj);
  //   },
  //   // set_settle_dialog_bool({ commit }, obj) {
  //   //   commit("set_settle_dialog_bool", obj);
  //   // },
  // },
  // mutations: {
  //   set_show_match_filter(state,v){
  //     state.show_match_filter = v;
  //   },
  //   set_sort_type(state, type) {
  //     state.sort_type = type;
  //   },
  //   set_show_favorite_list(state,v){
  //     state.show_favorite_list = v;
  //   },
  //   set_settle_dialog_bool(state, type) {
  //     state.settle_dialog_bool = type;
  //   },
  //   set_goto_list_top(state,value){
  //     state.goto_list_top = value;
  //   },
  //   set_footer_sub_menu_id(state,value){
  //     state.footer_sub_menu_id = value;
  //   },
  //   set_footer_sub_changing(state,value){
  //     state.footer_sub_changing = value;
  //   }
  // }
