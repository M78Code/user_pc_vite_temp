<!--
 * @Author: Cronus
 * @Date: 2020-12-22 18:07:03
 * @Description: 虚拟体育
-->
<template>
  <div class="virtual-sports">
    <virtual-skeleton v-show="virtual_data_loading">
    </virtual-skeleton>
    <!-- <setting list_type="vr"/> -->
    <!--联赛tab-->
    <!--只有足球展示多个联赛菜单 -->
    <div class="fixed-head">
      <div class="tab-wrapper" v-if="sub_menu_type == 1001">
        <div class="tab-item" :class="{active:i == tab_item_i}" v-for="(tab_item,i) of tab_items"
          :key="i" @click="tab_item_click_handle(i,null,'user_change')">
          <div>{{tab_item.name}}</div>
        </div>
      </div>
      <!-- 全部联赛折叠 -->
      <div class="all-leagues"  @click="handle_all_league">
        <div class="left">
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/rili.png`" alt="">
          <span>{{i18n_t('filter.all_leagues')}}</span>
        </div>
        <div class="right">
          <!-- <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/gray-arrow.png`" :class="[!is_expend_all && 'expend_all_league']" alt=""> -->
        <div class='img' :class="[!is_expend_all && 'expend_all_league']" :style="compute_css_obj({key:'h5-kyapp-expand-lague'})"></div>
        </div>
      </div>
    </div>
    <div class="virtual-content-wrapper">
      <div class="virtual-sports-card">
        <div class="virtual-sports-card-content">
          <div class="tab-title" @click.stop="expend_video = !expend_video">
            <div class="league-name right-border">{{ lengue_name }}</div>
            <div class="status">
              <span class="num">{{current_match.no}}</span>
              <span class="state">
                <!-- 未开赛时间 -->
                <template v-if="current_match.match_status == 0">
                  {{match_list_all_batches && match_list_all_batches[0] && match_list_all_batches[0].remaining_time > 0 ? match_list_all_batches[0].timer_format :  i18n_t('virtual_sports.match_status.playing')}}
                </template>
                <template v-else>
                  {{ current_match.match_status == 2 ? i18n_t('collect.match_end') : i18n_t('virtual_sports.match_status.playing') }}
                </template>
              </span>
              <icon-wapper class="icon" :class="[!expend_video && 'expend_icon']" color="#e1e1e1" name="icon-arrow" size="15px" />
            </div>
          </div>
          <div v-show="expend_video">
            <!--选中的赛事阶段组件包含赛前倒计时,赛中视频,完赛等状态-->
            <!--此组件:key去除后有问题, 赛事倒计时时钟颜色红黄错乱-->
            <virtual-sports-stage ref="virtual_sports_stage"
              :is_before_destroy="is_before_destroy"
              :key="current_match.mid"
              :m_status="current_match.match_status"
              :virtual_match_list="match_list_by_no"
              :current_match="current_match" source='list'
              :is_video_playing="is_video_playing"
              :v_match_router_ente="v_match_router_ente"
              :virtual_result_rank_data="virtual_result_rank_data"
              @basketball_end="basketball_end_handle"
              @time_ended="timer_ended_handle"
              @update_next_batch_match="update_n_batch_handle">
            </virtual-sports-stage>
            <div class="test-line" v-if="show_debug">
              {{current_match.mid}}
            </div>
            <div class="virtual-video-play-team" v-if="sub_menu_type && [1001,1004].includes(sub_menu_type)">
                    <div class="vsm-options" :class="[current_match.mid === item.mid && 'active']" v-for="(item, index) in match_list_by_no" :key="index" @click.stop="switch_match_handle(index)">
                      <div class="teams">
                        <span>{{item.teams[0]}}</span>
                        <span class="number_family">{{item.home || 0}}</span>
                      </div>
                      <div class="teams">
                        <span>{{item.teams[1]}}</span>
                        <span class="number_family">{{item.away || 0}}</span>
                      </div>
                    </div>
            </div>
            <!-- 赛马：当前赛事展示，展示赔率、排行、赛果 -->
            <template v-else-if="sub_menu_type && current_match">
              <!-- 赛马的动态排名---赛马在比赛过程的时候显示 -->
              <dynamic-ranking v-if="current_match.match_status == 0 || current_match.match_status == 1" :virtual_match_list="[current_match]" />
              <!-- 赛马的结果展示页---赛马开奖结束后显示赛果 -->
              <result-page v-if="current_match.match_status == 2" :match_mid="current_match.mid" :current_match="current_match" @send_virtual_result_rank_data='send_virtual_result_rank_data'/>
          </template>
          </div>
        </div>
      </div>
      <div class="virtual-sports-card" v-for="(match_item_batch, i) in match_list_all_batches" :key="i">
       <div v-if="match_item_batch.remaining_time > 0" class="virtual-sports-card-content" :class="{'virtual-sports-card-simple': standard_edition === 1}">
        <div class="tab-title" @click.stop="expend_match(match_item_batch)">
          <div class="league-name right-border">{{ lengue_name }}</div>
          <div class="status">
            <span class="num">{{ match_item_batch.no }}</span>
            <span class="state">{{ match_item_batch.timer_format }}</span>
            <icon-wapper class="icon" :class="[!match_item_batch.is_expend && 'expend_icon']" color="#e1e1e1" name="icon-arrow" size="15px" />
          </div>
        </div>
        <template v-if="match_item_batch.is_expend">
            <!--  虚拟体育主列表页面  -->
            <div
                class="v-sports-main-list"
                :class="{'v-sports-main-list-style': standard_edition === 1}"
                :style="{'padding-bottom': get_betbar_show ? '0' : '0'}"
            >
              <!-- 虚拟体育足球赛事列表 -->
              <v-s-match-list v-if="[1001,1004].includes(sub_menu_type)" :virtual_match_list="match_item_batch.matchs"
                :match_list_loaded="match_list_loaded" :csid="sub_menu_type" :v_menu_changed="v_menu_changed"
                @switch_match="switch_match_handle"  @start="match_start_handle">
              </v-s-match-list>

              <!-- 除当前赛事外，展示赔率信息 -->
              <div class="v-sports-ranking" v-if="sub_menu_type && ![1001,1004].includes(sub_menu_type)">
                  <div>
                    <!-- 赛马切换玩法集tab组件 -->
                    <!-- <virtual-sports-tab
                      :batch="match_item_batch.matchs[0]?.mid">
                    </virtual-sports-tab> -->
                    <!-- 打印请勿删除 -->
                    <!-- <div><span>赛事状态</span>{{current_match.match_status}}</div> -->
                    <!-- 赛马投注区域 -->
                    <div>
                      <v-s-match-list2 v-if="sub_menu_type && ![1001,1004].includes(sub_menu_type)" :virtual_match_list="match_item_batch.matchs"
                        :match_list_loaded="match_list_loaded" :csid="sub_menu_type" :v_menu_changed="v_menu_changed"
                        @switch_match="switch_match_handle"  @start="match_start_handle">
                      </v-s-match-list2>
                    </div>
                  </div>
                </div>
            </div>
        </template>
       </div>
      </div>

      <template v-if="!no_virtual_match">
        <!--赛事轮|期菜单-->
        <match-tab
          style="display: none;"
          :is_reset_tab_i="is_reset_tab_i"
          :no_list="no_title_list"
          :is_user_switch_league="is_user_switch_league"
          :auto_change_tab_i_first="auto_change_tab_i_first"
          :current_league="tab_items[tab_item_i]"
          :current_match="current_match"
          :is_basket_ball_next_no="is_basket_ball_next_no"
          :v_menu_changed="v_menu_changed"
          :before_match_tab_trend="before_match_tab_trend"
          @sub_nav_change="sub_nav_changed"
          @trend_event_change="trend_event_change"
          @time_ended="timer_ended_handle"
          @update_next_batch_match="v_basket_ball_update_n"
        ></match-tab>
        <!-- 占位撑开高度 -->
      </template>
      </div>
      <!-- <no-data v-else which='noMatch' height='500'></no-data> -->
  </div>
