// <!--
//  * @Author: cooper
//  * @Date: 2023-08-06 17:40:55
//  * @Description:注单历史相关数据
// -->
import lodash from "lodash";
import { ref, watch, onMounted, reactive, toRefs,onUnmounted } from "vue";
import utils from "src/core/utils/utils";
import { format_day } from "src/core/formart/index.js";
import {
    api_common,
    api_betting,
    api_account,
  } from "src/public/api/index";

export const useConfig = ({ getOrderList }) => {
  //时间排序数据
  const record_time_sort = [
    {
      id: 2,
      name: this.$root.$t("bet_record.sort_by_settled_time"), //"默认排序(结算时间)",
      icon: "icon-sort_settle_time",
      check_name: "bet_record.settled_time",
    },
    {
      id: 1,
      name: this.$root.$t("bet_record.sort_by_bet_time"), //"按投注时间排序",
      icon: "icon-sort_bet_time",
      check_name: "bet_record.bet_time",
    },
    {
      id: 3,
      name: this.$root.$t("bet_record.sort_by_match_time"), //"按开赛时间排序",
      icon: "icon-sort_match_time",
      check_name: "bet_record.match_time",
    },
  ];

  const state = reactive({
    day_time: "", //今日时间
    startDateSearch: "", // 开始时间
    endDateSearch: "", // 结束时间
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
      from: new Date(new Date() - 86400000).Format("yyyy/MM/dd"),
      to: new Date().Format("yyyy/MM/dd"),
    },
    old_page_size: 0,
    random: 0,
    // 提前结算实时查询返回的maxout有null时，重新拉取投注记录数据的定时器
    send_cashout: undefined,
    // 预约orderNo
    orderNo_book: [],
    tips: {
        //自定义提示
        statu: false, //显隐
        message: "",
      },
  });
  watch(()=>state.model,n=>{
    if (n) {
        // 这里会存在选中单个日期的情况 ['2021/12/12', from: '2021/01/01', to: '2021/01/07']
        if (!n.from) {
          if (lodash.isArray(n)) {
            dateChanged(n[0], n[0])
          } else{
            dateChanged(n, n)
          }
        } else {
          dateChanged(n.from, n.to)
        }
      }
  })
  /**
     * @description: 获取全局点击  TODO
     * @param {undefined} undefined
     * @returns {undefined}
     */
//   get_global_click() {
//     this.startTimeShow = false;
//     this.show_select_time_sort = false
//   }



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
      let date = format_day(new Date(state.day_time).getTime());
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
      this.get_cashout_max_amount_list(this.orderNo_list);
    }, 500);
    state.timer_get_cashout = setInterval(() => {
      // 传入查询提前结算的订单
      get_cashout_max_amount_list(this.orderNo_list);
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
      // 启动5秒一次轮训预约投注记录
    const  res_timer_get_book=()=> {
        clear_timer_get_book()
        state.timer_get_book = setInterval(() => {
          get_book_record_list();
        }, 5000);
      }
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
    const toast=(message)=> {
        /**清除定时器 */
        clearTimeout(state.timer)
        state.timer = null
        state.tips = {
          statu: true,
          message: message,
        };
        state.timer = setTimeout(() => {
          state.tips.statu = false;
        }, 2000);
      }

  //   ( 待改造)
  onMounted(() => {});

  onUnmounted(()=>{
    state.order_list = {};
    state.record_obj = {};
    state.data_state = {};
    state.params = {};
    clearTimeout(state.timer);
    clear_timer_get_book()
    clear_timer_get_cashout()
    clear_send_cashout()
  })

  return {
    ...toRefs(state),
    clear_timer_get_cashout,
    clear_timer_get_book,
    record_time_sort,
    set_search_time,
    res_timer_get_cashout,
    delete_book_record
  };
};
