<!--
 * @Author: Cable
 * @Date: 2020-08-06 15:54:20
 * @Description: 下划线跟随移动的tab组件
-->
<template>
  <div class="tab-wrap fit  relative-position" ref="wrap" @mousedown="mousedown">

    <div class="item-wrap  relative-position" ref="item-wrap" :style="{left:item_wrap_left+'px'}" :key="key">
      <div class="tab-item yb-flex-center"
        :class="[{active:currentIndex == index},val.class]"
        v-for="(val,index) in list" :key="index"
        @click.stop="onclick(index, val)"
        @mouseenter="tabs_enter(index)"
        @mouseleave="tabs_leave(index)"
        :id="DOM_ID_SHOW && `top-menu-ids-${val.id}`"
      >
        <img v-if="val.img_src" v-check-img="{src: val.img_src, default: `${$g_image_preffix}/image/common/activity_banner/gift_package.png`}" />
        {{val[tab_name_key]}}
        <!-- 早盘||串关 主列表顶部日期后显示赛事数量 -->
        <span v-if="is_list_top_menu" class="match-count">({{val.count}})</span>

        <template v-if="val.tab_name2">
          <br/>{{val.tab_name2}}
        </template>
      </div>
      <template v-if="currentIndex!==-1 && width > 0 && is_show_line">
        <div :class="['line-wrap',{'pseudo':line_width}]">
          <div class="line" :style="{transform:'translateX('+left+'px)',width:width+'px'}"></div>
        </div>
      </template>
    </div>
    <!-- 左右按钮 -->
    <template v-if="is_show_btn">
      <div class="left-btn btn" v-show="left_btn_show && !is_drag" @click="item_wrap_left += 100"><div class="yb-icon-arrow"></div></div>
      <div class="right-btn btn" v-show="right_btn_show&& !is_drag" @click="item_wrap_left -= 100"><div class="yb-icon-arrow"></div></div>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props:{
    //tab列表
    list:{
      type: Array,
      default:()=>[],
    },
    //下划线显示
    is_show_line:{
      type:Boolean,
      default:false
    },
    //左右按钮显示
    is_show_btn:{
      type:Boolean,
      default:false
    },
    // 列表顶部
    is_list_top_menu:Boolean,
    //item盒子左右padding
    padding:{
      type:Number,
      default:15
    },
    //当前选中索引
    currentIndex:{
      type:Number,
      default:0
    },
    tab_name_key:{
      type:String,
      default:"tab_name"
    },
    checked: {
      type: Boolean,
      default: true
    },
    hasActivity: Boolean,
    // 是否可以拖拽
    is_drag: Boolean,
    // 下划线宽度
    line_width: Number
  },
  data() {
    return {
      key:0,//tab模板文件key
      left:0,//下划线left
      width:0,//下划线宽度
      sizes:[],//下划线初始大小
      item_wrap_left:0,//item包裹left
      item_wrap_width:0,//item包裹宽度
      item_total_width:0,//所有item的宽度
      timer: null,
    }
  },
  created () {
    // 显示部分dom ID
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
    // 鼠标是否按下
    this.is_mousedown = false
    // 鼠标事件监听
    if(this.is_drag){
      document.addEventListener("mousemove", this.mousemove);
      document.addEventListener("mouseup", this.mouseup);
    }

  },
  computed:{
    ...mapGetters([
      'get_layout_list_size',
    ]),
    /**
     * @Description:左边按钮是否显示
     * @return {boolean}
     */
    left_btn_show(){
      if(this.item_wrap_left < 0){
        return true
      }else{
        return false
      }
    },
    /**
     * @Description:右边按钮是否显示
     * @return {boolean}
     */
    right_btn_show(){
      if(this.item_total_width > this.item_wrap_width && this.item_wrap_left > (this.item_wrap_width - this.item_total_width - 50)){
        return true
      }else{
        return false
      }
    },
  },
  methods: {
    /**
     * @Description:切换选项
     * @param {number} index 切换选项的索引
     * @return {undefined} undefined
     */
    onclick(index, item){
       let num = index - this.currentIndex
        if(!num) return
      if(this.currentIndex > index){
        if(this.left_btn_show){
            this.hand_cilck_move(80+this.item_wrap_left)
        }
      }else{
        if(this.right_btn_show){
          this.hand_cilck_move(-50+this.item_wrap_left)
        }
      }
      this.$emit('onclick',{index, item})
    },
    hand_cilck_move(left){
       if(!this.is_drag) return
      let max_left = 0 - (this.item_total_width - this.item_wrap_width + 50)
       if(left>=0){
         left = 0
       }else if( left < max_left){
          left = max_left
       }
        this.item_wrap_left = left
    },
    /**
     * @Description:鼠标移入选项
     * @param {number} index 移入选项的索引
     * @return {undefined} undefined
     */
    tabs_enter(index) {
      this.tabs_hover(index, 'in')
    },
    /**
     * @Description:鼠标移出选项
     * @param {number} index 移出选项的索引
     * @return {undefined} undefined
     */
    tabs_leave(index) {

      this.tabs_hover(index, 'out')
    },
    /**
     * @Description:鼠标移入移出操作
     * @param {number} index 选项的索引
     * @param {string} type  类型 in 移入  out 移出
     * @return {undefined} undefined
     */
    tabs_hover(index, type) {
      // 顶部导航栏的任务中心不展示下划线
      let _index;
      let last_tabitem = this.list[index];
      let activity = this.hasActivity;
      // 如果当前有活动并且当前 index 是最后一个并且当前对象有 path 属性以及 path 值是活动路径，就不展示下划线
      if (activity && (index == this.sizes.length - 1) && last_tabitem.path && last_tabitem.path.indexOf('/activity') != -1) {
        _index = this.currentIndex
      } else {
        _index = index;
      }
      if (type == 'in') {
        if (_.get(this.sizes, `[${_index}]`)) {
          this.left = _.get(this.sizes, `${_index}.left`)
          this.width = _.get(this.sizes, `${_index}.width`)
        }
      }
      if (type == 'out') {
        if (_.get(this.sizes, `[${this.currentIndex}]`)) {
          this.left = _.get(this.sizes, `${this.currentIndex}.left`)
          this.width = _.get(this.sizes, `${this.currentIndex}.width`)
        }
      }
      // 固定下划线宽度
      if(this.line_width){
        this.left = this.left + (this.width - this.line_width) / 2
        this.width = this.line_width
      }
    },
    init(){
      if(this.init_timer){
        clearTimeout(this.init_timer)
      }
      this.init_timer = setTimeout(this.init_func,300)
    },
    /**
     * @Description:初始化  设置选项初始宽高
     * @return {undefined} undefined
     */
    init_func(){
      let _wrap = _.get(this,'$refs.wrap',{})
      let dom = _.get(this,'$refs.item-wrap.children',[])
      this.sizes = []
      for(let i = 0; i < dom.length; i++){
        let {offsetLeft=0,clientWidth=0} =  dom[i]
        this.sizes.push({
          left:offsetLeft+this.padding,
          width:clientWidth-this.padding*2
        })
      }
      if(this.sizes.length > 0){
        let current_index = this.currentIndex==-1?0:this.currentIndex;
        this.left =   _.get(this.sizes,`${current_index}.left`,0)
        this.width =  _.get(this.sizes,`${current_index}.width`,0)
        this.item_wrap_width = _wrap.clientWidth
        this.item_total_width = this.sizes[this.sizes.length-1].left + this.sizes[this.sizes.length-1].width
      }else{
        this.width = 0
      }
      // 固定下划线宽度
      if(this.line_width){
        this.left = this.left + (this.width - this.line_width) / 2
        this.width = this.line_width
      }
    },
    /**
     * @Description:更新dom数据 解决选项数组改变  dom不更新
     * @return {undefined} undefined
     */
    update_tab_key(){
      this.key++
      this.$nextTick(()=>{
        this.init()
      })
    },
    /**
     * @Description 鼠标按下
     * @param {object} e 鼠标事件
     * @param {undefined} undefined
    */
    mousedown(e){
      this.clientX = e.clientX
      this.last_left = this.item_wrap_left
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
      if(!this.is_mousedown || this.item_wrap_width > this.item_total_width){
        return
      }
      let left = this.last_left + (e.clientX - this.clientX)
      if(left > 0){
        left = 0
      }
      // 最大偏移量
      let max_left = 0 - (this.item_total_width - this.item_wrap_width + 50)
      if(left < max_left){
        left = max_left
      }
      this.item_wrap_left = left
    },
  },
  watch:{
    //监听屏幕宽度改变  设置是否显示按钮
    'get_layout_list_size.width'(){
      this.item_wrap_width = this.yabo_common.get_refs_info('wrap', null, this).clientWidth
    },
    //监听list长度发生改变
    'list.length'(){
      // 做异步处理防止data数据发生改变
      this.$nextTick(()=>{
        // 初始化
        this.init()
      })
    },
    //list语言变化时
    'list.0'(){
      this.$nextTick(()=>{
        // 初始化
        this.init()
      })
    },
    //监听选中改变
    currentIndex:{
      handler(){
          if (this.timer) {
          clearTimeout(this.timer)
          this.timer =null
          };
        this.timer = setTimeout(()=>{
          if(!this.sizes[this.currentIndex]) return
          this.left = _.get(this.sizes, `${this.currentIndex}.left`)
          this.width = _.get(this.sizes, `${this.currentIndex}.width`)
          // 固定下划线宽度
          if(this.line_width){
            this.left = this.left + (this.width - this.line_width) / 2
            this.width = this.line_width
          }
        })
      },
      immediate:true
      }
  },
  mounted(){
    // 给 tabs 加上防抖
    this.tabs_hover = this.debounce(this.tabs_hover,100)
    this.$nextTick(()=>{
      this.init()
    })
    this.$root.$on('update_tab_key', this.update_tab_key);
  },
  destroyed() {
    this.debounce_throttle_cancel(this.tabs_hover);
    this.$root.$off('update_tab_key', this.update_tab_key);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if(this.init_timer){
      clearTimeout(this.init_timer)
    }
    // 鼠标事件取消监听
    if(this.is_drag){
      document.removeEventListener("mousemove", this.mousemove);
      document.removeEventListener("mouseup", this.mouseup);
    }
  },
};
</script>
<style lang="scss" scoped>
.tab-wrap {
  overflow: hidden;
  .item-wrap {
    position: absolute;
    top: 0;
    width: 1000px;
    display: flex;
    height: 100%;
    z-index: 99;
    align-items: center;
    .tab-item {
      cursor: pointer;
      padding: 0 15px;
      text-align: center;
      flex-shrink: 0;
      height: 24px;
      line-height: 24px;
      border-radius: 15px;
      &.active {
        font-weight: 600;
        line-height: 24px;
        border: none !important;
      }
      .match-count {
        opacity: 0.7;
      }
    }
    .line-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 3px;
      .line {
        position: relative;
        width: 30px;
        height: 100%;
        transition: all 0.3s;
        z-index: 10;
      }
      &.pseudo{
        .line {
           &::before,&::after {
              display: none;
           }
        }
      }
    }
  }
  /** 左右切换按钮 -S*/
  .btn {
    height: 100%;
    position: absolute;
    top: 0;
    width: 38px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .left-btn {
    left: 0;
    transform: rotate(180deg);
  }
  .right-btn {
    right: 0;
  }
  /** 左右切换按钮 -E*/
}
.leagues-bg {
  .tab-wrap {
    .item-wrap {
      .line-wrap {
        bottom: 4px !important;
      }
    }
  }
}
</style>
