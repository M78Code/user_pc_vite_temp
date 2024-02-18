/*
 * @Description: 顶部菜单信息
 */
import lodash from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // 当前选中的一级菜单
  current_first_menu:null,
  // 当前选中的二级菜单
  current_second_menu:null,
  // 当前选中的三级菜单
  current_three_menu:null,
  sub_menu_list: [],
  // 当前选中的菜单
  current_menu:null,
  // 当前选中的二级菜单id
  current_sub_menuid:'',
  // 当前虚拟体育选中的二级菜单id
  virtual_current_sub_menuid:'',
  // 上一次选择的二级菜单
  last_time_sub_menu_type: '',
  // 三级菜单id
  curr_third_menu_id:'',
  // 四级菜单信息
  level_four_menu: null,
  // 收藏菜单为6
  menu_type:'',
  //上次选中的主菜单type
  prev_menu_type:'',
  //切换到虚拟体育之前的菜单类型(用于从虚拟体育返回列表)
  v_pre_menu_type:'',
  // 电竞游戏csid
  current_esport_csid:'',
  // 是否切换到收藏
  changed_favorite:0,
  // 早盘日期的参数    早盘  和   串关 都有加
  md:-1,
  //是否有串关按钮
  show_top_menu:false,
  //当前选中的主菜单
  current_main_menu:{},
  // 主菜单选中项下标 (非展开的)
  useid_ievname:0, /// 传给筛选里面的搜索下Bat选中
  main_menu_dom_i:0,
  // 主菜单下拉选择器选中的赛事下标
  selector_w_m_i:0,
  // 当前选中日期菜单索引
  date_menu_curr_i:0,

  // 赛事列表接口请求参数
  req_match_list_params:null,
  // 当前选中的二级菜单menu_type
  curr_sub_menu_type:null,

  //折叠展开与赛事对应
  collapse_map_match:{},
  // 一键折叠赛种状态map
  collapse_csid_map: {},
  //全部球种折叠
  collapse_all_ball: true,
  // 上一次选中的球种  csid
  last_ball_csid: '',
  // 值为 1简版 2标准版
  newer_standard_edition:2,
  // h5简版与标准版切换时加载赛事列表完成
  n_s_changed_loaded:0,
  //虚拟体育子菜单
  virtual_menu_list:[],
  // 是否为滚球全选 选中多个二级菜单
  sport_all_selected:false,
  current_date_menu:[],//早盘和串关当前球类的日期菜单数据
  //串关早盘日期菜单缓存
  main_menu_date_dict:{},
  // 虚拟体育赛事接口请求中, 用于防治重复请求
  virtual_data_loading:0,
  //抽屉设置菜单是否显示
  is_show_menu:false,
  //次要玩法数据更新
  c303_data_change:'',
  //次要玩法盘口状态变化
  c305_data_change:'',
  //角球开关盘标识
  corner_oc_change:'',
  // 二级菜单下标
  set_new_two_menu_index:0,
  // 球种菜单
  ball_seed_menu: []
}

