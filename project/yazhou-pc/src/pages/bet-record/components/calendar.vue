<!--
 * @Author: cooper
 * @Date: 2023-08-05 14:13:55
 * @Description: 日历
-->

<template>
  <div class="calendar-wrap" @click.stop>
    <div class="horn"></div>
    <div class="horn2"></div>
    <div class="option-wrap row no-wrap">
      <span class="info ellipsis">{{ i18n_t('time.gongli') }}</span>
      <div class="year-wrap date row no-wrap">
        <div class="btn-wrap" @click="changeYear(1)">
          <div class="btn btn-left"></div>
        </div>
        <q-carousel class="text-wrap" v-model="year" transition-prev="slide-right" transition-next="slide-left" animated>
          <q-carousel-slide class="text" :name="val" v-for="(val, key) in years" :key="key">
            <template v-if="get_lang == 'vi'">{{ i18n_t('time.year') }} {{ val }}</template>
            <template v-else>{{ val }}{{ i18n_t('time.year') }}</template>
          </q-carousel-slide>
        </q-carousel>
        <div class="btn-wrap" @click="changeYear(2)">
          <div class="btn btn-right"></div>
        </div>
      </div>
      <div class="months-wrap date row no-wrap">
        <div class="btn-wrap" @click="changeMonth(1)">
          <div class="btn btn-left"></div>
        </div>
        <q-carousel class="text-wrap text-wrap2" v-model="month" transition-prev="slide-right"
          transition-next="slide-left" animated>
          <q-carousel-slide class="text" :name="val.value" v-for="(val, key) in months" :key="key">
            {{ val.label }}
          </q-carousel-slide>
        </q-carousel>
        <div class="btn-wrap" @click="changeMonth(2)">
          <div class="btn btn-right"></div>
        </div>
      </div>
    </div>
    <div class="item-wrap row">
      <!--周日-->
      <div class="item border1">{{ i18n_t('time.time_date_week[0]') }}<div class="bg"></div>
      </div>
      <!--周一-->
      <div class="item border1">{{ i18n_t('time.time_date_week[1]') }}</div>
      <!--周二-->
      <div class="item border1">{{ i18n_t('time.time_date_week[2]') }}</div>
      <!--周三-->
      <div class="item border1">{{ i18n_t('time.time_date_week[3]') }}</div>
      <!--周四-->
      <div class="item border1">{{ i18n_t('time.time_date_week[4]') }}</div>
      <!--周五-->
      <div class="item border1">{{ i18n_t('time.time_date_week[5]') }}</div>
      <!--周六-->
      <div class="item border1">{{ i18n_t('time.time_date_week[6]') }}<div class="bg bg2"></div>
      </div>
      <!--日期列表-->
      <div class="item" v-for="(val, key) in dates" :key="key" @click="onchange(val)">
        <div class="text" :class="val == day && 'active'">{{ val }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from "vue";
import { i18n_t } from "src/boot/i18n.js"

const props = defineProps({
  default: {
    type: String
  }
})

const emits = defineEmits(['onchange', 'onhide'])


const dates = ref([])
const year = ref(2020)
const month = ref(1)
const day = ref(7)
const years = ref([])
const months = ref([
  {
    label: i18n_t('time.month_1'),
    value: 1
  },
  {
    label: i18n_t('time.month_2'),
    value: 2
  },
  {
    label: i18n_t('time.month_3'),
    value: 3
  },
  {
    label: i18n_t('time.month_4'),
    value: 4
  },
  {
    label: i18n_t('time.month_5'),
    value: 5
  },
  {
    label: i18n_t('time.month_6'),
    value: 6
  },
  {
    label: i18n_t('time.month_7'),
    value: 7
  },
  {
    label: i18n_t('time.month_8'),
    value: 8
  },
  {
    label: i18n_t('time.month_9'),
    value: 9
  },
  {
    label: i18n_t('time.month_10'),
    value: 10
  },
  {
    label: i18n_t('time.month_11'),
    value: 11
  },
  {
    label: i18n_t('time.month_12'),
    value: 12
  },
])



onMounted(() => {
  let now = new Date();
  let years_ = [];
  let now_year = now.getFullYear()
  for (let i = 2000; i <= now_year; i++) {
    years_.push(i)
  }
  let date = {};
  if (props.default) {
    date = new Date(props.default);
  } else {
    date = now
  }
  year.value = date.getFullYear();
  month.value = date.getMonth() + 1;
  day.value = date.getDate();
  years.value = years_
  setCalendar()
})

onUnmounted(() => {
  dates.value = null;
  months.value = null;
})
//选择日期
const onchange = (val) => {
  if (val == '') return
  let month = month.value < 10 ? '0' + month.value : month.value;
  val = val < 10 ? '0' + val : val;
  emits('onchange', `${year.value}/${month}/${val}`)
  emits('onhide')
  // 实时更新选中样式
  day.value = Number(val)
}
//改变年份
const changeYear = (type) => {
  if (type == 1) {
    if (year.value == years.value[0]) {
      return
    }
    year.value--
  } else {
    if (year.value == years.value[years.value.length - 1]) {
      return
    }
    year.value++
  }
  setCalendar()
}
//改变月份
const changeMonth = (type) => {
  if (type == 1) {
    if (month.value == 1) {
      if (year.value == years.value[0]) return
      month.value = 12
      year.value--
    } else {
      month.value--
    }
  } else {
    if (month.value == 12) {
      if (year.value == years.value[years.value.length - 1]) return
      month.value = 1
      year.value++
    } else {
      month.value++
    }
  }
  setCalendar()
}
//获取一个月有多少天
const getMonthLength = (year, month) => {
  return new Date(year, month, 0).getDate();
}

//设置日历
const setCalendar = () => {
  // 获取第一天星期几
  let slength = getNulllength();
  // 获取这月的长度
  let monthLength = getMonthLength(year.value, month.value);
  let arr = [];
  for (let i = 0; i < slength; i++) {
    arr.push('')
  }
  for (let i = 1; i <= monthLength; i++) {
    arr.push(i)
  }
  dates.value = arr
  if (day.value > arr[arr.length - 1]) {
    day.value = arr[arr.length - 1]
  }
}
//获取空字符串长度
const getNulllength = () => {
  return new Date(`${year.value}-${month.value}-01`).getDay();
}


</script>
<style lang="scss" scoped>
.calendar-wrap {
  position: absolute;
  z-index: 999;
  background: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  color: #17191d;
  font-size: 12px;
  top: 35px;
  left: -113px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .horn {
    position: absolute;
    height: 10px;
    width: 10px;
    transform: rotate(45deg);
    top: -4px;
    left: 164px;
    background-color: #fff;
    border: 1px solid #d1d1d1;
    z-index: 1;
  }

  .horn2 {
    position: absolute;
    height: 10px;
    width: 30px;
    top: 0;
    left: 155px;
    background-color: #fff;
    z-index: 2;
  }

  .option-wrap {
    margin-top: 20px;
    padding: 0 20px;
    height: 28px;
    line-height: 28px;
    justify-content: center;

    .info {
      min-width: 50px;
      max-width: 60px;
      margin-right: 7px;
    }

    .date {
      background-color: #f5f8fa;
      height: 28px;
      margin-left: 10px;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      border: 1px solid #d1d1d1;
      padding: 0 8px;

      .btn-wrap {
        display: flex;
        height: 100%;
        width: 10px;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .btn {
          width: 6px;
          height: 6px;
          border: 1px solid #17191d;
          border-right: transparent;
          border-bottom: transparent;
          transform: rotate(135deg);

          &.btn-left {
            transform: rotate(315deg);
          }
        }
      }

      .text-wrap {
        height: 100%;
        width: 74px;
        overflow: hidden;

        &.text-wrap2 {
          width: 58px;
        }

        ::v-deep .scroll {
          overflow: hidden;
        }

        .text {
          padding: 0;
          text-align: center;
          line-height: 26px;
          background-color: #f5f8fa;
        }
      }
    }
  }

  .item-wrap {
    justify-content: flex-start;
    margin-top: 10px;
    margin-bottom: 6px;
    width: 294px;

    .item {
      width: 42px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      .text {
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;

        &.active {
          color: #fff;
          background-color: #FF7000;
        }
      }
    }

    .border1 {
      border-bottom: 1px solid #d1d1d1;

      .bg {
        background: #fff;
        width: 7px;
        height: 2px;
        position: absolute;
        left: 0;
        bottom: -1px;

        &.bg2 {
          left: auto;
          right: 0;
        }
      }
    }
  }
}
</style>
