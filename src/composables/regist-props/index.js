/**
 * 组件对外对接 参数注册 props 插件 
 */

import { computed, ref } from "vue";
import { get_input_config } from "app/job/output/merchant/index.js";
// 组件注册的 组件名字
let component_symbol = ref("component_symbol");
let set_component_symbol = (val) => (component_symbol.value = val);

let useProps = {};
let useComputed = {};

/**
 * 注册  单个键值对 对象
 * @param {*} params 
 * @returns 
 */
let set_key_and_default_value_single_one = (params = {}) => {
  let input_config = get_input_config(component_symbol.value);
  let key_symbol = ref("key_symbol");
  let default_value = ref("");
  let key_definition = "";
  let set_key_symbol = (val) => (key_symbol.value = val);
  let set_default_value = (val) => (default_value.value = val);
  let set_key_definition = (val) => (key_definition = val);
  let { key, value, definition } = params;
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
 * @param {*} component_symbol  组件 注册名字
 * @param {*} params    常规的 props 定义对象
 * @returns
 */

let regist_props_helper = (component_symbol, params) => {
  set_component_symbol(component_symbol);
  for (let key in params) {
    let value = "";
    if (typeof params[key] == "object") {
      if (params[key]["default"] == "function") {
        value = params[key]["default"]();
      } else {
        value = params[key]["default"];
      }
    } else {
      value = params[key];
    }
    let obj = {
      key,
      value,
      definition: params[key],
    };
    let result = set_key_and_default_value_single_one(obj);
    Object.assign(useProps, result.useProps_single);
    Object.assign(useComputed, result.useComputed_single);
  }
};
export { regist_props_helper, useProps, useComputed };





/**
 * 使用代码 块 示例 
 */


//-------------------- 对接参数 prop 注册  开始  -------------------- 


// import  { regist_props_helper, useProps,  useComputed  } from "src/composables/regist-props/index.js"
// const  component_symbol = 'TestComponent'
// const need_register_props = {
//   tableClass: {
//     type: String,
//     default: "bg-teal",
//   },
// }
// regist_props_helper(component_symbol, need_register_props)
// const props = defineProps({
//   ...useProps
// })
// const tableClass_computed = useComputed.tableClass_computed(props)



//-------------------- 对接参数 prop 注册  结束  -------------------- 