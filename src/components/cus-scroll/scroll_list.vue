<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 自定义列表滚动区域
-->
<template>
  <div class="v-scroll-list  relative-position">
    <!-- 滚动区域 -->
    <div class="list-scrollbar router_scroll_layout" :style="{right:$utils.is_iframe ? '1px' : '3px'}" ref="area" @scroll="on_scroll">
      <div class="v-scroll-content relative-position">
        <div ref="before">
          <slot name="before"></slot>
        </div>
        <slot></slot>
        <div :class="{'none-thumb':!has_thumb}" ref="after" >
          <slot name="after"></slot>
        </div>
        <!-- <resize-observer v-if="is_mounted" @resize="scroll_height_change" /> -->
      </div>
    </div>
  </div>
</template>
<script>

// import resizeObserver from "src/components/match-results/resize-observer/resize-observer.vue"
// import {mapGetters,mapActions} from 'vuex'
// import { store } from "src/store/index.js"
export default {
  name: "curScrollList",
  components:{
    // resizeObserver
  },
  inject:['match_list_card'],
  props: {
    // 吸顶高度
    sticky_height:{
      type:Number,
      default:0
    },
  },
  data() {
    return {
      // 是否显示mid
      test:sessionStorage.getItem('wsl'),
      // 加载的赛事索引
      load_match_index:50,
      // 底部空盒子高度
      empty_height: ['theme01_y0','theme02_y0'].includes(store.getters.get_theme) ? 0 : 800,
      // 组件是否加载完成
      is_mounted:false,
      //是否有滚动条 
      has_thumb:false,
    };
  },
  created() {
    // 滚动条位置
    this.thumb_top = 0
    // 上一次滚动条位置
    this.last_thumb_top = 0
    // 滚动内容高度
    this.scroll_height = 0
    // 组件是否销毁
    this.is_destroy = false 
    // 滚动内容高度
    this.scrollHeight = 0
    this.on_bootom = this.throttle(this.on_bootom, 300);
    this.emit_on_scroll = this.throttle(this.emit_on_scroll, 500);
    this.update_list_card_offset = this.throttle(this.update_list_card_offset, 50);
 
    // 设置列表滚动条位置
    this.$root.$on('set_match_list_scroll_top',this.set_scrollTop);
  },
  beforeUnmount(){
    this.is_destroy = true
    // 设置列表滚动条位置
    this.$root.$off('set_match_list_scroll_top',this.set_scrollTop);
    this.debounce_throttle_cancel(this.on_bootom);
    this.debounce_throttle_cancel(this.emit_on_scroll);
    this.debounce_throttle_cancel(this.update_list_card_offset);
  },
  mounted() {
    this.area_obj = this.$refs.area
    this.thumb_obj = this.$refs.thumb
    this.area_height = this.area_obj.offsetHeight 
    if(this.sticky_height > 0){
      this.before_height = this.sticky_height
    }else{
      this.before_height = this.$refs.before.offsetHeight 
    }
    this.is_mounted = true
    let {status, height} =this.get_retain_scroll_obj
    if(status){
      this.$nextTick(()=>{
        this.set_scrollTop(height)
        this.set_retain_scroll_obj({status:false,height:0})
      })
    }
  },
  // computed:{
  //   ...mapGetters({
  //    //获取当前主题
  //     get_theme: "get_theme",
  //     //获取保存的滚动高度
  //     get_retain_scroll_obj: "get_retain_scroll_obj",
  //     }),
  // },
  methods: {
    // ...mapActions({
    //   //设置保存的滚动高度
    //     set_retain_scroll_obj:"set_retain_scroll_obj"
    //   }),
    
    /**
     * @Description 滚动到底部 
     * @param {undefined} undefined
    */
    on_bootom(){
      this.load_match_index += 20
    },
    /**
     * @Description 滚动条滚动事件 
     * @param {object} e 滚动事件
     * @param {undefined} undefined
    */
    on_scroll(e){
      let scrollTop = e.target.scrollTop
      if(scrollTop > this.is_bootom_height){
        this.on_bootom()
      }
      this.emit_on_scroll()
      // 设置列表滚动条scrollTop
      this.$matchlist.set_scroll_top(scrollTop)
      // 更新列表卡片偏移量
      this.update_list_card_offset()
    },
    /**
     * @Description 更新列表卡片偏移量 
     * @param {undefined} undefined
    */
    update_list_card_offset(){
      this.match_list_card && this.match_list_card.set_card_show_level()
    },
     /**
     * @Description 列表滚动事件
     * @param {number} 
    */
    emit_on_scroll() {
      useMittEmit('emit_list_on_scroll')
    },
    /**
     * @Description 滚动高度改变事件(容器高度变化回调函数) 
     * @param {undefined} undefined
    */
    scroll_height_change(){
      this.scrollHeight = this.area_obj.scrollHeight
      this.is_bootom_height = this.scrollHeight - this.area_height - 500
      this.has_thumb = this.scrollHeight > this.area_height
    },
    /**
     * @Description 设置滚动条位置 
     * @param {number} top 滚动条top值
     * @param {string} type default：直接修改  inc：递增 dec：递减
     * @param {undefined} undefined
    */
    set_scrollTop(top,type){
      if(type == 'inc'){
        this.area_obj.scrollTop += top
      }else if(type == 'dec'){
        this.area_obj.scrollTop -= top
      }else{
        this.area_obj.scrollTop = top 
      }
    },
    /**
     * @Description 获取滚动组件 兼容 q-scroll-area
     * @param {undefined} undefined
    */
    get_scrollArea(){
      return this
    },
    /**
     * @Description 设置滚动条位置 兼容 q-scroll-area
     * @param {undefined} undefined
    */
    setScrollPosition(top){
      this.set_scrollTop(top)
    },

  }
};
</script>
<style lang="scss" scoped>
.v-scroll-list {
  width: 100%;
  height: 100%;
  .list-scrollbar {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 3px;
    scrollbar-width: thin; /* 火狐滚动条无法自定义宽度，只能通过此属性使滚动条宽度变细 */
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
    }
  }
}

/*  滚动条样式 */
.q-scrollarea__bar {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
.q-scrollarea__thumb {
  position: absolute;
  right: 0;
  min-width: 5px;
  cursor: pointer;
  opacity: 1;
  z-index: 300;
}
.test {
  position: absolute;
  color: red;
  font-size: 14px;
  z-index: 999999;
  left: 0;
  bottom: 0;
  user-select: text;
}
</style>
