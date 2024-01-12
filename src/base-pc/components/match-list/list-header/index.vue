<!--
 * @Author: Amor
 * @Date: 2020-06-03 18:00
 * @Description: 赛事列表头部
-->
<template>
  <div style="display: none;"> {{ LayOutMain_pc.layout_version }}</div>
  <div class="c-match-list-header yb-flex-between "
    :class="MenuData.menu_root == 2 && MenuData.match_list_api_config.guanjun ? 'today-champion' : ''">
    <!-- left -->
    <div class="col-left row items-center">
      <!--全部按钮-->
      <div v-show="!filterHeader.show_filter_popup && !is_search_page" @click="on_change_list_type('match')"
        class="btn-wrap match-btn yb-flex-center cursor-pointer" :class="compute_quanbu_btn_class()">
        {{ i18n_t("common.all") }}
      </div>
      <!--收藏按钮-->
      <div v-show="MenuData.compute_if_can_show_shoucang() && !filterHeader.show_filter_popup && !is_search_page"
        @click="(enable_collect_api ? collect_count : true) && on_change_list_type('collect')"
        class="btn-wrap collect-btn yb-flex-center cursor-pointer"
        :class="{ 'active': vx_layout_list_type == 'collect', }" :title="i18n_t('list.my_collect')">
        <icon-wapper name="icon-star" :class="{ active: collect_count }" size="14px"
          :color="vx_layout_list_type == 'collect' ? '#272A33' : collect_count ? '#EFCC6E' : '#ABBAC8'" />
        <span class="number" :class="{ 'had-count': collect_count }">
          {{ collect_count }}
        </span>
      </div>
      <!--当前菜单-->
      <div class="list-title  row items-center">
        <!-- <div class="title-text yb-font-bold ellipsis" :class="{'w105': show_select_time && is_short_title}" v-tooltip="{content:page_title,overflow:1}" v-html="page_title"></div> -->
        <!-- <span v-if="is_search_page" class="title-text path-icon-wrapper" :class="{'search':is_search_page}">
          <span class="icon-triangle3 search-path-icon"></span>
          <span>{{ get_search_keyword.substr(5)}}</span>
        </span> -->
        <span class="title-text path-icon-wrapper">
          <span>{{ page_title }}</span>
        </span>
      </div>
    </div>
    <!-- right -->
    <!-- 冠军 电子竞技 vr  没有 -->
    <div class="col-right yb-flex-center">
      <div class="search-wrap" v-if="is_show_input">
        <icon-wapper class="search-icon" color="#ABBAC8" name="icon-search" size="12px" />
        <input class="search-input" @input="$emit('filter_league_data', leagueName)" v-model="leagueName"
          :placeholder="i18n_t('common.search_text')" type="search">
      </div>
      <!-- 即将开赛筛选 -->
      <!-- 今日有 收藏没有 冠军没有 -->
      <com-select v-else-if="MenuData.menu_root == 2 && vx_layout_list_type != 'collect' && !MenuData.is_kemp()"
        :options="time_list" v-model="filterHeader.open_select_time" showKey="title" @input="select_time_change">
        <template #prefix><span class="fg1">{{ i18n_t("common.match_soon_filtr") }}</span></template>
      </com-select>
      <!-- 选择联赛按钮 -->
      <!-- 电子竞技 vr 收藏 没有  -->
      <div v-show="MenuData.compute_if_can_show_league_fliter() && vx_layout_list_type != 'collect'"
        @click.stop="toggle_filter_popup"
        class="select-btn leagues-btn yb-flex-center cursor-pointer filter-handle yb-hover-bg"
        :class="{ active: filterHeader.show_filter_popup, disable: load_data_state != 'data' && !filterHeader.show_filter_popup }"
        :id="DOM_ID_SHOW && `menu-leagues-filter-leagues-btn`">
        {{ i18n_t('filter.select_league') }}
        <span class="status yb-font-bold" :class="filterHeader.show_filter_popup ? 'filter_full_all' : ''">{{ (filterHeader.vx_filter_checked_all
          ||
          filterHeader.checked_count == 0) ? i18n_t('common.all') : filterHeader.checked_count }}</span>
        <i class="icon-arrow q-icon c-icon" size="14px"></i>
      </div>
      <!-- 列表排序按钮 -->
      <!-- 电子竞技 vr 没有  -->
      <div v-show="MenuData.compute_if_can_show_sort()" show_type="sort" class="flex list-sort select-btn  yb-hover-bg">
        <div v-for="(sort, index) in sort_option" @click="on_click_sort(sort)" :key="sort.id "
          :class="[sort.id == vx_match_sort ? 'active' : 'yb-hover-bg', 'list-sort-item']"
          v-show="!filterHeader.show_filter_popup && !is_search_page">
          {{ sort.name }}
        </div>
      </div>
      <!-- 列表刷新 -->
      <div v-show="computed_show_refresh" class="select-btn refresh-btn yb-flex-center yb-hover-bg">
        <slot name="refresh_icon"></slot>
      </div>
      <div class="unfold-btn" @click="LayOutMain_pc.set_unfold_multi_column(false)"
        v-if="MenuData.is_multi_column && !filterHeader.show_filter_popup && !is_search_page && LayOutMain_pc.is_unfold_multi_column">
        <span class="text">{{ i18n_t('icon_tips.unfold') }}</span>
        <icon-wapper class="icon-arrow q-icon c-icon" size="12px"></icon-wapper>
      </div>
    </div>
  </div>
