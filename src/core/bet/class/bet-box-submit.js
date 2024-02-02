import { api_betting } from "src/api/index.js"
import BetData from "./bet-data-class.js"
import BetViewDataClass from "./bet-view-data-class.js"
import BetWsMessage from "./bet-ws-message.js"
import { compute_value_by_cur_odd_type } from "src/core/format/project/module/format-odds-conversion-mixin.js"
import { getSeriesCountJointNumber } from "src/core/bet/common-helper/module/bet-single-config.js"
import { 
    MatchDataWarehouse_PC_List_Common, 
    MatchDataWarehouse_PC_Detail_Common,
    MatchDataWarehouse_ouzhou_PC_five_league_List_Common,
    MatchDataWarehouse_ouzhou_PC_hots_List_Common,
    MatchDataWarehouse_ouzhou_PC_l5mins_List_Common,
    MatchDataWarehouse_ouzhou_PC_in_play_List_Common,
    MatchDataWarehouse_H5_List_Common,
    MatchDataWarehouse_H5_Detail_Common,
    MatchDataWarehouse_H5_List_Hot_Main,
    MatchDataWarehouse_H5_List_Jingxuan,
    MatchDataWarehouse_H5_Detail_Jingxuan,
    
 } from 'src/output/module/match-data-base.js'
import lodash_ from "lodash"
import { ALL_SPORT_PLAY } from "src/output/module/constant-utils.js"
import { useMittEmit, MITT_TYPES  } from "src/core/mitt/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { odds_table } from "src/core/constant/common/module/csid.js"
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
import PageSourceData from "src/core/page-source/page-source.js";
import { currency_code } from "src/core/constant/common/module/keyword.js"
import { MenuData } from 'src/output/project/index.js'
import { LocalStorage, SessionStorage } from "src/core/utils/common/module/web-storage.js";
import { calc_bifen } from "src/core/bet/common-helper/module/common-sport.js"
import { nextTick } from "vue"

const { PROJECT_NAME } = BUILDIN_CONFIG ;

let time_out = null
let time_api_out = null
let count_api = 0 
// 是否点击了投注按钮
let submit_btn = false
// 独赢类玩法

// 获取限额请求数据
// bet_list 投注列表
// is_single 是否单关/串关 
// is_merge  是否单关合并
const set_min_max_money = (bet_list, is_single, is_merge) => {
    // 过滤 数组中undefined,bet_list数据待优化
    let arr = bet_list.filter(item => item != undefined)    
    let order_min_max_money = arr.map(item => {
        let obj = {
            "sportId": item.sportId,   // 赛种id
            "marketId": item.marketId,  //盘口id
            "deviceType": BetData.deviceType,  // 设备类型 "设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备"
            "matchId": item.matchId,  // 赛事id
            "oddsFinally": compute_value_by_cur_odd_type(item.odds, item.playId, item.odds_hsw, item.sportId),  //赔率
            "oddsValue": item.odds,  // 赔率 万位
            "playId": item.playId,   // 玩法id
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
            // "userId": UserCtr.get_uid()
        }
        // 冠军没有赛事阶段
        if(item.bet_type == 'guanjun_bet'){
            delete obj.matchProcessId
        }
        // 串关没有 这个字段 
        if (is_single) {
            obj.openMiltSingle = is_merge ? 1 : 0 //是否开启 多单关投注模式，1：是，非1（0或者其他）：否

        }
        return obj
    }) || []

    if (!is_single) {
        // 获取串关 参数显示
        getSeriesCountJointNumber((code, data) => {
            if (code == 200) {
                BetViewDataClass.set_bet_special_series(data)
            }
        })
    }
    return order_min_max_money
}

// bet 投注订单提交数据 
// bet_list  投注列表
// is_single 是否单关/串关 
const set_bet_order_list = (bet_list, is_single) => {

    let order_list = [], single_bet = BetViewDataClass.bet_special_series
    // 串关
    if (!is_single) {
        single_bet.forEach(obj => {
            let bet_s_list = []
            // 没有金额不进行投注
            if(!obj.bet_amount){
              return  
            }
            bet_list.forEach(item => {
                let bet_s_obj = {
                    "sportId": item.sportId,   // 赛种id
                    "matchId": item.matchId,   // 赛事id
                    "tournamentId": item.tournamentId,   // 联赛id
                    // "scoreBenchmark": "",    // 基准分
                    "betAmount": obj.bet_amount,  //投注金额         
                    // "placeNum": item.placeNum, //盘口坑位
                    "marketId": item.marketId,  //盘口id
                    "playOptionsId": item.playOptionsId,   // 投注项id
                    "marketTypeFinally": UserCtr.odds.cur_odds,     // 欧洲版默认是欧洲盘 HK代表香港盘
                    "marketValue": item.marketValue,
                    "odds": item.odds,  // 赔率 万位
                    "oddFinally": compute_value_by_cur_odd_type(item.odds, item.playId, item.odds_hsw, item.sportId),  //赔率
                    "playName": item.playName, //玩法名称
                    "sportName": item.sportName,  // 球种名称
                    "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
                    "matchName": item.matchName,   //赛事名称
                    "playOptionName": item.playOptionName,   // 投注项名称
                    "playOptions": item.playOptions,   // 投注项配置项
                    // "tournamentLevel": item.tournamentLevel,   // 联赛级别
                    "playId": item.playId,   // 玩法id
                    // "dataSource": item.dataSource,   // 数据源
                }
                
                // 电竞 vr 投注不需要一下数据
                if(item.bet_type == 'common_bet'){
                    bet_s_obj.scoreBenchmark = ''
                    bet_s_obj.placeNum = item.placeNum //盘口坑位
                    bet_s_obj.tournamentLevel = item.tournamentLevel   // 联赛级别
                    bet_s_obj.dataSource = item.dataSource  // 数据源
                }
                
                // 获取当前的盘口赔率
                let cur_odds = lodash_.get(odds_table,`${UserCtr.odds.cur_odds}`, '1' )
                // 获取当前投注项 如果不支持当前的赔率 就使用欧赔
                let hsw = lodash_.get(item,'odds_hsw', '')
                if(!hsw.includes(cur_odds)){
                    bet_s_obj.marketTypeFinally = 'EU'
                }
               
                bet_s_list.push(bet_s_obj)
            })

            let obj_s = {
                "seriesSum": obj.count,   // 串关数量
                "seriesType": obj.id,  // 串关类型(单关、串关)  1-单关, 2-串关 3, 冠军
                "fullBet": 0,   // 是否满额投注，1：是，0：否
                "orderDetailList": bet_s_list
            }
            order_list.push(obj_s) 
        })

    } else {
        let pre_odds = ''
        let pre_marketValue = ''
        let pre_handicap = ''
        bet_list.forEach((item, index) => {
            // 预约投注 设置预约投注赔率
            if(BetData.is_bet_pre){
                pre_odds = item.pre_odds
                pre_marketValue = item.pre_marketValue
                pre_handicap = item.pre_handicap
            }
            let odds = pre_odds || item.odds
            let marketValue = pre_marketValue || item.marketValue
            let playOptionName = pre_handicap ? `${pre_handicap} ${marketValue}` : item.playOptionName
            let odd_finally = compute_value_by_cur_odd_type(odds, item.playId, item.odds_hsw, item.sportId)
            let bet_s_obj = {
                "sportId": item.sportId,   // 赛种id
                "matchId": item.matchId,   // 赛事id
                "tournamentId": item.tournamentId,   // 联赛id
                "scoreBenchmark": "",    // 基准分
                "betAmount": item.bet_amount,  //投注金额         
                "placeNum": item.placeNum, //盘口坑位
                "marketId": item.marketId,  //盘口id
                "playOptionsId": item.playOptionsId,   // 投注项id
                "marketTypeFinally": UserCtr.odds.cur_odds,     // 欧洲版默认是欧洲盘 HK代表香港盘
                "marketValue": marketValue,
                "odds": odds,  // 赔率 万位
                "oddFinally": odd_finally,  //赔率
                "playName": item.playName, //玩法名称
                "sportName": item.sportName,  // 球种名称
                "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
                "matchName": item.matchName,   //赛事名称
                "playOptionName": playOptionName,   // 投注项名称
                "playOptions": item.playOptions,   // 投注项配置项
                "tournamentLevel": item.tournamentLevel,   // 联赛级别
                "playId": item.playId,   // 玩法id
                "dataSource": item.dataSource,   // 数据源
            }

            // 获取当前的盘口赔率
            let cur_odds = lodash_.get(odds_table,`${UserCtr.odds.cur_odds}`, '1' )
            // 获取当前投注项 如果不支持当前的赔率 就使用欧赔
            let hsw = lodash_.get(item,'odds_hsw', '')
            if(!hsw.includes(cur_odds)){
                bet_s_obj.marketTypeFinally = 'EU'
            }

            // 单关 非合并 并且勾选了常用金额 需要保存金额
            if( BetData.is_regular_amount && !BetData.is_bet_merge){
                BetData.set_regular_amount(item.bet_amount)
            }

            // 预约投注 设置预约盘口值
            if(BetData.is_bet_pre){
                if(bet_s_obj.marketValue) {
                    bet_s_obj.playOptionsId = ''
                    bet_s_obj.marketId = ''
                    bet_s_obj.placeNum = ''
                }
            }

            // 预约投注
            // 需要用对应的数据 对投注数据进行覆盖
            // bet_s_obj = {
            //     ...bet_s_obj,
            //     ...BetData.bet_pre_obj[item.playOptionsId]
            // }
            console.error('item',item)
            // 在前面就有判断 是否有金额 
            if(item.bet_amount){
                order_list.push({
                    "seriesSum": 1,   // 串关数量
                    "seriesType": 1,  // 串关类型(单关、串关)  1-单关, 2-串关 3, 冠军
                    "seriesValues": "单关",  // 串关值 2串1 3串1...
                    "fullBet": 0,   // 是否满额投注，1：是，0：否
                    "orderDetailList": [bet_s_obj] 
                })
            }
           
        }) 
        
    }
    return order_list
}

