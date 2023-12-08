<template>
  <div>
    <q-btn color="secondary" @click="get_event_code()" label="随机推送事件" />
    <div class="animation-content">
<!--      <img :src="svg_src">-->
<!--      <object ref="svgCount" :data="svg_src" type="image/svg+xml" />-->
      <svg_tmp v-if="isShowSvg"></svg_tmp>
    </div>
  </div>
</template>
<script>

import { defineComponent } from 'vue'
import svg_tmp from "project/animation/src/pages/components/svg_tmp.vue"
export default defineComponent({
  props: ['svg_src'],
  components: {
    svg_tmp
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
  methods: {
    // 生成随机事件
    get_event_code () {
      this.isShowSvg = !this.isShowSvg
      this.$emit('get_event_code')
    },
  },
})
</script>
<style scoped lang="scss">

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