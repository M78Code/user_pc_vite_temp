<template>
  <!-- <div style="position: absolute;color: white;">
    {{ current_event_code }}~~
    {{ textAnimateParams }}--
  </div> -->
  <svg v-if="isShowDefaultSvg" style="z-index: 10" :width="width" :height="height">
    <defs>
      <linearGradient
        id="grad"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" style="stop-color: rgba(0,0,0,.4);stop-opacity: 1" />
        <stop offset="100%" style="stop-color: rgba(0,0,0,.7);stop-opacity: 1" />
        <animate
          attributeName="x1"
          from="0%"
          to="100%"
          dur="1s"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="x2"
          from="100%"
          to="200%"
          dur="1s"
          repeatCount="indefinite"
        ></animate>
      </linearGradient>
    </defs>
    <ellipse cx="300" cy="140" rx="60" ry="40" fill="url(#grad)">
      <animate
        attributeName="rx"
        from="60"
        to="40"
        dur="1s"
        fill="freeze"
        repeatCount="indefinite"
      ></animate>
      <animate
        attributeName="ry"
        from="40"
        to="35"
        dur="1s"
        fill="freeze"
        repeatCount="indefinite"
      ></animate>
    </ellipse>
    <text style="fill: rgba(255,255,255,.4)" x="275" y="145">进场事件</text>
  </svg>
  <svg v-else :width="width" :height="height" :key="key_1">
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
import { event_animation, svgAnimationConfig } from 'project/animation/src/globle/event.js'
export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    current_event_obj: {
      type: Object,
      default(){
        return {};
      }
    }
  },
  components: {
  },
  data(){
    return {
      duration: '2s',
      repeatCount: '1', // 1 indefinite
      fill: 'freeze',
      svgPath: {},
      isShowDefaultSvg: true,
      key_1: false
    };
  },
  computed: {
    // 获取code
    current_event_code(){
      console.log('st this.current_event_obj', this.current_event_obj)
      return this.current_event_obj.eventCode;
    },
    // 获取动画配置
    animateParams(){
      const {homeSvgAnimationConfig, awaySvgAnimationConfig,svgAnimationDefaultConfig} = svgAnimationConfig
      if(Object.keys(this.current_event_obj).length){
        const {homeAway} = this.current_event_obj
        if(homeAway === 'home'){
          // 主场
          return homeSvgAnimationConfig;
        }
        if(homeAway === 'away'){
          // 客场
          return awaySvgAnimationConfig;
        }
        if(homeAway === 'none' || !homeAway){
          // 默认配置
        }
      }
      // this.isShowDefaultSvg = true
    },
    // 动画路径参数
    pathAnimateParams(){
      // return this.animateParams;
      const svg_path_config = this.animateParams
      const {pathAnimateParams} = svg_path_config || {}
      
      return pathAnimateParams || {};
    },
    pathAnimateColors(){
      return this.pathAnimateParams.colors || [];
    },
    textAnimateParams(){
      // return this.animateParams;
      const svg_path_config = this.animateParams
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
      const {homeAway} = this.current_event_obj
      this.isShowDefaultSvg = homeAway === 'none' || !homeAway
      console.log('st this.isShowDefaultSvg', this.isShowDefaultSvg)
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
      const svg_path_config = this.animateParams
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
      console.log('st animateParams', this.animateParams)
      const svg_path_config = this.animateParams
      if(!svg_path_config){
        this.isShowDefaultSvg = true
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