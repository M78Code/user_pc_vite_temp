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
    //预约状态 0 进行 2 已失效
    this.appoint_order_status = 0
    //列表数据
    this.list_data = {}
    // loading
    this.is_loading = false
    // list_data里面最后的一条数据的日期 '2020-11-17'
    this.last_record = ''
    // 是否有下一页
    this.is_hasnext = false
    // 定时器
    this.timer = null
    // 投注记录版本变更
    this.bet_record_version = ref('1111')
  }

  // 设置投注记录 tab切换
  set_selected(number) {
    // this.reset_data() // 重置数据
    this.selected = number
    this.get_list_data(number)
    // this.set_bet_record_version()
  }

  // 设置投注记录-预约 tab切换 
  set_appoint_order_status(number) {
    this.appoint_order_status = number
    this.set_bet_record_version()
  }

  // 获取展示列表
  get_list_data(number) {
    switch (number) {
      case 0:
        this.get_unsettle_list() // 获取未结算列表
        break;
      case 1:
      case 2:
        this.list_data = {}
        this.set_bet_record_version()
        break;
      case 3:

        break;
    }
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

  // 切换时重置数据
  reset_data() {
    this.is_loading = false
    this.last_record = ''
    this.list_data = {}
    this.is_hasnext = false
    this.timer = null
  }

  // 更新投注记录版本
  set_bet_record_version() {
    this.bet_record_version.value = Date.now()
  }
}

export default new BetRecord();