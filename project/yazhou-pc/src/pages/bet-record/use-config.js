// <!--
//  * @Author: cooper
//  * @Date: 2023-08-06 17:40:55
//  * @Description:注单历史相关数据
// -->
import lodash from "lodash";
import { ref, watch, onMounted, reactive, toRefs, onUnmounted } from "vue";
import {utils } from 'src/core/index.js';
import { format_day,DateForMat } from "src/core/format/index.js";
import { api_common, api_betting, api_account } from "src/api/index";
import { i18n_t } from "src/boot/i18n.js";
import uid from "src/core/uuid/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";


export const useConfig = () => {
  //时间排序数据
  const record_time_sort = [
    {
      id: 2,
      name: i18n_t("bet_record.sort_by_settled_time"), //"默认排序(结算时间)",
      icon: "icon-sort_settle_time",
      check_name: "bet_record.settled_time",
    },
    {
      id: 1,
      name: i18n_t("bet_record.sort_by_bet_time"), //"按投注时间排序",
      icon: "icon-sort_bet_time",
      check_name: "bet_record.bet_time",
    },
    {
      id: 3,
      name: i18n_t("bet_record.sort_by_match_time"), //"按开赛时间排序",
      icon: "icon-sort_match_time",
      check_name: "bet_record.match_time",
    },
  ];
  const betRecord = ref(null)
  const filter_box = ref(null)
  const state = reactive({
    day_time: "", //今日时间
    startDateSearch: DateForMat((new Date() - 86400000), "yyyy/MM/dd"), // 开始时间
    endDateSearch: DateForMat(new Date(), "yyyy/MM/dd"), // 结束时间
    params: {
      page: 1, //当前页
      size: 50, //每页显示大小
      orderStatus: 0, //(0:未结算 1:已结算)
      // timeType: 4, //查询类型	(1:今天 2:昨日 3:七日内 4:一月内)
      // userId: "", //用户ID
      orderBy: 1, // 排序 1投注时间,2 结算时间,3 开赛时间
    },
    // 提前结算状态orderNo
    orderNo_list: [],
    order_list: {},
    record_obj: {},
    // 提前结算状态item
    orderNo_data_obj: [],
    // 提前结算状态单号
    orderNo_data_list: [],
    // 当maxcashout为null时，定时1秒重新拉次数据，拉取次数
    get_cashout_num: 0,
    is_book_status: ["0"], // 预约注单筛选状态条件
    data_state: {
      load_data_state: "loading",
    },
    timer_get_cashout: null,
    timer_get_book: null,
    timer: undefined,
    // 时间排序数据每一项的选项
    time_sort_record_item: {},
    toolIndex: null, // 当前选中 tab 的下标
    model: {
      from: DateForMat((new Date() - 86400000), "yyyy/MM/dd"),
      to: DateForMat(new Date(), "yyyy/MM/dd"),
    },
    old_page_size: 0,
    random: 0,
    // 提前结算实时查询返回的maxout有null时，重新拉取投注记录数据的定时器
    send_cashout: undefined,
    // 预约orderNo
    orderNo_book: [],
    tips: {
      //自定义提示
      //显隐
      statu: false, 
      message: "",
    },
    //设置确认中状态为true
    has_confirm_status: "", 
    getBook_gcuuid: '',
    // 用户信息
    toolSelected: 0,
    // 提前结算勾选
    is_pre_bet: 'false', 
    // 开始时间展示
    startTimeShow: false, 
  });
  // watch(
  //   () => state.model,
  //   (n) => {
      
  //   }
  // );
  /**
   * @description: 获取全局点击  TODO
   * @param {undefined} undefined
   * @returns {undefined}
   */
  const get_global_click = () => {
      state.startTimeShow = false;
      state.show_select_time_sort = false
    }

  /**
   * @description:清除提前结算实时查询定时器
   * @param {undefined} undefined undefined
   * @return {undefined} undefined
   */
  const clear_timer_get_cashout = () => {
    if (state.timer_get_cashout) {
      clearInterval(state.timer_get_cashout);
      state.timer_get_cashout = undefined;
    }
  };
  // 清除5秒一次轮训预约投注中记录查询定时器
  const clear_timer_get_book = () => {
    if (state.timer_get_book) {
      clearInterval(state.timer_get_book);
      state.timer_get_book = undefined;
    }
  };

  /**
   * 日期改变
   */
  const dateChanged = (start, end) => {
    state.startDateSearch = start;
    state.endDateSearch = end;
  };
  /**
   * @设置选择时间
   */
  const set_search_time = (i) => {
    if (i == 0) {
      let date = format_day(state.day_time ? new Date(state.day_time).getTime() : new Date().getTime());
      state.model = [date];
      dateChanged(date, date);
      return;
    }
    //昨天

    if (i == 1) {
      let date = format_day(new Date(state.day_time - 86400000).getTime());
      state.model = [date];
      dateChanged(date, date);
      return;
    }
    state.endDateSearch = format_day(new Date(state.day_time).getTime());
    state.model.to = format_day(new Date(state.day_time).getTime());
    //一个月
    if (i == 3) {
      let time = 86400000 * 29;
      state.startDateSearch = format_day(
        new Date(state.day_time - time).getTime()
      );
      state.model.from = state.startDateSearch;
      // 如果存在单个日期，就把单日期去掉，否则会默认选中单日期而不是范围选择
      if (state.model[0]) {
        state.model = { from: state.model.from, to: state.model.to };
      }
      dateChanged(state.model.from, state.model.to);
      return;
    }
    //七日内
    if (i == 2) {
      let time = 86400000 * 6;
      state.startDateSearch = format_day(
        new Date(state.day_time - time).getTime()
      );
      state.model.from = state.startDateSearch;
      // 如果存在单个日期，就把单日期去掉，否则会默认选中单日期而不是范围选择
      if (state.model[0]) {
        state.model = { from: state.model.from, to: state.model.to };
      }
      dateChanged(state.model.from, state.model.to);
    }
  };

  /**
   * @description:重置提前结算实时查询定时器，5秒1次接口查询
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  const res_timer_get_cashout = () => {
    clear_timer_get_cashout();
    setTimeout(() => {
      get_cashout_max_amount_list(state.orderNo_list);
    }, 500);
    state.timer_get_cashout = setInterval(() => {
      // 传入查询提前结算的订单
      get_cashout_max_amount_list(state.orderNo_list);
    }, 5000);
  };
  /**
   * @description: 获取投注记录数据
   * @param {Object} params 投注记录入参
   * @param {Function} callback 回调函数
   * @return {undefined} undefined
   */
  const get_cashout_max_amount_list = (orderNo_list) => {
    // 提前结算的订单号逗号拼接
    let params = { orderNo: orderNo_list.join(",") };
    api_betting.get_cashout_max_amount_list(params).then((res) => {
      let code = lodash.get(res, "data.code");
      let data = lodash.get(res, "data.data");
      if (code == 200) {
        // 过滤订单未结算状态
        state.orderNo_data_obj = lodash.filter(data, { orderStatus: 0 });
        state.orderNo_data_list = lodash.map(state.orderNo_data_obj, "orderNo");
        // 判断每5秒实时拉取新的投注额maxout是否为null，是则重新拉取列表数据
        count_cashout(state.orderNo_data_obj);
      }
    });
  };
  /**
   * @description: 判断没5秒拉取新的投注额是否为null，是则重新拉取列表数据
   * @param {Object} orderNo_data_obj 投注记录入参
   * @return {undefined} undefined
   */
  const count_cashout = (orderNo_data_obj) => {
    // 当返回preSettleMaxWin为null时，定时1秒重新拉次数据
    let maxcashout_list = lodash.map(orderNo_data_obj, "preSettleMaxWin");
    // 判断提前结算实时查询返回集合数据的投注额有null
    if (lodash.includes(maxcashout_list, null)) {
      clear_send_cashout();
      state.send_cashout = setTimeout(() => {
        // 重新拉取列表数据
        getOrderList();
      }, 1000);
    }
  };
  // 清除重新拉取投注记录定时器
  const clear_send_cashout = () => {
    if (state.send_cashout) {
      clearTimeout(state.send_cashout);
      state.send_cashout = undefined;
    }
  };

  // 有订单号时去除取消预约成功的数据，status弹窗状态，启动轮询/关闭轮询
  const delete_book_record = (orderNo, status) => {
    if (orderNo) {
      // 立即查询
      get_book_record_list();
    }
    if (status) {
      // 清除5秒一次轮训预约投注中记录查询定时器
      clear_timer_get_book();
    } else {
      // 启动5秒一次轮训预约投注记录
      res_timer_get_book();
    }
  };

  /**
   * @description: 提前结算实时查询，取里面orderNo
   * @param {Object} params undefined
   * @param {Function} callback undefined
   * @return {undefined} undefined
   */
  const get_order_no = () => {
    // 过滤提前结算条件，同步提前结算按钮显示条件
    let orderNo_ = lodash.filter(state.order_list.records, {
      enablePreSettle: true,
      orderStatus: "0",
      initPresettleWs: true,
    });
    let orderNo = lodash.map(orderNo_, "orderNo");
    state.orderNo_list = orderNo;
    if (state.orderNo_list && state.orderNo_list.length) {
      // 提前结算实时查询定时器
      res_timer_get_cashout();
    }
  };
  // 启动5秒一次轮训预约投注记录
  const res_timer_get_book = () => {
    clear_timer_get_book();
    state.timer_get_book = setInterval(() => {
      get_book_record_list();
    }, 5000);
  };
  /**
   * @description: 轮询更新获取预投住中注单记录(只查预约中数据)
   * @param {Number} cur_page 当前页 第一页
   * @param {Number} preOrderStatus (0预约中 ;1预约成功;2.预约取消)
   * @return {undefined} undefined  TODO
   */
  const get_book_record_list = () => {
    // 0预约中 ;1预约成功;2.预约取消
    let params = {
      orderNoList: state.orderNo_book,
    };
    // 获取预约中记录数据
    api_betting.get_book_status_record(params).then((res) => {
      let code = lodash.get(res, "data.code");
      let data = lodash.get(res, "data.data");
      if (code == 200 && data && data.length > 0) {
        let list = lodash.filter(data, (item) => {
          return item.preOrderStatus != 0;
        });
        let list_ = lodash.map(list, "orderNo");
        state.order_list.records.forEach((item, index) => {
          if (list_.includes(item.orderNo)) {
            state.order_list.records.splice(index, 1);
          }
        });
      }
    });
  };
  /**
   * @description: 自定义提示
   * @param {String} message 提示语
   */
  const toast = (message) => {
    /**清除定时器 */
    clearTimeout(state.timer);
    state.timer = null;
    state.tips = {
      statu: true,
      message: message,
    };
    state.timer = setTimeout(() => {
      state.tips.statu = false;
    }, 2000);
  };

  /**
   * @description: 检查状态是否从确认中变为已完成
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  const check_confirm_complete = () => {
    let result = false;
    /* console.log('=========check_confirm_complete===========');
      console.log(`========================record_obj:${JSON.stringify(this.record_obj)}`); */
    for (let obj of Object.values(state.record_obj)) {
      // 是否有确认中状态
      if (obj.orderStatus == 3) {
        state.has_confirm_status = true; // 设置确认中状态为true
        result = true;
        break;
      }
    }
    if (!state.has_confirm_status && state.timer) {
      clearTimeout(state.timer);
    }
    //console.log(`=========has_confirm_status===========${this.has_confirm_status}`);
    return result;
  };

  /**
   * @description: 定时任务
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  const get_timed_task = () => {
    //console.log('====================bet_record_view=============get_timed_task');
    if (state.has_confirm_status) {
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = undefined;
      }
      state.timer = setTimeout(() => {
        //console.log('====================bet_record_view============ddddadafda');
        get_order_result();
      }, 5 * 1000); // 30s拉取接口改为5S
    }
  };

  /**
   * @description: 获取订单结果
   * @param {undefined} undefined
   * @return {undefined} undefined
   */
  const get_order_result = () => {
    //console.log('=================================get_order_result========check_confirm_complete:'+this.check_confirm_complete());
    let orderNos = [];
    for (let [orderNo, obj] of Object.entries(this.record_obj)) {
      // 确认中状态则用orderNos收集订单号
      if (obj.orderStatus == 3) {
        orderNos.push(orderNo);
      }
    }
    if (orderNos.length > 0) {
      orderNos = orderNos.join(",");
      api_betting
        .query_order_status({ orderNos })
        .then((res) => {
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data");
          let handle_time = _.get(res, "data.ts");
          //console.log(`=====================================${JSON.stringify(data)}`);
          //清除定时器
          if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = undefined;
          }

          // 自动化测试 接口数据
          let data_info = (data && data[0]) || {};
          let order_status = {
            code,
            order_no: data_info.orderNo,
            status: data_info.status,
            refuse_code: data_info.refuseCode,
          };
          this.vx_set_order_status(order_status);

          if (code == 200 && data) {
            _.forEach(data, (item) => {
              // 如果C201和接口拉取都同时进行,则优先最晚的执行
              if (
                this.record_obj[item.orderNo] &&
                this.record_obj[item.orderNo].handle_time &&
                this.record_obj[item.orderNo].handle_time > handle_time
              ) {
                return;
              }
              Object.assign(this.record_obj[item.orderNo], {
                orderStatus: `${item.status}`,
                handle_time,
              });
              if (item.status == 0) {
                // 订单状态为成功时 合并一下最新的数据,如果为失败则什么都不做
                if (item.oddsChangeList && item.oddsChangeList.length) {
                  Object.assign(this.record_obj[item.orderNo], {
                    maxWinAmount: (
                      (parseFloat(item.newTotalMaxWinAmount) * 100) /
                      10000
                    ).toFixed(2),
                  });
                  _.forEach(item.oddsChangeList, (item2) => {
                    if (
                      this.record_obj[item.orderNo].orderVOS &&
                      this.record_obj[item.orderNo].orderVOS.length
                    ) {
                      // 都住单对应的投注项集合获取
                      let order_vos = this.record_obj[item.orderNo].orderVOS;
                      for (let i = 0; i < order_vos.length; i++) {
                        // 根据投注单id进行匹配
                        if (order_vos[i].playOptionsId == item2.playOptionsId) {
                          // 如果是单关的话后台返回的是最终赔率不用除10000
                          if (this.record_obj[item.orderNo].seriesType == "1") {
                            Object.assign(
                              this.record_obj[item.orderNo].orderVOS[i],
                              { oddFinally: item2.usedOdds }
                            );
                          } else {
                            Object.assign(
                              this.record_obj[item.orderNo].orderVOS[i],
                              { oddFinally: item2.usedOdds }
                            );
                          }
                          // 更新vuex里面的数据
                          let bet_obj = _.cloneDeep(
                            this.yabo_common.get_bet_obj(this, oid)
                          );
                          if (bet_obj) {
                            bet_obj.cs.odds_value = item2.usedOdds;
                            bet_obj.bs.hps[0].hl[0].ol[0].ov = item2.usedOdds;
                            this.yabo_common.set_bet_obj_value(this, bet_obj);
                            // 同步详情和列表的数据
                            this.yabo_common.update_odds_info(this);
                          }
                          break;
                        }
                      }
                    }
                  });
                }
              }
            });
          }
          // 是否要继续执行
          if (!this.check_confirm_complete()) return;
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
          }
          this.timer = setTimeout(() => {
            this.get_order_result();
          }, 2 * 1000); // 5s 改为 2s
        })
        .catch(() => {
          console.log("获取订单状态和最新赔率最高可盈接口调用异常");
          //清除定时器
          if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = undefined;
          }
          this.timer = setTimeout(() => {
            this.get_order_result();
          }, 2 * 1000); // 5s 改为 2s
        });
    }
  };

  /**
   * @更新用户余额
   * @param uid ：this.params.userId
   */
  const get_balance = () => {
    const get_balance_gcuuid = UserCtr.get_uid();
    let gcuuid = get_balance_gcuuid;
    // console.log('get_balance===', JSON.stringify(gcuuid));
    api_account
      .check_balance({ uid: UserCtr.get_uid, t: new Date().getTime(), gcuuid })
      .then((res) => {
        // console.log('get_balance===', this.get_balance_gcuuid === res.config.gcuuid);
        //检查gcuuid
        let gcuuid = lodash.get(res, "config.gcuuid");
        if (gcuuid && get_balance_gcuuid != gcuuid) {
          return;
        }

        const result = lodash.get(res, "data.data");
        const code = lodash.get(res, "data.code");
        if (code == 200) {
          // this.vx_set_user_balance(result.amount);  //todo
        }
      });
  };
  // =================================

