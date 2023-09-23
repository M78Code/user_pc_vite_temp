<!--
 * @Author: cooper
 * @Date: 2023-08-05 16:13:55
 * @Description:详情页
-->

<template>
  <div class="details relative-position" :style="page_style">
    <!-- 加载中，无数据等显示模板 -->
    <load-data
      v-show="load_detail_statu != 'data'"
      :class="[
        'details_data_load',
        { details_loading: load_detail_statu == 'loading' },
      ]"
      :state="load_detail_statu"
      :style="{ 'margin-top': headerHeight + 'px' }"
      :is_detail="true"
    />
    <div class="wrap-handicap v-scroll-area-bar">
      <!-- 详情面板 -->
      <div class="screen">
        <v-scroll-area
          :observer_area="1"
          page_type="main_details"
          ref="v_scroll"
        >
          <template v-slot:header>
            <!-- 详情头部 -->
            <detail-header
              ref="detail_header"
              :match_infoData="match_infoData"
              :background_img="background_img"
              :sportId="sportId"
              :handicap_state="handicap_state"
              :handicap_this="handicap_this"
              :is_request="is_request"
              @init="init"
              @back_to="back_to"
              @get_mattch_details="get_mattch_details"
              @change_loading_state="change_loading_state"
            ></detail-header>
          </template>
          <!-- 玩法列表 -->
          <div>
            <div
              class="col wrap-scroll"
              v-show="['data', 'loading'].includes(load_detail_statu) && match_infoData"
            >
              <div class="column fit">
                <!-- 盘口模板start -->
                <match-handicap
                  :match_info="match_infoData"
                  :category_list="category_list"
                  :plays_list="plays_list"
                  :currentRound="currentRound"
                  :match_details="match_details"
                  :screen="cur_expand_layout"
                  @set_handicap_this="set_handicap_this"
                  :close_all_handicap="close_all_handicap"
                  :handicap_state="handicap_state"
                  class="details-handicap"
                  @on_go_top="on_go_top"
                  load_type="details"
                  @set_handicap_state="set_handicap_state"
                ></match-handicap>
                <!-- 盘口模板end -->
              </div>
            </div>

            <!-- <div all_plays_sort_arr>  pankpo</div> -->
            <!-- 强力推荐，关盘状态下展示TODO -->
            <!-- <match-list-hot
              class="match_list_hot"
              page_source="details"
              :class="is_esports ? 'esport-list' : ''"
              v-if="['all_empty', 'new_empty'].includes(handicap_state)"
            /> -->
          </div>
        </v-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup>
import loadData from "project_path/src/components/load-data/load-data.vue";
import vScrollArea from "project_path/src/components/v-scroll-area/v-scroll-area.vue";
import detailHeader from "./components/detail-header.vue";
// 组件
// 盘口模板
import matchHandicap from "src/components/match-detail/match-handicap/match-handicap.vue";
import matchListHot from "project_path/src/pages/match-list/match-list-hot.vue";
import { useGetConfig } from "./detail.config";
//引入组件样式
import { compute_css_variables } from "src/core/css-var/index.js"
import { ref } from "vue";
const page_style = ref(null)
page_style.value = compute_css_variables({ category: 'component', module: 'match-details' })
const {
  load_detail_statu,
  match_infoData,
  category_list,
  plays_list,
  currentRound,
  match_details,
  close_all_handicap,
  handicap_state,
  detail_header,
  background_img,
  sportId,
  handicap_this,
  is_request,
  cur_expand_layout,
  headerHeight,
  init,
  back_to,
  set_handicap_this,
  on_go_top,
  set_handicap_state,
  get_mattch_details,
  change_loading_state,
  MatchDataWarehouseInstance
} = useGetConfig();
console.log(MatchDataWarehouseInstance,'MatchDataWarehouseInstance');
</script>

<style lang="scss" scoped>
.details {
  display: flex;
  height: 100% !important;
  .wrap-handicap {
    display: flex;
    flex: 1;
    flex-flow: column;
    width: 100%;
    height: 100%;
    border-right: 2px solid #1e232a;
    .v-scroll-area:after {
      border-left: none;
    }
  }
  .bg-wrap-handicap {
    background: #2b3038;
  }
  .smaple-left-border {
    border-left: 6px solid #1d212a;
  }
  .screen {
    display: flex;
    flex-flow: column;
    height: 100%;
    font-size: 12px;
    :deep(.content-wrap) {
      border-top: none;
    }
    .match_list_hot {
      margin-top: 200px;
      z-index: 5;
      &.esport-list {
        margin-top: 250px;
      }
    }
  }
  /* ************** 顶部标题 *************** -S */
 
  /* ************** 顶部标题 *************** -E */
  /* ************** 比分扳 *************** -S */
  .head-info {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 190px;
    background-size: cover !important;
    color: #fff;
    .info-upd {
      z-index: 90;
      justify-content: center;
      :v-deep(.match_time) {
        .timer-layout2 {
          width: 100%;
          min-width: 42px;
        }
      }
    }
    .hide-btn {
      position: absolute;
      top: 13px;
      right: 13px;
      padding: 5px 6px;
      border-radius: 13px;
      background: rgba(31, 33, 41, 0.6);
      cursor: pointer;
      &:hover {
        background: rgba(31, 33, 41, 0.8);
        color: #fff;
      }
    }
  }

  /* ************** 比分扳 *************** -E */
}
.sub-title {
  justify-content: space-between;
}
.cursor {
  cursor: pointer;
}
.details_data_load {
  position: absolute;
  z-index: 0;
  width: 100%;
  pointer-events: none;
  :deep(.yb-flex-center) {
    justify-content: unset;
  }
}
.details_loading {
  height: 3000px;
  width: 100%;
  position: absolute;
  z-index: 5;
}
.theme01 {
  .esports-head-info-101 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_01_101.jpg") !important;
  }
  .esports-head-info-100 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_01_100.jpg") !important;
  }
  .esports-head-info-103 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_01_103.jpg") !important;
  }
  .esports-head-info-102 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_01_102.jpg") !important;
  }
  .details_loading {
    background-color: rgba(255, 255, 255, 0.8);
  }
  .match_list_hot {
    :deep(.load-data-wrap) {
      background-color: #f9fbfc;
    }
  }
}
.theme02 {
  .esports-head-info-101 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_02_101.jpg") !important;
  }
  .esports-head-info-100 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_02_100.jpg") !important;
  }
  .esports-head-info-103 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_02_103.jpg") !important;
  }
  .esports-head-info-102 {
    background-image: url("/yazhou-pc/image/jpg/sports_bg_02_102.jpg") !important;
  }
  .details_loading {
    background-color: rgba(39, 42, 51, 0.5);
  }
  .match_list_hot {
    :deep(.load-data-wrap) {
      background-color: #181822;
    }
  }
}
</style>
<style lang="scss">
@import "./match-details.scss";
</style>
