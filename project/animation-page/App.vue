<template>
  <div class="full-height">
       <!-- 页面路由开始 -->
       <!-- <appload v-if="init_load" /> -->
       <IndexPage/>
  </div>
</template>
<script>
 
 import app_mixin from "./src/mixins/app-mixin/app-mixin.js";

 

import "./src/css/common.scss";

import IndexPage  from "./src/pages/IndexPage.vue" 
export default {
  mixins: [app_mixin],
  components: {
    IndexPage
  },
  data() {
    return {};
  },
};
</script>
