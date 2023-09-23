/**
 * 菜单 需要实现 保留 各级菜单 以及最终输出结果的   两个版本 ，
 */

import { api_common, api_analysis } from "src/api";
import lodash from "lodash";
import { computed, ref, watch } from "vue";
import { SessionStorage, useMittEmit, MITT_TYPES, UserCtr } from "src/core/";
import BaseData from "src/core/base-data/base-data.js";
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
    }, 10);
    // "1": "滚球",  "2": "今日", "3": "早盘",  "4": "冠军","5": "即将开赛", "6": "串关","7": "电竞",
    // "8": "VR",// "30": "竞足",// "28": "赛果",

    // 500热门 2000 电竞  400 冠军
    this.menu_type = ref(0); //一级菜单 menu_type 很常用所以设定为ref
    this.menu_lv1 = []; //1级菜单列表
    this.menu_lv2 = []; //2级菜单列表
    this.menu_lv3 = []; //3级菜单列表
    this.menu_lv4 = []; //4级菜单列表
    //================主列表用的  开始==================
    //当前的菜单
    this.current_menu = {};
    // this.current_menu_i = 0;
    //当前的菜单 lv1
    this.current_lv_1_menu = undefined;
    this.current_lv_1_menu_i = undefined;
    // //上一次的菜单 lv2
    this.previous_lv_2_menu = undefined;
    this.previous_lv_2_menu_i = 0;
    // 二级菜单 滚球下边的一个按钮   "全部"按钮
    this.get_sport_all_selected = computed(() => {
      return lodash.isArray(this.current_lv_2_menu) && this.menu_type.value == 1;
    });
    //当前的菜单 lv2  注意 滚球 二级菜单 有一个【全部】选项 get_sport_all_selected
    this.current_lv_2_menu = undefined;
    this.current_lv_2_menu_i = undefined;
    //当前的菜单 lv3
    this.current_esport_csid = undefined;
    this.current_lv_3_menu = null;
    this.current_lv_3_menu_i = undefined;
    //当前的菜单 lv4
    this.current_lv_4_menu = {};
    this.current_lv_4_menu_i = undefined;
    //================主列表用的  结束==================
    //热门的
    this.hot_tab_menu = {};
    this.menu_list = SessionStorage.get("menu_list", []);
    // 页脚菜单
    this.footer_sub_menu_id = ""; //页脚子菜单id
    this.footer_sub_changing = false //页脚子菜单变化 
    // 上一次选择的页脚菜单
    this.prev_footer_sub_menu_id = "";

    this.init();
  }
  init() {
    setTimeout(() => {
      BaseData.init(); //初始化菜单数据
    }, 0);
    //菜单数据有变化
    watch(
      BaseData.base_data_version,
      lodash.debounce(() => {
        const { mew_menu_list_res } = BaseData; //获取主数据
        this.recombine_menu(mew_menu_list_res, mew_menu_list_res);
        this.update();
      }, 10)
    );
    //设置从缓存拿到的数据 到class
    this.set_cache_class(
      SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {}),
      false
    );
    this.update()
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
  //=============================
  count_menu(menu_list = { sl: [] }, list) {
    //传入sl mi eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
    //计算数量
    const { sl, mi } = menu_list;
    if (mi == 30) {
      const data = lodash.find(sl, (item) => {
        //竞足特殊处理
        return item.mi == "50101";
      });
      if (data)
        return data.ct || data.count || 0
      return 0;
    }
    return sl && sl.reduce
      ? sl.reduce((pre, cur) => {
        return pre + (cur.ct || cur.count || 0);
      }, 0)
      : 0;
  }
  //获取match菜单
  get_sport_menu() {
    let menu_list = [];
    let pop_main_items = [];
    this.menu_list.forEach((m_m) => {
      // 滚球 虚拟体育 電競 放入一级菜单
      if ([1, 7, 8].includes(m_m.mi)) {
        menu_list.push(lodash.cloneDeep(m_m));
      } else {
        pop_main_items.push(lodash.cloneDeep(m_m));
      } // 中间的 一级菜单
    });
    //插入中间项 第二项是  弹出框的
    if (this.current_lv_1_menu) {
      const mid_item = pop_main_items.find((item) => {
        return this.current_lv_1_menu && this.current_lv_1_menu.mi == item.mi;
      });
      menu_list.splice(1, 0, mid_item || this.menu_lv1[1] || pop_main_items[0] || {});
    } else {
      menu_list.splice(1, 0, pop_main_items[0], {});
    }
    this.menu_lv1 = menu_list;
    //如果没有设定过1级菜单
    if (!this.current_lv_1_menu && this.menu_list[0]) {
      this.set_current_lv1_menu(this.menu_list[0], 0, "init");
    }
    // //如果有设定过二级菜单 先设置二级菜单加载数据先
    // if (this.current_lv_2_menu) {
    //   this.set_current_lv2_menu(
    //     this.current_lv_2_menu,
    //     this.current_lv_2_menu_i,
    //     "init"
    //   );
    // }
    return [menu_list, pop_main_items];
  }
  //设置选中的菜单
  set_menu_type(v) {
    const idx = this.menu_list.findIndex(i => i.mi == v)
    idx > -1 && this.set_current_lv1_menu(this.menu_list[idx], idx, 'click')
  }
  // 当前选中的菜单type
  get_menu_type() {
    return this.current_lv_1_menu?.mi;
  }
  async get_db_mids(mi) {
    //返回mi 筛选赛事 获取mid 用于筛选列表赛事
    let mids = [];
    let match_mi_list = await db.match_info.bulkGet([mi || "110602"]);
    if (match_mi_list && match_mi_list[0]?.match_info?.nd) {
      //nd 滚球
      lodash.each(match_mi_list[0].match_info.nd, (mi_item) => {
        mids.push(...mi_item.mids);
      });
    }
    return mids;
  }
  //get euid
  get_euid(arg_mi) {
    const menu_type = this.menu_type.value;
    let mi = arg_mi;
    if (!mi) return "";
    if (menu_type == 4) {
      //冠军特殊处理
      mi = 400 + (mi?.substr(0, 3) - 100);
    }
    // 赛果mi
    if (menu_type == 28) return arg_mi;
    let menu_mapping = BaseData.mi_euid_map_res[mi];
    if (!lodash.isEmpty(menu_mapping)) {
      return menu_mapping.h;
    } else {
      // 电竞无旧菜单id处理
      let menu_dianjing = {
        2100: 41002,
        2101: 41001,
        2102: 41004,
        2103: 41003,
      };
      return menu_dianjing[mi];
    }
  }
  /**
   * 根据 球类型 获取图标
   * @param {boolean} is_focus 是否选中
   */
  get_sport_icon(is_focus) {
    let favorite = "";
    if (is_focus) {
      if (UserCtr.show_favorite_list) {
        favorite = "f";
      }
    }
    if (UserCtr.show_favorite_list) {
      favorite = "f";
    }
    // 赛果 408  sport-match-count
    if (this.main_menu_id_c == 408) {
      favorite = "";
    }
    //赛果我的投注
    if (is_focus) {
      //选中情况下的 关注 和 非关注
      return favorite
        ? UserCtr.theme.includes("y0")
          ? "focus-e"
          : "focus-c"
        : UserCtr.theme.includes("y0")
          ? "focus-b"
          : "focus-a";
    }
    // //默认黑色版还是白色版
    return UserCtr.theme.includes("night") ? "focus-d" : "";
  }
  //菜单名称 国际化获取菜单名称
  get_menus_i18n_map(item) {
    return BaseData.menus_i18n_map[item];
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
    if (get_ball_id) return id;
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
      this.menu_type.value == 28 &&
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
      this.current_lv_1_menu?.mi == 8 ||
      (this.match_list_api_config || {}).sports == "vr"
    );
  }
  // 如果是赛果，并且是 虚拟体育
  is_results_virtual_sports() {
    if (
      this.menu_type.value == 28 &&
      [1001, 1002, 1004, 1010, 1011, 1009].includes(
        Number(this.get_current_sub_menuid())
      )
    ) {
      return true;
    }
    return false;
  }
  recombine_menu_desc(item) {
    return String(item).substr(0, 3);
  }
  // 查找竞足数据
  init_lottery(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  }
  champion_menu_euid(mi) {
    return 400 + parseInt(mi.substr(1, 2));
  }
  // 电竞菜单csid
  menu_csid(mi) {
    if (mi) {
      let menu_dianjing = {
        2100: 100,
        2101: 101,
        2102: 102,
        2103: 103,
      };
      return menu_dianjing[mi];
    }
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
  //- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
  get_is_show_three_menu(mi) {
    return [3, 6, 7, 28].includes(mi || this.current_lv_1_menu?.mi);
  }
  // 赛果下数据
  async get_results_menu() {
    // 如果有缓存，则使用缓存
    let cache_data = SessionStorage.get(Cache_key.RESULT_SUB_MENU_CACHE);
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
        // 赛果二级菜单数据处理
        this.result_sub_menu_api_handle(data, "init");
      } else {
        // 出错时使用缓存数据
        if (cache_data) {
          // 赛果二级菜单数据处理
          this.result_sub_menu_api_handle(cache_data, "init");
        }
        useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, {
          type: "result",
          event: { cmd: "list_empty" },
        });
      }
    } catch (error) {
      // // 接口异常时逻辑处理
      useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, {
        type: "result",
        event: { cmd: "list_empty" },
      });
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
    this.set_current_lv2_menu(res_data[0], 0);
  }
  // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  async get_date_menu_api_when_subchange(item, type) {
    // 如果是早盘，串关，电竞的话
    const menu_type = this.menu_type.value;
    const euid = this.get_euid(item.mi)
    if ([3, 6, 7].includes(menu_type) && euid) {
      // 三级菜单先显示骨架屏，接口回来后，再隐藏骨架屏
      useMittEmit(MITT_TYPES.EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE);
      let api_func = null,
        params = { euid: euid };
      if (7 == menu_type) {
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
              this.current_lv_3_menu_i
            );
          } else {
            this.set_current_lv3_menu(this.menu_lv3[0], 0);
          }
        }
      } catch (error) {
        this.set_cache_class({
          menu_lv3: [],
        });
      }
    } else if ([28].includes(menu_type)) {
      // 如果是赛果 在一级菜单时候已经获取过二级菜单
      this.set_cache_class({
        menu_lv3: this.current_lv_2_menu.subList,
      });
      if (type == "init" && this.menu_lv3.length && this.current_lv_3_menu) {
        this.set_current_lv3_menu(
          this.current_lv_3_menu,
          this.current_lv_3_menu_i
        );
      } else {
        this.set_current_lv3_menu(this.menu_lv3[0], 0);
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
  //setter=======
  recombine_menu(data, mew_menu_list_res = []) {
    //常规
    let conventional = [
      101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
      106, 118, 400, 300,
    ];
    const menuRule = [2, 1, 3, 4];
    let mi_list = [];
    //1=滚球,2=今日,3=早盘,4=冠军,5=即将开赛,6=串关   左侧一级菜单隐藏 串关和即将开赛
    // // 竟足
    // let lottery = this.init_lottery(data);
    // 电竞 2100 = 英雄联盟
    let menu_dianjing = { mi: 7, sl: [] };
    let menu_jingzu = { mi: 30, sl: [] };
    lodash.each(data, (item) => {
      if (item && item.sl && item.sl.length > 0) {
        mi_list.push(...item.sl);
      }
      if ([2100, 2101, 2103, 2102].includes(+item.mi)) {
        menu_dianjing.sl.push(item);
      }
      if ([500].includes(+item.mi)) {
        menu_jingzu.sl.push(item);
      }
    });
    let new_menu = [];
    lodash.each(menuRule, (menu_item, index) => {
      new_menu[index] = { mi: menu_item, sl: [] };
      lodash.each(mi_list, (item) => {
        const filter_data = lodash.find(conventional, (item1) => {
          return item.mi == `${item1}${menu_item}`;
        });
        if (filter_data) {
          new_menu[index].sl.push(item);
        }
      });
    });
    this.set_cache_class({
      menu_list: [
        ...new_menu,
        menu_dianjing,
        { mi: 8 },
        menu_jingzu,
        this.init_amidithion(mew_menu_list_res),  // 赛果数据处理
      ],
    });
    return this.menu_list;
  }
  //根据路由参数 设置菜单信息 选中一级menu
  set_query_menu({ m, s, t, mt1, mt2 }) {
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
  vr_menu() {
    const vr_list = [
      {
        field1: "1001",
        menuId: "1001",
        name: "足球",
        subList: [],
      },
      {
        field1: "1004",
        menuId: "1004",
        name: "篮球",
        subList: [],
      },
      {
        field1: "1011",
        menuId: "1011",
        name: "赛马",
        subList: [],
      },
      {
        field1: "1002",
        menuId: "1002",
        name: "赛狗",
        subList: [],
      },
      {
        field1: "1010",
        menuId: "1010",
        name: "摩托车",
        subList: [],
      },
      {
        field1: "1009",
        menuId: "1009",
        name: "泥地摩托车",
        subList: [],
      },
    ];
    return vr_list;
  }
  /**
   * 选中1级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv1_menu(current_lv_1_menu, current_lv_1_menu_i, type = "click") {
    console.error('set_current_lv1_menu')
    this.set_cache_class({
      current_lv_1_menu,
      current_lv_1_menu_i,
      menu_type: current_lv_1_menu.mi, //设置一级菜单menutype
    });
    //设置二级菜单 赛果和电竞是不需要設置二級菜單的
    switch (current_lv_1_menu.mi) {
      case 28:
        this.get_results_menu();
        break;
      default:
        this.set_cache_class({
          menu_lv2: current_lv_1_menu.sl || [],
        });
    }
    useMittEmit(MITT_TYPES.EMIT_MAIN_MENU_CHANGE);
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
      previous_lv_2_menu_i: this.previous_lv_2_menu_i,
      previous_lv_2_menu: this.previous_lv_2_menu,
    });
    if (!current_lv_2_menu) {
      //2级菜单为空 3级也滞空
      this.set_cache_class({
        menu_lv2: [],
      });
      this.set_current_lv3_menu();
      return;
    }
    this.get_date_menu_api_when_subchange(item)
  }

  /**
   * 选中3级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv3_menu(current_lv_3_menu, current_lv_3_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_3_menu,
      current_lv_3_menu_i,
    });
    if (!current_lv_3_menu) {
      //三级菜单为空 4级也滞空
      this.set_current_lv4_menu();
    }
    else if (this.is_results_virtual_sports()) {
      // 如果有三级菜单
      // 赛果下边的 虚拟体育 的四级菜单 数据
      if (this.current_lv_3_menu) {
        this.set_cache_class({
          menu_lv3: [],
        });
        this.set_cache_class({
          menu_lv4: lodash.get(this.current_lv_3_menu, "subList"),
        });
        this.set_current_lv4_menu(this.menu_lv4[0], 0);
        this.update();
      }
    } else {
      //置空4级
      this.set_cache_class({
        menu_lv4: [],
      });
      this.set_current_lv4_menu();
    }
  }
  /**
   * 选中4级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv4_menu(current_lv_4_menu, current_lv_4_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_4_menu,
      current_lv_4_menu_i,
    });
    this.update()
  }
  get_level_four_menu() {
    return "";
  }
  get_current_lv_2_menu_type() {
    return "0";
  }
  //竞足数据
  get_competing(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  }
  /**
   * 电竞菜单要保留上一个 电竞菜单 的 csid
   */
  get_current_esport_csid(mi, item) {
    if (mi) {
      let menu_dianjing = {
        2100: 100,
        2101: 101,
        2102: 102,
        2103: 103,
      };
      return menu_dianjing[mi] || "";
    }
    if (BaseData.base_data_res.spList
    ) {
      this.previous_lv_1_menu = item;
      return BaseData.base_data_res.spList.find((i) => i.csid == item.csid);
    }
    return "";
  }
  //获取二级菜单 menuid
  get_current_sub_menuid() {
    //二级菜单可能有个选中 全部 此刻 当前菜单应该是数组
    if (this.get_sport_all_selected.value) {
      return this.current_lv_2_menu.map((item) => {
        return item.mi || item.menuId;
      }).join(',');
    } else {
      // 竟足处理 50101
      if (this.get_menu_type() == 30) {
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
    return lodash.get(this.current_menu, "date_menu.menuType") == 100;
  }
  /**
   * 一级菜单顶层菜单的 菜单类型  ，没有则是0
   */
  get_current_lv_1_menu_type() {
    return this.current_lv_1_menu?.mi || 0;
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
