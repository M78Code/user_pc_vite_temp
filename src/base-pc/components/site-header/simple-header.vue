<!--
 * @Author: Cable -> Jacques
 * @Date: 
 * @Description: 组件移植： 简单页面头部  体育规则页面使用
-->

<template>
  <div class="c-simple-header">
    <div v-if="is_hide_icon" class="icon-layout"></div>
    <div v-else class="rule-logo">
      <!-- <div class="img-logo custom-format-img-logo-01"></div> -->
      <img v-if="PROJECT_NAME=='ouzhou-pc'" :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/image/ouzhou-logo.png`" alt="" srcset="" class="" />
      <img src="" alt="" v-else>
    </div>
    <div class="head-info">
      <div class="rule-title">
        <slot /> <!--插入注单历史标题-->
      </div>
      <div class="systime">
        <div class="refresh" v-if="['match_results','analysis_header'].includes( $route.name)">
          <refresh :loaded="data_loaded" @click="refresh()" />
        </div>
        <!--右侧时间-->
        <span>{{ date_time }}(GMT+8)</span>
      </div>
    </div>
  </div>
</template>

<script>
// src\core\utils\module\match-list-js与src\core\format\module\format-date.js 存在get_remote_time的冲突导出
// import { get_remote_time,utc_to_gmt_no_8_ms2 } from "src/output/index.js" 
import { get_remote_time,utc_to_gmt_no_8_ms2,LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js" 
import refresh from "src/components/refresh/refresh.vue"
import { compute_img_url } from 'src/core/server-img/index.js'

export default {
  name: "rule",
  data() {
    return {
      date_time: "",//当前系统时间
      is_hide_icon: false,
      logo:'',
      data_loaded:false,
      compute_img_url,
      LOCAL_PROJECT_FILE_PREFIX
    };
  },
  components: {
    refresh
  },
  props: {
    // data_loaded: {
    //   type: Boolean,
    //   default: false,//刷新按钮动画开关
    //   PROJECT_NAME:''   // 当前系统
    // }
  },
  created() {
   
    const {PROJECT_NAME} = window.BUILDIN_CONFIG
    // if (PROJECT_NAME=='ouzhou-pc') {
    //  this.logo = 'pc-home-logo-en'
    // }
    this.PROJECT_NAME = PROJECT_NAME
    this.is_hide_icon = (location.href.indexOf('i_h=1') != -1);
    this.get_date_time();
  },
  destroyed() {
    if (this.timer_id) {
      clearInterval(this.timer_id);
    }
  },
  methods: {
    /**
     * @Description:获取当前系统时间
     * @return {undefined} undefined
     */
    get_date_time() {
      let time = get_remote_time();
      this.date_time = utc_to_gmt_no_8_ms2(time);
      this.timer_id = setInterval(() => {
        time += 1000;
        this.date_time = utc_to_gmt_no_8_ms2(time);
      }, 1000);
    },
    /**
    * @description: 刷新当前数据
    * @return {}
    */
    refresh() {
      this.data_loaded = true
      this.refresh_loading_timer && clearTimeout(this.refresh_loading_timer)
      this.refresh_loading_timer = setTimeout(() => {
        this.data_loaded = false
      }, 3000)
      this.$emit("refresh")
    }
  },
};
</script>

<style lang="scss" scoped>
.icon-layout {
  width: 5px;
}

.c-simple-header {
  display: flex;
  padding: 0 20px 0 15px;
  height: 61px;
  min-height: 61px;
  /*  必须用min-height；兼容IE */
  align-items: center;
  text-transform: uppercase;

  .rule-logo {
    margin-right: 33.3px;
    height: 100%;
    display: flex;
    align-items: center;

    .img-logo {
      width: 130px;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      img{
        height: 30px;
        width: 130px;
      }
    }
  }
}

/**注单历史头部样式*/
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
      width: 24px;
      height: 24px;
      border:1px solid #e2e2e2;
      border-radius: 50%;
      margin-right: 5px;
      cursor: pointer;
    }
  }
}</style>