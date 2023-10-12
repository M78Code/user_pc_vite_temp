<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页背景上的队伍名称
-->
<template>
  <div class='team-name'>
    <!-- 队伍名 -->
    <div class="ellipsis-2-lines main-text" :style="inline_style">{{name}}</div>
  </div>
</template>

<script>
export default {
  name: 'team_name',
  data(){
    return {
      // 队伍名称样式
      inline_style: ''
    }
  },
  props: {
    name:{
      type:String,
      default: ''
    },
    type:{
      type:Number,
    }
  },
  created(){
    initEvent();
  },
  // 获取props里面的type 参数 0 || 1
  methods: {
    initEvent(){
      const style_array = [{'float':'left','margin-left': '0.2rem'},{'float':'right','margin-right': '0.2rem'}]
      inline_style = style_array[type];
    }
  }
}
</script>

<style lang="scss" scoped>
.team-name {
  width: 100%;
  height: 0.5rem;
  margin-top: 0.13rem;
}

.main-text {
  box-sizing: content-box;
  height: 0.4rem;
  line-height: 0.2rem;
  font-size: 0.14rem;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
  margin: 0 auto;
  width: 0.9rem;
}
</style>
