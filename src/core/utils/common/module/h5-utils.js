/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共方法对象定义
 */
import lodash from 'lodash'
import { uid, date } from "quasar";
import { api_common, api_account } from 'src/api/index';
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
// let BUILD_VERSION =  process.env.NODE_ENV=='development'?'':   require('app/version.js').BUILD_VERSION;

const BUILD_VERSION = 'development'

const utils = {
  // 是否加载播放器js
  is_load_player_js:false,
  // 是否已加载视频动画资源
  is_load_video_resources:false,
  timer1_: null,
  //用户切换的时间点(用于阻止用户过快点击)
  change_time:null,
  
};
export default utils;
