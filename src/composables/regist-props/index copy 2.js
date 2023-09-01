/**
 * 组件对外对接 参数注册 props 插件
 */

import { computed, ref } from "vue";
import { get_input_config } from "app/job/use-output/index.js";

export const useRegistPropsHelper = (params) => {
  let { useProps, useComputed, component_symbol, need_register_props } = params;

  /**
   * 注册  单个键值对 对象
   * @returns
   */
  let set_key_and_default_value_single_one = (single_obj = {}) => {
    let input_config = get_input_config(component_symbol);
    let key_symbol = ref("key_symbol");
    let default_value = ref("");
    let key_definition = "";
    let set_key_symbol = (val) => (key_symbol.value = val);
    let set_default_value = (val) => (default_value.value = val);
    let set_key_definition = (val) => (key_definition = val);
    let { key, value, definition } = single_obj;
    set_key_symbol(key);
    set_default_value(value);
    set_key_definition(definition);
    let value_computed_fn = (props) => {
      return computed(() => {
        let config_value = input_config[key_symbol.value];
        if (config_value) {
          return config_value;
        } else if (props[key_symbol.value]) {
          return props[key_symbol.value];
        } else {
          return default_value.value;
        }
      });
    };

    let useProps_single = {
      [key_symbol.value]: key_definition,
    };
    let useComputed_single = {
      [`${key_symbol.value}_computed`]: value_computed_fn,
    };
    return {
      useProps_single,
      useComputed_single,
    };
  };

  // 参数示例
  // let params_demo = {
  //   tableClass: {
  //     type: String,
  //     default: "",
  //   },
  //   title: {
  //     type: String,
  //     default: "组件默认的title值",
  //   },
  // };
  /**
 *
 
 * @param {*} params    常规的 props 定义对象
 * @returns
 */

  let  regist_props_fn = () => {
    for (let key in need_register_props) {
      let value = "";
      if (typeof need_register_props[key] == "object") {
        if (need_register_props[key]["default"] == "function") {
          value = need_register_props[key]["default"]();
        } else {
          value = need_register_props[key]["default"];
        }
      } else {
        value = need_register_props[key];
      }
      let obj = {
        key,
        value,
        definition: need_register_props[key],
      };
      let result = set_key_and_default_value_single_one(obj);
      Object.assign(useProps, result.useProps_single);
      Object.assign(useComputed, result.useComputed_single);
    }
  };

  regist_props_fn()

 
};

/**
 * 使用代码 块 示例
 */

//-------------------- 对接参数 prop 注册  开始  --------------------

// import  { useRegistPropsHelper, useProps,  useComputed  } from "src/composables/regist-props/index.js"
// import {component_symbol ,need_register_props} from "../config/index.js"
// useRegistPropsHelper(component_symbol, need_register_props)
// const props = defineProps({ ...useProps })
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  --------------------
