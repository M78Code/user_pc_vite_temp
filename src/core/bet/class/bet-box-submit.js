import { api_betting } from "src/api/index.js"
import BetData from "./bet-data-class.js"
import BetViewDataClass from "./bet-view-data-class.js"
import BetWsMessage from "./bet-ws-message.js"
import { compute_value_by_cur_odd_type } from "src/core/format/module/format-odds-conversion-mixin.js"
import { getSeriesCountJointNumber } from "src/core/bet/common-helper/module/bet-single-config.js"
import { 
    MatchDataWarehouse_PC_List_Common, 
    MatchDataWarehouse_PC_Detail_Common,
    MatchDataWarehouse_ouzhou_PC_five_league_List_Common,
    MatchDataWarehouse_ouzhou_PC_hots_List_Common,
    MatchDataWarehouse_ouzhou_PC_l5mins_List_Common,
    MatchDataWarehouse_H5_List_Common,
    MatchDataWarehouse_H5_Detail_Common,
    MatchDataWarehouse_H5_List_Hot_Main,
    MatchDataWarehouse_H5_List_Jingxuan,
    MatchDataWarehouse_H5_Detail_Jingxuan,
    
 } from 'src/core/index.js'
import lodash_ from "lodash"
import { ALL_SPORT_PLAY } from "src/core/constant/config/play-mapping.js"
import { MenuData,UserCtr,useMittEmit, MITT_TYPES  } from "src/core/index.js"

