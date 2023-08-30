import {http} from "src/core/http/index.js";
// const { API_PREFIX = {}} = window.BUILDIN_CONFIG;
// const { API_PREFIX_JOB:prefix_job,API_PREFIX_USER:prefix_12} = API_PREFIX;
let prefix_job = 'https://api.sportxxxw1box.com'
let originData_prefix_job = 'http://api.sportxxxvo3.com'

// 新旧菜单ID对应
export const post_base_data_menu_mapping = (params, config={}, url = "/yewu11/v3/menu/loadMapping")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}
//菜单数量统计
export const get_base_data_menu_init = (params, config={}, url = "/yewu11/v3/menu/init") => {
  return http.get(`${prefix_job}${url}`, params, config);
};
// 旧菜单数量统计
export const get_base_data_menu_init_old = (params, config={}, url = "/yewu11/v2/w/menu/init") => {
  return http.get(`${prefix_job}${url}`, params, config);
};
// 菜单-联赛-赛事
export const post_base_data_mi_tid_mids = (params, config={}, url = "/yewu11/v3/menu/loadTournamentMatch")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}
// 菜单国际化
export const post_base_data_menu_i18n = (params, config={}, url = "/yewu11/v3/menu/loadNameList")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}
// 元数据接口
export const get_base_data = (params, config={}, url = "/yewu11/v2/m/getOriginalData") => {
  return http.get(`${originData_prefix_job}${url}`, params, config);
};
