/**
 * 输出最终的 环境配置 ，用于验证 ,也用于初始化生成
 */

 

import {compute_final_config} from "./final-config"

import * as fs from "node:fs";
import {ensure_write_folder_exist} from "./write-folder.js"


//  个人   开发环境
// current_env= 'local_local'
// 局域网  开发环境
// current_env= 'local_dev'
// 局域网  压力测试环境
// current_env = "local_ylcs";
// 局域网  测试环境
// current_env = "local_test";
// IDC  预发布
// current_env = 'idc_pre'
// IDC 试玩环境
// current_env = "idc_sandbox";
// IDC  隔离预发布
// current_env = 'idc_lspre'
// IDC  生产环境
// current_env = 'idc_online'
// IDC 微型测试环境
// current_env = 'idc_ylcs'


let env_arr=[
  "local_local",
  "local_dev",
  "local_test",
  "idc_lspre",
  "idc_pre",
  "idc_sandbox",
  "idc_ylcs",
  "idc_online"
]


let obj ={ }

env_arr.map(x=>{
  obj[x]={
    current_env:x,
    config: compute_final_config(x)
  }
})


 


// 输出目录
let write_folder = "./job/output/env";
 

  //确保配置 输出目录存在
ensure_write_folder_exist(write_folder);

env_arr.map(x=>{

  let full_path = `${write_folder}/${x}.js`;
  let str=  `export default  `+ JSON.stringify(obj[x])

  fs.writeFileSync(full_path,str );

})