/**
 * @description:记录切换 结算、未结算
 * @param f 0:未结算 1:已结算 2:预约注单
 * @return {undefined} undefined
 */
const toolClicked = (f) => {
  state.toolSelected = f;
  clear_timer_get_cashout();
  clear_timer_get_book();
  state.order_list = {};
  state.params.orderStatus = f;
  state.params.enablePreSettle = state.is_pre_bet;
  if (f == 2) {
    // 初始化预约筛选条件
    state.is_book_status = ["0"];
    getBookList();
  } else if (f == 0) {
    state.params = lodash.omit(state.params, "timeType");
    resetParams("clearDate");
    if (state.is_pre_bet) {
      state.params.size = 200;
      useMittEmit(
        MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD,
        state.params.size
      );
    }
    // 统计未结算订单
    useMittEmit(MITT_TYPES.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
    getOrderList();
  } else {
    if (localStorage.getItem("time_sort_record")) {
        state.time_sort_record_item = JSON.parse(
        localStorage.getItem("time_sort_record")
      );
    } else {
      state.time_sort_record_item = record_time_sort[0];
    }
    state.params.orderBy = state.time_sort_record_item.id;
    state.params.page = 1;
    state.params.timeType = 1;
    state.toolIndex = 0;
    set_search_time(0);
    if (state.old_page_size) {
      state.params.size = state.old_page_size;
      // TODO
      useMittEmit(
        MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD,
        state.params.size
      );
    }
    getOrderList();
  }
};
/**
 * 查询提前结算的列表
 */
const search_pre_record = (is_pre_bet) => {
  state.is_pre_bet = is_pre_bet;
  state.params.enablePreSettle = is_pre_bet;
  if (state.is_pre_bet) {
    state.params.size = 200; // 部分页
  } else {
    state.params.size = 50;
  }
  getOrderList();
};
/**
 * @时间类型查询
 * @param i 1:今天 2:昨日 3:七日内 4:一月内
 */
const chooseTime = (i) => {
  set_search_time(i);
  state.random = Math.random();
  state.toolIndex = i;
  state.params.timeType = i + 1;
  resetParams("clearDate"); //删除日期控件参数
  getOrderList();
};

/**
 * @description:重置请求参数
 * @param type clearDate:清除日历时间、为空时，清除timeType获取未结算记录
 * @return {undefined} undefined
 */
const resetParams = (type) => {
  state.params.page = 1;
  if (type == "clearDate") {
    state.params = lodash.omit(state.params, ["beginTime", "endTime"]);
  } else {
    state.params = lodash.omit(state.params, ["timeType"]);
  }
};
/**
 * @description: 点击时间排序
 * @param {Object} sort 选中时间排序数据对象
 */
const time_sort = (sort) => {
  localStorage.setItem("time_sort_record", JSON.stringify(sort));
  let od_page = state.params.page;
  // match_sort_show = false;
  state.time_sort_record_item = sort;
  state.params.page = 1;
  state.params.orderBy = sort.id;
  if (state.old_page_size) {
    state.params.size = state.old_page_size;
    useMittEmit(MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD, state.params.size);
  }
  if (od_page != 1) {
    useMittEmit(MITT_TYPES.EMIT_RECODES_QUERY_BUT_CMD);
  } else {
    getOrderList();
  }
  console.error(filter_box);
};

// 点击预约注单方法
const check_change = (value) => {
  console.log(value);
  let list = value.split(",");
  state.is_book_status = list || [];
  getBookList();
};

/**
 * @翻页
 * @param tableData
 * size：每页条数
 * page：当前页码
 */
const changePage = (tableData) => {
  state.params.size = tableData[0];
  state.params.page = tableData[2];
  if (state.toolSelected == 2) {
    getBookList();
  } else {
    getOrderList();
  }
};
/**
     * @description:搜索
     * @param {undefined} undefined
     * @return {undefined} undefined
     */
const submit = () => {
  if (!test_time()) {
    return;
  }
  state.params.beginTime = new Date(
    state.startDateSearch.split(" ")
  ).getTime();
  state.params.endTime = new Date(
    `${state.endDateSearch} 23:59:59`
  ).getTime();

  resetParams("clearTime"); //删除时间tab参数
  state.toolIndex = ""; //取消标签选中
  getOrderList();
  useMittEmit(MITT_TYPES.EMIT_RECODES_QUERY_BUT_CMD);
}
const test_time = () => {
  let statu = true;
  const start_day = new Date(`${state.startDateSearch} 00:00:00`).getTime(); //开始时间
  const end_day = new Date(`${state.endDateSearch} 23:59:59`).getTime(); //结束时间

  if (end_day < start_day) {
    // toast(i18n_t("results.early_time")); //请选择晚于开始的结束时间
    statu = false;
    return statu;
  }

  if (start_day > end_day) {
    // toast(i18n_t("results.late_time")); //请选择早于结束的开始时间
    statu = false;
    return statu;
  }

  return statu;
}

/**  TODO
 * @description:获取表格数据
 * @param params
 * @return {undefined} undefined
 */
const getOrderList = (isScoket, callback) => {
  if (state.record_obj) {
    for (let key in state.record_obj) {
      delete state.record_obj[key];
    }
  }
  if (!isScoket) {
    state.data_state.load_data_state = "loading";
  }
  const send_gcuuid = UserCtr.get_uid();
  state.params.gcuuid = send_gcuuid;
  console.log('getOrderList===', JSON.stringify(state.params));
  // 列表数据接口
  api_betting
    .post_order_list(state.params)
    .then((res) => {
      // console.log('getOrderList===', send_gcuuid === res.config.gcuuid);
      //检查gcuuid
      let gcuuid = lodash.get(res, "config.gcuuid");
      if (gcuuid && send_gcuuid != gcuuid) {
        return;
      }

      let code = lodash.get(res, "code");
      let status = lodash.get(res, "status");
      if (code == "0401038") {
        state.data_state.load_data_state = "api_limited";
        clear_timer_get_cashout();
      }
      if (code == 200) {
        const data = lodash.get(res, "data");
        // 当maxcashout为null时，定时1秒重新拉次数据，最多查询5次
        let records_ = lodash.filter(data.records, {
          enablePreSettle: true,
          orderStatus: "0",
          initPresettleWs: true,
        });
        let maxcashout_list = lodash.map(records_, "maxCashout");
        // 判断提前结算实时查询返回集合数据的投注额有null
        if (lodash.includes(maxcashout_list, null)) {
          state.get_cashout_num++;
          if (state.get_cashout_num <= 4) {
            clear_send_cashout();
            state.send_cashout = setTimeout(() => {
              // 重新拉取列表数据
              getOrderList();
            }, 1000);
          } else {
            state.get_cashout_num = 0;
          }
        } else {
          state.get_cashout_num = 0;
        }

        // get_cashout_num ===0是代表提前结算的单子里面maxcashout没有 null
        if (state.get_cashout_num === 0) {
          data.orderStatus = state.params.orderStatus;
          let record_list = data.records;
          if (!record_list) {
            // 已结算注单没有提前结算时的逻辑
            state.data_state.load_data_state = "empty";
            betRecord.value.recordData.total = "0";
            return;
          }
          let new_record_obj = get_obj(record_list, data);
          delete new_record_obj.list;
          state.record_obj = new_record_obj;
          if (check_confirm_complete()) {
            get_timed_task();
          }
          if (
            !state.order_list ||
            !state.order_list.records ||
            state.order_list.records.length == 0
          ) {
            state.data_state.load_data_state = "empty";
          } else {
            // 订阅为结算注单
            if (state.toolSelected == 0 && UserCtr.user_info.settleSwitch) {
              // SCMD_C21();   //todo
              // 提前结算实时查询，取里面orderNo，做提前结算实时查询最新数据处理
              get_order_no();
            }
          }
          get_balance();
          if (lodash.isFunction(callback)) {
            callback();
          }
        } else {
          state.data_state.load_data_state = "record_refresh";
        }
      }
    })
    .catch((err) => {
      console.error(err);
      if (err) {
        if (
          lodash.isPlainObject(err) ||
          lodash.get(err, "response.status") == 404
        ) {
          state.data_state.load_data_state = "404";
        } else {
          state.data_state.load_data_state = "record_refresh";
        }
      } else {
        state.data_state.load_data_state = "record_refresh";
      }
      if (lodash.isFunction(callback)) {
        callback();
      }
    });
};

/**
 * @description:预约
 * @param {callback} callback 回调方法
 * @return {undefined} undefined
 */
const getBookList = (callback) => {
  if (state.record_obj) {
    for (let key in state.record_obj) {
      delete state.record_obj[key];
    }
  }
  state.data_state.load_data_state = "loading";
  let preOrderStatusList = state.is_book_status;
  //0预约中 ;1预约成功;2.风控预约失败;3.风控取消预约注单.4.用户手动取消预约投注
  // jumpFrom跳转来源(非空 1.详情投注界面   2.注单界面)
  let param_obj = {
    page: state.params.page,
    size: state.params.size,
    jumpFrom: 2,
    preOrderStatusList: preOrderStatusList,
  };
  state.getBook_gcuuid = UserCtr.get_uid();
  param_obj.gcuuid = state.getBook_gcuuid;
  // console.log('get_book_record_data==getBookList==',JSON.stringify(param));
  api_betting
    .post_book_list(param_obj)
    .then((res) => {
      // console.log('get_book_record_data==getBookList==res===', getBook_gcuuid == res.config.gcuuid);
      let gcuuid = lodash.get(res, "config.gcuuid");
      if (gcuuid && state.getBook_gcuuid != gcuuid) {
        return;
      }
      let code = lodash.get(res, "code");
      let status = lodash.get(res, "status");
      if (code == 200) {
        const data = lodash.get(res, "data");
        // data.orderStatus = params.orderStatus;
        let record_list = data.records;
        if (!record_list) {
          clear_timer_get_book();
          state.data_state.load_data_state = "empty";
          return;
        }
        let record_obj = get_obj(record_list, data);
        delete record_obj.list;
        record_obj = record_obj;

        if (
          !state.order_list ||
          !state.order_list.records ||
          state.order_list.records.length == 0
        ) {
          clear_timer_get_book();
          state.data_state.load_data_state = "empty";
        } else {
          // 预约中开启定时器，不是则关闭
          if (state.is_book_status.includes("0")) {
            state.orderNo_book = lodash.map(state.order_list.records, "orderNo");
            res_timer_get_book();
          } else {
            state.orderNo_book = "";
            clear_timer_get_book();
          }
        }
      }
      if ("0401038" == code) {
        clear_timer_get_book();
        state.data_state.load_data_state = "code_empty";
        return;
      }
    })
    .catch((err) => {
      console.error(err);
      if (err) {
        if (
          lodash.isPlainObject(err) ||
          lodash.get(err, "response.status") == 404
        ) {
          state.data_state.load_data_state = "404";
        } else {
          state.data_state.load_data_state = "record_refresh";
        }
      } else {
        state.data_state.load_data_state = "record_refresh";
      }
      if (lodash.isFunction(callback)) {
        callback();
      }
    });
};

const get_obj = (record_list, data) => {
  let obj = { list: record_list };
  if (obj.list && obj.list.length) {
    obj.list.forEach((item) => {
      obj[item.orderNo] = item;
    });
  }
  if (obj.list) {
    delete data.records;
    state.order_list = data;
    let temp = state.order_list.records;
    state.order_list.records = obj.list;
    if (temp && temp.length) {
      for (let i = 0; i < temp.length; i++) {
        temp.splice(i, 1);
        i--;
      }
    }
  }
  return obj;
};


  //===================================

  //   ( 待改造)
  onMounted(() => {
    state.params.userId = UserCtr.get_uid();
    getOrderList()
    useMittOn(MITT_TYPES.EMIT_CHANGE_CHECK, (val) => {
      check_change(val)
    })
  });

  onUnmounted(() => {
    state.order_list = {};
    state.record_obj = {};
    state.data_state = {};
    state.params = {};
    clearTimeout(state.timer);
    clear_timer_get_book();
    clear_timer_get_cashout();
    clear_send_cashout();
  });

  return {
    ...toRefs(state),
    filter_box,
    uid,
    betRecord,
    record_time_sort,
    clear_timer_get_cashout,
    clear_timer_get_book,
    set_search_time,
    res_timer_get_cashout,
    delete_book_record,
    clear_send_cashout,
    check_confirm_complete,
    get_order_no,
    get_balance,
    getBookList,
    get_obj,
    getOrderList,
    changePage,
    check_change,
    time_sort,
    resetParams,
    chooseTime,
    search_pre_record,
    toolClicked,
    submit,
    dateChanged,
  };
};
