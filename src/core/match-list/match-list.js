import { mapGetters, mapActions } from "vuex";
import { api_match } from "src/public/api/index.js";
import *  as api_websocket from "src/public/api/module/socket/socket_api.js";
import time_format from "src/public/mixins/common/time_format";

import global_mixin from "src/public/mixins/global/global_mixin.js";
import msc_mixin from "src/public/mixins/common/msc.js";

import scrollList from "src/public/components/cus_scroll/scroll_list.vue"

import Refresh from "src/public/components/refresh/refresh.vue";

import match_list_card_calss from "src/project/yabo/mixins/match_list/match_list_card_class.js";
import match_list_data_class from "src/public/utils/dataClassCtr/match_list_data.js";
import video from "src/public/utils/video/video.js"

const match_list = {
  mixins: [
    time_format,
    global_mixin,
    msc_mixin
  ],
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
  provide(){  //父组件provide注入数据源
    return {
      match_list_data: this.match_list_data,
      match_list_card: this.match_list_card,
    }
  },
  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
      menu_obj: $menu.menu_obj,
      // 数据请求状态
      load_data_state: "loading",
      // 点击头部刷新弹出 loading 蒙层
      show_refresh_mask:false,
      // 列表数据
      match_list: [],
      // 赛事主列表容器卡片逻辑处理类
      match_list_card: new match_list_card_calss(this),
      // 赛事主列表容器卡片逻辑处理类
      match_list_data: new match_list_data_class(),
      // 固定在顶部的头高度
      fixed_header_height: "36px",
      // 收藏数量
      collect_count: 0,
      // 是否静默运行(socket、refresh按钮)
      backend_run: false,
      //  订阅所需 赛事ID
      skt_mid: {},
      //  订阅所需 盘口ID
      skt_hpid: "",

      /** WS 相关 *********************************/
      socket_name: "match_list",
      wsl: sessionStorage.getItem("wsl"),
      // 第一场虚拟赛事
      // 当列表没拉到数据时  每3秒拉一次
      virtual_list_timeout_id:0,
      time:null,
      // 吸顶高度
      sticky_top:{
        // 赛事状态 | 赛种类型 吸顶高度
        type:0,
        // 联赛名称吸顶高度
        league:0,
      },
      // 是否展示强力推荐
      is_show_hot: false,
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
      // 中间列表是列表|收藏
      vx_layout_list_type: "get_layout_list_type",
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
      // 1001-足球 1002-赛狗 1004-篮球 1007-泥地赛车 1008-卡丁车 1009-泥地摩托车 1010-摩托车 1011-赛马 1012-虚拟马车赛

      // 足球(1001) | 篮球(1004)  足球菜单ID（30054）篮球菜单ID（30056） 使用 tpl1
      if ([1001, 1004, 30054, 30056].includes(+this.menu_data.cur_level2_menu)) {
        match_tpl = 'virtual-match-tpl1';
      } else {
        match_tpl = 'virtual-match-tpl2';
      }

      return match_tpl;
    },

    // 前端控制是否禁用收藏功能
    enable_collect_api() {
        return window.env.config.ENABLE_COLLECT_API;
    }
  },
  watch: {
    // 监听当前  菜单 key 变化
    'menu_data.match_list_data_key':{
      handler(cur,old){
        // console.info(cur);
        // 清除过滤条件
        this.vx_set_remove_filter_condition()
        // 非电竞收藏日期切换
        if(!($menu.menu_data.is_esports && $menu.menu_data.cur_level1_menu != 'play' && cur && old && cur.substr(0,cur.length-2) == old.substr(0,old.length-2))){
          // 上次是收藏列表时重定位到列表
          this.vx_set_layout_list_type("match");
        }
        // 获取赛事列表数据
        this.fetch_match_list()
        // 设置联赛吸顶高度
        this.set_sticky_top()
      },
      immediate: true
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
      // 设置联赛吸顶高度
      this.set_sticky_top()
    },
    // 是否显示强力推荐
    is_show_hot(){
      // 设置联赛吸顶高度
      this.set_sticky_top()
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
    },
    "match_list_card.match_list_card_key_arr":{
      handler(cur,old){
        // 当收藏列表没数据的时候跳转列表页11
        if (this.vx_layout_list_type === 'collect' && this.$route.name=='home' && _.get(this.match_list_data, 'match_list.length')==0) {
          this.vx_set_layout_list_type("match");
          // 获取赛事列表数据
          this.fetch_match_list()
          // 设置联赛吸顶高度
          this.set_sticky_top()
        }
      },
      immediate: true
    },
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
    this.$root.$on(this.emit_cmd.EMIT_MX_COLLECT_COUNT_CMD, this.update_collect_data);
    this.$root.$on(this.emit_cmd.EMIT_MX_COLLECT_COUNT2_CMD, this.mx_collect_count);
    this.$root.$on(this.emit_cmd.EMIT_SYNCH_FROM_DETAIL, this.synch_from_detail);
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
      // 设置当前列表是列表还是收藏
      vx_set_layout_list_type: "set_layout_list_type",
      // 错误信息
      set_error_data: 'set_error_data',
      // 虚拟体育右侧
      vx_set_vsport_params: "set_vsport_params",
      // 移除选择后初始化
      vx_set_remove_filter_condition:"set_remove_filter_condition",
      // 滚动时是否显示banner
      set_is_roll_show_banner: "set_is_roll_show_banner",
      // 是否显示banner
      set_is_show_banner: "set_is_show_banner",
      // 选择的筛选数据
      vx_set_filter_select_obj: "set_filter_select_obj",
      //设置是否全选
      set_filter_checked_all: "set_filter_checked_all",
      // 清空上次筛选数据
      remove_pre_filter_select_obj: "remove_pre_filter_select_obj",
      //获取保存的滚动高度
      set_retain_scroll_obj:"set_retain_scroll_obj"
    }),
    /**
     * @description 请求数据
     * @param  {boolean} is_socket   是否 socket 调用
     * @param  {boolean} cut   是否 切换右侧详情  true 不切换
     * @param {Object} params 其他参数
     */

    fetch_match_list(is_socket = false, cut) {
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

      // 更新列表模板编号 和请求参数
      $menu.set_match_tpl_number()
      $menu.set_match_list_api_params()

      // 设置列表接口 和 参数
      let api = api_match[$menu.match_list_api_name]
      let _params = _.clone($menu.match_list_api_params)
      let match_list_api_type = $menu.match_list_api_type

      let send_match_list_request = () => {
        /**返回数据处理************/
        api && api(_params).then( res => {
          // 组件和路由不匹配 菜单id不匹配
          if((this.$route.name == 'details' && this.page_source != 'details') || this.destroyed  || _params.euid != $menu.match_list_api_params.euid) return

          let data = _.get(res,'data',{})

          this.api_error_count = 0
          if(data.code == 200){
            if(match_list_api_type == 'league_list') {
              this.mx_list_res(data,is_socket,cut);
            } else {
              this.mx_use_list_res(data, is_socket,cut);
            }
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
          console.error(err)
          this.set_error_data({
            site: 'version_mixin--fetch_match_list',
            error: err
          })
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
     * @description 常规赛事右侧切换
     * @param {*} cut 列表多行切换
     * @param {*} params
     */
       regular_events_set_match_details_params(cut,params){
        if(this.match_details_params_timer){
          clearTimeout(this.match_details_params_timer)
        }
        this.match_details_params_timer = setTimeout(() => {
          if(!cut) this.vx_set_match_details_params(params)
        }, 200);
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

      // 更新列表模板编号 和请求参数
      $menu.set_match_tpl_number(true)
      $menu.set_match_list_api_params(true)
      let api = api_match[$menu.match_list_api_name]
      let _params = _.clone($menu.match_list_api_params)


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
        if($menu.menu_data.is_esports){
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
        console.error(err)
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
   * @return {undefined} undefined
   */
    mx_list_res(data, backend_run,cut) {
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
          this.mx_collect_count()
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
          this.vx_set_filter_select_obj(new_filter)
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
          if($menu.menu_data.match_tpl_number == 18){
            // 冠军玩法 调用接口切换右侧
            this.mx_autoset_active_match();
          }else if(!$menu.menu_data.is_esports){
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
      }
    },
    /**
     * @description 处理服务器返回的 列表 数据 ---滚球
     * @param {object} data   服务器返回数据
     * @param {boolean} backend_run   是否静默拉取
     * @param  {boolean} cut   是否 切换右侧详情  true 不切换
     * @return {undefined} undefined
     */
    mx_use_list_res(data, backend_run,cut) {
      let code = _.get(data, "code");
      let type_name = this.vx_cur_menu_type.type_name;
      clearTimeout(this.virtual_list_timeout_id)

      // 是否虚拟体育
      let is_virtual = $menu.menu_data.is_virtual_sport
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
        this.mx_collect_count()

        if (!backend_run) {
          if(!is_virtual || is_search){
            // 非虚拟体育——设置赛事列表选中赛事
            if($menu.menu_data.match_tpl_number == 18 || this.vx_cur_menu_type.type_name == 'winner_top'){
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
          this.vx_set_vsport_params({
            csid: 0,
            tid: 0,
          });
          this.virtual_list_timeout_id = setTimeout(()=>this.fetch_match_list(true),3000);
          this.load_data_state = "empty";
        }
        else if (!backend_run) {
          // this.load_data_state = "empty";
          // 如果是滚球并且不是全部  把当前菜单数量设为0  并自动切换菜单
          if(this.$route.name == 'home' && type_name == 'play' && $menu.menu_data.cur_level2_menu != '30001'){
            let obj = {
              menuId:$menu.menu_data.cur_level2_menu,
              count:0
            }
            $menu.ws_update_menu([obj])
            $menu.menu_change(2,$menu.auto_select_menu_id_by_list($menu.menu_data.top_sport_menu_list))
          }else if(this.$route.name == 'home' && $menu.menu_data.cur_level1_menu != 'hot' && this.vx_layout_list_type !== 'collect'){
            this.get_hot_match_list()
          }else{
            this.load_data_state = "empty";
          }
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
          this.vx_set_vsport_params({
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
     * @description 更新收藏数据
     * @param  {object} params  {type:操作类型}
     * @return {undefined} undefined
     */
    update_collect_data(params) {
      // 全局收藏开关关闭时不更新收藏数量
      // 前端开    后台开       >开
      // 前端开    后台关       >关
      // 前端关    后台开       >关
      // 前端关    后台关       >关
      if(!this.enable_collect_api || !this.get_global_switch.collect_switch) {
        return
      }

      switch (params.type) {
        // 更新收藏数
        case "remove":
          if (params.match && params.match.mf) {
            this.mx_collect_count();
          }
          break;
        // 重新收藏赛事
        case "bet":
          // this.fetch_match_list(true); // 取消拉去接口
          if(_.isArray(params.mids)) {
            let mids = params.mids;
            for(let i=0;i<mids.length;i++) {
              let mid = mids[i];
              let match = this.match_list_data.mid_obj['mid_'+mid] || {};
              //冠军联赛收藏
              if($menu.menu_data.match_tpl_number == 18){
                this.match_list_card.update_league_collect_data(mid)
              }else{
                match.mf = 1;
              }
            }
          }
          this.mx_collect_count();
          break
        // 设置收藏状态
        case "set_status":
          let match = this.match_list_data.mid_obj['mid_'+params.mid] || {};
          if(match.mid){
            match.mf = params.mf
            this.set_collect_count({ type : "inc",count: params.mf ? 1 : -1});
          }
          break
      }
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
          (this.destroyed ||$menu.menu_data.is_virtual_sport) && this.$route.name !== "search" ||
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
        mids = this.$matchlist.show_mids
      }
      // 是否可视区域赛事改变
      else if(is_show_mids_change){
        mids = this.$matchlist.show_mids
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

      let params = {
        mids:mids.join(","),
        cuid: this.vx_get_uid,
        euid: $menu.match_list_api_params.euid,
        orpt: $menu.match_list_api_params.orpt,
        sort: this.vx_match_sort
      }
      if(tabs.length > 0) {
        params.tabs = tabs;
      }

      let cur_level1_menu = $menu.menu_data.cur_level1_menu
      // 非滚球传 玩法ID
      if (cur_level1_menu != "play" && this.$route.name != "search") {
        params.pids = $menu.match_list_api_params.pids;
      }

      //today：今日  early：早盘 角球玩法
      params.cos = $menu.is_corner_menu() || params.orpt == 25 ? 1 : 0;

      // 冠军去参数
      if(['winner_top'].includes(cur_level1_menu)) {
        delete params.euid
      }
      let api
      // 电竞
      if($menu.menu_data.is_esports && this.$route.name !== "search"){
        api = api_websocket.get_esports_by_mids
        params = {
          mids: mids.join(","),
          csid: $menu.match_list_api_params.csid,
          cuid: this.vx_get_uid,
        }
        if($menu.menu_data.is_esports_champion){
          params.category = 2
        }
      }else{
        api = api_websocket.get_match_base_info_by_mids
      }

      //添加内部参数
      if(inner_param) params.inner_param = inner_param

      let by_mids_fun_count = 0;
      let by_mids_fun = ()=>{
        // HTTP拉取最新信息合并
        api(params).then( res => {
          this.set_home_loading_time_record('ok');
          // 组件和路由不匹配
          if((this.$route.name == 'details' && this.page_source != 'details') || this.destroyed) return
          //更新电竞右侧视频
          if($menu.menu_data.is_esports && this.$route.name !== "search" && !is_first_load) {
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
          console.error(err)
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
     * @description 收藏联赛、赛事
     * @param  {object} params {type:"match||leagues",match:"单前赛事信息",matc_index"当前赛事在列表中的 index"}
     * @return {undefined} undefined
     */
    mx_collect({ type = "match", match, match_index }) {
      // 前端开    后台开       >开
      // 前端开    后台关       >关
      // 前端关    后台开       >关
      // 前端关    后台关       >关
      if(!this.enable_collect_api || !this.get_global_switch.collect_switch) {
        return  this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("msg.msg_09"));
      }
      if($menu.menu_data.match_tpl_number == 18){
        type = 'champion'
      }
      // 联赛收藏
      if (type == "leagues") {
        this.mx_collect_leagues(match);
        // 冠军收藏
      } else if (type == 'champion') {
        this.mx_collect_leagues(match, true);
        // 赛事收藏
      } else {
        this.mx_collect_match(match, match_index);
      }
    },
    /**
     * @description 联赛收藏
     * @param  {object} match  单场赛事信息
     * @param  {boolean} is_champion  是否冠军收藏
     * @return {undefined} undefined
     */
    mx_collect_leagues(match, is_champion) {
      let cur_collect_state = Number(!match.tf);
      let _params = {
        tid: match.tid,
        cuid: this.vx_get_uid,
        cf: cur_collect_state
      };
      //冠军收藏
      if (is_champion) {
        _params = {
          mid: match.mids,
          cuid: this.vx_get_uid,
          cf: cur_collect_state
        };
      }
      api_match.post_collect_leagues(_params).then(res => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data");
        if (code == 200 && data == 1) {
          match.tf = cur_collect_state
          let mids_arr = this.match_list_card.update_league_collect_data_and_get_mids(match.tid,cur_collect_state)
          //跟新原数据联赛收藏状态
          this.match_list_data.set_league_list_collect(match.tid,cur_collect_state,[1,3].includes(this.match_list_card.match_list_mapping_relation_obj_type))
          mids_arr.forEach( mid => {
            let match_item = this.match_list_data.mid_obj['mid_'+mid] || {}
            match_item.tf = cur_collect_state
            match_item.mf = cur_collect_state
            // 在收藏列表页 移除收藏
            if (this.vx_layout_list_type == 'collect' && !cur_collect_state) {
              // 移除联赛卡片
              this.match_list_card.remove_league(match.tid)
              let match_length
              if($menu.menu_data.is_esports){
                match_length = _.get(this.match_list_data.league_list_obj,'livedata.length',0) + _.get(this.match_list_data.league_list_obj,'nolivedata.length',0)
              }else{
                match_length = this.match_list_data.match_list.length
              }
              // 赛事数量为0 设置暂无数据
              if(match_length == 0){
                this.load_data_state = 'empty'
              }
            }
          })

        } else {
          this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t('common.collect_toast'))
        }
        // 获取列表最新的收藏数量
        this.mx_collect_count();
      }).catch((err) => {
        this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t('common.collect_toast'))
      });
    },
      /**
     * @description 赛事收藏
     * @param  {object} match  单场赛事信息
     * @return {undefined} undefined
     */
    mx_collect_match(match) {
      // 前端开    后台开       >开
      // 前端开    后台关       >关
      // 前端关    后台开       >关
      // 前端关    后台关       >关
      if(!this.enable_collect_api || !this.get_global_switch.collect_switch){
        return  this.$root.$emit(this.emit_cmd.EMIT_SHOW_TOAST_CMD, this.$root.$t("msg.msg_09"));
      }
      let cur_collect_state = Number(!match.mf)
      let _params = {
        mid: match.mid,
        cuid: this.vx_get_uid,
        cf: cur_collect_state
      }
      api_match.post_collect_match(_params).then(res => {
        let code = _.get(res, "data.code");
        let data = _.get(res, "data.data");
        if (code == 200 && data == 1) {
          // 在收藏列表页 移除收藏
          if (this.vx_layout_list_type == 'collect' && !cur_collect_state) {
            // 移除赛事
            this.match_list_card.remove_match(match.mid)
          } else {
            match.mf = cur_collect_state;
          }
          this.set_collect_count({
            type:cur_collect_state ? 'inc' : 'dec',
            count:1
          })
          //通知热门推荐收藏状态变化
          this.$root.$emit(this.emit_cmd.MATCH_TO_HOT_COLLECT,{mid : _params.mid,mf : cur_collect_state})
        }
      });
    },
    /**
     * @description 赛事收藏数量
     * @param  {object} data 设置参数
     * @return {undefined} undefined
     */
    mx_collect_count(data) {
      // 串关|虚拟体育|滚球电子竞技|全局收藏开关关闭时 不请求收藏数量
      // 前端开    后台开       >开
      // 前端开    后台关       >关
      // 前端关    后台开       >关
      // 前端关    后台关       >关
        if( !this.enable_collect_api || !this.get_global_switch.collect_switch || $menu.menu_data.is_virtual_sport || this.vx_layout_cur_page.cur == "search" || (this.vx_cur_menu_type.type_name == 'play' && $menu.menu_data.is_esports)){
            return
        }
      if(typeof data == 'object'){
        this.set_collect_count(data)
        return
      }

      let _params,api;

      _params = _.clone($menu.match_list_api_params)
      // 电竞
      if($menu.menu_data.is_esports){
        api = api_match.post_collect_count_es
      }else{
        api = api_match.post_fetch_collect_count
        // 热门赛事
        if(_params.euid == 30199){
          _params.hotMatches = 1
        }
      }

      // 冠军聚合页
      if(this.vx_cur_menu_type.type_name == 'winner_top'){
        _params.outrightMatches = 1
        // _params.sportId = ""
      }

      delete _params.cps
      delete _params.cpn
      api(_params).then(res => {
        let code = _.get(res, "data.code");
        if (code == 200) {
          let count = _.get(res, "data.data",0);
          this.set_collect_count({
            type:'set',
            count
          })
        }
      });
    },
    /**
     * @Description 设置收藏数量
     * @param {object} data data.type 设置类型 set 直接赋值，inc 递增，dec 递减；   data.count  数量
     * @param {undefined} undefined
    */
    set_collect_count(data){
      let count = Number(data.count)
      switch(data.type){
        case 'set':
          this.collect_count = count
          break
        case 'inc':
          this.collect_count += count
          break
        case 'dec':
          count = this.collect_count - count
          this.collect_count = Math.max(0,count)
          break
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
    ws_c8_subscribe() {
      let match_list = []
      this.$matchlist.show_mids.forEach( mid => {
        let match = this.match_list_data.mid_obj['mid_'+mid]
        if(match){
          match_list.push(match)
        }
      })
      if(match_list.length==0) return;
      let _skt_mid_obj = this.$utils.ws_c8_obj_format(match_list);
      match_list.map(match => {

        let match_c8 = null;
        match.hpsPns && match.hpsPns.map(item => {
          match_c8 = _skt_mid_obj[match.mid];
          if (match_c8) {
            if (match.tpl_id == 18) {
              match_c8.hpids.push('*');
            } else {
              match_c8.hpids.push(item.hpid)
            }
          }
        })
        if(match.cosCorner) {
          _.forEach(["113","114","111","119","121","122"], item=>{
            if(!match_c8.hpids.includes(item)) {
              match_c8.hpids.push(item);
            }
          });
          // match_c8.hpids.push(...[113,114,111,119,121,122]); // 角球玩法
        }
        if(match.cosOvertime) { // 加时赛玩法
          _.forEach(["126","128","127","129","130","332"], item=>{
            if(!match_c8.hpids.includes(item)) {
              match_c8.hpids.push(item);
            }
          });
          // match_c8.hpids.push(...[126,128,127,129,130,332]);
        }
        if(match.cosPenalty) { // 点球大战玩法
          _.forEach(["333","335","334"], item=>{
            if(!match_c8.hpids.includes(item)) {
              match_c8.hpids.push(item);
            }
          });
          // match_c8.hpids.push(...[1333,335,334]);
        }
        if(match.cosPromotion) { // 晋级赛玩法
          _.forEach(["135","136"], item=>{
            if(!match_c8.hpids.includes(item)) {
              match_c8.hpids.push(item);
            }
          });
          // match_c8.hpids.push(...[135,136]);
        }
        if(match.cosPunish) { // 罚牌玩法
          _.forEach(["310","306","307","311","308","309"], item=>{
            if(!match_c8.hpids.includes(item)) {
              match_c8.hpids.push(item);
            }
          });
          // match_c8.hpids.push(...[310,306,307,311,308,309]);
        }
      })
      // console.log(`===22222====专业版订阅的赛事=============skt_mid_obj:${JSON.stringify(_skt_mid_obj)}`);
      this.skt_mid = _skt_mid_obj;
    },
    refresh_c8_subscribe() {
      if(this.SCMD_C8){
        this.ws_c8_subscribe();
        // 订阅赛事
        this.SCMD_C8();
      }
    },
    /**http://172.21.165.200:8899/?token=b28587eb3b123fb856ebc2c0caec3ce46887ce36&m=200&s=01&pb=1&tag=01&jz=1&ignore_iframe_pc=1&gr=common&api=ylG8TrA69kpcnqFtY0FgMwVvCiBsnryXzlUcuQeO/l78qLo7uoVED7yAZ5Ysa00t&env=line1
     * 从详情同步数据到列表
     * @param {*} res
     */
    synch_from_detail(res) {
      // 冠军或者详情页 不处理
      if($menu.menu_data.match_tpl_number == 18 || this.$route.name == 'details'){
        return
      }
      let match_list = []
      _.merge(match_list, _.get(res,'data.data.baseData',[]))
      if(match_list.length > 0){
        let mids_arr = match_list.map(match => match.mid)
        // // 设置列表数据仓库
        this.match_list_data.compute_match_list_all_data(match_list,true)
        // 重新计算赛事样式
        this.match_list_card.recompute_match_list_style_obj_and_match_list_mapping_relation_obj_by_matchs(mids_arr)
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
      this.$matchlist.show_mids.forEach( mid => {
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
    /**
     * @Description 设置吸顶高度
     * @param {Object}
    */
    set_sticky_top(){

      let type_name = this.vx_cur_menu_type.type_name
      let obj = {
        type:32,
        league:32
      }

      // 搜索页面
      if(this.$route.name == 'search'){
        obj = {
          type:36,
          league:74
        }
      }
      // 冠军聚合页
      else if(type_name == 'winner_top'){
        obj = {
          type:84,
          league:122
        }
      }
      // 非滚球电竞
      else if($menu.menu_data.is_esports && !['hot','play'].includes(type_name)){
        obj = {
          type:196,
          league:196
        }
      }
      // 冠军 并且不是早盘
      else if($menu.menu_data.match_tpl_number == 18 && type_name != 'early'){
        obj = {
          type:40,
          league:40
        }
      }
      // 今日
      else if(type_name == 'today'){
        obj = {
          type:36,
          league:74
        }
      }
      // 滚球
      else if(type_name == 'play'){
        obj = {
          type:84,
          league:122
        }
        if(this.is_show_hot){
          obj = {
            type:36,
            league:74
          }
        }
         //虚拟体育
        if(this.menu_data.is_virtual_sport){
          // 虚拟足球
           if(this.menu_data.cur_level2_menu =="30054"){
              obj = {
                type:160,
                league:20
              }
             }else{
               obj = {
                 type:117.5,
                 league:20
               }
             }
         }
      }
      // 早盘
      else if(type_name == 'early'){
        obj = {
          type:90,
          league:90
        }
        if(this.is_show_hot){
          obj = {
            type:36,
            league:74
          }
        }
      }
      // 串关
      else if(type_name == 'bet'){
        obj = {
          type:86,
          league:124
        }
        if(this.is_show_hot){
          obj = {
            type:36,
            league:74
          }
        }
      }
      // 热门赛事
      else if(type_name == 'hot'){
        obj = {
          type:84,
          league:122
        }
      }
      // 收藏页面
      if(this.vx_layout_list_type == 'collect'){
        obj = {
          type:36,
          league:74
        }
        // 电竞收藏
        if($menu.menu_data.is_esports){
          obj = {
            type:196,
            league:196
          }
        }
        // 冠军收藏
        else if($menu.menu_data.match_tpl_number == 18 && type_name != 'winner_top'){
          obj = {
            type:40,
            league:40
          }
        }
      }
      this.fixed_header_height = obj.type + 'px'
      Object.assign(this.sticky_top,obj)
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
    //设置右侧参数定时器
    if(this.match_details_params_timer){
      clearTimeout(this.match_details_params_timer)
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
    // 从详情同步数据到列表
    this.$root.$off(this.emit_cmd.EMIT_SYNCH_FROM_DETAIL, this.synch_from_detail);

    //引用数据销毁
    this.match_list= []
    this.match_list_card= {}
    this.skt_mid= {}
    this.timer_obj = {}
  }
}
export default match_list;
