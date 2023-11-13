/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 布局相关
 */
export default {
  state: {
    // 当前页面 home：赛事列表  details：详情
    layout_cur_page: { cur: "", from: "" },
    // 当前展开区块  match-list:赛事列表 match-detail:赛事详情
    cur_expand_layout: "match-list",
    // 左侧显示内容类型 menu:菜单 bet_list:投注列表 bet_history:投注记录
    layout_left_show: "menu",
    layout_list_size: {},
    layout_list_width:0,
    // 列表显示内容  match:赛事 collect:收藏 search:搜索
    layout_list_type: "match",
    // 自定义滚动条样式
    scroll_style: {
      width: "9px",
      background: "#000",
      zIndex: 20,
      opacity: 1,
      borderRadius:"4px"
    },
    layout_size:{
      // 浏览器宽度
      inner_width:0,
      // 浏览器高度
      inner_height:0,
      // 主内容宽度
      main_width:0,
      // 左侧菜单宽度
      left_width:0,
      // 中间区域宽度
      center_width:0,
      // 列表实际内容宽度，除去边框间距等等
      list_content_width:0,
      // 右侧区域宽度
      right_width:0,
      // 头部高度
      header_height:0,
      // 主内容高度（菜单、列表、详情、右侧）
      content_height:0,
    }
  },
  getters: {
    //获取当前页路由信息
    get_layout_cur_page(state) {
      return state.layout_cur_page;
    },
    //页面所有布局宽高信息
    get_layout_size(state) {
      return state.layout_size;
    },
    //获取右侧布局类型
    get_cur_expand_layout(state) {
      return state.cur_expand_layout;
    },
    //获取左侧布局信息(取值有menu,bet_list,history)
    get_layout_left_show(state) {
      return state.layout_left_show;
    },
    //获取页面宽高信息 --可以废弃，废弃改动较大
    get_layout_list_size(state) {
      return state.layout_list_size;
    },
    //列表页宽度--可以废弃
    get_layout_list_width(state) {
      return state.layout_list_width;
    },
    //列表显示内容 match:赛事 collect:收藏 search:搜索
    get_layout_list_type(state) {
      return state.layout_list_type;
    },
    //	公共滚动条样式
    get_scroll_style(state) {
      return state.scroll_style;
    },
  },

  actions: {
    //设置路由信息
    set_layout_cur_page({ commit }, val) {
      commit("set_layout_cur_page", val);
    },
    //保存页面布局宽高信息
    set_layout_size({ commit }, val) {
      commit("set_layout_size", val);
    },
    // 设置展开区块
    set_cur_expand_layout({ commit }, val) {
      commit("set_cur_expand_layout", val);
    },
     //设置左侧显示内容类型
    set_layout_left_show({ commit }, val) {
      commit("set_layout_left_show", val);
    },
    //设置页面宽高信息
    set_layout_list_size({ commit }, val) {
      commit("set_layout_list_size", val);
    },
    //设置列表页宽度
    set_layout_list_width({ commit }, val) {
      commit("set_layout_list_width", val);
    },
      // 设置列表显示内容  match:赛事 collect:收藏 search:搜索
    set_layout_list_type({ commit }, val) {
      commit("set_layout_list_type", val);
    },
  },

  mutations: {
      //设置路由信息
    set_layout_cur_page(state, val) {

      state.layout_cur_page = val;
    },
    //保存页面布局宽高信息
    set_layout_size(state, val) {
      Object.assign(state.layout_size,val)
    },
      // 设置展开区块
    set_cur_expand_layout(state, val) {

      state.cur_expand_layout = val;
    },
     //设置左侧显示内容类型
    set_layout_left_show(state, val) {

      state.layout_left_show = val;
    },
    //设置页面宽高信息
    set_layout_list_size(state, val) {

      state.layout_list_size = val;
    },
    //设置列表页宽度
    set_layout_list_width(state, val) {

      state.layout_list_width = val;
    },
    // 设置列表显示内容  match:赛事 collect:收藏 search:搜索
    set_layout_list_type(state, val) {

      state.layout_list_type = val;
    },

  }
}