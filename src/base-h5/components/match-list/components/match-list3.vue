<!--
 * @Description: ouzhou-h5 赛事列表组件
-->

<template>
 <div class="refresh-container">
    <!--列表页 -->
    <ScrollWrapper>
      <template v-slot="{ match_item, index }">
        <template v-if="match_item">
          <div class="data_mid"> <!--此data-mid用于分频订阅赛事,请勿修改-->
            <MatchContainerMainTemplate1
              :i="index"
              :match_of_list="match_item">
            </MatchContainerMainTemplate1>
          </div>
        </template>
      </template>
    </ScrollWrapper>
  </div>
  
</template>
<script setup>

// ouzhou-h5 赛事组件
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template1.vue"; 

// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue'; 

import { is_kemp } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'

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
