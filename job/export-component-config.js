/**
 * 合并输出商户配置 i18n
 */
import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
console.log("export-component-config.js----------resolve_merchant_config_component  ----");
 

// 商户配置 输出目录
let write_folder = "./job/output/component/";

remove_file(write_folder); //del  old file
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
function resolve_merchant_config_component() {
  const { component } = final_merchant_config;
  const { detail, version } = component; //获取版本号和 详情

  //输出 文件  
  write_file(write_folder + "index.json", JSON.stringify(detail));
}

resolve_merchant_config_component()
