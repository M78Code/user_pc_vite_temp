// /*
//  * @Author: Cronus
//  * @Date: 2020-12-30 10:37:23
//  * @Description:
//  */
// import { mapMutations } from "vuex"
// import { api_v_sports } from "src/project/api/index.js";
// import VSport from "src/public/utils/vsport/vsport.js"
// import { api_common} from "src/project/api/index.js";  // 引入api接口封装文件

// export default {
//   data(){
//     return {
//       //虚拟赛事列表
//       virtual_match_list:[],
//       //视频进程接口未拉取到数据的参数key
//       no_process_data_p_key:'',
//       //重调用视频进程接口次数
//       again_total:0,
//       //调用10次接口依然无视频数据然后调用赛事列表次数
//       no_video_data_invoke_match_data_count:0,
//       //记录视频进程接口请求
//       match_process_key_map:{},
//       //投注项字典
//       ol_dictionary:{},
//       //视频进程接口参数key
//       video_by_api_cache_key:'',
//       //视频进程接口参数
//       api_video_params:{},
//       //虚拟赛事列表请求唯一key
//       virtual_s_list_req_key:"list",
//       //虚拟赛事赛果请求唯一key
//       virtual_m_result_req_key:"virtual_m_result_req_key",
//       //虚拟体育赛事缓存键
//       virtual_m_list_data_cache_key:"virtual_m_list_data_cache_key",
//       //是用户点击联赛切换联赛
//       is_user_switch_league:0,
//       //选中的联赛tab下标
//       tab_league_i:0,
//       //检查第一批次是否结束的批次号
//       checking_first_delete_batchNo:'',
//       //视频进程数据最大时间
//       video_pro_maxtime:null,
//       //自动改变批次到第1个
//       auto_change_tab_i_first:0,
//       //当前批次赛事结束时的比分对象S1常规赛(上下半场)比分 S170点球大战比分
//       v_match_ended_score_dict:{},
//       skeleton: true,
//       get_pre_score_time:null,
//     }
//   },
//   created () {
//     // 延时器
//     this.get_next_basketball_time = null;
//     this.timer_super5 = null;
//     //切换赛事列表时钟
//     this.timer_v_1 = null;
//     //检查第一批次是否结束的时钟
//     this.checking_first_delete_timer = null;
//     //重调用视频进程接口时钟
//     this.procee_again_timer = null;
//     this.$root.$on(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA,this.no_virtual_menu_data);
//   },
//   methods:{
//     ...mapMutations({
//       set_virtual_data_loading:'set_virtual_data_loading',
//       set_prev_v_sports:"set_prev_v_sports",
//       set_current_batch:"set_current_batch",
//     }),
    
//     /**
//      * 虚拟篮球更新下一期赛事  当有滚球和赛前 此时选中赛前不调用
//      */
//     v_basket_ball_update_n(){
//       let params = this.param_generate();
//       if(!params) return;
//       api_v_sports.get_virtual_sport_list(params).then(res => {
//         if(res.code == 200 && res.data && res.data.length){
//           this.virtual_match_list = this.append_result_fields(res.data);

//           if(this.current_match.mmp == "INGAME" && res.data.length < 2){
//             return;
//           }
//           this.no_title_list = this.virtual_match_list.map(m => {
//             let {no,mmp,batchNo} = m;
//             m.matchs.forEach(match_item => {
//               if(match_item.homeScore){
//                 match_item.home = match_item.homeScore;
//               }
//               if(match_item.awayScore){
//                 match_item.away = match_item.awayScore;
//               }
//             });
//             return {
//               no,
//               mmp,
//               batchNo,
//               match:m.matchs
//             };
//           });
//           if(this.no_title_list && this.no_title_list.length > 1){
//             this.is_basket_ball_next_no = Math.random();
//           }
//         }
//       }).catch((e) => {
//         this.virtual_data_loading = false;
//       });
//     },
//     /**
//      * 篮球滚球开赛后10秒获取下一期篮球
//      */
//     get_next_pre_basketball(){
//       clearTimeout(this.get_next_basketball_time);
//       this.get_next_basketball_time = setTimeout(() => {
//         let params = this.param_generate();
//         if(!params) return;
//         if(this.current_batch.mmp == 'PREGAME' && this.no_title_list.length == 2) return
//         api_v_sports.get_virtual_sport_list(params).then(res => {
//           if(res.code == 200 && res.data && res.data.length){
//             this.virtual_match_list = this.append_result_fields(res.data);
//             if(this.current_match.mmp == "INGAME" && res.data.length == 1 && res.data[0].mmp == "PREGAME"){
//               useMittEmit(MITT_TYPES.EMIT_FORCE_END_PLAYING_BASKETBALL);
//               return;
//             }
//             this.no_title_list = this.virtual_match_list.map(m => {
//               let {no,mmp,batchNo} = m;
//               m.matchs.forEach(match_item => {
//                 if(match_item.homeScore){
//                   match_item.home = match_item.homeScore;
//                 }
//                 if(match_item.awayScore){
//                   match_item.away = match_item.awayScore;
//                 }
//               });
//               return {
//                 no,
//                 mmp,
//                 batchNo,
//                 match:m.matchs
//               };
//             });
//             // if(this.no_title_list && this.no_title_list.length > 1){
//             //   this.is_basket_ball_next_no = Math.random();
//             // }
//             this.is_basket_ball_next_no = Math.random();
//           }
//         }).catch((e) => {
//           this.virtual_data_loading = false;
//         });
//       },1000 * 10);
//     },
    
