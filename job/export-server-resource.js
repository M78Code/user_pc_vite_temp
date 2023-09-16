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
let write_folder = "./job/output/assets";
let file_path = `${write_folder}/index.js`;

// 图片输出到项目的 目录
let img_folder = `./public/${PROJECT_NAME}/server-resource/`;
let project_path = `/public/${PROJECT_NAME}/server-resource/`;//项目index.html 访问图片的路径


//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
remove_file(img_folder); //删除输出文件夹

/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const download_file_to_local = async (srcs = {}) => {
  try {
    //确保配置 输出目录存在
    ensure_write_folder_exist(img_folder);
    const img_url_theme_map = {};
    Object.entries(srcs).map(([key, themes]) => {
      img_url_theme_map[key] = {};
      Object.entries(themes).forEach(async ([theme, url]) => {
        const filename = url.split("/").pop();//文件名称
        const local_file_path = img_folder + url.split("/").pop(); //文件下载到本地的路径
        //对应本地项目路径
        img_url_theme_map[key][theme] = project_path + filename; //相对于项目的文件路径
        try {
          //读取文件下载到本地
          const response = await axios.get(url, { responseType: "stream" });
          response.data.pipe(fs.createWriteStream(local_file_path));
        } catch (error) { }
      });
    });
    //素材配置写入本地 
    let str = `export default  ${JSON.stringify(img_url_theme_map)}`
    write_file(file_path, str);
  } catch (error) {
    console.log("下载文件错误");
  }
};


// 获取 服务器上 当前商户的 版本配置
download_file_to_local(final_merchant_config.assets);

