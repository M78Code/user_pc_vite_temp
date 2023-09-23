<!--
 * @Author: Supermark
 * @Date: 2021-07-13 16:08:04
 * @Description: 详情页显示沙滩排球赛事第几节以及赛事时间
-->
<template>
<!-- 沙滩排球 -->
  <span class='stage_child_13'>
    <!-- 沙滩排球的赛事阶段 -->
    {{i18n_t('mmp')[13][detail_data.mmp]}}
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";

export default {
  // mixins: [msc],
  name: 'stage_child_13',
  props: ["detail_data"]
  // mmp的详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js 
}
</script>

<style lang="scss" scoped></style>
