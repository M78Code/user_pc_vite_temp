<!--
 * @Description: 虚拟体育详情页最外层父组件
-->
<template>
  <div class="virtual-detail" ref="virtual_detail_box">
    <!-- 头部 -->
    <div class="virtual-head">
      <div class="type-bg bg1001">
        <div class="back-wrap">
          <!-- 返回按钮 -->
          <div class="detail-back" @click="go_where({back_to: 'go_back_from_virtual_detail', route_name:route.name,route,router})"></div>
          <!-- 虚拟体育 -->
          <div class="col">{{current_league.name}}</div>
          <!--刷新按钮-->
          <div class="virtual-ref" :class="{'refreshing':refreshing}" @click="vir_refresh"></div>
        </div>
      </div>
    </div>
    <!--视频，tab和玩法集部分-->
    <template v-if="true">
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
        <!--历史战绩，投注，排行榜tab键-->
        <virtual-sports-detail-tab v-if="sub_menu_type != 1004" :current_match="current_match" @virtual_play_height="virtual_play_height" @change_tab="change_tab" />
        <div class="debug-test" v-if="show_debug">
          {{`batchNo:${current_batch.batchNo}-csid:${sub_menuid}-mid:${current_match.mid}`}}<br />
          {{`orderNo:${current_match.orderNo}-tid:${current_league.menuId}`}}
        </div>
      </div>
    </template>
     <!--玩法集区域 -->
    <div class="detail-main" :class="{'detail-main2':get_betbar_show}">
      <!-- 赔率列表页面 -->
      <template  v-if="match && tabs_name == 'bet'">
        <virtual-sports-tab :mid="mid" />
        <virtual-sports-category :mid="mid" :current_match="match" :source="'virtual_sports_details'"/>
      </template>
      <!-- 历史战绩页面 -->
      <virtual-match-statistic v-if="match && tabs_name == 'lszj'" />
      <!-- 排行榜页面,小组赛淘汰赛页面  -->
      <div v-if="match && tabs_name == 'rank'" class="list-wrapper">
        <div v-if="[1001,1004].includes(sub_menu_type)">
          <!--  足球小组赛,淘汰赛页面  -->
          <group-knockout
            v-if="current_league ? current_league.field3 != '': false"
            :tid="current_league.field1"
            :current_match="current_match"
          />
          <!--  足球排行榜页面  -->
          <football-ranking-list v-else :tid="current_league.field1"/>
        </div>
        <!--  非足球排行榜页面  -->
        <ranking-list-start v-else :mid="current_match.mid"/>
      </div>
    </div>
  </div>
</template>

<script>
import virtual_sports_mixin from "src/base-h5/vr/mixin/virtual_sports/virtual_sports_mixin.js"
import virtual_sports_tab from 'src/base-h5/vr/components/virtual_sports_tab.vue'
import virtual_sports_detail_tab from 'src/base-h5/vr/pages/virtual/details/children/virtual_sports_detail_tab.vue'
import virtual_sports_category from "src/base-h5/vr/pages/virtual/details/children/virtual_sports_category.vue"
import virtual_match_statistic from 'src/base-h5/vr/components/virtual_match_statistic.vue'
import {api_v_sports} from "src/api/index.js";
import virtual_sports_stage from 'src/base-h5/vr/pages/virtual/virtual_sports_part/virtual_sports_stage.vue'
import VSport from 'src/base-h5/vr/utils/vsport/vsport.js';
import VR_CTR from "src/base-h5/vr/utils/vsport/virtual_ctr.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { debounce } from "lodash";
import { go_where } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import { MatchDataWarehouse_H5_Detail_Common as MatchDataWarehouseInstance} from "src/output/index.js"
import ranking_list_start from "src/base-h5/vr/pages/virtual/virtual_sports_part/ranking_list_start.vue"
import group_knockout from "src/base-h5/vr/pages/virtual/virtual_sports_part/group_knockout.vue"
import football_ranking_list from "src/base-h5/vr/pages/virtual/virtual_sports_part/football_ranking_list.vue"
import { get_now_server, debounce_throttle_cancel } from 'src/core/utils/common/module/other.js'

