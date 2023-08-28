import { api_common } from "src/api/";
import lodash from "lodash";
class ServerTime {
  constructor() {
    this.timestamp=
    this.remote_time = 0;
    this.local_time = 0;
  }
   
  /**
   * 获取服务器时间
   */
  async get_server_time() {
    try {
      let res = await api_common.get_server_time();

      let code = lodash.get(res, "data.code");
      if (code == 200) {
        let serverTime = Number(lodash.get(res, "data.data"));
        this.local_time = Date.now();
        this.remote_time = serverTime;
      } else {
        this.local_time = Date.now();
        this.remote_time = Date.now();
      }
    } catch (error) {
      this.local_time = Date.now();
      this.remote_time = Date.now();
    }
  }

  get_remote_time() {
    let now = Date.now();
    let time = this.remote_time + (now - this.local_time);
    return time;
  }
  
}


export default new ServerTime()