<!--
 * @Author: cooper
 * @Date: 2023-08-05 15:13:55
 * @Description:注单历史
-->

<template>
  <!-- 记录弹窗 -->
  <div class="records-dialog" :style="page_style">
    <!-- 字体记录弹窗 -->
    <p class="font_records-dialog">1</p>
    <!-- 注单历史 以及时间  注单历史头 -->
    <simple-header-wapper :title="i18n_t('common.note_single_history')">
      <!-- 注单历史 -->
      <!-- <span>{{ i18n_t("common.note_single_history") }}</span> -->
    </simple-header-wapper>
    <div class="wrap-records" ref="record">
      <!--表格头部分 未结算已结算预约注单按钮tab-->
      <bt-tab @toolClicked="toolClicked" :toolIndex="toolIndex"></bt-tab>

      <!-- 表格内容部分 包含勾选框-->
      <div class="bet-records col">
        <!-- 筛选框 -->
        <filter-box
          ref="filter-box"
          :toolSelected="toolSelected"
          :time_sort_record_item="time_sort_record_item"
          :record_time_sort="record_time_sort"
          :startDateSearch="startDateSearch"
          :endDateSearch="endDateSearch"
          v-mdel:model="model"
          :settleSwitch="UserCtr.user_info.settleSwitch"
          :submit="submit"
          @search_pre_record="search_pre_record"
          @chooseTime="chooseTime"
          @time_sort="time_sort"
          @check_change="check_change"
          :dateChanged="dateChanged"
        ></filter-box>
        <!-- 押注记录表单 表格内容 如编号和对应值 -->
        <template v-if="[0, 1].includes(toolSelected)">
          <record-table
            ref="filter_box"
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
import { SimpleHeaderWapper } from "src/components/common/simple-header/index.js";
import btTab from "./components/btn-tab.vue";
import filterBox from "./components/filter-box.vue";
import recordTable from "./record-table/index.vue";
import recordBookTable from "./record-book-table.vue";
import lodash from "lodash";
import { api_betting } from "src/api/index";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import store from "src/store-redux/index.js";
import { i18n_t } from "src/boot/i18n.js"
import { onMounted, ref, watch } from "vue";
import { useConfig } from "./use-config.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { compute_css_variables } from "src/core/css-var/index.js"


const page_style = ref('')

page_style.value = compute_css_variables({ category: 'component', module: 'bet-record' })
console.error(compute_css_variables({ category: 'component', module: 'bet-record' }));

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
  record_obj,
  get_cashout_num,
  send_cashout,
  toolSelected,
  is_pre_bet,
  betRecord,
  filter_box,
  uid,
  getBook_gcuuid,
  clear_timer_get_cashout,
  clear_timer_get_book,
  set_search_time,
  res_timer_get_cashout,
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
} = useConfig();
console.error(model);

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
  :deep(.c-simple-header) {
    border-bottom: 1px solid var(--q-bet-record-color-20);
    background: var(--q-bet-record-color-26);
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
  color: var(--q-bet-record-color-16);
  background: var(--qq--re-bg-color1);
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
    .check-wrap.active {
      background-color: var(--q-bet-record-color-30);
    }
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
