/*
 * @Description: 赛事 store
 */
const initialState = {
  //赛事对象对应的dom top映射
  match_top_map_dict: {},
  //弹层弹出时window的滚动距离
  show_layer_window_scroll_top: 0,
  //次要玩法展开映射
  secondary_unfold_map: {},
  //次要玩法用户切换展开或收起
  is_user_change_status: false,
  //图标出错与mid映射
  img_error_map_mid: {},
  //足球正在切换第一屏与第二屏
  foot_ball_screen_changing: 0,
  // 列表骨架屏隐藏 或者 显示
  hide_skeleton_screen: true,
  //列表滚动的scroll top值
  list_scroll_top: '',
  //列表滚动方向 0,上滚(大于0),下滚(小于0)
  list_scroll_direction: 0,
  // 赛事列表请求中
  match_list_loading: false,
  // 上滑图标显示
  list_scroll_top_iconshow: true,
  // 短距离滚动标识
  allow_short_scroll: true,
  // 当前基本玩法集展示 0 在左 1 在右  
  standard_odd_status: 0,
  // 赛事筛选信息
  filter_list: {}
};

// handle 集合
const handle_set_state = {
  set_match_list_loading(value) {
    return { match_list_loading: value }
  },
  set_list_scroll_direction(value) {
    return { list_scroll_direction: value } 
  },
  set_list_scroll_top(value) {
    return { list_scroll_top: value } 
  },
  set_list_scroll_top_iconshow(value) {
    return { list_scroll_top_iconshow: value } 
  },
  set_allow_short_scroll(value) {
    return { allow_short_scroll: value } 
  },
  set_foot_ball_screen_changing(value) {
    return { foot_ball_screen_changing: value } 
  },
  set_hide_skeleton_screen(value) {
    return { hide_skeleton_screen: value } 
  },
  set_img_error_map_mid(value) {
    return { img_error_map_mid: value } 
  },
  set_is_user_change_status(value) {
    return { is_user_change_status: value } 
  },
  set_secondary_unfold_map(value) {
    return { secondary_unfold_map: !Object.keys(value).length ? {} : value }
  },
  set_match_top_map_dict(value) {
    return { match_top_map_dict: value } 
  },
  set_standard_odd_status(value) {
    return { standard_odd_status: value } 
  },
  set_filter_list(value){
    return { filter_list: value ? value : {} } 
  }
}

export default function matchReducer(state = initialState, action) {
  const handle_method = handle_set_state[action.type]
  return handle_method ? { ...state, ...handle_method(action.payload) } : state
}
