<template>
  <div class="loading_wrap">
    <div class="loading_box">
      <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/gif/loading1.gif`" alt="">
      <div>
        {{ i18n_t('common.loading')}}
      </div>
    </div>
  </div>
</template>

<script setup>
import { LOCAL_PROJECT_FILE_PREFIX, i18n_t } from "src/output/index.js";
</script>

<style lang="scss">
  .loading_wrap {
    width: 100%;
    height: 100%;
    padding-right: 7px;
    box-sizing: border-box;
  }
  .loading_box {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding-top: 200px;
    background: var(--q-gb-bg-c-4);
    box-sizing: border-box;
    img {
      width: 60px;
      height: 60px;
    }
    div {
      font-family: Roboto;
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      color: var(--q-gb-t-c-5);
    }
  }

</style>