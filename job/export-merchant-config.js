/**
 * 合并输出商户配置
 */
import axios from "axios";
import { merge_merchant_config } from "./merge-merchant-config.js";
import { ensure_write_folder_exist, write_file } from "./write-folder-file.js";
// 代码内 配置的   商户版本号       ，一般是  本地测试 打包指定版本用
import {
  PROJECT_NAME,
  FILE_PATH,
  MERCHANT_CONFIG_VERSION,
} from "../dev-target-env.js";
console.log("export-merchant-config----------合并输出商户配置-");
console.log("process.argv----------------------0---");
console.log(process.argv);
console.log("process.argv----------------------1---");
console.log(
  "MERCHANT-CONFIG-VERSION  :  ",
  process.env["MERCHANT-CONFIG-VERSION"]
);
// console.log('MERCHANT-CONFIG-VERSION  2:  ', process.env);
console.log("process.argv----------------------3---");

//商户配置的详细信息
let MERCHANT_CONFIG_INFO = {};
// 商户配置 输出目录
let write_folder = "./job/output/merchant";
let file_path = `${write_folder}/config.json`;
//开启 ，关闭本地测试  ,这个 上线必须设置false
let ENABLE_TEST = false;

//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const merge_and_output_final_config = (scg) => {
  let add_obj = {
    MERCHANT_CONFIG_VERSION,
    project: PROJECT_NAME,
    write_file_date: Date.now(),
  };
  MERCHANT_CONFIG_INFO = merge_merchant_config(scg, add_obj);
  write_file(file_path, JSON.stringify(MERCHANT_CONFIG_INFO));
};
/**
 * 获取 服务器上 当前商户的 版本配置
 */
const get_config_info = async () => {
  // API 对外文档 的 单个 版本的详情 获取地址
  try {
    console.log(FILE_PATH)
    let res = await axios.get(FILE_PATH);
    let { data } = res;
    if (data) {
      
      merge_and_output_final_config(data);
    }
  } catch (error) {
    console.log("获取 服务器上 当前商户的 版本配置 出错");
  }
};
if (ENABLE_TEST) {
  merge_and_output_final_config({});
} else {
  // 获取 服务器上 当前商户的 版本配置
  get_config_info();
}
