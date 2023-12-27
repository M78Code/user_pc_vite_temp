<!--
 * @Author: Cronus
 * @Date: 2021-02-07 13:59:21
 * @Description: 详情页精选赛事列表
-->
<template>
<div class="choose-carefully-wrapper" :style="{height:container_height=='auto'?'auto':`${container_height}px`}">
  <template v-if="match_list.length > 0">
    <div v-for="(item, index) in match_list" :index="index" :key="item.mid" :class="['s-w-item']">
      <div class="s-w-i-inner" v-if="item">
        <MatchContainerMainTemplate7
          :i="index"
          :match_of_list="get_match_item(item)">
        </MatchContainerMainTemplate7>
      </div>
    </div>
  </template>
</div>
</template>

<script>
// import common from "src/project/mixins/constant/module/common.js"
import match_main from "src/base-h5/components/match-list/index.vue"
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import { defineComponent, onMounted, ref } from "vue";
import { rem } from "src/output/index.js";
import PageSourceData from "src/core/page-source/page-source.js";
// app-h5 赛果精选列表
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/output/index.js"
import MatchContainerMainTemplate7 from "src/base-h5/components/match-container/template/app/match-container-main-template7.vue";
export default defineComponent({
  // mixins:[common],
  props:{
    invoke:String
  },
  components:{
    "match-main":match_main,
    MatchContainerMainTemplate7,
  },
  setup(props, even) {
    const container_height = ref(0)
    const match_list = ref([])
    onMounted(async () => {
      PageSourceData.set_page_source("match_result");
      match_list.value = await MatchMeta.get_details_result_match()
      if(props.invoke == 'category'){
        container_height.value = 'auto';
      } else{
        container_height.value = innerHeight - rem(1.68);
      }
    })
    const get_match_item = (item) => {
      return MatchDataBaseH5.get_quick_mid_obj(item.mid) || item
    }
    return {
      container_height, get_match_item, match_list
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
  background-color: var(--q-gb-bg-c-21);
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