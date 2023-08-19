<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析
-->
<template>
  <div class="analysis-football-matches" :class="[get_analyze_show? 'clear-bg':'']" ref="analysis_football_matches">
    <head-tab
      v-if="!get_analyze_show"
      :tabList="tabList"
      @tab_click="tab_click"
      ref="head-tab"
      class="football-tab-header"
    ></head-tab>
    <!-- 顶部切换 下边的内容组件 -->
    <component :is="currentContent" />
  </div>
</template>

<script setup>
// TODO: vuex 后续修改调整
// import {mapGetters} from "vuex";
import { onMounted, onUnmounted, ref, watch } from 'vue'
import lodash from 'lodash'
// 赛果详情 赛况统计 和 事件
import match_result from 'project_path/src/pages/details/components/details-match-results/match-results.vue';
// 详情页  足球赛事分析 战绩 模块
import standings from 'project_path/src/pages/details/analysis-matches/components/standings.vue';
// 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
import line_up from 'project_path/src/pages/details/analysis-matches/components/line-up.vue';
// 详情页 或者 赛果 赛事分析 公共tab 组件
import head_tab from "project_path/src/components/details/match-analysis/head-tab.vue";
// 详情页足球赛事分析情报页面
import intelligence from 'project_path/src/pages/details/analysis-matches/football-match-analysis/components/intelligence.vue';
 // 详情页足球赛事分析赔率页面
import analysis_odds from 'project_path/src/pages/details/analysis-matches/football-match-analysis/components/analysis-odds.vue';
 // 资讯页
import articleMain from 'project_path/src/pages/details/analysis-matches/article/article-main.vue';
// 精彩回放
import highlights from 'project_path/src/pages/details/analysis-matches/highlights/highlights.vue';
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"

  // components: {
  //   match: match_result,
  //   standings: standings,
  //   line_up: line_up,
  //   "head-tab": head_tab,
  //   "intelligence": intelligence,
  //   "analysis_odds": analysis_odds,
  //   articleMain: articleMain,
  //   highlights: highlights,
  // },
    // 锚点
    let analysis_football_matches = ref(null)
    // tab 数据
    let tabList = ref([])
    // 当前选中tab
    let currentContent = ref('match')

    onMounted(() => {
      nextTick(() => {
        if (analysis_football_matches) {
          // TODO: utils后续修改调整
          analysis_football_matches.style.minHeight = window.innerHeight - $utils.rem(0.84) + 'px'; ;
        }
    })
    createTabds();
    })
    watch(() => get_detail_data.mid, () => {
      // 详情顶部切换赛事后 更新相应赛事数据
      const currentCont = currentContent
      currentContent = ''
      nextTick(() => {
        currentContent = currentCont
      })
    })
    watch(() => get_event_list, (event_list) => {
      // 精彩回放开关开启后，显示精彩回放视图 TODO: 后续调整 get_user  get_event_list
      const highlights = tabList.find(item => item.component === 'highlights')
      const { configValue, eventSwitch } = lodash.get(get_user, 'merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && get_event_list.length && !highlights) {
        tabList.unshift(
            {
              // TODO: 国际化后续修改调整
              name: $root.$t('highlights.title'),
              component: 'highlights'
            }
        )
      }
    })
    onUnmounted(() => {
      // TODO: $data 后续修改调整
      analysis_football_matches = null
      tabList = []
      currentContent = 'match'
    })
    const createTabds = () => {
      // 国际化 后续修改调整
      let tabs = [
        {
          name: $root.$t('analysis_football_matches.match'),
          component: 'match'
        },
        {
          name: $root.$t('analysis_football_matches.analysis_data'),
          component: 'standings'
        },
        {
          name: $root.$t('analysis_football_matches.line_up'),
          component: 'line_up'
        },
        {
          name: $root.$t('analysis_football_matches.intelligence'),
          component: 'intelligence'
        },
        {
          name: $root.$t('analysis_football_matches.Odds'),
          component: 'analysis_odds'
        },
      ]
      // 红猫tab特殊处理  TODO: get_detail_data  get_lang/国际化 后续修改调整
      if (get_detail_data.cds === '1500') {
        tabs = [
          {
            name: $root.$t('analysis_football_matches.analysis_data'),
            component: 'standings'
          }
        ]
      }
      if (['zh', 'tw'].includes(get_lang)) {
        tabs.unshift(
          {
            name: get_lang == 'zh' ? '资讯' : '資訊',
            component: 'article-main'
          }
        )
      }
      // 精彩回放开关开启后，显示精彩回放视图 TODO: get_event_list get_user/国际化 后续修改调整
      const highlights = tabs.find(item => item.component === 'highlights')
      const { configValue, eventSwitch } = lodash.get(get_user, 'merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && get_event_list.length && !highlights) {
        tabs.unshift(
            {
              name: $root.$t('highlights.title'),
              component: 'highlights'
            }
        )
      }
      tabList = tabs
    }
    const close_analysis = () => {
      useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false)
    }
    // 点击一级tab 菜单切换 // TODO: $utils get_user 后续修改调整
    const tab_click = ([tab, type]) => {
      currentContent = tab.component
      if (type == 'is_click') {
        let eventLabel = '';
        if (tab.component == 'match') {
          // 赛况
          eventLabel = "H5_情报分析_赛况";
        } else if (tab.component == 'standings') {
          // 数据
          eventLabel = "H5_情报分析_数据";
        } else if (tab.component == 'line_up') {
          // 阵容
          eventLabel = "H5_情报分析_阵容";
        } else if (tab.component == 'intelligence') {
           // 情报
          eventLabel = "H5_情报分析_情报";
        } else if (tab.component == 'analysis_odds') {
          // 赔率
          eventLabel = "H5_情报分析_赔率";
        } else if (tab.component == 'article-main') {
          eventLabel = 'H5_情报分析_资讯'
        }
        $utils.zhuge_event_send(eventLabel, get_user);
      }
    }
  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters([
  //     // 详情页的数据
  //     'get_detail_data',
  //     // 主题
  //     'get_theme',
  //     // 赛事id
  //     'get_goto_detail_matchid',
  //     // 用户信息
  //     "get_user",
  //     'get_analyze_show',
  //     'get_lang',
  //     'get_event_list',
  //   ]),
  // },

  // destroyed() {
  //   for (const key in this.$data) {
  //     this.$data[key] = null
  //   }
  // }
</script>

<style lang="scss" scoped>
.analysis-football-matches {
  position: relative;
  z-index: 80;
}

.clear-bg {
  background: none
}

.football-tab-header {
  ::v-deep .home-tab {
    width: 100%;
    ul {
      width: 100%;
      padding: 0 .3rem;
      white-space: nowrap;
      overflow-x: auto;
    }
  }
}

@media (min-width: 600px) {
  .analysis-football-matches {
    max-width: 100%;
  }
}



</style>
