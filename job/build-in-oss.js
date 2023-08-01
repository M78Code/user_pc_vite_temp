/**
 *
 * 当前 环境的OSS 文件写入 html 头部
 * 防止 源站OSS 文件被攻击用户进不来
 */
import oss_dev from "./output/oss/dev.json"  assert { type: "json" };
import oss_test from "./output/oss/test.json"  assert { type: "json" };
import oss_lspre from "./output/oss/lspre.json"  assert { type: "json" };
import oss_play from "./output/oss/play.json"  assert { type: "json" };
import oss_mini from "./output/oss/mini.json"  assert { type: "json" };
import oss_prod from "./output/oss/prod.json"  assert { type: "json" };
export const compute_build_in_oss_by_current_env = (current_env) => {
  let obj = "";
  switch (current_env) {
    case "local_local":
      obj = oss_test;
      break;
    case "local_dev":
      obj = oss_dev;
      break;
    case "local_ylcs":
      obj = oss_test;
      break;
    case "local_test":
      obj = oss_test;
      break;
    case "idc_lspre":
      obj = oss_lspre;
      break;
    case "idc_pre":
      obj = oss_play;
      break;
    case "idc_sandbox":
      obj = oss_play;
      break;
    case "idc_ylcs":
      obj = oss_mini;
      break;
    case "idc_online":
      obj = oss_prod;
      break;
    default:
      obj = oss_prod;
      break;
  }
  return obj;
};
