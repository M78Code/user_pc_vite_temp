/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";

import path from "node:path";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let {
  BUILD_VERSION,
  PROJECT_NAME,
  BUILD_DIR_NAME,
  BUILD_OUTDIR,
  IS_TOPIC_PROJECT,
  BUILD_STATIC_DIR_PATH,
  BUILD_HTML_FILE_RAW_PATH,
  BUILD_HTML_FILE_TARGET_PATH,
  IS_MAIN_PROJECT,
  IS_MAIN_PROJECT_H5,
  IS_MAIN_PROJECT_PC,
} = BUILD_VERSION_CONFIG;


/**
 * 
 * 产出  ./src/output/project/index.js
 */
const export_output_project_index_file = () => {
  if (IS_MAIN_PROJECT) {
    let common_file_path = "";
    if (IS_MAIN_PROJECT_H5) {
      common_file_path = "./src/output/project/common/h5-common.js";
    }
    if (IS_MAIN_PROJECT_PC) {
      common_file_path = "./src/output/project/common/pc-common.js";
    }
    let file_str_common = fs.readFileSync(common_file_path);
    let project_file_path = `./src/output/project/module/${PROJECT_NAME}.js`;
    let file_str_project = fs.readFileSync(project_file_path);
    let project_file_str = `
  //当前项目的强相关的一些入口 ，当前项目专用的，理论上 运行A 项目 不会 因为这里 引入 B 项目的文件 ，例如 运行H5，却加载了PC 的组件
  ${file_str_common} 
  ${file_str_project}
  `;

    write_file("./src/output/project/index.js", project_file_str.trim());
  }
};

export_output_project_index_file()

/**
 * 产出  ./src/output/index.j
 */

const export_output_index_file = () => {
  // remove_file(`${BUILD_STATIC_DIR_PATH}project/`)
  // console.log('删除原 html 文件 完成');
  // job\template-entry\output-index\template.js
  let index_temp_file_path = `./job/template-entry/output-index/template.js`;
  let index_file_path = `./src/output/index.js`;
  let file_str_index = fs.readFileSync(index_temp_file_path);
  let index_file_str = `${file_str_index}`;
  if (IS_MAIN_PROJECT) {
    index_file_str = `  ${file_str_index}
//当前项目专用的   
export * from "./project/index.js"
`;
  } else {
  }
  write_file(index_file_path, index_file_str.trim());
};

export_output_index_file();
