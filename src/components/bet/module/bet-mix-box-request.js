import BetData from "./class/bet-data-class.js";
import SetData from "src\core\bet\bet-data-ctr-class.js";



/**
 *@description 获取押注最大最小金额,除了用户id，其他都是必传字段
 *@param {Object} res_obj 有值时表示是从合并的接口调用的
 */
const fetch_limit_money = (res_obj) => {
    if (this.get_bet_list.length == 0) {
        return
    }

    if (res_obj) {
        result_handle.bind()(res_obj)
        return
    }

    function result_handle(res) {

        if (!_.get(res, 'data[0]') || res.code != 200) {
            return
        }

        if (BetData.mix_bet_flag) { // 串关
            let S = _.cloneDeep(this.get_s_count_data);
            S.forEach(item => {
                res.data.forEach(item2 => {
                    if (item.id == item2.type) {
                        item.minBet = item2.minBet;
                        item.orderMaxPay = item2.orderMaxPay;
                    }
                })
            })
            BetData.set_s_count_data(S);
        } else { // 单关
            this.set_http_update({
                money_obj: res.data
            })
        }
    }

    this.fetch_limit_money_params()
        .then(api_betting.post_maxminmoney)
        .then(result_handle.bind())
        .catch(err => {
            console.error('fetch_limit_money', err)
        })
}


/**
 *@description 单关投注后，c201消息的处理
 *@param {Array} : newTotalMaxWinAmount - 最高可赢金额， ov - 赔率， emit_http - 触发哪些接口请求， msg - 提示消息
 */
const c201_update_handler1 = ([newTotalMaxWinAmount, ov, emit_http, msg]) => {
    //emit_http 是1或者2时都是投注失败
    if (emit_http == 1) {
        msg && (BetData.tips_msg = msg)
        // 重新拉取投注前校验盘口信息接口
        if (this.check_odds_beforebet2) {
            this.check_odds_beforebet2()
        } else {
            this.check_odds_beforebet()
        }
        BetData.need_bet_again = true
        SetData.set_toast({
            'txt': this.$root.$t('bet.bet_err'),
            hide_time: 3000
        });
    } else if (emit_http == 2) {
        msg && (BetData.tips_msg = msg)
        // 重新拉取投注前校验盘口信息接口
        if (BetData.check_odds_beforebet2) {
            this.check_odds_beforebet2()
        } else {
            this.check_odds_beforebet()
        }
        BetData.need_bet_again = true
        SetData.set_toast({
            'txt': this.$root.$t('bet.bet_err'),
            hide_time: 3000
        });
        this.fetch_limit_money(); // 更新单关查询最大最小金额
    } else {
        this.max_winmoney = newTotalMaxWinAmount * 100;
        BetData.odds_value2 = ov;
    }
    clearInterval(BetData.timer_count);
    BetData.timer_count = null;
}


/**
 *@description 串关投注后，c201消息的处理
 *@param {Array} : emit_http - 触发哪些接口请求， msg - 提示消息
 */
const c201_update_handler2 = ([emit_http, msg]) => {
    //emit_http 是1或者2时都是投注失败
    if (emit_http == 1) {
        msg && (BetData.tips_msg = msg)
        if (BetData.check_odds_beforebet2) {
            this.check_odds_beforebet2()
        } else {
            this.check_odds_beforebet()
        }
        BetData.need_bet_again = true
        SetData.set_toast({
            'txt': this.$root.$t('bet.bet_err'),
            hide_time: 3000
        });
    } else if (emit_http == 2) {
        msg && (BetData.tips_msg = msg)
        if (BetData.check_odds_beforebet2) {
            this.check_odds_beforebet2()
        } else {
            this.check_odds_beforebet()
        }
        BetData.need_bet_again = true
        SetData.set_toast({
            'txt': this.$root.$t('bet.bet_err'),
            hide_time: 3000
        });
        this.fetch_limit_money();
    }
    clearInterval(BetData.timer_count);
    BetData.timer_count = null;
    clearTimeout(BetData.timer_count_1);
    BetData.timer_count_1 = null;
}