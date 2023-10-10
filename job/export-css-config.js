/**
 * 合并输出商户配置
 */

import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";

// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
import final_css_config from "./output/css/config.json" assert { type: "json" };
import final_server_keys from "./output/css/keys-server.json" assert { type: "json" };
const PROJECT_NAME = final_merchant_config.project;

console.log("export-css-config.js----------  ----");
 

// 商户配置 输出目录
let write_folder = "./job/output/css/";
 

//本地scss目录
let scss_folder = `./project/${PROJECT_NAME}/src/css/variables/`;
// let scss_folder = `./project/${PROJECT_NAME}/src/css/`;

//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);

/**
 * 遍历指定目录下的所有 .scss/.js文件
 * @param {*} dir
 */
const getAllFile = function (dir) {
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
const all_global_scss = getAllFile(scss_folder + "global");
const all_component_scss = getAllFile(scss_folder + "component");

 /**
  * 计算本地 配置
  * @returns
  */
const compute_local_css_keys = async ( ) => {
  let css_keys=[]
  let css_keys_obj = {
    global: {},
    component: {},
  };
  function read_path_keys(file_path, key) {
    return import("../" + file_path.replace(/\\/g, "/")).then((res) => {
      const file_name = file_path.split(/[\\/]/).pop().replace(".js", "");
      if (res.default) {
        let keys = Object.keys(res.default)
        css_keys_obj[key][file_name] =keys

        css_keys= css_keys.concat(keys)
      }
    });
  }
  //globals
  const globals = all_global_scss.map(v => read_path_keys(v, "global"));
  //component
  const components = all_component_scss.map(v => read_path_keys(v, "component"));
  await Promise.all(globals.concat(components));
  return  {
    css_keys,
    css_keys_obj,
  };
};

/**
 * 生成每种主题 的CSS配置
 */

const compute_theme_css_config=(css_keys_obj)=>{

let themes= Object.keys(final_css_config)

let final_obj={}
let empty_css_obj={}

themes.map(theme=>{
 

  for(let level in css_keys_obj){
    // global component

    for(let module in css_keys_obj[level]){
      let module_obj =css_keys_obj[level][module]||{}

       for(let module_key of module_obj){
        let value=   final_css_config[theme][module_key] ||''
        if(!value){
         
          lodash.set(empty_css_obj,`${theme}.${level}.${module}.${module_key}`,value)
        }
        lodash.set(final_obj,`${theme}.${level}.${module}.${module_key}`,value)



       }


    }

  }

})

write_file(
    
  write_folder+"index.json",
  JSON.stringify(final_obj)
);
write_file(
    
  write_folder+"keys-empty-obj.json",
  JSON.stringify(empty_css_obj)
);

}

/**
 * 生成 差量文件
 */

const compute_diff_keys=(css_keys)=>{

  let server_single = lodash.pullAll(final_server_keys ,css_keys)
  let local_single = lodash.pullAll(css_keys,final_server_keys )

  let data={
    server_keys_length:final_server_keys.length,
    local_keys_length:css_keys.length,
    server_single,
    server_single_length:server_single.length,
    local_single,
    local_single_length: local_single.length
  }
  write_file(
    
      write_folder+"keys-diff.json",
      JSON.stringify(data)
    );
}




/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const resolve_merchant_config_css = async () => {



    const   {
      css_keys,
      css_keys_obj,
    }= await compute_local_css_keys();

    write_file(
    
      write_folder+"keys-local.json",
      JSON.stringify(css_keys)
    );
    write_file(
    
      write_folder+"keys-local-obj.json",
      JSON.stringify(css_keys_obj)
    );
  //生成每种主题 的CSS配置
    compute_theme_css_config(css_keys_obj)
  // 生成 差量文件
    compute_diff_keys(css_keys)


 

 
};

 
resolve_merchant_config_css()