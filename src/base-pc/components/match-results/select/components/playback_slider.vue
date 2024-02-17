<template>
  <div class="drag-scroll  relative-position">
    <!-- 滚动区域 -->
    <div class="hide-scrollbar" ref="area" @scroll="on_scroll">
      <div class="content" @mousedown="mousedown">
        <slot></slot>
        <div style="min-width:40px" v-show="has_scroll"></div>
        <resize-observer v-if="is_mounted" @resize="scroll_height_change" />
      </div>
    </div>
    <!-- 左右滚动按钮 -->
    <div class="more-btn left" v-show="show_left_btn" @click="click_move('left')"></div>
    <div class="more-btn right" v-show="show_right_btn" @click="click_move('right')"></div>
  </div>
</template>
<script>
import resizeObserver from "./resize_observer.vue"
// import { mapGetters} from "vuex";
export default {
  name: "drag-scroll",
  components:{
    resizeObserver
  },
  data() {
    return {
      // 是否显示左边按钮
      show_left_btn: false,
      // 是否显示右边按钮
      show_right_btn: false,
      // 是否有滚动条
      has_scroll:false,
      // 组件是否加载完成
      is_mounted:false,
      timer:null //定时器
    };
  },
  computed:{
    // ...mapGetters({
    //   //获取页面大小信息
    //   vx_get_layout_size: "get_layout_size"
    // }),
  },
  created() {
    this.scroll_width = 0
    // 鼠标是否按住滚动条
    this.is_mousedown = false
    // 组件是否销毁
    this.is_destroy = false
    this.for_count = 999
    // 鼠标事件监听
    document.addEventListener("mousemove", this.mousemove);
    document.addEventListener("mouseup", this.mouseup);
  },
  destroyed(){
    clearInterval(this.listener_timer_id)
    clearInterval(this.interval_id)
     /**清除定时器 */
        if(this.timer) {
          clearTimeout(this.timer)
          this.timer =null
    }
    this.is_destroy = true
    // 鼠标事件取消监听
    document.removeEventListener("mousemove", this.mousemove);
    document.removeEventListener("mouseup", this.mouseup);
  },
  mounted() {
    this.area_obj = this.$refs.area
    this.area_height = this.area_obj.offsetHeight

    this.is_mounted = true
  },
  methods: {
    /**
     * @Description 滚动条滚动事件
     * @param {object} e 滚动事件
     * @param {undefined} undefined
    */
    on_scroll(e){
      let scrollLeft = e.target.scrollLeft
      if(scrollLeft > 0){
        this.show_left_btn = true
      }else{
        this.show_left_btn = false
      }
      if(scrollLeft >= (this.area_obj.scrollWidth - this.area_obj.clientWidth)){
        this.show_right_btn = false
      }else{
        this.show_right_btn = true
      }
    },
    isShowBtn(){
      
      let scrollLeft = this.$refs.area.scrollLeft
      console.log(scrollLeft, '---scrollLeft')
      if(scrollLeft > 0){
        this.show_left_btn = true
      }else{
        this.show_left_btn = false
      }
      if(scrollLeft >= (this.area_obj.scrollWidth - this.area_obj.clientWidth)){
        this.show_right_btn = false
      }else{
        this.show_right_btn = true
      }
      this.scroll_height_change()
    },
    /**
     * @Description 滚动高度改变事件
     * @param {undefined} undefined
    */
    scroll_height_change(){
       if (this.timer) {
         clearTimeout(this.timer)
         this.timer =null
         };
      this.timer = setTimeout(() => {
        if(this.area_obj.scrollWidth > this.area_obj.clientWidth){
          this.show_right_btn = true
          this.has_scroll = true
        }else{
          this.has_scroll = false
          this.show_right_btn = false
        }
      },300)
    },

    /**
     * @Description 是否滚动
     * @param {boolean}
    */
    is_move(){
      let move_left = Math.abs(window.event.clientX - this.clientX)
      if(move_left > 10){
        return true
      }else{
        return false
      }
    },
    /**
     * @Description 点击移动
     * @param {string} type  left左移   right右移
     * @param {undefined} undefined
    */
    click_move(type){
      clearInterval(this.interval_id)
      let scrollLeft = this.area_obj.scrollLeft
      this.for_count = 0
      // 滚动动画
      this.interval_id = setInterval(() => {
        this.for_count++
        if(this.for_count > 50){
          clearInterval(this.interval_id)
        }
        if(type == 'left'){
          scrollLeft -= 15
        }else{
          scrollLeft += 15
          this.show_right_btn = false
        }
        this.area_obj.scrollLeft = scrollLeft
      },16)
    },
    /**
     * @Description 鼠标按下
     * @param {object} e 鼠标事件
     * @param {undefined} undefined
    */
    mousedown(e){
      this.clientX = e.clientX
      this.last_left = this.area_obj.scrollLeft
      this.is_mousedown = true
    },
    /**
     * @Description 鼠标弹起
     * @param {undefined} undefined
    */
    mouseup(){
      this.is_mousedown = false
    },
    /**
     * @Description 鼠标移动事件
     * @param {object} e 鼠标事件
     * @param {undefined} undefined
    */
    mousemove(e){
      if(!this.is_mousedown){
        return
      }
      let left = this.last_left - (e.clientX - this.clientX)
      this.area_obj.scrollLeft = left
    },
  },
  watch:{
    "$route.name"() {
        this.scroll_height_change()
        this.area_obj.scrollLeft = this.last_left
    },
    'vx_get_layout_size.center_width'(){
        this.scroll_height_change()
    }
  }
};
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
    flex-wrap: nowrap;
    height: 100%;
    ::v-deep img {
      pointer-events: none;
    }
  }
  .more-btn {
    width: 30px;
    position: absolute;
    height: 100%;
    top: 0;
    // background-image: url("~public/image/yabo/svg/list_filter_arrow_right.svg");
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    &.left {
      left: -36px;
      // transform: rotate(180deg);
      background-image: var(--qq--match-results-drag-scroll-left)// url("~public/image/yabo/svg/video-swipe-arrow-left-new.svg");
    }
    &.right {
      right: -36px;
      background-image: var(--qq--match-results-drag-scroll-right) // url("~public/image/yabo/svg/video-swipe-arrow-right-new-neight.svg");
    }
  }
}
</style>
