<template>
  <svg width="800" height="967">
    <!--          <path :d="rightPath()" fill="blue">-->
    <path :d="rightPath().path" fill="rgba(0,0,0,.3)">
      <animate
        attributeName="d"
        :values="rightPath().values"
        :dur="duration"
        :repeatCount="repeatCount"
        :fill="fill"
      ></animate>
    </path>
  </svg>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
  },
  data(){
    return {
      duration: '2s',
      repeatCount: '1', // 1 indefinite
      fill: 'freeze',
    };
  },
  methods: {
    createPath(move = 0){
      const defaultObj = {
        x: 660,
        y: 95
      }
      const o = {
        x: 500,
        y: 95,
      }
      const {x,y} = o
      // return `M 0 0 L 20 0 L 30 10 L 20 20 L 30 30 L 20 40 L 0 40 L 0 0 Z`;
      const path = `
      M ${defaultObj.x} ${defaultObj.y}
      L ${x} ${y}
      
      L ${x + move+130} ${y}
      L ${x + move+70} ${y+20}
      
      L ${x + move+110} ${y+40}
      L ${x + move+50} ${y+60}
      
      L ${x + move+120} ${y+80}
      L ${x + move+45} ${y+95}
      
      L ${x + move+125} ${y+120}
      L ${x + move+35} ${y+130}
      
      L ${x + move+125} ${y+165}
      L ${x + move+15} ${y+175}
      
      L ${x + move+100} ${y+210}
      L ${defaultObj.x + 130} ${y + 210}
      Z`
      return path;
    },
    rightPath(){
      const path = this.createPath()
      return {
        path: this.createPath(),
        values: `${path};${this.createPath(-400)}`,
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