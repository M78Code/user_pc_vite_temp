<!--
 * @Author:
 * @Date:
 * @Description: 投注记录页无数据时展示去投注的界面
-->
<template>
  <div class="settle-void" @touchmove.prevent>
    <!-- <div class="img-s" :style="compute_css_obj('no-record')"></div> -->
    <img src="/public/app-h5/image/bet/no-data.png">
    <template>
      <p v-if="main_item == 0">您暂无未结算数据</p>
      <p v-else-if="main_item == 1">您暂无预约中数据</p>
      <p v-else-if="main_item == 2">您暂无已失效数据</p>
      <p v-else="main_item == 0">您暂无已结算数据</p>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  main_item: {
    type: [String, Number],
  }
})
</script>

<style lang="scss" scoped>
template {
  display: block;
}
.settle-void {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 4rem;
  border-radius: 0.1rem;
  background-color: var(--q-gb-bg-c-15);
  img {
    width: 1.8rem;
    height: 1.8rem;
  }
  p {
    color: var(--q-gb-bg-c-6);
    font-size: 0.14rem;
  }
}

</style>
