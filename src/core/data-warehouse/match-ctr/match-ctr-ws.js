/**
 * @Author: hanmar
 * @Date: 2023-08-20 12:45:19
 * @Description: h5/pc数据仓库ws数据实时数据同步
 * 
 */
import UserCtr from "src/core/user-config/user-ctr.js";
import WsMan from "src/core/data-warehouse/ws/ws-ctr/ws-man.js";
import {  useMittEmit, MITT_TYPES } from  "src/core/mitt"
export default class MatchDataBaseWS
{
  /**
   * @description: 构造函数
   * @param {Object} 数据仓库管理对象
   * @return
   */
  constructor(match_ctr)
  {
    // MatchDataBase类实例对象(用于数据同步)
    this.match_ctr = match_ctr;

    // 初始化数据
    this.init();
    // 启动ws数据同步
    this.run();
    // 延时器
    this.ws_timer = 0;
  }


  /**
   * @description: 数据初始化
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  init(){
  }

  /**
   * @description: 开始运行主流程
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  run(){
  	if(this.message_fun){
  		// 移除之前的ws消息监听
    	window.removeEventListener("message",this.message_fun);
  	}
    // 设置动态监听方法(多实例使用)
    this.message_fun=(obj)=>{
      this.r_ws_msg(obj);
    }
    // 增加ws消息监听
    window.addEventListener("message",this.message_fun);
  }

  /**
   * @description: ws消息监听
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  r_ws_msg(obj){
    // 获取window.postMessage自定义命令
    const cmd = lodash.get(obj, 'data.cmd');
    if(cmd == 'WS_STATUS_CHANGE_EVENT'){ // ws链接状态变化 (0-断开,1-连接,2-断网续连状态)
      let ws_status = lodash.get(obj.data.data,'ws_status');
      // ws重新链接后,发送赛事订阅命令(后期扩展使用)
      if(ws_status){
        clearTimeout(this.ws_timer);
        this.ws_timer= setTimeout((ws_status) => {
          this.scmd_c8();
        }, 1500);
      }
    } else if(cmd == 'WS_MSG_REV'){
      // 是ws推送过来的消息
      // 获取消息数据体
      const data = lodash.get(obj, 'data.data');
      if(data){
        // ws推送消息分流
        const ws_cmd = lodash.get(data,'cmd')
        switch (ws_cmd) {
          case 'C101':
            this.C101(data);
            break;
          case 'C102':
            this.C102(data);
            break;
          case 'C103':
            this.C103(data);
            break;
          case 'C104':
            this.C104(data);
            break;
          case 'C105':
            this.C105(data);
            break;
          case 'C106':
            this.C106(data);
            break;
          case 'C107':
            this.C107(data);
            break;
          case 'C110':
            this.C110(data);
            break;
          case 'C120':
            this.C120(data);
            break;
          case 'C302':
            this.C302(data);
            break;
          case 'C303':
            this.C303(data);
            break;
          case 'C304':
            this.C304(data);
            break;
          case 'C801':
            this.C801(data);
            break;
          case 'C901':
            this.C901(data);
            break;
          default:
            break;
        }
      }
    }
  }

  /**
   * @description: WS命令C101逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C101(ws_obj){
    // >>>>C101 赛事状态
    // {
    //     "cd": {
    //         "mid": "639633",
    //         "ms": 3
    //     },
    //     "cmd": "C101",
    //     "ctsp": "1580714665510"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
      }
    }
  }
  
  /**
   * @description: WS命令C102逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C102(ws_obj){
    // >>>>C102 赛事事件
    // {
    //   "cd": {
    //     "mid": "300686",
    //     "csid": 1,
    //     "mst": 210,
    //     "cmec": "snooker_foul",
    //     "cmes": 0,
    //     "mat": "home",
    //     "mmp": "2",
    //     "mess": 1,
    //     "mct": "0",
    //     "mbhn": "1",
    //     "mbkn": "3",
    //     "mbcn": "1",
    //     "mbolp": "0",
    //     "mbtlp": "0",
    //     "mbthlp": "1",
    //     "mststs": "0",
    //     "mststi": 10      
    //   },
    //   "cmd": "C102",
    //   "ctsp": "1580714525704"
    // }

    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      let skt_data = ws_obj.cd;
      // var 事件 skt_data.cmec !== 'goal 避免接口返回 goal 事件
      // 设置赛事比分更新时间
      this.match_ctr.ws_match_key_upd_time_cache_set(match,'msc', ctsp);
      const var_item = lodash.find(UserCtr.get_var_event_i18n(), (t) => t.nameCode === skt_data.cmec)
      var_item && skt_data.cmec !== 'goal' && useMittEmit(MITT_TYPES.EMIT_VAR_EVENT, { skt_data, var_item });
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
      }
    }
  }

  
  /**
   * @description: WS命令C103逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C103(ws_obj){
    // C103赛事比分
    // {
    //   "cd": {
    //       "csid": 1,
    //       "mid": "2017671",
    //       "msc": [
    //           "S1|3:3",
    // 		       "S5|3:5",
    //           "S108|11:8",
    //           "S110|8:10",
    //           "S10903|5:3",
    //           "S19|29:20",
    //           "S11|2:4",
    //           "S12|1:3"
    //       ]
    //   },
    //   "cmd": "C103",
    //   "ctsp": "1580718972981"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, { ...cd_obj, is_ws: true });        
        // 格式化列表赛事(部分数组转对象)
        this.match_ctr.list_serialized_match_obj([match],true);
        // 设置赛事比分更新时间
        this.match_ctr.ws_match_key_upd_time_cache_set(match,'msc', ctsp);
      }
    }
  }



  /**
   * @description: WS命令C104逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C104(ws_obj){
    // C104赛事级别盘口状态
    // {
    //   "cd": {
    //       "csid": "1",
    //       "mhs": 1,
    //       "mid": "2675977",
    //       "ms": "0"
    //    },
    //    "cmd": "C104",
    //    "ctsp": "1592025235582",
    //     "ld": "46605e17908a4976bd16dff59073cfbd_trade"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status({mid:cd_obj.mid,mhs:cd_obj.mhs});
      }
    }
  }

  /**
   * @description: WS命令C105逻辑处理
   * @param {WS.DataWrap<TYPES.WS.C105>} ws_obj ws数据
   */
  C105(ws_obj){
    // C105盘口/投注项
    // {
    //   "cd" : {
    //     "hls" : [
    //       {
    //         "hid" : "143285122423241435",
    //         "hmt" : 0,
    //         "hn" : 3,
    //         "hpid" : "19",
    //         "hs" : 3,
    //         "mid" : "2675977",
    //         "ol" : [
    //           {
    //             "obv" : "992000",
    //             "oid" : "140826445322411492",
    //             "os" : 2,
    //             "ot" : "1",
    //             "ov" : "992000"
    //           },
    //           {
    //             "obv" : "8188000",
    //             "oid" : "146362155350552524",
    //             "os" : 2,
    //             "ot" : "2",
    //             "ov" : "888000"
    //           }
    //         ],
    //         "t" : "1692362283330"
    //       }
    //     ],
    //     "ld" : "BE_0af40eb520230818203803628fac7813_0_15",
    //     "marketLevel" : "15",
    //     "mid" : "2675977",
    //     "time" : "1692362283330"
    //   },
    //   "cmd" : "C105",
    //   "ctsp" : "1692362283954",
    //   "ld" : "BE_0af40eb520230818203803628fac7813_0_15"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        let hls= lodash.get(cd_obj,'hls');
        if(hls){
          hls.forEach(hl_obj => {
            let ol = lodash.get(hl_obj,'ol');
            // 拼接快速查找对象所需的id
            const hid_str = this.match_ctr.get_list_to_obj_key(mid,hl_obj.hid,'hl');
            // 获取指定的盘口对象
            const quick_hl_obj = this.match_ctr.list_to_obj.hl_obj[hid_str];
            ol && ol.forEach(ol_obj => {
              if(ol_obj){
                // 拼接快速查找对象所需的id
                const oid_str = this.match_ctr.get_list_to_obj_key(mid,ol_obj.oid,'ol');
                // 获取指定的投注项对象
                const quick_ol_obj = this.match_ctr.list_to_obj.ol_obj[oid_str];
                // 处理ot是小数的情况,进行数据修正
                let ot = '';
                if(ol_obj.ot && ol_obj.ot.includes('.')) {
                  ot = ol_obj.ot.replace('.','-');
                } else {
                  ot = ol_obj.ot;
                }
                let chpid = hl_obj.chpid || hl_obj.hpid || '';
                // 设置坑位信息
                const _hn = hl_obj.hn?`${mid}_${chpid}_${hl_obj.hn}_${ot}`:'';
                // 更新投注项附加参数
                Object.assign(ol_obj, {_hn:_hn, _hs:hl_obj.hs});

                // 合并投注项数据信息
                quick_ol_obj && Object.assign(quick_ol_obj, ol_obj);
                // 更新坑位信息
                this.match_ctr.list_to_obj.hn_obj[this.match_ctr.get_list_to_obj_key(mid,_hn,'hn')] = quick_ol_obj;
              }
            });
            // 合并投注项数据信息
            // this.match_ctr.assign_with(quick_hl_obj, hl_obj);
            if(quick_hl_obj && lodash.get(hl_obj,'hs') !== undefined){
              quick_hl_obj.hs = lodash.get(hl_obj,'hs');
              quick_hl_obj.hps = lodash.get(hl_obj,'hps');
            }
          });
        }
        this.match_ctr.match_upd_time_ret_change(match)
      }
    }
  }

  /**
   * @description: WS命令C106逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C106(ws_obj = {}){
    this.C105(ws_obj);
  }

  /**
   * @description: WS命令C107逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C107(ws_obj){
    // C107视频/动画状态推送
    // {
    //     "cd": {
    //         "mid": "1011519",
    //         "mvs": "-1",
    //         "mms": 1,
    //         "vdo": [{
    //             "sid": "",
    //             "sms": "",    
    //             "sts": ""
    //       }]
    //     },
    //     "cmd": "C107",
    //     "ctsp": "1580546093482"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
        this.match_ctr.match_upd_time_ret_change(match);

        this.match_ctr.upd_data_version();
      }
    }
  }


  /**
   * @description: WS命令C110逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C110(ws_obj){
    // C110玩法数量
    // {
    //     "cd": { 
    //         "mc": 25,
    //         "mid": "1011519"
    //     },
    //     "cmd": "C110",
    //     "ctsp": "1580546093482"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
      }
    }
  }



  /**
   * @description: WS命令C120逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C120(ws_obj){
    // C120盘口结束时间(针对冠军赛事)
    // {
    //     "cd": {
    //         "mid": "77821687983308802",
    //         "hid": "144025105247958058",
    //         "hmgt": "1628879400000",
    //         "hmed": "1652535000000"
    //     },
    //     "cmd": "C120",
    //     "ctsp": "1614050093866",
    //     "ld": "c0e02d578dcb4a079e2dcb9652ae9640-1629029377566"
    // }

    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
        this.match_ctr.match_upd_time_ret_change(match);
      }
    }
  }

  
  /**
   * @description: WS命令C302逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C302(ws_obj){
    // C302滚球新赛事通知
    // {
    //     "cd": {        
    //         "mid": "288934",
    //         "ms":  1,
    //     "csid": 1
    //     },
    //     "cmd": "C302",
    //     "ctsp": "1580718972981"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
      }
    }
  }


  /**
   * @description: WS命令C303逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C303(ws_obj){
    // C303滚球新赛事通知
    // {
    //     "cd": {
    //         "hid": "143285122423241435",
    //         "hpid": "19",
    //         "hs": 0,
    //         "mid": "2675977"
    //     },
    //     "cmd": "C303",
    //     "ctsp": "1580726140231"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        // this.match_ctr.assign_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status({mid:mid, hid:cd_obj.hid, hs:cd_obj.hs});
      }
    }
  }


  /**
   * @description: WS命令C304逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C304(ws_obj){
    // C304主副盘变更
    // {
    //     "cd": {
    //         "hpid": "2",
    //         "mid": "455991",
    //     "csid": "1"
    //     },
    //     "cmd": "C304",
    //     "ctsp": "1580726140231"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        // this.match_ctr.assign_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        // this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
  }

  /**
   * @description: WS命令C801逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C801(ws_obj){
    // C801倒计时补充
    // {
    //     "cd": [{
    //             "mct": "0",
    //             "mess": "1",
    //             "mhs": 0,
    //             "mid": "594472",
    //             "mmp": "0",
    //             "ms": "0",
    //             "mst": 0
    //         }, {
    //             "mct": "0",
    //             "mess": "1",
    //             "mhs": 1,
    //             "mid": "615509",
    //             "mmp": "31",
    //             "ms": "1",
    //             "msc": ["S1|2:0", "S2|2:0", "S3|0:0", "S5|2:2", "S8|32:20", "S10|1:0", "S11|0:0", "S12|2:0", "S15|2:2", "S16|0:0", "S17|3:1", "S18|0:2", "S104|59:44", "S105|49:51", "S555|2:2"],
    //             "mst": 2700
    //         }, {
    //             "mct": "0",
    //             "mess": "1",
    //             "mhs": 1,
    //             "mid": "619665",
    //             "mmp": "6",
    //             "ms": "1",
    //             "msc": ["S1|0:0", "S2|0:0", "S5|0:0", "S8|0:2", "S11|0:0", "S12|0:0", "S15|0:0", "S104|3:2", "S105|60:40", "S555|0:0"],
    //             "mst": 26
    //         }
    //     ],
    //     "cmd": "C801",
    //     "ctsp": "1610593030384"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');

      cd_obj.forEach(item => {
        // 赛事标识
        let mid = lodash.get(item,'mid');
        // 获取快速查询对象中的mid赛事对象
        let match = this.match_ctr.get_quick_mid_obj(mid);
        if(match){
          // 数据同步逻辑
          this.match_ctr.assign_with(match, cd_obj);
          // 格式化列表赛事(部分数组转对象)
          this.match_ctr.list_serialized_match_obj([match]);
          // 同步更新快速查询对象中的赛事状态
          this.match_ctr.upd_match_all_status({mid:mid, mhs:cd_obj.mhs});
          this.match_ctr.match_upd_time_ret_change(match);
        }
      });
    }
  }


  /**
   * @description: WS命令C901逻辑处理
   * @param {WS.DataWrap} ws_obj ws数据
   */
  C901(ws_obj){
    // C901关盘补充
    // {
    //     "cd": {
    //         "csid": "1",
    //         "mhs": 2,
    //         "mid": "2289274",
    //         "ms": "0",
    //         "tid": "821456"
    //     },
    //     "cmd": "C901",
    //     "ctsp": "1620291316135",
    //     "ld": "cca874a2026540119554ee9f61a27aac_trade_status"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = lodash.get(ws_obj,'cd');
      // 赛事标识
      let mid = lodash.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = lodash.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.assign_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status({mid:mid, mhs:cd_obj.mhs});
      }
    }
  }


  /**
   * @description: C8的List部分获取
   * @param {*}
   * @return {*}
   */
  _get_c8_list(match_list) {
    let list = [];
    match_list.forEach(item => {
      if(item){
        // hpid *为全部玩法订阅      
        let mid = "", hpid="*";
        mid = item.mid;
        if(Array.isArray(item.hpids) && item.hpids.length > 0 && !item.hpids.includes("*")) {
          hpid = item.hpids.join(',')
        }
        let obj = { mid, hpid, level: 3 }; // level：2 值针对C303
        list.push(obj);
      }
    });    
    return list;
  }
  /**
   *  C8 参数说明
   * `cufm` 赛事列表、详细在同一页面标识，传入"m"。赛事列表、详细不同页面不需要此字段
   * `marketLevel` 0:默认行情等级，1:信用网等级
   * `list` 要订阅的赛事玩法对象
   * `mid` 赛事Id
   * `hid` 盘口Id，多个玩法Id用逗号分隔。订阅所有玩法用"*"
   * `说明:` 订阅后会推送C101,C102,C103,C105,C107,C110,C113,C114,C115,C303,C304,C305,C801
   * @description: 赛事订阅(C1) 
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  scmd_c8(ctr_cmd) {  
    if(lodash.get(this.match_ctr,'mids_ation.length')){
      // 获取赛事列表信息
      const list = this.match_ctr.get_match_object_form_list_to_obj(this.match_ctr.mids_ation,'Array');
      let obj = {};
      obj.key = this.match_ctr.name_code;
      obj.module = 'match-ctr';
      obj.list = this._get_c8_list(list);      
      obj.one_send = false; 
      obj.ctr_cmd = ctr_cmd;
      // cufm 详情用LM列表为L
      obj.cufm = "L";
      // 设置使用类型:类表-list,赛事详情-match
      if('match' == this.match_ctr.type){
        obj.cufm = "LM";
        obj.one_send = true; 
      }
      if(obj.list.length>0) {
        //发送赛状态订阅息命令C8
        WsMan.skt_send_match_status(obj);
      } 
    }
  }

  /**
   * @description: 销毁函数-清除所有数据和对象
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  destroy(){
    // 移除ws消息监听
    window.removeEventListener("message",this.message_fun);
    clearTimeout(this.ws_timer);
  }
}
