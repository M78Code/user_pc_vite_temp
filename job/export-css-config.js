/**
 * 合并输出商户配置
 */
import axios from "axios";
import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 代码内 配置的   商户版本号       ，一般是  本地测试 打包指定版本用
import { FILE_PATH, PROJECT_NAME } from "../dev-target-env.js";
console.log("export-css-config.js----------server-resource ----");
console.log("process.argv----------------------0---");
console.log("process.argv----------------------1---");
// console.log('MERCHANT-CONFIG-VERSION  2:  ', process.env);
console.log("process.argv----------------------3---");

// 商户配置 输出目录
let write_folder = "./job/output/css/";
let file_path = write_folder + `${PROJECT_NAME}.js`;

//本地scss目录
let scss_folder = `./project/${PROJECT_NAME}/src/css/`;

//开启 ，关闭本地测试  ,这个 上线必须设置false
let ENABLE_TEST = true;

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
const get_css_config = async (css_params) => {
  try {
    const merchant_css_config = {
      global: Object.keys(css_params["global"]),
      component: {},
    };
    for (const key in css_params.component) {
      merchant_css_config.component[key] = Object.values(
        css_params.component[key]
      );
    }
    write_file(
      file_path,
      `export default  ` + JSON.stringify(merchant_css_config)
    );
    // diff_css_local(merchant_css_config);
  } catch (error) {
    console.log("css文件错误");
  }
};
/**对比文档如果和服务器的配置不一样就结束进程*/
const diff_css_local = (merchant_css_config) => {
  const all_global_scss = getAllFile(scss_folder + "global");
  const all_component_scss = getAllFile(scss_folder + "component");

  all_global_scss.map((file_path) => {
    import("../" + file_path.replace(/\\/g, "/")).then((res) => {
      if (!lodash.hasIn(merchant_css_config.global, Object.keys(res.default))) {
        process.emit(1);
      }
    });
  });
  all_component_scss.map((file_path) => {
    const file_name = file_path.split("/").pop().replace(".js", "");
    import("../" + file_path.replace(/\\/g, "/")).then((res) => {
      if (
        !lodash.hasIn(
          merchant_css_config.component[file_name],
          Object.keys(res.default)
        )
      ) {
        process.emit(1);
      }
    });
  });
};
/**
 * 获取 服务器上 当前商户的 版本配置
 */
const get_config_info = async () => {
  // API 对外文档 的 单个 版本的详情 获取地址
  try {
    console.log(FILE_PATH);
    let res = await axios.get(FILE_PATH);
    let { data } = res;
    if (data) {
      //此处1 应该是配置的与后台相对应
      get_css_config(data.css);
    }
  } catch (error) {
    console.log("获取 服务器上 当前商户的 版本配置 出错");
  }
};
if (ENABLE_TEST) {
  get_css_config({
    global: {
      test: 1,
    },
    component: {
      activity: { test: 1 },
      analysis: { test: 1 },
      chatroom: { test: 1 },
      match: { test: 1 },
      media: { test: 1 },
      "text-color": { test: 1 },
    },
  });
} else {
  // 获取 服务器上 当前商户的 版本配置
  get_config_info();
}
