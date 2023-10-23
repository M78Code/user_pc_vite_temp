import { api_betting } from "src/api/index.js"
import BetData from "./bet-data-class.js"
import BetViewDataClass from "./bet-view-data-class.js"
import { compute_value_by_cur_odd_type } from "src/core/format/module/format-odds-conversion-mixin.js"
import UserCtr from "src/core/user-config/user-ctr.js"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { getSeriesCountJointNumber } from "src/core/bet/common-helper/module/bet-single-config.js"
import { 
    MatchDataWarehouse_PC_List_Common, 
    MatchDataWarehouse_PC_Detail_Common,
    MatchDataWarehouse_H5_List_Common,
    MatchDataWarehouse_H5_Detail_Common,
    MatchDataWarehouse_H5_List_Hot_Main,
    MatchDataWarehouse_H5_List_Jingxuan,
    MatchDataWarehouse_H5_Detail_Jingxuan
 } from 'src/core/index.js'
import lodash_ from "lodash"
import { ALL_SPORT_PLAY } from "src/core/constant/config/play-mapping.js"

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
            "userId": UserCtr.get_uid()
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
            console.error("串关投注信息",bet_list)
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
        order_list = bet_list.map((item, index) => {
            let obj = {
                "seriesSum": 1,   // 串关数量
                "seriesType": 1,  // 串关类型(单关、串关)  1-单关, 2-串关 3, 冠军
                "seriesValues": "单关",  // 串关值 2串1 3串1...
                "fullBet": 0,   // 是否满额投注，1：是，0：否
                "orderDetailList": [
                    {
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
                ]
            }

            console.error("投注信息",obj)
            return obj

        }) || []
    }

    return order_list
}


// 获取限额 常规 / 冠军
// obj 投注数据
const get_query_bet_amount_common = (obj) => {
    // console.error('chufa',obj)
    let params = {
        orderMaxBetMoney: []
    }
    // 获取限额请求参数数据
    params.orderMaxBetMoney = get_query_bet_amount_parmas()

    // 获取额度接口合并
    api_betting.query_bet_amount(params).then((res = {}) => {
        if (res.code == 200) {
            BetViewDataClass.set_bet_min_max_money(res.data)
            // 通知页面更新 
            useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)

            // 获取盘口值 
            const latestMarketInfo = lodash_.get(res, 'data.latestMarketInfo')
            // 获取预约投注项
            set_bet_pre_list(latestMarketInfo)
        } else {
            // 获取限额失败的信息
            BetViewDataClass.set_bet_error_code({
                code: res.code,
                message: res.message
            })
        }
    })
}

// 获取限额 电竞/电竞冠军/VR体育
// obj 投注数据
const get_query_bet_amount_esports_or_vr = () => {
    // console.error('chufa',obj)
    let params = {
        orderMaxBetMoney: []
    }
    // 获取限额请求参数数据
    params.orderMaxBetMoney = get_query_bet_amount_parmas()

    // 获取最大值和最小值接口
    api_betting.post_getBetMinAndMaxMoney(params).then((res = {}) => {
        if (res.code == 200) {
            BetViewDataClass.set_bet_min_max_money(res.data,'min_max')
            // 通知页面更新 
            useMittEmit(MITT_TYPES.EMIT_REF_DATA_BET_MONEY)

            // 设置投注项及时比分
            let latestMarketInfo  = lodash_.get(res,'data.latestMarketInfo')
            latestMarketInfo.forEach(item=>{
                let custom_id = lodash_.get(item,'currentMarket[0].id')
                //获取及时比分
                let timerly_basic_score = item.preBetBenchmarkScore
                BetData.set_custom_id_obj(custom_id,'timerly_basic_score',timerly_basic_score)
            })

        } else {
            // 获取限额失败的信息
            BetViewDataClass.set_bet_error_code({
                code: res.code,
                message: res.message
            })
        }
    })
}

// 获取限额 预约投注
// obj 投注数据
const get_query_bet_amount_pre = () => {

    let params = {
        orderMaxBetMoney: []
    }
    // 获取限额请求参数数据
    params.orderMaxBetMoney = get_query_bet_amount_parmas()

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
            // 获取限额失败的信息
            BetViewDataClass.set_bet_error_code({
                code: res.code,
                message: res.message
            })
        }
    })
}

