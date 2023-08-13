import base_data_instance from 'src/core/utils/base-data/base-data.js'
import utils from "src/core/utils/utils.js"
import store from "src/store-redux/index.js";

import { ref } from "vue"

const state = store.getState()
// 热门除了50199-30199  赛事、50101-30101 竞足外，
// 常规联赛原菜单ID：301+联赛ID、新菜单：502+菜单ID；电竞联赛原菜单：30+联赛ID、新菜单ID：联赛ID
// 这个你可以做个参照
// t：模板ID，s：玩法ID；目前改动只针对PC玩法菜单，包含：今日、早盘、串关
// 类型对应的菜单名称
const menu_type_to_menu_name = {
  // 滚球
  menu_type_1: "play",
  // 热门赛事
  menu_type_12: "hot",
  // 虚拟体育
  menu_type_900: "virtual_sport",
  // 冠军聚合页
  menu_type_100: "winner_top",
  // 体育菜单
  menu_type_9: "sport_menu",
  // 今日
  menu_type_3: "today",
  // 早盘
  menu_type_4: "early",
  // 串关
  menu_type_11: "bet",
  // 电竞
  menu_type_3000: "esports",
};
// 菜单名称列表
const menu_name_arr = Object.values(menu_type_to_menu_name);

class menu_config_class {
  /**
   * @Description 构造函数
   * @param {undefined} undefined
   */
  constructor() {
    //左侧菜单 选中 path
    this.left_menu = [];
    //中间列表菜单 选中
    this.mid_menu = {
      euid: "", // 最终的菜单的 euid
      mi: "", // 最终的 菜单 mi
      md: 0, // 日期时间戳
      csid: "", // 赛种
      tid: "", //联赛id
    };
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
    this.left_menu_spl = [2000, 118, 400, 300];
    // 添加的自定义 的 mi 的 信息说明
    this.add_mi_introduce = {
      mi_11: { text: "滚球", label: "play" },
      mi_12: { text: "今日", label: "today" },
      mi_13: { text: "早盘", label: "early" },
      mi_14: { text: "冠军", label: "winner_top" },
      mi_15: { text: "即将开赛", label: "jjks" },
      mi_16: { text: "串关", label: "bet" },
      mi_300: { text: "虚拟体育", label: "virtual_sport" },
      mi_400: { text: "冠军", label: "winner_top" },
      mi_500: { text: "热门赛事", label: "hot" },
      mi_100: { text: "常规球类", label: "common_sports" },
      // "mi_400":'常规球类 的冠军',
      mi_2000: { text: "电竞球类", label: "esports" },
      // "mi_30000":'虚拟赛事',
    };
    //顶层  标签 ， 早盘  今日  串关  热门 滚球
    this.top_category_label = "play";
    //左侧菜单的 整体输出
    this.left_menu_result = {};
    // 左侧菜单的 root 节点   root ：  1 滚球  2 今日   3  早盘   500 热门赛事  400 冠军   300 VR  电竞 2000
    this.menu_root = 1;
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
    this.match_list_api_type ='match_list';

    // api参数的版本
    this.api_config_version = ref('123')

    // 热门足球
    this.hot_500_sport_1 = false
    //是否可以多列玩法的菜单
    this.is_multi_column = false

  }

  /**
   * @Description 设置 api参数的版本
   * @param {undefined} undefined
   */
  set_api_config_version(version) {
    this.api_config_version.value = version
  }

  /**
   * @Description 是否电竞的球种ID
   * @param {undefined} undefined
   */
  is_eports_csid(csid) {
    // 英雄联盟100  dota2 101 csgo 102 王者荣耀103
    return [100, 101, 102, 103].includes(+csid);
  }
  /***
   * 滚球盘 数量计算
   */
  compute_menu_root_cont() {
    // console.log("compute_menu_root_cont",base_data_instance.mew_menu_list_res)
    //过滤常规球类
    let mi_100_arr = [];  //常规体育
    let mi_2000_arr = [];  //电竞

    // 遍历 新菜单数据
    base_data_instance.mew_menu_list_res.map((x) => {
      // 拿到 基础赛种 id
      let mif = 1 * x.mi;
      //常规体育
          // 这个全部数量，应该只统计常规赛事的数量，不包含电子竞技和虚拟体育，
      if (base_data_instance.left_menu_base_mi_arr.includes(mif)) {
        // 滚球对象
        let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
        item.mif = mif;

        mi_100_arr.push(item);
      }
      //电竞
      if (base_data_instance.sports_mi.includes(mif)) {
        // 滚球对象
        let item = (x["sl"] || []).find((y) => y.mi == `${mif}1`) || {};
        mi_2000_arr.push(item);
      }
    });

    //  VR  体育的
    // let vr_menu_obj = base_data_instance.mew_menu_list_res.find(
    //   (x) => x.mi == 300
    // ) || {
    //   sl: [],
    // };
    // let vr_sl = vr_menu_obj["sl"] || [];


    const mi_500_obj = base_data_instance.mew_menu_list_res.find((x) => x.mi == 500) || { }
    let mi_1_num = 0;

    mi_100_arr&&mi_100_arr.forEach(item=>{
      if(item.ct){
        mi_1_num += item.ct
      }
    })

    // 电子竞技的赛事数量
    mi_2000_arr&&mi_2000_arr.forEach(item=>{
      mi_1_num += item.ct
    })

    // vr_sl&&vr_sl.forEach(item=>{
    //   mi_1_num += item.ct
    // })

    // vr 固定23个
    this.menu_root_count = {
      mi_1: mi_1_num + 23 || 0 ,
      mi_500: mi_500_obj.ct,
    };
    return this.menu_root_count
  }

