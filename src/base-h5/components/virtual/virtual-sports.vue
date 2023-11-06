<template>
  <div class="virtual-sports">
    <!-- <virtual-skeleton v-show="virtual_data_loading"></virtual-skeleton> -->
    <!--联赛tab-->
    <div class="tab-wrapper">
      <div class="tab-item" v-for="(tab_item,i) of tab_items" :class="{active:i == tab_item_i}"
        :key="i" @click="tab_item_click_handle(i,null,'user_change')">
        <div>{{tab_item.name}}</div>
      </div>
    </div>
    <div class="tab-title">
      <div class="league-name right-border">{{ lengue_name }}</div>
      <div class="status">
        <!-- <span class="num">第10轮</span>
        <span class="state">比赛中</span> -->
        <icon-wapper class="icon" color="#e1e1e1" name="icon-arrow" size="15px" />
      </div>
    </div>
    <template v-if="!no_virtual_match">
      <!--选中的赛事阶段组件包含赛前倒计时,赛中视频,完赛等状态-->
      <!--此组件:key去除后有问题, 赛事倒计时时钟颜色红黄错乱-->
      <virtual-sports-stage
        :is_before_destroy="is_before_destroy"
        :key="current_match.mid"
        :m_status="current_match.match_status"
        :virtual_match_list="match_list_by_no"
        :current_match="current_match" source='list'
        :is_video_playing="is_video_playing"
        :v_match_router_ente="v_match_router_ente"
        :virtual_result_rank_data="virtual_result_rank_data"
        @time_ended="timer_ended_handle"
        @update_next_batch_match="update_n_batch_handle">
      </virtual-sports-stage>
      <div class="test-line" v-if="show_debug">
        {{current_match.mid}}
      </div>
      <!--赛事轮|期菜单-->
      <!-- <match-tab
        :is_reset_tab_i="is_reset_tab_i"
        :current_league="tab_items[tab_item_i]"
        :current_match="current_match"
        :is_basket_ball_next_no="is_basket_ball_next_no"
        :v_menu_changed="v_menu_changed"
        :before_match_tab_trend="before_match_tab_trend"
        @trend_event_change="trend_event_change"
        @time_ended="timer_ended_handle"
      ></match-tab> -->
      <!--  虚拟体育主列表页面  -->
      <div v-if="!ranking_list_change" class="v-sports-main-list" 
        :class="{'v-sports-main-list-style': standard_edition === 1}" 
        :style="{'padding-bottom': get_betbar_show ? '0.5rem' : '0'}">
        <!-- 虚拟体育足球赛事列表 -->
        <v-s-match-list v-if="[1001,1004].includes(current_sub_menu_id)" :virtual_match_list="match_list_by_no"
          :match_list_loaded="match_list_loaded" :csid="current_sub_menu_id" :v_menu_changed="v_menu_changed"
          @switch_match="switch_match_handle"  @start="match_start_handle">
        </v-s-match-list>

        <div v-if="current_match.match_status == 0">
          <!-- 赛马切换玩法集tab组件 -->
          <virtual-sports-tab
            :batch="current_match_id"
            v-if="![1001,1004].includes(current_sub_menu_id)">
          </virtual-sports-tab>
          <!-- 打印请勿删除 -->
          <div><span>{{ i18n_t('app_h5.v_sports.event_status') }}</span>{{current_match.match_status}}</div>
          <!-- 赛马投注区域 -->
          <div v-if="match_list_by_no && match_list_by_no.length && ![1001,1004].includes(current_sub_menu_id)">
            <virtual-sports-category
                :top_menu_changed="top_menu_changed"
                :current_match="match_list_by_no[0]" 
                source='sports'
                @top_menu_change="handle_top_menu_change"
            />
          </div>
        </div>

        <!-- 注释勿删除 -->
        <div class="v-sports-ranking" v-if="![1001,1004].includes(current_sub_menu_id)">
          <!-- 打印请勿删除 -->
          <div><span>{{ i18n_t('app_h5.v_sports.event_status') }}</span>{{current_match.match_status}}</div>
          <!-- 赛马的动态排名---赛马在比赛过程的时候显示 -->
          <dynamic-ranking v-if="current_match.match_status == 1" :virtual_match_list="[current_match]" />
          <!-- 赛马的结果展示页---赛马开奖结束后显示赛果 -->
          <result-page v-if="current_match.match_status == 2" :match_mid="current_match.mid" :current_match="current_match" @send_virtual_result_rank_data='send_virtual_result_rank_data'/>
        </div>
        <!-- 注释勿删除 -->
      </div>
      <!-- 排行榜页面,小组赛淘汰赛页面  -->
      <div v-else class="list-wrapper">
        <!--  足球 页面  -->
        <div v-if="[1001,1004].includes(current_sub_menu_id)">
          <!--  足球小组赛,淘汰赛页面  -->
          <group-knockout
            v-if="tab_items[tab_item_i] ? tab_items[tab_item_i].field3 != '': false"
            :tid="VirtualData.menu_list[tab_item_i].field1"
            :current_match="current_match"
          />
          <!--  足球排行榜页面  -->
          <football-ranking-list v-else :tid="VirtualData.menu_list[tab_item_i].field1"/>
        </div>
        <!--  非足球排行榜页面  -->
        <ranking-list-start v-else :mid="current_match.mid"/>
      </div>
      <!-- 占位撑开高度 -->
    </template>
    <no-data v-else which='noMatch' height='500'></no-data>

  </div>
