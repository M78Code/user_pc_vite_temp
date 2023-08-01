
/**
 * 输出 全量版本  开关 配置
 */

 



import * as fs from "node:fs";

import {ensure_write_folder_exist} from "./write-folder-file.js"




console.log('----process.argv---',process.argv);

// 代码内 配置的          ，一般是  本地测试 打包指定版本用
let is_full_version = false;

//命令行参数 配置的       ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程
let argv_version = ( process.argv[2] || "" ).trim();


//最终计算出的 用于执行脚本的   
if(argv_version){
    is_full_version =  (argv_version=='full')
}

// 商户配置 输出目录
let write_folder = "./job/output/version";
  //确保配置 输出目录存在
  ensure_write_folder_exist(write_folder);

//配置
  let config={
    is_full_version
  }

  let full_path = `${write_folder}/full-version-config.js`;
  let str=  `export default  `+ JSON.stringify(config)

  fs.writeFileSync(full_path,str );

