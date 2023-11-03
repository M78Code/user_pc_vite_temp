<!--
 * @Description: app-h5 赛事列表组件
-->

<template>
 <div class="refresh-container">
    <!--列表页 -->
    <ScrollWrapper>
      <template v-slot="{ match_item, index }">
        <template v-if="match_item">
          <div class="data_mid"> <!--此data-mid用于分频订阅赛事,请勿修改-->
            <!-- 专业版 -->
            <template v-if="true">
              <!--冠军玩法-->
              <template v-if="is_kemp">
                <MatchContainerMainTemplate4
                  :i="index" 
                  :match_of_list="match_item">
                </MatchContainerMainTemplate4>
              </template>
              <!--app-h5 真实体育玩法 -->
              <template v-else>
                <MatchContainerMainTemplate2
                  :i="index"
                  :match_of_list="match_item">
                </MatchContainerMainTemplate2>
              </template>
            </template>
            <!-- 新手版 -->
            <template v-else>
              <MatchContainerMainTemplate8
                :i="index"
                :match_of_list="match_item">
              </MatchContainerMainTemplate8>
            </template>
          </div>
        </template>
      </template>
    </ScrollWrapper>
  </div>
  
</template>
<script setup>

// app-h5 赛事组件
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/main/match-container-main-template2.vue"; 
// app-h5 冠军组件
import MatchContainerMainTemplate4 from "src/base-h5/components/match-container/main/match-container-main-template4.vue"; 
// app-h5 新手版
import MatchContainerMainTemplate8 from "src/base-h5/components/match-container/main/match-container-main-template8.vue"; 

// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue'; 

import { is_kemp } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import { watch } from "vue";

watch(() => standard_edition.value, () => {
  console.log(1111)
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
