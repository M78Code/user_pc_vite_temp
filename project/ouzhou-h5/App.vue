<template>
  <div id="q-app" class="theme0">
    <appload v-if="init_load"></appload>
  </div>
</template>
<script>
 
import appload from "./app-load.vue";
import app_mixin from "src/base-h5/mixin/app-mixin.js";
import {LocalStorage} from "src/core/"
export default {
  mixins: [app_mixin],
  components: {
    appload,
  },
  beforeCreate(){
    LocalStorage.set("lang",'en');
  }
};
</script>
<style lang="scss">
  #q-app {
    height: inherit;
  }
</style>
