<!--
* @Description: 四大联赛
-->

<template>
    <div class="match_leagues_page">
        <match-container />
    </div>
</template>
   
<script setup>
import MatchContainer from "src/base-h5/components/match-list/index.vue";
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { onMounted } from "vue"

onMounted(() => {
    MatchMeta.get_four_leagues_list()
})
</script>
   
<style scoped lang="scss"></style>