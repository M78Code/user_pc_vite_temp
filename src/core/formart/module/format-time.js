import { api_common } from "src/api/";
import { get } from "lodash";
const server_time = {
  remote_time: 0,
  local_time: 0,
};
/**
 * 获取服务器时间
 */
api_common.get_server_time().then((res) => {
  let code = _.get(res, "data.code");
  if (code == 200) {
    let serverTime = Number(get(res, "data.data"));
    server_time.local_time = Date.now();
    server_time.remote_time = serverTime;
  }
});

/**
 * 获取与服务器的修正时间
 */
export const get_remote_time = () => {
  let { local_time, remote_time } = server_time;
  let now = new Date().getTime();
  let time = remote_time + (now - local_time);
  return time;
};
