/**
 * 合并 商户配置
 *
 * 这个插件 在代码内 一些节点会单独使用
 */

// 默认的 需要组合进去的配置  ,

import default_merchant_config_ouzhou_h5 from "./default-config/merchant-config-ouzhou-h5.json"  assert { type: "json" };
import default_merchant_config_ouzhou_pc from "./default-config/merchant-config-ouzhou-pc.json"  assert { type: "json" };
import default_merchant_config_yazhou_h5 from "./default-config/merchant-config-yazhou-h5.json"  assert { type: "json" };
import default_merchant_config_yazhou_pc from "./default-config/merchant-config-yazhou-pc.json"  assert { type: "json" };
import default_merchant_config_new_pc from "./default-config/merchant-config-new-pc.json"  assert { type: "json" };
import default_merchant_config_app_h5 from "./default-config/merchant-config-app-h5.json"  assert { type: "json" };
import lodash from 'lodash'
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
  if (project == "yazhou-h5") {
   


    lodash.merge(config, default_merchant_config_yazhou_h5, scg, add_obj);

  } else if (project == "yazhou-pc") {
    lodash.merge(config, default_merchant_config_yazhou_pc, scg, add_obj);
  }else if (project == "new-pc") {
    lodash.merge(config, default_merchant_config_new_pc, scg, add_obj);
  }else if (project == "app-h5") {
    lodash.merge(config, default_merchant_config_app_h5, scg, add_obj);
  }




  if (!project) {
    console.error('当前未设置目标项目名字 ，必须设置 。');
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