let time_out = null
let time_api_out = null
let count_api = 0 
// 获取限额请求数据
// bet_list 投注列表
// is_single 是否单关/串关 
// is_merge  是否单关合并
const set_min_max_money = (bet_list, is_single, is_merge) => {
    
    let order_min_max_money = bet_list.map(item => {
        let obj = {
            "sportId": item.sportId,   // 赛种id
            "marketId": item.marketId,  //盘口id
            "deviceType": BetData.deviceType,  // 设备类型 "设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备"
            "matchId": item.matchId,  // 赛事id
            "oddsFinally": compute_value_by_cur_odd_type(item.odds, '', '', item.sportId),  //赔率
            "oddsValue": item.odds,  // 赔率 万位
            "playId": item.playId,   // 玩法id
            "playOptionId": item.playOptionsId,   // 投注项id
            "playOptions": item.playOptions,   // 投注项配置项
            "seriesType": is_single ? 1 : 2,  // 串关类型 // 串关类型 1 单关 2串关
            "matchProcessId": item.match_ms + '',  // 赛事阶段
            "scoreBenchmark": "",   // 基准分
            "tenantId": 1,   // 商户id
            "tournamentLevel": item.tournamentLevel,   // 联赛级别
            "tournamentId": item.tournamentId,   // 联赛id
            "dataSource": item.dataSource,   // 数据源
            "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
            // "userId": UserCtr.get_uid()
        }
        // 冠军没有赛事阶段
        if(MenuData.is_kemp()){
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
        order_list = single_bet.map(obj => {
            let bet_s_list = []
            bet_list.forEach(item => {
                let bet_s_obj = {
                    "sportId": item.sportId,   // 赛种id
                    "matchId": item.matchId,   // 赛事id
                    "tournamentId": item.tournamentId,   // 联赛id
                    "scoreBenchmark": "",    // 基准分
                    "betAmount": obj.bet_amount || 10,  //投注金额         
                    "placeNum": item.placeNum, //盘口坑位
                    "marketId": item.marketId,  //盘口id
                    "playOptionsId": item.playOptionsId,   // 投注项id
                    "marketTypeFinally": "EU",     // 欧洲版默认是欧洲盘 HK代表香港盘
                    "odds": item.odds,  // 赔率 万位
                    "oddFinally": compute_value_by_cur_odd_type(item.odds, '', '', item.sportId),  //赔率
                    "playName": item.playName, //玩法名称
                    "sportName": item.sportName,  // 球种名称
                    "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
                    "matchName": item.matchName,   //赛事名称
                    "playOptionName": item.playOptionName,   // 投注项名称
                    "playOptions": item.playOptions,   // 投注项配置项
                    "tournamentLevel": item.tournamentLevel,   // 联赛级别
                    "playId": item.playId,   // 玩法id
                    "dataSource": item.dataSource,   // 数据源
                }
               
                bet_s_list.push(bet_s_obj)
            })

            let obj_s = {
                "seriesSum": 1,   // 串关数量
                "seriesType": obj.id,  // 串关类型(单关、串关)  1-单关, 2-串关 3, 冠军
                "fullBet": 0,   // 是否满额投注，1：是，0：否
                "orderDetailList": bet_s_list
            }
            return obj_s
        })

    } else {
        let single_list = bet_list.map((item, index) => {
           let bet_s_obj = {
                "sportId": item.sportId,   // 赛种id
                "matchId": item.matchId,   // 赛事id
                "tournamentId": item.tournamentId,   // 联赛id
                "scoreBenchmark": "",    // 基准分
                "betAmount": BetData.bet_amount,  //投注金额         
                "placeNum": item.placeNum, //盘口坑位
                "marketId": item.marketId,  //盘口id
                "playOptionsId": item.playOptionsId,   // 投注项id
                "marketTypeFinally": "EU",     // 欧洲版默认是欧洲盘 HK代表香港盘
                "odds": item.odds,  // 赔率 万位
                "oddFinally": compute_value_by_cur_odd_type(item.odds, '', '', item.sportId),  //赔率
                "playName": item.playName, //玩法名称
                "sportName": item.sportName,  // 球种名称
                "matchType": item.matchType, // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事
                "matchName": item.matchName,   //赛事名称
                "playOptionName": item.playOptionName,   // 投注项名称
                "playOptions": item.playOptions,   // 投注项配置项
                "tournamentLevel": item.tournamentLevel,   // 联赛级别
                "playId": item.playId,   // 玩法id
                "dataSource": item.dataSource,   // 数据源
            }
            // 预约投注
            // 需要用对应的数据 对投注数据进行覆盖
            bet_s_obj = {
                ...bet_s_obj,
                ...BetData.bet_pre_obj[item.playOptionsId]
            }

            return bet_s_obj

        }) || []
        
        order_list = {
            "seriesSum": 1,   // 串关数量
            "seriesType": 1,  // 串关类型(单关、串关)  1-单关, 2-串关 3, 冠军
            "seriesValues": "单关",  // 串关值 2串1 3串1...
            "fullBet": 0,   // 是否满额投注，1：是，0：否
            "orderDetailList": single_list
        }
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
            console.error('BetViewDataClass.is_finally',BetViewDataClass.is_finally)
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
                },2000)
            }else{
                count_api = 0
                clearTimeout(time_api_out)
            }
            // 投注失败
            if([4,2].includes(order_status*1)){
                set_error_message_config({code:"0402018",message:''},'bet')
                // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                BetViewDataClass.set_bet_order_status(4)
            }
            if([0,1].includes(order_status*1)){
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
    // console.error('chufa',obj)
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
            const latestMarketInfo = lodash_.get(res, 'data.latestMarketInfo')
            // 获取预约投注项
            set_bet_pre_list(latestMarketInfo)
        } else {
            set_catch_error_query_bet_max(params)
            // set_error_message_config(res)
        }
    }).catch(ws => {
        set_catch_error_query_bet_max(params)
    })
}

