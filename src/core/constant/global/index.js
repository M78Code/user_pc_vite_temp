
/**
 * 全局计算出来的  ，模块之间通信 ，去耦合化的一个对象 键值对 仓库
 */
let  global_constant={
    //  电竞图片域名
    E_SPORTS_DOMAIN_IMG:'',
     // 是否加载播放器js
    IS_LOAD_PLAYER_JS:false,
      // 是否已加载视频动画资源
  IS_LOAD_VIDEO_RESOURCES:false,

 

}
window.GLOBAL_CONSTANT = global_constant
export const GLOBAL_CONSTANT=global_constant