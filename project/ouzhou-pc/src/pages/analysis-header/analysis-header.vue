<!--
 * @Author: 
 * @Date: 2021-11-03 13:44:42
 * @Description: 足篮赛事分析页
 * @Path: 
-->
<template>
  <div class="analysis">
    <!-- 赛事分析 -->
    <simple-header
      ><span>{{ i18n_t("common.analysis") }}</span></simple-header
    >

    <analysis-page v-if="match_data" :get_active_detail = "match_data"/>
  </div>
</template>

<script setup>
import simpleHeader from "src/base-pc/components/site-header/simple-header.vue";
   import analysisPage from "./analysis/index.vue";
import { onMounted, nextTick, ref } from "vue";
import { MITT_TYPES, useMittEmit } from "src/core/mitt/index.js";
import { useRoute } from "vue-router";
import { UserCtr } from "src/output/index.js";
import { api_details } from "src/api/index.js";

const route = useRoute();
const match_data = ref(null);

const mid = ref(""); // 赛事mid

// 从网络获取数据
const get_match_details_net = () => {
  let params = { mid: route.params.mid, cuid: UserCtr.get_uid() };
  // 调用接口获取赛事数据
  api_details.get_match_detail_MatchInfo(params).then((res) => {
    let code = lodash.get(res, "code");
    if (code == 200) {
      match_data.value = res.data;
      mid.value = res.data.mid;
    }
  });
};

onMounted(() => {

  if (Object.keys(route.params).length) {
    // 从url中获取mid

    mid.value = route.params.mid;
  }
  // 获取赛事数据
  get_match_details_net();

  nextTick(() => {
    // 隐藏loading动画
    useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD, 0);
  });
});
</script>

<style lang="scss" scoped>
.analysis {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 1000px;
  width: 100vw;
}
</style>
