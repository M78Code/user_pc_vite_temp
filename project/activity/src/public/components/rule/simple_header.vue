<!--
 * @Author: Cable
 * @Date: 2020-07-31 16:14:55
 * @Description: 简单页面头部  体育规则页面使用
-->

<template>
  <div class="c-simple-header">
    <div v-if="is_hide_icon" class="icon-layout"></div>
    <div v-else class="rule-logo">
      <div class="img-logo custom-format-img-logo-01"></div>
      <img src="" alt="">
    </div>
    <div class="head-info">
      <div class="rule-title">
        <slot />
      </div>
      <div class="systime">
        <div class="refresh" v-if="$route.name=='match_results'">
          <refresh :loaded="data_loaded" @click="refresh()" />
        </div>
        <span>{{date_time}} (GMT+8)</span>
      </div>
    </div>
  </div>
</template>

<script>
import time_format_mixin from "src/public/mixins/common/time_format";
import refresh from "src/public/components/refresh/refresh.vue";
export default {
  mixins: [time_format_mixin],
  data() {
    return {
      is_hide_icon: false,
      date_time: "",//当前系统时间
      version_name:window.env.config.DEFAULT_VERSION_NAME,  // 版本
      timeout_obj:{} //定时器集合
    };
  },
  components:{
    refresh
  },
  props:{
    data_loaded:{
      type: Boolean,
      default: false//刷新按钮动画开关
    }
  },
  created() {
    this.is_hide_icon = (location.href.indexOf('i_h=1')!=-1);
    this.get_date_time();
  },
  methods: {
    /**
     * @Description:获取当前系统时间
     * @return {undefined} undefined
     */
    get_date_time() {
      let time = this.mx_get_remote_time();
      this.date_time = this.utc_to_gmt_no_8_ms2(time);
     this.timeout_obj.timer1 = setInterval(() => {
        time += 1000;
        this.date_time = this.utc_to_gmt_no_8_ms2(time);
      }, 1000);
    },
    /**
    * @description: 赛果刷新当前数据
    * @return {}
    */
   refresh(){
     this.$emit("refresh")
   }
  },
  destroyed() {
      /**清除定时器 */
  for (const key in this.timeout_obj) {
    clearTimeout(this.timeout_obj[key]);
  }
  this.timeout_obj = {};
  }
};
</script>

<style lang="scss" scoped>
.c-simple-header {
  display: flex;
  padding: 0 20px 0 15px;
  height: 61px;
  min-height: 61px; /*  必须用min-height；兼容IE */
  align-items: center;
  text-transform: uppercase;
  .rule-logo {
    margin-right: 33.3px;
    height: 100%;
    .img-logo {
      width: 130px;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }
}
.head-info {
  display: flex;
  justify-content: space-between;
  flex: 1;
  .rule-title {
    font-size: 12px;
  }
  .systime {
    min-width: 96px;
    font-size: 12px;
    display: flex;
    align-items: center;
    .refresh {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>
