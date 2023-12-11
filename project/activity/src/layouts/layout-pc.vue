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
export default {
  name: "layout-pc",
  components: {
    PagePc,
  },
  mixins: [ layout_mixin],
 
}
</script>
 

 