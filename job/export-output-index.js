/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";
 

import path from "node:path";
import { ensure_write_folder_exist, write_file ,remove_file} from "./write-folder-file.js";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let {BUILD_VERSION ,PROJECT_NAME ,BUILD_DIR_NAME ,BUILD_OUTDIR ,IS_TOPIC_PROJECT ,
    BUILD_STATIC_DIR_PATH,
    BUILD_HTML_FILE_RAW_PATH,
    BUILD_HTML_FILE_TARGET_PATH,
    IS_MAIN_PROJECT,
    IS_MAIN_PROJECT_H5,
    IS_MAIN_PROJECT_PC
} = BUILD_VERSION_CONFIG;



if(!IS_MAIN_PROJECT){ return  }

let common_file_path = ''

if(IS_MAIN_PROJECT_H5){
    common_file_path = './src/output/h5-pc/h5.js'
}

if(IS_MAIN_PROJECT_PC){
    common_file_path = './src/output/h5-pc/pc.js'
}

let  file_str_common= fs.readFileSync(common_file_path);



let project_file_path = `./src/output/project/${PROJECT_NAME}.js`



let  file_str_project= fs.readFileSync(project_file_path);

let file_str = `
${file_str_common} 

${file_str_project}

`

IS_MAIN_PROJECT_H5
// src\output\h5-pc\h5.js

write_file( './src/output/h5-pc/index.js' ,file_str)  
// console.log('拷贝入口html 完成');

// remove_file(`${BUILD_STATIC_DIR_PATH}project/`)
// console.log('删除原 html 文件 完成');