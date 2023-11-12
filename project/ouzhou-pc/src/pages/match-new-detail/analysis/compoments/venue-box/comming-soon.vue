<!--
 * @Author: cooper
 * @Date: 
 * @Description: 右侧赛事分析 即将开赛，中场组件
-->
<template>
  <div class="main">
    <div class="content">
        <div>
            <span>{{ detail_info.mhn }}</span>
        </div>
        <div>
           Soon
        </div>
        <div>
            <span>{{ detail_info.man }}</span>
        </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { LOCAL_PROJECT_FILE_PREFIX } from "src/core/index.js";
import lodash_ from "lodash";

const animal = `${LOCAL_PROJECT_FILE_PREFIX}/image/png/video/animal.png`;

const props = defineProps({
  detail_info: {
    // 赛事详情
    type: Object,
    default: () => {},
  },
});

watch(
  () => props.detail_info,
  (val) => {}
);
</script>

<style lang="scss" scoped>
.main {
  background-image: url($SCSSPROJECTPATH + "/image/png/football.png");
  height: 190px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    padding: 0 16px;
    max-width: 700px;
    width: 85%;
    min-width: 330px;
    height: 130px;
    border-radius: 4px;
    background-color: rgba(38, 41, 49, 0.8);
    box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.3);
    font-size: 14px;
    display: flex;
  
  align-items: center;
  justify-content: space-around;
  color:#ffffff
  }
}
</style>
