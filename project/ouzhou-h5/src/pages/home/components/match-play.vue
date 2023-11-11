<!--
* @Description: 首页 in-play 赛事
-->

<template>
  <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div>
  <section class="match-play-page">
    <div class="match-item" v-for="mid, index in MatchMeta.match_mids" :key="mid">
     <template v-if="get_match_item(mid)">
       <MatchContainerMainTemplate1
        :i="index"
        :match_of_list="get_match_item(mid)">
      </MatchContainerMainTemplate1>
     </template>
    </div>
  </section>
</template>
 
<script setup>

// ouzhou-h5 赛事组件
import { onMounted } from "vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/index.js";
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 

const get_match_item = (mid) => {
  return MatchDataBaseH5.get_quick_mid_obj(mid)
}

</script>
 
<style scoped lang="scss">
.match-play-page{
  // height: 100%;
}
</style>
