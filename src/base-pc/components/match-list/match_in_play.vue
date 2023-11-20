<template>
  <!-- 滚球标题 -->
  <div :class="['in-play text-left yb-flex-between']">
    <div>
      {{ $t('menu.match_play') }}
    </div>
    <!-- 赛事数量 -->
    <span class="match-number">{{ match_count }} ></span>
  </div>
</template>

<script setup>
 defineProps({
  match_count: {
      type: [ Number ],
      default: () => 0,
    },
  });
</script>

<style lang="scss" scoped>
.in-play {
  font-weight: 500;
  color: #1A1A1A;
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