<!--
 * @Author: cooper
 * @Date: 2023-08-05 15:13:55
 * @Description:注单历史
-->

<template>
  <!-- 记录弹窗 -->
  <div class="records-dialog">
    <!-- 字体记录弹窗 -->
    <p class="font_records-dialog">1</p>
    <!-- 注单历史 以及时间  注单历史头 -->
    <simple-header-wapper>
      <!-- 注单历史 -->
      <span>{{ $root.$t("common.note_single_history") }}</span>
    </simple-header-wapper>
    <div class="wrap-records" ref="record">
      <!--表格头部分 未结算已结算预约注单按钮tab-->
      <bt-tab @toolClicked="toolClicked" :toolIndex="toolIndex"></bt-tab>

      <!-- 表格内容部分 包含勾选框-->
      <div class="bet-records col">
        <!-- 筛选框 -->
        <filter-box
          :toolSelected="toolSelected"
          :time_sort_record_item="time_sort_record_item"
          :record_time_sort="record_time_sort"
          :startDateSearch="startDateSearch"
          :endDateSearch="endDateSearch"
          :model="model"
          @search_pre_record="search_pre_record"
          @chooseTime="chooseTime"
          @time_sort="time_sort"
          @check_change="check_change"
        ></filter-box>

        <!-- 押注记录表单 表格内容 如编号和对应值 -->
        <template v-if="[0, 1].includes(toolSelected)">
          <record-table
            ref="betRecord"
            :order_list="order_list"
            :record_obj="record_obj"
            :orderNo_data_obj="orderNo_data_obj"
            :orderNo_data_list="orderNo_data_list"
            :data_state="data_state"
            :tool_selected="toolSelected"
            @choosePage="changePage"
            @res_timer_get_cashout="res_timer_get_cashout"
            @clear_timer_get_cashout="clear_timer_get_cashout"
            :random="random"
            :lang="lang"
          ></record-table>
        </template>
        <!-- 预约记录表单 -->
        <template v-else>
          <record-book-table
            :order_list="order_list"
            :record_obj="record_obj"
            :data_state="data_state"
            :is_book_status="is_book_status"
            :tool_selected="toolSelected"
            @choosePage="changePage"
            @delete_book_record="delete_book_record"
            :random="random"
            :lang="lang"
          ></record-book-table>
        </template>
      </div>
    </div>

    <!--选择时间的提示-->
    <div class="tips" v-if="tips.statu">{{ tips.message }}</div>
  </div>
</template>

<script setup>
import { SimpleHeaderWapper } from "src/components/simple-header";
import btTab from "./components/btn-tab.vue";
import filterBox from "./components/filter-box.vue";
import recordTable from "./record-table/index.vue";
import recordBookTable from "./record_book_table.vue";
import lodash from "lodash";

import { ref } from "vue";
import { useConfig } from "./use-config";

const toolSelected = ref(0);
const is_pre_bet = ref(false); // 提前结算勾选

const {
  params,
  order_list,
  is_book_status,
  toolIndex,
  old_page_size,
  random,
  time_sort_record_item,
  record_time_sort,
  startDateSearch,
  endDateSearch,
  model,
  orderNo_data_obj,
  orderNo_data_list,
  data_state,
  tips,
  clear_timer_get_cashout,
  clear_timer_get_book,
  set_search_time,
  res_timer_get_cashout
} = useConfig({getOrderList});

/**
 * @description:记录切换 结算、未结算
 * @param f 0:未结算 1:已结算 2:预约注单
 * @return {undefined} undefined
 */
