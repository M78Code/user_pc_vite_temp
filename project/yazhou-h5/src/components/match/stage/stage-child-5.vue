<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页显示网球赛事第几节以及赛事时间
-->
<template>
  <!-- 网球 -->
  <span class='stage_child_5'>
    <!-- 网球阶段 -->
    {{i18n_t('mmp')[5][detail_data.mmp]}}
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";

export default {
  // mixins: [msc],
  name: 'stage_child_5',
  props: ["detail_data"]
}
</script>

<style lang="scss" scoped></style>