</template>
<script setup>

import { ref, computed } from 'vue';

import comSelect from "src/base-pc/components/match-results/select/select/index.vue";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { PageSourceData, GlobalSwitchClass,MenuData } from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'
// import UserCtr from 'src/core/user-config/user-ctr.js'
// //import store from 'src/store-redux/index.js';
import filterHeader from "src/core/filter-header/filter-header.js";
import { IconWapper } from 'src/components/icon'


const page_source = PageSourceData.page_source;
const is_search_page = page_source.includes('search');
// const props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
const props = defineProps({
  collect_count: {
    type: Number,
    default: () => null,
  },
  load_data_state: {
    type: String,
    default: () => '',
  },
  is_show_input: {
    type: Boolean,
    default: () => false,
  },
  is_show_hot: {
    type: Boolean,
    default: () => false,
  },
})


// 列表显示内容  match:赛事 collect:收藏 search:搜索
const vx_layout_list_type = ref('match');
// 获取当前页路由信息
const vx_layout_cur_page = ref(null);

const vx_match_sort = ref(GlobalSwitchClass.get_match_sort())
const match_sort_show = ref(false) //切换排序是否显示
const leagueName = ref("") //模糊搜索联赛条件
const time_list = ref(null) //即将开赛筛选数据
const DOM_ID_SHOW = ref(null)

