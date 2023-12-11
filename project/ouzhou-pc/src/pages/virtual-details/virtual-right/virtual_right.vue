<template>
  <v-scroll-area class="c-virtual-right" :observer_area="1" page_type="virtual_right_list" @on_scroll="cur_scroll_height">
    <!-- 头部 -->
    <template v-slot:header>
      头部包括视频
    </template>

    <template>
      内容
    </template>

  </v-scroll-area>
</template>

<script setup>
import vScrollArea from "src/public/components/v_scroll_area/v_scroll_area.vue";

/**
 * 监听右侧内容滚动高度
 */
function cur_scroll_height(height) {

}


</script>

<style lang="scss" scoped>



</style>
