/**
 *
 * 当前 环境的OSS 文件写入 html 头部
 * 防止 源站OSS 文件被攻击用户进不来
 */


import BUILD_VERSION_CONFIG from "./output/version/build-version.js";


let default_oss_config_path = `./output/oss/${BUILD_VERSION_CONFIG.OSS_FILE_NAME}.json`;
const default_oss_config_module = await import(
  default_oss_config_path,
  {
    assert: { type: "json" },
  }
);
const default_oss_config = default_oss_config_module.default;


// import oss_dev from "./output/oss/dev.json" assert { type: "json" };
// import oss_test from "./output/oss/test.json" assert { type: "json" };
// import oss_lspre from "./output/oss/lspre.json" assert { type: "json" };
// import oss_play from "./output/oss/play.json" assert { type: "json" };
// import oss_mini from "./output/oss/mini.json" assert { type: "json" };
// import oss_prod from "./output/oss/prod.json" assert { type: "json" };

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
