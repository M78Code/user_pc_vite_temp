/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-05 13:22:28
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-09 11:57:49
 * @FilePath       : \user-pc-vue3\src\components\menus\menu.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ref } from "vue";

export const use_new_menu = () => {
  //菜单的 整体输出
  const left_menu_result = ref({
    sportId:"", //赛种id
    is_collet:false, //是否收藏
  });
  // 头部菜单的 root 节点   root ： 1 首页  2 滚球  3 my bets   4 左侧赛种
  const menu_top_root = ref(1);
  // 中间 头部 菜单的 整体输出
  const mid_menu_top_result = ref({
    matches: "featured", // featured  top_events 
    sportId: 1 , //  赛种id top_events才有的 默认是第一个赛种 id 足球
  });
  // 中间 左侧 菜单的 整体输出
  const mid_menu_left_result = ref({
    matches: "matches", // matches  langue 
    type: '' , //  赛种下的 赛事的所有日期 或 联赛的所有洲的 类型
  });
  // 中间 菜单的 点击之后的 列表请求 参数 配置
  const match_list_api_config = ref({
    match_list: {},
    bymids: {},
  })
  // api参数的版本
  const api_config_version = ref(123)

  /**
  * @Description 设置 api参数的版本
  * @param {undefined} undefined
  */
  const set_api_config_version = () => {
    api_config_version.value = Date.now();
  }

  /**
   * 设置    左侧菜单输出
   *
   */
  const set_left_menu_result = obj => {
    menu_root.value = obj.root;

    left_menu_result.value = {
      ...obj,
      version: Date.now(),
    };
  }

  /**
   * @description: 设置头部切换
   * @param {*} obj 
   * @return {*}
   */  
  const set_menu_top_root = root => {
    menu_top_root.value = root
  }

  /**
   * @description: 设置首页 中间输出
   * @param {*} obj
   * @return {*}
   */  
  const set_mid_menu_top_result = obj =>{
    mid_menu_top_result.value = obj
  }

  
  /**
   * @description: 设置左侧菜单 中间输出
   * @param {*} obj
   * @return {*}
   */  
  const set_mid_menu_left_result = obj =>{
    mid_menu_left_result.value = obj
  }

  /**
   * 定义  设置 请求  列表结构  API 参数的   值
   */
  const set_match_list_api_config = config => {

    match_list_api_config.value = JSON.parse(JSON.stringify(config));
    // match_list_api_config.version = Date.now();
    set_api_config_version()

    //  //菜单切换是筛选数据置空
    // store.dispatch("set_filter_select_obj", []);
    // match_list_api_config.value = match_list_api_config;

  }


  return {
    left_menu_result,
    menu_top_root,
    mid_menu_top_result,
    mid_menu_left_result,
    match_list_api_config,
    api_config_version,

    set_left_menu_result,
    set_mid_menu_left_result,

    set_mid_menu_top_result,
    set_menu_top_root,
    
    set_match_list_api_config,

  }
}


