<!--
* @Description: 四大联赛
-->

<template>
    <div class="match_leagues_page">
        {{ fiveLeagues_Matches }}
    </div>
</template>
   
<script setup>
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { onMounted } from "vue"

const props = defineProps({
    fiveLeagues_Matches: {
    type: Array,
    default: () => []
  }
})


// onMounted(() => {
//     MatchMeta.get_four_leagues_list()
// })
</script>
   
<style scoped lang="scss"></style>