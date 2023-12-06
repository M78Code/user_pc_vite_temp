<template>
  <div>
    <q-btn color="secondary" @click="get_event_code()" label="随机推送事件" />
    <div class="animation-content">
<!--      <img :src="svg_src">-->
      <object ref="svgCount" :data="svg_src" type="image/svg+xml" />
    </div>
  </div>
</template>
<script>

import { defineComponent } from 'vue'
export default defineComponent({
  props: ['svg_src'],
  data() {
    // sportId=1&dataSourceCode=PA&matchId=2928959
    return {
    }
  },
  watch: {
    svg_src(){
    }
  },
  methods: {
    // 生成随机事件
    get_event_code () {
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