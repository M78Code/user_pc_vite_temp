<template>
  <div class="record-head">
    <div class="c-simple-header">
      <div v-if="is_hide_icon" class="icon-layout"></div>
      <div v-else class="rule-logo">
        <div class="img-logo custom-format-img-logo-01"></div>
      </div>
      <div class="head-info">
        <div class="rule-title">
          <span>{{i18n_t("ouzhou.record.my_bet")}}</span>
        </div>
        <div class="systime">
          <!--右侧时间-->
          <span>{{date_time}} (GMT+8)</span>
        </div>
      </div>
    </div>
    <div class="tabs-wrap">
      <div class="btn-wrap">
        <span v-for="item in tabList" :key="item.id" @click="tabClick(item)"
              :class="[{ 'active': item.id === active }, 'btn']">{{ i18n_t(item.label)}}
        </span>
      </div>
      <!-- 按钮后面的描述 -->
      <div class="bet-desc">
          <!-- 文字前面的点-->
          <div class="point"></div>
          <!--未结算文字描述-->
          <div class="text">四大分卫呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { LOCAL_PROJECT_FILE_PREFIX } from 'src/output/index.js'
import { get_remote_time, utc_to_gmt_no_8_ms2 } from "src/output/index.js"
import { BetRecordHistory } from "src/core/bet-record/pc/bet-record-instance.js"

const tab = ref('unsettled')
const emits = defineEmits(['tab_change'])
const active = ref('unsettled')
const tabClick = (item) => {
  active.value = item.id
  emits('tab_change', item.id)
}
const tabList = ref([
  { label: "ouzhou.record.unsettled", id: 'unsettled' },
  { label: "ouzhou.record.settled", id: 'settled' }
])


let is_hide_icon = ref(false)
let date_time = ref("")
let timer_id = null

/**
 * @Description:获取当前系统时间
 * @return {undefined} undefined
 */
 function get_date_time() {
    let time = get_remote_time();
    date_time.value = utc_to_gmt_no_8_ms2(time);
    timer_id = setInterval(() => {
        time += 1000;
        date_time.value = utc_to_gmt_no_8_ms2(time);
    }, 1000);
}

onMounted(() => {
  is_hide_icon.value = (location.href.indexOf('i_h=1') != -1)
  get_date_time()
})

onUnmounted(() => {
  timer_id && clearInterval(timer_id)
})

</script>

<style lang="scss" scoped>
.record-head {
  height: 100px;
  width: 100%;
  background: var(--q-gb-bg-c-14);
  position: relative;
  box-sizing: border-box;
}
.icon-layout {
  width: 5px;
}
.c-simple-header {
  display: flex;
  padding: 0 20px 0 15px;
  height: 60px;
  min-height: 60px; /*  必须用min-height；兼容IE */
  align-items: center;
  text-transform: uppercase;
  .rule-logo {
    margin-right: 33.3px;
    height: 100%;
    .img-logo {
      width: 130px;
      height: 100%;
      background-image: url($SCSSPROJECTPATH + "/image/image/logo.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
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
  }
}
/**表格头部分 未结算已结算预约注单按钮tab*/
.tabs-wrap {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
  /**未结算已结算预约注单按钮tab*/
  .btn-wrap {
    position: absolute;
    bottom: -1px;
    left: 0;
    display: flex;
    //height: 30px;
    /**按钮样式*/
    .btn {
      margin-right: 5px;
      height: 100%;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      padding: 0 10px;
      &.active {
        color: var(--q-gb-t-c-7);
        position: relative;
        &::after {
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          border-radius: 2px 2px 0px 0px;
          content: "";
          background-color: var(--q-gb-t-c-7);
        }
      }
    }
  }
  /**按钮后面的描述*/
  .bet-desc {
    display: flex;
    align-items: center;
    /**文字前面的点*/
    .point {
      margin-right: 5px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: var(--q-gb-bd-c-4);
    }
  }
}
</style>