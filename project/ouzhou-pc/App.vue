<template>
  <div id="q-app" class="full-height" v-if="get_token">
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
import { SessionStorage } from "src/core/";
import { useRoute } from 'vue-router';
import "./src/css/common.scss";
import STANDARD_KEY from "src/core/standard-key";
const token_key = STANDARD_KEY.get("token");

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
    get_token() {
      // url token
      let url_token = location.search.indexOf('token');
      // session token
      let session_stroage_token = SessionStorage.get(token_key) || SessionStorage.get('token');
      return url_token >= 0 || session_stroage_token;
    }
  }
};
</script>
