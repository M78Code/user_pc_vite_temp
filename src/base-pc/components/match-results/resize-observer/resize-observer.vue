<!--
 * @Author: Cable
 * @Date: 2021-08-04 17:13:54
 * @Description: 监听dom大小变化
-->
<template>
  <div class="absolute-full resize-observer-wrap" ref="wrap">
    <div class="absolute-full expand" ref="expand" @scroll="on_scroll"></div>
    <div class="absolute-full shrink" ref="shrink" @scroll="on_scroll"></div>
  </div>
</template>

<script>
export default {
  name: "resizeObserver",
  mounted(){
    this.on_scroll()
  },
  destroyed(){
    clearTimeout(this.timer_id)
  },
  methods: {
    /**
     * @Description 滚动条滚动事件 
     * @param {undefined} undefined
    */
    on_scroll() {
      let expand = this.$refs.expand || {}
      let shrink = this.$refs.shrink || {}

      expand.scrollTop = shrink.scrollTop = 10000
      expand.scrollLeft = shrink.scrollLeft = 100000

      clearTimeout(this.timer_id)
      // 100ms 节流
      this.timer_id = setTimeout(() => {
        let wrap = this.$refs.wrap || {}

        let obj = {
          width:wrap.offsetWidth,
          height:wrap.offsetHeight,
        }
        this.$emit('resize',obj)
      },400)
    }
  }
};
</script>

<style lang="scss" scoped>
.resize-observer-wrap {
  pointer-events: none;
  visibility: hidden;
  .expand,
  .shrink {
    overflow: hidden;
    &:before {
      content: "";
      display: block;
    }
  }
  .expand:before {
    width: 10000px;
    height: 100000px;
  }
  .shrink:before {
    width: 250%;
    height: 250%;
  }
}
</style>
