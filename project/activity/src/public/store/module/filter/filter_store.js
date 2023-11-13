/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 筛选功能数据操作使用
 */

export default {
  state: {
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
    checked_count: 0
  },
  getters: {
    //是否显示联赛筛选框
    get_show_filter_popup(state) {
      return state.show_filter_popup;
    },
    //选择的筛选数据
    get_filter_select_obj(state) {
      return state.filter_select_obj;
    },
    //上次的联赛筛选信息
    get_pre_filter_select_obj(state) {
      return state.pre_filter_select_obj
    },
    //获取联赛筛选是否全选
    get_filter_checked_all(state){
      return state.filter_checked_all;
    },
    //获取上次联赛筛选是否全选
    get_pre_filter_checked_all(state){
      return state.pre_filter_checked_all;
    },
    //获取选中的赛事数量(列表右上角赛选功能)
    get_checked_count(state) {
      return state.checked_count;
    }
  },
  actions: {
     // 设置显示联赛筛选框显示状态
    set_show_filter_popup({ commit }, curVal) {
      commit("set_show_filter_popup", curVal);
    },
      //报存选择的筛选数据
    set_filter_select_obj({ commit }, obj) {
      commit("set_filter_select_obj", obj);
    },
    //设置联赛筛选全选状态
    set_filter_checked_all({ commit }, curVal) {
      commit("set_filter_checked_all", curVal);
    },
      //清空筛选数据
    set_remove_filter_condition({ commit }) {
      commit("set_remove_filter_condition");
    },
    // 清空上次筛选数据
    remove_pre_filter_select_obj({ commit }) {
      commit("remove_pre_filter_select_obj");
    },
    //保存赛事选中数量
    set_checked_count({ commit }, checked_count) {
      commit("set_checked_count", checked_count);
    },
     //即将开赛筛选时间
    set_select_time({ commit }, _select_time) {
      commit("set_select_time", _select_time);
    }
  },

  mutations: {
     // 设置显示联赛筛选框显示状态
    set_show_filter_popup(state, curVal) {
      state.show_filter_popup = curVal;
    },
    //报存选择的筛选数据
    set_filter_select_obj(state, obj) {
      state.checked_count = obj.length
      state.filter_select_obj = obj;
      state.pre_filter_select_obj = obj
    },
      //设置联赛筛选全选状态
    set_filter_checked_all(state, curVal) {
      state.pre_filter_checked_all = state.filter_checked_all
      state.filter_checked_all = curVal;
    },
    //清空筛选数据 设置全选
    set_remove_filter_condition(state) {
      state.filter_select_obj = []
      state.filter_checked_all = true
      state.pre_filter_checked_all = true
      state.checked_count = 0
    },
    // 清空上次筛选数据
    remove_pre_filter_select_obj(state) {
      state.pre_filter_select_obj = []
    },
    //保存赛事选中数量
    set_checked_count(state, checked_count=0) {
      state.checked_count = checked_count;
    },
     //即将开赛筛选时间
     set_select_time(state, _select_time) {
      state.open_select_time = _select_time;
    }
  }
};
