<!--
 * @Description: 左右滚动组件 可以鼠标拖拽  手势滑动
-->
<template>
  <div class="drag-scroll relative-position">
    <!-- 滚动区域 -->
    <div class="hide-scrollbar">
      <div class="content" @scroll="on_scroll">
        <slot></slot>
        <div style="min-width: 40px" v-show="has_scroll"></div>
      </div>
    </div>
    <!-- 左右滚动按钮 -->
    <div
      class="more-btn left"
      v-show="show_left_btn"
      @click="click_move('left')"
    >
      <img src="../../../../assets/images/next_arrow.png" alt="">
    </div>
    <div
      class="more-btn right"
      v-show="show_right_btn"
      @click="click_move('right')"
    >
      <img src="../../../../assets/images/next_arrow.png" alt="">
    </div>
  </div>
</template>
<script setup>
import { defineComponent, onMounted, onBeforeUnmount, ref, defineProps } from "vue";
  const props = defineProps({
    is_show_btn: {
      type: [ Boolean ],
      default: () => {},
    }
  })
  // 是否显示左边按钮
  const show_left_btn = ref(false);
  // 是否显示右边按钮
  const show_right_btn = ref(true);
  // 是否有滚动条
  const has_scroll = ref(false);
  //定时器
  let timer = null;
  //定时器
  let interval_id = null;

  let for_count = 999;

  let area_obj = null;

  // 滚动条滚动事件
  const on_scroll = (e) => {
    let scrollLeft = e.target.scrollLeft;
    if (scrollLeft > 0) {
      show_left_btn.value = true;
    } else {
      show_left_btn.value = false;
    }
    if (!area_obj) return;
    if (scrollLeft == area_obj?.scrollWidth - area_obj?.clientWidth) {
      show_right_btn.value = false;
    } else {
      show_right_btn.value = true;
    }
  };

  // 点击移动
  // type  left左移   right右移
  const click_move = (type) => {
    clearInterval(interval_id);
    let scrollLeft = area_obj?.scrollLeft;
    for_count = 0;
    // 滚动动画
    interval_id = setInterval(() => {
      for_count++;
      if (for_count > 20 ) {
        clearInterval(interval_id);
      }
      if (type == "left") {
        scrollLeft -= 15;
      } else {
        scrollLeft += 15;
      }
      area_obj.scrollLeft = scrollLeft;
    }, 15);
  };

  onMounted(() => {
    area_obj = document.querySelector('.content');
    show_right_btn.value = props.is_show_btn;
  }); 

  onBeforeUnmount(() => {
    clearInterval(interval_id);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  });
  
</script>
<style lang="scss" scoped>
.drag-scroll {
  width: 100%;
  height: 100%;
  .hide-scrollbar {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
  .content {
    display: flex;
    // flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      display: none;
    }
    :deep(img) {
      pointer-events: none;
    }
  }
  .more-btn {
    width: 20px;
    position: absolute;
    height: 40px;
    top: 50%;
    margin-top: -20px;
    background: rgba( 0, 0, 0, 0.5);
    opacity: 0.3;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 6.5px;
      height: 10px;
    }
    &.left {
      left: 0;
      transform: rotate(180deg);
    }
    &.right {
      right: 0;
    }
  }
}
</style>
