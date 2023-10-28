import { ref } from "vue"
import lodash from "lodash"
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
    // 投注记录版本变更
    this.bet_record_version = ref('1111')
  }

  // 设置投注记录 tab切换
  set_selected(number) {
    this.selected = number
    this.list_data = {}
    this.set_bet_record_version()
  }

  // 获取未结算列表
  get_unsettle_list() {
    const params = {
      searchAfter: this.last_record || undefined,
      orderStatus: '0',
    }
    //第一次加载时的注单数
    let size = 0
    this.is_loading = true
    // 请求接口
    api_betting.post_getH5OrderList(params).then(reslut => {
      let res = reslut.status ? reslut.data : reslut
      if (res.code == 200) {
        let { record, hasNext } = lodash.get(res, "data");
        this.is_hasnext = hasNext
        // record为空时
        if (lodash.isEmpty(record)) return
        for (let item of Object.values(record)) {
          size += item.data.length
        }
        this.last_record = lodash.findLastKey(record)
        // 合并数据
        let obj = lodash.cloneDeep(this.list_data)
        this.list_data = Object.assign(obj, record)
      }
      //容错处理，接口再调一次
      if (size < 5 && size > 0 && res.data.hasNext == true) {
        this.get_unsettle_list()
      }
      this.is_loading = false;
      this.set_bet_record_version()
    }).catch(err => {
      this.is_loading = false;
      console.error(err)
    });
  }

  set_list_data(value) {
    this.list_data = value
    this.set_bet_record_version()
  }

  // 更新投注记录版本
  set_bet_record_version() {
    this.bet_record_version.value = Date.now()
  }
}

export default new BetRecord();