//     /**
//      * 篮球结束
//      */
//     basketball_end_handle(){
//       this.get_score_basket_ball();
//     },
//     /**
//      * 获取投注项字典对象
//      */
//     get_ol_dictionary(){
//       Object.keys(this.ol_dictionary).forEach(k => {
//         delete this.ol_dictionary[k];
//       });

//       if(this.no_title_list && this.no_title_list.length){
//         this.no_title_list.forEach(no_title => {

//           if(!no_title.match || !no_title.match.length) { return }
//           no_title.match.forEach(match => {

//             if(!match.hps || !match.hps.length) { return }
//             match.hps.forEach(hp => {

//               if(!hp.hl || !hp.hl.length) { return }
//               hp.hl.forEach(hl_item => {

//                 if(!hl_item.ol || !hl_item.ol.length) {return}
//                 hl_item.ol.forEach(ol_item => {
//                   this.ol_dictionary[ol_item.oid] = ol_item;
//                 });
//               });
//             });
//           });
//         });
//       }
//     },
//     /**
//      * 赛事初始化字段附加
//      */
//     append_init_fields(f_match){
//       return {
//         ...f_match,
//         home:0,
//         away:0,
//         s170_home:0,//点球大战
//         s170_away:0,
//         show_time:0,
//         match_status:0,
//         thirdMatchVideoUrl:'',
//         start_now_sub:-20, //开赛时间到当前服务器端的时间的差
//         invalid:false,//是否投注无效,无效时显示锁盘
//       }
//     },
//     /**
//      * @description: 批次菜单切换
//      * @param {Object} params tab数据
//      * @return {Undefined} Undefined
//      */
//     sub_nav_changed(params){
//       if(!params || !params.nav) return;
//       let data = params.nav;
//       let dom_stage = this.$refs.virtual_sports_stage
//       this.checking_first_delete_batchNo = '';
//       this.tab_league_i = params.i;
//       if(dom_stage){
//         dom_stage.user_destroy_resource();
//       }
//       this.gen_video_api_cache_key();
//       this.set_current_batch(_.cloneDeep(data));
//       if(this.sub_menu_type == 1004){
//         useMittEmit(MITT_TYPES.EMIT_XU_NI_TY_STANDARD_ODD_STATUS, 0)
//       }
//       let found = this.virtual_match_list.filter(vm => {
//         let r = false;
//         if(vm && data){
//           r = vm.batchNo == data.batchNo;
//         }
//         return r;
//       })[0];
//       if(found){
//         this.match_list_by_no = [];
//         clearTimeout(this.timer_v_1); // 此setTimeout 解决bug 22990
//         this.timer_v_1 = setTimeout(() => {
//           this.match_list_by_no = found.matchs.map(f_match => {
//             return this.append_init_fields(f_match);
//           });
//           if(this.match_list_by_no.length){
//             this.current_match = this.match_list_by_no[0];
//             let server_now = this.get_now_server();
//             this.current_match.start_now_sub = Number(this.current_match.mgt) - server_now;
//             if(this.sub_menu_type == 1004){
//               if(this.current_match.mmp == "PREGAME"){
//                 this.get_video_process_by_api();
//               }
//               //篮球滚球开赛后9秒,获取视频接口
//               else if(this.current_match.mmp == "INGAME"){
//                 if(this.current_match.start_now_sub <= -(9 * 1000)){
//                   this.get_video_process_by_api();
//                   this.is_video_playing = true;
//                 }
//                 this.get_score_basket_ball();
//               }
//             }
//             else{
//               // 比赛已开始, 获取视频接口
//               if(this.current_match.start_now_sub <= 0){
//                 this.get_video_process_by_api();
//               }
//             }
//             this.current_match_id = this.match_list_by_no[0].mid;
//           }
//           this.match_list_loaded = Math.random();
//         });
//       }
//       else{
//         this.match_list_by_no = [];
//         this.current_match_id = "";
//         this.match_list_loaded = Math.random();
//       }
//       this.check_is_first_tab_delete();
//     },

