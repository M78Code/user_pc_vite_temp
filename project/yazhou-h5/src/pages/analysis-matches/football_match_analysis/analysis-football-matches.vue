<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
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

<script>
import {mapGetters} from "vuex";
import match_result from 'src/project/pages/details/components/details_match_results/match_results.vue';  // 赛果详情 赛况统计 和 事件
import standings from 'src/project/pages/details/analysis-matches/components/standings.vue';  // 详情页  足球赛事分析 战绩 模块
import line_up from 'src/project/pages/details/analysis-matches/components/line_up.vue';  // 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
import head_tab from "src/project/components/details/match_analysis/head_tab.vue";  // 详情页 或者 赛果 赛事分析 公共tab 组件
import intelligence from 'src/project/pages/details/analysis-matches/football_match_analysis/components/intelligence.vue';   // 详情页足球赛事分析情报页面
import analysis_odds from 'src/project/pages/details/analysis-matches/football_match_analysis/components/analysis_odds.vue';   // 详情页足球赛事分析赔率页面
import articleMain from 'src/project/pages/details/analysis-matches/article/article_main.vue';   // 资讯页
import highlights from 'src/project/pages/details/analysis-matches/highlights/highlights.vue';   // 精彩回放

export default {
  name: "",
  components: {
    match: match_result,
    standings: standings,
    line_up: line_up,
    "head-tab": head_tab,
    "intelligence": intelligence,
    "analysis_odds": analysis_odds,
    articleMain: articleMain,
    highlights: highlights,
  },
  data() {
    return {
      tabList: [],
      currentContent: 'match',
    }
  },
  computed: {
    ...mapGetters([
      // 详情页的数据
      'get_detail_data',
      // 主题
      'get_theme',
      // 赛事id
      'get_goto_detail_matchid',
      // 用户信息
      "get_user",
      'get_analyze_show',
      'get_lang',
      'get_event_list',
    ]),
  },
  created() {
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.analysis_football_matches) {
        this.$refs.analysis_football_matches.style.minHeight = window.innerHeight - this.$utils.rem(0.84) + 'px'; ;
      }
    })

    this.createTabds();    
  },
  watch: {
    // 详情顶部切换赛事后 更新相应赛事数据
    'get_detail_data.mid'() {
      const currentContent = this.currentContent
      this.currentContent = ''
      this.$nextTick(() => {
        this.currentContent = currentContent
      })
    },
    get_event_list(event_list) {
      // 精彩回放开关开启后，显示精彩回放视图
      const highlights = this.tabList.find(item => item.component === 'highlights')
      const { configValue, eventSwitch } = _.get(this.get_user, 'merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && this.get_event_list.length && !highlights) {
        this.tabList.unshift(
            {
              name: this.$root.$t('highlights.title'),
              component: 'highlights'
            }
        )
      }
    },
  },
  methods: {
    createTabds() {
      let tabs = [
        {
          name: this.$root.$t('analysis_football_matches.match'),
          component: 'match'
        },
        {
          name: this.$root.$t('analysis_football_matches.analysis_data'),
          component: 'standings'
        },
        {
          name: this.$root.$t('analysis_football_matches.line_up'),
          component: 'line_up'
        },
        {
          name: this.$root.$t('analysis_football_matches.intelligence'),
          component: 'intelligence'
        },
        {
          name: this.$root.$t('analysis_football_matches.Odds'),
          component: 'analysis_odds'
        },
      ]
      // 红猫tab特殊处理
      if (this.get_detail_data.cds === '1500') {
        tabs = [
          {
            name: this.$root.$t('analysis_football_matches.analysis_data'),
            component: 'standings'
          }
        ]
      }
      if (['zh', 'tw'].includes(this.get_lang)) {
        tabs.unshift(
          {
            name: this.get_lang == 'zh' ? '资讯' : '資訊',
            component: 'article-main'
          }
        )
      }
      // 精彩回放开关开启后，显示精彩回放视图
      const highlights = tabs.find(item => item.component === 'highlights')
      const { configValue, eventSwitch } = _.get(this.get_user, 'merchantEventSwitchVO', {})
      if (configValue == 1 && eventSwitch == 1 && this.get_event_list.length && !highlights) {
        tabs.unshift(
            {
              name: this.$root.$t('highlights.title'),
              component: 'highlights'
            }
        )
      }
      this.tabList = tabs
    },
    close_analysis() {
      this.$root.$emit(this.emit_cmd.EMIT_ANA_SHOW, false)
    },
    // 点击一级tab 菜单切换
    tab_click([tab, type]) {
      this.currentContent = tab.component
      if (type == 'is_click') {
        let eventLabel = '';
        if (tab.component == 'match') { // 赛况
          eventLabel = "H5_情报分析_赛况";
        } else if (tab.component == 'standings') { // 数据
          eventLabel = "H5_情报分析_数据";
        } else if (tab.component == 'line_up') { // 阵容
          eventLabel = "H5_情报分析_阵容";
        } else if (tab.component == 'intelligence') { // 情报
          eventLabel = "H5_情报分析_情报";
        } else if (tab.component == 'analysis_odds') { // 赔率
          eventLabel = "H5_情报分析_赔率";
        } else if (tab.component == 'article-main') {
          eventLabel = 'H5_情报分析_资讯'
        }
        this.$utils.zhuge_event_send(eventLabel, this.get_user);
      }
    },
  },
  destroyed() {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};
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
