/*
 * @Description:虚拟体育详情页最外层父组件
 */
import virtual_sports_mixin from "src/core/vr/mixin/virtual-sports-mixin.js"
import {api_v_sports} from "src/api/index.js";
import VSport from 'src/core/vr/vr-sports/vsport.js';
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt/"
import { debounce } from "lodash";
import { go_where } from "src/output/index.js";
import { useRouter, useRoute } from "vue-router";
import { MatchDataWarehouse_H5_Detail_Common, MatchDataWarehouse_PC_Detail_Common} from "src/output/index.js"
import { get_now_server, debounce_throttle_cancel } from 'src/core/utils/common/module/other.js'
import BUILDIN_CONFIG from "app/job/output/env/index.js";

let off = ''
const MatchDataWarehouseInstance = BUILDIN_CONFIG.IS_PC ? MatchDataWarehouse_PC_Detail_Common:MatchDataWarehouse_H5_Detail_Common;
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
  data(){
    return{
      loading: false,
      match_odds_info: [], 
      match_detail: {},
      MatchDataWarehouseInstance:MatchDataWarehouseInstance,
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
  },
  mounted() {
   //获取赛事详情数据
   this.get_match_detail()
   this.cancel_ref = debounce(this.cancel_ref,200)
   off= useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,()=> {
     this.get_match_detail()
   }).off
  },
  unmounted() {
    debounce_throttle_cancel(this.cancel_ref);
    clearTimeout(this.timer1_)
    this.timer1_ = null
    clearTimeout(this.timer_super28);
    this.timer_super28 = null
    // this.set_detail_data('')
    if (off) {
      off()
    }
  },
  methods: {
    get_match_detail() {
      //获取赛事详情数据
      let mid_ = this.$route.query && this.$route.query.mid || this.mid;
      this.mid = mid_;
      if(mid_) this.set_goto_detail_matchid(mid_);
      let parma = {
        mid: this.matchid || mid_,
      }
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
    },
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
