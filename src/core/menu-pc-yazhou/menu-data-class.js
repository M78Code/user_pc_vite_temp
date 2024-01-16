import { ref, nextTick } from "vue";
import lodash from 'lodash';

import BaseData from "src/core/base-data/base-data.js";
import { computed_menu_to_match_templte } from 'src/core/match-list-pc/list-template/pc-menu-match-template.js'
import PageSource from 'src/core/page-source/page-source.js'
import {
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt/index.js";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import {set_template_width,get_match_tpl_number} from 'src/core/match-list-pc/list-template/match-list-tpl.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_common } from "src/api/index.js"
import { menu_default } from "./config/menu-default.js"
import { SessionStorage } from "src/core/utils/common/module/web-storage.js";

// const state = store.getState();
// 热门除了50199-30199  赛事、50101-30101 竞足外，
// 常规联赛原菜单ID：301+联赛ID、新菜单：502+菜单ID；电竞联赛原菜单：30+联赛ID、新菜单ID：联赛ID
// 这个你可以做个参照
// t：模板ID，s：玩法ID；目前改动只针对PC玩法菜单，包含：今日、早盘、串关

class MenuData {
  /**
   * @Description 构造函数
   * @param {undefined} undefined
   */
  constructor() {
    //常规体育赛种 root ID
    // this.changgui_mi = [
    //   101, 102, 105, 107, 110, 108, 103, 109, 111, 112, 113, 116, 115, 114, 104,
    //   106,
    // ];
    // this.sports_mi = [
    //   2100, 2101, 2103, 2102
    // ]
    //在今日和早盘 左侧列表内的 二级菜单 ，但是 不拼接   2 今日  3  早盘 算法的
    // 原因是这些东西  在 菜单逻辑设计上   位于左侧菜单的时候 不区分滚球早盘
    // this.left_menu_spl = [2000, 118, 400, 300];
    // 添加的自定义 的 mi 的 信息说明
    // this.add_mi_introduce = {
    //   mi_11: { text: "滚球", label: "play" },
    //   mi_12: { text: "今日", label: "today" },
    //   mi_13: { text: "早盘", label: "early" },
    //   mi_14: { text: "冠军", label: "winner_top" },
    //   mi_15: { text: "即将开赛", label: "jjks" },
    //   mi_16: { text: "串关", label: "bet" },
    //   mi_300: { text: "虚拟体育", label: "virtual_sport" },
    //   mi_400: { text: "冠军", label: "winner_top" },
    //   mi_500: { text: "热门赛事", label: "hot" },
    //   mi_100: { text: "常规球类", label: "common_sports" },
    //   // "mi_400":'常规球类 的冠军',
    //   mi_2000: { text: "电竞球类", label: "esports" },
    //   // "mi_30000":'虚拟赛事',
    // };
    //顶层  标签 ， 早盘  今日  串关  热门 滚球
    // this.top_category_label = "play";
    //左侧菜单的 整体输出
    this.left_menu_result = {
      lv1_mi: "", //一级菜单
      lv2_mi: "", // 二级菜单
    };
    //响应式左侧菜单 右侧菜单 电竞 vr  
    this.ref_lv1_mi = ref('');
    this.ref_lv2_mi = ref('');
    // 左侧菜单的 root 节点   root ：  1 滚球  2 今日   3  早盘   500 热门赛事  400 冠军   300 VR  电竞 2000
    this.menu_root = 2;
    // 与 menu_root  类似，主要用于收藏按钮的显示隐藏，使用menu_root  由于这个值被监听，会有其他情况发生
    this.menu_root_show_shoucang = 1;
    // 滚球 盘数量总计
    this.menu_root_count = {
      mi_1: 0,
      mi_500: 0,
    };
    // 中间 菜单的 整体输出
    this.mid_menu_result = {};
    //列表菜单  各种 组件 的显示
    this.match_list_menu_show = {
      list_filter: false, // 滚球  冠军
      list_filter_hot: false, // 热门
      list_filter_date: false, // 日期 菜单
      esports_header: false, //电竞 菜单
    };
    // 中间 菜单的 点击之后的 列表请求 参数 配置
    this.match_list_api_config = {
      match_list: {},
      bymids: {},
    };
    // 列表接口类型为赛事列表
    // this.match_list_api_type = "match_list";

    // api参数的版本
    this.api_config_version = ref("123");
    // 热门足球
    this.hot_500_sport_1 = false;
    //是否可以多列玩法的菜单
    this.is_multi_column = false;
    this.match_list_version = ref('23')
    // 菜单版本变更
    this.menu_data_version = ref('12')
    // 当前菜单类型 play 滚球  hot热门赛事   virtual_sport虚拟体育   winner_top冠军聚合页 today 今日   early早盘 bet串关
    this.cur_menu_type = {
      type_name:'',
      pre_name:''
    }
    // 当前选中的菜单id----终极菜单id 根据此id获取对应的旧菜单id 
    this.menu_current_mi = ''

    // 当前的mif
    this.menu_current_mif = '';

    this.kemp_list = []
    this.hot_list = []
    this.to_day_list = []
    this.early_list = []
    this.in_play_list = []
    this.vr_list = [];
    this.current_ball_type = ''

    this.left_menu_list = []
   
  }


  // 获取数据缓存 ，用于刷新
  get_new_data() {
    // 获取菜单数据缓存
    let session_info = SessionStorage.get("menu_pc");
    if (!session_info) {
      // 没有数据 使用默认值
      this.set_left_menu_list_init()
      return;
    }

    if (Object.keys(session_info).length) {
      for(let item in session_info){
        if(!['menu_data_version','match_list_version','api_config_version','ref_lv2_mi','ref_lv1_mi'].includes(item) ){
          this[item] = session_info[item]
        }
      }
    }
  }

  // 初始化菜单 默认值
  set_left_menu_list_init(list = []){
    this.left_menu_list = list.length ? list : menu_default
    this.set_menu_data_version()
  }

  // 设置 菜单的版本变化
  set_menu_data_version = lodash.debounce(() => {
    this.menu_data_version.value = Date.now()
  },10)

  /**
   * @Description 设置 api参数的版本
   * @param {undefined} undefined
   */
  set_api_config_version = lodash.debounce((version) => {
    this.api_config_version.value = version;
  },10)

  /**
   * @Description 是否电竞的球种ID
   * @param {undefined} undefined
   */
  is_eports_csid(csid) {
    // 英雄联盟100  dota2 101 csgo 102 王者荣耀103
    return [100, 101, 102, 103].includes(+csid);
  }

  // 获取二级菜单数据
  set_post_menu_play_count(mi){
    let mi_ = mi || this.left_menu_result.lv1_mi
    let params = {
      cuid: UserCtr.get_cuid(),
      euid: this.get_mid_for_euid(mi_)
    }
    api_common.post_menu_play_count(params).then((res = {})=>{
      if(res.code == 200){
        let menu_list = lodash.get(res,'data.subList',[])
        let list_obj = {}
        let list_arr = [];
         menu_list.forEach(item=>{
          if(item.field2 == "18" && mi_ != 118){//非娱乐冠军
            const kemp_mi = mi_.substring(0,3)+'4';
            list_obj[kemp_mi] = {
              ct: item.count,
              mi: kemp_mi
            }
          }else{
            // 旧菜单 转化为新的菜单 
            list_obj[BaseData.base_menu_obj[item.menuId] || '0' ] = {
              ct: item.count,
              mi: BaseData.base_menu_obj[item.menuId]
            }
          }
        })
        // 使用新的二级菜单数据 替换旧的菜单数据
        for(let item of this.left_menu_list){
          if(item.mi == mi){
            // 获取到菜单的二级菜单列表 和 接口返回的二级菜单列表 做对比 数量替换 
            let item_sl = lodash.cloneDeep(lodash.get(item,'sl',[])) || [];
            item_sl.forEach(item => {
              //对 匹配上的数据 做替换
              if(list_obj[item.mi] && list_obj[item.mi].mi == item.mi ){
                item.ct = list_obj[item.mi].ct
              }
            })
            item.sl = item_sl
          }
        }
      }
    }).catch(err =>{
      console.error('获取二级菜单数据错误',err)
    })
  }

  /***
   * 滚球盘 数量计算
   */
  compute_menu_root_cont() {
    // console.log("compute_menu_root_cont",BaseData.mew_menu_list_res)
    //过滤常规球类
    let mi_100_arr = []; //常规体育
    let mi_2000_arr = []; //电竞

    // 遍历 新菜单数据
    BaseData.mew_menu_list_res.map((x) => {
      // 拿到 基础赛种 id
      let mif = 1 * x.mi;
      //常规体育
      // 这个全部数量，应该只统计常规赛事的数量，不包含电子竞技和虚拟体育，
      if (BaseData.left_menu_base_mi_arr.includes(mif)) {
        // 滚球对象
        let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
        item.mif = mif;

        mi_100_arr.push(item);
      }
      //电竞
      if (BaseData.sports_mi.includes(mif)) {
        // 滚球对象
        let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
        mi_2000_arr.push(item);
      }
    });

    //  VR  体育的
    // let vr_menu_obj = BaseData.mew_menu_list_res.find(
    //   (x) => x.mi == 300
    // ) || {
    //   sl: [],
    // };
    // let vr_sl = vr_menu_obj["sl"] || [];

    const mi_500_obj =
      BaseData.mew_menu_list_res.find((x) => x.mi == 500) || {};
    let mi_1_num = 0;

    mi_100_arr &&
      mi_100_arr.forEach((item) => {
        if (item.ct) {
          mi_1_num += item.ct;
        }
      });

    // 电子竞技的赛事数量
    mi_2000_arr &&
      mi_2000_arr.forEach((item) => {
        mi_1_num += item.ct;
      });

    // vr_sl&&vr_sl.forEach(item=>{
    //   mi_1_num += item.ct
    // })

    // vr 固定23个
    this.menu_root_count = {
      mi_1: mi_1_num + 23 || 0,
      mi_500: mi_500_obj.ct,
    };
    return this.menu_root_count;
  }

  /***
   * 列表接口类型
   */
  set_match_list_api_type(obj) {
    let val = "league_list";
    // console.warn('obj.root',obj.root)
    // 热门赛事下的 电子竞技 是联赛
    let is_root_500_esport =
      obj.root == 500 &&
      [100, 101, 102, 103].includes(
        Number((this.match_list_api_config.match_list.params || {}).csid || 0)
      );
    // 滚球赛事下的 电竞是赛事
    let is_root_1_esport = this.menu_root == 1 && obj.root == 2000;
    if (
      ([1, 500, 400, 300].includes(Number(obj.root)) && !is_root_500_esport) ||
      is_root_1_esport
    ) {
      val = "match_list";
    }
    console.error('set_match_list_api_type',obj)

    const { jinri_zaopan,guanjun } = obj
    let text = 'match-today-common'
    // 今日
    if(jinri_zaopan == 2){
      text = 'match-today-common'
    }
    // 早盘
    if(jinri_zaopan == 3){
      text = 'match-early-common'
    }
    // 常规赛种下的冠军
    if(guanjun == 'common-guanjun'){
      text = 'match-common-champion'
    }
    // 冠军下面的常规赛事
    if(guanjun == 'guanjun-common'){
      text = 'match-champion'
    }
    if(this.menu_root == 1) {
      text = 'match-play-common'
    }
    PageSource.set_page_source(text)

    // console.warn('ssss',val);
    this.match_list_api_type = val;
  }
  // 菜单切换 记录前一个和当前菜单的 赔率类型  设置页面的赔率类型
  set_page_odd_type() {
    // 冠军 只能是欧赔
    //  // 冠军 只能是欧赔
    //  if (cur == 18) {
    //   this.set_pre_odd(this.vx_get_cur_odd);
    //   this.set_cur_odd("EU");
    // } else if (old == 18) {
    //   this.set_cur_odd(this.vx_get_pre_odd);
    // }
  }

  // 设置终极菜单id
  set_menu_current_mi(mi) {
    this.menu_current_mi = mi
    //宽度请求变化 因为请求参数是在这里触发的
    this.set_match_list_api_config({})
    
  }

  // 设置当前mif
  set_menu_current_mif(mif) {
    this.menu_current_mif = mif
  }

  // 设置当前的赛种id
  set_current_ball_type(val){
    this.current_ball_type = val
  }

   /**
   * 获取当前的列表的默认的 模板配置
   */
   get_match_tpl_number() {
    return get_match_tpl_number()

    // let r = (match_list.params || {}).orpt || 1;
    // if (r == '0') {
    //   r = 1
    // }
    // // 电竞常规赛事
    // if (this.is_esports()) {
    //   r = "esports";
    // }
    // //搜索13列玩法
    // if (this.is_multi_column && state.configReducer.config.multi_column) {
    //   r = 13;
    // }
    // // console.error( 'get_match_tpl_number----------get_match_tpl_number----',r );

    // return r || 1;
  }
  get_lv2_mi_value(){
    return this.ref_lv2_mi.value || ""
  }
  /**
   * 设置    左侧菜单输出
   *
   * root ：   1 滚球  2 今日   3  早盘   500 热门赛事  400 冠军   300 VR  电竞 2000    （常规赛事 100 ， 不会传这里）
   * lv1_mi
   * lv2_mi
   */
  set_left_menu_result(obj) {
    this.menu_root_show_shoucang = obj.root;
    // this.menu_root = obj.root?obj.root:this.menu_root;
    // 设置 列表接口类型
    // this.set_match_list_api_type(obj);
    // console.error('set_left_menu_result',obj)
    // 是否有中间菜单 ，
    // 有则 需要显示中间菜单组件,需要 走中间菜单渲染 ，中间菜单负责输出 列表请求参数
    // 如果没有 需要逻辑分流计算 列表请求参数
    this.left_menu_result = {
      ...obj,
      version: Date.now(),
      root: this.menu_root
    };
    // this.ref_lv1_mi.value = obj.root?obj.root:this.menu_root;
    this.ref_lv2_mi.value =obj.lv2_mi?Number(obj.lv2_mi):"";
    if (obj.has_mid_menu) {
      //  如果 有   走 自然的 中间菜单组件渲染 ，
      this.compute_mid_match_list_menu_component_show();
    } else {
      // 如果没有  需要逻辑分流计算 列表请求参数
      //     设置 请求  列表结构  API 参数的   值  当中间 没有菜单的时候
      let { mid_menu_refer_params } = obj;
      delete obj.mid_menu_refer_params;
      if (mid_menu_refer_params && Object.keys(mid_menu_refer_params).length) {
        this.set_match_list_api_config(mid_menu_refer_params);
      }
    }

    if ([2, 3].includes(Number(obj.root))) {
      // 角球
      if ([101210, 101310].includes(+obj.lv2_mi)) {
        this.set_mid_menu_result(obj);
      } else {
        this.mid_menu_result = {};
      }
    }

    // 菜单数据缓存
    this.set_local_1_500_count();

    // 设置全屏
    this.set_multi_column();

    this.set_menu_data_version()
  }

  // 根据菜单id 获取对应的euid
  get_mid_for_euid(mi) {
    let euid="";
    if(mi == 0){//滚球全部
      euid = this.in_play_list.map(n=>{
        const euid_obj = lodash.get(BaseData, `mi_info_map[mi_${n.mi}]`, {})
        return euid_obj.euid || "";
      }).join();
      return euid;
    }
    if(mi == 400){//冠军全部
      euid = this.kemp_list.map(n=>{
        const euid_obj = lodash.get(BaseData, `mi_info_map[mi_${n.mi}]`, {})
        return euid_obj.euid || "";
      }).join();
      return euid;
    }
    let obj = lodash.get(BaseData, `mi_info_map[mi_${mi}]`, {})
    euid = obj.euid;
    return euid || 3020101
  }
  /**
   * 中间菜单显示配置 默认的
   */
  get_mid_menu_show_default() {
    return {
      list_filter: false, // 滚球  冠军
      list_filter_hot: false, // 热门
      list_filter_date: false, // 日期 菜单
      esports_header: false, //电竞 菜单
      virtual_list_sport_header: false, // 虚拟体育 赛种 菜单
      virtual_list_league_header: false, // 虚拟体育 联赛 菜单
    };
  }
  /**
   * 计算中间  列表菜单  各种 组件 的显示
   */
  compute_mid_match_list_menu_component_show() {
    let { mid_menu_show } = this.left_menu_result;
    let mid_menu_show_default = this.get_mid_menu_show_default();
    let obj = {
      ...mid_menu_show_default,
      ...mid_menu_show,
      version: Date.now(),
    };
    this.match_list_menu_show = obj;
  }
  /**
   * 设置      中间 菜单输出
   *
   *电竞是 其他是 euid
   *  csid :"",
   *  euid:'' ,  // 最终的菜单的 euid
      mi:"",  // 最终的 菜单 mi
      md:''  // 日期时间戳
   *
   */
  set_mid_menu_result(obj) {
    this.mid_menu_result = {
      ...obj,
      version: Date.now(),
    };
    this.menu_root_show_shoucang = obj.root;
    console.error(
      "set_mid_menu_result-------",
      JSON.stringify(this.mid_menu_result)
    );
    // 设置全屏
    this.set_multi_column();
  }
  /**
   * 定义中间菜单    点击 输出 请求  列表结构  API 参数的   模板
   */
  get_match_list_api_config_tepmlate_and_description() {
    let description = {
      begin_request:
        "是否发起请求 默认 true ，如果有联赛层级的菜单需要在联赛点击 ,赛种点击不生效。也就是中间列表 如果存在多层菜单，非最终一层菜单点击是不发起请求的",
      is_collect: "是否是收藏模式 ，布尔值",
      route: "detail 常规详情页面 , list 常规列表页  ",
      root: "  1 滚球 , 2 今日  , 3  早盘 ,  500 热门赛事 , 400 冠军  , 300 VR , 电竞 2000   ",
      sports:
        "hot-jingzu  热门 竟足 50101  , hot-saishi 热门   赛事 50199  ,  hot-liansai  热门 联赛 ,  quanbu-gunqiu  全部滚球 ,  quanbu-guanjun  全部冠军, dianjing 电竞 , vr 虚拟体育 ,common 常规体育    common-date 常规体育早盘    ",
      guanjun:
        "common-guanjun 常规体育菜单下的 冠军玩法 ,  guanjun-common  冠军单页下的常规赛事   dianjing-guanjun 电竞 体育菜单下的 冠军玩法  '' 空 不是冠军",
      // 列表队列 接口
      match_list: {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
      },
      // bymids 接口  基本参数
      bymids: {
        api_name: "api 方法名字   api_match 的 子方法名字",
        params: {},
      },
    };
    let config = {
      begin_request: true,
      is_collect: false,
      route: "",
      root: "",
      sports: "",
      guanjun: "",
      // 列表队列 接口
      match_list: {
        api_name: "",
        api_type: "",
        params: {},
      },
      //
      bymids: {
        api_name: "",
        api_type: "",
        params: {},
      },
    };
    return {
      config,
      description,
    };
  }

  // 当前最下层的菜单  数量 变为0 ，需要 找到 同级别的 下一个  有数量的
  // 进行模拟点击
  set_current_mi_0_and_change_menu() {
    return;
    //TODO

    this.set_left_menu_result(config);
  }


  // 设置 热门和滚球的数量 存在localStorage
  set_local_1_500_count() {
    // 滚球热门数据 存local
    SessionStorage.set("local_1_500_count", this.compute_menu_root_cont());
  }
  // 设置投注类别

  /**
   * @Description 设置投注类型
   * @param {undefined} undefined
   */
  set_bet_category() {
    let type;
    if (this.is_vr()) {
      type = 2; // 虚拟体育
    } else if (this.is_esports()) {
      type = 3; // 电竞
    } else {
      type = 1; // 标准赛事
    }

    // store.dispatch("set_bet_category", type);
    // if (type == 1) {
    //   store.dispatch("set_is_virtual_bet", false);
    // } else {
    //   store.dispatch("set_is_virtual_bet", true);
    // }

    // store.dispatch("virtual_bet_clear");
  }
  /**
   * @description 判断是虚拟体育
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  is_vr() {
    return (
      this.menu_root == 300 || (this.match_list_api_config || {}).sports == "vr"
    );
  }
  is_esports_champion() {
    return (this.match_list_api_config || {}).guanjun == "dianjing-guanjun";
  }
  is_home() {
    return false
  }
  is_leagues() {
    return false
  }
  //root ：  1 滚球  2 今日   3  早盘   500 热门赛事  400 冠军   300 VR  电竞 2000
  //内部方法
  _is_cur_mi(mi, param) {
    if (param) {
      return mi == param
    }
    return this.ref_lv1_mi.value == mi
  }
  // is_multi_column(){
  //   return   this.match_list_api_config.is_multi_column ||false
  // }
  // type 临时处理方案 type 1常规竞猜
  // 判断是不是足球
  // 今日 早盘 热门赛事 滚球
  // 冠军 vr不处理
  set_multi_column() {
    let is_multi_column = false;
    if ([400, 300].includes(Number(this.menu_root))) {
      is_multi_column = false;
    } else {
      const { lv2_mi } = this.left_menu_result || {};
      // 只有“让球和大小”菜单 展示【 收起 】按钮。其他二级菜单不展示
      if (
        [2, 3].includes(Number(this.menu_root)) &&
        ["101201", "101301"].includes(lv2_mi)
      ) {
        const { lv1_mi, guanjun } = this.left_menu_result;
        if (lv1_mi == 1012 || lv1_mi == 1013 ) {
          is_multi_column = true;
        }
      }
      if (1 == this.menu_root) {
        const { mif, mi } = this.mid_menu_result;
        if (mif == 101 || mi == 1011) {
          is_multi_column = true;
        }
      }
      if (500 == this.menu_root) {
        is_multi_column = this.hot_500_sport_1;
        const { mi } = this.mid_menu_result;
        // 判断是全部和竞足，则不需要显示 展开/收起 按钮
        if ([50199, 50101].includes(Number(mi))) {
          is_multi_column = false;
        }
      }
    }

    //页面是否达到最小宽度 true是/false否
    // if (state.layoutReducer.is_min_width) {
    //   is_multi_column = false;
    // }
    // is_unfold_multi_column: false, //是否展开多列玩法
    this.is_multi_column =
      is_multi_column &&
      !window.frames.length != parent.frames.length
    !this.is_multi_colum&& LayOutMain_pc.set_unfold_multi_column(false)
      // && state.layoutReducer.is_unfold_multi_column;
    // store.dispatch("set_unfold_multi_column", this.is_multi_column);
    // console.warn('this.is_multi_column ',this.is_multi_column )
  }
  /**
   * 获取 当前 左侧菜单赛种的 名字
   */
  get_current_left_menu_name() {
    let mi = this.left_menu_result.lv1_mi;
    let str = BaseData.menus_i18n_map[mi] || mi;
    return str;
  }
  /**
   * 计算当前菜单 是否显示 收藏按钮
   */
  compute_if_can_show_shoucang() {
    // VR体育,电子竞技不显示收藏
    return (
      this.menu_root_show_shoucang != 300 &&
      this.menu_root_show_shoucang != 2000
    );
  }
  /**
   * 计算当前菜单 是否显示  联赛过滤
   */
  compute_if_can_show_league_fliter() {
    let state = !this.is_esports() && !this.is_vr();
    // vx_layout_list_type!='collect' && !is_search_page &&!this.is_esports() && !menu_data.is_vr && !is_show_hot && get_global_switch.filter_switch
    return state;
  }
  /**
   * 列表排序按钮
   * @returns
   */
  compute_if_can_show_sort() {
    ////  console.warn("冠军 ",this.is_guanjun() )
    ////  console.warn("电子竞技 ",this.is_esports() )
    ////  console.warn("vr ",this.is_vr() )
    let state = !this.is_esports() && !this.is_vr();
    // !is_search_page && !this.is_esports() && !menu_data.is_vr && !is_show_hot &&!vx_show_filter_popup
    return state;
  }
  /**
   * 筛选模式下列表 需要重新发起 请求
   * @param {*} arr
   */
  set_filter_select_obj(arr) {
    //TODO
    // store.dispatch("set_filter_select_obj", arr);
    if (this.match_list_api_config.match_list.params) {
      this.match_list_api_config.match_list.params.tid = arr.join(",");
    }
    this.match_list_version.value = Date.now();
  }
  /**
   * 定义  设置 请求  列表结构  API 参数的   值
   */
  set_match_list_api_config(config) {
    // 更新列表数据类型
    // this.set_match_list_api_type(this.mid_menu_result);
    this.set_match_list_api_type(config.root?config:this.mid_menu_result);
    // 设置投注类别
    this.set_bet_category();
    set_template_width(lodash.trim(LayOutMain_pc.layout_content_width - 15, 'px'), this.is_scroll_ball())
    // 菜单数据缓存 //从元数据拿值
    useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST_METADATA, {})
    useMittEmit(MITT_TYPES.EMIT_FETCH_MATCH_LIST, {}) //从接口拿值
    nextTick(()=>{
      SessionStorage.set('menu_pc',this)
    })
  }
  

  set_menu_root(val){
    val = val || 2;
    this.menu_root = val
    this.ref_lv1_mi.value = val;
    let left_menu_list = []
    
    if(val == 2){
      left_menu_list = lodash.cloneDeep(this.to_day_list) 
     
    }
    if(val == 3){
      left_menu_list = lodash.cloneDeep(this.early_list) 
    }
    if([2,3].includes(val*1)){
      this.set_left_menu_list_init(left_menu_list)
    }
  
    this.set_menu_data_version()
  }
 
  // 根据菜单设置对应的数据
  set_init_menu_list(){
    let menu_list = lodash.cloneDeep(lodash.get(BaseData,'left_menu_base_mi',[]))
    // 今日
    let to_day_list = []
    // 早盘
    let early_list = []
    // 冠军
    let kemp_list = []
    // 滚球
    let in_play_list = []
    // 热门赛事
    let hot_list = []
    
    // 菜单大类对应的code
    let type_list = [1,2,3]

    menu_list.forEach(item => {
      let list_sl = lodash.get(item,'sl',[]) || []
      if(list_sl.length){
        type_list.forEach(type => {
          let item_obj = list_sl.find(obj => obj.mi == item.mi + ''+type ) || {}
          let kemp = {}
          if(item_obj.mi){
            switch(type){
              case 1:
                in_play_list.push(item_obj)
                break;

              case 2:
                if(![190,191].includes(item.mi*1)){
                  // 获取 今日下的冠军数据 插入到赛种中 并且赛种的数量 = 让球大小 + 冠军数量
                  kemp = list_sl.find(obj => obj.mi == item.mi + '4' ) || {}
                  if(item_obj.sl){
                    item_obj.sl.push(kemp)
                  }else{
                    item_obj.sl = [kemp]
                  }
                  // mif 赛种id
                  // mi 新菜单id
                  item_obj.ct += kemp.ct
                }
                item_obj.mif = item.mi
                to_day_list.push(item_obj)
                break;

              case 3: 
                if(![190,191].includes(item.mi*1)){
                  // 获取 今日下的冠军数据 插入到赛种中 并且赛种的数量 = 让球大小 + 冠军数量
                  kemp = list_sl.find(obj => obj.mi == item.mi + '4' ) || {}
                  if(item_obj.sl){
                    item_obj.sl.push(kemp)
                  }
                  // mif 赛种id
                  // mi 新菜单id
                  item_obj.ct += kemp.ct
                }
                item_obj.mif = item.mi
                early_list.push(item_obj)
                break;
            }
          }
        })
      }
      // 娱乐 只有冠军 没有其他玩法
      if(item.mi == 118){
        to_day_list.push(item)
        early_list.push(item)
      }
    })
    let mew_menu_list_res = lodash.get(BaseData,'mew_menu_list_res',[]) || []
    
    // 获取冠军的所有数据
    let kemp_list_ = mew_menu_list_res.find(item => item.mi == 400) || {}
    kemp_list = lodash.get(kemp_list_,'sl',[]) || []

    // 获取热门赛事
    let hot_list_ = mew_menu_list_res.find(item => item.mi == 500) || {}
    hot_list = lodash.get(hot_list_,'sl',[]) || []

    let esports_list = mew_menu_list_res.filter(item => item.mi > 2000 && item.mi < 3000 ) || []
    // 获取电子竞技的赛事数量
    let esports_ct = esports_list.reduce((cur,pre) => {
      let pre_list = lodash.get(pre,'sl',[]) || []
      return cur += pre_list.reduce((pre_cur,item)=> {
        return pre_cur += item.ct
      },0)
    }, 0)
    // 设置电子竞技的数据 插入到菜单列表中
    let esports_obj = {
      mi: 2000,
      sl: esports_list,
      ct: esports_ct
    }

    // 获取 电子足球，电子篮球的位置
    let foot_index_of = lodash.findIndex(to_day_list,{mi:'1902'})
    let basket_index_of = lodash.findIndex(to_day_list,{mi:'1912'})
    // 篮球在足球后面，有篮球就使用篮球当前的位置 没有就用足球 最后使用默认位置
    let e_sports_index = (basket_index_of > 0 ? basket_index_of : foot_index_of > 0 ? foot_index_of : 2 ) + 1
    to_day_list.splice(e_sports_index , 0 ,esports_obj)

    let foot_index_of_ = lodash.findIndex(to_day_list,{mi:'1903'})
    let basket_index_of_ = lodash.findIndex(to_day_list,{mi:'1913'})
     // 篮球在足球后面，有篮球就使用篮球当前的位置 没有就用足球 最后使用默认位置
    let e_sports_index_ = ( basket_index_of_ > 0 ? basket_index_of_ : foot_index_of_ > 0 ? foot_index_of_ : 2 ) + 1
    early_list.splice(e_sports_index_ , 0 ,esports_obj)

    // 获取vr赛事
    let vr_list_ = mew_menu_list_res.find(item => item.mi == 300) || {}
    // vr 体育数量写死 295
    vr_list_.ct = 295

    // 冠军 和 vr 加入到 今日 早盘列表
    to_day_list.push(kemp_list_,vr_list_)
    early_list.push(kemp_list_,vr_list_)

    this.kemp_list = kemp_list
    this.hot_list = hot_list
    this.to_day_list = to_day_list
    this.early_list = early_list
    this.in_play_list = in_play_list
    
    // 默认设置 早盘数据
    this.set_left_menu_list_init(to_day_list)
  }
  /**
 * 暂时获取联赛接口  后期国际化从init取 目前init没有国际化
 */
  async get_vr_menu_list(){
    const res = await api_common.get_virtual_menu({device: 'V1_H5'});
    if(res && res.code =='200'){
        this.vr_list = res.data;
        return res.data
    }
    return []
  }
 
  // 新菜单规律核心参照表
  /**
   * 新菜单规律核心参照表  根据这个表 设计
   * @param {*}
   */
  // 新菜单的  菜单基础 ID mi 和 赛种 基础球种 csid   对应关系
  // 常规球种 menu_id 规则 ：100   +对应球种 id   csid  100 + 1  = 101        足球
  // 电竞球种 menu_id 规则 ：2000  +对应球种 id   csid  2000 + 100   =2100   英雄联盟
  // 虚拟球种 menu_id 规则 ：30000 +对应球种 id   csid  30000 + 1001 =31001   VR足球
  // 冠军    menu_id  规则 :400   +对应球种 id    csid  400 +1  = 401 冠军 足球
  //   约定 几个值
  // 100 常规球类
  // 400  常规球类 的冠军
  // 2000 电竞球类
  // 30000  虚拟赛事 VR
  //  1 滚球   play
  //  2 今日
  //  3  早盘
  // 400 冠军
  // 500 热门赛事   hot
  // 四层菜单  也可能是三层 也可能是两层      []
  // config 的约定 ：
  // 第一位
  // 思路 把页面分为 左侧 和 中间
  //菜单分为 左侧和中间  ，头部的  其实 等同于左侧
  /**
   * 设置左侧菜单 路径    中间的菜单传到这里可能会判断错误 ，不兼容
   * @param {*} config
   *
   * 示例 ：
   * [1]  ,// 滚球
   * [500] ,// 热门赛事
   * [2,101,101201]  // 今日  足球今日   足球今日让球大小
   * [2,400,]  // 今日 冠军
   * [2,118,1184] //今日  娱乐 冠军
   * [2,300,31001] //今日 虚拟体育  VR足球
   * [2,2000,2100] // 今日 电竞  英雄联盟
   *
   */
  compute_menu_path_label() {
    let cando = Array.isArray(config) && config.length > 0;
    if (!cando) {
      return false;
    }
    let len = config.length;
    let i1 = config[0];
    let i2 = config[1];
    let i3 = config[2];
    // 1 滚球  500 热门赛事 2 今日 3 早盘
    let label = (this.add_mi_introduce[`mi_${i1}`] || {})["label"];
    // 电竞球类    冠军  虚拟体育  添加  特殊 label
    if (len > 1 && [2000, 400, 300].includes(parseInt(i2))) {
      let i2_label = (this.add_mi_introduce[`mi_${i2}`] || {})["label"];
      label = `${label}--${i2_label}`;
    }
    this.top_category_label = label;
    // 还要去计算模板
  }
  /**
   * @Description 获取菜单数据
   * @param {undefined}
   */
  get_menu_data() {
    BaseData.init_mew_menu_list();
  }
  /**
   * 通过CSID 计算 label
   * @param {*} csid
   */
  compute_label_by_csid(csid) {
    if (("" + csid).includes(",")) {
      return "all";
    }
    csid = parseInt(csid);
    let label = "common";
    if (csid < 100) {
      //常规体育
      label = "common";
    } else if (csid > 100 && csid < 1000) {
      //电子竞技
      label = "esport";
    } else if (csid > 1000) {
      //虚拟体育
      label = "vr";
    }
    // 冠军
    return label;
  }

  /**
   * @Description 获取当前列表模板编号
   * @param {undefined} undefined
   */
  // get_match_tpl_number_xxxxxx(is_hot) {
  //   let match_tpl_number = -1;
  //   // 玩法菜单
  //   // 详情页热门赛事 或者 搜索 或者列表强力推荐
  //   if (
  //     window.vue.$route.name == "details" ||
  //     window.vue.$route.name == "search" ||
  //     is_hot
  //   ) {
  //     match_tpl_number = -1;
  //     //搜索13列玩法
  //     if (
  //       _.get(vue, "$route.query.csid", -1) === "1" &&
  //       this.menu_data.is_multi_column &&
  //       store.getters.get_unfold_multi_column
  //     ) {
  //       match_tpl_number = 13;
  //     }
  //   }
  //   return match_tpl_number;
  // }
  /**
   * @description: 设置当前菜单类型
   * @param {*} menu_obj
   * @return {*}
   */
  set_cur_menu_type(menu_obj) {
    Object.assign(this.cur_menu_type,menu_obj)
    //暂不确定用哪一个驱动更新
  }
  static cl_1() {
    // console.error("cl_1");
  }
  /**
   * @Description  是否角球玩法菜单
   * @param {boolean}
   */
  is_corner_menu() {
    return [101210, 101310].includes(+this.left_menu_result.lv2_mi);
  }

  is_esports_champion() {
    return (this.match_list_api_config || {}).guanjun == "dianjing-guanjun";
  }

  // 是否是 featured
  is_featured() {
    return this.mid_menu_result.filter_tab == 1001
  }

  // 是否是 top_events
  is_top_events() {
    return this.mid_menu_result.filter_tab == 1002
  }

  // 是否是 leagues
  is_leagues() {
    return this.mid_menu_result.filter_tab == 4002
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
    if (mi) {
      return this._is_cur_mi(300, mi)
    }
    return this._is_cur_mi(300, mi) || (this.match_list_api_config.guanjun || "").includes("vr")
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
  is_left_zaopan(mi) {
    return this._is_cur_mi(203, mi)
  }
  /**
   * 是否选中了今日
   *  mi [number|string] 要比对的值
  */
  is_today(mi) {
    return this._is_cur_mi(2, mi)
  }
  is_left_today(mi) {
    return this._is_cur_mi(202, mi)
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
    if (mi) {
      return this._is_cur_mi(400, mi)
    }
    return this._is_cur_mi(400, this.menu_root)
    // return this._is_cur_mi(400, mi) || (this.match_list_api_config.guanjun || "").includes("guanjun")
  }

  /**
   * 是否选中了电竞
   *  mi [number|string] 要比对的值
  */
  is_esports(mi) {
    // return (
    //   this.menu_root == 2000 ||
    //   (this.match_list_api_config || {}).sports == "dianjing"
    // );
    if(mi){
      return this._is_cur_mi(2000, mi)
    }
    return this._is_cur_mi(2000, mi) || this._is_cur_mi(2000, this.left_menu_result.lv1_mi)
  }
  /**
   * 是否选中了串关
   *  mi [number|string] 要比对的值 没有传递对比当前菜单
  */
  is_mix(mi) {
    return this._is_cur_mi(6, mi)
  }
  /*
    * 是否为电子赛事
    *  mi [number|string] 要比对的值
  */
  is_electron_match(mi) {
    return [190,191].includes(this.left_menu_result.lv1_mi * 1) 
  }
  /**
   * 是否为首页
   *  mi [number|string] 要比对的值
  */
  is_home(mi) {
    return this._is_cur_mi(0, mi)
  }
  // 是不是 常规赛种下的冠军
  is_common_kemp(mi) {
    mi = mi || this.left_menu_result.lv2_mi;
    return  mi && mi.length == 4 && mi.substr(mi.length-1,1) == 4;
  }

  is_collect_kemp() {
    return this.is_collect && this.menu_root == 400
  }
}

export default new MenuData();
