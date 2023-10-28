
/**
 * @description 虚拟体育数据处理
 */

import VirtualVideo from './virtual-video'

class VirtualData {
  constructor () {
    this.menu_list = []
    this.tab_item_i = 0
    this.ol_dictionary = []
    this.no_title_list = []
    this.match_list_by_no = []
    this.no_virtual_match = false
    // 虚拟赛事列表
    this.virtual_match_list = []
    // 自动改变批次到第1个
    this.is_user_switch_league = 0
    // 自动改变批次到第1个
    this.auto_change_tab_i_first = 0
    this.virtual_data_loading = false
    this.virtual_m_list_data_cache_key = 'virtual_m_list_data_cache_key'
  }

  /**
   * 生成赛事请求接口参数
   */
  param_generate () {
    let params = null;
    if(this.menu_list && this.menu_list[this.tab_item_i]){
      let league = this.menu_list[tab_item_i];
      params = {
        tid: league.field1,
        csid: propsParams.csid
      };
    }
    return params;
  }

  /**
   * @description: 虚拟菜单数据未空时的逻辑处理函数
   * @return {*}
   */
  no_virtual_menu_data () {
    this.virtual_data_loading = false;
    this.no_match_list_handle();
  }
  /**
   * @description: 附加初始化赛果result字段
   * @return {String}
   */
  append_result_fields () {
    if(this.no_title_list && this.no_title_list.length){
      this.no_title_list.forEach(no_title => {
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
    return this.no_title_list
  }
  /**
   * 获取本地缓存虚拟体育赛事列表
   * @param {String} cache_key 缓存键
   */
  get_local_cache_virtual_match (cache_key) {
    let pre_store_data = {};
    let data_store = sessionStorage.getItem(this.virtual_m_list_data_cache_key);
    if(data_store){
      pre_store_data = JSON.parse(data_store);
    }
    return pre_store_data[cache_key];
  }
  /**
   * 设置缓存
   * @param {Array} match_list 写入缓存的赛事列表
   * @param {String} cache_key 缓存键
   */
  set_local_cache_virtual_match (match_list,cache_key) {
    let pre_store_data = {};
    let data_store = sessionStorage.getItem(this.virtual_m_list_data_cache_key);
    if(data_store){
      pre_store_data = JSON.parse(data_store);
    }
    pre_store_data[cache_key] = match_list;
    sessionStorage.setItem(this.virtual_m_list_data_cache_key,JSON.stringify(pre_store_data));
  }
  /**
   * @description: 获取虚拟体育赛事列表
   * @param {Object} params 接口参数
   * @return {String}
   */
  get_virtual_sport_local (is_user_clicked) {
    VirtualVideo.gen_video_api_cache_key();
    let params = param_generate();
    if(!params) {
      this.virtual_data_loading= false;
      this.no_match_list_handle();
      return;
    }
    if(is_user_clicked != 'is_user_refreshing'){
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,true);
      this.virtual_match_list = [];
      this.match_list_by_no = [];
      this.no_title_list = [];
      this.virtual_data_loading= true;
    }
    api_v_sports.get_virtual_sport_list(params).then(res => {
      this.virtual_data_loading= false;
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
      useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
      useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

      if(res.code == 200 && res.data && res.data.length){
        this.virtual_match_list = append_result_fields(res.data);
        check_next_no_start_time();
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

        if(is_user_clicked){
          this.is_user_switch_league = Math.random();
        }
        get_ol_dictionary();
        //赛马赛狗赛 摩托车事初始化
        if([1002,1011,1010,1009].includes(this.sub_menu_type)){
          let found = res.data[0];
          if(found){
            let c_match = this.append_init_fields(found.matchs[0]);
            let server_now = this.get_now_server();
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
        this.virtual_m_list_no_data();
      }
      else{
        if(!this.current_league) return;
        let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
        let match_list_map = _.cloneDeep(this.get_prev_v_sports);
        if(!match_list_map) match_list_map = {};
        match_list_map[p_key] = _.cloneDeep(this.virtual_match_list);
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
      this.virtual_data_loading= false;
      useMittEmit(MITT_TYPES.EMIT_VIRTUAL_MATCH_LOADING,false);
      useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
      useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);

      this.virtual_match_list = [];
      this.match_list_by_no = [];
      this.match_list_is_empty = true;
      this.current_match = {};
      this.virtual_m_list_no_data();
      this.is_reset_tab_i = Math.random();
    });
  }

  /**
   * 虚拟篮球更新下一期赛事  当有滚球和赛前 此时选中赛前不调用
   */
  v_basket_ball_update_n(){
    let params = this.param_generate();
    if(!params) return;
    api_v_sports.get_virtual_sport_list(params).then(res => {
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
        if(this.no_title_list && this.no_title_list.length > 1){
          this.is_basket_ball_next_no = Math.random();
        }
      }
    }).catch((e) => {
      this.virtual_data_loading = false;
    });
  }
  /**
   * 篮球滚球开赛后10秒获取下一期篮球
   */
  get_next_pre_basketball(){
    clearTimeout(this.get_next_basketball_time);
    this.get_next_basketball_time = setTimeout(() => {
      let params = this.param_generate();
      if(!params) return;
      if(this.current_batch.mmp == 'PREGAME' && this.no_title_list.length == 2) return
      api_v_sports.get_virtual_sport_list(params).then(res => {
        if(res.code == 200 && res.data && res.data.length){
          this.virtual_match_list = this.append_result_fields(res.data);
          if(this.current_match.mmp == "INGAME" && res.data.length == 1 && res.data[0].mmp == "PREGAME"){
            this.$root.$emit(this.emit_cmd.EMIT_FORCE_END_PLAYING_BASKETBALL);
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
          // if(this.no_title_list && this.no_title_list.length > 1){
          //   this.is_basket_ball_next_no = Math.random();
          // }
          this.is_basket_ball_next_no = Math.random();
        }
      }).catch((e) => {
        this.virtual_data_loading = false;
      });
    },1000 * 10);
  }

  /**
   * 附加赛果到赛事列表
   * @param {Array} result_list 赛果数据
   * @param {Array} match_list_source 需要更新的赛事数据
   */
  append_match_result (result_list,match_list_source) {
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
  }
  /**
   * 虚拟体育赛事接口未获取到数据处理
   */
  virtual_m_list_no_data  () {
    if(!this.current_league) {
      this.no_match_list_handle();
      return;
    }

    let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
    //赛事列表
    let match_list = _.cloneDeep(this.get_prev_v_sports[p_key]);
    if(match_list){
      match_list.forEach(m => {
        m.mhs = 11;
      });
      this.virtual_match_list = match_list;
      this.sub_nav_changed({
        nav:_.cloneDeep(this.virtual_match_list[0]),
        i:0
      });
    }
    else{
      this.no_match_list_handle();
      return;
    }
    //当前赛事
    let match = _.cloneDeep(this.get_prev_v_sports_params[p_key]);
    if(match){
      match.match_status = 2;
      this.is_video_playing = false;
      this.current_match = _.cloneDeep(match);
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

  }
  /**
   * 未获取到虚拟体育赛事列表设置空数据提醒
   */
  no_match_list_handle () {
    this.no_virtual_match = true;
  }
  /**
   * 检测下一轮开赛时间刷新数据
   */
  check_next_no_start_time () {
    if(this.virtual_match_list && this.virtual_match_list.length > 1){
      let mgt = Number(this.virtual_match_list[1].matchs[0].mgt);
      let now = this.get_now_server();
      let sub = mgt - now;
      //下一轮开赛
      if(sub <= 0){
        if(tab_item_click_handle && typeof tab_item_click_handle === 'function'){
          tab_item_click_handle(this.tab_item_i);
        }
      }
      else{
        clearTimeout(this.timer_super5);
        this.timer_super5 = setTimeout(() => {
          check_next_no_start_time();
        },1000);
      }
    }
  }
  /**
   * 获取投注项字典对象
   */
  get_ol_dictionary () {
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
  }
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
  }
  /**
   * 检查是否删除第一期
   */
  check_is_first_tab_delete(){
    let check_is_reload_data = (totalTime,match) => {
      if(totalTime){
        totalTime = totalTime * 1;
        let mgt = match.mgt * 1;
        let future = mgt + totalTime * 1000;
        let now_server = this.get_now_server();
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
          res_data = _.get(res,'data');
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
          let time_ = this.get_now_server() - mgt;
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
  }
  /**
   * 移除结束的批更新tab联赛列表
   */
  update_no_title_list(){
    let params = this.param_generate();
    if(!params) return;
    api_v_sports.get_virtual_sport_list(params).then(res => {
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
              let found_i = _.findIndex(this.no_title_list,{batchNo:f_b_no});
              if(found_i > -1){
                return;
              }
            }
          }
          this.no_title_list = n_title_list;
          if(this.tab_league_i == 0){
            this.auto_change_tab_i_first = Math.random();
          }
        }
      }
    }).catch((e) => {
      this.virtual_data_loading = false;
    });
  }
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
          let cache_dict = _.cloneDeep(this.get_prev_v_sports);
          let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
          cache_dict[p_key] = _.cloneDeep(this.virtual_match_list);
          this.set_prev_v_sports(cache_dict);
          this.$root.$emit(this.emit_cmd.EMIT_MATCH_RESULT_DATA_LOADED,match_list);
        }
      }
      callback()
    }).catch((err)=>{
      this.skeleton = false
    })
  }
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
  }
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
    this.set_current_batch(_.cloneDeep(data));
    if(this.sub_menu_type == 1004){
      this.$root.$emit(this.emit_cmd.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, 0)
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
          let server_now = this.get_now_server();
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
  }
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
  }
  set_basketball_score_store(data,store_key='v-basketball-score'){
    sessionStorage.setItem(store_key,JSON.stringify(data));
  }
  get_basketball_score_store(store_key='v-basketball-score'){
    let r = null;
    let socre = sessionStorage.getItem(store_key);
    if(socre){
      r = JSON.parse(socre);
    }
    return r;
  }
}

export default new VirtualData()