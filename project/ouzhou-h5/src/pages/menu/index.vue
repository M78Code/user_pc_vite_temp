<template>
  <div>
    <div style="display: none">{{ base_data_instance.base_data_version }}</div>
    <menu-wapper
      v-if="base_data_instance.base_data_version != 1"
      use_component_key="H5MenuTemplate1"
      :base_data="base_data_instance"
      :version="base_data_instance.base_data_version"
    ></menu-wapper>
  </div>
</template>
<script setup>
import { onMounted,onBeforeMount } from "vue";
import base_data_instance from "src/core/base-data/base-data.js";
import { MenuWapper } from "src/base-pc/components/menu";
onBeforeMount(()=>{
  base_data_instance.init()
})
</script>