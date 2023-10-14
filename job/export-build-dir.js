 /**
  * 创建 本次打包的 客户端版本
  */

 import {ensure_write_folder_exist ,write_file} from "./write-folder-file.js"
 

// console.log(process.argv[2]);
const BUILD_DIR_NAME = ("" + process.argv[2]).trim()  || "spa";



let config ={
  BUILD_DIR_NAME  ,
 
  
}
  let str = `export default  ${ JSON.stringify(config)} `
  // 输出目录
  let write_folder = "./job/output/dir";
    //确保配置 输出目录存在
  ensure_write_folder_exist(write_folder);
  let full_path = `${write_folder}/index.js`;
  write_file(full_path, str);
 
