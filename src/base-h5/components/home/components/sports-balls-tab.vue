<!--
 * @Description: 首页热门第1个tab 以外的 tab 选项卡页面
-->
<template>
  <div :class="tab_Index != 0 ? 'sports_balls_tab' : ''">
    <div @scroll="wrapper_scrolling">
      <!-- 第二个tab 榜单 骨架屏 -->
      <hot-list v-if="list_loading"></hot-list>
      <!-- 热门赛程 骨架屏-->
      <hot-schedule v-if="schedule_loading"></hot-schedule>
      <!-- 足球篮球tab的 赛程列表页面，match-main 是整一块列表页组件 -->
      <match-main v-show="guess_standings && !schedule_loading" invok_source="home_hot_page_schedule"
        :wrapper_scroll_top="wrapper_scroll_top">
      </match-main>
      <!-- 足球篮球tab的 榜单页 -->
      <template v-if="!guess_standings && !loading_standings_data">
        <!-- header 的tab选项卡 -->
        <div class="header">
          <div class="header-title">
            <div class="item ellipsis" v-for="(tab, index) in balls_list" :class="[tabIndex == tab.index ? 'active' : '']"
              @click="changeTab(tab)" :key="index">
              {{ tab.key }}
            </div>
          </div>
          <!-- 榜单页 和 赛程列表页面 的切换    menuId == "30101"是 竞彩足球的 唯一字段-->
          <div class="header-icon" v-if='!get_hot_tab_item.chinaBetting' @click="leaderboard_switch">
            {{ guess_standings ? i18n_t('home_popular.ranking') : i18n_t('home_popular.quiz') }}
          </div>
        </div>

        <!-- 榜单公共表格 -->
        <publicForm :allianc_list_index="allianc_list_index" :allianc_list="allianc_list" :tab_name_index="tab_name_index"
          :liat_data="liat_data" :public_form_title="public_form_title" @allianc-tab="alliancTab" />
      </template>
    </div>
    <!-- 没有数据 组件 -->
    <no_data v-if="loading_standings_data" which='noMatch' height='500' class="no-list"></no_data>
  </div>
</template>

<script setup>
// import matchMain from "src/base-h5/components/match-list/index.vue";   // 赛事列表页用于展示滚球、今日、早盘、串关、冠军等赛事
import { api_home } from "src/api/index.js";
import hotList from "src/base-h5/components/skeleton/home-hot/hot-list.vue";   // 热门榜单 骨架屏
import hotSchedule from "src/base-h5/components/skeleton/home-hot/hot-schedule.vue"     // 热门赛程 骨架屏

import no_data from "src/base-h5/components/common/no-data.vue";    // 无网络展示组件
import publicForm from "./public-form.vue";    // 首页热门足球和 篮球的 公共榜单表格
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';

const props = defineProps({
  tab_Index: Number | String | Array | Object,
})

// 篮球 西部联盟8     东部联盟9
let allianc_list = ref([])
let balls_list = ref([]) // 排行榜 得分榜 表格的数据
// 0 代表 积分榜  否则 是 赛事列表
let guess_standings = ref(true)
// 当前榜单选择的下标
let tabIndex = ref(0)
// 西部联盟8 东部联盟9 选择的下标
let allianc_list_index = ref(0)
// 积分榜的 切换 下标
let tab_name_index = ref(1)
// 积分榜 的接口数据
let liat_data = ref(null)
let public_form_title = ref(null)
let loading_standings_data = ref(false) // 有没有积分榜数据
let list_loading = ref(false) // 榜单 骨架屏
let schedule_loading = ref(false) // 热门赛程 骨架屏,
let wrapper_scroll_top = ref(0) //当列表滚动时隐藏罚牌说明

watch(() => balls_list.value, (n, o) => {
  if (n.length > 0) {
    changeTab(n[0])
  }
  let alliance = n.filter(item => {
    // 过滤掉热门赛事：item.spell != 'HOT'
    if (item.type == 7 && item.value != null) {
      return item
    }
  })
  if (alliance && alliance[0]) {
    allianc_list.value = alliance[0].value
  }
})

/**
    * 页面滚动时隐藏提示
    */
