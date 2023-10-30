
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import { useRouter, useRoute } from 'vue-router'
import { useMittOn, useMittEmit, MITT_TYPES,UserCtr, LOCAL_PROJECT_FILE_PREFIX } from  "src/core"
import countingDownSecond from 'src/base-h5/components/common/counting-down.vue';
import countingDownStart from 'src/base-h5/components/common/counting-down-start.vue';
import scoreList from './score-list.vue';
import oddListWrap from './odd-list-wrap.vue';
import MatchFold from 'src/core/match-fold'
import MatchCollect from 'src/core/match-collect'
import { IconWapper } from 'src/components/icon'
import matchOvertimePen from './match-overtime-pen.vue'
import ImageCacheLoad from "./public-cache-image.vue";
import PageSourceData from "src/core/page-source/page-source.js";
import { i18n_t,MenuData, score_switch_handle,compute_img_url, compute_css_obj, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, PROJECT_NAME } from "src/core/index.js"
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import matchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import { format_time_zone, format_time_zone_time, format_how_many_days, format_week } from "src/core/format/index.js"

import { normal_img_not_favorite_white, normal_img_not_favorite_black, normal_img_is_favorite, y0_img_favorite_black, lvs_icon_theme01, lvs_icon_theme02, animationUrl_icon_theme01,
  animationUrl_icon_theme02, muUrl_theme01, muUrl_theme01_y0, muUrl_theme02, muUrl_theme02_y0, none_league_icon, none_league_icon_black, match_analysis, match_analysis2, polular_spirite_theme02,
  polular_spirite,  mearlys_icon } from 'src/base-h5/core/utils/local-image.js'

import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, menu_lv2, is_detail, is_export, is_results } from 'src/base-h5/mixin/menu.js'

// TODO: 其他模块得 store  待添加
const props = defineProps({
  // 当前组件的赛事数据对应列表的赛事
  match_of_list: Object,
  // 赛事处于列表中的下标
  i: Number,
  // 赛事列表相关操作的类型封装对象
  matchCtr: Object,
  main_source:String,
})

const router = useRouter()
const route = useRoute()
const emitters = ref({})
const store_state = store.getState()
const timer_super11 = ref(null)
const match_change_timer = ref(null)
const is_new_init_timer2 = ref(null)
//  直播 视频  动画  按钮状态 对象
const media_button_state_obj = ref({})
// 主队显示分数
const home_score = ref(null)
// 客队显示分数
const away_score = ref(null)
// 主队红牌数
const home_red_score = ref(0)
// 客队红牌数
const away_red_score = ref(0)
// 主队黄牌数
const home_yellow_score = ref(0)
// 客队黄牌数
const away_yellow_score = ref(0)
const home_red_first_change = ref(true)
const away_red_first_change = ref(true)
// 是否显示主队进球动画
const is_show_home_goal = ref(false)
// 是否显示客队进球动画
const is_show_away_goal = ref(false)
// 是否显示主队红牌动画
const is_show_home_red = ref(false)
// 是否显示客队红牌动画
const is_show_away_red = ref(false)
// 当前组件是否第一次创建
const is_first_coming = ref(false)
//mmp阶段名称
const mmp_map_title = ref('')
//赛事切换中
const match_changing = ref(false)
// 定时器外层容器宽度
const counting_down_up_wrapper_width = ref(.8)
// 列表页进球动画和红牌动画要等组件初始化3秒后开始监听变化
const is_new_init2 = ref(false)
// 防抖 防止急速状态下点击两次
const is_on_go_detail = ref(false)

