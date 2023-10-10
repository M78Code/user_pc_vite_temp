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
console.log("export-i18n-config.js----------resolve_merchant_config_i18n  ----");
// 商户配置 输出目录
let write_folder = "./job/output/i18n/";
remove_file(write_folder) //del  old file
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
function resolve_merchant_config_i18n() {
  const {i18n,clientLanguage=[]} = final_merchant_config 
  const { detail, version } = i18n; //获取版本号和 详情
  const i18n_obj = {}
  const key_path_obj={}
  clientLanguage.map(language=>{
    let language_key = language.value
    i18n_obj[language_key]={}
    key_path_obj[language_key]={}
  })
  for(let key in detail){
    let value = detail[key]
    if(value){
      for(let lan in value){
        if(i18n_obj[lan]){
          lodash.set( i18n_obj[lan] , key , value[lan]  )
     
          key_path_obj[lan][key] = value[lan]
       
        }
      }
    }
  }
   //输出 文件 
   write_file(write_folder +  'config.json', JSON.stringify(detail))
   write_file(write_folder +  'i18n-obj.json', JSON.stringify(i18n_obj))
   write_file(write_folder +  'index.json', JSON.stringify(key_path_obj))
}
 
resolve_merchant_config_i18n()