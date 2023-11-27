<template>
  <div class="not-loggedin-page">
    <img :src="get_no_token_image" alt="not loggedin">
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { friendly_reminder_zh, friendly_reminder_en} from 'src/base-h5/core/utils/local-image.js'

const lang = ref('en')

const get_no_token_image = computed(() => {
  return lang.value === 'zh' ? friendly_reminder_zh : friendly_reminder_en
})

onMounted(() => {
  lang.value =  sessionStorage.getItem('h5_lang')
})

</script>

<style scoped lang="scss">
.not-loggedin-page{
  height: 100%;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

</style>
