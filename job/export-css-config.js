/**
 * 合并输出商户配置
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

console.log("export-css-config.js----------server-resource ----");
console.log("process.argv----------------------0---");
console.log("process.argv----------------------1---");
// console.log('MERCHANT-CONFIG-VERSION  2:  ', process.env);
console.log("process.argv----------------------3---");

// 商户配置 输出目录
let write_folder = "./job/output/css/";
let file_path = write_folder + `index.json`;

//本地scss目录
let scss_folder = `./project/${PROJECT_NAME}/src/css/variables/`;
// let scss_folder = `./project/${PROJECT_NAME}/src/css/`;

//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);

/**
 * 遍历指定目录下的所有 .scss/.js文件
 * @param {*} dir
 */
const getAllFile = function (dir) {
  let res = [];
  function traverse(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        traverse(pathname);
      } else {
        if (pathname.endsWith(".js")) {
          res.push(pathname);
        }
      }
    });
  }
  traverse(dir);
  return res;
};
/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const get_css_config = async (css_params = {}) => {
  try {
    let merchant_css_config = {};
    const obj = await diff_css_local(css_params);
    write_file(
      file_path,
      JSON.stringify(obj)
    );
  } catch (error) {
    console.log("css文件错误", error);
  }
};
/**对比文档如果和服务器的配置不一样就结束进程*/
const diff_css_local = async (css_params) => {
  const all_global_scss = getAllFile(scss_folder + "global");
  const all_component_scss = getAllFile(scss_folder + "component");
  const obj = {
    global: {},
    component: {},
  };
  function red_path_keys(file_path, key) {
    return import("../" + file_path.replace(/\\/g, "/")).then((res) => {
      const file_name = file_path.split(/[\\/]/).pop().replace(".js", "");
      if (res.default) obj[key][file_name] = Object.keys(res.default).reduce((sum, cur) => {
        sum[cur] = css_params[cur] || { day: '', night: '' }
        console.log(cur, sum[cur])
        return sum;
      }, {});
      // if (!lodash.hasIn(merchant_css_config.global, Object.keys(res.default))) {
      //   process.emit(1);
      // }
    });
  }
  //globals
  const globals = all_global_scss.map(v => red_path_keys(v, "global"));
  //component
  const components = all_component_scss.map(v => red_path_keys(v, "component"));
  await Promise.all(globals.concat(components));
  return obj;
};


// 获取 服务器上 当前商户的 版本配置
get_css_config(final_merchant_config.css);
