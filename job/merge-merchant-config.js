/**
 * 合并 商户配置
 *
 * 这个插件 在代码内 一些节点会单独使用
 */
// 默认的 需要组合进去的配置  ,
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
import lodash from "lodash";
let default_merchant_config_path = `./default-config/merchant-config-${BUILD_VERSION_CONFIG.PROJECT_NAME}.json`;
const default_merchant_config_module = await import(
  default_merchant_config_path,
  {
    assert: { type: "json" },
  }
);
const default_merchant_config = default_merchant_config_module.default;
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
  lodash.merge(config, default_merchant_config, scg, add_obj);
  if (!project) {
    console.error("当前未设置目标项目名字 ，必须设置 。");
  }
  return config;
};
/**
 *
 * @param {*} scg   服务端的 商户配置
 * @param {*} add_obj  附加信息对象
 */
export const merge_merchant_config = (scg, add_obj) => {
  let final_config = merge_merchant_config_inner(scg, add_obj);
  return final_config;
};