</template>

<script>
import common from 'src/base-h5/vr/mixin/constant/module/common.js';
import virtual_sports_mixin from "src/base-h5/vr/mixin/virtual_sports/virtual_sports_mixin.js"
import noData from "src/base-h5/vr/components/common/no_data.vue";
import matchTab from "src/base-h5/vr/pages/virtual/virtual_sports_part/match_tab.vue"
import v_s_match_list from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_match_list.vue"
import v_s_match_list2 from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_match_list2.vue"
// import virtualSportsTab from "src/base-h5/vr/components/virtual_sports_tab.vue"
import virtual_sports_category from "src/base-h5/vr/pages/virtual/details/children/virtual_sports_category.vue"
import { utils } from "src/core/utils/common/module/utils.js";
import virtual_sports_stage from "src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_stage.vue"
import dynamic_ranking from "src/base-h5/vr/pages/virtual/virtual_sports_part/dynamic_ranking.vue"
import result_page from "src/base-h5/vr/pages/result/result_page.vue"
import virtual_skeleton from "src/base-h5/vr/components/skeleton/virtual_sports/virtual.vue"
// import setting from "src/project/components/common/setting";
import VR_CTR from "src/base-h5/vr/store/virtual_sports/virtual_ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { get_now_server } from 'src/core/utils/common/module/other.js'
import { IconWapper } from 'src/components/icon'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import { api_common } from "src/api/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, LOCAL_PROJECT_FILE_PREFIX,compute_css_obj } from "src/output/index.js"
export default {
  mixins:[common,virtual_sports_mixin],
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
      // 1:新手版 2:专业版
      standard_edition,
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
	set_current_league(data){VR_CTR.set_current_league(data)},
	set_video_process_data(data){VR_CTR.set_video_process_data(data)},
	set_prev_v_sports_params(data){VR_CTR.set_prev_v_sports_params(data)},
	set_current_mid(data){VR_CTR.set_current_mid(data)},

    //全部轮次展开折叠 
    handle_all_league(){
      this.expend_video = this.is_expend_all ? false : true;
      this.match_list_all_batches.forEach(item=>{
        item.is_expend = this.is_expend_all ? false : true;
      })
      this.is_expend_all = !this.is_expend_all;
    },
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
      VR_CTR.set_detail_data(data)
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
    //
    // ...mapGetters({
    //   sub_menuid: 'get_current_sub_menuid',
    //   sub_menu_type: 'get_curr_sub_menu_type',
    //   is_show_analyse:"get_is_show_details_analyse",
    //   get_bet_list:"get_bet_list",
    //   get_betbar_show:"get_betbar_show",
    //   get_newer_standard_edition:"get_newer_standard_edition",
    // }),
    current_league(){return VR_CTR.get_current_league()},
    current_batch(){return VR_CTR.get_current_batch()},
    get_video_process_data(){return VR_CTR.get_video_process_data()},
    get_prev_v_sports_params(){return VR_CTR.get_prev_v_sports_params()},
    get_prev_v_sports(){return VR_CTR.get_prev_v_sports()},
    sub_menuid(){return VR_CTR.get_current_sub_menuid()},
    sub_menu_type(){return VR_CTR.get_curr_sub_menu_type()},
    is_show_analyse(){return VR_CTR.get_is_show_details_analyse()},
    get_bet_list(){return []},
    get_betbar_show(){return 1},
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
  components:{
    'virtual-sports-category':virtual_sports_category,
    'match-tab':matchTab,
    'v-s-match-list':v_s_match_list,
    'v-s-match-list2':v_s_match_list2,
    // 'virtual-sports-tab':virtualSportsTab,
    'virtual-sports-stage':virtual_sports_stage,
    'dynamic-ranking': dynamic_ranking,
    'result-page': result_page,
    noData,
    // 'setting': setting,
    'icon-wapper': IconWapper,
    'virtual-skeleton':virtual_skeleton,
  },
  destroyed(){
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
</script>

<style lang="scss" scoped>

.fixed-head {
  position: sticky;
  top: 0.89rem;
  background: var(--q-gb-bg-c-21);
  z-index: 100;
}

/*  联赛菜单 */
.tab-wrapper {
  height: 0.32rem;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  align-items: center;
  padding: 0 0.08rem;
  background-color: var(--q-gb-bg-c-27);

  .tab-item {
    height: 0.26rem;
    line-height: 0.26rem;
    border-radius: 0.04rem;
    margin-right: 0.06rem;
    padding: 0 0.1rem;
    flex-shrink: 0;
    color:var(--q-gb-t-c-24);
    position: relative;
    &.active {
      color: var(--q-gb-t-c-1);
      &:after {
        content: "";
        display: block;
        width: 0.32rem;
        height: 0.02rem;
        background: var(--q-gb-t-c-1);
        position: absolute;
        bottom: -0.03rem;
        left: 50%;
        margin-left: -0.16rem;
      }
    }
  }
}

.tab-title{
  height: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 9px;
  &.tab-border {
    border-bottom: 1px solid var(--q-gb-bd-c-4);
  }
  .league-name{
    color: var(--q-gb-t-c-18);
    font-weight: 600;
    padding-left: 0.07rem;
  }.status{
    .num {
      color: var(--q-gb-t-c-18);
    }
  
    .state{
      margin: 0 5px;
      color: #fff;
      padding: 0 6px;
      border-radius: 3px;
      font-size: 0.11rem;
      display: inline-block;
      background: #7981A4;
      min-width: 0.48rem;
      text-align: center;
    }
    .icon{
      transform: rotate(180deg);
      &.expend_icon {
        transform: rotate(90deg);
      }
    }
  }
}

.all-leagues {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.15rem;
  height: 0.27rem;
  border-top: 0.02rem solid var(--q-gb-bd-c-3);
  background-color: var(--q-gb-bg-c-25);;

  .left {
    font-size: 0.12rem;
    color: var(--q-gb-t-c-18);;
    display: flex;
    align-items: center;
    img {
      width: 0.12rem;
      height: 0.12rem;
      margin-right: 0.04rem;
    }
  }
  .right {
    display: flex;
    align-items: center;
    div {
      width: 0.2rem;
      height: 0.16rem;
      &.expend_all_league {
        transform: rotate(-90deg);
      }
    }
  }
}
.virtual-content-wrapper {
  padding: 0.08rem 0.05rem 0;
  color: var(--q-gb-t-c-18);
  // background: #F2F2F6;
  background-color: var(--q-gb-bg-c-21) ;
  padding-bottom: 0.66rem;
}
.virtual-sports-card {
  &-content {
    background: var(--q-gb-bg-c-18);
    border-radius: .08rem;
    margin-bottom: .08rem;
    border: 1px solid var(--q-gb-bd-c-15);
  }
  &:last-of-type {
    padding-bottom: 0.7rem;
  }
  &-simple{
    background: var(--q-gb-bg-c-28);
  }
}


.list-wrapper {
  margin: 0.04rem 0;
  padding: 0 0.07rem;
}

.v-sports-main-list-style {
  padding-bottom: .48rem;
}

.virtual-video-play-team {
    display: flex;
    padding: .1rem;
    padding-bottom: 0;
    background: var(--q-gb-bg-c-28);
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    border-bottom-left-radius: .04rem;
    border-bottom-right-radius: .04rem;
    .vsm-options {
      width: 49%;
      height: 0.52rem;
      background: var(--q-gb-bg-c-18);
      border-radius: .04rem;
      margin-bottom: .08rem;
      display: flex;
      align-items: start;
      justify-content: center;
      flex-direction: column;
      font-size: .12rem;
      padding: .02rem .12rem;
      &.active {
        background: var(--q-gb-bg-c-37);
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
        .teams {
          color: var(--q-gb-t-c-30);
        }
      }
      .teams {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
</style>
