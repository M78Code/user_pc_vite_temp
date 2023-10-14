 /**
  * 创建 本次打包的 客户端版本
  */



 import {ensure_write_folder_exist ,write_file} from "./write-folder-file.js"

 const IS_DEV = ("" + process.argv[2]).trim() == "dev";

function format_date(value) {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  return `${y}-${m}-${d}-${h}-${mm}-${s}`;
}

const BUILD_VERSION =   format_date(new Date().getTime())
 

const  config ={
 
 
  BUILD_VERSION :IS_DEV?'':BUILD_VERSION,
  IS_DEV,
  IS_PROD: !IS_DEV,
  NODE_ENV:  IS_DEV?'development':"production",
 
}
console.log(config );

let str = `export default  ${JSON.stringify(config)} `
// 输出目录
let write_folder = "./job/output/version";
  //确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);
