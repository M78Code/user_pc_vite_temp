/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 全局数据
 */
import { reactive } from 'vue';
import { api_common } from "project/activity/src/public/api/index.js";
import BaseUserInfo from "project/activity/src/public/utils/user/base_user_info.js";
const env_version_name = window.env.config.DEFAULT_VERSION_NAME;

const state = reactive({
  // 系统本版
  version_name: "zhuanye",
  version_now: localStorage.getItem("version_now") || 1, // 1专业  2 新手

  // 当前网站是否处于后台运行中
  vue_hidden_run: false,
  odds: {
    // 上次赔率
    pre_odds: "EU",
    // 当前赔率
    cur_odds: "EU",
  },
  // 赛事列表排序 1:按联赛排序 2:按时间排序
  match_sort: 1,
  // 远程服务器时间
  timestamp: {
    remote_time: 0,
    local_time: 0,
  },
  remote_server_time: 0,

  //全局点击事件数
  global_click: 0,
  //catch错误数据
  error_data: "",
  // 是否为非常规菜单选择（搜索关键词点击）
  menu_special_choose: false,
  is_show_banner: false, // 是否显示banner
  is_roll_show_banner: false, // 滚动时是否显示banner
  is_first_introduce_write: false, // 是否完成引导页
  is_unfold_multi_column: false, //是否展开多列玩法
  //列表滚动数据
  retain_scroll_obj: {
    status: false,
    height: 0,
  },
  //全局开关
  global_switch: {
    //热门推荐
    hot_recommend: true,
    //统计
    statistics_switch: true,
    //收藏
    collect_switch: true,
    //近期
    recent_switch: true,
    //活动
    activity_switch: true,
    //搜索
    search_switch: true,
    //联赛筛选
    filter_switch: true,
    //盘口数量
    handicap_num: true,
    //热门赛事
    hot_match_num: true,
    //排序
    sort_cut: true,
    //滚球全部
    play_all_show: true,
    //多列
    multi_column: true,
  },
  //视频是否展开状态
  is_fold_status: true,
  // var事件国际化
  var_event_i18n: [],
})

