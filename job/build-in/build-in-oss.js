/**
 *
 * 当前 环境的OSS 文件写入 html 头部
 * 防止 源站OSS 文件被攻击用户进不来
 */
import BUILD_VERSION_CONFIG from "../output/version/build-version.js";
let default_oss_config_path = `./job/output/oss/${BUILD_VERSION_CONFIG.OSS_FILE_NAME}`;
import {import_json_data} from "../util-and-config/write-folder-file.js"
const  default_oss_config  = import_json_data(default_oss_config_path)
const ENV_OSS_OBJ = {
  local_local: { file: "dev.json",label:"个人  开发环境" },
  local_dev: { file: "dev.json",label:"局域网  开发环境" },
  local_test: { file: "test.json",label:"局域网  测试环境" },
  local_ylcs: { file: "test.json",label:"局域网  压力测试环境" },
  idc_lspre: { file: "lspre.json",label:"IDC  隔离预发布" },
  idc_pre: { file: "play.json",label:"IDC 试玩环境"},
  idc_sandbox: { file: "play.json",label:"IDC 试玩环境"},
  idc_ylcs: { file: "mini.json",label:"IDC 微型测试环境"},
  idc_online: { file: "prod.json",label:"IDC  生产环境"},
};
export const compute_build_in_oss_by_current_env = (current_env) => {
  return   {
    ...ENV_OSS_OBJ[current_env],
    data:default_oss_config
  };
};
