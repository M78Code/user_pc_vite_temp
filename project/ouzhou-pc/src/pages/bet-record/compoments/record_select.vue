<template>
  <div class="record-select">
    <!-- 未结算 -->
    <div class="record-select-main" v-if="current_tab == 'unsettled'">
      <!-- <q-option-group v-model="cash_value" type="checkbox" :options="options" color="opt-basic" /> -->
      <!-- 占位提前结算 -->
      <div></div>
      <span style="font-size: 12px;color:#8A8986;">{{i18n_t("ouzhou.record.unpaid_bets")}}</span>
    </div>
    <!-- 已结算 -->
    <div v-else class="record-settled">
      <div class="record-settled-l">
        <div class="btn-group">
          <div v-for="item in btn_options" :key="item.value" class="btn-group-item" @click="time_click(item)">
            <span :class="{ 'btn-group-item-ls': true, 'btn-group-item-ls-active': current_time == item.value }">{{
               i18n_t( item.label)
              }}</span>
          </div>
        </div>
        <!-- <q-option-group v-model="cash_value" type="checkbox" :options="options" color="opt-basic" /> -->
        <!-- 占位提前结算 -->
        <div></div>
      </div>
      <div class="record-settled-l">
        <div style="width:180px;">
          <q-select outlined v-model="select_value" @update:model-value="selectInput" :options="select_options"
                    option-label="value" :dense="false" :options-dense="false" map-options color="orange">
          </q-select>
        </div>
        <div class="q-pa-md time-select">
          <!-- 日期 -->
          <span>{{i18n_t('bet_record.date')}}&nbsp;</span>
          <q-input filled v-model="date_value" readonly bg-color="white" @click="qDateProxy.show()">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" :offset="[200, 10]" transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" range :minimal="true" ref="dateRef"
                          :locale="dateLocal" color="orange"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="tips">
          <span class="dot"></span>
          {{i18n_t(tipMsg)}}
        </div>
        <div class="record-query" @click="search">
          {{i18n_t("bet_record.query")}}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { formatTime } from 'src/output/index.js'

import dayjs from 'dayjs'
const _dayjs = dayjs()
const isZH = true
const days = i18n_t('time.time_date_week')
const months = [...Array(12)].map((v, i) => i + 1 + '月')
const dateLocal = isZH ? {
  days,
  daysShort: days,
  months,
  monthsShort: months,
} : {}
const props = defineProps({
  current_tab: {
    type: String,
    default: ''
  }
})
const formatYMD = 'YYYY/MM/DD'
const msgList = [
  "bet_record.msg_1",
  "bet_record.msg_2",
  "bet_record.msg_3",
  "bet_record.msg_4",
  "bet_record.msg_5",
  "bet_record.msg_6",
]
const tipMsg = ref(msgList[1])
const dateRef = ref(null)
const qDateProxy = ref(null)
const cash_value = ref([''])
const current_time = ref(1)
const date = ref({ from: '', to: '' })
const date_value = ref('')
const select_options = ref([
    { value: computed(()=>{ return i18n_t("bet_record.sort_by_settled_time") }), label: computed(()=>{ return i18n_t("bet_record.settled_time")}), id: 2 },
    { value: computed(()=>{ return i18n_t("bet_record.sort_by_bet_time")}), label: computed(()=>{ return i18n_t("ouzhou.record.bet_time")}), id: 1 },
    { value: computed(()=>{ return i18n_t("bet_record.sort_by_match_time")}), label: computed(()=>{ return i18n_t("bet_record.match_time")}), id: 3 }
  ])
const select_value = ref(computed(()=>{ return i18n_t("bet_record.settled_time")}))
const tabChange = ref(false)

onMounted(() => {
  cash_value.value = ['']
  const data = formatTime(new Date().getTime(), 'yyyy/mm/dd')
  date_value.value = data + '-' + data
  date.value = { from: data, to: data }

})

