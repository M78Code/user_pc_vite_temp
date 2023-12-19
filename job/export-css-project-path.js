/**
 * 合并输出商户配置
 */

import colors from "colors";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
const { LOCAL_COMMON_FILE_PREFIX,LOCAL_PROJECT_FILE_PREFIX } = BUILD_VERSION_CONFIG;

console.log(colors.bgRed("export-css-project-path.js----------  ----"));

// 商户配置 输出目录
let write_folder = "./job/output/css/";

//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);

/**
 * 生成顶层注入的 scss 变量
 */
const write_top_scss_variables = () => {
  const str = `
  

$primary   : #1976D2;
$secondary : #26A69A;
$accent    : #9C27B0;

$dark      : #1D1D1D;
$dark-page : #121212;

$positive  : #21BA45;
$negative  : #C10015;
$info      : #31CCEC;
$warning   : #F2C037;


$SCSSCOMMONPATH   : "${LOCAL_COMMON_FILE_PREFIX}";
$SCSSPROJECTPATH  : "${LOCAL_PROJECT_FILE_PREFIX}";
  
  `;

  write_file(write_folder + "variables.scss", str);
};

write_top_scss_variables();
