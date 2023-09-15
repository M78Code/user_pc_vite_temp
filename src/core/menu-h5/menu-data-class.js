/**
 * 菜单 需要实现 保留 各级菜单 以及最终输出结果的   两个版本 ，
 */

import { api_common, api_analysis } from "src/api";
import lodash from "lodash";
import { computed, ref, watch } from "vue";
import { SessionStorage } from "src/core/";
import base_data_instance from "src/core/base-data/base-data.js";
const Cache_key = {
  CACHE_CRRENT_MEN_KEY: "CACHE_CRRENT_MEN_KEY", //缓存当前菜单的key
  RESULT_SUB_MENU_CACHE: "RESULT_SUB_MENU_CACHE", //赛果 缓存
};
class MenuData {
  constructor() {
    const that = this;
    this.show_favorite_list = false;
    this.update_time = ref(Date.now()); //更新触发
    //通知数据变化 防止调用多次 20毫秒再更新
    this.update = lodash.debounce(() => {
      that.update_time.value = Date.now();
    }, 20);
    // "1": "滚球",
    // "2": "今日",
    // "3": "早盘",
    // "4": "冠军",
    // "5": "即将开赛",
    // "6": "串关",
    // "7": "电竞",
    // "8": "VR",
    // "30": "竞足",
    // "28": "赛果",
    // 500热门 2000 电竞  400 冠军
    this.menu_type = ref(0); //一级菜单 menu_type 很常用所以设定为ref
    this.menu_lv1 = []; //1级菜单列表
    this.menu_lv2 = []; //2级菜单列表
    this.menu_lv3 = []; //3级菜单列表
    this.menu_lv4 = []; //4级菜单列表

    //================主列表用的  开始==================
    //上一次的 菜单
    // this.previous_menu = {};
    // this.previous_menu_i = {};
    //当前的菜单
    this.current_menu = {};
    // this.current_menu_i = 0;

    // 上一次的菜单 lv1
    this.previous_lv_1_menu = undefined;
    this.previous_lv_1_menu_i = undefined;

    //当前的菜单 lv1
    this.current_lv_1_menu = undefined;
    this.current_lv_1_menu_i = undefined;

    // //上一次的菜单 lv2
    this.previous_lv_2_menu = undefined;
    this.previous_lv_2_menu_i = 0;

    // 二级菜单 滚球下边的一个按钮   "全部"按钮
    this.get_sport_all_selected = computed(() => {
      lodash.isArray(this.current_lv_2_menu) && this.menu_type.value == 1;
    });
    //当前的菜单 lv2  注意 滚球 二级菜单 有一个【全部】选项 get_sport_all_selected
    this.current_lv_2_menu = {
      id: "",
      type: "",
      name: "",
    };
    this.current_lv_2_menu_i = undefined;
    // //上一次的菜单 lv3
    // this.previous_lv_3_menu = {};
    // this.previous_lv_3_menu_i = 0;
    //当前的菜单 lv3
    this.current_lv_3_menu = null;
    this.current_lv_3_menu_i = undefined;
    //当前的菜单 lv4
    this.current_lv_4_menu = {};
    this.current_lv_4_menu_i = undefined;

    //================主列表用的  结束==================
    //热门的
    this.hot_tab_menu = {};
    //国际化
    this.menus_i18n_map = {};
    this.menu_list = SessionStorage.get("menu_list", []);
    this.menu_original_data = {};
    // 页脚菜单
    this.footer_sub_menu_id = "";
    // 上一次选择的页脚菜单
    this.prev_footer_sub_menu_id = "";
    this.lv_1_menu_map = {
      1: "滚球",
      2: "今日",
      3: "早盘",
      4: "冠军",
      30: "热门",
    };
    this.init();
  }
  init() {
    base_data_instance.init(); //初始化菜单数据
    //菜单数据有变化
    watch(
      base_data_instance.base_data_version,
      lodash.debounce(() => {
        const { mew_menu_list_res } = base_data_instance; //获取主数据
        this.recombine_menu(mew_menu_list_res, mew_menu_list_res);
        this.update();
        // current_menu.value = menu_list.value[0];
      }, 50)
    );
    //设置从缓存拿到的数据 到class
    this.set_cache_class(
      SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {}),
      false
    );
    //初始化完成后进行一次数据更新
    this.update();
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
    console.error(111, mi)
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
      menu_list.splice(1, 0, mid_item || this.menu_lv1[1] || pop_main_items[0]);
    } else {
      menu_list.splice(1, 0, pop_main_items[0]);
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
  get_csna(csid, use_storage = false) {
    if (use_storage) {
      const sp_list = JSON.parse(sessionStorage.getItem("sp_list"));
      if (sp_list) {
        return sp_list.find((item) => item.csid == csid);
      }
    }
  }
  get_tn(tid, use_storage = false) {
    if (use_storage) {
      const tids_list = JSON.parse(sessionStorage.getItem("tids_obj"));
      if (tids_list) {
        return tids_list.find((item) => item.tid == tid);
      }
    }
  }
  //get euid
  async get_euid(arg_mi, menu_type) {
    let mi = arg_mi;
    if (!mi) return "";
    return base_data_instance.mi_euid_map_res[parseInt(mi)]?.h;
    const euid = await db.menus_mapping.get(arg_mi + "2", "mi");
    if (euid) return euid.menus_mapping.h || "";

    if (menu_type == 4) {
      //冠军特殊处理
      mi = 400 + (mi?.substr(0, 3) - 100);
    }
    // 赛果mi
    if (menu_type == 28) return arg_mi;
    let menu_mapping = JSON.parse(localStorage.getItem("menu_mapping"));
    if (!lodash.isEmpty(menu_mapping[mi])) {
      return menu_mapping[mi].h;
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
  //indexDB 存储菜单元数据
  set_db_menus_info(data) {
    if (!lodash.isEmpty(data)) {
      let db_data = [];
      lodash.each(Object.keys(data), (item) => {
        if (data[item].sl && this.count_menu(data[item]) > 0) {
          //过滤没有赛事数据球类
          db_data.push({
            mi: item,
            menu_info: data[item],
          });
        }
      });
      //mi作为主键
      db.menus_info.bulkAdd(db_data, "mi");
    }
  }
  //indexDB 存储菜单元数据mapping
  set_db_menus_mapping(data) {
    if (!lodash.isEmpty(data)) {
      let db_data = [];
      lodash.each(Object.keys(data), (item) => {
        db_data.push({
          mi: item,
          menus_mapping: data[item],
        });
      });
      //mi作为主键
      db.menus_mapping.bulkAdd(db_data, "mi");
    }
  }
  //indexDB 存储名称列表元数据
  set_db_name_list(data) {
    if (!lodash.isEmpty(data)) {
      let db_data = [];
      lodash.each(Object.keys(data), (item) => {
        db_data.push({
          mi: item,
          menu_lang: data[item],
        });
      });
      //mi作为主键
      db.menu_lang.bulkAdd(db_data, "mi");
    }
    // console.log(data,"======data")
  }
  //db 存储元数据
  set_db_match(data) {
    if (!lodash.isEmpty(data)) {
      let db_data = [];
      lodash.each(Object.keys(data), (item) => {
        db_data.push({
          mi: item,
          match_info: data[item],
        });
      });
      //mi作为主键
      db.match_info.bulkAdd(db_data, "mi");
    }
  }
  //菜单列表
  get_menu_list() {
    return base_data_instance.left_menu_base_mi_arr;
  }

  /**
   * 根据 球类型 获取图标
   * @param {boolean} is_focus 是否选中
   */
  get_sport_icon(is_focus) {
    let favorite = "";
    if (is_focus) {
      if (this.show_favorite_list) {
        favorite = "f";
      }
    }
    if (this.show_favorite_list) {
      favorite = "f";
    }
    // 赛果 408  sport-match-count
    if (this.main_menu_id_c == 408) {
      favorite = "";
    }
    //赛果我的投注
    // if (is_focus) {
    //   //选中情况下的 关注 和 非关注
    //   return favorite
    //     ? UserCtr.theme.includes("y0")
    //       ? "focus-e"
    //       : "focus-c"
    //     : UserCtr.theme.includes("y0")
    //     ? "focus-b"
    //     : "focus-a";
    // }
    // //默认黑色版还是白色版
    // return UserCtr.theme.includes("theme02") ? "focus-d" : "";
    return "focus-d";
  }

  //菜单名称
  get_menus_i18n_map(item) {
    return base_data_instance.menus_i18n_map[item];
  }

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
    return id;
  }
  // 是否展示二级菜单 图标
  show_secondary_menu_icon(item) {
    if (!this.show_favorite_list) return true;
    let flag = true;
    // 一级菜单赛果 选中关注 不显示虚拟体育的icon (1001:虚拟足球 1002:赛狗 1011:赛马 1004:虚拟篮球 1010:虚拟摩托车)
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
      sl: [
        {
          mi: "101",
        },
        {
          mi: "102",
        },
        {
          mi: "105",
        },
        {
          mi: "107",
        },
        {
          mi: "110",
        },
        {
          mi: "108",
        },
        {
          mi: "103",
        },
        {
          mi: "109",
        },
        {
          mi: "111",
        },
        {
          mi: "112",
        },
        {
          mi: "113",
        },
        {
          mi: "116",
        },
        {
          mi: "115",
        },
        {
          mi: "114",
        },
        {
          mi: "104",
        },
        {
          mi: "106",
        },
      ],
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
  //整点随机规则
  time_random_req() {
    const random_minutes = lodash.random(0, 15);
    //现在时间分钟数-随机分钟数 大于45  开始更新api
    return {
      can_update_data: new Date().getMinutes() - random_minutes > 45,
      random_minutes,
    };
  }
  //- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->

  get_is_show_three_menu(mi) {
    console.error(this.current_lv_1_menu?.mi);
    return [3, 6, 7, 28].includes(mi || this.current_lv_1_menu?.mi);
  }
  // 赛果下数据
  async get_results_menu() {
    if (this.menu_type.value !== 28) {
      return;
    }
    return new Promise(async (resolve) => {
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
          // this.$root.$emit(this.emit_cmd.EMIT_MAIN_LIST_MATCH_IS_EMPTY, {
          //   type: "result",
          //   event: { cmd: "list_empty" },
          // });
        }
      } catch (error) {
        // // 接口异常时逻辑处理
        // this.$root.$emit(this.emit_cmd.EMIT_MAIN_LIST_MATCH_IS_EMPTY, {
        //   type: "result",
        //   event: { cmd: "list_empty" },
        // });
      }
      this.update();
    });
  }
  // 赛果二级菜单  数据（名称） 特殊处理 成 menuName
  result_sub_menu_api_handle(res_data, type = "click") {
    // 赛果二级菜单  name 特殊处理 成 menuName
    res_data.forEach((sub_menu) => {
      sub_menu.menuName = sub_menu.name;
      sub_menu.ct = sub_menu.count;
      sub_menu.subList.forEach((date_menu) => {
        date_menu.menuName = date_menu.name;
      });
    });
    this.set_cache_class({
      menu_lv2: res_data,
    });
    // 如果上次刷新的，则保存上一次的状态，如果是点击的则初始化下标 为 默认第一个 0
    // if (type == "click") {
    //   this.set_current_lv2_menu(res_data[0],0);
    // }
    // 如果是小于0，则默认展示成 0
    // if (this.current_lv_2_menu_i < 0) {
    //   this.set_current_lv2_menu(res_data[0], 0);
    //   // // 选中的子菜单下标集合
    //   // this.selected_sub_menu_i_list = [this.sub_menu_i];
    // }
    //设置第二级菜单
    this.set_current_lv2_menu(res_data[0], 0);
  }
  // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  async get_date_menu_api_when_subchange(type) {
    // 如果是早盘，串关，电竞的话
    const menu_type = this.menu_type.value;
    //euid
    const euid = lodash.get(
      base_data_instance.mi_euid_map_res,
      this.get_current_sub_menuid()
    );
    if ([3, 6, 7].includes(menu_type) && euid) {
      // 三级菜单先显示骨架屏，接口回来后，再隐藏骨架屏
      // this.$root.$emit(this.emit_cmd.EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE);
      let api_func = null,
        params = { euid: euid.h };
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
      console.error(this.current_lv_2_menu.subList)
      // 如果是赛果
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
      // this.date_menu_list = this.current_lv_2_menu.subList;
      // // 设置日期选中项 调用三级菜单点击事件，默认第一个
      // // this.select_result_date_menu();
    } else {
      //  设置三级日期 菜单
      this.set_cache_class({
        menu_lv3: [],
      });
      this.set_current_lv3_menu(); //设置空
      // this.set_one_two_three_level_menu_data();
      // 菜单实例 初始化
      // this.handle_MenuInfoInstance_init();
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
    // 赛果数据处理
    let result_menu = this.init_amidithion(mew_menu_list_res);
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
        result_menu,
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

  /**
   * 选中1级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv1_menu(current_lv_1_menu, current_lv_1_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_1_menu,
      current_lv_1_menu_i,
      menu_type: current_lv_1_menu.mi, //设置一级菜单menutype
    });
    //设置二级菜单
    if (current_lv_1_menu.mi != 28) {
      this.set_cache_class({
        menu_lv2: current_lv_1_menu.sl || [],
      });
    }
  }
  /**
   * 选中二级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv2_menu(current_lv_2_menu, current_lv_2_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_2_menu,
      current_lv_2_menu_i,
      previous_lv_2_menu_i: this.previous_lv_2_menu_i,
      previous_lv_2_menu: this.previous_lv_2_menu,
    });
    if (!current_lv_2_menu) {
      //2级菜单为空 3级也滞空
      this.set_current_lv3_menu();
    }
    // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
    this.get_date_menu_api_when_subchange(type);
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
    if (this.is_results_virtual_sports()) {
      // 如果有三级菜单
      // 赛果下边的 虚拟体育 的四级菜单 数据
      if (this.current_lv_3_menu) {
        this.set_cache_class({
          menu_lv4: lodash.get(this.current_lv_3_menu, "subList"),
        });
        // this.virtual_sports_results_click_handle(
        //   this.virtual_sports_results_tab[this.virtual_sports_results_tab_item_i],
        //   this.virtual_sports_results_tab_item_i
        // );
        this.set_current_lv4_menu(this.menu_lv4[0], 0);
        this.update();
      }
    } else {
      //置空4级
      this.set_cache_class({
        menu_lv4: [],
      });
      this.set_current_lv4_menu();
      //  是三级菜单
      // this.four_menu_item = null;
      // 菜单实例 初始化
      // this.handle_MenuInfoInstance_init();
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
  }
  //根据一级菜单筛选二级菜单列表
  get_current_lv_2_menu_list() {
    let mi = this.menu_type.value;
    return (
      base_data.mew_menu_list_res.find((x) => x.mi == mi) || {
        sl: [],
      }
    );
  }

  //国际化获取菜单名称
  get_menu_name_i18n(mi) {
    return this.menus_i18n_map[mi] || "-";
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
    if (this.menu_original_data.sp_list) {
      this.previous_lv_1_menu = item;
      return this.menu_original_data.sp_list.find((i) => i.csid == item.csid);
    }
    return "";
  }
  //获取二级菜单 menuid
  get_current_sub_menuid() {
    //二级菜单可能有个选中 全部 此刻 当前菜单应该是数组
    if (this.get_sport_all_selected.value) {
      return this.current_lv_2_menu.map((item) => {
        return item.mi || item.menuId;
      });
    } else {
      return this.current_lv_2_menu?.mi || this.current_lv_2_menu?.menuId || "";
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
    return this.current_menu || "1";
  }
  /**
   * 获取当前选中得页脚子菜单
   */
  get_footer_sub_menu_id() {
    return this.footer_sub_menu_id || "1";
  }
}
export default new MenuData();
