/*
 * @FilePath     : /system-monitor-kanban/src/api/common/axioswarpper.js
 * @Description: 
 */
import BUILDIN_CONFIG from "app/job/output/env/index.js";
import axios from "axios";
const domian = {
    // 开发
    "local_dev": {
      url: "http://dev-api.sportxxxvo3.com",
      userId: 418,
      appId: 10020
    },
    // 测试
    "local_test":{
      url: "http://sit-api.sportxxxvo3.com",
      userId: 418,
      appId: 10020
    } ,
    // 压力测试
    "local_ylcs":{
      url: "http://api.sportxxxyp7.com",
      userId: 418,
      appId: 10020
    },
    // 隔离
    "idc_lspre":{
      url: "http://uat-api.sportxxxvo3.com",
      userId: 418,
      appId: 10020
    },
    // 生产
    "idc_online":{
      url: "https://api.sportxxx1zx.com",
      userId: 78,
      appId: 10020
    },
}
let api_domain = domian[BUILDIN_CONFIG.CURRENT_ENV]['url']  // 域名
// "http://uat-api.sportxxxvo3.com/fengkong/

axios.defaults.baseURL = api_domain;

axios.prototype.WS_ROOT_DOMAIN = api_domain.replace("http", "ws");
axios.prototype.WS_DOMAIN_FRNGKONG_1= axios.prototype.WS_ROOT_DOMAIN+'/'+'fengkongws'+'/rcsWebSockets/'
axios.interceptors.request.use(
  config => {
    config.headers["user-id"] = domian[BUILDIN_CONFIG.CURRENT_ENV]['userId']
    config.headers["app-id"] = domian[BUILDIN_CONFIG.CURRENT_ENV]['appId']
    config.headers["Requestid"] = _.get(JSON.parse(sessionStorage.getItem("formData")),"token","bea5eddf73b1549cb330af08cd5255fd7b3e2ba4") ;
    return config
  },
  error => {
    return Promise.reject(error);
  }
)
export default axios;

