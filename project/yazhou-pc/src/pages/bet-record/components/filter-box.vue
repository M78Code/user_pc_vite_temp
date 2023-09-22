<!--
 * @Author: cooper
 * @Date: 2023-08-06 17:13:55
 * @Description:注单历史 搜索部分
-->

<template>
  <div>
    <!-- 勾选框 和 提前结算-->    
    <div v-if="toolSelected === 0 && settleSwitch">
      <!-- 勾选框 -->
      <div class="date-time-choice checkbox" @click="search_pre_record">
        <filter-checkbox-full-version-wapper
          :checked="is_pre_bet"
          :style="checkbox_style"
        />
        <span>{{ i18n_t("bet_record.settlement_pre") }}</span>
        <!-- 提前结算 -->
      </div>
    </div>
    <!-- 已结算下面的今天等tab页 勾选框 默认排序 查询 表格内容 -->
    <div v-if="toolSelected === 1" class="wrap_success">
      <!-- 今天等tab页 -->
      <div class="tool-time">
        <div
          class="tool-item"
          @click="chooseTime(i)"
          v-for="(tool, i) of toolWords"
          :class="{
            current: toolIndex === i,
            'tool-item-hover': hoverIndex == i,
          }"
          :key="i"
          @mouseover="hoverIndex = i"
          @mouseout="hoverIndex = -1"
        >
          {{ tool }}
        </div>
      </div>
      <!-- 勾选框 -->
      <div
        class="date-time-choice checkbox"
        @click="search_pre_record"
        v-if="settleSwitch"
      >
        <filter-checkbox-full-version-wapper
          :checked="is_pre_bet"
          :style="checkbox_style"
        />
        <span>{{ i18n_t("bet_record.settlement_pre") }}</span>
        <!-- 提前结算 -->
      </div>
      <!-- 默认排序 -->
      
      <div class="sort-content">
        <div class="select-btn sort-btn yb-flex-center relative-position">
          <div
            class="full-height full-width yb-flex-center yb-hover-bg"
            @click.stop="selectSortShowFunc"
          >
            <q-icon
              :name="time_sort_record_item.icon"
              size="14px"
              color="#569ffd"
              class="icon_left"
            />
            <span class="text_check">{{
              i18n_t(time_sort_record_item.check_name)
            }}</span>
            <q-icon
              name="icon-sort"
              size="12px"
              class="icon_right"
              color="#272A33"
            />
          </div>
          <div class="item-wrap-time" v-if="show_select_time_sort">
            <div class="triangle"></div>
            <template v-for="(sort, index) in record_time_sort" :key="index">
              <div
                class="item ellipsis yb-flex-center"
                :class="sort.id == time_sort_record_item.id && 'active'"
                @click="time_sort(sort)"
              >
                <icon :name="sort.icon" size="14px" color="#ABBAC8" />
                <span class="text">{{ sort.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 查询和日期选择器 -->
      <div class="date-time-choice">
        <div class="search-date-wrapper start-time-wrap">
          <div class="date-wrap" @click.stop="startTimeShowFunc">
            <div>
              {{
                ["vi", "th", "en", "ms", "ad"].includes(lang)
                  ? formatTime(
                      new Date(startDateSearch).getTime(),
                      "dd/mm/yyyy"
                    )
                  : startDateSearch
              }}
              -
              {{
                ["vi", "th", "en", "ms", "ad"].includes(lang)
                  ? formatTime(new Date(endDateSearch).getTime(), "dd/mm/yyyy")
                  : endDateSearch
              }}
            </div>
            <q-icon name="icon-calendar"></q-icon>
          </div>
          <div class="date-picker-wrap relative-position">
            <q-date
              v-icon="{
                'chevron_left': 'icon-arrow-left',
                'chevron_right': 'icon-arrow-right',
              }" 
              v-model="new_model_value"            
              @click.stop
              range
              v-if="startTimeShow"
              minimal
              :locale="locale" />
          </div>
        </div>
        <!-- 查询按钮 -->
        <div class="search-btn" @click="submit()">
          {{ i18n_t("bet_record.query") }}
          <!-- 查询 -->
        </div>
      </div>
    </div>
    <!-- 预约注单tab 进行中 已取消 预约失败  勾选框 -->
    <div v-if="toolSelected === 2 && settleSwitch">
      <!-- 勾选框 -->
      <div class="checkbox">
        <!--联赛筛选单选框组件-->
        <filter-radio-full-version-wapper
          :check_list="check_list"
          :default_value="default_value"
          :checkbox_style="checkbox_style"
          @check_change="check_change"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,watch,onUnmounted, nextTick, inject, computed } from "vue";
