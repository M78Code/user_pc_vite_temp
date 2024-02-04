import { ref } from "vue"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_betting } from "src/api/index.js";
import { i18n_t } from "src/boot/i18n.js";
import GlobalSwitchClass from 'src/core/global/global.js'

class BetRecord {
  constructor() {
    this.init_core()
  }
  init_core() {
    // 0 未结算 1 已结算  2 预约
    this.selected = 0
    // PC 投注记录提示
    this.tipMsg = 'bet_record.msg_1'
    // 列表
    this.params = {
      page: 1,
      size: 50,
      userId: UserCtr.user_info.userId
    }
    this.api_url = api_betting.post_getOrderList
    this.table_data = []
    this.records = {}
    //是否在加载中
    this.loading = true
    // 投注记录版本变更
    this.bet_record_version = ref('1111')
  }

  // 设置投注记录 tab切换
  set_selected(number) {
    this.selected = number
    this.reset()
    // 切换提示语
    this.set_tip_msg(number)
    // 更改api
    this.set_api_url(number)
    // 通知 重新获取数据 
    useMittEmit(MITT_TYPES.EMIT_BET_RECORD_SELECTED_CHANGE, this.selected)
    this.set_bet_record_version()
  }

  // 更新列表
  set_table_data(value) {
    this.table_data = value
    this.set_bet_record_version()
  }

  // 更改api
  set_api_url(number) {
    if (number == 2) { // 预约
      this.api_url = api_betting.post_book_list
    } else { // 未结算、已结算
      this.api_url = api_betting.post_getOrderList
    }
  }

  // 更新投注记录版本
  set_bet_record_version() {
    this.bet_record_version.value = Date.now()
  }

  //设置提示语
  set_tip_msg(index) {
    let msg = ''
    switch (index) {
      case 0:
        msg = 'bet_record.msg_1'
        break;
      case 1:
        msg = 'bet_record.msg_6'
        break;
      case 2:
        msg = 'bet_record.msg_7'
        break;
    }
    this.tipMsg = msg
  }
  // 根据 今天、昨天、7天、30天提示
  set_date_tip_msg(val) {
    let msg = ''
    switch (val) {
      case 1:
        msg = 'bet_record.msg_2'
        break;
      case 2:
        msg = 'bet_record.msg_3'
        break;
      case 3:
        msg = 'bet_record.msg_4'
        break;
      case 4:
        msg = 'bet_record.msg_5'
        break;
    }
    this.tipMsg = msg
    this.set_bet_record_version()
  }

  /**
   * 获取数据
   */
  handle_fetch_order_list = async () => {
    try {
      this.loading = true
      let res = await this.api_url({ ...this.params })
      if (res.code !== '200') {
        if (res.code === '0401038') {
          GlobalSwitchClass.set_tip_show_state(true, {
            // 当前访问人数过多，请稍后再试
            text: i18n_t('common.limited')
          })
          return;
        }
        return;
      }
      this.records = res.data || {}
      this.set_table_data(res.data?.records || [])
      // 未结算查找提前结算订单号
      this.selected === 0 && this.check_early_order()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  }

  /**
   * @description 检查订单中是否存在符合条件的提前结算订单号
   * @description 如果存在， 则接口获取提前结算金额
   */
  check_early_order()  {
    // 如果用户未开启提前结算
    if (!UserCtr.user_info.settleSwitch) return;
    // 循环列表查询需要提前结算的单号
    let tempList = []
    lodash.forEach(this.table_data, (item) => {
      if(item.seriesType === '1') { //单关、足篮才有提前结算
        tempList.push(item.orderNo)
      }
    })
    if (tempList.length === 0) return;
    // 如果有需要提前结算的订单，获取提前结算的金额
    let params = { orderNo: tempList.join(',') }
    api_betting.get_cashout_max_amount_list(params).then(reslut => {
      let res = reslut.status ? reslut.data : reslut
      // 通知提前结算组件 => 数据金额变化
      useMittEmit(MITT_TYPES.EMIT_EARLY_MONEY_LIST_CHANGE, res.data)
    })
  }

  // 初始化数据
  reset() {
    this.params = {
      page: 1,
      size: 50,
      userId: UserCtr.user_info.userId
    }
    this.table_data = []
    this.records = {}
    this.loading = true
  }

}
export default new BetRecord();