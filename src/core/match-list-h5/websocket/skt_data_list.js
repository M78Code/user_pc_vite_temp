/*
 * @Description: websocket数据页面数据接入----赛事列表页面
 */
// 发送websocket命令时使用
import { WsSend } from "../websocket-class/wsCtr";   // ws通信接收消息类
import wsDebounce from "../../ws/h5/ws_debounce.js"    // ws调用接口节流工具类
import { ref, onMounted } from 'vue'
import lodash from 'lodash'
import { watch } from "fs"

// TODO: 待处理 store
// ...mapActions(['fetch_balance']),
// ...mapMutations([
//   // 角球开关盘标识
//   'set_corner_oc_change',
//   // 次要玩法数据更新
//   'set_c303_data_change',
//   // 次要玩法盘口状态变化
//   'set_c305_data_change',
// ]),
// ...mapGetters({
//   // websocket是否正常连接
//   socket_status: 'get_socket_status',
//   // 当用户未登录时返回uuid, 当用户登录时返回userId
//   cuid: "get_uid",
//   // 当前语言
//   lang: "get_lang",
//   // 当前选中的菜单
//   current_menu:'get_current_menu',
//   //当前是否投注项列表
//   get_bet_list: 'get_bet_list',
//   // 用户信息,用户金额,userId 需要监听变化
//   get_user:'get_user',
//   // 当前选中的二级菜单menu_type
//   get_curr_sub_menu_type:'get_curr_sub_menu_type',
// })

