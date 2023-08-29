// 串关相关方法


import BetData from "./class/bet-data-class.js";
import SetData from "src\core\bet\bet-data-ctr-class.js";


// 去注单记录页查看
const go_record = () => {
    BetData.set_bet_list([])
    useMittEmit(MITT_TYPES.EMIT_CHANGE_RECORD_SHOW, true);
}

/**
 *@description 点击添加比赛、顶部蒙层、向下箭头、确定和完成
 *@param {Number} val 点击的哪个按钮，2代表是投注框左下角按钮
 */
const pack_up = (val) => {
    if ([0, 2].includes(+BetData.bet_status)) {
        return
    }; //投注提交中不能点击

    if (val == 2 && calc_class) { // 有些情况(冠军玩法、单关失效...)不能点击串关+
        return
    }

    // 保留选项
    if (val == 2 && BetData.bet_success) {
        set_keyboard_show(true)
        BetData.set_is_spread(false);
        tips_msg = ''
        clear_single_money()
        BetData.set_bet_status(1)
        set_money_total('clear_')
        set_active_index(0)
        clearInterval(timer_count)
        clearTimeout(timer_count_1)
        return
    }

    // 冠军玩法没有串关，清空数据处理
    if (get_is_champion.value()) {
        BetData.set_bet_list([]);
        return
    }

    // 删除全部
    if (val == 2 && BetData.bet_list.length >= 2) {
        BetData.set_bet_list([]);
        return
    }

    //串关+
    if (val == 2 && BetData.bet_list.length == 1) {
        BetData.set_bet_status(0);
        set_is_mix(true)
    }

    if (
        get_is_mix.value && [1, 5, 7].includes(+BetData.bet_status)
    ) {
        BetData.set_bet_status(0);
        return
    }

    // 投注后点击蒙层，X ，或者确定直接删除，或者单关点蒙层
    if (
        [3, 4, 6, 8].includes(+BetData.bet_status) ||
        BetData.bet_list.length == 1 && val != 2
    ) {
        BetData.set_bet_list([]);
        return
    }
}

/**
 *@description 点击投注
 */
const submit_order = () => {
    if (btn_show.value == 4) { //接受变化并投注点击时，要先接受变化
        set_odds_change(false);
        set_change_list({
            status: 0
        });
        if (get_active_index.value == -1) {
            set_active_index(0)
        }
    }
    exist_code.value = ''
    //校验是否是串关，并且删除后是否小于最小串关数量
    if (get_is_mix.value && !vilidata_mix_count()) {
        return
    }
    set_order_los([]);
    set_new_bet(false)

    series_order_respList.value = []
    is_new_bet.value = false;
    need_bet_again.value = false

    clearTimeout(timer_count_2);
    timer_count_2 = null;
    clearTimeout(timer_count_1);
    timer_count_1 = null;

    if (get_money_notok_list.value.length || is_conflict) {
        return
    };

    // 这种情况放过，让钱投注出去
    let _flag2 = get_money_total.value == UserCtr.balance
    if (get_money_notok_list2.value.length && !_flag2) {
        //点击投注后当输入金额小于最低限额时，默认转化为最低限额。并提示“最小单笔投注金额为 xx.” 3s消失。
        set_money_notok_list({
            status: 0
        })
        return
    }

    set_active_index(-1);

    if (BetData.bet_status.value == 7) { //锁盘
        set_toast({
            'txt': i18n.t('bet.odd_upd')
        });
        return;
    }

    if (get_money_total.value > +UserCtr.balance || UserCtr.balance == 0) { //弹窗提示：“余额不足，请您先充值”
        set_toast({
            'txt': i18n.t('bet.err_msg05')
        });
        return;
    }
    if (get_money_total.value < 0.01) { //请输入金额
        set_toast({
            'txt': i18n.t('bet.input_v')
        })
        return;
    }

    //限额获取中,请稍后
    let bet_dom = $refs.bet_single_detail
    let flag = (get_is_mix.value && get_s_count_data.value[0] && !get_s_count_data.value[0].orderMaxPay ||
        !get_is_mix.value && bet_dom && !bet_dom.max_money_back) && !is_5s.value
    if (flag) {
        set_toast({
            'txt': i18n.t('bet.err_msg06')
        });
        return
    }


    if (get_mix_bet_flag.value) {
        mix_bet() //串关投注
    } else {
        single_bet() //单关投注
    }
}



/**
 *@description 接受变化
 *@param {Number} val 有值表示手动触发
 *@return {Undefined} undefined
 */
const agree_change = (val) => {
    set_odds_change(false);
    BetData.set_bet_status(1);
    set_change_list({
        status: 0
    });
    if (get_active_index.value == -1) {
        set_active_index(0)
    }
}


// 清除当前组件所有定时器
const clear_timer = () => {
    // timeout定时器列表
    const timeout_timer_arr = [
        'timer',
        'timer2',
        'timer3',
        'timer_count_1',
        'timer_count_2',
    ]

    // interval定时器列表
    const interval_timer_arr = [
        'timer_count'
    ]

    // 批量清除timeout定时器
    for (const timer of timeout_timer_arr) {
        clearTimeout(this[timer])
        this[timer] = null
    }

    // 批量清除interval定时器
    for (const timer of interval_timer_arr) {
        clearInterval(this[timer])
        this[timer] = null
    }
}