<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-10 16:16:46
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-10 17:00:35
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match\match-list\match-list-ouzhou.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
                                    <!-- <template v-if="is_results">
                                        <MatchContainerMainTemplate3 :i="index" :match_of_list="match_item">
                                        </MatchContainerMainTemplate3>
                                    </template>
                                    <template v-else>
                                        <MatchContainerMainTemplate1 :i="index" :match_of_list="match_item">
                                        </MatchContainerMainTemplate1>
                                    </template> -->
                                    <MatchContainerMainTemplate2  :i="index" :match_of_list="match_item"/>
                                </div>
                            </template>
                        </template>
                    </ScrollWrapper>
                </div>
</template>
<script setup>

// ouzhou-h5 赛事组件
import MatchContainerMainTemplate2 from "src/base-h5/components/match-container/template/ouzhou/match-container-main-template2.vue";


// 赛事滚动组件
import ScrollWrapper from 'src/base-h5/components/scroll-wraper/scroll-wrapper.vue';


</script>
    
<style scoped lang="scss">
@import "src/base-h5/components/match-list/styles/match-list.scss";

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
   