<!--
 * @Author: ledron
 * @Date: 2021-01-13 11:34:53
 * @Description: 赛果详情 底部图标说明
-->
<template>
  <div class="results_footer">
    <div v-for="(item, index) in footer_list" :key="index">
      <i :class="`s${index}`"></i>
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup>

import { ref } from "vue"

let footer_list = ref([
  {text: i18n_t('match_result.yellow_card')},
  {text: i18n_t('match_result.red_card')},
  {text: i18n_t('match_result.corner_kick')},
  {text: i18n_t('match_result.substitution')},
  {text: i18n_t('match_result.goal')},
  {text: i18n_t('match_result.penalty_kick')},
  {text: i18n_t('match_result.penalty_missed')},
  {text: i18n_t('match_result.own_goals')}
])
</script>

<style lang="scss" scoped>
.results_footer {
  margin-top: 0.16rem;


  height: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;

  > div {
    display: flex;
    align-items: center;
    margin-right: 0.08rem;

    i {
      --per: -0.2rem;
      background: var(--q-color-com-img-bg-137) no-repeat 0 0 / 0.1rem 1.6rem;
      margin-right: 0.032rem;
      width: 0.1rem;
      height: 0.1rem;
      display: inline-block;
    }

    .s1 {
      background-position-y: calc(var(--per) * 1);
    }

    .s2 {
      background-position-y: calc(var(--per) * 7);
    }

    .s3 {
      background-position-y: calc(var(--per) * 5);
    }

    .s4 {
      background-position-y: calc(var(--per) * 6);
    }

    .s5 {
      background-position-y: calc(var(--per) * 2);
    }

    .s6 {
      background-position-y: calc(var(--per) * 3);
    }

    .s7 {
      background-position-y: calc(var(--per) * 4);
    }

    span {

      font-size: 0.09rem;

      letter-spacing: 0;
      line-height: 0.1rem;
      min-width: fit-content;
    }
  }
}
</style>
