<template>
  <div class="injury-situation football_standings recent_record">
    <div class="title">
      {{ i18n_t('analysis_football_matches.Injury_situation') }}
    </div>

    <template v-for="(item, index) in injury_situation_data" :key="index">
      <div class="technical-home team-recent" >
        <template v-if="index == 1">
          <!-- 左侧双打图标 type 0 表示主队,mhlu 主队的url -->
          <team-img :type="0" :csid="lodash.get(detail_data, 'csid')" :url="lodash.get(detail_data, 'mhlu[0]')" :fr="lodash.get(detail_data, 'frmhn[0]')" :size="22"></team-img>
          <team-img v-if="lodash.get(detail_data, 'mhlu.length') > 1" :type="0" :csid="lodash.get(detail_data, 'csid')" :url="lodash.get(detail_data, 'mhlu[1]')" :fr="lodash.get(detail_data, 'frmhn[1]')" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ lodash.get(detail_data, 'mhn') }}</span>
        </template>
        <template v-if="index == 2">
          <!-- 右侧双打图标 type 1 表示客队,malu 客队的url  -->
          <team-img :type="1" :csid="lodash.get(detail_data, 'csid')" :url="lodash.get(detail_data, 'malu[0]')" :fr="lodash.get(detail_data, 'frman[0]')" :size="22"></team-img>
          <team-img v-if="lodash.get(detail_data, 'malu.length') > 1" :type="1" :csid="lodash.get(detail_data, 'csid')" :url="lodash.get(detail_data, 'malu[1]')" :fr="lodash.get(detail_data, 'frman[1]')" :size="22" style="margin-top: 0.11rem; margin-left:-0.08rem;"></team-img>
          <span class="team-name">{{ detail_data.man }}</span>
        </template>
      </div>
      <injury-form :list_data="item"/>
    </template>
    <!-- 没有数据 组件 -->
    <div v-if="!Object.keys(injury_situation_data).length" class="no-list">{{ i18n_t('common.no_data') }}</div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
// 详情页蓝色背景上的大型字母图标
import teamImg from "src/base-h5/components/details/team-img.vue";
 // 伤停情况列表
import injuryForm from "src/base-h5/components/details/analysis-matches/components/injury-form.vue";
import lodash from "lodash"
import { i18n_t } from "src/boot/i18n.js";
 
  const props = defineProps({
    // 伤停情况的数据
    injury_situation_data: {
      type: Object,
      default: () => {},
    },
    // 详情页的数据
    detail_data: {
      type: Object,
      default: () => {},
    }
  })
</script>

<style lang="scss" scoped>
.injury-situation {
  margin-top: 0.1rem;
  // background-color: var(--q-analysis-bg-color-1);
  .title {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.24rem;
    font-size: 0.14rem;
    letter-spacing: 0;
    font-weight: bold;
    position: relative;
    color: var(--q-analysis-text-color-20);
    // color: var(--q-analysis-text-color-15);
    border-bottom: 1px solid var(--q-analysis-bd-color-3);
    // background-color: var(--q-analysis-bg-color-1);
    &:before {
      content: '';
      width: 0.03rem;
      height: 0.12rem;
      position: absolute;
      left: 0.16rem;
      top: 0.14rem;
      border-radius: 1.5px;
      background: var(--q-analysis-text-color-16);
    }
  }

  .technical-home {
    height: 0.4rem;

    display: flex;
    align-items: center;
    padding-left: 0.1rem;

    :deep(.team-img) {
      width: 0.2rem;
      height: 0.2rem;
      margin: 0.05rem;

      img {
        width: 0.2rem;
        height: 0.2rem;
        position: relative;
        border-radius: 50%;
      }
    }

    .team-name {
      font-size: 0.12rem;
      color: var(--q-gb-t-c-4);
      font-weight: bold;
      line-height: 0.12rem;
    }
  }

  .no-list {
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    padding-top: 0.05rem !important;
    font-size: 12px;
    background-color: var(--q-analysis-bg-color-1);
    color: var(--q-analysis-text-color-14);
  }
}
</style>