/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注历史
 */
import { mapGetters, mapActions } from "vuex";
import BetRecordItem from "src/public/components/bet_record_view/bet_record_item.vue";
import BetBookItem from "src/public/components/bet_record_view/bet_book_item.vue";
import BetRecordResult from "src/public/components/bet_record_view/bet_record_result.vue";
import betting from "src/public/mixins/betting/betting.js";
import time_format_mixin from "src/public/mixins/common/time_format";
import skt_data_order from "src/public/mixins/websocket/data/skt_data_order.js";
import record_common from "src/public/mixins/common/record_common.js";

import play_mapping from "src/public/config/mapping/play_mapping";
export default {
  name: "bet-record-view",
  mixins: [  betting, time_format_mixin, skt_data_order, record_common],
  data() {
    return {
      // 当前页默认第一页
      cur_page: 1,
      // 每页显示的记录数量
      page_size: 20,
      // 总页数
      total_page: 0,
      // 开始时间
      begin_time: '',
      // 结束时间
      end_time: '',
      // 投注原始记录
      record_data: {},
      // 提前结算状态orderNo
      orderNo_list: [],
      // 提前结算状态item
      orderNo_data_obj: [],
      // 提前结算状态单号
      orderNo_data_list: [],
      // 投注记录对象
      record_obj: {},
      // 预约中状态单号
      orderNoList: [],
      is_more_show: false, // 是否显示加载更多的按钮
      // 数据加载状态 loading:加载数 data: 数据加载完成有数据 empty: 数据加载完成无数据
      load_data_state: "loading",
      // 0:未结算 1:已结算 2: 预约
      selected: 0,
      // 预约订单状态当appoint_status为投注预约时取值为 0: 进行中 2: 已失效
      appoint_order_status: 0,
      // 接入socket名称
      socket_name: "bet_record_view",
      // 定时器
      timer: undefined,
      // 提前结算实时查询最高返还批量定时器
      timer_get_cashout: undefined,
      // 当maxcashout为null时，定时1秒重新拉次数据，拉取次数
      get_cashout_num: 0,
      // 提前结算实时查询返回的maxout有null时，重新拉取投注记录数据的定时器
      send_cashout: undefined,
      // 是否正在确认中
      has_confirm_status: false,
    }
  },
  created() {
    //给main_menu 里面set_scroll_this赋值的数据源
    this.$emit("set_scroll_this",{type:"bet_recode_this",_this:this});
    // 从预约中列表数据，去除已经预约成功的注单数据
    this.$root.$on(this.emit_cmd.EMIT_DEL_BOOK_HISTORY_RECORD_CMD, this.delete_book_record);
    // 统计未结算订单数量
    this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
    // 清除提前结算实时查询定时器
    this.clear_timer_get_cashout()
    // 清除重新拉取投注记录定时器
    this.clear_send_cashout()
    // 清除5秒一次轮训预约投注中记录查询定时器
    this.clear_timer_get_book()
    // 监听更新提前结算订单数据
    this.$root.$on(this.emit_cmd.EMIT_UPD_CASHOUT_MAX_AMOUNT_LIST_CMD, this.upd_cashout_max_amount_list);
  },
  components: {
    // 投注项组件
    'bet-record-item': BetRecordItem,
    // 投注结果组件
    'bet-record-result': BetRecordResult,
    // 预约项组件
    'bet-book-item': BetBookItem
  },
  computed: {
    ...mapGetters({
      // 用户信息
      vx_get_user: "get_user",
      // 单关投注列表
      vx_get_bet_single_list: "get_bet_single_list",
      // 串关投注列表
      vx_get_bet_list: "get_bet_list"
    })
  },
  filters: {
    /**
     * @description: 金额显示的格式过滤器
     * @param {Number} 金额
     * @return {type}
     */
    format_money(value) {
      if (value && parseFloat(value) > 0) {
        return "+" + value;
      } else if (value && parseFloat(value) < 0) {
        return value;
      } else {
        return 0;
      }
    }
  },
  watch: {
    /**
     * @description: 监控左侧布局显示
     * @param {String} new_ 主要标识在投注记录,菜单还是在注单历史中
     * @return {undefined} undefined
     */
    vx_get_layout_left_show: {
      handler(new_) {
        if (new_ == "bet_history") {
          // this.get_bet_history_record();

          // 情况投注记录数据
          this.record_data.records = [];
          // 总页数归0
          this.total_page = 0;
          // 获取服务器时间戳
          this.get_record_server_time(1);
          // 发送订阅指令
          this.sendSocketInitCmd();
        } else {
          // 清除提前结算实时查询定时器
          this.clear_timer_get_cashout()
          // 清除重新拉取投注记录定时器
          this.clear_send_cashout()
        }
      },
      immediate: true
    },
    /**
     * @description: 监控当前用户信息 uname改变重新调用历史记录接口
     * @param {Object} new_ 当前用户信息
     * @return {undefined} undefined
     */
    'vx_get_user.uname': {
      handler(new_) {
        if (new_) {
          this.get_bet_history_record();
        }
      },
      immediate: true
    },
    /**
     * @description: 监控结算类型
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    selected(new_) {
      //选择改变重新调用历史记录接口
      this.get_bet_history_record();
      if(new_ == 0) { //选择第一个统计未结算订单
        // 统计未结算订单
        this.$root.$emit(this.emit_cmd.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
      } else {
        //清除提前结算实时查询定时器
        this.clear_timer_get_cashout()
        //清除重新拉取投注记录定时器
        this.clear_send_cashout()
      }
    },
    /**
     * @description: 监控预约状态
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    appoint_order_status(new_) {
      if(new_!=0) {
        this.clear_timer_get_book()
      }
      this.get_bet_history_record();
    }
  },
  methods: {
    ...mapActions({
      // 左侧布局显示设置
      vx_set_layout_left_show: "set_layout_left_show",
      // 投注记录显示设置
      vx_set_show_record: "set_show_record"
    }),
    /**
     * @description: 返回体育项目
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    go_back_project() {
      // 设置为显示菜单列表
      this.vx_set_layout_left_show("menu");
    },
    /**
     * @description: 切换展开/折叠功能
     * @param {Object} item 当前需要展开/折叠的投注项对象
     * @return {undefined} undefined
     */
    change_handle(item) {
      item.is_expand = !item.is_expand;
    },
    /**
     * @description: 获取记录列表
     * @param {Number} cur_page 当前页 默认为第一页
     * @return {undefined} undefined
     */
    get_record_list(cur_page = 1) {
      let params = {
        page: cur_page,
        size: this.page_size,
        orderStatus: this.selected,
        timeType: 5  // 一个账务日
        // beginTime: this.begin_time,
        // endTime: this.end_time
      };
      this.load_data_state = "loading";
      // 获取投注记录数据
      this.get_bet_record_data(params, (code, data) => {
        if (code == 200) {
          // 投注记录
          let record_data = data;
          let record_fields;
          let records = data && data.records;
          // 当maxcashout为null时，定时1秒重新拉次数据，最多查询5次
          let records_ =  _.filter(records, {'enablePreSettle': true, 'orderStatus': '0', 'initPresettleWs': true });
          let maxcashout_list = _.map(records_, 'maxCashout')
          // 判断提前结算实时查询返回集合数据的投注额有null
          // 投注额有null时，拉取数据，超过4次都为null，不再拉取
          if (_.includes(maxcashout_list, null)) {
            this.get_cashout_num++;
            if (this.get_cashout_num<=4) {
              // 清除重新拉取投注记录定时器
              this.clear_send_cashout()
              this.send_cashout = setTimeout(()=>{
                // 重新拉取列表数据
                this.get_record_list(this.cur_page);
              },1000)
            } else {
                this.get_cashout_num = 0
              }
          } else {
            this.get_cashout_num = 0
          }
          // get_cashout_num ===0是代表提前结算的单子里面maxcashout没有 null
          if (this.get_cashout_num === 0) {
            if (records && records.length) {
              records.forEach(item => {
                // 设置投注结算金额 默认为总的订单金额
                let setBetAmount = item.orderAmountTotal;
                // 如果提前结算过(结算数据存在)
                if(item.preBetAmount) {
                  // 重新计算可以结算的投注金额
                  setBetAmount = item.orderAmountTotal - item.preBetAmount;
                }
                Object.assign(item, { is_expand: true, setBetAmount});
              });
            }
            if (record_data.total > 20) {
              // 投注记录大于20条 设置加载更多按钮显示
              this.is_more_show = true;
              // 从新计算总页数
              this.total_page = parseInt(record_data.total / this.page_size);
              this.total_page = ((record_data.total % this.page_size) == 0) ? this.total_page : (this.total_page + 1);
            }
            // 当前在第一页
            if (this.cur_page == 1) {
              // 保存投注记录到变量
              this.record_data = data;
              record_fields = _.cloneDeep(data);
              record_fields.records = [];
              Object.assign(this.record_data, record_fields);
              this.record_data.records = [];
              this.orderNo_list = []
            }
            if (!records) {
              // 投注记录不存在设置加载状态为empty
              this.load_data_state = "empty";
              return;
            }
            // 最新数据替换，不同数据拼接在一起
            let orderNo_list_ = _.map(this.record_data.records, 'orderNo')
            _.forEach(records, item => {
                if (_.includes(orderNo_list_, item.orderNo)) {
                  let index = _.findIndex(this.record_data.records, ['orderNo', item.orderNo]);
                  this.$set(this.record_data.records, index, item)
                } else {
                  this.record_data.records.push(item)
                }
            })
            // this.record_data.records.push(...records);
            let record_list = _.cloneDeep(this.record_data.records);
            // 如果是已结算
            if(this.selected) {
              // 投注记录对象话
              this.get_record_obj(record_list);
            } else if(this.selected == 0 && this.vx_get_user.settleSwitch) {
              // 如果是未结算 且结算开关打开的调用提前结算确认中接口
              this.query_order_pre_settle_confirm(record_list);
              // 提前结算实时查询，取里面orderNo，做提前结算实时查询最新数据处理
              this.get_order_no()
            } else {
              // 其他情况投注记录对象话
              this.get_record_obj(record_list);
            }
            }
          } else {
            if (code == '0401038') {
                this.load_data_state = "api_limited";
              } else {
                this.load_data_state = "empty";
            }
            //清除提前结算实时查询定时器
            this.clear_timer_get_cashout()
          }

      });
    },
    /**
     * @description: 获取预投住注单记录
     * @param {Number} cur_page 当前页 默认为第一页
     * @param {Number} preOrderStatus (0预约中 ;1预约成功;2.风控预约失败;3.风控取消预约注单.4.用户手动取消预约投注)
     * @return {undefined} undefined
     */
     get_book_list(cur_page = 1) {
      let preOrderStatusList = []
      //  预约已失效
      const arr = [2, 3, 4]
      // 0预约中 ;1预约成功;2.风控预约失败;3.风控取消预约注单.4.用户手动取消预约投注
       if(this.appoint_order_status == 0) {
        preOrderStatusList.push(0)
       } else if(this.appoint_order_status == 2){
        preOrderStatusList = [...preOrderStatusList, ...arr]
       }
      // jumpFrom跳转来源(非空 1.详情投注界面   2.注单界面)
      let params = {
        page: cur_page,
        size: this.page_size,
        jumpFrom: 1,
        preOrderStatusList: preOrderStatusList
      };
      this.load_data_state = "loading";
      // 获取投注记录数据
      this.get_book_record_data(params, (code, data) => {
        if (code == 200) {
          // 预约记录
          let record_data = data;
          let record_fields;
          let records = data && data.records;
            if (records && records.length) {
              records.forEach(item => {
                // 设置投注结算金额 默认为总的订单金额
                let setBetAmount = item.orderAmountTotal;
                // 如果提前结算过(结算数据存在)
                if(item.preBetAmount) {
                  // 重新计算可以结算的投注金额
                  setBetAmount = item.orderAmountTotal - item.preBetAmount;
                }
                Object.assign(item, { is_expand: true, setBetAmount});
              });
            }
            if (record_data.total > 20) {
              // 预约记录大于20条 设置加载更多按钮显示
              this.is_more_show = true;
              // 从新计算总页数
              this.total_page = parseInt(record_data.total / this.page_size);
              this.total_page = ((record_data.total % this.page_size) == 0) ? this.total_page : (this.total_page + 1);
            }
            // 当前在第一页
            if (this.cur_page == 1) {
              // 保存预约记录到变量
              this.record_data = data;
              record_fields = _.cloneDeep(data);
              record_fields.records = [];
              Object.assign(this.record_data, record_fields);
              this.record_data.records = [];
              this.orderNo_list = []
            }
            if (!records) {
              // 预约记录不存在设置加载状态为empty
              this.load_data_state = "empty";
              return;
            }
            this.record_data.records.push(...records);
            let record_list = _.cloneDeep(this.record_data.records);
            let record_obj = this.get_obj(record_list, data);
            delete record_obj.list;
            this.record_obj = record_obj;
            if (this.record_data.records.length == 0) {
              this.load_data_state = "empty";
            } else {
              this.load_data_state = "data";
                //  预约进行中
              if (this.appoint_order_status === 0) {
                let orderNoList =  _.filter(this.record_data.records, { 'orderStatus': '0' });
                this.orderNoList = _.map(orderNoList, 'orderNo')
                // 5秒一次轮训预约投注记录
                this.res_timer_get_book()
              } else {
                this.clear_timer_get_book()
              }
            }
          } else {
            if (code == '0401038') {
                this.load_data_state = "api_limited";
              } else {
                this.load_data_state = "empty";
            }
            // this.load_data_state = "empty";
            this.clear_timer_get_book()
          }
      });
    },
        /**
     * @description: 轮询更新获取预投住中注单记录(只查预约中数据)
     * @param {Number} cur_page 当前页 第一页
     * @param {Number} preOrderStatus (0预约中 ;1预约成功;2.预约取消)
     * @return {undefined} undefined
     */
         get_book_record_list(cur_page = 1) {
          // 0预约中 ;1预约成功;2.预约取消
          let params = {
            size: this.page_size*cur_page, // 查询全部预约中数据
            preOrderStatus: this.appoint_order_status
          };
          // 获取预约中记录数据
          this.get_book_status_data(params, (code, data) => {
            if (code == 200) {
              // 预约中记录
              let record = data && data.record;
              let records = []
              for(let item in record) {
                records = [...records, ...record[item].data]
              }
              let records_ = _.map(records, 'orderNo')
              if (this.record_data.records && this.record_data.records.length) {
                this.record_data.records.forEach(item_ => {
                  // 预约状态改变，则去除列表中预约中状态的数据
                  if (!_.includes(records_, item_.orderNo)) {
                    this.record_data.records=this.record_data.records.filter(book_item => book_item.orderNo != item_.orderNo)
                  }
                })
              }
              let orderNo_list_ = _.map(this.record_data.records, 'orderNo')
              if (records && records.length) {
                records.forEach(item => {
                  // 设置投注结算金额 默认为总的订单金额
                  let setBetAmount = item.orderAmountTotal;
                  // 如果提前结算过(结算数据存在)
                  if(item.preBetAmount) {
                    // 重新计算可以结算的投注金额
                    setBetAmount = item.orderAmountTotal - item.preBetAmount;
                  }
                  Object.assign(item, { is_expand: true, setBetAmount});
                  // 查询预约中数据增加，新增该条数据
                    if (!_.includes(orderNo_list_, item.orderNo)) {
                      this.record_data.records.push(item)
                    }
                  });
                }
                if (!records) {
                  // 预约记录不存在设置加载状态为empty
                  this.load_data_state = "empty";
                  return;
                }
                let record_list = _.cloneDeep(this.record_data.records);
                let record_obj = this.get_obj(record_list, data);
                delete record_obj.list;
                this.record_obj = record_obj;
                if (this.record_data.records.length == 0) {
                  this.load_data_state = "empty";
                  this.clear_timer_get_book()
                } else {
                  this.load_data_state = "data";
                }
              } else {
                if (code == '0401038') {
                    this.load_data_state = "api_limited";
                  } else {
                    this.load_data_state = "empty";
                }
                // this.load_data_state = "empty";
                this.clear_timer_get_book()
              }
          });
        },
    // /**
    //  * @description: 轮询更新获取预投住中注单记录(只查预约中数据)
    //  * @param {Array} orderNoList 订单号,列表
    //  * @param {Function} callback 回调函数
    //  * @return {undefined} undefined
    //  */
    //  get_book_record_list() {
    //   // 0预约中 ;1预约成功;2.预约取消
    //   let params = {
    //     orderNoList: this.orderNoList
    //   };
    //   // 预约投注拉单,预约注单状态
    //   this.get_book_status_data(params, (code, data) => {
    //     if (code == 200) {
    //       if(data && data.length>0) {
    //         // 如果不是预约中状态，从预约中列表中删除
    //         let order_data = data.filter(item => item.preOrderStatus != 0)
    //         let order_list = _.map(order_data, 'orderNo')
    //         this.record_data.records = this.record_data.records.filter(item => !_.includes(order_list, item.orderNo))
    //         if (this.record_data.records.length == 0) {
    //           this.load_data_state = "empty";
    //           this.clear_timer_get_book()
    //         } else {
    //           this.load_data_state = "data";
    //         }
    //       }
    //       }
    //   });
    // },
    /**
     * @description: 查询服务器上记录的时间
     * @param {Number} page 当前页
     * @return {undefined} undefined
     */
    get_record_server_time(page) {
      this.get_server_time((code, data) => {
        if (code == 200) {
          // 从当前时间开始的前24小时的记录
          this.begin_time = data.getTime() - (24 * 60 * 60 * 1000);
          this.end_time = data.getTime();
          if (page) {
            this.cur_page = page;
          }
          if (this.selected === 2) {
            // 预约投注记录
            this.get_book_list(this.cur_page);
          } else {
            this.clear_timer_get_book()
            this.get_record_list(this.cur_page);
          }
        }
      });
    },
     /**
     * @description: 启动5秒一次轮训预约投注记录
     * @param {undefined} undefined 
     * @return {undefined} undefined
     */
    res_timer_get_book() {
      this.clear_timer_get_book()
      this.timer_get_book = setInterval(() => {
        this.get_book_record_list();
      }, 5000);
    },
    // 清除5秒一次轮训预约投注中记录查询定时器
    clear_timer_get_book() {
      if(this.timer_get_book) {
          clearInterval(this.timer_get_book)
          this.timer_get_book = undefined
        }
    },
    // 有订单号时去除取消预约成功的数据，status弹窗状态，启动轮询/关闭轮询
    delete_book_record(orderNo, status) {
      if(orderNo) {
        // 立即查询
        this.get_book_record_list();
      }
      if (status) {
        // 清除5秒一次轮训预约投注中记录查询定时器
        this.clear_timer_get_book()
      } else {
        // 启动5秒一次轮训预约投注记录
        this.res_timer_get_book()
      }
    },
    /**
     * 查询待确认中的提前结算单
     */
    query_order_pre_settle_confirm(record_list) {
      this.order_pre_settle_confirm((code,data)=>{
        if(code == 200 && _.isArray(data)) {
          let confirm_obj = {};
          // 对确认中的数据对象化
          _.forEach(data, item=>{
            if(item && item.orderNo && item.frontSettleAmount) {
              // 确认对象key为订单号 value为确认金额
              confirm_obj[item.orderNo] = item;
            }
          });
          this.get_record_obj(record_list, confirm_obj);
        } else {
          this.get_record_obj(record_list);
        }
      });
    },
    /**
     * 获取投注记录对象并订阅C21
     * @param {*} record_list
     * @param {*} data
     */
    get_record_obj(record_list, data) {
      let record_obj = this.get_obj(record_list, data);
      delete record_obj.list;
      this.record_obj = record_obj;
      // 检查状态是否从确认中变为已完成
      if (this.check_confirm_complete()) {
        // 定时调用方法在reccord_common.js中
        this.get_timed_task();
      }
      if (this.record_data.records.length == 0) {
        this.load_data_state = "empty";
      } else {
        this.load_data_state = "data";
        // 提前结算开关打开时订阅提前结算注单
        if(this.selected == 0 && this.vx_get_user.settleSwitch) {
          // 订阅C21
          this.SCMD_C21();
        }
      }
    },
    /**
     * @description: 提前结算实时查询，取里面orderNo
     * @param {Object} params undefined
     * @param {Function} callback undefined
     * @return {undefined} undefined
     */
    get_order_no() {
      // 过滤提前结算条件，同步提前结算按钮显示条件
      let orderNo_ =  _.filter(this.record_data.records, {'enablePreSettle': true, 'orderStatus': '0', 'initPresettleWs': true });
      let orderNo = _.map(orderNo_, 'orderNo')
      this.orderNo_list = [...this.orderNo_list,...orderNo]
      if(this.orderNo_list && this.orderNo_list.length) {
        // 提前结算实时查询定时器
        this.res_timer_get_cashout()
      }
    },
    // 重置提前结算实时查询定时器，5秒1次接口查询
    res_timer_get_cashout() {
      this.get_cashout_max_amount_list(this.orderNo_list)
      //清除提前结算实时查询定时器
      this.clear_timer_get_cashout()
      // 首次进入投注记录的时候触发一次
      this.timer_get_cashout = setInterval(()=>{
        // 传入查询提前结算的订单
        this.get_cashout_max_amount_list(this.orderNo_list)
      }, 5000)
    },
    // 清除提前结算实时查询定时器
    clear_timer_get_cashout() {
      if(this.timer_get_cashout) {
          clearInterval(this.timer_get_cashout)
          this.timer_get_cashout = undefined
        }
    },
    /**
     * @description: 获取投注记录数据
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    get_cashout_max_amount_list(orderNo_list){
      // 提前结算的订单号逗号拼接
      let params = { orderNo: orderNo_list.join(',') }
      this.get_bet_cashout_max_amount(params, (code, data) => {
        if (code == 200) {
          // 过滤订单未结算状态
          this.orderNo_data_obj = _.filter(data, {'orderStatus': 0});
          this.orderNo_data_list = _.map(this.orderNo_data_obj, 'orderNo');
          // 判断每5秒实时拉取新的投注额maxout是否为null，是则重新拉取列表数据
          this.count_cashout(this.orderNo_data_obj)
        }
      })
    },
    /**
     * @description: 更新提前结算金额
     */
    upd_cashout_max_amount_list(obj){
      if(obj && _.get(this.orderNo_data_obj,'length')){
        // 进行遍历比对订单
        for (let i = 0; i < this.orderNo_data_obj.length; i++) {
          const item = this.orderNo_data_obj[i];
          const pre_settle_max_win = _.get(obj,'preSettleAmount');
          // 比对订单id
          if(_.get(item,'orderNo')==_.get(obj,'orderNo') && pre_settle_max_win){
            // 更新提前结算金额
            item.preSettleMaxWin = pre_settle_max_win;
            this.orderNo_data_obj = _.cloneDeep(this.orderNo_data_obj);
            this.orderNo_data_list = _.cloneDeep(this.orderNo_data_list);
            break;
          }
        }
      }
    },
    /**
     * @description: 判断没5秒拉取新的投注额maxout是否为null，是则重新拉取列表数据
     */
    count_cashout(orderNo_data_obj) {
      // 当返回preSettleMaxWin为null时，定时1秒重新拉次数据
      let maxcashout_list = _.map(orderNo_data_obj, 'preSettleMaxWin')
      // 判断提前结算实时查询返回集合数据的投注额maxout有null
      if (_.includes(maxcashout_list, null)) {
         // 清除重新拉取投注记录定时器
        this.clear_send_cashout()
        this.send_cashout = setTimeout(()=>{
          // 重新拉取列表数据
          this.get_record_list(this.cur_page);
        },1000)
      }
    },
    // 清除重新拉取投注记录定时器
    clear_send_cashout() {
      if(this.send_cashout) {
        clearTimeout(this.send_cashout);
        this.send_cashout = undefined
      }
    },
    /**
     * @description: 加载更多按钮功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    load_more() {
      if (this.total_page != 0 && this.cur_page < this.total_page) {
        // 翻页
        this.cur_page += 1;
        this.get_record_server_time();
      }
    },
    /**
     * @description: 查看所有投注单功能
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
    show_all_record() {
      // token失效
      if (this.show_fail_alert()) {
        return;
      }
      let _window_width = 1000;
      let _window_height = 650;
      //偏移量
      let _window_offset_left = (screen.width - _window_width) / 2;
      let _window_offset_top = (screen.height - _window_height) / 2;
      let path = this.$router.resolve({ path: '/bet_record' }).href;
      path = '/'+path.substr(path.indexOf('#/'))
      //打开一个新窗口
      window.open(
        `${path}?selected=${this.selected}&appoint_order_status=${this.appoint_order_status}`,
        "",
        `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
      );
    },
    /**
     * @description: 将投注记录数组数据转换成对象
     * @param {Array} record_list 投注记录列表数据
     * @param {Object} data 确认中的提前结算数据
     * @return {Object}
     */
    get_obj(record_list, data) {
      let obj = { list: record_list };
      if (obj.list && obj.list.length) {
        obj.list.forEach(item => {
          // 1 AVAILABLE(=1才能提前结算), -1 UNAVAILABLE, -2 CLOSED
          item.cash_out_status = 1;
          item.settle_status = 0; // 结算状态
          // 提前结算数据存在，且是当前订单的
          if(data && data[item.orderNo]) {
            let confirm_obj = data[item.orderNo];
            if(confirm_obj.preSettleOrderStatus == 0) {
              // 设置结算状态为开始结算
              item.bet_status = 'start_bet_pre';
              // 设置结算确认状态为true
              item.bet_confirm = true;
            } else if(confirm_obj.preSettleOrderStatus ==  2) { // 拒单
              item.bet_status = 'default';
              item.bet_confirm = false;
            }
            item.pre_settle_order_status = confirm_obj.preSettleOrderStatus;
            // 结算金额设置
            item.amount = confirm_obj.frontSettleAmount;
          }
          obj[item.orderNo] = item;
        });
      }
      if (obj.list) {
        let temp = this.record_data.records;
        this.record_data.records = obj.list;
        if (temp && temp.length) {
          for (let i = 0; i < temp.length; i++) {
            temp.splice(i, 1);
            i--;
          }
        }
      }
      return obj;
    },
    /**
     * @description: 订单结算状态
     * @param {String} type 订单的类型
     * @return {String} 需要显示的结算文本
     */
    order_status(type) {
      let text = "";
      switch (parseInt(type)) {
        /* case 0:
          return this.$root.$t('common.no_settlement');//"未结算";
        case 1:
          return this.$root.$t('common.settlement');//"结算";
        case 2:
          return this.$root.$t('bet.betting_cancel'); //注单取消
        */
        case 2:
          text = this.$root.$t('bet_record.bets_invalid');  //注单无效
          break;
        case 3:
          text = this.$root.$t('bet.bet_loading');  // 确认中
          break;
        case 4:
          text = this.$root.$t('bet.bet_fail'); // 投注失败
          break;
      }
      return text;
    },
    /**
     * @description: 根据订单类型获取需要显示的订单样式
     * @param {String} type 订单的类型
     * @return {String} 需要显示的结算样式
     */
    order_class(type) {
      let class_text = "";
      switch (parseInt(type)) {
        case 2:
          class_text = "bet-valid-text"; //"注单取消";
          break;
        case 3:
          class_text = "bet-confirm-text"; //"确认中";
          break;
        case 4:
          class_text = "lose-color"; //"投注失败";
          break;
      }
      return class_text;
    },
    /**
     * @description: 获取确认中的订单状态
     * @param {Object} order 订单对象
     * @return {Boolean} 需要显示的结算样式
     */
    get_bet_status(order) {
      if (!order) return false;
      let index = _.findIndex(order, item => item.betStatus == 3);
      return index > -1;
    },
    /**
     * 点击投注项记录调用赛果是否存在接口进行判断，如果存在赛果则跳转赛果，若不存在，则跳转到赛事详情
     * @param {*} order
     */
    go_match(item, order) {
      if(!this.show_arrow(item, order)) {
        return;
      }
      let { matchId, playOptionsId, tournamentId, sportId } = order;
      // 订单赛果查询接口
      this.get_exist_match_result({matchId, playOptionsId}, (code, data) => {
        if (code == 200) {
          // data true跳转赛果 false跳转详情
          if(data && data.marketResult) {
            let lang = item.langCode;
            this.open_window(order, data.matchEnd, lang);
          } else {
            // 赛事未结束，且没有赛果，调详情页
            if(!data.matchEnd) {
              this.$router.push({
                name: 'details',
                params: {
                  mid: matchId,
                  tid: tournamentId,
                  csid: sportId
                }
              })
            }
          }
        }
      });
    },
    /**
     * 是否需要显示箭头
     */
    show_arrow(item, order) {
      let bet_result = order.betResult * 1,
          order_status = item.orderStatus * 1,
          cancel_type = order.cancelType * 1;
      // 虚拟体育 冠军
      if([...play_mapping.VIRTUAL_SPORT_ID,
          ...play_mapping.ESPORTS_SPORT_ID
         ].includes(`${order.sportId}`) || order.matchType==3) {
        return false
      }
      //投注结果  7:赛事取消 8:比赛延期 11: 比赛延迟 12: 比赛中断 13: 未知 15: 比赛放弃 16: 盘口异常
      if([7,8,11,12,13,15,16].includes(bet_result)) {
        return false;
      }
      // 2:注单取消,3:确认中,4:投注失败
      if([2,3,4].includes(order_status)) {
        return false;
      }
      // 取消类型
      if(play_mapping.CANCEL_TYPE.includes(cancel_type)) {
        return false;
      }
      return true;
    },
    /**
     * 打开赛果页面或者详情
     * @param {*} order 订单对象
     * @param {*} matchEnd 是否有赛果
     */
    open_window(order, matchEnd = true, lang='zh') {
      let _window_width = 1000;
      let _window_height = 650;
        let _window_offset_left = (screen.width - _window_width) / 2; // 左侧位置
        let _window_offset_top = (screen.height - _window_height) / 2; // 顶部位置
        let homeName, awayName;
        let match_info = _.get(order, 'matchInfo', '');
        if(match_info) {
          match_info = match_info.split(' v ');
          // 设置主客队名称
          homeName = _.trim(match_info[0]);
          awayName = _.trim(match_info[1]);
          // 如果包含即时比分，则进行处理
          let reg = /\(\d+-\d+\)/;
          if(reg.test(awayName)) {
            let result = reg.exec(awayName);
            if(result instanceof Array) {
              let target = result[0];
              awayName = awayName.replace(target, '')
            }
          }
        // 设置route中的参数
        let { href } = this.$router.resolve({
          name: "match_results",
          query: {
            matchId: order.matchId, // 赛事id
            csid: order.sportId,  // 球种id
            tid: order.tournamentId, // 联赛id
            playId: order.playId, // 玩法id
            homeName, // 主队名称
            awayName, // 客队名称
            matchEnd, // 是否有成赛果
            lang // 语言
          }
        });
        href = '/'+href.substr(href.indexOf('#/'))
        window.open(
          href,
          "",
          `height=${_window_height}, width=${_window_width}, top=${_window_offset_top}, left=${_window_offset_left}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,fullscreen=no`
        )
      }
    },
    get_bet_history_record() {
      // 情况投注记录数据
      this.record_data.records = [];
      // 总页数归0
      this.total_page = 0;
      // 获取服务器时间戳
      this.get_record_server_time(1);
      // 发送订阅指令
      this.sendSocketInitCmd();
    }
  },
  destroyed() {
    this.record_data = {};
    this.record_obj = {};
    this.$root.$off(this.emit_cmd.EMIT_DEL_BOOK_HISTORY_RECORD_CMD, this.delete_book_record);

    this.clear_timer_get_cashout()
    this.clear_send_cashout()
    this.clear_timer_get_book()
    this.$root.$off(this.emit_cmd.EMIT_UPD_CASHOUT_MAX_AMOUNT_LIST_CMD, this.upd_cashout_max_amount_list);
  }
}
