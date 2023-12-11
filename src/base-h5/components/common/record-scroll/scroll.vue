<!--
 * @Author:
 * @Description: bw3新版投注记录页处理滚动的组件
-->
<template>
  <div class="my-scroll" ref="myScroll" @scroll.passive="onScroll($event)">
    <div class="scroll-list">
      <slot></slot>
      <div class="scroll-bottom" v-if="state==4||state==5">
        <p v-if="state==4">{{i18n_t('myScroll.msg5')}}</p>
        <p v-if="state==5">{{i18n_t('myScroll.msg6')}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted} from 'vue'
import { i18n_t } from "src/boot/i18n.js";;
//国际化


  const props = defineProps({
    //加载回调
    'onPull': {
      type: Function,
      default: true
    },
  })
    let pageY = ref(0)
    //下拉刷新的状态
    let state = ref(0)
    //myScroll 滚条DOM
    let myScroll = ref(null)
    //列表DOM
    let myScrollList = ref(null)

    /*
     * 修改状态 index 状态值
     * 刷新中：1
     * 松开刷新：2
     * 刷新完成：3
     * 加载中：4
     * 加载完成：5
     * 下拉刷新：6
     * 没有更多：7
     */
    const setState = (index) => {
      state.value = index;
      if (index == 5) {
        state.value = 0;
      }
    }
    /**
     *@description 列表滚动处理
     *@param {Object} e 事件对象
     *@return {Undefined} undefined
     */
    const onScroll = (e) => {
      //列表总高度
      let listHeight = e.target.offsetHeight;
      //当前滚动条位置
      let listScrollTop = e.target.scrollTop + listHeight;
      if (state.value == 0 && listHeight - listScrollTop < 100) {
        bottomCallback()
      }
    }
    /**
     *@description 加载回调
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const bottomCallback = () => {
      if (state.value != 7) {
        state.value = 4
        props.onPull(state.value)
      }
    }
    onUnmounted(() => {
      //  TODO: 去掉$data
      // for (const key in $data) {
      // $data[key] = null
    // }
    })
defineExpose({
  setState
})
</script>
<style lang="scss" scoped>
.my-scroll {
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  transition: all 450ms;
  backface-visibility: hidden;
  perspective: 1000px;
  position: relative;
  width: 100%;
  height: 100%;

}

.scroll-list {
  overflow: hidden;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-bottom {
  text-align: center;
  line-height: 0.4rem;
  margin-bottom: 0.46rem;
  color: #cacaca;
}
</style>
