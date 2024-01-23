<template>
    <component :is="use_component_key" v-bind="$attrs" />
</template>
<script>
import { h } from 'vue'
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
  setup(props, { slots, emit, attrs }) {
    return () => h(all_components[use_component_key], null, slots)
  },
};
</script>

<style lang="scss" scoped></style>
