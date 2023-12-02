<template>
  <div class="full-height">
    <appload v-if="init_load"></appload>
 
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
