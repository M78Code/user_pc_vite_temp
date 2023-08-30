<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 项目页面入口
-->

<template>
  <div id="q-app">
    <!-- {{ init_load }} -->
    <appload v-if="init_load"></appload>
  </div>
</template>
<script>



import _ from  "lodash";
import appload from "./App_load.vue";
import apiDomain from "./apiDomain.js";
import { useRouter } from "vue-router";
export default {
  name: 'App',
  components: {
    appload,
  },
  mixins: [apiDomain],
   data() {
    return {
      init_load: true
    };
  },
  created() {
    // 检测目前的系统类型ios,android,h5
    window.platform_type = (this.$q.platform.is.ios?'ios':'') || (this.$q.platform.is.android?'android':'') || 'h5';
  }

}
</script>
<style lang="scss">
</style>
