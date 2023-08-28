/**
 *
 * 全局 的 access_config  次要服务 开关配置
 *
 *
 */
import { api_common } from "src/api/";

class GlobalAccessConfig {
  constructor() {}
  init() {
    this.config = {};
    this.config_default = {
      activitySwitch: true,
      collectSwitch: true,
      filterSwitch: true,
      handicapNum: true,
      hotMatchNum: true,
      hotRecommend: true,
      multiColumn: true,
      playAllShow: true,
      recentSwitch: true,
      searchSwitch: true,
      sortCut: true,
      statisticsSwitch: true,
    };
  }
  async get_access_config() {
    try {
      let res = await api_common.get_access_config();

      let data = res?.data?.data || "";

      if (data) {
        this.config = Object.assign({}, this.config_default, data);
      } else {
        this.config = {
          ...this.config_default,
        };
      }
    } catch (error) {
      this.config = {
        ...this.config_default,
      };
    }
  }
}


export default new GlobalAccessConfig()