// 投注确认中 循环请求接口 拉取投注状态
const set_order_status_info = (orderNo) => {
    clearTimeout(time_api_out)
    api_betting.query_order_status({orderNos: orderNo}).then((res = {}) => {
        if(res.code == 200){
            let data_list = lodash_.get(res,'data', [])
            let order_status = ''
            // 已经完成了单次投注订单 不需要在执行了
            if(BetViewDataClass.is_finally){
               return clearTimeout(time_api_out)
            }    
            data_list.forEach(item => {
                // data.status（4:拒单、0:接单、3:待确认、2:取消、1:已处理)
                order_status = item.status

            })
            if(order_status == 3 && count_api < 10){
                count_api++
                // 待确认数据 2秒后重新拉取
                time_api_out = setTimeout(()=>{
                    set_order_status_info(orderNo)
                },2500)
            }else{
                count_api = 0
                clearTimeout(time_api_out)
            }
            // 投注失败
            if([4,2].includes(order_status*1)){
                if(BetData.is_bet_single){
                    BetViewDataClass.orderNo_bet_obj_config({orderNo: data_list[0].orderNo,status: 0})
                }
                set_error_message_config({code:"0402018",message:''},'bet')
                // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                BetViewDataClass.set_bet_order_status(4)
                
            }
            if([1].includes(order_status*1)){
                if(BetData.is_bet_single){
                    BetViewDataClass.orderNo_bet_obj_config({orderNo: data_list[0].orderNo,status: 1})
                }
                // 获取金额
                UserCtr.get_balance()
                set_error_message_config({code:200,message:''},'bet',3)
                // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                BetViewDataClass.set_bet_order_status(3)
            }
        }
    }).catch(()=>{
        if(count_api < 10){
            time_api_out = setTimeout(()=>{
                set_order_status_info(orderNo)
            },2000)
        }
    })
}

// 获取限额 常规 / 冠军
// obj 投注数据
const get_query_bet_amount_common = (obj) => {
    let params = {
        orderMaxBetMoney: []
    }
    // 获取限额请求参数数据
    params.orderMaxBetMoney = get_query_bet_amount_params()

    // 获取额度接口合并
    api_betting.query_bet_amount(params).then((res = {}) => {
        if (res.code == 200) {
            BetViewDataClass.set_bet_min_max_money(res.data)
            // 通知页面更新 
            // 串关不更新
            if(BetData.is_bet_single){
                useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
            }
            // 获取盘口值 
            const latestMarketInfo = lodash_.get(res, 'data.latestMarketInfo',[]) || []
            // 获取预约投注项
            set_bet_pre_list(latestMarketInfo)
        } else {
            set_catch_error_query_bet_max(params)
            // set_error_message_config(res)
        }
    }).catch(ws => {
        let text = '限额获取失败'
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, text);
        set_catch_error_query_bet_max(params)
    })
}