//     /**
//      * 检查是否删除第一期
//      */
//     check_is_first_tab_delete(){
//       let check_is_reload_data = (totalTime,match) => {
//         if(totalTime){
//           totalTime = totalTime * 1;
//           let mgt = match.mgt * 1;
//           let future = mgt + totalTime * 1000;
//           let now_server = this.get_now_server();
//           if(future - now_server < 1000){
//             this.update_no_title_list();
//           }
//         }
//       };
//       //获取赛事视频总时长
//       let invok_video_process = (match) => {
//         let params = {
//           batchNo: match.batchNo,
//           tid: match.tid,
//         }
//         if(this.video_pro_maxtime && this.video_pro_maxtime[params.tid]){
//           let totalTime = this.video_pro_maxtime[params.tid];
//           check_is_reload_data(totalTime,match);
//           return;
//         }
//         api_common.get_Video_MaxTime(params).then(res => {
//           let res_data = null;
//           if (res.code == 200) {
//             res_data = _.get(res,'data');
//             let totalTime = res_data[params.tid];
//             if(totalTime){
//               if(!this.video_pro_maxtime){
//                 this.video_pro_maxtime = {};
//               }
//               this.video_pro_maxtime[params.tid] = totalTime;
//               check_is_reload_data(totalTime,match);
//             }
//           }
//           if(!res_data){
//             this.checking_first_delete_batchNo = '';
//           }
//         });
//       };

//       //检查第一批赛事是否结束
//       let check = () => {
//         let first_t_item = this.no_title_list[0];
//         if(first_t_item){
//           let first_m_item = first_t_item.match[0];
//           if(first_m_item){
//             let mgt = first_m_item.mgt * 1;
//             let time_ = this.get_now_server() - mgt;
//             if(time_ > -1){
//               this.checking_first_delete_batchNo = first_m_item.batchNo;
//               invok_video_process(first_m_item);
//             }
//           }
//         }
//         if(this.tab_league_i != 0){
//           clearTimeout(this.checking_first_delete_timer);
//           this.checking_first_delete_timer = setTimeout(() => {
//             check();
//           },4000);
//         }

//       };
//       check();
//     },
//     /**
//      * 移除结束的批更新tab联赛列表
//      */
//     update_no_title_list(){
//       let params = this.param_generate();
//       if(!params) return;
//       api_v_sports.get_virtual_sport_list(params).then(res => {
//         if(res.code == 200 && res.data && res.data.length){
//           let n_title_list = res.data.map(res_item => {
//             let {no,mmp,batchNo} = res_item;
//             this.virtual_match_list.push(res_item);
//             return {
//               no,
//               mmp,
//               batchNo,
//               match:res_item.matchs
//             };
//           });
//           let n_first = n_title_list[0];
//           let o_first = this.no_title_list[0];
//           if(n_first.batchNo != o_first.batchNo){
//             if(this.current_match.mmp == "INGAME"){
//               if(n_title_list.length == 1 && this.no_title_list.length > 1){
//                 let f_b_no = n_title_list[0].batchNo;
//                 let found_i = _.findIndex(this.no_title_list,{batchNo:f_b_no});
//                 if(found_i > -1){
//                   return;
//                 }
//               }
//             }
//             this.no_title_list = n_title_list;
//             if(this.tab_league_i == 0){
//               this.auto_change_tab_i_first = Math.random();
//             }
//           }
//         }
//       }).catch((e) => {
//         this.virtual_data_loading = false;
//       });
//     },
//     /**
//      * 获取赛事结果
//      * @param {String} mid_str 赛事id,多个逗号隔开
//      * @param {Function} callback 回调函数
//      */
//     get_match_result(mid_str,callback){
//       let params = {mids:mid_str};
//       api_v_sports.get_virtual_match_result(params).then(res => {
//         this.skeleton = false
//         if(res.code == 200){
//           let match_list = res.data;
//           if(match_list && match_list.length && this.virtual_match_list.length){
//             this.append_match_result(match_list,this.virtual_match_list);
//             this.append_match_result(match_list,this.match_list_by_no);

