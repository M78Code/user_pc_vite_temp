import { api_v_sports } from "src/api/index.js";
import VSport from "src/core/vsport-h5/vsport.js"
import { api_common} from "src/api/index.js";  // 引入api接口封装文件
import store from 'src/store-redux/index.js';
import virtual_sports_data from "./virtual-sports-data";
import { ref, provide, computed, reactive, toRefs } from "vue";
import { useRoute } from 'vue-router'
import lodash from 'lodash';
const route = useRoute();
let state = store.getState();
const virtual_sports_mixin = {
  setup(props, { attrs, slots, emit, expose }) {
    const mixins_data = reactive({
      //虚拟赛事列表
      virtual_match_list:[],
      //视频进程接口未拉取到数据的参数key
      no_process_data_p_key:'',
      //重调用视频进程接口次数
      again_total:0,
      //调用10次接口依然无视频数据然后调用赛事列表次数
      no_video_data_invoke_match_data_count:0,
      //记录视频进程接口请求
      match_process_key_map:{},
      //投注项字典
      ol_dictionary:{},
      //视频进程接口参数key
      video_by_api_cache_key:'',
      //视频进程接口参数
      api_video_params:{},
      //虚拟赛事列表请求唯一key
      virtual_s_list_req_key:"list",
      //虚拟赛事赛果请求唯一key
      virtual_m_result_req_key:"virtual_m_result_req_key",
      //虚拟体育赛事缓存键
      virtual_m_list_data_cache_key:"virtual_m_list_data_cache_key",
      //是用户点击联赛切换联赛
      is_user_switch_league:0,
      //选中的联赛tab下标
      tab_league_i:0,
      //检查第一批次是否结束的批次号
      checking_first_delete_batchNo:'',
      //视频进程数据最大时间
      video_pro_maxtime:null,
      //自动改变批次到第1个
      auto_change_tab_i_first:0,
      //当前批次赛事结束时的比分对象S1常规赛(上下半场)比分 S170点球大战比分
      v_match_ended_score_dict:{},
      skeleton: true,
      get_pre_score_time:null,
    });
    const methods = {
      // ...mapMutations({
      //   set_virtual_data_loading:'set_virtual_data_loading',
      //   set_prev_v_sports:"set_prev_v_sports",
      //   set_current_batch:"set_current_batch",
      // }),
      /**
       * @description: 虚拟菜单数据未空时的逻辑处理函数
       * @return {*}
       */
      no_virtual_menu_data(){
        mixins_data.set_virtual_data_loading(0);
        mixins_data.virtual_data_loading = false;
        mixins_data.no_match_list_handle();
      },
      /**
       * @description: 附加初始化赛果result字段
       * @param {Array} match_list 赛事列表
       * @return {String}
       */
      append_result_fields(no_title_list){
        if(no_title_list && no_title_list.length){
          no_title_list.forEach(no_title => {
            if(!no_title.matchs || !no_title.matchs.length) { return }
            no_title.matchs.forEach(match => {
  
              if(!match.hps || !match.hps.length) { return }
              match.hps.forEach(hp => {
  
                if(!hp.hl || !hp.hl.length) { return }
                hp.hl.forEach(hl_item => {
  
                  if(!hl_item.ol || !hl_item.ol.length) {return}
                  hl_item.ol.forEach(ol_item => {
                    ol_item.result = "";
                  });
                });
              });
            });
          });
        }
        return no_title_list
      },
      /**
       * 未获取到虚拟体育赛事列表设置空数据提醒
       */
      no_match_list_handle(){
        mixins_data.no_virtual_match = true;
      },
      /**
       * 篮球结束
       */
      basketball_end_handle(){
        mixins_data.get_score_basket_ball();
      },
      /**
       * 获取投注项字典对象
       */
      get_ol_dictionary(){
        Object.keys(mixins_data.ol_dictionary).forEach(k => {
          delete mixins_data.ol_dictionary[k];
        });
  
        if(mixins_data.no_title_list && mixins_data.no_title_list.length){
          mixins_data.no_title_list.forEach(no_title => {
  
            if(!no_title.match || !no_title.match.length) { return }
            no_title.match.forEach(match => {
  
              if(!match.hps || !match.hps.length) { return }
              match.hps.forEach(hp => {
  
                if(!hp.hl || !hp.hl.length) { return }
                hp.hl.forEach(hl_item => {
  
                  if(!hl_item.ol || !hl_item.ol.length) {return}
                  hl_item.ol.forEach(ol_item => {
                    mixins_data.ol_dictionary[ol_item.oid] = ol_item;
                  });
                });
              });
            });
          });
        }
      },
      /**
       * 检测下一轮开赛时间刷新数据
       */
      check_next_no_start_time(){
        if(mixins_data.virtual_match_list && mixins_data.virtual_match_list.length > 1){
          let mgt = Number(mixins_data.virtual_match_list[1].matchs[0].mgt);
          let now = mixins_data.get_now_server();
          let sub = mgt - now;
          //下一轮开赛
          if(sub <= 0){
            if(mixins_data.tab_item_click_handle){
              mixins_data.tab_item_click_handle(mixins_data.tab_item_i);
            }
          }
          else{
            clearTimeout(mixins_data.timer_super5);
            mixins_data.timer_super5 = setTimeout(() => {
              mixins_data.check_next_no_start_time();
            },1000);
          }
        }
      },
      /**
       * 赛事初始化字段附加
       */
      append_init_fields(f_match){
        return {
          ...f_match,
          home:0,
          away:0,
          s170_home:0,//点球大战
          s170_away:0,
          show_time:0,
          match_status:0,
          thirdMatchVideoUrl:'',
          start_now_sub:-20, //开赛时间到当前服务器端的时间的差
          invalid:false,//是否投注无效,无效时显示锁盘
        }
      },
      /**
       * @description: 批次菜单切换
       * @param {Object} params tab数据
       * @return {Undefined} Undefined
       */
      sub_nav_changed(params){
        if(!params || !params.nav) return;
        let data = params.nav;
        let dom_stage = mixins_data.$refs.virtual_sports_stage
        mixins_data.checking_first_delete_batchNo = '';
        mixins_data.tab_league_i = params.i;
        if(dom_stage){
          dom_stage.user_destroy_resource();
        }
        mixins_data.gen_video_api_cache_key();
        mixins_data.set_current_batch(_.cloneDeep(data));
        if(mixins_data.sub_menu_type == 1004){
          useMittEmit(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, 0)
        }
        let found = mixins_data.virtual_match_list.filter(vm => {
          let r = false;
          if(vm && data){
            r = vm.batchNo == data.batchNo;
          }
          return r;
        })[0];
        if(found){
          mixins_data.match_list_by_no = [];
          clearTimeout(mixins_data.timer_v_1); // 此setTimeout 解决bug 22990
          mixins_data.timer_v_1 = setTimeout(() => {
            mixins_data.match_list_by_no = found.matchs.map(f_match => {
              return mixins_data.append_init_fields(f_match);
            });
            if(mixins_data.match_list_by_no.length){
              mixins_data.current_match = mixins_data.match_list_by_no[0];
              let server_now = mixins_data.get_now_server();
              mixins_data.current_match.start_now_sub = Number(mixins_data.current_match.mgt) - server_now;
              if(mixins_data.sub_menu_type == 1004){
                if(mixins_data.current_match.mmp == "PREGAME"){
                  mixins_data.get_video_process_by_api();
                }
                //篮球滚球开赛后9秒,获取视频接口
                else if(mixins_data.current_match.mmp == "INGAME"){
                  if(mixins_data.current_match.start_now_sub <= -(9 * 1000)){
                    mixins_data.get_video_process_by_api();
                    mixins_data.is_video_playing = true;
                  }
                  mixins_data.get_score_basket_ball();
                }
              }
              else{
                // 比赛已开始, 获取视频接口
                if(mixins_data.current_match.start_now_sub <= 0){
                  mixins_data.get_video_process_by_api();
                }
              }
              mixins_data.current_match_id = mixins_data.match_list_by_no[0].mid;
            }
            mixins_data.match_list_loaded = Math.random();
          });
        }
        else{
          mixins_data.match_list_by_no = [];
          mixins_data.current_match_id = "";
          mixins_data.match_list_loaded = Math.random();
        }
        mixins_data.check_is_first_tab_delete();
      },
  
      /**
       * 生成视频进程接口请求缓存key
       */
      gen_video_api_cache_key(){
        let {sub_menu_type,current_league,current_batch} = this;
        if(!sub_menu_type || !current_league || !current_batch) {
          return {};
        }
        let params = {
          csid:sub_menu_type,
          tid:current_league.menuId,
          batchNo:current_batch.batchNo
        };
        mixins_data.video_by_api_cache_key = `${params.csid}-${params.tid}-${params.batchNo}`;
        return params;
      },
      /**
        * 获取赛事视频进程数据
        * @param {Undefined} Undefined
        * @param {Function} success_cb
        * @param {String|Booelan} is_no_match_data
        * @return {Undefined} Undefined
        */
      get_video_process_by_api(success_cb,is_no_match_data){
        let params = mixins_data.gen_video_api_cache_key();
        if(!params.csid) return;
        if(mixins_data.current_match.orderNo){
          params.orderNo = mixins_data.current_match.orderNo;
          mixins_data.video_by_api_cache_key += `-${params.orderNo}`;
        }
        mixins_data.api_video_params = params;
        api_v_sports.get_virtual_video_process(params).then(res => {
          if(res.code == 200){
            if(res.data && res.data.detail && Object.keys(res.data.detail).length){
              if(!is_no_match_data){
                let video_data = _.cloneDeep(res.data);
                mixins_data.set_basketball_video_data(video_data);
                mixins_data.set_video_process_data(video_data);
                useMittEmit(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT,res.data);
              }
              if(success_cb){
                success_cb(res.data);
              }
            }
            else{
              if(!is_no_match_data){
                mixins_data.no_process_data_p_key = mixins_data.video_by_api_cache_key;
                mixins_data.get_video_process_by_api_again(success_cb);
              }
              else{
                success_cb(null);
              }
            }
          }
        });
      },
      /**
       * 设置视频进程比分数据
       * @param {Object} video_data 视频进程比分数据
       */
      set_basketball_video_data(video_data){
      },
      /**
       * 检查是否删除第一期
       */
      check_is_first_tab_delete(){
        let check_is_reload_data = (totalTime,match) => {
          if(totalTime){
            totalTime = totalTime * 1;
            let mgt = match.mgt * 1;
            let future = mgt + totalTime * 1000;
            let now_server = mixins_data.get_now_server();
            if(future - now_server < 1000){
              mixins_data.update_no_title_list();
            }
          }
        };
        //获取赛事视频总时长
        let invok_video_process = (match) => {
          let params = {
            batchNo: match.batchNo,
            tid: match.tid,
          }
          if(mixins_data.video_pro_maxtime && mixins_data.video_pro_maxtime[params.tid]){
            let totalTime = mixins_data.video_pro_maxtime[params.tid];
            check_is_reload_data(totalTime,match);
            return;
          }
          api_common.get_Video_MaxTime(params).then(res => {
            let res_data = null;
            if (res.code == 200) {
              res_data = _.get(res,'data');
              let totalTime = res_data[params.tid];
              if(totalTime){
                if(!mixins_data.video_pro_maxtime){
                  mixins_data.video_pro_maxtime = {};
                }
                mixins_data.video_pro_maxtime[params.tid] = totalTime;
                check_is_reload_data(totalTime,match);
              }
            }
            if(!res_data){
              mixins_data.checking_first_delete_batchNo = '';
            }
          });
        };
  
        //检查第一批赛事是否结束
        let check = () => {
          let first_t_item = mixins_data.no_title_list[0];
          if(first_t_item){
            let first_m_item = first_t_item.match[0];
            if(first_m_item){
              let mgt = first_m_item.mgt * 1;
              let time_ = mixins_data.get_now_server() - mgt;
              if(time_ > -1){
                mixins_data.checking_first_delete_batchNo = first_m_item.batchNo;
                invok_video_process(first_m_item);
              }
            }
          }
          if(mixins_data.tab_league_i != 0){
            clearTimeout(mixins_data.checking_first_delete_timer);
            mixins_data.checking_first_delete_timer = setTimeout(() => {
              check();
            },4000);
          }
  
        };
        check();
      },
      /**
       * 移除结束的批更新tab联赛列表
       */
      update_no_title_list(){
        let params = mixins_data.param_generate();
        if(!params) return;
        api_v_sports.get_virtual_sport_list(params).then(res => {
          if(res.code == 200 && res.data && res.data.length){
            let n_title_list = res.data.map(res_item => {
              let {no,mmp,batchNo} = res_item;
              mixins_data.virtual_match_list.push(res_item);
              return {
                no,
                mmp,
                batchNo,
                match:res_item.matchs
              };
            });
            let n_first = n_title_list[0];
            let o_first = mixins_data.no_title_list[0];
            if(n_first.batchNo != o_first.batchNo){
              if(mixins_data.current_match.mmp == "INGAME"){
                if(n_title_list.length == 1 && mixins_data.no_title_list.length > 1){
                  let f_b_no = n_title_list[0].batchNo;
                  let found_i = _.findIndex(mixins_data.no_title_list,{batchNo:f_b_no});
                  if(found_i > -1){
                    return;
                  }
                }
              }
              mixins_data.no_title_list = n_title_list;
              if(mixins_data.tab_league_i == 0){
                mixins_data.auto_change_tab_i_first = Math.random();
              }
            }
          }
        }).catch((e) => {
          mixins_data.virtual_data_loading = false;
        });
      },
      /**
       * 获取赛事结果
       * @param {String} mid_str 赛事id,多个逗号隔开
       * @param {Function} callback 回调函数
       */
      get_match_result(mid_str,callback){
        let params = {mids:mid_str};
        api_v_sports.get_virtual_match_result(params).then(res => {
          mixins_data.skeleton = false
          if(res.code == 200){
            let match_list = res.data;
            if(match_list && match_list.length && mixins_data.virtual_match_list.length){
              mixins_data.append_match_result(match_list,mixins_data.virtual_match_list);
              mixins_data.append_match_result(match_list,mixins_data.match_list_by_no);
  
              //赛事列表
              let cache_dict = _.cloneDeep(mixins_data.get_prev_v_sports);
              let p_key = `${mixins_data.sub_menu_type}-${mixins_data.current_league.menuId}`;
              cache_dict[p_key] = _.cloneDeep(mixins_data.virtual_match_list);
              mixins_data.set_prev_v_sports(cache_dict);
              useMittEmit(MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED,match_list);
            }
          }
          callback()
        }).catch((err)=>{
          mixins_data.skeleton = false
        })
      },
      /**
        * 1s后再次获取赛事视频进程数据
        * @param {Undefined} Undefined
        * @return {Undefined} Undefined
        */
      get_video_process_by_api_again(success_cb){
        mixins_data.again_total++;
        if(mixins_data.again_total > 10){
          mixins_data.again_total = 0;
          clearTimeout(mixins_data.procee_again_timer);
          useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
          if(mixins_data.no_video_data_invoke_match_data_count < 1){
            mixins_data.no_video_data_invoke_match_data_count++;
            if(mixins_data.get_virtual_sport_list){
              mixins_data.get_virtual_sport_list();
            }
          }
          return;
        }
        clearTimeout(mixins_data.procee_again_timer);
        mixins_data.procee_again_timer = setTimeout(() => {
          if(mixins_data.no_process_data_p_key){
            //切换赛事后参数不一样停止请求数据
            if(mixins_data.video_by_api_cache_key != mixins_data.no_process_data_p_key){
              mixins_data.again_total = 0;
              return;
            }
            let params = mixins_data.api_video_params;
            if(!params.csid) return;
            api_v_sports.get_virtual_video_process(params).then(res => {
              let get_data = false;
              if(res.code == 200){
                if(res.data && res.data.detail && Object.keys(res.data.detail).length){
                  get_data = true;
                  let copied_video = _.cloneDeep(res.data);
                  mixins_data.set_basketball_video_data(copied_video);
                  mixins_data.set_video_process_data(copied_video);
                  useMittEmit(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT,copied_video);
                  if(success_cb){
                    success_cb();
                  }
                }
              }
              if(!get_data){
                mixins_data.get_video_process_by_api_again();
              }
            });
          }
        },1000);
      },
      /**
       * 获取频进程数据
       * @param {Object} match
       */
      get_match_video_process(match){
        if(!match){
          return;
        }
        let got_data = false;
        if(mixins_data.get_video_process_data){
          let {batchNo} = match;
  
          if(mixins_data.get_video_process_data.batchNo == batchNo){
            let p_data_detail = mixins_data.get_video_process_data.detail;
            let detail_copied = _.cloneDeep(p_data_detail);
            if(detail_copied && detail_copied[match.mid]){
              got_data = true;
              Object.assign(match,detail_copied[match.mid]);
              if(mixins_data.video_process_obj && mixins_data.video_process_obj.destroy){
                mixins_data.video_process_obj.destroy();
              }
              mixins_data.video_process_obj = new VSport(match,res => {
                match.show_time = res.show_time;
                match.match_status = res.match_status;
                window.vue.process_changing_match = match;
  
                //当赛事结束,检查所有赛事是否结束
                if(match.match_status == 2){
                  mixins_data.is_video_playing = false;
                  useMittEmit(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2,match);
                }
                if(match.match_status > 0){
                  match.mhs = 1;
                }
                //视频时间更新,快进视频到相应的时间点
                if(res.upd == 1){
                  useMittEmit(MITT_TYPES.EMIT_SYNC_VIDEO_DATA,res);
                }
                switch (Number(match.csid)) {
                  case 1001:
                  case 1004:
                    if(res.upd == 1 && res.item_obj){
                      Object.assign(match,res.item_obj);
                    }
                    break;
                  case 1011: // 赛马
                  case 1010: // 摩托车
                  case 1002: // 赛狗
                    if(res.upd == 1 && res.item_obj){
                      mixins_data.$set(match,'upd_data', JSON.stringify(res.item_obj));
                    }
                    break;
                  default:
                    break;
                }
              });
              useMittEmit(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED,mixins_data.get_video_process_data);
            }
          }
        }
        if(!got_data){
          // mixins_data.get_video_process_by_api_again();
          // mixins_data.get_video_process_by_api('is_switch_match');
        }
      },
      /**
       * 获取赛事结束时的比分
       */
      get_result_score(){
        if(!mixins_data.current_batch.batchNo){
          return
        }
  
        let dict_key = `${mixins_data.sub_menu_type}-${mixins_data.current_league.menuId}-${mixins_data.current_batch.batchNo}`;
        if(!mixins_data.v_match_ended_score_dict[dict_key]){
          mixins_data.v_match_ended_score_dict[dict_key] = {};
          let mid_str = mixins_data.match_list_by_no.map(match => match.mid).join(',');
          if(!mid_str) {
            delete mixins_data.v_match_ended_score_dict[dict_key];
            return;
          }
          mixins_data.get_score_basket_ball();
          mixins_data.get_score_by_api();
        }
      },
      /**
       * 虚拟篮球获取比分
       * @returns
       */
      get_score_basket_ball(){
        if(mixins_data.current_match.mmp == "INGAME"){
          mixins_data.match_list_by_no.forEach( m => {
            if(!m.home){
              m.home = m.homeScore;
              m.away = m.awayScore;
            }
          });
        }
        // else if(mixins_data.current_match.mmp == "PREGAME"){
        //   mixins_data.get_score_by_api();
        // }
      },
      /**
       * 获取比分接口
       * @returns undefined
       */
      get_score_by_api(){
        let mid_str = mixins_data.match_list_by_no.map(match => match.mid).join(',');
        if(!mid_str) return;
        api_v_sports.get_v_match_score_api({mids:mid_str}).then(res => {
          if(res.code == 200){
            let score_dict = res.data;
            if(!res.data || !Object.keys(res.data).length){
              let local_dict = mixins_data.get_basketball_score_store('v-football-score');
              if(local_dict){
                score_dict = local_dict;
              }
            }
            mixins_data.match_list_by_no.forEach(m => {
              if(m.batchNo == mixins_data.current_batch.batchNo){
                if(score_dict[m.mid]){
                  let s1 = score_dict[m.mid]['S1'];
                  let s170 = score_dict[m.mid]['S170'];
                  if(s1){
                    m.home = s1.split(':')[0];
                    m.away = s1.split(':')[1];
                  }
                  if(s170){
                    m.s170_home = s170.split(':')[0];
                    m.s170_away = s170.split(':')[1];
                  }
                  if(mixins_data.current_match.mid == m.mid){
                    mixins_data.current_match.home = m.home;
                    mixins_data.current_match.away = m.away;
                    mixins_data.current_match.s170_home = m.s170_home;
                    mixins_data.current_match.s170_away = m.s170_away;
                  }
                }
              }
            });
            mixins_data.set_basketball_score_store(res.data,'v-football-score');
          }
        });
      },
      set_basketball_score_store(data,store_key='v-basketball-score'){
        sessionStorage.setItem(store_key,JSON.stringify(data));
      },
      get_basketball_score_store(store_key='v-basketball-score'){
        let r = null;
        let socre = sessionStorage.getItem(store_key);
        if(socre){
          r = JSON.parse(socre);
        }
        return r;
      },
      /**
       * 赛果停留20秒后请求下一批赛事
       */
      update_n_batch_handle(){
  
      },
      // 批量清除定时器
      clear_mixin_timer() {
        const timer_arr = [
          'get_next_basketball_time',
          'timer_v_1',
          'timer_super5',
          'checking_first_delete_timer',
          'procee_again_timer',
        ]
  
        for (const timer of timer_arr) {
          clearTimeout(this[timer])
          this[timer] = null
        }
      }
    }
    return {
      ...toRefs(mixins_data),
      ...methods,
      ...virtual_sports_data
    }
  },
  created () {
    // 延时器
    this.get_next_basketball_time = null;
    this.timer_super5 = null;
    //切换赛事列表时钟
    this.timer_v_1 = null;
    //检查第一批次是否结束的时钟
    this.checking_first_delete_timer = null;
    //重调用视频进程接口时钟
    this.procee_again_timer = null;
    useMittOn(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA,this.no_virtual_menu_data);
  },
  watch:{
    //开赛视频播放
    get_video_process_data(){
      mixins_data.get_match_video_process(this.current_match);
    }
  },
  beforeUnmount () {
    useMittOn(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA,this.no_virtual_menu_data);
    this.clear_mixin_timer();
  },
}
export default virtual_sports_mixin;