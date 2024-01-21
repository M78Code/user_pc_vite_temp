/**
 * 文件 操作 封装
 */
import * as fs from "node:fs";
import colors from "colors"
import path from "node:path"
// 输出目录
// let write_folder = "./job/output/env";
/**
 * 确保  输出目录存在
 */
export const ensure_write_folder_exist = (write_folder) => {
  console.log('write_folder-',write_folder);
  let is_exist = fs.existsSync(write_folder);
  if (is_exist) {
    console.log( colors.red(`${write_folder}-----文件夹已存在----  `) );
  } else {
    try {
      // 创建文件夹
      fs.mkdirSync(write_folder, { recursive: true });
      console.log(colors.green(`创建文件夹   ${write_folder} 完成`));
    } catch (err) {
      console.log(`创建文件夹   ${write_folder}  出错`, err);
    }
  }
};
/**
 * 创建文件
 * @param {*} file_path
 * @param {*} str
 */
export const write_file = (file_path, str,log=true) => {
  try {
    // 创建文件
    fs.writeFileSync(file_path, str);
   log &&console.log(colors.green(`写入文件   ${file_path}  完成`));
  } catch (err) {
    console.log(`写入文件   ${file_path}  出错`, err);
  }
};
/**
 * 删除文件 或者文件夹
 * @param {*} file_path
 */
export const remove_file = (file_path) => {
  try {
    let stats = fs.existsSync(file_path);
    // console.log("stats---------", stats);
    if (stats) {
      console.log(`删除文件  ${file_path} 文件已存在 将进行删除-----`);
      fs.rmSync(file_path, { recursive: true, force: true });
    } else {
      console.log(`删除文件  ${file_path} 文件不存在  -----`);
    }
  } catch (error) {
    console.log(`删除文件 ${file_path}  出错 ：`, error);
  }
};


 


 
 
 // 复制文件
 const copyFile =(src_path,target_path,log=true)=>{
  let  file_content= fs.readFileSync(src_path);
  write_file( target_path ,file_content,log)
}

 
 

// 复制文件夹
export  const copyDir = function(src,dist){

  ensure_write_folder_exist(dist);//创建目录

  var paths = fs.readdirSync(src)
  paths.forEach( p => {
    var _src = src + '/' +p;
    var _dist = dist + '/' +p;
    var stat = fs.statSync(_src)
    if(stat.isFile()) {// 判断是文件还是目录
      copyFile(_src,_dist,false)
    } else if(stat.isDirectory()) {
      copyDir(_src, _dist)// 当是目录是，递归复制
    }
  })
}