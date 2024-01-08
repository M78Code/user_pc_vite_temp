<template>
  <div class="record-select">
    <div style="display: none;">{{ BetRecordHistory.bet_record_version }}</div>
    <!-- ------------------未结算---------------------- -->
    <div class="record-select-main" v-if="BetRecordHistory.selected == 0">
      <!-- 提前结算 -->
      <check-box-warp :list="options" @emit_value="emit_value"></check-box-warp>
    </div>
    <!-- -------------------已结算---------------------- -->
    <div v-else-if="BetRecordHistory.selected == 1" class="record-settled">
      <div class="record-settled-l">
        <div class="btn-group">
          <div v-for="item in btn_options" :key="item.value" class="btn-group-item" @click="time_click(item)">
            <span :class="{ 'btn-group-item-ls': true, 'btn-group-item-ls-active': BetRecordHistory.params.timeType == item.value }">{{
              i18n_t(item.label)
            }}</span>
          </div>
        </div>
        <!-- 提前结算 -->
        <check-box-warp :list="options" @emit_value="emit_value"></check-box-warp>
      </div>
      <div class="record-settled-l">
        <div style="width:180px;">
          <q-select v-model="select_value" @update:model-value="selectInput" :options="select_options"
            :options-html="true">
          </q-select>
        </div>
        <div class="time-select">
          <!-- 日期 -->
          <!-- <span>{{i18n_t('bet_record.date')}}&nbsp;</span> -->
          <q-input filled v-model="date_value" readonly bg-color="white" @click="qDateProxy.show()">
            <template v-slot:append>
              <q-icon name="icon-calendar" size="14px" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" :offset="[200, 10]" transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" range :minimal="true" ref="dateRef" :locale="dateLocal" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="record-query" @click="search">
          {{ i18n_t("bet_record.query") }}
        </div>
      </div>
    </div>
    <!-- ----------------------预约--------------- -->
    <div class="record-pre" v-if="BetRecordHistory.selected == 2">
      <!-- 提前结算, 默认进行中 -->
      <check-box-warp :list="pre_options" initVal="0" @emit_value="emit_value"></check-box-warp>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { formatTime } from 'src/output/index.js'
import BetRecordHistory from "src/core/bet-record/pc/bet-record-history.js"
import checkBoxWarp from './check_box_warp.vue'
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js"
import { api_betting } from "src/api/index.js";
import dayjs from 'dayjs'
const _dayjs = dayjs()

// 提前结算、 进行中、已取消、预约失败 筛选按钮
const options = [{ label: i18n_t("bet_record.settlement_pre"), value: true }]
const pre_options = [
  { label: i18n_t("bet.bet_process"), value: '0' },
  { label: i18n_t("bet.bet_book_canceled"), value: '4' },
  { label: i18n_t("bet.bet_book_failed"), value: '2,3' }
]
const emit_value = (value) => {
  // 提前结算  value: true / false
  if (BetRecordHistory.selected == 0 || BetRecordHistory.selected == 1) {
    Object.assign(BetRecordHistory.params, {
      enablePreSettle: value
    })
  }
  // 预约 进行中 已取消  预约失败  
  if (BetRecordHistory.selected == 2) {
    Object.assign(BetRecordHistory.params, {
      preOrderStatusList: value.split(',')
    })
  }
  BetRecordHistory.handle_fetch_order_list()
}


// 时间筛选  今天、昨天、7天、30天
const formatYMD = 'YYYY/MM/DD'
const btn_options = [
  { label: "ouzhou.record.today", value: 1, range: [_dayjs.startOf('day').format(formatYMD), _dayjs.endOf('day').format(formatYMD)] },
  { label: "ouzhou.record.yesterday", value: 2, range: [_dayjs.subtract(1, 'day').startOf('day').format(formatYMD), _dayjs.subtract(1, 'day').endOf('day').format(formatYMD)] },
  { label: "ouzhou.record.7_days", value: 3, range: [_dayjs.subtract(6, 'day').startOf('day').format(formatYMD), _dayjs.endOf('day').format(formatYMD)] },
  { label: "ouzhou.record.30_days", value: 4, range: [_dayjs.subtract(29, 'day').startOf('day').format(formatYMD), _dayjs.endOf('day').format(formatYMD)] }
]
const time_click = (item) => {
  //提示语
  BetRecordHistory.set_date_tip_msg(item.value)
  // 日期组件显示
  const [from, to] = item.range
  if (from === to) {
    date.value = [from]
  } else {
    date.value = { from, to }
  }
  Object.assign(BetRecordHistory.params, {
    beginTime: undefined,
    endTime: undefined,
    timeType: item.value
  })
  BetRecordHistory.handle_fetch_order_list()
}

// 排序筛选   默认排序、按投注时间排序、按开赛时间排序
const select_value = ref(`<i class="q-icon icon-calendar"> </i> <span>${i18n_t("bet_record.settled_time")}</span>`)
const select_options = [
  { value: i18n_t("bet_record.sort_by_settled_time"), label: `<i class="q-icon icon-calendar"> </i> <span>${i18n_t("bet_record.settled_time")}</span>`, id: 2 },
  { value: i18n_t("bet_record.sort_by_bet_time"), label: `<i class="q-icon icon-calendar"> </i> <span>${i18n_t("bet_record.bet_time")}</span>`, id: 1 },
  { value: i18n_t("bet_record.sort_by_match_time"), label: `<i class="q-icon icon-calendar"> </i> <span>${i18n_t("bet_record.match_time")}</span>`, id: 3 }
]
const selectInput = (v) => {
  Object.assign(BetRecordHistory.params, {
    orderBy: v.id
  })
  BetRecordHistory.handle_fetch_order_list()
}


