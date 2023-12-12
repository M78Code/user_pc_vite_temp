<!--
 * @Author: ledron
 * @Date: 2021-09-22
 * @Description: 倒计时组件
-->
<template>
  <div class="" :class="[noNeedCss ? '' : 'CountdownTitle']">
    <template v-if="day > 0">
      <span>{{ day }}</span
      >天
    </template>
    <span>{{ hour }}</span
    >{{ noNeedCss ? ":" : "时" }} <span>{{ minute }}</span
    >{{ noNeedCss ? ":" : "分" }} <span>{{ second }}</span
    >{{ noNeedCss ? "" : "秒" }}
  </div>
</template>

<script>
import common from "project/activity/src/mixins/common/common.js";
import acticity_mixin from "project/activity/src/mixins/acticity_mixin/acticity_mixin";
//头部引入
import {
  useMittOn,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "project_path/src/core/index.js";
import { format_time_zone_time } from "project_path/src/core/index.js";
export default {
  name: "active_count_down",
  mixins: [common, acticity_mixin],
  props: {
    endTime: {
      type:  '',
     
    },
    noNeedCss: {
      type: Boolean,
    
    },
    timer: {
      type: Boolean,
  
    },
  },
  data() {
    return {
      day: "", //天
      hour: "", //时
      minute: "", //分
      second: "", //秒
      flag: false,
    };
  },
  created() {
    this.timeDown(this.endTime);
  },
  mounted() {
    //定时器
    this.time2_ = 0;
    this.time1_ = setInterval(() => {
      if (this.flag == true) {
        clearInterval(this.time1_);
      }
      this.timeDown(this.endTime);
    }, 1000);
  },
  methods: {
    // 倒计时组件
    timeDown(from_date) {
      if (isNaN(from_date) && typeof from_date.replace == "function") {
        from_date = from_date.replace(/-/g, "/");
      }
      let endTime = null;
      let nowTime = null;
      let leftTime;
      // 获取服务器时间
      let stime = this.get_now_server();
      // 使用服务器时间来计算
      if (this.timer) {
        // 结束时间
        endTime = new Date(from_date);
        // 当前时间
        nowTime = this.utc_to_gmt_no_8_ms2_(stime);
        let hour =
          (nowTime.h <= 11 ? 11 : 23 + 12) - nowTime.h < 10
            ? "0" + ((nowTime.h <= 11 ? 11 : 23 + 12) - nowTime.h)
            : (nowTime.h <= 11 ? 11 : 23 + 12) - nowTime.h;
        let m_ = 59 - nowTime.mm;
        let s_ = 59 - nowTime.s;
        // `${endTime.y}-${endTime.m}-${endTime.d} ${endTime.h}:${endTime.mm}:${endTime.s}`
        leftTime = parseInt(hour * 60 * 60 + m_ * 60 + s_);
      } else {
        endTime = new Date(from_date);
        nowTime = this.utc_to_gmt_no_8_ms2_(stime);
        leftTime = parseInt((endTime.getTime() - stime) / 1000);
      }
      // 如果是NAN，则初始化数据，return
      if (isNaN(leftTime)) {
        this.day = 0; //天
        this.hour = 0; //时
        this.minute = 0; //分
        this.second = 0; //秒
        return;
      }
      let d = parseInt(leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((leftTime / 60) % 60));
      let s = this.formate(parseInt(leftTime % 60));
      if (leftTime <= 0) {
        this.flag = true;
        this.$emit("time-end");
        clearTimeout(this.time2_);
        // 倒计时结束 刷新当面页面
        this.time2_ = setTimeout(() => {
          this.noNeedCss && useMittEmit(MITT_TYPES.EMIT_INDEX_REFRESH_END);
        }, 1000);
        this.day = 0; //天
        this.hour = 0; //时
        this.minute = 0; //分
        this.second = 0; //秒
      }
      if (this.flag == true) {
        return;
      }
      this.day = d; //天
      this.hour = h; //时
      this.minute = m; //分
      this.second = s; //秒
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    },
    /**
     * 获取服务器时间的年月日时分秒
     */
    utc_to_gmt_no_8_ms2_(value) {
      if (!value) {
        return "";
      }
      let time = format_time_zone_time(parseInt(value));
      let [y, m, d, h, mm, s] = this.format_date_base(time);
      return { y, m, d, h, mm, s };
    },
  },
  unmounted() {
    clearInterval(this.time1_);
    this.time1_ = null;

    clearTimeout(this.time2_);
    this.time2_ = null;
  },
};
</script>

<style lang="scss" scoped>
.CountdownTitle {
  min-width: 0.76rem;
  padding: 0 0.1rem;
  margin: 0 auto 0.1rem;
  height: 0.32rem;
  line-height: 35px;
  background-image: linear-gradient(
    180deg,
    #ffffff 0%,
    #e7e7e7 49%,
    #ffffff 100%
  );
  border: 1px solid #ffffff;
  box-shadow: 0 1px 2px 0 rgba(96, 96, 96, 0.17);
  border-radius: 0.33rem;
  font-size: 0.12rem;
  color: #666666;
  display: flex;
  justify-content: center;

  :deep(span) {
    font-family: dinMedium;
    font-size: 0.18rem;
    color: #ff7000;
    margin: 0 0.05rem 0 0.1rem;
  }
}
</style>
 