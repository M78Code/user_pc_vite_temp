<!--
 * @Description: app-h5 新手版赛事组件 临时处理，后续全部替换完  会在 match-list2.vue  组件里
-->

<template>
  <ObserverWrapper :match_list="MatchMeta.complete_matchs" com_type="app-h5-new"></ObserverWrapper>
</template>
 
<script setup>

import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';

</script>
 
<style scoped lang="scss">
 
</style>