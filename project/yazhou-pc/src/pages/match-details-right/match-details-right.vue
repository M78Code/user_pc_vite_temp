<!--
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 列表|详情 右侧
-->
<template>
   <!-- 详情右侧 -->
   <div class="right_details_wrap relative-position" :class="$route.params.video_size == 1 && 'full-screen'" v-show="$route.params.video_size != 1 || get_is_show_full_bet">
     <!-- 加载数据 -->
     <load-data
       v-show="show_load_status"
       :class="['details_data_load', {'details_loading': load_detail_statu == 'loading'}]"
       :state="load_detail_statu"
       :style="{'margin-top': headerHeight + 'px'}"
       :is_detail="true" />
     <div class="screen" :class="{'video-page':$route.name == 'video'}">
       <!-- 滚动区域 -->
       <v-scroll-area :observer_area="1" @on_scroll="$root.$emit('right_details_on_scroll',$event)" ref="v_scroll" page_type="right_details" class="right_details_wrap">
 
         <template v-slot:header>
           <!-- 全屏模式玩法集tab -->
           <div class="full-video-tab" v-if="$route.params.video_size == 1 && handicap_this && get_is_show_full_bet">
             <tab
               :list="handicap_this.category_list"
               tab_name_key="marketName"
               @onclick="switchTabs"
               :currentIndex="currentIndex"
               :is_drag="handicap_this.category_list.length > 4"
               is_show_line
             />
             <div class="tab-arraw" :class="handicap_this.panel_status =='hide' && 'hide'" @click="handicap_this.toggle_panel"></div>
           </div>
           <!-- 非全屏模式-->
           <div class="right_details_header" :class="{'no-bottom-border':$route.name != 'details',is_esports}" v-else>
             <!-- bet 体育竞猜 -->
             <div class="sports-guessing" v-if="$route.name == 'video'">
               <div>
                 <template v-if="$utils.is_iframe">
                   <sport-icon :sport_id="$route.params.csid" :is_esports="is_esports" size="18px" class="icon sport-img-new" status="2" />
                   <span class="home-vs-away">
                     <span>{{ match_infoData.mhn }}</span>
                     <span class="vs">v</span>
                     <span>{{ match_infoData.man }}</span>
                   </span>
                 </template>
                 <template v-else>
                   <span>{{$root.$t('common.sports_guessing')}}</span>
                 </template>
               </div>
               <!-- 刷新按钮 -->
               <div class="refresh">
                 <refresh :other_icon="true" icon_name="icon-balance_refresh" :loaded="refresh_loading" @click="refresh()" />
               </div>
             </div>
             <!-- 多媒体控制头 -->
             <video-ctrl
               :match_info="match_infoData"
               :refresh_loading="refresh_loading"
               @refresh="refresh()"
               @setfoldStatus="setfoldStatus"
               v-if="$route.name != 'video' && !is_esports" />
             <!-- 电竞多媒体控制头 -->
             <video-ctrl-esports :match_info="match_infoData" v-if="$route.name != 'video' && is_esports" />
             <!-- 战队信息 start -->
             <match-info
               v-if="$route.name != 'video'"
               v-show="vx_get_is_fold_status  || is_esports"
               :screen="vx_cur_expand_layout"
               :match_info="match_infoData"
               :refresh_time="refresh_time"
               :background_img="background_img"
             />
             <!-- 精彩回放 -->
             <video-history-line
               v-if="show_video_replay && _.get(match_infoData,'cds')!='C01'"
               :match_info="match_infoData"
               :mid="mid"
               :mmp="+_.get(match_infoData,'mmp')"
               :matchTime="+_.get(match_infoData,'mst')" />
             <!-- 玩法tab -->
             <handicap-tabs-bar
               v-if="(vx_layout_cur_page.cur!=='details' && !is_esports) || $route.name == 'video'"
               :handicap_this="handicap_this"
               :match_info="match_infoData"
               @get_mattch_details="get_mattch_details"
               @on_go_top="on_go_top"
               @change-loading-state="change_loading_state"
               whitchDetail="rightDetails"
             />
           </div>
         </template>
 
         <!-- 【列表】 ------------->
         <template v-if="(vx_layout_cur_page.cur!=='details' && !is_esports) || $route.name == 'video'">
           <div class="cathectic-handicap" v-if="$route.params.video_size == '1' && vx_get_bet_single_list.length==1">
           </div>
           <!-- 盘口模板start -->
           <match-handicap
             :match_info="match_infoData"
             :category_list="category_list"
             :match_details="match_details"
             :plays_list="plays_list"
             :currentRound="round"
             :is_list="true"
             @set_handicap_this="set_handicap_this"
             :close_all_handicap="close_all_handicap"
             :handicap_state="handicap_state"
             pageType="right_details"
           />
           <!-- 盘口模板end -->
         </template>
 
         <!-- 电竞 有视频赛事列表 -->
         <esports-match-list v-if="is_esports && $route.name != 'video'" />
 
         <!-- 【详情信息】 ------------->
         <div v-if="show_more && $route.params.video_size != 1" class="detail_right_model">
           <!-- 聊天室 -->
           <chatroom v-if="show_chatroom" :chatroom_info.sync="chatroom_info" :chatroom_height="chatroom_height"/>
 
           <!-- 如果当前赛事盘口关闭，就给200px 上边距，用来展示 盘口关闭的提示图 -->
           <div class="wrap-total total" :class="($route.name !=='details' && load_detail_statu)" :style="{'margin-top': is_show_margin ? '200px' : '4px'}" v-if="show_wrap_total">
             <div class="w-sub-item">
               <div class="item-title">
                 <div class="panel-title"></div>
                 <!-- 统计 -->
                 <span>{{$root.$t('common.panel_total')}}</span>
               </div>
               <chart class="total_chart" :match_info="match_infoData" />
             </div>
           </div>
           <!-- 撑起盘口关闭高度的 -->
           <div :style="{'margin-top':(!is_show_margin || !(match_infoData.mcg == 1 && [1, 2, 3,4,6,5,7,9,10].includes(+_.get(match_infoData,'csid')))) && !is_esports && vx_layout_cur_page.cur  !=='details'  ? '200px' : 'auto'}"></div>
           <!-- 热门推荐 -->
           <hot  v-if="get_global_switch.hot_recommend"/>
           <!-- 近期关注 -->
           <recents v-if="!is_esports && get_global_switch.recent_switch" />
         </div>
         <!--晒单列表-->
         <saidan-list
         v-if="is_display_saidai"
         :share_order_time.sync="share_order_time"
         @qingkong="is_display_saidai=false"
         />
 
       </v-scroll-area>
       <!-- 全屏投注区域 -->
       <div v-if="$route.params.video_size == '1' &&((!is_esports && vx_get_bet_single_list.length==1) || (is_esports && vx_get_virtual_bet_list.length==1))">
         <div class="big-cathectic-zone">
           <div class="cathectic-shade" v-if="bet_this && bet_this.bet_loadding">
             <div class="shade-fixed">
               <div class="loading-wrap">
                 <div :class="[vx_get_theme.includes('y0')?'img-loading-y0':'img-loading']"></div>
                 <div class="text-center loading-text flex items-end justify-center">
                   {{$root.$t('bet.bet_loading')}}
                 </div>
               </div>
             </div>
           </div>
           <!--组件头部-->
           <div class="bet-scorll-header">
             <q-separator class="bet-top-separator"></q-separator>
             <div class="bet-zone-head" @click.stop="toggle_handle">
               <div class="left">{{$root.$t('common.bets_single')}}</div>
               <div class="right">{{$root.$t('common.balance')}} <span class="balance">{{ (vx_get_user.balance || 0) | format_balance }}</span></div>
             </div>
           </div>
           <template v-if="is_esports">
             <esports-bet-single @set_scroll_this="set_scroll_this" />
           </template>
           <template v-else>
             <bet-single @set_scroll_this="set_scroll_this" />
           </template>
           <bet-scroll-footer :bet_this="bet_this"/>
         </div>
       </div>
     </div>
   </div>
 </template>
 <script>
