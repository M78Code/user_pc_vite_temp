import { ref } from "vue"
import lodash_ from "lodash"

class BetRecord {
  constructor() { 
    this.init_core()
  }
  init_core() {
    // 0 未结算 1 已结算 2 预约
    this.selected = 0
    //预约状态 0 进行 2 已失效
    this.appoint_order_status = 0
    // 投注记录版本变更
    this.bet_record_version = ref('1111')
  }

  // 设置投注记录 tab切换
  set_selected(number){
    this.selected = number
    this.set_bet_record_version()
  }

   // 设置投注记录-预约 tab切换 
   set_appoint_order_status(number){
    this.appoint_order_status = number
    this.set_bet_record_version()
  }

  

  // 更新投注记录版本
  set_bet_record_version(){
    this.bet_record_version.value = Date.now()
  }
}

export default new BetRecord();