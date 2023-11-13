/*
 * @Author: Cable
 * @Date: 2020-03-11 14:25:27
 * @LastEditTime: 2022-08-15 15:13:27
 * 
 * node_modules\@quasar\app\lib\quasar-config.js   361
 * 需全局执行的文件路径
 * cfg.boot.push({path:'src/xx/xx.js'})
 */

import video from "src/public/utils/video/video.js"

video.check_url = function(url,callback){
    callback(true)
}

video.join_video_url = function(mid,refer_url){
  let url = `127.0.0.1:4000/?test=9999&mid=1&domain=https://api.cadltgvb.com&rdm=${new Date().getTime()}`
  url = encodeURI(url)
  return url
}

export default ({ Vue }) => {
  Vue.prototype.$video = video;
}