

import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors";
import {

  write_file,
  remove_file,
} from "../util-and-config/write-folder-file.js";

import {format_date  } from "../util-and-config/util.js"
import {PROJECT_ENTRY_CONFIG} from "../util-and-config/config.js"

import axios from "axios";



let url =  'http://api-doc-server-new.dbsporxxxw1box.com/openapi/getRecentPack2'

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
//本地开发   项目启动配置
//生产打包 会自动删除 此文件 
//客户端模块化 PC,H5 大型项目 商户定制化 专用 ： 
let  DEV_TARGET_VERSION = ''`

const get_recent_pack= async ()=>{

    let {data:{data}} = await axios.get(url) 
 
    recent_pack_config = data
    
    let str = `  ${JSON.stringify(data)} `;
    // 输出目录
    let write_folder = "./job/output/pack";
 
    let full_path = `${write_folder}/recent-pack-2.json`;
    write_file(full_path, str);
    

}




const resolve_recent_pack_config=()=>{

    for( let packingConfigId_key in recent_pack_config){
      let packingRecord  = recent_pack_config[packingConfigId_key]


     let  title_writed =false

      for( let env_key in  packingRecord){

      let record_item =  packingRecord[env_key]

    
  

  
          if(record_item){


            let project_key =  `project_${record_item.project}`


            let project_description = PROJECT_ENTRY_CONFIG[project_key]
      



         if(!title_writed&&project_description){
          result_str +=`\n`
          result_str +=`\n`
          result_str +=`\n`
    
         
          result_str += `//------------  布局配置： ${project_description['value']}   ${project_key}   ${project_description['description']}  --`.padEnd(100,'-') 
          result_str +=`\n` 
          result_str += `//------------  打包配置:  ${record_item['packingConfigId']}   名字：${record_item['packingConfigName']}   备注：${record_item['packingConfigMark'] ||''}  --`.padEnd(100,'-')  
          result_str +=`\n` 
          // result_str += `//------------  打包配置备注:   ${record_item['packingConfigMark']}    --`.padEnd(100,'-')  
          
          // result_str +=`\n`
          title_writed= true   
         }





            result_str +=`
// ${ ENVSTR_MAP[env_key]}    ${ env_key.padEnd(8,' ') }  ${ format_date(new Date(record_item.createdAt).getTime())  }   备注：${   record_item.mark ||''}
// DEV_TARGET_VERSION = "${record_item.base_name}"  `             
                 
         }

      }
       
  

    

    

       
 
    }

}





const write_result=()=>{



    result_str +=`
 
    

//客户端模块化 PC,H5 大型项目 商户定制化  之外的项目 通用   
let DEV_TARGET_ENV=''
//开发
// DEV_TARGET_ENV='dev'
//测试
// DEV_TARGET_ENV='test'
//隔离
// DEV_TARGET_ENV='geli'
//压测
// DEV_TARGET_ENV='mini'
//试玩
// DEV_TARGET_ENV='shiwan'
//生产
DEV_TARGET_ENV='online'




//是否 开启 内部测试  
//是：true 
let DEV_IS_FOR_NEIBU_TEST= true
//否：false
//  DEV_IS_FOR_NEIBU_TEST= false



//是否 开启 BD对接  
//是：true 
let DEV_IS_FOR_BD_DUIJIE= true
//否：false
//  DEV_IS_FOR_BD_DUIJIE= false




export {
  DEV_TARGET_VERSION,
  DEV_TARGET_ENV,
  DEV_IS_FOR_NEIBU_TEST,
  DEV_IS_FOR_BD_DUIJIE 
};

    `
 
    // 输出目录
    let write_folder = "./job/output/pack";
 
    let full_path = `${write_folder}/dev-target-env.js`;
    write_file(full_path, result_str);

    write_file('./dev-target-env.js', result_str);
    

}
await get_recent_pack()

resolve_recent_pack_config()

write_result()

