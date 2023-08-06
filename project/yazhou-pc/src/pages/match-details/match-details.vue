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
            <detail-header></detail-header>
             </template>
        </v-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup>
import loadData from "project_path/src/components/load-data/load_data.vue";
import vScrollArea from "project_path/src/components/v-scroll-area/v-scroll-area.vue";
import detailHeader from './components/detail-header.vue'
</script>