const get_footer_sub_changing = ref(store_state.get_footer_sub_changing)
const get_collapse_map_match = ref(store_state.get_collapse_map_match)
const get_show_favorite_list = ref(store_state.get_show_favorite_list)
const get_img_error_map_mid = ref(store_state.get_img_error_map_mid)
const get_goto_detail_matchid = ref(store_state.get_goto_detail_matchid)
const get_goto_detail_match_info = ref(store_state.get_goto_detail_match_info)
const get_not_found_target_dom_count = ref(store_state.get_not_found_target_dom_count)
const get_standard_odd_status = ref(store_state.get_standard_odd_status)
onMounted(() => {
  is_first_coming.value = true;
  //赛事切换时钟
  match_change_timer.value = null;
  //防止赛事列表初始显示时大面积红升绿降
  timer_super11.value = setTimeout(() => {
    is_first_coming.value = false;
  },1000);
  clear_timer();
  run_new_init_timer();
  score_value();
  media_button_button_type_check()
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_SET_SCROLL_TOP, set_scroll_top).off,
  }
})

// 当前显示的赛事数据
const match = computed(() => {
  return props.match_of_list;
})

const prev_match = computed(() => {
  return props.i > 0 ? MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[props.i - 1]) : undefined
})

// 精彩回放视频开关是否开启
const is_replay_switch = computed(() => {
  const { configValue, eventSwitch } = lodash.get(UserCtr, 'merchantEventSwitchVO', {})
  return configValue == 1 && eventSwitch == 1
})
//  动画按钮
const animationUrl_icon = computed(() => {
  let is_theme01 = theme.value.includes('theme-0')
  let animationUrl_icon = is_theme01 ? animationUrl_icon_theme01 : animationUrl_icon_theme02
  return animationUrl_icon
})
//  视频按钮
const muUrl_icon = computed(() => {
  let is_theme01 = theme.value.includes('theme-0')
  let is_y0 = theme.value.includes('y0')
  let muUrl_icon = ''
  if (is_y0) {
    muUrl_icon = is_theme01 ? muUrl_theme01_y0 : muUrl_theme02_y0
  } else {
    muUrl_icon = is_theme01 ? muUrl_theme01 : muUrl_theme02
  }
  return muUrl_icon
})

// TODO: 判断是否显示体育类型
const get_sport_show = computed(() => {
  if (is_detail.value) { return false }
  if (is_hot.value) {
    // 热门
    if (lodash.get(MenuData.hot_tab_menu, 'index') !== 0) { return false }
    if (props.i === 0) { return true }
    if (prev_match.value && match.value) {
      return prev_match.value.csid !== match.value.csid;
    }
  } else if ([1, 2, 3, 4, 11, 12, 28, 30, 3000].includes(+menu_type.value)) {
    if (props.i === 0) {
      return true
    } else {
      return false
    }
  } else {
    return false;
  }
})

// 是否显示视频图标, 点击跳转 去到详情页视频直播
const is_show_video_icon = computed(() => {
  let r = false;
  let ios_Android = null
  if (3000 == menu_type.value) {
    // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
    // 判断是否是苹果手机，是则是true
    let ua = navigator.userAgent.toLowerCase();
    let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
    if (isIos) {
      ios_Android = props.match_of_list.vurl
    } else {
      ios_Android = props.match_of_list.varl || props.match_of_list.vurl
    }
    r = props.match_of_list.mms > 1 && ios_Android && [1, 2, 7, 10, 110].includes(+props.match_of_list.ms)
  }
  else {
    r = props.match_of_list.mms > 1 && [1, 2, 7, 10, 110].includes(+props.match_of_list.ms);
  }
      return r;
})

const show_newer_edition = computed(() => {
  return standard_edition.value == 1 || props.main_source == 'detail_match_list';
})

// 是否是 拳击 或者其他球种
const match_of_list_ascertain = computed(() => {
  if (MenuData.current_menu != 28 && props.match_of_list.csid == 12 && props.match_of_list.hps.length > 1) {
        return props.match_of_list.hps.slice(0, 2)
  } else {
    return props.match_of_list.hps
  }
})

// 热门模块 球类tab 下边的赛程列表 的 时间转换 = () => {
const time_change = computed(() => {
  if (props.match_of_list) {
    let time_stamp = +props.match_of_list.mgt
    return (format_how_many_days(time_stamp) ? `${format_how_many_days(time_stamp)}   ` : '') + (new Date(time_stamp)).Format(i18n_t('time2')) + '  ' + format_week(time_stamp)
  }
})

