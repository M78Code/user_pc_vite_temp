<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛果详情页头部区域
-->
<template>
  <div
    class="result-header"
    :style="(get_menu_type == 28 && [100,101,102,103,104].includes(+result_detail_data.csid)) ? URL.gaming_type[result_detail_data.csid] : lodash.get(URL.sporting_type,`${ballType}.B`)"
    :class="{baseball: result_detail_data.csid == '3'}"
  >
    <!-- 头部联赛名返回区域 -->
    <common-header :title="result_detail_data.tn"/>
    <!-- 头部联赛名返回区域 -->
    <match-results-header-top  :detail_data="result_detail_data"/>
    <header-bottom
      v-if="!(get_menu_type == 28 && [100,101,102,103,104].includes(+result_detail_data.csid))"
      :detail_data="result_detail_data"
      class="results_header_bottom"
      :class="{ baseball: result_detail_data.csid == '3',margin_left_bottom: result_detail_data.mng != 1 }"
    />
  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
import commonHeader from "project_path/src/components/common/common-header1.vue";
import headerTop from "project_path/src/pages/details/components/header/header-top.vue";
import headerBottom from "project_path/src/pages/details/components/header/header-bottom.vue";
import matchResultsHeaderTop from "project_path/src/pages/details/components/details-match-results/match-results-header-top.vue";
import { detail_csid_config } from "src/core/match-detail/match-detail-h5/config/details-bg.js";
import { ref } from "vue"
import lodash from "lodash"
  
  // 背景图
  const URL = ref(detail_csid_config)
const props = defineProps({
    // 详情Details接口的数据
    result_detail_data: {
      type: Object,
    } 
  })
    // ...mapGetters([
    //   "get_menu_type",
    //   "get_current_menu",
    // ]),
  const ballType = () => {
      if(props.result_detail_data.csid){
        return props.result_detail_data.csid - 1;
      }else{
        // 这里999 目的是让图片的下标不符合data里面的值
        return 999
      }
    }
</script>

<style lang="scss" scoped>
.result-header {
  width: 100vw;
  max-width:3.78rem;
  height: 1.23rem;

  &.baseball {
    height: 1.4rem;
  }
}

:deep(.results_header_botto)m {
  &.header-bottom {
    height: unset;
  }

  .match_score {
    margin-left: 0.92rem;
    height: unset;
    line-height: 0.17rem;
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
</style>