    /***
   * 列表接口类型
   */
  set_match_list_api_type(obj) {
    let val = 'league_list'
    // console.warn('obj.root',obj.root)
    // 热门赛事下的 电子竞技 是联赛
    let is_root_500_esport = obj.root == 500 && [100,101,102,103].includes(Number((this.match_list_api_config.match_list.params || {}).csid || 0))
    // 滚球赛事下的 电竞是赛事
    let is_root_1_esport =  this.menu_root == 1 && obj.root == 2000 
    if(([1,500,400,300].includes(Number(obj.root)) && !is_root_500_esport) || is_root_1_esport){
      val = 'match_list'
    }
    // console.warn('ssss',val);
    this.match_list_api_type = val
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
  /**
   * 设置    左侧菜单输出
   *
   * root ：   1 滚球  2 今日   3  早盘   500 热门赛事  400 冠军   300 VR  电竞 2000    （常规赛事 100 ， 不会传这里）
   * lv1_mi
   * lv2_mi
   */
  set_left_menu_result(obj) {
    this.menu_root = obj.root;
    this.menu_root_show_shoucang = obj.root;

    // 设置 列表接口类型
    this.set_match_list_api_type(obj)

    // 是否有中间菜单 ，
    // 有则 需要显示中间菜单组件,需要 走中间菜单渲染 ，中间菜单负责输出 列表请求参数
    // 如果没有 需要逻辑分流计算 列表请求参数
    if (obj.has_mid_menu) {
      this.left_menu_result = {
        ...obj,
        version: Date.now(),
      };
      //  如果 有   走 自然的 中间菜单组件渲染 ，
      this.compute_mid_match_list_menu_component_show();
    } else {
      // 如果没有  需要逻辑分流计算 列表请求参数
      //     设置 请求  列表结构  API 参数的   值  当中间 没有菜单的时候
      let { mid_menu_refer_params } = obj;
      delete obj.mid_menu_refer_params;
      if(mid_menu_refer_params && Object.keys(mid_menu_refer_params).length) {
        this.set_match_list_api_config(mid_menu_refer_params);
      }
      //  如果没有  需要逻辑分流计算 列表请求参数
      this.left_menu_result = {
        ...obj,
        version: Date.now(),
      };
    }
    console.error(
      "set_left_menu_result--------定义左侧菜单-----",
      JSON.stringify(this.left_menu_result)
    );
    if( [2,3] .includes(Number( obj.root))){
        // 角球
        if ([101210, 101310].includes(+obj.lv2_mi)) {
          this.set_mid_menu_result(obj)
        }else{
          this.mid_menu_result = {};
        }
    }

   // 菜单数据缓存
   this.set_local_1_500_count()

   // 设置全屏
   this.set_multi_column()

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
    this.menu_root_show_shoucang = obj.root
    // console.error(
    //   "set_mid_menu_result-------",
    //   JSON.stringify(this.mid_menu_result)
    // );
    // 设置全屏
   this.set_multi_column()
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
    return
    //TODO
    let config = {
        "jinri_zaopan": 2,
        "root": 2,
        "lv1_mi": 101,
        "lv2_mi": "101201",
        "sports": "common",
        "guanjun": "",
        "mid_menu_show": {
            "list_filter_date": false
        },
        "has_mid_menu": false,
        "mid_menu_refer_params": {
            "begin_request": true,
            "is_collect": false,
            "route": "list",
            "root": 2,
            "sports": "common",
            "guanjun": "",
            "match_list": {
                "api_name": "post_league_list",
                "params": {
                    "cuid": "505555350036300025",
                    "selectionHour": null,
                    "sort": 1,
                    "apiType": 1,
                    "euid": "3020101",
                    "orpt": 0,
                    "pids": "1,4,2,17,19,18"
                }
            },
            "version": 1685616769421,
            "bymids": {
                "api_name": "",
                "api_type": "",
                "params": {}
            }
        }
    }
    this.menu_config.set_left_menu_result(config);
  }

  // 获取数据缓存 ，用于刷新
  get_new_data(){
    // 获取菜单数据缓存
    let session_info = sessionStorage.getItem('is_session_menu_data') 
    if(! session_info ){
      return
    }
    const session_menu_data = JSON.parse(session_info);
   //  console.warn('session_menu_data', session_menu_data);

    // 获取热门和滚球的数量缓存
    const local_1_500_count = JSON.parse(sessionStorage.getItem('local_1_500_count'));
    this.menu_root_count = local_1_500_count

    if(Object.keys(session_menu_data).length){
      const {left_menu_result,menu_root_count,mid_menu_result} = session_menu_data

      this.menu_root_count = menu_root_count

      // 重置版本 随便输入
      this.set_api_config_version('222222')

      // 设置左侧菜单
      this.set_left_menu_result(left_menu_result);

      // 设置中间件
      this.set_mid_menu_result(mid_menu_result)

      // this.set_match_list_api_config(match_list_api_config);
    }
  }

  // 设置 热门和滚球的数量 存在localStorage
  set_local_1_500_count(){
    // 菜单数据缓存
    sessionStorage.setItem('is_session_menu_data',JSON.stringify(menu_config));
    // 滚球热门数据 存local
    localStorage.setItem('local_1_500_count', this.compute_menu_root_cont())
  }
  // 设置投注类别

  /**
   * @Description 设置投注类型
   * @param {undefined} undefined
   */
  set_bet_category() {
    let type;
    if (this.is_virtual_sport()) {
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
   * @description 判断是电竞
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  is_esports() {
    // this.$utils.is_eports_csid(this.$route.params.csid)
    return (
      this.menu_root == 2000 ||
      (this.match_list_api_config || {}).sports == "dianjing"
    );
  }
  /**
   * @description 判断是虚拟体育
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  is_virtual_sport() {
    return (
      this.menu_root == 300 ||
      (this.match_list_api_config || {}).sports == "vr"
    );
  }
  is_esports_champion() {
    return (
      (this.match_list_api_config || {}).guanjun == "dianjing-guanjun"
    );
  }

  // is_multi_column(){
  //   return   this.match_list_api_config.is_multi_column ||false
  // }
  // type 临时处理方案 type 1常规竞猜
 // 判断是不是足球
  // 今日 早盘 热门赛事 滚球 
  // 冠军 vr不处理
  set_multi_column() {
    let is_multi_column = false
    if([400,300].includes(Number(this.menu_root))){
      is_multi_column = false
    }else{
      const { lv2_mi } = this.left_menu_result
      // 只有“让球和大小”菜单 展示【 收起 】按钮。其他二级菜单不展示
      if([2,3].includes(Number(this.menu_root)) && ['101201','101301'].includes(lv2_mi)){
        const { lv1_mi,guanjun } = this.left_menu_result
        if(lv1_mi == 101 && guanjun != 'common-guanjun'){
          is_multi_column = true
        }
      }
      if( 1 == this.menu_root ){
        const { mif,mi } = this.mid_menu_result
        if(mif == 101 || mi == 1011){
          is_multi_column = true
        }
      }
      if(500 == this.menu_root){
        is_multi_column = this.hot_500_sport_1;
        const { mi } = this.mid_menu_result
        // 判断是全部和竞足，则不需要显示 展开/收起 按钮
        if ([50199,50101].includes(Number(mi))){
          is_multi_column = false;
        }
      }
    }
      //页面宽度
    let inner_width = state.configReducer.config.inner_width 

    if(inner_width < 1440){
      is_multi_column = false
    }

    this.is_multi_column = is_multi_column && !utils.is_iframe && state.configReducer.config.multi_column

    // store.dispatch("set_unfold_multi_column", this.is_multi_column);

    // console.warn('this.is_multi_column ',this.is_multi_column )
  
  } 
  /**
   * 获取 当前 左侧菜单赛种的 名字
   */
  get_current_left_menu_name() {
    let mi = this.left_menu_result.lv1_mi;
    let str = base_data_instance.menus_i18n_map[mi] || mi;
    return str;
  }
  /**
   * 计算当前菜单 是否显示 收藏按钮
   */
  compute_if_can_show_shoucang() {
    // VR体育,电子竞技不显示收藏
    return this.menu_root_show_shoucang != 300 && this.menu_root_show_shoucang != 2000 ;
  }
  /**
   * 计算当前菜单 是否显示  联赛过滤
   */
  compute_if_can_show_league_fliter() {
    let state = !menu_config.is_esports() && !menu_config.is_virtual_sport()
    // vx_layout_list_type!='collect' && !is_search_page &&!menu_config.is_esports() && !menu_data.is_virtual_sport && !is_show_hot && get_global_switch.filter_switch
    return state;
  }
  /**
   * 列表排序按钮
   * @returns
   */
  compute_if_can_show_sort() {
    ////  console.warn("冠军 ",menu_config.is_guanjun() )
    ////  console.warn("电子竞技 ",menu_config.is_esports() )
    ////  console.warn("vr ",menu_config.is_virtual_sport() )
    let state =  !menu_config.is_esports() && !menu_config.is_virtual_sport()
    // !is_search_page && !menu_config.is_esports() && !menu_data.is_virtual_sport && !is_show_hot &&!vx_show_filter_popup
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
      this.match_list_api_config.match_list.params.tid = arr.join(',')
    }
    this.match_list_api_config.version = Date.now();
  }
  /**
   * 定义  设置 请求  列表结构  API 参数的   值
   */
  set_match_list_api_config(config) {
    
    let match_list_api_config = JSON.parse(JSON.stringify(config));
    match_list_api_config.version = Date.now();
    console.error(
      "set_match_list_api_config-------列表结构AP参数的------",
      JSON.stringify(match_list_api_config)
    );


    //  //菜单切换是筛选数据置空
    // store.dispatch("set_filter_select_obj", []);
    this.match_list_api_config = match_list_api_config;

    // 更新列表数据类型
    this.set_match_list_api_type(config)

    //当前 列表的  体育标签
    this.match_list_sports_label = match_list_api_config.sports;
    // 设置 vuex   cur_menu_type
    this.set_vuex_cur_menu_type({
      type_name: this.convert_mi_to_label(this.menu_root),
    });

    // 设置投注类别
    this.set_bet_category();

    // 菜单数据缓存
    this.set_local_1_500_count()
   
  }

  /**
   * 设置 vuex   cur_menu_type  lable 转换
   * @param {*} mi
   * @returns
   */
  convert_mi_to_label(mi) {
    let str = "";

    let obj = {
      1: "play",
     500: "hot",
      300: "virtual_sport",
      400: "winner_top",
      2: "today",
      3: "early",
    };
    str = obj[mi];
    return str;
  }
  /**
   * 设置 vuex   cur_menu_type
   */
  set_vuex_cur_menu_type(obj) {
    // store.dispatch("set_cur_menu_type", obj);
  }

  /**
   * @Description  是否角球玩法菜单
   * @param {boolean}
   */
  is_corner_menu() {
    // console.log(2222222,this.mid_menu_result)
    return [101210, 101310].includes(+this.mid_menu_result.lv2_mi);
  }
  /**
   * 强制更新 菜单的版本号 ， 会重新计算
   *
   * 更新菜单整体视图
   *
   * $menu_config.update_menu_version()
   */
  update_menu_version() {
    base_data_instance.menu_version = Date.now();
  }
  /**
   * 获取当前的列表的默认的 模板配置
   */
  get_match_tpl_number() {
    let { match_list } = this.match_list_api_config;
    let r =  (match_list.params ||{}) .orpt ||0  ;
    // 电竞常规赛事
    if(this.is_esports()){
      r = 'esports';
        
    }
  //搜索13列玩法
  if(this.is_multi_column && state.configReducer.config.multi_column){
    r = 13
  }
    // console.error( 'get_match_tpl_number----------get_match_tpl_number----',r );

    return r ||0
  }

  is_guanjun() {
    return (this.match_list_api_config.guanjun || '').includes("guanjun");
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
    base_data_instance.init_mew_menu_list();
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
   * @Description  调用菜单接口 获取菜单数据
   * @param {boolean} is_ws_call 是否ws调用
   * @param {undefined} undefined
   */
  api_get_menu_data(is_ws_call) {}
  compute_play_all_menu_count() {}
  set_play_sport_count() {}
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

  static cl_1() {
    // console.error("cl_1");
  }
}
const menu_config = new menu_config_class();

export default menu_config;
