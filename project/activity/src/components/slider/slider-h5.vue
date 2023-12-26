<!--
 * 数字滑块
 * @Author: Cable
 * @Date: 2022-03-03 11:57:09
-->
<template>
  <div class="c-slider">
    <div class="slider-bar" ref="slider">
      <div class="slider-btn" v-if="max > 0" :style="`transform:translateX(${left}px)`" @mousedown="mousedown" @touchstart="mousedown">{{value}}</div>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    value:  Number | String,
    min:{
      type:Number,
      default:0
    },
    max: {
      type:Number,
      default:100
    },
  },
  data() {
    return {
      // 按钮偏移
      left:0
    }
  },
  watch:{
    // 监听数值变化
    value(){
      this.set_left()
    },
    // 监听最小值变化
    min(){
      this.set_left()
    },
    // 监听最大值变化
    max(){
      this.set_left()
    },
  },
  created(){
    // this.is_mobile = this.$q.platform.is.mobile
    this.is_mobile = true;
    // 鼠标是否按下
    this.is_mousedown = false
    this.$emit('change_is_mousedown',false)
    document.addEventListener("mousemove", this.mousemove);
    document.addEventListener("mouseup", this.mouseup);
    if(this.is_mobile){
      document.addEventListener("touchmove", this.mousemove);
      document.addEventListener("touchend", this.mouseup);
    }
  },
  mounted(){
    this.width = this.$refs.slider.clientWidth
  },
  beforeDestroy(){
    // 鼠标事件取消监听
    document.removeEventListener("mousemove", this.mousemove);
    document.removeEventListener("mouseup", this.mouseup);
    if(this.is_mobile){
      document.removeEventListener("touchmove", this.mousemove);
      document.removeEventListener("touchend", this.mouseup);
    }
  },
  methods: {
    /**
     * @Description 鼠标按下
     * @param {undefined} undefined
    */
    mousedown(e){
      this.clientX = this.is_mobile ? _.get(e, 'changedTouches[0].clientX') : e.clientX
      this.last_left = this.left
      this.is_mousedown = true
      this.$emit('change_is_mousedown',true)
    },
    /**
     * @Description 鼠标弹起
     * @param {undefined} undefined
    */
    mouseup(){
      this.is_mousedown = false
      this.$emit('change_is_mousedown',false)
    },
    /**
     * @Description 鼠标移动事件
     * @param {object} e 鼠标事件
     * @param {undefined} undefined
    */
    mousemove(e){
      if(!this.is_mousedown || (this.is_mobile && !_.get(e,'changedTouches[0]')) || this.max <= 1){
        return
      }
      let clientX = this.is_mobile ? e.changedTouches[0].clientX : e.clientX
      let left = this.last_left + (clientX - this.clientX)
      left = Math.max(left,0)
      left = Math.min(left,this.width)
      this.left = left
      this.set_value()
    },
    /**
     * @Description 设置当前数值
     * @param {undefined} undefined
    */
    set_value(){
      let { min, max, width, left } = this
      let value = parseInt(left / width * (max - min) + min)
      this.$emit('update:value',value)
    },
    /**
     * @Description 设置偏移量
     * @param {undefined} undefined
    */
    set_left(){
      if(!this.is_mousedown){
        let { min, max, width, value } = this
        this.left = parseInt((value - min) / (max - min) * width * 100) / 100
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.c-slider {
  flex: 1;
  height: 18px;
  background:  var(--qq--com-img-bg-167)
    center center no-repeat;
  background-size: 3.25rem auto;

  .slider-bar {
    width: calc(100% - 50px);
    height: 100%;
    position: relative;
    margin: auto;
  }

  .slider-btn {
    width: 38px;
    height: 38px;
    background:  var(--qq--com-img-bg-168)
      center center no-repeat;
    background-size: 200%;
    border-radius: 50%;
    position: absolute;
    top: -10px;
    left: -19px;
    color: #20082d;
    font-size: 12px;
    text-align: center;
    line-height: 32px;
  }
}
</style>

