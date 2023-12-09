<template>
  <svg :width="width" :height="height" :key="key_1">
    <path :d="svgPath.path" fill="rgba(0,0,0,.3)">
      <animate
        attributeName="d"
        :values="svgPath.values"
        :dur="duration"
        :repeatCount="repeatCount"
        :fill="fill"
      ></animate>
      <animate
        attributeName="fill"
        :dur="duration"
        values="url(#gradient);rgba(0,0,0,.8)"
        :fill="fill"
        :repeatCount="repeatCount" />
    </path>
    <text style="fill: rgba(255,255,255,0)" x="100" y="150">
      主场进球
      <animate
        attributeName="x"
        :dur="'0.5s'"
        from="0"
        to="100"
        :repeatCount="repeatCount"
        :fill="fill"
      ></animate>
      <animate
        attributeName="fill"
        :dur="duration"
        values="url(#gradient);rgba(255,255,255,.8)"
        :fill="fill"
        :repeatCount="repeatCount" />
    </text>
  </svg>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: ['width', 'height'],
  components: {
  },
  data(){
    return {
      duration: '2s',
      repeatCount: '1', // 1 indefinite
      fill: 'freeze',
      svgPath: {},
      key_1: false
    };
  },
  watch: {
    current_event_code(n,o) {
      // 进球
      console.warn(n)
      if(n != o) {
        this.key_1 = !this.key_1
      }
    }
  },
  mounted () {
    this.svgPath = this.rightPath()
    window.addEventListener('resize', () => {
      this.svgPath = this.rightPath()
    })
  },
  methods: {
    // 获取path标点
    get_svg_path_before(code) {


    },
    get__svg_path_after(code) {


    },
    createPath(move = 0){
      const rate = this.width/800
      const defaultObj = {
        x: 140 * rate,
        y: 95 * rate
      }
      const o = {
        x: 140 * rate,
        y: 95 * rate,
      }
      const {x,y} = o
      // return `M 0 0 L 20 0 L 30 10 L 20 20 L 30 30 L 20 40 L 0 40 L 0 0 Z`;
      const path = `
      M ${defaultObj.x} ${defaultObj.y}
      L ${x} ${y}
      
      L ${(x + (move+50)*rate)} ${y}
      L ${(x + (move+100)*rate)} ${y+20*rate}
      
      L ${(x + (move+50)*rate)} ${y+40*rate}
      L ${(x + (move+110)*rate)} ${y+60*rate}
      
      L ${(x + (move+35)*rate)} ${y+80*rate}
      L ${(x + (move+120)*rate)} ${y+100*rate}
      
      L ${(x + (move+30)*rate)} ${y+120*rate}
      L ${(x + (move+140)*rate)} ${y+140*rate}
      
      L ${(x + (move+25)*rate)} ${y+165*rate}
      L ${(x + (move+160)*rate)} ${y+185*rate}
      
      L ${(x + (move+25)*rate)} ${y+210*rate}
      L ${defaultObj.x - 130*rate} ${y + 210*rate}
      Z`
      return path;
    },
    rightPath(){
      const path = this.createPath()
      return {
        path: this.createPath(),
        values: `${path};${this.createPath(440)}`,
      }
    },
    rightPathValues(){},
  }
})
</script>
<style scoped lang="scss">
svg{

}
</style>