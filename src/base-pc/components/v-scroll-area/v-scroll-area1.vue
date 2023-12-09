<!--
 * @Author: cooper
 * @Date: 2023-08-05 16:42
 * @Description: 通屏垂直滚动组件
-->

<template>
  <div class="v-scroll-area fit row relative-position">
    <!-- 内容区 -->
    <div class="content-wrap fit">
      <!-- 头 ------------------->
      <div class="scroll-header absolute">
        <slot name="header" />
        <q-resize-observer
          v-if="observer_area == 1 || observer_area == 3"
          @resize="on_header_change"
          :debounce="0"
        />
      </div>
      <!-- 中 ------------------->
      <q-scroll-area
        :visible="true"
        ref="ref_v_scroll_area"
        :thumb-style="{ right: is_iframe ? '-8px' : '-10.5px' }"
        class="fit v-scrollarea"
      >
        <q-scroll-observer @scroll="on_scroll" />
        <div
          class="middle-content"
          :style="{
            paddingTop: header_height + 'px',
            paddingBottom: footer_height + 'px',
          }"
        >
          <div class="scroll-inner-wrap fit">
            <slot />
            <q-resize-observer
              v-if="observer_middle"
              @resize="on_scroll_change"
              :debounce="0"
            />
          </div>
        </div>
      </q-scroll-area>

      <!-- 尾 ------------------->
      <div class="scroll-footer" :style="footer_position">
        <slot name="footer" />
        <q-resize-observer
          v-if="observer_area == 2 || observer_area == 3"
          @resize="on_footer_change"
          :debounce="0"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from "vue";
// import menu_data from 'src/core/menu-pc/menu-data-class.js'

// import { useMittEmit } from 'src/core/mitt/index.js'
// import { EMIT_MX_COLLECT_MATCH } from 'src/base-pc/core/mitt/mitt-keys.js';
const props = defineProps({
  // 固定区域 1：头部 2：尾部 3：头和尾
  observer_area: Number,
  // 是否监听中间滚动变化
  observer_middle: {
    tye: Boolean,
    default: false,
  },
  position: String,
  page_type: String,
});

const emits = defineEmits([
  "match_details_header_height_main_details",
  "match_details_header_height_right_details",
  "match_details_header_height_virtual_details",
  "virtual_right_list_header_height",
  "on_scroll",
]);
const ref_v_scroll_area = ref(null);
const header_height = ref(0);
const middle_height = ref(0);
const footer_height = ref(0);
const footer_position = ref({ bottom: "0px" }); // 底部区域位置样式
const bet_item_position_timer = ref(0); // 定时器ID

/**
 * @description 响应 头部尺寸变化
 * @param  {type} height  高度
 * @return {undefined} undefined
 */
const on_header_change = ({ height }) => {
 header_height.value = height;
 //this.$route.name
  if (
    ["details", "virtual_details", "home", "video"].includes('home')
  ) {
    // 判断当前是哪一个详情页，根据页面来发送对应的头部高度
    // 通用赛事详情
    if (props.page_type == "main_details") {
      emits("match_details_header_height_main_details", height);
      // 右侧详情
    } else if (props.page_type == "right_details") {
      emits("match_details_header_height_right_details", height);
      // 虚拟详情
    } else if (props.page_type == "virtual_details") {
      emits("match_details_header_height_virtual_details", height);
    }
  }
  // 虚拟体育右侧头部视频区高度
  if (props.page_type == "virtual_right_list") {
    emits("virtual_right_list_header_height", height);
  }
};

/**
 * @description 响应 主内容区尺寸变化
 * @param  {type} height  高度
 * @return {undefined} undefined
 */
const on_scroll_change = ({ height }) => {
  middle_height.value = height;
  set_footer_position();
};

/**
 * @description 响应 尾部尺寸变化
 * @param  {type} height  高度
 * @return {undefined} undefined
 */
const on_footer_change = ({ height }) => {
  footer_height.value = height;
  set_footer_position();
};
/**
 * @description 设置 尾部位置
 * @return {undefined} undefined
 */
const set_footer_position = () => {
  // 监听滚动变化触发逻辑
  if (props.observer_middle) {
    let left_height = this.vx_layout_list_size.height;
    //mac上面
    let dis = 5;
    if (/macintosh|mac os x/i.test(navigator.userAgent)) {
      dis = 15;
    }
    // 滚动底部高度
    let scroll_footer_top = header_height.value + middle_height.value + dis;
    // 滚动高度
    let scroll_height = scroll_footer_top + footer_height.value;
    // 如果滚动高度大于左侧高度按照底部距离为0处理
    if (scroll_height > left_height) {
      footer_position.value = {
        bottom: "0px",
      };
    } else {
      // 否则设置距离顶部距离
      footer_position.value = {
        top: scroll_footer_top + "px",
        bottom: "auto",
      };
    }
    // 最后再次设置滚动位置
    this.set_scroll_position([scroll_footer_top, 0]);
  } else {
    footer_position.value = {
      bottom: "0px",
    };
  }
};

/**
 * @description: 监听滚动
 * @param {Object} position 滚动位置
 * @return {}
 */
const on_scroll = (position) => {
  emits("on_scroll", position);
};
// 设置滚动位置
const set_scroll_position = (position) => {
  ref_v_scroll_area.value.setScrollPosition(position[0], position[1]);
};

onMounted(()=>{
   // 监听窗口发生变化解决点击游览器全屏非全屏变化导致的css样式兼容问题
   window.addEventListener("resize", set_footer_position);
})

onMounted(()=>{
   // 移除窗口监听，优化组件性能
   window.removeEventListener("resize", set_footer_position);
})
</script>

<style lang="scss">
.v-scroll-area {
  .content-wrap {
    flex: 1;
    .scroll-header {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 100;
      padding-right: 14px;
    }
    .scroll-inner-wrap .loading-wrap {
      padding-top: 100px !important;
    }
    .scroll-footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 220px;
      z-index: 100;
    }
  }
  .v-scrollarea .q-scrollarea__bar {
    display: none;
  }
  .q-scrollarea__content {
    width: 100%;
  }
}
</style>