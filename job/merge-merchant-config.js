/**
 * 合并 商户配置
 *
 * 这个插件 在代码内 一些节点会单独使用
 */

// 默认的 需要组合进去的配置  ,

import default_merchant_config_ouzhou from "./default-config/merchant-config-ouzhou.json"  assert { type: "json" };

//商户配置的详细信息

/**
 * 1.合并 ，覆盖 输入进来的配置 ，以及本地配置
 *
 *
 * @param {*} scg  其他地方输入的 配置信息
 * @param {*} add_obj  附加信息对象
 * @returns
 */

const merge_merchant_config_inner = (scg, add_obj) => {
  let config = {};

  let { project } = add_obj;

  if (project == "ouzhou") {
    config = Object.assign({}, default_merchant_config_ouzhou, scg, add_obj);
  }

  return config;
};

/**
 *
 * @param {*} scg   服务端的 商户配置
 * @param {*} add_obj  附加信息对象
 */
export const merge_merchant_config = (scg, add_obj) => {
  // final_config.version= add_obj.MERCHANT_CONFIG_VERSION

  let final_config = merge_merchant_config_inner(scg, add_obj);

  return final_config;
};
