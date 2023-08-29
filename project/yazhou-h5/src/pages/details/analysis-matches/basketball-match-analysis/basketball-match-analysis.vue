<!--
 * @Author:
 * @Date:
 * @Description: 详情页 或者 赛果  篮球赛事分析
-->
<template>
  <div class="analysis-football-matches" :class="[get_analyze_show? 'clear-bg':'']" ref="analysis_basketball_matches">
    <head-tab :tabList="tabList" @tab_click="tab_click" v-if="!(get_is_hengping && get_analyze_show)"></head-tab>
    <!-- 顶部切换 下边的内容组件 -->
    <component :is="currentContent" />
  </div>
</template>

<script setup>
// TODO: 后续修改调整
// import {mapGetters} from "vuex";
// 赛果详情 赛况统计 和 事件
import match_result from 'src/project/pages/details/components/details-match-results/match-results.vue';
// 详情页  足球赛事分析 战绩 模块
import standings from 'src/project/pages/details/analysis-matches/components/standings.vue';
// 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
import line_up from 'src/project/pages/details/analysis-matches/components/line-up.vue';
// 详情页 或者 赛果 赛事分析 公共tab 组件
import head_tab from 'src/project/components/details/match-analysis/head-tab.vue';
 // 文章页
import articleMain from 'src/project/pages/details/analysis-matches/article/article-main.vue';
import { watch, nextTick, onMounted } from 'vue';
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import { t } from "src/boot/i18n";;
//国际化


  // components: {
  //   match: match_result,
  //   standings: standings,
  //   line_up: line_up,
  //   "head-tab": head_tab,
  //   articleMain: articleMain,
  // },
  // TODO: 国际化后续修改调整
  const tabList = ref([
    {
      name: t('analysis_football_matches.match'),
      component: 'match'
    },
    {
      name: t('analysis_football_matches.standings'),
      component: 'standings'
    },
    {
      name: t('analysis_football_matches.line_up'),
      component: 'line_up'
    }
  ])
  const currentContent = ref('match')
  const analysis_basketball_matches = ref(null)
  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters([
  //     // 详情页的数据
  //     'get_detail_data',
  //     // 主题
  //     'get_is_hengping',
  //     'get_analyze_show',
  //     'get_lang',
  //   ])
  // },
  // 详情顶部切换赛事后 更新相应赛事数据
  watch(() => get_detail_data.mid, () => {
    const clone_currentCont = currentContent
      currentContent = ''
      nextTick(() => {
        currentContent = clone_currentCont
      })
  })
  onMounted(() => {
    nextTick(() => {
      // TODO: 后续修改调整 $refs $utils
      if (analysis_basketball_matches) {
        analysis_basketball_matches.style.minHeight = window.innerHeight - $utils.rem(0.84) + 'px'; ;
      }
    })
    if (['zh', 'tw'].includes(get_lang)) {
      tabList.unshift(
        {
          // TODO: 国际化
          name: get_lang == 'zh' ? '资讯' : '資訊',
          component: 'article-main'
        },
      )
    }
  })
const close_analysis = () => {
  useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false)
}
// 点击一级tab 菜单切换
const tab_click = ([tab, type]) => {
  currentContent = tab.component
  if (type == 'is_click') {
    let eventLabel = '';
    // 赛况
    if (tab.component == 'match') {
      eventLabel = "H5_情报分析_赛况";
    } else if (tab.component == 'standings') {
      // 数据
      eventLabel = "H5_情报分析_战绩";
    } else if (tab.component == 'line_up') {
      // 阵容
      eventLabel = "H5_情报分析_阵容";
    } else if (tab.component == 'article-main') {
      eventLabel = 'H5_情报分析_资讯'
    }
    this.$utils.zhuge_event_send(eventLabel, this.get_user);
  }
}

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
