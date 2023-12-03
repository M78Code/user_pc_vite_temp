import { ref } from "vue"
import { useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
import { filter_early_list } from  "./util.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_betting } from "src/api/index.js";

class BetRecord {
  constructor() {
    this.init_core()
  }
  init_core() {
    // 0 未结算 1 预约中 2 已失效 3 已结算
    this.selected = 0
    //列表数据
    this.list_data = {}
    // 提前结算图标是否选中
    this.is_early = false
    // 提前结算列表
    this.early_money_list = {}
    // 投注记录版本变更
    this.bet_record_version = ref('1111')
  }

  // 设置投注记录 tab切换
  set_selected(number) {
    this.selected = number
    this.list_data = {}
    this.is_early = false
    this.early_money_list = {}
    // 通知 cathectic-item-all, 重新获取数据 
    useMittEmit(MITT_TYPES.EMIT_BET_RECORD_SELECTED_CHANGE, this.selected)
    this.set_bet_record_version()
  }

  // 更新列表
  set_list_data(value) {
    this.list_data = value
    this.early_money_list = filter_early_list(value, this.is_early)
    this.set_bet_record_version()
  }

  // 设置提前结算按钮
  set_is_early(value) {
    this.is_early = value
    this.early_money_list = filter_early_list(this.list_data, value)
    this.set_bet_record_version()
  }

  // 更新投注记录版本
  set_bet_record_version() {
    this.bet_record_version.value = Date.now()
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
    lodash.forEach(this.list_data, (value, key) => {
      lodash.forEach(value.data, (item) => {
        if (item.enablePreSettle) {
          tempList.push(item.orderNo)
        }
      })
    })
    if (tempList.length === 0) return;
    // 如果有需要提前结算的订单，获取提前结算的金额
    let params = { orderNo: tempList.join(',') }
    api_betting.get_cashout_max_amount_list(params).then(reslut => {
      let res = reslut.status ? reslut.data : reslut
      if (res.code == 200 && res.data) {
        // 通知提前结算组件 => 数据金额变化
        useMittEmit(MITT_TYPES.EMIT_EARLY_MONEY_LIST_CHANGE, res.data)
      }
    })
  }

}

export default new BetRecord();