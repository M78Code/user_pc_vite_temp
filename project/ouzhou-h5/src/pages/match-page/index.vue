<!--
 * 欧洲版早盘，今日赛事页面
-->
<template>
  <tab-date v-show="!store.isLeagueDetail" @changeTab="onTabChange" @changeDate="onChangeDate" @changeArea="onChangeArea"/>
  <div class="league-list" v-show="store.isLeagueDetail" @click="goBackToLeague">
    <!-- {{ store.selectLeague }} -->
    <div class="area">{{ store.selectArea.introduction }}</div>
    <IconWapper color="#888" name="icon-triangle1" size="16px" class="icon-wapper-more" />
    <div class="league">{{ store.selectLeague.nameText }}</div>
  </div>
  <!--二级赛事列表-->
  <div class="match-list-page" :class="[{ 'league-filter': store.tabActive === 'League'  }]">
    <MatchFirstStep v-if="store.tabActive === 'League' && !store.isLeagueDetail" />
     <!-- <NoData v-else-if="store.tabActive === 'Outrights'" which='comingSoon' class="data-get-empty2" height='400'></NoData> -->
    <MatchContainer v-else/>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import tabDate from './components/tab-date.vue';
import MatchFirstStep from "./components/match-first-step.vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import { store } from "project_path/src/pages/match-page/index.js"
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { useMittOn, MITT_TYPES } from "src/core/mitt";
import { IconWapper } from 'src/components/icon'
import BaseData from 'src/core/base-data/base-data.js'
import { MenuData } from "src/output/index.js";
// import NoData from "src/base-h5/components/common/no-data.vue";
import * as ws_message_listener from "src/core/utils/common/module/ws-message.js";;
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

let message_fun = null
let timer = null
const emitters = ref({})

onMounted(() => {
  const data = sessionStorage.getItem('match_list_params') && JSON.parse(sessionStorage.getItem('match_list_params'))
  if (data && data.tabActive === "League") {
    Object.keys(store).forEach(key => {
      store[key] = data[key]
    })
    MatchMeta.clear_match_info()
    MatchMeta.get_ouzhou_leagues_list_data(data?.selectLeague?.tid, data?.curSelectedOption?.timestamp)
	} else {
    MatchMeta.set_prev_scroll(0)
    initMatchPage()
    onTabChange(MenuData.match_menu)
    // BaseData.is_emit && MatchMeta.set_origin_match_data()

    // 增加监听接受返回的监听函数
    message_fun = ws_message_listener.ws_add_message_listener((cmd, data) => {
      if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
        MatchMeta.handle_remove_match(data)
      } else {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          MatchMeta.handle_ws_directive({ cmd, data })
          clearTimeout(null)
          timer = null
        }, 1500)
      }
    })
  }

  window.addEventListener('beforeunload', clearSessionStorageData)

  emitters.value = {
    emitter_1: useMittOn(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA, () => {
      if (!BaseData.is_emit) {
        MatchMeta.set_origin_match_data()
      }
    }).off,
    emitter_2: useMittOn(MITT_TYPES.EMIT_OUZHOU_LEFT_MENU_CHANGE, (obj) => {
      //早盘串关数量为0  隐藏赛事 切换冠军
      // if(!obj.ct){
      //   store.tabActive = 'Outrights';
      //   MenuData.set_match_tab_list([
      //     'Outrights'
      //   ]);
      //   // store.tabOptions = [
      //   //   'Outrights'
      //   // ]
      // }else{
      //   store.tabActive = 'Matches';
      //   MenuData.set_match_tab_list([
      //     'Matches',
      //     'League',
      //     'Outrights'
      //   ]);
      //   // store.tabOptions = [
      //   //   'Matches',
      //   //   'League',
      //   //   'Outrights'
      //   // ]
      // }
      store.isLeagueDetail = false
      MatchResponsive.set_is_league_detail(false)
      onTabChange()
    }).off,
    emitter_3: useMittOn(MITT_TYPES.EMIT_GO_TO_DETAIL_HANDLE, () => {
      console.log('进入了详情页面，需要缓存数据')
      cacheStoreData()
    }).off
  }
})
onUnmounted(() => {
  Object.values(emitters.value).map((x) => x());
   // 组件销毁时销毁监听函数
  ws_message_listener.ws_remove_message_listener(message_fun)
  message_fun = null
  // sessionStorage.removeItem('match_list_params')
  window.addEventListener('beforeunload', clearSessionStorageData)
  MatchResponsive.set_is_league_detail(false)
})