//  import { uid } from "quasar";
//  import {mapGetters, mapActions} from "vuex";
//  import match_handicap from "src/project/yabo/components/match_details/list/match_handicap.vue";
//  // api详情
//  import {api_details} from "src/public/api/index";
//  // 全局混入
//  import global_mixin from "src/public/mixins/global/global_mixin.js";
//  import format from "src/project/yabo/mixins/match_details/index";
//  import video_ctrl from "src/project/yabo/components/match_details/match_info/video_ctrl.vue";
//  import videoCtrlEsports from "src/project/yabo/components/match_details/match_info/video_ctrl_esports.vue";
//  import match_info from "src/project/yabo/components/match_details/match_info/match_info.vue";
//  import recents from "src/project/yabo/components/match_details/panel/recents";
//  import hot from "src/project/yabo/components/match_details/panel/hot.vue";
//  import chatroom from "src/project/yabo/components/match_details/panel/chatroom.vue";
//  import chart from "src/project/yabo/components/match_details/match_info/chart.vue";
//  import handicap_tabs_bar from "src/project/yabo/components/match_details/match_info/handicap_tabs_bar.vue";
//  import esportsMatchList from "src/project/yabo/components/match_details/match_info/esports_match_list.vue"
//  import vScrollArea from "src/public/components/v_scroll_area/v_scroll_area.vue";
//  import MatchInfoCtr from "src/public/utils/dataClassCtr/match_info_ctr";
//  import skt_data_details from "src/public/mixins/websocket/data/skt_data_info.js";
//  import live_chatroom from "src/project/yabo/mixins/live_chatroom/live_chatroom";
 
