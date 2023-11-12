<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-10 13:53:40
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-12 18:15:43
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 返回上一级 -->
  <!-- <div class="back" v-if="isClickDetail && curTab === 1 || true">
                            <div class="menu_list_top_tab_background"></div>
                            <span> {{ curCountry }}</span>
                            <IconWapper color="#888" name="icon-triangle1" size="14px" class="icon-wapper-more" />
                            <span> {{ curLeague }}</span>
                          </div>
                          <tab-date v-else @changeTab="onTabChange" @changeDate="onDateChange" /> -->
  <div class="back">
    <div class="menu_list_top_tab_background"></div>
    <span> {{ curCountry?.national }}</span>
    <IconWapper color="#888" name="icon-triangle1" size="14px" class="icon-wapper-more" />
    <span> {{ curLeague?.title }}</span>
  </div>
  <tab-date @changeTab="onTabChange" @changeDate="onDateChange" />
  <!--二级赛事列表-->
  <div class="match-list-page">
    <match-container v-if="curTab === 0 || isClickDetail && curTab === 1" />
    <MatchFirstStep v-else @leagueChange="onLeagueChange" />
  </div>
</template>
<script setup>
import { ref } from "vue"
import tabDate from './tab-date/tab-date.vue';
import MatchFirstStep from "./match-first-step.vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { IconWapper } from 'src/components/icon'

import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
//是否点击联赛详情
const isClickDetail = ref(false)

const curTab = ref(0)

const curDate = ref('')

const curLeague = ref({})

const onTabChange = e => {
  curTab.value = e
}

const onDateChange = e => {
  console.log('e: ', e);
  //根据时间筛选列表
  MatchMeta.filter_match_by_time(e)
  curDate.value = e.md
  console.log("请求params", params)
}
const onLeagueChange = (league, game) => {
  console.log('league, game: ', league, game);
  isClickDetail.value = true
  curLeague.value = league
}

const goback = () => {
  isClickDetail.value = false

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

.back {
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  position: relative;

  .menu_list_top_tab_background {
    width: 100px;
    height: 49px;
    position: absolute;
    top: 0;
    right: 0;
    background: url("./menu_list_top_background_icon.png") no-repeat;
    background-size: cover;
  }
}
</style>
