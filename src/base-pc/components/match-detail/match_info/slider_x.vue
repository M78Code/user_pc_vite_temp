<template>
  <div class="slider-x" ref="slider_x">
    <div v-if="isShowArrow" class="arrow-left" :class="{ disabled: currentScrollLength === 0}" @click="swipLeft"><img :src="compute_local_project_file_path('/image/common/svg/video-swipe-arrow.svg')" /></div>
    <div
        class="slider-content"
        @mousemove="onMousemove"
        @mousedown="onMousedown"
        @mouseup="onMouseup"
        ref="sliderContent">
        <div
        ref="item_wrapper"
        class="item-wrapper"
        :class="{'active': currentInfo && (currentInfo.fragmentId === item.fragmentId)}"
        v-for="(item, i) in slider_list" 
        :key="item.fragmentId"
        @click.stop="handle_item_click(item, i)"
        >
        <slot v-bind:item="item"></slot>
        </div>
    </div>
    <div v-if="isShowArrow" class="arrow-right" :class="{ disabled: currentScrollLength === contentWidth }"  @click="swipRight"><img :src="compute_local_project_file_path('/image/common/svg/video-swipe-arrow.svg')" /></div>
  </div>
</template>

<script>
import { compute_local_project_file_path } from "src/output/index.js";
export default {
  name: "slider_x",
  props: {
    slider_list: {
      type: Array,
      default: () => []
    },
    currentInfo: {
      type: Object,
      default: () => {}
    },
    itemWidth: {
      type: Number,
      default: 210
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      compute_local_project_file_path,
      isShowArrow: false, // 是否显示箭头
      boxWidth: 0, // 滑动容器宽度
      contentWidth: 0, // 滑动内容宽度
      numsInContainer: 1, // 容器里最多几个
      currentScrollLength: 0, // 当前滚动距离
      mouseX: false, // 是否拖动
    }
  },
  created() {
    this.throttleSwipLeft = lodash.throttle(this.swipLeft, 500);
    this.throttleSwipRight = lodash.throttle(this.swipRight, 500);
  },
  mounted() {
  },
  destroyed(){
    this.debounce_throttle_cancel(this.throttleSwipLeft);
    this.debounce_throttle_cancel(this.throttleSwipRight);
  },
  watch: {
    // 是否显示的时候
    isShow(n) {
        this.calcStyle()
    },
    // 数据内容变换的时候
    slider_list() {
        this.calcStyle()
    }
  },
  methods: {
    // 滑动
     sliderTo(type) {
        // 将要滚到的位置
        const _temp = this.currentScrollLength + type * (this.itemWidth * this.numsInContainer)
        const scrollLength = this.limitSrcollRang(_temp)
        // 当前滚动距离小于内容长度的时候
        if (this.currentScrollLength <= this.contentWidth) {
            this.$refs.sliderContent.scrollTo({
                left: scrollLength,
                behavior: 'smooth'
            })
            this.currentScrollLength = scrollLength
        }
    },
    // 计算宽度
    calcStyle() {
        this.contentWidth = this.slider_list.length * Number(this.itemWidth)
        this.boxWidth = this.$refs.sliderContent.offsetWidth
        this.numsInContainer = Math.floor(this.boxWidth / this.itemWidth)
        // 内容宽度大于容器宽度时候
        this.isShowArrow = this.contentWidth > this.boxWidth ? true : false
    },
    // 限制滚动距离
    limitSrcollRang(distant) {
      let _distant = distant
      if (_distant < 0) {
        _distant = 0
      }
      if (_distant > this.contentWidth) {
        _distant = this.contentWidth
      }
      return _distant
    },
    handle_item_click(item, index) {
      this.$emit('click', item)
      const objLength = this.itemWidth * (index + 1)
      const leftLimit = this.currentScrollLength
      const rigthLimit = leftLimit + this.boxWidth
      
      // 当内容大于视图区域时
      console.log('this.contentWidth', this.contentWidth, this.boxWidth)
      if (this.contentWidth > this.boxWidth) {
        // 当内容超过框的右侧时候,补全
        if (objLength > rigthLimit) {
          this.currentScrollLength = this.currentScrollLength + (objLength - rigthLimit)
          this.$refs.sliderContent.scrollTo({
            left: this.currentScrollLength
          })
        }
        // 当左侧内容不足的时候
        if (objLength - leftLimit < this.itemWidth) {
          this.currentScrollLength = this.currentScrollLength - (this.itemWidth - (objLength - leftLimit))
          this.$refs.sliderContent.scrollTo({
            left: this.currentScrollLength
          })
        }
      }
    },
    swipLeft() {
      this.sliderTo(-1)
    },
    swipRight() {
      // 当前剩余距离大于容器宽度的时候
      if (this.contentWidth - this.currentScrollLength > this.boxWidth ) {
        this.sliderTo(1)     
      }
    },
    onMousemove(e) {
      const offset = e.offsetX
      const xPosition = e.pageX
      // 鼠标移动方向
      const direction = xPosition - this.mouseX > 0 ? -1 : 1
      if (this.mouseX && offset > 5) {
        e.preventDefault()
        const _newPosition = this.limitSrcollRang(this.currentScrollLength + offset * direction)
        this.$refs.sliderContent.scrollTo({
          left: _newPosition
        })
        this.currentScrollLength = _newPosition
      }
    },
    onMousedown(e) {
      this.mouseX = e.pageX
    },
    onMouseup(e) {
      this.mouseX = 0
    },
  }
}
</script>

<style scoped lang="scss">
.slider-x {
  display: flex;
  position: relative;
  .arrow-left, .arrow-right {
    background: var(--q-gb-bg-lg-10);
    width: 30px;
    height: 30px;
    margin-top: -15px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    cursor: pointer;
    transition: all 0.2;
    // opacity: 0.8;
    // &:hover {
    //     opacity: 0.9;
    // }
    &.disabled {
      opacity: 0.5
    }
  }
  // &:hover {
  //   .arrow-left {
  //     left: 2px;
  //   }
  //   .arrow-right {
  //     right: 2px;
  //   }
  // }
  .arrow-left {
    left: 2px;
    // left: -50px;
  }
  .arrow-right {
    // right: -50px;
    right: 2px;
    transform: rotate(180deg);
    transform-origin: center center;
  }
  .slider-content {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    // scroll-behavior: smooth;
    display: flex;
    box-sizing: border-box;
    &.center {
        justify-content: center;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .item-wrapper {
    display: flex;
    &.active, &:hover {
      border: 1px solid var(--qq--video-history-video-border-color) !important;
    }
  }
}
</style>