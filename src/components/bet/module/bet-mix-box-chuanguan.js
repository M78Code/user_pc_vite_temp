// 串关相关方法


import BetData from "./class/bet-data-class.js";
import SetData from "src\core\bet\bet-data-ctr-class.js";



/**
 *@description 展开串关类型
 *@return {Undefined} undefined
 */
const spread_options = () => {
    let ele = scroll_box_ele.value
    if (!ele) {
        return
    }

    if (get_bet_list.value.length == 2) {
        return
    };

    let ch = ele.clientHeight,
        sh = ele.scrollHeight,
        rem_1 = window.innerWidth * 100 / 375;

    set_is_spread(!get_is_spread.value);
    //设置投注项滚动距离，同步程序走完后再处理逻辑
    $nextTick(() => {
        if (get_is_spread.value) {
            ele.scrollTop = sh + 0.56 * rem_1 - ch;
        } else {
            ele.scrollTop = sh - ch;
        }

    })
}


/**
 *@description 串关投注后的逻辑处理
 *@return {Undefined} undefined
 */
const mix_bet = () => {
    submit_betlist((code, data, msg) => {
        if (exist_code.value == '666') {
            return
        }; // 10秒没有code码返回状态不做跟新

        exist_code.value = code;

        if (code == 200) {
            series_order_respList.value = data.seriesOrderRespList;
            let order_ing_ = [];

            series_order_respList.value.forEach(item => {
                add_orderno({
                    count: item.seriesSum,
                    num: item.orderNo
                }) //将订单号存到对象集合中
                if (item.orderStatusCode == 2) {
                    order_ing_.push(item.orderNo)
                }
            })
            set_order_ing({
                change_: 1,
                value_: order_ing_
            })

            order_detail_resp_list.value = data.orderDetailRespList;
            bet_money_total.value = data.betMoneyTotal;
            max_win_money_total.value = data.maxWinMoneyTotal;

            if (data.lock == 1 && order_ing_.length) { //新流程
                set_new_bet(true)
                clearTimeout(timer_count_2)
                timer_count_2 = setTimeout(() => { //25秒还是有订单在确认中，直接给状态让去注单记录中查看
                    if (get_new_bet.value) {
                        mixnew_bet = true
                        set_bet_status(1);
                        tips_msg = i18n.t('bet.err_msg08');
                        clearInterval(timer_count);
                        timer_count = null;
                    }
                }, 25000);

                // c201消息处理
                useMittOn(MITT_TYPES.EMIT_C201_UPDATE, c201_update_handler2)

                clearTimeout(timer_count_1)
                timer_count_1 = setTimeout(() => { //5秒socket没有返回订单状态的话，调接口拉取
                    clearInterval(timer_count)
                    timer_count = setInterval(() => {
                        if (get_order_ing.value.length) {
                            let param = get_order_ing.value.toString();
                            api_betting.query_order_status({
                                orderNos: param
                            }).then(res => {
                                if (res.code == 200 && get_bet_status.value != 1 && res.data) {
                                    query_order_obj.value = res.data

                                    query_order_obj.value.forEach(item => {
                                        if (item.status == 4) { //新流程失败了需要记录
                                            is_new_bet.value = true
                                        }
                                    })
                                }
                            })
                        } else {
                            clearInterval(timer_count);
                            timer_count = null;
                            clearTimeout(timer_count_1);
                            timer_count_1 = null;
                            clearTimeout(timer_count_2);
                            timer_count_2 = null;
                        }
                    }, 2000);
                }, 5000);

            } else { //老流程
                if (order_ing_.length) {
                    set_bet_status(6);
                    tips_msg = i18n.t('bet.err_msg07');

                    clearTimeout(timer_count_1)
                    timer_count_1 = setTimeout(() => { //5秒socket没有返回订单状态的话，调接口拉取
                        clearInterval(timer_count)
                        timer_count = setInterval(() => {
                            if (get_order_ing.value.length) {
                                let param = get_order_ing.value.toString();
                                api_betting.query_order_status({
                                    orderNos: param
                                }).then(res => {
                                    if (res.code == 200 && res.data) {
                                        query_order_obj.value = res.data
                                    }
                                })
                            } else {
                                clearInterval(timer_count);
                                timer_count = null;
                            }
                        }, 2000);
                    }, 5000);
                } else {
                    set_bet_status(3);
                }
                // collect_match()
            }

        } else {
            set_toast({
                'txt': i18n.t('bet.bet_err'),
                hide_time: 3000
            });
            back_msg({
                code,
                data,
                msg
            }, (status, msg) => {
                switch (status) {
                    case 1:
                        need_bet_again.value = true
                        // 同步程序走完后再处理逻辑
                        $nextTick(() => {
                            if (!get_odds_change.value) {
                                set_bet_status(1);
                            }
                        })

                        break;
                    case 2: //对应红色提示语的情况,点击确定移除投注项
                        set_bet_status(4);
                        tips_msg = msg;
                        break;
                    case 3:
                        set_bet_status(1);
                        tips_msg = msg;
                        break;
                    case 4:
                        need_bet_again.value = true
                        set_bet_status(1);
                        break;
                    default:
                        break;
                }
            });
        }
    })

}


/**
 *@description 串关注单状态变动需要跟新最高可盈
 *@param {Number} value 最高可赢变动多少
 *@param {Number} value2 总投注额变动多少
 *@return {Undefined} undefined
 */
const update_money = (value = 0, value2 = 0) => {
    max_win_money_total.value += value * 100;
    bet_money_total.value += value2 * 100;
}