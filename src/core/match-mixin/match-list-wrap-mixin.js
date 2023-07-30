/*
 * @Date: 2020-08-26 21:45:34
 */
import {
  get_esports_match_by_mids,
  get_match_base_info_by_mids
} from "src/project/api/module/common/index.js";
import utils from "src/public/utils/utils.js";
import match_list_public_mixins from 'src/project/mixins/match_list/match_list_public_mixin.js'   // 赛事列表公共minxins
import axios_debounce_cache from "src/public/utils/http/axios_debounce_cache.js"
import { uid } from "quasar";
import match_list_mixin from "src/project/mixins/match_list/match_list_mixin.js";

export default{
  mixins: [match_list_public_mixins, match_list_mixin],
  data(){
    return {
      //当前调用的赛事列表接口方法
      current_invoke_api_func:null,
      //上次调详情的时间点
      prev_invoke_match_details_time:0,
      // 接口出错时，uid的 字符串
      last_uuid: ''
    }
  },
  created () {
    // 延时器
    this.sub_list_timeout = null;
    // 筛选使用到的定时器
    this.filter_timer = null;
    //mids接口更新数据时钟
    this.update_match_by_mids_timer = 0;
  },
  methods:{
    /**
     * 添加赛事对象前端使用字段 : 让球方
     * @param {Array} match_list
     * @return {Array}  filtered
     */
    match_list_init(match_list) {
      let filtered = [];
      // 当前选中的主菜单 类型，没有则是0
      let main_meu_type = _.get(this.get_current_menu, 'main.menuType') || 0;
      //附加前端逻辑字段
      match_list.forEach(match => {
        if(main_meu_type != 28){ // 28 赛果
          //ms = 1 为 已开赛 否则未完赛 ms: 3	结束
          if(match.ms == 3){
            return;
          }
          // 当前选中的日期（串关与早盘）
          let third_menu_type = _.get(this.get_current_menu,'date_menu.menuType');
          if(main_meu_type != 100 && third_menu_type != 100){
            if(match && match.hps && match.hps.length < 3){
              // 如果盘口投注项小于3个，则push 进hps
              for(let i1 = match.hps.length; i1 < 3;i1++){
                match.hps.push({
                  hl:[{}]
                });
              }
            }
          }
          if(!match.hps){
            match.hps = [];
          }
        }
        let assign_obj = { handicap_index:0 }
        // 如果当前赛事没有mid，有 matchId，则赋值给mid
        if(!match.mid && match.matchId) { match.mid = match.matchId }
        // 获取赛事的让球方 0未找到让球方 1主队为让球方 2客队为让球方
        assign_obj.handicap_index = this.get_handicap_index_by(match);
        // 对象浅拷贝
        Object.assign(match, assign_obj);
        // filtered 是 整个方法 return 的变量
        filtered.push(match);
      });
      return filtered;
    },
    /**
     * 投注框获取到最新赔率同步到列表页
     */
    bet_odd_synchronize_handle(data_dict){
      Object.keys(data_dict).forEach(mid => {
        let syn_match = data_dict[mid];
        if(syn_match.hls && syn_match.hls.length){
          syn_match.hls.forEach(hl => {
            this.matchCtr.setMatchHsStatus(hl.hid, (hl.hs ? hl.hs:0), hl.ol);
          });
        }
        this.matchCtr.set_match_odd_list(syn_match);
      });
    },
    /**
     * @description: 移除赛事列表中的赛事数据对象
     * @param {Function} callback 回调函数
     * @return {Undefined} Undefined
     */
    removeMatch(callback){
      if(callback)
        callback();
      if(!this.matchCtr.list.length){
        this.match_is_empty = true;
      }
    },
    /**
     * @description: 开赛倒计时到达时的回调函数
     * @param {Number} match_id 赛事id
     * @return {Undefined} Undefined
     */
    counting_down_start_ended_on(match_id) {
      this.match_status_changed({mid: match_id,mmp: 1});
    },
    /**
     * @description: 删空赛事列表
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    del() {
      this.matchCtr.clearData()
    },
    /**
     * @description: 页脚菜单事件
     * @param {Object} obj 选中的页脚项目对象
     * @return {Undefined} Undefined
     */
    footer_event(obj) {
      // 排序
      if (obj.text == "sortRules") {
        this.scroll_list_wrapper_by(0)
        this.get_match_data_list();
      }
      // 筛选
      else if (obj.text == "filter") {
        this.scroll_list_wrapper_by(0)
        this.get_match_data_list(()=>{
          clearTimeout(this.filter_timer)
          this.filter_timer = setTimeout(() => {
              if(this.subscription){
                this.subscription();
              }
            }, 2000);
        });
      }
      // 页脚刷新事件
      else if (obj.text == "footer-refresh")
      {
        if(this.menu_type == 28){
          // 赛果时
          this.get_match_data_list();
        } else {
          this.footer_refresh_match_list();
        }
        if (this.$route.name !== 'match_result') {
          this.$root.$emit(this.emit_cmd.EMIT_RE_STATISTICS_MATCH_COUNT);
        }
      }
      // 单纯刷新一个mid,例如十五分钟  或者  5分钟  临界点只刷新对应mid
      else if (obj.text == "mid-refresh")
      {
        this.get_match_info_upd([obj.mid],false,_.get(obj,'other'));
      }

      else if(obj.text == "footer-follow"){
        //即将改为收藏模式清除赛事列表数据
        if(!obj.before_status){
          this.matchCtr.clearData();
          this.is_data_requesting = true;
        }
      }
    },
    /**
     * @description: 改变收藏图标状态
     * @param {Object} params
     * @return {Undefined} Undefined
     */
    change_favorite_state(params) {
      let match = this.matchCtr.list[params.index];
      // 联赛收藏图标状态样式更新
      if(match && match.mid){
        if (params.item === "tf") {
          this.matchCtr.list.forEach(match_iterate => {
            let match_dic = this.matchCtr.mid_obj[match_iterate.mid];
            //冠军玩法的mid是唯一的
            let flag = [100,3000].includes(+this.menu_type) && match_iterate.mid == match.mid || (match_iterate.tid == match.tid && (![100].includes(+this.menu_type)));
            if(flag){
              if(match_dic){
                match_dic.mf = params.bool;
                match_dic.tf = params.bool;
              }
              match_iterate.mf = params.bool;
              match_iterate.tf = params.bool;
            }
          });
          match.mf = params.bool;
          match.tf = params.bool;
        }
      }

      // 收藏列表点击取消收藏后移除该赛事
      if(this.matchCtr.mid_obj[match.mid]){
        this.matchCtr.mid_obj[match.mid][params.item] = params.bool;
      }
      for(let i = 0,l = this.matchCtr.list.length; i < l;i++){
        let m = this.matchCtr.list[i];
        if(m.mid == match.mid){
          m[params.item] = params.bool;
          break;
        }
      }
      // 取消收藏
      if (!params.bool) {
        if (this.show_favorite_list) {
          this.del_collect(params.item, params.index);
        }
      }
    },
    /**
     * @description: 删除收藏赛事列表的赛事
     * @param {String} k 收藏类型赛事('mf')与联赛('tf')
     * @param {Number} index 赛事下标
     * @return {Undefined} Undefined
     */
    del_collect(k, index) {
      if (k == "tf") {
        // 冠军收藏时,mid是唯一的,tn不一定有值
        // get_current_menu.date_menu.menuType == 100 电竞冠军
        if(_.get(this.get_current_menu, 'date_menu.menuType') == 100){
          this.matchCtr.clearMidObj(this.matchCtr.list[index]);
        }else{
          let tid = this.matchCtr.list[index].tid;
          this.matchCtr.list.forEach(item => {
            if(item.tid == tid){
              this.matchCtr.clearMidObj(item);
            }
          });
        }
      } else {
        this.matchCtr.clearMidObj(this.matchCtr.list[index]);
      }
      if(this.matchCtr.list.length == 0){
        this.match_is_empty = true;
      }
      //列表页移除赛事
      this.run_process_when_need_recompute_container_list&&this.run_process_when_need_recompute_container_list(true);

    },
    /**
     * @description: 订阅赛事推送,列表滚动调用
     * @param {Undefined} Undefined
     * @return {Undefined} Undefined
     */
    subscription(){
      //赛果
      if( this.menu_type == 28 && !["detail_match_list"].includes(this.invok_source)
          || ['category'].includes(this.$route.name)) {
        return;
      }
      clearTimeout(this.sub_list_timeout);
      this.sub_list_timeout = setTimeout(() => {
        if(!this.matchCtr){return;}
        let now = new Date().getTime();
        // 当前时间，减去 上一次的 时间，小于1s，则return 掉，否则，调用订阅赛事推送
        if(now - this.prev_invoke_match_details_time < 1000){
          return;
        }
        this.prev_invoke_match_details_time = now;
        let sliced = this.matchCtr.list;
        //数组转对象
        this.matchIds = utils.ws_c8_obj_format(sliced);
        //列表除了电竞外，调用详情数据
        if(this.get_menu_type != 3000){
          this.get_match_info_upd(sliced.map(match => match.mid),'is-subscribe');
        }
      },100);
    },
    // 菜单变化，调用列表接口
    main_menu_change() {
      // 切换菜单，先清除所有数据仓库的数据
      this.matchCtr.init()
      // 回到页面顶部
      if(this.scroll_list_wrapper_by){
        this.scroll_list_wrapper_by(0);
      }
      // 去除上一次的筛选记录
      this.set_filter_list("");
      // 调用列表接口，渲染列表页面
      this.get_match_data_list();
    },
    /**
     * @description: 更新指定mid的赛事数据
     * @param {Array} match_list 指定mid的赛事接口返回后的赛事数组
     * @return {Undefined}
     */
    update_match_databy_mid(match_list){
      if (match_list && match_list.length) {
        // 添加赛事对象前端使用字段 : 让球方
        let list = this.match_list_init(match_list);
        list.forEach(item => {
          if(item && item.mid)
          {
            if(this.matchCtr.mid_obj[item.mid])
            {
              this.matchCtr.updMatchInfo(item);
            } else {
              this.matchCtr.addMatchInfo(item);
            }
            //应对主副盘变更时，投注框盘口和赔率的变化
            // if(this.get_bet_status == 1 || this.get_bet_status == 7 || this.get_bet_status == 5){
            //   this.update_ol(this.matchCtr.hn_obj);
            // }
            // 如果是滚球
            if(_.get(this.get_current_menu, 'main.menuType') == 1){
              if(![1,2,7,10,110].includes(+item.ms)){ // 赛事状态无效，清除该场赛事的 对象
                this.matchCtr.clearMidObj(item);
              }
            }
            //赛事状态无效  并且不是  赛果和冠军时，清除该场赛事的 对象
            if(!this.is_valid(+item.ms) && ![28,100].includes(+this.menu_type)){
              this.matchCtr.clearMidObj(item);
            }
          }
        });
      }
    },
    /**
     * @description: 0未开始  1滚球阶段  2暂停   3结束   4关闭     5取消
     *               6比赛放弃  7延迟    8未知   9延期  10比赛中断 110即将开赛
     * @param {Number} ms 赛事状态
     * @return {Boolean}
     */
    is_valid(ms){
      return [0,1,2,7,10,110].includes(+ms); //有效状态包括未开赛与进行中
    },
    get_match_info_upd(mid,is_subscribe,other){
       if(Array.isArray(mid)&&mid.length==0){
        return
       }
      this.get_match_info_upd_when_other(mid,is_subscribe,other)
    },
    /**
     * @description: 获取赛事详情并更新数据(C304,C303)
     * @param {Array|String} mid 赛事id
     * @param {object} other 其他参数
     * @return {Undefined} Undefined
     */
    get_match_info_upd_when_other(mid,is_subscribe,other){
      if( [100].includes(+this.menu_type) ||        // menu_type 100 冠军下 不再刷新接口
          (['category','virtual_sports'].includes(this.$route.name) || [4,900].includes(+this.menu_type)) && is_subscribe != "is-subscribe")
      {
        return;
      }
      if(!mid || !this.matchCtr) return;
      //非赛事列表中的赛事不更新
      if(Array.isArray(mid)){
        let flag = false;
        mid.forEach(_mid => {
          if(this.matchCtr.mid_obj[_mid]) flag = true;
        });
        if(!flag && is_subscribe != "is-subscribe")return;
      }else if(!this.matchCtr.mid_obj[mid]){
        return;
      }
      //
      let params = {
        mids: Array.isArray(mid) ? mid.join(',') : mid,
        cuid: this.get_uid,
        euid: this.get_current_sub_menuid,
        device:this.get_newer_standard_edition == 2 ? 'v2_h5_st' : 'v2_h5',
        //排序	 int 类型 1 按热门排序 2 按时间排序
        sort: this.sort_type
      };
      if(this.invok_source == 'detail_match_list'){
      	// 赛果菜单下赛事详情-精选赛事时逻辑处理
        delete params.euid;
        params.versionNewStatus = 'matcheHandpick';
      }
      if(!params.mids){
        return;
      }
      let api_axios_flg = 'get_match_base_info_by_mids'
      let api_func = get_match_base_info_by_mids;
      if(this.menu_type == 3000){
        api_func = get_esports_match_by_mids;
        api_axios_flg='get_esports_match_by_mids';
        if(_.get(this.get_current_menu,'date_menu.menuType') == 100){
          params.category = 2;
        }
        else{
          params.category = 1;
        }
      }

      if(_.get(other,'params')){
        params=other.params; //如果在其他情况下携带了参数 取其他情况下的参数
      }
      params.inner_param = 'is_by_mids'
      // this.send_gcuuid = uid();
      // params.gcuuid = this.send_gcuuid;
      //调用接口
      let fun_temp = ()=>{
        api_func(params).then(res => {
          // console.error(res.data);
          // 结果返回数据后整理一键展示/折叠字典
          this.combination_metches_list_data(res.data)
          // if(this.send_gcuuid != res.gcuuid) return;
          let mid_first = Array.isArray(mid) ? mid[0] : mid;
          if(this.matchCtr && this.matchCtr.mid_obj && this.matchCtr.mid_obj[mid_first] &&
            this.matchCtr.mid_obj[mid_first].handle_time &&
            this.matchCtr.mid_obj[mid_first].handle_time > res.ts) {
              return;
          }
          if(!this.matchCtr || !this.matchCtr.mid_obj || !this.matchCtr.mid_obj[mid_first]){
            return
          }
          // 拉取赛事详情数据导致的赛事比分变化不触发红升绿降
          clearTimeout(this.update_match_by_mids_timer);
          this.set_foot_ball_screen_changing(1);
          this.update_match_by_mids_timer = setTimeout(() => {
            this.set_foot_ball_screen_changing(0);
          },2000);
          // 1. 更新指定mid 盘口数据
          this.update_match_databy_mid(res.data);
          // 2.列表页 数据源赋值操作,为了排序
          const source_list = this.get_obj(this.matchCtr.match_list_data_sources)
          this.matchCtr.set_source_list(source_list);
          if(res.data && res.data.length){
            // 列表页盘口数据 获取后重新计算是否显示次要玩法
            this.run_process_when_need_recompute_container_list&& this.run_process_when_need_recompute_container_list(true);
            //  赛事状态变化
            this.match_status_changed(res.data[0]);
            if(this.matchCtr.mid_obj[mid_first]){
              this.matchCtr.mid_obj[mid_first].handle_time = res.ts;
            }
          }
          if(_.get(other,'cb')){
            other.cb(res.data); //如果在其他情况下携带了回调 调用回调
          }
        }).catch(err => {
          console.log('error',err)
        })
      }
      if(axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']){
        let instance = axios_debounce_cache[api_axios_flg]
        let info = instance.can_send_request(params);
        if(info.can_send){
          fun_temp();
          //直接发请求    单次数 请求的方法
        }else{
          // 记录timer
          if (this.timexasxsxsx) {clearTimeout(this.timexasxsxsx)}
          this.timexasxsxsx= setTimeout(() => {
            fun_temp();
             //直接发请求    单次数 请求的方法
             this.timexasxsxsx =null
          }, info.delay_time ||1000);
        }
      } else {
         //直接发请求    多 次数  循环请求 的方法
         fun_temp();
      }
    },
    /**
     * 赛事进行中
     * 0未开始 1滚球阶段 2暂停 7延迟 10比赛中断 110即将开赛
     * 3结束 4关闭 5取消 6比赛放弃 8未知 9延期
     * @param {Object} ms 赛事状态
     * @return {Undefined} Undefined
     */
    is_match_playing(ms){
      return [1,2,7,10,110].includes(ms * 1);
    },
    /**
     * 发起三级菜单请求之前
     */
    before_load_third_menu_handle(type){
      this.is_data_requesting = true;
    },
    /**
     * @description: 获取数据 赛事列表数据
     * @param {Object} params 获取赛事列表参数
     * @param {Function} cb 请求回调
     * @return {Undefined} Undefined
     */
    get_match_data_list(cb) {
      // 接口请求前置处理，接口参数处理
      const params =this.get_match_list_params_all();
      // 赛事接口调用前置条件处理  1.次要玩法折叠   2 重置到联赛折叠状态； 3. 骨架屏 显示
      this.match_list_api_prev_handle();
      // 调用列表接口   如  "/v1/m/matchesPB"
      let api_handle_result = this.get_matchs_api_func(params);
      // 新参数直接在此处进行生成新的params
      this.current_invoke_api_func = api_handle_result.api_handle;
      if(this.current_invoke_api_func){
        //接口调用
        let obj_ = {
          // axios api对象
          axios_api:this.current_invoke_api_func,
          // axios api对象参数
          params:params,
          // 唯一key值
          key:'list',
          error_codes:['0401038'],
          // axios中then回调方法
          fun_then: res => {
            // console.error(res);
            this.combination_metches_list_data(res.data)
            // 如果当前请求的 gcuuid 和 返回的 gcuuid 不是 一样的，说明不是 当前接口发起的请求
            if(this.last_uuid != res.gcuuid){
              // this.match_is_empty = true;
              // if(this.matchCtr && this.matchCtr.setList){
              //   this.matchCtr.setList([])
              // }
              this.is_close_load()
              return
            }
            if(_.get(res,'code')=='0401038'){
              const msg_nodata_22 = this.$root.$t('msg.msg_nodata_22')
              this.$toast(msg_nodata_22, 1500)
            }
              // 一.接口返回后页面逻辑与数据处理
              //  1. ol 盘口赔率同级别增加赛事类 csid   2 在首页模块的 热门模块下 添加 时间标题   3. 赛果对数据进行特殊处理(marketId=>matchId字段,matchId  => mid)
              let match_res_data = this.match_list_api_after_handle(res);

              // 二.设置页面显示的数据   （增加字段，改了排序，改变 接口原数据），最核心的方法
                  // 1.设置赛事对象字典对象 this.matchCtr.setListObj(match_res_data)
                  // 2.开赛 和 未开赛  和其他赛事(电竞,冠军) 时间 排序
                  // 3.列表页set_source_list 数据源赋值操作 this.matchCtr.set_source_list(data_source)
                  // 4. 更新 赛事列表 进程 综合 控制方法（虚拟滚性能核心方法）  => a.数据数组去重   b. 计算每个容器的高度   c.列表页可视区域数据this.matchCtr.setList('可视区域数据') d. 发布订阅
              this.set_match_list_page_data(match_res_data, cb);
              // 设置冠军玩法折叠字典
              this.set_champion_game_collapse(this.matchCtr.set_champion_game_collapse_object(match_res_data))
              // 三.页面数据设置后   处理
              // 1. 去除所有骨架屏
              // 2. 由详情页返回列表时，保持上次列表页滚动到的 mid 赛事位置
              this.after_set_match_list_data(params,match_res_data);
          },
          // axios中catch回调方法
          fun_catch: e => {
            if(this.show_favorite_list){
              if(this.invok_source == 'home_hot_page_schedule' ){
                // home页面热门菜单时的逻辑操作,异常时强显示nodata页面
                this.match_is_empty=true;
              } else if(this.show_favorite_list){
                // 收藏功能接口异常时强显示nodata页面
                this.match_is_empty=true;
              }
            }
            this.match_list_api_catch_handle(e,cb);
          },
          // 最大循环调用次数(异常时会循环调用),默认3次
          max_loop:2,
          // 异常调用时延时时间,毫秒数,默认1000
          timers:1100
        }
        // 短距离滚动标识
        this.set_allow_short_scroll(false);
        let api_axios_flg = api_handle_result.api_axios_flg;
        if(axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']){
          let instance = axios_debounce_cache[api_axios_flg]
          let info = instance.can_send_request(params);
          if(info.can_send){
            //直接发请求    单次数 请求的方法
            obj_.max_loop = 1;
            obj_.timers = 0;
            this.$utils.axios_api_loop(obj_);
          }else{
          // 记录timer
            if (this.timexasxsxsx) {clearTimeout(this.timexasxsxsx)}
            this.timexasxsxsx=    setTimeout(() => {
              //直接发请求    单次数 请求的方法
              obj_.max_loop = 1;
              obj_.timers = 0;
              this.$utils.axios_api_loop(obj_);
              this.timexasxsxsx =null
            }, info.delay_time ||1000);
          }
        } else {
            //直接发请求    多 次数  循环请求 的方法
            // axios_api轮询调用方法
            this.$utils.axios_api_loop(obj_);
        }
      }
    },
    /**
     * 页脚刷新按钮
     * @param {Object} params 接口参数
     */
    footer_refresh_match_list(){
      const params = this.get_match_list_params_all();
      let api_handle_result = this.get_matchs_api_func(params);
      this.current_invoke_api_func = api_handle_result.api_handle;
      delete params.hpsFlag;
      //接口调用
      let fun_temp = ()=>{
        if(this.current_invoke_api_func){
          this.current_invoke_api_func(params).then(res => {
            if(!res || res.code != 200 || !res.data || !res.data.length){
              return;
            }
            //接口返回后页面逻辑与数据处理
            let match_res_data = this.match_list_api_after_handle(res);
            // 添加赛事对象前端使用字段 : 让球方
            this.match_list_init(match_res_data);
            this.matchCtr.update_match_list(match_res_data);
          if( this.run_process_when_need_recompute_container_list_when_scroll){
            this.run_process_when_need_recompute_container_list_when_scroll(false,{force:1});
          }
          });
        }
      }
      let api_axios_flg = api_handle_result.api_axios_flg;
      if(axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']){
        let instance = axios_debounce_cache[api_axios_flg]
        let info = instance.can_send_request(params);
        if(info.can_send){
          //直接发请求    单次数 请求的方法
          fun_temp();
        }else{
        // 记录timer
          if(this.timexasxsxsx) {
            clearTimeout(this.timexasxsxsx)
          }
          this.timexasxsxsx = setTimeout(() => {
            //直接发请求    单次数 请求的方法
            fun_temp();
            this.timexasxsxsx =null
          }, info.delay_time ||1000);
        }
      } else {
          //直接发请求    多 次数  循环请求 的方法
          fun_temp();
      }
    },
    //  热门首页模块对比时间 过滤放在放在第一个item 上
    filter_event_title(arr) {
      for (let i =0; i < arr.length; i++) {
        // 如果数组只有一个的话
        if(arr.length == 1) {
          return arr[i].time_title = (new Date(+arr[i].mgt)).Format(this.$root.$t('time2'))
        }
        // 如果数组大于一个以上
        for(let j = 1; j < arr.length; j++){
          // 如果下标是第1个之后才执行下边
          if(i > 0){
            // 如果第一个和后边的其中一个相等，并且 第一个和上一个相比，不一样，time_title 塞进当前元素
            if((new Date(+arr[i].mgt)).Format(this.$root.$t('time2')) == (new Date(+arr[j].mgt)).Format(this.$root.$t('time2')) && ((new Date(+arr[i].mgt)).Format(this.$root.$t('time2')) !== new Date(+arr[i-1].mgt).Format(this.$root.$t('time2')))) {
              arr[i].time_title = (new Date(+arr[i].mgt)).Format(this.$root.$t('time2'))
            }
          } else { // 代表第0个元素
              arr[i].time_title = (new Date(+arr[i].mgt)).Format(this.$root.$t('time2'))
          }
        }
      }
    },
    // 今日 和 早盘 和 串关  保留上次筛选的列表内容
    // keep_filter(res_match_data) {
    //   // 保留上次筛选的东西 并且 上一次记录在 今日 或者 早盘 或者 串关的 下标,
    //   // 互相切换才有上次筛选保留的效果
    //   // get_prev_menu_type 是为了保存上次的菜单
    //   if([3,4,11].includes(+_.get(this.get_current_menu, 'main.menuType')) &&
    //     [3,4,11].includes(+this.get_prev_menu_type) && this.is_in_filtering()){
    //     let filter_data = []
    //     let data = {};
    //     res_match_data.forEach((item_1)=>{
    //       for (let f_tid in this.get_filter_list) {
    //         if (item_1.tid == f_tid) {
    //           filter_data.push(item_1)
    //           if(_.get(this.get_current_menu, 'main.menuType') != this.get_prev_menu_type){
    //             data[f_tid] = true
    //           }
    //         }
    //       }
    //     })
    //     if(_.get(this.get_current_menu, 'main.menuType') != this.get_prev_menu_type){
    //       this.set_filter_list(data);
    //     }
    //     // 如果有数据，则过滤出来
    //     if(filter_data.length>0) {
    //       return filter_data
    //     }else{ //  如果没有数据，则去除筛选的数据，并且当前选中的 主菜单type 赋值 上次选中的 主菜单type
    //       // 此处存在一种情况，就是当前筛选项没有数据 滞空了筛选项，后续数据又来了，比如ws推送 有时没有数据了 就清掉了
    //       this.set_filter_list("");
    //       this.set_prev_menu_type(+_.get(this.get_current_menu, 'main.menuType'));
    //       return false
    //     }
    //   }
    // },
    /**
     * @description: 获取数据 更新列表
     * @param {Function} callback 请求回调函数
     * @param {String} call_source 调用来源('sort-rules'排序，'ws pushed')
     * @return {Undefined} Undefined
     */
    get_match_list_req(callback,call_source,mid) {
      // 如果没有mid  或者是 虚拟体育  或者 (不在 首页 或者 不在列表页)
      if(!mid || this.menu_type == 900 || (!['home', 'matchList'].includes(this.$route.name))) {
        return;
      }
      let params = this.get_match_list_params_all();
      // params = _.cloneDeep(params);
      let api_handle_result = this.get_matchs_api_func(params);

      this.current_invoke_api_func = api_handle_result.api_handle;
      //
      let fun_temp = ()=>{
        if(this.current_invoke_api_func){
          this.current_invoke_api_func(params).then(res => {
            // console.error(res);
            let data_page = _.get(res,'data.data');
            if(!data_page){
              data_page = _.get(res,'data');
            }
            if (_.get(data_page, 'length', 0)) {
              // ws 推送过来拉取全量数据时
              // 前端进行  开赛 和 未开赛  和 其他赛事(电竞,冠军)   赛事阶段 排序
              data_page = this.get_obj(data_page);
              this.match_is_empty = false;
              let temp_ = this.matchCtr.listComparison(data_page,this.matchCtr.match_list_data_sources)
              this.update_match_to_list(temp_);
              if (callback) callback();
            }
            else{
              // this.match_is_empty = true;
            }
          })
          .catch((e) => {
            console.error(e);
            this.is_data_requesting = false;
          });
        }
      }
      let api_axios_flg = api_handle_result.api_axios_flg;
      if(axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']){
        let instance = axios_debounce_cache[api_axios_flg]
        let info = instance.can_send_request(params);
        if(info.can_send){
          //直接发请求    单次数 请求的方法
          fun_temp();
        }else{
          // 记录timer
          if (this.timexasxsxsx) {clearTimeout(this.timexasxsxsx)}
          this.timexasxsxsx=    setTimeout(() => {
            //直接发请求    单次数 请求的方法
            fun_temp();
            this.timexasxsxsx =null
        }, info.delay_time ||1000);
        }
      } else {
          //直接发请求    多 次数  循环请求 的方法
          fun_temp();
      }
    },

    // todo 重新方法临时保存,沟通后再行修改 统一入口
    get_match_list_params_all(){
      let params = null;
      // 一级菜单筛选类型 1滚球 2 即将开赛 3今日赛事 4早盘 11串关
      let main_menu_type = +this.menu_type; //菜单类型
      // 第一步 计算最基础参数
      params=this.get_base_params(main_menu_type);
      //第二步,传入第一步获得的参数 按照首页/详情/列表进行分流处理 其中列表中会第二次进行分流处理
      params=this.get_detail_params_by_invoke_source(params,main_menu_type);
      //附加当前请求的 gcuuid 全局检查
      params.gcuuid= uid()
      this.last_uuid = params.gcuuid
      // 第三步 对第二步获取到的结果再次进行后置加工，放在vuex 缓存中
      this.set_req_match_list_params(params);
      // 第四步 返回前三步计算的params
      return params;
    },

    get_base_params(main_menu_type){
      return {
        cuid: this.get_user ? this.get_user.userId:this.get_uid,
        euid: this.get_current_sub_menuid,
        // 一级菜单筛选类型 1滚球 2 即将开赛 3今日赛事 4早盘 11串关
        type: main_menu_type,
        //排序	 int 类型 1 按热门排序 2 按时间排序
        sort: this.sort_type,
        //标准版和简版 1为新手版  2为标准版
        device:['','v2_h5','v2_h5_st'][this.get_newer_standard_edition]
      };
    },

    get_detail_params_by_invoke_source(params,main_menu_type){
      //第一步根据路由名判断,第二步根据invoke_source或菜单进行分流 清晰化来龙去脉
      // 如果是在首页中
      if(this.$route.name == 'home'){
        if (this.get_hot_tab_item) { // 其他菜单
          //  菜单id
          params.euid = this.get_hot_tab_item.menuId;
          //  排序
          params.sort = 2;
          // 菜单类型
          params.type = this.get_hot_tab_item.menuType || (this.get_hot_list_item && this.get_hot_list_item.menuType);
          // 联赛id
          params.tid = this.get_hot_tab_item.field2;
        }
        if( [100,101,102,103].includes(+_.get(this.get_hot_tab_item,'field1'))) {
          // 获取 csid
          params.csid = this.get_hot_tab_item.field1;
        }
        // 如果是在首页中的精选
        if(_.get(this.get_hot_tab_item, 'index') == 0){
          params.sort = 2; // todo 电竞的sort首页中都是一
        }
      }
      // 赛果详情页 或者 详情页仅请求两个参数
      if(['result_details', 'match_result', 'category'].includes(this.$route.name)){
        params={
          sportId: _.get(this.get_detail_data, 'csid'),
          cuid: params.cuid
        }
      }
      // 如果是在列表中
      if(this.$route.name == 'matchList'){
        // 处于列表页时的详细计算
        params = this.get_match_params_detail(params,main_menu_type)
      }
      return params;
    },

    // 处于列表页时分流计算
    get_match_params_detail(params, main_menu_type){
      //竞彩足球
      if(main_menu_type == 30){
        params.euid = _.get(this.get_current_menu, 'main.menuId');
      }
      //赛果请求数据接口如果是赛果-->我的,投注type为29否则为28
      if(main_menu_type == 28){
        if(_.get(this.get_current_menu, 'sub')){
          if(_.get(this.get_current_menu, 'sub.menuType') == 29){
            params.type = _.get(this.get_current_menu, 'sub.menuType');
          }
          params.euid = _.get(this.get_current_menu, 'sub.menuId');
        }
      }
      // menuType == 100 电竞的冠军
      if(typeof _.get(this.get_current_menu,'date_menu.field1') != 'undefined'){
        if(_.get(this.get_current_menu,'date_menu.menuType') == 100){
          params.category = 2;
          params.md = '';
        }
        else{
          params.category = 1;
          params.md = _.get(this.get_current_menu,'date_menu.field1');
        }
      }
      //主菜单不为早盘,赛果,串关,电竞则移除参数的日期
      if(![4,28,11,3000].includes(main_menu_type)){
        delete params.md;
      }

      //列表的 虚拟体育相关
      if([1001,1002,1004,1011,1010,1009].includes(+params.euid)){
        let startTime = +params.md;
        const m_hour = 24 * 60 * 60 * 1000; // 24小时的毫秒数
        let endTime = startTime + (m_hour - 1000);
        params = {
          sportType:params.euid,
          startTime,
          endTime,
          isVirtualSport:1,
          page:{
            size: 100,
            current:1
          }
        };
        // 如果是在 赛果页面的 虚拟体育相关的 页面，则添加 tournamentId  参数
        if(_.get(this.get_current_menu, 'main.menuType') == 28) {
          params.tournamentId = _.get(this.get_level_four_menu, 'menuId');
          params.batchNo  = this.get_search_txt;
        }
      }

      //如果是在筛选的过程中
      if (this.is_in_filtering()) {
        // 如果筛选不是全部，并且 当前主菜单 等于(上一次 选择的主菜单，或者上一次选中的主菜单 不是 今日，早盘，串关），则执行下边代码块
        if(this.get_filter_list != this.$root.$t('footer_menu.all')){
          // 过滤出 tid（联赛id）
          let current_tids = [];
          for (let f_tid in this.get_filter_list){
            current_tids.push(f_tid)
          }
          if(current_tids.length){
            //虚拟体育赛果
            if(this.menu_type == 28 && [1001,1002,1004,1011,1010,1009].includes(this.get_curr_sub_menu_type)){
              params.tournamentId = current_tids.join(",");
            }else{
              // 如果是今日，早盘，串关
              if([3,4,11].includes(+this.menu_type)){
                params.tid = current_tids.join(",");
              }else{ //滚球->全部多选球类,冠军
                params.tid = current_tids.join(",");
              }
            }
          }
        }
      }

      if(main_menu_type){
        // 主菜单 == 3000时
        if(main_menu_type == 3000){
          // 电竞保存csid,否则不用保存csid
          params.csid = _.get(this.get_current_menu, 'sub.field1');
          this.set_current_esport_csid(params.csid);
          this.prev_export_csid = params.csid;
        }
        else{
          this.prev_export_csid = '';
          this.set_current_esport_csid('');
        }
      }

      params.hpsFlag = 0; // match中 hpsFlag 都为0 除开冠军或电竞冠军
      //赛事列表冠军或者电竞冠军/赛果不需要hpsFlag
      if(this.get_mm_is_champion() || main_menu_type == 28){
        delete params.hpsFlag;
      }

      return params;
    },

    /**
     * @description: 比分编号列表从小到达排序
     * @param {Object} msc 赛事比分数据
     * @return {Undefined} Undefined
     */
    msc_sort(msc) {
      if (!msc || !msc.sort) {
        return;
      }
      msc.sort((a, b) => {
        let r = 0;
        try {
          let numb_a = a.split("|")[0].split("S")[1] * 1;
          let numb_b = b.split("|")[0].split("S")[1] * 1;
          r = numb_a - numb_b;
        } catch (e) {console.error(e);}
        return r;
      });
    },
    /**
     * @description: 开赛 和 未开赛  和 其他赛事  (100（冠军）  3000（电竞）)  的   时间 排序
     * @param {Object} match_source_data_ 赛事源数据列表
     * @return {Object} 排序后的 数据
     */
    get_obj(match_source_data_) {
      if (match_source_data_ && match_source_data_.length) {
        let started = [],no_started = [],other_status_match = [];
        match_source_data_.forEach((item, i) => {
          item.key = item.mid;
          // 赛事比分排序
          this.msc_sort(item.msc);
          // 如果是电竞
          if(this.menu_type == 3000){
            other_status_match.push(item);
          }else if(this.menu_type == 28){ // 如果是赛果
            started.push(item);
          } else{  // 如果是正常的体育赛事
            if (item.ms == 1 || item.ms == 110) {
              started.push(item);
            } else if (item.ms == 0) {
              no_started.push(item);
            } else {
              other_status_match.push(item);
            }
          }
        });
        // 如果是今日，则在今日下边，每次ws 更新，从新排序
        if([1, 3].includes(+this.menu_type)){
          // 获取当前二级赛种子菜单列表
          const sub_menu_list = _.cloneDeep(this.get_sub_menu_list)

          // 滚球下对同一赛种csid归类，避免ws更新时，赛种csid间隔重复
          if (this.menu_type == 1 && this.get_sport_all_selected) {
            started = this.csid_same_sort(started, sub_menu_list)
          }

          started = this.tid_same_sort(started)
          no_started = this.tid_same_sort(no_started)
        }

        if(this.invok_source == 'detail_match_list'){
          return match_source_data_;
        }
        if(this.invok_source == 'home_hot_page_schedule'){
          // home页面热门菜单时的逻辑操作
          match_source_data_ = started.concat(no_started);
        } else if (this.menu_type == 1) { // 滚球(menuType=1)只显示进行中的比赛
          match_source_data_ = started;
        } else {
          match_source_data_ = started.concat(no_started);
        }
        if ([100,3000].includes(+this.menu_type)) {// 100（冠军）  3000（电竞）
          match_source_data_ = other_status_match;
        }
        if(this.menu_type == 28){ // 如果是 赛果
          match_source_data_ = started.concat(no_started).concat(other_status_match);
        }


      }
      return match_source_data_;
    },
    // 如果csid 一样，则聚在一起排序，以此类推
    csid_same_sort(data_list, ball_list) {
      if (!ball_list.length) {
        return data_list
      }

      let new_arr = []

      for(let i=0,len = ball_list.length;i< len;i++){
        let cur_csid_arr = data_list.filter(item => item.csid == ball_list[i].field1)
        if(cur_csid_arr){
          new_arr.push(...cur_csid_arr)
        }
      }
      return new_arr
    },
    // 如果tid 一样，则聚在一起排序，以此类推
    tid_same_sort(data_list) {
      let arr_tid = [],
          new_arr = []

      for(let item of data_list){
        if(arr_tid.indexOf(item['tid']) == -1){
          arr_tid.push(item['tid'])
        }
      }

      for(let i=0,len = arr_tid.length;i< len;i++){
        let cur_tid_arr = data_list.filter(item => item.tid == arr_tid[i])
        if(cur_tid_arr){
          new_arr.push(...cur_tid_arr)
        }
      }

      return new_arr
    },
    /**
     * @description: 赛事状态变化
     * @param {Object} state_changed ws推送的赛事变化对象
     * @return {Undefined} Undefined
     */
    match_status_changed(state_changed) {
      const _this = this;
      // console.error(state_changed);
      const match_data_list = this.matchCtr.list;
      let match_id = state_changed.mid;
      // 删除数据源对应赛事下标的赛事
      let delete_source = function() {
        let deleted_match = 0;
        for (let p = 0, l = match_data_list.length; p < l; p++) {
          let item = match_data_list[p];
          if (match_id == item.mid) {
            deleted_match = 1;
            // 删除数据仓库 一些数据操作
            _this.removeMatch(()=>{
              _this.matchCtr.clearMidObj(_this.matchCtr.list[p].mid);
            });
            p--;
            break;
          }
        }
        if(deleted_match&&_this.run_process_when_need_recompute_container_list_when_first_load_list){
          _this.run_process_when_need_recompute_container_list_when_first_load_list(true);
        }
      };
      // 删除已结束的赛事
      let delete_ended_match = () => {
        delete_source();
        this.$root.$emit(this.emit_cmd.EMIT_RE_STATISTICS_MATCH_COUNT);
      };
      // csid:12 拳击   开赛时间小于当前时间则移除
      let delete_boxing_match = () => {
        let c_match = _this.matchCtr.mid_obj[match_id];
        if(c_match && c_match.csid == 12){
          let server_now = _this.get_now_server();
          let now_sub = Number(c_match.mgt) - server_now;
          if(now_sub <= 0){
            delete_ended_match();
          }
        }
      };
      // 将 未开赛的 赛事转移至进行中
      let convert_to_playing = () => {
        // 找到指定赛事id的赛事下标
        let found_index = -1;
        for (let jj = 0, l = match_data_list.length; jj < l; jj++) {
          let item = match_data_list[jj];
          if(match_id == item.mid) {
            if(+state_changed.mmp < 1) return;
            // 如果 当前 已经开赛了，则 调出循环
            if(item.ms == 1 || item.ms == 110 || +item.mmp > 0){
              found_index = -1;
              break;
            }
            if (+item.ms < 1) {
              item.ms = 1
              found_index = jj
              jj--;
            }
            break;
          }
        }
        // 将赛事移动至列表开头
        if (found_index > -1) {
          let changed_match = match_data_list.splice(found_index, 1);
          this.$nextTick(() => {
            match_data_list.splice(0, 0, changed_match[0]);
          })
        }

      };
      //删除已结束的赛事
      if (999 == state_changed.mmp) {
        delete_ended_match();
        return;
      }
      // 查找到 当前赛事id，赛事阶段如果是  0 未开始，则 return 掉
      let found_match = match_data_list.filter(m => m.mid == state_changed.mid)[0];
      if (found_match) {
        if (found_match.mmp == 0 && state_changed.mmp == 0) {
          return;
        }
      }

      // 滚球：删除ms不为1的赛事
      if(this.menu_type == 1){
        if(state_changed.ms != null && typeof state_changed.ms != 'undefined' && ![1,110].includes(+state_changed.ms)){
          delete_ended_match();
        }
      }// 今日,早盘
      else if ([3, 4].includes(+this.menu_type)) {
        if (state_changed.mmp > 0 || state_changed.ms == 1 || state_changed.ms == 110) {
          if(this.menu_type == 4){ // 早盘: 将已开赛的赛事移除早盘
            delete_ended_match();
          }else{  // ‘今日’  将未开赛的赛事转移至进行中
            convert_to_playing();
          }
        }
        // csid:12 拳击   开赛时间小于当前时间则移除
        delete_boxing_match();
      }
    },
    is_in_filtering(){
      return !_.isEmpty(this.get_filter_list);
    },
    // 批量清除定时器
    clear_mixin_timer() {
      const timer_arr = [
        'sub_list_timeout',
        'filter_timer',
        'update_match_by_mids_timer',
      ]

      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
    },
  },
  destroyed () {
    this.clear_mixin_timer()
  },
}
