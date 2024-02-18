<!-- @Description: 简单页面头部  体育规则，公告页面使用到 -->
<template>
  <div class="header">
      <div class="go-back" @click="go_back"></div>
      <span class="title">
          <slot />
      </span>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()

/** 返回上一级 */
const go_back = () => {
  // TODO: $common
  $common.go_where({ back_to: 'go_back_from_notice', route_name: route.path.split('/')[2] })
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  padding-left: 0.15rem;
  padding-top: 0.01rem;
  position: relative;
  height: 0.44rem;

  .go-back {
      display: block;
      width: 0.12rem;
      height: 0.2rem;

      background-size: 100% 100%;
  }

  .title {

      font-size: 0.16rem;

      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
  }
}
</style>
