import { api_common } from "src/api/";
import lodash from "lodash";
class ServerTime {
  constructor() {
    //远程服务器时间 
    this.remote_time = Date.now() + 100;
    // 用户本机 时间戳
    this.local_time = Date.now();
    this.init_load = false;// 是否获取过时间
  }
  /**
   * 获取服务器时间
   */
  async get_server_time() {
    try {
      let res = await api_common.get_time_server();
      let code = lodash.get(res, "data.code");
      if (code == 200) {
        this.init_load = true;
        let serverTime = Number(lodash.get(res, "data.data"));
        this.local_time = Date.now();
        this.remote_time = serverTime;
      } else {
        this.local_time = Date.now();
        this.remote_time = Date.now();
      }

      return res;
    } catch (error) {
      this.local_time = Date.now();
      this.remote_time = Date.now();
    }
  }
  /***
   * 获取当前服务器时间 时间戳
   */
  get_remote_time() {
    let now = Date.now();
    let time = this.remote_time + (now - this.local_time);
    return time;
  }

}


export default new ServerTime()