/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";
 

import path from "node:path";

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let {BUILD_VERSION ,PROJECT_NAME ,BUILD_DIR_NAME ,BUILD_OUTDIR} = BUILD_VERSION_CONFIG;

// dist\self-use-version\project\yazhou-h5\index.html

// let html_file_path =  `./dist/${BUILD_DIR_NAME}/${BUILD_VERSION}/project/${PROJECT_NAME}/index.html`
let html_file_path =  `./${BUILD_OUTDIR}/project/${PROJECT_NAME}/index.html`

let html_file= fs.readFileSync(html_file_path);

 
 
fs.writeFileSync( `./dist/${BUILD_DIR_NAME}/index.html`,html_file)

console.log('拷贝入口html 完成');

 

 
 
