// 1http://lan-daohang.sportxxxr1pub.com/?
//token=73bdb9f38e57cae2fd57fb587dde5f9cf2a725d9&
// gr=common
// &tm=2
// &lg=zh&
// mk=HK&
// stm=blue
// &api=vEtkQtmX6wF8fAGV5b4UDx2mPRca2zMHLMj%2FYELjSwxjyhV5t0ifZDD6I0iwkpzJ
//内嵌	显示	ignore_iframe_pc	1
// 内嵌	默认不显示	无	无
// 非内嵌，新页面打开	默认显示	无	无

//注意：跳转到体育赛事详情（电竞、VR赛事暂不支持）

// ?gotohash={体育类型}-{赛事id}-{联赛tid}-{球种csid}
// 例子：?gotohash=sports-2267075-239-1

import { get_query_string } from "src/output/module/constant-utils.js";
import { LocalStorage } from 'src/core/utils/common/module/web-storage.js'
import menu_obj from "src/core/menu-h5/menu-data-class.js";
import lodash from "lodash";
class EnterParamsYazhouPc {
  constructor() {
    this.url = "";
    this.paramsVideo = {};
    // 是否已经加载过
    this.init_load = false;
    this.app_init_loading_timer = null;
  }
  set_enter_url(url) {
    this.url = url;
  }
  /**
   * @description: 设置this.init_load变量的状态
   * @param {*} status 布尔值
   */
  set_init_load(status) {
    // 当this.init_load值从false,变到true时进入
    if (!this.init_load && status) {
      // 清除上次的定时器
      clearTimeout(this.app_init_loading_timer);
      // 10秒后关闭,阻止页面数据加载时白屏问题
      this.app_init_loading_timer = setTimeout(() => {
        // 关闭app全局loading动画
        this.app_init_loading = false;
      }, 10000);
    }
    this.init_load = status;
  }
  init() {
    // 设置商户信息
    let gr = LocalStorage.get("gr");
    // 首屏loading动画是否显示使用的延时器
    this.loading_is_show_timer = 0;
    try {
      let qsInfo = SEARCH_PARAMS.init_param;
      //解析URL参数
      //计算token
      let token = qsInfo.get("token") || LocalStorage.get("TOKEN") || "";
      if (token) {
        LocalStorage.set("TOKEN", token);
      }
      // 是否解除pb压缩开关: pb=1时表示数据不进行加密接口请求
      let pb = LocalStorage.get("pb") || qsInfo.get("pb") || "";
      if (pb) {
        LocalStorage.set("pb", "1");
      }
      // 设置商户分组信息
      let gr = (
        LocalStorage.get("gr") ||
        qsInfo.get("gr") ||
        "COMMON"
      ).toLocaleUpperCase();
      if (gr) {
        LocalStorage.set("gr", gr);
      }
    } catch (error) {
      console.error(error);
    }
    this.app_init_loading = true;
  }
  //默认打开赛事详情
  go_match_detail(data) {
    //定位赛事id
    const mid =get_query_string.mid;
  }
  //默认打开赛果详情
  go_match_result(data) {
    //定位赛事id
    const mid =get_query_string.mid;
  }
  //活动页面
  go_activity(activityList, act_copy) {
    const tab_list = lodash.cloneDeep(activityList);
    tab_list.forEach((item, i) => {
      // 商户跳转过来时,有带 act参数，调用方法
      if (act_copy == item.activityId) {
        const tab_Id = act_copy;
        this.tab_click(
          lodash.cloneDeep(activityList)[i],
          tab_Id,
          i,
          "",
          "is_first_time"
        );
      } else if (i == 0) {
        // 默认调用第一个
        console.log("默认调用第一个");
        const tab_Id = item.activityId;
        // this.tab_click(
        //   lodash.cloneDeep(activityList)[0],
        //   tab_Id,
        //   0,
        //   "",
        //   "is_first_time"
        // );
      }
      // 盲盒活动的下标
      if (item.activityId == "10009") item.lucky_blind_box_index = i;
    });
    return tab_list;
  }
  //解析参数
  analyze() {
    //设置国际化
    if (Qs.lang) {
      LocalStorage.set("lang",get_query_string.lang);
    }
    // gotohash={体育类型}-{赛事id}-{联赛tid}-{球种csid}
    const gotohashList = (Qs.gotohash || "sports-2267075-239-1").split("-");
    //赛事类型
    if (["sports"].includes(gotohashList[0])) {
    }
    menu_obj.set_query_menu({
      mt1:get_query_string.mt1, //一级菜单 设置menu
      mt2:get_query_string.mt1, //二级菜单 设置menu
    });
    // 用户token
    if (Qs.token) {
      LocalStorage.set("token",get_query_string.token);
    }
    //是否展示首页页面1 代表去掉H5页面首页模块 不传则代表需要使用H5 页面的首页模块
    if (Qs.sy) {
    }
    //如果是直接从外层跳转到电竞赛事详情页，则需要传赛事类型id
    if (Qs.csid) {
    }
    //赛事回放参数
    if (Qs.mid) {
      this.paramsVideo.eventCode = {
        device:get_query_string.device || "PC",
        mid:get_query_string.mid, //赛事id
        eventCode:get_query_string.eventCode || 0,
      };
    }
    //标记 开启列表和详情页跳转功能
    if (Qs.label) {
    }
  }
  get_url() {
    //增加时间戳 避免浏览器或者APP 一定程度的缓存
    const t = new Date().valueOf();
    return this.url + "&t=" + t || "";
  }
}

export default new EnterParamsYazhouPc();
