<!--
 * @Author: Supermark
 * @Date: 2021-02-20 16:35:03
 * @Description: 详情页头部联赛名文字超出隐藏无缝滚动
-->
<template>
  <div class="marquee-wrap" ref="marquee_wrap">
  	<!-- 滚动内容 -->
    <div class="scroll_wrap" ref="scroll_wrap">
      <p class="marquee" :style="{marginRight: start_roll?'16px':''}">{{content}}</p>
      <!-- 文字副本 -->
      <p class="copy">{{copy_content}}</p>
    </div>
    <!-- 为了计算总文本宽度，通过css在页面中隐藏 -->
    <p class="full_content" ref="full_content">{{content}}</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue"
import lodash from 'lodash'
const props = defineProps({
    content: {
      type: String, // 类型字符串
      default: "" // 默认值为空
    }
  })
const start_roll = ref(false)
const copy_content = ref('')
const timer2_ = ref(null)
const timer = ref(null)
const marquee_wrap = ref(null)
const scroll_wrap = ref(null)
const full_content = ref(null)

  // 把父组件传入的arr转化成字符串
onMounted(() => {
    let dom_ = {
      marquee_wrap: marquee_wrap.value,
      scroll_wrap: scroll_wrap.value,
      full_content: full_content.value,
    }
    clearTimeout(timer2_.value)
    timer2_.value = setTimeout(() => {
      set_move_style(dom_)
      // 兜底处理，dom 元素没拿到的话重新执行一遍
      if(timer2_.value) {
        timer2_.value= setTimeout(() => {
          set_move_style(dom_)
        }, 2000);
      }
    },800)
  })
  /**
   *@description 设置滚动样式
    */
const set_move_style = (dom_) => {
    if(!(dom_.full_content || dom_.scroll_wrap)) return
    // 获取文字text 的计算后宽度 （由于overflow的存在，直接获取不到，需要独立的node计算）
    let text_width = lodash.get(dom_.full_content,'scrollWidth')
    let scroll = dom_.scroll_wrap
    // 如果文本内容的宽度小于页面宽度，则表示文字小于等于一行，则不需要滚动
    if (text_width < 160) {
      scroll.style.justifyContent = 'center'
      start_roll.value = false
      return
    } else {
      start_roll.value = true
      // title内容副本，为了动画文字流畅衔接
      copy_content.value = props.content
      // 定时器动画（部分机型动画卡顿，导致的样式问题）换为css原生动画
      // move(text_width, scroll)

      // 动画时间
      const scrollTiming = text_width / 16 / 2

      // js动态创建@keyframes
      const runkeyframes = ` @keyframes titleScroll{
                              0%{transform: translateX(16px)}
                              100%{transform: translateX(-${text_width}px)}
                          }`
      // 创建style标签
      const style = document.createElement('style');
      // 设置style属性
      style.type = 'text/css';
      // 将keyframes样式写入style内
      style.innerHTML = runkeyframes;
      // 将style样式存放到head标签
      document.querySelector('head').appendChild(style);
      scroll.style.animation = `titleScroll ${scrollTiming}s linear infinite`
    }
    clearTimeout(timer2_.value)
    timer2_.value = null
  }
const move = (text_width, scroll) => {
    copy_content.value = props.content // 文字副本填充
    let distance = 0 // 位移距离
    // 设置位移
    timer.value = setInterval(() => {
      distance -= .5
      // 如果位移超过文字宽度，则回到起点
      if (-distance >= text_width) {
        distance = 16 // 距离必须与marquee的margin宽度相同
      }
      scroll.style.transform = 'translateX(' + distance + 'px)'
    }, 20)
  }
  onUnmounted(() => {
  	// 清除计时器
    clearInterval(timer.value)
    timer.value = null

    clearTimeout(timer2_.value)
    timer2_.value = null
  }) 
</script>
<style lang="scss" scoped>

.marquee-wrap {
  max-width: 1.6rem;
  overflow: hidden;
  position: relative;
  color: var(--q-gb-t-c-14);
  .scroll_wrap {
    display: flex;
    // color: #fff;
    p {
      word-break: keep-all;
      white-space: nowrap;
      // color: var(--q-gb-t-c-18);
    }
  }

  .full_content {
    word-break: keep-all;
    white-space: nowrap;
    position: absolute;
    top: 0;
    // color: var(--q-gb-t-c-17);
    // color: transparent;
    opacity: 0; //这个元素是隐藏计算宽度的 是不显示的的 不要再放开了
  }

  .copy {
    // color: var(--q-gb-bg-c-12);
    font-weight: 600;
  }
  .marquee {
    font-weight: 600;
  }
}
</style>
