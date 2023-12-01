/*
 * @Author: Cable
 * @Date: 2020-09-07 12:36:01
 * @Description: 用户操作相关
 */
import { api_details } from "src/api/index";
export default {
  /**
  * @Description:判断用户是否登录
  * @Author Cable
  * @param {function} callback  回调函数
  */
  async check_login(callback) {
    try {
      let res = await api_details.post_check_login()
      callback(_.get(res, "data.data.isLogin", false), _.get(res, "data.code") == '0401038')
    } catch (error) {
      callback(false, true)
    }
  }
}
