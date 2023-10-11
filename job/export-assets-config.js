/**
 * 合并输出商户配置
 */
import axios from "axios";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors"
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
import final_assets_config from "./output/assets/config.json" assert { type: "json" };
const PROJECT_NAME = final_merchant_config.project
console.log(colors.bgRed("export-assets-config.js----------resolve_merchant_config_assets  ----"));
// 商户配置 输出目录
let write_folder = "./job/output/assets/";
// 图片输出到项目的 目录
let img_folder = `./public/${PROJECT_NAME}/server-resource/`;
let project_path = `/${PROJECT_NAME}/server-resource/`;//项目index.html 访问图片的路径
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
remove_file(img_folder); //删除输出文件夹
ensure_write_folder_exist(img_folder);
/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const resolve_merchant_config_assets = async ( ) => {
  let assets_obj={}
  let empty_assets_obj={}
for(let theme_key in  final_assets_config){
  let  theme_value= final_assets_config[theme_key]
  for(let assets_key  in theme_value ){
    let url =theme_value[assets_key]
    if(url){
      try {
        const filename = url.split("/").pop();//文件名称
        const local_file_path = img_folder + filename; //文件下载到本地的路径
        const response = await axios.get(url, { responseType: "stream" });
        response.data.pipe(fs.createWriteStream(local_file_path));
        lodash.set(assets_obj ,`${theme_key}.${assets_key}` ,project_path + filename) 
      } catch (error) {
        console.log('获取资源素材出错： ',url);
        lodash.set(empty_assets_obj,`${theme_key}.${assets_key}`,'error')
      }

    }else{
      lodash.set(empty_assets_obj,`${theme_key}.${assets_key}`,'')
    }

  
  }
}
   //输出 文件 
   write_file(write_folder +  'index.json', JSON.stringify(assets_obj))
   write_file(write_folder +  'keys-empty-obj.json', JSON.stringify(empty_assets_obj))
};
resolve_merchant_config_assets()
