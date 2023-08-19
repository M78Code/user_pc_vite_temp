import BetData from "./class/bet-data-class.js";


// 初始化
const init_bet_child1 = () => {
    fetch_limit_money()
}

/**
 *@description 获取押注最大最小金额,除了用户id，其他都是必传字段
 *@param {Object} res_obj 有值时表示是从合并的接口调用的
 */
const fetch_limit_money = (res_obj)=>{
    if (this.get_bet_list.length == 0) {
        return
    }

    if (res_obj) {
        result_handle.bind(this)(res_obj)
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
        .then(result_handle.bind(this))
        .catch(err => {
            console.error('fetch_limit_money', err)
        })
},