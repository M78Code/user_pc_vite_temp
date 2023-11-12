<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-10 13:53:40
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-12 13:59:45
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <tab-date @changeTab="onTabChange" @changeDate="onDateChange" />
  <!-- 返回上一级 -->
  <div class="back" v-if="isClickDetail" @click="isClickDetail = false">
  </div>
  <!--二级赛事列表-->
  <div class="match-list-page">
    <match-container v-if="curTab === 0" />
    <MatchFirstStep v-else   @leagueChange="onLeagueChange"/>
  </div>
</template>
<script setup>
import { ref } from "vue"
import tabDate from './tab-date/tab-date.vue';
import MatchFirstStep from "./match-first-step.vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
//是否点击联赛详情
const isClickDetail = ref(false)

const curTab = ref(0)

const curDate = ref('')

const onTabChange = e => {
  curTab.value = e
  console.log(e)
}
/**
 * 时间筛选 默认值参数
 * @param {*} params 
 */
const onDateChange = (params) => {
  curDate.value = params.md
  console.log("请求params",params)
  // MatchMeta.set_origin_match_data()
}
const onLeagueChange = (league, game) => {
    console.log('league, game: ', league, game);
    isClickDetail.value=true
}

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
