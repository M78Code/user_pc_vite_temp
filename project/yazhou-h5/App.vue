<!--
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 项目页面入口
-->

<template>
  <div id="q-app">
    <appload v-if="init_load"></appload>
  </div>
</template>
<script>



import _ from  "lodash";
import appload from "./App_load.vue";
import apiDomain from "./apiDomain.js";
import { useRouter } from "vue-router";
import STANDARD_KEY from "src/core/standard-key";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { onMounted } from "vue";

import { enter_params } from "src/core/index.js";
import BetDataCtr from "src/core/bet/class/bet-data-class-h5.js";

const token_key = STANDARD_KEY.get("token"); //token键
export default {
  name: 'App',
  components: {
    appload,
  },
  mixins: [apiDomain],
   data() {
    return {
      init_load: false
    };
  },
  created() {
    BetDataCtr.init()
    enter_params()

    // 检测目前的系统类型ios,android,h5
    window.platform_type = (this.$q.platform.is.ios?'ios':'') || (this.$q.platform.is.android?'android':'') || 'h5';
  },
}
</script>
<style lang="scss">
</style>
