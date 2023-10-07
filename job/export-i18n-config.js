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
const PROJECT_NAME = final_merchant_config.project;

console.log("export-i18n-config.js----------server-resource ----");
console.log("process.argv----------------------0---");
console.log("process.argv----------------------1---");
// console.log('MERCHANT-CONFIG-VERSION  2:  ', process.env);
console.log("process.argv----------------------3---");

// 商户配置 输出目录
let write_folder = "./job/output/i18n/";
let file_path = write_folder + `index.js`;
//i18n 服务器KEY 对应 本地语言key
const map_lang = {
  en: "en-gb",
  zh: "zh-cn",
  tw: "zh-tw",
  vi: "vi-vn",
  th: "th-th",
  ms: "ms-my",
  ad: "id-id",
  mya: "my-my",
  pt: "pt-br",
  ry: "ja-jp",
  ko: "ko-kr",
  es: "es-es",
};
//服务器返回的键名  对应 本语言所对应的键名
const server_map = {
  "zh": "server_zh"
}
remove_file(write_folder) //del  old file
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
function get_server_i18n(i18n) {
  const { detail, version } = i18n; //获取版本号和 详情
  const i18n_obj = {}
  lodash.forEach(detail, ({ key, value }) => {
    //key表示键名 a.b.c.d      value表示对应 的 语言  值  {zh:"中文",en:"english"}
    for (let lang in value) {
      i18n_obj[lang] = i18n_obj[lang] || {}//设置 语言建
      lodash.set(i18n_obj[lang], key, value[lang]) //讲语言值设置到对应的 文件下
    }
  })
  for (let key in i18n_obj) {
    //输出语言文件  map_lang对应的服务器文件名称
    write_file(write_folder + map_lang[key] + '.json', JSON.stringify(i18n_obj[key]))
  }
  //导出语言建对应的文件名称
  write_file(file_path, 'export default ' + JSON.stringify(map_lang))

}

/**对比文档如果和服务器的配置不一样就结束进程*/
// 获取 服务器上 当前商户的 版本配置
get_server_i18n(final_merchant_config.i18n);
