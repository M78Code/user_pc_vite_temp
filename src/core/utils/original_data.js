import lodash from "lodash"
const base_data = {
  //=============================
  count_menu(menu_list = [], list) {
    //传入sl eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
    //计算数量
    if (menu_list[0]?.mi == 500) {
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
    return menu_list.reduce((pre, cur) => {
      return pre + cur.ct;
    }, 0);
  },
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
  },
  get_csna(csid, use_storage = false) {
    if (use_storage) {
      const sp_list = JSON.parse(sessionStorage.getItem("sp_list"));
      if (sp_list) {
        return sp_list.find((item) => item.csid == csid);
      }
    }
  },
  get_tn(tid, use_storage = false) {
    if (use_storage) {
      const tids_list = JSON.parse(sessionStorage.getItem("tids_obj"));
      if (tids_list) {
        return tids_list.find((item) => item.tid == tid);
      }
    }
  },
  //get euid
  async get_euid(arg_mi, menu_type) {
    const euid =  await db.menus_mapping.get(arg_mi+'2', "mi");
    return euid.menus_mapping.h||''
    let mi = arg_mi;
    if (!mi) return "";
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
  },
  //indexDB 存储菜单元数据
  set_db_menus_info(data){
    if (!lodash.isEmpty(data)) {
      let db_data = [];
      lodash.each(Object.keys(data), (item) => {
        if(data[item].sl&&this.count_menu(data[item].sl)>0){//过滤没有赛事数据球类
          db_data.push({
            mi: item,
            menu_info: data[item],
          });
        }
      });
      //mi作为主键
      db.menus_info.bulkAdd(db_data, "mi");
    }
  },
   //indexDB 存储菜单元数据mapping
   set_db_menus_mapping(data){
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
  },
  //indexDB 存储名称列表元数据
  set_db_name_list(data){
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
  },
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
  },
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
  },
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
  },
  recombine_menu_desc(item) {
    return item.substr(0, 3);
  },
  recombine_menu(data, sort, amidithion) {
    //常规
    let conventional = [
      101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
      106, 118, 400, 300,
    ];
    let mi_list = [];
    //1=滚球,2=今日,3=早盘,4=冠军,5=即将开赛,6=串关   左侧一级菜单隐藏 串关和即将开赛
    let menuRule = [2, 1, 3, 4];
    // // 竟足
    // let lottery = this.init_lottery(data);
    // 电竞 2100 = 英雄联盟
    let menu_dianjing = { mi: 7, sl: [] };
    let menu_jingzu = { mi: 30, sl: [] };
    lodash.each(data, (item) => {
      if (item && item.sl && item.sl.length > 0) {
        mi_list.push(...item?.sl);
      }
      if ([2100, 2101, 2103, 2102].includes(+item.mi)) {
        menu_dianjing.sl.push(item);
      }
      if ([500].includes(+item.mi)) {
        menu_jingzu.sl.push(item);
      }
    });
    // 赛果数据处理
    let result_menu = this.init_amidithion(amidithion);
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
    return sort
      ? [...new_menu, menu_dianjing, { mi: 8 }, menu_jingzu, result_menu]
      : [...new_menu, { mi: 8 }, menu_dianjing];
  },
  // 查找竞足数据
  init_lottery(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  },
  champion_menu_euid(mi) {
    return 400 + parseInt(mi.substr(1, 2));
  },

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
  },
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
  },
  //整点随机规则
  time_random_req() {
    const random_minutes = lodash.random(0, 15);
    //现在时间分钟数-随机分钟数 大于45  开始更新api
    return {
      can_update_data: new Date().getMinutes() - random_minutes > 45,
      random_minutes,
    };
  },
};
export default base_data;
