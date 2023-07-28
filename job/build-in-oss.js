
/**
 *
 * 当前 环境的OSS 文件写入 html 头部
 * 防止 源站OSS 文件被攻击用户进不来
 */






let  oss_dev=''
let  oss_test=''
let  oss_lspre=''
let  oss_play=''
let  oss_mini=''
let  oss_prod=''


try { oss_dev= require("./public/oss/dev.json")} catch (error) { }


  try { oss_test=require("./public/oss/test.json")} catch (error) { }
  try { oss_lspre=require("./public/oss/lspre.json")} catch (error) { }
  try { oss_play=require("./public/oss/play.json")} catch (error) { }
  try { oss_mini=require("./public/oss/mini.json")} catch (error) { }
  try { oss_prod=require("./public/oss/prod.json")} catch (error) { }


 function compute_build_in_oss_by_current_env(current_env){

   let obj =''


    switch (current_env) {
      case 'local_local': obj =oss_test; break;
      case 'local_dev': obj =oss_dev; break;
      case 'local_ylcs': obj =oss_test; break;
      case 'local_test': obj =oss_test; break;
      case 'idc_lspre': obj =oss_lspre; break;
      case 'idc_pre': obj =oss_play; break;
      case 'idc_sandbox': obj =oss_play; break;
      case 'idc_ylcs': obj =oss_mini; break;
      case 'idc_online': obj =oss_prod; break;

      default: obj =oss_prod;  break;
    }







   return obj



 }


 module.exports = compute_build_in_oss_by_current_env


