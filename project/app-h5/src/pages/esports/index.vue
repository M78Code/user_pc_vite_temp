<!--
 * app-h5  复刻版  -  电竞赛事
-->
<template>
  <ObserverWrapper :match_list="matchs_data"></ObserverWrapper>
</template>
 
<script setup>
import { onMounted, computed, ref } from 'vue';
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';


const matchs_data = ref([])

onMounted(() => {
  get_esports_match()
})

const get_esports_match = async () => {
  matchs_data.value = await MatchMeta.get_esports_match()
  console.log( matchs_data.value )
}

</script>
 
<style scoped lang="scss">
 .standard-img{
    height: 100%;
    width: 100%;
  }
</style>