<template>
  <div
    class="details-header"
    :style="data.get_menu_type == 3000 ? data.URL.gaming_type[detail_data.csid] : ballTypeBackground"
    :class="{ results_header_top: ['result_details', 'match_result'].includes(route.name), baseball: detail_data.csid == '3' }"
  >
    <!--详情页头部置顶title-->
    <common-header
      :title="detail_data.tn"
      :view_tab="view_tab"
    />
    <!--详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])-->
    <header-top :detail_data="detail_data" />
    <!--详情页视频区域(视频+动画按钮)+底部(赛事比分或者是足球犯规显示)-->
    <header-bottom
      v-if="data.get_menu_type != 3000"
      :detail_data="detail_data"
      :class="{ results_header_bottom: ['result_details', 'match_result'].includes(route.name), baseball: detail_data.csid == '3', margin_left_bottom: detail_data.mng != 1 }"
    />
  </div>
</template>
<script setup>
import { reactive, computed, defineComponent,ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import lodash from "lodash";
import commonHeader from "src/base-h5/components/common/common-header1.vue";
import headerTop from "src/base-h5/components/details/components/header/header-top.vue";   // 详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])
import headerBottom from "src/base-h5/components/details/components/header/header-bottom.vue";   // 详情页视频区域(视频+动画按钮)+底部(赛事比分或者是足球犯规显示)
// import matchResultsHeader_top from "src/base-h5/components/details/components/details-match-results/match-results-header-top.vue";  // 整个赛果详情页的上部比分
import { detail_csid_config } from "src/core/match-detail/match-detail-h5/config/details-bg.js";  // 球类背景图background路径
import { MenuData } from "src/output/index.js";

const props = defineProps(
  {
    // 赛事详情数据
    detail_data: {
      type: Object,
      default: () => ({})
    },
    // 当前tab
    view_tab: {
      type: String,
      default: 'bet'
    }
  }
)

const route = useRoute();
const get_detail_data = ref({
        csid: '1',
        mid: '1',
    })
let ballTypeBackground = computed(() => lodash.get(detail_csid_config,`[CSID_${props.detail_data.csid}].detail.B`))
let data = reactive({
  // 此处空对象请勿删除;
  URL: detail_csid_config,
  // 收藏菜单为6
  get_menu_type: lodash.get(MenuData, "current_lv_1_menu.mi"),
});

</script>
<script>

export default defineComponent({
  name: "details-header",
})
</script>
<style lang="scss" scoped>
.details-header {
  width: 100%;
  max-width: 7rem;
  min-height: 2.11rem;

  &.results_header_top {
    min-height: unset;
    height: 1.2rem;
  }

  &.baseball {
    height: 1.4rem;
  }

  .pad-top {
    padding-top: 0.28rem;
  }

  :deep(.results_header_bottom) {
    &.header-bottom {
      height: unset;
    }

    .match_score {
      margin-left: 0.92rem;
      height: unset;
      line-height: 0.12rem;
      width: 2.45rem;
      overflow-x: auto;

      .font-style {
        margin: unset;
        display: flex;
        flex-wrap: nowrap;

        >div {
          white-space: nowrap;
        }
      }
    }

    &.margin_left_bottom {
      .match_score {
        margin-left: 0.7rem;
        width: 2.91rem;
      }
    }

    &.baseball {
      .match_score {
        margin-top: 0.1rem;
        margin-left: unset;
        height: 0.38rem;
        line-height: 0.38rem;
        width: 100%;

        .row.items-center {
          position: relative;
          left: 0.17rem;
        }

        .col-6.ms-r {
          left: -0.18rem;
        }
      }
    }
  }
}
</style>
