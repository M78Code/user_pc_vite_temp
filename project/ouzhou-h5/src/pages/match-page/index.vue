<!--
 * @Author: land land@itcom888.com
 * @Date: 2023-11-10 13:53:40
 * @LastEditors: land land@itcom888.com
 * @LastEditTime: 2023-11-11 15:02:01
 * @FilePath: \user-pc-vite\project\ouzhou-h5\src\pages\match-page\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
          <tab-date v-if="!isClickDetail"  @tabChange="onTabChange" @dateChange="onDateChange"/>
    <!-- 返回上一级 -->
    <div class="back" v-if="isClickDetail" @click="isClickDetail = false">
    </div>
    <!--二级赛事列表-->
    <div class="match-list-page">
      <match-container v-if="isClickDetail" />
      <MatchFirstStep v-else />
    </div>
</template>
<script setup>
import { ref } from "vue"
import tabDate from './tab-date/tab-date.vue';
import MatchFirstStep from "./match-first-step.vue";
import MatchContainer from "src/base-h5/components/match-list/index.vue";
//是否点击详情
const isClickDetail = ref(false)

const onTabChange = e => {
  console.log(e)
}

const onDateChange = e => {
  console.log(e)
}

</script>
<style scoped lang="scss">
/* ************** 赛事列表包装器 **************** -S */
.match-list-page {
  width: 100%;
  height: calc(100% - 2.1rem);
  overflow-y: hidden;
  position: relative;

  .match-list-container {
    height: 100%;
    background: #fff !important;

    :deep(.scroll-wrapper) {
      background: #fff !important;

      .s-w-item {
        background: #fff !important;
      }
    }
  }
}
</style>