// import { IconWapper } from 'src/components/icon'
import { FilterRadioFullVersionWapper } from "src/components/match-list/filter-radio/index.js";
import { FilterCheckboxFullVersionWapper } from "src/components/match-list/filter-checkbox/index.js";
import { formatTime } from "src/core/format/index.js";
import { i18n_t } from "src/boot/i18n.js"
import UserCtr from "src/core/user-config/user-ctr.js"
const props = defineProps({
  toolSelected: {
    type: Number
  },
  time_sort_record_item: {
    type: Object
  },
  record_time_sort: {
    type: Array
  },
  startDateSearch: {
    type: String
  },
  endDateSearch: {
    type: String
  },
  model: {
    type: Object
  },
  settleSwitch: {
    type: Number
  },
  submit: {
    type: Function
  },
  dateChanged: {
    type: Function
  },
  toolIndex: {
    type: String
  },
  });
const reload = inject('reload')

// 日历多语言配置
const locale = {
  // TODO: 后续再处理国际化
  days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], // i18n_t("time.time_date_week"), // ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],// i18n_t("time.time_date_week"),
  
  months: [
    i18n_t("time.month_1"),
    i18n_t("time.month_2"),
    i18n_t("time.month_3"),
    i18n_t("time.month_4"),
    i18n_t("time.month_5"),
    i18n_t("time.month_6"),
    i18n_t("time.month_7"),
    i18n_t("time.month_8"),
    i18n_t("time.month_9"),
    i18n_t("time.month_10"),
    i18n_t("time.month_11"),
    i18n_t("time.month_12"),
  ],
  monthsShort: [
    i18n_t("time.month_1"),
    i18n_t("time.month_2"),
    i18n_t("time.month_3"),
    i18n_t("time.month_4"),
    i18n_t("time.month_5"),
    i18n_t("time.month_6"),
    i18n_t("time.month_7"),
    i18n_t("time.month_8"),
    i18n_t("time.month_9"),
    i18n_t("time.month_10"),
    i18n_t("time.month_11"),
    i18n_t("time.month_12"),
  ],
  // 每周的第一天
  firstDayOfWeek: 7,
};
const check_list = [
  { value: "0", label: i18n_t("bet.bet_process") },
  { value: "4", label: i18n_t("bet.bet_book_canceled") },
  { value: "2,3", label: i18n_t("bet.bet_book_failed") },
];

const emit = defineEmits(["search_pre_record", "chooseTime", "time_sort",'check_change', 'update:model']);
const checkbox_style = {
  //单选框样式
  borderColor: "#d0d8de",
};

const is_pre_bet = ref(false); // 提前结算勾选

const toolWords = ref([]);

const hoverIndex = ref(-1);
const new_model_value =  ref(props.model)
//选择项下拉显示
const show_select_time_sort = ref(false);
const startTimeShow = ref(false); // 开始时间展示

const endTimeShow = ref(false); // 结束时间展示
  // 预约注单默认状态
  const default_value= ref('0')

onMounted(() => {
  toolWords.value = ["今天", "昨天", "七天内", "一个月内"] //JSON.parse(i18n_t("time.time_date_list_1")); 
  document.addEventListener("click", () => {
    startTimeShow.value = false
    show_select_time_sort.value = false
  })
});
watch(() => props.startDateSearch, () => {
  console.error('时间改变了', props);
})
onUnmounted(()=>{
   toolWords.value = null;
   document.removeEventListener("click", () => {
    startTimeShow.value = !startTimeShow.value
    show_select_time_sort.value = false
  })
})


