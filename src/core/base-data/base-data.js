// 新菜单的  菜单基础 ID mi 和 赛种 基础球种 csid   对应关系
// 常规球种 menu_id 规则 ：100   +对应球种 id   csid  100 + 1  = 101        足球
// 电竞球种 menu_id 规则 ：2000  +对应球种 id   csid  2000 + 100   =2100   英雄联盟
// 虚拟球种 menu_id 规则 ：30000 +对应球种 id   csid  30000 + 1001 =31001   VR足球
// 冠军    menu_id  规则 :400   +对应球种 id    csid  400 +1  = 401 冠军 足球
import { nextTick, ref } from "vue";

import { i18n_t, i18n } from "src/boot/i18n.js";
import { dianjing_sublist } from "src/output/module/constant-utils.js"
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
import BaseWsMessage from "./base-ws-message"
const { PROJECT_NAME,BUILD_VERSION,IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG ;
// console.error('BUILDIN_CONFIG ',BUILDIN_CONFIG )

//   约定 四个 值

// 100 常规球类
// 400  常规球类 的冠军
// 2000 电竞球类
// 30000  虚拟赛事 VR

//  1001  1004
import UserCtr from "src/core/user-config/user-ctr.js";
import lodash_ from "lodash";

import { api_base_data } from "src/api/index.js";

// import VrMiConfig from "./config/vr-mi.js";

// 默认数据引入
// 新旧的 菜单 映射 含 模板 以及 玩法
import mi_euid_mapping_default from "./config/mi-euid-mapping.json";
// 菜单数据 默认的
import menu_list_default from "./config/menu-list.json";
// 菜单国际化 默认的
import menu_i18n_default from "./config/menu-i18n.json";
// 用户信息 默认的 用于ws模拟
import ws_user_info from "./config/user_info.json";
//vr 默认的 用于ws模拟
import vr_menu_info from "./config/vr_menu_info.json";
import { MenuData } from "src/output/project/index.js"
import { LocalStorage } from 'src/core/utils/common/module/web-storage.js'
import {
  useMittOn,
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt/index.js";

import STANDARD_KEY from "src/core/standard-key";
const base_data_key = STANDARD_KEY.get("base_data_key");

const base_menu_id_new = {
  30002: "1011",
  30003: '1021',
  30004: '1051',
  30091: '1911',
  30090: '1901'
}
class BaseData {
  constructor() {
    //基础数据返回值
    this.base_data_res = {};
    //基础数据 版本
    this.base_data_version = ref('');
    // 赛种 基础数据  arr
    this.csids_arr = [];
    // 赛种 基础数据  map
    this.csids_map = {};
    //联赛基础数据  arr
    this.tids_arr = [];
    //联赛基础数据   map
    this.tids_map = {};
    //赛事基础数据  arr
    this.mids_arr = [];
    //赛事基础数据  map
    this.mids_map = {};
    //菜单版本set_vr_mi_config
    this.menu_version = 1;
    // 菜单 国际化 数据  map
    this.menus_i18n_map = menu_i18n_default;
    // 新的菜单 接口返回  数据
    this.mew_menu_list_res = [];
    //新的菜单 的基础信息相关的 （可以包含国际化）
    this.mi_info_map = {};
    //新的菜单到旧的菜单的映射关系  接口返回值
    this.mi_euid_map_res = {};
    // 菜单id 到 联赛 id 到 赛事ID 的 映射关系
    this.mi_tid_mids_res = {};
    // 当前选中的菜单的 数据
    this.natch_list_data = null;
    //联赛屏蔽
    this.filterLeague_arr = [];
    //球种屏蔽
    this.filterSport_arr = [];
    //当前的 菜单 id
    this.current_mi = "";
    // 电竞赛事根节点
    this.dianjing_sublist = dianjing_sublist();

    // VR 体育的 配置
    this.vr_mi_config = vr_menu_info;
    //  冠军 数据  对象形式
    this.commn_sport_guanjun_obj = {};

    // 虚拟体育是否开放 对外输出
    this.is_mi_300_open = false;
    // 电竞是否开放 对外输出
    this.is_mi_2000_open = false;
    // 虚拟体育是否开放 内部判断
    this.is_mi_300_open_int = false;
    // 电竞是否开放 内部判断
    this.is_mi_2000_open_int = false;

    // 滚球赛事 赛种id
    this.mi_gunqiu = [];

    // c菜单定时器
    this.menu_init_time_close = {};

    // 重置菜单定时器
    this.reset_menu_init_time = {};

    //左侧菜单队列 默认
    this.left_menu_base_mi_arr = [
      101, 102, 2000, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115,
      114, 104, 106, 118, 400, 300,
    ];
    // 左侧菜单数据
    this.left_menu_base_mi = []
    // 电子竞技
    this.sports_mi = [2100, 2101, 2103, 2102];

    // 电竞更新
    this.esport_menu_version = "1111";
    // 菜单接口类型 old 旧  new 新
    this.menu_type_old_or_new = "new";

    // 是否通知元数据处理完成
    this.is_emit = false

    this.conventionalType = [101,102,105,190,191]; 

    // 电子足球 电子篮球
    this.show_e_soprts = {
      football: false,
      basketball: false,
    }

    this.base_menu_obj = {}
  }
  /**
   * 初始化数据
   *
   * 接口走  CDN 文件形式  还是  走常规的 axios api 接口  都可以
   *
   * 只是这个 类的  init 方法在调用的 时间节点不一样而已
   *
   * 目前 按照约定 走 api
   */
  init() {
    console.error('初始化菜单数据')
    // 用默认数据 初始化
    // this.init_by_default_data();
    // console.warn("BaseData.init()--------");

    // 获取 用户信息
    // this.init_user_info()

    //获取 新旧菜单ID对应
    // this.init_mi_euid_map();
    // 获取 菜单-联赛-赛事
    // this.init_mi_tid_mids();
    // 获取 元数据接口
    // this.init_base_data();
    // 获取 菜单的国际化
    // this.init_base_menu_il8n();

    // 获取全部前置据接口
    this.get_all_base_data()


    // 获取 虚拟体育 的 数据对象
    this.set_vr_mi_config();

    // 获取 菜单数量统计
    // this.init_mew_menu_list();

    // 定时请求菜单接口
    // this.set_menu_init_time(1500);

    this.reset_menu_init_time = setTimeout(() => {
      // this.clear_menu_init_time();
      // 5分钟一次
      // this.set_menu_init_time(3000000);
    }, 2000);

    // ws请求订阅
    BaseWsMessage.init()

  }


  set_show_e_soprts(val){
    this.show_e_soprts = {
      ...this.show_e_soprts,
      ...val
    }
  }

  /**
   * 新旧菜单映射关系
   * @returns 
   */
  base_menu_id_togger = () =>{
    //静态json
    const data = mi_euid_mapping_default.data;
    // 判断 h5 / pc
    let type = 'p'
    if(PROJECT_NAME.indexOf('h5') > -1){
      type = 'h'
    }
    const base_menu_obj = Object.fromEntries(Object.keys(data).map(item => [data[item][type] , item]));
    this.base_menu_obj = base_menu_obj
    return base_menu_obj;
  }
  // 菜单数量变化
  set_base_c301_change(list = []) {
    let list_obj = {}
    list.forEach(item => {
      item.mi = this.base_menu_id_togger()[item.menuId]
      list_obj[item.mi] = item.count
    })
    useMittEmit(MITT_TYPES.EMIT_SET_BESE_MENU_COUNT_CHANGE,list)
    this.set_left_menu_init(this.mew_menu_list_res,list_obj,'ws')
  }
  /**
   * @description 获取所有的元数据
   * @returns
   */
  async get_all_base_data () {

    this.set_default_base_data()

    // 获取 用户信息
    await this.init_user_info();

    // 获取 新旧菜单ID对应
    const p1 = new Promise((resolve, reject) => {
      api_base_data.post_base_data_menu_mapping({}).then((res) => {
        resolve({ key: 'p1', res: res })
      }).catch(err => reject(err))
    });
    // 获取 菜单-联赛-赛事
    const p2 = new Promise((resolve, reject) => {
      api_base_data.post_base_data_mi_tid_mids({}).then((res) => {
        resolve({ key: 'p2', res: res })
      }).catch(err => reject(err))
    });
    // 获取 国际化菜单
    const p3 = new Promise((resolve, reject) => {
      api_base_data.post_base_data_menu_i18n({}).then((res) => {
        resolve({ key: 'p3', res: res })
      }).catch(err => reject(err))
    });
    // 获取 元数据接口
    const p4 = new Promise((resolve, reject) => {
      api_base_data.get_base_data({}).then((res) => {
        resolve({ key: 'p4', res: res })
      }).catch(err => reject(err))
    });
    //  获取 菜单数量统计
    const p5 = new Promise((resolve, reject) => {
      api_base_data.get_base_data_menu_init({}).then((res) => {
        resolve({ key: 'p5', res: res })
      }).catch(err => reject(err))
    });
    // 等待以上4个接口同时请求完成再通知列表获取
    return Promise.all([p1, p2, p3, p4, p5]).then((res) => {
      // const base_data = LocalStorage.get(base_data_key)
      // //   !base_data && this.handle_base_data(res)
      this.handle_base_data(res)
      nextTick(()=>{
        LocalStorage.set(base_data_key,res)
      })
    }).catch((err) => {
      this.set_default_base_data()
      console.error('err:', '元数据接口请求超时')
    })
  }

  // 从缓存读取默认数据
  set_default_base_data () {
    const base_data = LocalStorage.get(base_data_key)
    if (base_data) {
      this.set_is_emit(true)
      this.handle_base_data(base_data)
    }
  }

  // 元数据处理
  handle_base_data (res) {
    if (!(res instanceof Array)) return
    res.forEach(t => {
      if (t.key === 'p1') {
        nextTick(()=>{
          this.init_mi_euid_map(t.res)
        })
      } else if (t.key === 'p2') {
        nextTick(()=>{
          this.init_mi_tid_mids(t.res)
        })
      } else if (t.key === 'p3') {
        nextTick(()=>{
          this.init_base_menu_il8n(t.res)
        })
      } else if (t.key === 'p4') {
        nextTick(()=>{
          this.init_base_data(t.res)
        })
      } else if (t.key === 'p5') {
        nextTick(()=>{
          this.init_mew_menu_list(t.res)
        })
      }
    })
  }

  // 切换国际化 获取最新的数据
  set_base_data_menu_i18n() {
    api_base_data.post_base_data_menu_i18n({}).then((res) => {
      this.init_base_menu_il8n(res)
      nextTick(()=>{
        // 切换国际化后 告知菜单有变化 页面菜单进行国际化内容修改
        MenuData.set_menu_data_version()
      })
    }).catch(err => reject(err))
  }

  // 模拟数据推送 左侧菜单和顶部菜单 修改
  set_ws_send_new_menu_init() {
    // console.warn('开始模拟推送菜单数据-----')
    this.set_left_menu_init(menu_list_default.data);
  }

  // 模拟数据推送 用户信息
  set_ws_send_new_user_info_init() {
    // console.warn('开始模拟推送用户数据-----')
    this.resolve_getUserInfo_res(ws_user_info);
  }
  // 模拟数据推送 vr 修改
  set_ws_send_new_vr_menu_init() {
    // console.warn('开始模拟推送菜单数据-----')
    this.vr_mi_config = vr_menu_info;
    this.base_data_version.value = Date.now();
  }

  // 菜单初始化 因为菜单是去轮询的 so
  set_menu_init_time(number) {
    this.clear_menu_init_time();

    this.menu_init_time_close = setInterval(() => {
      // 获取 用户信息
      this.init_user_info();

      // 获取 虚拟体育 的 数据对象
      this.set_vr_mi_config();

      // 获取 菜单数量统计
      this.init_mew_menu_list();

    }, number);
  }

  // 清除 定时器
  clear_menu_init_time() {
    clearInterval(this.menu_init_time_close);
  }

  // 清除 重置定时器
  clear_reset_init_time() {
    clearInterval(this.reset_menu_init_time);
  }
  /**
   * 轮询 获取用户信息
   */
  async init_user_info() {
    // let token = store.getters.get_user_token || ''
    // let res = await api_account.get_user_info({token})

    // console.warn("init_user_info",res.data)
    // let user_info = lodash_.get(res,'data.data',{})
    // let user_info = lodash_.get(res,'data.data',{})
    let user_info = UserCtr.get_user_info_data()
    if (user_info && Object.keys(user_info).length) {
      // let old_user = JSON.stringify(store.getters.get_user)
      // let new_user = JSON.stringify(user_info)

      // 数据对比替换
      // if(old_user != new_user && new_user){
      //   store.dispatch("set_user_assign",user_info);
      // }
      this.resolve_getUserInfo_res(user_info);
    }
  }
  /**
   * 用默认数据 初始化
   */
  init_by_default_data() {
    this.mi_euid_map_res = mi_euid_mapping_default.data;

    this.resolve_mi_euid_map_res();

    if (!this.mew_menu_list_res.length) {
      this.mew_menu_list_res = menu_list_default.data;
    }
    // ==================

    this.set_mi_gunqiu();

    this.set_commn_sport_guanjun_obj();

    // ==================

    let menus = menu_i18n_default.data;

    this.resolve_menus(menus);
  }

  /**
   * 国际化菜单
   */
  async init_base_menu_il8n(res) {
    // let res = await api_base_data.post_base_data_menu_i18n({});

    let menu_i18n = lodash_.get(res, 'data')

    this.resolve_menus(menu_i18n);
  }

  // 获取数据缓存 ，用于刷新
  get_new_data() {
    // 获取菜单数据缓存
    let session_info = localStorage.getItem("is_session_base_data");
    if (!session_info) {
      return;
    }
    const session_base_data = JSON.parse(session_info);

    if (Object.keys(session_base_data).length) {
      const { mi_euid_map_res, mew_menu_list_res, menu_i18n_default } =
        session_base_data;
      this.mi_euid_map_res = mi_euid_map_res;
      this.mew_menu_list_res = mew_menu_list_res;

      // this.resolve_menus(menu_i18n_default)
    }
    this.conventionalType = [101,102]; 
  }
  /**
   * 滚球赛事的赛种id
   */
  set_mi_gunqiu() {
    //过滤常规球类
    let mi_100_arr = [];
    let mi_2000_arr = [];
    // let changgui_mi = [
    //   101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
    //   106,
    // ];
    // let sports_mi = [
    //   2100, 2101, 2103, 2102
    // ]
    // 遍历 新菜单数据
    this.mew_menu_list_res.map((x) => {
      // 拿到 基础赛种 id
      let mif = 1 * x.mi;
      //常规体育
      if (this.left_menu_base_mi_arr.includes(mif)) {
        // 滚球对象
        let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
        item.mif = mif;

        mi_100_arr.push(item);
      }
      //电竞
      if (this.sports_mi.includes(mif)) {
        // 滚球对象
        let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
        item.mif = mif;
        mi_2000_arr.push(item);
      }
    });

    let mi_100_gunqiu = this.set_mi_gunqiu_sports(mi_100_arr);
    let mi_2000_gunqiu = this.set_mi_gunqiu_sports(mi_2000_arr) || [];

    this.mi_gunqiu = [...mi_100_gunqiu, mi_2000_gunqiu.length ? 2000 : ""];
  }

  /**
   * 获取 滚球赛事 赛种id
   */
  set_mi_gunqiu_sports(res) {
    let gunqiu = [];
    res.forEach((item) => {
      if (item.ct) {
        gunqiu.push(item.mif);
      }
    });
    return gunqiu;
  }

  /**
   * 获取 新旧菜单ID对应
   */
  async init_mi_euid_map(res) {
    // let res = await api_base_data.post_base_data_menu_mapping({});

    this.set_mi_euid_map_res(res);
  }
  /**
   * 设置 新的菜单到旧的菜单的映射关系  接口返回值
   */
  set_mi_euid_map_res(res) {
    // 接口返回值很多没有p值，也就是euid 值，先注释调用接口的，用默认的，
    this.mi_euid_map_res = lodash_.get(res, 'data')

    // localStorage.setItem("is_session_base_data", JSON.stringify());
    this.resolve_mi_euid_map_res();
  }
  /**
   * 获取 菜单数量统计
   */
  init_mew_menu_list(res) {
    // let res = await api_base_data.get_base_data_menu_init({});
    let menu_info = lodash_.get(res, 'data', [])

    let menu_old_or_nem_data_list = menu_info ? [...menu_info] : [];
    this.menu_type_old_or_new = "new";
    // 判断新旧菜单
    // menuId 旧菜单才有
    // console.error(menu_info,"menu_info")
    if ((menu_info && menu_info[0].menuId) || "") {
      this.menu_type_old_or_new = "old";
      menu_old_or_nem_data_list = this.set_menu_old_change_list(menu_info);
    }

    // 设置新菜单
    this.set_left_menu_init(menu_old_or_nem_data_list);

    // app-h5使用
    if( ['ouzhou-h5','app-h5','new-pc'].includes(PROJECT_NAME)){
      MenuData.set_init_menu_list()
    }

    // 计算   冠军 数据  对象形式   commn_sport_guanjun_obj
    // 计算虚拟体育 的 数据对象
    // this.set_vr_mi_config()
    this.set_commn_sport_guanjun_obj();

    // console.error("init_mew_menu_list------1-", res.data.data);
    // console.error("init_mew_menu_list------2-", this.mew_menu_list_res);
  }

  /**
   * 旧菜单改变数据结构
   */
  menu_type_old_or_new() { }

  /**
   * 计算 左侧菜单数据
   */
  set_left_menu_init(menu_info,list_obj={},from) {
    // 有数据才去对比 替换
    if (menu_info.length) {
      const left_menu = [],
        esport_menu = [],
        sports_mi = [],
        left_menu_mi = []
      // 左侧菜单id
      menu_info.forEach((item) => {
        // vr300 冠军400 2000 电竞 500热门
        if (Number(item.mi) < 300 ) {
          // 过滤 商户 屏蔽的赛种数据
          if (!this.filterSport_arr.includes(item.mi)) {
            left_menu.push(Number(item.mi));
            // 计算菜单数量列表
            if(from == 'ws'){
              item.ct = lodash_.get(list_obj,`${item.mi}`,item.ct) 
            }else{
              if(item.sl){
                let total = item.sl.reduce((cur,obj)=> {
                  return cur + Number(obj.ct)
                },0)
               item.ct = total
              }
            }
            
            left_menu_mi.push(item)
          }
        }
        // 设置电竞竞技的菜单
        let obj = dianjing_sublist().find((page) => page.mi == item.mi) || {};

        if (obj.mi) {
          //电竞总数量 取今日 早盘下数量
          obj.ct = item.sl?.filter(n=>{return [2,3].includes(n.st)})?.map((n)=>{return n.ct||0})?.reduce((n1,n2)=>{return n1+n2}) || 0;
          // mid
          sports_mi.push(Number(obj.mi));
          // 电子竞技 菜单数据
          esport_menu.push(obj);
        }
      });
      this.dianjing_sublist = [...esport_menu];
      
      // openElectronicTy 电子体育 openElectronicFootball 电子足球 openElectronicBasketball 电子篮球  filterSport 关闭的赛种
      let {openElectronicTy,openElectronicFootball,openElectronicBasketball,filterSport} = lodash_.get(UserCtr,'user_info',{})
      let filter_list = []
      // 电子体育 优选级 高于其他两个
      if(openElectronicTy){
        // 电子体育关 所有都关
        // 电子足球开 赛种都关闭 电子足球也关 
        if(openElectronicFootball){
          if( filterSport.includes('-1') && filterSport.includes('-2') && filterSport.includes('-3') ){
            filter_list.push(90) 
          }
        }
        // 篮球同上
        if(openElectronicBasketball){
          if( filterSport.includes('-4')){
            filter_list.push(91) 
          }
        }
      }else{
        filter_list = [90,91]
      }

      // 是否有电子足球
      let football = true
      // 是否有电子篮球  
      let basketball = true

      if(filter_list.includes(90)){
        football = false
      }
      if(filter_list.includes(91)){
        basketball = false
      }
      // 设置状态
      this.set_show_e_soprts({ football,basketball })
     
      let left_menu_list = []
      
      /**
       *  一期只有足球篮球  暂定
       *  重置默认数据
       */
      // if(!IS_FOR_NEIBU_TEST){
      //   this.left_menu_base_mi_arr = this.conventionalType;
       
      //   let list_mi_lsit = []
      //   left_menu_mi.forEach(item=>{
      //     if(this.conventionalType.includes(item.mi*1)){
      //       list_mi_lsit.push(item)
      //     }
      //   })
      //   left_menu_list = list_mi_lsit
      // }else{
        this.left_menu_base_mi_arr = left_menu ; 
        left_menu_list = left_menu_mi;
      // }

      // 赛种筛选
      left_menu_list.filter(item => {
        if(filter_list.includes(item.mi * 1)){
          item.ct = 0
        }
      })

      this.left_menu_base_mi = left_menu_list;

      this.sports_mi = sports_mi;

      // 有电竞竞技则插入 电竞2000
      // 并且 商户有开启 电子竞技
      if (esport_menu.length && this.is_mi_2000_open_int) {
        // let esports_number = 2000;
        left_menu.splice(2, 0, 2000);
        // 替换默认数据 使用接口数据
        this.dianjing_sublist = [...esport_menu];
        // 电竞版本 用于页面更新
        this.esport_menu_version = Date.now();
        // 统一对外输出
        this.is_mi_2000_open = true;
      } else {
        this.is_mi_2000_open = false;
      }

      // 判断有没有 vr数据
      // vr数据菜单（紧急开关） vr商户开关
      if (!this.vr_mi_config.length || !this.is_mi_300_open_int) {
        let index = left_menu.findIndex((item) => item == 300);
        if (index) {
          // 没有vr 数据 头部也不显示
          left_menu.splice(index, 1);
          // 统一对外输出
          this.is_mi_300_open = false;
        }
      } else {
        this.is_mi_300_open = true;
      }

      // 菜单完成 更新顶部菜单tab
      useMittEmit(MITT_TYPES.EMIT_MENU_INIT_DONE)

      // console.warn('left_menu',left_menu)get_virtual_menuvr
      // console.warn('菜单数据处理完成-----')
      // 数据对比替换

      // if (old_menu != new_menu) {
      this.mew_menu_list_res = menu_info ;
      // localStorage.setItem("is_session_base_data", JSON.stringify());
      // 计算 live
      this.set_mi_gunqiu();
      // }

      // console.error("left_menu_base_mi_arr", this.left_menu_base_mi_arr);

      // 更新版本
      this.base_data_version.value = Date.now();
    }
    // console.error('this',this)
  }

  /**
   * 计算虚拟体育 的 数据对象
   */
  async set_vr_mi_config() {
    // let res = await api_common.get_virtual_menu({});
    // VR 体育的 配置

    // let mi_300_obj = lodash_.get(res, 'data')

    // // 重构数据 init接口没有中的 vr 联赛 mi 在 元数据接口中 没有对应的 国际化信息
    // this.vr_mi_config = mi_300_obj.map((item) => {
    //   item.mi = item.menuId + "1" + item.menuId;
    //   return item;
    // });

    //   let mi_300_obj =  this.mew_menu_list_res.find(x=>x.mi==300)
    // let sl= mi_300_obj['sl']||[]
    // let res_obj ={}
    //     sl.map(x=>{
    //       let xmi= x.mi
    //       x.csid=  xmi.substring(1)
    //       res_obj[`mi_${xmi}`]=x
    //     })
    //     console.error("set_vr_mi_config----------", res_obj);
  }
  //获取menu
  get_menu_list(mi) {
    return this.mew_menu_list_res.find((x) => x.mi == mi) || { sl: [] };
  }
  // 计算   冠军 数据  对象形式

  set_commn_sport_guanjun_obj() {
    let commn_sport_guanjun_obj = {};
    let obj = this.mew_menu_list_res.find((x) => x.mi == 400) || { sl: [] };

    // console.error("set_commn_sport_guanjun_obj-------1", obj);

    let { sl = [] } = obj;

    sl && sl.map((x) => {
      // 计算这个冠军 的 对应额 基础 赛种 mi

      let base_mi = "" + (100 + (parseInt(x.mi) - 400));

      commn_sport_guanjun_obj[`mi_${base_mi}`] = x;
    });
    // console.error(
    //   "set_commn_sport_guanjun_obj-------1",
    //   commn_sport_guanjun_obj
    // );
    this.commn_sport_guanjun_obj = commn_sport_guanjun_obj;
  }

  /**
   * 获取 菜单-联赛-赛事
   */
  async init_mi_tid_mids(res) {
    // let res = await api_base_data.post_base_data_mi_tid_mids({});
    await this.set_mi_tid_mids_res(res);
  }
  /**
   * 获取 元数据接口
   */
  async init_base_data(res) {
    try {
      // let res = await api_base_data.get_base_data({});
      res && await this.set_base_data_res(res);
      // 元数据加载完成 useMittEmit 大部分情况执行这里时， 页面的 useMittOn 还没注册就不会触发
      if (!this.is_emit) {
        useMittEmit(MITT_TYPES.EMIT_UPDATE_CURRENT_LIST_METADATA)
      }
      this.base_data_version.value = Date.now();
    } catch (error) {
      console.error("获取 元数据接口 error", error);
    }
  }

  // 设置基础数据  res.data 实体
  async set_base_data_res(res) {
    this.base_data_res = lodash_.get(res, 'data')

    this.resolve_base_data_res();

    // console.error("this.base_data_res----------", this.base_data_res);
  }
  /**
   * 解析  基础数据
   */
  resolve_base_data_res() {

    let spList = lodash_.get(this.base_data_res,'spList',[])
    let tids_obj = lodash_.get(this.base_data_res,'tids_obj',[])
    let matchsList = lodash_.get(this.base_data_res,'matchsList',[])
    let menus = lodash_.get(this.base_data_res,'menus',{})

    //  console.warn('this.base_data_res',this.base_data_res)
    this.resolve_csids(spList);
    this.resolve_tids(tids_obj);
    this.resolve_mids(matchsList);
    this.resolve_menus(menus);
  }
  /**
   * 解析  赛种 基础数据
   */
  resolve_csids(arr = []) {
    let obj = {};
    arr.map((x) => {
      obj[`csid_${x.csid}`] = x;
    });
    // 赛种 基础数据  arr
    this.csids_arr = arr;
    // 赛种 基础数据  map
    this.csids_map = obj;
  }
  /**
   * 解析  联赛基础数据
   */
  resolve_tids(arr = []) {
    let obj = {};
    arr.map((x) => {
      obj[`tid_${x.tid}`] = x;
    });
    //联赛基础数据  arr
    this.tids_arr = arr;
    //联赛基础数据   map
    this.tids_map = obj;
  }
  /**
   * 解析  基础数据
   */
  resolve_mids(arr = []) {
    let obj = {};
    arr.map((x) => {
      obj[`mid_${x.mid}`] = x;
    });
    //赛事基础数据  arr
    this.mids_arr = arr;
    //赛事基础数据  map
    this.mids_map = obj;
  }
  /**
   * 解析  菜单 国际化
   */
  resolve_menus(res) {
    if (!res) return
    // 获取语言类型
    let locale = lodash_.get(i18n,'global.locale','zh') || "zh";
    // 设置 语言变量
    let esports = lodash_.get(i18n, `global.messages[${locale}].common.e_sports`)

    // 菜单 国际化 数据  map
    res["2000"] = esports || "Esports";
    this.menus_i18n_map = res;
  }
  /**
   * 解析  新的菜单到旧的菜单的映射关系
   *  t：模板ID，s：玩法ID；
   *  目前改动只针对PC玩法菜单，包含：今日、早盘、串关；H5没有玩法菜单
   *
   */

  resolve_mi_euid_map_res() {
    let mi_euid_map_res = this.mi_euid_map_res;
    let obj = {};
    for (let i in mi_euid_map_res) {
      let item = mi_euid_map_res[i];

      obj[`mi_${i}`] = {
        euid: item.p || "", // 旧的菜单ID
        h5_euid: item.h,
        orpt: item.t || "0", // 模板ID
        pids: item.s || "", // 玩法ID
      };
    }
    // console.error("this.mi_euid_map_res------------", this.mi_euid_map_res);
    // console.error("this.mi_info_map------------", obj);

    //  Object.assign(obj,VrMiConfig)

    this.mi_info_map = obj;
  }

  set_is_emit (val) {
    this.is_emit = val
  }
  /**
   * 菜单id 到 联赛 id 到 赛事ID 的 映射关系
   * @param {*} res
   */
  async set_mi_tid_mids_res(res) {
    let data = lodash_.get(res, 'data', {})
    this.mi_tid_mids_res = data;
  }
  /**
   * 菜单切换  提取到菜单ID 之后 调用这个方法
   *
   * mi:  mi 字符串 多个 用 ，分割
   * mi： 必须是新的菜单 ID
   */
  compute_current_mi_match_list(mi) {
    mi = "" + mi;
    mi = mi.trim();
    if (!mi) {
      return false;
    }
    this.current_mi = mi;
    let mi_arr = mi.split(",");
    let len = mi_arr.length;
    if (len == 1) {
      this.compute_current_mi_match_list_when_single_mi(mi_arr);
    } else {
      // 这个 基本就是滚球 全部
      this.compute_current_mi_match_list_when_mulit_mi(mi_arr);
    }
  }
  /**
   * 菜单切换  单个 菜单ID  计算 列表队列
   */
  compute_current_mi_match_list_when_single_mi(mi_arr) {
    let mi = mi_arr[0];
    let obj = this.mi_tid_mids_res[mi];
    // 这种 单个 个ID 的目前  可能返回  这种结构   { nd：[],ld:[] } 或者 []
    this.natch_list_data = obj;
  }
  /**
   * 菜单切换  多个  菜单ID  计算 列表队列
   * 这个 基本就是滚球 全部
   */
  compute_current_mi_match_list_when_mulit_mi(mi_arr) {
    let arr = [];
    mi_arr.map((x) => {
      let obj = this.mi_tid_mids_res[x];
      // { "mids": ["3467449"], "tid": "1183664" },
      //前提是 现在的结构下 不可能出现 多个菜单id  ，区分 滚球早盘
      //目前只有滚球全部 会 mi_arr length 大于 1
      // 这种多个ID 的目前不可能返回  这种结构   { nd：[],ld:[] }
      arr = arr.concat(this.compute_current_mi_match_list_per_mi(obj));
    });
    this.natch_list_data = arr;
  }
  /**
   * 菜单切换  每个  菜单ID  计算 列表队列
   *
   */
  compute_current_mi_match_list_per_mi(obj) {
    if (obj["nd"] || obj["ld"]) {
      //代表区分 滚球早盘的 菜单  //这个时候正常情况下 只有一条数据
      //livedata      nolivedata
      return {
        livedata: this.resolve_base_info_list_by_arr(obj["ld"]),
        nolivedata: this.resolve_base_info_list_by_arr(obj["nd"]),
      };
    } else {
      // 不区分   滚球早盘的 菜单
      let arr = Object.values(obj);
      return this.resolve_base_info_list_by_arr(arr[0]);
    }
  }
  /**
   * 根据 数据 计算 返回 带 赛事基础信息的数组
   */
  resolve_base_info_list_by_arr(arr = []) {
    // {
    //   "mids": ["316426442470653954"],
    //   "tid": "1179778"
    // },
    let result = [];
    arr.map((x) => {
      //过滤联赛
      if (!this.filterLeague_arr.includes(x.tid)) {
        result = result.concat(this.resolve_base_info_by_tid_mids_obj(x));
      }
    });
    return result;
  }
  /**
   * 根据   单个 联赛 和 mids 映射关系   计算 返回 带 赛事基础信息的 数组
   */
  resolve_base_info_by_tid_mids_obj(obj) {
    // { "mids": ["316426442470653954"], "tid": "1179778" },
    let { tid = "", mids } = obj;
    if (typeof mids == "string") {
      mids = mids.split(",");
    }
    if (!tid || !mids.length) {
      return [];
    }
    let tid_info = this.tids_map[`tid_${tid}`] || {};
    //这时候需要判断 联赛基础信息在不在  ，有没有 ，
    // 没有的话 ， 在mids 请求完成  后面需要从新拉取基础信息 ，或者干脆防抖 5 秒 后去拉取 就行
    // mids 接口 需要传特殊参数 支持 去除基础信息 以及保留基础信息
    let arr = [];
    mids.map((x) => {
      arr.push(this.resolve_base_info_by_mid(mid, tid_info));
    });
    return arr;
  }
  /**
   * 根据   单个  mid    计算 返回 带 赛事基础信息的 单个赛事的 数据
   */
  resolve_base_info_by_mid(mid = "", tid_info = {}) {
    let obj = this.mids_map[`mid_${mid}`] || {};
    return Object.assign(obj, tid_info);
  }
  /**
   *
   * 滚球 列表数据 的 反向同步
   * structureLiveMatches  接口加工
   *
   * 这个接口只用于 滚球的 常规赛种请求 因此不含电竞和虚拟体育
   */
  rebuild_structureLiveMatches_res(arr = []) {
    let obj = {};
    let obj2 = {};
    arr.map((x) => {
      let { csid, mid, tid } = x;
      if (!obj[`csid_${csid}`]) {
        obj[`csid_${csid}`] = [];
      }
      obj[`csid_${csid}`].push({
        tid,
        mids: [mid],
      });
    });
    for (let i in obj) {
      let csid = parseInt(i.substring(5));
      //找 赛种 ID 对应的   基础 菜单 编号   比如 101   然后 滚球的  1011

      let base_mi = 100 + csid; //101

      let gun_qiu_mi = `${base_mi}1`; //1011

      this.mi_tid_mids_res[gun_qiu_mi] = {
        [`${csid}`]: obj[i],
      };
    }
  }

  /**
   *
   * 滚球   电竞   数据   反向同步
   * esportsMatches   接口加工
   */
  // todo

  /**
   *  电竞   单赛种   分日期       反向同步
   *  esportsTournamentMatches  接口加工
   */
  // todo

  /**
   *
   * 早盘 今日  常规赛种 的  数据的 反向同步
   * structureTournamentMatches  接口加工
   *
   */
  rebuild_structureTournamentMatches_res(data = {}, mi) {
    let { livedata = [], nolivedata = [] } = data;
    //区分滚球早盘的 都是 单个 mi 不会在滚球全部
    // 这里需要更新 基础数据  ，因为基础数据更新的频率比较低
    // 基础数据和这个接口 谁最后一次 回来，就用谁的为准
    // //当前的 菜单 id
    // this.current_mi=''
    // 这个地方需要同步写入 元数据
    if (mi && !mi.includes(",")) {
      //非 组合的 多个 mi ，能调用这个的 一定不在 滚球
      this.update_mi_tid_mids_res_by_mi(data, mi);
    }
    return {
      livedata: this.resolve_base_info_list_by_arr(livedata),
      nolivedata: this.resolve_base_info_list_by_arr(nolivedata),
    };
  }
  /**
   * 更新   菜单id 到 联赛 id 到 赛事ID 的 映射关系 mi_tid_mids_res
   * @param {*} data
   */
  update_mi_tid_mids_res_by_mi(data = {}, mi) {
    // 区分 滚球 早盘
    if (data.livedata || data.nolivedata) {
      let { livedata = [], nolivedata = [] } = data;
      let obj = {
        nd: this.compute_tid_mids_map_by_arr(nolivedata),
        ld: this.compute_tid_mids_map_by_arr(livedata),
      };
      this.mi_tid_mids_res[mi] = obj;
    } else {
      // 不区分  滚球 早盘   data  是一个 数组
      this.mi_tid_mids_res[mi] = this.compute_tid_mids_map_by_arr(data);
    }
  }
  /**
   *  通过 数组 反向计算出 tid  mid 的基础映射  ，（基础数据用的 形式）
   * @param {*} arr
   * @returns
   */
  compute_tid_mids_map_by_arr(arr = []) {
    let result = [];
    arr.map((x) => {
      let { mids = "" } = x;
      if (mids) {
        if (typeof mids == "string") {
          result.push({
            tid: x.tid,
            mids: mids.split(","),
          });
        } else {
          result.push({
            tid: x.tid,
            mids: mids,
          });
        }
      }
    });
    return result;
  }
  /**
   * 根据  一级 菜单ID 计算 赛种 ID
   * @param {*} mi
   */
  compute_sport_id(mi) {
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
      117: 17,
      118: 18,
      119: 19,
      120: 20,
      121: 21,
      122: 22,
      123: 23,
      128: 28,
      129: 29,
      133: 33,
      134: 34,
      135: 35,
      136: 36,
      137: 37,
      138: 38,
      139: 39,
      190: 90,
      191: 91,
      300: 300,
      400: 400,
      2000: 2000,
    
    };
    return obj[mi];
  }
  /**
   * 点击联赛展开的 方法
   *
   * 伪命题： 因为当前列表的基础数据都计算过了
   */
  /**
   *
   *
   * user/getUserInfo 接口 数据内的 联赛屏蔽和赛种屏蔽处理
   */
  resolve_getUserInfo_res(data = {}) {
    let {
      configVO: { filterLeague = "", filterSport = "" },
      openEsport,
      openVrSport,
    } = data;
    //联赛屏蔽
    this.filterLeague_arr = filterLeague.split(",").filter((x) => x);
    //球种屏蔽
    this.filterSport_arr = filterSport.split(",").filter((x) => x);
    // 需要 留意一点 ， 这个API 调用的时候 需要更新 菜单的版本

    //  电竞的四个球种  100, 101, 102, 103
    this.is_mi_2000_open_int = !!openEsport;
    // vr 虚拟体育
    this.is_mi_300_open_int = !!openVrSport;
    // let mi_2000_csid_list = [100, 101, 102, 103];
    // let res_1 = mi_2000_csid_list.map((x) => {
    //   return "" + this.filterSport_arr.includes(x);
    // });

    // this.is_mi_2000_open = res_1.includes("false");

    // let mi_300_csid_list = [1001, 1004, 1011, 1002, 1010, 1009];

    // let res_2 = mi_300_csid_list.map((x) => {
    //   return "" + this.filterSport_arr.includes(x);
    // });

    // this.is_mi_300_open = res_2.includes("false");

    this.base_data_version.value = Date.now();
    // console.warn(
    //   "用户数据解析完成----------电竞--",
    //   this.is_mi_300_open_int,
    //   "--vr--" + this.is_mi_2000_open_int
    // );
  }
}

const base_data_instance = new BaseData();
export default base_data_instance;
