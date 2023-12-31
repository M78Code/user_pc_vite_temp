import BUILDIN_CONFIG from "app/job/output/env/index.js";

/**
 * 把一条API 数据组装当前的 分组数据 等
 *
 */
export const format_api_to_obj = (api, group) => {
  let obj = {
    api, //域名
    group: group ? group : BUILDIN_CONFIG.DOMAIN_RESULT.gr, //域名分组信息    "COMMON"     "GA" +  .gr
    update_time: new Date().getTime(),
  };

  return obj;
}