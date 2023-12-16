<template>
  <!-- <div style="position: absolute;color: white;">
    {{ current_event_code }}~~
    {{ textAnimateParams }}--
  </div> -->
  <svg :width="width" :height="height" :key="key_1">
    <path :d="svgPath.path" :fill="pathAnimateColors[0]">
      <animate
        attributeName="d"
        :values="svgPath.values"
        :dur="pathAnimateParams.dur"
        :repeatCount="pathAnimateParams.repeatCount"
        :fill="fill"
      ></animate>
      <animate
        attributeName="fill"
        :dur="pathAnimateParams.dur"
        :values="pathAnimateColors[1]"
        :fill="fill"
        :repeatCount="pathAnimateParams.repeatCount" />
    </path>
    <text 
      :style="{ fill: textAnimateColors[0] }" 
      :x="textAnimateParams.x" 
      :y="textAnimateParams.y"
    >
      {{ textAnimateParams.text }}
      <animate
        attributeName="x"
        :dur="textAnimateParams.dur"
        :from="textAnimateParams.from"
        :to="textAnimateParams.to"
        :repeatCount="textAnimateParams.repeatCount"
        :fill="fill"
      ></animate>
      <animate
        attributeName="fill"
        :dur="textAnimateParams.dur"
        :values="textAnimateColors[1]"
        :fill="fill"
        :repeatCount="textAnimateParams.repeatCount" />
    </text>
  </svg>
</template>
<script>
import { defineComponent } from 'vue'
import { event_animation } from 'project/animation/src/globle/event.js'
export default defineComponent({
  props: ['width', 'height', 'current_event_code'],
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
  computed: {
    pathAnimateParams(){
      const {svg_path_config} = event_animation[this.current_event_code] || {}
      const {pathAnimateParams} = svg_path_config || {}
      
      return pathAnimateParams || {};
    },
    pathAnimateColors(){
      return this.pathAnimateParams.colors || [];
    },
    textAnimateParams(){
      const {svg_path_config} = event_animation[this.current_event_code] || {}
      const {textAnimateParams} = svg_path_config || {}
      return textAnimateParams || {};
    },
    textAnimateColors(){
      return this.textAnimateParams.colors || [];
    },
  },
  watch: {
    current_event_code(n,o) {
      if(n !== o){
        this.key_1 = !this.key_1
      }
      this.key_1 = Math.random()
      this.svgPath = this.rightPath()
    },
    width(){
      this.svgPath = this.rightPath()
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
    get_svg_path_before(initObj = {}, xo = {}, beforePath = [], move = 0, rate) {
      const {x:initX,y:initY} = initObj
      const {x,y} = xo
      let str = '';
      for (let i = 0; i < beforePath.length; i++) {
        const [a, b] = beforePath[i] || []
        if(i === 0){
          str += `M ${initX} ${initY} `
        } else if(i === beforePath.length - 1) {
          str += `L ${(initX + a * rate)} ${initY + b * rate} `
        } else {
          str += `L ${(x + (move + a) * rate)} ${y + b * rate} `
        }
      }
      str += 'Z'
      // console.log('st str', str)
      return str;
    },
    createPath(move = 0){
      const {svg_path_config} = event_animation[this.current_event_code]
      const {init,beforePath, startInit} = svg_path_config
      const [x, y] = startInit || init
      const [initX, initY] = init
      const rate = this.width/800
      const o = {
        x: initX * rate,
        y: initY * rate,
      }
      const xo = {
        x: x * rate,
        y: y * rate,
      }
      // const {x, y} = o
      // const path = `
      // M ${x} ${y}
      //
      // L ${(x + (move+50)*rate)} ${y}
      // L ${(x + (move+100)*rate)} ${y+20*rate}
      //
      // L ${(x + (move+50)*rate)} ${y+40*rate}
      // L ${(x + (move+110)*rate)} ${y+60*rate}
      //
      // L ${(x + (move+35)*rate)} ${y+80*rate}
      // L ${(x + (move+120)*rate)} ${y+100*rate}
      //
      // L ${(x + (move+30)*rate)} ${y+120*rate}
      // L ${(x + (move+140)*rate)} ${y+140*rate}
      //
      // L ${(x + (move+25)*rate)} ${y+165*rate}
      // L ${(x + (move+160)*rate)} ${y+185*rate}
      //
      // L ${(x + (move+25)*rate)} ${y+210*rate}
      // L ${x - 130*rate} ${y + 210*rate}
      // Z`
      // console.log('st path', path)
      // const {x,y} = o
      // return `M 0 0 L 20 0 L 30 10 L 20 20 L 30 30 L 20 40 L 0 40 L 0 0 Z`;
      return this.get_svg_path_before(o, xo, beforePath, move, rate);
      // return `M 0 0 L 20 0 L 30 10 L 20 20 L 30 30 L 20 40 L 0 40 L 0 0 Z`;
     
      // return path;
    },
    rightPath(){
      if(!this.current_event_code)return '';
      const {svg_path_config} = event_animation[this.current_event_code]
      if(!svg_path_config){
        console.error('请配置 svg_path_config');
        return '';
      }
      const {afterPathMove: move = 0} = svg_path_config
      const path = this.createPath()
      if(!path)return {};
      return {
        path: this.createPath(),
        values: `${path};${this.createPath(move)}`,
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