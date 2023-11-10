/*
 * @Author: 投注接口入参及处理
 * @Date: 2023-07-29 
 * @Description: 
 */
import BetData from "src/core/bet/class/bet-data-class.js"
import BetViewDataClass from "src/core/bet/class/bet-view-data-class.js"
import { get_query_bet_amount_common } from "src/core/bet/class/bet-box-submit.js"
import {compute_value_by_cur_odd_type} from  "src/core/format/module/format-odds-conversion-mixin.js"
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import UserCtr from  "src/core/user-config/user-ctr.js";
import { api_betting } from "src/api/index.js";



/**
 * 
 * @param {Object} payload 投注所需信息
 * @description 将投注信息存储到数据管理仓库中用于投注模块
 * @returns {undefined} 无返回值
 */

export const storage_bet_info = async({payload,ol}) => {
  
  // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事")
  let matchType = 1 
  if( [1,2,110].includes(Number(payload.ms)) ){
    matchType = 2
  }
  const bet_object = {
    deviceType:"1",
    sportId: payload.csid,
    matchId: payload.mid,
    tournamentId: payload.tid,
    scoreBenchmark: payload.msc[0],  //比分
    marketId:  ol.hid, //盘口ID
    playOptionsId: ol.oid, //投注项id
    marketTypeFinally: 'EU',  // 欧洲版默认是欧洲盘 HK代表香港盘
    odds: ol.ov * 100000,  //十万位赔率
    oddFinally: ol.ov, //最终赔率
    playName:ol.hps.hpn, //玩法名称
    sportName: payload.csna, //球种名称
    matchType,  //赛事类型
    matchName: payload.tn, //赛事名称
    playOptionName: ol.on,
    playOptions: ol.on,
    tournamentLevel: payload.tlev, //联赛级别
    playId:ol.hps.hpid, //玩法ID
    dataSource: payload.cds, //数据源
    home: payload.mhn, //主队名称
    away: payload.man, //客队名称
    ot: ol.ot, //投注項类型
    placeNum: null, //盘口坑位
  }

  if (!!ol.hn ) {
    bet_object.placeNum =  ol.hn;
  }

  // 玩法id 3、4、128，投注栏，不展示盘口值
  if([3,4,128].includes(Number( bet_object.playId))){
    delete bet_object.marketValue
  }

  //玩法id 13 101 340  具体展示球队名&over 盘口值
  if([13,101,340].includes(Number(bet_object.playId))){
    let ot_list = bet_object.ot.split('And')
    let ot_name = ''
    if(340 == bet_object.playId){
      if(ot_list[0] == 1){
        ot_name = bet_object.home + " & "
      }
      if(ot_list[0] == 2){
        ot_name = bet_object.away + " & "
      }
      if(ot_list[1] == 1){
        ot_name += bet_object.away
      }
      if(ot_list[1] == 2){
        ot_name += bet_object.away
      }
    }else{
      if(ot_list[0] == 1){
        ot_name = bet_object.home + " & " + ot_list[1] 
      }
      if(ot_list[0] == 2){
        ot_name = bet_object.away + " & " + ot_list[1]
      }
    }
    
    bet_object.ot = ot_name
  }
  get_bet_amount(bet_object)
}

/**
* 获取 投注限额
*/
export const get_bet_amount = async obj => {
  
  let params = {
    orderMaxBetMoney:[{
      "deviceType": 1,
      "marketId": obj.marketId,  //盘口id
			"matchId": obj.matchId,  // 赛事id
			"oddsFinally":  obj.odds,  //赔率
			"oddsValue":  obj.odds * 100000,  // 赔率 万位
			"playId":  obj.playId,
			"playOptionId": obj.playOptionsId,
			"playOptions": obj.playOptions,
			"seriesType": 1,  // 串关类型
			"sportId": obj.sportId,
			"matchProcessId": "0",
			"scoreBenchmark": "",
			"tenantId": 1,
			"tournamentLevel": obj.tournamentLevel,
			"tournamentId": obj.tournamentId,
			"dataSource": obj.dataSource,
			"matchType": 1, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
			"openMiltSingle": 0, //是否开启 多单关投注模式，1：是，非1（0或者其他）：否
      "userId":UserCtr.user_info ? UserCtr.user_info.userId : ""
    }]
  }
  let res = await api_betting.query_bet_amount(params);

  let obj_info = res.data.betAmountInfo[0]

  let bet_info = {
    // betAmount:'1008',
    globalId:obj_info.globalId,
    minBet:obj_info.minBet,
    orderMaxPay:obj_info.orderMaxPay,
    ...obj,
  }

}

export const bet_click = (item,obj_hp,obj_hl) =>{
  // console.error(item,'item')
  // console.error(obj_hp,'obj_hp')
  // console.error(obj_hl,'obj_hl')
   // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事")
   let matchType = 2 
   if( [1,2].includes(Number(item.ms)) ){
     matchType = 2
   }
   const bet_obj = {
    sportId: item.csid, // 球种id
    matchId: item.mid,  // 赛事id
    tournamentId: item.tid,  // 联赛id
    scoreBenchmark: item.msc[0],  //比分
    marketId: obj_hl._hid, //盘口ID
    playOptionsId: obj_hl.oid, //投注项id
    marketTypeFinally: 'EU',  // 欧洲版默认是欧洲盘 HK代表香港盘
    odds: obj_hl.ov,  //十万位赔率
    oddFinally: compute_value_by_cur_odd_type(obj_hl.ov,'','',item.csid), //最终赔率
    sportName: item.csna, //球种名称
    matchType,  //赛事类型
    matchName: item.tn, //赛事名称
    playOptionName: obj_hl.on, // 投注项名称
    playOptions: obj_hl.on,   // 投注项
    tournamentLevel: item.tlev, //联赛级别
    playId: obj_hp.hpid, //玩法ID
    playName: obj_hp.hpn, //玩法名称
    dataSource: item.cds, //数据源
    home: item.mhn, //主队名称
    away: item.man, //客队名称
    ot: obj_hl.ot, //投注項类型
    placeNum: null, //盘口坑位
    // 以下为 投注显示或者逻辑计算用到的参数
    tid_name: item.tnjc,  // 联赛名称
    tn_name: item.tn,  // 联赛名称2
    match_ms: item.mgt, // 赛事阶段
    bet_type: 'common_bet', // 投注类型
  }
  BetViewDataClass.bet_special_h5[item.mid] = bet_obj
  BetData.bet_list[item.mid] = bet_obj


  BetData.set_bet_read_write_refer_obj(bet_obj)
  get_query_bet_amount_common(bet_obj)
  useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true)
  BetViewDataClass.set_bet_show(true)
  
}

