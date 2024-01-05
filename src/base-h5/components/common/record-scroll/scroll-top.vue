<!--
 * @Author:
 * @Date:
 * @Description: 全局公共 滑动到顶部组件
-->

<template>
  <Teleport :to="to_com" v-if="!disabled">
    <!-- <img class="component scroll-top list-scroll-to-top"
      :class="[is_show_btn?'show':'hide', { 'app-h5': PROJECT_NAME === 'app-h5' }]"
      :src="scroll_top_image" @click="back_top"
    /> -->
    <div v-show="false">{{ UserCtr.user_version }}</div>
    <div class="component scroll-top list-scroll-to-top"
         :style="compute_css_obj({key: 'h5-kyapp-go-back'})"
         :class="[is_show_btn?'show':'hide', { 'app-h5': PROJECT_NAME === 'app-h5' }]"
         :src="scroll_top_image" @click="back_top">
    </div>
  </Teleport>
</template>

<script setup>
// import { mapGetters } from "vuex";
import { defineComponent, ref, watch, computed, onDeactivated, onUnmounted } from 'vue'
import { scroll_top_icon, scroll_top_icon_app } from 'src/base-h5/core/utils/local-image.js'

import { utils } from 'src/core/utils/common/module/utils.js'
import { compute_css_obj, PROJECT_NAME, UserCtr } from "src/output/index.js"
const emits = defineEmits(['back-top'])
const props = defineProps({
  // 父组件滚动高度
  list_scroll_top: {
    type: Number,
    default: 0
  },
  // 需要挂在的节点
  to_com: {
    default: 'body'
  }
})

/**
 * @description 是否显示按钮
 */
const is_show_btn = computed(() => {
  return props.list_scroll_top >= window.innerHeight
})

const disabled= ref(true)
const watchHandle = watch(is_show_btn,(val)=>{
  if(val){
    disabled.value = false
    watchHandle()
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

const scroll_top_image = computed(() => {
  let img_src = ''
  if (PROJECT_NAME === 'ouzhou-h5') {
    img_src = scroll_top_icon
  } else if (PROJECT_NAME === 'app-h5') {
    img_src = scroll_top_icon_app
  }
  return img_src
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
  emits('back-top')
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
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  bottom: 0;
  right: .25rem;
  z-index: 999;
  background-size:100%;
  --private-transition-duration: 500ms;
  transition: bottom var(--private-transition-duration);
  &.show{
    bottom:  0.9rem;
    opacity: 1;
  }
  &.hide{
    opacity: 0;
    pointer-events: none;
  }
}
</style>