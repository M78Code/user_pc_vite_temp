<!--
 * @Author:
 * @Date:
 * @Description: 滚动操作处理
-->

<template>
      
  <!-- high_scrolling: set_is_high_scrolling && menu_type !== 100 && !(menu_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.mi)) && menu_type != 100, -->
  <div class="scroll-wrapper" ref="container" @scroll.passive="handler_match_container_scroll">
    <div  :class="['scroll-i-con', { detail_list: is_detail, simple: standard_edition == 1, 'static': is_static }]"
      :style="get_container_style">
      <template v-if="MatchMeta.match_mids.length > 0">
        <div v-for="(match_mid, index) in MatchMeta.match_mids" :index="index" :key="index" :data-mid="match_mid"
          :class="['s-w-item', {last: index == MatchMeta.match_mids.length - 1 }]" 
          :style="{ transform: `translateY(${get_match_top_by_mid(match_mid)}px)`, zIndex: `${100 + index}` }">
          <!-- 调试用 -->
          <div v-if="test" class="debug-head data_mid" :data-mid="match_mid" :class="{ first: index === 0 }">
            <span> {{ get_index_f_data_source(match_mid) + '-' + index }} </span>
            <span> key={{match_mid }}-----{{ match_mid }}-{{ 'mid: ' + match_mid }}
              <span> {{ get_match_top_by_mid(match_mid) ? "-" + get_match_top_by_mid(match_mid) : 'none!' }} </span>
              <span>ms: {{ match_item?.ms }}</span>
            </span>
          </div>
          <!-- 赛事渲染信息 -->
          <div class="s-w-i-inner" v-if="defer_render(index)">
            <slot :match_item="get_match_item(match_mid)" :mid="match_mid" :index="index"></slot>
          </div>
        </div>
      </template>
      <!-- 到底了容器-->
      <div :class="['loading-more-container']" v-if="is_show_out">
        <div style="color:#AAAEB8;font-size:.12rem;"> {{ i18n_t("scroll_wrapper.is_footer") }} </div>
      </div>
    </div>
    <!-- 回到顶部按钮组件 -->
    <ScrollTop :list_scroll_top="scroll_top" to_com=".refresh-container" @back-top="goto_top" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue' 
import lodash from 'lodash'
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import VirtualList from "src/core/match-list-h5/match-class/virtual-list.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5,compute_local_project_file_path } from "src/output/index.js"
import { menu_type, menu_lv2, is_kemp, is_hot, is_detail, is_results, is_esports, is_collect } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import ScrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";
import { compute_css_obj, MenuData } from 'src/output/index.js'

// 避免定时器每次滚动总是触发
const props = defineProps({
  is_goto_top_random: Number,
})

const route = useRoute()
const defer_render = use_defer_render()

// 调试信息
let test = ref('')
let scroll_top = ref(0)
let prev_frame_time = ref(0)
//滚动中上一帧的scroll top
let prev_frame_poi = ref(0)
let list_wrap_height = ref(0)
let target_scroll_obj = ref(null)
let scroll_frame_timer = null
// 上一次滚动的距离
const prev_scroll = ref(0)
const max_height = ref(false)
// 赛事mids
const scroll_timer = ref(0)
const emitters = ref({})
const container = ref(null)
// const scroll_height = ref(0)

onMounted(() => {
  test.value = sessionStorage.getItem('wsl') == '9999';
  // 详情页以外的列表才设置最小高度
  if (is_detail.value) list_wrap_height.value = 8;
  emitters.value = {
    emitter: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MAX_HEIGHT, update_max_height).off,
    emitter_1: useMittOn(MITT_TYPES.EMIT_GOT_TO_TOP, goto_top).off,
  }
})

// 获取仓库赛事数据
const get_match_item = (mid) => {
  return MatchDataBaseH5.get_quick_mid_obj(mid)
}
const get_index_f_data_source = (mid) => {
  return lodash.findIndex(MatchMeta.match_mids, { mid });
}

// 赛事列表容器滚动事件
const handler_match_container_scroll = lodash.debounce(($ev) => {
  const scrollTop = lodash.get($ev.target, 'scrollTop', 0)
  scroll_top.value = scrollTop
  const length = lodash.get(MatchMeta.complete_matchs, 'length', 0)
  if (is_static.value || length < 17) return
  if (scrollTop === 0 || (prev_scroll.value === 0 &&  Math.abs(scrollTop) >= 200) || Math.abs(scrollTop - prev_scroll.value) >= 200) {
    prev_scroll.value = scrollTop
    MatchMeta.compute_page_render_list({ scrollTop: $ev.target.scrollTop, type: 2, is_again: false, merge: 'cover' })
    if (!is_esports.value) get_match_base_hps()
  }
}, 300)

// 获取赔率
const get_match_base_hps = lodash.debounce(() => {
  MatchMeta.get_match_base_hps_by_mids({})
  clearTimeout(scroll_timer.value)
  scroll_timer.value = null
}, 800)

/**
 * @description: 列表回到顶部
 */
