<!--
 * @Author: Router
 * @Description: bw3新版投注记录页处理滚动的组件
-->
<template>
  <div class="my-scroll" ref="myScroll" @scroll.passive="onScroll($event)">
    <div class="scroll-list">
      <slot></slot>
      <div class="scroll-bottom">
        <p v-if="state==4">{{i18n_t('myScroll.msg5')}}</p>
        <p v-if="state==5">{{i18n_t('myScroll.msg6')}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  name: 'my_scroll',
  data() {
    return {
      pageY: 0, //没看懂
      state: 0,	//下拉刷新的状态
      myScroll: null,	//myScroll 滚条DOM
      myScrollList: null,	//列表DOM
    }
  },
  props: {
    'onPull': { //加载回调
      type: Function,
      require: true
    },
  },
  mounted() {
    this.myScroll = this.$refs.myScroll //获取滑条dom
    this.myScrollList = this.myScroll.children[0] //获取列表dom
  },
  destroyed() {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
  methods: {
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
    setState(index) {
      this.state = index;
      if (index == 5) {
        this.state = 0;
      }
    },
    /**
     *@description 列表滚动处理
     *@param {Object} e 事件对象
     *@return {Undefined} undefined
     */
    onScroll(e) {
      let listHeight = this.myScrollList.offsetHeight; //列表总高度
      let listScrollTop = e.target.scrollTop + this.myScroll.offsetHeight; //当前滚动条位置
      if (this.state == 0 && listHeight - listScrollTop < 100) {
        this.bottomCallback()
      }
    },
    /**
     *@description 加载回调
     *@param {Undefined}  
     *@return {Undefined} undefined
     */
    bottomCallback() {
      if (this.state != 7) {
        this.state = 4
        this.onPull(this.state)
      }
    },
  },

}
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
  line-height: 40px;
  margin-bottom: 46px;
  color: #cacaca;
}
</style>
