<template>
  <div class="full-height">
       <!-- 页面路由开始 -->
       <router-view />
 
  </div>
</template>
<script>
 
import app_mixin from "./src/mixins/app-mixin/app-mixin.js";

import "./src/css/common.scss";

export default {
  mixins: [app_mixin],
  components: {
    // appload,
  },
  data() {
    return {};
  },
};
</script>
