<!--
 * @Author: Cronus
 * @Date: 2021-02-07 13:59:21
 * @Description: 详情页精选赛事列表
-->
<template>
<div class="choose-carefully-wrapper" :style="{height:container_height=='auto'?'auto':`${container_height}px`}">
  <match-main :class="invoke?invoke:''" invok_source="detail_match_list" />
</div>
</template>

<script>
// import common from "src/project/mixins/constant/module/common.js"
import match_main from "src/base-h5/components/match-list/index.vue"
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { defineComponent, onMounted, ref } from "vue";
import { rem } from "src/output/index.js";
import PageSourceData from "src/core/page-source/page-source.js";
export default defineComponent({
  // mixins:[common],
  props:{
    invoke:String
  },
  components:{
    "match-main":match_main,
  },
  setup(props, even) {
    const container_height = ref(0)
    onMounted(() => {
      PageSourceData.set_page_source("match_result");
      MatchMeta.get_details_result_match()
      if(props.invoke == 'category'){
      container_height.value = 'auto';
    }
    else{
      container_height.value = innerHeight - rem(1.68);
    }
    })
    return {
      container_height,
    }
  }
  
})
</script>
<style lang="scss" scoped>
.choose-carefully-wrapper {
  width: 100%;
  border-top: 1px solid transparent;
  overflow-x: hidden;
  overflow-y: auto;
  height:100%;

  :deep(.scroll-wrapper .scroll-i-con .s-w-item){
    position:relative !important;
    margin: 5px;
    width: auto !important;
    background: none !important;
   .match-content {
    border-radius:8px !important;
 }
  }
}
</style>