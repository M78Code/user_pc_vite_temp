/*
 * @Description: 赛事 store
 */

import { createSlice } from '@reduxjs/toolkit'

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
  standard_odd_status: 12313
}

const matchSlice = createSlice({
  name: 'matchReducer',
  initialState,
  reducers: {
    set_match_list_loading(state, { payload }) {
      state.match_list_loading = payload 
    },
    set_list_scroll_direction(state, { payload }) {
      state.list_scroll_direction = payload 
    },
    set_list_scroll_top(state, { payload }) {
      state.list_scroll_top = payload 
    },
    set_list_scroll_top_iconshow(state, { payload }) {
      state.list_scroll_top_iconshow = payload 
    },
    set_allow_short_scroll(state, { payload }) {
      state.allow_short_scroll = payload 
    },
    set_foot_ball_screen_changing(state, { payload }) {
      state.foot_ball_screen_changing = payload 
    },
    set_hide_skeleton_screen(state, { payload }) {
      state.hide_skeleton_screen = payload 
    },
    set_img_error_map_mid(state, { payload }) {
      state.img_error_map_mid = payload 
    },
    set_is_user_change_status(state, { payload }) {
      state.is_user_change_status = payload 
    },
    set_secondary_unfold_map(state, { payload }) {
      state.secondary_unfold_map = !Object.keys(payload).length ? {} : payload
    },
    set_match_top_map_dict(state, { payload }) {
      state.match_top_map_dict = payload 
    },
    set_standard_odd_status(state, { payload }) {
      state.standard_odd_status = payload
    }
  }
})

export default matchSlice.reducer
