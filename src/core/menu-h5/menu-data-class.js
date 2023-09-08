/**
 * 菜单 需要实现 保留 各级菜单 以及最终输出结果的   两个版本 ，
 */

import { api_common } from "src/api";
import lodash from "lodash";
import base_data_instance from "src/core/base-data/base-data.js";
class MenuData {
  constructor() {
    //================主列表用的  开始==================
    //上一次的 菜单
    this.previous_menu = {};
    //当前的菜单
    this.current_menu = {};
    //上一次的菜单 lv1
    this.previous_lv_1_menu = {};
    //当前的菜单 lv1
    this.current_lv_1_menu = {};
    //上一次的菜单 lv2
    this.previous_lv_2_menu = {};
    //当前的菜单 lv2
    this.current_lv_2_menu = {
      id: "",
      type: "",
      name: "",
    };
    //上一次的菜单 lv3
    this.previous_lv_3_menu = {};
    //当前的菜单 lv3
    this.current_lv_3_menu = {};
    //================主列表用的  结束==================
    //热门的
    this.hot_tab_menu = {};
    //国际化
    this.menus_i18n_map = {};
    this.menu_list = [];
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
  }
  //=============================
  count_menu(menu_list = [], list) {
    //传入sl eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
    //计算数量
    if (menu_list && menu_list[0]?.mi == 500) {
      const data = lodash.findIndex(menu_list[0].sl, (item) => {
        //竞足特殊处理
        return item.mi == "50101";
      });
      try {
        return menu_list[0]?.sl[data].ct || "";
      } catch (error) {
        console.log(error);
        return 0;
      }
    }
    return menu_list && menu_list.reduce
      ? menu_list.reduce((pre, cur) => {
          return pre + cur.ct;
        }, 0)
      : 0;
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
        if (data[item].sl && this.count_menu(data[item].sl) > 0) {
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
  //菜单名称
  get_menus_i18n_map(item) {
    return base_data.menus_i18n_map[item];
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
      this.menu_type == 28 &&
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
      this.current_lv_1_menu.mi == 8 ||
      (this.match_list_api_config || {}).sports == "vr"
    );
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
    return item.substr(0, 3);
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
  // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  async get_date_menu_api_when_subchange(item) {
    console.error(111111)
    // 如果是早盘，串关，电竞的话
    const menu_type = this.get_menu_type();
    if ([3, 6, 7].includes(menu_type) && this.get_current_sub_menuid()) {
      // 三级菜单先显示骨架屏，接口回来后，再隐藏骨架屏
      // this.$root.$emit(this.emit_cmd.EMIT_BEFORE_LOAD_THIRD_MENU_HANDLE);
      let api_func = null,
        params = { euid: this.get_current_sub_menuid() };
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
          this.date_menu_list = res.data;
          return this.date_menu_list;
        }
      } catch (error) {}
      return;
    } else if ([28].includes(menu_type)) {
      // 如果是赛果
      // this.date_menu_list = this.sub_menu_list[this.sub_menu_i].subList;
      // 设置日期选中项 调用三级菜单点击事件，默认第一个
      // this.select_result_date_menu();
    } else {
      //  设置三级日期 菜单
      this.set_current_lv3_menu(null);
      // this.set_one_two_three_level_menu_data();
      // 菜单实例 初始化
      // this.handle_MenuInfoInstance_init();
    }
  }
  //setter=======
  recombine_menu(data) {
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
    // let result_menu = this.init_amidithion(amidithion);
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
    this.menu_list = [
      ...new_menu,
      menu_dianjing,
      { mi: 8 },
      menu_jingzu,
      // result_menu,
    ];
    return this.menu_list;
  }
  //选中一级menu
  set_current_lv1_menu(item) {
    this.current_lv_1_menu = item;
    this.set_current_menu(item);
  }
  set_current_menu(item) {
    this.current_menu = item;
  }
  //选中二级menu
  set_current_lv2_menu(item) {
    this.current_lv_2_menu = item || {};
    this.set_current_menu(item);
  }
  //选中三级menu
  set_current_lv3_menu(item) {
    this.current_lv_3_menu = item || {};
  }
  //根据一级菜单筛选二级菜单列表
  get_current_lv_2_menu_list() {
    let mi = this.current_menu;
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
  get_curr_sub_menu_type() {
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

  get_current_sub_menuid() {
    return this.current_menu?.mi || "";
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
