/*
 * @FilePath: d:/projects/user-h5/project_path/src/pages/details/components/chatroom/check_domain.js
 * @Description:
 */
import axios from "axios";

const axios_instance = axios.create()

export function get_valid_api(user_info) {
  const {
    oss = {}
  } = (user_info || {});
  const {
    chatroomHttpUrl: domainPools,
  } = (oss || {});
  const promiseList = []
  // const domainPools = ['https://blog.csdn.net', 'https://www.ggg.net/', 'http://test-livechat-api.emkcp.com']
  const checkApiStr = '/livechat-api/user/getvipinfo'
  domainPools.forEach((domain) => {
    promiseList.push(axios_instance.post(`${domain}${checkApiStr}`, {
      timeout: 10000,
    }))
  })
  return new Promise((resolve, reject) => {
    Promise.any(promiseList)
      .then((res) => {
        resolve(res.config.url.replace(checkApiStr, '') + '/livechat-api')
      })
      .catch((error) => {
        reject(error)
      });
  })
}
