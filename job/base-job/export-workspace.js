import {
    workspace,
    compute_full_path,
    write_file
  } from "../util-and-config/write-folder-file.js";
  let config_obj={
    workspace
  }
//  输出目录
let write_folder = "./job/output/workspace/";
// compute_full_path(compute_full_path(write_folder))
//输出 文件  
write_file(write_folder + "index.js", 'export default '+ JSON.stringify(config_obj));