/**
 * @description: 设置 联赛收藏与否
 */
const handle_league_collect = () => {
  MatchCollect.handle_league_collect_state(props.match_of_list.tid)
}

/**
 * @deprecated  联赛藏 状态
 */
const league_collect_state = computed(() => {
  return MatchCollect.get_league_collect_state(props.match_of_list.tid)
})

/**
 * @description: 设置 赛事收藏与否
 */
const handle_match_collect = () => {
  // 获取当前收藏状态
  const state = MatchCollect.get_match_collect_state(props.match_of_list)
  MatchCollect.set_match_collect_state(props.match_of_list, !state)
}

/**
 * @deprecated  赛事收藏 状态
 */
const match_collect_state = computed(() => {
  return MatchCollect.get_match_collect_state(props.match_of_list)
})

/**
 * @description 球种折叠
 */
const handle_ball_seed_fold = () => {
  MatchFold.set_ball_seed_match_fold(props.match_of_list.csid)
  MatchMeta.compute_page_render_list(0, 2)
}
/**
 * @description 联赛折叠
 */
const handle_league_fold = () => {
  // 首页热门，详情页，不需要用到折叠
  if (is_hot.value || is_detail.value) return;
  MatchFold.set_league_fold(props.match_of_list.tid)
  MatchMeta.compute_page_render_list(0, 2)
}
/**
 * @description 联赛折叠状态
 */
const league_collapsed = computed(() => {
  if (is_hot.value) return false
  const falg = lodash.get(MatchFold.ball_seed_csid_fold_obj.value, `csid_${props.match_of_list.csid}`, true)
  return falg
})
/**
 * @description 赛事显示/隐藏
 */
