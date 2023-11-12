/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: websocket数据页面数据接入 ---- 赛事详情
 */
import { WsSend } from "src/core/data-warehouse/ws/ws-ctr/ws-ctr.js";
import { mapGetters, mapActions } from "vuex";
import global_mixin from "src/core/global/mixin/global_mixin.js";
import betting from "src/public/mixins/betting/betting.js";
import {
  useMittOn,
  useMittEmit,
  MITT_TYPES,
} from "src/core/index.js";
export default {
  mixins: [global_mixin, betting],
  data() {
    return {
      // 菜单数据
      menu_data: $menu.menu_data,
      // 定时器集合
      timeout_obj: {} 
    }
  },
  created() {
    //赛事详情订阅
    useMittOn(MITT_TYPES.EMIT_MATCH_DETAIL_SUBSCRIBE,this.sendSocketInitCmd)
    //C8指令节流1秒
    this.SCMD_C8 = lodash.debounce(this.SCMD_C8,1000);
    //C112指令节流2秒
    this.SCMD_C112 = lodash.debounce(this.SCMD_C112,2000);
  },
  computed: {
    ...mapGetters({
      // 用户信息
      vx_get_user: "get_user",
      // socket状态
      socket_status: 'get_socket_status',
      // socket对象
      socket_data: 'get_socket_obj',
      // 串关是否正在处理
      get_is_handle: "get_is_handle", // 有使用不在文件
      // 当前页面
      vx_layout_cur_page: "get_layout_cur_page", 
      // 单关是否正在处理
      vx_get_is_single_handle: "get_is_single_handle",
      // 获取服务器时间和本地时间差
      vx_get_timestamp: "get_timestamp",
      // 当前菜单类型
      vx_cur_menu_type: "get_cur_menu_type",
      get_var_event_i18n: "get_var_event_i18n"
    }),
  },
  mounted() {  
    //发送启动命令
    this.sendSocketInitCmd();
    //ws存在
    if (window.ws) {
      // 注册当前页面的socket添加到消息队列  
      let socket_name = this.socket_name || "skt_data_info";    
      window.ws.addQueueViewObj(socket_name, this);
    }
    // 节流2s get_match_detail_throttle方法
    this.get_match_detail_throttle= this.throttle(this.get_match_detail_throttle, 2000, {leading:true, trailing:true});
  },
  methods: {
    ...mapActions({
      //保存详情右侧参数(mid: "", 赛事id tid: "", // 联赛 id	sportId: "", //球类id media_type: "auto", // 直播类型) 信息
      set_match_details_params: 'set_match_details_params'
    }),
    /**
     * 拉取详情接口
     */
    get_match_detail_throttle(){
      // 调用页面详情接口，并标识为ws调用
      this.get_match_detail(true);
    },
    /**
     * @description: 发送启动命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketInitCmd() {
      clearTimeout(this.timeout_obj['continue_send']);
      this.timeout_obj['continue_send'] = setTimeout(() => {
        // 订阅C8指令
        this.SCMD_C8(this.socket_name);
      }, 0);
    },
    /**
     * @description: 发送关闭命令
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    sendSocketCloseCmd() {
      // 发送赛状态订阅息命令C1
      WsSend.sktCancelSend(window.ws, "C8");
      // 重新订阅赛事详情
      this.$root.$emit(this.emit_cmd.EMIT_MATCH_LIST_SUBSCRIBE);
    },
    /**
     * C101 数据
     * `mid` 赛事Id
     * `ms` 赛事状态 0:未开赛 1:赛事进行中  2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
     * @description: 赛事状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C101(obj) {
      //console.log('-----------------赛事状态C101------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (obj && this.match_info_ctr.match_obj.mid != obj.cd.mid)) {
        return;
      }
      let skt_data = obj.cd;
       // 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断	110 即将开赛
      if([0, 1, 2, 7, 10, 110].includes(skt_data.ms)) {
        Object.assign(this.match_info_ctr.match_obj, {ms: skt_data.ms});        
      } else {
        Object.assign(this.match_info_ctr.match_obj, {ms: skt_data.ms});
        //this.match_details = [];
        // 赛事自动切换
        this.$root.$emit("autoset_match",skt_data.mid);
      }
      //设置赛事信息时间对象
      this.match_info_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
      // 同步投注项的状态
      let status = (skt_data.ms<3)? 0:2;
       // 当前赛事为电竞赛事
      if(this.is_esports) {
        // 更新电竞赛事投注项状态
        this.virtual_common.update_bet_item_status(this, {
          mid: skt_data.mid,
          status
        });
      } else {
        // 更新非电竞赛事投注项状态
        this.yabo_common.update_bet_item_status(this, {
          mid: skt_data.mid,
          status
        });
      }
    },
    /**     
     * C102 推送数据
     * `mid` 赛事Id
     * `mst` 比赛进行时间/比赛剩余时间
     * `cmec` 事件编码
     * `cmes` 事件状态 0:未取消 1:被取消
     * `mat` 发球方,主队发球 home，客队发球：away
     * `mmp` 
     * `mess` 开始结束状态 1:start 0:stop此字段只适用于特定事件编码）篮球暂停事件编码=time_start  现阶段只关注0、 1 其它值不必关注
     * `mct` 当前节/盘/局
     * `mbhn` 好球数（棒球专用）
     * `mbkn` 坏球数（棒球专用）
     * `mbcn` 出局数（棒球专用）
     * `mbolp` 一垒  0:未占用  1:已占用（棒球专用）
     * `mbtlp` 二垒 0:未占用  1:已占用（棒球专用）
     * `mbthlp` 三垒 0:未占用  1:已占用（棒球专用）
     * `mststs` 是否补时 0未开,1开
     * `mststi` 补时固定时间：比如补5分钟
     * @description: 赛事事件
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C102(obj) {
      //console.log('-----------------赛事事件C102------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || this.match_info_ctr.match_obj.mid != obj.cd.mid) {
        return;
      }
      let skt_data = obj.cd;
      // var 事件 skt_data.cmec !== 'goal 避免接口返回 goal 事件
      const var_item = lodash.find(this.get_var_event_i18n, (t) => t.nameCode === skt_data.cmec)
      var_item && skt_data.cmec !== 'goal' && this.$root.$emit(this.emit_cmd.EMIT_VAR_EVENT, { skt_data, var_item });

      if (this.match_info_ctr.match_obj) {
        //console.log('----------------------------------------match_infoData:' + JSON.stringify(this.match_infoData));
        //console.log('合并数据前' + JSON.stringify(this.match_infoData))
        Object.assign(this.match_info_ctr.match_obj, {...skt_data, handle_time: obj.ctsp});
        //设置赛事信息时间对象
        this.match_info_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
        // 如果是模拟发送C102且补时开关是打开的且为足球赛事则同步时间 
        if(this.match_info_ctr.match_obj.csid==1 && skt_data.mststs==1) {
          this.$root.$emit(this.emit_cmd.EMIT_INIT_FILL_TIME_CMD, skt_data.mid);
        }
        if(skt_data.mmp=="999") {
          // 赛事移除时右侧赛事自动切换
          this.$root.$emit("autoset_match",skt_data.mid);
        }
        //console.log('合并数据后' + JSON.stringify(this.match_infoData));
      }
      // 同步投注项的状态
      let status = (skt_data.mmp != "999")? 0:2;
      // 当前赛事为电竞赛事
      if(this.is_esports) {
        // 更新电竞赛事投注项状态
        this.virtual_common.update_bet_item_status(this, {
          mid: skt_data.mid,
          status
        });
      } else {
        // 更新非电竞赛事投注项状态
        this.yabo_common.update_bet_item_status(this, {
          mid: skt_data.mid,
          status
        });
      }
    },
    /**
     * C103 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `msc` 比分
     * @description: 赛事比分
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C103(obj) {
      //console.log('-----------skt_data_info------赛事比分C103------------obj:' + JSON.stringify(obj));
      // console.log('----------------------------------------match_infoData:' + JSON.stringify(this.match_infoData));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (obj && this.match_info_ctr.match_obj.mid != obj.cd.mid)) {
        return;
      }
      let skt_data = obj.cd;      
      let cur_match = this.match_info_ctr.match_obj;
      if (cur_match.msc && skt_data.msc.length) {        
        // console.log(`=============================合并数据前=========${JSON.stringify(cur_match.msc)}`);
        // 将socket推送的比分数组转换为对应,并与原有的赛事比分进行合并
        let score_obj = this.yabo_common.msc_array_obj(skt_data.msc);
        // 合并当前赛事比分对象
        Object.assign(cur_match,{msc: score_obj});
        // 棒球比分会出现推送和页面显示不符的问题，所以在 ws 这里也去推送一次
        if (skt_data.csid == 3) {
          this.$root.$emit('update_baseball_score', {'score_obj': score_obj, 'mmp': skt_data.mpid})
        }
        //设置赛事信息时间对象
        this.match_info_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
        
        // 本次需要更新的比分key值
        let skt_msc_keys = Object.keys(score_obj) || [];
        //  是否要继续更新， 更新的目标比分 32/34 对应S1001-S1006 231/233 对应S5001-S5006
        let is_continue = false, update_score_keys = [
          "S1001","S1002","S1003","S1004","S1005","S1006",
          "S5001","S5002","S5003","S5004","S5005","S5006",
          "S1","S2","S3","S5","S10102","308"
        ];
        if(skt_msc_keys.length > 0) {
          let len = update_score_keys.length;
          for(let i = 0;i < len; i++) {
            let score_key = update_score_keys[i]
            if(skt_msc_keys.includes(score_key)) {
              is_continue = true;
              break;
            }
          }
          if(!is_continue) return; 
          // 查找赛事详情玩法比分并合并最新比分
          this.match_info_ctr.list.forEach((item, index)=>{
            // 检查hps的格式
            let check_hps =  item.hps && item.hps.includes('|') && item.hps.includes(':');
            //S1005(15分钟进球(60:00-74:59)-独赢, 15分钟进球(60:00-74:59)-大小) S5005(15分钟角球(60:00-74:59)-独赢) S5006(15分钟角球(75:00-全场)-独赢)          
            // 足球一开赛且为滚球
            if (check_hps) {
              let score_type = item.hps.split('|')[0];
              if(
                update_score_keys.includes(score_type) && 
                score_obj[score_type]) {
                // 合并玩法上的比分
                Object.assign(this.match_info_ctr.list[index], {hps: `${score_type}|${score_obj[score_type].home}:${score_obj[score_type].away}`});
              }
            }
          });
        }                  
      }
    },
    /**     
     *  C104 推送数据
     * `mid` 赛事Id
     * `csid` 球种Id
     * `mhs` 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
     * `ms` 赛事状态  0:未开赛  1:滚球
     * @description: 赛事级盘口状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C104(obj) {
      // mid:赛事Id hs: 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）      
      //console.log('-----------------盘口状态C104------------obj:' + JSON.stringify(obj));
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (obj && this.mid != obj.cd.mid)) {
        return;
      }
      let skt_data = obj.cd;
      let cur_match = this.match_info_ctr.match_obj;
      // 赛事状态 0:active 开, 1:suspended 封, 2:deactivated 关
      if (skt_data.mhs == 0) {
        // 重新拉去页面接口
        this.init({mid:skt_data.mid, is_ws: true, cmd: 'C104'});
      } else if (skt_data.mhs == 1) { // 锁盘     
        // 封盘或者关盘时改变其状态
        this.match_info_ctr.set_match_mhs_status(skt_data.mhs);
        if(this.is_esports) {
          this.virtual_common.update_bet_item_status(this, {
            mid: skt_data.mid,
            status: skt_data.mhs
          });
        } else {
          this.yabo_common.update_bet_item_status(this,{
            mid: skt_data.mid,
            status: skt_data.mhs
          });
        }
        //设置赛事信息时间对象
        this.match_info_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp); 
        // 记录当前赛事更新的额时间 
        cur_match._upd = obj.ctsp;      
      } else if(skt_data.mhs == 11) {
        // 重新拉去页面接口
        this.init({mid:skt_data.mid, is_ws: true}) ;
      }
      else if (skt_data.mhs == 2) {
        let sport_id = skt_data.csid;
        // 拳击赛事即将开赛需要重新拉去接口
        if(sport_id==12 && cur_match.ms==110) {
          // 服务器时间
          let server_time = new Date().getTime() * 1 +(this.vx_get_timestamp.remote_time - this.vx_get_timestamp.local_time);
          // 赛事开始时间 
          let match_time = cur_match.mgt; 
          //收到即将开赛，赛事关盘时 判断开赛时间是否大于当前时间，如果大于当前时间（服务器时间） 则重新拉去新的一场赛事
          if(match_time <= server_time) {
            // 赛事自动切换
            this.$root.$emit("autoset_match",skt_data.mid);
          }
        } else {
          // 合并赛事级盘口状态
          this.match_info_ctr.set_match_mhs_status(skt_data.mhs);
          // 为电竞是更新投注项的状态
          if(this.is_esports) {
            this.virtual_common.update_bet_item_status(this, {
              mid: skt_data.mid,
              status: skt_data.mhs
            });
          } else {
            // 非电竞更新投注项状态
            this.yabo_common.update_bet_item_status(this, {
              mid: skt_data.mid,
              status: skt_data.mhs
            });
          }
          //设置赛事信息时间对象
          this.match_info_ctr.upd_time_obj.set_match_obj(skt_data.mid, skt_data, obj.ctsp);
          cur_match._upd = obj.ctsp;
        }
        clearTimeout(this.timeout_obj['RCMD_C104_'+skt_data.mid]);
        this.timeout_obj['RCMD_C104_'+skt_data.mid] = setTimeout(() => {
          this.close_all_handicap = true
          this.$root.$emit('set_match_detail_load_state',{mid:skt_data.mid, status:'empty'});
        });
      }   
    },
    /**
     * C105 推送数据
     * `hls` 盘口集合
     * `mid` 赛事Id
     * `hid` 盘口Id
     * `hpid` 玩法Id
     * `hs` 盘口状态 0:开盘 1:封盘 2:关盘 11:锁盘
     * `hn` 坑位 1:表示主盘，2:表示第一副盘，以此类推
     * `hps` 基准分S1|0:0  不存在基准分则不传输该字段
     * `hmt` 盘口类型 1:赛前盘 0:滚球盘
     * @description: 盘口赔率
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C105(obj) {   
      //数据不存在或者数据存在不是当前赛事   
      if (!obj || this.match_info_ctr.match_obj.mid != obj.cd.mid) {
        return;
      }
      if(_.isUndefined(obj.cd.mhs) && _.isNull(obj.cd.mhs)) {
        this.match_info_ctr.set_match_mhs_status(obj.cd.mhs);
      }
      let skt_data = obj.cd.hls;
      let obj1 = null;
      let hs = 0;   
      let ol = null;
      if(skt_data && skt_data.length) {
        // console.log('skt_data_info中的RCMD_C105',{ skt_data })
        for(let i=0;i<skt_data.length;i++) {          
          obj1 = skt_data[i];
          if(this.match_info_ctr.hl_obj && obj1) {
            if(obj1.hid && this.match_info_ctr.hl_obj[obj1.hid]) {              
              // 设置盘口状态 -- 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
              hs = obj1.hs ? obj1.hs : 0;
              // console.log(`==================>>>hid:${obj1.hid}=======>>>hs:${hs}`);
              this.match_info_ctr.set_match_hs_status(obj1.hid,hs);
              if(obj1.hmt!=null) {
                // 盘口类型合并0:滚球盘 1:赛前盘
                this.match_info_ctr.set_match_hmt(obj1.hid, obj1.hmt);
              }
              clearTimeout(this.timeout_obj['RCMD_C105_'+obj.cd.mid]);
              this.timeout_obj['RCMD_C105_'+obj.cd.mid] = setTimeout(() => {
                if (obj1.hs == 2) {
                  // 滚球自动转手动时，不发C104只发C105的处理处理玩法全部关闭
                  let is_empty = this.match_info_ctr.list.every(item => {
                    return _.isEmpty(_.get(item, 'hl')) || _.get(item, 'hl.0.hs') == 2;
                  });

                  if(is_empty){
                    this.close_all_handicap = true;
                    this.$root.$emit('set_match_detail_load_state',{mid:obj.cd.mid, status:'empty'});
                  }

                } else {
                  this.close_all_handicap = false
                }
              });
            }
            
            /***********************************详情列表玩法上的比分合并处理 start************************************************* */
            // socket推送的比分格式
            let check_score = obj1.hps && obj1.hps.includes('|') && obj1.hps.includes(':');
            //更新赛事详情的玩法(有比分的比分显示在括号内)
            if(check_score &&
              this.match_info_ctr && 
              this.match_info_ctr.list.length) {
              // 对推送的比分进行解析
              let score_info_arr = obj1.hps.split('|');
              if(score_info_arr.length==2) {
                // 获取比分类型如: S1
                let skt_score_type = score_info_arr[0];
                // 解析主客队比分
                let score_arr = score_info_arr[1].split(':');

                // 查找赛事详情玩法比分并合并最新比分
                this.match_info_ctr.list.forEach((item, index)=>{
                  // 检查hps的格式
                  let check_hps =  item.hps && item.hps.includes('|') && item.hps.includes(':');
                  // 足球一开赛且为滚球
                  if (check_hps) {
                    let score_type = item.hps.split('|')[0]; 
                    // 检查比分主队客队是否为空
                    check_score =  (score_arr instanceof Array) &&  score_arr.length==2 &&  score_arr[0]!='' && score_arr[1]!='';
                    let hid = _.get(item, 'hl[0].hid','');
                    if(
                      obj1.hid == hid &&
                      check_score && 
                      skt_score_type && 
                      skt_score_type == score_type) {
                      // 合并玩法上的比分
                      Object.assign(this.match_info_ctr.list[index], {hps: `${score_type}|${score_arr[0]}:${score_arr[1]}`});
                    }
                  }
                });
              }              
            }  
            /***********************************详情列表玩法上的比分合并处理 end************************************************* */          
          }  
          ol = obj1.ol;       
          if(ol && ol.length) {
            // console.log('合并投注项', { ol })
            let len = ol.length;
            for(let j=0; j<len; j++) {
              let obj2 = ol[j];
              if(obj2) {   
                //合并投注项数据      
                this.match_info_ctr.set_match_ol_data(obj2, obj1.hn);
              }
            }
          }
        }
      } 
      this.$root.$emit("check_plays_show", this.check_plays_show);
    },
    /**    
     *  C107 推送数据
     * `mvs` 动画状态 -1 没有配置动画源 ，
     *    0 ： 已配置，但是不可用     
     *    1： 已配置，可用，播放中   
     *    2：已配置，可用，播放中
     * `mms` 动画状态 -1 没有配置动画源 ，
     *    0 ： 已配置，但是不可用   
     *    1： 已配置，可用，播放中   
     *    2：已配置，可用，播放中
     *  *   lvs 直播状态  -1 无 2有
     *  *   lss 直播状态  -1 无 0 赛前 1滚球
     * @description: 赛事视频状态推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C107(obj) {
      //数据不存在或者数据存在不是当前赛事
      if (!obj || (obj && this.match_info_ctr.match_obj.mid != obj.cd.mid)) {
        return;
      }
      //console.log('-----------------赛事详情C107------------obj:' + JSON.stringify(obj));
      let skt_data = obj.cd;
      let cur_match = this.match_info_ctr.match_obj;
      if(_.isObject(skt_data)){
        let cur_obj = {}
         for (const key in skt_data) {
          if (skt_data[key] || skt_data[key] === 0 ) {
            cur_obj[key] =  skt_data[key]
          }
         }
         Object.assign(cur_match,cur_obj)
      }
    },
    /**
     * * 109 推送数据
     * `mid` 赛事Id
     * `hs` 盘口状态
     * `csid` 球种Id
     * `ms` 赛事状态 赛事状态 0:未开赛 1:滚球 110:即将开赛
     * @description: 赛事级开盘推送
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C109(obj) {
      //1.根据当前球种去匹配 2. 根据当前是否在滚球进行判断
      // 赛事从关盘到开盘发送C109
      let skt_data = obj.cd;
      let len = skt_data.length;
      for(let i = 0; i < len; i++) {
        let item = skt_data[i];
        if(!obj || 
          (item.mid!=this.match_info_ctr.match_obj.mid ) ||
          !['details','h_details'].includes(this.socket_name)) {  // 详情页面关盘后会重新拉最新赛事不执行C109
          continue;
        }
        // 即将开赛状态详情只需要和数据
        if(item.ms==110) {
          Object.assign(this.match_info_ctr.match_obj, {ms: item.ms});  
          //设置赛事信息时间对象
          this.match_info_ctr.upd_time_obj.set_match_obj(item.mid, item, obj.ctsp);
        }     
      }
      for(let j = 0; j < len; j++) {
        let item = skt_data[j];
        if(!obj || 
          (item.mid!=this.match_info_ctr.match_obj.mid ) ||
          !['details','h_details'].includes(this.socket_name)) {  // 详情页面关盘后会重新拉最新赛事不执行C109
          continue;
        }
        let type_name = this.vx_cur_menu_type.type_name || "";
        // 即将开赛状态详情只需要和数据
        if(item.ms==110) {
          continue;
        }     
        if(type_name=='play' && item.csid==this.sportId && item.ms==1) { // 现场滚球里面开赛+球种进行匹配
          // 重新拉去页面接口
          this.init({mid:item.mid, is_ws: true});  
          break; 
        } else if(['today','bet'].includes(type_name) && item.csid==this.sportId && (item.ms==0 || item.ms==1)) {  // 今日 球种进行匹配
          // 重新拉去页面接口
          this.init({mid:item.mid, is_ws: true}); 
          break;       
        } else if(type_name=='early' && item.ms==0 && (item.csid==this.sportId)) { // 早盘 未开赛+球种进行匹配
          // 重新拉去页面接口
          this.init({mid:item.mid, is_ws: true});    
          break;
        }else if(['hot_one', 'hot'].includes(type_name) || is_esports) { // 热门赛事菜单
          // 重新拉去页面接口
          this.init({mid:item.mid, is_ws: true});
          break;
        }
      }
    },
    /**
     * C112 推送数据
     * `mid` 赛事Id
     * `mcms` 状态2:开启，3：删除（与上游一致）
     * `mcid` 玩法id集合
     * @description: 玩法集变更
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C112(obj) {   
      //数据不存在
      if(!obj) return;
      let skt_data = obj.cd;
      // 玩法集中是否包含该玩法标志   
      let fag = false; 
      // 当详情玩法集数量大于0 与 推送的玩法集id大于0是进行查找     
      if(this.match_info_ctr.plays_menu_list.length > 0 && skt_data.mcid.length>0) {
        let len = skt_data.mcid.length;
        for(let i = 0; i < len; i++) {
          let id = skt_data.mcid[i];
          // 查找要变更的玩法集
          let find_index = _.findIndex(this.match_info_ctr.plays_menu_list, item => item.id==id);
          if(find_index>0) {
            fag = true;
            break;
          }
        }
      }
      if(skt_data.mid != this.match_info_ctr.match_obj.mid || 
        !skt_data.mcid ||
        !['details','h_details'].includes(this.socket_name)) {
        return;
      }     
      //mcms玩法集状态2:开启，3：删除（与上游一致） 玩法集中不包含该玩法,且该玩法要开启或者玩法集中包含该玩法,该玩法要删除.则进行接口拉取
      if((!fag && skt_data.mcms==2) || (fag && skt_data.mcms==3)) {
        this.get_category_list(() => {
          //玩法集返回非空数据再调取玩法列表
          if(_.get(this.match_info_ctr.plays_menu_list,"[0].id") !=undefined) {
            //删除 当前玩法集
            if(fag && skt_data.mcms==3 && skt_data.mcid.includes(this.mcid)) {
              this.mcid = 0;
              // 设置默认选中第一个玩法名称
              this.set_tabs_active_id("-1");
            }
            // 拉取玩法列表;
            this.get_match_detail_throttle(); 
          } else {
            // 玩法集为空是详情展示空的样式
            this.load_data_state="empty";
          }
        });
      }
    },
    /**
     * C3011 推送数据
     * `refreshAll` 是否全刷，true：全刷，false：不全刷
     * @description: 菜单栏顺序变更(专业版处理)
     * @param {*} obj
     * @return {*}
     */
    RCMD_C3011(obj) {
      let skt_data = obj.cd;
      // 是否刷新页面
      if(skt_data.refreshAll) {
        // console.log("skt data-----", RCMD_C3011)
        this.init({mid:this.mid,is_ws:true});
      }
    },
    /**    
     *  C302 推送数据
     * `mid` 赛事Id
     * `ms` 赛事状态：0未开赛 1开赛
     * `csid` 球种id
     * @description: 赛事开赛状态
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C302(obj) {
      if (!obj || this.match_info_ctr.match_obj.mid != obj.cd.mid) {
        return;
      }
      // 获取玩法集
      this.get_category_list(()=>{
        // 拉去投注项列表接口
        this.get_match_detail_throttle();
      });
    },
    /**     
     *  C303 推送数据
     * `mid` 赛事Id
     * `hid` 盘口id
     * `hpid` 玩法id
     * `hs` 盘口状态
     * @description: 赛事盘口新增(玩法)
     * @param {Object} obj socket推送的消息体
     * @return {undefined} undefined
     */
    RCMD_C303(obj) {
      //数据不存在或者数据存在不是当前赛事
      if (!obj || this.match_info_ctr.match_obj.mid != obj.cd.mid) {
        return;
      }
      // console.log('skt_data_info中的RCMD_C303被执行拉取接口', {mid: obj.cd.mid, socket_name: this.socket_name})   
      // 拉取赛事数据后同步投注项数据
      this.get_category_list(()=>{
        // 拉去投注项列表接口
        this.get_match_detail_throttle();
      });
    },
    /**
     * C801 推送数据
     * `mct` 当前节/盘/局
     * `mess` 1:start 0:stop
     * `mhs` 赛事级别盘口状态 0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态
     * `mid` 赛事Id
     * `mmp` 赛事阶段
     * `ms` 赛事状态
     * `mst` 比赛进行时间/比赛剩余时间
     * `msc` 比分数据
     * @description: 倒计时补充-C801
     * @param {Object} obj
     */
    RCMD_C801(obj) {
      //数据不存在
      if(!obj) {
        return;
      }
      let skt_data = obj.cd;
      // 记录ws推送的时间
      this.yabo_common.match_fill_time(this, skt_data, this.socket_name);
    },
    /**
     * @description: 赛事订阅(C1)
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    SCMD_C8(key='details') {
      //赛事id不存在
      if(!this.mid || this.mid==-1) return;
      let obj = {};
      obj.key = key;
      // 订阅的赛事模块
      obj.module = key;
      // 订阅的赛事盘口集合
      obj.list = [{mid: this.mid, hpid: "*", level:3}];
      // 标识是否为自定义模拟发送      
      obj.one_send = false;
      // cufm 详情用LM列表为L 
      obj.cufm = "LM";
      // 盘口级别，从userInfo接口获取后存在于vuex的get_user
      obj.marketLevel = _.get(this.vx_get_user, 'marketLevel', '0');
      //处理逻辑
      WsSend.sktSendMatchStatus(window.ws, obj);
    },
    /**
     *  C4推送数据
     * `copen` 1:打开 2:关闭
     * @description: 主动推送开关(C4)
     * @param {String} status 状态
     * @return {undefined} undefined
     */
    SCMD_C4(status) {
      let obj = {};
      if (status) {
        obj.copen = "1"; //1、打开 2、关闭
      } else {
        obj.copen = "2"; //1、打开 2、关闭
      }
      WsSend.sktSendInitiativePush(window.ws, obj);
    }
  },
  watch: {
    /**
     * @description: 监控socket状态
     * @param {String} status 状态
     * @return {undefined} undefined
     */
    socket_status: function (status) {
      // 监听sockect连接状态
      if (status) { //当sockect重新连接时自动发送消息
        if (status == 2) {
          this.init({is_ws:true});
        }
        this.sendSocketInitCmd();
        //console.log('22222222222222222222222222');
      }
    },
    /**
     * @description: 监控赛事id
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    mid() {
      //发送启动命令
      this.sendSocketInitCmd();
    },
    /**
     * @description: 监控当前页
     * @param {String} res 
     * @return {undefined} undefined
     */
    "vx_layout_cur_page.cur"(res) {
       if(res=="home") {
        //发送启动命令
        this.sendSocketInitCmd();
       }
    }
  },
  destroyed() {
    //取消定时器
    for (const key in this.timeout_obj) {
      clearTimeout(this.timeout_obj[key]);
    }
    this.timeout_obj = {};
    //节流清除
    this.debounce_throttle_cancel(this.SCMD_C8);
    this.debounce_throttle_cancel(this.SCMD_C112);
    this.debounce_throttle_cancel(this.get_match_detail_throttle);
    //console.log('关闭详情页面时=====取消订阅==========》');
    //发送关闭命令
    this.sendSocketCloseCmd();
    this.$root.$off(this.emit_cmd.EMIT_MATCH_DETAIL_SUBSCRIBE,this.sendSocketInitCmd);
    if (window.ws) {
      let socket_name = this.socket_name || "skt_data_info";
      window.ws.removeQueueViewObj(socket_name);
    }
  }
}