
import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 商户版本 最终配置
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let { PROJECT_NAME ,IS_DEV } = BUILD_VERSION_CONFIG;
console.log(colors.bgRed("export-html.js----------   ----"));
import { html_config  } from "./template-html/common-config.js";

 
let project_html_config = html_config[PROJECT_NAME] || {};

let all_placeholder = [];
let all_config = [];

Object.values(html_config).map((x) => {
  all_config = [...all_config, ...Object.values( x)];
});

all_config.map((x) => {
  x.placeholder = x.placeholder.trim()
  x.placeholder && all_placeholder.push(x.placeholder.trim());
});

all_placeholder = Array.from(new Set(all_placeholder));

// console.log('all_placeholder-',all_placeholder);
let template_file_path = `./job/template-html/template.html`;

let html_file = fs.readFileSync(template_file_path);

html_file = html_file.toString()
// console.log(html_file);
Object.values(project_html_config).map((x) => {
  if (x && x.placeholder ) {
 
    // console.log(x.placeholder);
   
    // 匹配替换
    html_file = html_file.replace("" + x.placeholder, x.content||'');
  }
});
all_placeholder.map((x) => {
    html_file = html_file.replace(''+ x, "");
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




if(output_file_path){
  fs.writeFileSync(output_file_path, html_file);
}




 