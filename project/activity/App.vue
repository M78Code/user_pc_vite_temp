<template>
  <div>

    <div  >    <LayoutH5 />  </div>
    <!-- <div v-if="is_mobile">    <LayoutH5 />  </div>
    <div v-else>    <LayoutPC />  </div> -->
 
  </div>
</template>

<script>
import { defineComponent } from "vue";

import LayoutH5 from "project/activity/src/layouts/layout-h5.vue";
// import LayoutPC from "project/activity/src/layouts/layout-pc.vue";

import app_mixin from "./src/mixins/app_mixin/app-mixin.js";

export default defineComponent({
  name: "App",
  mixins: [app_mixin],
  components: {
    LayoutH5,
    // LayoutPC
  },
  computed: {
    is_mobile: () => this.$q.platform.is.mobile,
  },
  created() {
    this.test_init();
    // console.error('--------------------',_);
  },
  methods: {
    test_init() {
      let online_obj = {
        gr: "COMMON",
        token: "7da8eba371de2057f7246c1ecb817bc1a66337f4",
        lang: "zh",
        pb: "1",
        best_api: "https://api.lkjklkyi.com",
      };

      let final_obj = online_obj;

      for (let i in final_obj) {
        sessionStorage.setItem(i, final_obj[i]);
      }
    },
  },
});
</script>
 