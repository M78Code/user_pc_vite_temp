/**
 * 复制打包后的 html 文件到外层目录
 */

import * as fs from "node:fs";

import path from "node:path";
import colors from "colors";
import {PROJECT_ENTRY_CONFIG} from "./config.js"
import {
  ensure_write_folder_exist,
  write_file,
  copy_file,
  remove_file,
} from "./write-folder-file.js";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
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
} = BUILD_VERSION_CONFIG;


//当前项目的 入口配置 
const CURRENT_PROJECT_ENTRY_CONFIG =  PROJECT_ENTRY_CONFIG[PROJECT_ENTRY_CONFIG_KEY]

const {output_project ,output_base ,api_index ,html_config} = CURRENT_PROJECT_ENTRY_CONFIG

/**
 * 
 * 产出  ./src/output/project/index.js
 */
const export_output_project_index_file = () => {
  if( output_project){

    let src_path = `./job/template-entry/output-project/${output_project}.js`;
    let target_path =  "./src/output/project/index.js"
    ensure_write_folder_exist("./src/output/project/")
    copy_file( src_path, target_path);
  }
};


/**
 * 产出  ./src/output/index.js
 */

const export_output_base_file = () => {
  // remove_file(`${BUILD_STATIC_DIR_PATH}project/`)
  // console.log('删除原 html 文件 完成');
  // job/template-entry/output-base/template.js
  let index_file_str = ''
  let target_path =  "./src/output/index.js"
  if( output_base){
    let index_base_file_path = `./job/template-entry/output-base/${output_base}.js`;
    let file_str_index = fs.readFileSync(index_base_file_path);
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

 
  let project_html_config = html_config
  let all_placeholder = [];

  all_placeholder = Array.from(new Set(all_placeholder));

  let template_file_path = `./job/template-html/template.html`;

  let html_file = fs.readFileSync(template_file_path).toString();


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











export_output_project_index_file();
export_output_base_file();
export_api_index_file();
export_html_index_file();