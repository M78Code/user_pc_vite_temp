<!--
 * 早盘，今日赛事页面
-->
<template>
  <tab-date @changeTab="onTabChange" @changeMatchDate="onMatchDateChange" @changeDate="onChangeDate" @changeArea="onChangeArea" :areaList="state.leagueData"/>
  <!--二级赛事列表-->
  <div class="match-list-page">
    <MatchContainer v-if="state.curTab === 0 || state.isClickDetail && state.curTab === 1" />
    <MatchFirstStep v-else @leagueChange="onLeagueChange" :leaguesMatchs="state.leagueAreaData"/>
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
  curFilterDate: '',
  leagueData: [],
})

onMounted(() => {
  BaseData.is_emit && MatchMeta.set_origin_match_data()
  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, () => {
      if (!BaseData.is_emit) {
        MatchMeta.set_origin_match_data({})
      }
    }).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_OUZHOU_LEFT_MENU_CHANGE, () => {
      if (state.curTab) {
        onChangeDate(12)
      }
    })
  }
})
onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
})

const onTabChange = e => {
  state.curTab = e
  if (state.curTab) {
    onChangeDate(12) // 默认展示12个小时的数据
  }
}
// 当为matches时 切换时间后 监听方法
const onChangeDate = e => {
  state.curLeague = e
  MatchMeta.get_ouzhou_leagues_data(e).then(res => {
    if (!res.length) return
    state.leagueData = res
    onChangeArea(res[0].id)
  })
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
  const arr = state.leagueData.find(i => i.id === e)['tournamentList']
  arr.forEach(i => {
    i.visible = true
    i.tid = i.id
  })
  state.leagueAreaData = arr
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
    background-color: var(--q-gb-bg-c-2) !important;

    :deep(.scroll-wrapper) {
      background-color: var(--q-gb-bg-c-2) !important;

      .s-w-item {
        background-color: var(--q-gb-bg-c-2) !important;
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