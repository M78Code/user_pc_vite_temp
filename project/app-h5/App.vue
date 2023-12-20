<template>
  <div id="q-app" class="theme0">
    <Orientation />
    <!-- 未带token -->
    <NotLogin v-if="!token"></NotLogin>
    <appload v-else-if="init_load"></appload>
  </div>
</template>
<script>
 
import appload from "./app-load.vue";
import app_mixin from "src/base-h5/mixin/app-mixin.js";
import NotLogin from 'src/base-h5/components/common/not-login.vue';
import Orientation from "src/base-h5/components/common/orientation/orientation.vue";
export default {
  mixins: [app_mixin],
  components: {
    appload,
    NotLogin,
    Orientation
  },
  data () {
    return {
      token: SEARCH_PARAMS.init_param.get("token"),
    }
  },
};
</script>
<style lang="scss"></style>
