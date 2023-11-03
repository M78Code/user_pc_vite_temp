<!--
 * @Description: yazhou-h5 赛事列表组件
-->

<template>
 <div class="refresh-container">
    <!--列表页 -->
    <ScrollWrapper>
      <template v-slot="{ match_item, index }">
        <template v-if="match_item">
          <!--此data-mid用于分频订阅赛事,请勿修改-->
          <div class="data_mid"> 
            <!--冠军玩法-->
            <template v-if="is_kemp">
              <MatchContainerMainTemplate2
                :i="index" 
                :match_of_list="match_item">
              </MatchContainerMainTemplate2>
            </template>
            <!-- 真实体育玩法 -->
            <template v-else>
              <MatchContainerMainTemplate1
                :i="index"
                :match_of_list="match_item">
              </MatchContainerMainTemplate1>
            </template>
          </div>
        </template>
      </template>
    </ScrollWrapper>
  </div>
  
</template>
<script setup>

// yazhou-h5 赛事组件
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/yazhou/match-container-main-template1.vue"; 
// yazhou-h5 冠军组件
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/yazhou/match-container-main-template2.vue"; 
// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue'; 

import { is_kemp } from 'src/base-h5/mixin/menu.js'

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