// 查询最新的盘口数据
const get_lastest_market_info = (type) => {
    let params = {
        idList:[]
    }
    // 单关取值
    let bet_list = lodash_.cloneDeep(BetData.bet_single_list)
    if(!BetData.is_bet_single){
        bet_list = lodash_.cloneDeep(BetData.bet_s_list)
    }
    // 获取提交参数
    let bet_market_list = bet_list.map(item=> {
        return { 
            "marketId": item.marketId,
            "matchInfoId": item.matchId,
            "oddsId": item.playOptionsId,
            "oddsType": item.ot,
            "playId": item.playId,
            "placeNum": item.placeNum || null,
            "matchType": item.matchType,
            "sportId": item.sportId
        }
    })

    params.idList = bet_market_list

    api_betting.query_last_market_info(params).then((res = {}) => {
        if(res.code == 200){
            let list = lodash_.get(res,'data',[]) || []
            bet_list = bet_list.map(item => {
                let bet_item = lodash_.cloneDeep(item)
                list.forEach(obj => {
                    // 当前返回的数据坑位
                    let market = lodash_.get(obj,'currentMarket', {}) || {}
                    
                    // 赛事id 玩法id 坑位
                    if(obj.matchInfoId == item.matchId && obj.playId == item.playId && market.placeNum == item.placeNum){
                        // bug 需要遍历 ot == oddsType
                        let market_odds_list = lodash_.get(market,'marketOddsList',[]) || []

                        let odds = market_odds_list.find(page=> page.oddsType == item.ot) || {}

                        if( odds.id ) {
                            // 替换新id
                            BetData.set_bet_oid_obj(item.playOptionsId,odds.id)
                            // let oddss = market.filter(i => ot == oddsType)
                            // 赛事状态
                            bet_item.mid_mhs = obj.matchHandicapStatus
                            // 投注项状态
                            bet_item.ol_os = odds.oddsStatus
                            // 盘口状态
                            bet_item.hl_hs = market.status
                            // 盘口id
                            bet_item.marketId = market.id

                            // ws断连后 需要对比数据 进行投注
                            // 坑位变更 赔率也变 进行锁盘处理
                            if( type == 'submit_bet' && bet_item.odds != odds.oddsValue){
                                bet_item.ol_os = 4
                            }
                            // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
                            if(type == 'submit_bet' && bet_item.ot != odds.oddsType){
                                bet_item.hl_hs = 11
                            }

                            // 红绿升降
                            // bet_item.red_green = ''
                            // if(bet_item.odds == odds.oddsValue ){
                            //     bet_item.red_green = 'red_up'
                            // }else
                            // if(bet_item.odds > odds.oddsValue ){
                            //     bet_item.red_green = 'green_down'
                            // }

                            // 赔率 10w位
                            // bet_item.odds = odds.oddsValue
                            //最终赔率
                            // bet_item.oddFinally = compute_value_by_cur_odd_type(odds.oddsValue,obj.playId, item.odds_hsw, item.csisportIdd)

                            // 投注项类型
                            bet_item.ot = odds.oddsType
                            // 投注项id
                            bet_item.playOptionsId = odds.id
                            // 基准分
                            // bet_item.mark_score = 
                            // 盘口值
                            bet_item.marketValue = market.marketValue
                            // 球头
                            bet_item.handicap_hv = odds.playOptions || market.marketValue
                            let play_option_name = ''
                            // 主队 客队
                            if( odds.oddsType == 1 ){
                                play_option_name = obj.home || ''
                            }else{
                                play_option_name = obj.away  || ''
                            }
                            bet_item.playOptionName = bet_item.handicap  + ' ' + ( odds.playOptions || market.marketValue )
                            bet_item.playOptions = odds.oddsType

                            bet_item.place_num = 'place_num'
                        
                            // 如果是早盘赛事 则设置当前的 赛事状态
                            if(item.matchType == 1){
                                // 赛事状态：0未开赛，1 进行中 4 结束 (对应:ms)
                                if(obj.matchStatus == 0 ){
                                    bet_item.matchType = 1
                                }
                                // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事")
                                if(obj.matchStatus == 1 ){
                                    bet_item.matchType = 2
                                }
                            }

                            // if(bet_item.red_green){
                            //     // 有值才去清理
                            //     setTimeout(() => {
                            //         // 清除红绿升降
                            //         let single_list = []
                            //         // 单关 切 有投注项
                            //         if(BetData.is_bet_single){
                            //         single_list = BetData.bet_single_list || []
                            //         } else {
                            //         single_list = BetData.bet_s_list || []
                            //         }
                            //         let ol_obj_index = single_list.findIndex(obj_ => obj_.playOptionsId == odds.id )
                            //         if(ol_obj_index || ol_obj_index == 0 ){
                            //             bet_item.red_green = ''
                            //             BetData.set_ws_message_bet_info(bet_item,ol_obj_index)
                            //         }
                            //     }, 3000);
                            // }
                        }
                    }
                })
                return bet_item
            })
            // 重新设置投注项内容
            BetData.set_bet_single_special(bet_list)

            nextTick(()=>{
                 // 坑位变化 重新获取限额
                if(type != 'submit_bet'){
                    get_query_bet_amount_common()
                }
                
                // 重新订阅ws
                set_market_id_to_ws()
            })
        }
    }).finally(()=>{
        // 不管接口拿到数据没 都去进行投注
        if(type == 'submit_bet'){
            submit_handle_lastest_market()
        }
    })
} 

// 限额错误 设置默认值
const set_catch_error_query_bet_max = (params ={}) => {
    // 串关设置默认值
    if(!BetData.is_bet_single){
       return BetViewDataClass.set_bet_special_series_defalut()
    }
    let oid = lodash_.get(params.orderMaxBetMoney, '[0].playOptionId')
    BetViewDataClass.set_bet_min_max_money_default(oid)
    // 通知页面更新 
    // 串关不更新
    if(BetData.is_bet_single){
        useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
    }
}

// 获取限额 电竞/电竞冠军/VR体育
// obj 投注数据
const get_query_bet_amount_esports_or_vr = () => {
    // console.error('chufa',obj)
    let params = {
        orderMaxBetMoney: []
    }
    // 获取限额请求参数数据
    params.orderMaxBetMoney = get_query_bet_amount_params()
    // 获取最大值和最小值接口
    api_betting.post_getBetMinAndMaxMoney(params).then((res = {}) => {
        if (res.code == 200) {
            BetViewDataClass.set_bet_min_max_money(res.data,'min_max')
            // 通知页面更新 
            // 串关不更新
            if(BetData.is_bet_single){
                useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
            }

            // 设置投注项及时比分
            // let latestMarketInfo  = lodash_.get(res,'data.latestMarketInfo')
            // latestMarketInfo.forEach(item=>{
            //     let custom_id = lodash_.get(item,'currentMarket[0].id')
            //     //获取及时比分
            //     let timerly_basic_score = item.preBetBenchmarkScore
            //     BetData.set_custom_id_obj(custom_id,'timerly_basic_score',timerly_basic_score)
            // })

        } else {
            set_catch_error_query_bet_max(params)
            // set_error_message_config(res)
        }
    }).catch(ws => {
        let text = '限额获取失败'
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, text);
        set_catch_error_query_bet_max(params)
    })
}

// 获取限额 预约投注
// obj 投注数据
const get_query_bet_amount_pre = () => {

    let params = {
        orderMaxBetMoney: []
    }
    // 获取限额请求参数数据
    params.orderMaxBetMoney = get_query_bet_amount_params()
    // 获取额度接口合并
    api_betting.query_pre_bet_amount(params).then((res = {}) => {
        if (res.code == 200) {
            BetViewDataClass.set_bet_min_max_money(res.data)
            // 通知页面更新 
            useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)
            // 获取盘口值 
            const latestMarketInfo = lodash_.get(res, 'data.latestMarketInfo[0]', {})
            
            if(latestMarketInfo){
                // 获取预约投注项
                BetData.set_bet_appoint_obj(latestMarketInfo)
            }

        } else {
            set_catch_error_query_bet_max(params)
            // set_error_message_config(res)
        }
    }).catch(ws => {
       
        set_catch_error_query_bet_max(params)
    })
}

//设置获取限额参数 
const get_query_bet_amount_params = () =>{
    let order_min_max_money = []
    // 单关 
    if (BetData.is_bet_single) {
        // 单关 合并 多条数据 
        if (BetData.is_bet_merge) {
            // 参数 投注列表 +  是否单关/串关  + 是否单关合并
            order_min_max_money = set_min_max_money(BetData.bet_single_list, true, true)
        } else {
            // 单关 不合并 只有一条
            order_min_max_money = set_min_max_money(BetData.bet_single_list, true, false)
        }
    } else {
        // 串关数据 
        // 参数 投注列表 +  是否单关/串关  + 是否单关合并
        order_min_max_money = set_min_max_money(BetData.bet_s_list, false, false)
    }
    return order_min_max_money
}

// 设置预约投注显示状态
const set_bet_pre_list = (bet_appoint = []) => {
    const pre_list = []
    bet_appoint.forEach(item => {
        // 判断是否可以预约
        if (item.pendingOrderStatus) {
            // 获取预约投注项id
            let oid = lodash_.get(item.currentMarket, 'marketOddsList[0].id')
            pre_list.push(oid)
        }
    })
    // 设置可预约的投注项
    BetData.set_bet_pre_list(pre_list)
}