</template>

<script>
import matchTab from "src/base-h5/components/virtual/match-tab.vue"
import virtualSportsStage from "src/base-h5/components/virtual/virtual-sports-stage.vue"
import dynamicRanking from "src/base-h5/components/virtual/dynamic-ranking.vue"
import vsMatchList from "src/base-h5/components/virtual/virtual-sports-match-list.vue"
import rankingListStart from "src/base-h5/components/virtual/ranking-list-start.vue"
import groupKnockout from "src/base-h5/components/virtual/group-knockout.vue"
import footballRankingList from "src/base-h5/components/virtual/football-ranking-list.vue"
import virtualSportsTab from "src/base-h5/components/details/components/virtual-sports-tab.vue"
import virtualSportsCategory from "src/base-h5/components/details/children/virtual-sports-category.vue"
import VirtualData from 'src/core/match-list-h5/virtual-sports/virtual-data.js'
import VirtualVideo from 'src/core/match-list-h5/virtual-sports/virtual-video.js'
import resultPage from "src/base-h5/components/match-list/components/result-page.vue"
import noData from "src/base-h5/components/common/no-data.vue";
import virtualSkeleton from "src/base-h5/components/skeleton/virtual-sports/virtual.vue"
import lodash from "lodash";
import { IconWapper } from 'src/components/icon'
import { get_now_server } from 'src/core/utils/module/other.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";

import 'src/base-h5/css/pages/virtual-sports.scss'