export default {
  mixins:[virtual_sports_mixin],
  name:'virtual_sports_details',
  computed: {
    matchid(){return VR_CTR.state.goto_detail_matchid},
    sub_menuid(){return VR_CTR.state.current_sub_menuid},
    sub_menu_type(){return VR_CTR.state.curr_sub_menu_type },
    current_league(){return VR_CTR.state.current_league},
    current_batch(){return VR_CTR.state.current_batch},
    video_process_data(){return VR_CTR.state.video_process_data},
    get_betbar_show(){return },
  },
  components: {
    'virtual-sports-tab': virtual_sports_tab,
    'virtual-match-statistic': virtual_match_statistic,
    'virtual-sports-stage': virtual_sports_stage,
    'virtual-sports-category': virtual_sports_category,
    'virtual-sports-detail-tab': virtual_sports_detail_tab,
    'ranking-list-start':ranking_list_start,
    'football-ranking-list':football_ranking_list,
    'group-knockout':group_knockout,
  },
  data(){
    return{
      vsport_operate:null,
      show_debug:sessionStorage.getItem('wsl') == '9999',
      mid:'',
      current_match:{},
      match:null,
      match_process_update:0,
      basketball_status:0,
      // 默认不刷新
      refreshing:false,
      router: useRouter(),
      route: useRoute(),
      tabs_name: 'bet'
    }
  },
  watch: {
    video_process_data(new_){
      this.init_video_play_status(new_);
    },
  },
  created() {
    this.timer_super28=0;
    //首页跳转虚拟体育设置menu_type为900
    clearTimeout(this.timer_super28)
    this.timer_super28 = setTimeout(()=>{
      this.set_menu_type(900);
    }, 500)
    // 延时器
    this.timer1_ = null;
    if(VR_CTR.state.process_changing_match){
      if(this.sub_menu_type == 1004){

      }else{
        this.get_local_match_process_data();
      }
    }

    //获取赛事详情数据
    let mid_ = this.$route.query && this.$route.query.mid || this.mid;
    this.mid = mid_;
    if(mid_) this.set_goto_detail_matchid(mid_);
    let parma = {
       mid: this.matchid || mid_,
    }
    console.log(mid_, parma.mid, 'mid_')
    api_v_sports.get_virtual_match_detail(parma).then(res => {
      let code = lodash.get(res,'code');
      let data = lodash.get(res,'data');
      if(code == 200 && data){
        this.init_match_fields(data);
        this.match = data;
        if(!this.current_match){
          this.current_match = JSON.parse(JSON.stringify(data));
          this.init_match_fields(this.current_match);
        }
        else{
          Object.assign(this.current_match,data);
        }
        MatchDataWarehouseInstance.clear(); 
        MatchDataWarehouseInstance.set_match_details(this.current_match);
        let now_se = get_now_server();
        let mgt_n = Number(data.mgt);
        if(now_se > mgt_n){
          this.get_video_process_by_api(() => {
            this.init_video_play_status(this.video_process_data);
          });
        }
        this.set_detail_data(data)
      }
    })
    .catch(err => {
      console.error(err)
    });
    this.cancel_ref = debounce(this.cancel_ref,200)
  },
  unmounted() {
    debounce_throttle_cancel(this.cancel_ref);
    clearTimeout(this.timer1_)
    this.timer1_ = null
    clearTimeout(this.timer_super28);
    this.timer_super28 = null
    // this.set_detail_data('')
  },
  methods: {
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
    set_menu_type(){},
    set_goto_detail_matchid(data){ VR_CTR.state.goto_detail_matchid = data },
    set_detail_data(data){  VR_CTR.state.detail_data = data },
    set_current_sub_menuid(data){ VR_CTR.state.current_sub_menuid = data},
    set_curr_sub_menu_type(data){ VR_CTR.state.curr_sub_menu_type = Number(data) },
    set_current_gotodetail_match(data){ VR_CTR.state.current_gotodetail_match = data },
    set_video_process_data(data){VR_CTR.state.video_process_data = data},
    set_is_show_details_analyse(){},

    go_where,
    //切换详情页主tab 
    change_tab(tabs){
      this.tabs_name = tabs
    },
    /**
     * 虚拟体育刷新
     */
    vir_refresh(){
      if(this.refreshing) return;
      this.api_interface();
      this.refreshing = true;
      if(this.timer1_) { clearTimeout(this.timer1_) }
      this.timer1_ = setTimeout(() => {
        // 取消刷新 已做节流
        this.cancel_ref();
      },700);
    },
    cancel_ref(){
      this.refreshing = false;
    },
    api_interface(){
      useMittEmit(MITT_TYPES.EMIT_REF_API, 'details_refresh');
    },
    /**
     *@description: 虚拟体育切换玩法集,滚动条高度默认恢复为0
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    virtual_play_height(){
      this.$refs.virtual_detail_box.scrollTop = 0
    },
    /**
     * 初始化赛事字段
     */
    init_match_fields(match){
      match.home = 0;
      match.away = 0;
      match.show_time = 0;
      match.match_status = 0;
      match.thirdMatchVideoUrl = '';
      match.start_now_sub = -20; //开赛时间到当前服务器端的时间的差
      match.invalid = false;//是否投注无效,无效时显示锁盘
      return match;
    },
    /**
     * 生成赛事请求接口参数
     */
    param_generate(){
      return {
        tid:this.current_league.field1,
        csid:this.sub_menuid
      };
    },
    /**
     * 初始化视频进程数据
     */
    init_video_play_status(video_p_data){
      if(this.sub_menu_type == 1004 && (this.current_match.mmp == 'PREGAME' || this.$route.query.i != 0)){
        return
      }
      if(video_p_data){
        let match_mid = this.$route.query.mid || this.current_match.mid || this.mid;
        console.log('match_midmatch_mid', match_mid);
        
        if(video_p_data.detail){
          let m_o_video = video_p_data.detail[match_mid];
          if(!m_o_video) return;
          if(this.current_match && (this.current_match.batchNo == m_o_video.batchNo ||
            this.current_match.mid == m_o_video.mid) ){
            Object.assign(this.current_match,lodash.cloneDeep(m_o_video));
          }
          if(this.current_match){
            this.current_match.start_now_sub = Number(this.current_match.mgt) - get_now_server();
            
            this.set_current_sub_menuid(this.current_match.csid);
            let detail_setted = false;
            if(this.vsport_operate && typeof this.vsport_operate.destroy == 'function'){
              this.vsport_operate.destroy();
            }
            this.vsport_operate = new VSport(this.current_match,res => {
              if(this.sub_menu_type == 1004 && res.match_status == 2){
                this.basketball_status = 2
                res.match_status = 4
              }
              this.match_process_update = Math.random();
              this.current_match.match_status = res.match_status;
              this.current_match.show_time = res.show_time;
              //当赛事结束
              if(this.current_match.match_status == 2){
                useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
              }
              //开赛后封盘
              if(this.current_match.match_status > 0){
                this.current_match.mhs = 1;
              }
              //视频时间更新,快进视频到相应的时间点
              if(res.upd == 1){
                useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
              }
              switch (Number(this.current_match.csid)) {
                case 1001:
                case 1004:
                  if(res.upd == 1 && res.item_obj){
                    Object.assign(this.current_match,res.item_obj);
                  }
                  break;
                case 1011:
                case 1010:
                case 1002:
                  if(res.upd == 1 && res.item_obj){
                    Object.assign(this.current_match,res.item_obj);
                    // this.$set(this.current_match,'upd_data', JSON.stringify(res.item_obj));
                    this.current_match.upd_data = JSON.stringify(res.item_obj);
                  }
                  break;
              }

              if(!detail_setted){
                detail_setted = true;
                this.set_current_gotodetail_match(lodash.cloneDeep(this.current_match));
              }

            });

          }
        }
      }

    },
    /**
     *
     * 开赛倒计时计时结束
     * @params {String} flag 时间标识
     */
    timer_ended_handle(flag){
      //篮球滚球倒计时结束拉取视频接口
      if(this.sub_menu_type == 1004){
        // 如果是滚球状态,并且是列表的第一场赛事,进入详情页要播放视频
        if(this.current_match.mmp == "INGAME" && this.$route.query.i == 0){
          // 播放视频
          this.get_video_process_by_api(() => {
            this.init_video_play_status(this.video_process_data);
          });
        }else{
          this.basketball_status = 1
          this.current_match.match_status = 3
        }
      }else{
        // 比赛已开始, 获取视频接口
        this.get_video_process_by_api(() => {
          this.init_video_play_status(this.video_process_data);
        });
      }
    },
    /**
     * 获取本地传递的赛事视频进程
     */
    get_local_match_process_data(){
      let match = VR_CTR.state.process_changing_match;
      if(match && match.mid == (this.mid || this.$route.query.mid)){
        this.current_match = match;
        this.set_current_sub_menuid(this.current_match.csid);
        let detail_setted = false;
        if(this.vsport_operate){
          this.vsport_operate.destroy();
        }
        this.vsport_operate = new VSport(this.current_match,res => {
          this.current_match.match_status = res.match_status;
          this.current_match.show_time = res.show_time;
          //当赛事结束
          if(this.current_match.match_status == 2){
            useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
          }
          //开赛后封盘
          if(this.current_match.match_status > 0){
            this.current_match.mhs = 1;
          }
          //视频时间更新,快进视频到相应的时间点
          if(res.upd == 1){
            useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA, res);
          }
          switch (Number(this.current_match.csid)) {
            case 1001:
              if(res.upd == 1 && res.item_obj){
                Object.assign(this.current_match,res.item_obj);
              }
              break;
            case 1011:
            case 1010:
            case 1009:
            case 1002:
              if(res.upd == 1 && res.item_obj){
                Object.assign(this.current_match,res.item_obj);
                // this.$set(this.current_match,'upd_data', JSON.stringify(res.item_obj));
                this.current_match.upd_data = JSON.stringify(res.item_obj)
              }
              break;
          }
          if(!detail_setted){
            detail_setted = true;
            this.set_current_gotodetail_match(lodash.cloneDeep(this.current_match));
          }
        });

      }

    }
  },
}
</script>

<style lang="scss" scoped>

.virtual-detail {
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
}
/*  头部 */
.virtual-head {
  width: 100%;
  position: absolute;
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
    @keyframes loading-ring-animate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .virtual-ref {
      width: 0.4rem;
      height: 100%;
      background: var(--q-color-com-img-bg-70) center no-repeat;
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
      :deep(.filter-icon-wrapper) {
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
  top: 0;
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
  margin-top: 0.04rem;

  &::-webkit-scrollbar {
    display: none;
  }

  overflow-x: scroll;
  overflow-y: hidden;
}

.detail-main2 {
  margin-bottom: 0.5rem;
}
:deep(.stage-wrapper .banner) {
  width: 100%;
  height: 2.54rem;
  border-radius: 0;
}
</style>