export default {
  getters: {
    //获取列表滚动数
    get_retain_scroll_obj() {
      return state.retain_scroll_obj;
    },
    //全局开关法
    get_global_switch() {
      return state.global_switch;
    },
    //是否展开多列玩法
    get_unfold_multi_column() {
      return state.is_unfold_multi_column;
    },
    //是否为非常规菜单选择（搜索关键词点击）
    get_menu_special_choose() {
      return state.menu_special_choose;
    },
    //获取上次选择的盘口类型(盘口切换时使用)
    get_pre_odd() {
      return state.odds.pre_odds;
    },
    //获取当前盘口类型
    get_cur_odd() {
      return state.odds.cur_odds;
    },
    //赛事列表排序 1:按联赛排序 2:按时间排序
    get_match_sort() {
      return state.match_sort;
    },
    //获取服务器时间
    get_timestamp() {
      return state.timestamp;
    },
    // 获取var事件 国际化配置星信息
    get_var_event_i18n() {
      return state.var_event_i18n;
    },
    //获取网站是否处于后台运行中
    get_vue_hidden_run() {
      return state.vue_hidden_run;
    },
    //获取全局点击事件
    get_global_click() {
      return state.global_click;
    },
    //获取js运行报错错误信息
    get_error_data() {
      return state.error_data;
    },
    get_v_result_number_c_page() {
      return state.v_result_number_c_page;
    },
    //获取是否显示列表banner
    get_is_show_banner() {
      return state.is_show_banner;
    },
    //获取列表滚动时是否显示banner
    get_is_roll_show_banner() {
      return state.is_roll_show_banner;
    },
    //获取是否完成引导页
    get_is_first_introduce_write() {
      return state.is_first_introduce_write;
    },
    //获取视频是否展开状态
    get_is_fold_status() {
      return state.is_fold_status;
    },
    //获取当前版本状态  // 1专业  2 新手
    get_version() {
      return state.version_now;
    },
  },
  actions: {
    //设置保存的滚动数据
    set_retain_scroll_obj({ commit }, obj) {
      commit("set_retain_scroll_obj", obj);
    },
    //全局开关
    set_global_switch({ commit }, switch_obj) {
      commit("set_global_switch", switch_obj);
    },
    //是否展开多列玩法
    set_unfold_multi_column({ commit }, status) {
      commit("set_unfold_multi_column", status);
    },
    //设置非常规菜单选择（搜索关键词点击）
    set_menu_special_choose({ commit }, val) {
      commit("set_menu_special_choose", val);
    },
    //设置服务器时间
    set_remote_server_time({ commit }, payload) {
      api_common.get_server_time().then((res) => {
        let code = _.get(res, "data.code");
        if (code == 200) {
          let serverTime = Number(_.get(res, "data.data"));

          commit("set_remote_server_time", serverTime);
        }
      });
    },
    //初始化盘口偏好
    set_init_odd({ commit }) {
      commit("set_init_odd");
    },
    // 设置上次盘口偏好
    set_pre_odd({ commit }, pre_odds) {
      commit("set_pre_odd", pre_odds);
    },
    // 设置盘口偏好
    set_cur_odd({ commit }, cur_odds) {
      if (cur_odds) {
        commit("set_cur_odd", cur_odds);
      }
    },
    //初始化列表排序
    set_init_match_sort({ commit }) {
      commit("set_init_match_sort");
    },
    // 设置列表排序
    set_match_sort({ commit }, match_sort) {
      commit("set_match_sort", match_sort);
    },

    //设置版本名称
    set_version_name({ commit }, version_name) {
      commit("set_version_name", version_name);
    },
    //初始化设置版本名称
    init_version_name({ commit }) {
      commit("init_version_name");
    },
    //设置网站是否处于后台运行中
    set_vue_hidden_run({ commit }, status) {
      commit("set_vue_hidden_run", status);
    },
    //设置全局点击事件
    set_global_click({ commit }) {
      commit("set_global_click");
    },
    //设置catch错误数据
    set_error_data({ commit }, data) {
      commit("set_error_data", data);
    },
    //设置显示列表状态
    set_is_show_banner({ commit }, data) {
      commit("set_is_show_banner", data);
    },
    //设置滚动时显示列表状态
    set_is_roll_show_banner({ commit }, data) {
      commit("set_is_roll_show_banner", data);
    },
    //设置是否完成引导页
    set_is_first_introduce_write({ commit }, data) {
      commit("set_is_first_introduce_write", data);
    },
    //设置视频是否展开状态
    set_is_fold_status({ commit }, data) {
      commit("set_is_fold_status", data);
    },
    //设置视频是否展开状态
    set_var_event_i18n({ commit }, data) {
      commit("set_var_event_i18n", data);
    },
    //设置专业新手状态
    set_version({ commit }, data) {
      commit("set_version", data);
    },
  },
  mutations: {
    //设置保存的滚动数据
    set_retain_scroll_obj(state, obj) {
      Object.assign(state.retain_scroll_obj, obj);
    },
    //全局开关
    set_global_switch(state, switch_obj) {
      Object.assign(state.global_switch, switch_obj);
    },
    //是否展开多列玩法
    set_unfold_multi_column(state, status) {
      state.is_unfold_multi_column = status;
    },
    //设置非常规菜单选择（搜索关键词点击）
    set_menu_special_choose(state, val) {
      state.menu_special_choose = val;
    },
    //初始化盘口偏好
    set_init_odd(state) {
      let pre_odds = localStorage.getItem("pre_odds") || state.odds.cur_odds;
      let cur_odds = localStorage.getItem("cur_odds") || state.odds.cur_odds;

      localStorage.setItem("pre_odds", pre_odds);
      localStorage.setItem("cur_odds", cur_odds);

      state.odds = { pre_odds, cur_odds };
    },
    // 设置上次盘口偏好
    set_var_event_i18n(state, data) {
      state.var_event_i18n = data;
    },
    // 设置上次盘口偏好
    set_pre_odd(state, pre_odds) {
      localStorage.setItem("pre_odds", pre_odds);
      state.odds.pre_odds = pre_odds;
    },
    // 设置盘口偏好
    set_cur_odd(state, cur_odds) {
      BaseUserInfo.assign({ userMarketPrefer: cur_odds });
      localStorage.setItem("cur_odds", cur_odds);
      state.odds.cur_odds = cur_odds;
    },
    //初始化列表排序
    set_init_match_sort(state) {
      // let match_sort = localStorage.getItem("match_sort") || state.match_sort
      // localStorage.setItem("match_sort", match_sort)
      // state.match_sort = match_sort
    },
    //设置列表排序
    set_match_sort(state, match_sort) {
      localStorage.setItem("match_sort", match_sort);
      state.match_sort = match_sort;
    },
    //设置服务器时间
    set_remote_server_time(state, remote_time) {
      state.timestamp = {
        remote_time,
        local_time: new Date().getTime(),
      };
    },

    /**
     * @Description:设置版本名称
     * @Author success
     * @param:
     * @return:
     * @Date 2020/04/11 09:22:10
     */
    set_version_name(state, version_name) {
      state.version_name = version_name;
      localStorage.setItem("version_name", version_name);
    },
    /**
     * @Description:初始化设置版本名称
     * @Author success
     * @param:
     * @return:
     * @Date 2020/04/11 09:22:10
     */
    init_version_name(state) {
      let version_name = localStorage.getItem("version_name");
      if (!version_name) {
        version_name = env_version_name;
        localStorage.setItem("version_name", version_name);
      }
      state.version_name = version_name;
    },
    //设置网站是否处于后台运行中
    set_vue_hidden_run(state, status) {
      state.vue_hidden_run = status;
    },
    //设置全局点击事件
    set_global_click(state) {
      state.global_click++;
    },
    //设置catch错误数据
    set_error_data(state, data) {
      if (data == "delete") {
        state.error_data = "";
      } else {
        data.error = data.error || "";
        let error = data.error.toString();
        if (error == "[object Object]") {
          error = JSON.stringify(data.error);
        }
        state.error_data += "\n" + data.site + "\n" + error;
      }
    },
    set_v_result_number_c_page(state, v) {
      state.v_result_number_c_page = v;
    },
    //设置显示列表状态
    set_is_show_banner(state, data) {
      state.is_show_banner = data;
    },
    //设置滚动时显示列表状态
    set_is_roll_show_banner(state, data) {
      state.is_roll_show_banner = data;
    },
    //设置是否完成引导页
    set_is_first_introduce_write(state, data) {
      state.is_first_introduce_write = data;
    },
    //设置视频是否展开状态
    set_is_fold_status(state, status) {
      state.is_fold_status = status;
    },

    //设置专业新手状态
    set_version(state, status) {
      state.version_now = status;
      localStorage.setItem("version_now", status);
    },
  },
};
