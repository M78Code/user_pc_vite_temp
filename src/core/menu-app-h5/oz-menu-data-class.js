/*
 * @Author: rise
 * @Date: 2023-11-05 16:46:06
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 18:49:03
 * @Description:  
 */

import lodash_ from "lodash";
import { ref } from "vue";
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import {MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from "src/core/";
import MatchFold from 'src/core/match-fold';
const menu_type_config = {
  1: 1,
  2: 3,
  3: 4,
  400: 100,
  6: 11,
  2000: 3000,
  50000: 50000,
  28:28
}
class MenuData {
  constructor() {
    const that = this;
    this.update_time = ref(Date.now()); //更新触发
    //通知数据变化 防止调用多次 20毫秒再更新
    this.update = lodash_.debounce(() => {
      that.update_time.value = Date.now();
    }, 16);
    //提供销毁函数
    this.destroy = () => {
      this.update && this.update.cancel()
    }
    this.current_lv_1_menu_i = '1';
    this.current_lv_2_menu_i = 0;
    this.menu_lv_mi_lsit = []
    // 赛果 日期/赛中
    this.result_menu_api_params = {}
    this.menu_list = []; //常规球种 101...
    this.top_events_list = []; //热门球种
    this.menu_mi = ref(''); //常规球种选中
    this.menu_type = ref(2); //id   2今日(左侧抽屉) 1滚球(滚动tab) 3早盘 8VR() 7电竞() 28赛果() 500热门
  }

  get_menu_lv_2_mi_list(mi){
    const item = this.menu_lv_mi_lsit.find(item=> item.mi == mi) || {}
    return item.sl
  }

  /**
   * 初始化
   */
  set_init_menu_list(){
    //常规球种
    const menu_list =  BaseData.mew_menu_list_res.filter((item)=>{return +item.mi<300});
    const top_events_list =  BaseData.mew_menu_list_res.filter((item)=>{return item.mi==5000})?.[0].sl || [];
    this.menu_list = menu_list;
    this.top_events_list = top_events_list;
    this.update()
  }
  //设置赛果参数
  set_result_menu_api_params(val){
    this.result_menu_api_params = val
  }
  /**
   * 请求赛事列表
   */
  get_match_render_list(){
    if (this.is_results()) return MatchMeta.get_results_match()
    if(!['1','2','3','6'].includes(this.current_lv_1_menu_i))return;
    // 清除赛事折叠信息
    MatchDataBaseH5.init()
    MatchFold.clear_fold_info()
    // 赛果不走元数据， 直接拉取接口
    const mi_tid_mids_res = lodash_.get(BaseData, 'mi_tid_mids_res')
    if (lodash_.isEmpty(mi_tid_mids_res)) return
    // 设置菜单对应源数据
    MatchMeta.set_origin_match_data()
  }
  /**
   * 设置id
   * @param {*} mi 
   */
  set_current_lv1_menu(mi){
    this.menu_type.value = mi;
    this.current_lv_1_menu_i = mi;
    this.update()
  }
  /**
   * 设置常规球种
   * @param {*} mi 
   */
  set_menu_mi(mi){
    this.menu_mi.value = mi;
    this.current_lv_2_menu_i = `${mi}${this.menu_type.value}`;
    this.update()
  }
  // 根据菜单id获取下级菜单id 二级菜单
  // mid 顶级菜单id
  get_menu_lvmi_list(mid){
    let menu_lv_mi_lsit = [];
    this.menu_list.forEach(item => {
      (item.sl || {}).find(obj=>{
        // 菜单id最后一位为顶级菜单的id
        if(obj.mi.substr(obj.mi.length-1,1) == mid){
          menu_lv_mi_lsit.push(obj)
        }
      })
    })
    this.menu_lv_mi_lsit = menu_lv_mi_lsit
    return menu_lv_mi_lsit
  }
  /**
   *一级菜单顶层菜单的 菜单类型  ，没有则是0
   * */
   get_menu_type() {
    return this.menu_type.value || 0;
  }
   /**
   * 兼容老的菜单ID?
  */
   menu_id_map(mi, menu_arr = false) {
    return menu_arr
      ? Object.values(menu_type_config)[mi]
      : menu_type_config[mi];
  }
  /**
   * 获取 euid
   * arg_mi 如果传值 则获取特定值euid 如果没有就是二级菜单的euis
   * */
  get_euid(arg_mi) {
    let mi = arg_mi || this.current_lv_2_menu_i;
    // 全部
    if (mi == 0) {
      let mid_list = []
      let euid = ''
      // 获取滚球全部的 菜单id
      this.menu_lv_mi_lsit.forEach(item=>{
        if( ![0,50000].includes(item.mi)){
          mid_list.push(item.mi)
        }
      })
      // 根据 菜单id 获取euid
      mid_list.forEach(item=>{
        euid += BaseData.mi_euid_map_res[item] && BaseData.mi_euid_map_res[item].h + ','
      })
      return euid
    }
    // 赛果
    if (this.is_results()) return mi;
    if (BaseData.mi_euid_map_res && BaseData.mi_euid_map_res[mi]) {
      return BaseData.mi_euid_map_res[mi].h;
    } else {
      // 电竞无旧菜单id处理
      return {
        2100: 41002,
        2101: 41001,
        2102: 41004,
        2103: 41003,
      }[mi];
    }
  }
  /**
   * 获取 euid
   * 
   * */
  // get_euid(menu_type) {
  //   const menuId = menu_type || this.menu_type.value;
  //   return BaseData.mi_euid_map_res?.[this.menu_mi.value+menuId]?.h || "";
  // }
  //内部方法
  _is_cur_mi(mi, param) {
    if (param) {
      return mi == param
    }
    return this.menu_type == mi
  }
  /**
   * 是否选中了 热门
   * mi [number|string] 要比对的值
   * 没有传递对比当前菜单
  */
  is_hot(mi) {
    return this._is_cur_mi(500, mi)
  }
  /**
   * 是否选中了VR 
   * mi [number|string] 要比对的值
   * 没有传递对比当前菜单
  */
  is_vr(mi) {
    return this._is_cur_mi(300, mi)
  }
  /**
   * 是否选中了赛果
   *  mi [number|string] 要比对的值
  */
  is_results(mi) {
    return this._is_cur_mi(29, mi)
  }
  /**
   * 是否选中了早盘
   *  mi [number|string] 要比对的值
  */
  is_zaopan(mi) {
    return this._is_cur_mi(3, mi)
  }
  /**
   * 是否选中了今日
   *  mi [number|string] 要比对的值
  */
  is_today(mi) {
    return this._is_cur_mi(2, mi)
  }
  /**
   * 是否选中了滚球
   *  mi [number|string] 要比对的值
  */
  is_scroll_ball(mi) {
    return this._is_cur_mi(1, mi)
  }
  /**
   * 是否选中了冠军
   *  mi [number|string] 要比对的值
  */
  is_kemp(mi) {
    return this._is_cur_mi(400, mi)
  }
  /**
   * 是否选中了电竞
   *  mi [number|string] 要比对的值
  */
  is_export(mi) {
    return this._is_cur_mi(2000, mi)
  }
  /**
   * 是否选中了串关
   *  mi [number|string] 要比对的值 没有传递对比当前菜单
  */
  is_mix(mi) {
    return this._is_cur_mi(6, mi)
  }
  /**
   * 是否选中了竞足
   *  mi [number|string] 要比对的值
  */
  is_jinzu(mi) {
    return this._is_cur_mi(30, mi)
  }
  /**
   * 是否选中了收藏
   *  mi [number|string] 要比对的值
  */
   is_collect(mi) {
    return this._is_cur_mi(50000, mi)
  }
}
export default new MenuData();
