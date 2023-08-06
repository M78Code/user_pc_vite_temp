// <!--
//  * @Author: cooper
//  * @Date: 2023-08-06 17:40:55
//  * @Description:注单历史相关数据
// -->
import lodash from "lodash";
import { ref, watch, onMounted, reactive, toRefs } from "vue";
import utils from "src/core/utils/utils";
import { format_day } from "src/core/formart/index.js";

export const useConfig = ({ emit, props }) => {
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
    order_list: {},
    is_book_status: ["0"], // 预约注单筛选状态条件
    timer_get_cashout: null,
    timer_get_book: null,
    // 时间排序数据每一项的选项
    time_sort_record_item: {},
    toolIndex: null, // 当前选中 tab 的下标
    model: {
      from: new Date(new Date() - 86400000).Format("yyyy/MM/dd"),
      to: new Date().Format("yyyy/MM/dd"),
    },
    old_page_size: 0,
    random: 0,
  });

  watch(
    () => props.item_details,
    (res) => {
      //投注项总数若为基数则补空
      let data = res.hl[0].ol;
      if (data.length % 2) {
        res.hl[0].ol.push({});
      }
      updateCurMode(this.vx_cur_esports_mode);
    },
    { immediate: true }
  );

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

  //   ( 待改造)
  onMounted(() => {});

  return {
    ...toRefs(state),
    clear_timer_get_cashout,
    clear_timer_get_book,
    record_time_sort,
    set_search_time
  };
};