watch(()=>new_model_value.value,n=>{
    emit('update:model', n)
      if (n) {
        startTimeShow.value = false;
        // 这里会存在选中单个日期的情况 ['2021/12/12', from: '2021/01/01', to: '2021/01/07']
        if (!n.from) {
          if (lodash.isArray(n)) {
            props.dateChanged(n[0], n[0]);
          } else {
            props.dateChanged(n, n);
          }
        } else {
          props.dateChanged(n.from, n.to);
        }
      }
  })

/**
 * 查询提前结算的列表
 */
const search_pre_record = () => {
  is_pre_bet.value = !is_pre_bet.value;
  emit("search_pre_record", is_pre_bet.value);
};
/**
 * @时间类型查询
 * @param i 1:今天 2:昨日 3:七日内 4:一月内
 */
const chooseTime = (i) => {
  emit("chooseTime", i);
};

/**
 * @description: 点击默认排序
 * @param {undefined} undefined
 * @returns {undefined}
 */
const selectSortShowFunc = () => {
  
  show_select_time_sort.value = !show_select_time_sort.value;
  startTimeShow.value = false;
  endTimeShow.value = false;
};

/**
 * @description: 显示开始日期选择
 * @param {undefined} undefined
 * @returns {undefined}
 */
const startTimeShowFunc = () => {
  startTimeShow.value = !startTimeShow.value;
  endTimeShow.value = !endTimeShow.value;
  show_select_time_sort.value = false;
};

 const check_change=(value)=> {
    emit('check_change',value)
    }

/**
 * @description: 点击时间排序
 * @param {Object} sort 选中时间排序数据对象
 */
const time_sort = (sort) => {
  show_select_time_sort.value = !show_select_time_sort.value;
  endTimeShow.value = !endTimeShow.value;
  emit("time_sort", sort);
};
</script>

<style lang="scss" scoped>
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
    background-color: var(--q-gb-bg-c-11);
    .date-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      cursor: pointer;
      border: 1px solid var(--q-gb-bd-c-8);
      color: var(--q-gb-t-c-10);
      &:hover {
        border-color: var(--q-gb-bd-c-12);
      }
      &:deep(.icon-calendar) {
        font-size: 14px;
        &::before {
          color: var(--q-gb-t-c-17);
        }
      }
    }
    .date-picker-wrap {
      :deep(.q-date) {
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
    color: var(--q-gb-t-c-9);
    background-color: var(--q-bet-record-color-13);
    cursor: pointer;
  }
}
/**勾选框*/
.checkbox {
  margin-bottom: 5px;
  justify-content: flex-start;
  align-items: center;
}
/**
*七天时间
*/
.wrap_success {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
    :deep(.material-icons) {
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
        color: var(--q-gb-t-c-6);
        background: var(--q-gb-bg-c-11);
        border-top: 1px solid var(--q-gb-bd-c-8);
        border-bottom: 1px solid var(--q-gb-bd-c-8);
        &:first-child{
          border-left: 1px solid var(--q-gb-bd-c-8);
        }
        &:last-child{
          border-right: 1px solid var(--q-gb-bd-c-8);
        }
        &:hover {
        color: var(--q-gb-t-c-16);
      }
      }
      .current {
        background-color: var(--q-bet-record-color-13);
        color: var(--q-gb-t-c-5);
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
        border: 1px solid var(--q-gb-bd-c-8);
        background: var(--q-gb-bg-c-11);
        &:hover {
          border-color: var(--q-gb-bd-c-12);
          color: var(--q-gb-t-c-3);
        }
        .icon_left {
          &:before {
            color: var(--q-gb-t-c-17);
          } 
        }
        // TODO: 对比旧版 此处代码不生效 待确认后删除
        // position relative {
        //   &.sort-btn {
        //     .yb-hover-bg {
        //       padding: 0 5px 0 8px;
        //     }
        //     .icon-sort {
        //       margin-left: 3px;
        //     }
        //   }
        // }
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
</style>
