import {http} from "src/core/http/";
const { API_PREFIX = {}} = window.BUILDIN_CONFIG;
const { API_PREFIX_JOB:prefix_job,API_PREFIX_USER:prefix_12} = API_PREFIX;

// 新旧菜单ID对应
export const post_base_data_menu_mapping = (params, config={}, url = "/v3/menu/loadMappingPB")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}
//菜单数量统计
export const get_base_data_menu_init = (params, config={}, url = "/v3/menu/initPB") => {
  return http.get(`${prefix_job}${url}`, params, config);
};
// 菜单-联赛-赛事
export const post_base_data_mi_tid_mids = (params, config={}, url = "/v3/menu/loadTournamentMatchPB")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}
// 菜单国际化
export const post_base_data_menu_i18n = (params, config={}, url = "/v3/menu/loadNameListPB")=>{
  return http.post(`${prefix_job}${url}`, params, config);
}
// 元数据接口
export const get_base_data = (params, config={}, url = "/v2/m/getOriginalData") => {
  return http.get(`${prefix_job}${url}`, params, config);
};
