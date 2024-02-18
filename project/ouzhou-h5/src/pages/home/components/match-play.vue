<!--
* @Description: 首页 in-play 赛事
-->

<template>
  <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div>
  <section class="match-play-page">
    <div class="match-item" v-for="item, index in play_matchs" :key="item.mid">
     <template v-if="item && defer_render(index)">
       <MatchContainerMainTemplate1
        :i="index"
        :match_of_list="item">
      </MatchContainerMainTemplate1>
     </template>
    </div>
  </section>
</template>
 
<script setup>

// ouzhou-h5 赛事组件
import { onMounted } from "vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/output/index.js";
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 


const defer_render = use_defer_render()
const props = defineProps({
  play_matchs: {
    type: Array,
    default: () => []
  }
})

</script>
 
<style scoped lang="scss">
.match-play-page{
  // height: 100%;
  .match-item{
    
    // 因BUG:54324注释该样式
    // content-visibility: auto;
  }
}
</style>