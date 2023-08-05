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
  </div>
</div>
</template>

<script setup>
import loadData from "src/components/load-data/load_data.vue";
</script>
