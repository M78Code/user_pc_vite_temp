
// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.json";
import { get } from "lodash";
const { CURRENT_ENV } = window.BUILDIN_CONFIG;
const config = {
    default: "h5-sport-active-image",
    // local_dev: "pc-left-menu-bg-image",
    // local_test: "",
    // local_ylcs: "pc-left-menu-bg-image",
    // idc_pre: "pc-left-menu-bg-image",
    // idc_sandbox: "pc-left-menu-bg-image",
    // idc_lspre: "pc-left-menu-bg-image",
    // idc_online: "pc-left-menu-bg-image",

};
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css_obj({ position, theme  ,path  }) {
    // 当前主题的 服务端配置
     let theme_config=   server_resource[theme] ||{}
      //最终资源键 计算
      let final_key = ''  
      final_key =   config[CURRENT_ENV] || config['default']
     //从打包的 环境拿 图片地址
     let url =theme_config[final_key] ||'';
     return  path?{url}:{
        "background-image": `url(${url})`,
        "background-position-y": `calc(var(--per)*${position})`,
    };
}

export { compute_css_obj };