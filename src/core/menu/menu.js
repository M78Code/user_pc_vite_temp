/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-30 13:16:32
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-30 20:39:11
 * @FilePath       : \user-pc-vite\src\core\menu\menu.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ref } from "vue";

// 菜单默认数据
const menu = [
  101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
  106, 118,
];

// 电子竞技 菜单
const esports = [2100, 2101, 2102, 2103];

// 菜单核心方法
export const useMenu = () => {
  // 菜单列表
  const menu_list = ref(menu);

  /**
   * 根据  一级 菜单ID 计算 赛种 ID
   * @param {*} mi 菜单id
   */
  const compute_sport_id = (mi) => {
    const obj = {
      101: 1,
      102: 2,
      103: 3,
      104: 4,
      105: 5,
      106: 6,
      107: 7,
      108: 8,
      109: 9,
      110: 10,
      111: 11,
      112: 12,
      113: 13,
      114: 14,
      115: 15,
      116: 16,
      118: 18,
      300: 300,
      400: 400,
      2000: 2000,
    };
    return obj[mi];
  };
  /**
   * 解析  新的菜单到旧的菜单的映射关系
   *  t：模板ID，s：玩法ID p：旧的菜单ID p 是pc  h 是h5 ；
   *  目前改动只针对PC玩法菜单，包含：今日、早盘、串关；H5没有玩法菜单
   *
   */
  const resolve_mi_euid_map_res = (mi_euid_map_res = []) => {
    let obj = {};
    for (let i in mi_euid_map_res) {
      let item = mi_euid_map_res[i];
      obj[`mi_${i}`] = {
        euid: item.p || "", // 旧的菜单ID
        orpt: "" + item.t, // 模板ID
        pids: item.s || "", // 玩法ID
      };
    }
    return obj;
  };
  const count_menu = (menu_list = [], list) => {
    //传入sl eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
    //计算数量
    if (menu_list[0]?.mi == 500) {
      const data = _.findIndex(menu_list[0].sl, (item) => {
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
  };
  const recombine_menu = (data, sort, amidithion) => {
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
    _.each(data, (item) => {
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
    _.each(menuRule, (menu_item, index) => {
      new_menu[index] = { mi: menu_item, sl: [] };
      _.each(mi_list, (item) => {
        const filter_data = _.find(conventional, (item1) => {
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
  };

  return {
    menu_list,
    count_menu,
    recombine_menu,
    compute_sport_id,
    resolve_mi_euid_map_res,
  };
};
