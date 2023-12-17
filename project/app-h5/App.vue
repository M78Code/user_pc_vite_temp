<template>
  <div id="q-app" class="theme0">
    <Orientation v-if="!orientation"/>
    <!-- 未带token -->
    <div v-show="orientation">
      <NotLogin v-if="!token"></NotLogin>
      <appload v-else-if="init_load"></appload>
    </div>
  </div>
</template>
<script>
 
import appload from "./app-load.vue";
import app_mixin from "src/base-h5/mixin/app-mixin.js";
import NotLogin from 'src/base-h5/components/common/not-login.vue';
import Orientation from "src/base-h5/components/common/orientation.vue";
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
      orientation: true, // true -> 竖屏 false -> 横屏
    }
  },
  methods: {
    listener() {
      console.log(window.screen.orientation, "设备方向");
      switch (window.screen.orientation.angle) {
        case 90:
        case -90:
          this.orientation = false;
          break;
        default:
          this.orientation = true;
          break;
      }
    }
  },
  unmounted() {
    window.removeEventListener('orientationchange', this.listener)
  },
  mounted() {
    this.listener();    
    window.addEventListener('orientationchange', this.listener)
  }
};
</script>
<style lang="scss"></style>
