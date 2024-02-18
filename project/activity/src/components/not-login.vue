<template>
  <div class="not-loggedin-page">
    <img :src="get_no_token_image" alt="not loggedin">
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  LOCAL_COMMON_FILE_PREFIX
} from 'project_path/src/core/index.js'
const lang = SEARCH_PARAMS.init_param.get('lang') || 'en'
const get_no_token_image = computed(() => {
  return (lang == 'zh') ? `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/friendly_reminder_zh.jpg` : `${LOCAL_COMMON_FILE_PREFIX}/activity/yazhou-h5/activity/friendly_reminder_en.jpg`
})
onMounted(() => {
})

</script>

<style scoped lang="scss">
.not-loggedin-page {
  height: 100%;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

</style>
