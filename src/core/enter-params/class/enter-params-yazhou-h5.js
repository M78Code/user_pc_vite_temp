import { get_query_string } from "src/core/utils/common/index.js";
import { LocalStorage } from 'src/core/utils/common/module/web-storage.js'
import menu_obj from "src/core/menu-h5/menu-data-class.js";
import lodash from "lodash";
import { MenuData } from "src/output/project/index.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import GlobalAccessConfig from "src/core/access-config/access-config.js";

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
 * & stm=blue
 * &api=gK6ht5G1Ja18klV1FYiU aTBkn99JB4/vZh48JQpZOQ=
 * &activity=10007,10008,10010&
 * gr=common
 * &api=F44HJ+atFdYQqXLm85ADtiugr0ZrwutNsM85t6cxNP9Hzf/22TCB/6e++ProM/DCOtWXfg8JnJSNy6Cnjhqp1g==
 * &keep_url=1
 * &ag=1&pb=1
 * &env=line1
 * &httplog=1
 * &timestamp=1695535910860
 * &clearcache=1
*/

class EnterParamsYazhouH5 {
  constructor() {
    this.url = "";
    this.paramsVideo = {};
    // 是否已经加载过
    this.init_load = false;
    this.app_init_loading_timer = null;
    this.get_activity_msg = null;
    //TODO
    //设置全家config参数
    GlobalAccessConfig.set_enter_params_switch({})
    //TODO后续改动位置 设置菜单页参数
    MenuData.set_enter_params({})
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
  /**
   * @description: 获取url参数集合
   * @param {Array} 参数key值列表
   * @return {Object} 参数对象数据
   */
  get_url_param_key_obj(arr_key) {
    let obj = {};
    let url_search = new URLSearchParams(location.search);
    arr_key.forEach((element) => {
      obj[element] = url_search.get(element);
    });
    return obj;
  }
  // 获取地址栏哈希后面的指定值
  get_url_param(paraName) {
    try {
      let url = window.location.hash.toString();
      let arrObj = url.split("?");
      if (arrObj.length > 1) {
        let arrPara = arrObj[1].split("&");
        let arr;
        for (let i = 0, len = arrPara.length; i < len; i++) {
          arr = arrPara[i].split("=");
          if (arr != null && arr[0] == paraName) {
            return arr[1];
          }
        }
        return "";
      } else {
        return "";
      }
    } catch (error) {
      console.error(error);
    }
  }
  // 删除指定参数
  delete_params() {
    let url = window.location.href;
    // 删除参数
    url = this.remove_url_param(["mt1", "m", "s", "mt2"]);
    // 设置最新url地址
    history.replaceState(window.history.state, null, url);
  }
  /**
   * @description: 移除url地址中指定参数数据
   * @param {string} url url地址
   * @param {string} key 移除的参数名称
   * @return {string} 返回最新的url
   */
  remove_url_param(url, key) {
    let res = url;
    if (res && key) {
      let re = new RegExp(`${key}=([a-zA-Z0-9]*)`);
      // rdm参数处理
      let param = res.match(re);
      if (param && param.length > 1) {
        res = res.replace(param[0], "");
      }
      res = res
        .replace("?#", "#")
        .replace("?&", "?")
        .replace("&#", "#")
        .replace(/[\?&]$/, "");

      // 检测是否还有该参数
      let re2 = new RegExp(`[?&]{1}(${key}=\w*&?)`);
      if (re2.test(res)) {
        res = this.remove_url_param(res, key);
      }
    }
    return res;
  }
  //地址栏带有菜单和赛事id参数的话，跳转到对应的列表或者赛事详情页
  to_corresponding_route() {
    // 是否跳转/home页面
    let goto_home = window.location.href.includes("homeIndex") ? false : true;
    try {
      // 获取指定key值参数数组的url参数对象
      // hanmar需求确认
      let params_obj = this.get_url_param_key_obj([
        "m",
        "s",
        "mid",
        "label",
        "sy",
        "activity",
        "mt1",
        "mt2",
        "csid",
        "isAPP",
        "gotohash",
        "keep_url",
      ]);
      let act = params_obj.activity || this.get_url_param("activity");
      // home_index.vue页面辅助参数
      this.tianzhuan = true;
      if (params_obj.label == 1 || params_obj.sy == 1) {
        //跳转列表
        this.set_golistpage(true);
      }
      if (params_obj.mt1 && params_obj.mt1 != 900) {
        //去到列表页
        this.$router.push({
          name: "matchList",
          query: { mt1: params_obj.mt1, mt2: params_obj.mt2 },
        });
        // if(!params_obj.keep_url){
        this.delete_params();
        // }
        goto_home = false;
      } else if (params_obj.m == "407" || params_obj.mt1 == 900) {
        //去到虚拟体育
        this.$router.push({ name: "virtual_sports", query: { home: "home" } });
        goto_home = false;
      } else if (params_obj.mid) {
        //去赛事详情
        if ([100, 101, 102, 103].includes(+params_obj.csid)) {
          // 如果是电竞赛事，需要设置菜单类型
          this.set_menu_type(3000);
        }
        // 改变跳转详情页标志状态
        this.set_godetailpage(true);
        // 更新赛事详情对应的赛事id
        this.set_goto_detail_matchid(params_obj.mid);
        // 更新详情玩法集
        this.set_details_item(0);
        this.$router.push({
          name: "category",
          params: { flag: 1, mid: params_obj.mid },
        });
        goto_home = false;
      } else if (params_obj.m) {
        //去到列表页
        this.$router.push({
          name: "matchList",
          query: {
            m: params_obj.m,
            s: params_obj.s,
          },
        });
        // if(!params_obj.keep_url){
        this.delete_params();
        // }
        goto_home = false;
      } else if (act) {
        act = act.split(",")[0];
        if (["10007", "10008", "10009"].includes(act)) {
          this.$router.replace({
            name: "activity_task",
            params: { act: act, isAPP: params_obj.isAPP },
            query: { rdm: new Date().getTime() },
          });
          goto_home = false;
        } else {
          this.tianzhuan = false;
        }
      } else if (params_obj.label == 1 || params_obj.sy == 1) {
        // 不要首页页面,'m','s','mid','mt1','mt2'值为空时,直接跳到赛事列表页面
        this.$router.push({
          name: "matchList",
        });
        // if(!params_obj.keep_url){
        this.delete_params();
        // }
        goto_home = false;
      } else {
        this.tianzhuan = false;
      }
    } catch (error) {
      console.error(error);
    }
    // 默认跳转到home页面
    if (goto_home) {
      this.$router.replace({
        name: "home",
        query: this.$router.query,
      });
    }
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
  //路由解析检测
  go_activity_confirm() {
    let _url = lodash.get(this.get_activity_msg, "hostUrl");
    let _type = lodash.get(this.get_activity_msg, "urlType");
    this.set_activity_msg({});
    if (!_url) return;
    if (_url.startsWith("http") && _type === "2") {
      window.open(_url, "_blank");
    } else if (_type === "1") {
      if (/#*\/*details/.test(_url) && this.$route.name != "category") {
        const {
          groups: { mid, csid },
        } = /#*\/*details\/(?<mid>\d+)\/(?<csid>\d+)/.exec(_url) || {
          groups: {},
        };
        if (mid && csid) {
          if ([100, 101, 102, 103].includes(+csid)) {
            // 如果是电竞赛事，需要设置菜单类型
            this.set_menu_type(3000);
          }
          this.set_goto_detail_matchid(mid);
          this.set_details_item(0);
          this.$router.push({ name: "category", params: { mid, csid } });
        }
      } else if (_url == "act" && UserCtr.user_info.activityList) {
        this.$router.push({
          name: "activity_task",
          query: { rdm: new Date().getTime() },
        });
      } else if (_url.startsWith("hot") && !this.get_golistpage) {
        // 跳热门联赛
        let tid = _url.split("/")[1];
        let is_existtid =
          this.get_hot_list_item &&
          this.get_hot_list_item.subList &&
          this.get_hot_list_item.subList.find((item) => {
            return item.field2 == tid;
          });
        if (tid && is_existtid) {
          this.set_home_tab_item({ component: "hot", index: 1, name: "热门" });
          this.set_hot_tab_item({ field2: tid });
          this.$router.push({ name: "home" });
        }
      }
    }
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
    //
    //一级菜单 设置menu
    if (Qs.mt1) {
      menu_obj.set_current_lv1_menu(Qs.mt1);
      //二级菜单 设置menu
      if (Qs.mt2) {
        menu_obj.set_current_lv2_menu(Qs.mt2);
      }
    }
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
//任何时候外联 提供方法 组装参数  fun({})return 'url?'
//any enter  1.场馆 
// {
//   back:false,
// }
export default new EnterParamsYazhouH5();
