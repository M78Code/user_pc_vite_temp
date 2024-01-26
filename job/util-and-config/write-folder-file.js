/**
 * 文件 操作 封装
 */
import * as fs from "node:fs";
import  fsPromises  from 'node:fs/promises';
import colors from "colors"
import path from "node:path"
import { fileURLToPath,pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
 
export const  workspace = path.resolve( __dirname, '../../');

 

/**
 *  带工作空间的全路径
 * @param {*} subpath 
 * @returns 
 */

export const compute_full_path =( subpath)=>{
  

  let full_path=   path.resolve(workspace ,  subpath)
 
 
  console.log("计算所得： 全路径：  ",full_path);
  return full_path
 
 }
 

 

// 输出目录
// let write_folder = "./job/output/env";
/**
 * 确保  输出目录存在
 */
export const ensure_write_folder_exist = (write_folder) => {

  if(!path.isAbsolute(write_folder)){

    write_folder =  compute_full_path(write_folder)


  }

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
export const write_file = (raw_file_path, str,log=true) => {
   //带工作空间的全路径
  let file_path = compute_full_path(raw_file_path)
  //目录名字 
  let dir_path= path.dirname(file_path)

  //确保目录存在
  ensure_write_folder_exist(dir_path);
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
export const remove_file = (raw_file_path) => {
     //带工作空间的全路径
  let file_path = compute_full_path(raw_file_path)
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
 export const copy_file =(raw_src_path,raw_target_path,log=true)=>{
     //带工作空间的全路径
  let src_path = compute_full_path(raw_src_path)
   //带工作空间的全路径
  let target_path = compute_full_path(raw_target_path)


    //目录名字 
    let target_dir_path= path.dirname(target_path)

    //确保目录存在
    ensure_write_folder_exist(target_dir_path);

   // 文件内容
  let  file_content= fs.readFileSync(src_path);
  write_file( target_path ,file_content,log)
}



 

// 复制文件夹
export  const copy_dir = function(raw_src,raw_dist){
   //带工作空间的全路径
  let src = compute_full_path(raw_src)
   //带工作空间的全路径
  let dist = compute_full_path(raw_dist)
//确保目录存在
  ensure_write_folder_exist(dist);

  var paths = fs.readdirSync(src)
  paths.forEach( p => {
    var _src = src + '/' +p;
    var _dist = dist + '/' +p;
    var stat = fs.statSync(_src)
    if(stat.isFile()) {// 判断是文件还是目录
      copy_file(_src,_dist,false)
    } else if(stat.isDirectory()) {
      copy_dir(_src, _dist)// 当是目录是，递归复制
    }
  })
}




/**
 * 遍历指定目录下的所有 .scss/.js文件
 * @param {*} raw_dir
 */
export  const get_all_file = function (raw_dir) {
     //带工作空间的全路径
     let dir = compute_full_path(raw_dir)

  let res = [];
  function traverse(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        traverse(pathname);
      } else {
        if (pathname.endsWith(".js")) {
          res.push(pathname);
        }
      }
    });
  }
  traverse(dir);
  return res;
};




 


export const read_file=(file_path)=>{
   //带工作空间的全路径
   let full_path= compute_full_path(file_path)
   //文件内容 
   let file_content= fs.readFileSync(full_path)

   return file_content

}



export const import_json_data =  (json_data_path) => {
  // const  { default:json_data} = await import( json_data_path, { assert: { type: "json" }, } );
  //  return json_data


     //带工作空间的全路径
     let full_path = compute_full_path(json_data_path)

  // const json_data = JSON.parse( await readFile(new URL(json_data_path, import.meta.url)) );
  // const json_data = JSON.parse( await fs.readFile(  new URL(pathToFileURL(file_path ) )  ) );

  // console.log(' pathToFileURL(file_path ) ----', pathToFileURL(file_path ) );

  //文件内容 
  let file_content= fs.readFileSync(full_path)


  // const json_data = JSON.parse( await fsPromises.readFile(  pathToFileURL(file_path ).href  )    );
  const json_data = JSON.parse(  file_content  );
  return json_data;
};

