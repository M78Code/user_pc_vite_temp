<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-10 13:53:40
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-11 14:04:48
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <tab-date v-if="!isClickDetail" />
    <!-- 返回上一级 -->
    <div class="back" v-if="isClickDetail" @click="isClickDetail = false">
    </div>
      <!--二级赛事列表-->
      <div class="match-list-page">
        <match-container v-if="isClickDetail" />
        <MatchFirstStep v-else />
      </div>

</template>
<script setup>
import { computed, onUnmounted, onMounted, watch, ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchPage from "src/core/match-list-h5/match-class/match-page.js";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'
import MatchListCard from "src/core/match-list-h5/match-card/match-list-card-class";
import tabDate from './tab-date/tab-date.vue';
import MatchFirstStep from "./match-first-step.vue";
const emitters = ref({});
const tabValue = ref('matches');
//是否点击详情
const isClickDetail = ref(false)

onMounted(() => {
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

const destroy_handle = () => {
  off_listeners();
};

// 绑定相关事件监听
const on_listeners = () => {
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_MENU_CHANGE_FOOTER_CMD, (v) => MatchPage.footer_event(v)).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_MAIN_MENU_CHANGE, (v) => MatchPage.main_menu_change(v)).off,
    emitter_7: useMittOn(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, (v) => MatchListCard.match_list_scroll_handle(v)).off,
  };
};
// 移除相关事件监听
const off_listeners = () => {
  Object.values(emitters.value).map((x) => x());
};

onUnmounted(() => {
  destroy_handle();
  // MatchDataBaseH5.clear()
});

</script>
<style scoped lang="scss">
/* ************** 赛事列表包装器 **************** -S */
.match-list-page {
  width: 100%;
  height: calc(100% - 2.1rem);
  overflow-y: hidden;
  position: relative;

  .match-list-container {
    height: 100%;
    background: #fff !important;

    :deep(.scroll-wrapper) {
      background: #fff !important;

      .s-w-item {
        background: #fff !important;
      }
    }
  }
}
</style>
