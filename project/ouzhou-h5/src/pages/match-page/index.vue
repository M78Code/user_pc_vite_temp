<template>
  <!--赛事列表-->
  <div class="match-list-page">
    <match-container />
  </div>
</template>
<script setup>
import { computed, onUnmounted, onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import matchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
const route = useRoute();
const emitters = ref({});
const matchCtr = ref(MatchDataBaseH5);
onMounted(() => {
  init_match_callback()
  // 不让浏览器记住上次的滚动位置
  if ("scrollRestoration" in History) {
    history.scrollRestoration = "manual";
  }
  // 绑定相关事件监听
  on_listeners();
  // 去除参数
  if (!location.search.includes("keep_url")) {
    history.replaceState(null, "", `${location.pathname}${location.hash}`);
  }
});

/**
 * @description 元数据请求回来 初始化赛事加载
 */
const init_match_callback = () => {
  if (route.name !== 'matchList') return
  MatchMeta.set_origin_match_data()
}

const destroy_handle = () => {
  MatchPage.del();
  matchCtr.value.init();
  off_listeners();
};

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD,(v)=> MatchPage.footer_event(v)).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_MAIN_MENU_CHANGE, (v)=> MatchPage.main_menu_change(v)).off,
    emitter_7: useMittOn(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, (v)=> MatchListCard.match_list_scroll_handle(v)).off,
    emitter_11: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, init_match_callback).off,
  };
};
// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x());
};

onUnmounted(() => {
  destroy_handle();
  MatchDataBaseH5.clear()
});

</script>
<style scoped lang="scss">
/* ************** 赛事列表包装器 **************** -S */
.match-list-page {
  width: 100%;
  height: calc(100% - 50px - 56px);
  overflow-y: hidden;
  position: relative;
  .match-list-container{
    height: 100%;
  }
}
</style>
