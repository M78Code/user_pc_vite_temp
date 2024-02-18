import merchant_component_config from "../output/component/index.json";

import full_version_config from "../output/version/full-version-config.js"
// 是否是全量版本 
const { is_full_version = false } = full_version_config
const { component = {} } = merchant_component_config;
/**
 * 获取使用的 组件
 * @param {*} params
 * @returns
 */
export const get_use_component_key = (params = {}) => {
  let {
    // 所有组件对象
    all_components_obj,
    //默认的组件名字
    default_component_key,
    //注册的组件名字
    registered_component_key,
  } = params;
  //最终使用的组件名字
  let use_component_key = default_component_key;
  //配置文件包裹了一层 component {menu:{}}
  let config = component[registered_component_key] || merchant_component_config[registered_component_key] || {};
  if (config["use_component"]) {
    use_component_key = config["use_component"];
  }
  if (!all_components_obj[use_component_key]) {
    use_component_key = default_component_key;
  }
  return use_component_key
};
/**
 * 获取当前组件的 自定义配置
 * @param {*} registered_component_key   注册的组件名字
 * @returns
 */
export const get_input_config = (registered_component_key) => {
  //配置文件包裹了一层 component {menu:{}}
  let config = component[registered_component_key] || merchant_component_config[registered_component_key] || {};
  let { params = {} } = config;
  return params;
};
/**
 * 当前组件的 全量版本 注册 器
 */
// export const 
export const compute_component_wapper_config = (component_config) => {
  //
  let use_component_key = get_use_component_key(component_config)
  let all_components = {}
  if (is_full_version) {
    all_components = component_config.all_components_obj
  } else {
    all_components = {
      [use_component_key]: component_config.all_components_obj[use_component_key]
    }
  }
  return {
    all_components,
    is_full_version,
    use_component_key,
    components_keys: Object.keys(all_components),
    registered_component_key: component_config.registered_component_key
  }
}


export const compute_server_resource = () => {

  return merchant_component_config.server_resource || {}
}


export const server_resource = compute_server_resource()