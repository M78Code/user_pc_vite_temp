<template>
  <div>
    <template v-if="init_load">
      <div v-if="is_mobile"><LayoutH5 /></div>
      <div v-else><LayoutPC /></div>
    </template>
    <NotLoginPc v-if="!token && !is_mobile"></NotLoginPc>
    <NotLoginH5 v-if="!token&& is_mobile"></NotLoginH5>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import LayoutH5 from "project/activity/src/layouts/layout-h5.vue";
import LayoutPC from "project/activity/src/layouts/layout-pc.vue";

import app_mixin from "./src/mixins/app_mixin/app-mixin.js";
import { Platform  } from 'quasar'
import NotLoginPc from 'project/activity/src/components/not-login-pc.vue';
import NotLoginH5 from 'project/activity/src/components/not-login.vue';
 

export default defineComponent({
  
  name: "App",
  mixins: [app_mixin],
  components: {
    NotLoginPc,
    NotLoginH5,
    LayoutH5,
    LayoutPC
  },
  data () {
    return {
      // token: 0,
      token: SEARCH_PARAMS.init_param.get("token"),
    }
  },
  provide:{
    is_mobile: Platform.is.mobile
  },
  computed: {
    is_mobile(){
       return Platform.is.mobile
    }
  },
  // created() {
  // },
});
</script>
 