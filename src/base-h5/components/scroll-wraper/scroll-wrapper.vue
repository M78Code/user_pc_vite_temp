<!--
 * @Author:
 * @Date:
 * @Description: 滚动操作处理
-->

<template>
  <div class="scroll-wrapper">
    <div style="display: none;">{{ MatchDataBaseH5.data_version.version }}</div>
    <div :class="['scroll-i-con', {high_scrolling: set_ishigh_scrolling && menu_type !== 100 &&
       !(menu_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.mi)) && menu_type != 100,
        detail_list: main_source == 'detail_match_list',
        simple: PageSourceData.newer_standard_edition == 1,
      }]"
      :style="{ 'min-height': `${menu_type == 100 ? list_wrap_height : match_list_wrapper_height}rem` }">
      <template v-for="(match_mid, index) in MatchMeta.match_mids">
        <div v-if="match_mid" :index="index" :key="match_mid" 
          :class="['s-w-item', { static: is_static_item, last: index == match_mids.length - 1 }]" 
          :style="{ transform: `translateY(${is_static_item ? 0 : get_match_top_by_mid(match_mid)}rem)`, zIndex: `${200 - index}` }">
          <!-- 调试用 -->
          <div v-if="test" class="debug-head data_mid" :data-mid="match_mid" :class="{ first: index === 0 }">
            <span> {{ get_index_f_data_source(match_mid) + '-' + index }} </span>
            <span> key={{match_mid }}-----{{ match_mid }}-{{ 'mid: ' + match_mid }}
              <span> {{ get_match_top_by_mid(match_mid) ? "-" + get_match_top_by_mid(match_mid) : 'none!' }} </span>
              <span>ms: {{ match_item?.ms }}</span>
            </span>
          </div>
          <!-- 真是渲染信息 -->
          <div class="s-w-i-inner">
            <slot :match_item="get_match_item(match_mid)" :mid="match_mid" :index="index"></slot>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue' 
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import MenuData from  "src/core/menu-h5/menu-data-class.js";
import PageSourceData from "src/core/page-source/page-source.js";
import MatchMeta from "src/core/match-list-h5/match-class/match-meta.js";
import RouterScroll from "src/core/match-list-h5/match-class/router-scroll.js";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'
import { menu_type, menu_lv2, is_kemp } from 'src/base-h5/mixin/menu.js'

// 避免定时器每次滚动总是触发
const props = defineProps({
  match_list_wrapper_height: Number,
  is_goto_top_random: Number,
  main_source: String,
})

const store_state = store.getState();
// 调试信息
let test = ref('')
let prev_frame_time = ref(0)
//滚动中上一帧的scroll top
let prev_frame_poi = ref(0)
let list_wrap_height = ref(0)
let target_scroll_obj = ref(null)
let scroll_frame_timer = null
// 赛事mids
const match_mids = ref([])

onMounted(() => {
  // setTimeout(() => {
  //   match_mids.value = MatchMeta.match_mids
  // }, 3000)
  test.value = sessionStorage.getItem('wsl') == '9999';
  // 详情页以外的列表才设置最小高度
  if (props.main_source !== 'detail_match_list') {
    list_wrap_height.value = 8;
  }
})
// 监听 数据仓库版本号改变
watch(() => MatchDataBaseH5.data_version.version, () => {
  // match_mids.value = MatchMeta.match_mids
})

const get_match_item = (mid) => {
  return MatchDataBaseH5.get_quick_mid_obj(mid)
}

const get_index_f_data_source = (mid) => {
  return lodash.findIndex(match_mids.value, { mid });
}

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
  let scroll_top = null;
  scroll_top = store_state.matchReducer.list_scroll_top.split('-')[0]
  let scroll_dir = scroll_top - prev_frame_poi.value;
  if (scroll_dir > 0) {
    scroll_dir = 1;
  } else if (scroll_dir < 0) {
    scroll_dir = -1;
  }
  store.dispatch({ type: 'matchReducer/set_list_scroll_direction',  payload: scroll_dir })
  prev_frame_poi.value = scroll_top;
}
/**
 * @description: 列表回到顶部
 * @param {String} is_user
 * @return {Undefined} Undefined
 */
const goto_top = () => {
  RouterScroll.scroll_list_wrapper_by(0);
}
// 计算每个赛事id 对应的 容器高度 top 值
const get_match_top_by_mid = (mid) => {
  let r = 0;
  if (mid in store_state.matchReducer.match_top_map_dict) {
    r = store_state.matchReducer.match_top_map_dict[mid];
    r = +r.toFixed(6);
  }
  return r;
}

watch(() => props.is_goto_top_random, () => {
  //回到顶部
  goto_top();
})
// ...mapGetters([
//   'store_state.matchReducer.list_scroll_top',
// ]),
// 设置是否快速滚动显示骨架屏背景
const set_ishigh_scrolling = computed(() => {
  // 滚动过程中，是否显示  骨架屏背景图片
  let flag = false;
  if (["home_hot_page_schedule"].includes(props.main_source) || (MatchMeta.match_mids && MatchMeta.match_mids <= 0)) {
    flag = false;
  } else {
    flag = get_to_bottom_space > 350 && !is_kemp.value
    // 一般热门推荐赛事长度为4，详情页内需过滤掉
    if (props.main_source !== 'detail_match_list' && lodash.get(target_scroll_obj.value, 'scroll_height') > 1800) {
      flag = true
    }
  }
  return flag
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
// || ["detail_match_list", "home_hot_page_schedule"].includes(props.main_source) 
const is_static_item = computed(() => {
  let flag = false;
  if (menu_type == 100 ||  menu_lv2.value?.mi == 100 ||
    (menu_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(menu_lv2.value?.mi))
  ) {
    flag = true;
  }
  if (MenuData.hot_tab_menu.menuName) flag = false;
  return !flag;
})

// 触发本组件销毁之前回调
onUnmounted(() => {
  clearTimeout(scroll_frame_timer);
  scroll_frame_timer = null;
})
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  width: 100%;
  height: auto;
  background-color: #f5f5f5;
  &.data-get-empty {
    min-height: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  .scroll-i-con {
    width: 100%;
    height: auto;
    position: relative;
    background-repeat: repeat-y;
    margin-top: .03rem;
    &.high_scrolling {
      background-size: contain;
      background-image: var(--q-color-com-img-bg-126);
      &.simple {
        background-image: var(--q-color-com-img-bg-127);
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
      padding-bottom: 0.015rem;
      &.last{
        padding-bottom: 0.01rem;
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
  }
  .loading-more-container {
    width: 100%;
    height: 1.81rem;
    padding: 0.88rem 0 0.6rem 0;
    text-align: center;
    bottom: -2rem;
    position: absolute;
    left: 0;
    &.static {
      position: static;
    }
    .loading {
      margin-top: 0.08rem;
    }
    .loading-static-animation {
      width: 0.21rem;
      height: 0.21rem;
    }
  }
}
</style>
