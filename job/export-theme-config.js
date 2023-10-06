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
let write_folder = "./job/output/theme/";
let file_path = write_folder + `index.js`;
//i18n 服务器KEY 对应 本地语言key
const local_map={
  "server_en":"en",
  "server_cn":"zh",
  "server_tw":"tw",
  "server_vn":"vi",
  "server_th":"th",
  "server_my":"ms",
  "server_id":"ad",
  "server_my":"mya",
  "server_br":"pt",
  "server_jp":"ry",
  "server_kr":"ko",
  "server_es":"es",
}
//服务器返回的键名  对应 本语言所对应的键名
remove_file(write_folder) //del  old file
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
function get_server_theme(server_themes = []) {
  try {
    const theme_obj = {}  //这个对象作为 ui上的展示
    server_themes.sort((a, b) => a.order - b.order)//先排序
    lodash.forEach(server_themes, ({ detail, key, order, version, i18n, is_default }) => {
      //TODO 等接口确定好后再操作 暂时先这样 
      // export-server-resource.js 下载文件那边的操作导出了 download_file_to_local 
      theme_obj[key] = ({
        is_default,
        version,
        i18n,
        css: detail,
        order
      })   //此obj可以作为  UI展示图的循环对象
      
      //css变量  先作为文件存储 不然太大  import.meta.glob导入就行了
      write_file(write_folder + key + '.json', JSON.stringify(detail))
    })
    //导出语言建对应的文件名称
    write_file(file_path, 'export default ' + JSON.stringify(theme_obj))
  } catch (error) {
    console.error("导出服务器主题失败");
  }
}
/**对比文档如果和服务器的配置不一样就结束进程*/
// 获取 服务器上 当前商户的 版本配置
get_server_theme(final_merchant_config.theme);