export default use_websocket_store = () => {

  const change_queue = ref([])
  // 订阅的赛事信息对象
  const matchIds = ref({})

  const ws_debounce = ref(null)
  const c302_timeout = ref(null)

  onMounted(() => {
    ws_debounce.value = new wsDebounce(this, this.get_match_info_upd)
    c302_timeout.value = 0

    if (window.ws) {
      let key = this.ws_invoke_key ? this.ws_invoke_key : 'skt_data_list';
      if (!this.ws_invoke_key) {
        this.ws_invoke_key = 'skt_data_list'
      }
      //增加消费对象
      window.ws.addQueueViewObj(key, this);
    }
  })

  watch(() => matchIds, (new_) => {
    if (new_) {
      this.SCMD_C8(1);
    }
  })

  watch(() => socket_status, (status) => {
    // 监听sockect连接状态 当sockect重新连接时自动发送消息
    if (status) {
      if (status == 2) {
        //#region 静默刷新赛事列表
        // let match_params = this.get_match_list_params();
        // this.get_match_data_list(match_params);
        if (this.window_focused_handle && typeof this.window_focused_handle == 'function') {
          this.window_focused_handle()
        }
        this.$root.$emit(this.emit_cmd.EMIT_RE_STATISTICS_MATCH_COUNT);

        // 如果为世界杯时的操作
        if (this.$route.name == 'wordcup') {
          // 静默更新数据
          this.$root.$emit(this.emit_cmd.EMIT_MENU_CHANGE_FOOTER_CMD, {
            text: "footer-refresh",
          });
        }
        //#endregion
        this.fetch_balance();
      }
      this.sendSocketInitCmd();
    }
  })

  /**
     * 是否为次要玩法
     * @param {String|Number} pid_s 多个逗号隔开
     * @returns
     */
  const is_secondary_oddway = (pid_s) => {
    let pid = pid_s.split(',')[0];
    let flag = false;
    let odd_list = [126, 128, 127, 129, 130, 332,
      333, 334, 335,
      135, 136,
      111, 113, 114, 119, 121, 122,
      310, 306, 307, 311, 308, 309
    ];
    flag = odd_list.includes(+pid);
    return flag;
  }
  /**
   * @description: 防抖处理拉取赛事所有列表数据
   * @param {Function} callback 请求回调函数
   * @param {String} call_source 调用来源
   */
  const get_match_all_list_throttle = lodash.throttle((callback, call_source, mid) => {
    this.get_match_list_req(callback, call_source, mid);
  }, (5 + parseInt((Math.random() * 1000) % 6)) * 1000, { leading: true, trailing: true })
  // 发送启动命令
  const sendSocketInitCmd = () => {
    this.$nextTick(() => {
      // 发送赛状态订阅息命令C1
      this.SCMD_C8(1);
      // 主动推送开关(C4)
      this.SCMD_C4(1);
      // 菜单订阅C5
      this.SCMD_C5(7);
    })
  }
  // 发送关闭命令
  const sendSocketCloseCmd = () => {
    // 发送赛状态订阅息命令C1
    this.SCMD_C8(0);
    // 主动推送开关(C4)
    this.SCMD_C4(0);
    // 菜单订阅C5
    this.SCMD_C5(0);
  }

  //赛事状态(C101)
  const RCMD_C101 = (obj) => {
    if (obj && this.matchCtr.match_list_data_sources) {
      let skt_data = obj.cd;
      for (let i = 0, len = this.matchCtr.match_list_data_sources.length; i < len; i++) {
        if (this.matchCtr.match_list_data_sources[i].mid == obj.cd.mid) {
          Object.assign(this.matchCtr.match_list_data_sources[i], { ms: skt_data.ms });
          break;
        }
      }
      if (this.matchCtr.mid_obj[obj.cd.mid]) {
        Object.assign(this.matchCtr.mid_obj[skt_data.mid], { ms: skt_data.ms });
      }
      //ms = 0未开赛,1进行中,2暂停,(其他赛事结束)
      if (this.match_status_changed) { //  &&
        if (!this.is_valid(skt_data.ms)) {
          skt_data.mmp = 999;
        }
        this.match_status_changed(skt_data);
      }
    }
  }
  /**
   * @description: 0未开始 1滚球阶段 2暂停 7延迟 10比赛中断 110即将开赛
   *               3结束 4关闭 5取消 6比赛放弃 8未知 9延期
   * @param {Number} ms 赛事状态
   * @return {Boolean}
   */
  const is_valid = (ms) => {
    return [0, 1, 2, 7, 10, 110].includes(+ms); //有效状态包括未开赛与进行中
  }
  /**
   * @description: 赛事事件(C102) 例如:发球方切换,赛事阶段mjd与mmp,事件更新等等
   * @param {Object} obj ws推送数据
   * @return {Undefined}
   */
  const RCMD_C102 = (obj) => {
    if (!obj) return;

    let skt_data = obj.cd;
    if (this.matchCtr.mid_obj[skt_data.mid]) {
      if (this.matchCtr.mid_obj[skt_data.mid] &&
        this.matchCtr.mid_obj[skt_data.mid].handle_time &&
        this.matchCtr.mid_obj[skt_data.mid].handle_time > obj.ctsp) {
        return;
      }

      if (typeof skt_data.mmp != 'undefined' && typeof skt_data.mmp != null) {
        skt_data.mmp = Number(skt_data.mmp);
      }
      //#region 参数说明
      // skt_data.mmp * 1;// mmp
      // skt_data.mst;    // 赛事时间
      // skt_data.mat;    // 发球方 home away
      // skt_data.mess;   // 篮球计时暂停/0 ; 开始/1 ;
      // skt_data.mbhn;   // 好球数
      // skt_data.mbkn;   // 坏球数
      // skt_data.mbcn;   // 出局数
      // skt_data.mbolp;  // 一垒  0、未占用  1、已占用
      // skt_data.mbtlp;  // 二垒  0、未占用  1、已占用
      // skt_data.mbthlp; // 三垒  0、未占用  1、已占用
      //#endregion
      if (skt_data.mess) {
        skt_data.mess = Number(skt_data.mess)
      }
      if (skt_data.mmp) {
        skt_data.mmp = String(skt_data.mmp);
      } else if (skt_data.mmp == 0) {
        skt_data.mmp = '0';
      }
      try {
        if (this.matchCtr.mid_obj[skt_data.mid]) {
          Object.assign(this.matchCtr.mid_obj[skt_data.mid], { ...skt_data, handle_time: obj.ctsp });
        }
      } catch (error) {
        console.error(error)
      }

      //更新赛事数据
      let found = null;
      for (let i = 0; i < this.matchCtr.match_list_data_sources.length; i++) {
        if (this.matchCtr.match_list_data_sources[i].mid == skt_data.mid) {
          found = this.matchCtr.match_list_data_sources[i];
          break;
        }
      }
      if (!found) return;
      Object.assign(found, { ...skt_data, handle_time: obj.ctsp });

      if (typeof skt_data.mess != 'undefined' && skt_data.mess != null) return;
      if (this.match_status_changed) this.match_status_changed(found);

      //足球去掉加时赛玩法
      let invalid_mmp = [33, 34, 41, 42, 50, 80, 90, 100, 110, 120].includes(skt_data.mmp * 1);
      if (invalid_mmp) {
        this.matchCtr.mid_obj[skt_data.mid].hpsOvertime = [];
      }

    }
  }
  /**
   *@description 用于冠军盘口开始/结束时间变更
   *@param {Object} obj ws推送数据
   *@return {Undefined} undefined
   */
  const RCMD_C120 = (obj) => {
    if (!obj) return;
    let skt_data = obj.cd;
    console.log(skt_data, 'c120')
    //...
  }
  // 将新比分合并到旧比分
  const combine_msc = (msc, new_msc) => {
    let source_dic = {}
    let new_dic = {}
    let combined = [];
    msc.forEach(m => {
      let code = m.split('|')[0];
      source_dic[code] = m;
    });
    new_msc.forEach(m => {
      let code = m.split('|')[0];
      new_dic[code] = m;
    });
    Object.assign(source_dic, new_dic);
    combined = Object.keys(source_dic).map(key => source_dic[key]);
    return combined;
  }
  // 赛事比分(C103)
  const RCMD_C103 = (obj) => {
    if (!obj) {
      return;
    }
    let skt_data = obj.cd;
    if (this.get_bet_list.length > 0 && obj) {
      //触发投注框比分跟新
      try {
        this.$store.commit('set_http_update', { mid: skt_data.mid, msc: skt_data.msc });    //跟新投注选项里的比分
      } catch (err) {
        console.error(err)
      }
    }
    if (!(obj.cd.mid in this.matchCtr.mid_obj)) {
      return;
    }
    // 新比分合并到旧比分
    let msc = this.matchCtr.mid_obj[skt_data.mid].msc;
    let combined = this.combine_msc(msc, skt_data.msc);
    // 比分编号排序
    this.msc_sort(combined);

    Object.assign(this.matchCtr.mid_obj[skt_data.mid], { msc: combined });
    let found = this.matchCtr.match_list_data_sources.filter(m => m.mid == skt_data.mid)[0];
    if (found) Object.assign(found, { msc: combined });
  }
  // 比分列表(S1,S121,S122等)从小到大排序
  const msc_sort = (msc) => {
    if (!msc) return;
    msc.sort((a, b) => {
      let r = 0;
      try {
        let numb_a = a.split('|')[0].split('S')[1] * 1;
        let numb_b = b.split('|')[0].split('S')[1] * 1;
        r = numb_a - numb_b;
      } catch (e) { console.error(e); }
      return r;
    });
  }
  // 赛事级别盘口状态(C104)
  const RCMD_C104 = (obj) => {
    if (!obj) return;
    if (!this.matchIds[String(obj.cd.mid)]) {
      return;
    }
    let skt_data = obj.cd;
    try {
      if (skt_data.mid && skt_data.mhs != undefined) {
        this.set_http_update({ mid: skt_data.mid, mhs: skt_data.mhs })   //更新投注框的状态
      }
    } catch (error) {
      console.error(error)
    }

    // 赛事状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
    // 开与锁
    if (skt_data.mhs == 0 || skt_data.mhs == 11) {
      this.matchCtr.setMatchMsStatus(skt_data.mid, skt_data.mhs);
      this.get_match_info_upd(skt_data.mid)
    }
    // 封
    else if (skt_data.mhs == 1) {
      this.matchCtr.setMatchMsStatus(skt_data.mid, skt_data.mhs)
    }
    // 关
    else if (skt_data.mhs == 2) {
      if (this.removeMatch) {
        this.removeMatch(() => {
          this.matchCtr.clearMidObj(skt_data.mid);
        });
      } else {
        this.matchCtr.clearMidObj(skt_data.mid);
      }
    } else if (skt_data.hs == 11 || skt_data.mhs == 11) {
      this.matchCtr.setMatchMsStatus(skt_data.mid, skt_data.mhs);
    }

    if (this.run_process_when_need_recompute_container_list_when_scroll) {
      this.run_process_when_need_recompute_container_list_when_scroll();
    }
  }
  // 赛事级别开盘非订阅
  const RCMD_C109 = (obj) => {
    if (!obj) return;
    let skt_data = obj.cd;
    if (_.isPlainObject(skt_data)) {
      skt_data = [obj.cd]
    }
    if (!skt_data || skt_data.length < 1) return;

    // 球类id 与 球类menu_type 对应关系
    const SPORT_TO_MENU_TYPE = {
      "1": "5", // 足球
      "2": "7", // 篮球
      "3": "19", // 棒球
      "4": "18", // 冰球
      "5": "13", // 网球
      "6": "20", // 美式足球
      "7": "14", // 斯诺克
      "8": "16", // 乒乓球
      "9": "17", // 排球
      "10": "15", // 羽毛球
      "11": "43", // 手球
      "12": "44", // 拳击
      "13": "45", // 沙滩排球
      "14": "22", // 橄榄球
      "15": "23", // 曲棍球
      "16": "24", // 水球
      "100": "3002", // 英雄联盟
      "101": "3001", // Dota2
      "102": "3004", // csgo
      "103": "3003", // 王者荣耀
    }
    if (this.menu_type == 28 || this.menu_type == 900) { return }  // 赛果和虚拟体育排除
    for (let i = 0; i < skt_data.length; i++) {
      const skt_data_item = skt_data[i]
      let flag = this.get_curr_sub_menu_type == SPORT_TO_MENU_TYPE[skt_data_item.csid] || this.get_curr_sub_menu_type == -1 || this.menu_type == 30 && skt_data_item.csid == 1;   // 滚球全部或者当球类id和菜单对的上的时候,或者竞足
      if (this.get_curr_sub_menu_type == -1 && [100, 101, 103].includes(+skt_data_item.csid)) { continue };  // 滚球全部时，电竞赛事排除
      if (!flag) { continue }

      if (skt_data_item.mid) {
        this.set_http_update({ mid: skt_data_item.mid, mhs: 0 })   //更新投注框的状态
      }

      if (this.menu_type) {
        if (this.menu_type == 1 && (skt_data_item.ms == 1 || skt_data_item.ms == 110)) { // 滚球
          this.get_match_all_list_throttle(null, null, skt_data_item.mid);
        }
        else if ((this.menu_type == 3)) { //今日
          this.get_match_all_list_throttle(null, null, skt_data_item.mid);
        }
        else if (this.menu_type == 4 && skt_data_item.ms == 0) {  // 早盘
          this.get_match_all_list_throttle(null, null, skt_data_item.mid);
        }
        else if (this.menu_type == 100 && skt_data_item.ms == 0) {  // 冠军
          this.get_match_all_list_throttle(null, null, skt_data_item.mid);
        } else if (this.menu_type == 3000) { //电竞
          this.get_match_all_list_throttle(null, null, skt_data_item.mid);
        }

      }
    }
  }
  // 滚球赛事开赛状态
  const RCMD_C302 = (obj) => {
    if (!obj || (!['home', 'matchList'].includes(this.$route.name))) return;
    let skt_data = obj.cd;

    clearTimeout(this.c302_timeout);
    //新开赛事后需要重新订阅C8
    this.c302_timeout = setTimeout(() => {
      this.$root.$emit(this.emit_cmd.EMIT_RE_STATISTICS_MATCH_COUNT);
      this.subscription && this.subscription()
    }, 500);

    // 获取数据
    this.get_match_all_list_throttle(null, 'ws', skt_data.mid);
    if (this.match_status_changed)
      this.match_status_changed(skt_data);

  }
  // 盘口状态(开关封)和赔率(C105)
  const RCMD_C105 = (obj) => {
    if (!obj || obj.route_ == 'category') return;
    let skt_data = obj.cd;
    if (skt_data.hls && skt_data.hls.length) {
      skt_data.hls.forEach(hl => {
        // 设置盘口状态 -- 盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
        this.matchCtr.setMatchHsStatus(hl.hid, (hl.hs ? hl.hs : 0), hl.ol);
      });
    }
    this.matchCtr.set_match_odd_list(skt_data);
    this.$root.$emit(this.emit_cmd.EMIT_C105_CMD_NOTICE, skt_data);
  }
  // 赛事视频/动画状态(C107)
  const RCMD_C107 = (obj) => {
    if (!obj || (!this.matchCtr.mid_obj[obj.cd.mid])) {
      return;
    }
    let skt_data = obj.cd;
    if (skt_data) {
      // mvs-	赛事动画状态   0:不可用 1:可用，暂未播放 2：可用，播放中
      // mms-  赛事视频动态   0:不可用 1:可用，暂未播放 2：可用，播放中
      Object.assign(this.matchCtr.mid_obj[skt_data.mid], skt_data);
    }
  }
  //移除联赛的赛事id,或为空联赛时移除联赛
  const remove_mid_of_league = (tid, mid) => {
    let remove_list = list => {
      let is_empty_i = -1; //联赛为空时,需要移除的联赛下标
      for (let i = 0; i < list.length; i++) {
        let match = list[i], s_i = i;
        if (match.tid == tid && match.mids) {
          let mid_list = match.mids.split(',');
          let i = mid_list.indexOf('' + mid);
          if (i > -1) {
            if (mid_list.length == 1) {
              is_empty_i = s_i;
            }
            mid_list.splice(i, 1);
            match.mids = mid_list.join(',');
          }
          break;
        }
      }
      if (is_empty_i > -1) {
        list.splice(is_empty_i, 1);
      }
    };
    remove_list(this.matchCtr.match_list_data_sources);
    remove_list(this.matchCtr.list);
    this.matchCtr.clearMidObj(mid);
  }
  //添加联赛里的赛事
  const add_mid_of_league = (tid, mid) => {
    let remove_list = (list) => {
      list.forEach(match => {
        if (match.tid == tid && match.mids) {
          let mid_list = match.mids.split(',');
          let i = mid_list.indexOf('' + mid);
          if (i < 0) {
            mid_list.push(mid);
            match.mids = mid_list.join(',');
          }
        }
      });
    };
    remove_list(this.matchCtr.match_list_data_sources);
    remove_list(this.matchCtr.list);
  }
  //联赛的赛事变化推送
  const RCMD_C901 = (obj) => {
    if (!obj) return;
    let skt_data = obj.cd;
    // 赛事状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
    if (skt_data.mhs == 0) {
      this.add_mid_of_league(skt_data.tid, skt_data.mid);
    } else if (skt_data.mhs == 2) {
      this.remove_mid_of_league(skt_data.tid, skt_data.mid);
    }
  }
  // 玩法数量
  const RCMD_C110 = (obj) => {
    if (!obj) return;
    let skt_data = obj.cd;
    if (skt_data) {
      let match = this.matchCtr.mid_obj[skt_data.mid];
      if (match) {
        Object.assign(this.matchCtr.mid_obj[skt_data.mid], skt_data);
      }

      for (let i = 0; i < this.matchCtr.list.length; i++) {
        if (this.matchCtr.list[i].mid == skt_data.mid) {
          Object.assign(this.matchCtr.list[i], skt_data);
        }
      }

      for (let i = 0; i < this.matchCtr.match_list_data_sources.length; i++) {
        if (this.matchCtr.match_list_data_sources[i].mid == skt_data.mid) {
          Object.assign(this.matchCtr.match_list_data_sources[i], skt_data);
        }
      }
    }
  }
  // 赛事盘口新增(玩法)(C303)
  const RCMD_C303 = (obj) => {
    if (obj.cd && obj.cd.mid && obj.cd.hpid) {
      if (this.is_secondary_oddway(obj.cd.hpid)) {
        this.set_c303_data_change(`${obj.cd.mid}-${obj.cd.hpid}-${Math.random()}`);
        // if(this.run_process_when_need_recompute_container_list_when_scroll){
        //   this.run_process_when_need_recompute_container_list_when_scroll(true,{update_type:'update-data'});
        // }
        return;
      }
    }
    this.RCMD_C304(obj)
  }
  /**
   * 足球角球与其他次要玩法显示与不显示
   * @param {Object} cd_data {
   *  displayOverTime 是否展示加时玩法 默认展示string	Y：展示；N：不展示
   *  displayPenaltyKick  ****点球玩法*********************************
   *  displayPenaltyCard  ****罚牌玩法*********************************
   *  displayPromotion  ****晋级玩法*********************************
   * }
   */
  const secondary_show_status = (cd_data) => {
    const { mid, displayCorner, displayOverTime, displayPenaltyKick, displayPenaltyCard, displayPromotion, display15Minute, displayBoldNess, display5Minute } = cd_data;
    // tabid map play 1角球 5罚牌 3晋级(冠军) 4加时 2点球大战
    let play_id = -1, status = '';
    if (displayCorner) {
      play_id = 1;
      status = displayCorner;
    }
    else if (displayOverTime) {
      play_id = 4;
      status = displayOverTime;
    }
    else if (displayPenaltyKick) {
      play_id = 2;
      status = displayPenaltyKick;
    }
    else if (displayPenaltyCard) {
      play_id = 5;
      status = displayPenaltyCard;
    }
    else if (displayPromotion) {
      play_id = 3;
      status = displayPromotion;
    }
    else if (display15Minute) {
      play_id = 17;
      status = display15Minute;
    }
    else if (displayBoldNess) {
      play_id = 18;
      status = displayBoldNess;
    }
    else if (display5Minute) {
      play_id = 19;
      status = display5Minute;
    }
    if (play_id != -1) {
      this.set_corner_oc_change(`${mid}-${status}-${play_id}-${Math.random()}`);
      if (this.run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj) {
        this.run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj();
      }
    }
  }
  /**
   * 足球非角球次要玩法显示与不显示
   * @param {Object} obj {
   *  cd:{
   *    displayOverTime 是否展示加时玩法 默认展示string	Y：展示；N：不展示
   *    displayPenaltyKick  ****点球玩法*********************************
   *    displayPenaltyCard  ****罚牌玩法*********************************
   *    displayPromotion  ****晋级玩法*********************************
   *  }
   * }
   */
  const RCMD_C114 = (obj) => {
    this.secondary_show_status(obj.cd);
  }
  //角球显示与不显示
  const RCMD_C113 = (obj) => {
    if (obj.cd && obj.cd.mid) {
      this.set_c305_data_change(`${obj.cd.mid}-${Math.random()}`);
      this.run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj();
    }
  }
  //次要玩法盘口状态变化
  const RCMD_C305 = (obj) => {
    if (obj.cd) {
      let data = obj.cd.mid;
      if (Array.isArray(obj.cd.newTab) && obj.cd.newTab.length) {
        data += '-' + obj.cd.newTab.join('-');
      }
      this.set_c305_data_change(`${data}-${Math.random()}`);
      this.run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj();
    }
  }
  //主副盘变更(C304)
  const RCMD_C304 = (obj) => {
    if (this.menu_type == 28) { //赛果
      return;
    }
    if (this.menu_type == 3000 && _.get(this.get_current_menu, 'date_menu.menuType') == 100) {
      this.RCMD_C109(obj)
      return;
    }
    // 未在赛事列表中的赛事直接返回
    let match = this.matchCtr.list.filter(match_t => match_t.mid == obj.cd.mid)[0];
    if (!obj) return;
    if (!match) return;
    let skt_data = obj.cd;
    this.ws_debounce.add_mid(skt_data)
  }

  //赛事状态 0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期  10、比赛中断    110  即将开赛
  //倒计时补充
  const RCMD_C801 = (obj) => {
    if (!obj) return;
    let skt_data = obj.cd;
    if (Array.isArray(skt_data) && skt_data.length) {
      for (let item of skt_data) {
        if (this.matchCtr.mid_obj[item.mid]) {
          Object.assign(this.matchCtr.mid_obj[item.mid], item);
        }
      }
    }
  }

  // 赛事是否支持提前结算
  const RCMD_C211 = (obj) => {
    let _mid = _.get(obj, 'cd.mid')
    let _mearlys = _.get(obj, 'cd.mearlys')
    if (!_mid) return;
    if (this.matchCtr.mid_obj[_mid]) {
      Object.assign(this.matchCtr.mid_obj[_mid], { mearlys: _mearlys });
    }
    for (let i = 0; i < this.matchCtr.list.length; i++) {
      if (this.matchCtr.list[i].mid == _mid) {
        Object.assign(this.matchCtr.list[i], { mearlys: _mearlys });
      }
    }
  }

  //订阅C9联赛推送
  const SCMD_C9 = (status, key = 'list') => {
    const obj = {};
    obj.key = key;
    obj.module = 'list';
    if (status) {
      let m_list = this.matchCtr.match_list_data_sources;
      if (!m_list) return;
      // 联赛Id，多个联赛Id用逗号分隔。联赛Id为空时取消订阅
      let tid_obj = _.keyBy(m_list, 'tid');
      obj.tid = Object.keys(tid_obj).join(",");
    }
    else {
      obj.tid = {};
    }
    WsSend.sktSendLeagueStatus(window.ws, obj);
  }
  //赛事订阅(C8)  status 1订阅赛事推送  0退订赛事推送
  const SCMD_C8 = (status, key = 'list') => {
    const obj = {};
    obj.key = key;
    obj.module = 'list';
    if (status) {
      if (!this.matchCtr) {
        return;
      }
      let m_list = this.matchCtr.match_list_data_sources;
      if (!m_list) {
        return;
      }
      // 列表转对象
      let match_list_obj = _.keyBy(m_list, 'mid');
      //冠军玩法特殊对应
      let flag = this.get_menu_type || this.menu_type;
      if (match_list_obj && this.matchIds) {
        for (const match_id in this.matchIds) {
          let item = match_list_obj[match_id];
          if (item && item.hps && item.hps.length) {
            item.hps.forEach(item2 => {
              if (this.matchIds[match_id]) {
                if (flag == 100 && match_id.length > 10) {
                  this.matchIds[match_id].hpids.push('*');
                } else {
                  this.matchIds[match_id].hpids.push(item2.hpid);
                }
                this.matchIds[match_id].hpids = _.uniq(this.matchIds[match_id].hpids);
              }
            });
          }
        }
      }

      // 赛事Id，多个赛事Id用逗号分隔。赛事Id为空时取消订阅
      obj.mid = this.matchIds;
    }
    else {
      obj.mid = {};
    }
    if (!Object.keys(obj.mid).length) return;
    WsSend.sktSendMatchStatus(window.ws, obj);
  }
  /**
   * 订阅指定玩法赛事(C8)  status 1订阅赛事推送  0退订赛事推送
   * @param {Number} status 1,0
   * @param {String} key 模块名
   * @param {String} paly_key 指定的hps key
   * @returns
   */
  const SCMD_SPECIAL_C8 = (status, key = 'list', paly_key, match) => {
    const obj = {};
    obj.key = key;
    obj.module = 'list';
    if (status) {
      let match_id = match.mid;
      let match_ids = {};
      if (match && match[paly_key] && match[paly_key].length) {
        match_ids[match_id] = {
          hpids: [],
        };
        match[paly_key].forEach(item2 => {
          if (match_ids[match_id]) {
            match_ids[match_id].hpids.push(item2.hpid);
            match_ids[match_id].hpids = _.uniq(match_ids[match_id].hpids);
          }
        });
      }

      // 赛事Id，多个赛事Id用逗号分隔。赛事Id为空时取消订阅
      obj.mid = match_ids;
    }
    else {
      obj.mid = {};
    }
    WsSend.sktSendMatchStatus(window.ws, obj);
  }
  //主动推送开关(C4)
  const SCMD_C4 = (status) => {
    let obj = {};
    if (status) {
      obj.copen = "1"; //1、打开 2、关闭
    } else {
      obj.copen = "2"; //1、打开 2、关闭
    }
    WsSend.sktSendInitiativePush(window.ws, obj);
  }
  const SCMD_C5 = (cdt) => {
    // 发送菜单订阅
    let obj = {};
    // 设备类型 1-移动版188（欧洲版） 3-移动端panda（亚洲版）   4-PC端（专业版） 5-PC端（新手版）  0-取消订阅
    obj.cdt = cdt ? cdt : 0;
    // 发送菜单订阅
    WsSend.sktSendMenuCount(window.ws, obj);
  }

  onUnmounted(() => {
    clearTimeout(this.c302_timeout);
    this.c302_timeout = null;

    this.ws_debounce.clear_timer();

    this.debounce_throttle_cancel(this.get_match_all_list_throttle);
    if (window.ws) {
      window.ws.removeQueueViewObj(this.ws_invoke_key);
    }
    this.sendSocketCloseCmd();
  })
}
