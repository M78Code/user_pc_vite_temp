<template>
  <div class="virtual-detail" ref="virtual_detail_box">
    <!-- 头部 -->
    <div class="virtual-head">
      <div class="type-bg bg1001">
        <div class="back-wrap">
          <!-- 返回按钮 -->
          <div class="detail-back" @click="go_where({back_to: 'go_back_from_virtual_detail',route_name:route.name,route,router})"></div>
          <!-- 虚拟体育 -->
          <div class="col">{{current_league.name}}</div>
          <!--刷新按钮-->
          <div class="virtual-ref" :class="{'refreshing':refreshing}" @click="vir_refresh"></div>
        </div>
      </div>
    </div>
    <!--视频，tab和玩法集部分-->
      <div class="detail-header-bg"></div>
      <div class="detail-header">
        <!--视频区域-->
        <div class="stage-wrapper">
          <virtual-sports-stage source='detail'
            :current_match="current_match" @update_next_batch_match="update_n_batch_handle"
            :match_process_update="match_process_update"
            :m_status="current_match.match_status"
            :basketball_status="basketball_status"
            @time_ended="timer_ended_handle">
          </virtual-sports-stage>
        </div>
        <!--热门等tab键-->
        <virtual-sports-tab @virtual_play_height="virtual_play_height" @change_tab="change_tab"></virtual-sports-tab>
        <div class="debug-test" v-if="show_debug">
          {{`batchNo:${current_batch.batchNo}-csid:${sub_menuid}-mid:${current_match.mid}`}}<br />
          {{`orderNo:${current_match.orderNo}-tid:${current_league.menuId}`}}
        </div>
      </div>
     <!--玩法集区域 -->
     <!-- 该区域在APP复刻版中已经改为白色背景了, 且不需要上边距 -->
    <div class="detail-main" :class="{'detail-main2':get_betbar_show}">
      <virtual-sports-category v-if="match && tabs_name == 'bet'" :mid="mid" :current_match="match" :source="'virtual_sports_details'"/>
      <virtual-match-statistic v-if="match && tabs_name == 'lszj'" />
      <!--  足球排行榜页面  :tid="menu_list[tab_item_i].field1"-->
      <football-ranking-list  v-if="match && tabs_name == 'rank'" :tid="current_league.field1" />  
    </div>
  </div>
