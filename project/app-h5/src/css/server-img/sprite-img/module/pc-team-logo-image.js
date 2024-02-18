// label/key 对应后台 id/name名字
// img-bg-menu-live 对应输出的css名称
// 
import server_resource from "app/job/output/assets/index.json";
// const server_resource = {}
import { get_server_file_path } from "src/core/file-path/file-path.js";
import lodash from "lodash";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;
const config = {
  default:"pc-team-logo-image",
};
// x y 
// const item = {
//   item_0_8: [0,8], //下标从0开始
//   item_1: 0,
// };
 // 字母顺序
 const item = {A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,}
 // item2 专为详情页字母图标位置定制，其他地方慎用，如有冲突建议另建方法区分(此方法存在少许偏差暂时没有更好方法解决)
 const item2 = {A:0,B:3.9,C:7.9,D:11.9,E:15.8,F:19.7,G:23.7,H:27.6,I:31.6,J:35.5,K:39.5,L:43.4,M:47.4,N:51.3,O:55.3,P:59.2,Q:63.2,R:67.2,S:71.1,T:75.1,U:79,V:83,W:86.9,X:90.9,Y:94.8,Z:98.7,}
 // 0 3.9 7.9 11.9 15.8 19.7  23.7  27.6  31.6  35.5  39.5  43.4  47.4  51.3 55.3  59.2  63.2  67.2  71.1 75.1  79  83  86.9  90.9  94.8  98.7
/**
 * 根据item 计算雪碧图位置
 * @param {*} position 下标从0开始
 * @returns
 */
function compute_position(position) {
  // console.log(position,'position');
  const top = 0; // 雪碧图 距离顶部的 空白距离
  const left = 0; //左侧
  const width = 0; //表示是 横 向
  const x_space = 0; //每张图的间距 x

  const height = position[2]? 44: 28; //表示是 纵 向
  const y_space = 10; //每张图的间距 y
   //如果使用本地图片 position的索引1位真的时候  
  const _v = item2[position[1]];
  if (_v > -1) {
    // const x = x_space * _v + _v * width + left;
    // const y = y_space * _v + _v * height + top;
    let y = parseInt(_v * height * 64 / 44 * 100) / 100;
    return `0px ${_v}%`;
  }
  return "0 0";
}
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
   //如果有服务器图片，使用cdn图片
  if(position[0]){
    return {
      "background-image": `url(${get_server_file_path(position[0],position[2])})`,
      "background-position": "0 0",
      "background-size": "100%",
     " background-repeat":"no-repeat"
    };
  }
  return {
    "background-image": `url(${url})`,
    "background-position": compute_position(position),
    "background-size": "100%",
   " background-repeat":"no-repeat"
  };
}

export { compute_css_obj };
