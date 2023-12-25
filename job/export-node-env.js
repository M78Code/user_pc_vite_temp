/**
 * 合并输出商户配置 i18n
 */
import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors"
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
 

 
console.log(colors.bgRed("export-js-config.js----------resolve_merchant_config_js  ----"));
 

const IS_DEV = ("" + process.argv[2]).trim() == "development";
 




 let config_obj={
  IS_DEV,
  IS_PROD: !IS_DEV,
  NODE_ENV: IS_DEV ? "development" : "production",

 }

 

// 商户配置 输出目录
let write_folder = "./job/output/node-env/";


//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
 

  //输出 文件  
  write_file(write_folder + "index.js", 'export default '+ JSON.stringify(config_obj));
 

 