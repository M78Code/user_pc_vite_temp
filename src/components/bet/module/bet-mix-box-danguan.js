// 串关相关方法


import BetData from "./class/bet-data-class.js";
import SetData from "src/core/bet/bet-data-ctr-class.js";



//单关5秒后还是在确认中状态的话，轮询查询订单信息
const query_order = () => {
    let param = {
        orderNos: get_order_no.value
    }

    if (!param.orderNos) {
        return
    }

    api_betting.get_orderstatus(param).then(res => {
        if (!(BetData.get_bet_status == 6 || BetData.get_new_bet)) {
            return
        }

        BetData.query_order_obj = res.data

        let data = _.get(res, 'data[0]');
        let code = _.get(res, 'code');

        if (code != 200 || !res.data) {
            return
        };

        if (data.status == 0) { //投注成功
            clearInterval(timer_count);
            BetData.timer_count = null;
            SetData.set_bet_status(3);

            if (data.orderNo && data.orderNo == get_order_no.value) {
            BetData.timer_count = null;
            BetData.max_winmoney = data.newMaxWinAmount;
                let oid = _.get(BetData.single_item, 'hps[0].hl[0].ol[0].oid', '')
                if (data.oddsChangeList && data.oddsChangeList[0] && data.oddsChangeList[0].playOptionsId == oid) {
                    odds_value2.value = data.oddsChangeList[0].usedOdds;
                }
            }
            set_new_bet(false)
        } else if (data.status == 4) { //投注失败
            if (BetData.get_new_bet) {
                SetData.set_bet_status(1);
                BetData.mixnew_bet = true;
                BetData.tips_msg = i18n.t('bet.err_msg03') //单关新流程失败后的 对应queryOrderStatus接口的红字提示
                SetData.set_toast({
                    'txt': i18n.t('bet.bet_err'),
                    hide_time: 3000
                });
            } else {
                SetData.set_bet_status(8);
            }
            clearInterval(timer_count);
            BetData.timer_count = null;
        }
    })
}