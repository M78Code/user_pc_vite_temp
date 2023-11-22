<template>
    <div class="no-token-wrap">
        <img class="no-token-img" alt="未登录图片" :src="compute_img_url('not-login')" />
    </div>
</template>
<script>
import { compute_img_url } from "src/core/";

export default {
    name: "not-login",
    data() {
        return {

        };
    },
};
</script>
<style lang="scss">
.no-token-img {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
</style>
  