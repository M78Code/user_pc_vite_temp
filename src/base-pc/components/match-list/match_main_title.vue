<template>
  <!-- 滚球标题 -->
  <div :class="['match-main-title text-left yb-flex-between']">
    <div>
      {{ title }}
    </div>
    <!-- 赛事数量 -->
    <!-- 先隐藏了 -->
    <!-- <span class="match-number">{{ match_count }} ></span> -->
  </div>
</template>

<script setup>
 defineProps({
  match_count: {
      type: [ Number ],
      default: () => 0,
    },
    title: {
      type: [ String ],
      default: () => '',
    }
  });
</script>

<style lang="scss" scoped>
.match-main-title {
  font-weight: 500;
  color: var(--q-gb-t-c-5);
  font-size: 18px;
  margin-bottom: 10px;
  margin-top: 24px;
  >span {
    font-size: 13px;
    font-weight: 400;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>