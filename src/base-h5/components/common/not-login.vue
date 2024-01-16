<template>
  <div class="not-loggedin-page" :style="{ height: height }">
    <img :src="get_no_token_image" alt="not loggedin">
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { friendly_reminder_zh, friendly_reminder_en} from 'src/base-h5/core/utils/local-image.js'

const lang = SEARCH_PARAMS.init_param.get("lang") || 'en';
const get_no_token_image = computed(() => {
  return (['zh', 'hk'].includes(lang)) ? friendly_reminder_zh : friendly_reminder_en
})

const height = computed(() => {
  return `${window.innerHeight}px`
})

onMounted(() => {
})

</script>

<style scoped lang="scss">
.not-loggedin-page{
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

</style>