const toolClicked = (f) => {
  toolSelected.value = f;
  clear_timer_get_cashout();
  clear_timer_get_book();
  order_list.value = {};
  params.value.orderStatus = f;
  params.value.enablePreSettle = is_pre_bet.value;
  if (f == 2) {
    // 初始化预约筛选条件
    is_book_status.value = ["0"];
    this.getBookList();
  } else if (f == 0) {
    params.value = lodash.omit(params.value, "timeType");
    resetParams("clearDate");
    if (is_pre_bet.value) {
      params.value.size = 200;
      //TODO
      // this.$root.$emit(
      //   MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD,
      //   this.params.size
      // );
    }
    // 统计未结算订单
    this.$root.$emit(MITT_TYPES.EMIT_UNSETTLE_TICKETS_COUNT_CMD);
    this.getOrderList();
  } else {
    if (localStorage.getItem("time_sort_record")) {
      time_sort_record_item.value = JSON.parse(
        localStorage.getItem("time_sort_record")
      );
    } else {
      time_sort_record_item.value = record_time_sort[0];
    }
    params.value.orderBy = time_sort_record_item.value.id;
    params.value.page = 1;
    params.value.timeType = 1;
    toolIndex.value = 0;
    set_search_time(0);
    if (old_page_size.value) {
      params.value.size = old_page_size.value;
      // TODO
      //   this.$root.$emit(
      //     MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD,
      //     this.params.size
      //   );
      // }
      // this.getOrderList();
    }
  }
  /**
   * 查询提前结算的列表
   */
  const search_pre_record = (is_pre_bet) => {
    is_pre_bet.value = is_pre_bet;
    params.value.enablePreSettle = is_pre_bet;
    if (is_pre_bet.value) {
      params.value.size = 200; // 部分页
    } else {
      params.value.size = 50;
    }
    // this.getOrderList();  TODO
  };
  /**
   * @时间类型查询
   * @param i 1:今天 2:昨日 3:七日内 4:一月内
   */
  const chooseTime = (i) => {
    set_search_time(i);
    random.value = Math.random();
    toolIndex.value = i;
    params.value.timeType = i + 1;
    resetParams("clearDate"); //删除日期控件参数
    // this.getOrderList();  TODO
  };

  /**
   * @description:重置请求参数
   * @param type clearDate:清除日历时间、为空时，清除timeType获取未结算记录
   * @return {undefined} undefined
   */
  const resetParams = (type) => {
    params.value.page = 1;
    if (type == "clearDate") {
      params.value = lodash.omit(params.value, ["beginTime", "endTime"]);
    } else {
      params.value = lodash.omit(params.value, ["timeType"]);
    }
  };
  /**
   * @description: 点击时间排序
   * @param {Object} sort 选中时间排序数据对象
   */
  const time_sort = () => {
    localStorage.setItem("time_sort_record", JSON.stringify(sort));
    let od_page = params.value.page;
    // this.match_sort_show = false;
    time_sort_record_item.value = sort;
    params.value.page = 1;
    params.value.orderBy = sort.id;
    if (old_page_size.value) {
      params.value.size = old_page_size.value;
      // this.$root.$emit(    TODO
      //   MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD,
      //   this.params.size
      // );
    }
    // if (od_page != 1) {    TODO
    //   this.$root.$emit(MITT_TYPES.EMIT_RECODES_QUERY_BUT_CMD);
    // } else {
    //   this.getOrderList();
    // }
  };

  const check_change = (value) => {
    console.log(value);
    let list = value.split(",");
    is_book_status.value = list || [];

    // this.getBookList()   TODO
  };

  /**
   * @description:清除提前结算实时查询定时器
   * @param {undefined} undefined undefined
   * @return {undefined} undefined
   */
  const lear_timer_get_cashout = () => {
    if (this.timer_get_cashout) {
      clearInterval(this.timer_get_cashout);
      this.timer_get_cashout = undefined;
    }
  };

  /**
   * @翻页
   * @param tableData
   * size：每页条数
   * page：当前页码
   */
  const changePage = (tableData) => {
    params.value.size = tableData[0];
    params.value.page = tableData[2];
    if (toolSelected.value == 2) {
      getBookList();
    } else {
      getOrderList();
    }
  };

  /**  TODO
   * @description:获取表格数据
   * @param this.params
   * @return {undefined} undefined
   */
  const getOrderList = (isScoket, callback) => {
    if (this.record_obj) {
      for (let key in this.record_obj) {
        delete this.record_obj[key];
      }
    }
    if (!isScoket) {
      this.data_state.load_data_state = "loading";
    }
    this.send_gcuuid = uid();
    this.params.gcuuid = this.send_gcuuid;
    // console.log('getOrderList===', JSON.stringify(this.params));

    api_betting
      .post_order_list(this.params)
      .then((res) => {
        // console.log('getOrderList===', this.send_gcuuid === res.config.gcuuid);
        //检查gcuuid
        let gcuuid = _.get(res, "config.gcuuid");
        if (gcuuid && this.send_gcuuid != gcuuid) {
          return;
        }

        let code = _.get(res, "data.code");
        let status = _.get(res, "status");
        if (code == "0401038") {
          this.data_state.load_data_state = "api_limited";
          this.clear_timer_get_cashout();
        }
        if (code == 200 && status) {
          const data = _.get(res, "data.data");
          // 当maxcashout为null时，定时1秒重新拉次数据，最多查询5次
          let records_ = _.filter(data.records, {
            enablePreSettle: true,
            orderStatus: "0",
            initPresettleWs: true,
          });
          let maxcashout_list = _.map(records_, "maxCashout");
          // 判断提前结算实时查询返回集合数据的投注额有null
          if (_.includes(maxcashout_list, null)) {
            this.get_cashout_num++;
            if (this.get_cashout_num <= 4) {
              this.clear_send_cashout();
              this.send_cashout = setTimeout(() => {
                // 重新拉取列表数据
                this.getOrderList();
              }, 1000);
            } else {
              this.get_cashout_num = 0;
            }
          } else {
            this.get_cashout_num = 0;
          }

          // get_cashout_num ===0是代表提前结算的单子里面maxcashout没有 null
          if (this.get_cashout_num === 0) {
            data.orderStatus = this.params.orderStatus;
            let record_list = data.records;
            if (!record_list) {
              this.data_state.load_data_state = "empty";
              this.$refs.betRecord.recordData.total = "0";
              return;
            }
            let record_obj = this.get_obj(record_list, data);
            delete record_obj.list;
            this.record_obj = record_obj;
            if (this.check_confirm_complete()) {
              this.get_timed_task();
            }
            if (
              !this.order_list ||
              !this.order_list.records ||
              this.order_list.records.length == 0
            ) {
              this.data_state.load_data_state = "empty";
            } else {
              // 订阅为结算注单
              if (this.toolSelected == 0 && this.vx_get_user.settleSwitch) {
                this.SCMD_C21();
                // 提前结算实时查询，取里面orderNo，做提前结算实时查询最新数据处理
                this.get_order_no();
              }
            }
            this.get_balance();
            if (_.isFunction(callback)) {
              callback();
            }
          } else {
            this.data_state.load_data_state = "record_refresh";
          }
        }
      })
      .catch((err) => {
        console.error(err);
        if (err) {
          if (_.isPlainObject(err) || _.get(err, "response.status") == 404) {
            this.data_state.load_data_state = "404";
          } else {
            this.data_state.load_data_state = "record_refresh";
          }
        } else {
          this.data_state.load_data_state = "record_refresh";
        }
        if (_.isFunction(callback)) {
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
    if (this.record_obj) {
      for (let key in this.record_obj) {
        delete this.record_obj[key];
      }
    }
    this.data_state.load_data_state = "loading";
    let preOrderStatusList = this.is_book_status;
    //0预约中 ;1预约成功;2.风控预约失败;3.风控取消预约注单.4.用户手动取消预约投注
    // jumpFrom跳转来源(非空 1.详情投注界面   2.注单界面)
    let param = {
      page: this.params.page,
      size: this.params.size,
      jumpFrom: 2,
      preOrderStatusList: preOrderStatusList,
    };
    this.getBook_gcuuid = uid();
    param.gcuuid = this.getBook_gcuuid;
    // console.log('get_book_record_data==getBookList==',JSON.stringify(param));
    api_betting
      .post_book_list(param)
      .then((res) => {
        // console.log('get_book_record_data==getBookList==res===', this.getBook_gcuuid == res.config.gcuuid);
        let gcuuid = _.get(res, "config.gcuuid");
        if (gcuuid && this.getBook_gcuuid != gcuuid) {
          return;
        }
        let code = _.get(res, "data.code");
        let status = _.get(res, "status");
        if (code == 200 && status) {
          const data = _.get(res, "data.data");
          // data.orderStatus = this.params.orderStatus;
          let record_list = data.records;
          if (!record_list) {
            this.clear_timer_get_book();
            this.data_state.load_data_state = "empty";
            return;
          }
          let record_obj = this.get_obj(record_list, data);
          delete record_obj.list;
          this.record_obj = record_obj;

          if (
            !this.order_list ||
            !this.order_list.records ||
            this.order_list.records.length == 0
          ) {
            this.clear_timer_get_book();
            this.data_state.load_data_state = "empty";
          } else {
            // 预约中开启定时器，不是则关闭
            if (this.is_book_status.includes("0")) {
              this.orderNo_book = _.map(this.order_list.records, "orderNo");
              this.res_timer_get_book();
            } else {
              this.orderNo_book = "";
              this.clear_timer_get_book();
            }
          }
        }
        if ("0401038" == code) {
          this.clear_timer_get_book();
          this.data_state.load_data_state = "code_empty";
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        if (err) {
          if (_.isPlainObject(err) || _.get(err, "response.status") == 404) {
            this.data_state.load_data_state = "404";
          } else {
            this.data_state.load_data_state = "record_refresh";
          }
        } else {
          this.data_state.load_data_state = "record_refresh";
        }
        if (_.isFunction(callback)) {
          callback();
        }
      });
  };
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("~public/lib/font/roboto/v20/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2")
    format("woff2");
}
.check-wrap {
  margin-right: 5px;
}
/** 注单历史 以及时间 */
.records-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-flow: column;
  min-width: 1000px;
  width: 100%;
  height: 100%;
  .font_records-dialog {
    font-family: "Material Icons";
    position: absolute;
    top: -200px;
  }
}
/** 表格头部分 */
.wrap-records {
  display: flex;
  flex: 1;
  flex-flow: column;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 12px;
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 40px;
    background: #e5e5e5;
    font-size: 14px;
  }

  /** 表格内容部分 */
  .bet-records {
    display: flex;
    flex-direction: column;
  }
  .wrap_success {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
    ::v-deep .material-icons {
      font-family: "Material Icons";
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: "liga";
      -webkit-font-smoothing: antialiased;
    }
    .tool-time {
      display: flex;
      user-select: none;
      .tool-item {
        padding: 0 18px;
        height: 28px;
        line-height: 26px;
        cursor: pointer;
      }
    }
    .sort-content {
      flex: 1;
      height: 28px;
      display: flex;
      justify-content: flex-end;
      .select-btn {
        margin-left: 5px;
        height: 28px;
        width: 150px;
        border-radius: 2px;
        cursor: pointer;
        position relative {
          &.sort-btn {
            .yb-hover-bg {
              padding: 0 5px 0 8px;
            }
            .icon-sort {
              margin-left: 3px;
            }
          }
        }
        .yb-hover-bg {
          justify-content: space-between;
          padding: 0 8px;
          .text_check {
            flex: 1;
            margin-left: 7px;
          }
        }
      }
      .item-wrap-time {
        position: absolute;
        top: 28px;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--qq--y0-text-color0);
        width: 150px;
        z-index: 10;
        .item {
          padding: 0 9px;
          height: 30px;
          justify-content: flex-start;
          border-radius: 4px;
          .text {
            margin-left: 7px;
          }
        }
      }
    }
  }
  /**勾选框 和 提前结算*/
  .date-time-choice {
    display: flex;
    margin-left: 10px;
    .time-search-title {
      margin: 0 10px;
      height: 100%;
      line-height: 28px;
    }
    /**查询和日期选择器*/
    .search-date-wrapper {
      width: 185px;
      height: 28px;
      .date-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        width: 100%;
        height: 100%;
        border-radius: 2px;
        cursor: pointer;
        & ::v-deep .icon-calendar {
          font-size: 14px;
        }
      }
      .date-picker-wrap {
        ::v-deep .q-date {
          .q-icon {
            font-size: 12px;
            &::before {
              color: var(--qq--yb-text-color3);
            }
          }
        }
        .q-date {
          position: relative;
          left: -55px;
          z-index: 1;
          ::v-deep .q-date__calendar-item > div {
            width: auto;
          }
          /*  星期X 字体颜色正常显示 */
          ::v-deep .q-date__calendar-weekdays > div {
            opacity: 1;
          }
        }
        .calendar-wrap {
          height: 276px;
          top: 10px;
        }
        .calendar-wrap:nth-child(1) {
          left: -380px;
          ::v-deep .horn {
            display: none !important;
          }
        }
        .calendar-wrap:nth-child(2) {
          left: -65px;
        }
      }
    }
    /**查询按钮*/
    .search-btn {
      margin-left: 10px;
      min-height: 28px;
      width: 80px;
      border-radius: 2px;
      text-align: center;
      line-height: 28px;
      color: var(--qq--theme-color-tool-btn);
      cursor: pointer;
    }
  }
  /**勾选框*/
  .checkbox {
    margin-bottom: 5px;
    justify-content: flex-start;
    align-items: center;
  }
}
/**选择时间的提示*/
.tips {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 10px 20px;
  border-radius: 2px;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
