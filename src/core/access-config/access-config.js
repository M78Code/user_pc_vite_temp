/**
 *
 * 全局 的 access_config  次要服务 开关配置
 * 代码内  开关地方用  GlobalAccessConfig.get_activitySwitch()
 *
 * 这个 后面会加上 本地开关 ，用户个人设置 ，以及 一起其他乱七八糟的算法
 * 
 * 会加上 日志 开关 等乱七八糟的 开关
 *
 */


import { api_common } from "src/api/";
class GlobalAccessConfig {
  constructor() {
    this.config = "";
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
  async init() {
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
  get_activitySwitch() {
    return this.config?.activitySwitch;
  }

  get_collectSwitch() {
    return this.config?.collectSwitch;
  }

  get_filterSwitch() {
    return this.config?.filterSwitch;
  }

  get_handicapNum() {
    return this.config?.handicapNum;
  }

  get_hotMatchNum() {
    return this.config?.hotMatchNum;
  }

  get_hotRecommend() {
    return this.config?.hotRecommend;
  }

  get_multiColumn() {
    return this.config?.multiColumn;
  }

  get_playAllShow() {
    return this.config?.playAllShow;
  }

  get_recentSwitch() {
    return this.config?.recentSwitch;
  }

  get_searchSwitch() {
    return this.config?.searchSwitch;
  }

  get_sortCut() {
    return this.config?.sortCut;
  }

  get_statisticsSwitch() {
    return this.config?.statisticsSwitch;
  }
}
export default new GlobalAccessConfig();
