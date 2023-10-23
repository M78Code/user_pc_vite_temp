import { readFile } from "fs/promises";
export const import_json_data = async (json_data_path) => {
  // const  { default:json_data} = await import( json_data_path, { assert: { type: "json" }, } );
  //  return json_data
  const json_data = JSON.parse( await readFile(new URL(json_data_path, import.meta.url)) );
  return json_data;
};

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
const { BUILD_VERSION, PROJECT_NAME } = BUILD_VERSION_CONFIG;















dynamicImportVueConfig



/**
 * 
 * 
 * 
 * 
 import {import_vue_component} from  "src/core/index.js"
const  dynamicImportVueConfig={
  'app-h5':'src/base-h5/components/bet/bet-box-h5-1/bet_mix_box_child1.vue',
  'yazhou-h5':'src/base-h5/components/bet/bet-box-h5-1/bet_mix_box_child2.vue'
}
 
     
const   ComponentName = await  import_vue_component(dynamicImportVueConfig)
 * 
 * @param {*} config 
 */

export const import_vue_component = async ( config )=>{

 
let path = config[PROJECT_NAME] 
const { default: ComponentObj } = await import(path);


return ComponentObj

} 






// --------------------------------
// 所有  目标环境标识
export const ALL_ENV_ARR = [
  "local_local",
  "local_dev",
  "local_test",
  "idc_lspre",
  "idc_pre",
  "idc_sandbox",
  "idc_ylcs",
  "idc_online",
];
