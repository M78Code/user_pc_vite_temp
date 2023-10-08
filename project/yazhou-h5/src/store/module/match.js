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
  standard_odd_status: 12313,

   //赛种折叠对象
   collapse_csid_tid_map: {},
   //赛种折叠对象 改变 事件
   collapse_csid_tid_map_change:1,
   //冠军玩法折叠对象
     collapse_champion_map: {},
   //冠军玩法折叠对象 改变 事件
   collapse_champion_map_change:1,
   //冠军玩法折叠对象 改变 事件 来源
   collapse_champion_map_change_source:'',

   //冠军  全部折叠
   collapse_champion_all: {}

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
      state.secondary_unfold_map = payload && !Object.keys(payload).length ? {} : payload
    },
    set_match_top_map_dict(state, { payload }) {
      state.match_top_map_dict = payload 
    },
    set_standard_odd_status(state, { payload }) {
      state.standard_odd_status = payload
    },

  

    // 冠军玩法折叠相关
    set_collapse_champion_map(state, {value}) {
    
      if(!value){
        state.collapse_champion_map={}
        state.collapse_champion_map_change_source =  ''
        state.collapse_champion_map_change = Date.now()
        return false
      }
    //  console.error( 'set_collapse_champion_map-----',  value[0], state.collapse_champion_map);
      let {tid ,payload ,type ,source} = value
  
      // type  1 合并配置   2 覆写赋值
      if(!state.collapse_champion_map[tid]){ state.collapse_champion_map[tid]={}}
      let old = state.collapse_champion_map[tid]
      let new_obj={}
      if (type==1 ) {
        new_obj=  Object.assign(new_obj, old, payload)
       
      }else if(type==2){
        new_obj = payload
      }    
      state.collapse_champion_map[tid] = new_obj

      state.collapse_champion_map_change_source = source ||''
      state.collapse_champion_map_change = Date.now()
  
      // console.error(' state.collapse_champion_map----', state.collapse_champion_map);
      // console.error(' state.collapse_champion_map_change_source----', state.collapse_champion_map_change_source);
    },

    //冠军全部折叠
    set_collapes_champion_all(state, {value}) {
      if (!value) {
        state.collapse_champion_all = {}
      }
      const { c_value,tid } = value
      state.collapse_champion_all[tid] = c_value
    },
  
     /**
      * 设置 球类折叠   状态对象
      * @param {*} state
      * @param {*} value
      */
      set_collapse_csid_tid_map(state,value) {
  
        if(!value){
          // console.error('set_collapse_csid_tid_map---------11111');
          state.collapse_csid_tid_map={}
          state.collapse_champion_map={}
          state.collapse_champion_map_change_source=''
          state.collapse_champion_map_change = Date.now()
          state.collapse_csid_tid_map_change = Date.now()
          return false
        }
      //  console.error( 'set_collapse_csid_tid_map-----',  value[0], state.collapse_csid_tid_map);
        let {csid ,payload ,type,  source=''} = value
        // type  1 合并配置   2 覆写赋值
        if(!state.collapse_csid_tid_map[csid]){ state.collapse_csid_tid_map[csid]={}}
        let old = state.collapse_csid_tid_map[csid]
        let new_obj={}
        if (type==1 ) {
          new_obj=  Object.assign(new_obj,old, payload)
        }else if(type==2){
          new_obj =payload
        }
        //当 冠军 页面 球种展开的时候 需要展开 下面的所有联赛 ，以及联赛下的所有玩法
        if(source.includes('champion-csid') ){
          state.collapse_champion_map={}
  
          state.collapse_champion_map_change_source = source
          state.collapse_champion_map_change = Date.now()
        }else if(source.includes('champion-tid')){
          state.collapse_champion_map_change_source =  source
          state.collapse_champion_map_change = Date.now()
        }else{
          state.collapse_champion_map_change_source =''
        }
  
  
        state.collapse_csid_tid_map[csid] = new_obj
        state.collapse_csid_tid_map_change = Date.now()
        // console.error( 'collapse_csid_tid_map_change-----', Date.now() )
      }
  }
})

export default matchSlice.reducer
