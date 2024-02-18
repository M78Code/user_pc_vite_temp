/**
 * 合并输出商户配置 i18n
 */
import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors"
import {
 
  write_file,
  remove_file,
} from "../util-and-config/write-folder-file.js";
// 商户版本 最终配置
 
console.log(colors.bgRed("export-component-config.js----------resolve_merchant_config_component  ----"));
 
import {import_json_data} from "../util-and-config/write-folder-file.js"

const  final_merchant_config  = import_json_data("./job/output/merchant/config.json")

// 商户配置 输出目录
let write_folder = "./job/output/component/";

 
function resolve_merchant_config_component() {
  const { component } = final_merchant_config;
  const { detail, version } = component; //获取版本号和 详情

  //输出 文件  
  write_file(write_folder + "index.json", JSON.stringify(detail));
}

resolve_merchant_config_component()
