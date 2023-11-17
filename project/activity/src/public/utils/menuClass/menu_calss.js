/*
 * @Author: Cable
 * @Date: 2021-08-04 17:13:55
 * @Description: 主菜单操作工具对象类
 */

/**
 * 菜单所有方法 索引
 * 
 * 构造函数  定义菜单所需的变量
 * constructor
 * 
 * 获取菜单数据  类似初始化 仅在main_layout调用一次  读取本地菜单数据的同时  调用菜单接口更新数据
 * get_menu_data
 * 
 * 调用菜单接口 获取菜单数据
 * api_get_menu_data
 * 
 * 初始化菜单数据
 * init_menu_data
 * 
 * 初始化菜单数据完成后 初始化选中菜单  
 * init_select_menu
 * 
 * 合并今日、早盘、串关 球种菜单列表
 * merge_sport_menu_list
 * 
 * 过滤重复菜单 
 * filter_verify_menu
 * 
 * 设置自定义的 当前  菜单 key  
 * set_match_list_data_key
 * 
 * 设置列表请求接口参数 菜单改变时 或者 切换收藏 或者进入详情页热门赛事 时调用
 * set_match_list_api_params
 *
 * 设置当前菜单类型到vuex 兼容老版本代码  一级菜单改变时调用
 * set_cur_menu_type
 * 
 * 设置当前列表模板编号 请求列表接口时调用
 * set_match_tpl_number
 * 
 * 所有菜单切换入口
 * menu_change
 * 
 * 一级菜单切换  只能在所有菜单切换入口调用
 * level1_menu_change
 * 
 * 二级菜单切换  只能在所有菜单切换入口调用
 * level2_menu_change
 * 
 * 三级菜单切换  只能在所有菜单切换入口调用
 * level3_menu_change
 * 
 * 四级菜单切换  只能在所有菜单切换入口调用
 * level4_menu_change
 * 
 * 自动选择今日、早盘、串关 玩法数量大于0的菜单ID
 * auto_select_today_early_bet_menu_id
 * 
 * 反回一个列表中 数量大于0的菜单ID
 * auto_select_menu_id_by_list
 * 
 * 请求早盘、串关日期菜单接口 更新日期菜单
 * api_get_date_menu
 * 
 * 请求接口 获取虚拟体育联赛菜单
 * api_get_virtual_league_menu
 * 
 * 请求菜单数量接口 更新菜单数量
 * api_get_menu_count
 * 
 * 获取有数量的菜单  
 * get_have_num_menu
 * 
 * ws推送更新菜单
 * ws_update_menu
 * 
 * 菜单数量改变之后 检查当前菜单数量是否为0  为0自动切换菜单
 * check_menu_count
 * 
 * 计算滚球全部菜单数量
 * compute_play_all_menu_count
 * 
 * 是否角球玩法菜单
 * is_corner_menu
 * 
 * 是否电竞菜单
 * is_esports_menu
 * 
 * 根据菜单ID 获取一个菜单对象
 * get_menu_obj_by_menu_id
 * 
 *  设置是否支持展示多列菜单
 *  set_multi_column
 * 
 */

import { api_common } from "project/activity/src/public/api/index.js";
import { menu_type_to_menu_name, menu_name_arr, menu_obj_template,  NEW_PITCHES_IDS } from "project/activity/src/public/utils/menuClass/menu_config.js"
import store from "../../store/index.js"
import utils from "project/activity/src/public/utils/utils.js"
import menuData from "project/activity/src/public/utils/menuClass/menu.json"; // 本地配置的菜单json数据，初始化时没有缓存数据的时候，会读取该配置

