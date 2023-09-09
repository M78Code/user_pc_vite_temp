/**
 * @Author: hanmar
 * @Date: 2023-08-20 12:45:19
 * @Description: h5/pc数据仓库ws数据实时数据同步
 * 
 * 
 
 








 * 
 */
import _ from 'lodash'
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
    const cmd = _.get(obj, 'data.cmd');
    if(cmd == 'WS_MSG_REV'){
      // 是ws推送过来的消息
      // 获取消息数据体
      const data = _.get(obj, 'data.data');
      if(data){
        // ws推送消息分流
        const ws_cmd = _.get(data,'cmd')
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
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
  }
  
  /**
   * @description: WS命令C102逻辑处理
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
      }
    }
  }

  
  /**
   * @description: WS命令C103逻辑处理
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
      }
    }
  }



  /**
   * @description: WS命令C104逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C104(ws_obj){
    // C104赛事级别盘口状态
    // {
    //   "cd": {
    //       "csid": "1",
    //       "mhs": 1,
    //       "mid": "1011530",
    //       "ms": "0"
    //    },
    //    "cmd": "C104",
    //    "ctsp": "1592025235582",
    //     "ld": "46605e17908a4976bd16dff59073cfbd_trade"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
  }

  /**
   * @description: WS命令C105逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C105(ws_obj){
    // C105盘口/投注项
    // {
    //   "cd": {
    //     "hls": [
    //       {
    //           "hid": "1315918111111426050",
    //           "hpid": "4",
    //           "hs": 0,
    //           "mid": "1422839",
    //           "hn": 1,
    //           "hps": "S1|2:1",
    //           "ol": [
    //             {
    //                 "obv": "205000",
    //                 "oid": "1315918126340943874",
    //                 "os": 1,
    //                 "ot": "1",
    //                 "ov": "205000"
    //               }
    //           ]
    //         }
    //     ],
    //     "mid": "1422839"
    //   },
    //   "cmd": "C105",
    //   "ctsp": "1600152527052",
    //   "ld": "0af5033320200915144846729c7f4853"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // // 数据同步逻辑
        // this.match_ctr.merge_with(match, cd_obj);
        // // 同步更新快速查询对象中的赛事状态
        // this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
  }

  /**
   * @description: WS命令C106逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C106(ws_obj){
    // C106盘口/投注项
    // {
    //   "cd": {
    //     "hls": [
    //       {
    //           "hid": "1315918111111426050",
    //           "hpid": "4",
    //           "hs": 0,
    //           "mid": "1422839",
    //           "hn": 1,
    //           "hps": "S1|2:1",
    //           "ol": [
    //             {
    //                 "obv": "205000",
    //                 "oid": "1315918126340943874",
    //                 "os": 1,
    //                 "ot": "1",
    //                 "ov": "205000"
    //               }
    //           ]
    //         }
    //     ],
    //     "mid": "1422839"
    //   },
    //   "cmd": "C106",
    //   "ctsp": "1600152527052",
    //   "ld": "0af5033320200915144846729c7f4853"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // // 数据同步逻辑
        // this.match_ctr.merge_with(match, cd_obj);
        // // 同步更新快速查询对象中的赛事状态
        // this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // // 数据同步逻辑
        // this.match_ctr.merge_with(match, cd_obj);
      }
    }
  }

  
  /**
   * @description: WS命令C302逻辑处理
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
      }
    }
  }


  /**
   * @description: WS命令C303逻辑处理
   * @param {Object} ws_obj ws数据
   */
  C303(ws_obj){
    // C303滚球新赛事通知
    // {
    //     "cd": {
    //         "hid": "1224279756891123714",
    //         "hpid": "2",
    //         "hs": 0,
    //         "mid": "455991"
    //     },
    //     "cmd": "C303",
    //     "ctsp": "1580726140231"
    // }
    if(ws_obj){
      // ws命令数据信息
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        // this.match_ctr.merge_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
  }


  /**
   * @description: WS命令C304逻辑处理
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        // this.match_ctr.merge_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status(mid, cd_obj);
      }
    }
  }

  /**
   * @description: WS命令C801逻辑处理
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');

      cd_obj.forEach(item => {
        // 赛事标识
        let mid = _.get(item,'mid');
        // 获取快速查询对象中的mid赛事对象
        let match = this.match_ctr.get_quick_mid_obj(mid);
        if(match){
          // 数据同步逻辑
          this.match_ctr.merge_with(match, cd_obj);
          // 同步更新快速查询对象中的赛事状态
          this.match_ctr.upd_match_all_status(mid, cd_obj);
        }
      });
    }
  }


  /**
   * @description: WS命令C901逻辑处理
   * @param {Object} ws_obj ws数据
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
      let cd_obj = _.get(ws_obj,'cd');
      // 赛事标识
      let mid = _.get(ws_obj,'cd.mid');
      // 实时时间歘
      let ctsp = _.get(ws_obj,'ctsp');
      // 获取快速查询对象中的mid赛事对象
      let match = this.match_ctr.get_quick_mid_obj(mid);
      if(match){
        // 数据同步逻辑
        this.match_ctr.merge_with(match, cd_obj);
        // 同步更新快速查询对象中的赛事状态
        this.match_ctr.upd_match_all_status(mid, cd_obj);
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
  }
}
