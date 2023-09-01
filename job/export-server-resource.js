/**
 * 合并输出商户配置
 */
import axios from "axios";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
import fs from "node:fs";

 
// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
const PROJECT_NAME = final_merchant_config.project

console.log("export-server-resource----------server-resource ----");
console.log("process.argv----------------------0---");
console.log("process.argv----------------------1---");
// console.log('MERCHANT-CONFIG-VERSION  2:  ', process.env);
console.log("process.argv----------------------3---");

// 商户配置 输出目录
let write_folder = "./job/output/merchant";
let file_path = `${write_folder}/server-resource.json`;

// 图片输出到项目的 目录
let img_folder = `./project/${PROJECT_NAME}/public/server-resource/`;
let project_path = `public/server-resource/`;//项目index.html 访问图片的路径

//开启 ，关闭本地测试  ,这个 上线必须设置false
let ENABLE_TEST = false;

//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
remove_file(img_folder); //删除输出文件夹

/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const download_file_to_local = async (srcs) => {
  try {
    //确保配置 输出目录存在
    ensure_write_folder_exist(img_folder);
    const img_url_theme_map = {};
    Object.entries(srcs).map(([key, themes]) => {
      img_url_theme_map[key] = {};
      Object.entries(themes).forEach(async ([theme, url]) => {
        const filename = img_folder + url.split("/").pop(); //入本地路径
        img_url_theme_map[key][theme] = project_path+url.split("/").pop(); //写入本地路径
        try {
          //读取文件下载到本地
          const response = await axios.get(url, { responseType: "stream" });
          response.data.pipe(fs.createWriteStream(filename));
        } catch (error) {}
      });
    });
    write_file(file_path, JSON.stringify(img_url_theme_map));
  } catch (error) {
    console.log("下载文件错误");
  }
};
 
if (ENABLE_TEST) {
  download_file_to_local({});
} else {
  // 获取 服务器上 当前商户的 版本配置
  download_file_to_local(final_merchant_config.assets);
}
