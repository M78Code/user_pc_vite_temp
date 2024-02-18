<!--
 * @Author:
 * @Date:
 * @Description: 详情页  足球赛事分析 战绩 模块里边的 公共列表
-->
<template>
  <div class="public_form">
    <!-- 头部 -->
    <div class="header">
      <div class="col1">{{i18n_t('analysis_football_matches.player')}}</div>
      <div class="col2">{{i18n_t('analysis_football_matches.position')}}</div>
      <div class="col3">{{ i18n_t('analysis_football_matches.reason') }}</div>
    </div>
    <!-- 主内容 -->
    <template v-if="lodash.get(list_data, 'length', 0) > 0">
      <div class="team-item" v-for="(item, i) in list_data" :key="i">
        <div class="col1">{{item.playerName}}</div>
        <div class="col2">{{item.positionName}}</div>
        <div class="col3">{{item.reason}}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { i18n_t } from "src/boot/i18n.js";;
import lodash from "lodash"
//国际化

  const props = defineProps({
    list_data: {
      type: Array,
      default: () => [],
    }
  })
</script>

<style lang="scss" scoped>
// 头部
.public_form {
  position: relative;

  .header {
    height: 0.3rem;
    display: flex;
    text-align: left;
    line-height: 0.32rem;
    padding: 0 0.1rem;
    color:var(--q-analysis-text-color-14);

    .col1 {
      padding-left: 0.25rem;
    }

    > div {

      font-size: 0.1rem;
    }

    .sort-flag {
      width: 0.09rem;
    }
  }

  .team-item {
    display: flex;
    align-items: center;
    padding: 0 0.1rem;
    font-size: 0.13rem;
    height: 0.48rem;
    text-align: left;
    color:var(--q-analysis-text-color-20);

    &:nth-child(odd) {

    }

    div {
      font-size: 0.12rem;
    }
  }

  .col1 {
    flex: 0 0 1.5rem;
  }

  .col2 {
    flex: 0 0 0.6rem;
  }

  .col3 {
    flex: 1;
  }
}
</style>
