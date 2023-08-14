<template>
  <div class="details-header"
       :style="get_menu_type == 3000 ? URL.gaming_type[detail_data.csid] : lodash.get(URL.sporting_type,`${ballType}.B`)"
       :class="{results_header_top: ['result_details', 'match_result'].includes($route.name),baseball: detail_data.csid == '3'}"
  >
  <!-- <div class="details-header"
  > -->
    <!--详情页头部置顶title-->
    <!-- <common-header :title="detail_data.tn" :view_tab="view_tab"/> -->
    <!--详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])-->
    <header-top :detail_data="detail_data"/>
    <!--详情页视频区域(视频+动画按钮)+底部(赛事比分或者是足球犯规显示)-->
    <!-- <header-bottom
      v-if="get_menu_type != 3000"
      :detail_data="detail_data"
      :class="{results_header_bottom: ['result_details', 'match_result'].includes(route.name),baseball: detail_data.csid == '3',margin_left_bottom: detail_data.mng != 1 }"
    /> -->
  </div>
</template>
<script>
// #TODO vuex 
// import { mapGetters } from "vuex";
// import common_header from "project_path/src/components/common/common-header1.vue";  // 详情页头部置顶title
import header_top from "project_path/src/pages/details/components/header/header-top.vue";   // 详情页视频区域中部(主副队logo+主副队名+赛事[阶段+时间+比分])
// import header_bottom from "project_path/src/pages/details/components/header/header-bottom.vue";   // 详情页视频区域(视频+动画按钮)+底部(赛事比分或者是足球犯规显示)
// import match_results_header_top from "project_path/src/pages/details/components/details-match-results/match-results-header-top.vue";  // 整个赛果详情页的上部比分
import base64 from "src/core/utils/base64.js";  // 球类背景图background路径
import utils from "src/core/utils/utils.js";
import lodash from "lodash";
import { useRouter, useRoute } from "vue-router";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "details_header",
  props: {
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
  },
  components: {
    // "common-header": common_header,
    "header-top": header_top,
    // "header-bottom": header_bottom,
    // "match-results-header-top": match_results_header_top,
  },
  setup(props, evnet) {
    const router = useRouter()
    const route = useRoute();
    const data = reactive({
      utils,
      // 此处空对象请勿删除;
      URL:base64,
      // 收藏菜单为6
      get_menu_type: "get_menu_type",
      // 详情页的数据
      get_detail_data: []
    });
    // #TODO VUEX 
    // computed: {
    //   ...mapGetters([
    //     // 收藏菜单为6
    //     "get_menu_type",
    //     // 详情页的数据
    //     "get_detail_data"
    //   ]),
    const ballType = computed(() => {
      return props.detail_data.csid - 1;
    });
    onMounted(() => {
      console.log("get_detail_data", props.detail_data);
      data.get_detail_data = props.detail_data;
    })
    return {
      ...toRefs(data),
      ...toRefs(props),
      lodash,
      ballType,
    }
  }
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

  ::v-deep.results_header_bottom {
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

        > div {
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