const sort_option = computed(() => {
  let option = [
    {
      id: 1,
      name: i18n_t('set.match_sort'),//"按联赛排序",
      icon: "icon-sort_league"
    },
    {
      id: 2,
      name: i18n_t('set.time_sort'),//"按时间排序",
      icon: "icon-sort_date"
    }
  ]
  if (!GlobalAccessConfig.get_sortCut()) {
    option = []
  }
  return option
})
// 是否显示刷新 btn
const computed_show_refresh = computed(() => {
  // !["hot_all"].includes(vx_cur_menu_type.value.type_name) &&
  let _show =  filterHeader.show_filter_popup == false && !is_search_page
  return _show
})
// //是否搜索页
// const is_search_page = computed(() => {
//   return vx_layout_cur_page.value.cur == "search";
// })
//当前页面菜单title
const page_title = computed(() => {
  //当前点击的是今日还是早盘 今日 2 早盘为3
  let { jinri_zaopan } = MenuData.left_menu_result || {}
  let TITLE = {
    1: i18n_t("menu.match_play"), //"滚球",
    2: i18n_t("menu.match_today"), //"今日",
    3: i18n_t("menu.match_early"), //"早盘",
    500: i18n_t("menu.match_hot"), //"热门赛事"
    400: i18n_t("menu.match_winner"), //"冠军"
  };
  let _page_title = ""
  let _menu_type = MenuData.menu_root
  if (is_search_page) {
    _page_title = i18n_t("common.search_title")
    // 今日|早盘|串关
  } else if ([2, 3].includes(_menu_type)) {
    let sport_name = MenuData.get_current_left_menu_name()
    if (sport_name) {
      _page_title = `${TITLE[_menu_type]}（${sport_name}）`
    } else {
      _page_title = TITLE[_menu_type]
    }
  } else if ([1, 500].includes(_menu_type)) {
    _page_title = TITLE[_menu_type]
  } else if (_menu_type == 400) {
    _page_title = TITLE[_menu_type]
  }
  if (jinri_zaopan == 2 && _menu_type == 2000) {
    //'今日  (电子竞技)'
    _page_title = `  ${i18n_t("menu.match_today")} (${i18n_t("common.e_sports")})`
  } else if (jinri_zaopan == 3 && _menu_type == 2000) {
    //'早盘  (电子竞技)'
    _page_title = `  ${i18n_t("menu.match_early")} (${i18n_t("common.e_sports")})`
  }
  return _page_title;
})
// 前端控制是否禁用收藏功能
const enable_collect_api = computed(() => {
  return  GlobalAccessConfig.GET_ENABLE_COLLECT_API() || GlobalAccessConfig.get_collectSwitch()
})
//设置即将开赛筛选列表
let hour = i18n_t('common.hour')
time_list.value = [
  { label: i18n_t('common.all'), title: i18n_t('common.all'), value: null },
  { label: i18n_t('filter.select_time.3h'), title: '3' + hour, value: 3 },
  { label: i18n_t('filter.select_time.6h'), title: '6' + hour, value: 6 },
  { label: i18n_t('filter.select_time.9h'), title: '9' + hour, value: 9 },
  { label: i18n_t('filter.select_time.12h'), title: '12' + hour, value: 12 },
]
// 显示部分dom ID
DOM_ID_SHOW.value = window.BUILDIN_CONFIG.DOM_ID_SHOW;
// console.error('reload')
// 刷新时重置为列表展开
// store.dispatch({
//   type: 'SETCUREXPANDLAYOUT',
//   data: "match-list"
// })
// function set_unfold_multi_column() {
//   store.dispatch({
//     type: 'SET_UNFOLD_MULTI_COLUMN',
//     data: false
//   })
// }
/**
 * 计算 全部 按钮样式
 */
function compute_quanbu_btn_class () {
  let str = ''
  if (vx_layout_list_type.value == 'match') {
    str += 'active'
  }
  let can_show = MenuData.compute_if_can_show_shoucang()
  //如果不能显示收藏
  if (!can_show) {
    str += '   collect-btn'
  }
  return str
}
/**
 * 即将开赛筛选
 */
function select_time_change () {
  //设置session
  sessionStorage.setItem('is_select_time', '1')
  useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, {});
}
/**
 * 重置条件
 */
function reset_filter () {
  filterHeader.set_checked_count(null)
  // filterHeader.set_open_select_time(null)
}
/**
 * @ Description:切换联赛排序
 * @param {object} row 切换的排序
 * @return {undefined} undefined
 */
function on_click_sort(row) {
  if (!GlobalAccessConfig.get_sortCut()) return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"))
  match_sort_show.value = false
  // store.dispatch({
  //   type: 'SET_MATCH_SORT',
  //   data: row.id
  // })
}
/**
 * @Description:切换联赛筛选
 * @return {undefined} undefined
 */
function toggle_filter_popup() {
  if (!GlobalAccessConfig.get_filterSwitch()) return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
  if ((props.load_data_state != 'data' && !filterHeader.show_filter_popup)) {
    return
  }
  console.log('!filterHeader.show_filter_popup',!filterHeader.show_filter_popup)
  //打开或关闭赛事筛选弹层 
  // store.dispatch({
  //   type: 'SET_SHOW_FILTER_POPUP',
  //   data: !filterHeader.show_filter_popup
  // })
  filterHeader.set_show_filter_popup(!filterHeader.show_filter_popup)
  if (filterHeader.show_filter_popup) {
    //设置即将开赛筛选默认值
    reset_filter()
  }
}
/**
 * @description 切换列表展示是的收藏还是非收藏
 *
 * @param  {string} type
 * @return {undefined} undefined
 */
