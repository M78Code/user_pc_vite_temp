<!--
 * @Author: cooper
 * @Date: 2023-08-08 17:13:55
 * @Description:  赛事详情公用操作vue组件
-->
<template>
  <div class="detials_layout" style="width: 100%; height: 1180px">
    <detailsMain :key="key"></detailsMain>
  </div>
</template>

<script setup>
import detailsMain from "./match-details.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const key = computed(() => {
  return route.params.mid + "_" + route.params.csid;
});
</script>
