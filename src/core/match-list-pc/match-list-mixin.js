 
import { api_match } from "src/public/api/index.js";
import *  as api_websocket from "src/public/api/module/socket/socket_api.js";
 

 
 

import scrollList from "src/public/components/cus_scroll/scroll_list.vue"

import Refresh from "src/public/components/refresh/refresh.vue";

import match_list_card from "src/core/match-list-pc/match-card/match-list-card-class.js";
import match_list_data from "src/core/match-list-pc/match-data/match-list-data-class.js";
import video from "src/public/utils/video/video.js"



import MenuData from "src/core/menu-pc/menu-data-class.js"

import  collect_composable_fn from "src/core/match-list-pc/composables/match-list-collect.js"
import   {show_mids} from "src/core/match-list-pc/composables/match-list-ws.js"
 

import MatchListDetailMiddleware from "src/core/match-list-detail-pc/index.js"


const match_list = {

  setup(props, { attrs, slots, emit, expose }) {

    return {
          ...collect_composable_fn(),
          show_mids,
    }
     
  },
 
  components: {
    Refresh,
    scrollList,
    matchListCard: () => import( /* webpackChunkName: "pc-mini-chunks" */ "src/project/yabo/components/match_list/match_list_card.vue")
  },
  props:{
    // 页面来源 details：详情   list：列表
    page_source:{
      type:String,
      default:'list',
    }
  },
 
  data() {
    return {
      // 菜单数据
      // 数据请求状态
      load_data_state: "loading",
      // 点击头部刷新弹出 loading 蒙层
      show_refresh_mask:false,
      // 列表数据
      match_list: [],
      // 赛事主列表容器卡片逻辑处理类
      match_list_card ,
      // 赛事主列表容器卡片逻辑处理类
      match_list_data ,
 
 
      // 是否静默运行(socket、refresh按钮)
      backend_run: false,
 
      //  订阅所需 盘口ID
      skt_hpid: "",

      /** WS 相关 *********************************/
      socket_name: "match_list",
      wsl: sessionStorage.getItem("wsl"),
      // 第一场虚拟赛事
      // 当列表没拉到数据时  每3秒拉一次
      virtual_list_timeout_id:0,
      time:null,

      // 是否展示强力推荐
      is_show_hot: false,
   
      // 是否继续请求
      is_loading:true,
      // vr 请求次数
      is_vr_numer :0,

    }
  },
  computed: {
    ...mapGetters({
      //获取当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      //获取联赛筛选框显示状态
      vx_show_filter_popup: "get_show_filter_popup",
      // 赛事列表排序 1:按联赛排序 2:按时间排序
      vx_match_sort: "get_match_sort",
      //获取上次选择的盘口类型(盘口切换时使用)
      vx_get_pre_odd: "get_pre_odd",
      // 当前所在页信息
      vx_layout_cur_page: "get_layout_cur_page",
      
 
      // 是否点击详情的返回按钮
      vx_is_back_btn_click: "get_is_back_btn_click",
      //筛选是否全选
      vx_filter_checked_all: "get_filter_checked_all",
      //上次筛选选中的数据
      vx_pre_filter_select_obj: "get_pre_filter_select_obj",
      // 左侧详情参数
      vx_detail_params: "get_match_details_params",
       // 页面布局大小信息
       vx_get_layout_size: "get_layout_size",
       //是否展开多列玩法
      get_unfold_multi_column:"get_unfold_multi_column",
      //全局开关
      get_global_switch:'get_global_switch'
    }),
   /**
    * @description 虚拟体育模板
    *
    * @return {string} 模板名
    */
    match_tpl_component() {
      let match_tpl
      let lv2_mi;
      // 这里判断是从左侧菜单点击的vr 还是中间菜单
      if (MenuData.left_menu_result.sports=='vr') {
        lv2_mi = MenuData.left_menu_result.lv2_mi
      }else if(MenuData.mid_menu_result.sports=='vr'){
        lv2_mi = MenuData.mid_menu_result.mi
      }
      // 1001-足球 1002-赛狗 1004-篮球 1007-泥地赛车 1008-卡丁车 1009-泥地摩托车 1010-摩托车 1011-赛马 1012-虚拟马车赛

      // 足球(1001) | 篮球(1004)  足球菜单ID（30054）篮球菜单ID（30056） 使用 tpl1
      if ([1001, 1004, 30054, 30056,31001].includes(+lv2_mi)) {
        match_tpl = 'virtual-match-tpl1';
      } else {
        match_tpl = 'virtual-match-tpl2';
      }

      return match_tpl;
    },

  
  },
  watch: {
    // 监听当前  菜单 key 变化
    'MenuData.match_list_api_config.version':{
      handler(cur,old){
         // bug 版本没有变化 也可以进入
        if(MenuData.api_config_version != cur){
          MenuData.set_api_config_version(cur)

          // this.is_loading = false
          // 清除过滤条件
          // this.vx_set_remove_filter_condition()
         

          // 获取赛事列表数据
          this.fetch_match_list()
          // 设置联赛吸顶高度
            set_sticky_top()
          // setTimeout(()=>{
          //   this.is_loading = true
          // },100)
        }
      },
      immediate: true,
    },
    get_unfold_multi_column(){
      this.set_retain_scroll_obj({status:true,height:this.$matchlist.scroll_top})
      this.fetch_match_list(false,true)
    },
    // 排序切换
    vx_match_sort() {
      this.fetch_match_list();
    },
    // 列表与收藏切换
    vx_layout_list_type() {
      // 清除过滤条件
      this.vx_set_remove_filter_condition()
   
    },
   
    // 联赛筛选
    vx_show_filter_popup(cur, pre) {
      if (pre && this.vx_filter_select_obj) {

        this.fetch_match_list();
      }
    },
    // 监听列表加载状态变化  记录loading所需时间
    load_data_state:{
      handler(load_data_state){
        if(this.DOM_ID_SHOW){
          if(load_data_state == 'loading'){
            this.$matchlist.start_loading()
          }else{
            this.$matchlist.end_loading()
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 开启自动化测试功能
    this.DOM_ID_SHOW = window.env.config.DOM_ID_SHOW;
    // 列表数据仓库
    this.match_list_data.init()
    this.check_match_last_update_timer_id = setInterval(this.check_match_last_update_time,30000)
    this.timer_obj = {}
    this.set_is_roll_show_banner(false)
    this.set_is_show_banner(false)
    this.api_error_count = 0
    this.is_vr_numer = 0
    this.$root.$on(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, this.update_collect_data);
    this.$root.$on(this.emit_cmd.EMIT_MX_COLLECT_COUNT2_CMD, this.mx_collect_count);
 
    // 站点 tab 休眠状态转激活
    this.$root.$on(this.emit_cmd.EMIT_SITE_TAB_ACTIVE, this.emit_site_tab_active);
    // 调用列表接口
    this.$root.$on(this.emit_cmd.EMIT_FETCH_MATCH_LIST, this.fetch_match_list);
    this.$root.$on(this.emit_cmd.EMIT_API_BYMIDS, this.api_bymids);
    this.$root.$on(this.emit_cmd.EMIT_MX_COLLECT_MATCH, this.mx_collect_match);
    this.$root.$on('match_list_show_mids_change', this.show_mids_change);
  },
  methods: {
    ...mapActions({

    
      // 移除选择后初始化
      vx_set_remove_filter_condition:"set_remove_filter_condition",
      // 滚动时是否显示banner
      set_is_roll_show_banner: "set_is_roll_show_banner",
      // 是否显示banner
      set_is_show_banner: "set_is_show_banner",

      //设置是否全选
      set_filter_checked_all: "set_filter_checked_all",
      // 清空上次筛选数据
      remove_pre_filter_select_obj: "remove_pre_filter_select_obj",
      //获取保存的滚动高度
      set_retain_scroll_obj:"set_retain_scroll_obj",
    
    }),
    /**
     * @description 请求数据
     * @param  {boolean} is_socket   是否 socket 调用
     * @param  {boolean} cut   是否 切换右侧详情  true 不切换
     * @param {Object} params 其他参数
     */

    fetch_match_list(is_socket = false, cut) {




























      // 设置当前为赛事列表
     
     
      // 如果有拉列表定时器 清除定时器
      if(!is_socket && this.get_match_list_timeid){
        clearTimeout(this.get_match_list_timeid)
        this.get_match_list_timeid = false
      }
      // 热门推荐定时器
      if(!is_socket && this.hot_match_list_timeout){
        clearTimeout(this.hot_match_list_timeout)
      }
      // 视频结束返回列表  强制loading
      if(video.is_video_end){
        is_socket = false
        video.is_video_end = false
      }
      this.$matchlist.fetch_match_list_time = new Date().getTime()
      // 组件和路由不匹配
      if(this.$route.name == 'details' && this.page_source != 'details' ){
        return
      }
      // 强力推荐 静默拉取
      if(is_socket && this.is_show_hot){
        this.get_hot_match_list(true)
        return
      }
      // 【搜索列表】 WS 之类的调用 fetch_match_list 转向到 fetch_search_match_list
      if (this.$route.name == "search") {
        this.fetch_search_match_list && this.fetch_search_match_list(is_socket);
        return false
      }

      if(!is_socket){
        this.match_list_data.init()
        this.load_data_state = "loading"
        // 设置列表滚动条scrollTop
        this.$route.name != 'details' && this.$matchlist.set_scroll_top(0);
      }

      let match_api = MenuData.match_list_api_config.match_list || {}
      // console.error('match_api',JSON.stringify(match_api))

      // 设置列表接口 和 参数
      let api = api_match[ match_api.api_name]
      let _params = _.clone(match_api.params) || {}

      // 切换是 排序后 设置当前的排序
      _params.sort = this.vx_match_sort

      delete _params.index
      delete _params.lv2_mi

      // 近期开赛
      // console.error('MenuData.menu_root',MenuData.menu_root)
      if( MenuData.menu_root == 2){
        _params.selectionHour = this.$store.state.filter.open_select_time
      }else{
        _params.selectionHour = null
      }



















      


























      // 无感刷新 不走预加载
      if( typeof is_socket == 'boolean' && !is_socket){
        // console.error('不是无感刷新')
        // 使用元数据默认显示 
        this.set_base_data_init()
      }
     
      
// return
      let send_match_list_request = () => {
        /**返回数据处理************/
        api && api(_params).then( res => {
          // 组件和路由不匹配 菜单id不匹配
          if((this.$route.name == 'details' && this.page_source != 'details') || this.destroyed  || _params.euid != match_api.params.euid) return

          let data = _.get(res,'data',{})

          this.api_error_count = 0
          if(data.code == 200){

          //处理服务器返回的 列表 数据   fetch_match_list
          this.handle_match_list_request_when_ok(JSON.parse(JSON.stringify(data)), is_socket,cut)

          } else if(data.code == '0401038'){
            // let is_collect = this.vx_layout_list_type == 'collect'
            // // 收藏列表，遇到限频提示'当前访问人数过多，请稍后再试'
            // if (is_collect && data.code == '0401038') {
            //     this.load_data_state = "api_limited";
            // }
            if(!is_socket){
              this.load_data_state = "api_limited";
            }
          } else {
            if(!is_socket){
              this.load_data_state = "empty";
            }
          }
          this.show_refresh_mask = false;
        }).catch((err) => {
      
          this.show_refresh_mask = false;
          // 如果是用户切换菜单
          if(!is_socket){
            this.api_error_count++
            // 重复拉列表的次数小于5   3秒后再次拉接口
            if(this.api_error_count < 5){
              this.get_match_list_timeid = setTimeout(()=>{
                this.fetch_match_list()
              },3000)
            }else{
              this.load_data_state = "refresh";
            }
          }
        });
      }
      const match_list_debounce_cache = axios_debounce_cache.get_match_list
        if(match_list_debounce_cache && match_list_debounce_cache['ENABLED']){
          let info = match_list_debounce_cache.can_send_request(_params);
          if(info.can_send){
            //直接发请求    单次数 请求的方法
            send_match_list_request();
          }else{
            // 记录timer
            this.current_hash_code = 0
            clearTimeout(this.axios_debounce_timer2)
            this.axios_debounce_timer2 = setTimeout(() => {
              //直接发请求    单次数 请求的方法
              send_match_list_request();
              this.current_hash_code = 0
            }, info.delay_time || 1000);
          }
        } else {
          //直接发请求    多 次数  循环请求 的方法
          send_match_list_request();
        }
    },
  

      /**
       * // 处理服务器返回的 列表 数据   fetch_match_list
       */
     handle_match_list_request_when_ok(data,is_socket,cut,collect){

      // console.warn('daya',data)

      let {match_list_api_config,menu_root,match_list_api_type,left_menu_result} = MenuData
     //  console.warn('left_menu_result.gunjun',MenuData.left_menu_result.guanjun)

      // let  use_mx_list_res =
      if( (menu_root == 2000 || ([2,3].includes(Number(menu_root)) && left_menu_result.guanjun != 'common-guanjun')) && !match_list_api_config.is_collect ) {
        // console.error('mx_list_res-----------------', );
          //       mx_list_res
          //    今日早盘   常规球种下的  常规 玩法
          //    电竞 单页  所有玩法
          this.mx_list_res(data,is_socket,cut,collect);
        } else {
          // console.error('mx_use_list_res-----------------', );
          //  mx_use_list_res
          // 滚球单页 下所有
          // 热门 单页下 所有
          //  冠军  单页      ，
          //  今日早盘   常规球种下的   常规球种下的 冠军
          // 虚拟体育 单页 的  所有赛种
          // 收藏
          this.mx_use_list_res(data, is_socket,cut,collect);
      }


     },

    /**
     * @description 获取强力推荐赛事
     * @param  {boolean} backend_run 是否后台 调用
     * @return {undefined} undefined
     */
    get_hot_match_list(backend_run = false) {
      // 更新收藏数量
      if(!backend_run){
        this.mx_collect_count()
      }

      let match_list_api_config = MenuData.match_list_api_config.match_list

      let api = api_match[match_list_api_config.api_name]
      let _params = _.clone(match_list_api_config.params)


      api(_params).then( res => {
        // 组件和路由不匹配
        if(this.$route.name == 'details' && this.page_source != 'details' ){
          return
        }
        if(this.destroyed){
          return
        }
        this.show_refresh_mask = false;
        let code = _.get(res, "data.code");
        // 赛事列表
        let match_list =  _.get(res, 'data.data') || []
        if(MenuData.is_esports()){
          match_list = _.get(res, 'data.data.data') || []
        }
        if (code == 200 && match_list.length > 0) {
          this.is_show_hot = true
          // 设置列表数据仓库
          this.match_list_data.compute_match_list_all_data(match_list,backend_run,true)
          // 计算赛事卡片
          this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,backend_run)

          if (!backend_run) {
            // 调用bymids接口
            this.api_bymids({is_first_load:true})
            // 切换右侧赛事
            let first_match = match_list[0]
            let params = {
              media_type:'auto',
              mid: first_match.mid,
              tid: first_match.tid,
              sportId: first_match.csid
            }
            this.regular_events_set_match_details_params(null,params)
          } else {
            // 更新可视区域赛事盘口数据
            this.show_mids_change()
          }

          this.load_data_state = "data"
        }else if(!backend_run){
          this.load_data_state = "empty"
        }
      }).catch((err) => {
        // console.error(err)
        this.show_refresh_mask = false;
        if (!backend_run) {
          this.load_data_state = "empty"
        }
      });
    },
  /**
   * @description 专业处理服务器返回的 列表 数据---联赛结构
   * @param {object} data   服务器返回数据
   * @param {boolean} backend_run   是否静默拉取
   * @param  {boolean} cut   是否 切换右侧详情  true 不切换
   * @param  {boolean} collect   是否 请求收藏数量  true 不请求
   * @return {undefined} undefined
   */
    mx_list_res(data, backend_run,cut,collect) {
      let code = _.get(data, "code");
      let res_data = _.get(data, 'data');
      let callback_func = null
      let type_name = this.vx_cur_menu_type.type_name;
      let pre_name = this.vx_cur_menu_type.pre_name;

      clearTimeout(this.virtual_list_timeout_id);
      // 所有联赛列表
      let all_league_list = []
      all_league_list.push(..._.get(res_data,'livedata',[]))
      all_league_list.push(..._.get(res_data,'nolivedata',[]))
      if (code == 200 && all_league_list.length > 0) {
        this.is_show_hot = false
        // 设置收藏数量
        if(this.vx_filter_select_obj.length > 0){
          // 只有预加载会穿 true
          if(!collect){
            this.mx_collect_count()
          }
        }else{
          this.set_collect_count({
            type:'set',
            count:_.get(data,'data.collectCount',0)
          })
        }

        // 如果是专业版 && 今日、早盘、串关之间的切换 && 之前有筛选 && 并且当前没有筛选
        if(!backend_run && ['today','early','bet'].includes(type_name) && ['today','early','bet'].includes(pre_name) && this.vx_pre_filter_select_obj.length > 0 && this.vx_filter_select_obj.length == 0){
          let new_data = {
            livedata:[],
            nolivedata:[],
            championdata:[],
          }
          let new_filter = []
          _.each(res_data, (item,key) => {
            _.each(item, league => {
              let tid = league.tid ? league.tid.toString() : ''
              if(tid && new_data[key] && this.vx_pre_filter_select_obj.includes(tid)){
                new_data[key].push(league)
                if(!new_filter.includes(tid)){
                  new_filter.push(tid)
                }
              }
            })
          })
          if(new_filter.length > 0){
            // 合并连续相同的联赛
            new_data = this.merge_same_league(new_data)
            Object.assign(res_data,new_data)
            if(new_filter.length != this.vx_filter_select_obj.length){
              this.set_filter_checked_all(false);
            }
          }

          MenuData.set_filter_select_obj(new_filter)

        }
        if(!['today','early','bet'].includes(pre_name) && pre_name){
          this.remove_pre_filter_select_obj()
        }

        // 设置数据仓库 联赛列表对象
        this.match_list_data.set_league_list_obj(res_data)
        // 计算列表卡片样式
        this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(res_data,backend_run)


        if(_.isFunction(this.SCMD_C9)) {
          // C9订阅
          this.SCMD_C9(all_league_list);
        }

        if(backend_run){
          // 静默拉取列表 设置数据加载状态
          this.load_data_state = 'data'
          // 更新可视区域赛事盘口数据
          this.show_mids_change()
        }else{
          if(MenuData.is_guanjun()){
            // 冠军玩法 调用接口切换右侧
            this.mx_autoset_active_match();
          }else if(!MenuData.is_esports()){
            // 非电竞切换右侧 为列表第一场赛事
            let first_league = all_league_list[0]
            let mids = first_league.mids.split(',')
            let params = {
              media_type:'auto',
              mid:  mids[0],
              tid: first_league.tid,
              sportId: first_league.csid
            }
            callback_func = ()=>{this.regular_events_set_match_details_params(cut,params)}
          }
          this.load_data_state = "data";
          // 调用bymids更新前12场赛事
          this.api_bymids({is_league_first:true, inner_param:true},callback_func)
        }

      } else if (!backend_run) {
        let delay = 10000
        if(sessionStorage.getItem('is_select_time')){
          delay = 0
          sessionStorage.removeItem('is_select_time')
        }
        // this.load_data_state = "empty";
        this.hot_match_list_timeout =  setTimeout(() => {
          if( this.load_data_state  !== 'data'){
           this.get_hot_match_list()
           clearTimeout(this.hot_match_list_timeout)
          }
        }, delay);
      }else{
        this.load_data_state = 'empty'
        // 设置数据仓库 联赛列表对象
        this.match_list_data.set_league_list_obj(res_data)
        // 计算列表卡片样式
        this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(res_data,backend_run)
      }
    },
    /**
     * @description 处理服务器返回的 列表 数据 ---滚球
     * @param {object} data   服务器返回数据
     * @param {boolean} backend_run   是否静默拉取
     * @param  {boolean} cut   是否 切换右侧详情  true 不切换
     * @param  {boolean} collect   是否 请求收藏数量  true 不请求
     * @return {undefined} undefined
     */
    mx_use_list_res(data, backend_run,cut,collect) {
      let code = _.get(data, "code");
      let type_name = this.vx_cur_menu_type.type_name;
      clearTimeout(this.virtual_list_timeout_id)

      // 是否虚拟体育
      let is_virtual = MenuData.is_virtual_sport()
      let is_search = this.$route.name == "search"
      // 赛事列表
      let match_list =  _.get(data, 'data.data')
      if(!match_list) {
        match_list = _.get(data, 'data',[])
      }
      match_list = match_list || []
      //虚拟体育 接口数据结构转换
      if (is_virtual && !is_search) {
        let _match_list = []
        match_list.forEach(item => {
          _match_list = [..._match_list,...item.matchs];
        });
        match_list = _match_list;
        this.match_list = match_list
        // 格式化
        this.virtual_sport_format();
      }

      if (code == 200 && match_list.length > 0) {
        this.is_show_hot = false
        // 设置列表数据仓库
        this.match_list_data.compute_match_list_all_data(match_list,backend_run,true)
        // 计算赛事卡片
        this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,backend_run)

        // 设置收藏数量
        // 只有预加载会穿 true
        if(!collect){
          this.mx_collect_count()
        }

        if (!backend_run) {
          if(!is_virtual || is_search){
            // 非虚拟体育——设置赛事列表选中赛事
            if(MenuData.is_guanjun() || this.vx_cur_menu_type.type_name == 'winner_top'){
              this.mx_autoset_active_match();
            }
            // 非详情页 切换右侧为列表第一场赛事
            else if(this.$route.name != 'details'){
              let first_match = match_list[0]
              let params = {
                media_type:'auto',
                mid: first_match.mid,
                tid: first_match.tid,
                sportId: first_match.csid
              }
              this.regular_events_set_match_details_params(cut,params)
            }
          }
        } else {
          // 更新可视区域赛事盘口数据
          this.show_mids_change()
        }
        // 首次拉列表调用bymids 拉取所有赛事盘口数据
        if(this.vx_layout_list_type == 'match' && ['play','hot'].includes(type_name) && !backend_run){
          // 调用bymids接口
          this.api_bymids({is_first_load:true, inner_param:true})
        }

        this.load_data_state = "data";
      }
      else {
        if(is_virtual && !is_search){
          // 右侧切换
          MatchListDetailMiddleware.set_vsport_params({
            csid: 0,
            tid: 0,
          });
          this.is_vr_numer++
          // 重复拉列表的次数小于5   3秒后再次拉接口
          if(this.is_vr_numer < 5){
            this.virtual_list_timeout_id = setTimeout(()=>this.fetch_match_list(true),3000);
          }

          this.load_data_state = "empty";
        }
        else if (!backend_run) {
          // this.load_data_state = "empty";
          // 如果是滚球并且不是全部  把当前菜单数量设为0  并自动切换菜单
          let match_list_api_config = MenuData.match_list_api_config
          if(this.$route.name == 'home' &&  MenuData.menu_root == '1'  && match_list_api_config.sports!='quanbu-gunqiu'){
            let obj = {
              menuId: (match_list_api_config.match_list || {}).params.euid,
              count:0
            }

            MenuData.set_current_mi_0_and_change_menu()

          }else if(this.$route.name == 'home' &&  MenuData.menu_root != '500'  && this.vx_layout_list_type !== 'collect'){
            this.get_hot_match_list()
            //TODO
          }else{
            this.load_data_state = "empty";
          }
        } else{
          this.load_data_state = 'empty'
          // 设置列表数据仓库
          this.match_list_data.compute_match_list_all_data(match_list,backend_run,true)
          // 计算赛事卡片
          this.match_list_card.compute_match_list_style_obj_and_match_list_mapping_relation_obj(match_list,backend_run)
        }

      }
    },
    /**
     * @Description 合并连续相同的联赛
     * @param {undefined} undefined
    */
    merge_same_league(league_obj){
      let new_data = {
        livedata:[],
        nolivedata:[],
      }
      let new_league = {}
      // 上一个联赛
      let pre_league = {}

      // 遍历所有联赛列表
      _.each(['livedata','nolivedata'], type => {
        pre_league = {}
        _.each(league_obj[type], league => {
          // 联赛ID相同 合并赛事ID
          if(league.tid == pre_league.tid){
            new_league.mids += ',' + league.mids
          }else{
            // 联赛ID不同 添加到新联赛数据
            new_league = league
            new_data[type].push(new_league)
          }
          pre_league = league
        })
      })
      return new_data
    },
    /**
     * @description 虚拟体育赛事格式化
     * @return {undefined} undefined
     */
    virtual_sport_format() {
      let _match_index = 0;
      // 是否为新批次
      let _vshow_group = true;
      let pre_index = 0;
      // 赛事显示状态 1：进行中 2： 停止投注 3：停留1分后移除
      let _show_status = 1;

      let remote_time = this.mx_get_remote_time();

      /** 第1场赛事的特殊处理 ***************/
      let first_match = this.match_list[0] || {}

      // 篮球 && 赛前赛事
      if(first_match.csid=='1004' && first_match.mmp=='PREGAME'){
        // 开赛时间后 10S
        let over_time = Number(first_match.mgt)+10000

        if(remote_time>over_time){
          // 移除 赛前相关的 5 场赛事
          this.match_list.splice(0,5)
        }

      }

      // 上一个赛事
      let pre_match = {}
      this.match_list.forEach((match, cur_index) => {

        if (cur_index > 0) {
          pre_index = cur_index - 1;

          if (match.batchNo != pre_match.batchNo) {
            _match_index = 0;
            _vshow_group = true;

          } else {
            _vshow_group = false;
          }
        } else {

          // 右侧切换
          MatchListDetailMiddleware.set_vsport_params({
            mid: match.mid,
            csid: match.csid,
            tid: match.tid,
            batchNo: match.batchNo,
            orderNo: match.orderNo,
          });
        }
        _match_index += 1;
        match._match_index = _match_index;
        match._show_status = _show_status;
        match._vshow_group = _vshow_group;

        // 防止重新拉赛事后 先展开后再收起的闪烁问题
        if (remote_time > match.mgt) {
          match.mhs = 2;
        }
        pre_match = match
      })

    },
  
    /**
    * @description 返回顶部
    * @return {undefined} undefined
    */
    on_go_top() {
      this.$root.$emit('set_match_list_scroll_top',0)
    },
    /**
     * @description 无感刷新
     * @return {undefined} undefined
     */
    on_refresh() {
      this.fetch_match_list(2);
      this.show_refresh_mask = true;
    },
    /**
     * @Description 可视赛事ID改变
     * @param {undefined} undefined
    */
    show_mids_change(){
      // 列表没加载完 不执行
      if(this.load_data_state != 'data'){
        return
      }
      // 重新订阅C8
      this.refresh_c8_subscribe()
      this.api_bymids({is_show_mids_change:true})
    },
    /**
     * @description 调用列表bymids接口
     * @param  {boolean} is_first_load 是否用户切换菜单  第一次加载调用
     * @param  {boolean} is_show_mids_change 是否可视区域赛事改变 调用
     * @param  {boolean} is_league_first 是否联赛结构类型列表 首次加载拉前12场赛事
     * @param  {array} mids 指定拉取的mids
     * @param  {function} callback 回调函数
     * @return {undefined} undefined
     */
    api_bymids({is_first_load, is_show_mids_change, is_league_first, mids, inner_param},callback) {
      if(
          (this.destroyed ||MenuData.is_virtual_sport()) && this.$route.name !== "search" ||
          (this.$options.name !== 'HotMatchList' && ['details', 'video'].includes(this.$route.name))
      ){
        return
      }

      // 联赛结构类型列表 首次加载拉前12场赛事
      if(is_league_first){
        mids = this.match_list_data.get_first_unfold_mids()
      }
      // 第一次加载拉取所有赛事
      else if(is_first_load){
        // mids = []
        // this.match_list_data.match_list.forEach( match => {
        //   mids.push(match.mid)
        // })
        mids =  this.show_mids.value
      }
      // 是否可视区域赛事改变
      else if(is_show_mids_change){
        mids = this.show_mids.value
      }

      // 是否用户切换菜单 第一次调用bymids接口
      if(is_league_first || is_first_load){
        this.first_load_time = new Date().getTime()
      }else{
        let _time = new Date().getTime() - this.first_load_time
        // 距离第一次全量加载时间小于2秒 不请求接口
        if(_time < 2000){
          return
        }
      }
      // 非滚球第一次加载  mid数量最多24个
      if(mids.length > 24){
        mids.splice(24)
      }

      if(mids.length == 0) return;
      is_show_mids_change && mids.forEach( mid => {
        // 从列表触发详情接口同步数据
        if(this.vx_details_params.mid == mid) {
          this.$root.$emit("match_detail_base", {isWs: true, mid,is_bymids:true});
        }
      });
      // 获取足球tab玩法参数
      let tabs = this.match_list_data.get_tab_param_build(mids);


      let match_list_api_config = MenuData.match_list_api_config.match_list


      let _params = _.clone(match_list_api_config.params) || {}




      let params = {
        mids:mids.join(","),
        cuid: this.vx_get_uid,
        euid: _params.euid,
        orpt: _params.orpt,
        sort: this.vx_match_sort
      }
      if(tabs.length > 0) {
        params.tabs = tabs;
      }


      // 非滚球传 玩法ID
      if (MenuData.menu_root != '1' && this.$route.name != "search") {
        params.pids = _params.pids;
      }

      //today：今日  early：早盘 角球玩法
      params.cos = MenuData.is_corner_menu() || params.orpt == 25 ? 1 : 0;

      // 冠军去参数
      if(MenuData.menu_root==400) {
        delete params.euid
      }

      let api
      // 电竞
      if(MenuData.is_esports() && this.$route.name !== "search"){
        api = api_websocket.get_esports_by_mids
        params = {
          mids: mids.join(","),
          csid: _params.csid,
          cuid: this.vx_get_uid,
        }
        if(MenuData.is_esports_champion()){
          params.category = 2
        }
      }else{
        api = api_websocket.get_match_base_info_by_mids
      }

      //添加内部参数
      if(inner_param) params.inner_param = inner_param
      //当点击足球 赛种,并收起右侧详情面版orpt参数为13
      if(this.get_unfold_multi_column && MenuData.is_multi_column){
        params.orpt= 13
      }
  // return
      let by_mids_fun_count = 0;
      let by_mids_fun = ()=>{
        // HTTP拉取最新信息合并
        api(params).then( res => {
          this.set_home_loading_time_record('ok');
          // 组件和路由不匹配
          if((this.$route.name == 'details' && this.page_source != 'details') || this.destroyed) return
          //更新电竞右侧视频
          if(MenuData.is_esports() && this.$route.name !== "search" && !is_first_load) {
              this.$root.$emit(this.emit_cmd.GET_ESPORTS_VIDEO_LIST)
          }
          let code = _.get(res, "data.code");
          let match_list = _.get(res, "data.data.data") || []
          let ts1 = _.get(res, "data.ts");
          let mids_arr = []
          match_list.forEach( match => {
            mids_arr.push(String(match.mid))
            match.api_update_time = ts1
          })
          // 展开联赛数据加载状态
          let league_load_status = ''
          // 检查赛事是否移除
          if(code == 200){
            mids.forEach( mid => {
              if(!mids_arr.includes(String(mid))){
                this.remove_match_data(mid)
              }
            })
          }
          if (code == 200 && match_list.length > 0) {
            this.set_match_base_info_by_mids_info(match_list,mids_arr,ts1)
           
          } else if(code == '0400500' && (by_mids_fun_count++) < 3) {
            by_mids_fun();
            league_load_status = 'empty'
          } else if(code == '0401038'){
            // 限流
            league_load_status = 'api_limited'
          }else{
            league_load_status = 'empty'
          }
          if(league_load_status && callback){
            // 回调无数据状态
            callback(league_load_status)
          }
          // 如果是第一次加载设置数据加载状态
          if(is_league_first){
            this.load_data_state = 'data'
          }
          // 回调函数
          if(callback){
            callback()
          }
        }).catch((err)=>{
          this.set_home_loading_time_record('err');
          // console.error(err)
          // 如果是第一次加载设置数据加载状态
          if(is_league_first){
            this.load_data_state = 'data'
          }
          // 展开联赛数据加载状态
          let league_load_status = ''
          if(_.get(err,'response.status') == 503){
            // 限流
            league_load_status = 'user_api_limited'
          } else {
            // 无数据
            league_load_status = 'empty'
          }
          if(callback){
            // 回调无数据状态
            callback(league_load_status)
          }
        })
      };
      // 虚拟体育不用拉最新信息合并
      if( this.vx_cur_menu_type.type_name !== "virtual_sport"){
        const by_mids_debounce_cache = axios_debounce_cache.get_match_base_info_by_mids
        if(by_mids_debounce_cache && by_mids_debounce_cache['ENABLED']){
          let scroll = is_show_mids_change ? Date.now() : ""
          let info = by_mids_debounce_cache.can_send_request({...params,scroll });
          if(info.can_send){
            //直接发请求    单次数 请求的方法
            by_mids_fun();
          }else{
            // 记录timer
            this.current_hash_code = 0
            clearTimeout(this.axios_debounce_timer)
            this.axios_debounce_timer = setTimeout(() => {
              //直接发请求    单次数 请求的方法
              by_mids_fun();
              this.current_hash_code = 0
            }, info.delay_time || 1000);
          }
        } else {
          //直接发请求    多 次数  循环请求 的方法
          by_mids_fun();
        }
      }
    },
    /**
     * get_match_base_info_by_mids 数据解析
     */ 
    set_match_base_info_by_mids_info(match_list,mids_arr,ts1){
      // 设置列表数据仓库
      this.match_list_data.compute_match_list_all_data(match_list,true)
      // 重新计算赛事样式
      this.match_list_card.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids_arr)
      match_list.forEach( match => {
        // bymid数据同步投注项 1508要改的
        this.yabo_common.upd_bet_obj(this, ts1, match.mid);
        // 同步比分到右侧
        if(this.vx_detail_params.mid == match.mid){
          this.yabo_common.update_match_score(this,0,match.mid)
        }
      })

      //热门赛事 提取足球赛事
      if(MenuData.menu_root == 500){
        let obj = match_list.find(item=> item.csid == 1) || {}
        MenuData.hot_500_sport_1 = !!obj.csid;
        // 更新 展开/收起 按钮显示隐藏
        MenuData.set_multi_column();
      }
    },
  /**
   * @Description 删除赛事数据 卡片
   * @param {*} mid 删除赛事id
   */
    remove_match_data(mid){
      // 移除卡片
      this.match_list_card.remove_match(mid)
      //清除数据仓库数据
      this.match_list_data.remove_match_data(mid)
      //切换右侧
      if(this.vx_details_params.mid == mid) {
        // 赛事移除时右侧赛事自动切换
        this.mx_autoset_active_match({mid});
      }
    },

   

 
    /**
     * @Description:移除赛事
     * @Author success
     * @param:
     * @return:
     * @Date 2020/03/19 17:44:06
     */
    socket_remove_match(match) {
      // 列表加载中不操作
      if(this.load_data_state != 'data'){
        return
      }
      // 移除卡片
      this.match_list_card.remove_match(match.mid)
      // 更新收藏数量
      this.update_collect_data({ type: "remove", match })

      if(this.vx_details_params.mid == match.mid) {
        // 赛事移除时右侧赛事自动切换
        this.mx_autoset_active_match({mid:match.mid});
      }
    },

 
    /**
     * @Description 设置数据加载状态
     * @param {string} 数据加载状态
     * @param {undefined} undefined
    */
    set_load_data_state(data){
      this.load_data_state = data
    },
    /**
     * @Description 每30秒检查一次可视区域赛事数据最后更新时间，如果超过1分钟未更新数据  调用bymids接口更新数据
     * @param {undefined} undefined
    */
    check_match_last_update_time(){
      // 非滚球 今日 不检查
      if(!['play','today'].includes(this.vx_cur_menu_type.type_name)){
        return
      }
      let mids = []
      let now_time = this.mx_get_remote_time()
      // 遍历可视区域赛事ID
      this.show_mids.value.forEach( mid => {
        // 更新时间间隔
        let api_time_dif = 0, ws_time_dif = 0;
        let match = this.match_list_data.mid_obj['mid_'+mid] || {}
        if(match.api_update_time){
          api_time_dif = now_time - match.api_update_time
        }
        if(match.ws_update_time){
          ws_time_dif = now_time - match.ws_update_time
        }else{
          ws_time_dif = 70000
        }
        // 超过一分钟 未更新过数据
        if(api_time_dif > 60000 && ws_time_dif > 60000){
          mids.push(mid)
        }
      })
      if(mids.length > 0){
        this.api_bymids({mids})
      }
    },
    emit_site_tab_active(){
      this.fetch_match_list(true)
    },
 
    // 自动化测试页面加载时间时使用
    set_home_loading_time_record(status){
      if(window.init_loading_time_obj && _.get(window, 'env.config.DOM_ID_SHOW')){
        if(!window.init_loading_time_obj.list_end_time){
          window.init_loading_time_obj.list_end_time = new Date().getTime();
        }

        let time_obj = window.init_loading_time_obj;
        if(!time_obj.start){
          time_obj.start = new Date(time_obj.start_time).Format('yyyy-MM-dd hh:mm:ss');
        }
        if(time_obj.list_end_time && time_obj.right_details_end_time){
          let end_time = (time_obj.list_end_time > time_obj.right_details_end_time)?time_obj.list_end_time:time_obj.right_details_end_time;
          time_obj.end = new Date(end_time).Format('yyyy-MM-dd hh:mm:ss'),
          time_obj.end_time = end_time;
          time_obj.status = status;
          time_obj.duration = time_obj.end_time - time_obj.start_time;
          sessionStorage.setItem('home_loading_time_record',JSON.stringify(time_obj))
          window.init_loading_time_obj = null;
        }
      }
    },
    // 使用元数据默认显示 后面替换
    set_base_data_init(){
      // 列表数据仓库
      this.match_list_data.init()
      // return
      // 当前的分类 左侧菜单数据 中间件数据
      const { menu_root, left_menu_result:{ lv2_mi,lv1_mi,has_mid_menu,guanjun },mid_menu_result:{mi,mif,root}} = MenuData
    
      let mid = lv2_mi
      let midf = lv1_mi

      // 有中间件数据 不能是早盘 使用 mi
      if(has_mid_menu && menu_root != 3){
        mid = mi
        if([300,400].includes(menu_root)){
          midf = mi
        }else{
          midf = mif
        }
      }
      // 数据兜底
      midf = midf || lv2_mi
      mid = mid || lv2_mi

      // 获取csid 联赛列表头 
      let csid = $BaseData.compute_sport_id(midf);

      // 冠军400 - 400是赛种id
      if(menu_root == 400){
        csid = parseInt(mi) - 400
      }

      // 常规赛种下的冠军 
      if([2,3].includes(menu_root) && MenuData.is_guanjun()){
        csid = parseInt(lv2_mi) - 400
      }
     
      let data = {
        code:200,
        data:{}
      }
      
      let matchs_list = [];

      // 元数据 
      const { mi_tid_mids_res = {},base_data_res = {},mew_menu_list_res,left_menu_base_mi_arr } = $BaseData

      // 没有数据 不执行
      if(!mi_tid_mids_res[mid]){
        return
      }

      // 常规赛种 
      if([2,3].includes(menu_root) && !MenuData.is_guanjun()){
        // 根据联赛-赛事接口 拿到 mid 去赛事列表里面匹配数据
        if(!mid) return

        // 常规赛种/联赛   滚球 ld
        let livedata = ( mi_tid_mids_res[mid].ld || []).map(item=> ({tid: item.tid, csid, mids:item.mids.join(','), mids_info:item.mids })) || []
        // 常规赛种/联赛   未开赛 nd 
        let nolivedata = ( mi_tid_mids_res[mid].nd || []).map(item=> ({tid: item.tid, csid, mids:item.mids.join(','), mids_info:item.mids })) || []

        // 常规赛种、联赛  滚球 详细内容
        let live_match = this.get_match_list_by_mid_for_base_data_res(mid,csid,'ld')
        // 常规赛种、联赛  未开赛 详细内容
        let nolive_match = this.get_match_list_by_mid_for_base_data_res(mid,csid,'nd')

        matchs_list = [...live_match,...nolive_match]

        // 常规赛种联赛
        data.data = {
          collectCount:  0,
          collectMIds : [],
          livedata: livedata,
          nolivedata : nolivedata
        }

      }else{
        //滚球赛事
        if(menu_root == 1){
          if(mi == 1){
            let mi_100_arr = []

            // 常规赛种/联赛  滚球
            mew_menu_list_res.forEach((x)=> {
              if(x.mi*1 < 300){
                mi_100_arr.push('101'+'2'+x.mi.substring(1))
              }
            }) 
            
            //常规赛事下 所以的滚球数据
            mi_100_arr.forEach(item=>{
              let livedata = this.get_match_list_by_mid_for_base_data_res(item,csid,'ld')
              matchs_list = [...matchs_list,...livedata]
            })
          }else{
            let mid_1 = '101'+'2'+ (''+midf).substring(1)
            matchs_list = this.get_match_list_by_mid_for_base_data_res(mid_1,csid,'ld')
          }
        
        }else if(MenuData.is_guanjun()){
          if(mi == 400){
            let mi_400_arr = []

            // 常规赛种/联赛  滚球
            mew_menu_list_res.forEach((x)=> {
              if(x.mi*1 < 300){
                mi_400_arr.push('101'+'2'+x.mi.substring(1))
              }
            }) 
            
            //常规赛事下 所以的滚球数据
            mi_400_arr.forEach(item=>{
              let livedata = this.get_match_list_by_mid_for_base_data_res(item,csid,'ld')
              matchs_list = [...matchs_list,...livedata]
            })
          }else{
            let mid_1 = '101'+'2'+ (''+midf).substring(1)
            matchs_list = this.get_match_list_by_mid_for_base_data_res(mid_1,csid,'ld')
          }
        } else if( menu_root == 500){
          // 热门赛事
          if( [50199,50101].includes(Number(mi)) ){
            // 竞足 和赛事（全部）
            for(let i = 0; i < 20 ; i++){
              // 常规赛事以外的 不分滚球和未开赛的数据
              let match_data = this.get_match_list_by_mid_for_base_data_res(mid,i,i)
              matchs_list = [...matchs_list,...match_data]
            }
          }else{

            // 常规赛种/联赛   滚球 ld
            let live_data_500 = ( mi_tid_mids_res[mid].ld || []).map(item=> ({tid: item.tid, csid, mids:item.mids.join(','), mids_info:item.mids })) || []
            // 常规赛种/联赛   未开赛 nd 
            let nolive_data_500 = ( mi_tid_mids_res[mid].nd || []).map(item=> ({tid: item.tid, csid, mids:item.mids.join(','), mids_info:item.mids })) || []

            // 常规赛种/联赛  滚球
            let live_data_match = this.get_match_list_by_mid_for_base_data_res(mid,csid,'ld')
            // 常规赛种、联赛  未开赛
            let nolive_data_match = this.get_match_list_by_mid_for_base_data_res(mid,csid,'nd')

            matchs_list = [...live_data_match,...nolive_data_match]

              // 常规赛种联赛
            data.data = {
              collectCount:  0,
              collectMIds : [],
              livedata: live_data_500,
              nolivedata : nolive_data_500
            }
          }
        } else{
          // 常规赛事以外的 不分滚球和未开赛的数据
          matchs_list = this.get_match_list_by_mid_for_base_data_res(mid,csid,csid)

          // console.warn('matchs_list',matchs_list)

          // 如果没有数据 使用其他有数据的 赛种玩法
          if(!matchs_list.length){
            // 常规赛种/联赛  滚球
            let livedata = this.get_match_list_by_mid_for_base_data_res(mid,csid,'ld')
            // 常规赛种、联赛  未开赛
            let nolivedata = this.get_match_list_by_mid_for_base_data_res(mid,csid,'nd')

            matchs_list = [...livedata,...nolivedata]
          }
        }

        data.data = matchs_list
      }

      if(menu_root == 3) return
      // 赛事列表 卡片数据
      this.handle_match_list_request_when_ok(data,true,true,true)

      let ts1 = Date.now();
      let mids_arr = []

      console.warn('matchs_list',matchs_list);

      ( matchs_list || [] ).forEach( match => {
        mids_arr.push(String(match.mid))
        match.api_update_time = ts1
      })

      // 联赛数据
      this.set_match_base_info_by_mids_info(matchs_list,mids_arr,ts1)

    },
    // 根据 mid 获取 联赛列表数据
    get_match_list_by_mid_for_base_data_res(mid,csid,type){

      // 元数据 
      const { mi_tid_mids_res = {},base_data_res = {} } = $BaseData

      let matchs_list = []
      // 常规赛种/联赛  滚球 ld  未开赛 nd 
      let livedata = (( mi_tid_mids_res[mid] || {} )[type] || []).map(item=> ({tid: item.tid, csid,mids:item.mids.join(','), mids_info:item.mids })) || []
    
      // 常规赛种 联赛 滚球 下面的赛事信息
      livedata.filter(item=> {
        let match_list = (base_data_res.matchsList || [] ).find(page=> item.mids_info.includes(page.mid) ) || {}
        // 空的不要
        if(match_list.mid){
          matchs_list.push(match_list) 
        }
      }) || []

      return matchs_list
    }
  },
  mounted() {
    this.$utils.load_video_resources()
  },
  destroyed() {
    clearTimeout(this.axios_debounce_timer)
    clearTimeout(this.axios_debounce_timer2)
    clearInterval(this.check_match_last_update_timer_id)
    for(let key in this.timer_obj) {
      clearTimeout(this.timer_obj[key]);
    }
 
    //热门推荐定时器
    if(this.hot_match_list_timeout){
      clearTimeout(this.hot_match_list_timeout)
    }
    this.debounce_throttle_cancel();
    this.$root.$off('match_list_show_mids_change', this.show_mids_change);

    this.destroyed = true;
    this.$root.$off(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, this.update_collect_data);
    this.$root.$off(this.emit_cmd.EMIT_MX_COLLECT_COUNT2_CMD, this.mx_collect_count);
    // 站点 tab 休眠状态转激活
    this.$root.$off(this.emit_cmd.EMIT_SITE_TAB_ACTIVE, this.emit_site_tab_active);
    clearTimeout(this.virtual_list_timeout_id);
    clearTimeout(this.switch_timer_id);
    clearTimeout(this.get_match_list_timeid)
    // 调用列表接口
    this.$root.$off(this.emit_cmd.EMIT_FETCH_MATCH_LIST, this.fetch_match_list);
    this.$root.$off(this.emit_cmd.EMIT_API_BYMIDS, this.api_bymids);
    this.$root.$off(this.emit_cmd.EMIT_MX_COLLECT_MATCH, this.mx_collect_match);
 

    //引用数据销毁
    this.match_list= []
    this.match_list_card= {}
 
    this.timer_obj = {}
  }
}
export default match_list;