function on_change_list_type (type) {
  if (type == vx_layout_list_type.value) {
    return
  }
  vx_layout_list_type.value=type
  // let { lv2_mi, lv1_mi, jinri_zaopan, root, guanjun } = MenuData.left_menu_result
  // let apiType = 1
  // const api_params = {
  //   2000: {
  //     match: "post_fetch_esports_matchs",
  //     colloet: "post_collect_list_es"
  //   },  //
  //   400: {
  //     match: "post_champion_list",
  //     colloet: "post_fetch_collect_list"
  //   },
  //   1: {
  //     match: "post_fetch_match_list",
  //     colloet: "post_fetch_collect_list"
  //   },
  //   500: {
  //     match: "post_fetch_match_list",
  //     colloet: "post_fetch_collect_list"
  //   },
  //   other: {
  //     match: "post_league_list",
  //     colloet: "post_fetch_collect_list"
  //   }
  // }
  // let api_name = api_params.other.match
  // if ([1, 500, 300, 400, 2000].includes(Number(root))) {
  //   api_name = api_params[root].match
  // }
  // if (type === "collect") {
  //   // 前端开    后台开       >开
  //   // 前端开    后台关       >关
  //   // 前端关    后台开       >关
  //   // 前端关    后台关       >关
  //   if (!enable_collect_api || !GlobalAccessConfig.get_collectSwitch()) {
  //     return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
  //   }
  //   apiType = 2
  //   api_name = api_params.other.colloet
  //   if ([1, 500, 300, 2000].includes(Number(root))) {
  //     api_name = api_params[root].colloet
  //   }
  // }
  // // 调用列表接口
  // // 当前 pid 和 orpt
  // let lv2_mi_info = BaseData.mi_info_map[`mi_${lv2_mi}`];
  // // 父级euid
  // let euid;
  // if ([2, 3].includes(Number(root))) {
  //   // 今日 早盘 常规赛事
  //   if (lv1_mi == 118) {
  //     // 娱乐下只有冠军 直接写死
  //     euid = root == 3 ? '3020212' : '3020112'
  //   } else {
  //     euid = BaseData.mi_info_map[`mi_${lv1_mi}${jinri_zaopan}`].euid
  //   }
  //   lv2_mi_info = {
  //     apiType,
  //     "orpt": "0",
  //     "pids": "",
  //     ...lv2_mi_info,
  //     euid,
  //   }
  //   if (root == 3) {
  //     // 早盘获取选中的时间
  //     let { match_list: { params: { md, index } } } = MenuData.match_list_api_config
  //     lv2_mi_info.md = md
  //     lv2_mi_info.index = index || 0 // 早盘收藏 切换后回到原来的
  //   }
  // } else if (root == 400) {
  //   guanjun = "guanjun"
  //   // 冠军
  //   let { mid_menu_result } = MenuData
  //   lv2_mi_info = {
  //     ...lv2_mi_info,
  //     apiType,
  //     "sportId": (1 * mid_menu_result.mi - 400) || '',
  //     "outrightMatches": 1,
  //     "orpt": 18,
  //   }
  // } else if (root == 2000) {
  //   // 电子竞技
  //   let dianjing_sublist = BaseData.dianjing_sublist
  //   let current_menu = dianjing_sublist.find(item => item.mi == lv2_mi) || {}
  //   lv2_mi_info = {
  //     ...lv2_mi_info,
  //     "category": 1,
  //     "csid": current_menu.csid,
  //     "collect": 1,
  //     apiType,
  //     md: (MenuData.match_list_api_config.match_list || {}).params.md,
  //   }
  // } else if (root == 500) {
  //   let { mid_menu_result } = MenuData
  //   euid = mid_menu_result.euid
  //   // 没有就重新获取
  //   if (!mid_menu_result.euid) {
  //     // 热门默认赛事
  //     let mi_500_obj = BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {
  //       sl: [],
  //     };
  //     // 热门赛事有值的
  //     let { mi } = mi_500_obj['sl'].find(item => item.ct)
  //     let mi_info = BaseData.mi_info_map[`mi_${mi}`] || {};
  //     euid = mi_info.euid
  //   }
  //   // 热门赛事
  //   lv2_mi_info = {
  //     ...lv2_mi_info,
  //     apiType,
  //     hotMatches: euid == "30199" ? '1' : '', // 热门赛事 全部/赛事 才是1
  //     euid,
  //     "orpt": euid == "30101" ? '12' : '-1',  // 热门赛事 竞足 12，其他-1
  //     pids: euid == "30101" ? -999 : '',
  //   }
  // } else if (root == 1) {
  //   // 滚球赛事
  //   let { mid_menu_result } = MenuData
  //   lv2_mi_info = {
  //     ...lv2_mi_info,
  //     apiType,
  //     euid: mid_menu_result.euid,
  //     "orpt": "-1",
  //     tid: ""
  //   }
  // }
  // let config = {
  //   begin_request: true,
  //   is_collect: type == "collect",
  //   route: "list",
  //   root: "",
  //   sports: "",
  //   guanjun,  // 常规赛种下 冠军
  //   match_list: {
  //     api_name,
  //     params: {
  //       "cuid": UserCtr.get_uid || '',
  //       "sort": vx_match_sort.value,
  //       "selectionHour": filterHeader. open_select_time,
  //       ...lv2_mi_info,
  //     },
  //   }
  // }
  MenuData.set_is_collect(type === "collect")
  MenuData.set_match_list_api_config(config);
}
</script>
<style lang="scss" scoped>
.c-match-list-header {
  padding: 0 10px;
  width: 100%;
  height: 36px;
  .filter_full_all {
    font-weight: bold;
  }
  .col-left {
    .list-title {
      margin-right: 20px;
      .title-icon {
        margin-right: 10px;
      }
      .title-text {
        font-size: 14px;
      }
      .path-icon-wrapper {
        display: flex;
        align-items: center;
      }
      .search-path-icon {
        font-size: 18px;
        margin: 0 4px;
        font-weight: bold;
        &:before {
          color: #595f73;
        }
      }
      .league-logo {
        margin-right: 10px;
        width: 18px;
        height: 18px;
      }
    }
    .btn-wrap {
      padding: 0px 12px;
      height: 26px;
      &.match-btn {
        border-radius: 2px 0 0 2px;
      }
      &.collect-btn {
        border-radius: 0 2px 2px 0;
        margin-right: 10px;
      }
      .number {
        margin-left: 6px;
      }
    }
    .w105 {
      width: 105px;
    }
  }
  .col-right {
    .search-wrap {
      position: relative;
      .search-icon {
        position: absolute;
        right: 6px;
        top: 8px;
      }
      .search-input {
        margin-left: 5px;
        height: 26px;
        width: 140px;
        padding-right: 20px;
        padding-left: 10px;
        outline: none;
        border-radius: 2px;
        font-size: 12px;
      }
    }
    .list-sort {
      .list-sort-item {
        padding: 2px 11px;
        border-radius: 12px;
      }
    }
    .select-btn {
      margin-left: 5px;
      padding: 2px 8px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid transparent;
      &.disable {
        cursor: not-allowed !important;
      }
      &.refresh-btn {
        padding: 4px 8px;
      }
      &.leagues-btn {
        .status {
          margin-left: 5px;
        }
        .icon-arrow {
          margin-left: 5px;
          transform: rotate(180deg);
          &::before {
            color: #abbac8;
          }
        }
      }
      &.list-sort {
        padding: 0;
      }
      &.refresh-btn {
        width: 24px;
        height: 24px;
      }
    }
    .unfold-btn {
      margin-left: 4px;
      border-radius: 11px;
      background-color: skyblue;
      padding: 2px 8px 2px 12px;
      color: var(--q-gb-t-c-1);
      display: flex;
      align-items: center;
      cursor: pointer;
      .text {
        padding-right: 2px;
      }
      .icon-arrow {
        transform: rotate(-90deg);
        &::before {
          color: var(--q-gb-t-c-1);
        }
      }
    }
    .icon-toggle1 {
      margin-left: 15px;
    }
  }
}
</style>
<style lang="scss">
@import url('./list_header.scss');
/** 联赛排序 -S*/
.match-sort-wrap {
  margin: 0 !important;
  padding: 5px 0;
  height: 62px;
  border-radius: 2px !important;
  transform: translate(-16px, 4px);
  overflow: visible !important;
  .triangle {
    position: absolute;
    width: 5px;
    height: 5px;
    transform: rotate(45deg);
    left: 29px;
    top: -2px;
  }
  .item-wrap {
    padding: 0 10px;
    display: flex;
    align-items: center;
    height: 26px;
    cursor: pointer;
    .text {
      margin-left: 6px;
    }
  }
  &.style2 {
    transform: translate(-47px, 4px);
    .triangle {
      left: 60px;
    }
  }
}
/** 联赛排序 -E*/
</style>