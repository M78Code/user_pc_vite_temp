<template>
  <div class="no-token-wrap">
    <img class="no-token-img" :src="imgSrc[lang] || imgSrc.en" />
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import {
  LOCAL_COMMON_FILE_PREFIX
} from 'project_path/src/core/index.js'
const lang = SEARCH_PARAMS.init_param.get('lang') || 'en'
/* 退出登录通知-中文 */
const logout_notice = `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/not_login_zh.jpg`
/* 退出登录通知-英文 */
const logout_notice_en = `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-pc/activity_imgs/imgs/not_login_en.jpg`
const imgSrc = reactive({
  zh: logout_notice,
  en: logout_notice_en
})
</script>
<style lang="scss">
.no-token-img {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
