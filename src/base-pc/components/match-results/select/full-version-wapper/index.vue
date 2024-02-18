<!--
 * @Author: lowen pmtylowen@itcom888.com
 * @Date: 2023-09-08 10:43:37
 * @LastEditors: lowen pmtylowen@itcom888.com
 * @LastEditTime: 2023-09-16 17:00:36
 * @FilePath: /user-pc-vite/src/components/match-results/select/full-version-wapper/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <component :is="use_component_key" v-bind="$attrs" />
</template>
<script>
import wapper_config from "./wapper.js";
let {
  all_components,
  is_full_version,
  use_component_key,
  components_keys,
  registered_component_key,
} = wapper_config;
export default {
  inheritAttrs: false,
  //   components:  wapper_config.all_components,
  components: all_components,
  data() {
    return {
      is_full_version,
      use_component_key,
      components_keys,
      registered_component_key,
    };
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped></style>