// 限额错误 设置默认值
const set_catch_error_query_bet_max = (params ={}) => {
    let oid = lodash_.get(params.orderMaxBetMoney, '[0].playOptionsId')
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
            const latestMarketInfo = lodash_.get(res, 'data.latestMarketInfo[0]')
            // 获取预约投注项
            BetData.set_bet_appoint_obj(latestMarketInfo)

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
const set_bet_pre_list = bet_appoint => {
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

// 提交投注信息 
const submit_handle = type => {
      
    // 单关才有预约投注
     // 是否预约投注  1 预约  0 不预约
    //  是否合并投注  bet_single_list。length  0:1个 1:多个
    let pre_type = 0
    let milt_single = 0
    if(BetData.is_bet_single){
        pre_type = BetData.is_bet_pre ? 1 : 0
        milt_single = BetData.bet_single_list.length > 1 ? 1 : 0
    }

    let params = {
        "userId": UserCtr.get_uid(),
        "acceptOdds": 2,  // 接受赔率变化情况
        "tenantId": 1,
        "deviceType": BetData.deviceType,  // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
        "currencyCode": "CNY",  // 币种
        "deviceImei": "",   // 设备imei码，只有手机有，没有不添加
        "fpId": "",  // 指纹55555555id 
        "openMiltSingle": milt_single,  // 是否为多个单关 0:1个 1:多个
        "preBet": pre_type,  // 1 预约  0 不预约
        seriesOrders: []
    }
    let seriesOrders = []
    let orderDetailList = []
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
    }
    // 投注内容
    params.seriesOrders = seriesOrders
    // 测试投注失败
    // BetViewDataClass.set_bet_order_status(5)
    // return
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
                // 订单状态 0:投注失败 1: 投注成功 2: 订单确认中
                let status_code = orderDetailRespList[0].orderStatusCode
                let status = 2
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
                order_state = status
                // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                BetViewDataClass.set_bet_order_status(status)
            }else{
                BetViewDataClass.set_orderNo_bet_obj(orderDetailRespList)
                BetViewDataClass.set_orderNo_bet_single_obj(seriesOrderRespList)

                let number_list = []
                number_list = seriesOrderRespList.filter(item=> item.orderStatusCode == 1)
                
                if(seriesOrderRespList.length == number_list.length){
                    // 1-投注状态,2-投注中状态,3-投注成功状态(主要控制完成按钮),4-投注失败状态,5-投注项失效
                    BetViewDataClass.set_bet_order_status(3)
                }else{
                    BetViewDataClass.set_bet_order_status(2)
                }

            }
             // 投注成功 更新余额
             UserCtr.get_balance()
            // 投注成功 获取余额 获取投注记录数量
            if(order_state == 3){
               
                // pc 有的 
                if(params.deviceType == 2){
                    // 投注成功后获取投注记录数据 24小时内的
                    useMittEmit(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG)
                }
            }
            // 投注确认中 ws请求
            if(order_state == 2){
                let order_no =  lodash_.get(orderDetailRespList,'[0].orderNo', '')
                set_order_status_info(order_no)

                let obj = {};
                obj.hid = ''
                obj.mid = ''
                // 盘口Id，多个Id使用逗号分隔
                // 赛事Id，多个Id使用逗号分隔
                if(BetData.is_bet_single){
                    seriesOrders.orderDetailList.forEach( item => {
                        obj.hid = item.marketId 
                        obj.mid = item.matchId 
                    })
                    // BetData.set_bet_list_info(set_bet_odds_after(BetData.bet_single_list))
                }else{
                    seriesOrders[0].orderDetailList.forEach( item => {
                        obj.hid = item.marketId 
                        obj.mid = item.matchId 
                    })
                    // BetData.set_bet_list_info(set_bet_odds_after(BetData.bet_s_list))
                }
                // 用户赔率分组
                obj.marketLevel = lodash_.get(UserCtr.user_info,'marketLevel','0');
                obj.esMarketLevel = lodash_.get(UserCtr.user_info,'esMarketLevel','0');
                BetWsMessage.set_bet_c2_message(obj);
            }
        }
        set_error_message_config(res,'bet',order_state)
    }).catch(()=>{
        set_error_message_config({code:"0401038"},'bet')
    })
}

// 设置错误信息 
const set_error_message_config = (res ={},type,order_state) => {

    clearTimeout(time_out)
   
    let obj = {
        code: res.code,
        message: res.message
    }
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
                        message: '投注确认中'
                    }
                    break
                 
                case 3:
                    obj = {
                        code: 200,
                        message: '投注成功'
                    }
                    break
            
                case 4:
                    obj = {
                        code: 500,
                        message: '投注失败'
                    }
                    break
            }
           
        }else{
            obj.message = BetViewDataClass.set_code_message_config(res.code,res.message)
        }
    }

    // 获取限额失败的信息
    BetViewDataClass.set_bet_before_message(obj)

    // 需求清除
    if(clear_time){
        time_out = setTimeout(()=>{
            BetViewDataClass.set_bet_before_message({})
        },5000)
    }
   
}

