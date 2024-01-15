<template>
  <div>
    <component :is="use_component_key"  :mid="mid" />
  </div>
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
  props: {
    mid: {
    
      default: ''
    },
  },
  
};
</script>
<style lang="scss" scoped></style>
