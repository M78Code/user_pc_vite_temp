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


const ENV_OSS_OBJ={
  "local_local": { file:"dev.json",data: oss_dev},
  "local_dev":{ file:"dev.json",data: oss_dev},
  "local_test":{ file:"test.json",data: oss_test},
  "local_ylcs":{ file:"test.json",data: oss_test},
  "idc_lspre":{ file:"lspre.json",data: oss_lspre},
  "idc_pre":{ file:"play.json",data: oss_play},
  "idc_sandbox":{ file:"play.json",data: oss_play},
  "idc_ylcs":{ file:"mini.json",data: oss_mini},
  "idc_online":{ file:"prod.json",data: oss_prod}
}


export const compute_build_in_oss_by_current_env = (current_env) => {
 

  return ENV_OSS_OBJ[current_env] ||{}
}
 


 