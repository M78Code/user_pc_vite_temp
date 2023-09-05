<template>
  <div v-show="is_full_version">
    <div>is_full_version {{ is_full_version }}</div>
    <q-tabs
      v-model="use_component_key"
      inline-label
      class="bg-purple text-white shadow-2"
    >
      <q-tab
        v-for="item in components_keys"
        :key="item"
        :name="item"
        :label="item"
      />
    </q-tabs>
  </div>
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
    handle_test_emit(params) {
      console.log("emit 事件收到 ");
      console.log(
        "组件包装器  组件内  收到 emit 事件  ，携带  数据 ： ",
        params
      );
    },
  },
};
</script>
<style lang="scss" scoped></style>
