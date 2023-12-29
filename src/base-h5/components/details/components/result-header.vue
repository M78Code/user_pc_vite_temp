<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 赛果详情页头部区域
-->
<template>
  <div
    class="result-header"
    :style="(menu_type == 28 && [100,101,102,103,104].includes(+result_detail_data.csid)) ? URL[`CSID_${result_detail_data.csid}`].detail.B : lodash.get(URL,`[CSID_${result_detail_data.csid}].detail.B`)"
    :class="{baseball: result_detail_data.csid == '3'}"
  >
    <!-- 头部联赛名返回区域 -->
    <common-header :title="result_detail_data.tn"/>
    <!-- 头部联赛名返回区域 -->
    <!-- <match-results-header-top  :detail_data="result_detail_data"/> -->
    <div class="match-results-header-top">
      <ContestName :detail_data="result_detail_data"></ContestName>
      <ContestTime :detail_data="result_detail_data"></ContestTime>
    </div>
    <div class="result-header-bottom-new">
      <ContestStatus :detail_data="result_detail_data"></ContestStatus>
      <header-bottom
        v-if="!(menu_type == 28 && [100,101,102,103,104].includes(+result_detail_data.csid))"
        :detail_data="result_detail_data"
        class="results_header_bottom"
        :class="{ baseball: result_detail_data.csid == '3',margin_left_bottom: result_detail_data.mng != 1 }"
      />
    </div>
    
  </div>
</template>

<script setup>
// import { mapGetters } from "vuex";
import commonHeader from "src/base-h5/components/common/common-header1.vue";
import headerTop from "src/base-h5/components/details/components/header/header-top.vue";
import headerBottom from "src/base-h5/components/details/components/header/header-bottom.vue";
import matchResultsHeaderTop from "src/base-h5/components/details/components/details-match-results/match-results-header-top.vue";
import { detail_csid_config } from "src/core/match-detail/match-detail-h5/config/details-bg.js";
import ContestName from "src/base-h5/components/details/components/details-match-results/match-results-header-top/contest-name.vue"
import ContestStatus from "src/base-h5/components/details/components/details-match-results/match-results-header-top/contest-status.vue"
import ContestTime from "src/base-h5/components/details/components/details-match-results/match-results-header-top/contest-time.vue"
import { ref } from "vue"
import lodash from "lodash"
import { MenuData } from "src/output/index.js"
  
  // 背景图
  const URL = ref(detail_csid_config)
  const menu_type = ref(MenuData.menu_type)
const props = defineProps({
    // 详情Details接口的数据
    result_detail_data: {
      type: Object,
    } 
  })
    // ...mapGetters([
    //   "menu_type",
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
  height: 1.68rem;

  &.baseball {
    //height: 1.4rem;
    // Bug: 52508
    // 背景图会被拉伸
    height: 1.6rem;
    background-size: 100% 100% !important;
  }
}

// :deep(.results_header_bottom) {
//   &.header-bottom {
//     height: unset;
//   }

//   .match_score {
//     margin-left: 0.92rem;
//     height: unset;
//     line-height: 0.17rem;
//     width: 2.45rem;
//     overflow-x: auto;
//     margin-top: .07rem;

//     .font-style {
//       margin: unset;
//       display: flex;
//       flex-wrap: nowrap;

//       > div {
//         white-space: nowrap;
//       }
//     }
//   }

//   &.margin_left_bottom {
//     .match_score {
//       margin-left: 0.55rem;
//       width: 2.91rem;
//     }
//   }

//   &.baseball {
//     .match_score {
//       margin-top: 0.1rem;
//       margin-left: unset;
//       height: 0.38rem;
//       line-height: 0.38rem;
//       width: 100%;

//       .row.items-center {
//         position: relative;
//         left: 0.17rem;
//       }

//       .col-6.ms-r {
//         left: -0.18rem;
//       }
//     }
//   }
// }

.match-results-header-top{
  width: 100%;
  height: .8rem;
  box-sizing: border-box;
  padding: 0 .19rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.result-header-bottom-new{
  width: 100%;
  height: .32rem;
  padding: 0 .19rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  :deep(.results_header_bottom){
    height: auto;
    flex: 1;
  }
}
</style>