let params = {
  enablePreSettle: false,
  timeType: 1,
  orderBy: 2
}
watch(() => props.current_tab, (newVal) => {
  tabChange.value = true
  params = {
    enablePreSettle: false,
    timeType: 1,
    orderBy: 2
  }
  const data = formatTime(new Date().getTime(), 'yyyy/mm/dd')
  date_value.value = data + '-' + data
  date.value = { from: data, to: data }
  tipMsg.value = msgList[1]
  current_time.value = 1
  setTimeout(() => {
    tabChange.value = false
  }, 500)
  cash_value.value = ['']
})
watch(date, (newVal) => {
  if(Array.isArray(newVal)){
    date_value.value = newVal[0] + '-' + newVal[0]
    return ;
  }
  if(newVal.from && newVal.from === newVal.to){
    date.value = [newVal.from]
    return ;
  }
  date_value.value = newVal.from + '-' + newVal.to
})
const emit = defineEmits(['itemFilter'])
watch(cash_value, (newVal) => {
  if (!tabChange.value) {
    params.enablePreSettle = newVal[1] == 'op1'
    emitClick()
  }
  // emit('itemFilter',{enablePreSettle:newVal[1] == 'op1'})
})
const options = [
  {
    label: i18n_t("bet_record.settlement_pre"),
    value: 'op1'
  }
]
const btn_options = [
  { label: "ouzhou.record.today", value: 1, range: [_dayjs.startOf('day').format(formatYMD), _dayjs.endOf('day').format(formatYMD)] },
  { label: "ouzhou.record.yesterday", value: 2, range: [_dayjs.subtract(1, 'day').startOf('day').format(formatYMD), _dayjs.subtract(1, 'day').endOf('day').format(formatYMD)] },
  { label: "ouzhou.record.7_days", value: 3, range: [_dayjs.subtract(6, 'day').startOf('day').format(formatYMD), _dayjs.endOf('day').format(formatYMD)] },
  { label: "ouzhou.record.30_days", value: 4, range: [_dayjs.subtract(29, 'day').startOf('day').format(formatYMD), _dayjs.endOf('day').format(formatYMD)] }
]
// 时间筛选点击
const time_click = (item) => {
  const [from, to] = item.range
  current_time.value = item.value
  params.timeType = item.value
  tipMsg.value = msgList[item.value]
  if(from === to){
    date.value = [from]
  } else {
    date.value = { from, to }
  }
  emitClick()
}
const emitClick = () => {
  emit('itemFilter', params)
}
const selectInput = (v) => {
  select_value.value = v.label
  params.orderBy = v.id
  emit('itemFilter', params)
}
const search = () => {
  tipMsg.value = msgList[5]
  const beginTime = date.value.from.split('/')
    .join('-')
  const endTime = date.value.to.split('/')
    .join('-')
  params.beginTime = new Date(beginTime).getTime() - 28800000
  params.endTime = new Date(endTime).getTime() + 57599000
  params.timeType = undefined
  current_time.value = undefined
  emit('itemFilter', params)
}


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
  margin-top: 10px;
  background-color: var(--q-gb-bg-c-4);

  &:deep(.q-btn) {
    font-size: 12px;
    font-weight: 400;
  }

  &:deep(.q-checkbox__inner) {
    font-size: 30px;
    color: var(--q-gb-t-c-2);
  }

}

.record-select-main {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
}

.record-settled {
  display: flex;
  padding: 0 15px;
  height: 36px;
  align-items: center;
  justify-content: space-between;

  .record-settled-l {
    display: flex;
    align-items: center;
  }
  .tips{
    text-align: right;
    width: 245px;
    .dot{
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
    background-color: var(--q-gb-bg-c-1);
    color: var(--q-gb-t-c-1);
    border-radius: 2px;
    text-align: center;
    cursor: pointer;

  }

  &:deep(.q-field__control) {
    height: 32px;
    min-height: 32px;
  }


  &:deep(.q-field__marginal) {
    height: 32px;
  }

  &:deep(.q-field__native) {
    height: 32px;
    min-height: 32px;
  }

  .time-select {
    display: flex;
    align-items: center;

    // max-width: 240px;
    &:deep(.q-field) {
      border: 1px solid var(--q-gb-bd-c-2);
      border-radius: 4px;
    }

    &:deep(.q-field__control:before) {
      border-bottom: none;
      border-bottom-style: none
    }
  }
}

.btn-group {
  height: 34px;
  //width: 330px;
  -background: var(--q-gb-bg-c-6); 
  background: #E2E2E2; 
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 0 5px;

  .btn-group-item {
    font-size: 12px;
    // margin-right: 20px;
    padding: 4px 5px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-group-item-ls {
      cursor: pointer;
      padding: 4px 10px;
      box-sizing: border-box;
      border-radius: 18px;
      display: inline-block;
    }

    .btn-group-item-ls-active {
      background-color: var(--q-gb-bg-c-4);
      border: 1px solid var(--q-gb-bd-c-1);
      margin-left: -1px;
      margin-right: -1px;
    }

    &:hover {
      .btn-group-item-ls {
        background-color: var(--q-gb-bg-c-4);
        border: 1px solid var(--q-gb-bd-c-1);
        margin-left: -1px;
        margin-right: -1px;

      }
    }

  }
}
</style>