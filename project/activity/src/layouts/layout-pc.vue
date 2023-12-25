<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <PagePc />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
 
import PagePc from "project/activity/src/pages/yazhou-pc/index.vue";
import layout_mixin  from "project/activity/src/mixins/layout_mixin/layout_mixin.js";  
import { useMittOn, useMittEmit, MITT_TYPES } from "project_path/src/core/index.js";
export default {
  name: "layout-pc",
  components: {
    PagePc,
  },
  mixins: [ layout_mixin],
  data() {
    return {
      //项目CSS变量键
      css_var_project_key: 'yazhou_pc'
    }
  },
  mounted(){
    this.$nextTick(()=>{
      useMittEmit(MITT_TYPES.EMIT_LOADING_CTR_CMD,0);
    })
  }
}
</script>
 

 