<template>
  <div class="home-page">
    <!-- tab 切换 -->
    <div class="header_tabs">
      <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator @update:modelValue="on_update">
        <q-tab name="featured" :label="`${i18n_t('ouzhou.match.featured')}`" />
        <q-tab name="top_events" :label="`${i18n_t('ouzhou.match.top_events')}`" />
      </q-tabs>
    </div>
    <!-- 主内容区 -->
    <div class="home_content" ref="scrollAreaRef" :visible="false">
      <q-tab-panels v-model="tabValue" animated>
        <!-- featured page -->
        <q-tab-panel name="featured">
          <section class="section-content">
            <!-- 时间赛事 -->
            <template v-if="time_events.length > 0">
              <HeaderTitle title="15 Mins"></HeaderTitle>
              <TimeEvents :time_events="time_events" />
            </template>
            <!-- 特色赛事 -->
            <template v-if="featured_matches.length > 0">
              <HeaderTitle title="Featured Matches"></HeaderTitle>
              <FeaturedMatches :featured_matches="featured_matches" />
            </template>
            <!-- 赛事列表 -->
           <template v-if="play_matchs.length > 0">
              <HeaderTitle title="In-Play"></HeaderTitle>
              <MatchPlay :play_matchs="play_matchs" />
           </template>
            <!-- 特色赛事 -->
            <!-- <template v-if="featured_matches.length > 0">
              <HeaderTitle title="ATP/WTA Rome"></HeaderTitle>
              <FeaturedMatches :featured_matches="featured_matches" />
            </template> -->
            <!-- 5大联赛 -->
            <template v-if="five_league_match.length > 0">
              <HeaderTitle title="Top Leagues"></HeaderTitle>
              <MatchLeagues :fiveLeagues_Matches="five_league_match"/>
            </template>
          </section>
        </q-tab-panel>
        <!-- top Events page -->
        <q-tab-panel name="top_events">
          <scroll-list menu_type="5000" v-if="MenuData.top_events_list.length" :current_mi="state.current_mi" :menuList="MenuData.top_events_list" @changeMenu="changeMenu"/>
          <!-- 赛事列表 -->
          <section class="match-page-section">
            <MatchContainer />
          </section>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
 
<script setup> 
import { onMounted, ref ,reactive, onUnmounted } from "vue";
import { watch } from "vue";
import lodash from 'lodash'
import TimeEvents from './components/time-events.vue'
import HeaderTitle from './components/header-title.vue'
import MatchLeagues from './components/match-leagues.vue'
import FeaturedMatches from './components/feature-matches.vue'
import MatchPlay from './components/match-play.vue'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchUtils from 'src/core/match-list-h5/match-class/match-utils';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import * as ws_message_listener from "src/core/utils/module/ws-message.js";
import scrollList from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-list.vue';
import { MenuData, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common as MatchDataBasel5minsH5, MatchDataWarehouse_ouzhou_PC_five_league_List_Common as MatchDataBaseFiveLeagueH5,
  MatchDataWarehouse_ouzhou_PC_hots_List_Common as MatchDataBaseHotsH5, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js";

let message_fun = null
const play_matchs = ref([])
const time_events = ref([])
const featured_matches = ref([])
const five_league_match = ref([])
const state = reactive({
    current_mi:"",
})
/**
 * 球种点击
 */
const changeMenu = (item) =>{
  state.current_mi = item.mi;
  MatchMeta.get_top_events_match(item.csid)
}
onMounted(async () => {
  MenuData.set_current_lv1_menu(1);
  MenuData.set_menu_mi('101');
  get_ouzhou_home_data()
  get_five_league_matchs()
  state.current_mi = MenuData.top_events_list[0]?.mi;

  // 增加监听接受返回的监听函数
  message_fun = ws_message_listener.ws_add_message_listener(lodash.debounce((cmd, data)=>{
    console.log('wswswswswswsws-cmd:', cmd, data)
    // get_ouzhou_home_data()
    // get_five_league_matchs()
  }, 1000))
})

// 获取首页数据
const get_ouzhou_home_data = async () => {
  const { p15_list, hots, dataList } = await MatchMeta.get_ouzhou_home_data()
  // 15 分
  time_events.value = p15_list.map(t => {
    const match = MatchDataBasel5minsH5.get_quick_mid_obj(t.mid)
    return match
  })
  // 滚球赛事
  play_matchs.value = dataList.map(t => {
    const match = MatchDataBaseH5.get_quick_mid_obj(t.mid)
    return match
  })
  // 热门赛事
  featured_matches.value = hots.map(t => {
    const match = MatchDataBaseHotsH5.get_quick_mid_obj(t.mid)
    const { home_score, away_score } = MatchUtils.get_match_score(match)
    return {
      ...match,
      home_score, 
      away_score, 
     }
  })
}

/**
 * @description 获取五大联赛赛事   不放  match 仓库
 */
const get_five_league_matchs = async () => {
  const list = await MatchMeta.get_five_leagues_list()
  const mids = []
  five_league_match.value = list.map(t => {
    mids.push(t.mid)
    const match = MatchDataBaseH5.get_quick_mid_obj(t.mid) || t
    return match
  })
  MatchMeta.get_match_base_hps_by_mids(mids.toString())
}

const tabValue = ref('featured');
// tabs 切换
const on_update = (val) => {
  if (val === 'featured') {
    MenuData.set_current_lv1_menu(1);
    MenuData.set_menu_mi('101');
    get_ouzhou_home_data()
  } else {
    state.current_mi = MenuData.top_events_list[0].mi;
    MatchMeta.get_top_events_match(MenuData.top_events_list[0].csid)
  }
}

onUnmounted(() => {
  emitters()
  // 组件销毁时销毁监听函数
  ws_message_listener.ws_remove_message_listener(message_fun)
  message_fun = null
})

</script>
 
<style scoped lang="scss">
.home-page{
  height: 100%;
  overflow: hidden;
  padding-bottom: 56px;
  .header_tabs{
    border-bottom: 2px solid #FF7000;
    :deep(.q-tabs--dense){
      .scroll--mobile{
        height: 50px;
        background: #fff;
        padding: 0 10px;
        background-repeat: no-repeat;
        background-image:url($SCSSPROJECTPATH + "/image/list/mask_group.png");
        background-size: contain;
        background-position: right;
        .q-tab{
          flex: none;
        }
        .q-ripple{
          display: none;
        }
      }
      .q-tab__label{
        color: #8A8986;
        text-transform: capitalize;
        font-weight: 600;
      }
      .q-tab--active .q-tab__label{
        color: #FF7000;
      }
      .q-tab__indicator{
        height: 3px;
        background: #FF7000;
      }
    }
  }
  .home_content{
    height: calc(100% - 106px);
    .q-tab-panels{
      height: 100%;
      .q-tab-panel{
        padding: 0;
        overflow: hidden;
        .section-content{
          height: calc(100% - 52px);
          overflow-y: auto;
          position: relative;
        }
        .match-page-section{
          height: calc(100% - 66px - 54px);
          overflow-y: hidden;
          position: relative;
          .match-list-container{
            height: 100%;
            background: #fff !important;
            :deep(.scroll-wrapper){
              background: #fff !important;
              .s-w-item{
                background: #fff !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
