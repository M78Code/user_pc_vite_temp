/*
 * @Author: rise
 * @Date: 2023-11-05 16:46:06
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 16:00:35
 * @Description:  
 */

import lodash_ from "lodash";
import { ref } from "vue";
import BaseData from "src/core/base-data/base-data.js";
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
    this.current_lv_1_menu_i = 2
    this.current_lv_2_menu_i = '1012'
    this.menu_lv_mi_lsit = []

    this.menu_list = []; //常规球种 101...
    this.menu_mi = ""; //常规球种选中
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
    const menu_list =  BaseData.mew_menu_list_res.filter((item)=>{return +item.mi<300})
    this.menu_list = menu_list;
  }
  
  get_menu_type(){

  }
  /**
   * 设置id
   * @param {*} mi 
   */
  set_current_lv1_menu(mi){
    this.menu_type.value = mi;
    this.update()
  }
  /**
   * 设置常规球种
   * @param {*} mi 
   */
  set_menu_mi(mi){
    this.menu_mi = mi;
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
   * 获取 euid
   * 
   * */
  get_euid(menu_type) {
    const menuId = menu_type || this.menu_type;
    return BaseData.mi_euid_map_res[this.menu_mi+menuId]?.h || "";
  }
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
    return this._is_cur_mi(28, mi)
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
