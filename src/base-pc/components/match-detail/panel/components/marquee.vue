<!--
 * @Author: nuanYang
 * @Date: 2023-03-12 13:20:30
 * @Description: 
-->
<template>
  <div class="marquee-wrap" @click="$emit('open_alert')" ref="wrap">
    <div class="notify-wrap"></div>
    <marquee
      v-if="$q.platform.is.name == 'chrome'"
      class="line-height fit"
      scrollAmount="40"
      onMouseOut="this.start()"
      onMouseOver="this.stop()"
      v-html="str"
      scrolldelay="1000"
      truespeed="1000"
    ></marquee>
    <!-- 火狐浏览器 -->
    <div
      v-else
      class="animation-wrap line-height"
      :style="{ transform: `translateX(${translateX}px)` }"
      ref="marquee"
      @mouseenter="pause = true"
      @mouseleave="pause = false"
      v-html="str"
    ></div>
  </div>
</template>

<script>
export default {
  name: "charMarquee",
  props: {
    str: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      total_width: 0, //公告栏总宽度
      wrap_width: 0, //公告栏包裹宽度
      pause: false, //滚动是否暂停
      translateX: 0, //滚动偏移量
      speed: 1.5, //滚动速度
      timer_interval: 32, //滚动时间间隔
    };
  },
  mounted() {
    if (this.run_timer) {
        clearTimeout(this.run_timer)
        this.run_timer =null
    };
    if(this.$q.platform.is.name !== "chrome") {
      this.run_timer = setTimeout(() => {
        if (this.is_destroy) {
          return;
        }
        //设置宽度
        let { offsetWidth: marqueeWidth = 0 } = this.$refs.marquee;
        let { offsetWidth: wrapWidth = 0 } = this.$refs.marquee;
        this.total_width = -parseInt(marqueeWidth);
        this.wrap_width = parseInt(wrapWidth);
        this.timer_id = setInterval(this.animation, this.timer_interval);
      }, 2000);
    }
  },
  methods: {
    /**
     * @Description:公告栏文字滚动动画
     * @return {undefined} undefined
     */
    animation() {
      if (!this.pause) {
        this.translateX -= this.speed;
        if (this.translateX < this.total_width) {
          this.translateX = this.wrap_width;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.marquee-wrap {
  top: 36px;
  display: flex;
  width: 100%;
  overflow: hidden;
  align-items: center;
  height: 24px;
  cursor: pointer;
  background-color: var(--qq--chatroom-bg-color-5);
  color: var(--qq--chatroom-text-color-1);
  z-index: 20;
  .notify-wrap{
    width: 14px;
    height: 16px;
    background: var(--qq--chatroom-icon-13) center center no-repeat;
    background-size: 100%;
    margin:0 8px;
  }
  .line-height{
    line-height: 24px;
  }
}
</style>
