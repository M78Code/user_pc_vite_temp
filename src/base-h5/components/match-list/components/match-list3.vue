<!--
 * @Description: ouzhou-h5 赛事列表组件
-->

<template>
  <template v-if="is_results">
    <BaseVirtualList :dataList="matchs_data">
      <template #default="{ item, index }">
        <MatchContainerMainTemplate3
          :i="index"
          :match_of_list="item">
        </MatchContainerMainTemplate3>
      </template>
    </BaseVirtualList>
  </template>
  <template v-else>
    <!--列表页 -->
    <div class="refresh-container">
      <ScrollWrapper>
        <template v-slot="{ match_item, index }">
          <div class="data_mid" v-if="match_item"> <!--此data-mid用于分频订阅赛事,请勿修改-->
            <template v-if="is_kemp">
              <MatchContainerMainTemplate2
                :i="index"
                :match_of_list="match_item">
              </MatchContainerMainTemplate2>
            </template>
            <template v-else>
              <MatchContainerMainTemplate1
                :i="index"
                :match_of_list="match_item">
              </MatchContainerMainTemplate1>
            </template>
          </div>
        </template>
      </ScrollWrapper>
    </div>
  </template>
</template>
<script setup>

import { computed } from 'vue'

// ouzhou-h5 赛事组件
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 
import MatchContainerMainTemplate3 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template3.vue"; 
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template2.vue"; 

// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue'; 
// 赛果赛事滚动容器
import { BaseVirtualList } from 'src/base-h5/components/base-virtual-list'

import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';

import { is_kemp, is_results } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'


const matchs_data = computed(() => {
  return MatchMeta.current_matchs
})

</script>
 
<style scoped lang="scss">
@import "../styles//match-list";
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}
</style>
