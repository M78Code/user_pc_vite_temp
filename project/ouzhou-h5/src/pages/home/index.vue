<template>
  <div class="home-page">
    <!-- tab 切换 -->
    <div class="header_tabs">
      <q-tabs v-model="tabValue" dense class="bg-grey-3" align="justify" narrow-indicator @update:modelValue="on_update">
        <q-tab name="featured" label="Featured" />
        <q-tab name="top_events" label="Top Events" />
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
           <template v-if="MatchMeta.match_mids.length > 0">
              <HeaderTitle title="In-Play"></HeaderTitle>
              <MatchPlay />
           </template>
            <!-- 特色赛事 -->
            <!-- <template v-if="featured_matches.length > 0">
              <HeaderTitle title="ATP/WTA Rome"></HeaderTitle>
              <FeaturedMatches :featured_matches="featured_matches" />
            </template> -->
            <!-- 5大联赛 -->
            <template v-if="leagues_matchs.length > 0">
              <HeaderTitle title="Top Leagues"></HeaderTitle>
              <TopLeagues :leagues_matchs="leagues_matchs" />
            </template>
          </section>
        </q-tab-panel>
        <!-- top Events page -->
        <q-tab-panel name="top_events">
          <scroll-menu menu_type="1" :is_show_badge="false"  v-if="MenuData.menu_list.length" />
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
import { onMounted, ref } from "vue";
import { watch } from "vue";

import TimeEvents from './components/time-events.vue'
import HeaderTitle from './components/header-title.vue'
import TopLeagues from './components/top-leagues.vue'
import FeaturedMatches from './components/feature-matches.vue'
import MatchPlay from './components/match-play.vue'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchUtils from 'src/core/match-list-h5/match-class/match-utils';
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import scrollMenu from 'src/base-h5/components/top-menu/top-menu-ouzhou-1/scroll-menu/scroll-menu.vue';
import { MenuData, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common as MatchDataBasel5minsH5, 
  MatchDataWarehouse_ouzhou_PC_hots_List_Common as MatchDataBaseHotsH5, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js";

import { de_img, dk_img, be_img, fr_img } from 'src/base-h5/core/utils/local-image.js'

const play_matchs = ref([])
const time_events = ref([])
const featured_matches = ref([])

onMounted(async () => {
  get_ouzhou_home_data()
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
  // play_matchs.value = dataList.map(t => {
  //   const match = MatchDataBaseH5.get_quick_mid_obj(t.mid)
  //   return match
  // })
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

// 国家赛事
const leagues_matchs = ref([{
  national: 'Germany',
  nationalIcon: de_img,
  visible: true,
  children: [{
    isCollect: false,
    value: '6',
    title: 'Liga de primera división'
  }, {
    isCollect: false,
    value: '8',
    title: 'Liga de primera división'
  }]
}, {
  national: 'Denmark',
  nationalIcon: dk_img,
  visible: false,
  children: [{
    isCollect: false,
    value: '6',
    title: 'Liga de primera división'
  }, {
    isCollect: false,
    value: '8',
    title: 'Liga de primera división'
  }, {
    isCollect: false,
    value: '8',
    title: 'Liga de primera división'
  }]
}, {
  national: 'Belgium',
  nationalIcon: be_img,
  visible: false,
  children: [{
    isCollect: false,
    value: '6',
    title: 'Liga de primera división'
  }, {
    isCollect: false,
    value: '8',
    title: 'Liga de primera división'
  }]
}, {
  national: 'France',
  nationalIcon: fr_img,
  visible: false,
  children: [{
    isCollect: false,
    value: '6',
    title: 'Liga de primera división'
  }, {
    isCollect: false,
    value: '8',
    title: 'Liga de primera división'
  }]
}])


const tabValue = ref('featured');
// tabs 切换
const on_update = () => {
}

</script>
 
<style scoped lang="scss">
.home-page{
  height: 100%;
  overflow: hidden;
  .header_tabs{
    border-bottom: 2px solid #FF7000;
    :deep(.q-tabs--dense){
      .scroll--mobile{
        height: 50px;
        background: #fff;
        padding: 0 10px;
        background-repeat: no-repeat;
        // background-image: url("src/assets/images/featured/mask.png");
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
