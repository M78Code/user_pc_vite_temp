// import { api_common } from "src/api/";
import { get } from "lodash";
import {format_time_zone_millisecond} from './format-date'
const server_time = {
  remote_time: 0,
  local_time: 0,
};
/**
 * 获取服务器时间
 */
// api_common.get_server_time().then((res) => {
//   let code = _.get(res, "data.code");
//   if (code == 200) {
//     let serverTime = Number(get(res, "data.data"));
//     server_time.local_time = Date.now();
//     server_time.remote_time = serverTime;
//   }
// });

/**
 * 获取与服务器的修正时间
 */
export const get_remote_time = () => {
  let { local_time, remote_time } = server_time;
  let now = new Date().getTime();
  let time = remote_time + (now - local_time);
  return time;
};

//   /**
//    * @description: 格式化时间
//    * @param {Number} timestamp 时间戳
//    * @param {String} fmt 自定义格式("mm月DD日 HH时MM")
//    * @return {String} 格式好的时间
//    */
//  export const formatTime=(timestamp, fmt)=> {
//     try {
//         // const date = new Date(parseInt(timestamp))
//     const date = new Date(format_time_zone_millisecond(parseInt(timestamp)))
//     let ret;
//     let opt = {
//       "Y+": fmt.lastIndexOf("Y") - fmt.indexOf("Y") == 3 ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2),        // 年
//       "y+": fmt.lastIndexOf("y") - fmt.indexOf("y") == 3 ? date.getFullYear().toString() : date.getFullYear().toString().substr(2, 2),        // 年
//       "m+": (date.getMonth() + 1).toString(),     // 月
//       "D+": date.getDate().toString(),            // 日
//       "d+": date.getDate().toString(),            // 日
//       "H+": date.getHours().toString(),           // 时
//       "h+": date.getHours().toString(),           // 时
//       "M+": date.getMinutes().toString(),         // 分
//       "S+": date.getSeconds().toString(),          // 秒
//       "s+": date.getSeconds().toString()          // 秒
//       // 有其他格式化字符需求可以继续添加，必须转化成字符串
//     };

//     for (let k in opt) {
//       ret = new RegExp("(" + k + ")").exec(fmt);
//       if (ret) {
//         fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
//       };
//     };
//     return fmt;

//     } catch (error) {

//     }
//   }