//设置获取限额参数 
const get_query_bet_amount_parmas = () =>{
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
    // 设置投注中状态
    BetViewDataClass.set_bet_order_status(2)

    let params = {
        "userId": UserCtr.get_uid(),
        "acceptOdds": 2,  // 接受赔率变化情况
        "tenantId": 1,
        "deviceType": BetData.deviceType,  // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
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

    api_betting.post_submit_bet_list(params).then(res => {

        if (res.code == 200) {
            setTimeout(() => {
                // 投注成功 更新余额
                UserCtr.get_balance()
                // 投注成功后获取投注记录数据 24小时内的
                useMittEmit(MITT_TYPES.EMIT_TICKRTS_COUNT_CONFIG)
                // 获取
                BetData.set_bet_mode(lodash_.get(res,'data.lock'),-1)
                // 获取投注后的数据列表
                let orderDetailRespList = lodash_.get(res,'data.orderDetailRespList') || []
                set_orderNo_bet_obj(orderDetailRespList)
            }, 1000);
            // 通知页面更新 
        }
        // 设置投注 code 码
        BetViewDataClass.set_bet_error_code(res)
    })
}

// 选择投注项数据 
// params 各种id 用于查找数据对应的值 
// other 灵活数据
// const set_bet_obj_config = (mid_obj,hn_obj,hl_obj,ol_obj) =>{
const set_bet_obj_config = (params = {}, other = {}) => {
    // console.log('投注项需要数据', params, 'other', other);
    // 切换投注状态
    BetViewDataClass.set_bet_order_status(1)
    BetData.set_bet_mode(-1)

    const { oid, _hid, _hn, _mid } = params
     // 列表数据仓库
     let query = {}
    // device_type 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备 
    if(other.device_type == 1){
        query = h5_match_data_switch(other.match_data_type)
        useMittEmit(MITT_TYPES.EMIT_REF_SHOW_BET_BOX,true)
        BetViewDataClass.set_bet_show(true)
        BetViewDataClass.set_bet_keyboard_show(false)
    }else{
        query = MatchDataWarehouse_PC_List_Common
        // 判断是不是详情点击 详情使用详情数据仓库
        if (other.is_detail) {
            query = MatchDataWarehouse_PC_Detail_Common
        }
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
  
    // 列表和详情 取值字段不同
    // 投注项 显示
    let handicap = '', handicap_attach = ''
    if (other.is_detail) {
        // 列表数据
        let text = ''
        switch(ol_obj.ot){
            case '1':
                // 主
                text= mid_obj.mhn
                break
            case '2':
                // 客
                text = mid_obj.man
                break
        }
        handicap = text
        //展示用的 + 投注项  
        if(get_handicap(ol_obj)){
            handicap_attach = ol_obj.on
        }
       
    }else{
        // 列表数据
        let text = ''
        switch(ol_obj.ot){
            case '1':
                // 主
                text= mid_obj.mhn
                break
            case '2':
                // 客
                text = mid_obj.man
                break
        }
        handicap = text
        //展示用的 + 投注项  
        if(get_handicap(ol_obj)){
            handicap_attach = ol_obj.on
        }
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
        playName: ALL_SPORT_PLAY[hn_obj.hpid || ol_obj._hpid], //玩法名称
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
        handicap, // 盘盘口值
        handicap_attach, // 盘盘口值
        show_handicap: get_handicap(ol_obj),
        show_mark_score: get_mark_score(ol_obj), // 是否显示基准分
        mbmty: mid_obj.mbmty, //  2 or 4的  都属于电子类型的赛事
    }
    // 设置投注内容 
    BetData.set_bet_read_write_refer_obj(bet_obj)

    // 判断获取限额接口类型
    if(["C01","B03","O01"].includes(bet_obj.dataSource) || [2,4].includes(Number(bet_obj.mbmty)) ||  ['esports_bet','vr_bet'].includes(other.bet_type)){
        // C01/B03/O01  电竞/电竞冠军/VR体育
        get_query_bet_amount_esports_or_vr(bet_obj)
    }else{
        // 获取限额 常规
        get_query_bet_amount_common(bet_obj)
    }
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
    }
    return query
}

// 获取盘口值 附加值
const get_handicap = ol_obj => {
    // 需要显示主客队名称的 玩法id
    // 直接显示投注项 [1, 7, 367, 344, 68, 14, 8, 9, 17, 341, 368, 342, 369, 344, 68, 14, 23, 21, 22, 12, 24, 76, 104, 340, 359]
    // 展示用的 + 投注项  

    let playId = [2,4, 12, 18, 114, 26, 10, 3 , 33 ,34, 11, 351, 347]
    // 直接显示投注项
    return playId.includes(Number(ol_obj._hpid))
}
1
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
// 是否显示基准分 
const get_mark_score = ol_obj => {
    // 显示基准分
    // 玩法id 34 33 32 114 92 78 91 77 107 101 13 102 336 28 80 79 11 10 15 5 6 3 12 9 8 14 68 367 7 1 4 2 
    let playId = [34, 33, 32, 114, 92, 78, 91, 77, 107, 101, 13, 102, 336, 28, 80, 79, 11, 10, 15, 5, 6, 3, 12, 9, 8, 14, 68, 367, 7, 1, 4, 2]
    // 判断需要显示基准分的玩法
    return !playId.includes(Number(ol_obj._hpid))
}

export {
    get_query_bet_amount_common,
    get_query_bet_amount_pre,
    get_query_bet_amount_esports_or_vr,
    submit_handle,
    set_bet_obj_config,
}