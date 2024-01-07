/*
 * @Author: Cronus
 * @Date: 2020-12-22 18:07:03
 * @Description: 虚拟体育首页主文件
 */
import virtual_sports_mixin from "src/core/vr/mixin/virtual-sports-mixin.js"
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { get_now_server } from 'src/core/utils/common/module/other.js'
// import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import { api_common } from "src/api/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { MatchDataWarehouse_H5_List_Common, MatchDataWarehouse_PC_List_Common, LOCAL_PROJECT_FILE_PREFIX,compute_css_obj } from "src/output/index.js"
const MatchDataBaseH5 = window.BUILDIN_CONFIG.IS_PC ? MatchDataWarehouse_PC_List_Common:MatchDataWarehouse_H5_List_Common;
export default {
  mixins:[virtual_sports_mixin],
  props:{
    menu_list:Array,
    params:Object,
    current_sub_menu:Object,
    is_user_refresh:Boolean,
    v_menu_changed:Number | String,
    v_match_router_ente:Number,
  },
  data(){
    return {
      show_debug:sessionStorage.getItem('wsl') == '9999',
      //当前选中的赛事id
      current_match_id:'',
      //赛事列表数据加载成功标识 用于初始化显示赛事列表
      match_list_loaded:0,
      //趋势图标显示标志
      trend_is_show:true,
      //联赛选中项下标
      tab_item_i:0,
      //批次(足球轮列表或赛马期列表等)
      no_title_list:[],
      //指定轮或期下的赛事列表
      match_list_by_no:[],
      //当前选中的播放的赛事
      current_match:{},
      //赛事列表获取到空数据标志
      match_list_is_empty:false,
      //足球，非足球页面切换组件判断
      ranking_list_change: false,
      //赛马或赛狗视频进程数据操作对象
      video_process_obj:{},
      is_all_end_notice:0,
      //第一次请求赛果的期号
      first_title_NO_:0,
      //接口无虚拟赛事
      no_virtual_match:false,
      //父组件销毁通知子组件销毁视频播放组件
      is_before_destroy:0,
      //重设tab下标
      is_reset_tab_i:0,
      virtual_data_loading:true,
      is_basket_ball_next_no:0,
      is_video_playing:false,
      //篮球开赛10秒后获取下一期赛事
      get_next_basketball_time:null,
      //10秒倒计时执行一次
      singleton_10second:false,
      //检测下一轮开赛时间刷新数据
      timer_super5:0,
      //赛事切换走势图
      before_match_tab_trend:0,
      // 虚拟体育赛果最终排名数据
      virtual_result_rank_data:[],
      // 顶部菜单切换状态
      top_menu_changed: false,
      // 当前联赛名称
      lengue_name: '',
      // 是否展开视频
      expend_video: true,
      // // 1:新手版 2:专业版
      // standard_edition,
      LOCAL_PROJECT_FILE_PREFIX,
      compute_css_obj,
      // 是否全部折叠
      is_expend_all: true,
      // 存储定时器id的映射
      interval_ids: new Map()
    }
  },
  created() {
    this.timer1_ = 0;
  },
  mounted(){
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_ARRIVED10, this.arrived10_handle).off,
      useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2, this.match_ended_status2_handle).off,
    ]
    this.match_ended_status2_handle();
  },
  methods:{
    set_current_league(data){VR_CTR.state.current_league = data},
    set_video_process_data(data){VR_CTR.state.video_process_data = data},
    set_prev_v_sports_params(data){VR_CTR.state.prev_v_sports_params = data},
    set_current_mid(data){VR_CTR.state.current_match_mid = data},

    // 顶部菜单切换状态改变
    handle_top_menu_change(status) {
      this.top_menu_changed = status
    },
    /**
     *@description 更新虚拟体育赛果最终排名数据，接口在子组件调用，数据由子组件传上来,目前只有泥地摩托车用到
     *@param {Array} arr 排名数据
     *@return {Undefined} undefined
     */
    send_virtual_result_rank_data(arr){
      if(this.sub_menu_type == 1009) {
        this.virtual_result_rank_data = arr
      }
    },
    /**
     * 提前10秒通知封盘
     * @params {Object} mid 赛事id,batchNo 期号
     */
    arrived10_handle({mid,batchNo}){
      this.match_list_all_batches.forEach(item=>{
        if(item.batchNo == batchNo){
          item.matchs.forEach(match=>{
            match.is_vr_lock = true;
          })
        }
      })
      // 旧代码，不适用复刻版倒计时10s封盘
      // if(this.match_list_by_no && this.match_list_by_no.length){
      //   this.match_list_by_no.forEach(m => {
      //     if(m.batchNo == batchNo){
      //       m.mhs = 1;  //赛事级别状态
      //     }
      //   });
      // }
      // if(this.sub_menu_type == 1004 && !this.singleton_10second){
      //   this.singleton_10second = true;
      //   this.get_score_basket_ball();
      // }
    },
    /**
     * 赛事结束检查是否该轮赛事全部结束,以便展示赛果
     */
    match_ended_status2_handle() {
      //获取赛事结束时的比分
      this.get_result_score();

      let is_all_end = true;
      if(!this.match_list_by_no || !this.match_list_by_no.length){
        is_all_end = false;
      }
      for (let i = 0; i < this.match_list_by_no.length; i++) {
        const m = this.match_list_by_no[i];
        if(this.current_batch.batchNo != m.batchNo){
          is_all_end = false;
          break;
        }
        if (m.match_status != 2) {
          is_all_end = false;
          break;
        }
      }
      //所有赛事结束时,状态改为锁盘11(可以看到赔率不能投注)
      if (is_all_end) {
        let mid_list = [];
        this.match_list_by_no.forEach(m => {
          mid_list.push(m.mid);
        });
        if (mid_list.length) {
          this.get_match_result(mid_list.join(','), () => {
            this.match_list_by_no.forEach(m => {
              m.mhs = 11;
              mid_list.push(m.mid);
            });
          });
        }
        useMittEmit(MITT_TYPES.EMIT_IS_ALL_END_NOTICE);
        //1011赛马、1002赛狗、1010摩托车、1009泥地摩托车结束时更新下一期
        if([1011, 1002, 1010, 1009].includes(this.sub_menu_type)){
          this.timer1_ = setTimeout(() => {
            this.check_is_first_tab_delete();
          },5000);
        }

      }
      this.singleton_10second = false;
    },
    /**
     * 开赛倒计时计时结束
     * @params {String} flag 时间标识
     */
    timer_ended_handle(flag){
      //篮球滚球倒计时结束拉取视频接口
      if(this.sub_menu_type == 1004){
        if(flag == 'is_basketball_playing'){
          this.get_video_process_by_api(() => {
            this.get_match_video_process(this.current_match);
          });
          this.is_video_playing = true;
          this.get_next_pre_basketball();
        }
        else if(flag == 'is_basketball_pre'){
          this.get_video_process_by_api();
          this.get_score_basket_ball();
          useMittEmit(MITT_TYPES.EMIT_PRE_COUNTING_EDN);//篮球早盘倒计时结束
        }
      }
      else{
        // 比赛已开始, 获取视频接口
        this.get_video_process_by_api(() => {
          this.get_match_video_process(this.current_match);
        });
      }

    },
    /**
     * 当前选中的赛事切换
     * @params {Object} match赛事对象
     */
    switch_match_handle(i){
      let match = this.match_list_by_no[i];
      if(match){
        let server_now = get_now_server()
        match.start_now_sub = Number(match.mgt) - server_now;
        if(this.sub_menu_type == 1004){
          if(match.mmp == 'INGAME'){
            if(match.start_now_sub <= 0){
              this.get_video_process_by_api(() => {
                this.current_match = match;
                this.get_match_video_process(this.current_match);
              });
            }
          }
          else if(match.mmp == 'PREGAME'){
            if(match.start_now_sub <= 0){
              this.get_video_process_by_api();
              useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
            }
          }
          this.current_match = match;
        }
        else{
          if(match.start_now_sub < 0){
            this.current_match = {};
            this.get_video_process_by_api(() => {
              this.current_match = match;
              this.get_match_video_process(this.current_match);
            });
          }
          else{
            this.current_match = match;
          }
        }

      }
    },
    /**
     * 赛事开赛
     * @params {Object} match赛事对象
     */
    match_start_handle(){
      this.get_video_process_by_api();
    },
    /**
     * 更新下一期赛事列表
     */
    update_n_batch_handle(){
      this.get_virtual_sport_local('is_user_clicked');
    },
    /**
     * 联赛切换
     * @params {Number} i
     */
    tab_item_click_handle(i,is_force,user_change){
      if(this.tab_item_i === i && !is_force) return;
      if(this.ranking_list_change) {
        this.before_match_tab_trend = Math.random();
      }
      if(user_change == 'user_change'){
        this.set_current_batch({});
      }
      this.tab_item_i = i;
      if(this.tab_items && this.tab_items.length && this.tab_item_i > -1){
        let current_league = this.tab_items[this.tab_item_i];
        this.lengue_name = current_league.name
        if(!current_league){
          current_league = this.tab_items[0];
        }
        this.set_current_league(lodash.cloneDeep(current_league));
      }else{
        this.set_current_league({});
      }
      this.current_match = {};
      this.get_virtual_sport_local('is_user_clicked');
    },
    /**
     * 生成赛事请求接口参数
     */
    param_generate(){
      let params = null;
      if(this.menu_list && this.menu_list[this.tab_item_i]){
        let league = this.menu_list[this.tab_item_i];
        params = {
          tid:league.field1,
          csid:this.params.csid
        };
      }
      return params;
    },
    /**
     * 切换排行榜
     * @param {Object} data
     * @return {Undefined} Undefined
     */
    trend_event_change(data){
      this.ranking_list_change = data
    },
    /**
     * 通过联赛id设置下标
     */
    set_league_i_by_id(l_id){
      let r = 0;
      this.tab_items.forEach((t_item,i) => {
        if(l_id == t_item.menuId){
          r = i;
        }
      });
      this.tab_item_i = r;
    },
    // 清除当前组件全部定时器
    clear_timer() {
      const timer_arr = [
        'procee_again_timer',
        'timer1_',
        'timer_super5'
      ]

      for (const timer of timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
      }
    },
    // 展开或者收缩联赛
    expend_match(item){
      item.is_expend = !item.is_expend;
      // 足蓝展开列表时，数据仓库增加list
      if([1001,1004].includes(this.sub_menu_type)){
        // item.is_expend && this.sub_nav_click_handle(item.batchNo);
      }else {
        // item.is_expend && this.get_detail_odds(item);
      }
    },
    // 赛马，赛狗展开时，获取赔率
    // 修改为一次性获取所有赔率。
    get_detail_odds(){
      this.match_list_all_batches.forEach(item=>{
        if(item.matchs){
          const match = item.matchs[0];
          //创建闭包，每次循序都有一个新的match，异步接口可以准确赋值
          (function(match){
            let params = {
              // 当前选中玩法项的id
              mcid: 0,
              // 赛事id
              mid: match.mid,
              // userId或者uuid
              cuid: UserCtr.uid,
            }
            api_common.get_matchDetail_getVirtualMatchOddsInfo(params).then(res => {
              if(res?.data?.length){
                match.hps = res.data[0]?.plays || [];
                // 按照hpid从小到大排序 
                match.hps.sort((x, y) => x.hpid - y.hpid);
                MatchDataBaseH5.set_list([match]);
              }
            })
          })(match)
        }
      })
    },
    set_detail_data(data){
      // TODO 需要对应
      VR_CTR.state.detail_data = data
    },
    /**
     * 批次变化
     * @param {String|Number} batchNo 当前最新期号
     * @param {Undefined}
     */
     sub_nav_click_handle(batchNo){
      this.sub_nav_focus_i = lodash.findIndex(this.match_list_all_batches,{batchNo:batchNo});
      let current_sub_nav = this.match_list_all_batches[this.sub_nav_focus_i];
      
      this.sub_nav_changed({
        nav: current_sub_nav,
        i: this.sub_nav_focus_i
      })

      //将赛马赛事信息跟新到vuex
      // let match_info = lodash.get(current_sub_nav,'matchs[0]')
      // match_info && this.set_detail_data(lodash.cloneDeep(match_info))
      
      //赛马传递赛事集合唯一赛事的赛事id
      if([1002, 1011, 1010, 1009].includes(this.sub_menu_type)){
        let mid = '';
        try{
          mid = current_sub_nav.match[0].mid;
        }catch(e){console.error(e)}
        if(mid){
          // this.set_current_mid(mid);
        }
      }
    },
    /**
     * 处理开赛时间
     */
    handle_match_time(batch){
      const match = batch.matchs[0];
      if(match){
        let remaining_time = Number(match.mgt) - get_now_server();
        //毫秒格式化为: 分钟'秒''
        let minutes = Math.floor(remaining_time / (1000 * 60));
        let sub_ms_r = remaining_time - minutes * 60 * 1000;
        let seconds_f = Math.floor(sub_ms_r / 1000);
        minutes = String(minutes);
        seconds_f = String(seconds_f);

        let minutes_format = minutes.padStart(2, '0');
        let seconds_f_format = seconds_f.padStart(2, '0');
        batch.remaining_time = remaining_time;
        batch.timer_format = `${minutes_format}:${seconds_f_format}`;
      }
    },
    /**
     * 开赛时间定时器控制
     */
     set_batch_timer(batch){
      if(this.interval_ids.has(batch.batchNo)){
        clearInterval(this.interval_ids.get(batch.batchNo));
      }

      // 创建一个新的定时器来更新时间
      const interval_id = setInterval(()=>{
        this.handle_match_time(batch)
      }, 1000)

      this.interval_ids.set(batch.batchNo, interval_id);
     },
     reset_timers(){
      this.interval_ids.forEach(id=>{
      clearInterval(id)
      })
      this.interval_ids.clear()
     }
  },
  computed:{
    // 1:新手版 2:专业版
    standard_edition(){return UserCtr.standard_edition;},
    current_league(){return VR_CTR.state.current_league},
    current_batch(){return VR_CTR.state.current_batch},
    get_video_process_data(){return VR_CTR.state.video_process_data},
    get_prev_v_sports_params(){return VR_CTR.state.prev_v_sports_params},
    get_prev_v_sports(){return VR_CTR.state.prev_v_sports},
    sub_menuid(){return VR_CTR.state.current_sub_menuid},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type},
    is_show_analyse(){return VR_CTR.state.is_show_details_analyse},
    // 当前联赛的全部轮次
    match_list_all_batches(){
      const match_list_all_batches = [...this.virtual_match_list];
      match_list_all_batches.forEach(batch=> {
        this.handle_match_time(batch);
        this.set_batch_timer(batch);
      })
      
      // 各球种都全部展开
      match_list_all_batches.forEach(batch=> {
        batch.is_expend = true
      })

      // 足蓝全部展开，赛马类只展开第一个
      // if(this.sub_menu_type == '1001' || this.sub_menu_type == '1004'){
      //     match_list_all_batches.forEach(batch=> {
      //     batch.is_expend = true
      //   })
      // }else {
      //   match_list_all_batches[0] && (match_list_all_batches[0].is_expend = true);
      // }
      return match_list_all_batches
    },

    //标签页列表
    tab_items(){
      let r = [];
      if(this.menu_list && this.menu_list.length){
        r = this.menu_list;
      }
      return r;
    }
  },
  watch:{
    v_menu_changed(change_str){
      this.tab_item_i = 0;
      this.ranking_list_change = this.is_show_analyse;
      // 根据 足蓝标识设置二级菜单切换状态
      this.top_menu_changed = !change_str.includes('zu_lan_')
    },
    menu_list(){
      if(this.tab_items && this.tab_items.length){

        if(this.current_league){
          this.tab_items.forEach((t_item,i) => {
            if(t_item.menuId == this.current_league.menuId){
              this.tab_item_i = i;
            }
          });
        }

        let current_league = this.tab_items[this.tab_item_i];
        this.set_current_league(lodash.cloneDeep(current_league));
        this.lengue_name = current_league.name
        
        // 和旧代码逻辑保持一致，此处不调用
        // this.tab_item_click_handle(this.tab_item_i,'is_force');
      }
    },
    // 赛马类第一次切换菜单时，获取详情赔率
    current_batch(){
      // if(this.current_batch?.no && ![1001,1004].includes(this.sub_menu_type)){
      //   // 后期等赛马类的列表接口加上赔率后，可注释掉
      //   this.get_detail_odds()
      // }
    },
    current_sub_menu(){
      let prev_league_id = ''
      if(this.current_league){
        prev_league_id = this.current_league.menuId;
      }
      this.reset_timers();
      this.set_current_batch({});
      this.set_league_i_by_id(prev_league_id);
      this.tab_item_click_handle(this.tab_item_i);
      this.get_virtual_sport_local();
    },
    is_user_refresh(n){
      if(n){
        this.get_virtual_sport_local('is_user_refreshing')
      }
    },
    /**
     * 二级菜单变化为赛马(1011)赛狗(1002)摩托车(1010)泥地摩托车(1009)时
     */
    sub_menu_type(c,n){
      //赛马赛狗 摩托车
      if([1011, 1002, 1010, 1009].includes(c)){
        this.ranking_list_change = false;
      }
    }
  },
  unmounted(){
    this.is_before_destroy = Math.random();
    if(this.video_process_obj && this.video_process_obj.destroy){
      this.video_process_obj.destroy();
    }
    this.emitters.map((x) => x())
    this.clear_timer()

    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
  beforeUnmount(){
    this.reset_timers()
  }
}