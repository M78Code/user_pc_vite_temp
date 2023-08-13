<!--
 * @Author: Cronus
 * @Date: 2021-02-07 13:59:21
 * @Description: 详情页精选赛事列表
-->
<template>
<div class="choose-carefully-wrapper" :style="{height:container_height=='auto'?'auto':`${container_height}px`}">
  <!-- <match-main :class="invoke?invoke:''" invok_source="detail_match_list" /> -->
</div>
</template>

<script>
import common from "src/project/mixins/constant/module/common.js"
// import match_main from "src/project/pages/match-list/match_main.vue"

export default {
  mixins:[common],
  props:{
    invoke:String
  },
  data(){
    return {
      container_height:0
    }
  },
  mounted(){
    if(this.invoke == 'category'){
      this.container_height = 'auto';
    }
    else{
      this.container_height = innerHeight - this.rem(1.68);
    }
  },
  components:{
    // "match-main":match_main,
  }
}
</script>
<style lang="scss" scoped>
.choose-carefully-wrapper {
  width: 100%;
  border-top: 1px solid transparent;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>