const goto_top = () => {
  MatchMeta.set_prev_scroll(0)
  let timer = setTimeout(() => {
    scroll_top.value = 0
    container.value && container.value.scrollTo({ top: 0 });
    clearTimeout(timer)
    timer = null
  }, 100)
}

// 是否虚拟计算逻辑
// const get_is_static = () => {
//   return is_kemp.value || is_collect.value || route?.name === 'collect' || MatchResponsive.is_compute_origin.value
// }
// 是否虚拟计算逻辑
const is_static = computed(() => {
  return MenuData.update_time.value && (is_kemp.value || is_collect.value || route?.name === 'collect' || 
    MatchResponsive.is_compute_origin.value || MenuData.get_mm_is_champion())
})

// 到底了容器
const is_show_out = computed(() => {
  return max_height && !is_static.value && VirtualList.container_total_height.value > container.value?.offsetHeight
})

// 计算总高度
const container_total_height = computed(() => {
  const height = is_show_out.value ? VirtualList.container_total_height.value : VirtualList.container_total_height.value - 181
  return `${height}px`
})

// 动态 样式 
const get_container_style = computed(() => {
  const style_obj = { 'height': is_static.value ? 'auto' : container_total_height.value}
  const length = lodash.get(MatchMeta.match_mids, 'length', 0)
  if (length > 0 && menu_type.value !== 100 && !(menu_type.value == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.value?.mi))) Object.assign(style_obj, {
    ...compute_css_obj({key: 'h5-kyapp-speciality-bg' })
  })
  return style_obj
})

const get_match_top_by_mid = (mid) => {
  const key = VirtualList.get_match_height_key(mid)
  return lodash.get(VirtualList,`mid_top_map.${key}`,0);
}

// 设置是否快速滚动显示骨架屏背景
const set_is_high_scrolling = computed(() => {
  // 滚动过程中，是否显示  骨架屏背景图片
  let flag = false;
  if (is_detail.vlaue || (MatchMeta.match_mids && MatchMeta.match_mids.length <= 0)) {
    flag = false;
  } else {
    flag = get_to_bottom_space > 350 && !is_kemp.value
    // 一般热门推荐赛事长度为4，详情页内需过滤掉
    if (!is_detail.vlaue && lodash.get(target_scroll_obj.value, 'scroll_height') > 1800) {
      flag = true
    }
  }
  return true
})
// 获取滚动到达底部的距离(节流)

const get_to_bottom_space = computed(() => {
  let delta = 0
  let list_scroll_top = target_scroll_obj.value
  //容器的滚动数据
  if (list_scroll_top && MatchMeta.match_mids) {
    delta = list_scroll_top.scroll_height - (list_scroll_top.scroll_y + list_scroll_top.client_height);
  } else {
    //window的滚动数据
  }
  return Math.abs(delta);
})
// 是否 走高度计算
const is_static_item = computed(() => {
  let flag = false;
  if (menu_type.value == 100 || menu_lv2.value?.mi == 100 || (is_detail.vlaue || is_hot.vlaue) || 
    (menu_type.value == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.value?.mi))
  ) {
    flag = true;
  }
  if (MenuData.hot_tab_menu.menuName) flag = false;
  return !flag;
})

/**
 * @description: 赛事列表到底了
 */
const update_max_height = (flag) => {
  max_height.value = flag;
}

// 触发本组件销毁之前回调
onUnmounted(() => {
  MatchDataBaseH5.set_active_mids([])
  clearTimeout(scroll_frame_timer);
  scroll_frame_timer = null;
  Object.values(emitters.value).map((x) => x());
})
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-anchor: none;
  background-color: #e2e2e2;
  touch-action: pan-y;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;/*解决移动端滑动卡顿问题*/
  transform: translateZ(0px);/*开启GPU加速*/
  &.data-get-empty {
    min-height: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  .scroll-i-con {
    width: 100%;
    position: relative;
    background-size: contain;
    // will-change: transform;
    background-repeat: repeat-y !important;
    &.high_scrolling {
      background-size: contain;
      background-image: url($SCSSPROJECTPATH + "/image/skeleton/height-177.jpg"); 
      &.simple {
      background-image: url($SCSSPROJECTPATH + "/image/skeleton/height-117.jpg");
      }
    }
    &.detail_list {
      background-image: none;
    }
    .s-w-item {
      width: 100%;
      height: auto;
      position: absolute;
      top: 0;
      left: 0;
      content-visibility: auto;
      &.last{
        // padding-bottom: 0.01rem;
        .match-container{
          padding-bottom: 0rem !important;
        }
      }
    //  background: pink;
    //  border: 1px solid blue; 用于调试 请勿删除
      &.static {
        position: static;
      }
      .s-w-i-inner {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        &.absolute {
          position: absolute;
        }
      }
      .debug-head {
        width: 98%;
        height: 0.13rem;
        position: absolute;
        color: red;
        z-index: 501;
        top: 4px;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        //border-bottom: 1px solid #f00;
        &.first {
          top: 0.46rem;
        }
      }
    }
    &.static .s-w-item{
      position: static;
      transform: translateY(0) !important
    }
  }
  .loading-more-container{
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 181px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 20;
  }
}
.err_box{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>