const wrapper_scrolling = ($event) => {
  //当列表滚动时隐藏罚牌说明
  wrapper_scroll_top.value = $event.target.scrollTop;
}
// 积分榜表格 接口
const get_ranking_list = async (tid) => { // tid 联赛id
  try {
    list_loading.value = true
    loading_standings_data.value = false
    let { code, data } = await api_home.get_ranking_by_tournamentId({ tournmentId: tid, isPc: 0 })
    list_loading.value = false
    if (code == 200 && data != null) {
      data.forEach((item, index) => { item.index = index })
      balls_list.value = data
    } else {
      balls_list.value = []
      loading_standings_data.value = true
    }
  } catch (error) {
    list_loading.value = false
    loading_standings_data.value = true
    console.error(error);
  }
}
// 榜单页 和 赛程列表页面 的切换
const leaderboard_switch = () => {
  guess_standings.value = !guess_standings.value
  loading_standings_data.value = false
  if (!guess_standings.value) {
    get_ranking_list(get_hot_tab_item.field2)
  }
}
// 数据更新  初始化 sports_balls_tab 的data 数据
const set_data_update_handle = () => {
  guess_standings.value = true
  allianc_list.value = []
  loading_standings_data.value = false
  liat_data.value = null
}
// 赛程骨架屏的 显示
const show_hot_schedule_loading = (is_true) => {
  if (is_true) {
    schedule_loading.value = true
  } else {
    schedule_loading.value = false
  }
}
/**
 *  积分榜的 切换
 *  篮球  球队榜7 (西部联盟8     东部联盟9)        得分榜1      篮球助攻榜6    篮板榜3
 *  足球  积分榜4     足球助攻榜2      射手榜5
 */
const changeTab = (tab) => {
  tabIndex.value = tab.index
  public_form_title.value = tab
  if (tab.type == 7) {
    tab_name_index.value = 1
    if (tab.value) {
      allianc_list.value = tab.value
      alliancTab({ tab: tab.value[0], index: 0 })
    } else {
      liat_data.value = null
    }
  } else if (tab.type == 4) {
    tab_name_index.value = 3
    liat_data.value = tab.value
    allianc_list.value = []
  } else {
    tab_name_index.value = 2
    allianc_list.value = []
    if ([1, 2, 3, 5, 6].includes(+tab.type)) {
      liat_data.value = tab.value
    }
  }
}
// 西部联盟8     东部联盟9 切换
const alliancTab = ({ tab, index }) => {
  allianc_list_index.value = index
  liat_data.value = tab.value
}

onMounted(() => {
  useMittOn(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, show_hot_schedule_loading)
  useMittOn(MITT_TYPES.EMIT_HOT_LEADERBOARD_SWITCH, leaderboard_switch)
  useMittOn(MITT_TYPES.EMIT_SET_SPORTS_BALLS_TAB, set_data_update_handle)
})

onUnmounted(() => {
  useMittOn(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, show_hot_schedule_loading).off
  useMittOn(MITT_TYPES.EMIT_HOT_LEADERBOARD_SWITCH, leaderboard_switch).off
  useMittOn(MITT_TYPES.EMIT_SET_SPORTS_BALLS_TAB, set_data_update_handle).off
  //   for (const key in $data) {
  //     $data[key] = null
  // }
})

</script>

<style lang="scss" scoped>
.sports_balls_tab {
  position: fixed;
  top: 1.12rem;
  bottom: 0;
  left: 0;
  right: 0;

  >div {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;

  }

  :deep(.no-list) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  /*  头部 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.07rem 0 0.23rem;
    overflow-x: auto;
    height: 0.442rem;
    position: relative;
    z-index: 100;

    .header-title {
      display: flex;

      .item {
        margin-right: 0.3rem;
        font-size: 0.14rem;

        font-family: PingFangSC-Regular;
        border-width: 20px;
        padding-bottom: 0.04rem;
        position: relative;
        width: fit-content;

        &:last-child {
          margin-right: unset;
        }

        &:after {
          content: '';
          width: 0.2rem;
          height: 0.03rem;
          border-radius: 0.08px;
          background: transparent;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);
          padding-top: 4px;
        }

        &.active {
          font-weight: 600;
          font-size: 0.14rem;

          &:after {
            content: '';
          }
        }
      }
    }

    .header-icon {
      padding: 0.02rem 0.09rem;
      height: 0.24rem;
      border-radius: 0.115rem;
      box-sizing: border-box;
      font-size: 0.12rem;
      z-index: 110;
      margin-right: .02rem;
    }
  }
}
</style>
