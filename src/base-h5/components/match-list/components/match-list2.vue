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
            <template v-if="standard_edition === 2">
              <!-- 冠军玩法 -->
              <template v-if="is_kemp">
                <MatchContainerMainTemplate2
                  :i="index"
                  :match_of_list="match_item">
                </MatchContainerMainTemplate2>
              </template>
              <!-- 赛果玩法 -->
              <template v-else-if="is_results">
                <!-- 赛果详情精选赛事 -->
                <template v-if="route.name == 'match_result'">
                  <MatchContainerMainTemplate7
                    :i="index"
                    :match_of_list="match_item">
                  </MatchContainerMainTemplate7>
                </template>
                <template v-else>
                  <MatchContainerMainTemplate3
                    :i="index"
                    :match_of_list="match_item">
                  </MatchContainerMainTemplate3>
                </template>
              </template>
              <!-- 赛果玩法 -->
              <!-- <template v-else-if="is_kemp">
                <MatchContainerMainTemplate6
                  :i="index"
                  :match_of_list="match_item">
                </MatchContainerMainTemplate6>
              </template> -->
              <!-- 真实体育玩法 -->
              <template v-else>
                <MatchContainerMainTemplate1
                  :i="index"
                  :match_of_list="match_item">
                </MatchContainerMainTemplate1>
              </template>
            </template>
            <!-- 新手版 -->
            <template v-else>
              <MatchContainerMainTemplate5
                :i="index"
                :match_of_list="match_item">
              </MatchContainerMainTemplate5>
            </template>
          </div>
        </template>
      </template>
    </ScrollWrapper>
  </div>
  
</template>
<script setup>

// app-h5 赛事组件
import MatchContainerMainTemplate1 from "src/base-h5/components/match-container/template/app/match-container-main-template1.vue"; 
// app-h5 冠军组件
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/app/match-container-main-template2.vue"; 
// app-h5 赛果
import MatchContainerMainTemplate3 from "src/base-h5/components/match-container/template/app/match-container-main-template3.vue"; 
// app-h5 新手版
import MatchContainerMainTemplate5 from "src/base-h5/components/match-container/template/app/match-container-main-template5.vue"; 
// app-h5 冠军赛果
import MatchContainerMainTemplate6 from "src/base-h5/components/match-container/template/app/match-container-main-template6.vue"; 
// app-h5 赛果精选列表
import MatchContainerMainTemplate7 from "src/base-h5/components/match-container/template/app/match-container-main-template7.vue"; 

// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue'; 

import { is_kemp, is_results } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import { useRoute } from "vue-router";
const route = useRoute()
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
