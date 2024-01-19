// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.json";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
    default: "eu-menu-sport-bg-image",
};
// const  compute_position = (size,id) =>{
//     // 226 80
//     size = size || 80;
//     const height_l = size/80;
//     // const height = 80/width_l;
//     return `${height_l*id}px`;
// }
/**
 * 拿图片地址 和位置
 * @param {*} param0
 * @returns
 */
function compute_css_obj({position,size, theme,path }) {
    // 当前主题的 服务端配置
     let theme_config=   server_resource[theme] ||{}
      //最终资源键 计算
      let final_key = ''  
      final_key =   config[CURRENT_ENV] || config['default']
     //从打包的 环境拿 图片地址
     let url =theme_config[final_key] ||'';
     return  path?{url}:{
        "background-image": `url(${url})`,
        // "background-position-y": compute_position(size,position),
        "background-position-y": `calc(var(--per)*${position})`,
    };
}

export { compute_css_obj };