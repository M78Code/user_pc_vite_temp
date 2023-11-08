<!--
 * @Author: cooper
 * @Date: 2023-06-27 16:43:55
 * @Description: 注单历史筛选组件部分
-->
<template>
  <div class="record-select">
    <!-- 未结算 -->
    <div class="record-select-main" v-if="current_tab == 'unsettled'">
      <q-option-group v-model="cash_value" type="checkbox" :options="options" color="opt-basic" />
      <span style="font-size: 12px;color:#8A8986;">This record will show all unpaid bets</span>
    </div>
    <!-- 已结算 -->
    <div v-else class="record-settled">
      <div class="record-settled-l">
        <div class="btn-group">
          <div v-for="item in btn_options" :key="item.value" class="btn-group-item" @click="time_click(item)">
            <span :class="{ 'btn-group-item-ls': true, 'btn-group-item-ls-active': current_time == item.value }">{{
              item.label
            }}</span>
          </div>
        </div>
        <q-option-group v-model="cash_value" type="checkbox" :options="options" color="opt-basic" />
      </div>
      <div class="record-settled-l">
        <div style="width:180px;">
          <q-select outlined v-model="select_value" @update:model-value="selectInput" :options="select_options"
            option-label="value" :dense="false" :options-dense="false" map-options>
          </q-select>
        </div>
        <div class="q-pa-md time-select">
          <!-- 日期 -->
          <span>Date&nbsp;</span>
          <q-input filled v-model="date_value" readonly bg-color="white" @click="qDateProxy.show()">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" :offset="[200, 10]" transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" range :minimal="true" ref="dateRef" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="record-query" @click="search">
          Query
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { formatTime } from '../../../../public/utils/time_format'

const props = defineProps({
  current_tab: {
    type: String,
    default: ''
  }
})
const dateRef = ref(null)
const qDateProxy = ref(null)
const cash_value = ref([''])
const current_time = ref(1)
const date = ref({ from: '2023/07/01', to: '2023/07/17' })
const date_value = ref('')
const select_options = [
  { value: 'Sort by settled time', label: 'Settled time', id: 2 },
  { value: 'Sort by bet time', label: 'Bet time', id: 1 },
  { value: 'Sort by match time', label: 'Match time', id: 3 },
]

const tabChange = ref(false)
onMounted(() => {
  cash_value.value = ['']
  const data = formatTime(new Date().getTime(), 'yyyy/mm/dd')
  date_value.value = data + '-' + data
  date.value = {from:data,to:data}
})
const select_value = ref('Bet time')

let params = {
  enablePreSettle: false,
  timeType: 1,
  orderBy: 1,
 
}

watch(()=>props.current_tab, (newVal) => {
  tabChange.value = true
 params = {
  enablePreSettle: false,
  timeType: 1,
  orderBy: 1,
 }
  const data = formatTime(new Date().getTime(), 'yyyy/mm/dd')
  date_value.value = data + '-' + data
   date.value = {from:data,to:data}
   setTimeout(() => {
    tabChange.value = false
   }, 500);
  cash_value.value = ['']
})



watch(date, (newVal) => {
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
    label: 'Cash Out',
    value: 'op1'
  }
]
const btn_options = [
  { label: 'Today', value: 1 },
  { label: 'Yesterday', value: 2 },
  { label: 'Last 7 Days', value: 3 },
  { label: 'In 30 Days', value: 4 }
]
// 时间筛选点击
const time_click = (item) => {
  current_time.value = item.value
  params.timeType = item.value
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

const search = ()=>{
  const beginTime = date.value.from.split('/').join('-')
  const endTime = date.value.to.split('/').join('-')
  params.beginTime = new Date(beginTime).getTime()-28800000
  params.endTime = new Date(endTime).getTime()+57599000
   emit('itemFilter', params)

}


</script>

<style lang="scss" scoped>
.bg-white {
  background: #ffffff !important;
  border: 1px solid blue;
}

.record-select {
  margin-top: 10px;
  background-color: #FFFFFF;

  &:deep(.q-btn) {
    font-size: 12px;
    font-weight: 400;
  }

  &:deep(.q-checkbox__inner) {
    font-size: 30px;
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

  .record-query {
    width: 79px;
    height: 28px;
    line-height: 28px;
    background-color: #FF7000;
    color: #ffffff;
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
      border: 1px solid #e2e2e2;
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
  width: 330px;
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
      background-color: #FFFFFF;
      border: 1px solid #FF7000;
      margin-left: -1px;
      margin-right: -1px;
    }

    &:hover {
      .btn-group-item-ls {
        background-color: #FFFFFF;
        border: 1px solid #FF7000;
        margin-left: -1px;
        margin-right: -1px;

      }
    }

  }
}
</style>
