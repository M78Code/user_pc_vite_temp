<template>
  <div id="q-app" class="full-height" v-if="judgment_token()">
    <appload v-if="init_load"></appload>
  </div>
  <div v-else>
    <notLogin/>
  </div>
</template>
<script>
import notLogin from 'src/base-pc/components/not-login/template1.vue'
import appload from "./app-load.vue";
import app_mixin from "src/base-pc/mixin/app-mixin.js";
import "./src/css/common.scss";

export default {
  mixins: [app_mixin],
  components: {
    appload, notLogin
  },
  data() {
    return {};
  },
  methods: {
    // 判断是否具有 token  url 或 session
    judgment_token() {
      // url token
      let url_token = location.search.indexOf('token');
      // session token
      let session_stroage_token = sessionStorage.getItem('pc_token') || sessionStorage.getItem('token');
      return url_token >= 0 || session_stroage_token;
    }
  }
};
</script>
src/output