const topMenuSlice = createSlice({
  name: 'topMenuReducer',
  initialState,
  reducers: {
    set_corner_oc_change(state, { payload } ){
      state.corner_oc_change = payload
    },
    set_c305_data_change(state, { payload } ){
      state.c305_data_change = payload
    },
    set_c303_data_change(state, { payload } ){
      state.c303_data_change = payload
    },
    set_v_result_number_c_page(state, { payload } ){
      state.v_result_number_c_page = payload
    },
    set_is_show_menu(state, { payload } ){
      state.is_show_menu = payload
    },
    set_main_menu_date_dict(state, { payload } ){
      state.main_menu_date_dict = payload
    },
    set_sport_all_selected(state, { payload } ){
      state.sport_all_selected = payload
    },
    set_current_date_menu(state, { payload } ){
      state.current_date_menu = payload
    },
    set_s_result_menu_list(state, { payload } ){
      state.s_result_menu_list = payload
    },
    set_n_s_changed_loaded(state, { payload } ){
      state.n_s_changed_loaded = payload
    },
    set_virtual_data_loading(state, { payload } ){
      state.virtual_data_loading = payload
    },
    set_virtual_menu_list(state, { payload } ){
      state.virtual_menu_list = payload
    },
    set_newer_standard_edition(state, { payload } ){
      state.newer_standard_edition = payload
    },
    set_collapse_map_match(state, { payload } ){
      state.collapse_map_match = payload
      if(lodash.isEmpty(payload)){
        state.collapse_all_ball = true
      }
    },
    set_collapse_csid_map(state,  { payload } ) {
      state.collapse_csid_map = payload
    },
    set_collapse_all_ball(state, { payload } ){
      state.collapse_all_ball = payload
    },
    set_last_ball_csid(state, { payload } ){
      state.last_ball_csid = payload
    },
    set_useid_ievname(state, { payload } ){
      state.useid_ievname= payload
    },
    set_main_menu_dom_i(state, { payload } ){
      state.main_menu_dom_i = payload
    },
    set_selector_w_m_i(state, { payload } ){
      state.selector_w_m_i = payload
    },
    set_date_menu_curr_i(state, { payload } ){
      state.date_menu_curr_i = payload
    },
    set_md(state, { payload } ){
      state.md = payload
    },
    set_current_first_menu(state, { payload } ){
      state.current_first_menu = payload
    },
    set_current_second_menu(state, { payload } ){
      state.current_second_menu = payload
    },
    set_current_three_menu(state, { payload } ){
      state.current_three_menu = payload
    },
    set_current_sub_menuid(state, { payload } ){
      state.current_sub_menuid = payload
    },
    set_virtual_current_sub_menuid(state, { payload } ){
      state.virtual_current_sub_menuid = payload
    },
    set_last_time_sub_menu_type(state, { payload } ){
      state.last_time_sub_menu_type = payload
    },
    set_curr_third_menu_id(state, { payload } ){
      state.curr_third_menu_id = payload
    },
    set_level_four_menu(state, { payload } ){
      state.level_four_menu = payload
    },
    set_sub_menu_list(state, { payload }) {
      state.sub_menu_list = lodash.cloneDeep(payload);
    },
    set_current_menu(state, { payload }){
      if(state.current_menu)
      {
        for (const key in state.current_menu) {
          if(state.current_menu.hasOwnProperty(key))
            delete state.current_menu[key];
        }
      }
      state.current_menu = payload;
    },
    set_v_pre_menu_type(state, { payload }){
      state.v_pre_menu_type = payload
    },
    set_prev_menu_type(state, { payload }){
      state.prev_menu_type = payload
    },
    set_menu_type(state, { payload }){
      state.menu_type = payload
    },
    set_current_esport_csid(state, { payload }){
      state.current_esport_csid = payload
    },
    set_changed_favorite(state, { payload }){
      state.changed_favorite = payload 
    },
    set_current_menu_count(state,payload){
      let is_changed = false;
      if(state.current_menu&& state.current_menu.main&& state.current_menu.main.subList)
      {
        state.current_menu.main.subList.forEach(item => {
          for (let i = 0; i < payload.length; i++) {
            if(item.menuId == payload[i].menuId)
            {
              item.count = payload[i].count;
              is_changed = true;
              break;
            }
          }
        });
      }
      if(is_changed){
        // this.sub_menu_count_change = Math.random();
      }
    },
    set_main_menu_list_count(state, { payload }){
      let local_data_cache = sessionStorage.getItem("local_data_cache");
      if(local_data_cache){
        let local_data_temp = JSON.parse(local_data_cache);
        if(local_data_temp.main_menu_list){
          local_data_temp.main_menu_list.forEach(item => {
            for (let i = 0; i < payload.length; i++) {
              if(item && item.menuId == payload[i].menuId)
              {
                item.count = payload[i].count;
              }
              if(item && item.subList)
              {
                item.subList.forEach(item_sub => {
                  if(item_sub && item_sub.menuId == payload[i].menuId)
                  {
                    item_sub.count = payload[i].count;
                  }
                });
              }
            }
          });
          sessionStorage.setItem("local_data_cache",JSON.stringify(local_data_temp));
        }
      }
    },
    set_curr_sub_menu_type(state, { payload } ){
      if(! { payload } ){return}
      state.curr_sub_menu_type = +payload
    },
    set_show_top_menu(state, { payload }){
      state.show_top_menu = payload 
    },
    set_current_main_menu(state, { payload }){
      state.current_main_menu = payload 
    },
    set_req_match_list_params(state, { payload }){
      state.req_match_list_params = payload 
    },
    set_new_two_menu(state, { payload }){
      state.set_new_two_menu_index = payload 
    },
    set_ball_seed_menu(state, { payload }){
      state.ball_seed_menu = payload 
    }
  }
})

export default topMenuSlice.reducer
