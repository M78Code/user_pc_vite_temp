<!--
* @Description: 五大联赛
-->
<template>
    <div style="display: none;">{{ MatchDataBaseFiveLeagueH5.data_version.version }}</div>
    <section class="match-play-page">
      <div class="match-item" v-for="item, index in five_league_match" :key="item.mid">
       <template v-if="item && defer_render(index)">
         <MatchContainerMainTemplate1
          :i="index"
          :match_of_list="get_match_item(item.mid)">
        </MatchContainerMainTemplate1>
       </template>
      </div>
    </section>
  </template>
   
<script setup>
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import { MenuData,  MatchDataWarehouse_ouzhou_PC_five_league_List_Common as MatchDataBaseFiveLeagueH5, 
  MatchDataWarehouse_H5_List_Common as MatchDataBaseH5} from "src/output/index.js";
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 

const defer_render = use_defer_render()
const props = defineProps({
    five_league_match: {
    type: Array,
    default: () => []
  }
})

const get_match_item = (mid) => {
  return MatchDataBaseFiveLeagueH5.get_quick_mid_obj(mid)
}

</script>
   
<style scoped lang="scss">
  .match-play-page{
    :deep(.match-header){
      display: none;
    }
  }
</style>