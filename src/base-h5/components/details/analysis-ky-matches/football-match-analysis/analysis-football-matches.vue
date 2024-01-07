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
      :detail_data="detail_data"
      @tab_click="tab_click"
      ref="head-tab"
      class="football-tab-header"
    ></head-tab>
    <!-- 顶部切换 下边的内容组件 -->
    <component :is="currentContent" :detail_data="detail_data" />
  </div>
</template>

<script>
// TODO: vuex 后续修改调整
// import {mapGetters} from "vuex";
import { onMounted, onUnmounted, ref, watch, nextTick, defineComponent, shallowRef } from 'vue'
import lodash from 'lodash'
// 详情页 或者 赛果 赛事分析 公共tab 组件
import headTab from "src/base-h5/components/details/analysis-ky-matches/components/head-tab.vue";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/index.js"
import { i18n_t } from "src/boot/i18n.js";
import zhuge from "src/core/http/zhuge-tag.js"
import { MatchDetailCalss } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
// 资讯页
import articleMain from "src/base-h5/components/details/analysis-ky-matches/article/article-main.vue"
// 赛果详情 赛况统计 和 事件
import matchResult from "src/base-h5/components/details/components/details-match-results/match-results.vue"
// 详情页  足球赛事分析 战绩 模块
import standings from "src/base-h5/components/details/analysis-ky-matches/components/standings.vue"
// 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
import lineUp from "src/base-h5/components/details/analysis-ky-matches/components/line-up.vue"
// 详情页足球赛事分析情报页面
import intelligence from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/components/intelligence.vue"
// 详情页足球赛事分析赔率页面
import analysisOdds from "src/base-h5/components/details/analysis-ky-matches/football-match-analysis/components/analysis-odds.vue"
// 精彩回放
import highlights from "src/base-h5/components/details/analysis-ky-matches/highlights/highlights.vue"

export default defineComponent({
  components: {
    articleMain,
    matchResult,
    standings,
    lineUp,
    intelligence,
    analysisOdds,
    highlights,
    headTab,
  },
  props: ['detail_data'],
  setup(props, event) {
     // 详情数据
    // 锚点
    const analysis_football_matches = ref(null)
    // tab 数据
    const tabList = ref([
        {
          name: i18n_t('analysis_football_matches.match'),
          component: 'match-result'
        },
        {
          name: i18n_t('analysis_football_matches.analysis_data'),
          component: 'standings'
        },
        {
          name: i18n_t('analysis_football_matches.line_up'),
          component: 'line-up'
        },
        {
          name: i18n_t('analysis_football_matches.intelligence'),
          component: 'intelligence'
        },
        {
          name: i18n_t('analysis_football_matches.Odds'),
          component: 'analysis-odds'
        },
      ])
    // 当前选中tab
    const currentContent = ref('articleMain')
    // TODO: 临时用
    const get_event_list = ref(MatchDetailCalss.playback_video_list)
    const get_analyze_show = ref(false)

    const rem = (value) => {
    let font_size = (innerWidth * 100) / 375;
    return Math.ceil(value * font_size);
  };

    onMounted(() => {
      nextTick(() => {
        if (analysis_football_matches.value) {
          // TODO: utils后续修改调整
          analysis_football_matches.value.style.minHeight = window.innerHeight - rem(0.84) + 'px'; ;
        }
    })
    createTabds();
    })
    watch(() => props.detail_data.mid, () => {
      // 详情顶部切换赛事后 更新相应赛事数据
      const currentCont = currentContent.value
      currentContent.value = ''
      nextTick(() => {
        currentContent.value = currentCont
      })
    })
    watch(() => get_event_list.value, (event_list) => {
      // 精彩回放开关开启后，显示精彩回放视图 TODO: 后续调整 UserCtr  get_event_list
      const highlights_component = tabList.value.find(item => item.component === 'highlights')
      const { configValue, eventSwitch } = lodash.get(UserCtr, 'user_info.merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && get_event_list.value.length && !highlights_component) {
        tabList.value.unshift(
            {
              name: i18n_t('highlights.title'),
              component: 'highlights'
            }
        )
      }
    })
    onUnmounted(() => {
      // TODO: $data 后续修改调整
      analysis_football_matches.value = null
      tabList.value = []
      currentContent.value = 'match-result'
    })
    const createTabds = () => {
      // 国际化 后续修改调整
      let tabs = [
        {
          name: i18n_t('analysis_football_matches.match'),
          component: 'match-result'
        },
        {
          name: i18n_t('analysis_football_matches.analysis_data'),
          component: 'standings'
        },
        {
          name: i18n_t('analysis_football_matches.line_up'),
          component: 'line-up'
        },
        {
          name: i18n_t('analysis_football_matches.intelligence'),
          component: 'intelligence'
        },
        {
          name: i18n_t('analysis_football_matches.Odds'),
          component: 'analysis-odds'
        },
      ]
      // 红猫tab特殊处理  
      if (props.detail_data.cds === '1500') {
        tabs = [
          {
            name: i18n_t('analysis_football_matches.analysis_data'),
            component: 'standings'
          }
        ]
      }
      if (['zh', 'tw'].includes(UserCtr.lang)) {
        tabs.unshift(
          {
            name: UserCtr.lang == 'zh' ? '资讯' : '資訊',
            component: 'article-main'
          }
        )
      }
      // 精彩回放开关开启后，显示精彩回放视图 TODO: get_event_list  后续修改调整
      const highlights_component = tabs.find(item => item.component == 'highlights')
      const { configValue, eventSwitch } = lodash.get(UserCtr, 'user_info.merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && get_event_list.value.length && !highlights_component) {
        tabs.unshift(
            {
              name: i18n_t('highlights.title'),
              component: 'highlights'
            }
        )
      }
      tabList.value = tabs
    }
    const close_analysis = () => {
      useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false)
    }
    // 点击一级tab 菜单切换 
    const tab_click = ([tab, type]) => {
        currentContent.value = tab.component
      if (type == 'is_click') {
        let eventLabel = '';
        if (tab.component == 'match-result') {
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
        zhuge.send_zhuge_event(eventLabel, UserCtr.user_info);
      }
    }
    return {
      analysis_football_matches,
      tabList,
      currentContent,
      get_event_list,
      get_analyze_show,
      // 方法
      createTabds,
      close_analysis,
      tab_click,
    }
  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters([
  //     // 详情页的数据
  //     'get_detail_data',
  //     // 主题
  //     // 赛事id
  //     'get_goto_detail_matchid',
  //     // 用户信息
//     "UserCtr",
  //     'get_analyze_show',
  //     'get_lang',
  //     'get_event_list',
  //   ]),
  // },

  // beforeUnmount() {
  //   for (const key in this.$data) {
  //     this.$data[key] = null
  //   }
  // }
  }
   
})
</script>

<style lang="scss" scoped>
.analysis-football-matches {
  position: relative;
  z-index: 99;
  background-color:  var(--q-gb-bg-c-23);
}

.clear-bg {
  background: none
}

.football-tab-header {
  background: var(--q-gb-bg-c-23);
  :deep(.home-tab) {
    width: 100%;
    ul {
      width: 100%;
      padding: 0 0.1rem;
      white-space: nowrap;
      overflow-x: auto;
    }
  }
  :deep(.tabs-label) {
    color: var(--q-analysis-text-color-13);
  }
}

@media (min-width: 600px) {
  .analysis-football-matches {
    max-width: 100%;
  }
}



</style>