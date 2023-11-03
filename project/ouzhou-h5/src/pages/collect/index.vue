<template>
  <div class="collect-wap">
      <TopHeader :title="i18n_t('menu_itme_name.esports')">
        <template #right>
            <div>111</div>
        </template>
      </TopHeader>
  </div>
</template>
<script setup>
import { TopHeader } from 'src/base-h5/components/menu/ouzhou-h5-menu/index'
import { i18n_t } from "src/core/index.js"
</script>
<style scoped lang="scss">
    .collect-wap{
      width: 100%;
      height: 100%;
    }
</style>