<!--
 * @Author: land land@itcom888.com
-->
<template>
  <tab-date @changeTab="onTabChange" @changeMatchDate="onMatchDateChange" @changeDate="onChangeDate"/>
  <!--二级赛事列表-->
  <div class="match-list-page">
    <match-container v-if="curTab === 0 || isClickDetail && curTab === 1" />
    <MatchFirstStep v-else @leagueChange="onLeagueChange" />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue"
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
  // console.log('onTabChange', MatchMeta.get_four_leagues_list())
  curTab.value = e
}
// 当为matches时 切换时间后 监听方法
const onChangeDate = e => {
  MatchMeta.get_four_leagues_list()
}

const onMatchDateChange = e => {
  curDate.value = e
}
const onLeagueChange = (league, game) => {
  isClickDetail.value = true
  curLeague.value = league
}

const goback = () => {
  isClickDetail.value = false
}

onMounted(() => {
  // MatchMeta.get_four_leagues_list()
})

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
  position: absolute;

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