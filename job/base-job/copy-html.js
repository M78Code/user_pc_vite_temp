/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";
 

import path from "node:path";
import {  write_file ,remove_file ,read_file} from "../util-and-config/write-folder-file.js";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "../output/version/build-version.js";
let {BUILD_VERSION ,PROJECT_NAME ,BUILD_DIR_NAME ,BUILD_OUTDIR ,IS_TOPIC_PROJECT ,
    BUILD_STATIC_DIR_PATH,
    BUILD_HTML_FILE_RAW_PATH,
    BUILD_HTML_FILE_TARGET_PATH
} = BUILD_VERSION_CONFIG;

let html_file=  read_file(BUILD_HTML_FILE_RAW_PATH);







write_file( BUILD_HTML_FILE_TARGET_PATH ,html_file)  
console.log('拷贝入口html 完成');

remove_file(`${BUILD_STATIC_DIR_PATH}project/`)
console.log('删除原 html 文件 完成');