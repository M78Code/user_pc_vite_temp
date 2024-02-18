<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 日历
-->

<template>
  <div class="calendar-wrap" @click.stop>
    <div class="horn"></div>
    <div class="horn2"></div>
    <div class="option-wrap row no-wrap">
      <span class="info ellipsis">{{i18n_t('time.gongli')}}</span>
      <div class="year-wrap date row no-wrap">
        <div class="btn-wrap" @click="changeYear(1)">
          <div class="btn btn-left"></div>
        </div>
        <q-carousel class="text-wrap" v-model="year" transition-prev="slide-right" transition-next="slide-left" animated>
          <q-carousel-slide class="text" :name="val" v-for="(val,key) in years" :key="key">
            <template v-if="get_lang=='vi'">{{i18n_t('time.year')}} {{val}}</template>
            <template v-else>{{val}}{{i18n_t('time.year')}}</template>
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
        <q-carousel class="text-wrap text-wrap2" v-model="month" transition-prev="slide-right" transition-next="slide-left" animated>
          <q-carousel-slide class="text" :name="val.value" v-for="(val,key) in months" :key="key">
            {{val.label}}
          </q-carousel-slide>
        </q-carousel>
        <div class="btn-wrap" @click="changeMonth(2)">
          <div class="btn btn-right"></div>
        </div>
      </div>
    </div>
    <div class="item-wrap row">
      <!--周日-->
      <div class="item border1">{{i18n_t('time.time_date_week[0]')}}<div class="bg"></div></div>
      <!--周一-->
      <div class="item border1">{{i18n_t('time.time_date_week[1]')}}</div>
      <!--周二-->
      <div class="item border1">{{i18n_t('time.time_date_week[2]')}}</div>
      <!--周三-->
      <div class="item border1">{{i18n_t('time.time_date_week[3]')}}</div>
      <!--周四-->
      <div class="item border1">{{i18n_t('time.time_date_week[4]')}}</div>
      <!--周五-->
      <div class="item border1">{{i18n_t('time.time_date_week[5]')}}</div>
      <!--周六-->
      <div class="item border1">{{i18n_t('time.time_date_week[6]')}}<div class="bg bg2"></div></div>
      <!--日期列表-->
      <div class="item" v-for="(val,key) in dates" :key="key" @click="onchange(val)">
        <div class="text" :class="val == day && 'active'">{{val}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { i18n_t } from "src/boot/i18n.js"
export default {
  name: "Calendar",
  data() {
    return {
      dates:[],
      year:2020,
      month:1,
      day:7,
      years:[],
      months:[
        {
          label:this.i18n_t('time.month_1'),
          value:1
        },
        {
          label:this.i18n_t('time.month_2'),
          value:2
        },
        {
          label:this.i18n_t('time.month_3'),
          value:3
        },
        {
          label:this.i18n_t('time.month_4'),
          value:4
        },
        {
          label:this.i18n_t('time.month_5'),
          value:5
        },
        {
          label:this.i18n_t('time.month_6'),
          value:6
        },
        {
          label:this.i18n_t('time.month_7'),
          value:7
        },
        {
          label:this.i18n_t('time.month_8'),
          value:8
        },
        {
          label:this.i18n_t('time.month_9'),
          value:9
        },
        {
          label:this.i18n_t('time.month_10'),
          value:10
        },
        {
          label:this.i18n_t('time.month_11'),
          value:11
        },
        {
          label:this.i18n_t('time.month_12'),
          value:12
        },
      ]
    };
  },
  computed:{
    ...mapGetters(['get_global_click','get_lang'])
  },
  created() {
    let now = new Date();
    let years = [];
    let now_year = now.getFullYear()
    for(let i = 2000 ; i <= now_year; i++){
      years.push(i)
    }
    let date = {};
    if(this.default){
      date = new Date(this.default);
    }else{
      date = now
    }
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    this.years = years
    this.setCalendar()
  },

  props: {
    default: String
  },
  methods: {
    //选择日期
    onchange(val){
      if(val == '') return
      let month = this.month < 10 ? '0' + this.month : this.month;
      val = val < 10 ? '0' + val : val;
      this.$emit('onchange',`${this.year}/${month}/${val}`)
      this.$emit('onhide')
      // 实时更新选中样式
      this.day = Number(val)
    },
    //改变年份
    changeYear(type){
      if(type == 1){
        if(this.year == this.years[0]){
          return
        }
        this.year --
      }else{
        if(this.year == this.years[this.years.length - 1]){
          return
        }
        this.year ++
      }
      this.setCalendar()
    },
    //改变月份
    changeMonth(type){
      if(type == 1){
        if(this.month == 1){
          if(this.year == this.years[0]) return
          this.month = 12
          this.year --
        }else{
          this.month --
        }
      }else{
        if(this.month == 12){
          if(this.year == this.years[this.years.length - 1]) return
          this.month = 1
          this.year ++
        }else{
          this.month ++
        }
      }
      this.setCalendar()
    },

    //获取一个月有多少天
    getMonthLength(year, month) {
      return new Date(year,month,0).getDate();
    },
    //设置日历
    setCalendar() {
      // 获取第一天星期几
      let slength = this.getNulllength(this.year, this.month);
      // 获取这月的长度
      let monthLength = this.getMonthLength(this.year, this.month);
      let arr = [];
      for(let i = 0; i < slength; i++){
        arr.push('')
      }
      for(let i = 1; i <= monthLength; i++){
        arr.push(i)
      }
      this.dates = arr
      if(this.day > arr[arr.length - 1]){
        this.day = arr[arr.length - 1]
      }
    },
    //获取空字符串长度
    getNulllength(){
      return new Date(`${this.year}-${this.month}-01`).getDay();
    }
  },
  watch:{
    get_global_click(){
      this.$emit('onhide')
    }
  },
  destroyed() {
    this.dates = null;
    this.months = null;
  }
};
</script>
<style lang="scss" scoped>
.calendar-wrap {
  position: absolute;
  z-index: 999;
  background: var(--q-gb-bg-c-4);
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
    background-color: var(--q-gb-bg-c-4);
    border: 1px solid #d1d1d1;
    z-index: 1;
  }
  .horn2 {
    position: absolute;
    height: 10px;
    width: 30px;
    top: 0;
    left: 155px;
    background-color: var(--q-gb-bg-c-4);
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
        :deep(.scroll) {
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
          color: var(--q-gb-t-c-1);
          background-color: var(--q-gb-bg-c-1);
        }
      }
    }
    .border1 {
      border-bottom: 1px solid #d1d1d1;
      .bg {
        background: var(--q-gb-bg-c-4);
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
