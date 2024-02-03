<!--
 * @Description: 列表页主内容
-->

<template>
  <div :class="['match-list-container', { empty_page: match_is_empty, skeleton_page: show_skeleton_screen && is_show_skeleton }]" :style="page_style">

    <!-- 骨架图 -->
    <div class="skeleton-contaniner" v-if="show_skeleton_screen && is_show_skeleton">
      <div class="skeleton-box"><SList :loading_body="true" /></div>
    </div>

    <!-- 列表容器 -->
    <template v-if="!match_is_empty">
      <component :is="target_com"></component>
    </template>

    <template v-else>
      <div v-if="is_search" class="search_tips">
        <span>{{ i18n_t('app_h5.search.search_tips') }}</span>
      </div>
      <!-- 非收藏页 -->
      <NoData class="data-get-empty1" v-else-if='match_is_empty && !is_collect' :which='which' height='400'></NoData>

      <!-- 收藏页 -->
      <NoData class="data-get-empty2" v-else-if='match_is_empty && is_collect' :which='menu_type === 28 ? "noMatch" : "collect"' height='400'></NoData>
      
      <!-- bevis 修改 46949 【SIT】【H5新版复刻】【H5】虚拟体育列表页无数据返回，页面展示空白 -->
      <NoData class="data-get-empty2" v-else :which='menu_type === 28 ? "noMatch" : "comingSoon"' height='400'></NoData>
    </template>

    <SecondaryDescription />

  </div>
</template>
 
<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
import { compute_css_variables } from "src/core/css-var/index.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, PROJECT_NAME } from "src/output/index.js"
import { is_collect, menu_type } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';


import SList from "src/base-h5/components/skeleton/skeleton-list.vue" 
import SecondaryDescription from "src/base-h5/components/match-list/components/secondary-description.vue" 

// yazhou-h5 赛事列表
import MatchList1 from './components/match-list1.vue'
// app-h5 赛事列表
import MatchList2 from './components/match-list2.vue'
// ouzhou-h5 赛事列表
import MatchList3 from './components/match-list3.vue'

// 无网络展示组件
import NoData from "src/base-h5/components/common/no-data.vue"; 

import './styles/index.variables.scss'

const props = defineProps({
  invok_source: String,
  wrapper_scroll_top: Number,
});

const route = useRoute()
const page_style = ref(null);
const emitters = ref({});
let timer_super = null
let timer = ref(null)
let subscription_timer = null
const show_skeleton_screen = ref(false)

// TODO: 下面需要替换
const which = ref('noMatch')
const match_is_empty = ref(false)

onMounted(() => {
  // 页面css变量植入
  page_style.value = compute_css_variables({ category: 'component', module: 'match' })
  // 移除相关事件监听
  off_listeners();
  // 绑定相关事件监听
  on_listeners();

})
onUnmounted(()=>{
  off_listeners() // 移除相关事件监听
})
const config = {
  'app-h5': MatchList2,
  'yazhou-h5': MatchList1,
  'ouzhou-h5': MatchList3,
}

// 赛事渲染组件
const target_com = computed(() => {
  return config[PROJECT_NAME]
})

// 复刻版显示骨架图
const is_show_skeleton = computed(() => {
  return ['app-h5', 'ouzhou-h5'].includes(PROJECT_NAME)
})

/**
 * @description: 赛事列表为空通知事件函数
 */
const upd_match_is_empty = (obj = {}) => {
  // 当是赛果菜单,三级菜单数据没有时,发送列表赛事数据为空消息,收到消息后页面显示为空页面
  const { state = false, type = 'noMatch' } = obj
  which.value = type
  match_is_empty.value = state;
}

// 骨架图隐藏兜底
const reset_show_skeleton_state = lodash.debounce(() => {
  if (show_skeleton_screen.value) show_skeleton_screen.value = false
}, 8000)

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_2: useMittOn(MITT_TYPES.EMIT_SELECT_LEAGUE_COMPLETE,lodash.debounce( (val) => {
      MatchMeta.footer_event({ ...val, text: 'filter' })
    },100)).off,
    emitter_3: useMittOn(MITT_TYPES.EMIT_SHOW_SKELETON_DIAGRAM, (val) => {
      show_skeleton_screen.value = val
      show_skeleton_screen.value && reset_show_skeleton_state()
    }).off,
    emitter_10: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, upd_match_is_empty).off,
    emitter_6: useMittOn(MITT_TYPES.EMIT_BET_ODD_SYNCHRONIZE, MatchPage.bet_odd_synchronize_handle).off,
    emitter_8: useMittOn(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, MatchListCard.secondary_play_unfold_change_handle).off,
    emitter_1: useMittOn(MITT_TYPES.EMIT_WS_STATUS_CHANGE_EVENT,(ws_status, ws_status_old)=>{
      // ws_status 链接状态变化 (0-断开,1-连接,2-断网续连状态)
      if(ws_status != 1) MatchDataBaseH5.scmd_c8_ws_reconnect()
    }).off
  };
};

const is_search = computed(() => {
  return MatchResponsive.is_search.value
})

// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x());
};

// 批量清除定时器
const clear_timer = () => {
  const timer_arr = [timer_super, subscription_timer,];

  for (let timer of timer_arr) {
    clearTimeout(timer);
    timer = null;
  }
};

</script>
 
<style scoped lang="scss">
.match-list-container {
  overflow: hidden;
  position: relative;
  height: 100%;
  .main-container{
    height: 100%;
  }
  .skeleton-contaniner{
    height: 100%;
    position: relative;
    z-index: 100;
    .skeleton-box{
      position: absolute;
      top: 10px;
      left: 0;
      height: 100%;
      width: 100%;
      :deep(.skeleton-wrap){
        padding-top: 0 !important;
        position: static !important;
        width: 100%;
        left: 0;
        transform: none;
      }
    }
  }
}

.empty_page {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.skeleton_page{
    display: block;
  }
  .search_tips{
    border-top: 2px solid var(--q-gb-bd-c-1);
    position: absolute;
    top: 0;
    background: #fff;
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;//上下对齐
		justify-content: center;//两端对齐
    color: #afb3c8;
    font-size: 14px;
  }
}
</style>