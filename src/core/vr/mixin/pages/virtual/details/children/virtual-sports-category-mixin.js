/*
 * @Author: Supermark
 * @Date: 2020-12-23 20:19:33
 * @Description: 虚拟体育玩法投注项区域
 */
// import tournament_play_new from "src/base-h5/components/details/components/tournament-play/tournament-play-new.vue"
 // 引入接口封装文件
import { api_common } from "src/api/index.js";
import axios_api_loop from "src/core/http/axios-loop.js"

 // 引入投注逻辑mixin
// import betting from "src/project/mixins/betting/betting.js";
 // 引入quasar
import { dom } from 'quasar'
 // 引入处理数据的封装方法
// import MatchInfoCtr from "src/base-h5/vr/utils/vsport/matchInfoCtr.js";
import VSport from 'src/core/vr/vr-sports/vsport.js';
import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import { debounce } from "lodash";
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import {MatchDataWarehouse_H5_Detail_Common, MatchDataWarehouse_PC_Detail_Common} from "src/output/index.js"
const MatchDataWarehouseInstance = window.BUILDIN_CONFIG.IS_PC ? MatchDataWarehouse_PC_Detail_Common:MatchDataWarehouse_H5_Detail_Common;
const { height, width, css} = dom

export default {
  // mixins:[betting],
  name: 'virtual_sports_category',
  data(){
    return {
      // 加载数据的效果
      is_loading: true,
      // 玩法集无数据
      is_no_data: true,
      // 单个玩法集下的玩法数量
      playlist_length:undefined,
      // 玩法集合投注底部兼容白块的处理PS-12302
      // dom_play_bool: false,
      // 所有数据集合
      // matchInfoCtr: new MatchInfoCtr(this),
      // dom_play元素的观察对象
      observer_:undefined,
      // 第一次进来根据数据是否折叠玩法
      first_load: false,
      // 赛事ID
      match_mid: 0,
      // 是否封盘
      is_lock_add: false,
      // 赛事状态变化监听计时器
      // match_setInterval:null,
      vsport:null,
      // 赛事总时长
      total_time:0,
      // 调用赛事总时长接口次数限制为10次
      count_num:0,
      // 赛事状态
      match_status:0,
      // 上次请求的虚拟体育赛马赛事id
      pre_params_mid:'',
      created_init_event:false,
      MatchDataWarehouseInstance
    }
  },

  props: {
    source:String,
    mid:String|Number,
    current_match:Object,
    // 顶部二级菜单切换状态
    top_menu_changed: {
      type: Boolean,
      default: false
    }
  },

  computed:{
    get_detail_data(){ return VR_CTR.state.detail_data },
    get_details_item(){ return VR_CTR.state.details_item  },
    get_first_details_item(){},
    get_goto_detail_matchid(){ VR_CTR.state.goto_detail_matchid },
    get_uid(){},
    get_details_tabs_list(){},
    get_fewer(){},
    get_list(){},
    get_current_mid(){ return VR_CTR.state.current_match_mid },
    get_current_league(){ return VR_CTR.state.current_league },
    get_is_user_refreshing(){},
    get_is_show_details_analyse(){},
    // 置顶列表
    match_list_new() {
      return MatchDataWarehouseInstance.listSortNew(this.current_match.mid);
    },
    // 非置顶列表
    match_list_normal() {
      return MatchDataWarehouseInstance.listSortNormal(this.current_match.mid);
    }
  },

  watch:{
    "get_current_league.menuId"(){
      this.initEvent();
    },
    // 监听current_match的状态
    match_status(new_){
      // match_status == 1 比赛开始时 拉取当前此赛事的视频总时长
      if(new_ == 1){
        this.get_video_Time()
      }
      // match_status == 2 比赛结束时 拉取当前赛事的赛果接口 显示赛果
      if(new_ == 2){
        this.get_match_result()
      }
    },
    // 虚拟体育切换玩法集id(赛事结束也可以切换玩法集ID)
    'get_details_item'(){
      if(this.created_init_event){
        this.created_init_event = false
        // return
      }
      // 当赛事结束时:切换玩法集调用赛事结果的接口
      if(this.match_status == 2){
        this.get_match_result()
      }else{
        // 当赛事等于赛前/开赛中的时候  调用玩法集的接口
        this.initEvent();
      }
    },
    '$route' (to, from) {
      this.initEvent();
      // 当切换玩法集的时候变为: true
      this.first_load = true;
    },
    current_match(){
      if(!this.created_init_event){
        this.initEvent();
      }
      this.created_init_event = false;
    },
    get_current_mid(){
      this.initEvent();
    },
    // 监听赛事id的变化 如果赛事id变化 及时更新调用玩法集合的接口
    get_goto_detail_matchid(new_){
      this.initEvent();
    },
    // 监听get_fewer的值
    get_fewer(n){
      if(n != 3){
        let list = this.get_list;
        if(Array.isArray(list) && list.length){
          for (const item of list) {
            item.hshow = n == 1 ? 'Yes':'No'
          }
        }
      }
    },
    // 返回赛事详情玩法列表数据
    get_list(){
      return  lodash.get(MatchDataWarehouseInstance.get_quick_mid_obj(this.mid),'odds_info',[]);
    }
  },

  created(){
    //函数防抖 在100毫秒内只触发最后一次需要执行的事件
    this.initEvent=lodash.debounce(this.initEvent.bind(this),100)
    //函数防抖 在150毫秒内只触发最后一次需要执行的事件
    this.socket_upd_list = debounce(this.socket_upd_list.bind(this), 200);
    // 延时器
    this.get_video_timer = null;
    // 满足刷新页面保持向上展开的状态
    this.set_fewer(1);
    if(this.$route.query.mid || this.mid || this.$route.name == 'virtual_sports'){
      this.init_vsport();
    }

    this.created_init_event = true;
    // 不做ms的判断 进入详情页即调玩法集接口  :因为现在ms的状态不统一
    // 虚拟体育赛事结束时调用赛事结果的接口  否则刷新调用玩法集的接口
    if((this.current_match && this.current_match.match_status == 2) || this.get_score_list().length){
      this.get_match_result()
    }
    // 1.顶部菜单切换及赛事期数切换时 过滤重复请求
    // 2.顶部按钮刷新触发
    else if (
        !this.top_menu_changed && this.get_first_details_item === this.get_details_item
        || this.get_is_user_refreshing
        || !this.get_is_show_details_analyse
    ) {
      this.initEvent(this.mid);
      // 刷新过后重置刷新状态
      this.set_is_user_refreshing(false)
    }

    // 重置顶部菜单切换状态
    this.$emit('top_menu_change', false)
    this.emitters = [
      useMittOn(MITT_TYPES.EMIT_REF_API, this.initEvent).off,
      useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, this.sendSocketInitCmd).off,
    ]
    

    // 调用接口的参数
    let params = {
      // 当前选中玩法项的id
      mcid: this.get_details_item,
      // 赛事id
      mid: this.get_goto_detail_matchid,
      // userId或者uuid
      cuid: this.get_uid,
      showType: '2'
    }
    this.cache_limiting_throttling_get_list(params, this.socket_upd_list, 'match_detail_odds_info')
  },
  mounted () {
  },
  methods: {
    set_fewer(){},
    set_is_user_refreshing(){},

    /**
     * 描述： 缓存、限频、节流  函数
     * params  接口参数
     * cb  调用接口的方法
     * url_key 去抖动，缓存的 key
     */
    cache_limiting_throttling_get_list (params, cb, url_key='menu_init'){
      let timer = null
      if(axios_debounce_cache && axios_debounce_cache[url_key] && axios_debounce_cache[url_key]['ENABLED']){
        let info = axios_debounce_cache[url_key].can_send_request(params)
        if(info.can_send){
          //直接发请求 单次数 请求的方法
          if(cb) {cb(params)}
        }else{
          // 记录timer
          if(timer) clearTimeout(timer)
          timer = setTimeout(() => {
            //直接发请求 单次数 请求的方法
            if(cb) {cb(params)}
            timer =null
          }, info.delay_time ||1000);
        }
      }else{
        //直接发请求 多次数  循环请求 的方法
        if(cb) {cb(params)}
      }
    },

    /**
     * 获取赛马最终结果
     */
    get_score_list(){
      let res = [];
      if(this.current_match && this.current_match.list && this.current_match.list.length){
        let last_win_obj = this.current_match.list[this.current_match.list.length - 1];
        if(last_win_obj){
          res.push(last_win_obj.ranking1);
          res.push(last_win_obj.ranking2);
          res.push(last_win_obj.ranking3);
        }
      }
      return res;
    },
    /**
     * @description: 初始化VSport
     */
    init_vsport(){
      if(this.vsport){
        this.vsport.destroy();
      }
      this.vsport = new VSport(this.current_match,(res)=>{
        if(res.match_status == 0){
          // console.warn(res.match_status,"----->>match_status",res.upd_time,"----->>upd_time");
          if(res.upd_time>=-10){
            if(!this.is_lock_add){
              this.set_all_match_os_status(2)
              // this.$forceUpdate();
            }
            this.is_lock_add = true;
          }
        } else if(res.match_status == 1){
          if(!this.is_lock_add){
            this.set_all_match_os_status(2)
            // this.$forceUpdate();
          }
          this.is_lock_add = true;
        } if(res.match_status == 2){
        }
        if(this.source=='virtual_sports_details')
        {
          // this.set_detail_data_assign((detail_data)=>{
          //   // this.$set(detail_data, 'match_status',res.match_status);
          //   detail_data.match_status = res.match_status;
          // });
          this.get_detail_data.match_status = res.match_status;
        } else{
          // this.$set(this.current_match, 'match_status',res.match_status);
          this.current_match.match_status = res.match_status
        }
        this.match_status = res.match_status;
        // console.log(this.current_match.totalTime+'---------this.current_match----------'+this.current_match.match_status)
      })
    },
    /**
     *@description: 获取当前赛事视频总时长
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    get_video_Time(){
      if(this.get_detail_data){
        let params = {
          tid: this.get_detail_data.tid,
          batchNo: this.get_detail_data.batchNo
        }
        api_common.get_Video_MaxTime(params).then(res => {
          let res_data = null;
          if (res.code == 200) {
            res_data = lodash.get(res,'data');
            let totalTime = res_data[params.tid]
            if(this.source=='virtual_sports_details')
            {
              // this.set_detail_data_assign((detail_data)=>{
              //   // this.$set(detail_data, 'totalTime',totalTime);
              //   detail_data.totalTime = totalTime
              // });
              this.get_detail_data.totalTime = totalTime
            } else{
              // this.$set(this.current_match, 'totalTime',totalTime);
              this.current_match.totalTime = totalTime;
            }
          }
          if(this.get_video_timer) { clearTimeout(this.get_video_timer) }
          this.get_video_timer = setTimeout(() => {
            if(!res_data && this.count_num < 10){
              this.count_num++
              this.get_video_Time()
            }
          },1000);
        }).catch(err => {
          console.error(err);
        });
      }
    },
    /**
     *@description: 虚拟体育title字段新增
     *@param {Object} 所有的玩法数据集合
     *@return {Object} 组合后的所有玩法数据集合
     */
    vir_add_title(temp){
      let res = [];
      if(temp){
        temp.forEach(item => {
          //虚拟体育不对这3个模板特殊处理
          if ([13,14,15].includes(item.hpt)) {
          } else if(item.title && item.hpid && (![0, 2, 4, 5, 7, 10, 11].includes(item.hpt))){
            let title = item.title;
            if(item.hl){
              item.hl.forEach(hl_item => {
                if(hl_item && hl_item.ol){
                  hl_item.ol.forEach((ol_item, i) => {
                    ol_item.otd = ol_item.otd?ol_item.otd:(100*i)+ol_item.otd;
                    title.push({osn:ol_item.on, otd:ol_item.otd});
                  });
                }
              });
            }
          }
        });
        temp = temp;
      }
      return temp;
    },
    /**
     * @description:  设置所有盘口状态(虚拟足球+赛马)
     * @param {Number} status 盘口状态
     */
    set_all_match_os_status(status, list_data){
      let list = MatchDataWarehouseInstance.get_quick_mid_obj(this.mid )?.odds_info
      if(list_data){
        list = list_data;
      }
      if(list && list.length){
        list.forEach(item => {
          if(item.title && item.hpid){
            if(item.hl){
              item.hl.forEach(hl_item => {
                if(hl_item && hl_item.ol){
                  hl_item.ol.forEach((ol_item, i) => {
                    ol_item.os = status;
                  });
                }
              });
            }
          } else if(item.plays&&item.plays.length){
            item.plays.forEach(plays_item => {
              if(plays_item.hpid){
                if(plays_item.hl){
                  plays_item.hl.forEach(hl_item => {
                    if(hl_item && hl_item.ol){
                      hl_item.ol.forEach((ol_item, i) => {
                        ol_item.os = status;
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    },
    change_show(val){
      if(Array.isArray(this.get_list) && this.get_list.length){

        let flag1 = this.get_list.every(item =>{
          return item.hshow == 'Yes'
        })

        let flag2 = this.get_list.every(item =>{
          return item.hshow == 'No'
        })

        if(flag1 || (val && val ==1)){
          this.set_fewer(1)
        }else{
          this.set_fewer(3)
        }

        if(val){
          if(flag2 && (val && val ==2)){
            this.set_fewer(2)
          }else{
            this.set_fewer(3)
          }
        }else{
          if(flag2){
            this.set_fewer(2)
          }else{
            this.set_fewer(3)
          }
        }

      }
    },
    check_data(data){
      var bool =  lodash.some(data,async(v,k)=>{
        if(v.hl.length >=80) return true;
      })
      return bool;
    },

    zhiding(){
      this.initEvent();
    },

    //列表子项增加自定义属性
    listItemAddCustomAttr(item){
      if(!item) {return;}
      // 附加盘收缩
      // playlist_length:单个玩法集下的玩法数量存在而且玩法数量小于11
      if(this.playlist_length && this.playlist_length < 11) item.hshow = 'Yes';
      if(this.get_fewer == 2 && this.playlist_length){
        item.hshow = 'No';
      }
      if(this.get_fewer == 1 && this.playlist_length && this.first_load){
        item.hshow = 'Yes';
      }
      if(item&&item.hl&&item.hl.length)
      {
        item.hl.forEach(item2 => {
          if(item2.hid){
            // this.matchInfoCtr.hl_obj[item2.hid]=item2;
            const hid = MatchDataWarehouseInstance.get_list_to_obj_key(this.mid,item2.hid,'hl');
            MatchDataWarehouseInstance.list_to_obj.hl_obj[hid]=item2;
          }
          if(item2&&item2.ol&&item2.ol.length){
            item2.ol.forEach(item3 => {
              // 押注项设置盘口状态
              Object.assign(item3,{
                hs:(item2.hs?item2.hs:0),
                ms:0,
                id_: item2.hn?`${item.mid}_${item.chpid || item.hpid}_${item3.ot}_${item2.hn}`:item3.oid,
                });
            });
          }
        });
      }
    },

    //列表子项恢复之前的自定义属性
    listItemRecoverCustomAttr(item_new, item_old){
      if(item_old.length && Array.isArray(item_old)){
        for (const item of item_old) {
          for (const item2 of item_new) {
            if(item.hpid == item2.hpid){  //根据玩法id判断是否合并数据
              let temp__ = {};
                temp__ = {hshow:item.hshow};
                //恢复数据
              Object.assign(item2, temp__);
            }
          }
        }
      }
    },

    initEvent(){
      if(this.match_status == 2) return
      this.is_loading = true;

      let mid
      if(this.$route.name == "virtual_sports"){
        mid = this.get_current_mid
      }else if(this.$route.name == "virtual_sports_details"){
        mid = this.$route.query.mid
      }
      this.mid && (mid = this.mid);

      this.match_mid = mid;
      let params = {
        mcid: this.get_details_item, // 玩法集id
        mid, // 赛事id
        cuid: this.get_uid, // userId或者uuid
      }
      if(!params.mid) {
        return;
      }
      this.pre_params_mid = params.mid;
      let cache_data_str = this.getdetail_cache_session(params);
      if(cache_data_str) {
        // this.is_loading = false;
        this.is_no_data = false;
      }
      this.socket_upd_list() //下面的方法和socket_upd_list一样 所以直接调用
      // 正常赛事调用: /v1/m/matchDetail/getMatchOddsInfoPB接口
      // 虚拟体育调用: /v1/m/matchDetail/getVirtualMatchOddsInfo接口
      // api_common.get_matchDetail_getVirtualMatchOddsInfo(params).then(res => {
      //   this.is_loading = false;
      //   if(!res.data || res.data.length == 0){
      //     this.is_no_data = true;
      //     this.matchInfoCtr.setList([]);
      //     this.set_detail_data_storage(params,'');
      //     return;
      //   }
      //   this.is_no_data = false;

      //   let temp = lodash.get(res, 'data');
      //   if(this.is_lock_add){
      //     this.set_all_match_os_status(2, temp);
      //   }
      //   // 赛马数据字段增加
      //   if(temp){
      //     this.vir_add_title(temp)
      //     MatchDataWarehouseInstance.set_match_details(this.current_match,temp);
      //   }

      //   try {  //getMatchOddsInfo 接口拉取时，联动更新投注框的数据
      //     //投注框初始状态或者锁盘时才跟新数据
      //     if(this.get_bet_status == 1 || this.get_bet_status ==7 || this.get_bet_status == 5){
      //       this.update_ol(null, temp)
      //     }
      //   } catch (error) {
      //     console.error(error)
      //   }
      //   this.set_detail_data_storage(params,temp);
      //   if(temp&&temp.length)
      //   {
      //     this.playlist_length = temp.length;
      //     temp.forEach(item => {
      //       // 附加盘收缩
      //       this.listItemAddCustomAttr(item)
      //     });
      //   }
      //   let list_ = lodash.cloneDeep(temp);
      //   this.matchInfoCtr.setList(list_);
      //   delete res.data;
      // })
    },
    /**
     *@description: 获取虚拟足球赛事的赛果
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    get_match_result(){
      this.is_loading = true;
      let params = {
        mid: this.$route.query.mid || this.mid,
        mcid: this.get_details_item,
        cuid: this.get_uid, // userId或者uuid
      }
      // 传值赛事id: mid
      axios_api_loop({
        axios_api:api_common.get_virtual_matchResult,
        params,
        error_codes: ["0401038"], //此状态码会重新循环执行一次
        fun_then:(res)=>{
          if(!res.data || res.data.length == 0){
            this.is_no_data = true;
            // this.matchInfoCtr.setList([]);
            MatchDataWarehouseInstance.set_match_details(this.current_match,[]);
            this.set_detail_data_storage(params,'');
            return;
          }
          this.is_no_data = false;
          let result_list = lodash.get(res, 'data');
          // 虚拟体育title字段增加
          this.vir_add_title(result_list)
          let result_ = lodash.cloneDeep(result_list);
          // this.matchInfoCtr.setList(result_);
          MatchDataWarehouseInstance.set_match_details(this.current_match,result_);
        },
        fun_finally:()=>{
          this.is_loading = false;
        }
      })
    },
    triggle_tabs_update(){
      useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
    },

    // 调用:/v1/m/matchDetail/getMatchOddsInfoPB接口
    socket_upd_list(skt_data,callback){
      let mid
      if(this.$route.name == "virtual_sports"){
        mid = this.get_current_mid || this.mid
      }else if(this.$route.name == "virtual_sports_details"){
        mid = this.$route.query.mid || this.mid
      }
      // 调用接口的参数
      let params = {
        // 当前选中玩法项的id
        mcid: this.get_details_item,
        // 赛事id
        mid: mid,
        // userId或者uuid
        cuid: this.get_uid,
        showType: '2'
      }
      // 获取缓存数据，将参数params传进去
      this.getdetail_cache_session(params);
      axios_api_loop({
        axios_api: window.BUILDIN_CONFIG.IS_PC ? api_common.get_matchDetail_getVirtualMatchOddsInfo_pc : api_common.get_matchDetail_getVirtualMatchOddsInfo,
        params,
        error_codes: ["0401038"], //此状态码会重新循环执行一次
        fun_then:(res)=>{
          this.is_loading = false;
          if(!res.data || res.data.length == 0){
            this.is_no_data = true;
            // this.matchInfoCtr.setList([]);
            MatchDataWarehouseInstance.set_match_details(this.current_match,[]);
            this.set_detail_data_storage(params,'');
            if(callback) callback();
            return;
          }
          this.is_no_data = false;
          var temp = lodash.get(res, 'data');
          this.set_detail_data_storage(params,temp);
          try {   //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
            if(this.get_bet_status == 1 || this.get_bet_status == 7 || this.get_bet_status == 5){
              this.update_ol(null, temp)
            }
          } catch (error) {
            console.error(error)
          }
          if(temp&&temp.length)
            {
              this.playlist_length = temp.length;
              temp.forEach(item => {
                // 附加盘收缩
                this.listItemAddCustomAttr(item)
              });
            }
          temp = this.save_hshow(temp); // 保存当前相关hshow状态;
          MatchDataWarehouseInstance.set_match_details(this.current_match,temp);
          // this.matchInfoCtr.setList(lodash.cloneDeep(temp))
          delete res.data;
          if(callback) callback();
        },
        // axios中catch回调方法
        fun_catch: (e) => {
          console.error(e);
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop:3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers:1100
      })
    },

    save_hshow(temp,list_old){

      let middle_data = null;
      if(list_old)
      {
        middle_data = lodash.cloneDeep(list_old);
      } else {
        middle_data = lodash.cloneDeep(this.get_list);
      }
      let middle_obj = {}
      lodash.forEach(middle_data, (item) =>{
        middle_obj[item.hpid+ '-' +item.hpn] = [{
          hshow: item.hshow
        }]
      })
      lodash.forEach(temp, item=>{
        if(middle_obj.hasOwnProperty(item.hpid+'-'+item.hpn)){
          Object.assign(item, middle_obj[item.hpid+ '-' +item.hpn][0]);
        }
      })
      return temp;
    },
    // 获取缓存数据
    getdetail_cache_session(params){
      // cach_key是存储在SessionStorage里面的单个玩法项
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      // 获取在SessionStorage里面的缓存
      let cach_string = sessionStorage.getItem(cach_key);
      // 如果玩法存在
      if(cach_string){
        // 解析JSON字符串
        let data = JSON.parse(cach_string);
        let none_data = '';
        if(data && data.length){
          // data是数组，其中每一项表示单个投注项
          this.playlist_length = data.length;
          data.forEach(item => {
            // 列表子项增加自定义属性
            this.listItemAddCustomAttr(item)
          });
        }
        let list_ = lodash.cloneDeep(data);
        if(this.is_lock_add){
          this.set_all_match_os_status(2, list_);
        }
        // this.matchInfoCtr.setList(list_);
        MatchDataWarehouseInstance.set_match_details(this.current_match,list_);
      }
      return cach_string;
    },

   //设置玩法缓存
    set_detail_data_storage(params,detail_data){
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      if(!detail_data){
        sessionStorage.removeItem(cach_key);
      }else{
        sessionStorage.setItem(cach_key,JSON.stringify(detail_data));
      }
    },

    //移除本地缓存
    remove_session_storage(){
      let params = {
        mcid: this.get_details_item, // 玩法集id
        mid: this.get_goto_detail_matchid, // 赛事id
        cuid: this.get_uid, // userId或者uuid
      }
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      sessionStorage.removeItem(cach_key);
    },

    //清除所有玩法缓存
    remove_detail_storage(){
      this.remove_session_storage();

      let mid = this.get_goto_detail_matchid, // 赛事id
        cuid = this.get_uid; // userId或者uuid

      this.get_details_tabs_list && this.get_details_tabs_list.forEach(tab => {
        let mcid = tab.id;
        let cach_key = `${mid}-${cuid}-${mcid}-cache`;
        sessionStorage.removeItem(cach_key);
      });

    },

  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(vm.get_details_item == -1){
        vm.$router.replace({name: 'details_unsettle', params:{id: vm.get_goto_detail_matchid}})
      }
    });
  },

  /**
   *@description: 销毁前:清除回调函数
   *@param {Undefined}
   *@return {Undefined} undefined
   */
  unmounted(){
    // 取消订阅事件
    // this.$root.$off(this.emit_cmd.EMIT_REF_API, this.initEvent);
    // this.$root.$off(this.emit_cmd.EMIT_CATEGORY_SKT, this.sendSocketInitCmd);
    this.emitters.map((x) => x());
    if(this.vsport){
      this.vsport.destroy();
    }

    clearTimeout(this.get_video_timer)
    this.get_video_timer = null
  }
}