// 对比赔率，判断是否是预约投注
const pre_bet_comparison = () => {
	// 判断是否是预约投注
    // 在当前预约盘口下检查  1.预约的盘口是否存在。存在的话：需要判断是否有相同的赔率。盘口和赔率都有的话 走正常逻辑； 不存在走预约逻辑
	if(BetData.is_bet_pre) {
		let oid = BetData.bet_pre_appoint_id
        // 预约的赔率 和盘口 还有 投注项id
		let pre_obj = lodash_.get(BetData,`bet_pre_obj`,{}) || {}
        // 当前预约盘口下 可以直接投注的盘口和投注项
		let pre_list = lodash_.get(	BetData,'bet_appoint_obj.marketList',[]) || []
        // 当前的投注项
        let bet_obj_ = lodash_.get(BetData,`bet_read_write_refer_obj[${pre_obj.custom_id}]`,{})
        // 开启预约模式
        let pre_bet = true

		// 设置预约投注数据
		let pre_data = {
			oid: pre_obj.custom_id, // 投注项id 预约没有投注项id和盘口id 这里只是用到后面做数据匹配
			pre_odds: pre_obj.odds, // 预约赔率 10w位
			pre_oddFinally: pre_obj.oddFinally, // 预约赔率
            pre_marketValue: pre_obj.marketValue, // 盘口值
            pre_handicap: bet_obj_.handicap, // 投注项名称
		}

        // 判断有没有 直接投注的盘口和投注项
		if(pre_list.length) {
            pre_list.forEach(item => {
                // 1.预约的盘口是否存在。存在的话：需要判断是否有相同的赔率。盘口和赔率都有的话 走正常逻辑； 不存在走预约逻辑
                if(item.marketValue == pre_obj.marketValue){
                    if(item.marketOddsList && item.marketOddsList.length){
                        item.marketOddsList.forEach( obj => {
                            if(obj.oddsValue == pre_obj.odds){
                                
                                pre_data = {
                                    old_oid: pre_obj.custom_id,
                                    oid: obj.id,
                                    pre_odds: obj.odds,
                                    pre_marketValue: item.marketValue,
                                    pre_oddFinally: compute_value_by_cur_odd_type(obj.odds, bet_obj_.playId, bet_obj_.odds_hsw, bet_obj_.sportId), //赔率
                                    pre_handicap: item.handicap
                                }
                                // 取消 预约投注
                                pre_bet = false
                            }
                        })
                    }
                }
            })
		}

        BetData.set_bet_single_list_obj(pre_data)
		BetData.set_is_bet_pre(pre_bet)
	}
}

// 提交投注信息 
const submit_handle = () => {
    // debugger
    
    // 预约需要更新赔率
    if(BetData.is_bet_pre){
        pre_bet_comparison()
    }
   
    // 投注前获取最新的 投注信息 赔率 坑位 等
    get_lastest_market_info('submit_bet')
    
}

// 投注前获取最新的 投注信息 赔率 坑位 等
// 投注已经准备好了 拿最新的数据 去投注
const submit_handle_lastest_market = () => {
    // 
    if(submit_btn) return
    // 单关才有预约投注
    // 是否预约投注  1 预约  0 不预约
    //  是否合并投注  bet_single_list。length  0:1个 1:多个
    let pre_type = 0
    let milt_single = 0
    submit_btn = true
    // 是否投注中遇到了问题 
    let is_bet_error = false
    if(BetData.is_bet_single){
        for(let ol_obj of BetData.bet_single_list) {
            // 投注项状态 1：开 2：封 3：关 4：锁
            // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
            // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
            if(ol_obj.ol_os != 1 || ol_obj.hl_hs != 0 || ol_obj.mid_mhs != 0){
                set_submit_btn()
                return set_error_message_config({code:"0402001"},'bet')
            }
        }
        
        // 串关投注 有且至少有一个投注金额 就可以投注
        const count = BetData.bet_single_list.reduce((pre, cur) => {
            return pre + (cur.bet_amount || 0 );
        }, 0)

        // 请输入投注金额
        if( count == 0 ) {
            set_submit_btn()
            return set_error_message_config({code:"M400005"},'bet')
        }
        
        // 有金额的情况下 判断限额
        for ( let item of BetData.bet_single_list ) {
            // 投注金额 小于最小限额
            if( item.bet_amount && (item.bet_amount*1 < item.min_money*1) ) {
                set_submit_btn()
                return set_error_message_config({code:"M400010"},'bet')
            }
        }

        pre_type = BetData.is_bet_pre ? 1 : 0
        milt_single = BetData.bet_single_list.length 
    } else {
        // 未满足串关条件 不允许投注
        if(!bet_special_series_change()){
            set_submit_btn()
            return
        }
        for (let item of BetData.bet_s_list) {
            // 投注项状态 1：开 2：封 3：关 4：锁
            // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
            // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
            if(item.ol_os != 1 || item.hl_hs != 0 || item.mid_mhs != 0){
                set_submit_btn()
                return set_error_message_config({code:"0402001"},'bet')
            }
            // 串关 中不能包含不能串关的投注项
            if(item.is_serial){
                set_submit_btn()
                return set_error_message_config({code:"is_serial",message:'有不支持串关的赛事'})
            }
        }
        // 判断是否有投注金额   
        // 串关投注 有且至少有一个投注金额 就可以投注
        const count = BetViewDataClass.bet_special_series.reduce((pre, cur) => {
            return pre + (cur.bet_amount || 0 );
        }, 0)
        // 请输入投注金额
        if( count == 0 ) {
            set_submit_btn()
            return set_error_message_config({code:"M400005"},'bet')
        }
        // 有金额的情况下 判断限额
        for ( let item of BetViewDataClass.bet_special_series ) {
            // 投注金额 小于最小限额
            if( item.bet_amount && (item.bet_amount*1 < item.min_money*1) ) {
                set_submit_btn()
                return set_error_message_config({code:"M400010"},'bet')
            }
        }
    }

    // 有问题 不能继续下去了 
    if( is_bet_error ){
        return
    }

    let currency = "CNY"
    // 获取当前赛种
    let cur_code = SessionStorage.get('currency_code',1)
    // 人民币 使用CNY 不使用 RMB
    if( cur_code != 1){
        currency = currency_code[cur_code]
    }
    let params = {
        // "userId": UserCtr.get_uid(),
        "acceptOdds": 2,  // 接受赔率变化情况
        "tenantId": 1,
        "deviceType": BetData.deviceType,  // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        "currencyCode": currency ,  // 币种
        "deviceImei": "",   // 设备imei码，只有手机有，没有不添加
        "fpId": "",  // 指纹55555555id 
        "openMiltSingle": milt_single,  // 是否为多个单关 0:1个 1:多个
        "preBet": pre_type,  // 1 预约  0 不预约
        seriesOrders: []
    }
    let seriesOrders = []
    // 单关 
    if (BetData.is_bet_single) {
        // 单关 不合并 只有一条
        if (BetData.is_bet_merge) {
            // 参数 投注列表 +  是否单关/串关  + 是否单关合并
            seriesOrders = set_bet_order_list(BetData.bet_single_list, true)
            // 是否为多个单关 0:1个 1:多个
            params.openMiltSingle = 1
        } else {
            // 单关合并 多条数据 
            seriesOrders = set_bet_order_list(BetData.bet_single_list, true)
            // 是否为多个单关 0:1个 1:多个
            params.openMiltSingle = 0
        }
    } else {
        // 串关数据 
        seriesOrders = set_bet_order_list(BetData.bet_s_list, false)
        // 串关 没有单关字段
        delete params.openMiltSingle
        delete params.preBet
    }
    // 投注内容
    params.seriesOrders = seriesOrders
    // 测试投注失败
    // BetViewDataClass.set_bet_order_status(5)
    //return
    api_betting.post_submit_bet_list(params).then(res => {
        // BetViewDataClass.set_tip_message(res)
        // BetData.tipmsg=res.msg  // 不能这样处理 查看 BetViewDataClass.set_bet_before_message 方法
        let order_state = 2
        if (res.code == 200) {
            BetViewDataClass.set_is_finally(false)
            // 获取
            BetData.set_bet_mode(lodash_.get(res,'data.lock'),-1)
            // 获取投注后的数据列表
            let orderDetailRespList = lodash_.get(res,'data.orderDetailRespList') || []
            let seriesOrderRespList = lodash_.get(res,'data.seriesOrderRespList') || []
           
            // 单关
            if(BetData.is_bet_single){
               
                set_orderNo_bet_obj(orderDetailRespList)
                
                // 投注 注单状态
                let status_code = 0
                // 投注状态
                let status = 2
                 // 预约
                if(BetData.is_bet_pre){
                    // 预约状态 0:预约中 1: 预约成功 2: 预约取消
                    status_code = orderDetailRespList[0].preOrderDetailStatus
                    // 设置投注中状态 后续用ws推送改变
                    switch (+status_code) {
                        case 0:
                        case 1:
                            status = 7;
                            break;
                        case 2:
                            status = 8;
                            break;
                        default:
                            break;
                    }
                }else{
                    // 订单状态 0:投注失败 1: 投注成功 2: 订单确认中
                    status_code = orderDetailRespList[0].orderStatusCode
                    // 设置投注中状态 后续用ws推送改变
                    switch (+status_code) {
                        case 0:
                            status = 5;
                            break;
                        case 1:
                            status = 3;
                            break;
                        default:
                            break;
                    }
                }
               
                order_state = status
                // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效 6-预约中 7-预约成功  8-预约取消
                BetViewDataClass.set_bet_order_status(status)
            }else{
                set_orderNo_bet_obj(orderDetailRespList)
                BetViewDataClass.set_orderNo_bet_single_obj(seriesOrderRespList)

                // let number_list = []
                // number_list = seriesOrderRespList.filter(item=> item.orderStatusCode == 1)
                
                // if(seriesOrderRespList.length == number_list.length){
                //     // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                //     BetViewDataClass.set_bet_order_status(3)
                    order_state = 3
                // }else{
                //     BetViewDataClass.set_bet_order_status(2)
                //     order_state = 2
                // }
                // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                BetViewDataClass.set_bet_order_status(3)

            }
            // 投注成功 更新余额
            UserCtr.get_balance()
            // 投注成功 获取余额 获取投注记录数量
            // 7 预约成功 3 投注成功
            if([3,7].includes(order_state*1)){
               
                // pc 有的 
                if(params.deviceType == 2){
                    // 投注成功后获取投注记录数据 24小时内的
                    useMittEmit(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG)
                }
            }
            // 投注确认中 ws请求
            // 6 预约确认中 3 投注确认中
            if( [2,6].includes(order_state*1)){
                let order_no =  lodash_.get(orderDetailRespList,'[0].orderNo', '')
                // 单关才有
                if(BetData.is_bet_single){
                    set_order_status_info(order_no)
                }

                let obj = {};
                obj.hid = ''
                obj.mid = ''
                // 盘口Id，多个Id使用逗号分隔
                // 赛事Id，多个Id使用逗号分隔
                let series_orders = lodash_.get(seriesOrders,'[0].orderDetailList', {})
                series_orders.forEach( item => {
                    obj.hid += item.marketId + ','
                    obj.mid += item.matchId + ','
                })
                // 用户赔率分组
                obj.marketLevel = lodash_.get(UserCtr.user_info,'marketLevel','0');
                obj.esMarketLevel = lodash_.get(UserCtr.user_info,'esMarketLevel','0');
                BetWsMessage.set_bet_c2_message(obj);
            }
        }
        set_error_message_config(res,'bet',order_state)
        set_submit_btn()
    }).catch(()=>{
        set_error_message_config({code:"0401038"},'bet')
        set_submit_btn()
    })
}

