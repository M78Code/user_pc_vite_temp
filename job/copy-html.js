/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";
 

import path from "node:path";

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let BUILD_VERSION = BUILD_VERSION_CONFIG.BUILD_VERSION;
// 本次打包的 目录
import BUILD_DIR_CONFIG from "./output/dir/index.js";
let BUILD_DIR_NAME = BUILD_DIR_CONFIG.BUILD_DIR_NAME;

import final_base_info from "./output/base-info/index.json" assert { type: "json" };

// 递归创建文件夹
const mkdir = function(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdir(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 复制文件
const copyFile = function(src,copy){
  mkdir(path.dirname(copy));//创建目录
  fs.copyFile(src,copy,function(err){
    if(err) console.log('error')
  })
}

// 复制文件夹
const copyDir = function(src,dist){
  var paths = fs.readdirSync(src)
  paths.forEach( p => {
    var _src = src + '/' +p;
    var _dist = dist + '/' +p;
    var stat = fs.statSync(_src)
    if(stat.isFile()) {// 判断是文件还是目录
      copyFile(_src,_dist)
    } else if(stat.isDirectory()) {
      copyDir(_src, _dist)// 当是目录是，递归复制
    }
  })
}
// dist\self-use-version\project\yazhou-h5\index.html

let html_file_path =  `./dist/${BUILD_DIR_NAME}/${BUILD_VERSION}/project/${final_base_info.project}/index.html`

let html_file= fs.readFileSync(html_file_path);

 
 
fs.writeFileSync( `./dist/${BUILD_DIR_NAME}/index.html`,html_file)

console.log('拷贝入口html 完成');

 

 
 
