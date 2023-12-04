import lodash from "lodash"
import { t } from "src/boot/i18n.js";

// 按什么排序  1-投注时间  2-默认排序（结算时间）  3-开赛时间
export const enum_order_by = [1, 2, 3]
// 展示多长时间的注单记录  (1:今天 2:昨日 3:七日内 4:一月内)
export const enum_time_type = [1, 2, 3, 4]


export const bet_result = {
    "2": t("bet_record.bet_no_status02"), //'走水',
    "3": t("bet_record.bet_no_status03"), //'输',
    "4": t("bet_record.bet_no_status04"), //'赢',
    "5": t("bet_record.bet_no_status05"), //'赢半',
    "6": t("bet_record.bet_no_status06"), //'输半',
    "7": t("bet_record.bet_no_status07"), //'比赛取消',
    "8": t("bet_record.bet_no_status08"), //'比赛延期',
    "11": t("bet_record.bet_no_status11"), // '比赛延迟',
    "12": t("bet_record.bet_no_status12"), // '比赛中断',
    "15": t("bet_record.bet_no_status15"), // '比赛放弃'
}

export const outcome = {
    "2": t("bet_record.bet_no_status02"), //'走水',
    "3": t("bet_record.bet_no_status03"), //'输',
    "4": t("bet_record.bet_no_status04"), //'赢',
    "5": t("bet_record.bet_no_status05"), //'赢半',
    "6": t("bet_record.bet_no_status06"), //'输半',
}

/**
 * 返回订单状态
 * orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败)
 * @param {*} data_b 
 * @returns 
 */
export const calc_text = (data_b) => {
    let color = 'black'
    let text = ''
    switch (data_b.orderStatus) {
        case '0':
            text = t('bet_record.successful_betting')
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
                    text = t('bet_record.invalid')
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
                text = outcome[data_b.outcome] || t('bet_record.successful_betting')
            }
            break;
        case '2':
            text = t('bet_record.invalid_bet')
            color = 'gray'
            break
        case '3':
            text = t('bet_record.confirming')
            color = 'orange'
            break
        case '4':
            text = t('bet.bet_err')
            color = 'red'
            break
        default:
            break
    }
    return { text, color }
}

// 根据状态过滤，显示提前结算的列表
export const filter_early_list = (list_data, bol) => {
    let all_list = lodash.cloneDeep(list_data)
    if (bol) {
        lodash.forEach(all_list, (list_data, key) => {
            list_data.data = lodash.filter(list_data.data, item => {
                return item.enablePreSettle
            })
            if (!list_data.data.length) {
                delete all_list[key]
            }
        })
    }
    return all_list
}