//错误提示 设置为可以点击
const set_submit_btn = () => {
    // 提示错误 初始化滑块
    if(PROJECT_NAME.includes('app-h5')){
        useMittEmit(MITT_TYPES.EMIT_INIT_SLIDER_CONFIG)
    }
    // 投注栏loading
    if(PROJECT_NAME.includes('new-pc')){
        useMittEmit( MITT_TYPES.EMIT_BET_LOADING,false)
    }
    setTimeout(()=>{
        submit_btn = false
    },500)
}

// 设置错误信息 
const set_error_message_config = (res ={},type,order_state) => {

    clearTimeout(time_out)
   
    let obj = {
        code: res.code,
        message: res.message
    }
    // console.log('---!这!---', res)
    let matchInfo = lodash_.get(res, 'data.orderDetailRespList[0].matchInfo', '')
    let playName = lodash_.get(res, 'data.orderDetailRespList[0].playName', '')
    // 是否需求清除投注信息
    let clear_time = true

    if(type == 'bet'){
        clearTimeout(time_out)
        // 投注完成 不需要清除提示信息
        if(res.code == 200){
            clear_time = false
            switch(order_state){
                case 2:
                    obj = {
                        code: '0000000',
                        message: "bet_message.loading"
                    }
                    break
                 
                case 3:
                    obj = {
                        code: '200',
                        message: "bet_message.success"
                    }
                    break
            
                case 4:
                    obj = {
                        code: '500',
                        message: "bet_message.error"
                    }
                    break
                case 7:
                    // 预约订单确认
                    obj = {
                        code: '200',
                        message: "bet.bet_order_info2"
                    }
                    // matchInfo + playName + i18
                    useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${matchInfo} ${playName} ${i18n_t('bet.bet_booked')}`);
                    break;
                case 8: 
                    // 预约失败
                    obj = {
                        code: '500',
                        message: "bet.bet_book_failed"
                    }
                    break;
            }
           
        }else{
            obj.message = BetViewDataClass.set_code_message_config(res.code,res.message)
        }
    }
    // 获取限额失败的信息
    if(PROJECT_NAME == 'app-h5'){
        let text =  obj.message 
        // 没有做国际化的code
        if(BetViewDataClass.error_code_list.includes(res.code)){
            text = i18n_t(obj.message)
        }
        // 投注前 提示 投注完成后不提示
        if(BetViewDataClass.bet_order_status == 1){
            useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, text);
        }
        
    }else{
        BetViewDataClass.set_bet_before_message(obj)
    }
    
    // 需求清除
    if(clear_time){
        time_out = setTimeout(()=>{
            BetViewDataClass.set_bet_before_message({})
        },3000)
    }
   
}

// 选择投注项数据 
// params 各种id 用于查找数据对应的值 
// other 灵活数据
// const set_bet_obj_config = (mid_obj,hn_obj,hl_obj,ol_obj) =>{
/**
 * 
 * @param {{ oid, _hid, _hn, _mid}} params 
 * @param {Object} other 
 * @param {Boolean} other.is_detail
 * @param {'common_bet'|'guanjun_bet'|'vr_bet'|'esports_bet'} other.bet_type 根据赛事纬度判断当前赛事属于 那种投注类型
 * @param {1|2|3|4|5} other.device_type 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
 * @param {'h5_detail'|'h5_list'} other.match_data_type
 * @param {String} other.play_name 玩法名
 * @returns 
 */
const set_bet_obj_config = (params = {}, other = {}) => {
    console.error('投注项需要数据', params, 'other', other);
    // 切换投注状态
    const { oid, _hid, _hn, _mid } = params

    // 没有投注内容 点击无效
    if( !oid ){
        return
    }
    // 是否上一个投注流程已走完
    BetViewDataClass.set_is_finally(true)
    
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_mode(-1)
    // 重置金额为 0
    BetData.set_bet_amount(0)
    // BetData.set_is_bet_pre(false)
    BetViewDataClass.set_bet_before_message({})

    // 没有走数据仓库 提示数据失效
    if(!_mid ){
       set_error_message_config({res:'0402001'},'bet')
    }

    // 有数据的再次点击 为取消投注项
    if(BetData.bet_oid_list.includes(oid)){
        let index_ = 0
        // 单串关 筛选
        if(BetData.is_bet_single){
            index_ = BetData.bet_single_list.findIndex(item=> item.playOptionsId == oid)
        }else{
            index_ = BetData.bet_s_list.findIndex(item=> item.playOptionsId == oid)
        }
        return BetData.set_delete_bet_info(oid,index_)
    }

    
    // 点击投注项 展开投注栏
    BetData.set_bet_state_show(true)
     // 列表数据仓库
     let query = {}
    // device_type 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备 
    if(other.device_type == 1){
        query = h5_match_data_switch(other.match_data_type)
        // useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true)
        // BetViewDataClass.set_bet_show(true)
        // h5 单关显示 
        if(BetData.is_bet_single){
            // 点击投注项 显示投注栏
            BetData.set_bet_box_h5_show(true)
        }
        // 欧洲版 串关数量大于1的情况下 或 选中合并单关 点击 投注项 默认收起
        if( PROJECT_NAME == 'ouzhou-h5' && (!BetData.is_bet_single || BetData.is_bet_merge)){
            BetData.set_bet_box_h5_show(true)
            BetData.set_bet_state_show(false)
        }
      
        BetData.set_bet_keyboard_show(false)
        // BetViewDataClass.set_bet_keyboard_show(true)
    }else{
        // pc 数据仓库
        query = pc_match_data_switch(other.match_data_type)
    }
    
    // 获取对应的仓库数据
    const hl_obj = lodash_.get(query.list_to_obj, `hl_obj.${_mid}_${_hid}`, {})
    const hn_obj = lodash_.get(query.list_to_obj, `hn_obj.${_hn}`, {})
    const mid_obj = lodash_.get(query.list_to_obj, `mid_obj.${_mid}_`, {})
    const ol_obj = lodash_.get(query.list_to_obj, `ol_obj.${_mid}_${oid}`, {})
    // let other = { bet_type:'common_bet'}
    // 移动端 并且是串关 点击 非串关赛事 提示信息  
    // 电子赛事 电竞的不可串关赛事
    if(!BetData.is_bet_single && (( !ol_obj._ispo && other.bet_type == 'esports_bet' ) || (["C01","B03","O01"].includes(mid_obj.cds) || [2,4].includes(Number(mid_obj.mbmty))))){
        let text = '不支持串关'
        useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, text);
        return
    }

    // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事")
    let matchType = 1
    // 冠军
    if(other.bet_type == 'common_bet'){
         //  ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
        if ([1, 2,110].includes(Number(mid_obj.ms))) {
            matchType = 2
        }
    }
    // 冠军
    if(other.bet_type == 'guanjun_bet'){
        matchType = 3
    }
    // 电竞赛事
    if(other.bet_type == 'esports_bet'){
        matchType = 5
        // 电竞赛事
        // C01赛事不支持串关
        // if(lodash.get(mid_obj, 'cds') == "C01" && lodash_.get(BetData,'bet_list.length',0)>0){
        //     useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, i18n_t('bet.bet_no_support'));
        //     return;
        // }
    }
    // 虚拟赛事
    if(other.bet_type == 'vr_bet'){
        matchType = 4
    }

    const play_config = {
        hl_obj,
        hn_obj,
        mid_obj,
        ol_obj,
        other,
    }

    // 获取投注项名称
    let handicap = get_handicap(ol_obj,hl_obj,mid_obj,other)

    let playOptionName = ol_obj.on
    // 详情投注项
    if(other.is_detail){
        playOptionName = ol_obj.otv
    }

    const bet_obj = {
        sportId: mid_obj.csid, // 球种id
        matchId: mid_obj.mid,  // 赛事id
        tournamentId: mid_obj.tid,  // 联赛id
        scoreBenchmark: lodash_.get(mid_obj, 'msc[0]'),  //比分
        marketId: hl_obj.hid || ol_obj._hid, //盘口ID
        marketValue: hl_obj.hv || '',
        playOptionsId: ol_obj.oid, //投注项id
        marketTypeFinally: UserCtr.odds.cur_odds,  // 欧洲版默认是欧洲盘 HK代表香港盘
        odds: ol_obj.ov,  //十万位赔率
        oddFinally: compute_value_by_cur_odd_type(ol_obj.ov,ol_obj._hpid, ol_obj._hsw, mid_obj.csid), //最终赔率
        sportName: mid_obj.csna || '', //球种名称
        matchType,  //赛事类型
        matchName: mid_obj.tn || '', //赛事名称
        playOptionName, // 投注项名称
        playOptions: ol_obj.ot,  // 投注项
        tournamentLevel: mid_obj.tlev, //联赛级别
        playId: hn_obj.hpid || ol_obj._hpid, //玩法ID
        playName: set_play_name(play_config), //玩法名称
        dataSource: mid_obj.cds, //数据源
        home: mid_obj.mhn || '', //主队名称
        away: mid_obj.man || '', //客队名称
        ot: ol_obj.ot, //投注項类型
        placeNum: hl_obj.hn || '', //盘口坑位
        // 以下为 投注显示或者逻辑计算用到的参数
        bet_amount: '', // 投注金额
        bet_type: other.bet_type, // 投注类型
        tid_name: mid_obj.tn,  // 联赛名称
        match_ms: mid_obj.ms, // 赛事阶段
        match_time: mid_obj.mgt, // 开赛时间
        handicap: handicap.text, // 投注项名称
        handicap_hv: handicap.hv, // 投注项 球头
        mark_score: calc_bifen(mid_obj.msc, mid_obj.csid, mid_obj.ms, ol_obj._hpid), // 显示的基准分
        mbmty: mid_obj.mbmty, //  2 or 4的  都属于电子类型的赛事
        ol_os: ol_obj.os, // 投注项状态 1：开 2：封 3：关 4：锁
        hl_hs: hl_obj.hs || ol_obj._hs, // 盘口状态，玩法级别 0：开 1：封 2：关 11：锁
        mid_mhs: ol_obj._mhs, // 赛事级别盘口状态（0:active 开盘, 1:suspended 封盘, 2:deactivated 关盘,11:锁盘状态）
        match_ctr: other.match_data_type, // 数据仓库 获取比分
        device_type: BetData.deviceType, // 设备号
        odds_hsw: ol_obj._hsw, // 投注项支持的赔率
        ispo: ol_obj._ispo || 0, // 电竞赛事 不支持串关的赛事
        // oid, _hid, _hn, _mid, // 存起来 获取最新的数据 判断是否已失效
    }

    // 获取当前的盘口赔率
    let cur_odds = lodash_.get(odds_table,`${UserCtr.odds.cur_odds}`, '1' )
    // 获取当前投注项 如果不支持当前的赔率 就使用欧赔
    let hsw = lodash_.get(bet_obj,'odds_hsw','')
    if(!hsw.includes(cur_odds)){
        bet_obj.marketTypeFinally = 'EU'
    }

    // 单关 只有一条数据的时候 需要设置 常用金额
    if(BetData.is_bet_single ){
        if(BetData.is_regular_amount && (!BetData.is_bet_merge || !BetData.bet_single_list.length)){
            bet_obj.bet_amount = BetData.regular_amount
        } else {
            // 需要清空已有的常用金额数据
            BetData.bet_single_list.filter(item=>{
                item.bet_amount = ''
            })
        }
    }
    // console.error('投注项内容：',bet_obj)

    // 冠军 
    if(bet_obj.bet_type == 'guanjun_bet'){
        bet_obj.handicap = ol_obj.on
        bet_obj.handicap_hv = ''
        bet_obj.tid_name = mid_obj.onTn || mid_obj.tn
    }

    // 串关数据 提示  添加数据之前
    if( !bet_special_series_change(1) ){
        return
    }

    // 设置投注内容 
    BetData.set_bet_read_write_refer_obj(bet_obj)

    // 移动端端 串关 点击展开对时候才去请求限额
    if(PROJECT_NAME.includes('h5') && !BetData.is_bet_single){
        return
    }
    
    // 订阅投注项的 ws
    set_market_id_to_ws()

    // 判断获取限额接口类型
    if(["C01","B03","O01"].includes(bet_obj.dataSource) || [2,4].includes(Number(bet_obj.mbmty)) || ['esports_bet','vr_bet'].includes(other.bet_type)){
        // C01/B03/O01  电竞/电竞冠军/VR体育
        get_query_bet_amount_esports_or_vr()
    }else{
        // 获取限额 常规
        get_query_bet_amount_common()
    }
}

const bet_special_series_change = (count = 0) => {
    let state = true
    // 串关数据 提示
    if(!BetData.is_bet_single){
        // 获取商户配置的 串关投注项
        let min_series = lodash_.get(UserCtr.user_info,'configVO.minSeriesNum',2)
        let man_series = lodash_.get(UserCtr.user_info,'configVO.maxSeriesNum',10)
        let obj = {}
        // 串关 数量不是大于1条投注项 则提示
        // 并且是在 添加的时候
        if((BetData.bet_s_list.length < min_series - count ) && !count){
            obj = {
                code: 'sasdasd',
                message: i18n_tc('bet.bet_min_item',{ 'num': min_series})
            }
            state = false
        }else if(BetData.bet_s_list.length > man_series - count ){
            // 串关 数量不能大于设置的数量
            obj = {
                code: 'sasdasd',
                message: i18n_tc('bet.bet_max_item',{ 'num': man_series})
            }
            state = false
        }
        // 数量不对 提示信息
        if(!state){
            set_error_message_config(obj)
        }
    }

    return state
}

// 设置玩法名称
const set_play_name = ({hl_obj,hn_obj,mid_obj,ol_obj,other}) => {
    // chpid 优先于hpid
    let hpid = ol_obj._chpid ?  ol_obj._chpid : ol_obj._hpid
     //玩法名称
    let play_name = ALL_SPORT_PLAY[ol_obj]

    // 次要玩法
    if(other.secondary_paly){
        play_name = lodash_.get(mid_obj.play_obj,`hpid_${hpid}.hpnb`,'')
    }else{
        // 详情 并且本地没有配置玩法
        if(other.is_detail){
            play_name = lodash_.get(mid_obj.play_obj,`hpid_${hpid}.hpn`,'')
        }else{
            let hpn = lodash_.get(mid_obj.play_obj,`hpid_${hpid}.hpn`,play_name)
            // 冠军玩法 部分玩法hpid相同 
            if(other.bet_type == 'guanjun_bet' || other.is_kemp){
                let hpn_list = lodash_.get(mid_obj,`hpsPns`,[])
                if(hpn_list.length < 1){
                    hpn_list = lodash_.get(mid_obj,`hps`,[])
                }
                let hpn_obj = hpn_list.find(item => item.hid == ol_obj._hid) || {}
                if(hpn_obj.hid){
                    hpn = hpn_obj.hpn || hpn_obj.hps
                }else{
                    hpn = i18n_t('bet.bet_winner')
                }
            }
            if(hpn){
                play_name = hpn
            }
        }
    }
    return play_name
    
}

// h5 投注选择 数据仓库
const h5_match_data_switch = match_data_type => {
    let query = {}
    switch(match_data_type){
        case "h5_list" :
            query = MatchDataWarehouse_H5_List_Common
            break
        case "h5_detail" :
            query = MatchDataWarehouse_H5_Detail_Common
            break
        case "h5_list_hot" :
            query = MatchDataWarehouse_H5_List_Hot_Main
            break
        case "h5_list_jingxuan" :
            query = MatchDataWarehouse_H5_List_Jingxuan
            break
        case "h5_detail_jingxuan" :
            query = MatchDataWarehouse_H5_Detail_Jingxuan
            break  
        case "h5_hots_list" :
            query = MatchDataWarehouse_ouzhou_PC_hots_List_Common
            break
        case "h5_five_league" :
            query = MatchDataWarehouse_ouzhou_PC_five_league_List_Common
            break
        case "h5_ten_five_mins" :
            query = MatchDataWarehouse_ouzhou_PC_l5mins_List_Common
            break 
        case "h5_in_play_league" :
            query = MatchDataWarehouse_ouzhou_PC_in_play_List_Common
            break 
        default :
            query = MatchDataWarehouse_H5_List_Common
            break   
    }
    return query
}

// pc 投注选择 数据仓库
const pc_match_data_switch = match_data_type => {
    let query = {}
    switch(match_data_type){
        case "pc_list" :
            query = MatchDataWarehouse_PC_List_Common
            break
        case "pc_hots_list" :
            query = MatchDataWarehouse_ouzhou_PC_hots_List_Common
            break
        case "pc_five_league" :
            query = MatchDataWarehouse_ouzhou_PC_five_league_List_Common
            break
        case "pc_ten_five_mins" :
            query = MatchDataWarehouse_ouzhou_PC_l5mins_List_Common
            break
        case "pc_detail" :
            query = MatchDataWarehouse_PC_Detail_Common
            break   
        default :
            query = MatchDataWarehouse_PC_List_Common
            break   
    }
    return query
}

// 根据当前的投注项 获取对应的赔率变化ws
const set_market_id_to_ws = () => {
    BetData.set_bet_single_special_list()
    let hid = []
    let mid = []
    let obj = {}
    let bet_list = []
    // 单关
    if(BetData.is_bet_single){
        bet_list = lodash_.get( BetData,'bet_single_list',[])
    }else{
        bet_list = lodash_.get( BetData,'bet_s_list',[])
    }
    // 获取盘口id
    hid = bet_list.map(item => item.marketId)
    // 获取赛事id
    mid = bet_list.map(item => item.matchId)


    obj.hid = hid.join(',')
    obj.mid = mid.join(',')

    // 用户赔率分组
    obj.marketLevel = lodash_.get(UserCtr.user_info,'marketLevel','0');
    BetWsMessage.set_bet_c2_message(obj);
}

// 设置投注后的数据内容
const set_orderNo_bet_obj = order_no_list => {
    let order_list = order_no_list.map( item => {
        // 获取投注项内对应的数据
        let refer_obj = lodash_.get( BetData.bet_read_write_refer_obj, `${item.playOptionsId}`)
        // 开赛时间
        let match_time = lodash_.get( refer_obj, `match_time`)
        // 玩法id
        let playId = lodash_.get( refer_obj, `playId`)
        let matchInfo = lodash_.get( refer_obj, `tid_name`)
        // 基准分
        let score_benchmark = lodash_.get( item, `scoreBenchmark`, '')
        if(score_benchmark){
            score_benchmark = `(${ score_benchmark.replace(':','-') })`
        }
        // 冠军没有赛事信息
        if(!item.matchInfo){
            item.matchInfo = matchInfo
        }
        return {
            ...item,
            match_time,
            playId,
            score_benchmark,
        }
    })
    BetViewDataClass.set_orderNo_bet_obj(order_list)
}

// 获取盘口值 附加值
const get_handicap = (ol_obj,hl_obj,mid_obj,other) => {
    // ## 详情页的取值，直接取 ol 层级的 `ott` + `on`,当遇到下面几种玩法时，直接取 `otv`,
    // 3-全场让球赛果  69-上半场让球赛果  71-下半场让球赛果  
    // 220-球员得分 221-球员三分球 271-球员助攻 272-球员篮板
    // 171-独赢&总局数 13-独赢&进球大小 101-独赢&两队都进球  106-下半场独赢&下半场两队都进球 105-上半场独赢&上半场两队都进球 216-独赢&总分 102-进球大小&两队都进球
    // 107-双重机会&两队都进球 
    // 339-拳击的独赢&准确回合数

    // ## 列表页的取值，分2个值相加，即 a+b 的形式，规则如下
    // 1. b取 最里层ol 的 `on`
    // 2. 当b的值里含有 `主胜` 或者 `客胜` 字样时，b 为空字符串
    // 3. 当 `ots` 值是 `T1` 时，a 取 `mhn`,当 `ots` 值是 `T2` 时，a 取 `man`,
    // 4. 当 玩法id 字段 `hpid` ,为 2 或者 173 或者 38 或者 114 时，a 为空字符串

    // console.error('get_handicap', ol_obj, mid_obj)
    let text = ''
    let hv = ''
    // 展示用的 + 投注项
    let detail_mark = [3,13,69,71,102,107,101,106,105,171,216,220,221,271,272,339]
    let lsit_mark = [2,173,38,114]
    // 特殊玩法 
    let list_head = [359,31,340,383,13,102,351,101,107,347,105,106,345,346,348,349,353,360,384]
    // vr 前后2 玩法
    let vr_hpid = [20034,20035,20036,20037,20038]

    // 列表的 次要玩法
    if(other.secondary_paly){
        if(["Under",'Over'].includes(ol_obj.ot)){
            text = ol_obj.on.split(' ')[0] || ''
            hv = ol_obj.on.split(' ')[1] || ''
        }else
        // 波胆 玩法 其他
        if(ol_obj.ot == "Other"){
            text = i18n_t('list.other')
            hv = ''
        }else
        // 独赢 罚牌玩法 / 加时赛 / 冠军
        if( [126,135,136,310,111].includes(ol_obj._hpid*1)) {
            if(ol_obj.ots == 'T1'){
                text = mid_obj.mhn 
            }
            if(ol_obj.ots == 'T2'){
                text = mid_obj.man
            }
            if(ol_obj.ots == ''){
                text = ol_obj.onb
            }
        }else
        // 让球 
        if([33,113,306].includes(ol_obj._hpid*1)) {
            if(ol_obj.ots == 'T1'){
                text = mid_obj.mhn 
            }
            if(ol_obj.ots == 'T2'){
                text = mid_obj.man
            }
            hv = ol_obj.on
        }else
        // 特色玩法 拼接
        if(ol_obj.ot.includes('And')) {
            if(ol_obj.ots == 'T1'){
                text = mid_obj.mhn 
            }
            if(ol_obj.ots == 'T2'){
                text = mid_obj.man
            }
            // 平局 
            if(ol_obj.ots == ''){
                text = ol_obj.onb
                hv = ol_obj.on
            }else{
                let text_ = ol_obj.onb.split('&')
                text = text + " & " + text_[1]
                hv = ol_obj.on
            }
           
        }else {
            text = ol_obj.on
            hv = ''
        }

    } else{
        // vr 体育的 赛狗 赛马 泥地摩托  摩托
        if(other.bet_type == 'vr_bet' && ['1002','1011','1009','1010'].includes(ol_obj._csid) ){
            if(vr_hpid.includes(ol_obj._hpid*1)){
                hv = ol_obj.ot.split('/')
                text = hv.map(item => {
                    return {
                        text: lodash_.get(mid_obj,`teams[${item - 1}]`,''),
                        hv: item
                    }
                })
            }else if(20033 == ol_obj._hpid){
                text = [{
                    text:lodash_.get(mid_obj,`teams[${ol_obj.ot - 1}]`,''),
                    hv: ol_obj.ot
                }]
            }else {
                text = `${ol_obj.otv || ''}` 
            }
        
        }else{
            // 详情
            if(other.is_detail){
                // 有球头 球头需要变色
                if(hl_obj.hv){
                    text = ol_obj.ott || '' 
                    hv = ol_obj.on || ''
                }else{
                    text = `${ol_obj.ott || ''} ${ol_obj.on || ''}`  
                    hv = ''
                }
                if(detail_mark.includes(ol_obj._hpid*1) && ol_obj.ot == 'X' ){
                    text = `${ol_obj.otv || ''}` 
                    hv = ''
                }
                // 特殊玩法
                if(list_head.includes(ol_obj._hpid*1)){
                    text = `${ol_obj.otv || ''}` 
                    hv = ''
                }

            }else{
                let a = '' ,b = '' 
                b = ol_obj.on 
                // vr 赛事 特殊处理
                if(other.bet_type == 'vr_bet'){

                    if(ol_obj.ots == 'T1'){
                        a = mid_obj.teams[0] || ''
                    }
                    if(ol_obj.ots == 'T2'){
                        a = mid_obj.teams[1] || ''
                    }
                } else {
                    if(ol_obj.ots == 'T1'){
                        a = mid_obj.mhn 
                    }
                    if(ol_obj.ots == 'T2'){
                        a = mid_obj.man
                    }
                }
            
                // 加入是否有球头判断 
                if(['T1','T2'].includes(ol_obj.ots) && !hl_obj.hv){
                    b = ''
                }

                if(lsit_mark.includes(ol_obj._hpid*1)){
                    a = ''
                }
                // 首页大小类玩法
                if(['Over',"Under"].includes(ol_obj.ot)){
                    // h5数据格式和pc不一样
                    a = ol_obj.on.split(' ')[0] || ''
                    b = ol_obj.on.split(' ')[1] || ''
                }
                    
                // 平 不变色
                if(ol_obj.ot == 'X'){
                    text = `${b || '' }` 
                }else{
                    text = a
                    hv = b
                }
            }
        }
    }

    return {
        text,
        hv,
    }
}

// 获取投注项 基准分
const get_score_config = (obj={}) => {
    let query = null;
    if(obj.device_type == 1){
        // h5 数据仓库
        query = h5_match_data_switch(obj.match_ctr)
    }else{
        // pc 数据仓库
        query = pc_match_data_switch(obj.match_ctr)
    }
    const mid_obj = lodash_.get(query.list_to_obj, `mid_obj.${obj.matchId}_`, {})
    const ol_obj = lodash_.get(query.list_to_obj, `ol_obj.${obj.matchId}_${obj.playOptionsId}`, {})

    return calc_bifen(mid_obj.msc,mid_obj.csid,mid_obj.ms,ol_obj._hpid)
}

// 查询当前盘口是否健在
const get_market_is_show = (obj={}) =>{
    let query = null;
    if(obj.device_type == 1){
        // h5 数据仓库
        query = h5_match_data_switch(obj.match_ctr)
    }else{
        // pc 数据仓库
        query = pc_match_data_switch(obj.match_ctr)
    }
    const hl_obj = lodash_.get(query.list_to_obj, `hl_obj.${obj.matchId}_${obj.marketId}`, {})

    return !!hl_obj.hid
}
const go_to_bet = (ol_item, match_data_type) => {
    console.log(MenuData)
    // 如果是赛果详情
    if(PageSourceData.route_name == 'match_result') return
    const {oid,_hid,_hn,_mid,_hpid } = ol_item
    let bet_type = 'common_bet'
    if(MenuData.is_esports()){
        bet_type ="esports_bet"
    }else if(MenuData.is_kemp()){
        bet_type ="guanjun_bet"
    }else if(MenuData.is_vr()){
        bet_type ="vr_bet"
    }
    let params = {
      oid, // 投注项id ol_obj
      _hid, // hl_obj 
      _hn,  // hn_obj
      _mid,  //赛事id mid_obj
    }
    let other = {
      is_detail: (match_data_type && match_data_type == "h5_list") ? false : true,
      // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
      // 根据赛事纬度判断当前赛事属于 那种投注类型
      bet_type,
      // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
      device_type: 1,  
      // 数据仓库类型
      match_data_type: match_data_type || "h5_detail",
  }
    set_bet_obj_config(params,other)
}   
export {
    get_query_bet_amount_common,
    get_query_bet_amount_pre,
    get_query_bet_amount_esports_or_vr,
    submit_handle,
    set_bet_obj_config,
    get_score_config,
    get_market_is_show,
    // 订阅投注项的 ws
    set_market_id_to_ws,
    bet_special_series_change,
    go_to_bet,
    get_lastest_market_info,
}