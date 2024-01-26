 

import * as fs from "node:fs";
/**
 * 删除文件 或者文件夹
 * @param {*} file_path
 */
  const remove_file = (file_path) => {
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
  
 
 
console.log("----process.argv---");

 
 
 
 
remove_file(`./package-lock.json`);
remove_file(`./node_modules/`);
