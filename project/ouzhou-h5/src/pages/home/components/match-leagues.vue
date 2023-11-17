<!--
* @Description: 四大联赛
-->
<template>
    <div style="display: none;">{{ MatchDataBaseFiveLeagueH5.data_version.version }}</div>
    <section class="match-play-page">
      <div class="match-item" v-for="item, index in fiveLeagues_Matches" :key="item.mid">
       <template v-if="item">
         <MatchContainerMainTemplate1
          :i="index"
          :match_of_list="item">
        </MatchContainerMainTemplate1>
       </template>
      </div>
    </section>
  </template>
   
<script setup>
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MenuData,  MatchDataWarehouse_ouzhou_PC_five_league_List_Common as MatchDataBaseFiveLeagueH5} from "src/core/index.js";
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 

import { onMounted } from "vue"

const props = defineProps({
    fiveLeagues_Matches: {
    type: Array,
    default: () => []
  }
})
</script>
   
<style scoped lang="scss">
  .match-play-page{
    :deep(.match-header){
      display: none;
    }
  }
</style>