class MenuClass {
  /**
   * @Description 构造函数 
   * @param {undefined} undefined
  */
  constructor() {
    // 菜单数据
    this.menu_data = {
      // 菜单是否已初始化
      is_init: false,
      // 自定义的 当前  菜单 key ，用来标识列表 数据 所在页面
      match_list_data_key: '',
      // 当前一级菜单
      cur_level1_menu:'',
      // 上次一级菜单
      pre_level1_menu:'',
      // 当前二级菜单
      cur_level2_menu:'',
      // 当前三级菜单
      cur_level3_menu:'',
      // 当前四级菜单
      cur_level4_menu:'',
      // 当前列表模板编号
      match_tpl_number: -1,
      // 今日、早盘、串关 玩法菜单是否展开
      is_show_play: false,
      // 列表顶部球种菜单
      top_sport_menu_list: [],
      // 早盘、串关顶部日期菜单
      top_date_menu_list: [],
      // 虚拟体育赛种列表
      virtual_sport_list:[],
      // 虚拟体育联赛列表
      virtual_league_list: [],
      virtual_league_list_key:0,
      // 是否已请求过虚拟体育菜单
      is_api_get_virtual_menu: false,
      // 当前菜单是否虚拟体育
      is_virtual_sport: false,
      // 当前菜单是否电竞
      is_esports: false,
      // 当前菜单是否电竞冠军
      is_esports_champion: false,
      //是否可以多列玩法的菜单
      is_multi_column:false,
      // 当前菜单是否冠军
      is_winner_champion:false,
    }
    // 菜单ID到菜单的映射对象
    this.menu_obj = {}
    // 列表接口请求参数
    this.match_list_api_params = {}
    // 列表请求的接口名称
    this.match_list_api_name = ''
    // 列表接口数据类型  league_list: 联赛列表，    match_list: 赛事列表
    this.match_list_api_type = ''
    // 今日、早盘、串关 球种菜单列表
    this.sport_menu_list = []

    // 总数量：今日+早盘+VR写死295（不去重）
    this.sport_menu_count = 295
    // 今日 早盘 数量存储 ws只会推送有变化的值 需要记录上一次变化
    this.today_early_count = {
      today: 0,
      early: 0,
    }
  }
  /**
   * @Description 获取菜单数据  类似初始化 仅在main_layout调用一次  读取本地菜单数据的同时  调用菜单接口更新数据 
   * @param {undefined} undefined
  */
  get_menu_data(){
    // 获取本地菜单数据
    let menu_json = localStorage.getItem('api_menu_list')  
    // 为了快速显示界面内容，先读取本地缓存，没有的话再读取配置数据。然后再同时请求菜单接口，获取最新的数据  
    let list = menu_json ? JSON.parse(menu_json) : menuData
    this.init_menu_data(list)  
    this.api_get_menu_data()
  }
  /**
   * @Description  调用菜单接口 获取菜单数据
   * @param {boolean} is_ws_call 是否ws调用
   * @param {undefined} undefined
  */
  api_get_menu_data(is_ws_call){
    let params = {
      sys: 4,
      disabled: 3,
      lang: 'JC'
    };
    // 拉取菜单数据
    let obj_ = {
      // axios api对象
      axios_api:api_common.get_menu_init,
      // axios api对象参数
      params:params,
      // axios中then回调方法
      fun_then: res => {
        let menu_list = _.get(res,'data.data') || []
        // 初始化菜单数据
        this.init_menu_data(menu_list,is_ws_call)
         // 保存数据到本地
        if(menu_list.length > 0){
          localStorage.setItem('api_menu_list',JSON.stringify(menu_list))
          // 计算滚球和热门的全部菜单数量
          this.compute_play_all_menu_count()
        }
        // ws调用的化，今日，早盘，串关更新子菜单数量
        if(is_ws_call && ['today','early','bet'].includes(this.menu_data.cur_level1_menu)){
          this.api_get_menu_count(this.menu_data.cur_level2_menu)
        }
      },
      // axios中catch回调方法
      fun_catch: err => {},
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop:3,
      // 异常调用时延时时间,毫秒数,默认1000
      timers:1000
    }
    // axios_api轮询调用方法
    if(window.vue){
      window.vue.$utils.axios_api_loop(obj_);
    }
  }
  /**
   * @Description 初始化菜单数据 
   * @param {undefined} undefined
  */
  init_menu_data(menu_list,is_ws_call){
    if(is_ws_call && _.get(menu_list,'length',0) === 0) return
    // 菜单ID到菜单的映射对象 
    let menu_obj = {},sport_menu_count = 295
    // 合并默认配置的菜单数据
    _.merge(menu_obj, menu_obj_template)
    // 根据商户判断  是否过滤篮球菜单
    // let is_filter_csid2 = store.getters.get_user.mId == '1443742662615240704'
    menu_list.forEach( menu1 => {
      //虚拟体育新加赛种显示 new
      if(menu1.menuType ===900){
        menu1.coppertone = 0
      }
      menu1.menu_name = menu_type_to_menu_name['menu_type_'+menu1.menuType]
      // 设置一级菜单menu_obj
      if(menu_name_arr.includes(menu1.menu_name)){
        menu_obj[menu1.menu_name] = menu1
      }
      menu_obj['menu_id_'+menu1.menuId] = menu1
    
      // 遍历子菜单
      _.each(menu1.subList, menu2 => {
        menu2.menu_name = menu_type_to_menu_name['menu_type_'+menu2.menuType]
        // 设置二级菜单menu_obj
        if(menu_name_arr.includes(menu2.menu_name)){
          menu_obj[menu2.menu_name] = menu2
        }
        menu_obj['menu_id_'+menu2.menuId] = menu2

        // 遍历子菜单
        _.each(menu2.subList, menu3 => {
          // // 政治加后缀
          // if(menu3.menuType == 30){
          //   menu3.menuName = window.vue.$root.$t('common.ent_wog')
          // }
          // 电竞
          if(menu3.menuType == 3000){
            menu_obj.esports = menu3
          }

          // 设置三级菜单menu_obj
          menu_obj['menu_id_'+menu3.menuId] = menu3

          // 遍历子菜单
          _.each(menu3.subList, menu4 => {
            //球种挂载新上标识
            menu4.coppertone = NEW_PITCHES_IDS.includes(+menu4.field1) ? 1 : 0
           
            // 设置四级菜单menu_obj
            menu_obj['menu_id_'+menu4.menuId] = menu4
          })          
        })
        // 总数量：今日+早盘+VR写死295（不去重）
        if([30201,30202].includes(Number(menu2.menuId))){
          sport_menu_count += menu2.count
          // 存储今日数量
          if(menu2.menuId == 30201){
            this.today_early_count.today = menu2.count
          }
          // 存储 早盘数量
          if(menu2.menuId == 30202){
            this.today_early_count.early = menu2.count
          }
        }
        // 菜单数量更新 没更新到使用上一次的数据
        this.sport_menu_count = sport_menu_count == 295 ? this.sport_menu_count : sport_menu_count
  
        // 过滤篮球菜单
        // if(is_filter_csid2){
        //   _.remove(menu2.subList, item => item.field1 == 2)
        // }
      })

      // 遍历顶部菜单
      _.each(menu1.topMenuList, top_menu_item => {
        // // 政治加后缀
        // if(18 == top_menu_item.field1){
        //   top_menu_item.menuName = window.vue.$root.$t('common.ent_wog')
        // }
        // 滚球顶部菜单挂载新上标识
        top_menu_item.coppertone =  NEW_PITCHES_IDS.includes(+top_menu_item.field1) ? 1 : 0
        
        menu_obj['menu_id_'+top_menu_item.menuId] = top_menu_item
      })
      // 过滤篮球菜单
      // if(is_filter_csid2){
      //   _.remove(menu1.topMenuList, item => item.field1 == 2)
      // }
    })

    // 屏蔽串关菜单
    _.remove(menu_obj.sport_menu.subList, item => item.menu_name == 'bet')
  
    // ws调用 清空旧的热门赛事顶部菜单数量
    if(is_ws_call){
      this.menu_obj.hot.topMenuList.forEach( item => {
        let top_menu = this.get_menu_obj_by_menu_id(item.menuId)
        top_menu.count = 0
      })
    }
    // 解决今日电竞菜单重复
    // if(this.menu_obj.menu_id_3020125){
    //   this.menu_obj.menu_id_3020125.subList.length = 1
    // }
    // // 解决早盘电竞菜单重复
    // if(this.menu_obj.menu_id_3020225){
    //   this.menu_obj.menu_id_3020225.subList.length = 1
    // }
    _.merge(this.menu_obj,menu_obj)
    // 设置一级菜单对象地址引用
    menu_name_arr.forEach( menu_name => {
      let menu_id = this.menu_obj[menu_name].menuId
      if(menu_id){
        this.menu_obj[menu_name] = this.menu_obj['menu_id_'+menu_id]
      }
    })
    // 设置虚拟体育菜单数量
    this.menu_obj.virtual_sport.count = 1
    // 非ws调用  设置菜单初始化选中
    if(!is_ws_call){
      this.init_select_menu()
    }else{
      // 重新设置热门赛事顶部菜单列表
      this.menu_obj.hot.topMenuList = menu_obj.hot.topMenuList
      if(this.menu_data.cur_level1_menu == 'hot'){
      }
      // 检查当前菜单数量 是否为0
      this.check_menu_count()
    }

    this.menu_data.is_init = true
    window.vue.$root.$emit('menu_init_done')
  }
  /**
   * @Description  初始化菜单数据完成后 初始化选中菜单  
   * @param {undefined} undefined
  */
  init_select_menu(){
    // 自定义的 当前  菜单 key ，用来标识列表 数据 所在页面
    let match_list_data_key = sessionStorage.getItem('match_list_data_key') || '0,0,0,0'
    // 当前各级菜单
    let [cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu ] = match_list_data_key.split(',')
    cur_level4_menu = 0

    // 首次进入页面 默认选中今日-足球-让球与大小
    if(cur_level1_menu == 0){
      cur_level1_menu = 'today'
      cur_level2_menu = 3020101
      cur_level3_menu = 302010101
    }
    // 一级菜单对象
    let level1_menu_obj = this.menu_obj[cur_level1_menu]
    // 二级菜单对象
    let level2_menu_obj = this.get_menu_obj_by_menu_id(cur_level2_menu)

    let sport_menu_list
    // 今日、早盘、串关
    if(['today','early','bet'].includes(cur_level1_menu)){
      sport_menu_list = level1_menu_obj.subList
      // 请求菜单数量接口，更新菜单数量 
      this.api_get_menu_count(cur_level2_menu)
    }else{
      sport_menu_list = this.menu_obj.today.subList
    }
    // 合并今日、早盘、串关 球种菜单列表
   this.sport_menu_list = sport_menu_list 

    // 滚球 热门 冠军赛事
    if(['play','hot','winner_top'].includes(cur_level1_menu)){
      // 设置顶部球种菜单
      this.set_menu_obj_list(level1_menu_obj,'top_sport_menu_list','topMenuList')
    }
    // 虚拟体育
    else if(cur_level1_menu == 'virtual_sport'){
      // 获取虚拟体育联赛菜单
      this.api_get_virtual_league_menu(true)
      return
    }
    // 设置是否电竞
    this.menu_data.is_esports = this.is_esports_menu(cur_level2_menu)
    // 设置是否电竞冠军
    this.menu_data.is_esports_champion = false
    // 设置是否虚拟体育
    this.menu_data.is_virtual_sport = cur_level1_menu == 'virtual_sport' || utils.is_virtual_csid(level2_menu_obj.field1)

    // 滚球虚拟体育 设置虚拟体育联赛列表
    if(cur_level1_menu == 'play' && this.menu_data.is_virtual_sport){ 
      this.set_menu_obj_list(level2_menu_obj,'virtual_league_list','subList')
      cur_level3_menu = +cur_level3_menu
    }

    // 如果是电竞 并且不是滚球 热门赛事 设置列表顶部球种菜单
    if(this.menu_data.is_esports && !['play','hot'].includes(cur_level1_menu)){
      this.set_menu_obj_list(level2_menu_obj,'top_sport_menu_list','subList')
    }

    // 设置上次一级菜单
    this.menu_data.pre_level1_menu = ''
    // 设置自定义的 当前  菜单 key  
    this.set_match_list_data_key({cur_level1_menu,cur_level2_menu,cur_level3_menu,cur_level4_menu})
    // 设置当前菜单类型到vuex 兼容老版本代码  一级菜单改变时调用
    this.set_cur_menu_type()
    // 请求早盘、串关日期菜单接口 更新日期菜单
    this.api_get_date_menu()
  }
   /**
   * @Description  设置子菜单 
   * @param {Object} data 当前菜单数据
   * @param {String} source_key 要设置的 菜单
   * @param {String} key 子菜单属性名 (topMenuList subList ) 
  */
  set_menu_obj_list(data,source_key,key){
     let new_arr = this.filter_verify_menu(data[key]) 
     data[key] = new_arr
     this.menu_data[source_key] = new_arr
  }
  /**
   * @Description  过滤重复菜单 
   * @param {undefined} undefined
  */
 filter_verify_menu(menu_list){
  let cur_menu_list = []
    _.each(menu_list,menu=>{
        if(!cur_menu_list.some(item=> item.menuId == menu.menuId)){
          cur_menu_list.push(menu)
        } 
    })
    return cur_menu_list
 }
  /**
   * @Description  设置自定义的 当前  菜单 key  
   * @param {undefined} undefined
  */
  set_match_list_data_key(obj){
    Object.assign(this.menu_data,obj)
    let match_list_data_key = `${obj.cur_level1_menu},${obj.cur_level2_menu},${obj.cur_level3_menu},${obj.cur_level4_menu}`
    if(match_list_data_key!=this.menu_data.match_list_data_key && window.vue){
      // 设置即将开赛筛选默认值为全部
      window.vue.$store.state.filter.open_select_time = null;
    }
    this.menu_data.match_list_data_key = match_list_data_key
    sessionStorage.setItem('match_list_data_key',match_list_data_key)
    this.set_multi_column()
  }
  /**
   * @Description  设置列表请求接口参数 请求列表接口时调用
   * @param {undefined} undefined
  */
  set_match_list_api_params(is_hot){
    let params = this.get_match_list_api_params(is_hot)
    this.match_list_api_name = params.match_list_api_name
    this.match_list_api_type = params.match_list_api_type
    delete params.match_list_api_name
    delete params.match_list_api_type
    this.match_list_api_params = params
  } 
  /**
   * @Description  获取列表请求接口参数
   * @param {undefined} undefined
  */
  get_match_list_api_params(is_hot){
    let { cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu, } = this.menu_data
    let orpt = this.get_match_tpl_number(is_hot)
    // 是否收藏
    let is_collect = store.getters.get_layout_list_type == 'collect'

    let params = {
      // 接口类型 1非收藏  2收藏
      apiType: is_collect ? 2 : 1,
      // 用户ID
      cuid: store.getters.get_uid,
      // 菜单ID
      euid: cur_level2_menu,
      // 设置当前列表模板编号
      orpt,
      // 玩法ID
      pids: this.get_menu_obj_by_menu_id(cur_level3_menu).field1,
      // 列表排序类型
      sort: store.getters.get_match_sort,
      // 联赛筛选
      tid: store.getters.get_filter_select_obj.join(","),
      //即将开赛筛选
      selectionHour: store.state.filter.open_select_time,
    }
  if( cur_level1_menu == 'hot' && cur_level2_menu == "30101") {
    params.pids = -999
  }
    // 列表请求的接口名称
    let match_list_api_name 
    // 列表接口数据类型
    let match_list_api_type 

    // 详情页热门赛事 或者列表强力推荐
    if(window.vue.$route.name == 'details' || is_hot){
      //详情电竞强力推荐
      if(this.menu_data.is_esports  || utils.is_eports_csid(+window.vue.$route.params.csid)){
        match_list_api_name = 'get_fetch_highly_esports_matchs'
        match_list_api_type = 'match_list'
        params.csid = window.vue.$route.params.csid
        delete params.apiType
        delete params.euid
        delete params.orpt
        delete params.pids
        delete params.sort
        delete params.tid
        params.isHot = 1
      }else{
        match_list_api_name = 'post_fetch_match_list'
        match_list_api_type = 'match_list'
        params.euid = '30199'
        params.orpt = -1
        delete params.pids
      }
    }
    // 滚球电竞
    else if(cur_level1_menu == 'play' && this.menu_data.is_esports){
      match_list_api_name = 'post_fetch_esports_play_matchs'
      match_list_api_type = 'match_list'
      params.category = 1
      params.csid = this.get_menu_obj_by_menu_id(cur_level2_menu).field1
      params.isLive = 1
      delete params.apiType
      delete params.euid
      delete params.orpt
      delete params.pids
    }
    // 电竞
    else if(this.menu_data.is_esports){
      let {field1} = this.get_menu_obj_by_menu_id(cur_level3_menu)
      match_list_api_name = 'post_fetch_esports_matchs'
      match_list_api_type = 'league_list'
      params.category = orpt == 18 ? 2 :1
      params.csid = field1
      if(cur_level1_menu == 'hot'){
        let {field1,field2} = this.get_menu_obj_by_menu_id(cur_level2_menu)
        params.csid = field1
        params.tid = field2
      }
      delete params.apiType
      delete params.euid
      delete params.orpt
      delete params.pids
    }
    // 虚拟体育
    else if(this.menu_data.is_virtual_sport){
      match_list_api_name = 'post_fetch_virtual_matchs'
      match_list_api_type = 'match_list'
      params.csid = cur_level2_menu
      let league_menu = this.menu_data.virtual_league_list[cur_level3_menu] || {field1:0}
      params.tid = league_menu.field1
      if(cur_level1_menu == 'play'){
        params.csid = this.get_menu_obj_by_menu_id(cur_level2_menu).field1
        //虚拟篮球不需要传 isLive
        if( 1004 != params.csid) {
          params.isLive = 1
        }
      }
      
      delete params.apiType
      delete params.cuid
      delete params.euid
      delete params.orpt
      delete params.pids
      delete params.sort
    }
    // 滚球 热门赛事
    else if(['play','hot'].includes(cur_level1_menu)){
      match_list_api_name = 'post_fetch_match_list'
      match_list_api_type = 'match_list'
      // 滚球 全部菜单
      if(cur_level2_menu == 30001){
        let euid = []
        // 设置euid 为所有球种数量不为0的菜单
        this.menu_data.top_sport_menu_list.forEach( item => {
          if(this.get_menu_obj_by_menu_id(item.menuId).count > 0){
            euid.push(item.menuId)
          }
        })
        params.euid = euid.join(',')
      }
    }
    // 冠军聚合页
    else if(cur_level1_menu == 'winner_top'){
      match_list_api_name = 'post_champion_list'
      match_list_api_type = 'match_list'
      // 添加球种参数
      let top_menu = this.get_menu_obj_by_menu_id(cur_level2_menu)
      params.sportId = top_menu.field1 == 0 ? "" : top_menu.field1
      delete params.euid
      delete params.apiType
    }
    // 冠军模板
    else if(orpt == 18){
      match_list_api_name = 'post_league_list'
      match_list_api_type = 'match_list'
    }
    // 今日、早盘、串关
    else if(['today','early','bet'].includes(cur_level1_menu)){
      match_list_api_name = 'post_league_list'
      match_list_api_type = 'league_list'
    } 
    // 早盘、串关 、电竞添加日期参数 
    if((['early','bet'].includes(cur_level1_menu) || this.menu_data.is_esports) && window.vue.$route.name != 'details'){
      // 所有日期 或者电竞冠军  传空时间
      if(cur_level4_menu == 0 || this.menu_data.is_esports_champion){
        params.md = ''
      }else{
        let date_menu = this.menu_data.top_date_menu_list[cur_level4_menu] || {field1:''}
        params.md = date_menu.field1 
      }
    }

    // 收藏请求参数处理
    if (is_collect) {
      match_list_api_name = 'post_fetch_collect_list'
      match_list_api_type = 'match_list'
      delete params.tid 
      // 现场滚球
      if (cur_level1_menu == 'play') {
        if(cur_level2_menu == 30001) {
          let euid = []
          // 添加所有数量大于0 并且不是电竞 虚拟体育的菜单
          this.menu_data.top_sport_menu_list.forEach( item => {
            if(item.count > 0 && !this.is_esports_menu(item.menuId) && !utils.is_virtual_csid(item.field1)){
              euid.push(item.menuId)
            }
          })
          params.euid =euid.join(',')
        }else{
          params.euid = cur_level2_menu
        }
      } 
      // 冠军聚合页
      else if (cur_level1_menu == 'winner_top') {
        params.outrightMatches = 1
        //冠军收藏不需要传球种id
        // params.sportId = ""
      }
      // 热门赛事
      else if (cur_level2_menu == 30199){ 
        params.hotMatches = 1
      } 
      // 电竞
      else if (this.menu_data.is_esports){
        match_list_api_name = 'post_collect_list_es'
        match_list_api_type = 'match_list'
        params.collect = 1
      }
    } 
    params.match_list_api_name = match_list_api_name
    params.match_list_api_type = match_list_api_type
    return params
  } 
  /**
   * @Description 设置当前菜单类型到vuex 兼容老版本代码  一级菜单改变时调用 
   * @param {undefined} undefined
  */
  set_cur_menu_type(){
    // 保存当前类型到vue  兼容以前的代码
    let obj = {
      type_name: this.menu_data.cur_level1_menu,
      pre_name: this.menu_data.pre_level1_menu
    }
    store.dispatch('set_cur_menu_type', obj)
  }
  /**
   * @Description 设置当前列表模板编号 请求列表接口时调用 
   * @param {undefined} undefined
  */
  set_match_tpl_number(is_hot){
    this.menu_data.match_tpl_number = this.get_match_tpl_number(is_hot)
  }
  /**
   * @Description 获取当前列表模板编号  
   * @param {undefined} undefined
  */
  get_match_tpl_number(is_hot){
    let match_tpl_number = -1
    // 玩法菜单
    let play_menu = this.get_menu_obj_by_menu_id(this.menu_data.cur_level3_menu)

    // 详情页热门赛事 或者 搜索 或者列表强力推荐
    if(window.vue.$route.name == 'details' || window.vue.$route.name == 'search' || is_hot){
      match_tpl_number = -1
      //搜索13列玩法
      if(_.get(vue,'$route.query.csid',-1) === '1' && this.menu_data.is_multi_column && store.getters.get_unfold_multi_column){
        match_tpl_number = 13
      }
    }
    // 竟足赛事 12模板
    else if(this.menu_data.cur_level2_menu == 30101){
      match_tpl_number = 12
    }
    // 冠军聚合页  或者电竞冠军 18模板 
    else if(this.menu_data.cur_level1_menu == 'winner_top' || this.menu_data.is_esports_champion){
      match_tpl_number = 18
    }
    // 电竞常规赛事
    else if(this.menu_data.is_esports){
      match_tpl_number = 'esports'
        
    }
    //13列玩法菜单
    else if(this.menu_data.is_multi_column && store.getters.get_unfold_multi_column && store.getters.get_layout_cur_page.cur == 'home'){
      match_tpl_number = 13
    }
    // 取玩法菜单
    else if(play_menu.field2 == 0 || play_menu.field2){
      match_tpl_number = play_menu.field2
    }
    return match_tpl_number
  }
  /**
   * @Description 所有菜单切换入口
   * @param {number} level_type 点击的菜单类型 
   * @param {number} menu_id 菜单ID
   * @param {undefined} undefined
  */
  menu_change(level_type,menu_id,click_type){
      // 点击 菜单应从收藏切换回列表
    if ([1,2,3].includes(level_type)) {
      store.dispatch('set_layout_list_type','match')
    }
    // 关闭联赛筛选
    store.dispatch('set_global_click')
    // 当前页面不在列表  跳转到列表
    if(window.vue.$route.name != 'home' && click_type != 'init'){
      window.vue.$router.push('/home')
    }
    // 当前菜单已选中 
    if(menu_id == this.menu_data[`cur_level${level_type}_menu`] && click_type != 'init'){
      // 今日、早盘、串关 二级菜单点击 或者虚拟体育一级菜单点击  设置玩法展开折叠
      if((click_type == 'today' && level_type == 2) || menu_id == 'virtual_sport'){
        this.menu_data.is_show_play = !this.menu_data.is_show_play
      }
      return
    }
    let cur_menu_obj
    switch(level_type){
      case 1:
        cur_menu_obj = this.level1_menu_change(menu_id)
        break
      case 2:
        cur_menu_obj = this.level2_menu_change(menu_id,click_type)
        break
      case 3:
        cur_menu_obj = this.level3_menu_change(menu_id)
        break
      case 4:
        cur_menu_obj = this.level4_menu_change(menu_id)
        break
    }
    if(!cur_menu_obj){
      return
    }
    // 诸葛埋点
    if (menu_id == 'virtual_sport' && click_type != 'init') {
      this.zhuge_trake(click_type)
    }
    let {cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu} = cur_menu_obj
    // 二级菜单对象
    let level2_menu_obj = this.get_menu_obj_by_menu_id(cur_level2_menu)
    // 一级菜单是否改变
    let is_change_level1_menu = this.menu_data.cur_level1_menu != cur_level1_menu

    // 设置是否电竞
    let is_esports = this.is_esports_menu(cur_level2_menu)
    // 设置是否电竞冠军
    let date_menu = this.menu_data.top_date_menu_list[cur_level4_menu] || {}
    this.menu_data.is_esports_champion = is_esports && level_type == 4 && date_menu.menuType == 100

    // 如果是非滚球电竞 并且二级菜单改变  设置列表顶部球种菜单
    if( !['play','hot'].includes(cur_level1_menu) && is_esports && cur_level2_menu != this.menu_data.cur_level2_menu){
      this.set_menu_obj_list(level2_menu_obj,'top_sport_menu_list','subList')
    }

    // 设置是否虚拟体育
    let is_virtual_sport = cur_level1_menu == 'virtual_sport' || utils.is_virtual_csid(level2_menu_obj.field1)

    // 设置上次一级菜单
    is_change_level1_menu && (this.menu_data.pre_level1_menu = this.menu_data.cur_level1_menu)

    // 合并数据
    Object.assign(this.menu_data,{is_esports, is_virtual_sport})

    // 设置自定义的 当前  菜单 key  
    this.set_match_list_data_key(cur_menu_obj)
    // 一级菜单改变
    if(is_change_level1_menu){
      // 合并今日、早盘、串关 球种菜单列表
      let menu_name = ['early','bet'].includes(cur_level1_menu) ? cur_level1_menu : 'today'
      this.sport_menu_list = _.get(this.menu_obj,`${menu_name}.subList`,[]) 
      // 一级菜单是热门  设置顶部球种菜单
      if(cur_level1_menu == 'hot'){
        this.set_menu_obj_list(this.menu_obj[cur_level1_menu],'top_sport_menu_list','topMenuList')
      }
      // 设置当前菜单类型到vuex 兼容老版本代码  
      this.set_cur_menu_type()
    }

    if(level_type != 4){
      // 请求早盘、串关日期菜单接口 更新日期菜单
      this.api_get_date_menu()
    }
  }
  /**
   * @Description 一级菜单切换  只能在所有菜单切换入口调用 
   * @param {number} menu_id 菜单ID
   * @param {undefined} undefined
  */
  level1_menu_change(cur_level1_menu){
    if(cur_level1_menu =='hot' && !store.getters.get_global_switch.hot_match_num){
      window.vue.$root.$emit(window.vue.emit_cmd.EMIT_SHOW_TOAST_CMD, window.vue.$root.$t("msg.msg_09"));
      return  false
    } 
    let menu_obj = this.menu_obj[cur_level1_menu]
    // 数量为0 显示提示弹窗
    if(menu_obj.count == 0){
      // 暂无赛事
      window.vue.$root.$emit(window.vue.emit_cmd.EMIT_SHOW_TOAST_CMD, window.vue.$root.$t("menu.no_match"));
      return false
    }
    let cur_level2_menu = 0
    let cur_level3_menu = 0

    // 滚球 热门赛事 冠军聚合页
    if(['play','hot','winner_top'].includes(cur_level1_menu)){
      // 反回一个列表中 数量大于0的菜单ID 
      cur_level2_menu = this.auto_select_menu_id_by_list(menu_obj.topMenuList,1)
      // 设置顶部球种菜单
      this.set_menu_obj_list(menu_obj,'top_sport_menu_list','topMenuList')
    }
    // 虚拟体育
    else if(cur_level1_menu == 'virtual_sport'){
      if(!this.menu_data.is_api_get_virtual_menu){
        // 请求接口 获取虚拟体育联赛菜单
        this.api_get_virtual_league_menu()
        return false
      }
      let match_list_data_key =
        sessionStorage.getItem("match_list_data_key") || "0,0,0,0";
      // 当前各级菜单
      let [level1_menu, level2_menu, level3_menu, level4_menu] =
        match_list_data_key.split(",");
      let v_index=0;
      // 根据持久化中的菜单数据,找到指定菜单数据索引
      for (let i = 0; i < this.menu_data.virtual_sport_list.length; i++) {
        if(_.get(this.menu_data,`virtual_sport_list[${i}].menuId`) == level2_menu){
          v_index=i;
          break;
        }
      }
      let sport_menu = this.menu_data.virtual_sport_list[v_index] || { menuId:0, subList:[] }
      // vr体育 清空选中的内容
      cur_level2_menu = cur_level1_menu == 'virtual_sport' ? sport_menu.menuId : level2_menu || sport_menu.menuId ;
      // 设置虚拟体育联赛列表
      this.menu_data.virtual_league_list = sport_menu.subList
      this.menu_data.virtual_league_list_key++
    } 
    // 今日、早盘、串关
    else if(['today','early','bet'].includes(cur_level1_menu)){
      // 当前二级菜单
      let level2_menu = this.get_menu_obj_by_menu_id(this.menu_data.cur_level2_menu)
      let {auto_level2_menu , auto_level3_menu} = this.auto_select_today_early_bet_menu_id(menu_obj.subList,level2_menu.field1)
      cur_level2_menu = auto_level2_menu
      cur_level3_menu = auto_level3_menu
    }
    // 虚拟体育菜单点击  展开玩法
    if(cur_level1_menu == 'virtual_sport'){
      this.menu_data.is_show_play = true
    }
    return {cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu:0}
  }
  /**
   * @Description 二级菜单切换  只能在所有菜单切换入口调用 
   * @param {number} cur_level2_menu 菜单ID
   * @param {undefined} undefined
  */
  level2_menu_change(cur_level2_menu,type){
    this.menu_data.is_show_play = true
    let menu_obj = this.get_menu_obj_by_menu_id(cur_level2_menu)
    let cur_level1_menu = this.menu_data.cur_level1_menu
    let cur_level3_menu = 0

    // 如果点击今日的球种 并且当前一级菜单 不在今日、早盘、串关 设置一级菜单为今日  或者点击的菜单为今日电竞 3020125
    if((type == 'today' && !['today','early','bet'].includes(cur_level1_menu)) || cur_level2_menu == 3020125){
      cur_level1_menu = 'today'
    }

    // 如果点击热门菜单 设置当前一级菜单为热门
    if(type == 'hot'){
      cur_level1_menu = 'hot'
      // 当前菜单数量为0 不跳转
      if(menu_obj.count == 0){
        return
      }
    }

    // 虚拟体育
    if(cur_level1_menu == 'virtual_sport'){
      let sport_menu = this.menu_data.virtual_sport_list.find( item => item.menuId == cur_level2_menu) || { subList:[] }
      // 设置虚拟体育联赛列表
      this.menu_data.virtual_league_list = sport_menu.subList
    }
    // 滚球虚拟体育 
    if(cur_level1_menu == 'play' && utils.is_virtual_csid(menu_obj.field1)){
      // 设置虚拟体育联赛列表
      this.menu_data.virtual_league_list = this.get_menu_obj_by_menu_id(cur_level2_menu).subList
    }
    // 今日、早盘、串关
    else if(['today','early','bet'].includes(cur_level1_menu)){
      // 自动选中菜单数量 不为0的菜单
      let level1_menu = this.menu_obj[cur_level1_menu]
      let { auto_level2_menu, auto_level3_menu ,sport_id} = this.auto_select_today_early_bet_menu_id(level1_menu.subList,menu_obj.field1)
      //选中球种菜单无数据，不切换菜单
      // if(sport_id != menu_obj.field1){
      //   cur_level2_menu = this.menu_data.cur_level2_menu
      //   cur_level3_menu = this.menu_data.cur_level3_menu
      // }else{
        cur_level2_menu = auto_level2_menu
        cur_level3_menu = auto_level3_menu
      // }
    }
    return {cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu:0}
  }
  /**
   * @Description 三级菜单切换  只能在所有菜单切换入口调用 
   * @param {number} cur_level3_menu 菜单ID
   * @param {undefined} undefined
  */
  level3_menu_change(cur_level3_menu){
    let {cur_level1_menu, cur_level2_menu} = this.menu_data
    return {cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu:0}
  }
  /**
   * @Description 四级菜单切换  只能在所有菜单切换入口调用 
   * @param {number} menu_id 菜单ID
   * @param {undefined} undefined
  */
  level4_menu_change(cur_level4_menu){
    let {cur_level1_menu, cur_level2_menu, cur_level3_menu} = this.menu_data
    return {cur_level1_menu, cur_level2_menu, cur_level3_menu, cur_level4_menu}
  }
  /**
   * 虚拟体育菜单埋点标记
   * @param {*} type 
   */
  zhuge_trake(type) {
    let label = '';
    if (type == 'nav') {
      label = "PC_导航_虚拟体育";
    } else {
      label = "PC_首页_虚拟体育";
    }
    utils.send_zhuge_event(label)

  }
  /**
   * @Description 自动选择今日、早盘、串关 玩法数量大于0的菜单ID 
   * @param {undefined} undefined
  */
  auto_select_today_early_bet_menu_id(sport_menu_list,sport_id = 0){
    for(let i = 0; i < sport_menu_list.length; i++){
      let sport_menu = this.get_menu_obj_by_menu_id(sport_menu_list[i].menuId)
      // 菜单数量不等于0
      if(sport_menu.count != 0 && (sport_id == 0 || sport_id == sport_menu.field1)){
        // 请求菜单数量接口 更新菜单数量 
        this.api_get_menu_count(sport_menu.menuId,2)
        for(let k = 0; k < sport_menu.subList.length; k++){
          let play_menu = this.get_menu_obj_by_menu_id(sport_menu.subList[k].menuId)
          // 如果菜单数量未同步过 或者 菜单数量大于0  设置选中
          if(!play_menu.is_sync_count || play_menu.count > 0){
            // 是否是冠军
            this.menu_data.is_winner_champion = play_menu.field2 == 18

            return {
              auto_level2_menu:sport_menu.menuId,
              auto_level3_menu:play_menu.menuId,
              sport_id
            }
          }
        }
      }
    }
    if(sport_id){
      return this.auto_select_today_early_bet_menu_id(sport_menu_list)
    }else{
      return {
        auto_level2_menu:0,
        auto_level3_menu:0,
        sport_id
      }
    }
  }
  /**
   * @Description 反回一个列表中 数量大于0的菜单ID 
   * @param {undefined} undefined
  */
  auto_select_menu_id_by_list(menu_list,type){
    //                 冠军全部  滚球全部   
    let all_menu_id = [30401,30001]
    for(let i = 0; i < menu_list.length; i++){
      let { menuId, count } = this.get_menu_obj_by_menu_id(menu_list[i].menuId)
      let status = false
      if(type && !store.getters.get_global_switch.play_all_show && all_menu_id.includes(+menuId)){
         status = true
      }
      if(count > 0 && !status){
        return menuId
      }
    }
    let menuId = _.get(menu_list,'0.menuId') 
    if(type == 1 && store.getters.get_global_switch.play_all_show){
      let { count } = this.get_menu_obj_by_menu_id(menuId)
      if(count > 0 ){
        return menuId
      }
    }
    return 0
  }
  /**
   * @Description  请求早盘、串关日期菜单接口 更新日期菜单
   * @param {undefined} undefined
  */
  api_get_date_menu(){
    // 早盘 串关 电竞 才有日期菜单
    if( !( ['early','bet'].includes(this.menu_data.cur_level1_menu) || (this.menu_data.is_esports && !['hot','play'].includes(this.menu_data.cur_level1_menu) ) ) ){
      return
    }

    let api, params ;
    // 电竞
    if(this.menu_data.is_esports){
      params = {
        csid: this.get_match_list_api_params().csid,
        device:'PC_PRO'
      }
      api = api_common.get_esports_date_menu
    }else{
      params = this.get_match_list_api_params()
      delete params.match_list_api_name
      delete params.match_list_api_type
      params.device = 'PC'
      params.md = ''
      params.tid = ''
      params.euid = this.menu_data.cur_level2_menu
      api = api_common.post_date_menu
    }
    // console.log('post_date_menu===', JSON.stringify(params));
       // 拉取菜单数据
       let obj_ = {
        // axios api对象
        axios_api:api,
        // axios api对象参数
        params,
        // axios中then回调方法
        fun_then: res => {
          const code = _.get(res, "data.code");
          //限频
          if(code == '0401038'){            
            return
          }
          this.menu_data.top_date_menu_list = _.get(res,'data.data',[]) || []
        },
        // axios中catch回调方法
        fun_catch: err => {
          this.menu_data.top_date_menu_list = []
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop:3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers:1000
      }
      // axios_api轮询调用方法
      if(window.vue){
        window.vue.$utils.axios_api_loop(obj_);
      }
  }
  /**
   * @Description 请求接口 获取虚拟体育联赛菜单 
   * @param {boolaen} is_init 是否菜单初始化调用
   * @param {undefined} undefined
  */
  api_get_virtual_league_menu(is_init){
    let click_type = is_init ? 'init' : ''

     // 拉取菜单数据
     let obj_ = {
      // axios api对象
      axios_api:api_common.get_virtual_menu,
      // axios api对象参数
      params:null,
      // axios中then回调方法
      fun_then:res => {
        // 设置虚拟体育球种列表
        this.menu_data.virtual_sport_list = _.each(_.get(res, "data.data",[]), item => {
          // 球种挂载新上标识
          item.coppertone = NEW_PITCHES_IDS.includes(+item.field1) ? 1 : 0
        });
  
        this.menu_data.is_api_get_virtual_menu = true
        
        this.menu_change(1,'virtual_sport',click_type)
      },
      // axios中catch回调方法
      fun_catch: err => {
        console.error(err)
        this.menu_data.virtual_sport_list = []
        this.is_api_get_virtual_menu = true
        this.menu_change(1,'virtual_sport',click_type)
      },
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop:3,
      // 异常调用时延时时间,毫秒数,默认1000
      timers:1000
    }
    // axios_api轮询调用方法
    if(window.vue){
      window.vue.$utils.axios_api_loop(obj_);
    }
  }
  /**
   * @Description 请求菜单数量接口 更新菜单数量 
   * @param {menu_id} menu_id 菜单id
   * @param {undefined} undefined
  */
  api_get_menu_count(menu_id,type){
    // 电竞不需要请求菜单数量
    if(this.is_esports_menu(menu_id)) return;
    let params = {
      cuid: store.getters.get_uid,
      euid: menu_id
    }
     // 拉取菜单数据
     let obj_ = {
      // axios api对象
      axios_api:api_common.post_menu_play_count,
      // axios api对象参数
      params,
      // axios中then回调方法
      fun_then:  res => {
        // 更新菜单数量
        let menu_list = _.get(res,'data.data.subList',[])
        let menu_obj = {}
        menu_list.forEach( item => {
          item.is_sync_count = true
          menu_obj['menu_id_'+item.menuId] = item
        })
        if(type == 2){
            let [level3_menu] = menu_list
            if(level3_menu.count<=0){
             let  level3_menu_id = this.get_have_num_menu(menu_list)
             if(level3_menu_id){
              this.menu_change(3,level3_menu_id)
             }else{
               this.menu_obj[`menu_id_${this.menu_data.cur_level2_menu}`].count = 0
               let level2_menu_id = this.get_have_num_menu(this.get_menu_obj_by_menu_id(this.menu_data.cur_level1_menu))
               this.menu_change(2,level2_menu_id)
             }
            }
        }
        _.merge(this.menu_obj,menu_obj)
        
      },
      // axios中catch回调方法
      fun_catch: err => {},
      // 最大循环调用次数(异常时会循环调用),默认3次
      max_loop:5,
      // 异常调用时延时时间,毫秒数,默认1000
      timers:2000
    }
    // axios_api轮询调用方法
    if(window.vue){
      window.vue.$utils.axios_api_loop(obj_);
      //3级菜单订阅
      window.vue.SCMD_C51({cmd:"C51",cpid:menu_id})
    }
  }

  /**
   * @Description 获取有数量的3级菜单  get_have_num_menu
   * @param {Array} menu_list 
   * @returns {String}  menu_id
   */
  get_have_num_menu(menu_list){
    let { menuId } = menu_list.find( item => item.count > 0 ) || {}
    return  menuId
}
  /**
   * @Description 修改滚球某个球种菜单数量为0
   * @param {undefined} undefined
  */
  set_play_sport_count(csid){
    // 遍历滚球球种菜单
    this.menu_obj.play.topMenuList.forEach( menu => {
      if(menu.field1 == csid){
        let menu_list =  [
          {
            menuId:menu.menuId,
            count:0
          }
        ]
        this.ws_update_menu(menu_list)
      }
    })
  }
  /**
   * @Description ws推送更新菜单 
   * @param {undefined} undefined
  */
  ws_update_menu(menu_list){
    let menu_obj = {},sport_menu_count = 295
    _.each(menu_list, item => {
      item.is_sync_count = true
      menu_obj['menu_id_'+item.menuId] = item
      if([30201,30202].includes(Number(item.menuId))){
        // 存储今日数量
        if(item.menuId == 30201){
          this.today_early_count.today = item.count
        }
        // 存储 早盘数量
        if(item.menuId == 30202){
          this.today_early_count.early = item.count
        }
      }
    })
    // vr体育 写死 295
    sport_menu_count = sport_menu_count + this.today_early_count.today + this.today_early_count.early 
    // 菜单数量更新 没更新到使用上一次的数据
    this.sport_menu_count = sport_menu_count == 295 ? this.sport_menu_count : sport_menu_count
    // 滚球菜单数量  要减去全部
    if(menu_obj.menu_id_300){
      let count = menu_obj.menu_id_30001 ? menu_obj.menu_id_30001.count : this.get_menu_obj_by_menu_id(30001).count
      // 滚球菜单数量 不需要减去全部 44099bug
      // menu_obj.menu_id_300.count = Math.max(menu_obj.menu_id_300.count - count,0)
      menu_obj.menu_id_300.count = count
    }
    _.merge(this.menu_obj,menu_obj)
    // 计算滚球全部菜单数量
    this.compute_play_all_menu_count()
    this.check_menu_count()
  }
  /**
   * @Description 菜单数量改变之后 检查当前菜单数量是否为0  为0自动切换菜单
   * @param {undefined} undefined
  */
  check_menu_count(){
    // 检测当前菜单数量是否为0 数量为0 自动切到下一个数量不为0的菜单
    let { cur_level1_menu, cur_level2_menu } = this.menu_data
    // 滚球、热门赛事
    if(['play','hot'].includes(cur_level1_menu)){
      if(this.get_menu_obj_by_menu_id(cur_level2_menu).count == 0){
        // 反回一个列表中 数量大于0的菜单ID 
        cur_level2_menu = this.auto_select_menu_id_by_list(this.menu_data.top_sport_menu_list,2)
        this.menu_change(2,cur_level2_menu)
      }
    }
  }
  /**
   * @Description 计算滚球全部菜单数量 
   * @param {undefined} undefined
  */
  compute_play_all_menu_count(sport_match_count){
    // 收藏 || 筛选联赛  不计算
    if(store.getters.get_layout_list_type == 'collect' || store.getters.get_filter_select_obj.length > 0) return
    // 拉列表时 菜单接口 可能没拉取 所有先保存球种数量  等拉取菜单接口 在统计一次
    if(sport_match_count){
      this.sport_match_count = sport_match_count
    }else{
      sport_match_count = this.sport_match_count || {}
    }

    // ws推送 滚球赛事数量
    let all_menu_obj = this.get_menu_obj_by_menu_id(30001)
    this.menu_obj.play.count = all_menu_obj.count

    // 滚球
    if(this.menu_data.cur_level1_menu == 'play'){
      
    }
    // 热门赛事
    else if(this.menu_data.cur_level2_menu == 30199){
      // 统计热门赛事菜单数量
      let menu_obj = this.get_menu_obj_by_menu_id(30199)
      menu_obj.count = _.sum(_.map(sport_match_count, item => item.count))
      this.menu_obj.hot.count = _.sum(_.map(this.menu_obj.hot.topMenuList, item => this.get_menu_obj_by_menu_id(item.menuId).count))
    }
  }
  /**
   * @Description  是否角球玩法菜单
   * @param {boolean} 
  */
  is_corner_menu(){
    return [302010108, 302020108, 302030108].includes(+this.menu_data.cur_level3_menu)
  } 
  /**
   * @Description  是否电竞菜单
   * @param {boolean} 
  */
  is_esports_menu(menu_id){
    let menu_obj = this.get_menu_obj_by_menu_id(menu_id)
    return menu_obj.menuType == 3000 || utils.is_eports_csid(menu_obj.field1)
  } 
  /**
   * @Description  根据菜单ID 获取一个菜单对象
   * @param {number} menu_id 菜单ID
   * @param {undefined} undefined
  */
  get_menu_obj_by_menu_id(menu_id){
    return this.menu_obj['menu_id_'+menu_id] || {count:0,subList:[],topMenuList:[]}
  }
  	 /**
   * @Description  设置是否支持展示多列菜单
   * @param {} 
  */
  set_multi_column(){
    let level1_menu =this.menu_data.cur_level1_menu
    let  is_multi_column = false
    if( ['play','hot','bet','early','today'].includes(level1_menu) && !this.menu_data.is_esports){
      if(['play','hot'].includes(level1_menu)){
        let {field1 = -1,menuId = ""} = this.get_menu_obj_by_menu_id(this.menu_data.cur_level2_menu)
        is_multi_column = field1 == 1 &&  menuId != 30101
      }else{
        let {field2 = -1} = this.get_menu_obj_by_menu_id(this.menu_data.cur_level3_menu)
        let {menuType = -1} = this.get_menu_obj_by_menu_id(this.menu_data.cur_level2_menu)
        //足球 非角球  非美式足球
        is_multi_column = (field2 == 0  &&  field2 !== '' &&  field2 !== null) && !this.is_corner_menu()  &&  (+menuType) !== 20
      }
    }
    if(_.get(vue,'$route.query.csid',-1) === '1'){
      is_multi_column = true
    }
    //页面宽度
    let inner_width = store.getters.get_layout_size.inner_width
    if(inner_width < 1440){
      is_multi_column = false
    }
    this.menu_data.is_multi_column = is_multi_column && !utils.is_iframe && store.getters.get_global_switch.multi_column
  }
}

const menu = new MenuClass()

window.$menu = menu

export default menu
