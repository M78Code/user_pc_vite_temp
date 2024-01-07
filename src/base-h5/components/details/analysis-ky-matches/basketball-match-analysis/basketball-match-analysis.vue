<!--
 * @Author:
 * @Date:
 * @Description: 详情页 或者 赛果  篮球赛事分析
-->
<template>
  <div class="analysis-football-matches" :class="[get_analyze_show? 'clear-bg':'']" ref="analysis_basketball_matches">
    <head-tab :tabList="tabList" @tab_click="tab_click" :detail_data="detail_data" v-if="!(get_is_hengping && get_analyze_show)"></head-tab>
    <!-- 顶部切换 下边的内容组件 -->
    <component :is="currentContent" :detail_data="detail_data" />
  </div>
</template>

<script setup>
// TODO: 后续修改调整
// import {mapGetters} from "vuex";
import { ref, watch, nextTick, onMounted, defineAsyncComponent,shallowRef } from 'vue';
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/index.js"
import { i18n_t } from "src/boot/i18n.js";
import UserCtr from "src/core/user-config/user-ctr.js";
// 文章页
import articleMain from "src/base-h5/components/details/analysis-ky-matches/article/article-main.vue"
// 赛果详情 赛况统计 和 事件
import matchResult from "src/base-h5/components/details/components/details-match-results/match-results.vue"
// 详情页  足球赛事分析 战绩 模块
import standings from "src/base-h5/components/details/analysis-ky-matches/components/standings.vue"
// 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
import lineUp from "src/base-h5/components/details/analysis-ky-matches/components/line-up.vue"
// 详情页 或者 赛果 赛事分析 公共tab 组件
import headTab from "src/base-h5/components/details/analysis-ky-matches/components/head-tab.vue";


// 获取详情数据
const props = defineProps({
  detail_data: {
    type: Object,
    default: () => {}
  }
})
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
      name: i18n_t('analysis_football_matches.match'),
      component: matchResult
    },
    {
      name: i18n_t('analysis_football_matches.standings'),
      component: standings
    },
    {
      name: i18n_t('analysis_football_matches.line_up'),
      component: lineUp
    }
  ])
  const currentContent = shallowRef('matchResult')
  const analysis_basketball_matches = ref(null)


  // TODO: 临时调试用
  const get_is_hengping = ref(false)
  const get_analyze_show = ref(false)
  // TODO: 后续修改调整
  // computed: {
  //   ...mapGetters([
  //     // 详情页的数据
  //     // 主题
  //     'get_is_hengping',
  //     'get_analyze_show',
  //     'get_lang',
  //   ])
  // },
  // 详情顶部切换赛事后 更新相应赛事数据
  watch(() => props.detail_data.mid, () => {
    const clone_currentCont = currentContent.value
      currentContent.value = ''
      nextTick(() => {
        currentContent.value = clone_currentCont
      })
  })

  const rem = (value) => {
    let font_size = (innerWidth * 100) / 375;
    return Math.ceil(value * font_size);
  };
  onMounted(() => {
    nextTick(() => {
      // TODO: 后续修改调整 $refs $utils
      if (analysis_basketball_matches.value) {
        analysis_basketball_matches.value.style.minHeight = window.innerHeight - rem(0.84) + 'px'; ;
      }
    })
    if (['zh', 'tw'].includes(UserCtr.lang)) {
      tabList.value.unshift(
        {
          // TODO: 国际化
          name: UserCtr.lang == 'zh' ? '资讯' : '資訊',
          component: articleMain
        },
      )
    }
  })
const close_analysis = () => {
  useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false)
}
// 点击一级tab 菜单切换
const tab_click = ([tab, type]) => {
  currentContent.value = tab.component
  if (type == 'is_click') {
    let eventLabel = '';
    // 赛况
    if (tab.component == 'matchResult') {
      eventLabel = "H5_情报分析_赛况";
    } else if (tab.component == 'standings') {
      // 数据
      eventLabel = "H5_情报分析_战绩";
    } else if (tab.component == 'headTab') {
      // 阵容
      eventLabel = "H5_情报分析_阵容";
    } else if (tab.component == 'articleMain') {
      eventLabel = 'H5_情报分析_资讯'
    }
    // this.$send_zhuge_event(eventLabel, this.UserCtr);
  }
}

</script>

<style lang="scss" scoped>
.analysis-football-matches {
  position: relative;
  z-index: 99;
  // background-color: var(--q-gb-bg-c-13);
  // background-color: var(--q-gb-bg-c-23);

  :deep(.home-tab) {
    color: var(--q-analysis-text-color-20);
  }
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