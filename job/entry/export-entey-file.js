/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";

import path from "node:path";
import colors from "colors";
import {PROJECT_ENTRY_CONFIG} from "../util-and-config/config.js"
import * as ALL_PROJECT_HTML_CONFIG from "../template-html/index.js"
import {

  write_file,
  copy_file,
  remove_file,
  read_file
} from "../util-and-config/write-folder-file.js";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "../output/version/build-version.js";
let {
  PROJECT_NAME ,
  IS_DEV ,
  BUILD_VERSION,

  PROJECT_ENTRY_CONFIG_KEY,
  BUILD_DIR_NAME,
  BUILD_OUTDIR,
  IS_TOPIC_PROJECT,
  BUILD_STATIC_DIR_PATH,
  BUILD_HTML_FILE_RAW_PATH,
  BUILD_HTML_FILE_TARGET_PATH,
  IS_MAIN_PROJECT,
  IS_MAIN_PROJECT_H5,
  IS_MAIN_PROJECT_PC,
  LOCAL_COMMON_FILE_PREFIX,
  LOCAL_PROJECT_FILE_PREFIX
} = BUILD_VERSION_CONFIG;


//当前项目的 入口配置 
const CURRENT_PROJECT_ENTRY_CONFIG =  PROJECT_ENTRY_CONFIG[PROJECT_ENTRY_CONFIG_KEY]

const {output_project ,output_base ,api_index ,html_config} = CURRENT_PROJECT_ENTRY_CONFIG

/**
 * 
 * 产出  ./src/output/project/index.js
 */
const export_src_output_project_index_file = () => {
  if( output_project){

    let src_path = `./job/template-entry/output-project/${output_project}.js`;
    let target_path =  "./src/output/project/index.js"
 
    copy_file( src_path, target_path);
  }
};


/**
 * 产出  ./src/output/index.js
 */

const export_src_output_index_file = () => {
  // remove_file(`${BUILD_STATIC_DIR_PATH}project/`)
  // console.log('删除原 html 文件 完成');
  // job/template-entry/output-base/template.js
  let index_file_str = ''
  let target_path =  "./src/output/index.js"
  if( output_base){
    let index_base_file_path = `./job/template-entry/output-base/${output_base}.js`;
    let file_str_index = read_file(index_base_file_path);
      index_file_str  = `${file_str_index}`;
  } 
  if(output_project){
    index_file_str+=  `
    //当前项目专用的  
    export * from "./project/index.js"  
    ` 
  }
  index_file_str= index_file_str.trim()
  if(index_file_str){
    write_file( target_path,index_file_str );
  }

};



/**
 * 产出  ./src/api/index.js
 */

const export_api_index_file = () => {
  if( api_index){
    let src_path = `./job/template-entry/api-index/${api_index}.js`;
    let target_path =  "./src/api/index.js"
    copy_file( src_path, target_path);
  }
}






/**
 * 产出  ./index.html
 * 产出  ./project/${PROJECT_NAME}/index.html
 */

const export_html_index_file = () => {

 
  let project_html_config =   ALL_PROJECT_HTML_CONFIG[html_config]
  let all_placeholder = [];

  all_placeholder = Array.from(new Set(all_placeholder));

  let template_file_path = `./job/template-html/template.html`;

  let html_file = read_file(template_file_path).toString();


  // console.log(html_file);
Object.values(project_html_config).map((x) => {
    // console.log(x.placeholder);
    // 匹配替换
    html_file = html_file.replace( x.placeholder, x.content);
});
 

 

let output_file_path=''
let output_file_path_dev= './index.html'
let output_file_path_prod= `./project/${PROJECT_NAME}/index.html`



//删除旧的  双删 


remove_file(output_file_path_dev)
remove_file(output_file_path_dev)

if(IS_DEV){
    output_file_path=output_file_path_dev

  let main_js_path = `./project/${PROJECT_NAME}/main.js`

  let     main_js_path_placeholder=  `<script type="module" src="${main_js_path}"></script>`

  html_file = html_file.replace('main_js_path_placeholder', main_js_path_placeholder );


  console.log(colors.red(`html 生成路径：  ${output_file_path}`));
}else{

  output_file_path=  output_file_path_prod 

  let main_js_path = `./main.js`

  let     main_js_path_placeholder=  `<script type="module" src="${main_js_path}"></script>`

  html_file = html_file.replace('main_js_path_placeholder', main_js_path_placeholder );


  console.log(colors.red(`html 生成路径：  ${output_file_path}`));
}




 
  fs.writeFileSync(output_file_path, html_file);
 





}


/**
 * 产出  ./job/output/entry/index.js
 */

const export_job_output_entry_index_file=()=>{

  let final_str=''


  if(IS_MAIN_PROJECT){
  // 客户端主要项目
  // ` src/base-${project.includes('pc')?'pc':'h5'}`
  
  let base_path= `src/base-${PROJECT_NAME.includes('pc')?'pc':'h5'}`
  
  final_str=`
  // export * as  PROJECT_STORE from "${base_path}/store";
  export const  PROJECT_STORE={}
  export * as  MITT_TYPES_GLOABLE from "src/core/mitt/module/gloable.js" 
  export * as  MITT_TYPES_BASE from "${base_path}/core/mitt/mitt-keys.js" 
  export * as  MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js" 
  
  `
  
  
  }else{
  // 次要项目 
  
  final_str=`
  // export * as  PROJECT_STORE from "project_path/src/store";
  export const  MITT_TYPES_BASE={}
  export const  PROJECT_STORE={}
  export * as  MITT_TYPES_GLOABLE from "src/core/mitt/module/gloable.js" 
  export * as  MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js" 
  `
  
  
  
  }
 

// 输出目录
let write_folder = "./job/output/entry/";
 

let output_file_path = `${write_folder}index.js`
write_file( output_file_path,  final_str)
  

  
};



/**
 * 产出  ./job/output/css/variables.scss
 */

const export_job_output_css_variables_file=()=>{


// 商户配置 输出目录
let write_folder = "./job/output/css/";

 

/**
 * 生成顶层注入的 scss 变量
 */

const str = `
  

$primary   : #1976D2;
$secondary : #26A69A;
$accent    : #9C27B0;

$dark      : #1D1D1D;
$dark-page : #121212;

$positive  : #21BA45;
$negative  : #C10015;
$info      : #31CCEC;
$warning   : #F2C037;


$SCSSCOMMONPATH   : "${LOCAL_COMMON_FILE_PREFIX}";
$SCSSPROJECTPATH  : "${LOCAL_PROJECT_FILE_PREFIX}";
  
  `;

write_file(write_folder + "variables.scss", str);




}





export_src_output_project_index_file();
export_src_output_index_file();
export_api_index_file();
export_html_index_file();
export_job_output_entry_index_file();
export_job_output_css_variables_file();