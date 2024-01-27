import BUILDIN_CONFIG from "../output/env/index.js";
import { read_file } from "../util-and-config/write-folder-file.js";

const { htmlVariables = {} } = BUILDIN_CONFIG;


/****
 * 
 * 
 * 重要事情说五遍：
 * 
 * 严禁动默认配置 ，有需要找 jinnian ,私自修改不论对错  ，都进行罚款 ！
 * 严禁动默认配置 ，有需要找 jinnian ,私自修改不论对错  ，都进行罚款 ！
 * 严禁动默认配置 ，有需要找 jinnian ,私自修改不论对错  ，都进行罚款 ！
 * 严禁动默认配置 ，有需要找 jinnian ,私自修改不论对错  ，都进行罚款 ！
 * 严禁动默认配置 ，有需要找 jinnian ,私自修改不论对错  ，都进行罚款 ！
 * 
 */

export const default_content = {};
// 占位符常量
export const placeholder_const = {
  meta1: "meta1_html_placeholder",
  style1: "style1_html_placeholder",
  script1: "script1_html_placeholder",
  script2: "script2_html_placeholder",
  script3: "script3_html_placeholder",
  script4: "script4_html_placeholder",
  script5: "script5_html_placeholder",
  script6: "script6_html_placeholder",
  script7: "script7_html_placeholder",
};

// 元信息  meta   代码块
default_content.meta1_html_placeholder_default_content = `
<meta name="msapplication-tap-highlight" content="no" />

<meta name="apple-mobile-web-app-capable" content="no" />
<meta name="hid-api" content="%VITE_APP_hidApi%" />
<!-- <meta name="apple-mobile-web-app-capable" content="yes" /> -->
<!-- uc强制竖屏 -->
<meta name="screen-orientation" content="portrait" />
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait" />
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes" />
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true" />
<!-- UC应用模式 -->
<meta name="browsermode" content="application" />
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app" />
<!-- windows phone 点击无高光  -->
<meta name="msapplication-tap-highlight" content="no" />
`;
//  样式   css 代码块
default_content.style1_html_placeholder_default_content = "";

// 头部    js  代码块
default_content.script1_html_placeholder_default_content = "";
// 底部    js   代码块
default_content.script2_html_placeholder_default_content = "";
// window.BUILDIN_CONFIG   js代码块
default_content.script3_html_placeholder_default_content = `
<script>
window.BUILDIN_CONFIG = ${JSON.stringify(BUILDIN_CONFIG)}
</script>
`;

// url 参数解析  js 代码块
default_content.script4_html_placeholder_default_content = `
<script>
${read_file("./public/other-assets/lib/js/url-param.js")}
</script>
`;

//    待定  代码块
default_content.script5_html_placeholder_default_content = ``;
 

// GA 埋点     js  代码块
default_content.script6_html_placeholder_default_content = ` <script async type="text/javascript" src="${htmlVariables.hidApi}" ></script>  `;

//计划放入 pb  crypto-js    js  代码块
default_content.script7_html_placeholder_default_content = ` `;














/**
 * 计算默认配置 
 * @returns 
 */
const normalize_default_html_config = () => {
  let obj = {};

  for (let i in placeholder_const) {
    obj[i] = {
      placeholder: placeholder_const[i],
      content: default_content[`${placeholder_const[i]}_default_content`],
    };
  }

  return obj;
};





//  默认配置
export const default_config = normalize_default_html_config();




/**
 *  html 配置 标准化方法 浅拷贝 覆写 
 * @param {*} config
 */
export const normalize_html_config = (raw_config = {}) => {
  let config =Object.assign({},default_config,raw_config)
  return config;
};
