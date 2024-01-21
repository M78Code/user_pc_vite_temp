/*
 * @Author: Cronus
 * @Date: 2020-12-30 10:37:23
 * @Description:
 */
import { api_v_sports } from "src/api/index.js";
import VSport from "src/core/vr/vr-sports/vsport.js"
import { api_common } from "src/api/index.js";
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { get_now_server } from 'src/core/utils/common/module/other.js'
import { MatchDataWarehouse_H5_List_Common, MatchDataWarehouse_PC_List_Common } from "src/output/index.js"
const MatchDataBaseH5 = window.BUILDIN_CONFIG.IS_PC ? MatchDataWarehouse_PC_List_Common:MatchDataWarehouse_H5_List_Common;
export default {
  data(){
    return {
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
      MatchDataBaseH5
    }
  },
  created () {
    this.get_virtual_sport_local=lodash.debounce(this.get_virtual_sport_local.bind(this),100)
    // 延时器
    this.get_next_basketball_time = null;
    this.timer_super5 = null;
    //切换赛事列表时钟
    this.timer_v_1 = null;
    //检查第一批次是否结束的时钟
    this.checking_first_delete_timer = null;
    //重调用视频进程接口时钟
    this.procee_again_timer = null;
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA, this.no_virtual_menu_data).off,
    ]
    MatchDataBaseH5.clear();
  },
  methods:{
	set_virtual_data_loading(data){VR_CTR.state.virtual_data_loading = data},
	set_prev_v_sports(data){VR_CTR.state.prev_v_sports = data},
	set_current_batch(data){
    // if(data && data.matchs){
    //   MatchDataBaseH5.set_list(data.matchs);
    // } else {
    //   if(Array.isArray(data)){
    //     MatchDataBaseH5.set_list(data);
    //   }
    // }
    VR_CTR.state.current_batch = data;
  },
    /**
     * @description: 虚拟菜单数据未空时的逻辑处理函数
     * @return {*}
     */
    no_virtual_menu_data(){
      this.set_virtual_data_loading(0);
      this.virtual_data_loading = false;
      this.no_match_list_handle();
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
     * 获取本地缓存虚拟体育赛事列表
     * @param {String} cache_key 缓存键
     */
    get_local_cache_virtual_match(cache_key){
      let pre_store_data = {};
      let data_store = sessionStorage.getItem(this.virtual_m_list_data_cache_key);
      if(data_store){
        pre_store_data = JSON.parse(data_store);
      }
      return pre_store_data[cache_key];
    },
    /**
     * 设置缓存
     * @param {Array} match_list 写入缓存的赛事列表
     * @param {String} cache_key 缓存键
     */
    set_local_cache_virtual_match(match_list,cache_key){
      let pre_store_data = {};
      let data_store = sessionStorage.getItem(this.virtual_m_list_data_cache_key);
      if(data_store){
        pre_store_data = JSON.parse(data_store);
      }
      pre_store_data[cache_key] = match_list;
      sessionStorage.setItem(this.virtual_m_list_data_cache_key,JSON.stringify(pre_store_data));
    },
    /**
     * @description: 数据仓库设置列表数据
     * @param {Object} no_title_list 赛事数据
     * @return {String}
     */
    match_data_base_set_list(no_title_list){
      no_title_list && no_title_list.forEach(item => {
        const match_arr = lodash.get(item, 'match');
        if(match_arr){
          MatchDataBaseH5.set_list(match_arr);
        }
      });
    },
    /**
     * @description: 获取虚拟体育赛事列表
     * @param {Object} params 接口参数
     * @return {String}
     */
    get_virtual_sport_local(is_user_clicked){
      this.gen_video_api_cache_key();
      let params = this.param_generate();
      if(!params) {
        this.set_virtual_data_loading(0)
        this.virtual_data_loading = false;
        this.no_match_list_handle();
        return;
      }
      if(is_user_clicked != 'is_user_refreshing'){
        // useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,true);
        this.virtual_match_list = [];
        this.match_list_by_no = [];
        this.no_title_list = [];
        MatchDataBaseH5.clear();
        this.virtual_data_loading = true;
      }
      api_v_sports[window.BUILDIN_CONFIG.IS_PC ? 'get_virtual_sport_list_pc' : 'get_virtual_sport_list'](params).then(res => {
        this.virtual_data_loading = false;
        // useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
        this.set_virtual_data_loading(0);
        // useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
        // useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);
        // 兼容pc接口数据
        if(res.data?.data && window.BUILDIN_CONFIG.IS_PC){
          res.data = res.data.data;
        }
        if(res.code == 200 && res.data && res.data.length){
          this.virtual_match_list = this.append_result_fields(res.data);
          this.check_next_no_start_time();
          this.no_title_list = this.virtual_match_list.map(m => {
            let {no,mmp,batchNo} = m;
            m.matchs.forEach(match_item => {
              if(match_item.homeScore){
                match_item.home = match_item.homeScore;
              }
              if(match_item.awayScore){
                match_item.away = match_item.awayScore;
              }
            });
            return {
              no,
              mmp,
              batchNo,
              match:m.matchs
            };
          });
          this.match_data_base_set_list(this.no_title_list);
          if(is_user_clicked){
            this.is_user_switch_league = Math.random();
          }
          this.get_ol_dictionary();
          //赛马赛狗赛 摩托车事初始化
          if([1002,1011,1010,1009].includes(this.sub_menu_type)){
            let found = res.data[0];
            if(found){
              let c_match = this.append_init_fields(found.matchs[0]);
              let server_now = get_now_server();
              c_match.start_now_sub = Number(c_match.mgt) - server_now;
              this.current_match = c_match;
              this.set_current_mid(this.current_match.mid);
            }
          }
        }
        else{
          this.virtual_match_list = [];
          this.match_list_by_no = [];
        }
        this.match_list_is_empty = !this.virtual_match_list.length;
        if(this.match_list_is_empty){
          this.current_match = {};
          this.virtual_m_list_no_data_();
        }
        else{
          if(!this.current_league) return;
          let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
          let match_list_map = lodash.cloneDeep(this.get_prev_v_sports);
          if(!match_list_map) match_list_map = {};
          match_list_map[p_key] = lodash.cloneDeep(this.virtual_match_list);
          this.set_prev_v_sports(match_list_map);
          this.no_virtual_match = false;

          //选中上次选择的期
          let curr_batch = this.current_batch,found_batch_i = 0;
          if(!curr_batch){
            curr_batch = this.virtual_match_list[0];
          }
          let found_batch = this.virtual_match_list.filter((cu,cu_i) => {
            if(cu.batchNo == curr_batch.batchNo){
              found_batch_i = cu_i;
              return true;
            }
            return false;
          })[0];
          if(!found_batch){
            found_batch = this.virtual_match_list[0];
          }
          this.sub_nav_changed({
            nav:found_batch,
            i:found_batch_i
          });

        }
        this.is_reset_tab_i = Math.random();
      }).catch((e) => {
        this.virtual_data_loading = false;
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
        this.set_virtual_data_loading(0);
        useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
        useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

        this.virtual_match_list = [];
        this.match_list_by_no = [];
        this.match_list_is_empty = true;
        this.current_match = {};
        this.virtual_m_list_no_data_();
        this.is_reset_tab_i = Math.random();
      });
    },
    /**
     * 虚拟篮球更新下一期赛事  当有滚球和赛前 此时选中赛前不调用
     */
    v_basket_ball_update_n(){
      let params = this.param_generate();
      if(!params) return;
      api_v_sports[window.BUILDIN_CONFIG.IS_PC ? 'get_virtual_sport_list_pc' : 'get_virtual_sport_list'](params).then(res => {
        // 兼容pc接口数据
        if(res.data?.data && window.BUILDIN_CONFIG.IS_PC){
          res.data = res.data.data;
        }
        if(res.code == 200 && res.data && res.data.length){
          this.virtual_match_list = this.append_result_fields(res.data);

          if(this.current_match.mmp == "INGAME" && res.data.length < 2){
            return;
          }
          this.no_title_list = this.virtual_match_list.map(m => {
            let {no,mmp,batchNo} = m;
            m.matchs.forEach(match_item => {
              if(match_item.homeScore){
                match_item.home = match_item.homeScore;
              }
              if(match_item.awayScore){
                match_item.away = match_item.awayScore;
              }
            });
            return {
              no,
              mmp,
              batchNo,
              match:m.matchs
            };
          });
          this.match_data_base_set_list(this.no_title_list);
          if(this.no_title_list && this.no_title_list.length > 1){
            this.is_basket_ball_next_no = Math.random();
          }
        }
      }).catch((e) => {
        this.virtual_data_loading = false;
      });
    },
    /**
     * 篮球滚球开赛后10秒获取下一期篮球
     */
    get_next_pre_basketball(){
      clearTimeout(this.get_next_basketball_time);
      this.get_next_basketball_time = setTimeout(() => {
        let params = this.param_generate();
        if(!params) return;
        if(this.current_batch.mmp == 'PREGAME' && this.no_title_list.length == 2) return
        api_v_sports[window.BUILDIN_CONFIG.IS_PC ? 'get_virtual_sport_list_pc' : 'get_virtual_sport_list'](params).then(res => {
          // 兼容pc接口数据
          if(res.data?.data && window.BUILDIN_CONFIG.IS_PC){
            res.data = res.data.data;
          }
          if(res.code == 200 && res.data && res.data.length){
            this.virtual_match_list = this.append_result_fields(res.data);
            if(this.current_match.mmp == "INGAME" && res.data.length == 1 && res.data[0].mmp == "PREGAME"){
              useMittEmit(MITT_TYPES.EMIT_FORCE_END_PLAYING_BASKETBALL);
              return;
            }
            this.no_title_list = this.virtual_match_list.map(m => {
              let {no,mmp,batchNo} = m;
              m.matchs.forEach(match_item => {
                if(match_item.homeScore){
                  match_item.home = match_item.homeScore;
                }
                if(match_item.awayScore){
                  match_item.away = match_item.awayScore;
                }
              });
              return {
                no,
                mmp,
                batchNo,
                match:m.matchs
              };
            });
            this.match_data_base_set_list(this.no_title_list);
            // if(this.no_title_list && this.no_title_list.length > 1){
            //   this.is_basket_ball_next_no = Math.random();
            // }
            this.is_basket_ball_next_no = Math.random();
          }
        }).catch((e) => {
          this.virtual_data_loading = false;
        });
      },1000 * 10);
    },
    /**
     * 附加赛果到赛事列表
     * @param {Array} result_list 赛果数据
     * @param {Array} match_list_source 需要更新的赛事数据
     */
    append_match_result(result_list,match_list_source){
      if(result_list && result_list.length && match_list_source.length){
        result_list.forEach(match => {
          match.forEach(hp => {
            hp.hl.forEach(hl_item => {
              hl_item.ol.forEach(ol_item_0 => {


                match_list_source.forEach(no_title_source => {
                  if(!no_title_source.matchs || !no_title_source.matchs.length) { return }
                  no_title_source.matchs.forEach(match_source => {

                    if(!match_source.hps || !match_source.hps.length) { return }
                    match_source.hps.forEach(hp_source => {

                      if(!hp_source.hl || !hp_source.hl.length) { return }
                      hp_source.hl.forEach(hl_item_source => {

                        if(!hl_item_source.ol || !hl_item_source.ol.length) {return}
                        hl_item_source.ol.forEach(ol_item_source => {
                          if(ol_item_0.oid == ol_item_source.oid){
                            ol_item_source.result = ol_item_0.result;
                          }
                        });
                      });
                    });
                  });
                });

              });
            });
          });
        });
      }
    },
    /**
     * 虚拟体育赛事接口未获取到数据处理
     */
    virtual_m_list_no_data_(){
      if(!this.current_league) {
        this.no_match_list_handle();
        return;
      }

      let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
      //赛事列表
      let match_list = lodash.cloneDeep(this.get_prev_v_sports[p_key]);
      if(match_list){
        match_list.forEach(m => {
          m.mhs = 11;
        });
        this.virtual_match_list = match_list;
        this.sub_nav_changed({
          nav:lodash.cloneDeep(this.virtual_match_list[0]),
          i:0
        });
      }
      else{
        this.no_match_list_handle();
        return;
      }
      //当前赛事
      let match = lodash.cloneDeep(this.get_prev_v_sports_params[p_key]);
      if(match){
        match.match_status = 2;
        this.is_video_playing = false;
        this.current_match = lodash.cloneDeep(match);
        if(match_list && match_list.length){
          let params = {mids:match.mid};
          api_v_sports.get_virtual_match_result(params).then(res => {
            this.skeleton = false
            if(res.code == 200){
              let result_list = res.data;
              this.append_match_result(result_list,this.match_list_by_no);
              useMittEmit(MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED,result_list);
            }
          }).catch((err)=>{
            this.skeleton = false
          })
        }
      }
      //

    },
    /**
     * 未获取到虚拟体育赛事列表设置空数据提醒
     */
    no_match_list_handle(){
      this.no_virtual_match = true;
    },
    /**
     * 篮球结束
     */
    basketball_end_handle(){
      this.get_score_basket_ball();
    },
    /**
     * 获取投注项字典对象
     */
    get_ol_dictionary(){
      Object.keys(this.ol_dictionary).forEach(k => {
        delete this.ol_dictionary[k];
      });

      if(this.no_title_list && this.no_title_list.length){
        this.no_title_list.forEach(no_title => {

          if(!no_title.match || !no_title.match.length) { return }
          no_title.match.forEach(match => {

            if(!match.hps || !match.hps.length) { return }
            match.hps.forEach(hp => {

              if(!hp.hl || !hp.hl.length) { return }
              hp.hl.forEach(hl_item => {

                if(!hl_item.ol || !hl_item.ol.length) {return}
                hl_item.ol.forEach(ol_item => {
                  this.ol_dictionary[ol_item.oid] = ol_item;
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
      if(this.virtual_match_list && this.virtual_match_list.length > 1){
        let mgt = Number(this.virtual_match_list[1].matchs[0].mgt);
        let now = get_now_server();
        let sub = mgt - now;
        //下一轮开赛
        if(sub <= 0){
          if(this.tab_item_click_handle){
            this.tab_item_click_handle(this.tab_item_i);
          }
        }
        else{
          clearTimeout(this.timer_super5);
          this.timer_super5 = setTimeout(() => {
            this.check_next_no_start_time();
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
      let dom_stage = this.$refs.virtual_sports_stage
      this.checking_first_delete_batchNo = '';
      this.tab_league_i = params.i;
      if(dom_stage){
        dom_stage.user_destroy_resource();
      }
      this.gen_video_api_cache_key();
      this.set_current_batch(lodash.cloneDeep(data));
      if(this.sub_menu_type == 1004){
        useMittEmit(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, 0)
      }
      let found = this.virtual_match_list.filter(vm => {
        let r = false;
        if(vm && data){
          r = vm.batchNo == data.batchNo;
        }
        return r;
      })[0];
      if(found){
        this.match_list_by_no = [];
        clearTimeout(this.timer_v_1); // 此setTimeout 解决bug 22990
        this.timer_v_1 = setTimeout(() => {
          this.match_list_by_no = found.matchs.map(f_match => {
            return this.append_init_fields(f_match);
          });
          if(this.match_list_by_no.length){
            this.current_match = this.match_list_by_no[0];
            let server_now = get_now_server();
            this.current_match.start_now_sub = Number(this.current_match.mgt) - server_now;
            if(this.sub_menu_type == 1004){
              if(this.current_match.mmp == "PREGAME"){
                this.get_video_process_by_api();
              }
              //篮球滚球开赛后9秒,获取视频接口
              else if(this.current_match.mmp == "INGAME"){
                if(this.current_match.start_now_sub <= -(9 * 1000)){
                  this.get_video_process_by_api();
                  this.is_video_playing = true;
                }
                this.get_score_basket_ball();
              }
            }
            else{
              // 比赛已开始, 获取视频接口
              if(this.current_match.start_now_sub <= 0){
                this.get_video_process_by_api();
              }
            }
            this.current_match_id = this.match_list_by_no[0].mid;
          }
          this.match_list_loaded = Math.random();
        });
      }
      else{
        this.match_list_by_no = [];
        this.current_match_id = "";
        this.match_list_loaded = Math.random();
      }
      this.check_is_first_tab_delete();
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
      this.video_by_api_cache_key = `${params.csid}-${params.tid}-${params.batchNo}`;
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
      let params = this.gen_video_api_cache_key();
      if(!params.csid) return;
      if(this.current_match.orderNo){
        params.orderNo = this.current_match.orderNo;
        this.video_by_api_cache_key += `-${params.orderNo}`;
      }
      this.api_video_params = params;
      api_v_sports.get_virtual_video_process(params).then(res => {
        if(res.code == 200){
          if(res.data && res.data.detail && Object.keys(res.data.detail).length){
            if(!is_no_match_data){
              let video_data = lodash.cloneDeep(res.data);
              this.set_basketball_video_data(video_data);
              this.set_video_process_data(video_data);
              useMittEmit(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT,res.data);
            }
            if(success_cb){
              success_cb(res.data);
            }
          }
          else{
            if(!is_no_match_data){
              this.no_process_data_p_key = this.video_by_api_cache_key;
              this.get_video_process_by_api_again(success_cb);
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
          let now_server = get_now_server();
          if(future - now_server < 1000){
            this.update_no_title_list();
          }
        }
      };
      //获取赛事视频总时长
      let invok_video_process = (match) => {
        let params = {
          batchNo: match.batchNo,
          tid: match.tid,
        }
        if(this.video_pro_maxtime && this.video_pro_maxtime[params.tid]){
          let totalTime = this.video_pro_maxtime[params.tid];
          check_is_reload_data(totalTime,match);
          return;
        }
        api_common.get_Video_MaxTime(params).then(res => {
          let res_data = null;
          if (res.code == 200) {
            res_data = lodash.get(res,'data');
            let totalTime = res_data[params.tid];
            if(totalTime){
              if(!this.video_pro_maxtime){
                this.video_pro_maxtime = {};
              }
              this.video_pro_maxtime[params.tid] = totalTime;
              check_is_reload_data(totalTime,match);
            }
          }
          if(!res_data){
            this.checking_first_delete_batchNo = '';
          }
        });
      };

      //检查第一批赛事是否结束
      let check = () => {
        let first_t_item = this.no_title_list[0];
        if(first_t_item){
          let first_m_item = first_t_item.match[0];
          if(first_m_item){
            let mgt = first_m_item.mgt * 1;
            let time_ = get_now_server() - mgt;
            if(time_ > -1){
              this.checking_first_delete_batchNo = first_m_item.batchNo;
              invok_video_process(first_m_item);
            }
          }
        }
        if(this.tab_league_i != 0){
          clearTimeout(this.checking_first_delete_timer);
          this.checking_first_delete_timer = setTimeout(() => {
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
      let params = this.param_generate();
      if(!params) return;
      api_v_sports[window.BUILDIN_CONFIG.IS_PC ? 'get_virtual_sport_list_pc' : 'get_virtual_sport_list'](params).then(res => {
        // 兼容pc接口数据
        if(res.data?.data && window.BUILDIN_CONFIG.IS_PC){
          res.data = res.data.data;
        }
        if(res.code == 200 && res.data && res.data.length){
          let n_title_list = res.data.map(res_item => {
            let {no,mmp,batchNo} = res_item;
            this.virtual_match_list.push(res_item);
            return {
              no,
              mmp,
              batchNo,
              match:res_item.matchs
            };
          });
          let n_first = n_title_list[0];
          let o_first = this.no_title_list[0];
          if(n_first.batchNo != o_first.batchNo){
            if(this.current_match.mmp == "INGAME"){
              if(n_title_list.length == 1 && this.no_title_list.length > 1){
                let f_b_no = n_title_list[0].batchNo;
                let found_i = lodash.findIndex(this.no_title_list,{batchNo:f_b_no});
                if(found_i > -1){
                  return;
                }
              }
            }
            this.no_title_list = n_title_list;
            this.match_data_base_set_list(this.no_title_list);
            if(this.tab_league_i == 0){
              this.auto_change_tab_i_first = Math.random();
            }
          }
        }
      }).catch((e) => {
        this.virtual_data_loading = false;
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
        this.skeleton = false
        if(res.code == 200){
          let match_list = res.data;
          if(match_list && match_list.length && this.virtual_match_list.length){
            this.append_match_result(match_list,this.virtual_match_list);
            this.append_match_result(match_list,this.match_list_by_no);

            //赛事列表
            let cache_dict = lodash.cloneDeep(this.get_prev_v_sports);
            let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
            cache_dict[p_key] = lodash.cloneDeep(this.virtual_match_list);
            this.set_prev_v_sports(cache_dict);
            useMittEmit(MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED,match_list);
          }
        }
        callback()
      }).catch((err)=>{
        this.skeleton = false
      })
    },
    /**
      * 1s后再次获取赛事视频进程数据
      * @param {Undefined} Undefined
      * @return {Undefined} Undefined
      */
    get_video_process_by_api_again(success_cb){
      this.again_total++;
      if(this.again_total > 10){
        this.again_total = 0;
        clearTimeout(this.procee_again_timer);
        useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
        if(this.no_video_data_invoke_match_data_count < 1){
          this.no_video_data_invoke_match_data_count++;
          if(this.get_virtual_sport_list){
            this.get_virtual_sport_list();
          }
        }
        return;
      }
      clearTimeout(this.procee_again_timer);
      this.procee_again_timer = setTimeout(() => {
        if(this.no_process_data_p_key){
          //切换赛事后参数不一样停止请求数据
          if(this.video_by_api_cache_key != this.no_process_data_p_key){
            this.again_total = 0;
            return;
          }
          let params = this.api_video_params;
          if(!params.csid) return;
          api_v_sports.get_virtual_video_process(params).then(res => {
            let get_data = false;
            if(res.code == 200){
              if(res.data && res.data.detail && Object.keys(res.data.detail).length){
                get_data = true;
                let copied_video = lodash.cloneDeep(res.data);
                this.set_basketball_video_data(copied_video);
                this.set_video_process_data(copied_video);
                useMittEmit(MITT_TYPES.EMIT_VIDEO_PROCESS_DATA_GOT,copied_video);
                if(success_cb){
                  success_cb();
                }
              }
            }
            if(!get_data){
              this.get_video_process_by_api_again();
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
      if(this.get_video_process_data){
        let {batchNo} = match;

        if(this.get_video_process_data.batchNo == batchNo){
          let p_data_detail = this.get_video_process_data.detail;
          let detail_copied = lodash.cloneDeep(p_data_detail);
          if(detail_copied && detail_copied[match.mid]){
            got_data = true;
            Object.assign(match,detail_copied[match.mid]);
            if(this.video_process_obj && this.video_process_obj.destroy){
              this.video_process_obj.destroy();
            }
            this.video_process_obj = new VSport(match,res => {
              match.show_time = res.show_time;
              match.match_status = res.match_status;
              VR_CTR.state.process_changing_match = match;

              //当赛事结束,检查所有赛事是否结束
              if(match.match_status == 2){
                this.is_video_playing = false;
                useMittEmit(MITT_TYPES.EMIT_MATCH_EDNED_STATUS2, match);
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
                    // this.$set(match,'upd_data', JSON.stringify(res.item_obj));
                    match.upd_data = JSON.stringify(res.item_obj);
                  }
                  break;
                default:
                  break;
              }
            });
            useMittEmit(MITT_TYPES.EMIT_CURRENT_VIDEO_PROCESS_INITED,this.get_video_process_data);
          }
        }
      }
      if(!got_data){
        // this.get_video_process_by_api_again();
        // this.get_video_process_by_api('is_switch_match');
      }
    },
    /**
     * 获取赛事结束时的比分
     */
    get_result_score(){
      if(!this.current_batch.batchNo){
        return
      }

      let dict_key = `${this.sub_menu_type}-${this.current_league.menuId}-${this.current_batch.batchNo}`;
      if(!this.v_match_ended_score_dict[dict_key]){
        this.v_match_ended_score_dict[dict_key] = {};
        let mid_str = this.match_list_by_no.map(match => match.mid).join(',');
        if(!mid_str) {
          delete this.v_match_ended_score_dict[dict_key];
          return;
        }
        this.get_score_basket_ball();
        this.get_score_by_api();
      }
    },
    /**
     * 虚拟篮球获取比分
     * @returns
     */
    get_score_basket_ball(){
      if(this.current_match.mmp == "INGAME"){
        this.match_list_by_no.forEach( m => {
          if(!m.home){
            m.home = m.homeScore;
            m.away = m.awayScore;
          }
        });
      }
      // else if(this.current_match.mmp == "PREGAME"){
      //   this.get_score_by_api();
      // }
    },
    /**
     * 获取比分接口
     * @returns undefined
     */
    get_score_by_api(){
      let mid_str = this.match_list_by_no.map(match => match.mid).join(',');
      if(!mid_str) return;
      api_v_sports.get_v_match_score_api({mids:mid_str}).then(res => {
        if(res.code == 200){
          let score_dict = res.data;
          if(!res.data || !Object.keys(res.data).length){
            let local_dict = this.get_basketball_score_store('v-football-score');
            if(local_dict){
              score_dict = local_dict;
            }
          }
          this.match_list_by_no.forEach(m => {
            if(m.batchNo == this.current_batch.batchNo){
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
                if(this.current_match.mid == m.mid){
                  this.current_match.home = m.home;
                  this.current_match.away = m.away;
                  this.current_match.s170_home = m.s170_home;
                  this.current_match.s170_away = m.s170_away;
                }
              }
            }
          });
          this.set_basketball_score_store(res.data,'v-football-score');
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
  },
  watch:{
    //开赛视频播放
    get_video_process_data(){
      this.get_match_video_process(this.current_match);
    }
  },
  beforeDestroy(){
    this.emitters.map((x) => x());
    // this.$root.$off(this.emit_cmd.EMIT_NO_VIRTUAL_MENU_DATA,this.no_virtual_menu_data);
  },
  destroyed () {
    this.clear_mixin_timer();
  },
}