const cacheStoreData = () => {
  sessionStorage.setItem('match_list_params', JSON.stringify(store));
}
const onTabChange = (val) => {
  //早盘串关数量为0  隐藏赛事 切换冠军
  let num = 1;
  const index = MenuData.menu_list.findIndex(n=>{return n.mi == MenuData.menu_mi.value});
  if(index !== -1){
    num = (MenuData.menu_list[index]?.sl?.[2]?.ct || 0)+(MenuData.menu_list[index]?.sl?.[3]?.ct || 0);
  }
  if(num){
    store.tabActive = val || 'Matches';
    store.tabOptions = [
      'Matches',
      'League',
      'Outrights'
    ]
  }else{
    store.tabActive = 'Outrights';
    store.tabOptions = [
      'Outrights'
    ]
  };
  MenuData.set_match_menu(store.tabActive);
  switch (store.tabActive) {
    case 'Matches':
      clearSessionStorageData()
      if(!store.menu_time){
        MenuData.set_current_lv1_menu('2');
        MatchMeta.set_prev_scroll(0)
        MatchMeta.set_origin_match_data()
      }else{
        MatchMeta.filter_match_by_time(store.menu_time)
        MatchMeta.get_target_match_data({ md: store.menu_time })
      }
      break
    case 'League':
      MenuData.set_current_lv1_menu(2);
      const time = store.curSelectedOption ? store.curSelectedOption.timestamp : 12
      onChangeDate(time) // 默认展示12个小时的数据
      break
    case 'Outrights':
      MatchMeta.clear_match_info()
      MenuData.set_current_lv1_menu(400);
      // MenuData.set_menu_mi('101');
      // MatchMeta.set_origin_match_data()
      MatchMeta.get_champion_match()
      clearSessionStorageData()
      break
  }
}

const clearSessionStorageData = () => {
  sessionStorage.removeItem('match_list_params')
}

// 当为matches时 切换时间后 监听方法
const onChangeDate = e => {
  if (store.tabActive !== 'Matches') {
    MatchMeta.get_ouzhou_leagues_data(e).then(res => {
      // console.log('onChangeDate', res, store.selectArea)
      if (res === null) res = []
      if (res.length) {
        store.areaList = res
        if (JSON.stringify(store.selectArea) === '{}') {
          store.selectArea = res[0]
          onChangeArea(res[0])
        } else {
          const index = res.findIndex(i => i.id === store.selectArea.id)
          const offset = index < 0 ? 0 : index
          store.selectArea = res[offset]
          onChangeArea(res[offset])
        }
      } else {
        store.leaguesMatchs = []
        store.areaList = []
      }
    })
  }
}

const onChangeArea = (obj) => {
  if (obj.id === '-1000') {
    store.leaguesMatchs = []
    return
  }
  const arr = obj.tournamentList
  if (arr === null) {
    store.leaguesMatchs = []
    return
  }
  arr.forEach(i => {
    i.visible = true
    i.tid = i.id
  })
  store.leaguesMatchs = arr
}
// 初始化matchpage页面
const initMatchPage = () => {
  // store.tabActive = MenuData.match_menu || store.tabOptions[0];
  store.isLeagueDetail = false
  MatchResponsive.set_is_league_detail(false)

}

const goBackToLeague = () => {
  store.tabActive = 'League'
  store.isLeagueDetail = false
  MatchResponsive.set_is_league_detail(false)
  onTabChange('League')
}

</script>
<style scoped lang="scss">
/* ************** 赛事列表包装器 **************** -S */
.match-list-page {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  position: relative;

  .match-list-container {
    height: 100%;
    background-color: var(--q-gb-bg-c-2) !important;

    :deep(.scroll-wrapper) {
      // background-color: var(--q-gb-bg-c-2) !important;

      .s-w-item {
        background-color: var(--q-gb-bg-c-2) !important;
      }
    }
  }
  &.league-filter{
    :deep(.scroll-wrapper) {
      overflow-y: hidden;
      .scroll-i-con {
        height: 100% !important;
        overflow-y: auto;
        background-image: none !important;
        .s-w-item {
          position: relative;
          transform: translateY(0) !important;
        }
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

.league-list {
  display: flex;
  align-items: center;
  height: .5rem;
  padding-left: .2rem;
  font-size: .14rem;
  .icon-wapper-more{
      transform: rotate(90deg);
    }
  .area {
    color: var(--q-gb-t-c-3);
  }
  .league {
    font-weight: bold;
  }
}
</style>src/core/utils/common/module/ws-message.js