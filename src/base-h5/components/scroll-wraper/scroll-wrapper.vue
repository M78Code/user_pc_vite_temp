<!--
 * @Author:
 * @Date:
 * @Description: 滚动操作处理
-->

<template>
      
<!-- :style="compute_css_obj({key: 'h5-kyapp-speciality-bg'})"> -->
  <div class="scroll-wrapper" ref="container" @scroll="handler_match_container_scroll">
    <div  :class="['scroll-i-con', {high_scrolling: set_is_high_scrolling && menu_type !== 100 &&
       !(menu_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.mi)) && menu_type != 100,
        detail_list: is_detail, simple: standard_edition == 1,
        'static': get_is_static() 
      }]"
      :style="{ 'height': get_is_static() ? 'auto' : container_total_height}">
      <template v-if="MatchMeta.match_mids.length > 0">
        <div v-for="(match_mid, index) in MatchMeta.match_mids" :index="index" :key="match_mid" :data-mid="match_mid"
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
          <div class="s-w-i-inner">
            <slot :match_item="get_match_item(match_mid)" :mid="match_mid" :index="index"></slot>
          </div>
        </div>
      </template>
      <!-- 到底了容器-->
      <div :class="['loading-more-container']" v-if="is_show_out">
        <div style="color:#AAAEB8;font-size:.12rem;"> {{ i18n_t("scroll_wrapper.is_footer") }} </div>
      </div>
    </div>
    <!-- <div class="err_box" v-if="MatchMeta.match_mids.length < 1">
       <img class="scroll-title-icon" :src="compute_local_project_file_path('/image/png/no_data_app.png')" alt="">
    </div> -->
    <!-- 回到顶部按钮组件 -->
    <ScrollTop :list_scroll_top="scroll_top" @back-top="goto_top" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue' 
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from  "src/core/menu-h5/menu-data-class.js";
import PageSourceData from "src/core/page-source/page-source.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import VirtualList from "src/core/match-list-h5/match-class/virtual-list.js";
import RouterScroll from "src/core/match-list-h5/match-class/router-scroll.js";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5,compute_local_project_file_path } from "src/output/index.js"
import { menu_type, menu_lv2, is_kemp, is_hot, is_detail, is_results, is_esports, is_collect } from 'src/base-h5/mixin/menu.js'
import { standard_edition } from 'src/base-h5/mixin/userctr.js'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { use_defer_render } from 'src/core/match-list-h5/match-class/match-hooks';
import ScrollTop from "src/base-h5/components/common/record-scroll/scroll-top.vue";
import { no_data_app } from 'src/base-h5/core/utils/local-image.js'
import { compute_css_obj} from 'src/output/index.js'
// 避免定时器每次滚动总是触发
const props = defineProps({
  is_goto_top_random: Number,
})

const route = useRoute()
const defer_render = use_defer_render()
const store_state = store.getState();

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

onMounted(() => {
  test.value = sessionStorage.getItem('wsl') == '9999';
  // 详情页以外的列表才设置最小高度
  if (is_detail.value) list_wrap_height.value = 8;
  emitters.value = {
    emitter: useMittOn(MITT_TYPES.EMIT_MAIN_LIST_MAX_HEIGHT, update_max_height).off,
    emitter_1: useMittOn(MITT_TYPES.EMIT_GOT_TO_TOP, goto_top).off,
  }
})
const get_match_item = (mid) => {
  return MatchDataBaseH5.get_quick_mid_obj(mid)
}
const get_index_f_data_source = (mid) => {
  return lodash.findIndex(MatchMeta.match_mids, { mid });
}

