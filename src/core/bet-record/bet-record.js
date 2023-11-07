import { ref } from "vue"
import lodash from "lodash"
import { t } from "src/boot/i18n.js";
import {useMittEmit, MITT_TYPES} from  "src/core/mitt/index.js"

const bet_result = {
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
const outcome = {
  "2": t("bet_record.bet_no_status02"), //'走水',
  "3": t("bet_record.bet_no_status03"), //'输',
  "4": t("bet_record.bet_no_status04"), //'赢',
  "5": t("bet_record.bet_no_status05"), //'赢半',
  "6": t("bet_record.bet_no_status06"), //'输半',
}


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
    this.early_money_list = []
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
    this.early_money_list = this.filter_early_money_list(value, this.is_early)
    this.set_bet_record_version()
  }

  // 设置提前结算按钮
  set_is_early(value) {
    this.is_early = value
    this.early_money_list = this.filter_early_money_list(this.list_data, value)
    this.set_bet_record_version()
  }

  // 更新投注记录版本
  set_bet_record_version() {
    this.bet_record_version.value = Date.now()
  }

  //返回订单状态   orderStatus(0:未结算,1:已结算,2:注单无效,3:确认中,4:投注失败)
  calc_text(data_b) {
    switch (data_b.orderStatus) {
      case '0':
        return { text: t('bet_record.successful_betting'), color: 'green' }
      case '1':
        let flag = data_b.seriesType == '1' && data_b.orderVOS[0]
        let color = 'black'
        if (flag) {   //单关
          let betresult = data_b.orderVOS[0].betResult
          if (betresult == 13 || betresult == 16) {
            return { text: t('bet_record.invalid'), color }
          } else {
            if (betresult == 4 || betresult == 5) {
              color = 'red'
            }
            return { text: bet_result[betresult] || '', color };
          }
        } else {  //串关
          if (data_b.outcome == 4 || data_b.outcome == 5) {
            color = 'red'
          }
          return { text: outcome[data_b.outcome] || t('bet_record.successful_betting') || '', color };
        }
      case '2':
        return { text: t('bet_record.invalid_bet'), color: 'gray' }
      case '3':
        return { text: t('bet_record.confirming'), color: 'orange' }
      case '4':
        return { text: t('bet.bet_err'), color: 'red' }
      default:
        return { text: '', color: '' }
    }
  }
  // 根据提前结算按钮状态， 过滤提前结算的数据
  filter_early_money_list(value, bol) {
    let all_list = lodash.cloneDeep(value)
    if(bol) {
      lodash.forEach(all_list, (value, key) => {
        value.data = lodash.filter(value.data, item => {
          return item.enablePreSettle
        })
        if(!value.data.length) {
          delete all_list[key]
        }
      })
    }
    return all_list
  }
}

export default new BetRecord();