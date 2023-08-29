<template>
  <div class="virtual-sports">
    <!-- <virtual-skeleton v-show="virtual_data_loading">
    </virtual-skeleton> -->
    <!--联赛tab-->
    <div class="tab-wrapper">
      <div class="tab-item" :class="{active:i == tab_item_i}" v-for="(tab_item,i) of tab_items"
        :key="i" @click="tab_item_click_handle(i,null,'user_change')">
        {{tab_item.name}}
      </div>
    </div>

    <template v-if="!no_virtual_match">
      <!--选中的赛事阶段组件包含赛前倒计时,赛中视频,完赛等状态-->
      <!--此组件:key去除后有问题, 赛事倒计时时钟颜色红黄错乱-->
      <!-- <virtual-sports-stage ref="virtual_sports_stage"
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
      </virtual-sports-stage> -->
      <div class="test-line" v-if="show_debug">
        {{current_match.mid}}
      </div>
      <!--赛事轮|期菜单-->
      <!-- <match-tab
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
      ></match-tab> -->
      <!--  虚拟体育主列表页面  -->
      <div
          v-if="!ranking_list_change"
          class="v-sports-main-list" 
          :class="{'v-sports-main-list-style': get_newer_standard_edition === 1}" 
          :style="{'padding-bottom': get_betbar_show ? '0.5rem' : '0'}"
      >
        <!-- 虚拟体育足球赛事列表 -->
        <!-- <v-s-match-list v-if="[1001,1004].includes(sub_menu_type)" :virtual_match_list="match_list_by_no"
          :match_list_loaded="match_list_loaded" :csid="sub_menu_type" :v_menu_changed="v_menu_changed"
          @switch_match="switch_match_handle"  @start="match_start_handle">
        </v-s-match-list> -->

        <div v-if="current_match.match_status == 0">
          <!-- 赛马切换玩法集tab组件 -->
          <!-- <virtual-sports-tab
            :batch="current_match_id"
            v-if="![1001,1004].includes(sub_menu_type)">
          </virtual-sports-tab> -->
          <!-- 打印请勿删除 -->
          <!-- <div><span>赛事状态</span>{{current_match.match_status}}</div> -->
          <!-- 赛马投注区域 -->
          <div v-if="match_list_by_no && match_list_by_no.length && ![1001,1004].includes(sub_menu_type)">
            <!-- <virtual-sports-category
                :top_menu_changed="top_menu_changed"
                :current_match="match_list_by_no[0]" 
                source='sports'
                @top_menu_change="handle_top_menu_change"
            /> -->
          </div>
        </div>

        <!-- 注释勿删除 -->
        <div class="v-sports-ranking" v-if="![1001,1004].includes(sub_menu_type)">
          <!-- 打印请勿删除 -->
          <!-- <div><span>赛事状态</span>{{current_match.match_status}}</div> -->
          <!-- 赛马的动态排名---赛马在比赛过程的时候显示 -->
          <!-- <dynamic-ranking v-if="current_match.match_status == 1" :virtual_match_list="[current_match]" /> -->
          <!-- 赛马的结果展示页---赛马开奖结束后显示赛果 -->
          <!-- <result-page v-if="current_match.match_status == 2" :match_mid="current_match.mid" :current_match="current_match" @send_virtual_result_rank_data='send_virtual_result_rank_data'/> -->
        </div>
        <!-- 注释勿删除 -->
      </div>
      <!-- 排行榜页面,小组赛淘汰赛页面  -->
      <div v-else class="list-wrapper">
        <!--  足球 页面  -->
        <div v-if="[1001,1004].includes(sub_menu_type)">
          <!--  足球小组赛,淘汰赛页面  -->
          <!-- <group-knockout
            v-if="tab_items[tab_item_i] ? tab_items[tab_item_i].field3 != '': false"
            :tid="menu_list[tab_item_i].field1"
            :current_match="current_match"
          /> -->
          <!--  足球排行榜页面  -->
          <!-- <football-ranking-list v-else :tid="menu_list[tab_item_i].field1"/> -->
        </div>
        <!--  非足球排行榜页面  -->
        <!-- <ranking-list-start v-else :mid="current_match.mid"/> -->
      </div>
      <!-- 占位撑开高度 -->
    </template>
    <!-- <no-data v-else which='noMatch' height='500'></no-data> -->

  </div>
</template>

<script>
// #TODO 
// import { mapGetters,mapMutations } from "vuex"
// #TODO mixins 
// import common from 'project_path/mixins/constant/module/common.js';
// import virtual_sports_mixin from "project_path/mixins/virtual_sports/virtual_sports_mixin.js"

