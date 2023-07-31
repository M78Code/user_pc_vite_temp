/**
 * 确保文件夹存在 的 插件方法
 */


import * as fs from "node:fs";


// 输出目录
// let write_folder = "./job/output/env";
/**
 * 确保配置 输出目录存在
 */
export const ensure_write_folder_exist = (write_folder) => {
  let is_exist = fs.existsSync(write_folder)
      if (is_exist) {
          console.log( `${write_folder}-----文件夹已存在----  ` );  
      }else{
            // 创建文件夹
        fs.mkdir(write_folder, { recursive: true }, (err) => {
          if (err) {
            console.log("创建文件夹 出错 ", err);
          }
          console.log("创建文件夹   完成");
        });
      }
  };

 