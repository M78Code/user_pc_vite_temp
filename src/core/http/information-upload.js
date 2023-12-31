/*
 * @Author: nuanyang
 * @Date: 2022-10-12 14:58:14
 * @Description:
 */
import axios from "axios";
import device from "current-device";
import { SessionStorage } from "src/output/module/constant-utils-common.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { CURRENT_ENV } = BUILDIN_CONFIG;

class infoUpload {
  HTTP_UPLOAD_API = "https://information-api.sportxxxwo8.com";
  enable = false;
  axios_instance = null;
  constructor(enable = true) {
    // 上报数据开关
    this.enable = enable;
    // 数据上报
    this.init();
  }
  init() {
    this.axios_instance = axios.create({
      baseURL: this.HTTP_UPLOAD_API,
      timeout: 10000,
    });
  }
  /**
   * @Description:发送axios请求
   * @param {String} method 请求方式
   * @param {String} url 上传的路由
   * @param {Object}  params 发送的参数
   * @return:
   */
  send_request({ method, url, params }) {
    return this.axios_instance[method](url, params);
  }
  /**
   * @Description:上报用户访问的url信息
   * @param {Object}  params 发送的参数
   * @return:
   */
  async upload_url_info(params) {
    try {
      let { data } = await this.send_request({
        method: "post",
        url: "/url_info/createOrUpdate",
        params,
      });
      if (data) {
        console.log("URL上报成功");
      } else {
        console.log("URL上报失败");
      }
    } catch (error) {
      console.log("URL上报失败");
    }
  }
  /**
   * @Description:平板访问时上报信息
   * @param {Object}  params 发送的参数
   * @return:
   */
  async upload_tablet_comput(params) {
    try {
      let { data } = await this.send_request({
        method: "post",
        url: "/tablet_comput/create",
        params,
      });
      if (data) {
        console.log("平板上报成功");
      } else {
        console.log("平板上报失败");
      }
    } catch (error) {
      console.log("平板上报失败");
    }
  }
  /**
   * @Description:上传数据
   * @param {Object}  data 用户信息
   * @return:
   */
  upload_data(data) {
    if (!data || !this.enable) return;
    let original_url = SessionStorage .get("original_url", "");
    let { mId = -1, userId = -1, loginUrl = "" } = data;
    // url中包含token时再调用URL上报接口(刷新页面不进行上报URL)
    if (original_url.includes("token=")) {
      this.upload_url_info({
        merchantId: mId, // 商户id
        url: original_url, // 原始的url
        loginUrl: loginUrl, // 登录的url
        deviceType: "PC", // 设备类型
        currentEnv: CURRENT_ENV, // 当前环境
      });
      if (device.type == "tablet") {
        // 延时只使用window对象中的变量,不会造成内存泄漏
        let timer = setTimeout(() => {
          // device.type取值 'mobile', 'tablet', 'desktop', or 'unknown'
          this.upload_tablet_comput({
            merchantId: mId, // 商户id
            userId: userId, // 用户id
            deviceType: "PC", // 设备类型
            currentEnv: CURRENT_ENV, // 当前环境
          });
          original_url = "";
          clearTimeout(timer);
        }, 10000);
      }
    }
    SessionStorage .remove("original_url");
  }
}
const info_upload = new infoUpload(true);
export default info_upload;
