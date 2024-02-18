<template>
  <div id="q-app" class="theme0">
    <appload v-if="init_load"></appload>
  </div>
</template>
<script>
 
import appload from "./app-load.vue";
import app_mixin from "src/base-h5/mixin/app-mixin.js";
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
<style lang="scss"></style>
