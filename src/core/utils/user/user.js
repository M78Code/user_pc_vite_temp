import { api_details } from "src/public/api/index";

/**
  * @Description:判断用户是否登录
  * @Author Cable
  * @param {function} callback  回调函数
  */
export const check_login = async (callback) => {
  try {
    let res = await api_details.post_check_login()
    callback(_.get(res, "data.data.isLogin", false), _.get(res, "data.code") == '0401038')
  } catch (error) {
    callback(false, true)
  }
}
