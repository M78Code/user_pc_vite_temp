<template>
  <div style="width:200px">
    right
    <!-- 右侧区域 -->
    <!-- <div
    class="page-right"
    :class="data_ref.screen_width"
    :style="
      route.params.video_size == 1
        ? ''
        : `width:${computed_data.layout_size.right_width}px  !important; height:${computed_data.layout_size.content_height}px  !important;`
    "
    v-if="computed_data.layout_size.right_width > 0"
  > -->
    <!-- 虚拟体育 -->
    <!-- <virtual-right
      v-if="
        new_menu.is_virtual_sport() &&
        route.name != 'search' &&
        route.name != 'details'
      "
    /> -->
    <!-- 常规竞猜 -->
    <!-- <match-details v-else class="page-match-detail fit" /> -->
  </div>
</template>