export default defineComponent({
  name: "virtual",
  components:{
    noData,
    IconWapper,
    'virtual-sports-category':virtualSportsCategory,
    'match-tab':matchTab,
    'v-s-match-list':vsMatchList,
    'ranking-list-start':rankingListStart,
    'football-ranking-list':footballRankingList,
    'group-knockout':groupKnockout,
    'virtual-sports-tab':virtualSportsTab,
    'virtual-sports-stage':virtualSportsStage,
    'dynamic-ranking': dynamicRanking,
    'result-page': resultPage,
    'virtual-skeleton':virtualSkeleton,
  },
  props:{
    params:Object,
    is_user_refresh:Boolean,
    v_menu_changed:Number | String,
    v_match_router_ente:Number,
  },
  
  setup(props, evnet) {
    const { params, is_user_refresh, v_match_router_ente } = toRefs(props);
    const state = reactive({
      // 事件集合
      emitters: [],
      show_debug:sessionStorage.getItem('wsl') == '9999',
      //当前选中的赛事id
      lengue_name:'',
      //赛事列表数据加载成功标识 用于初始化显示赛事列表
      match_list_loaded:0,
      //趋势图标显示标志
      trend_is_show:true,
      //联赛选中项下标
      tab_item_i:0,
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
      // 定时器
      procee_again_timer: null,
      timer1_: null
    });
    const match_list_by_no = computed(() => {
      return VirtualData.match_list_by_no || []
    })
    const tab_items = computed(() => {
      let r = [];
      if(VirtualData.menu_list && VirtualData.menu_list.length){
        r = VirtualData.menu_list;
      }
      return r;
    });
    const current_sub_menu_id = computed(() => {
      return Number(lodash.get(VirtualData.current_sub_menu, 'menuId', 0))
    })
    const current_match_id = computed(() => {
      return VirtualData.current_match_mid
    })
    const sub_menuid = computed(() => {
      return ""
    });
    const get_video_process_data = computed(() => {
      return ""
    });
    const get_prev_v_sports_params = computed(() => {
      return ""
    });
    const is_show_analyse = computed(() => {
      return ""
    });
    const get_bet_list = computed(() => {
      return ""
    });
    const get_betbar_show = computed(() => {
      return ""
    });
    
    
    
    watch(() => props.v_menu_changed, (change_str) => {
        state.tab_item_i = 0;
        state.ranking_list_change = false;
        // 根据 足蓝标识设置二级菜单切换状态
        state.top_menu_changed = !change_str.includes('zu_lan_')
      }
    );
    watch( () => VirtualData.menu_list, () => {
      if(tab_items.value && tab_items.value.length){

        if(VirtualData.current_league){
          tab_items.value.forEach((t_item,i) => {
            if(t_item.menuId == VirtualData.current_league.menuId){
              state.tab_item_i = i;
            }
          });
        }

        let current_league = tab_items.value[state.tab_item_i];
        VirtualData.set_current_league(lodash.cloneDeep(current_league));
        tab_item_click_handle(state.tab_item_i,'is_force');
      }
    }, { deep: true });

    watch( () => current_sub_menu_id.value, (c,n) => {
        //赛马赛狗 摩托车
        if([1011, 1002, 1010, 1009].includes(c)){
          state.ranking_list_change = false;
        }
        let prev_league_id = ''
        if(VirtualData.current_league){
          prev_league_id = VirtualData.current_league.menuId;
        }
        VirtualData.set_current_batch({});
        set_league_i_by_id(prev_league_id);
        tab_item_click_handle(state.tab_item_i);
        VirtualData.get_virtual_sport_local();
      }, { deep: true });
    onMounted(() => {
      // #TODO emit事件
      state.emitters = [
        useMittOn(MITT_TYPES.EMIT_ARRIVED10, arrived10_handle).off,
        useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2, match_ended_status2_handle).off,
      ]
      // useMittOn(MITT_TYPES.EMIT_ARRIVED10,arrived10_handle);
      // useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2,match_ended_status2_handle);
      // match_ended_status2_handle();
    });

    onUnmounted(() => {
      state.is_before_destroy = Math.random();
      if(state.video_process_obj && state.video_process_obj.destroy){
        state.video_process_obj.destroy();
      }
      state.emitters.map((x) => x())
      // useMittOn(MITT_TYPES.EMIT_ARRIVED10,arrived10_handle);
      // useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2,match_ended_status2_handle);

      clear_timer()

    })

    // #TODO vuex actions 
    // ...mapMutations({
    //   set_video_process_data:"set_video_process_data",
    //   set_prev_v_sports_params:"set_prev_v_sports_params",
    //   set_current_mid:'set_current_mid',
    // }),


    // 顶部菜单切换状态改变
    const handle_top_menu_change = (status) => {
      state.top_menu_changed = status
    };
    /**
     *@description 更新虚拟体育赛果最终排名数据，接口在子组件调用，数据由子组件传上来,目前只有泥地摩托车用到
     *@param {Array} arr 排名数据
     *@return {Undefined} undefined
     */
    const send_virtual_result_rank_data = (arr) => {
      if(current_sub_menu_id.value == 1009) {
        state.virtual_result_rank_data = arr
      }
    };
    /**
     * 提前10秒通知封盘
     * @params {Object} mid 赛事id,batchNo 期号
     */
    const arrived10_handle = ({mid,batchNo}) => {
      if(match_list_by_no.value && match_list_by_no.value.length){
        match_list_by_no.value.forEach(m => {
          if(m.batchNo == batchNo){
            m.mhs = 1;
          }
        });
      }
      if(current_sub_menu_id.value == 1004 && !state.singleton_10second){
        state.singleton_10second = true;
        VirtualData.get_score_basket_ball();
      }
    };
    /**
     * 赛事结束检查是否该轮赛事全部结束,以便展示赛果
     */
    const match_ended_status2_handle = () => {
      //获取赛事结束时的比分
      // get_result_score();

      let is_all_end = true;
      if(!match_list_by_no.value || !match_list_by_no.value.length){
        is_all_end = false;
      }
      for (let i = 0; i < match_list_by_no.value.length; i++) {
        const m = match_list_by_no.value[i];
        if(VirtualData.current_batch.batchNo != m.batchNo){
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
        match_list_by_no.value.forEach(m => {
          mid_list.push(m.mid);
        });
        if (mid_list.length) {
          get_match_result(mid_list.join(','), () => {
            match_list_by_no.value.forEach(m => {
              m.mhs = 11;
              mid_list.push(m.mid);
            });
          });
        }
        useMittEmit(MITT_TYPES.EMIT_IS_ALL_END_NOTICE);
        // useMittEmit(MITT_TYPES.EMIT_IS_ALL_END_NOTICE);

        //1011赛马、1002赛狗、1010摩托车、1009泥地摩托车结束时更新下一期
        if([1011, 1002, 1010, 1009].includes(current_sub_menu_id.value)){
          state.timer1_ = setTimeout(() => {
            check_is_first_tab_delete();
          },5000);
        }

      }
      state.singleton_10second = false;
    };
    /**
     * 开赛倒计时计时结束
     * @params {String} flag 时间标识
     */
    const timer_ended_handle = (flag) => {
      //篮球滚球倒计时结束拉取视频接口
      if(current_sub_menu_id.value == 1004){
        if(flag == 'is_basketball_playing'){
          VirtualVideo.get_video_process_by_api(() => {
            VirtualVideo.get_match_video_process(state.current_match);
          });
          state.is_video_playing = true;
          get_next_pre_basketball();
        }
        else if(flag == 'is_basketball_pre'){
          VirtualVideo.get_video_process_by_api();
          VirtualData.get_score_basket_ball();
          useMittEmit(MITT_TYPES.EMIT_PRE_COUNTING_EDN);
          // useMittEmit(MITT_TYPES.EMIT_PRE_COUNTING_EDN); //篮球早盘倒计时结束
        }
      }
      else{
        // 比赛已开始, 获取视频接口
        VirtualVideo.get_video_process_by_api(() => {
          VirtualVideo.get_match_video_process(state.current_match);
        });
      }

    };
    /**
     * 当前选中的赛事切换
     * @params {Object} match赛事对象
     */
    const switch_match_handle = (i) => {
      let match = match_list_by_no.value[i];
      if(match){
        let server_now = get_now_server();
        match.start_now_sub = Number(match.mgt) - server_now;
        if(current_sub_menu_id.value == 1004){
          if(match.mmp == 'INGAME'){
            if(match.start_now_sub <= 0){
              VirtualVideo.get_video_process_by_api(() => {
                state.current_match = match;
                VirtualVideo.get_match_video_process(state.current_match);
              });
            }
          }
          else if(match.mmp == 'PREGAME'){
            if(match.start_now_sub <= 0){
              VirtualVideo.get_video_process_by_api();
              useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
              // useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
            }
          }
          state.current_match = match;
        }
        else{
          if(match.start_now_sub < 0){
            state.current_match = {};
            VirtualVideo.get_video_process_by_api(() => {
              state.current_match = match;
              VirtualVideo.get_match_video_process(state.current_match);
            });
          }
          else{
            state.current_match = match;
          }
        }

      }
    };
    /**
     * 赛事开赛
     * @params {Object} match赛事对象
     */
    const match_start_handle = () => {
      VirtualVideo.get_video_process_by_api();
    };
    /**
     * 更新下一期赛事列表
     */
    const update_n_batch_handle = () => {
      VirtualData.get_virtual_sport_local('is_user_clicked');
    };
    /**
     * 联赛切换
     * @params {Number} i
     */
    const tab_item_click_handle = (i,is_force,user_change) => {
      if(state.tab_item_i=== i && !is_force) return;
      if(state.ranking_list_change) {
        state.before_match_tab_trend = Math.random();
      }
      if(user_change == 'user_change'){
        VirtualData.set_current_batch({});
      }
      state.tab_item_i = i;
      if(tab_items.value && tab_items.value.length && i > -1){
        let current_league = tab_items.value[i];
        state.lengue_name = current_league.name
        if(!current_league){
          current_league = tab_items.value[0];
        }
        VirtualData.set_current_league(lodash.cloneDeep(current_league));
      }else{
        VirtualData.set_current_league({});
      }
      state.current_match = {};
      VirtualData.get_virtual_sport_local('is_user_clicked');
    };
    /**
     * 生成赛事请求接口参数
     */
    const param_generate = () => {
      let params = null;
      if(VirtualData.menu_list && VirtualData.menu_list[state.tab_item_i]){
        let league = VirtualData.menu_list[state.tab_item_i];
        params = {
          tid:league.field1,
          csid:params.csid
        };
      }
      return params;
    };
    /**
     * 切换排行榜
     * @param {Object} data
     * @return {Undefined} Undefined
     */
    const trend_event_change = (data) => {
      state.ranking_list_change = data
    };
    /**
     * 通过联赛id设置下标
     */
    const set_league_i_by_id = (l_id) => {
      let r = 0;
      tab_items.value.forEach((t_item,i) => {
        if(l_id == t_item.menuId){
          r = i;
        }
      });
      state.tab_item_i = r;
    };
    // 清除当前组件全部定时器
    const clear_timer = () => {
      clearTimeout(state.procee_again_timer)
      clearTimeout(state.timer1_)
      clearTimeout(state.timer_super5)
      state.procee_again_timer = null;
      state.timer1_ = null;
      state.timer_super5 = null;
    };
    return {
      ...toRefs(state),
      clear_timer,
      standard_edition,
      set_league_i_by_id,
      trend_event_change,
      param_generate,
      tab_item_click_handle,
      handle_top_menu_change,
      send_virtual_result_rank_data,
      arrived10_handle,
      match_ended_status2_handle,
      timer_ended_handle,
      switch_match_handle,
      match_start_handle,
      update_n_batch_handle,
      tab_items,
      sub_menuid,
      current_match_id,
      get_video_process_data,
      get_prev_v_sports_params,
      is_show_analyse,
      get_bet_list,
      match_list_by_no,
      current_sub_menu_id,
      get_betbar_show,
    }
  }
});
</script>

<style lang="scss" scoped>

/*  联赛菜单 */
.tab-wrapper {
  height: 0.42rem;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  align-items: center;
  padding: 0 0.08rem;
  border-bottom: 0.1rem solid #f8f9fa;
  .tab-item {
    height: 0.26rem;
    line-height: 0.26rem;
    border-radius: 0.04rem;
    margin-right: 0.06rem;
    padding: 0 0.1rem;
    flex-shrink: 0;
  }
}
.tab-title{
  height: 0.25rem;
  display: flex;
  padding: 0 0.1rem;
  align-items: center;
  justify-content: space-between;
  .league-name{
    color: #303442;
    font-weight: 600;
  }
  .status{
    .state{
      margin: 0 5px;
      color: #fff;
      padding: 0 6px;
      border-radius: 3px;
      font-size: 0.11rem;
      display: inline-block;
      background: #7981A4;
    }
    .icon{
      transform: rotate(180deg);
    }
  }
}

.list-wrapper {
  margin: 0.04rem 0;
  padding: 0 0.07rem;
}

.v-sports-main-list-style {
  padding-bottom: .48rem;
}
</style>
