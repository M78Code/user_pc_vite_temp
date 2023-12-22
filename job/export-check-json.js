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
 
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let { PROJECT_NAME  } = BUILD_VERSION_CONFIG;

 
console.log(colors.bgRed("export-check-json.js----------   ----"));
 
 



 let config_obj={
   
  time: Date.now()


 }

 

// 商户配置 输出目录
let write_folder = `./dist/`;

 
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
 

  //输出 文件  
  write_file(write_folder + "check.json",   JSON.stringify(config_obj));
 

 