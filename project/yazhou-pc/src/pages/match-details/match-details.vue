<!--
 * @Author: cooper
 * @Date: 2023-08-05 16:13:55
 * @Description:详情页
-->

<template>
  <div class="details relative-position">
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
              @init="init"
              @back_to="back_to"
              @get_mattch_details="get_mattch_details"
              @change_loading_state="change_loading_state"
            ></detail-header>
          </template>

          <!-- 玩法列表 -->
          <template>
            <div
              class="col wrap-scroll"
              v-show="['data', 'loading'].includes(load_detail_statu)"
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
            <!-- 强力推荐，关盘状态下展示TODO -->
            <!-- <match-list-hot
              class="match_list_hot"
              page_source="details"
              :class="is_esports ? 'esport-list' : ''"
              v-if="['all_empty', 'new_empty'].includes(handicap_state)"
            /> -->
          </template>
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
import matchHandicap from "src/components/match-detail/match_handicap/match_handicap.vue";
import { useGetConfig } from "./detail.config";

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
  init,
  back_to,
  set_handicap_this,
  on_go_top,
  set_handicap_state,
  get_mattch_details,
  change_loading_state
} = useGetConfig();
</script>
