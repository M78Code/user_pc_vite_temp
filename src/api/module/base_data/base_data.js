
import {http} from "src/core/http/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { API_PREFIX } = BUILDIN_CONFIG ;
const { API_PREFIX_JOB:prefix_11,API_PREFIX_USER:prefix_12} = API_PREFIX;

// 新旧菜单ID对应
export const post_base_data_menu_mapping = (params, config={}, url = "/v3/menu/loadMappingPB")=>{
  return http.post(`${prefix_11}${url}`, params, config);
}
//菜单数量统计
export const get_base_data_menu_init = (params, config={}, url = "/v3/menu/initPB") => {
  return http.get(`${prefix_11}${url}`, params, config);
};
// 旧菜单数量统计
export const get_base_data_menu_init_old = (params, config={}, url = "/v2/w/menu/init") => {
  return http.get(`${prefix_11}${url}`, params, config);
};
// 菜单-联赛-赛事
export const post_base_data_mi_tid_mids = (params, config={}, url = "/v3/menu/loadTournamentMatchPB")=>{
  return http.post(`${prefix_11}${url}`, params, config);
}
// 菜单国际化
export const post_base_data_menu_i18n = (params, config={}, url = "/v3/menu/loadNameListPB")=>{
  return http.post(`${prefix_11}${url}`, params, config);
}
// 元数据接口
export const get_base_data = (params, config={}, url = "/v2/m/getOriginalDataPB") => {
  return http.get(`${prefix_11}${url}`, params, config);
};
