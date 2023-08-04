/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-05 13:49:12
 * @LastEditors    : lane jstylane@itcom888.com
 * @LastEditTime   : 2023-07-05 15:10:14
 * @FilePath       : \user-pc-vue3\src\api\module\base_data.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import axios from "src/api/common/axios.wapper.js";

// 新旧菜单ID对应
export const post_base_data_menu_mapping = (params, config={}, url = "/yewu11/v3/menu/loadMapping") => axios.post(url, params);

//菜单数量统计
export const get_base_data_menu_init = (params, config={}, url = "/yewu11/v3/menu/init") => axios.get(url, params);

// 菜单-联赛-赛事
export const post_base_data_mi_tid_mids = (params, config={}, url = "/yewu11/v3/menu/loadTournamentMatch") => axios.post(url, params);

// 菜单国际化
export const post_base_data_menu_i18n = (params, config={}, url = "/yewu11/v3/menu/loadNameList") => axios.post(url, params);

// 元数据接口
export const get_base_data = (params, config={}, url = "/yewu11/v2/m/getOriginalData") => axios.get(url, params);

// 专业版获取----主列表顶部日期菜单
export const post_date_menu = (params, config={}, url = "/yewu11/v2/menu/getDateMenuList") => axios.post(url, params,{axios_debounce_cache_key:'post_date_menu'});
