import {api_betting } from "src/api/index.js"
import BetData from "./bet-data-class.js"
import betViewDataClass from "./bet-view-data-class.js"
import { compute_value_by_cur_odd_type } from "src/core/format/module/format-odds-conversion-mixin.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"

// 获取限额请求数据
// bet_list 投注列表
// is_single 是否单关/串关 
// is_merge  是否单关合并
const set_min_max_money = ( bet_list,is_single,is_merge ) =>{
    let order_min_max_money = bet_list.map( item =>{
        let obj = {
            "sportId": item.sportId,   // 赛种id
            "marketId": item.marketId,  //盘口id
            "deviceType": 2,  // 设备类型 "设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备"
            "matchId": item.matchId,  // 赛事id
            "oddsFinally": compute_value_by_cur_odd_type(item.odds,'','',item.sportId),  //赔率
            "oddsValue":  item.odds,  // 赔率 万位
            "playId":  item.playId,   // 玩法id
            "playOptionId": item.playOptionsId,   // 投注项id
            "playOptions": item.playOptions,   // 投注项配置项
            "seriesType": is_single ? 1 : 2,  // 串关类型 // 串关类型 1 单关 2串关
            "matchProcessId": item.match_ms,  // 赛事阶段
            "scoreBenchmark": "",   // 基准分
            "tenantId": 1,   // 商户id
            "tournamentLevel": item.tournamentLevel,   // 联赛级别
            "tournamentId": item.tournamentId,   // 联赛id
            "dataSource": item.dataSource,   // 数据源
            "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
        }
        // 串关没有 这个字段 
        if(is_single){
            obj.openMiltSingle = is_merge ? 1 : 0 //是否开启 多单关投注模式，1：是，非1（0或者其他）：否
        }
        return obj 
    }) || []

    return order_min_max_money
}

// bet 投注订单提交数据 
// bet_list  投注列表
// is_single 是否单关/串关 
const set_bet_order_list = ( bet_list,is_single ) =>{
    let order_list = bet_list.map( item =>{
        let obj = {
            "seriesSum": 1,   // 串关数量
            "seriesType": 1,  // 串关类型(单关、串关) 
            "seriesValues": "单关",  // 串关值 2串1 3串1...
            "fullBet": 0,   // 是否满额投注，1：是，0：否
            "orderDetailList": [
                {
                    "sportId": item.sportId,   // 赛种id
                    "matchId": item.matchId,   // 赛事id
                    "tournamentId": item.tournamentId,   // 联赛id
                    "scoreBenchmark": "",    // 基准分
                    "betAmount": BetData.bet_amount,  //投注金额         
                    "placeNum": null, //盘口坑位
                    "marketId": item.marketId,  //盘口id
                    "playOptionsId": item.playOptionsId,   // 投注项id
                    "marketTypeFinally": "EU",     // 欧洲版默认是欧洲盘 HK代表香港盘
                    "odds":  item.odds,  // 赔率 万位
                    "oddFinally": compute_value_by_cur_odd_type(item.odds,'','',item.sportId),  //赔率
                    "playName": item.playName, //玩法名称
                    "sportName": item.sportName,  // 球种名称
                    "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
                    "matchName": item.matchName,   //赛事名称
                    "playOptionName": item.playOptionName,   // 投注项名称
                    "playOptions":  item.playOptions,   // 投注项配置项
                    "tournamentLevel": item.tournamentLevel,   // 联赛级别
                    "playId": item.playId,   // 玩法id
                    "dataSource": item.dataSource,   // 数据源
                }
            ]
        }
        return obj 
    }) || []

    return order_list
}


// 获取限额 常规 / 冠军
// obj 投注数据
const get_query_bet_amount_common = () =>{
    let params = {
        orderMaxBetMoney: []
    }
    let order_min_max_money = []
    // 单关 
    if(BetData.is_bet_single){
        // 单关 合并 多条数据 
        if(BetData.is_bet_merge){
            // 参数 投注列表 +  是否单关/串关  + 是否单关合并
            order_min_max_money = set_min_max_money(BetData.bet_single_list,true,true)
        }else{
            // 单关 不合并 只有一条
            order_min_max_money = set_min_max_money(BetData.bet_single_list,true,false)
        }
    }else{
        // 串关数据 
         // 参数 投注列表 +  是否单关/串关  + 是否单关合并
        order_min_max_money = set_min_max_money(BetData.bet_s_list,false,false)
    }

    params.orderMaxBetMoney = order_min_max_money

    api_betting.query_bet_amount(params).then(res =>{
        if(res.code == 200){
            betViewDataClass.set_bet_min_max_money(res.data)
            // 通知页面更新 
            useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
        }
    })
}


// 获取限额 预约投注
// obj 投注数据
const get_query_bet_amount_pre = obj =>{

}

// 获取限额 电竞/电竞冠军/VR体育
// obj 投注数据
const get_query_bet_amount_esports_or_vr = obj =>{

}

// 提交投注信息 
const submit_handle = type => {
    let params = {
        "userId": UserCtr.get_uid(),
        "acceptOdds": 2,  // 接受赔率变化情况
        "tenantId": 1,
        "deviceType": 2,  // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        "currencyCode": "CNY",  // 币种
        "deviceImei": "",   // 设备imei码，只有手机有，没有不添加
        "fpId": "",  // 指纹id 
        "openMiltSingle": 1,  // 是否为多个单关 0:1个 1:多个
        "preBet": 0,  // 1 预约  0 不预约
        seriesOrders: []
    }
    let seriesOrders = []
    let orderDetailList = []
    // 单关 
    if(BetData.is_bet_single){
        // 单关 不合并 只有一条
        if(BetData.is_bet_merge){
            // 参数 投注列表 +  是否单关/串关  + 是否单关合并
            seriesOrders = set_bet_order_list(BetData.bet_single_list,true)
             // 是否为多个单关 0:1个 1:多个
            params.openMiltSingle = 1
        }else{
            // 单关合并 多条数据 
            seriesOrders = set_bet_order_list(BetData.bet_single_list,true)
             // 是否为多个单关 0:1个 1:多个
            params.openMiltSingle = 0
        }
    }else{
        // 串关数据 
        seriesOrders = set_bet_order_list(BetData.bet_s_list,false)
        // 串关 没有单关字段
        delete params.openMiltSingle
    }
    // 投注内容
    params.seriesOrders = seriesOrders

    api_betting.post_submit_bet_list(params).then(res =>{
        if(res.code == 200){
            // 通知页面更新 
            // useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
        }
    })
}



export {
    get_query_bet_amount_common,
    get_query_bet_amount_pre,
    get_query_bet_amount_esports_or_vr,
    submit_handle,
}