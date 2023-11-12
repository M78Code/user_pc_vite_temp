<!--
 * @Description: 列表页主内容
-->
<template>
  <div :class="['match-list-container', { empty_page: match_is_empty }]" :style="page_style">

    <template v-if="!match_is_empty">
      <component :is="target_com"></component>
    </template>

    <template v-else>
      <!-- 非收藏页 -->
      <NoData class="data-get-empty1" v-if='match_is_empty && !is_collcte_page' which='noMatch' height='400'></NoData>
      <!-- 收藏页 -->
      <NoData class="data-get-empty2" v-if='match_is_empty && is_collcte_page' :which='menu_type === 28 ? "noMatch" : "collect"' height='400'></NoData>
    </template>

    <SecondaryDescription />
    </div>
</template>
 
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
import { compute_css_variables } from "src/core/css-var/index.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";

import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

import { is_hot } from 'src/base-h5/mixin/menu.js'

import NoData from "src/base-h5/components/common/no-data.vue"; // 无网络展示组件

// yazhou-h5 赛事列表
import MatchList1 from './components/match-list1.vue'
// app-h5 赛事列表
import MatchList2 from './components/match-list2.vue'
// ouzhou-h5 赛事列表
import MatchList3 from './components/match-list3.vue'

import MatchListOuZhou from './components/match-list-ouzhou.vue'


import { PROJECT_NAME } from "src/core/index.js"

// 次要玩法描述组件
import SecondaryDescription from "src/base-h5/components/match-list/components/secondary-description.vue";

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


// TODO: 下面需要替换
const invok_source = ref('')
const ws_invoke_key = ref('match_main')
const match_is_empty = ref(false)
const window_scrolly = ref(0)
const match_list_wrapper_height = ref(0)
const is_collcte_page = ref(false)

onMounted(() => {
  // 页面css变量植入
  page_style.value = compute_css_variables({ category: 'component', module: 'match' })
  // 移除相关事件监听
  off_listeners();
  // 绑定相关事件监听
  on_listeners();
})

const config = {
  'app-h5': MatchList2,
  'yazhou-h5': MatchList1,
  'ouzhou-h5': MatchList3,
  // 'ouzhou-h5': MatchListOuZhou
}

const target_com = computed(() => {
  return config[PROJECT_NAME]
})

/**
 * @description: 赛事列表为空通知事件函数
 */
const upd_match_is_empty = (result) => {
  // 当是赛果菜单,三级菜单数据没有时,发送列表赛事数据为空消息,收到消息后页面显示为空页面
  match_is_empty.value = result;
}

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_10: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, upd_match_is_empty).off,
    emitter_6: useMittOn(MITT_TYPES.EMIT_BET_ODD_SYNCHRONIZE, MatchPage.bet_odd_synchronize_handle).off,
    emitter_8: useMittOn(MITT_TYPES.EMIT_SECONDARY_PLAY_UNFOLD_CHANGE, MatchListCard.secondary_play_unfold_change_handle).off,
  };
};

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
}

.empty_page {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>