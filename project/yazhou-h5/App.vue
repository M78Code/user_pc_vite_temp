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
import { api_match } from "src/api/index.js";
import { useRouter } from "vue-router";
import STANDARD_KEY from "src/core/standard-key";
import GlobalAccessConfig  from  "src/core/access-config/access-config.js"
import { SessionStorage } from "src/core/utils/module/web-storage.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { onMounted } from "vue";
import { GetUrlParams } from "src/core/utils/";


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

 

    // 检测目前的系统类型ios,android,h5
    window.platform_type = (this.$q.platform.is.ios?'ios':'') || (this.$q.platform.is.android?'android':'') || 'h5';
  },
  methods:{

    init_all(){
      

    },
    /**
 * 获取用户信息
 */
    async handle_user_tryPlay() {
      const url_params = GetUrlParams();
        let token = SessionStorage.get(token_key, url_params.token);

        if (!token) {
          //试玩登录
          let res = await api_match.handle_user_tryPlay();
          let obj = res?.data?.data || {};
          token = obj.token;
          SessionStorage.set(token_key, token);
        }
        UserCtr.get_user_info(token)
        await GlobalAccessConfig.init()
        this.init_load = true
    }



  }
}
</script>
<style lang="scss">
</style>
