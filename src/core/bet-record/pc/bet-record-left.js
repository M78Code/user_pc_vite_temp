import { ref } from "vue"
import { o_params } from "./util.js"
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
    // 列表
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
    // 更改api
    this.set_api_url(number)
    // 通知 重新获取数据 
    useMittEmit(MITT_TYPES.EMIT_GET_RECORD_LIST, o_params[number])
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


  // 初始化数据
  reset() {
    this.table_data = []
    this.records = {}
    this.loading = true
  }

}
export default new BetRecord();