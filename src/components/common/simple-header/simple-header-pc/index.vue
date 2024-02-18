<!-- @Description: 简单页面头部  体育规则页面使用 -->

<template>
  <div class="c-simple-header" v-if="false" :style="page_style">
      <div v-if="is_hide_icon" class="icon-layout"></div>
      <div v-else class="rule-logo">
          <div class="img-logo custom-format-img-logo-01"></div>
          <img src="" alt="">
      </div>
      <div class="head-info">
          <div class="rule-title">
              <span>{{ title }}</span>
              <!--插入注单历史标题-->
              <!-- <slot /> -->
          </div>
          <div class="systime">
              <div class="refresh" v-if="current_route_name == 'match_results'">
                  <refresh :loaded="data_loaded" @click="refresh()" />
              </div>
              <!--右侧时间-->
              <span>{{ date_time }} (GMT+8)</span>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';

import { RefreshWapper as Refresh } from "src/components/common/refresh"
import { get_remote_time, utc_to_gmt_no_8_ms2 } from "src/output/index.js"
import { compute_css_variables } from "src/core/css-var/index.js"


const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'simple-header' })

const props = defineProps({
  /** 刷新按钮动画开关 */
  data_loaded: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['refresh'])

/** 当前路径的名字 */
const { name: current_route_name } = useRoute()

/** 当前系统时间 */
const date_time = ref('')
/** 是否展示图标 */
const is_hide_icon = ref(false)
onMounted(() => {
  is_hide_icon.value = location.href.indexOf('i_h=1') != -1
})

const timer_id = ref(null)
onUnmounted(() => {
  if (timer_id.value) {
      clearInterval(timer_id.value)
      timer_id.value = null
  }
})

/**
* @Description:获取当前系统时间
* @return {undefined} undefined
*/
function get_date_time() {
  let time = get_remote_time();
  date_time.value = utc_to_gmt_no_8_ms2(time);
  timer_id.value = setInterval(() => {
      time += 1000;
      date_time.value = utc_to_gmt_no_8_ms2(time);
  }, 1000);
}
onMounted(get_date_time)

/**
* @description: 赛果刷新当前数据
* @return {}
*/
function refresh() {
  emit("refresh")
}
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
  border-bottom: 1px solid var(--q-simple-header-color-1);
  background: var(--q-simple-header-color-2);

  .rule-logo {
      margin-right: 33.3px;
      height: 100%;

      .rule-title {
          color: var(--q-simple-header-color-3);
      }

      .systime {
          color: var(--q-gb-t-c-10);
      }

      .img-logo {
          width: 130px;
          height: 100%;
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

      .refresh {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          cursor: pointer;
      }
  }
}
</style>
src/core/format/common/module/format-date.js