//             //赛事列表
//             let cache_dict = _.cloneDeep(this.get_prev_v_sports);
//             let p_key = `${this.sub_menu_type}-${this.current_league.menuId}`;
//             cache_dict[p_key] = _.cloneDeep(this.virtual_match_list);
//             this.set_prev_v_sports(cache_dict);
//             useMittEmit(MITT_TYPES.EMIT_MATCH_RESULT_DATA_LOADED,match_list);
//           }
//         }
//         callback()
//       }).catch((err)=>{
//         this.skeleton = false
//       })
//     },
//     /**
//      * 获取赛事结束时的比分
//      */
//     get_result_score(){
//       if(!this.current_batch.batchNo){
//         return
//       }

//       let dict_key = `${this.sub_menu_type}-${this.current_league.menuId}-${this.current_batch.batchNo}`;
//       if(!this.v_match_ended_score_dict[dict_key]){
//         this.v_match_ended_score_dict[dict_key] = {};
//         let mid_str = this.match_list_by_no.map(match => match.mid).join(',');
//         if(!mid_str) {
//           delete this.v_match_ended_score_dict[dict_key];
//           return;
//         }
//         this.get_score_basket_ball();
//         this.get_score_by_api();
//       }
//     },
//     /**
//      * 虚拟篮球获取比分
//      * @returns
//      */
//     get_score_basket_ball(){
//       if(this.current_match.mmp == "INGAME"){
//         this.match_list_by_no.forEach( m => {
//           if(!m.home){
//             m.home = m.homeScore;
//             m.away = m.awayScore;
//           }
//         });
//       }
//       // else if(this.current_match.mmp == "PREGAME"){
//       //   this.get_score_by_api();
//       // }
//     },
//     /**
//      * 获取比分接口
//      * @returns undefined
//      */
//     get_score_by_api(){
//       let mid_str = this.match_list_by_no.map(match => match.mid).join(',');
//       if(!mid_str) return;
//       api_v_sports.get_v_match_score_api({mids:mid_str}).then(res => {
//         if(res.code == 200){
//           let score_dict = res.data;
//           if(!res.data || !Object.keys(res.data).length){
//             let local_dict = this.get_basketball_score_store('v-football-score');
//             if(local_dict){
//               score_dict = local_dict;
//             }
//           }
//           this.match_list_by_no.forEach(m => {
//             if(m.batchNo == this.current_batch.batchNo){
//               if(score_dict[m.mid]){
//                 let s1 = score_dict[m.mid]['S1'];
//                 let s170 = score_dict[m.mid]['S170'];
//                 if(s1){
//                   m.home = s1.split(':')[0];
//                   m.away = s1.split(':')[1];
//                 }
//                 if(s170){
//                   m.s170_home = s170.split(':')[0];
//                   m.s170_away = s170.split(':')[1];
//                 }
//                 if(this.current_match.mid == m.mid){
//                   this.current_match.home = m.home;
//                   this.current_match.away = m.away;
//                   this.current_match.s170_home = m.s170_home;
//                   this.current_match.s170_away = m.s170_away;
//                 }
//               }
//             }
//           });
//           this.set_basketball_score_store(res.data,'v-football-score');
//         }
//       });
//     },
//     set_basketball_score_store(data,store_key='v-basketball-score'){
//       sessionStorage.setItem(store_key,JSON.stringify(data));
//     },
//     get_basketball_score_store(store_key='v-basketball-score'){
//       let r = null;
//       let socre = sessionStorage.getItem(store_key);
//       if(socre){
//         r = JSON.parse(socre);
//       }
//       return r;
//     },
//     /**
//      * 赛果停留20秒后请求下一批赛事
//      */
//     update_n_batch_handle(){

//     },
//     // 批量清除定时器
//     clear_mixin_timer() {
//       const timer_arr = [
//         'get_next_basketball_time',
//         'timer_v_1',
//         'timer_super5',
//         'checking_first_delete_timer',
//         'procee_again_timer',
//       ]

//       for (const timer of timer_arr) {
//         clearTimeout(this[timer])
//         this[timer] = null
//       }
//     }
//   },
//   watch:{
//     //开赛视频播放
//     get_video_process_data(){
//       this.get_match_video_process(this.current_match);
//     }
//   },
//   beforeDestroy(){
//     this.$root.$off(MITT_TYPES.EMIT_NO_VIRTUAL_MENU_DATA,this.no_virtual_menu_data);
//   },
//   destroyed () {
//     this.clear_mixin_timer();
//   },
// }

