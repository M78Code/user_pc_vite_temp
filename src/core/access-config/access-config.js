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
import BUILDIN_CONFIG from "app/job/output/env/final.js";
const { LOCAL_FUNCTION_SWITCH = {
  "LOG": false,
  "ENABLE_COLLECT_API": false,
  "DOM_ID_SHOW": false,
  "AUTO_API": false
} } = BUILDIN_CONFIG || {}
import { api_common } from "src/api/index.js";
const default_value = {
  activitySwitch: true,  // 活动 ture:开 false:关
  collectSwitch: true,  // 收藏/关注 ture:开 false:关
  filterSwitch: true,  // 联赛筛选 ture:开 false:关
  handicapNum: true,  // 列表盘口数量
  hotMatchNum: true,  // 热门赛事
  hotRecommend: true, // 热门推荐/猜你喜欢 ture:开 false:关
  multiColumn: true,  // PC列表更多玩法-----------------------------------H5 暂时没用到
  playAllShow: true,// 滚球-全部
  recentSwitch: true, // PC近期关注--------------------------------------H5 暂时没用到
  searchSwitch: true, // 搜索
  sortCut: true,  // 排序方式切换
  statisticsSwitch: true,  // 统计/赛事分析
};
class GlobalAccessConfig {
  config = {
    ...default_value,
  };
  init_load = false //是否已经初始化init加载过一次api书记
  constructor() {
    // 纯接口的 次要服务开关
    this.set_access_config()
    // 代码内构建打入的  以及 进入参数 计算出来的一些开关
    this.set_enter_params_switch()
    this.init()
  }
  /**
   * 客户端-获取紧急开关配置
   * reload [boolbean] 是否强加载  默认初始化加载一次
   * */
  async init(reload = false) {
    if (this.init_load && !reload) return
    try {
      let res = await api_common.get_access_config();
      let data = res?.data?.data || '';
      console.error("客户端-获取紧急开关配置", data)
      if (data) {
        this.init_load = true;
        this.set_access_config(data)
      } else {
        this.set_access_config()
      }
    } catch (error) {
      console.error("客户端-获取紧急开关配置---失败", error)
      this.set_access_config()
    }
  }
  set_access_config(data = {}) {
    this.config = Object.assign({}, default_value, data);
  }
  set_enter_params_switch(data = {}) {
    this.other = Object.assign({}, LOCAL_FUNCTION_SWITCH, data);
  }
  get_LOG() {
    return this.other?.LOG;
  }
  get_ENABLE_COLLECT_API() {
    return this.other?.ENABLE_COLLECT_API;
  }
  get_DOM_ID_SHOW() {
    return this.other?.DOM_ID_SHOW;
  }
  get_AUTO_API() {
    return this.other?.AUTO_API;
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
