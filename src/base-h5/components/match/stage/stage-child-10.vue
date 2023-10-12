<!--
 * @Author: Supermark
 * @Date: 2020-06-07 10:59:08
 * @Description: 详情页显示羽毛球赛事第几节以及赛事时间
-->
<template>
<!-- 羽毛球 -->
  <span class='stage_child_10'>
    <!-- 羽毛球赛事阶段 -->
    {{i18n_t('mmp')[10][detail_data.mmp]}}
  </span>
</template>

<script>
// import msc from "src/public/mixins/common/msc.js";

export default {
  // mixins: [msc],
  name: 'stage_child_10',
  props: ["detail_data"]
  // mmp的详细描述请参考国际化文件:/user-h5/src/i18n/zh-cn/index.js
}
</script>

<style lang="scss" scoped></style>