// 时间选择器
const date_value = ref('')
const qDateProxy = ref(null)
const date = ref({ from: '', to: '' })
const dateRef = ref(null)
const isZH = true
const days = i18n_t('time.time_date_week')
const months = [...Array(12)].map((v, i) => i + 1 + '月')
const dateLocal = isZH ? {
  days,
  daysShort: days,
  months,
  monthsShort: months,
} : {}

let params = {
  enablePreSettle: false,
  timeType: 1,
  orderBy: 2
}

watch(date, (newVal) => {
  if (Array.isArray(newVal)) {
    date_value.value = newVal[0] + '-' + newVal[0]
    return;
  }
  if (newVal.from && newVal.from === newVal.to) {
    date.value = [newVal.from]
    return;
  }
  date_value.value = newVal.from + '-' + newVal.to
})

const search = () => {
  console.log(date.value);
  const beginTime = date.value.from.split('/').join('-')
  const endTime = date.value.to.split('/').join('-')
  Object.assign(BetRecordHistory.params, {
    beginTime: new Date(beginTime).getTime() - 28800000,
    endTime: new Date(endTime).getTime() + 57599000,
    timeType: undefined
  })
  BetRecordHistory.handle_fetch_order_list()
}


let useMitt = null
onMounted(() => {
  // 初始化日期时间
  const data = formatTime(new Date().getTime(), 'yyyy/mm/dd')
  date_value.value = data + '-' + data
  date.value = { from: data, to: data }

  // 首次进入获取数据
  init_data(BetRecordHistory.selected)
  // 监听BetRecordHistory.selected改变，获取数据
  useMitt = useMittOn(MITT_TYPES.EMIT_BET_RECORD_SELECTED_CHANGE, function (val) {
    init_data(val)
  }).off;
})

/**
 * @description 初始请求注单记录数据
 * @param {Undefined} Undefined
 * @return {Undefined} undefined
 */
const init_data = (_index) => {
  switch (_index) {
    case 0: //未结算
      Object.assign(BetRecordHistory.params, {
        enablePreSettle: false,
        orderBy: 2,
        orderStatus: 0
      })
      break;
    case 1: //已结算
      Object.assign(BetRecordHistory.params, {
        enablePreSettle: false,
        orderBy: 2,
        orderStatus: 1,
        timeType: 1
      })
      break;
    case 2: // 预约订单
      Object.assign(BetRecordHistory.params, {
        jumpFrom: 2,
        preOrderStatusList: ['0']
      })
      break;
  }
  //请求注单记录接口
  // 预约中、已失效(数据需加工)
  const prevData = (_index === 1 || _index === 2)
  BetRecordHistory.handle_fetch_order_list()

  // 未结算时，轮询获取提前结算列表金额
  // timer && clearInterval(timer)
  // if(_index === 0) {
  //   timer = setInterval(() => {
  //     if (document.visibilityState == 'visible') {
  //       BetRecordClass.check_early_order()
  //     }
  //   }, 5000)
  // }
}

onUnmounted(() => {
  useMitt && useMitt()
})
</script>

<style lang="scss">
div.q-menu {
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
  background: #fff;
}
</style>
<style lang="scss" scoped>
.bg-white {
  background: var(--q-gb-bg-c-4) !important;
  border: 1px solid blue;
}

.record-select {
  height: 48px;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 20px;
}

.record-select-main {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
}

.record-settled {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .record-settled-l {
    display: flex;
    align-items: center;
  }

  .tips {
    text-align: right;
    width: 245px;

    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ff7000;
      margin-right: 4px;
    }

    font-size: 12px;
    margin-right: 12px;
  }

  .record-query {
    width: 79px;
    height: 28px;
    line-height: 28px;
    background-color: var(--q-gb-bg-c-4);
    color: var(--q-gb-t-c-18);
    border-radius: 20px;
    text-align: center;
    cursor: pointer;

  }

  &:deep(.q-field__control) {
    height: 28px;
    min-height: 28px;
    background-color: #fff;
    border-radius: 4px;
  }


  &:deep(.q-field__marginal) {
    height: 28px;
  }

  &:deep(.q-field__native) {
    height: 29px;
    min-height: 28px;
  }

  .time-select {
    display: flex;
    align-items: center;
    padding: 0 15px;

    // max-width: 240px;
    &:deep(.q-field) {
      border-radius: 4px;
    }

    &:deep(.q-field__control:before) {
      border-bottom: none;
      border-bottom-style: none
    }
  }
}

.btn-group {
  height: 28px;
  background-color: var(--q-gb-bg-c-14);
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  // padding: 0 5px;

  .btn-group-item {
    font-size: 12px;
    // margin-right: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-group-item-ls {
      cursor: pointer;
      padding: 4px 18px;
      box-sizing: border-box;
      border-radius: 18px;
      display: inline-block;
    }

    .btn-group-item-ls-active {
      background-color: var(--q-gb-bg-c-4);
      color: var(--q-gb-t-c-18);
    }

    &:hover {
      .btn-group-item-ls {
        background-color: var(--q-gb-bg-c-4);
        color: var(--q-gb-t-c-18);
      }
    }

  }
}</style>