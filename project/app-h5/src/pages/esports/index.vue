<!--
 * app-h5  复刻版  -  电竞赛事
-->
<template>
  <ObserverWrapper :match_list="MatchMeta.complete_matchs">
    <!-- 内容区 -->
    <template v-slot:content="{ item, index }">
      <template v-if="is_show_match_item(index)">
        <ObserverItem :index="index" :item="item"></ObserverItem>
      </template>
    </template>
  </ObserverWrapper>
</template>
 
<script setup>
import { onMounted, computed } from 'vue';
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';
import ObserverItem from 'src/base-h5/components/observer-wrapper/observer-item.vue'
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';

const defer_render = use_defer_render()

onMounted(() => {
  MatchMeta.get_esports_match()
})

const is_show_match_item = computed(() => {
  return (index) => {
    return defer_render(index)
  }
})

</script>
 
<style scoped lang="scss">
 .standard-img{
    height: 100%;
    width: 100%;
  }
</style>