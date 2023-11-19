<!--
 * @Author: land land@itcom888.com
-->
<template>
  <tab-date @changeTab="onTabChange" @changeMatchDate="onMatchDateChange" @changeDate="onChangeDate" @changeArea="onChangeArea"/>
  <!--二级赛事列表-->
  <div class="match-list-page">
    <match-container v-if="state.curTab === 0 || state.isClickDetail && state.curTab === 1" />
    <MatchFirstStep v-else @leagueChange="onLeagueChange" />
  </div>
</template>
<script setup>
import { onMounted, reactive, onUnmounted, ref  } from "vue"
import tabDate from './components/tab-date.vue';
import MatchFirstStep from "./components/match-first-step.vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { IconWapper } from 'src/components/icon'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import BaseData from 'src/core/base-data/base-data.js'

const emitters = ref({})
const state = reactive({
  isClickDetail: false,  //是否点击联赛详情
  curTab: 0,
  curDate: '',
  curLeague: {},
  curArea: '',
  curFilterDate: ''
})

onMounted(() => {
  // 元数据有缓存的情况下 立即执行 set_origin_match_data 能拿到数据， 没数据的情况下拿不到则掉接口
  // if (BaseData.is_emit) {
  //   MatchMeta.set_origin_match_data()
  //   BaseData.set_is_emit(false)
  // } else {
  //   MatchMeta.get_target_match_data({})
  // }
})
onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
})

const onTabChange = e => {
  state.curTab = e
}
// 当为matches时 切换时间后 监听方法
const onChangeDate = e => {
  state.curLeague = e
}

const onMatchDateChange = e => {
  state.curDate = e
}
const onLeagueChange = (league, game) => {
  state.isClickDetail = true
  state.curLeague = league
}

const onChangeArea = e => {
  state.curArea = e
}

const getAreaLeaguesData = () => {
  const params = {
    area: state.curArea,
    date: state.curFilterDate
  }
  // 后续调用新接口

  
}

const goback = () => {
  state.isClickDetail = false
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
  position: absolute;

  .menu_list_top_tab_background {
    width: 100px;
    height: 49px;
    position: absolute;
    top: 0;
    right: 0;
    background: url($SCSSPROJECTPATH+"/image/list/league_bg.png") no-repeat;
    background-size: cover;
  }
}
</style>