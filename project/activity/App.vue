<template>
  <div>
    <template v-if="init_load">
      <div v-if="is_mobile"><LayoutH5 /></div>
      <div v-else><LayoutPC /></div>
    </template>
 
  </div>
</template>

<script>
import { defineComponent } from "vue";

import LayoutH5 from "project/activity/src/layouts/layout-h5.vue";
import LayoutPC from "project/activity/src/layouts/layout-pc.vue";

import app_mixin from "./src/mixins/app_mixin/app-mixin.js";
import { Platform  } from 'quasar'
 

export default defineComponent({
  
  name: "App",
  mixins: [app_mixin],
  components: {
    LayoutH5,
    LayoutPC
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
 