// 选择投注项数据 
// params 各种id 用于查找数据对应的值 
// other 灵活数据
// const set_bet_obj_config = (mid_obj,hn_obj,hl_obj,ol_obj) =>{
const set_bet_obj_config = (params = {}, other = {}) => {
    console.error('投注项需要数据', params, 'other', other);
    // 切换投注状态
    const { oid, _hid, _hn, _mid } = params

    // 没有投注内容 点击无效
    if(!oid || !_hid || !_mid){
        return
    }
    // 是否上一个投注流程已走完
    BetViewDataClass.set_is_finally(true)
    
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_mode(-1)
    // 重置金额为 0
    BetData.set_bet_amount(0)
    BetData.set_is_bet_pre(false)
    BetViewDataClass.set_bet_before_message({})

    // 没有走数据仓库 提示数据失效
    if(!_mid ){
       set_error_message_config({res:'0402001'},'bet')
    }

    // 有数据的再次点击 为取消投注项
    if(BetData.bet_oid_list.includes(oid)){
       return BetData.set_delete_bet_info(oid)
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
        // 点击投注项 显示投注栏
        BetData.set_h5_bet_box_show(true)
      
        BetData.set_bet_keyboard_show(true)
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
    // 1 ：早盘赛事 ，2： 滚球盘赛事，3：冠军，4：虚拟赛事，5：电竞赛事")
    let matchType = 1
    if ([1, 2].includes(Number(mid_obj.ms))) {
        matchType = 2
    }
    // 冠军
    if(MenuData.is_kemp()){
        matchType = 3
    }

    const play_config = {
        hl_obj,
        hn_obj,
        mid_obj,
        ol_obj,
        hpid: hn_obj.hpid || ol_obj._hpid,
        other,
    }

    const bet_obj = {
        sportId: mid_obj.csid, // 球种id
        matchId: mid_obj.mid,  // 赛事id
        tournamentId: mid_obj.tid,  // 联赛id
        scoreBenchmark: lodash_.get(mid_obj, 'msc[0]'),  //比分
        marketId: hl_obj.hid, //盘口ID
        marketValue: hl_obj.hv,
        playOptionsId: ol_obj.oid, //投注项id
        marketTypeFinally: 'EU',  // 欧洲版默认是欧洲盘 HK代表香港盘
        odds: ol_obj.ov,  //十万位赔率
        oddFinally: compute_value_by_cur_odd_type(ol_obj.ov, '', '', mid_obj.csid), //最终赔率
        sportName: mid_obj.csna, //球种名称
        matchType,  //赛事类型
        matchName: mid_obj.tn, //赛事名称
        playOptionName: ol_obj.on, // 投注项名称
        playOptions: ol_obj.on,   // 投注项
        tournamentLevel: mid_obj.tlev, //联赛级别
        playId: hn_obj.hpid || ol_obj._hpid, //玩法ID
        playName: set_play_name(play_config), //玩法名称
        dataSource: mid_obj.cds, //数据源
        home: mid_obj.mhn, //主队名称
        away: mid_obj.man, //客队名称
        ot: ol_obj.ot, //投注項类型
        placeNum: hl_obj.hn, //盘口坑位
        // 以下为 投注显示或者逻辑计算用到的参数
        bet_type: other.bet_type, // 投注类型
        tid_name: mid_obj.tn,  // 联赛名称
        match_ms: mid_obj.ms, // 赛事阶段
        match_time: mid_obj.mgt, // 开赛时间
        handicap: get_handicap(ol_obj,other.is_detail,mid_obj), // 投注项名称
        mark_score: get_mark_score(ol_obj,mid_obj), // 是否显示基准分
        mbmty: mid_obj.mbmty, //  2 or 4的  都属于电子类型的赛事
    }
    // 冠军 
    if(MenuData.is_kemp()){
        bet_obj.handicap = ol_obj.on
    }

    // 设置投注内容 
    BetData.set_bet_read_write_refer_obj(bet_obj)

    // 订阅投注项的 ws
    set_market_id_to_ws()
    
    // 判断获取限额接口类型
    if(["C01","B03","O01"].includes(bet_obj.dataSource) || [2,4].includes(Number(bet_obj.mbmty)) ||  ['esports_bet','vr_bet'].includes(other.bet_type)){
        // C01/B03/O01  电竞/电竞冠军/VR体育
        get_query_bet_amount_esports_or_vr(bet_obj)
    }else{
        // 获取限额 常规
        get_query_bet_amount_common(bet_obj)
    }
}

// 设置玩法名称
const set_play_name = ({hl_obj,hn_obj,mid_obj,ol_obj,hpid,other}) => {
    let play_name = ALL_SPORT_PLAY[hpid] //玩法名称

    // 需要配置玩法比分的 玩法
    let play_id = [4]
    // 详情 并且本地没有配置玩法
    if(other.is_detail){
        play_name = other.play_name
    }
    let hpn = lodash_.get(mid_obj.play_obj,`hpid_${hpid}.hpn`,'')
    if(hpn){
        play_name = hpn
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
    let hid = []
    let mid = []
    let obj = {}
    let bet_list = []
    // 单关
    if(BetData.is_bet_single){
        bet_list = lodash_.get( BetData,'bet_single_list')
    }else{
        bet_list = lodash_.get( BetData,'bet_s_list')
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
        return {
            ...item,
            match_time,
            playId,
        }
    })
    BetViewDataClass.set_orderNo_bet_obj(order_list)
}

// 获取盘口值 附加值
const get_handicap = (ol_obj = {},is_detail,mid_obj) => {
    // console.error('get_handicap', ol_obj, mid_obj)
    let text = ''
    // 展示用的 + 投注项
    // 两数拼接  
    let home_away_mark = [2, 4, 12, 18, 114, 26, 10, 3 , 33 ,34, 11, 347, 351, 127, 38, 45, 39, 198, 199] // 
    // 首页不需要拼接的
    let home_away_diff = [2, 38]
    // 多位数
    let home_mark_more = [351, 347]
    // 主客队
    let home_away_only = [1, 37, 32]

    // 独赢类
    if(home_away_only.includes(ol_obj._hpid*1)){
        switch(ol_obj.ot){
            case '1':
                // 主
                text= mid_obj.mhn
                break
            case '2':
                // 客
                text = mid_obj.man
                break
            default:
                text = ol_obj.on
                break
        }
        return text
    }

    // 详情 
    if(is_detail){
        // 投注项名称
        text = ol_obj.otv
        // 
        if(home_away_mark.includes(ol_obj._hpid*1)){
            let handicap = text.split(' ')
            handicap = handicap.filter(item => item)
    
            text = `${handicap[0]}${handicap[1] ? `<span class='ty-span'>${handicap[1]}</span>`:''}`
    
            if(home_mark_more.includes(ol_obj._hpid*1)){
                text = `${handicap[0]} ${handicap[1]} ${handicap[2]} <span class='ty-span'>${handicap[3]}</span>`
            }
        }
        return text

    }else{
        // 首页 列表
        text = ol_obj.on
        // 是否需要 玩法拼接
        if(home_away_diff.includes(ol_obj._hpid*1)){

            let handicap = text.split(' ')
            handicap = handicap.filter(item => item)
    
            text = `${handicap[0]}${handicap[1] ? `<span class='ty-span'>${handicap[1]}</span>`:''}`
        }else{
            // 主客队拼接
            switch(ol_obj.ot){
                case '1':
                    // 主
                    text = mid_obj.mhn
                    break
                case '2':
                    // 客
                    text = mid_obj.man
                    break
            }
            text = `${text} <span class='ty-span'>${ol_obj.on}</span>`  
        }
        return text  
    }
}

// 是否显示基准分 
const get_mark_score = (ol_obj,mid_obj) => {
    // debugger
    let score = ''
    // 显示基准分
    // 玩法id 34 33 32 114 92 78 91 77 107 101 13 102 336 28 80 79 11 10 15 5 6 3 12 9 8 14 68 367 7 1 4 2 
    // let playId = [34, 33, 32, 114, 92, 78, 91, 77, 107, 101, 13, 102, 336, 28, 80, 79, 11, 10, 15, 5, 6, 3, 12, 9, 8, 14, 68, 367, 7, 1, 4, 2]
    let play_id = [18, 19, 37, 38, 39, 42, 188, 189, 199]
    // 判断需要显示基准分的玩法
    if(play_id.includes(Number(ol_obj._hpid))){
        let obj = lodash_.get(mid_obj,'msc_obj.S1',{})
        score = `(${obj.home}-${obj.away})`
    }
    return score
}

export {
    get_query_bet_amount_common,
    get_query_bet_amount_pre,
    get_query_bet_amount_esports_or_vr,
    submit_handle,
    set_bet_obj_config,
}