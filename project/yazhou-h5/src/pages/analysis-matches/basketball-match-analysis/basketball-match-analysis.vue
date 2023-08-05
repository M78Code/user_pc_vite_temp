<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页 或者 赛果  篮球赛事分析
-->
<template>
  <div class="analysis-football-matches" :class="[get_analyze_show? 'clear-bg':'']" ref="analysis_basketball_matches">
    <head-tab :tabList="tabList" @tab_click="tab_click" v-if="!(get_is_hengping && get_analyze_show)"></head-tab>
    <!-- 顶部切换 下边的内容组件 -->
    <component :is="currentContent" />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import match_result from 'src/project/pages/details/components/details_match_results/match_results.vue';  // 赛果详情 赛况统计 和 事件
import standings from 'src/project/pages/details/analysis-matches/components/standings.vue';  // 详情页  足球赛事分析 战绩 模块
import line_up from 'src/project/pages/details/analysis-matches/components/line_up.vue';  // 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
import head_tab from 'src/project/components/details/match_analysis/head_tab.vue';  // 详情页 或者 赛果 赛事分析 公共tab 组件
import articleMain from 'src/project/pages/details/analysis-matches/article/article_main.vue';   // 文章页

export default {
  name: "",
  components: {
    match: match_result,
    standings: standings,
    line_up: line_up,
    "head-tab": head_tab,
    articleMain: articleMain,
  },
  data() {
    return {
      tabList: [
        {
          name: this.$root.$t('analysis_football_matches.match'),
          component: 'match'
        },
        {
          name: this.$root.$t('analysis_football_matches.standings'),
          component: 'standings'
        },
        {
          name: this.$root.$t('analysis_football_matches.line_up'),
          component: 'line_up'
        }
      ],
      currentContent: 'match',
    }
  },
  computed: {
    ...mapGetters([
      // 详情页的数据
      'get_detail_data',
      // 主题
      'get_theme',
      'get_is_hengping',
      'get_analyze_show',
      'get_lang',
    ])
  },
  watch: {
    // 详情顶部切换赛事后 更新相应赛事数据
    'get_detail_data.mid'() {
      const currentContent = this.currentContent
      this.currentContent = ''
      this.$nextTick(() => {
        this.currentContent = currentContent
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.analysis_basketball_matches) {
        this.$refs.analysis_basketball_matches.style.minHeight = window.innerHeight - this.$utils.rem(0.84) + 'px'; ;
      }
    })
    if (['zh', 'tw'].includes(this.get_lang)) {
      this.tabList.unshift(
        {
          name: this.get_lang == 'zh' ? '资讯' : '資訊',
          component: 'article-main'
        },
      )
    }
  },
  methods: {
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
          eventLabel = "H5_情报分析_战绩";
        } else if (tab.component == 'line_up') { // 阵容
          eventLabel = "H5_情报分析_阵容";
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

@media (min-width: 600px) {
  .analysis-football-matches {
    max-width: 100%;
  }
}



</style>