</template>
<script>
// #TODO VUEX
// import { mapGetters,mapMutations } from "vuex"
// #TODO MIXINS
// import common from 'src/project/mixins/constant/module/common.js';
// import virtual_sports_mixin from "src/project/mixins/virtual_sports/virtual_sports_mixin.js"
import { api_virtual } from "src/api/index.js";
import virtualSportsTab from 'project_path/src/pages/details/children/virtual-sports-tab.vue'
import virtualSportsCategory from "project_path/src/pages/details/children/virtual-sports-category.vue"
import virtualMatchStatistic from 'src/base-h5/components/details/components/virtual-match-statistic-2.vue'
import virtualSportsStage from 'src/base-h5/components/virtual/virtual-sports-stage-2.vue'
// import VSport from 'src/base-h5/utils/vsport/vsport.js';
import VirtualVideo from 'src/core/match-list-h5/virtual-sports/virtual-video.js'
import VirtualData from 'src/core/match-list-h5/virtual-sports/virtual-data.js'
import lodash from "lodash";
import {debounce} from "lodash";
import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { MatchDetailCalss,MenuData,MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance,go_where } from "src/output/index.js";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch,defineComponent,ref } from "vue";
import { get_now_server } from 'src/core/utils/common/module/other.js'
import footballRankingList from "src/base-h5/components/virtual/football-ranking-list-2.vue"
export default defineComponent({
  name: "virtual_sports_details",
  // #TODO MIXINS
  // mixins:[common,virtual_sports_mixin],
  components: {
    virtualSportsStage,
    virtualSportsTab,
    virtualSportsCategory,
    virtualMatchStatistic,
    footballRankingList
  },

  setup(props, evnet) {
    const router = useRouter()
    const route = useRoute()
    let allData = reactive({
      vsport_operate:null,
      match_of_video:null,
      show_debug:sessionStorage.getItem('wsl') == '9999',
      mid:'',
      current_match:{},
      match:null,
      match_process_update:0,
      basketball_status:0,
      // 默认不刷新
      refreshing:false,
      current_league:VirtualData.current_league,  //todo
   
    });
    const is_show_analyse =  ref(MatchDetailCalss.is_show_details_analyse)
    const matchid =  ref(MatchDetailCalss.get_goto_detail_matchid)
    const get_current_gotodetail_match =  ref(MatchDetailCalss.current_gotodetail_match)
   
    watch(
      () => MatchDetailCalss.details_data_version.version,
      (val) => {
        if (val) {
          is_show_analyse.value = MatchDetailCalss.is_show_details_analyse
          matchid.value = MatchDetailCalss.get_goto_detail_matchid
          get_current_gotodetail_match.value = MatchDetailCalss.current_gotodetail_match
        }
      },
      { deep: true }
  );
    // #TODO VUEX
    // computed: {
    //   ...mapGetters({
    //     sub_menuid: 'get_current_sub_menuid',
    //     sub_menu_type: 'get_curr_sub_menu_type',
    //     current_league: 'get_current_league',
    //     current_batch:'get_current_batch',
    //     video_process_data:'get_video_process_data',
    //     get_bet_list:'get_bet_list',
    //     get_betbar_show:'get_betbar_show',
    //   }),
    // },

    // #TODO WATCH vuex
    // watch(
    //   () => video_process_data,
    //   (_new) => {
    //     init_video_play_status(new_);
    //   }
    // );
    //悬浮"串"是否显示 |
     const get_betbar_show=ref(true) //todo

     let timer_super28,timer1_ =null
    onMounted(() => {
      // 原created

      timer_super28=0;
      //首页跳转虚拟体育设置menu_type为900
      clearTimeout(timer_super28)
      timer_super28 = setTimeout(()=>{
         MenuData.set_menu_type(900);
      }, 500)
      // 延时器
      timer1_ = null;
      // #TODO vue
      // if(window.vue.process_changing_match){
      //   if(sub_menu_type == 1004){

      //   }else{
      //     get_local_match_process_data();
      //   }
      // }

      //获取赛事详情数据
      let mid_ = route.query && route.query.mid;
      allData.mid = mid_;
      if(mid_) MatchDetailCalss.set_goto_detail_matchid(mid_);
      let parma = {
        mid: mid_,
      }
      api_virtual.get_virtual_match_detail(parma).then(res => {
        let code = lodash.get(res,'code');
        let data = lodash.get(res,'data');
        if(code == 200 && data){
          init_match_fields(data);
          allData.match = data;
          if(!allData.current_match){
            allData.current_match = JSON.parse(JSON.stringify(data));
            init_match_fields(allData.current_match);
          }
          else{
            Object.assign(allData.current_match,data);
          }

          let now_se = get_now_server();
          let mgt_n = Number(data.mgt);
          if(now_se > mgt_n){
            VirtualVideo.get_video_process_by_api(() => {
              init_video_play_status(video_process_data);
            });
          }
          MatchDataWarehouseInstance.set_match_details(data,[])
        }
      })
      .catch(err => {
        console.error(err)
      });
      // cancel_ref = debounce(()=>{cancel_ref()},200)
    })
    onUnmounted(() => {
      // debounce_throttle_cancel(cancel_ref);
      clearTimeout(timer1_)
      timer1_ = null
      clearTimeout(timer_super28);
      timer_super28 = null
      // set_detail_data('')
    })
    //  methods: {
    // ...mapMutations([
    //   'set_menu_type',
    //   'set_goto_detail_matchid',
    //   'set_detail_data',
    //   'set_current_sub_menuid',
    //   'set_curr_sub_menu_type',
    //   'set_current_gotodetail_match',
    //   'set_video_process_data',
    //   'set_is_show_details_analyse'
    // ]),
    /**
     * 虚拟体育刷新
     */
    const vir_refresh = () => {
      if(refreshing) return;
      api_interface();
      refreshing = true;
      if(timer1_) { clearTimeout(timer1_) }
      timer1_ = setTimeout(() => {
        // 取消刷新 已做节流
        cancel_ref();
      },700);
    };
    const cancel_ref = () => {
      refreshing = false;
    };
    const api_interface = () => {
      useMittEmit(MITT_TYPES.EMIT_REF_API, 'details_refresh');
      // useMittEmit(MITT_TYPES.EMIT_REF_API, 'details_refresh')
    };
    /**
     *@description: 虚拟体育切换玩法集,滚动条高度默认恢复为0
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const virtual_detail_box =ref(null)
    const virtual_play_height = () => {
      virtual_detail_box.value.scrollTop = 0
    };
    /**
     * 初始化赛事字段
     */
    const init_match_fields = (match) => {
      match.home = 0;
      match.away = 0;
      match.show_time = 0;
      match.match_status = 0;
      match.thirdMatchVideoUrl = '';
      match.start_now_sub = -20; //开赛时间到当前服务器端的时间的差
      match.invalid = false;//是否投注无效,无效时显示锁盘
      return match;
    };
    /**
     * 生成赛事请求接口参数
     */
    const param_generate = () => {
      return {
        tid:current_league.field1,
        csid:sub_menuid
      };
    };
    /**
     * 初始化视频进程数据
     */
    const init_video_play_status = (video_p_data) => {
      if(sub_menu_type == 1004 && (allData.current_match.mmp == 'PREGAME' || route.query.i != 0)){
        return
      }
      if(video_p_data){
        let match_mid = route.query.mid
        if(video_p_data.detail){
          let m_o_video = video_p_data.detail[match_mid];
          if(!m_o_video) return;
          if(allData.current_match && (allData.current_match.batchNo == m_o_video.batchNo ||
            allData.current_match.mid == m_o_video.mid) ){
            Object.assign(allData.current_match,lodash.cloneDeep(m_o_video));
          }
          if(allData.current_match){
            allData.current_match.start_now_sub = Number(allData.current_match.mgt) - get_now_server();
            set_current_sub_menuid(allData.current_match.csid);
            let detail_setted = false;
            if(vsport_operate && typeof vsport_operate.destroy == 'function'){
              vsport_operate.destroy();
            }
            vsport_operate = new VSport(allData.current_match,res => {
              if(sub_menu_type == 1004 && res.match_status == 2){
                basketball_status = 2
                res.match_status = 4
              }
              match_process_update = Math.random();
              allData.current_match.match_status = res.match_status;
              allData.current_match.show_time = res.show_time;
              //当赛事结束
              if(allData.current_match.match_status == 2){
                useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
                // useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,res);
              }
              //开赛后封盘
              if(allData.current_match.match_status > 0){
                allData.current_match.mhs = 1;
              }
              //视频时间更新,快进视频到相应的时间点
              if(res.upd == 1){
                useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
                // useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,res);
              }
              switch (Number(allData.current_match.csid)) {
                case 1001:
                case 1004:
                  if(res.upd == 1 && res.item_obj){
                    Object.assign(allData.current_match,res.item_obj);
                  }
                  break;
                case 1011:
                case 1010:
                case 1002:
                  if(res.upd == 1 && res.item_obj){
                    Object.assign(allData.current_match,res.item_obj);
                    $set(allData.current_match,'upd_data', JSON.stringify(res.item_obj));
                  }
                  break;
              }

              if(!detail_setted){
                detail_setted = true;
                set_current_gotodetail_match(lodash.cloneDeep(allData.current_match));
              }

            });

          }
        }
      }

    };
    /**
     *
     * 开赛倒计时计时结束
     * @params {String} flag 时间标识
     */
    const timer_ended_handle = (flag) => {
      //篮球滚球倒计时结束拉取视频接口
      if(sub_menu_type == 1004){
        // 如果是滚球状态,并且是列表的第一场赛事,进入详情页要播放视频
        if(allData.current_match.mmp == "INGAME" && route.query.i == 0){
          // 播放视频
          VirtualVideo.get_video_process_by_api(() => {
            init_video_play_status(video_process_data);
          });
        }else{
          basketball_status = 1
          allData.current_match.match_status = 3
        }
      }else{
        // 比赛已开始, 获取视频接口
        VirtualVideo.get_video_process_by_api(() => {
          init_video_play_status(video_process_data);
        });
      }
    };
    /**
     * 获取本地传递的赛事视频进程
     */
    const get_local_match_process_data = () => {
      // #TODO vue

      let match = "";
      if(match && match.mid == route.query.mid){
       allData.current_match = match;
        set_current_sub_menuid(allData.current_match.csid);
        let detail_setted = false;
        if(vsport_operate){
          vsport_operate.destroy();
        }
        vsport_operate = new VSport(allData.current_match,res => {
          allData.current_match.match_status = res.match_status;
          allData.current_match.show_time = res.show_time;
          //当赛事结束
          if(allData.current_match.match_status == 2){
            useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
            // useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,res);
          }
          //开赛后封盘
          if(allData.current_match.match_status > 0){
            allData.current_match.mhs = 1;
          }
          //视频时间更新,快进视频到相应的时间点
          if(res.upd == 1){
            useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
            // useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,res);
          }
          switch (Number(allData.current_match.csid)) {
            case 1001:
              if(res.upd == 1 && res.item_obj){
                Object.assign(allData.current_match,res.item_obj);
              }
              break;
            case 1011:
            case 1010:
            case 1009:
            case 1002:
              if(res.upd == 1 && res.item_obj){
                Object.assign(allData.current_match,res.item_obj);
                $set(allData.current_match,'upd_data', JSON.stringify(res.item_obj));
              }
              break;
          }
          if(!detail_setted){
            detail_setted = true;
            MatchDetailCalss.set_current_gotodetail_match(lodash.cloneDeep(allData.current_match));
          }
        });

      }

    };
    /**
     * 赛果停留20秒后请求下一批赛事
     */
    const  update_n_batch_handle =()=>{

    };
    /**
     * @description: 改变tab栏
     * @param {string} tabs
     * @return {*}
     */
    const tabs_name = ref("bet")
    const change_tab =(tabs)=>{
      tabs_name.value = tabs
    }
    return {
      ...toRefs(allData),
      vir_refresh,
      cancel_ref,
      api_interface,
      virtual_play_height,
      init_match_fields,
      param_generate,
      init_video_play_status,
      timer_ended_handle,
      get_local_match_process_data,
      go_where,
      route,
      router,
      is_show_analyse,
      update_n_batch_handle,
      get_betbar_show,
      tabs_name,
      change_tab,
      virtual_detail_box
    }
  }
})
</script>
<style lang="scss">
@import "./styles/details.scss";
@import "src/base-h5/css/pages/virtual-sports.scss";
@import "src/base-h5/components/details/styles/details-theme/virtual_sports_tab.scss";
</style>
<style lang="scss" scoped>
.virtual-detail {
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
  // 根据APP复刻版最新的ui 设置背景色为#F8F9FA
  // background-color: var(--q-gb-bg-c-15);
  background-color: #F8F9FA; //#TODO: css var
  // background: var(--q-gb-bg-c-19); //夜间版#0E1014 
}
/*  头部 */
.virtual-head {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 0.44rem;

  .type-bg {
    height: 100%;
    background-size: 100% auto;
  }

  .back-wrap {
    display: flex;
    align-items: center;
    font-size: 16px;
    height: 0.44rem;

    .detail-back {
      width: 0.3rem;
      height: 100%;
      background: url($SCSSPROJECTPATH + '/image/common/go_back.svg') no-repeat center / 96% 96%;
      background-size: 0.1rem auto;
      margin-left: 0.05rem;
      & + div {
        color: #fff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    /*  刷新按钮 */
    // @include keyframes(loading-ring-animate) {
    //   0% {
    //     transform: rotate(0deg);
    //   }
    //   100% {
    //     transform: rotate(360deg);
    //   }
    // }

    .virtual-ref {
      width: 0.4rem;
      height: 100%;
      background: url($SCSSPROJECTPATH + '/image/list/virtual-ref.svg') center no-repeat;
      background-size: 0.2rem auto;

      &.refreshing {
        animation: 0.7s loading-ring-animate linear;
      }
    }

    .no-single {
      width: 40px;
      height: 100%;
      background: var(--q-color-com-img-bg-85) center no-repeat;
      background-size: 0.2rem auto;
    }

    .set-menu {
      :deep( .filter-icon-wrapper) {
        width: 0.4rem;
        height: 0.44rem;
        margin-right: 0.1rem;

        .img {
          background-image: var(--q-color-com-img-bg-73);
        }
      }
    }
  }
}

.detail-header-bg {
  width: 100%;
  position: sticky;
  top: 0.44rem;
  z-index: 98;
  height: 0;

  &:after {
    content: '';
    position: fixed;
    height: 0.46rem;

    left: 0;
    top: 0.44rem;

    width: 100%;
  }
}

.detail-header {
  position: sticky;
  width: 100%;
  top: 0.44rem;
  right: 0;
  z-index: 99;

  .stage-wrapper {
    width: 100%;
    min-height: 2rem;
  }

  .debug-test {
    bottom: -18px;
    left: 18px;
    position: absolute;
  }
}
.detail-main {
  margin-top: 0.08rem;
  margin-left: 0.05rem;
  margin-right: 0.05rem;
  border-radius: 0.04rem;
  // background: var(--q-gb-bg-c-19);
  background-color: var(--q-gb-bg-c-15);
  &::-webkit-scrollbar {
    display: none;
  }

  overflow-x: scroll;
  overflow-y: hidden;
}

.detail-main2 {
  margin-bottom: 0.5rem;
}
</style>

src/outputsrc/core/utils/common/module/other.js