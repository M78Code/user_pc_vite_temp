<template>
  <div>
    <div class="animation-content bg">
      <svg_tmp :height="svgHeight" :width="svgWidth" :current_event_code="current_event_code"></svg_tmp>
      <img ref="bgConainer" src="/public/animation/足球背景.png">
    </div>
  </div>
</template>
<script>

import { defineComponent } from 'vue'
import svg_tmp from "project/animation/src/pages/components/svg_tmp.vue"
// import svg2 from "project/animation/src/pages/components/svg2.vue"
// import svg3 from "project/animation/src/pages/components/svg3.vue"
import { event_animation } from '../../globle/event.js'
export default defineComponent({
  props: ['svg_src', 'current_event_code'],
  components: {
    svg_tmp,
  },
  computed:{
  },
  data() {
    return {
      isShowSvg: false,
      svgWidth: '',
      svgHeight: '',
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