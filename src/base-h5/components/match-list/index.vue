<!--
 * @Description: 列表页主内容
-->
<template>
  <div :class="['match-list-container', { empty_page: match_is_empty }]" :style="page_style">
    <template v-if="!match_is_empty">
      <match-list
        :source="invok_source ? invok_source : 'match_main'"
        :window_scrolly="window_scrolly" 
        :match_list_wrapper_height="match_list_wrapper_height">
      </match-list>
      <!-- 到底了容器原加载更多容器-->
      <div :class="['loading-more-container', { home_hot: is_hot }]" v-if="match_mids.length > 3">
        <div style="color:#AAAEB8;font-size:.12rem;"> {{ $t("scroll_wrapper.is_footer") }} </div>
      </div>
    </template>

    <template v-else>
      <!-- 非收藏页 -->
      <no-data class="data-get-empty1" v-if='match_is_empty && !is_collcte_page' which='noMatch' height='400'></no-data>
      <!-- 收藏页 -->
      <no-data class="data-get-empty2" v-if='match_is_empty && is_collcte_page' :which='menu_type === 28 ? "noMatch" : "collect"' height='400'></no-data>
    </template>
  </div>
</template>
 
<script setup>
import { ref, watch, onMounted } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
import matchList from "./components/match-list.vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import store from "src/store-redux/index.js";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import { match_mids } from 'src/base-h5/mixin/userctr.js'
import { compute_css_variables } from "src/core/css-var/index.js"
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import noData from "src/base-h5/components/common/no-data.vue"; // 无网络展示组件

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
const  ws_invoke_key = ref('match_main')
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
  const timer_arr = [ timer_super, subscription_timer, ];

  for (let timer of timer_arr) {
    clearTimeout(timer);
    timer = null;
  }
};


</script>
 
<style scoped lang="scss">
.match-list-container{
  height: 667px;
  overflow: hidden;
  position: relative;
}
.empty_page{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>