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
 

import {import_json_data} from "../util-and-config/write-folder-file.js"

const  final_merchant_config  = import_json_data( "./job/output/merchant/config.json")



console.log(colors.bgRed("export-js-config.js----------resolve_merchant_config_js  ----"));

// 商户配置 输出目录
 
let write_folder_theme = "./job/output/theme/";
let write_folder_css = "./job/output/css/";
let write_folder_assets = "./job/output/assets/";

//i18n 服务器KEY 对应 本地语言key


 
function resolve_merchant_config_theme() {
  const { theme=[], clientLanguage = [] } = final_merchant_config;

  let theme_obj = {};
  let assets_obj = {};
  let assets_keys = [];
  let css_obj = {};
  let css_keys = [];

  theme.map((x) => {
    theme_obj[x.key] = {
      key: x.key,
      is_default: x.is_default,
      order: x.order,
      i18n: x.i18n||{},
    };
    assets_obj[x.key] = x.assets_detail||{};
    assets_keys = assets_keys.concat( Object.keys(x.assets_detail||{}))
    css_obj[x.key] = x.css_detail||{};
    css_keys = css_keys.concat( Object.keys(x.css_detail||{}))

  });
  //去重 
  assets_keys = lodash.uniq(assets_keys)
  css_keys = lodash.uniq(css_keys)

   //输出 文件 
   write_file(write_folder_theme +  'index.json', JSON.stringify(theme_obj))
   write_file(write_folder_assets +  'config.json', JSON.stringify(assets_obj))
   write_file(write_folder_assets +  'keys-server.json', JSON.stringify(assets_keys))
   write_file(write_folder_css +  'config.json', JSON.stringify(css_obj))
   write_file(write_folder_css +  'keys-server.json', JSON.stringify(css_keys))


}

 

resolve_merchant_config_theme()
