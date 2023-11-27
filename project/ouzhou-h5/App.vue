<template>
  <div id="q-app" class="theme0">
     <!-- 未带token -->
    <NotLogin v-if="!is_token"></NotLogin>
    <!-- 正常渲染 -->
    <appload v-else></appload>
  </div>
</template>
<script>
 
import appload from "./app-load.vue";
import app_mixin from "src/base-h5/mixin/app-mixin.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import NotLogin from 'src/base-h5/components/common/not-login.vue';
import {LocalStorage} from "src/core/"
export default {
  mixins: [app_mixin],
  components: {
    appload,
    NotLogin
  },
  data () {
    return {
      is_token: true
    }
  },
  created() {
    this.is_token = sessionStorage.getItem('h5_token')
    // 设置 title
    const h5_lang = sessionStorage.getItem('h5_lang');
    const web_site_title = UserCtr.get_web_title(h5_lang && h5_lang !== 'null' ? h5_lang : 'en');
    document.title = !this.is_token ? '' : web_site_title
  }
}
</script>
<style lang="scss">
  #q-app {
    height: inherit;
  }
</style>
