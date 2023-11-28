<template>
    <div class="no-token-wrap">
        <img class="no-token-img" v-if="lang == 'zh' || lang == 'tw'" :src="compute_img_url('not-login-zh')" />
        <img class="no-token-img" v-else :src="compute_img_url('not-login')" />
    </div>
</template>
<script setup>
import { compute_img_url } from "src/core/";
const lang = sessionStorage.getItem('lang')
</script>
<style lang="scss">
.no-token-img {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
</style>
  