<template>
  <!--  v-if="globalAccessConfig.get_searchSwitch()" -->
  <div style="display:none">{{SearchPCClass.update_time}}</div>
  <div class="yb-site-left-width" v-if="globalAccessConfig.config.searchSwitch" :class="`${main_menu_toggle || 'normal'}`">
    <!-- TODO: @click.stop="search_hot_push.go_to_details()" -->
    <div v-show="!SearchPCClass.search_isShow" class="search-wrap" :class="`${main_menu_toggle || 'normal'}`">
      <div v-show="main_menu_toggle !== 'mini'" class="ellipsis" @click.stop="show_search">
        {{ search_hot_push.hot_push_name || i18n_t("common.search") }}
      </div>
      <div class="search-icon"  :style="compute_css_obj({ key: 'pc-search-icon' })"></div>
    
    </div>
  </div>

  <!-- 内嵌版 菜单状态切换按钮 -->
  <template v-if="is_iframe && is_mini_menu && !SearchPCClass.search_isShow">
    <div class="menu-collapse-btn" @click="handle_menu_collapse">
      <q-tooltip anchor="top middle" self="center middle"
        :content-style="tooltip_style + ';transform:translateY(34px)'">{{ i18n_t("common.menu_expand") }}</q-tooltip>
    </div>
    <i class="icon-triangle3 q-icon c-icon menu-collapse-triangle"></i>
  </template>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { i18n_t } from "src/boot/i18n.js"
import { useRoute } from "vue-router";
import {
  main_menu_toggle,
  is_mini_menu,
} from "src/base-pc/core/layout/left-menu";

import store from "src/store-redux/index.js";
import SearchHotPush from "src/core/search-class/search_hot_push.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import { tooltip_style } from "src/core/config/global-component-style.js";
import { compute_local_project_file_path } from 'src/output/index.js';
import {SearchPCClass} from 'src/output/project/index.js'
import { IconWapper } from 'src/components/icon/index.js'

import UserCtr from "src/core/user-config/user-ctr.js";
import globalAccessConfig from "src/core/access-config/access-config.js"
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
import { compute_css_obj } from 'src/core/server-img/index.js'




/** 国际化 */

/** 是否内嵌 */
const is_iframe = ref(utils_info.is_iframe);

/** stroe仓库 */
const { searchReducer, menuReducer } = store.getState();
/**
 * 是否显示搜索组件 default: false
 * 路径: project_path\src\store\module\search.js
 */

/** 
 * 获取菜单收起状态 default: false
 * 路径: project_path\src\store\module\menu.js
 */
// const menu_collapse_status = ref(menuReducer.menu_collapse_status)
// const unsubscribe = store.subscribe(() => {
//   const { searchReducer: new_searchReducer, menuReducer: new_menuReducer} = store.getState();
//   search_isShow.value = new_searchReducer.search_isShow
//   menu_collapse_status.value = new_menuReducer.menu_collapse_status
// })
/** 销毁监听 */
// onUnmounted(unsubscribe)

/** 搜索热推赛事 */
const search_hot_push = ref(new SearchHotPush());

/** 保存显示搜索组件状态 */
// const set_search_status = (data) => (store.dispatch({
//   type: "SET_SEARCH_STATUS",
//   data,
// }))

const set_search_status = (flag)=>{
    SearchPCClass.set_search_isShow(flag)
}

/** 展开搜索 */
function show_search() {
  // if (!globalAccessConfig.get_searchSwitch()) {
  if (!globalAccessConfig.config.searchSwitch) {
    return useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t("msg.msg_09"));
  }
  set_search_status(true);
}
const route = useRoute();
/** 初始化 */
function init() {
  if (route.name == "search") {
    show_search();
  } else {
    set_search_status(false);
  }
}
onMounted(init);
/** 监听路由变化 */
watch(
  () => route.name,
  (res) => {
    if (res == "search") {
      show_search();
    }
    // set_current_index();
  }
);

/** 内嵌版 菜单收起状态 */
const set_is_mini_menu = (data) =>
  store.dispatch({
    type: "SET_MENU_COLLAPSE_STATUS",
    data,
  });
/** 内嵌版 菜单状态切换按钮 */
function handle_menu_collapse() {
  // set_is_mini_menu(!menu_collapse_status.value);
}
</script>

<style lang="scss" scoped>
.search-icon{
  height: 14px;
  width: 14px;
}
// @import './site-header.scss';
</style>