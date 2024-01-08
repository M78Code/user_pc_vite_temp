import { ref } from "vue"
import { columns } from  "./util.js"
import { useMittEmit, MITT_TYPES } from  "src/core/mitt/index.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_betting } from "src/api/index.js";
import lodash from 'lodash';
import { i18n_t } from "src/boot/i18n.js";
import GlobalSwitchClass from 'src/core/global/global.js'
import { football_score_no } from "src/output/index.js";

class BetRecord {
  constructor() {
    this.init_core()
  }
  init_core() {
    // 0 未结算 1 已结算  2 预约
    this.selected = 0
    // 预约  0进行中  1已失效
    this.appoint_order_status = 0
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
    //列表数据
    this.list_data = {}
    // table列表columns
    this.columns = columns
    // 提前结算图标是否选中
    this.is_early = false

    //是否在加载中
    this.loading = true
    //list_data里面最后的一条数据的日期 '2020-11-17'
    this.last_record = ''
    // 是否存在下一页
    this.is_hasnext = false
    // 接口是否返回错误码为0401038限频
    this.is_limit = false
    // 投注记录版本变更
    this.bet_record_version = ref('1111')
  }

  // 设置投注记录 tab切换
  set_selected(number) {
    this.selected = number
    this.reset()
    // 切换提示语
    this.set_tip_msg(number)
    // 更改columns
    this.set_columns(number)
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

  // 更改columns
  set_columns(number) {
    if(number == 1) {
      this.columns[5] = {
        name: 'return',
        label: i18n_t("common.donate_win"),
        align: 'center',
        field: 'return'
      }
    } else {
      this.columns[5] = {
        name: 'highestWin',
        label: i18n_t("common.maxn_amount_val"),
        align: 'center',
        field: 'highestWin'
      }
    }
  }

  // 更改api
  set_api_url(number) {
    if(number == 2) { // 预约
      this.api_url = api_betting.post_book_list
    } else { // 未结算、已结算
      this.api_url = api_betting.post_getOrderList
    }
  }

  // 设置提前结算按钮
  set_is_early(value) {
    this.is_early = value
    this.set_bet_record_version()
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
        if(res.code !== '200'){
          if(res.code === '0401038'){
            GlobalSwitchClass.set_tip_show_state(true, {
              // 当前访问人数过多，请稍后再试
              text: i18n_t('common.limited')
            })
            return ;
          }
          return;
        }
        this.records = res.data || {}
        this.set_table_data(res.data?.records || [])
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }

  // 初始化数据
  reset() {
    this.params = {
      page: 1,
      size: 50,
      userId: UserCtr.user_info.userId
    }
    this.api_url = api_betting.post_getOrderList
    this.table_data = []
    this.records = {}

    this.list_data = {}
    this.is_early = false
    this.loading = true
    this.last_record = ''
    this.is_hasnext = false
    this.is_limit = false
  }

  /**
   * 请求注单记录接口
   * @param {*} params 请求参数
   * @param {*} url_api 请求api
   * @param {*} prevData 预约中、已失效(数据需加工)
   */
  get_order_list(params, url_api, prevData=false) {
    //第一次加载时的注单数
    let size = 0
    this.loading = true
    // 请求接口
    url_api(params).then(reslut => {
      let res = reslut.status ? reslut.data : reslut
      this.is_limit = false
      this.loading = false;
      if (res.code == 200) {
        let { record, hasNext } = lodash.get(res, "data");
        this.is_hasnext = hasNext
        // record 为null时 => 赋值为空对象
        if(!record) record = {}
        for (let item of Object.values(record)) {
          size += item.data.length
          // 如果是预约中、已失效，数据额外处理下
          if(prevData) {
            for (var i = 0; i < item.data.length; i++) {
              item.data[i].orderVOS = item.data[i].detailList
            }
          }
        }
        this.last_record = lodash.findLastKey(record);
        // 赋值
        this.set_list_data(record)
        // 如果是未结算页面, 先获取提前结算列表金额
        this.selected === 0 && this.check_early_order()
      } else if (res.code == '0401038') {
        this.is_limit = true
        return
      } else {
        return;
      }
      //容错处理，接口再调一次 (极端情况下，条件多次成立，触发接口限频)
      // if (size < 5 && size > 0 && lodash.get(res, 'data.hasNext') == true) {
      //   let newParams = Object.assign({}, params, {
      //     searchAfter: this.last_record
      //   })
      //   this.get_order_list(newParams, url_api, prevData)
      // }
    }).catch(err => {
      this.loading = false;
      console.error(err)
      return;
    });
  }

  /**
   * scroll页面上推分页加载
   * @param {*} params 请求参数
   * @param {*} url_api 请求api
   * @param {*} $el scroll元素
   * @param {*} prevData 预约中、已失效(数据需加工)
   * @returns 
   */
  onPull(params, url_api, $el, prevData=false) {
    if (!this.is_hasnext || !this.last_record) {
      //没有更多
      $el.setState(7);
      return;
    }
    //加载中
    $el.setState(4);
    url_api(params).then(res => {
      //加载完成
      $el.setState(5);
      let { record, hasNext } = lodash.get(res, "data", {});
      this.is_hasnext = hasNext
      if (res.code == 200 && res.data && lodash.isPlainObject(record) && lodash.keys(record).length > 0) {
        this.last_record = lodash.findLastKey(record);
        // 如果是预约中、已失效，数据多余处理下
        if(prevData) {
          for (let item of Object.values(record)) {
            for (var i = 0; i < item.data.length; i++) {
              item.data[i].orderVOS = item.data[i].detailList
            }
          }
        }
        // 合并数据
        let obj = lodash.cloneDeep(this.list_data)
        this.set_list_data(Object.assign(obj, record))
      } else {
        //没有更多
        $el.setState(7);
      }
    }).catch(err => { console.error(err) });
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
        // if (item.enablePreSettle) {
          tempList.push(item.orderNo)
        // }
      })
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

}

export default BetRecord;