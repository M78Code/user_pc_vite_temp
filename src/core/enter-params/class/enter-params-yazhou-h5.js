import { Qs } from "../utils/Qs";
import { ls } from "src/core/utils/web-storage.js";
import menu_obj from "src/core/menu-h5/menu-data-class.js";
class EnterParamsYazhouH5 {
  constructor() {
    this.url = "";
    this.paramsVideo = {};
  }
  set_enter_url(url) {
    this.url = url;
  }
  //解析参数
  analyze() {
    //设置国际化
    if (Qs.lang) {
      ls.set("lang", Qs.lang);
    }
    // gotohash={体育类型}-{赛事id}-{联赛tid}-{球种csid}
    const gotohashList = (Qs.gotohash || "sports-2267075-239-1").split("-");
    //赛事类型
    if (["sports"].includes(gotohashList[0])) {
    }
    //
    //一级菜单 设置menu
    if (Qs.mt1) {
      menu_obj.set_current_menu(Qs.mt1);
      //二级菜单 设置menu
      if (Qs.mt2) {
        menu_obj.set_current_lv2_menu(Qs.mt2);
      }
    }
    // 用户token
    if (Qs.token) {
      ls.set("token", Qs.token);
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
        device: Qs.device || "PC",
        mid: Qs.mid, //赛事id
        eventCode: Qs.eventCode || 0,
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

export default new EnterParamsYazhouH5();
