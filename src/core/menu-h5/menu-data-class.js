/**
 * 菜单 需要实现 保留 各级菜单 以及最终输出结果的   两个版本 ，
 */
// "1": "滚球",  "2": "今日", "3": "早盘",  "4": "冠军","5": "即将开赛", "6": "串关","7": "电竞",
// "8": "VR",// "28": "赛果", "30": "竞足",// 500热门


/*以下是老的菜单对应ID*/
// menu_type // 100（冠军）  3000（电竞） 赛果28 
// 滚球:1 今日:3 早盘:4 串关:11 冠军:100 虚拟体育:900  赛果:20,
// 如果不是 虚拟体育 900.则设置当前菜单
/*--------------end----------*/

import { api_common, api_analysis } from "src/api";
import lodash from "lodash";
import { computed, ref, watch } from "vue";
import { SessionStorage, sprite_images_postion } from "src/output/module/constant-utils.js";
import BaseData from "src/core/base-data/base-data.js";
import {
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
const Cache_key = {
  CACHE_CRRENT_MEN_KEY: "CACHE_CRRENT_MEN_KEY", //缓存当前菜单的key
  RESULT_SUB_MENU_CACHE: "RESULT_SUB_MENU_CACHE", //赛果 缓存
};
class MenuData {
  constructor() {
    const that = this;
    this.update_time = ref(Date.now()); //更新触发
    //通知数据变化 防止调用多次 20毫秒再更新
    this.update = lodash.debounce(() => {
      that.update_time.value = Date.now();
    }, 16);
    //提供销毁函数
    this.destroy = () => {
      this.update && this.update.cancel()
    }
    this.menu_type = ref(0); //一级菜单 menu_type 很常用所以设定为ref
    //所有的菜单数据 如果要处理 请再外部处理 怎么显示
    this.menu_list = SessionStorage.get("menu_list", []);
    this.menu_lv2 = []; //2级菜单列表
    this.menu_lv3 = []; //3级菜单列表
    this.menu_lv4 = []; //4级菜单列表
    //================主列表用的  开始==================
    //当前的菜单 lv1
    this.current_lv_1_menu = {};
    this.current_lv_1_menu_i = undefined;
    // //上一次的菜单 lv2
    this.previous_lv_2_menu = {};
    this.previous_lv_2_menu_i = 0;
    // 二级菜单的一个按钮  可能是全部  "全部"  此时 current_lv_2_menu为数组
    this.get_sport_all_selected = computed(() => {
      // && this.menu_type.value 是否选中了全部
      return lodash.isArray(this.current_lv_2_menu) && this.update_time.value;
    });
    //当前的菜单 lv2  注意  二级菜单 可能 有一个【全部】选项 get_sport_all_selected
    this.current_lv_2_menu = {};
    this.current_lv_2_menu_i = undefined;
    //当前的菜单 lv3
    this.current_lv_3_menu = {};
    this.current_lv_3_menu_i = undefined;
    //当前的菜单 lv4
    this.current_lv_4_menu = {};
    this.current_lv_4_menu_i = undefined;
    //================主列表用的  结束==================
    //热门的
    this.hot_tab_menu = {};
    // 页脚菜单
    this.footer_sub_menu_id = ""; //页脚子菜单id
    this.footer_sub_changing = false //页脚子菜单变化 
    // 上一次选择的页脚菜单
    this.prev_footer_sub_menu_id = "";
  }
  init() {
    //菜单数据有变化
    watch(
      BaseData.base_data_version,
      lodash.debounce((v) => {
        const { mew_menu_list_res } = BaseData; //获取主数据
        this.recombine_menu(mew_menu_list_res);
        this.update();
      }, 10)
    );
    //初始化菜单数据
    BaseData.init()
   
    //设置从缓存拿到的数据 到class
    this.set_cache_class(
      SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {}),
      false
    );
    this.update()
  }
  /**
   * @description 设置热门tab
   * @param {*} 热门下的菜单信息 
   */
  set_hot_tab_menu(menu) {
    this.hot_tab_menu = menu
  }
  /**
   * 设置值 并且缓存
   * obj [Object] 需要设置的缓存  key要和本类系统哦
   * is_cache是否缓存
   */
  set_cache_class(obj, is_cache = true) {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(this, key)) {
        if (["menu_type"].includes(key)) {
          this[key].value = obj[key];
        } else {
          this[key] = obj[key];
        }
      }
    }
    if (is_cache) {
      const current = SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {});
      SessionStorage.set(
        Cache_key.CACHE_CRRENT_MEN_KEY,
        lodash.assign({}, current, obj)
      );
    }
  }
  /**
   * 兼容老的菜单ID?
  */
  menu_id_map(mi, menu_arr = false) {
    const menu_type_config = {
      1: 1,
      2: 3,
      3: 4,
      400: 100,
      5: "",
      6: 11,
      7: 3000,
      8: 900,
      28: 28,
      30: 30,
    };
    return menu_arr
      ? Object.values(menu_type_config)[mi]
      : menu_type_config[mi];
  }
  /**
   * 根据后台数据 初始化菜单数据
  */
  recombine_menu(data) {
    //常规
    let conventional = [
      101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
      106, 118, 400, 300,
    ];

    let mi_list = [];
    //1=滚球,2=今日,3=早盘,4=冠军,5=即将开赛,6=串关   左侧一级菜单隐藏 串关和即将开赛
    // // 竟足
    // let lottery = this.init_lottery(data);
    // 电竞 2100 = 英雄联盟
    let menu_dianjing = { mi: 7, sl: BaseData.dianjing_sublist };
    let menu_jingzu = { mi: 30, sl: [] };
    let menu_guanjun = { mi: 4, sl: [] };
    let menu_hot = { mi: 500, sl: [] }
    lodash.each(data, (item) => {
      //这里是放入全部的数据
      if (item && item.sl && item.sl.length > 0) {
        mi_list.push(...item.sl);
      }
      // //电竞
      // if (BaseData.sports_mi.includes(+item.mi)) {
      //   menu_dianjing.sl.push(item);
      // }
      //冠军
      if ([400].includes(+item.mi)) {
        menu_guanjun.sl = item.sl || [];
      }
      //热门
      if ([500].includes(+item.mi)) {
        menu_hot.sl = item.sl || [];
      }
    });
    let new_menu = [];
    //处理普通数据 1=滚球,2=今日,3=早盘
    lodash.each([1, 2, 3], (menu_item, index) => {
      new_menu[index] = { mi: menu_item, sl: [] };
      lodash.each(mi_list, (item) => {
        //常规赛总的mi是 赛种id+主菜单mi
        const filter_data = lodash.find(conventional, (item1) => {
          return item.mi == `${item1}${menu_item}`;
        });
        if (filter_data) {
          new_menu[index].sl.push(item);
        }
      });
    });
    //存储数据
    this.set_cache_class({
      menu_list: [
        ...new_menu,
        menu_guanjun,
        menu_dianjing,
        { mi: 8 },
        menu_jingzu,
        this.init_amidithion(data),  // 赛果数据处理
        menu_hot,
      ],

    });
    return this.menu_list;
  }
  //赛果数据处理
  init_amidithion(data) {
    let result_menu = {
      mi: 28,
      sl: ["101", "102", "105", "107", "110", "108", "103", "109", "111", "112", "113", "116", "115", "114", "104", "106"].map((mi) => ({ mi }))
    };
    let list = {
      mi: 28,
      sl: [],
    };
    if (data) {
      lodash.each(data, (item, index) => {
        list.sl.push({
          count: item.count || 0,
          name: item.name || "",
          menuId: item.menuId || item.field1,
          menuType: item.menuType || "",
          mi: item.mi
        });
      });
      return list;
    } else {
      return result_menu;
    }
  }
  // 查找竞足数据
  init_lottery(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  }
  /**
   * 此处计算总数量 传入sl mi eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
   * @param {{mi,sl}} menu_list 
   * @param {*} list 
   * @returns 
   */
  count_menu(menu_list = {}) {
    //计算数量
    const { sl, mi } = menu_list;
    //VR默认295
    if (this.is_vr(mi)) return '';
    if (this.is_jinzu(mi)) {
      const data = lodash.find(sl, (item) => {
        //竞足特殊处理
        return item.mi == "50101";
      });
      if (data)
        return data.ct || data.count || ''
      return '';
    }
    //计算数量
    const count = sl && sl.reduce
      ? sl.reduce((pre, cur) => {
        return pre + (cur.ct || cur.count || 0);
      }, 0)
      : 0;
    return count || ''
  }

  /**
   * 设置选中的菜单只需要传入 mi就可以了
  */
  set_menu_type(v) {
    const idx = this.menu_list.findIndex(i => i.mi == v)
    idx > -1 && this.set_current_lv1_menu(this.menu_list[idx], idx, 'click')
  }
  /**
   *一级菜单顶层菜单的 菜单类型  ，没有则是0
   * */
  get_menu_type() {
    return this.current_lv_1_menu?.mi || 0;
  }
  /**
   * 获取 euid
   * arg_mi 如果传值 则获取特定值euid 如果没有就是二级菜单的euis
   * */
  get_euid(arg_mi) {
    let mi = arg_mi || this.current_lv_2_menu?.mi;
    if (!mi) return "";
    // 赛果
    if (this.is_results()) return mi;
    if (BaseData.mi_euid_map_res && BaseData.mi_euid_map_res[mi]) {
      return BaseData.mi_euid_map_res[mi].h;
    } else {
      // 电竞无旧菜单id处理
      return {
        2100: 41002,
        2101: 41001,
        2102: 41004,
        2103: 41003,
      }[mi];
    }
  }

  /**
   * 菜单名称 国际化获取菜单名称
   * 这里获取大部分菜单的名称 有些是固定名称的这里获取不到
   * @param {*} mi 
   * @returns 
   */
  get_menus_i18n_map(mi) {
    //"7": "电竞" 直接可以返回不做处理 slice(0,3)
    if (this.is_esports()) {
      return BaseData.menus_i18n_map[mi]
    }
    return BaseData.menus_i18n_map[this.recombine_menu_desc(mi)];
  }
  /**
   * 获取后台接口所对应的名称mi
   * 因为mi对应的 赛种ID + 主菜单mi
   * 例如如：1001 =》 100是足球 而1是早盘 滚球什么的 什么的
   * @param {*} mi 
   * @returns 
   */
  recombine_menu_desc(mi) {
    return String(mi).substr(0, 3);
  }
  // /**
  //  * @description: 球类id转化背景
  //  * @param {String} id 球类id
  //  * @return {}
  //  */
  /**
   * @description: 球类id
   * @param {String} id 球类id
   * @return {}
   */
  recombine_menu_bg(item, get_ball_id = false, is_result = false) {
    if (is_result) {
      return parseInt(item - 100);
    }
    let bg_mi = parseInt(this.recombine_menu_desc(item?.mi));
    let id = parseInt(bg_mi - 100);
    if (this.is_kemp()) {
      id = parseInt(bg_mi - 400);
    }
    if (get_ball_id) return sprite_images_postion[id];
    let type = "";
    switch (String(id)) {
      case "1":
        type = "football";
        break;
      case "2":
        type = "basketball";
        break;
      case "3":
        type = "baseball";
        break;
      case "4":
        type = "ice_hockey";
        break;
      case "5":
        type = "tennis";
        break;
      case "6":
        type = "usa_football";
        break;
      case "7":
        type = "snoke";
        break;
      case "8":
        type = "pingpang";
        break;
      case "9":
        type = "volleyball";
        break;
      case "10":
        type = "badminton";
        break;
      case "11":
        type = "handball";
        break;
      case "12":
        type = "boxing";
        break;
      case "13":
        type = "beach_volleyball";
        break;
      case "14":
        type = "rugby_union";
        break;
      case "15":
        type = "hockey";
        break;
      case "16":
        type = "water_polo";
        break;
      case "18":
        type = "funny";
        break;
      case "37":
        type = "banqiu";
        break;
      case "26":
        type = "binghu";
        break;
      case "31":
        type = "fanchuan";
        break;
      case "38":
        type = "feibiao";
        break;
      case "28":
        type = "gaoerfu";
        break;
      case "32":
        type = "huachuan";
        break;
      case "25":
        type = "jijian";
        break;
      case "23":
        type = "juzhong";
        break;
      case "35":
        type = "kongshoudao";
        break;
      case "40":
        type = "qita";
        break;
      case "33":
        type = "saiche";
        break;
      case "39":
        type = "shatanzuqiu";
        break;
      case "24":
        type = "shejian";
        break;
      case "36":
        type = "shuaijiao";
        break;
      case "27":
        type = "taiquandao";
        break;
      case "17":
        type = "tianjing";
        break;
      case "21":
        type = "tiaoshui";
        break;
      case "20":
        type = "ticao";
        break;
      case "19":
        type = "youyong";
        break;
      case "29":
        type = "zixingche";
        break;
      case "22":
        type = "sheji";
        break;
      case "34":
        type = "roudao";
        break;
      case "30":
        type = "saima";
        break;
      case "50":
        type = "quwei";
        break;
    }
    return type;
  }

  // 是否展示二级菜单 图标
  show_secondary_menu_icon(item) {
    if (!UserCtr.show_favorite_list) return true;
    let flag = true;
    // 一级菜单赛果 选中关注 不显示虚拟体育的icon (1001:虚拟足球 1002:赛狗 1011:赛马 1004:虚拟篮球 1010:虚拟摩托车)
    //TODO  menuType?? 新接口好像变了
    if (
      this.is_results() &&
      [1001, 1002, 1011, 1004, 1010].includes(+item.menuType)
    ) {
      flag = false;
    }
    return flag;
  }
  /**
   * @description 判断是虚拟体育
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  is_virtual_sport() {
    return (
      this.is_vr() ||
      (this.match_list_api_config || {}).sports == "vr"
    );
  }
  // 如果是赛果，并且是 虚拟体育
  is_results_virtual_sports() {
    if (
      this.is_results() &&
      [1001, 1002, 1004, 1010, 1011, 1009].includes(
        Number(this.get_current_sub_menuid())
      )
    ) {
      return true;
    }
    return false;
  }
  // "1": "滚球",  "2": "今日", "3": "早盘",  "4": "冠军","5": "即将开赛", "6": "串关","7": "电竞",
  // "8": "VR",// "28": "赛果", "30": "竞足",//
  //内部方法
  _is_cur_mi(mi, param) {
    if (param) {
      return mi == param
    }
    return this.get_menu_type() == mi
  }
  _is_cur_mi_special(mi, param) {
    if (param) {
      return mi == param
    }
    return false;
  }
  /**
   * 是否选中了 热门
   * mi [number|string] 要比对的值
   * 没有传递对比当前菜单
  */
  is_hot(mi) {
    return this._is_cur_mi(500, mi)
  }
  /**
   * 是否选中了VR 
   * mi [number|string] 要比对的值
   * 没有传递对比当前菜单
  */
  is_vr(mi) {
    return this._is_cur_mi(8, mi)
  }
  /**
   * 是否选中了赛果
   *  mi [number|string] 要比对的值
  */
  is_results(mi) {
    return this._is_cur_mi(28, mi)
  }
  /**
   * 是否选中了早盘
   *  mi [number|string] 要比对的值
  */
  is_zaopan(mi) {
    return this._is_cur_mi(3, mi)
  }
  /**
   * 是否选中了今日
   *  mi [number|string] 要比对的值
  */
  is_today(mi) {
    return this._is_cur_mi(2, mi)
  }
  /**
   * 是否选中了滚球
   *  mi [number|string] 要比对的值
  */
  is_scroll_ball(mi) {
    return this._is_cur_mi(1, mi)
  }
  /**
   * 是否选中了冠军
   *  mi [number|string] 要比对的值
  */
  is_kemp(mi) {
    return this._is_cur_mi(4, mi)
  }
  /**
   * 是否选中了电竞
   *  mi [number|string] 要比对的值
  */
  is_esports(mi) {
    return this._is_cur_mi(7, mi)
  }
  /**
   * 是否选中了串关
   *  mi [number|string] 要比对的值 没有传递对比当前菜单
  */
  is_mix(mi) {
    return this._is_cur_mi(6, mi)
  }
  /**
   * 是否选中了竞足
   *  mi [number|string] 要比对的值
  */
  is_jinzu(mi) {
    return this._is_cur_mi(30, mi)
  }
   /**
   * 是否选中了收藏
   *  mi [number|string] 要比对的值
  */
  is_collect(mi) {
    return this._is_cur_mi_special(50000, mi)
  }
  //- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
  get_is_show_three_menu(mi) {
    return [3, 6, 7, 28].includes(mi || this.current_lv_1_menu?.mi);
  }
  // 赛果下数据
  async get_results_menu() {
    // 如果有缓存，则使用缓存
    let cache_data = SessionStorage.get(Cache_key.RESULT_SUB_MENU_CACHE, []);
    try {
      // 如果当前主菜单是赛果, 获取赛果二级菜单
      let { code, data } = await api_analysis.get_result_menu({});
      if (code == 200 && Array.isArray(data)) {
        if (lodash.get(data, "[0].menuType") == 29) {
          // 当是我的投注时菜单进行时间排序
          let arr = lodash.get(data, "[0].subList");
          if (arr) {
            arr.sort((a, b) => {
              if (b.field1 < a.field1) {
                return -1;
              } else {
                return 1;
              }
            });
          }
        }
        SessionStorage.set(Cache_key.RESULT_SUB_MENU_CACHE, data);
        cache_data = data;
      }
    } finally {
      // 出错时使用缓存数据
      if (cache_data && cache_data.length) {
        // 赛果二级菜单数据处理
        this.result_sub_menu_api_handle(cache_data, "init");
      } else {
        useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, {
          type: "result",
          event: { cmd: "list_empty" },
        });
      }
    }
    this.update();
  }
  // 赛果二级菜单  数据（名称） 特殊处理 成 menuName
  result_sub_menu_api_handle(res_data, type = "click") {
    // 赛果二级菜单  name 特殊处理 成 menuName
    res_data.forEach((sub_menu) => {
      sub_menu.menuName = sub_menu.name;
      sub_menu.ct = sub_menu.count;
      sub_menu.mi = sub_menu.menuId;
      sub_menu.subList.forEach((date_menu) => {
        date_menu.menuName = date_menu.name;
      });
    });
    this.set_cache_class({
      menu_lv2: res_data,
    });
    //设置第二级菜单
    res_data && res_data.length && this.set_current_lv2_menu(res_data[0], 0);
  }
  // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  async get_date_menu_api_when_subchange(item, type) {
    // 如果是早盘，串关，电竞的话
    const euid = this.get_euid(item.mi)
    if ([this.is_zaopan(), this.is_mix(), this.is_esports()].includes(true) && euid) {
      // 三级菜单先显示骨架屏，接口回来后，再隐藏骨架屏
      let api_func = null,
        params = { euid: euid };
      if (this.is_esports()) { //电竞
        api_func = api_common.get_esports_date_menu;
        let value = item.mi.slice(1, 4);
        params = { csid: value };
        if (!params.csid) {
          params.csid = value;
        }
      } else {
        api_func = api_common.post_date_menu;
      }
      try {
        const res = await api_func(params);
        if (res.code == 200) {
          this.set_cache_class({
            menu_lv3: res.data,
          });
          if (
            type == "init" &&
            this.menu_lv3.length &&
            this.current_lv_3_menu
          ) {
            this.set_current_lv3_menu(
              this.current_lv_3_menu,
              this.current_lv_3_menu_i, 'init'
            );
          } else {
            this.set_current_lv3_menu(this.menu_lv3[0], 0, 'init');
          }
        }
      } catch (error) {
        this.set_cache_class({
          menu_lv3: [],
        });
      }
    } else if (this.is_results()) {
      // 如果是赛果 在一级菜单时候已经获取过二级菜单
      this.set_cache_class({
        menu_lv3: this.current_lv_2_menu.subList,
      });
      if (this.menu_lv3) {
        if (type == "init" && this.menu_lv3.length && this.current_lv_3_menu) {
          this.set_current_lv3_menu(
            this.current_lv_3_menu,
            this.current_lv_3_menu_i, type
          );
        } else {
          this.set_current_lv3_menu(this.menu_lv3[0], 0, type);
        }
      }
    } else {
      //  设置三级日期 菜单
      this.set_cache_class({
        menu_lv3: [],
      });
      this.set_current_lv3_menu(); //设置4级空
    }
    this.update();
  }

  //根据路由参数 设置菜单信息 选中一级 二级menu
  set_enter_params({ m, s, t, mt1, mt2 }) {
    if (!m && !mt1) {
      return;
    }
    //     m表示主菜单id    s表示二级菜单id         （t日期菜单id一般不用）r
    //    mt1 表示主菜单menu_type     mt2 表示子菜单menu_type         记住首页球种r
    const idx = lodash.findIndex(this.menu_list, {
      mi: m || mt1,
    });
    if (idx > -1) {
      const menu_list = this.menu_list[idx];
      //设置一级菜单
      this.set_current_lv1_menu(menu_list, idx, "init");
      const idx2 = lodash.findIndex(this.menu_lv2, {
        mi: s || mt2,
      });
      if (idx2 > -1) {
        //设置二级菜单
        this.set_current_lv2_menu(this.menu_lv2[idx2], idx2, "init");
      }
      this.update();
    }
  }
  /**
   * 选中1级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  async set_current_lv1_menu(current_lv_1_menu, current_lv_1_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_1_menu,
      current_lv_1_menu_i,
      menu_type: current_lv_1_menu?.mi, //设置一级菜单menutype
    });
    if (current_lv_1_menu) {
      //设置二级菜单 赛果和电竞是不需要設置二級菜單的
      switch (current_lv_1_menu?.mi) {
        case 28:
          await this.get_results_menu();
          break;
        default:
          this.set_cache_class({
            menu_lv2: current_lv_1_menu?.sl || [],
          });
      }
    }

    this.update();
  }
  /**
   * 选中二级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  async set_current_lv2_menu(current_lv_2_menu, current_lv_2_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_2_menu,
      current_lv_2_menu_i,
    });
    if (!current_lv_2_menu) {
      //2级菜单为空 3级也滞空
      this.set_cache_class({
        menu_lv2: [],
      });
      this.set_current_lv3_menu();
      return;
    }
    this.get_date_menu_api_when_subchange(current_lv_2_menu, type)
  }

  /**
   * 选中3级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv3_menu(current_lv_3_menu, current_lv_3_menu_i, type = "click") {
    if (!current_lv_3_menu) {
      //置空3级菜单
      this.set_cache_class({
        menu_lv3: [],
      });
      //三级菜单为空 4级也滞空
      this.set_current_lv4_menu();
    }
    else if (this.is_results_virtual_sports()) {
      // 如果有三级菜单
      // 赛果下边的 虚拟体育 的四级菜单 数据
      if (this.current_lv_3_menu) {
        //设定4级菜单数据
        this.set_cache_class({
          menu_lv4: lodash.get(this.current_lv_3_menu, "subList"),
        });
        //设定4级点击
        this.set_current_lv4_menu(this.menu_lv4[0], 0);
        this.update();
      }
    } else {
      this.set_current_lv4_menu();
    }
    /**
     * 在初始化时
     * 保持日期的选中 例如选中了 9.24号 下一次切换二级菜单如果还有9.24号就选中 9.24号 
     */
    if (type == 'init' && this.current_lv_3_menu && this.menu_lv3?.length) {
      const idx = this.menu_lv3.findIndex((item) => this.current_lv_3_menu.menuId == item.menuId);
      if (idx && idx > -1) {
        current_lv_3_menu = this.menu_lv3[idx]
        current_lv_3_menu_i = idx;
      }
    }
    //选中3级菜单
    this.set_cache_class({
      current_lv_3_menu,
      current_lv_3_menu_i,
    });
  }
  /**
   * 选中4级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv4_menu(current_lv_4_menu, current_lv_4_menu_i, type = "click") {
    this.set_cache_class({
      menu_lv4: [],
      current_lv_4_menu,
      current_lv_4_menu_i,
    });
    this.update()
  }
  //获取4级菜单 menu
  get_level_four_menu() {
    return this.current_lv_4_menu;
  }
  //获取二级菜单ID　以前有　menuType这个东西
  get_current_lv_2_menu_type() {
    return this.current_lv_2_menu?.menuType;
  }
  //竞足数据
  get_competing(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      // 竟足处理 50101
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  }
  /**
   * 电竞菜单要保留 电竞菜单 的 csid
   */
  get_csid() {
    if (this.is_esports()) {
      return this.current_lv_2_menu?.csid
    }
    // if (BaseData.csids_map
    // ) {
    //   this.previous_lv_1_menu = item;
    //   return BaseData.csids_map['csid_' + item.csid];
    // }
    return "";
  }
  /**
   * 二级菜单是否选中了全部
   * @returns 
   */
  get_sub_is_all() {
    return lodash.isArray(this.current_lv_2_menu)
  }
  //获取二级菜单 menuid
  get_current_sub_menuid() {
    //二级菜单可能有个选中 全部 此刻 当前菜单应该是数组
    if (this.get_sub_is_all()) {
      return this.current_lv_2_menu && lodash.castArray(this.current_lv_2_menu).map((item) => {
        return item.mi || item.menuId;
      }).join(',');
    } else {
      // 竟足处理 50101
      if (this.is_jinzu()) {
        const euid = this.get_euid('50101') || 40603; // 获取euid
        return euid;
      }
      return this.current_lv_2_menu?.mi || this.current_lv_2_menu?.menuId || "40003";
    }
  }
  /**
   * 判断是否为冠军和电竞冠军
   */
  get_mm_is_champion() {
    return lodash.get(this.current_lv_3_menu, "menuType") == 100;
  }
  // 传给筛选里面的搜索下Bat选中
  get_useid_ievname() {
    return this.current_lv_2_menu?.mi?.substr(1, 2)
  }
  /**
   * 获取当前选中得页脚子菜单
   */
  get_footer_sub_menu_id() {
    return this.footer_sub_menu_id || "1";
  }
  /**
   * 设置当前选中得页脚子菜单
   */
  set_footer_sub_menu_id(footer_sub_menu_id) {
    this.set_cache_class({
      footer_sub_menu_id
    })
  }
  /**
  * 设置当前选中得页脚子菜单变化 
  */
  set_footer_sub_changing(footer_sub_changing) {
    this.footer_sub_changing = footer_sub_changing //页脚子菜单变化 
  }
}
export default new MenuData();