//  import details_mixins from "src/public/mixins/details/index.js";
//  import loadData from "src/public/components/load_data/load_data.vue"
//  import bet_single from "src/project/yabo/components/big_video_bet/bet_single.vue";
//  import bet_scroll_footer from "src/project/yabo/components/big_video_bet/bet_scroll_footer.vue";
//  import esports_bet_single from "src/project/yabo/components/esports_big_video_bet/bet_single.vue";
//  import tab from "src/public/components/tab/tab.vue"
//  import saidan_list from 'src/project/yabo/components/match_details/panel/saidan/saidan_list.vue'
//  import axios_debounce_cache from "src/public/utils/http/axios_debounce_cache.js"
//  import videoHistoryLine from "src/project/yabo/components/video/video_history_line.vue";
//  import refresh from "src/public/components/refresh/refresh.vue";
 
 export default {
   name: "match_details",
  //  mixins: [global_mixin, skt_data_details, format,  details_mixins, live_chatroom],
   components: {
    //  "match-info": match_info,
    //  "match-handicap": match_handicap,
    //  "video-ctrl": video_ctrl,
    //  "chart": chart,
    //  "handicap-tabs-bar": handicap_tabs_bar,
    //  vScrollArea,
    //  recents,
    //  hot,
    //  esportsMatchList,
    //  videoCtrlEsports,
    //  loadData,
    //  tab,
    //  videoHistoryLine,
    //  "bet-single": bet_single,
    //  "bet-scroll-footer": bet_scroll_footer,
    //  "esports-bet-single": esports_bet_single,
    //  "chatroom": chatroom,
    //  sportIcon: () => import('src/public/components/sport_icon/sport_icon'),
    //  'saidan-list': saidan_list,  //晒单列表
    //  refresh
   },
   data() {
     return {
       // 菜单数据
       menu_data: $menu.menu_data,
       match_info_ctr: new MatchInfoCtr(this),
       mid: "", //赛事id
       sportId: "", //球类id
       match_infoData: {},
       category_list: [], //玩法集
       mcid: 0, //默认玩法集id
       plays_list: [], //选中玩法集的盘口玩法集
       match_details: [], //详情盘口
       // isInit: false, //是否首次加载
       load_data_state: "loading", //整块加载状态
       handicap_state: "loading", //玩法加载状态状态
       close_all_handicap: false,
       background_img: "", // 比分板背景图
       socket_name: "h_details",
       autoset_mid: "", //切换新赛事id
       handicap_this: null,
       change_mid: true,
       err_time: 0,//玩法详情接口报错次数
       countMatchDetailErr: 0, // 计算详情比分面板接口报错次数
       is_go_match_list: true, // 判断是不是从详情页返回列表
       headerHeight: null, // 右侧头部比分板处高度
       round: null, // 电竞动态玩法集配置--当前玩法集局数标记
       load_detail_statu: "empty",
       currentPath: this.$route.name, // 当前路由
       bet_flag: false,
       is_expand: true,
       bet_this: null,
       currentIndex: 0,
       is_display_saidai:false, //是否显示晒单列表
       chatroom_info: {
         all_mute: 0,
         ban_share: 0,
       },
       share_order_time: 0,
       refresh_loading: false, // 刷新按钮loading
       refresh_time: 0, // 刷新次数
     };
   },
   filters: {
     // 格式化用户余额保留2位小数
     format_balance(num) {
          if(num) {
             let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)
 
             // 保留两位小数
             let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"
 
             let _num = _split[1] + '.' + decimal
             return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
          }
          return '0.00';
     },
   },
   computed: {
    //  ...mapGetters({
    //    // 当前语言
    //    get_lang: 'get_lang',
    //    // 获取当前页路由信息
    //    vx_layout_cur_page: "get_layout_cur_page",
    //    // 获取右侧布局类型
    //    vx_cur_expand_layout: "get_cur_expand_layout",
    //    // 左侧详情参数
    //    vx_details_params: "get_match_details_params",
    //    // 获取用户uid
    //    get_uid: "get_uid",
    //    // 获取指定的玩法id
    //    get_top_id: "get_top_id",
    //    // 获取串关投注项对象
    //    vx_get_bet_obj: "get_bet_obj",
    //    // 是否是单关投注
    //    is_bet_single: 'is_bet_single',
    //    vx_get_is_single_handle: "get_is_single_handle", // 单关是否正在处理
    //    vx_get_is_handle: "get_is_handle", // 串关是否正在处理
    //    // 获取当前选中的tab的id
    //    get_tabs_active_id: "get_tabs_active_id",
    //    // 获取当前选中的tab对应的盘口玩法
    //    get_tabs_active_plays: "get_tabs_active_plays",
    //    // 详情比分面板，接口报错时的备用数据
    //    get_active_detail: "get_active_detail",
    //    get_is_show_full_bet: "get_is_show_full_bet",
    //    // 获取当前菜单类型
    //    vx_cur_menu_type: "get_cur_menu_type",
    //    vx_get_bet_mode: "get_bet_mode", // 投注模式
    //    vx_get_bet_item_lock: "get_bet_item_lock", // 投注项是否要锁
    //    // 获取多语言是否变化
    //    vx_get_lang_change: "get_lang_change",
    //    // 赛事列表排序 1:按联赛排序 2:按时间排序
    //    vx_match_sort: "get_match_sort",
    //    vx_get_bet_single_list: "get_bet_single_list",
    //    vx_get_user: "get_user",
    //    vx_get_virtual_bet_list: "get_virtual_bet_list",
    //    vx_get_theme: "get_theme",
    //   //全局开关
    //    get_global_switch:'get_global_switch',
    //    vx_get_chatroom_available: "get_chatroom_available",
    //    get_chatroom_id: "get_chatroom_id",
    //    vx_get_layout_size: "get_layout_size",
    //    //视频是否展开状态
    //    vx_get_is_fold_status:'get_is_fold_status',
    //  }),
      // 是否显示 统计版块
     show_wrap_total(){
       return (
         this.match_infoData.mcg == 1 && [1, 2, 3,4,6,5,7,9,10].includes(+_.get(this.match_infoData,'csid')) &&this.get_global_switch.statistics_switch&&this.match_infoData.cds!=='C01'
       )
 
     },
     // 是否显示 聊天室
     show_chatroom() {
       return (
           this.$route.name === 'details' &&
           this.vx_get_chatroom_available &&
           ['zh', 'tw'].includes(this.get_lang)
       )
     },
     // 是否显示精彩回播
     show_video_replay() {
       // 配置信息
       const replayInfo = this.vx_get_user.merchantEventSwitchVO
       return replayInfo && replayInfo.eventSwitch && this.$route.name === 'details' && this.vx_get_is_fold_status && this.vx_details_params.media_type === 'video' &&  Number(this.match_infoData.csid) === 1
     },
     // 展示热门推荐、近期关注等
     show_more(){
       // 当前在详情页或者电竞页的时候展示
       if((this.$route.name=='details' || (this.is_esports && this.$route.name != 'video')) &&  this.$route.name !=='search'){
         return true
       } else{
         // 如果不在详情页，就在关盘的时候展示
         return ['new_empty','all_empty'].includes(this.handicap_state) && this.mid
       }
     },
     // 聊天室高度
     chatroom_height() {
       // 内嵌右侧
       if (this.$utils.is_iframe) {
         return this.vx_get_layout_size.content_height - this.headerHeight - 7
       }
     },
     // 是否为电竞
     is_esports() {
       let is_esports
       // 详情页判断球种ID  其他页面取菜单
       if(this.$route.name == 'details' || this.$route.name == 'video'){
         is_esports = this.$utils.is_eports_csid(this.$route.params.csid)
       }else if(this.$route.name == 'search'){
           is_esports = false
       }else{
         is_esports = this.menu_data.is_esports
       }
       return is_esports;
     },
     /**
      * @description: 玩法列表除的加载状态展示逻辑
      * @param {*}
      * @return {boolean} 是否展示遮罩层
      */
     show_load_status() {
       // 不展示有数据和无数据和 empty 状态
       // 如果当前在详情页并且是 loading 状态也不展示
       // 当前页是暂无数据时也不展示，会有重复展示的情况
       // 当前在电竞列表页也不展示
       // 当前在滚球电竞，不展示
       if (!['data', 'no-data', 'empty'].includes(this.load_detail_statu)
       && !(this.$route.name == 'details' && ['new_empty', 'loading', 'all_empty'].includes(this.load_detail_statu))
       && !this.is_esports) {
         return true;
       } else {
         return false;
       }
     },
     // 是否展示右侧热门推荐处的margin
     is_show_margin() {
         return ['new_empty','all_empty'].includes(this.load_detail_statu) && this.$route.name !== 'details'
     }
   },
 
   watch: {
     "vx_details_params.mid"() {
       // this.isInit = true;
       this.match_details.splice(0, this.match_details.length);
       this.category_list.splice(0, this.category_list.length);
       this.match_info_ctr.clear_hl_obj();
       this.match_info_ctr.clear_hn_obj();
       this.match_info_ctr.clear_ol_obj();
       this.change_mid = true;
       this.is_go_match_list = true;
        this.init();
     },
 
     /**
     * @description: 计算各球种背景图片
     * @return {undefined} undefined
     */
     sportId:{
       handler(res){
         this.background_img = this.computed_background(res)
       }
     },
     /**
     * @description: 切换到视频页重新拉取详情接口
     * @return {undefined} undefined
     */
     $route: {
       handler(to, from) {
         let _to = _.get(to, "name") || '';
         let _from = _.get(from, "name") || '';
         // 在首页刷新时不要重复调用 init
         if (_from == '' && _to == 'home') {
         } else if(_to== 'home' && _from=='details') {
           // 从详情页返回列表页也要初始化右侧详情
           this.is_go_match_list = false;
           this.init && this.init();
         } else if(_to!='details') {
           this.init && this.init();
         } else if (_to === 'details') {
           clearTimeout(this.get_match_details_timer2)
           this.get_match_details_timer2 = null
           this.handle_chatroom_show()
         }
       },
       immediate: true
     },
     get_is_show_full_bet() {
       if(this.$route.params.video_size==undefined) {
         // 清除单关投注
         this.vx_bet_single_clear();
         // 清除串关投注
         this.vx_bet_mix_clear();
         // 设置默认为单关
         this.vx_set_is_bet_single(true);
       }
     },
     // 监听赛事状态mmp的值
     'match_infoData.mmp'(_new, _old){
       if(_new !== 999 && _old){
         // 更新右侧详情
         this.init()
       }
     },
     // 监听赛事状态ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
     'match_infoData.ms'(_new, _old) {
       let arr_ms = [0, 1, 2, 7, 10, 110];
       // 1.赛事状态为 0:未开赛 1:滚球阶段 2:暂停 7:延迟 10:比赛中断 110:即将开赛 时更新玩法集
       // 2.ms变更时才调用
       if(arr_ms.includes(Number(_new)) && _old){
         // 更新右侧详情
         this.init()
       }
     },
   },
   created() {
     /**
      * @description: 初始化数据 调取赛事详情、玩法集、玩法列表接口
      * @return {undefined} undefined
      */
     this.init = _.debounce(this.m_init,1000);
     this.init();
     // 对获取玩法集所有玩法接口进行节流操作
     this.get_match_detail_base = this.throttle(this.get_match_detail_base, 1000, {leading:true, trailing:true});
     // 自动切换赛事
     this.$root.$on("autoset_match", this.emit_autoset_match);
     // 检查玩法关盘
     this.$root.$on("check_plays_show", this.check_plays_show);
 
     // 站点 tab 休眠状态转激活
     this.$root.$on(this.emit_cmd.EMIT_SITE_TAB_ACTIVE, this.emit_site_tab_active);
     // 关闭 tips
     this.$root.$on("close_tips", this.close_tips);
 
     //列表刷新拉取详情数据
     // this.$root.$on("refreshList", this.init);
     // 拉取玩法列表
     this.$root.$on("match_detail_base", this.get_match_detail_base);
 
     // 接受 loading 状态
     this.$root.$on("change_loading_status_right_details", this.getLoading)
     // 右侧头部高度
     this.$root.$on("match_details_header_height_right_details", this.getHeaderHeight)
     this.$root.$on('saidan_page_change', this.change_saidan)
     // 刷新按钮节流
     this.refresh = this.throttle(this.refresh, 1000,{leading:true, trailing:false});
   },
   methods: {
    //  ...mapActions({
    //    // 设置展开区块
    //    vx_set_cur_expand_layout: "set_cur_expand_layout",
    //    // 置顶的玩法id
    //    set_top_id: "set_top_id",
    //    // 保存玩法个数
    //    vx_set_match_detail_count: "set_match_detail_count",
    //    // 视频播放信息
    //    vx_set_play_media: "set_play_media",
    //    // 错误信息
    //    set_error_data: "set_error_data",
    //    // 当前选中玩法id
    //    set_tabs_active_id: "set_tabs_active_id",
    //    // 当前选中玩法对应的盘口玩法
    //    set_tabs_active_plays: "set_tabs_active_plays",
    //    // 切换多语言
    //    vx_set_lang_change: "set_lang_change",
    //    vx_bet_single_clear: 'bet_single_clear',
    //    vx_bet_mix_clear: 'bet_mix_clear',
    //    vx_set_match_details_params: "set_match_details_params",
    //    // 设置获取视频是否展开状态
    //    vx_set_is_fold_status: "set_is_fold_status"
    //  }),
     /**
      * @description 晒单列表显示状态改变
      */
     change_saidan(evt){
       this.is_display_saidai = evt;
     },
     /**
      * @description 控制聊天室是否显示
      */
     handle_chatroom_show() {
       // 跳转赛事后，先关闭聊天室
       this.set_chatroom_available(0)
       // 聊天室开关开启后才显示聊天室
       if (this.vx_get_user.chatRoomSwitch) {
         // 获取直播、聊天室信息
         this.get_live_chat_info()
       }
     },
 
   /**
    *设置视频展开关状态
    */
     setfoldStatus(){
       this.vx_set_is_fold_status(!this.vx_get_is_fold_status)
       if(this.vx_get_is_fold_status){
         let { mid, media_type, play_id } = this.vx_details_params;
         this.vx_set_play_media({
           mid,
           media_type,
           play_id,
           time:new Date()*1,
         });
       }
     },
     /**
      * @description 获取头部高度
      */
     getHeaderHeight(height) {
       this.headerHeight = height || 0;
     },
     /**
      * @description 获取loading状态
      */
     getLoading(status) {
       this.load_detail_statu = status;
     },
     /**
      * 页面从休眠状态被激活时重新拉取数据
      */
     emit_site_tab_active(){
       let{ mid = null }= this.$route.params
       mid = mid || this.vx_details_params.mid
       // 如果当前是详情或者视频，就直接初始化
       if (["video"].includes(this.vx_layout_cur_page.cur)) {
         this.init({mid,is_ws:true})
       // 否则就拉取比分面板数据
       } else {
         api_details
         .get_match_detail_MatchInfo({mid}).then(({ data }) => {
           let code = _.get(data, "code");
 
           if (code == '0400500') {
             this.emit_autoset_match(0);
             return;
           }
 
           if (code == 200) {
             let match = _.get(data, "data") || {};
             // 当赛事不是 未开赛 0 不是滚球 1 不是暂停 2 也不是即将开赛 110
             if(match.ms > 2 && match.ms != 110){
               // 重新设置详情选中的赛事
               this.mx_autoset_active_match()
             } else {
               // 否则就直接初始化
               this.init({mid,is_ws:true})
             }
           } else {
             this.mx_autoset_active_match()
           }
         })
       }
     },
     /**
     * @description: 隐藏其他tips
     * @param {}
     * @return {}
     */
     close_tips(hpid){
       this.match_details.forEach(item =>{
         item.tipstatus = item.hpid == hpid
       })
     },
 
     /**
      * @description 返回顶部
      * @return {Undefined} Undefined
      */
     on_go_top() {
       this.$root.$emit("set_scroll_position", [0, 0])
     },
     /**
     * @description: 检查玩法关盘
     * @return {undefined} undefined
     */
     check_plays_show(){
       this.match_details.forEach(item =>{
         item = this.format_plays(item)
       })
     },
     /**
      * 把当前页面的数据给到玩法集
      */
     set_handicap_this(_this) {
       this.handicap_this = _this;
     },
     /**
      * 自动切换赛事
      */
     emit_autoset_match(mid) {
       if (this.autoset_mid != mid || !mid) {
         this.mx_autoset_active_match({ mid: mid || 0 });
         this.autoset_mid = mid;
       }
     },
 
     /**
      * @description: 初始化数据（赛事详情、玩法集、玩法列表）
      * @param {string} mcid玩法集id默认0
      */
     /**
      * @description 初始化详情数据，获取赛事比分信息、玩法集数据以及玩法投注项
      *
      * 调用后通过传参判断是否是 ws 调用
      */
     m_init(param = {is_ws:false}) {
       clearTimeout(this.get_match_details_timer)
       let {mid, is_ws} = param
       // 如果有传参，并且不是 ws 调用
       if(mid){
         this.mid = mid
       } else {
         this.mid = this.vx_details_params.mid//赛事id
       }
       if(!this.mid || this.mid == -1){
         this.match_infoData = {mid:-1,csid:-1}
         this.handicap_state = 'all_empty'
         return
       }
       // 重置比分接口调用失败次数
       this.countMatchDetailErr = 0;
       let params = this.vx_details_params; //vx_details_params，列表页点击进入详情所保存的赛事参数
       // this.vx_details_params.mid = mid;
       this.sportId = params.sportId; //球类id
 
       // 1. C104 mhs 0  仅开盘 循环四次调用  每两次发起之间次间隔最低3秒 一共 理论上9秒以上，
       // 两个原则：
       //   1：上次回来再调用下一次
       //   2：两次发起之间至少间隔差3秒
       if (param.cmd === 'C104') {
         this.get_matchInfo(3);
       } else if (!this.is_go_match_list) {
         // 2.详情页 返回列表页 ，多调用一次 matchdetail
         this.get_matchInfo(1)
       } else {
         // 其他情况只调用一次
         this.get_matchInfo()
       }
 
       // 电竞不用请求玩法数据
       if((this.is_esports && this.$route.name != 'video') || this.$route.name == 'details'){
         return
       }
       console.log('get_category_list 888', this.vx_details_params.category, this.vx_details_params)
       // 如果是 右侧动画区切换赛事 并且当前在详情页就不请求玩法集
       if (!this.vx_details_params.category) {
         // 获取玩法集数据
         this.get_category_list(() => {
           this.set_cur_match_plays_list()
           // 如果不是 ws 推送的，就展示 loading
           if (!is_ws) {
             this.handicap_state = 'loading';
           }
           //玩法投注项列表
           this.get_match_detail(is_ws);
         },is_ws);
       } else {
         this.vx_set_match_details_params({category: 0})
       }
     },
     /**
      * @description: 设置选中玩法集 （mcid,plays_list）
      */
     set_cur_match_plays_list(){
        // 获取当前玩法集里第一个子项的
       let mcid = _.get(this.category_list,'0.id', '')
       if(_.some(this.category_list,item=> item.id === this.get_tabs_active_id) && !this.change_mid){
         mcid = this.get_tabs_active_id
       }
       this.mcid = mcid;
       let { plays = []}  = _.find(this.category_list,item=> item.id === this.mcid,{})
       this.plays_list = plays
       // 保存当前选中的玩法集子项id
       this.set_tabs_active_id(this.mcid)
       // 保存当前选中的玩法集子项玩法集合
       this.set_tabs_active_plays(this.plays_list)
       this.change_mid = false
     },
 
     /**
      * @description: 赛事详情比分板数据
      * @param {number} loop_count 循环调用次数
      */
     get_matchInfo(loop_count) {
       let params = {
         mid: this.mid || 0, //赛事id
       };
       if(params.mid == -1 ){
         this.match_infoData = {mid:-1, csid:-1}
         this.handicap_state = 'all_empty'
         return
       }
       let api
       // 如果是电竞就用电竞的请求配置
       if(this.is_esports){
         api = api_details.get_match_detail_ESMatchInfo
         // 非电竞就用通用的请求配置
       }else{
         api = api_details.get_match_detail_MatchInfo
       }
       let send_request = () => {
         api(params)
           .then((res) => {
             const code = _.get(res, "data.code");
             const data = _.cloneDeep(_.get(res, "data.data"));
             const timestap = _.get(res, "data.ts");
 
             if (code == '0400500') {
               // 跳转赛事
               this.emit_autoset_match(0);
               return;
             }
 
             if (code === 200 && data && Object.keys(data).length) {
               // 请求成功就清零错误次数
               this.countMatchDetailErr = 0;
               // 设置当前赛种的背景图
               this.background_img = this.computed_background(data.csid)
               // mmp状态修正
               if(['4','5','7','8','9','10','11','12','13','16','15','14'].includes(data.csid)){
                 if (data.ms !=0 && data.mmp == "0") {
                   Object.assign(data, {
                     mmp: "8",
                     mct: 1,
                   });
                 }
               }
               /**
                * @description 格式化msc数据
                * msc: ["S1|48:52"] => msc: {S1:{home: 48,away: 52}}
                */
               data.msc = this.build_msc(data);
               this.match_info_ctr.init_match_obj(data, timestap);
               this.match_infoData = this.match_info_ctr.match_obj;
               let mid = _.get(data, "mid");
               let mst = _.get(data, "mst");
               let mstst = _.get(data, "mstst");
               let mststs = _.get(data, "mststs");
 
               //同步赛事时间
               this.yabo_common.update_match_time({mid, mst, mstst, mststs});
               let { media_type, play_id } = this.vx_details_params;
               this.vx_set_play_media({
                 mid: data.mid,
                 media_type,
                 play_id,
                 time:new Date()*1,
               });
 
               this.load_data_state = "data";
               // 保存数据,用于接口报错时填充
               this.save_match_info(_.cloneDeep(this.match_infoData));
             } else {
               this.countMatchDetail()
             }
             sessionStorage.setItem("currentIndex", 0);
           })
           .catch((err) => {
             console.error(err)
             this.set_error_data({
               site: "match_details--get_matchInfo",
               error: err,
             });
             this.countMatchDetail();
           })
           .finally(() => {
             // 循环调用 赛事详情页比分板接口，固定间隔3s
             if (loop_count) {
               clearTimeout(this.get_match_details_timer2)
               this.get_match_details_timer2 = setTimeout(() => {
                 loop_count--
                 this.get_matchInfo(loop_count)
               }, 3000)
             } else {
 
             }
           })
       }
       const match_details_debounce_cache = axios_debounce_cache.get_match_details
       if(match_details_debounce_cache && match_details_debounce_cache['ENABLED']){
         let info = match_details_debounce_cache.can_send_request(params);
         if(info.can_send){
           //直接发请求    单次数 请求的方法
           send_request();
         }else{
           // 记录timer
           this.current_hash_code = 0
           clearTimeout(this.axios_debounce_timer)
           this.axios_debounce_timer = setTimeout(() => {
             //直接发请求    单次数 请求的方法
             send_request();
             this.current_hash_code = 0
           }, info.delay_time || 1000);
         }
       } else {
         //直接发请求    多 次数  循环请求 的方法
         send_request();
       }
     },
     /**
      * @description: 详情比分面板接口报错处理
      * @param {*}
      * @return {*}
      */
     countMatchDetail() {
       // 计算错误次数
       this.countMatchDetailErr += 1;
       // 如果接口一直报错，最多拉取5次
       if (this.countMatchDetailErr < 5) {
         // 延迟3秒 再次调详情接口
         this.get_match_details_timer = setTimeout(() => {
           this.get_matchInfo();
         },3000)
       }else{
         this.match_infoData = {mid:-1, csid:-1}
         this.handicap_state = 'all_empty'
       }
     },
 
     /**
      * @description: 玩法集
      * @param {function} callback 判断是否调玩法列表接口
      */
     get_category_list(callback,is_ws) {
       
       let params = {
         sportId: this.sportId || 0, //球类id
         mid: this.vx_details_params.mid || 0, //赛事id
       };
       // 全屏模式
       if(this.$route.params.video_size == 1){
         params.type = 2
       }
       const _obj = {
         axios_api: api_details.get_category_list,
         error_codes:['0401038'],
         params: params,
         fun_then: res => {
           if(!this.match_info_ctr){
             return
           }
           const code = _.get(res, "data.code");
           if(code == '0400500'){
             this.emit_autoset_match(0);
             return;
           }
           const data = _.get(res, "data.data");
           if (code === 200 && data.length) {
             
             this.category_list = data;
             // 初始化玩法列表
             this.match_info_ctr.init_play_menu_list(data);
             if (callback) {
               callback();
             }
           }else{
             this.load_data_state = "empty";
           }
         },
         fun_catch: err => {
           // 连续3次请求无响应则网络异常
           if(!is_ws){
              this.load_data_state = "user_api_limited";
           }
         },
         timers:1500,
         max_loop:5,
       }
       this.$utils.axios_api_loop(_obj);
     },
     /**
      * @description: 玩法投注项列表
      * @param {boolean} is_bymids 是否bymids触发
      * @param {boolean} isWs 是否是 ws 触发
      */
      get_match_detail_base(obj = {isWs:false, mid:'',is_bymids:false}) {
       // 如果当前是电竞页，就不请求右侧玩法列表
       if(this.is_esports && this.$route.name != 'video'){
         return false
       }
       // 如果当前在详情页或者接收数据的 mid 和当前 mid 不一样也不展示玩法列表
       if(this.$route.name == "details" || (obj.mid && this.mid != obj.mid)){
         return false
       }
       // 非ws拉取的情况下，展示 loading
       if (!obj.isWs && this.handicap_state != 'loading') {
         this.handicap_state = 'loading';
       }
       let euid = $menu.match_list_api_params.euid
 
       // 获得当前的模板ID
       let orpt = $menu.menu_data.match_tpl_number;
       let { play_id } = this.vx_details_params;
       let baseParam = {
           "cuid": this.get_uid,
           euid,
           orpt,
           "sort": this.vx_match_sort
       }
       let params = {
         baseParam,
         // mcid: this.mcid, //玩法集id
         mcid: '0', //玩法集id
         mid: this.mid, //赛事id
         cuid: this.get_uid, //用户id
       };
       let type_name = this.vx_cur_menu_type.type_name;
       //today：今日  early：早盘
       if(['today', 'early'].includes(type_name)) {
         params.baseParam.cos = $menu.is_corner_menu() || orpt== 25  ? 1 : 0;
       } else {
         params.baseParam.cos = 0;
       }
       // 非滚球传 玩法ID
       if (type_name != "play") {
         params.baseParam.pids = $menu.match_list_api_params.pids
       }
       // 竟足
       if(euid == 30101){
         play_id = 1001
         params.baseParam.orpt = 12
         params.baseParam.pids = -999
       }
       // 如果有角球 罚牌玩法
       else if(play_id) {
         baseParam.tabs =  [{ mid: this.mid, playId: play_id }];
       }
 
       let  fun_temp =async ()=>{
           // 记录当前请求gcuuid
           this.last_by_mids_uuid = params.gcuuid = uid()
 
            // 如果当前是电竞
           if(this.is_esports){
             params.newUser = 0;
             // 电竞接口无用的参数删除
             delete params.baseParam;
             // 电竞接口参数补全，round 是电竞赛事才有的动态玩法id
             params.round = this.round;
             await api_details
             .get_match_odds_info_ES(params)
             .then((res) => {
               this.set_home_loading_time_record('ok');
               // 检查gcuuid
               if (this.last_by_mids_uuid != res.config.gcuuid) return;
 
               this.err_time = 0
               const code = _.get(res, "data.code");
               let timestap = _.get(res, "data.ts");
               // 获取详情下所有玩法集数据
               let data = _.get(res, "data.data", []);
               //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
               if (code === 200 && data.length && this.match_infoData.mhs !=2) {
                 data.forEach(item =>{
                   item = this.format_plays(item)
                   item.tipstatus = false
                 })
 
                 let obj = [];
                 // 保存详情玩法个数
                 this.vx_set_match_detail_count(data.length);
 
                 // 置顶数据排序
                 let arr = []; //暂存本地置顶的数据
                 for (var i = 0; i < data.length; i++) {
                   if (data[i].hton != "0") {
                     this.set_top_id({ id: data[i].topKey, type: true });
                   } else {
                     if (this.get_top_id.includes(data[i].topKey)) {
                       data[i].hton = new Date().getTime() + "";
                       arr.unshift(data.splice(i, 1)[0]);
                       i--;
                     }
                   }
                 }
                 if (arr.length) {
                   //插入置顶的数据
                   for (var i in arr) {
                     data.unshift(arr[i]);
                   }
                 }
                 data.forEach((item, index) => {
                   obj.push(item);
                   item.initIndex = index;
                   item.index = index;
                 });
 
                 // 初始化控制类中的玩法数据
                 this.match_info_ctr.init_plays_data(data);
                 this.match_details = this.match_info_ctr.list;
                 // 玩法列表loading状态值
                 this.handicap_state = "data";
                 // 同步投注项
                 if(!this.vx_get_lang_change) {
                   this.yabo_common.upd_bet_obj(this, timestap, this.mid);
                 }
                 this.vx_set_lang_change(false);
               } else {
                 this.match_details = [];
                 this.handicap_state = params.mcid == 0 ? "all_empty" : "new_empty";
               }
             })
             .catch((err) => {
               this.set_home_loading_time_record('err');
               console.error(err);
               if(!obj.isWs){
                 this.err_tips(err)
               }
             });
             // 常规赛事
           } else {
             await api_details
             .get_match_detail2(params)
             .then((res) => {
               this.set_home_loading_time_record('ok');
               // 检查gcuuid
               if (this.last_by_mids_uuid != res.config.gcuuid) return;
 
               this.err_time = 0
               const code = _.get(res, "data.code");
               // 获取赛事数据
               let match_info = _.get(res, "data.data.baseData[0]", {});
               // 获取详情下所有玩法集数据
               let data = _.get(res, "data.data.plays", []);
               let timestap = _.get(res, "data.ts");
 
               if (code == '0400500') {
                 // 跳转赛事
                 this.emit_autoset_match(0);
                 return;
               }
 
               if(!_.isEmpty(match_info) && !obj.is_bymids) {
                 // 同步列表的赛事数据
                 this.$root.$emit(this.emit_cmd.EMIT_SYNCH_FROM_DETAIL,res);
                 if(this.is_go_match_list) {
                   let match_obj = {};
                   for(let [key, value] of Object.entries(match_info)) {
                     if(!_.isUndefined(this.match_infoData[key])) {
                       match_obj[key] = value;
                     } else {
                       delete match_obj[key];
                     }
                   }
                   // 同步数据到详情
                   let msc = this.build_msc(match_obj);
                   match_obj.msc = msc;
                   Object.assign(this.match_info_ctr.match_obj, match_obj);
                 }
                 // 是否是从详情页返回列表页
                 this.is_go_match_list = true;
               }
 
               //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
               if (code === 200 && data.length && this.match_infoData.mhs !=2) {
                 data.forEach(item =>{
                   item = this.format_plays(item)
                   item.tipstatus = false
                 })
 
                 let obj = [];
                 // 保存详情玩法个数
                 this.vx_set_match_detail_count(data.length);
 
                 // 置顶数据排序
                 let arr = []; //暂存本地置顶的数据
                 for (var i = 0; i < data.length; i++) {
                   if (data[i].hton != "0") {
                     this.set_top_id({ id: data[i].topKey, type: true });
                   } else {
                     if (this.get_top_id.includes(data[i].topKey)) {
                       data[i].hton = new Date().getTime() + "";
                       arr.unshift(data.splice(i, 1)[0]);
                       i--;
                     }
                   }
                 }
                 if (arr.length) {
                   //插入置顶的数据
                   for (var i in arr) {
                     data.unshift(arr[i]);
                   }
                 }
                 data.forEach((item, index) => {
                   //投注项ol排序
                   obj.push(this.format_sort_data(item));
                   item.initIndex = index;
                   item.index = index;
                 });
 
                 // 初始化控制类中的玩法数据
                 this.match_info_ctr.init_plays_data(data);
                 this.match_details = this.match_info_ctr.list;
                 // 玩法列表loading状态值
                 this.handicap_state = "data";
                 // 同步投注项
                 if(!this.vx_get_lang_change) {
                   this.yabo_common.upd_bet_obj(this, timestap, this.mid);
                 }
                 this.vx_set_lang_change(false);
               } else {
                 this.match_details = [];
                 if(code=='0401038'){
                   this.handicap_state = 'api_limited'
                   return
                 }
                 this.handicap_state = params.mcid == 0 ? "all_empty" : "new_empty";
               }
             })
             .catch((err) => {
                this.set_home_loading_time_record('err');
               if(!obj.isWs){
                 this.err_tips(err)
               }
             });
           }
           ['new_empty','all_empty'].includes(this.handicap_state) && this.$root.$emit("get_history")
       }
         let api_axios_flg = 'match_odds_Info2';
         if(axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']){
           let instance = axios_debounce_cache[api_axios_flg];
           let info = instance.can_send_request(params);
           if(info.can_send){
             //直接发请求    单次数 请求的方法
             fun_temp();
           }else{
           // 记录timer
             this.current_hash_code = 0
             clearTimeout(this.axios_debounce_timer2)
             this.axios_debounce_timer2=    setTimeout(() => {
                 //直接发请求    单次数 请求的方法
                 fun_temp();
                 this.current_hash_code = 0
             }, info.delay_time ||1000);
           }
         } else {
           //直接发请求    多 次数  循环请求 的方法
           fun_temp();
         }
 
     },
 
     /**
     * @description: 弹出报错提示
     * @param {}
     * @return {}
     */
     err_tips(err){
       this.match_details = [];
       this.set_error_data({
         site: "details--get_match_detail",
         error: err,
       });
       if (
         _.isPlainObject(err) ||
         _.get(err, "response.status") == 404
       ) {
         this.handicap_state = "404";
       } else {
         this.handicap_state = "refresh";
       }
     },
     /**
      * @description: ws逻辑调取玩法列表
      */
     get_match_detail(isWs) {
       this.get_match_detail_base({isWs});
     },
 
     /**
      * @description: 子组件玩法切换
      * @param {string} id 玩法集id
      */
     get_mattch_details(obj) {
       this.mcid = _.get(obj, 'id');
       this.round = _.get(obj, 'round');
       this.plays_list = _.get(obj, 'plays',[]);
     //   this.get_match_detail_base();
     },
     /**
      * 切换玩法集时增加 loading 效果
      */
     change_loading_state(n) {
       this.handicap_state = n
     },
     /**
      * @description 设置滚动数据
      * @param  {string} type  类型
      * @param  {oject} _this  上下文对象
      * @return {undefined} undefined
      */
     set_scroll_this({ type, _this }) {
       this[type] = _this
     },
     /**
      * 切换玩法集
      * @param {*} obj 从tab里获取的玩法集参数
      */
     switchTabs(obj) {
       this.currentIndex = obj.index
       // 设置当前玩法集所在的id
       this.set_tabs_active_id(obj.item.id)
       // 设置当前玩法集对应的盘口玩法
       this.set_tabs_active_plays(obj.item.plays)
       // 请求当前选中的玩法项
       this.get_mattch_details({id: obj.item.id, plays: obj.item.plays, round: obj.item.round})
       // 投注项列表回到顶部
       this.on_go_top()
       if (this.match_infoData.csid == 1) {
         // 发送埋点
         let zhuge_obj = {
           "玩法集名称": obj.item.marketName,
           "玩法集ID": obj.item.id,
           "区域位置": "大屏"
         }
         this.$utils.send_zhuge_event("TY_PC_足球_玩法分类导航_点击", zhuge_obj);
       }
     },
     // 批量清除定时器
     clear_timer() {
       const timer_arr = [
         'axios_debounce_timer',
         'axios_debounce_timer2',
         'get_match_details_timer',
         'get_match_details_timer2',
       ]
 
       for (const timer of timer_arr) {
         clearTimeout(this[timer])
         this[timer] = null
       }
     },
     // 自动化测试页面加载时间时使用
     set_home_loading_time_record(status){
       if(window.init_loading_time_obj && _.get(window, 'env.config.DOM_ID_SHOW')){
         if(!window.init_loading_time_obj.right_details_end_time){
           window.init_loading_time_obj.right_details_end_time = new Date().getTime();
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
     refresh() {
       // if (this.refresh_loading) {
       //   return false
       // }
       this.refresh_loading = true
       this.get_matchInfo(1)
       this.refresh_time += 1
       this.refresh_loading_timer && clearTimeout(this.refresh_loading_timer)
       this.refresh_loading_timer = setTimeout(() => {
         this.refresh_loading = false
       }, 3000)
     },
   },
   /**
    * @description: 组件销毁前回调方法
    */
   destroyed() {
     this.clear_timer()
     this.$root.$off("autoset_match", this.emit_autoset_match);
     this.$root.$off("check_plays_show", this.check_plays_show);
     this.$root.$off("close_tips", this.close_tips);
     this.$utils.del(this.ol_obj);
     this.$utils.del(this.hl_obj);
     this.debounce_throttle_cancel(this.refresh);
     this.refresh_loading_timer && clearTimeout(this.refresh_loading_timer)
     // 站点 tab 休眠状态转激活
     this.$root.$off(this.emit_cmd.EMIT_SITE_TAB_ACTIVE, this.emit_site_tab_active);
 
     this.$root.$off("match_detail_base", this.get_match_detail_base);
 
     this.$root.$off("change_loading_status_right_details", this.getLoading)
     this.$root.$off("match_details_header_height_right_details", this.getHeaderHeight)
 
     this.match_info_ctr.destroy();
     this.match_infoData = null;
     this.category_list = null;
     this.match_details = null;
   },
 };
 </script>
 
 <style lang="scss" scoped>
@import "./index.scss";
 </style>
 