const collapsed = computed(() => {
  if (is_hot.value) return false
  const key = MatchFold.get_match_fold_key(props.match_of_list)
  const show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`)
  return show_card
})

const eports_scoring = computed(() => {
  //比分判断处理
  let scoring = false
  //如果是电竞，则进行比分判定处理
  if (menu_type.value == 3000) {
    const { mmp, home_score, away_score } = props.match_of_list
    const mmp_state = mmp || 1
    if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
      scoring = true
    }
  }
  return scoring
})

/**
 *启动 组件新初始化后 ，判定组件是否是刚刚新初始化的 定时器
*主要用于 进球动画 显示 的第一层时间段 屏蔽开关
*调用时机 :是否组件新初始化或者 key 新变更
*/
const run_new_init_timer = () => {
  // 用于对应列表的进球动画
  if (is_new_init_timer2.value) {
    clearTimeout(is_new_init_timer2.value)
  }
  is_new_init2.value = false;
  is_new_init_timer2.value = setTimeout(() => {
    is_new_init2.value = true
  }, 3000)
}
const update_counting_down_up_wrapper_width = (width) => {
  counting_down_up_wrapper_width.value = width
}
/**
 * @description: 获取key对应缓存的图片路径
 * @param {String} key  图片路径
 * @return {String} 返回缓存的路径
 */
const get_img_cache_obj = (key) => {
  // 没有图片缓存的路径就返回空字符串
  let res = '';
  // 判断是否有图片缓存的路径
  if (key && window.img_cache_obj && window.img_cache_obj[props.match_of_list.csid + '_' + key]) {
    // 获取图片缓存的路径
    res = window.img_cache_obj[props.match_of_list.csid + '_' + key];
  }
  return res;
}
/**
 * @description: 设置key对应缓存的图片路径
 * @param {String} key  图片路径
 * @param {String} event  dom event事件
 */
const set_img_cache_obj = (key, event) => {
  // 判断src属性是否有图片路径
  if (key && event && event.currentTarget && event.currentTarget.src) {
    // 判断图片缓存对象是否为空,为空时设置空对象
    if (!window.img_cache_obj) {
      // 初始化window.img_cache_obj空对象
      window.img_cache_obj = {};
    }
    // 设置缓存的图片,图片的key为球种csid + '_' +图片路径
    window.img_cache_obj[props.match_of_list.csid + '_' + key] = event.currentTarget.src;
  }
}
/**
 * @description:  直播 视频  动画 点击跳转详情播放
 * @param {String} button_type lvs 直播   muUrl 视频  animationUrl 动画
 * @return {Undefined} Undefined
 */
const media_button_handle = () => {
  // 计算真正回落的点击按钮   直播 视频  动画
  let { final_button_type } = media_button_button_type_check();
  switch (final_button_type) {
    case "lvs":
      break;
    case "muUrl":
      media_button_handle_when_muUrl();
      break;
    case "animationUrl":
      break;
    default:
      break;
  }
  store.dispatch({ type: 'matchReducer/set_is_in_play',  payload: final_button_type });
  goto_details(props.match_of_list);
}
/**
 * 计算真正回落的点击按钮   直播 视频  动画
 * @param {*} button_type
 */
const media_button_button_type_check = (button_type = 'lvs') => {
  let state_obj = {
    lvs: props.match_of_list["lvs"] && props.match_of_list["lvs"] != -1,
    muUrl: is_show_video_icon,
    animationUrl: props.match_of_list.mms <= 1 && props.match_of_list.mvs > -1,
    icon_path: '',
    final_button_type: '',
  }
  // 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画
  if (button_type == "lvs") {
    if (state_obj.lvs && ['string', 'number'].includes(typeof lodash.get(props.match_of_list, 'lss'))) {
      // 赛前图标
      if (lodash.get(props.match_of_list, 'lss') == 1) {
        state_obj.icon_path = lvs_icon_theme01
      } else if (lodash.get(props.match_of_list, 'lss') == 0 && lodash.get(props.match_of_list, 'ms') != 1) {
        // 正在直播的图标
        state_obj.icon_path = lvs_icon_theme02
      }
      state_obj.final_button_type = "lvs"
      // 如果不是中文和繁体，则隐藏
      if (!['zh', 'tw'].includes(lang.value)) {
        state_obj.lvs = false
        button_type = "muUrl";
        state_obj.icon_path = ''
      }
    } else {
      button_type = "muUrl";
    }
  }
  if (button_type == "muUrl") {
    if (state_obj.muUrl) {
      state_obj.icon_path = muUrl_icon
      state_obj.final_button_type = "muUrl"
    } else {
      button_type = "animationUrl";
    }
  }
  if (button_type == "animationUrl") {
    if (state_obj.animationUrl) {
      state_obj.icon_path = animationUrl_icon
      state_obj.final_button_type = "animationUrl"
    } else {
    }
  }
  media_button_state_obj.value = { ...state_obj }
  return state_obj
}
/**
 * 当点击 视频按钮的时候
 */
const media_button_handle_when_muUrl = () => {
  // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
  // 判断是否是苹果手机，是则是true
  if (3000 == menu_type.value) {
    let video_url = {
      active: "muUrl",
      media_src: "",
    };
    let ua = navigator.userAgent.toLowerCase();
    let isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
    if (isIos) {
      video_url.media_src = props.match_of_list.vurl;
    } else {
      video_url.media_src = props.match_of_list.varl || props.match_of_list.vurl;
    }
    store.dispatch({ type: 'matchReducer/set_video_url',  payload: video_url });
  }
  // 代表 播放正常视频 标识, 在 match_icon.vue 组件 watch 监听，监听点击直播事件,触发详情页视频直接播放
  set_is_in_play('muUrl');
  //在 match_icon.vue 组件 watch 监听
  store.dispatch({ type: 'matchReducer/set_play_video',  payload: true });
  store.dispatch({ type: 'matchReducer/set_show_video',  payload: true });
  goto_details(props.match_of_list);
}
const leaderboard_switch = () => {
  useMittEmit(MITT_TYPES.EMIT_HOT_LEADERBOARD_SWITCH)
}
const is_show_result = () => {
  let r = false;
  if(menu_type.value == 28){
    r = !(is_hot.value || is_detail.value)
  }
  return r;
}
/**
 * @Description 隐藏主队进球动画
 * @param {undefined} undefined
*/
const hide_home_goal = () => {
  is_show_home_goal.value = false
}
/**
 * @Description 隐藏客队进球动画
 * @param {undefined} undefined
*/
const hide_away_goal = () => {
  is_show_away_goal.value = false
}
/**
 * @Description 隐藏主队红牌动画
 * @param {undefined} undefined
*/
const hide_home_red = () => {
  is_show_home_red.value = false
}
/**
 * @Description 隐藏客队红牌动画
 * @param {undefined} undefined
*/
const hide_away_red = () => {
  is_show_away_red.value = false
}

/**
 * @description: 设置发球方绿点显示
 * @param {Object} item 赛事对象
 * @param {Object} side 'home'主队  'away'客队
 * @return {Boolean} 是否显示发球方
 */
const set_serving_side = (item, side) => {
  if (menu_type.value == 28 && !is_detail.value) { //赛果不显示发球方绿点
    return false
  }
  return item.ms == 1 && item.mat == side;
}
/**
 * @description: 获取玩法数量
 * @param {Object} item 赛事
 * @return {Number}
 */
const get_match_mc = (item) => {
  return (item.mc * 1) < 1 ? 0 : item.mc;
}
/**
 * 包装获取图片路径的方法
 */
const get_server_file_path_local = (path, csid) => {
  return get_server_file_path(path, csid);
}

/**
 * @description: 跳转至详情
 * @param {Object} item 赛事
 * @param {*} flag 有值时候代表要去到赛事分析页
 * @return {String}
 */
const goto_details = (item, flag) => {
  if (!item || !item.mid) return;
  if (is_on_go_detail.value) {
    return; //  防止急速点击两次
  }
  is_on_go_detail.value = true;

  // 如果是非赛果电竞赛事，需要设置菜单类型
  if (MenuData.current_menu !== 28 && [100, 101, 102, 103].includes(+item.csid)) {
    store.dispatch({ type: 'matchReducer/set_menu_type',  payload: 3000 });
  }
  // console.log({msg:'测试在极度快速的点几下,可以打印两次此消息,证明执行了两次'})

  // 跳转详情页时需清空赛种折叠状态
  store.dispatch({ type: 'matchReducer/set_collapse_csid_map',  payload: {} });
  store.dispatch({ type: 'matchReducer/set_collapse_map_match',  payload: {} });

  store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: item.mid });
  // 进入详情页前，记录目标赛事top值
  // store.dispatch({ type: 'matchReducer/set_goto_detail_match_info',  payload: { top: refs['mid-' + item.mid].getBoundingClientRect().top } });
  store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: 0 });
  store.dispatch({ type: 'matchReducer/set_details_item',  payload: 0 });
  // 进入详情前，将当前赛事信息存入仓库
  store.dispatch({ type: 'matchReducer/set_match_base_info_obj',  payload: item });

  if (MenuData.current_menu && MenuData.current_menu.main && is_results.value) {
    router.push(`/result_details/${item.mid}/0`);
  }
  else {
    if (route.name == "category") {
      router.push({ name: 'category_loading', params: { mid: item.mid } });
    }
    else {
      router.push({ name: 'category', params: { analysis: flag ? true : false, mid: item.mid, csid: item.csid } });
    }
  }
}
/**
 * @description: 多少分钟后开赛显示
 * @param {Object} item 赛事对象
 * @return {String}
 */
const show_start_counting_down = (item) => {
  if (typeof item.mcg == 'undefined') {
    return false;
  }
  let r = false;
  // 滚球中不需要显示多少分钟后开赛
  if (item && item.ms == 1) {
    return r;
  }
  let start_time = item.mgt * 1;
  let init_server = PageSourceData.init_time.server_time * 1;
  let init_local = PageSourceData.init_time.local_time;
  let now_local = new Date().getTime();
  let sub_local_time = now_local - init_local;
  let now_server_time = init_server + sub_local_time;
  let sub_time = start_time - now_server_time;

  // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
  r = item.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
  return r;
}
// 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
/**
 * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
 * @param {Object} item 赛事对象
 * @return {Boolean}
 */
const show_counting_down = (item) => {
  return [1, 2, 10].includes(item.ms * 1);
}
/**
 * 判断是否显示进行中|未开赛
 * @param {Object} item 赛事对象
 * @returns {Boolean}
 */
const get_m_status_show = (i) => {
  let result = false;
  if (is_detail.value) {
    return false
  }
  //非今日串关不显示
  if (![3, 11].includes(+menu_type.value)) {
    return result;
  } else if (menu_type.value == 11) {
    let third_m_id = lodash.get(MenuData.current_menu, 'date_menu.field1');
    //串关今日id为0或'0'
    if (third_m_id !== 0 && third_m_id !== '0') {
      return result;
    }
  }
  
  if (match.value) {
    if (i > 0) {
      if ([1, 110].includes(+match.value.ms)) {
        result = false;
      }
      else if (![1, 110].includes(+match.value.ms) && [1, 110].includes(+props.match_of_list.ms)) {
        result = true;
      }
    } else if (i == 0 && ![1, 110].includes(+match.value.ms)) {
      result = true;
    }
  }
  return result;
}
/**
 * @description: 判断是否显示联赛
 * @param {Number} i 赛事下标
 * @return {Boolean}
 */
const get_league_show = (i) => {
  let flag = true;
  if (i) {
    if (match.value && prev_match.value) {
      if (match.value.tid != prev_match.value.tid) {
        flag = true;
      }
      else {
        flag = false;
      }
    }
  }
  else {
    flag = true;
  }
  if (props.match_of_list.is_show_no_play) {
    flag = true;
  }
  return flag;
}
/**
 * @description: 未开赛标题展示
 * @param {Number} i 赛事下标
 * @param {Number} ms 赛事状态（1 进行中 0 未开赛）
 * @return {Boolean}
 */
const favorite_un_start_title = (i, ms) => {
  if (i == 0) {
    return false;
  }
  if (menu_type.value == 6) {
    if (props.match_of_list.is_show_no_play && ms == 0) {
      return true;
    }
  }
  return false;
}
/**
 * @description: 比分无值时用0占位
 * @param {Undefined}
 * @return {Undefined}
 */
const score_value = () => {
  if (!props.match_of_list) {
    home_score.value = 0;
    away_score.value = 0;
    home_red_score.value = 0;
    away_red_score.value = 0;
    home_yellow_score.value = 0;
    away_yellow_score.value = 0;
    return;
  }

  //比分
  if (!props.match_of_list.home_score && props.match_of_list.home_score != 0) {
    home_score.value = 0;
  } else {
    home_score.value = props.match_of_list.home_score;
  }
  if (!props.match_of_list.away_score && props.match_of_list.away_score != 0) {
    away_score.value = 0;
  } else {
    away_score.value = props.match_of_list.away_score;
  }

  //红牌
  if (!props.match_of_list.home_red_score && props.match_of_list.home_red_score != 0) {
    home_red_score.value = 0;
  } else {
    home_red_score.value = props.match_of_list.home_red_score;
  }
  if (!props.match_of_list.away_red_score && props.match_of_list.away_red_score != 0) {
    away_red_score.value = 0;
  } else {
    away_red_score.value = props.match_of_list.away_red_score;
  }

  //黄牌
  if (!props.match_of_list.home_yellow_score && props.match_of_list.home_yellow_score != 0) {
    home_yellow_score.value = 0;
  } else {
    home_yellow_score.value = props.match_of_list.home_yellow_score;
  }
  if (!props.match_of_list.away_yellow_score && props.match_of_list.away_yellow_score != 0) {
    away_yellow_score.value = 0;
  } else {
    away_yellow_score.value = props.match_of_list.away_yellow_score;
  }

  if(MenuData.current_menu !=28 && props.match_of_list.csid==1 && props.match_of_list.cds=='1500' && standard_edition.value == 1 && MenuData.footer_sub_menu_id == 114){
    // 红猫足球赛事,简版,角球菜单时屏蔽角球比分显示
    home_score.value = '';
    away_score.value = '';
  }
}
/**
 * @description 设置scrollTop最终滚动距离, 保证详情返回的赛事出现在视图窗口内
 */
const set_scroll_top = (scrollTop) => {
  clearTimeout(scroll_top_timer)
  nextTick (() => {
    scroll_top_timer = setTimeout(() => {
      let matchId = 'mid-' + get_goto_detail_matchid.value
      const mid_dom = $refs[matchId]
      //若存在赛事dom，则执行相应滚动逻辑
      if (mid_dom) {
        // 获取目标赛事dom视口top
        const top = mid_dom.getBoundingClientRect().top
        // 目标赛事视图top阈值
        let view_top = lodash.get(get_goto_detail_match_info.value, 'top', 0)
        // view_top = MenuData.current_menu === 4 ? 160 : 120

        if (view_top) {
          // 滚动容器
          let match_list_container = document.querySelector('.match-list-container')
          // 容器最终滚动距离
          const final_scroll_top = scrollTop + top - view_top

          match_list_container.scrollTo(0, final_scroll_top)
          set_goto_detail_matchid('')

          // 短距离滚动标识
          store.dispatch({ type: 'matchReducer/set_allow_short_scroll',  payload: true });
          // 已滚动至目标dom时，未滚动至目标计数置为-1
          store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: -1 });

          // 第二次延时计算是为了保证滚动距离正确
          clearTimeout(scroll_top_timer2)
          scroll_top_timer2 = setTimeout(() => {
            const top2 = mid_dom.getBoundingClientRect().top

            if (Math.floor(top2) > view_top) {
              match_list_container.scrollTo(0, final_scroll_top + top2 - view_top)
            }

            match_list_container = null
          }, 500)
        }

      } else {
        let not_found_target_dom_count = get_not_found_target_dom_count.value
        if (not_found_target_dom_count >= 0) {
          not_found_target_dom_count++
          store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: not_found_target_dom_count });

          // 当由详情返回后，未滚动至目标计数 和 赛事展示数量相等时，让列表滑动一些距离，防止页面列表展示空白
          if (not_found_target_dom_count === MatchMeta.match_mids.length) {
            document.querySelector('.match-list-container').scrollTop += 1
            store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: '' });
          }
        } else {

        }
      }
    }, 500)
  })
}
// 热门模块 精选选项卡 下边的 球种图片
const calculate_ball_type_picture = () => {
  let csid = +props.match_of_list.csid
  let csid_poz_y = '';
  const per_y = -0.60754;  // 1740/(1074/375)/100/rem 根据屏幕宽 和rem计算而来
  switch (csid) {
    case 1:
      csid_poz_y = 0;// 足球
      break;
    case 2:
      csid_poz_y = per_y;// 篮球
      break;
    case 5:
      csid_poz_y = per_y * 2;// 网球
      break;
    case 7:
      csid_poz_y = per_y * 7;// 斯诺克
      break;
    case 10:
      csid_poz_y = per_y * 3;// 羽毛球
      break;
    case 8:
      csid_poz_y = per_y * 4;// 乒乓球
      break;
    case 9:
      csid_poz_y = per_y * 5;// 排球
      break;
    case 4:
      csid_poz_y = per_y * 6;// 冰球
      break;
    case 3:
      csid_poz_y = per_y * 8;// 棒球
      break;
    case 6:
      csid_poz_y = per_y * 9;// 美式足球
      break;
  }
  return csid_poz_y
}
// 清除当前组件所有定时器
const clear_timer = () => {
  // timeout定时器列表
  const timeout_timer_arr = [
    'timer_super11.value',
    'match_change_timer.value',
    'is_new_init_timer2.value',
    'scroll_top_timer.value',
    'scroll_top_timer2.value',
    'need_scroll_height_timer.value',
  ]

  // 批量清除timeout定时器
  for (let timer of timeout_timer_arr) {
    clearTimeout(timer)
    timer = null
  }
}

watch(() => props.match_of_list, (c_match) => {
  media_button_button_type_check()
  mmp_map_title.value = matchListClass.match_period_map(props.match_of_list);
}, { deep: true })

watch(() => props.match_of_list?.mid, (mid_new,mid_old) => {
  if (mid_new) {
    match_changing.value = true;
    /*
    切换赛事时如果足球比分大于0会触发进球动画,
    变量match_changing延迟置为false可避免触发进球动画
      */
    clearTimeout(match_change_timer.value)
    match_change_timer.value = setTimeout(() => {
      match_changing.value = false;
    }, 300);
    mmp_map_title.value = matchListClass.match_period_map(props.match_of_list);
  }
})

// 监听主队比分变化
watch(() => home_score.value, (new_,old_) => {
  if (is_first_coming.value) return;
  if (props.match_of_list.csid != 1) return;
  if (get_footer_sub_changing.value) return;
  if (match_changing.value) return;

  if (new_ > 0 && new_ != old_ && old_ !== null && (menu_type.value == 1 || menu_type.value == 3)) {
    is_show_home_goal.value = true
    hide_home_goal()
  }
})

// 监听客队比分变化
watch(() => away_score.value, (new_,old_) => {
  if (is_first_coming.value) return;
  if (props.match_of_list.csid != 1) return;
  if (get_footer_sub_changing.value) return;
  if (match_changing.value) return;

  if (new_ > 0 && new_ != old_ && old_ !== null && (menu_type.value == 1 || menu_type.value == 3)) {
    is_show_away_goal.value = true
    hide_away_goal()
  }
})
// 监听主队红牌比分变化
watch(() => home_red_score.value, (new_, old_) => {
  if (props.match_of_list.csid != 1) return
  if (home_red_first_change.value) {
    home_red_first_change.value = false;
    return;
  }
  if (new_ > 0 && new_ != old_) {
    is_show_home_red.value = true
    hide_home_red()
  }
})
// 监听客队红牌比分变化
watch(() => away_red_score.value, (new_,old_) => {
  if (props.match_of_list?.csid != 1) return
  if (away_red_first_change.value) {
    away_red_first_change.value = false;
    return;
  }
  if (new_ > 0 && new_ != old_) {
    is_show_away_red.value = true
    hide_away_red()
  }
})

// 监听比分变化
watch(() => props.match_of_list.msc, () => {
  score_switch_handle(props.match_of_list);
  score_value();
})

watch(() => props.match_of_list?.mmp, () => {
  mmp_map_title.value = matchListClass.match_period_map(props.match_of_list);
})

// 监听客队红牌比分变化
watch(() => MenuData.footer_sub_menu_id, (curr) => {
  // 简版玩法之间切换3秒内阻止赔率变化
  is_new_init2.value = false;
  clearTimeout(is_new_init_timer2.value)
  is_new_init_timer2.value = setTimeout(() => {
    is_new_init2.value = true
  }, 3000)
  if ((MenuData.prev_footer_sub_menu_id != curr && curr == 114) ||
    (MenuData.prev_footer_sub_menu_id != curr && MenuData.prev_footer_sub_menu_id == 114)
  ) {
    score_value();
  }
  MenuData.prev_footer_sub_menu_id = curr;
})

const unsubscribe = store.subscribe(() => {
  const new_state = store.getState()
  get_footer_sub_changing.value = new_state.get_footer_sub_changing
  get_collapse_map_match.value = new_state.get_collapse_map_match
  get_show_favorite_list.value = new_state.get_show_favorite_list
  get_img_error_map_mid.value = new_state.get_img_error_map_mid
  get_goto_detail_matchid.value = new_state.get_goto_detail_matchid
  get_goto_detail_match_info.value = new_state.get_goto_detail_match_info
  get_not_found_target_dom_count.value = new_state.get_not_found_target_dom_count
  get_standard_odd_status.value = new_state.get_standard_odd_status
})

onUnmounted(() => {
  unsubscribe()
  Object.values(emitters.value).map((x) => x())
  clear_timer();
})


