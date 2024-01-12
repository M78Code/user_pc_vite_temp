/*
 * @Author: rise
 * @Date: 2023-11-05 16:46:06
 * @LastEditors: rise
 * @LastEditTime: 2023-11-07 18:49:03
 * @Description:  
 */

import lodash_ from "lodash";
import { ref,nextTick } from "vue";
import BaseData from "src/core/base-data/base-data.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import {
  SessionStorage,
  LocalStorage
} from "src/output/module/constant-utils.js"
import {
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG ;
import STANDARD_KEY from "src/core/standard-key";
const menu_h5_key = STANDARD_KEY.get("menu_h5_key");
const menu_h5 = STANDARD_KEY.get("menu_h5");

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
      nextTick(()=>{
        SessionStorage.set(menu_h5_key,this)
      })
    }, 16);
    //提供销毁函数
    this.destroy = () => {
      this.update && this.update.cancel()
    }
    // 菜单赛种对应的赛种id
    this.menu_csid = 0
    //----------------------------------- 常规球种 --------------------------------------//
    // 欧洲版 h5 默认 今日
    this.current_lv_1_menu_i = 2;
    this.current_lv_2_menu_i = '';
    this.current_lv_2_menu_mi = ref('0');
    this.menu_lv_mi_lsit = []
    // 赛果 日期/赛中
    this.result_menu_api_params = {}
    //赛事列表 日期
    // this.menu_match_date_params= {}
    this.menu_list = []; //常规球种 101...
    this.top_events_list = []; //热门球种
    this.champion_list = []; //冠军球种
    this.slideMenu_sport = [];//赛果列表
    //home tab
    this.home_menu = 'featured';
    //收藏tab
    this.collect_menu = '';
    //赛果tab
    this.result_menu = 0;

    this.menu_mi = ref(''); //常规球种选中
    this.menu_type = ref(2); //id   2今日(左侧抽屉) 1滚球(滚动tab) 3早盘 8VR() 7电竞() 28赛果() 500热门


    //----------------------------------- 收藏 --------------------------------------//
    this.collect_id = '';//收藏id 
    this.collect_list = []

    this.set_menu_h5_key_refresh()
  }

  get_menu_lv_2_mi_list(mi){
    const item = this.menu_lv_mi_lsit.find(item=> item.mi == mi) || {}
    return item.sl
  }

  
  // 刷新后 获取缓存数据
  set_menu_h5_key_refresh() {
    const notItem = ['menu_type','current_lv_2_menu_mi','update_time']
    // 获取数据缓存
    let session_info = SessionStorage.get(menu_h5_key);
    if (!session_info) {
      return;
    }
    if (Object.keys(session_info).length) {
      for(let item in session_info){
        if(!notItem.includes(item)){
          this[item] = session_info[item]
        }
      }
    }
  }

  /**
   * 初始化
   */
  set_init_menu_list(arr){
    let menu_list = [],
        menu_arr = [],
        top_events_list = [],
        champion_list = [],
        data = arr || BaseData.mew_menu_list_res
    // const session_info = SessionStorage.get(menu_h5);
    let session_info = LocalStorage.get(menu_h5);
    //常规球种
    // menu_list = IS_FOR_NEIBU_TEST?[...BaseData.left_menu_base_mi,{mi:400,ct:1},{mi:2000,ct:0},{mi:300,ct:0}]:[...BaseData.left_menu_base_mi,{mi:400,ct:1}];
    //二期测试环境全放开
    menu_list = [...BaseData.left_menu_base_mi,{mi:400,ct:1},{mi:2000,ct:0},{mi:300,ct:0}];
    menu_arr = menu_list.map((item)=>{return +item.mi});
    //热门球种
    top_events_list = (data.find((item)=>{return item.mi==5000}).sl || []).filter((n)=>{return menu_arr.includes(+n.mi-4900)});

    //冠军
    champion_list = (data.find((item)=>{return item.mi==400}).sl || []).filter((n)=>{return menu_arr.includes(+n.mi-300)});
    //热门球种不存在取常规球种  1
    // top_events_list = top_events_list.length?top_events_list.map((item)=>{
    //   return {
    //     ...item,
    //     mi:`${+item.mi-4900}`,
    //     defaultMi:item.mi,
    //     csid:`${+item.mi-5000}`,
    //   }
    // }):menu_list.map((item)=>{
    //   return {
    //     ...item,
    //     defaultMi:item.mi,
    //     csid:`${+item.mi-100}`,
    //   }
    // });
    //取常规球种 数量取热门球种   2
    // top_events_list = menu_list.map((item)=>{
    //   return {
    //     ...item,
    //     defaultMi:item.mi,
    //     csid:`${+item.mi-100}`,
    //     ct:top_events_list.find((n)=>{return +item.mi === +n.mi-4900})?.ct
    //   }
    // });
    //正常取热门球种 3
    
    top_events_list = top_events_list.map((item)=>{
      return {
        ...item,
        mi:`${+item.mi-4900}`,
        defaultMi:item.mi,
        csid:`${+item.mi-5000}`
      }
    });
    // top_events_list.push({...top_events_list[0],...{mi:102,csid:1}})

    champion_list = champion_list.map((item)=>{
      return {
        ...item,
        mi:`${+item.mi-300}`,
        defaultMi:item.mi
      }
    });
    this.menu_list = menu_list;
    this.top_events_list = top_events_list;
    this.champion_list = champion_list;
    if(session_info){//取session球种id
      this.current_lv_2_menu_i = `${session_info.menu_mi}${this.menu_type.value}`;
      this.menu_mi.value = session_info.menu_mi;
      this.menu_csid = +session_info.menu_mi - 100
    }
    !arr && useMittEmit(MITT_TYPES.EMIT_UPDATE_INIT_DATA,menu_list);
  }
  // 根据菜单id 获取对应的euid
  get_mid_for_euid(mi) {
    let obj = lodash_.get(BaseData.mi_euid_map_res,`[${mi}]`, {})
    return obj.p || 30001
  }
  /**
   * 收藏
   * @param {*} mid 
   * @returns 
   */
  get_menu_lvmi_list_only(mid){
    let menu_lv_mi_lsit = [];
    this.menu_list.forEach(item => {
      (item.sl || []).find(obj=>{
        // 菜单id最后一位为顶级菜单的id
        if(obj.mi.substr(obj.mi.length-1,1) == mid){
          menu_lv_mi_lsit.push(obj)
        }
      })
    })
    menu_lv_mi_lsit = menu_lv_mi_lsit.map((item)=>{
      return {
        ...item,
        mi:item.mi.slice(0,3)
      }
    })
    return menu_lv_mi_lsit
  }
  //设置赛果参数
  set_result_menu_api_params(val){
    this.result_menu_api_params = val
  }
  /**
   * 赛果列表
   */
  set_slideMenu_sport(arr){
    this.slideMenu_sport = arr || [];
    this.update();
  }
  /**
   * home页面tab
   */
  set_home_menu(val){
    this.home_menu = val || 'featured';
    this.update();
  }
  /**
   * 收藏页面tab
   */
  set_collect_menu(val){
    this.collect_menu = val || '';
    this.update();
  }
   /**
   * 赛果页面tab
   */
   set_result_menu(val){
    this.result_menu = val || 0;
    this.update();
  }
  /**
   * 请求赛事列表
   */
  get_match_render_list(){
    if (this.is_results()) return MatchMeta.get_results_match()
    if(!['1','2','3','6'].includes(this.current_lv_1_menu_i))return;
    // 清除赛事折叠信息
    // MatchDataBaseH5.init()
    // MatchFold.clear_fold_info()
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
    if(this.menu_type.value == 400){//冠军
      this.current_lv_2_menu_i = +mi+300;
      this.current_lv_2_menu_mi.value = +mi+300;
    }else{
      this.current_lv_2_menu_i = `${mi}${this.menu_type.value}`;
      this.current_lv_2_menu_mi.value = `${mi}${this.menu_type.value}`;
    }
   
    // SessionStorage.set(menu_h5,{
    //   menu_mi:mi
    // });
    LocalStorage.set(menu_h5,{
      menu_mi:mi
    });
    this.menu_csid = mi*1 - 100
    this.update()
  }
  // 设置二级菜单 id
  set_menu_lv2_mi(val){
    this.current_lv_2_menu_i = val
    this.current_lv_2_menu_mi.value = val
    this.menu_csid = val*1 - 100
  }
  // 设置vr菜单 csid
  set_vr_menu_csid(val){
    this.menu_csid = val
  }
  /**
   * 设置收藏id 特殊处理
   * @param {*} val 
   */
  set_collect_id(val){
    this.collect_id = val;
  }
  /**
   * 清除默认球种
   */
  clear_menu_id(){
    this.current_lv_2_menu_i = "";
    this.menu_mi.value = "";
    this.collect_id = "";
    this.home_menu = 'featured';
    this.collect_menu = '';
    this.result_menu =  0;
  }
  /**
   * 设置时间 并且设置时间请求参数
   * @param {*} time 
   * @param {*} type  0今日 1早盘
   */
  // set_date_time(time,type){
  //   this.data_time = time;
  //   this.set_menu_match_date(type)
  // }

  // // 设置时间请求参数
  // set_menu_match_date(type){
  //   //2 今日  3早盘
  //   let menu_mi =  this.menu_mi.value?`${this.menu_mi.value}${!type? 2 : 3}`:'0';
  //   let params = {
  //     md: this.data_time ,
  //     euid: this.get_euid(menu_mi),
  //     type: !type? 3 : 4, //
  //   }
  //   this.menu_match_date_params = params
  // }
  // 设置收藏列表
  set_collect_list (list) {
    this.collect_list = list
  }

  // 根据菜单id获取下级菜单id 二级菜单
  // mid 顶级菜单id
  get_menu_lvmi_list(mid){
    let menu_lv_mi_lsit = [];
    this.menu_list.forEach(item => {
      (item.sl || []).find(obj=>{
        // 菜单id最后一位为顶级菜单的id
        if(obj.mi.substr(obj.mi.length-1,1) == mid){
          menu_lv_mi_lsit.push(obj)
        }
      })
    })
    this.menu_lv_mi_lsit = menu_lv_mi_lsit;
    this.update();
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
        euid += BaseData.mi_euid_map_res?.[item] && BaseData.mi_euid_map_res?.[item]?.h + ','
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
    return this.menu_type.value == mi
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
  is_esports(mi) {
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
   is_collect() {
    return this.collect_id == 50000;
  }
  /**
   * 判断是否为冠军和电竞冠军  暂时同步 复刻版方法   不然会报错
   */
  get_mm_is_champion() {
    return false
  }
}
export default new MenuData();
