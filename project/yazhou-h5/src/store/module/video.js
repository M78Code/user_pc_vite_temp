/*
 * @Description: 赛事 store
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show_video: false,
  video_url:{
    muUrl:'',
    animationUrl:'',
    active:'',
    referUrl:'',
  },
  change_count: 0,
  iframe_onload:false,   //视频单页是否已加载     作用：防止白屏
  is_close_video: 0,
  preload_animation_url: false, // 是否已预加载动画所需资源文件
}

const matchSlice = createSlice({
  name: 'videoReducer',
  initialState,
  reducers: {
    set_is_close_video(state, { payload }){
      state.is_close_video = payload;
    },
    set_show_video(state, { payload }){
      state.show_video = payload;
    },
    set_video_url(state, { payload }){
      state.video_url = payload;
    },
    set_change_count(state, val){
      state.change_count = payload;
    },
    set_iframe_onload(state, { payload }){
      state.iframe_onload = payload;
    },
    set_preload_animation_url(state, { payload }) {
      state.preload_animation_url = payload;
    },
  }
})

export default matchSlice.reducer
