<template>
  <ObserverWrapper :match_list="MatchMeta.complete_matchs">
    <!-- 内容区 -->
    <template v-slot:content="{ item, index }">
      <template v-if="is_show_match_item(index)">
        <MatchItem
          :index="index"
          :item="item">
        </MatchItem>
      </template>
    </template>
  </ObserverWrapper>
</template>
 
<script setup>
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchItem from "./test-item.vue"; 
import ObserverWrapper from 'src/base-h5/components/observer-wrapper/index.vue';
import { onMounted, computed, watch, ref } from 'vue';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';

const defer_render = use_defer_render()

onMounted(() => {
  MatchMeta.set_origin_match_data()
})

/**
 * @description 通过计算属性实现， 会带缓存
 */
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