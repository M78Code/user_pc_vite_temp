/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 主菜单
 */
import { reactive } from 'vue';
const project_name = window.env.config.FINAL_TARGET_PROJECT_NAME

const state = reactive({
    main_menu_toggle:"normal",

    // 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关
    cur_menu_type: {
      type_name:'',
      pre_name:''
    },
    // 内嵌版 菜单收起状态
    menu_collapse_status: false,
})

export default {
  // namespaced: true,
  getters: {
    //左侧列表显示形式 normal：展开 mini：收起
    get_main_menu_toggle(state) {
      return state.main_menu_toggle;
    },
    //获取当前菜单类型
    get_cur_menu_type(state) {
      return state.cur_menu_type
    },
    // 获取 菜单收起状态
    get_menu_collapse_status(state) {
      return state.menu_collapse_status
    }
  },

  actions: {
    //设置左侧列表显示状态
    set_main_menu_toggle({ commit }, val) {
      commit("set_main_menu_toggle", val);
    },
    set_cur_menu_type({ commit }, menu_obj) {
      commit("set_cur_menu_type", menu_obj);
    }
  },

  mutations: {
    //设置左侧列表显示状态
    set_main_menu_toggle(state, val) {
      state.main_menu_toggle = val
    },
    set_cur_menu_type(state, menu_obj) {
      Object.assign(state.cur_menu_type,menu_obj)
    },
    set_menu_collapse_status(state, val) {
      state.menu_collapse_status = val
    }
  }
}
