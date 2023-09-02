<template>
  <!--  v-if="globalAccessConfig.get_searchSwitch()" -->
  <div class="yb-site-left-width" v-if="globalAccessConfig.config_default.searchSwitch" :class="`${main_menu_toggle}`">
    <!-- TODO: @click.stop="search_hot_push.go_to_details()" -->
    <div v-show="!search_isShow" class="search-wrap" :class="main_menu_toggle">
      <div v-show="main_menu_toggle !== 'mini'" class="ellipsis" @click.stop="show_search">
        {{ search_hot_push.hot_push_name || i18n_t("common.search") }}
      </div>
      <icon class="icon" :name="!['theme01_y0', 'theme02_y0'].includes(UserCtr.theme)
        ? `img:${img_search_icon}`
        : `img:${img_search_icon_y0}`
        " size="14px" />
    </div>
  </div>

  <!-- 内嵌版 菜单状态切换按钮 -->
  <template v-if="is_iframe && is_mini_menu && !search_isShow">
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
} from "project_path/src/core/layout/left-menu";

import store from "src/store-redux/index.js";
import SearchHotPush from "src/core/search-class/search_hot_push.js";
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { tooltip_style } from "src/core/config/global-component-style.js";
import { utils } from 'src/core/index.js';

import icon from "src/components/icon/icon.vue";

import UserCtr from "src/core/user-config/user-ctr.js";
import globalAccessConfig from "src/core/access-config/access-config.js"

const img_search_icon = '/public/yazhou-pc/image/svg/search-icon.svg'
const img_search_icon_y0 = '/public/yazhou-pc/image/svg/y0-search-icon.svg'


/** 国际化 */

/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe);

/** stroe仓库 */
const { searchReducer, menuReducer } = store.getState();
const unsubscribe = store.subscribe(() => {
  search_isShow.value = searchReducer.search_isShow
  menu_collapse_status.value = menuReducer.menu_collapse_status
})
/** 销毁监听 */
onUnmounted(unsubscribe)
/**
 * 是否显示搜索组件 default: false
 * 路径: project_path\src\store\module\search.js
 */
const search_isShow = ref(searchReducer.search_isShow)
/** 
 * 获取菜单收起状态 default: false
 * 路径: project_path\src\store\module\menu.js
 */
const menu_collapse_status = ref(menuReducer.menu_collapse_status)

/** 搜索热推赛事 */
const search_hot_push = ref(new SearchHotPush());

/** 保存显示搜索组件状态 */
const set_search_status = (data) => (store.dispatch({
  type: "SET_SEARCH_STATUS",
  data,
}))

/** 展开搜索 */
function show_search() {
  // if (!globalAccessConfig.get_searchSwitch()) {
  if (!globalAccessConfig.config_default.searchSwitch) {
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
    set_current_index();
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
  set_is_mini_menu(!menu_collapse_status.value);
}
</script>

<style lang="scss">
// @import './site-header.scss';
</style>