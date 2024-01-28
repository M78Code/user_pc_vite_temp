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
 
import BUILD_VERSION_CONFIG from "../output/version/build-version.js";
let { PROJECT_NAME  } = BUILD_VERSION_CONFIG;

 
console.log(colors.bgRed("export-check-json.js----------   ----"));
 
 



 let config_obj={
   
  time: Date.now()


 }

 

// 商户配置 输出目录
let write_folder = `./dist/`;

 
 
 

  //输出 文件  
  write_file(write_folder + "check.json",   JSON.stringify(config_obj));
 

 