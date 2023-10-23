<template>
  <div id="q-app" class="full-height">
    <appload v-if="init_load"></appload>
    <!-- <div :style="compute_css_obj({ label: 'image01', theme: 'day' })"></div>
    <div
      :style="
        compute_css_obj({ label: 'bet-menu-icon', theme: 'day', key: 'item_6' })
      "
      style="width: 36px; height: 36px"
    ></div> -->
  </div>
</template>
<script>
import appload from "./app-load.vue";
import app_mixin from "src/base-pc/mixin/app-mixin.js";

import "./src/css/common.scss";

export default {
  mixins: [app_mixin],
  components: {
    appload,
  },
  data() {
    return {};
  },
};
</script>
