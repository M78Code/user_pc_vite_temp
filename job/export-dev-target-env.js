

import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";

import {format_date  } from "./util.js"
import {PROJECT_ENTRY_CONFIG} from "./config.js"

import axios from "axios";



let url =  'http://api-doc-server-new.sportxxxw1box.com/openapi/getRecentPack'

let recent_pack_config={}


 const ENVSTR_MAP = {
    dev: "开发环境",
    test: "测试环境",
    geli: "隔离环境",
    mini: "mini环境",
    shiwan: "试玩环境",
    online: "生产环境",
  };
let result_str= `
//本地开发 目标项目
 
// 这里不一般配置为空 
let  DEV_TARGET_VERSION = ''`

const get_recent_pack= async ()=>{

    let {data:{data}} = await axios.get(url) 
 
    recent_pack_config = data
    
    let str = `  ${JSON.stringify(data)} `;
    // 输出目录
    let write_folder = "./job/output/pack";
    //确保配置 输出目录存在
    ensure_write_folder_exist(write_folder);
    let full_path = `${write_folder}/recent-pack.json`;
    write_file(full_path, str);
    

}




const resolve_recent_pack_config=()=>{

    for( let project_key in recent_pack_config){
       
  
    let project_description = PROJECT_ENTRY_CONFIG[project_key]
    
    result_str +=`\n`
    result_str +=`\n`
   
    
    result_str += `//------------------------  ${project_description ['description']}   ${project_description ['value']}   --`.padEnd(100,'-')  
      
    result_str +=`\n`
        let project_config = recent_pack_config[project_key]

       

        for(let env_key in  project_config){
         let item = project_config[env_key]
         if(item){
            result_str +=`
// ${ ENVSTR_MAP[env_key]}      ${ env_key.padEnd(8,' ') }   ${ format_date(new Date(item.createdAt).getTime())  }
// DEV_TARGET_VERSION = "${item.base_name}"  `             
                 
         }
 
        }
    }

}





const write_result=()=>{



    result_str +=`
    
// 其他项目 非客户端H5 PC 项目 专用的  
let DEV_TARGET_ENV=''
//开发
// DEV_TARGET_ENV='dev'
//测试
// DEV_TARGET_ENV='test'
//隔离
// DEV_TARGET_ENV='geli'
// //压测
// DEV_TARGET_ENV='mini'
// //试玩
// DEV_TARGET_ENV='shiwan'
// //生产
DEV_TARGET_ENV='online'



//是否是用于内部测试  是：true ，否：false

let DEV_IS_FOR_NEIBU_TEST= true


//  DEV_IS_FOR_NEIBU_TEST= false
export {
 
 
  DEV_TARGET_VERSION,
  DEV_TARGET_ENV,
  DEV_IS_FOR_NEIBU_TEST
 
 
};

    `
 
    // 输出目录
    let write_folder = "./job/output/pack";
    //确保配置 输出目录存在
    ensure_write_folder_exist(write_folder);
    let full_path = `${write_folder}/dev-target-env.js`;
    write_file(full_path, result_str);

    write_file('./dev-target-env.js', result_str);
    

}
await get_recent_pack()

resolve_recent_pack_config()

write_result()

