<template>
  <div>
    <q-btn color="secondary" @click="get_event_code()" label="随机推送事件" />
    <div class="animation-content bg">
<!--      <img :src="svg_src">-->
<!--      <object ref="svgCount" :data="svg_src" type="image/svg+xml" />-->
      <svg_tmp :height="svgHeight" :width="svgWidth" v-if="tmp === 0"></svg_tmp>
      <svg3 :height="svgHeight" :width="svgWidth" v-if="tmp === 1"></svg3>
<!--      <Svg3 :height="svgHeight" :width="svgWidth" v-if="isShowSvg1" />-->
      <img ref="bgConainer" src="/public/animation/足球背景.png">
    </div>
  </div>
</template>
<script>

import { defineComponent } from 'vue'
import svg_tmp from "project/animation/src/pages/components/svg_tmp.vue"
import svg2 from "project/animation/src/pages/components/svg2.vue"
import svg3 from "project/animation/src/pages/components/svg3.vue"
import { event_animation } from '../../globle/event.js'
export default defineComponent({
  props: ['svg_src', 'current_event_code'],
  components: {
    svg_tmp,
    svg2,
    svg3,
  },
  computed:{
    tmp(){
      const {animation_svg_tmp} = event_animation[this.current_event_code] || {}
      return animation_svg_tmp;
    },
  },
  data() {
    return {
      isShowSvg: false,
    }
  },
  watch: {
    svg_src(){
    }
  },
  mounted () {
    this.calc()
    window.addEventListener('resize', this.calc)
  },
  methods: {
    calc(){
      this.$refs.bgConainer.onload = () => {
        const {clientHeight,clientWidth} = this.$refs.bgConainer
        this.svgWidth = clientWidth
        this.svgHeight = clientHeight
      }
      this.$nextTick(() => {
        const {clientHeight,clientWidth} = this.$refs.bgConainer
        this.svgWidth = clientWidth
        this.svgHeight = clientHeight
      })
    },
    // 生成随机事件
    get_event_code () {
      this.isShowSvg = !this.isShowSvg
      this.$emit('get_event_code')
    },
  },
})
</script>
<style scoped lang="scss">

.bg{
  position: relative;
  img{
    width: 100%;
  }
  svg{
    position: absolute;
    top: 0;
    left: 0;
  }

  //background-image: url("/public/animation/足球背景.png");
  //background-repeat: no-repeat;
  //background-size: contain;
}
.animation-content,
object{
  width: 600px;
  height: 260px;
}
.animation-content {
  background-image: url("/public/animation/足球背景.png");
  background-repeat: no-repeat;
  background-size: contain;
}
object{
}
</style>