<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center h5-root">
        <div>动画单独项目</div>
    
        <q-scroll-area style="height: 100vh; max-width: 100vw; width: 100vw;  overflow: scroll;" @scroll="handle_scroll"   >
          <PageH5 class=""   />
    </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
 
<script>
import PageH5 from "../pages/yazhou-h5/index.vue";
import layout_mixin  from "project/activity/src/mixins/layout_mixin/layout_mixin.js";  
export default {
  name: "layout-h5",
  components: {
    PageH5,
  },
  mixins: [ layout_mixin],
  data() {
    return {
      //项目CSS变量键
      css_var_project_key: 'yazhou_h5'
    }
  },
 
}
</script>
<style lang="scss">
.h5-root {
  .q-scrollarea { 
    overflow: hidden !important;
  }
}
</style>
 