/**
 *
 * 全局 的 access_config  次要服务 开关配置
 * 代码内  开关地方用  GlobalAccessConfig.get_activitySwitch()
 *
 * 这个 后面会加上 本地开关 ，用户个人设置 ，以及 一起其他乱七八糟的算法
 *
 * 会加上 日志 开关 等乱七八糟的 开关
 * 
 *
 */
import BUILDIN_CONFIG from "app/job/output/env/index.js";
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
  is_roll_show_banner: false, // pc 滚动是否显示banner
  is_vue_hidden_run: false,
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
  /**
   * url所带的部分参数
   * s=01
   * &tag=01
   * &jz=1
   * &wsl=9999
   * &ignore_iframe_pc=1
   * &gr=common
   * &tm=2
   * &lg=zh
   * &mk=EU
   * &stm=blue
   * &api=gK6ht5G1Ja18klV1FYiUaTBkn99JB4/vZh48JQpZOQ=
   * &activity=10007,10008,10010&
   * gr=common
   * &api=F44HJ+atFdYQqXLm85ADtiugr0ZrwutNsM85t6cxNP9Hzf/22TCB/6e++ProM/DCOtWXfg8JnJSNy6Cnjhqp1g==
   * &keep_url=1
   * &ag=1
   * &pb=1
   * &env=line1
   * &httplog=1
   * &timestamp=1695535910860
   * &clearcache=1
  */
  set_enter_params_switch(data) {
    //默认是url里面的值 如果设置可以替换
    const _data = Object.assign({
      httplog: SEARCH_PARAMS.init_param.get('httplog'),//开启httplog日志
      wsl: SEARCH_PARAMS.init_param.get('wsl'),//开启日志
      env: SEARCH_PARAMS.init_param.get('env'),//增加env
      tag: SEARCH_PARAMS.init_param.get('tag'),//增加tag
      pb: SEARCH_PARAMS.init_param.get('pb'),//增加PB
      ag: SEARCH_PARAMS.init_param.get('ag'),//增加AG
    },data||{})
    // AUTO_API: SEARCH_PARAMS.init_param.get('api'), //自动API
     //下面这3个值没在url上找到
    //LOG: SEARCH_PARAMS.init_param.get('log'),
    // DOM_ID_SHOW: SEARCH_PARAMS.init_param.get('DOM_ID_SHOW'),  //是否显示DOM ID
    // ENABLE_COLLECT_API: SEARCH_PARAMS.init_param.get('ENABLE_COLLECT_API'),//前端控制是否禁用收藏功能

    //LOCAL_FUNCTION_SWITCH 打包配置
    this.other = Object.assign({}, LOCAL_FUNCTION_SWITCH, _data);
  }
  get_wsl() {
    return this.other?.wsl;
  }
  get_ag() {
    return this.other?.ag;
  }
  get_env() {
    return this.other?.env;
  }
  get_pb() {
    return this.other?.pb;
  }
  // 设置页面是否进入休眠状态
  set_vue_hidden_run(payload) {
    this.is_vue_hidden_run = payload
  }
  get_http_log() {
    return this.other?.httplog;
  }
  get_tag() {
    return this.other?.tag;
  }
  get_LOG() {
    return this.other?.LOG;
  }
  GET_ENABLE_COLLECT_API() {
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
  get_show_banner() {
    return this.config?.is_roll_show_banner
  }
  get_is_vue_hidden_run() {
    return this.is_vue_hidden_run
  }
}
export default new GlobalAccessConfig();
