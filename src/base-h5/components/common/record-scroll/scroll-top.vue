<!--
 * @Author:
 * @Date:
 * @Description: 全局公共 滑动到顶部组件
-->

<template>
  <img v-show="is_show_back_top_btn" class="list-scroll-to-top" :src="compute_img('scroll-to-top')" @click="back_top">
</template>

<script setup>
import { utils,UserCtr, compute_img } from 'src/core/index.js'
// import { mapGetters } from "vuex";
import { defineComponent, ref, watch, computed, onDeactivated, onUnmounted } from 'vue'

const props = defineProps({
  // 父组件滚动高度
  list_scroll_top: {
    type: Number,
    default: 0
  }
})
// 通过判断父组件滚动时间间隔控制按钮显示，放在该组件维护
let is_show_back_top_btn = ref(true)
let scroll_timer = ref(null)
const get_list_scroll_direction=ref(0)
watch(() => props.list_scroll_top, (curr_top, prev_top) => {
  // 滑动停止5s后 隐藏回到顶部按钮
  if (!is_show_back_top_btn.value) {
    is_show_back_top_btn.value = true
  }
  if (get_list_scroll_direction.value < 0) { // 向上滚动 不展示回到顶部按钮
    is_show_back_top_btn.value = false
  }
  clearTimeout(scroll_timer)
  scroll_timer.value = setTimeout(() => {
    is_show_back_top_btn.value = false
  }, 5000)
})
/**
   * 回到顶部功能实现过程：
   * 1. 获取页面当前距离顶部的滚动距离（虽然IE不常用了，但还是需要考虑一下兼容性的）
   * 2. 计算出每次向上移动的距离，用负的滚动距离除以5，因为滚动的距离是一个正数，想向上移动就是做一个减法
   * 3. 用当前距离加上计算出的距离，然后赋值给当前距离，就可以达到向上移动的效果
   * 4. 最后记得在移动到顶部时，清除定时器
   */
const back_top = () => {
  //  防止调用多次
  if (utils.is_time_limit(500)) return

  // $emit('back-top')
}
onDeactivated(() => {
  clearTimeout(scroll_timer)
  scroll_timer.value = null
})
onUnmounted(() => {
  clearTimeout(scroll_timer)
  scroll_timer.value = null
})
</script>
<style lang="scss" scoped>
.list-scroll-to-top {
  z-index: 86;
  position: fixed;
  width: 0.3rem;
  bottom: 0.58rem;
  right: .2rem;
}
</style>
