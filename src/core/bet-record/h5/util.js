import lodash from "lodash"
import { i18n_t } from "src/boot/i18n.js";

// 按什么排序  1-投注时间  2-默认排序（结算时间）  3-开赛时间
export const enum_order_by = [1, 2, 3]
// 展示多长时间的注单记录  (1:今天 2:昨日 3:七日内 4:一月内)
export const enum_time_type = [1, 2, 3, 4]


export const bet_result = {
    "2": i18n_t("bet_record.bet_no_status02"), //'走水',
    "3": i18n_t("bet_record.bet_no_status03"), //'输',
    "4": i18n_t("bet_record.bet_no_status04"), //'赢',
    "5": i18n_t("bet_record.bet_no_status05"), //'赢半',
    "6": i18n_t("bet_record.bet_no_status06"), //'输半',
    "7": i18n_t("bet_record.bet_no_status07"), //'比赛取消',
    "8": i18n_t("bet_record.bet_no_status08"), //'比赛延期',
    "11": i18n_t("bet_record.bet_no_status11"), // '比赛延迟',
    "12": i18n_t("bet_record.bet_no_status12"), // '比赛中断',
    "15": i18n_t("bet_record.bet_no_status15"), // '比赛放弃'
}

export const outcome = {
    "2": i18n_t("bet_record.bet_no_status02"), //'走水',
    "3": i18n_t("bet_record.bet_no_status03"), //'输',
    "4": i18n_t("bet_record.bet_no_status04"), //'赢',
    "5": i18n_t("bet_record.bet_no_status05"), //'赢半',
    "6": i18n_t("bet_record.bet_no_status06"), //'输半',
}

// PC 投注记录提示
// "msg_1": "此记录将显示所有未派彩的投注",
// "msg_2": "此记录将显示今天所有已派奖彩的投注",
// "msg_3": "此记录将显示昨天所有已派奖彩的投注",
// "msg_4": "此记录将显示7天内所有已派奖彩的投注",
// "msg_5": "此记录将显示30天内所有已派奖彩的投注",
// "msg_6": "此记录将显示所选范围内所有已派彩的投注",
// "msg_7": "此记录将显示所有已预约的投注"
export const msgList = [
    "bet_record.msg_1",
    "bet_record.msg_2",
    "bet_record.msg_3",
    "bet_record.msg_4",
    "bet_record.msg_5",
    "bet_record.msg_6",
    "bet_record.msg_7"
]

/**
 * 返回订单状态(带有输赢和其他状态)
 * orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败)
 * @param {*} data_b 
 * @returns 
 */
export const calc_text = (data_b) => {
    let color = 'black'
    let text = ''
    switch (data_b.orderStatus) {
        case '0':
            text = i18n_t('bet_record.successful_betting')
            color = 'green'
            break;
        case '1':
            let flag = data_b.seriesType == '1' && data_b.orderVOS[0]
            if (flag) {   //单关
                if (+data_b.preBetAmount > 0) {
                    // 提前结算的输赢单独一套逻辑算
                    let difference = data_b.backAmount - data_b.orderAmountTotal
                    // 赢
                    if (difference > 0) {
                        color = 'red'
                        text = bet_result['4']
                    } else if (difference < 0) {
                        // 输
                        text = bet_result['3']
                    } else {  // 走水
                        text = bet_result['2']
                    }
                    break;
                }
                let betresult = data_b.orderVOS[0]?.betResult || ''
                if (betresult == 13 || betresult == 16) {
                    text = i18n_t('bet_record.invalid')
                } else {
                    if (betresult == 4 || betresult == 5) {
                        color = 'red'
                    }
                    text = bet_result[betresult] || ''
                }
            } else {  //串关
                if (data_b.outcome == 4 || data_b.outcome == 5) {
                    color = 'red'
                }
                text = outcome[data_b.outcome] || i18n_t('bet_record.successful_betting')
            }
            break;
        case '2':
            text = i18n_t('bet_record.invalid_bet')
            color = 'gray'
            break
        case '3':
            text = i18n_t('bet_record.confirming')
            color = 'orange'
            break
        case '4':
            text = i18n_t('bet.bet_err')
            color = 'red'
            break
        default:
            break
    }
    return { text, color }
}

/**
 * 返回订单状态(只显示投注成功、投注失败)
 * orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败)
 * @param {*} data_b 
 * @returns 
 */
export const calc_text_only_status = (data_b) => {
    let color = 'black'
    let text = ''
    switch (data_b.orderStatus) {
        case '0':
        case '1':
            text = i18n_t('bet_record.successful_betting')
            color = 'green'
            break;
        case '2':
            text = i18n_t('bet_record.invalid_bet')
            color = 'gray'
            break
        case '3':
            text = i18n_t('bet_record.confirming')
            color = 'orange'
            break
        case '4':
            text = i18n_t('bet.bet_err')
            color = 'red'
            break
        default:
            break
    }
    return { text, color }
}

// 根据状态过滤，显示提前结算的列表
export const filter_early_list = (list_data, bol, _index) => {
    let all_list = lodash.cloneDeep(list_data)
    if (bol) {
        lodash.forEach(all_list, (list_data, key) => {
            list_data.data = lodash.filter(list_data.data, item => {
                if(_index === 0) {
                    // 未结算(提前结算) enablePreSettle:true
                    return item.enablePreSettle
                } else if(_index === 1) {
                    // 已结算(提前结算) preBetAmount > 0
                    return item.preBetAmount > 0
                } else if(_index === 2) {
                    // 预约(已失效) preOrderStatus: 2,3,4
                    return [2,3,4].includes(item.preOrderStatus)
                }
            })
            if (!list_data.data.length) {
                delete all_list[key]
            }
        })
    }
    return all_list
}