// 赛事列表容器滚动事件
const handler_match_container_scroll = lodash.throttle(($ev) => {
  const scrollTop = lodash.get($ev.target, 'scrollTop', 0)
  scroll_top.value = scrollTop
  const length = lodash.get(MatchMeta.complete_matchs, 'length', 0)
  if (get_is_static() || length < 17) return
  if (scrollTop === 0 || (prev_scroll.value === 0 &&  Math.abs(scrollTop) >= 200) || Math.abs(scrollTop - prev_scroll.value) >= 200) {
    prev_scroll.value = scrollTop
    MatchMeta.compute_page_render_list({ scrollTop: $ev.target.scrollTop, type: 2, is_again: false, merge: 'cover' })
    if (!is_esports.value) get_match_base_hps()
  }
}, 200)

// 获取赔率
const get_match_base_hps = lodash.debounce(() => {
  MatchMeta.get_match_base_hps_by_mids({})
  clearTimeout(scroll_timer.value)
  scroll_timer.value = null
}, 800)

/**
 * @description: 页面滚动事件处理函数
 * @param {Undefined}
 * @return {Undefined} Undefined
 */
const window_scrolling = () => {
  let splited = store_state.matchReducer.list_scroll_top.split('-');
  target_scroll_obj.value = {
    scroll_y: +splited[0],
    client_height: +splited[1],
    scroll_height: +splited[2],
  };

  let now = new Date().getTime();
  // 1向上滑,  -1向下滑,滚动方向
  get_is_show_footer_animate();
  if (now - prev_frame_time < 200) {
    return;
  }
  prev_frame_time = now;
  // 容器的滚动数据
  let scroll_y = null;
  scroll_y = +splited[0]
  clearTimeout(scroll_frame_timer)
  scroll_frame_timer = setTimeout(() => {
    // console.error('屏蔽用户频繁滚动触发事件,  还没触发 更新视图，赛事订阅事件 ===========================================1111111111111');
    // 如果需要对DOM进行多次访问，尽量使用局部变量缓存该DOM   减少回流（Reflow）与重绘（Repaint） 优化
    let xnyouhua = document.documentElement
    let params = {
      position: scroll_y,
      scrollTop: scroll_y,
      clientHeight: xnyouhua.clientHeight,
      scrollHeight: xnyouhua.scrollHeight,
      liebiao_slide: 'liebiao_slide'
    };
    useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_SCROLLING, params);
  }, 500);
}
/**
 * 判断是否显示页脚菜单
 *   1向上滑,  -1向下滑
 */
const get_is_show_footer_animate = () => {
  let top = null;
  top = store_state.matchReducer.list_scroll_top.split('-')[0]
  let scroll_dir = top - prev_frame_poi.value;
  if (scroll_dir > 0) {
    scroll_dir = 1;
  } else if (scroll_dir < 0) {
    scroll_dir = -1;
  }
  store.dispatch({ type: 'matchReducer/set_list_scroll_direction',  payload: scroll_dir })
  prev_frame_poi.value = top;
}
/**
 * @description: 列表回到顶部
 */
const goto_top = () => {
  MatchMeta.set_prev_scroll(0)
  let timer = setTimeout(() => {
    container.value && container.value.scrollTo({ top: 0, behavior: 'smooth' });
    clearTimeout(timer)
    timer = null
  }, 100)
}

// 是否虚拟计算逻辑
const get_is_static = () => {
  return is_kemp.value || is_collect.value || route?.name === 'collect' || MatchResponsive.is_compute_origin.value
}

const is_show_out = computed(() => {
  return max_height && !get_is_static() && VirtualList.container_total_height.value > window.innerHeight
})

const container_total_height = computed(() => {
  return `${VirtualList.container_total_height.value}px`
})

// 计算每个赛事id 对应的 容器高度 top 值
const get_match_top_by_mid1 = (mid) => {
  let r = 0;
  if (mid in VirtualList.mid_top_map) {
    r = VirtualList.mid_top_map[mid];
    r = +r.toFixed(6);
  }
  return r;
}

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
  // background-color: #f5f5f5;
  &.data-get-empty {
    min-height: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  .scroll-i-con {
    width: 100%;
    // height: 10000px;
    position: relative;
    background-repeat: repeat-y;
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