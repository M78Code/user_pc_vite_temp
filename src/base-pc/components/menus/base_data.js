/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-05 13:42:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-10 19:45:23
 * @FilePath: \user-pc-vue3\src\components\menus\base_data.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { api_base_data } from "src/api/index.js";
import useSWRV from 'swrv'
import _ from "lodash"

import { ref, computed, defineComponent, onMounted } from "vue";
// import store from "src/store-redux-vuex/redux_menu.js";

/**
 * @description: 菜单列表
 * @return {*}
 */
const init_mew_menu_list = async () => {
  let res = await api_base_data.get_base_data_menu_init({});
  let menu_info = set_ses_wapper(res, []);
  const left_menu = []
  const in_play = []
  // 左侧菜单id
  menu_info.forEach(item => {
    // vr300 冠军400 2000 电竞 500热门
    if (Number(item.mi) < 300) {
      let count = (item.sl || []).reduce((total,cur) => {
        if(cur.mi == item.mi + '4'){
          return total
        }
        return total + Number(cur.ct)
      },0)

      // 赛种下面有赛事
      if( count > 0){
        left_menu.push(Number(item.mi))

        // 有滚球赛事
        let obj = (item["sl"] || []).find((y) => y.mi == `${item.mi}1` && y.ct > 0 ) || {};
      
        if(obj.mi){
          in_play.push({mi:item.mi,count:obj.ct})
        }
      }
    }
  })
  // let esports_obj = menu_info.find(page => [2100, 2101, 2102, 2103].includes(Number(page.mi))) || {}
  // if (esports_obj.mi) {
  //   left_menu.splice(3, 0, 2000)
  // }

  // 获取 top events 的 赛种
  let mi_5000 = menu_info.find(item=> item.mi == 5000) || {}
  // - 5000 得到 csid  + 100 得到 菜单id 
  let top_events = ( mi_5000.sl || [] ).map(item => (Number(item.mi) - 5000 + 100) ) || []


  // let state = store.getState()
  // // 获取最新的 数据
  // let redux_menu = _.cloneDeep(state.menusReducer.redux_menu) 

  // redux_menu.in_play = in_play
  // redux_menu.top_events = top_events
  // redux_menu.menu_list = left_menu

  // // 设置 左侧菜单
	// store.dispatch({
  //   type: "SETREDUXMENU",
  //   data: redux_menu,
  // });

  // 设置新菜单 
  return left_menu;
}


/**
* 国际化菜单
*/
const init_base_menu_il8n = async () => {
  let res = await api_base_data.post_base_data_menu_i18n({});
  let menu_i18n = set_ses_wapper(res, {});
  menu_i18n["2000"] = 'Esports';

  return menu_i18n
}

export const useMenuData = () => {
  const { data, error } = useSWRV('/yewu11/v3/menu/init', init_mew_menu_list, { refreshInterval: 5000 })
  return { data, error }
}

export const useMenuI18n = () => {
  const { data, error } = useSWRV('/yewu11/v3/menu/loadNameList', init_base_menu_il8n, { refreshInterval: 5000 })
  return { data, error }
}

/**
   * 接口返回数据的 wapper
   */
const set_ses_wapper = (res, default_value) => {
  let result = default_value;
  let data = (res || {}).data;
  if (data && (data.code == "0000000" || data.code == "200")) {
    result = data.data;
  }
  return result;
}


export const use_base_data = () => {

  // 新的菜单到旧的菜单的映射关系 
  const mi_euid_map_res = ref({})

  const init = () => {
    init_mi_euid_map();
  }

  /**
  * 获取 新旧菜单ID对应
  */
  const init_mi_euid_map = async () => {
    let res = await api_base_data.post_base_data_menu_mapping({});
    // 接口返回值很多没有p值，也就是euid 值，先注释调用接口的，用默认的，
    mi_euid_map_res.value = set_ses_wapper(res, {});
  }

  /**
   * 根据  一级 菜单ID 计算 赛种 ID
   * @param {*} mi
   */
  const compute_sport_id = mi => {
    let obj = {
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
  }

  return {
    mi_euid_map_res,
    init,
    compute_sport_id,
  }

}
