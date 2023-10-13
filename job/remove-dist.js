/**
 * 删除 服务器上可能的历史版本输出缓存，确保不出错
 */
import colors from "colors" 
import { remove_file } from "./write-folder-file.js";
console.log("----process.argv---", process.argv);
// 代码内 配置的          ，一般是  本地测试 打包指定版本用
// 本次打包的 目录
import BUILD_DIR_CONFIG from "./output/dir/index.js";
let BUILD_DIR_NAME = BUILD_DIR_CONFIG.BUILD_DIR_NAME;
let folder_name = BUILD_DIR_NAME;
//命令行参数 配置的       ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程
let argv_version = (process.argv[2] || "").trim();
//最终计算出的 用于执行脚本的
if (argv_version) {
  folder_name = argv_version;
} else {
  console.log(
    colors.red( `当前  remove-dist  命令未指定 需要删除的 目标目录 ，将 默认执行 删除   ./dist/${folder_name}`)
   
  );
}
let full_path = `./dist/${folder_name}`;
remove_file(full_path);
