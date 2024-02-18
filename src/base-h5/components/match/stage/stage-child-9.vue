<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页显示排球赛事第几节以及赛事时间
-->
<template>
<!-- 排球 -->
  <span class='stage_child_9'>
    <!-- 排球的赛事阶段 -->
    {{i18n_t('mmp')[9][detail_data.mmp]}}
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";

export default {
  // mixins: [msc],
  name: 'stage_child_9',
  props: ["detail_data"]
  // mmp的详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js 
}
</script>

<style lang="scss" scoped></style>
