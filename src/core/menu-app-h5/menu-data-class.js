/**
 * 菜单 需要实现 保留 各级菜单 以及最终输出结果的   两个版本 ，
 */
// "1": "滚球",  "2": "今日", "3": "早盘",  "400": "冠军","5": "即将开赛", "6": "串关","7": "电竞",
// "8": "VR",// "28": "赛果", "30": "竞足",// 500热门


/*以下是老的菜单对应ID*/
// menu_type  100（冠军）  3000（电竞） 赛果29  滚球:1 今日:3 早盘:4 串关:11 冠军:100  竞足 30  vr300 待定
// 如果不是 虚拟体育 900.则设置当前菜单
/*--------------end----------*/

import { api_common, api_analysis } from "src/api";
import lodash_ from "lodash";
import { ref,nextTick } from "vue";
import { sprite_images_postion } from "src/output/module/constant-utils.js";
import {
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt/index.js";
import { LocalStorage,SessionStorage } from "src/core/utils/common/module/web-storage.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BaseData from "src/core/base-data/base-data.js";

const Cache_key = {
  CACHE_CRRENT_MEN_KEY: "CACHE_CRRENT_MENU_KEY_FK", //缓存当前菜单的key
  RESULT_SUB_MENU_CACHE: "RESULT_SUB_MENU_CACHE", //赛果 缓存
};
const menu_type_config = {
  1: 1,
  2: 3,
  3: 4,
  400: 100,
  6: 11,
  2000: 3000,
  50000: 50000,
  28:28,
}

class MenuData {
  constructor() {
    const that = this;
    this.update_time = ref(Date.now()); //更新触发
    //通知数据变化 防止调用多次 20毫秒再更新
    this.update = lodash_.debounce(() => {
      that.update_time.value = Date.now();

      nextTick(()=>{
        SessionStorage.set('menu_app_h5',this)
      })

    }, 16);
    //提供销毁函数
    this.destroy = () => {
      this.update && this.update.cancel()
    }
    this.menu_lv2 = []; //2级菜单列表
    this.menu_lv3 = []; //3级菜单列表
    this.menu_lv4 = []; //4级菜单列表
    //当前的菜单 lv1
    this.current_lv_1_menu_mi = ref('0')
    this.current_lv_1_menu_i = '';
    this.old_current_lv_1_menu_i = '';
    //当前的菜单 lv2
    //当前的菜单 lv2  注意  二级菜单 可能 有一个【全部】选项 get_sport_all_selected
    this.current_lv_2_menu = {};
    this.current_lv_2_menu_i = '';
    this.current_lv_2_menu_mi =  ref('');
    this.menu_csid = '';

    // 收藏数量
    this.collect_count= ref(0)
    //-----------------------------------VR 电竞 收藏--------------------------------------//
    this.top_menu_title = {}
    this.collect_list = []
    //-------------------------------------------------------------------------------------//

     //-----------------------------------VR 电竞 收藏--------------------------------------//
     // 赛果一级菜单
     this.result_menu_lv1_mi = ''
     // 赛果 日期/赛中
     this.result_menu_api_params = {}
     //赛果类型  0 普通 1电竞 2vr  3冠军 
     this.is_results_type = 0;
     this.is_results_vr_type = 0;
      //----------------------------------------------------------------------------------------//

    //当前的菜单 lv3
    this.current_lv_3_menu = {};
    this.current_lv_3_menu_mi = '';
    //当前的菜单 lv4
    this.current_lv_4_menu = {};
    this.current_lv_4_menu_mi = '';
    // 页脚菜单
    this.footer_sub_menu_id = ""; //页脚子菜单id
    //================主列表用的  结束==================
    this.menu_list = []
    this.menu_type = ref(3)
    this.get_sport_all_selected = ''
    this.menu_lv_mi_lsit = []
    // 选中的当前时间
    this.date_time = ""
    this.data_time = ""
    this.data_tab_index = 0;
    this.search_tab_index = 0;
    this.search_tab_i_tid = '';
    //筛选联赛
    this.league_filter_list = [];
    // 时间api接口及参数信息 
    this.menu_match_date_api_config = {}


    this.set_menu_h5_key_refresh()
  }



  // 刷新后 获取缓存数据
  set_menu_h5_key_refresh() {
    const notItem = ['menu_type','current_lv_1_menu_mi','current_lv_2_menu_i','current_lv_2_menu_mi','update_time','collect_count','current_lv_3_menu','data_tab_index','data_time','search_tab_i_tid','search_tab_index']
    // 获取数据缓存
    let session_info = SessionStorage.get('menu_app_h5');
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

  set_menu_data_version(){
    this.update()
  }

  // 设置收藏数量
  set_collect_count(count){
    this.collect_count.value = count
  }

  // 初始化需要使用的数据
  set_init_menu_list(){
    const menu_list = [];
    const current = SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {});
    BaseData.mew_menu_list_res.forEach(item=> {
      if(item.mi < 300){
        menu_list.push(item)
      }
    })
    this.menu_list = menu_list
    this.set_current_lv1_menu(current.current_lv_1_menu_i||2)
    if(current){
      this.set_cache_class(current)
    }
    this.search_data_tab_index()
  }

  set_collect_list (list) {
    this.collect_list = list
  }

  // 设置赛果一级菜单id
  set_result_menu_lv1_mi(mi){
    this.result_menu_lv1_mi = mi
  }
  
  //设置赛果参数
  set_result_menu_api_params(val){
    this.result_menu_api_params = val
  }
  set_results_type(val){
    this.is_results_type = val;
    this.set_cache_class({
      is_results_type:val
    })
  }
  set_results_vr_type(val){
    this.is_results_vr_type = val;
    this.set_cache_class({
      is_results_vr_type:val
    })
  }
  get_results_type(){
    return this.is_results_type
  }
  
  // 根据菜单id获取下级菜单id 二级菜单
  // mid 顶级菜单id
  get_menu_lvmi_list(mid){
    let menu_lv_mi_lsit = [];
    // 冠军 直接取值
    if(mid == 400){
      menu_lv_mi_lsit = (BaseData.mew_menu_list_res.find(item=> item.mi == 400 ) || {}).sl
    }else{
      this.menu_list.forEach(item => {
        (item.sl || []).find(obj=>{
          // 菜单id最后一位为顶级菜单的id  早盘没有电足电篮
          if(obj.mi.substr(obj.mi.length-1,1) == mid && ![1903,1913].includes(+obj.mi)){
            obj.mif = item.mi;
            menu_lv_mi_lsit.push(obj)
          }
        })
      })
    }
    // 默认设置二级菜单id
    // this.set_current_lv_2_menu_i( lodash_.get(menu_lv_mi_lsit,'[0]',{}))
    // 今日 加入 收藏/vr体育/电竞 滚球加入全部
    // menu_lv_mi_lsit.unshift({mi:50000,btn:1,ct:0,title:"收藏"})
    if([1,2,3,6].includes(mid)){
      let _this = this;
      const is_football = menu_lv_mi_lsit.some((n)=>{return n.mi == `190${_this.current_lv_1_menu_i}`}) && _this.current_lv_1_menu_i !=3;
      const is_basketball = menu_lv_mi_lsit.some((n)=>{return n.mi == `191${_this.current_lv_1_menu_i}`})&& _this.current_lv_1_menu_i !=3;
      const is_number = [BaseData.show_e_soprts.football && is_football ,BaseData.show_e_soprts.basketball && is_basketball];//是否有电子球种
      let num = is_number.filter((n)=>{return !!n}).length+2;
      let type = mid==1?num+1:num;//插入位置
      if(mid == 1){
        const all_ct = menu_lv_mi_lsit.map((item)=>{return item.ct||0}).reduce((n1,n2)=>{return n1+n2}) || 0;//全部
        menu_lv_mi_lsit.splice(0,0,{mi:0,btn:1, ct:all_ct,title:"全部"})
      }
      BaseData.is_mi_300_open && menu_lv_mi_lsit.splice(type,0,{mi:300,btn:1,ct:0,title:"VR体育"})
      BaseData.is_mi_2000_open && menu_lv_mi_lsit.splice(type+1,0,{mi:2000,btn:1,ct:0,title:"电竞"})
    }
    this.menu_lv_mi_lsit = menu_lv_mi_lsit
    return menu_lv_mi_lsit
  }

  get_menu_lvmi_list_only(mid){
    let menu_lv_mi_lsit = [];
    this.menu_list.forEach(item => {
      (item.sl || {}).find(obj=>{
        // 菜单id最后一位为顶级菜单的id
        if(obj.mi.substr(obj.mi.length-1,1) == mid){
          menu_lv_mi_lsit.push(obj)
        }
      })
    })
    return menu_lv_mi_lsit
  }
  /**
   * 设置旧id
   */
  set_old_current_lv_1_menu_i(mid){
    this.old_current_lv_1_menu_i = mid ||2;
    this.set_cache_class({
      old_current_lv_1_menu_i:mid ||2
    });
  }
  // 设置 收藏 /vr体育 /电竞头部
  set_top_menu_title(val){
    this.top_menu_title = val;
    const obj = val?.mi?{}:{
      current_lv_1_menu_i:this.old_current_lv_1_menu_i || 2,
      current_lv_1_menu_mi:this.old_current_lv_1_menu_i || 2,
      data_tab_index:0,
      data_time :'',
      current_lv_3_menu:{field1:''}
      // current_lv_2_menu:{},
      // current_lv_2_menu_i:''
    }
    this.set_cache_class({
      top_menu_title:val,
      ...obj
    });
    this.update()
  }
  /**
   * 根据菜单id获取对应的数据id s
   * @param {*} mid 
   * @returns 
   */
  get_menu_lvmi_special_list(mid){
    let menu_lv_mi_lsit = (BaseData.mew_menu_list_res.find(item=> item.mi == mid ) || {}).sl
    return menu_lv_mi_lsit
  }
  get_menu_lv_2_mi_list(mi){
    const item = this.menu_lv_mi_lsit.find(item=> item.mi == mi) || {}
    return item.sl
  }

  // 设置二级菜单id
  set_current_lv_2_menu_i(val = {},type=0){
    const current = SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {});
    val = type && current.current_lv_2_menu?.mi?current.current_lv_2_menu:val;
    this.current_lv_2_menu_mi.value = val?.mi
    this.current_lv_2_menu_i = val?.mi;
    this.current_lv_2_menu = val;
    this.set_cache_class({
      current_lv_2_menu:val,
      current_lv_2_menu_mi:val?.mi,
      current_lv_2_menu_i:val?.mi,
    });
    this.set_menu_csid(val?.mi);
    this.update()
  }
   // 设置三级菜单id
   set_current_lv_special_menu_mi(val = {}){
    this.current_lv_special_menu_mi = val.mi;
    this.current_lv_special_menu = val;
    this.update()
  }
  /**
   * 设置csid
   */
  set_menu_csid(mi){
    let csid = "",
        v1_mi = [0,300,2000,50000];
    if(v1_mi.includes(+mi)){
      csid = '';
    }//全部 vr 电竞 收藏
    else if(+mi>1000 && +mi<2000){
      csid = Number(this.recombine_menu_desc(mi))-100;
    }//常规
    else if(+mi>400 && +mi<1000){
      csid = +mi-400
    }//冠军
    else if(+mi>2000){
      csid = +mi-2000
    }//vr 电竞球种
    else{
      csid = mi
    }
    this.menu_csid = csid;
    this.update()
  }
  /**
   * 选中1级menu
   * item [object]当前点击对象
   */
  set_current_lv1_menu(lv1_mi) {
    // const current = SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {});
    this.current_lv_1_menu_mi.value = lv1_mi  
    this.current_lv_1_menu_i = lv1_mi
    // this.menu_type.value = menu_type_config[lv1_mi]  
    this.menu_type.value = lv1_mi;
    this.set_cache_class({
      current_lv_1_menu_i:lv1_mi,
      current_lv_1_menu_mi:lv1_mi
    });
   
    // 早盘 /串关 不走此逻辑
    // if([1,2,400].includes(lv1_mi*1)){

    //   this.get_menu_lvmi_list(lv1_mi)
    //   let index = 0
    //   // 今日/滚球第一位是收藏 默认选中足球/全部 
    //   if([1,2].includes(lv1_mi*1)) {
    //     index = 1
    //   }
    //   if([1].includes(lv1_mi*1)) {
    //     this.menu_csid = '';
    //   }
    //   this.set_current_lv_2_menu_i( current.current_lv_2_menu || lodash_.get(this.menu_lv_mi_lsit,`[${index}]`,{}))
    // }
    this.update();
  }
  /**
 * 获取对应日期
 */
  async getDateList(csid){
    const params = {
      csid:csid || this.menu_csid,
      device:"H5"
    };
    const res = await api_common.get_esports_date_menu(params);
    if(res?.code == '200'){
        const data = res?.data?.map((item)=>{
            return {
                count:item.count,
                name: item.menuName,
                val: item.field1,
                menuType:item.menuType
            }
        })||[];
        // return [...[{name:i18n_t('ouzhou.match.today'),val:'',type:0}],...data]
        return data
    }
    return [];
  };
  // 设置 menu_types
  set_collect_menu_type (lv1_mi) {
    this.menu_type.value = menu_type_config[lv1_mi]  
  };
  /**
   * 设置足球联赛 联赛筛选
   * @param {*} i 
   * @param {*} tid 
   */
  search_data_tab_index(i,tid,tid_list){
    this.search_tab_index = i||0;
    this.search_tab_tid = tid||'';
    this.league_filter_list = tid_list||[];
    if(!tid_list) UserCtr.set_league_select_list([],this.is_results()?"amidithion":"")
    this.set_cache_class({
      search_tab_index:i||0,
      search_tab_i_tid:tid||'',
      league_filter_list:tid_list||[]
    });
    this.update();
  };
  /**
   * 设置时间 并且设置时间请求参数
   * @param {*} index 
   * @param {*} time 
   * @param {*} menuType  电竞冠军下 menuType为100
   */
  set_date_time(index,time,menuType){
    this.data_tab_index = index;
    this.data_time = time;
    this.current_lv_3_menu = {field1:time,menuType:menuType||""};
    this.set_menu_match_date()
    this.set_cache_class({
      data_tab_index:index,
      data_time:time,
      current_lv_3_menu:{field1:time,menuType:menuType||""}
    });
    this.update();
  }

  // 设置时间请求参数
  set_menu_match_date(){
    let config = {
      api: "",
      params: {
        md: this.data_time , // 非必传
        type: "", // 非必传 // 
      }
    }
    // 早盘
    if([3,6].includes( this.current_lv_1_menu_i * 1 )){
      config.api = "post_date_menu_count"
      /// 4 早盘 11 串关
      config.params.type = this.current_lv_1_menu_i == 3 ? 4 : 11
    }
    if(this.get_menu_type_special()==2000 ){
      config.api = "get_esports_date_menu_count"
      /// 4 早盘 11 串关
      config.params.category = 1;//1常规2冠军
    }
    this.menu_match_date_api_config = config
  }
  /**
   * 兼容老的菜单ID?
  */
  menu_id_map(mi, menu_arr = false) {
    return menu_arr
      ? Object.values(menu_type_config)[mi]
      : menu_type_config[mi];
  }

  //赛果数据处理
  init_amidithion(data) {
    let result_menu = {
      mi: 28,
      sl: ["101", "102", "105", "107", "110", "108", "103", "109", "111", "112", "113", "116", "115", "114", "104", "106"].map((mi) => ({ mi }))
    };
    let list = {
      mi: 28,
      sl: [],
    };
    if (data) {
      lodash_.each(data, (item, index) => {
        list.sl.push({
          count: item.count || 0,
          name: item.name || "",
          menuId: item.menuId || item.field1,
          menuType: item.menuType || "",
          mi: item.mi
        });
      });
      return list;
    } else {
      return result_menu;
    }
  }
  // 查找竞足数据
  init_lottery(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  }
  /**
   * 此处计算总数量 传入sl mi eg: sl:[{"ct":0,"mi":"1011","st":1},{"ct":0,"mi":"1015","st":2}]
   * @param {{mi,sl}} menu_list 
   * @param {*} list 
   * @returns 
   */
  count_menu(menu_list = {}) {
    //计算数量
    const { sl, mi } = menu_list;
    //VR默认295
    if (this.is_vr(mi)) return '';
    if (this.is_jinzu(mi)) {
      const data = lodash_.find(sl, (item) => {
        //竞足特殊处理
        return item.mi == "50101";
      });
      if (data)
        return data.ct || data.count || ''
      return '';
    }
    //计算数量
    const count = sl && sl.reduce
      ? sl.reduce((pre, cur) => {
        return pre + (cur.ct || cur.count || 0);
      }, 0)
      : 0;
    return count || ''
  }

  /**
   * 设置选中的菜单只需要传入 mi就可以了
  */
  set_menu_type(v) {
    const idx = this.menu_list.findIndex(i => i.mi == v)
    idx > -1 && this.set_current_lv1_menu(this.menu_list[idx], idx, 'click')
  }
  /**
   *一级菜单顶层菜单的 菜单类型  ，没有则是0
   * */
  get_menu_type() {
    return this.current_lv_1_menu_mi.value || 0;
  }
  /**
 *一级菜单顶层菜单的 菜单类型  ，没有则是0 特殊的 电竞 vr 
  * */
  get_menu_type_special() {
    return this.top_menu_title.mi || 0;
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
        const item_euid = BaseData.mi_euid_map_res?.[item] && BaseData.mi_euid_map_res?.[item]?.h?BaseData.mi_euid_map_res?.[item]?.h:'';
        if(item_euid){
          euid += item_euid + ',';
        }
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
   * 菜单名称 国际化获取菜单名称
   * 这里获取大部分菜单的名称 有些是固定名称的这里获取不到
   * @param {*} mi 
   * @returns 
   */
  get_menus_i18n_map(item={}) {
    //二级菜单
    // if (this.is_esports(+this.top_menu_title.mi) || this.is_vr(+this.top_menu_title.mi) ) {
    //   return BaseData.menus_i18n_map[+mi]
    // }
    // console.error('item',item)
    if(this.is_results()){
      return BaseData.menus_i18n_map[item.mi]
    }
    let text = BaseData.menus_i18n_map[item.mif];
    if(this.is_kemp() || this.is_kemp_mi() || this.is_vr() || this.is_esports()){
      text = BaseData.menus_i18n_map[item.mi]
    }
    return text
  }
  /**
   * 获取后台接口所对应的名称mi
   * 因为mi对应的 赛种ID + 主菜单mi
   * 例如如：1001 =》 100是足球 而1是早盘 滚球什么的 什么的
   * @param {*} mi 
   * @returns 
   */
  recombine_menu_desc(mi) {
    return String(mi).substr(0, 3);
  }
  // /**
  //  * @description: 球类id转化背景
  //  * @param {String} id 球类id
  //  * @return {}
  //  */
  /**
   * @description: 球类id
   * @param {String} id 球类id
   * @return {}
   */
  recombine_menu_bg(item, get_ball_id = false, is_result = false) {
    if (is_result) {
      return parseInt(item - 100);
    }
   
    let bg_mi = parseInt(this.recombine_menu_desc(item?.mi));
    let id = parseInt(bg_mi - 100);
    if (this.is_kemp() || this.is_kemp_mi()) {
      id = parseInt(bg_mi - 400);
    }
    if (this.is_esports() || this.is_vr()) {
      id = item.mi
    }
    if (this.is_results()) {
      id = item.result_mi;
    }
    // 收藏 vr 电竞 全部 不在此列
    if([0,300,2000,50000].includes(item.mi)){
      id = item.mi
    }
    
    if (get_ball_id) return sprite_images_postion[+id];
    let type = "";
    switch (String(id)) {
      case "1":
        type = "football";
        break;
      case "2":
        type = "basketball";
        break;
      case "3":
        type = "baseball";
        break;
      case "4":
        type = "ice_hockey";
        break;
      case "5":
        type = "tennis";
        break;
      case "6":
        type = "usa_football";
        break;
      case "7":
        type = "snoke";
        break;
      case "8":
        type = "pingpang";
        break;
      case "9":
        type = "volleyball";
        break;
      case "10":
        type = "badminton";
        break;
      case "11":
        type = "handball";
        break;
      case "12":
        type = "boxing";
        break;
      case "13":
        type = "beach_volleyball";
        break;
      case "14":
        type = "rugby_union";
        break;
      case "15":
        type = "hockey";
        break;
      case "16":
        type = "water_polo";
        break;
      case "18":
        type = "funny";
        break;
      case "37":
        type = "banqiu";
        break;
      case "26":
        type = "binghu";
        break;
      case "31":
        type = "fanchuan";
        break;
      case "38":
        type = "feibiao";
        break;
      case "28":
        type = "gaoerfu";
        break;
      case "32":
        type = "huachuan";
        break;
      case "25":
        type = "jijian";
        break;
      case "23":
        type = "juzhong";
        break;
      case "35":
        type = "kongshoudao";
        break;
      case "40":
        type = "qita";
        break;
      case "33":
        type = "saiche";
        break;
      case "39":
        type = "shatanzuqiu";
        break;
      case "24":
        type = "shejian";
        break;
      case "36":
        type = "shuaijiao";
        break;
      case "27":
        type = "taiquandao";
        break;
      case "17":
        type = "tianjing";
        break;
      case "21":
        type = "tiaoshui";
        break;
      case "20":
        type = "ticao";
        break;
      case "19":
        type = "youyong";
        break;
      case "29":
        type = "zixingche";
        break;
      case "22":
        type = "sheji";
        break;
      case "34":
        type = "roudao";
        break;
      case "30":
        type = "saima";
        break;
      case "50":
        type = "quwei";
        break;
    }
    return type;
  }

  // 是否展示二级菜单 图标
  show_secondary_menu_icon(item) {
    if (!UserCtr.show_favorite_list) return true;
    let flag = true;
    // 一级菜单赛果 选中关注 不显示虚拟体育的icon (1001:虚拟足球 1002:赛狗 1011:赛马 1004:虚拟篮球 1010:虚拟摩托车)
    //TODO  menuType?? 新接口好像变了
    if (
      this.is_results() &&
      [1001, 1002, 1011, 1004, 1010].includes(+item.menuType)
    ) {
      flag = false;
    }
    return flag;
  }
  /**
   * @description 判断是虚拟体育
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  is_virtual_sport() {
    return (
      this.is_vr() ||
      (this.match_list_api_config || {}).sports == "vr"
    );
  }
  // 如果是赛果，并且是 虚拟体育
  is_results_virtual_sports() {
    if (
      this.is_results() &&
      [1001, 1002, 1004, 1010, 1011, 1009].includes(
        Number(this.get_current_sub_menuid())
      )
    ) {
      return true;
    }
    return false;
  }
  // "1": "滚球",  "2": "今日", "3": "早盘",  "4": "冠军","5": "即将开赛", "6": "串关","7": "电竞",
  // "8": "VR",// "28": "赛果", "30": "竞足",//
  //内部方法
  _is_cur_mi(mi, param) {
    if (param) {
      return mi == param
    }
    return this.get_menu_type() == mi
  }
  _is_cur_mi_special(mi, param) {
    if (param) {
      return mi == param
    }
    return this.get_menu_type_special() == mi
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
   * 是否选中了冠军
   *  mi [number|string] 要比对的值
  */
  is_kemp_mi(mi) {
    return this._is_cur_mi(400, mi)
  }
  /**
   * 是否选中了电竞
   *  mi [number|string] 要比对的值
  */
  is_esports(mi) {
    return this._is_cur_mi_special(2000, mi)
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
    return this.current_lv_2_menu_mi.value == 50000;
  }
  //- 三级菜单 日期 (只有 串关，早盘，赛果，电竞，才有) -->
  get_is_show_three_menu(mi) {
    return [3, 6, 28, 2000].includes(mi || this.current_lv_1_menu_mi.value);
  }
  // 赛果下数据
  async get_results_menu() {
    // 如果有缓存，则使用缓存
    let cache_data = SessionStorage.get(Cache_key.RESULT_SUB_MENU_CACHE, []);
    try {
      // 如果当前主菜单是赛果, 获取赛果二级菜单
      let { code, data } = await api_analysis.get_result_menu({});
      if (code == 200 && Array.isArray(data)) {
        if (lodash_.get(data, "[0].menuType") == 29) {
          // 当是我的投注时菜单进行时间排序
          let arr = lodash_.get(data, "[0].subList");
          if (arr) {
            arr.sort((a, b) => {
              if (b.field1 < a.field1) {
                return -1;
              } else {
                return 1;
              }
            });
          }
        }
        SessionStorage.set(Cache_key.RESULT_SUB_MENU_CACHE, data);
        cache_data = data;
      }
    } finally {
      // 出错时使用缓存数据
      if (cache_data && cache_data.length) {
        // 赛果二级菜单数据处理
        this.result_sub_menu_api_handle(cache_data, "init");
      } else {
        useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, {
          type: "result",
          event: { cmd: "list_empty" },
        });
      }
    }
    this.update();
  }
  // 赛果二级菜单  数据（名称） 特殊处理 成 menuName
  result_sub_menu_api_handle(res_data, type = "click") {
    // 赛果二级菜单  name 特殊处理 成 menuName
    res_data.forEach((sub_menu) => {
      sub_menu.menuName = sub_menu.name;
      sub_menu.ct = sub_menu.count;
      sub_menu.mi = sub_menu.menuId;
      sub_menu.subList.forEach((date_menu) => {
        date_menu.menuName = date_menu.name;
      });
    });
    this.set_cache_class({
      menu_lv2: res_data,
    });
    //设置第二级菜单
    res_data && res_data.length && this.set_current_lv2_menu(res_data[0], 0);
  }
  // 早盘,串关,电竞拉取接口更新日期菜单 3,6,7
  async get_date_menu_api_when_subchange(mid, type) {
    // 如果是早盘，串关，电竞的话
    const euid = this.get_euid(mid)
    if ([this.is_zaopan(), this.is_mix(), this.is_esports()].includes(true) && euid) {
      // 三级菜单先显示骨架屏，接口回来后，再隐藏骨架屏
      let api_func = null,
        params = { euid: euid };
      if (this.is_esports()) { //电竞
        api_func = api_common.get_esports_date_menu;
        let value = mid.slice(1, 4);
        params = { csid: value };
        if (!params.csid) {
          params.csid = value;
        }
      } else {
        api_func = api_common.post_date_menu;
      }
      try {
        const res = await api_func(params);
        if (res.code == 200) {
          this.set_cache_class({
            menu_lv3: res.data,
          });
          if (
            type == "init" &&
            this.menu_lv3.length &&
            this.current_lv_3_menu
          ) {
            this.set_current_lv3_menu(
              this.current_lv_3_menu,
              this.current_lv_3_menu_mi, 'init'
            );
          } else {
            this.set_current_lv3_menu(this.menu_lv3[0], 0, 'init');
          }
        }
      } catch (error) {
        this.set_cache_class({
          menu_lv3: [],
        });
      }
    } else if (this.is_results()) {
      // 如果是赛果 在一级菜单时候已经获取过二级菜单
      this.current_lv_2_menu && this.set_cache_class({
        menu_lv3: this.current_lv_2_menu.subList,
      });
      if (this.menu_lv3) {
        if (type == "init" && this.menu_lv3.length && this.current_lv_3_menu) {
          this.set_current_lv3_menu(
            this.current_lv_3_menu,
            this.current_lv_3_menu_mi, type
          );
        } else {
         
          this.set_current_lv3_menu(this.menu_lv3[0], 0, type);
        }
      }
    } else {
      //  设置三级日期 菜单
      this.set_cache_class({
        menu_lv3: [],
      });
      this.set_current_lv3_menu(); //设置4级空
    }
    this.update();
  }

  //根据路由参数 设置菜单信息 选中一级 二级menu
  set_enter_params({ m, s, t, mt1, mt2 }) {
    console.log(' m, s, t, mt1, mt2', m, s, t, mt1, mt2)
    if (!m && !mt1) {
      return;
    }
    //     m表示主菜单id    s表示二级菜单id         （t日期菜单id一般不用）r
    //    mt1 表示主菜单menu_type     mt2 表示子菜单menu_type         记住首页球种r
    const idx = lodash_.findIndex(this.menu_list, {
      mi: m || mt1,
    });
    if (idx > -1) {
      const menu_list = this.menu_list[idx];
      //设置一级菜单
      this.set_current_lv1_menu(menu_list, idx, "init");
      const idx2 = lodash_.findIndex(this.menu_lv2, {
        mi: s || mt2,
      });
      if (idx2 > -1) {
        //设置二级菜单
        this.set_current_lv2_menu(this.menu_lv2[idx2], idx2, "init");
      }
      this.update();
    }
  }
  /**
   * 选中二级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  async set_current_lv2_menu(current_lv_2_menu, current_lv_2_menu_i, type = "click") {
    this.set_cache_class({
      current_lv_2_menu,
      current_lv_2_menu_i,
    });

    if (!current_lv_2_menu) {
      //2级菜单为空 3级也滞空
      this.set_cache_class({
        menu_lv2: [],
      });
      this.set_current_lv3_menu();
      return;
    }
    // this.get_date_menu_api_when_subchange(current_lv_2_menu, type)
  }

  /**
   * 选中3级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv3_menu(current_lv_3_menu, current_lv_3_menu_i, type = "click") {
    if (!current_lv_3_menu) {
      //置空3级菜单
      this.set_cache_class({
        menu_lv3: [],
      });
      //三级菜单为空 4级也滞空
      this.set_current_lv4_menu();
    }
    else if (this.is_results_virtual_sports()) {
      // 如果有三级菜单
      // 赛果下边的 虚拟体育 的四级菜单 数据
      if (this.current_lv_3_menu) {
        //设定4级菜单数据
        this.set_cache_class({
          menu_lv4: lodash_.get(this.current_lv_3_menu, "subList"),
        });
        //设定4级点击
        this.set_current_lv4_menu(this.menu_lv4[0], 0);
        this.update();
      }
    } else {
      this.set_current_lv4_menu();
    }
    /**
     * 在初始化时
     * 保持日期的选中 例如选中了 9.24号 下一次切换二级菜单如果还有9.24号就选中 9.24号 
     */
    if (type == 'init' && this.current_lv_3_menu && this.menu_lv3?.length) {
      const idx = this.menu_lv3.findIndex((item) => this.current_lv_3_menu.menuId == item.menuId);
      if (idx && idx > -1) {
        current_lv_3_menu = this.menu_lv3[idx]
        current_lv_3_menu_i = idx;
      }
    }
    //选中3级菜单
    this.set_cache_class({
      current_lv_3_menu,
      current_lv_3_menu_i,
    });
  }
  /**
   * 选中4级menu
   * item [object]当前点击对象
   * index [number]
   * type [string] click | init
   */
  set_current_lv4_menu(current_lv_4_menu, current_lv_4_menu_i, type = "click") {
    this.set_cache_class({
      menu_lv4: [],
      current_lv_4_menu,
      current_lv_4_menu_i,
    });
    this.update()
  }
  //获取4级菜单 menu
  get_level_four_menu() {
    return this.current_lv_4_menu;
  }
  //获取二级菜单ID　以前有　menuType这个东西
  get_current_lv_2_menu_type() {
    return this.current_lv_2_menu?.menuType;
  }
  //竞足数据
  get_competing(data) {
    let obj1 = data.find((v) => v.mi == 500) || {};
    if (obj1?.sl) {
      // 竟足处理 50101
      let obj2 = obj1.sl.find((v) => v.mi == 50101) || {};
      return obj2.sl || [];
    }
  }
  /**
   * 电竞菜单要保留 电竞菜单 的 csid
   */
  get_csid() {
    if (this.is_esports()) {
      return this.current_lv_2_menu?.csid
    }
    // if (BaseData.csids_map
    // ) {
    //   this.previous_lv_1_menu = item;
    //   return BaseData.csids_map['csid_' + item.csid];
    // }
    return "";
  }
  /**
   * 二级菜单是否选中了全部
   * @returns 
   */
  get_sub_is_all() {
    return !this.current_lv_2_menu_i;
  }
  //获取二级菜单 menuid
  get_current_sub_menuid() {
    //二级菜单可能有个选中 全部 此刻 当前菜单应该是数组
    if (this.get_sub_is_all()) {
      return this.current_lv_2_menu && lodash_.castArray(this.current_lv_2_menu).map((item) => {
        return item.mi || item.menuId;
      }).join(',');
    } else {
      // 竟足处理 50101
      if (this.is_jinzu()) {
        const euid = this.get_euid('50101') || 40603; // 获取euid
        return euid;
      }
      // 赛果取 赛种id
      if(this.current_lv_1_menu_i == 28){
        return this.result_menu_api_params.sport 
      }
      return this.current_lv_2_menu_i || this.current_lv_2_menu?.menuId || "40003";
    }
  }
  /**
   * 判断是否为冠军和电竞冠军
   */
  get_mm_is_champion() {
    return lodash_.get(this.current_lv_3_menu, "menuType") == 100;
  }
  // 传给筛选里面的搜索下Bat选中
  get_useid_ievname() {
    return this.current_lv_2_menu?.mi?.substr(1, 2)
  }
  /**
   * 获取当前选中得页脚子菜单
   */
  get_footer_sub_menu_id() {
    return this.footer_sub_menu_id || "1";
  }
  /**
   * 设置当前选中得页脚子菜单
   */
  set_footer_sub_menu_id(footer_sub_menu_id) {
    this.set_cache_class({
      footer_sub_menu_id
    })
  }
    /**
   * 设置值 并且缓存
   * obj [Object] 需要设置的缓存  key要和本类系统哦
   * is_cache是否缓存
   */
    set_cache_class(obj, is_cache = true) {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(this, key)) {
          if (["menu_type","current_lv_1_menu_mi",'current_lv_2_menu_mi'].includes(key)) {
            this[key].value = obj[key];
          } else {
            this[key] = obj[key];
          }
        }
      }
      if (is_cache) {
        const current = SessionStorage.get(Cache_key.CACHE_CRRENT_MEN_KEY, {});
        SessionStorage.set(
          Cache_key.CACHE_CRRENT_MEN_KEY,
          lodash.assign({}, current, obj)
        );
      }
    }
  /**
  * 设置当前选中得页脚子菜单变化 
  */
  set_footer_sub_changing(footer_sub_changing) {
    this.footer_sub_changing = footer_sub_changing //页脚子菜单变化 
  }
}
export default new MenuData();