// import noData from "project_path/components/common/no_data.vue";
// import matchTab from "project_path/pages/virtual/virtual_sports_part/match_tab.vue"
// import v_s_match_list from "project_path/pages/virtual/virtual_sports_part/virtual_sports_match_list.vue"
// import ranking_list_start from "project_path/pages/virtual/virtual_sports_part/ranking_list_start.vue"
// import group_knockout from "project_path/pages/virtual/virtual_sports_part/group_knockout.vue"
// import football_ranking_list from "project_path/pages/virtual/virtual_sports_part/football_ranking_list.vue"
// import virtualSportsTab from "project_path/pages/details/components/virtual_sports_tab.vue"
// import virtual_sports_category from "project_path/pages/details/children/virtual_sports_category.vue"
// 公共方法
import {utils } from 'src/core/index.js';
// import virtual_sports_stage from "project_path/pages/virtual/virtual_sports_part/virtual_sports_stage.vue"
// import dynamic_ranking from "project_path/pages/virtual/virtual_sports_part/dynamic_ranking.vue"
// import result_page from "project_path/pages/match-list/components/result_page.vue"
// import virtual_skeleton from "project_path/components/skeleton/virtual_sports/virtual.vue"
import { PageSourceData  } from "src/core/index.js";
import lodash from "lodash";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { defineComponent, reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
export default defineComponent({
  name: "virtual",
  components:{
    // 'virtual-sports-category':virtual_sports_category,
    // 'match-tab':matchTab,
    // 'v-s-match-list':v_s_match_list,
    // 'ranking-list-start':ranking_list_start,
    // 'football-ranking-list':football_ranking_list,
    // 'group-knockout':group_knockout,
    // 'virtual-sports-tab':virtualSportsTab,
    // 'virtual-sports-stage':virtual_sports_stage,
    // 'dynamic-ranking': dynamic_ranking,
    // 'result-page': result_page,
    // noData,
    // 'virtual-skeleton':virtual_skeleton,
  },
  props:{
    menu_list:Array,
    params:Object,
    current_sub_menu:Object,
    is_user_refresh:Boolean,
    v_menu_changed:Number | String,
    v_match_router_ente:Number,
  },
  
  setup(props, evnet) {
    const { menu_list, params, current_sub_menu, is_user_refresh, v_match_router_ente } = toRefs(props);
    console.log("current_sub_menu", current_sub_menu);
    const component_data = reactive({
      // 事件集合
      emitters: [],
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
      // 定时器
      procee_again_timer: null,
      timer1_: null
    });
    component_data.timer1_ = null;
    // utils.load_player_js();
  // computed:{
  //   //
  //   ...mapGetters({
  //     sub_menuid: 'get_current_sub_menuid',
  //     sub_menu_type: 'get_curr_sub_menu_type',
  //     current_league: 'get_current_league',
  //     current_batch:'get_current_batch',
  //     get_video_process_data:"get_video_process_data",
  //     get_prev_v_sports_params:"get_prev_v_sports_params",
  //     get_prev_v_sports:"get_prev_v_sports",
  //     is_show_analyse:"get_is_show_details_analyse",
  //     get_bet_list:"get_bet_list",
  //     get_betbar_show:"get_betbar_show",
  //     get_newer_standard_edition:"get_newer_standard_edition",
  //   }),
  //   //标签页列表
  //   tab_items(){
  //     let r = [];
  //     if(menu_list && menu_list.length){
  //       r = menu_list;
  //     }
  //     return r;
  //   }
  // },
    const sub_menuid = computed(() => {
      return ""
    });
    const sub_menu_type = computed(() => {
      return ""
    });
    const current_league = computed(() => {
      return ""
    });
    const current_batch = computed(() => {
      return ""
    });
    const get_video_process_data = computed(() => {
      return ""
    });
    const get_prev_v_sports_params = computed(() => {
      return ""
    });
    const get_prev_v_sports = computed(() => {
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
    const get_newer_standard_edition = computed(() => {
      return PageSourceData.get_newer_standard_edition();
    });
    const tab_items = computed(() => {
      let r = [];
      if(menu_list && menu_list.length){
        r = menu_list;
      }
      return r;
    });
    
    
    watch(
      () => props.v_menu_changed,
      (change_str) => {
        const { tab_item_i } = data;
        tab_item_i = 0;
        component_data.ranking_list_change = is_show_analyse;
        // 根据 足蓝标识设置二级菜单切换状态
        component_data.top_menu_changed = !change_str.includes('zu_lan_')
      }
    );
    watch(
      () => menu_list,
      () => {
        if(tab_items.value && tab_items.value.length){

          if(current_league){
            tab_items.value.forEach((t_item,i) => {
              if(t_item.menuId == current_league.menuId){
                component_data.tab_item_i = i;
              }
            });
          }

          let current_league = tab_items.value[tab_item_i];
          // set_current_league(_.cloneDeep(current_league));
          // tab_item_click_handle(tab_item_i,'is_force');
        }
      }
    );
    watch(
      () => props.current_sub_menu,
      () => {
        let prev_league_id = ''
        if(current_league){
          prev_league_id = current_league.menuId;
        }
        // set_current_batch({});
        set_league_i_by_id(prev_league_id);
        tab_item_click_handle(component_data.tab_item_i);
        // get_virtual_sport_local();
      }
    );

    watch(
      () => props.is_user_refresh,
      (n) => {
        if(n){
          // get_virtual_sport_local('is_user_refreshing')
        }
      }
    );

    watch(
      () => props.is_user_refresh,
      (n) => {
        if(n){
          // get_virtual_sport_local('is_user_refreshing')
        }
      }
    );

    watch(
      () => sub_menu_type,
      (c,n) => {
        //赛马赛狗 摩托车
        if([1011, 1002, 1010, 1009].includes(c)){
          component_data.ranking_list_change = false;
        }
      }
    );
    onMounted(() => {
      // #TODO emit事件
      component_data.emitters = [
        useMittOn(MITT_TYPES.EMIT_ARRIVED10, arrived10_handle).off,
        useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2, match_ended_status2_handle).off,
      ]
      // useMittOn(MITT_TYPES.EMIT_ARRIVED10,arrived10_handle);
      // useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2,match_ended_status2_handle);
      match_ended_status2_handle();
    });

    onUnmounted(() => {
      component_data.is_before_destroy = Math.random();
      if(component_data.video_process_obj && component_data.video_process_obj.destroy){
        component_data.video_process_obj.destroy();
      }
      component_data.emitters.map((x) => x())
      // useMittOn(MITT_TYPES.EMIT_ARRIVED10,arrived10_handle);
      // useMittOn(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2,match_ended_status2_handle);

      clear_timer()

      for (const key in $data) {
        $data[key] = null
      }
    })

    // #TODO vuex actions 
    // ...mapMutations({
    //   set_current_league:"set_current_league",
    //   set_video_process_data:"set_video_process_data",
    //   set_prev_v_sports_params:"set_prev_v_sports_params",
    //   set_current_mid:'set_current_mid',
    // }),


    // 顶部菜单切换状态改变
    const handle_top_menu_change = (status) => {
      component_data.top_menu_changed = status
    };
    /**
     *@description 更新虚拟体育赛果最终排名数据，接口在子组件调用，数据由子组件传上来,目前只有泥地摩托车用到
     *@param {Array} arr 排名数据
     *@return {Undefined} undefined
     */
    const send_virtual_result_rank_data = (arr) => {
      if(sub_menu_type == 1009) {
        component_data.virtual_result_rank_data = arr
      }
    };
    /**
     * 提前10秒通知封盘
     * @params {Object} mid 赛事id,batchNo 期号
     */
    const arrived10_handle = ({mid,batchNo}) => {
      if(component_data.match_list_by_no && component_data.match_list_by_no.length){
        component_data.match_list_by_no.forEach(m => {
          if(m.batchNo == batchNo){
            m.mhs = 1;
          }
        });
      }
      if(sub_menu_type == 1004 && !component_data.singleton_10second){
        component_data.singleton_10second = true;
        get_score_basket_ball();
      }
    };
    /**
     * 赛事结束检查是否该轮赛事全部结束,以便展示赛果
     */
    const match_ended_status2_handle = () => {
      //获取赛事结束时的比分
      // get_result_score();

      let is_all_end = true;
      if(!component_data.match_list_by_no || !component_data.match_list_by_no.length){
        is_all_end = false;
      }
      for (let i = 0; i < component_data.match_list_by_no.length; i++) {
        const m = component_data.match_list_by_no[i];
        if(current_batch.batchNo != m.batchNo){
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
        component_data.match_list_by_no.forEach(m => {
          mid_list.push(m.mid);
        });
        if (mid_list.length) {
          get_match_result(mid_list.join(','), () => {
            component_data.match_list_by_no.forEach(m => {
              m.mhs = 11;
              mid_list.push(m.mid);
            });
          });
        }
        useMittEmit(MITT_TYPES.EMIT_IS_ALL_END_NOTICE);
        // useMittEmit(MITT_TYPES.EMIT_IS_ALL_END_NOTICE);

        //1011赛马、1002赛狗、1010摩托车、1009泥地摩托车结束时更新下一期
        if([1011, 1002, 1010, 1009].includes(sub_menu_type)){
          component_data.timer1_ = setTimeout(() => {
            check_is_first_tab_delete();
          },5000);
        }

      }
      component_data.singleton_10second = false;
    };
    /**
     * 开赛倒计时计时结束
     * @params {String} flag 时间标识
     */
    const timer_ended_handle = (flag) => {
      //篮球滚球倒计时结束拉取视频接口
      if(sub_menu_type == 1004){
        if(flag == 'is_basketball_playing'){
          get_video_process_by_api(() => {
            get_match_video_process(component_data.current_match);
          });
          component_data.is_video_playing = true;
          get_next_pre_basketball();
        }
        else if(flag == 'is_basketball_pre'){
          get_video_process_by_api();
          get_score_basket_ball();
          useMittEmit(MITT_TYPES.EMIT_PRE_COUNTING_EDN);
          // useMittEmit(MITT_TYPES.EMIT_PRE_COUNTING_EDN); //篮球早盘倒计时结束
        }
      }
      else{
        // 比赛已开始, 获取视频接口
        get_video_process_by_api(() => {
          get_match_video_process(component_data.current_match);
        });
      }

    };
    /**
     * 当前选中的赛事切换
     * @params {Object} match赛事对象
     */
    const switch_match_handle = (i) => {
      let match = component_data.match_list_by_no[i];
      if(match){
        let server_now = get_now_server();
        match.start_now_sub = Number(match.mgt) - server_now;
        if(sub_menu_type == 1004){
          if(match.mmp == 'INGAME'){
            if(match.start_now_sub <= 0){
              get_video_process_by_api(() => {
                component_data.current_match = match;
                get_match_video_process(component_data.current_match);
              });
            }
          }
          else if(match.mmp == 'PREGAME'){
            if(match.start_now_sub <= 0){
              get_video_process_by_api();
              useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
              // useMittEmit(MITT_TYPES.EMIT_BASKETBALL_TIME_ARRIVED);
            }
          }
          component_data.current_match = match;
        }
        else{
          if(match.start_now_sub < 0){
            component_data.current_match = {};
            get_video_process_by_api(() => {
              component_data.current_match = match;
              get_match_video_process(component_data.current_match);
            });
          }
          else{
            component_data.current_match = match;
          }
        }

      }
    };
    /**
     * 赛事开赛
     * @params {Object} match赛事对象
     */
    const match_start_handle = () => {
      get_video_process_by_api();
    };
    /**
     * 更新下一期赛事列表
     */
    const update_n_batch_handle = () => {
      // get_virtual_sport_local('is_user_clicked');
    };
    /**
     * 联赛切换
     * @params {Number} i
     */
    const tab_item_click_handle = (i,is_force,user_change) => {
      if(component_data.tab_item_i === i && !is_force) return;
      if(component_data.ranking_list_change) {
        component_data.before_match_tab_trend = Math.random();
      }
      if(user_change == 'user_change'){
        // set_current_batch({});
      }
      component_data.tab_item_i = i;
      if(tab_items.value && tab_items.value.length && component_data.tab_item_i > -1){
        let current_league = tab_items.value[component_data.tab_item_i];
        if(!current_league){
          current_league = tab_items.value[0];
        }
        set_current_league(lodash.cloneDeep(current_league));
      }else{
        set_current_league({});
      }
      component_data.current_match = {};
      // get_virtual_sport_local('is_user_clicked');
    };
    /**
     * 生成赛事请求接口参数
     */
    const param_generate = () => {
      let params = null;
      if(menu_list && menu_list[component_data.tab_item_i]){
        let league = menu_list[component_data.tab_item_i];
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
      component_data.ranking_list_change = data
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
      component_data.tab_item_i = r;
    };
    // 清除当前组件全部定时器
    const clear_timer = () => {
      clearTimeout(component_data.procee_again_timer)
      clearTimeout(component_data.timer1_)
      clearTimeout(component_data.timer_super5)
      component_data.procee_again_timer = null;
      component_data.timer1_ = null;
      component_data.timer_super5 = null;
    };
    return {
      ...toRefs(component_data),
      clear_timer,
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
      sub_menu_type,
      current_league,
      current_batch,
      get_video_process_data,
      get_prev_v_sports_params,
      get_prev_v_sports,
      is_show_analyse,
      get_bet_list,
      get_betbar_show,
      get_newer_standard_edition,
    }
  }
});
</script>

<style lang="scss" scoped>
.virtual-sports {

}

/*  联赛菜单 */
.tab-wrapper {
  height: 0.42rem;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  align-items: center;
  padding: 0 0.08rem;

  .tab-item {
    height: 0.26rem;
    line-height: 0.26rem;
    border-radius: 0.04rem;
    margin-right: 0.06rem;
    padding: 0 0.1rem;
    flex-shrink: 0;
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
