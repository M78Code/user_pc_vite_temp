import merchant_config from "./config.json";

/**
 * 获取使用的 组件
 * @param {*} params
 * @returns
 */
export const get_use_component = (params = {}) => {
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
  let config = merchant_config[registered_component_key] || {};
  if (config["use_component"]) {
    use_component_key = config["use_component"];
  }
  if (!all_components_obj[use_component_key]) {
    use_component_key = default_component_key;
  }
  return all_components_obj[use_component_key];
};

/**
 * 获取当前组件的 自定义配置
 * @param {*} registered_component_key   注册的组件名字
 * @returns
 */
export const get_input_config = (registered_component_key) => {
  let config = merchant_config[registered_component_key] || {};
  let { params = {} } = config;
  return params;
};
