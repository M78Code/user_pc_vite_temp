<!-- @Description: 下划线跟随移动的tab组件 -->
<template>
  <div class="component tab-wrap fit relative-position" ref="wrap" @mousedown="mousedown" :style="search_style">
    <div class="item-wrap relative-position" ref="item_wrap" :style="{ left: item_wrap_left + 'px' }" :key="key">
      <div class="tab-item yb-flex-center" :class="[{ active: currentIndex == index }, val.class]"
        v-for="(val, index) in list" :key="index" @click.stop="onclick(index, val)" @mouseenter="tabs_enter(index)"
        @mouseleave="tabs_leave(index)" :id="BUILDIN_CONFIG.DOM_ID_SHOW && `top-menu-ids-${val.id}`">
        <!-- BUILDIN_CONFIG.DOM_ID_SHOW 显示部分dom ID -->
        <!-- <img v-if="val.img_src" v-check-img="{ src: val.img_src, default: `/image/common/activity_banner/gift_package.png` }" /> -->
        <div :class="val.class" v-if="val.img_src" class="img" :style="compute_css_obj({ key: 'gift-package' })"></div>
        <!-- {{ i18n_t(val[tab_name_key]) }} -->
        <!-- 早盘||串关 主列表顶部日期后显示赛事数量 -->
        <span v-if="is_list_top_menu" class="match-count">({{ val.count }})</span>

        <template v-if="val.tab_name2||val.name">
          <br />{{ val.tab_name2 ||val.name}}
        </template>
      </div>
      <div class="img" :style="compute_css_obj({ key: 'gift-package' })"></div>
      <template v-if="currentIndex !== -1 && width > 0 && is_show_line">
        <div :class="['line-wrap', { 'pseudo': line_width }]">
          <div class="line" :style="{ transform: 'translateX(' + left + 'px)', width: width + 'px' }"></div>
        </div>
      </template>
    </div>
    <!-- 左右按钮 -->
    <template v-if="is_show_btn">
      <div class="left-btn btn" style="border-top:0px" v-show="left_btn_show && !is_drag" @click="item_wrap_left += 100">
        <div class="yb-icon-arrow"></div>
      </div>
      <div class="right-btn btn" style="border-bottom:0px" v-show="right_btn_show && !is_drag"
        @click="item_wrap_left -= 100">
        <div class="yb-icon-arrow"></div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, defineComponent } from 'vue'
import lodash from 'lodash'
// import BetCommonHelper from "src/core/bet/common-helper/index.js";
import store from 'src/store-redux'
/** utils 工具类 */
// import { get_refs_info } from 'src/core/bet/common-helper/common-sport.js'
import BUILDIN_CONFIG from "app/job/output/env/index.js";
import { compute_css_obj } from 'src/core/server-img/index.js'

import { compute_css_variables } from "src/core/css-var/index.js"

const search_style = ref('')
search_style.value = compute_css_variables({ category: 'component', module: 'header-search' })

const props = defineProps({
  /** tab列表 */
  list: {
    type: Array,
    default: () => [],
  },
  /** 下划线显示 */
  is_show_line: {
    type: Boolean,
    default: false
  },
  /** 左右按钮显示 */
  is_show_btn: {
    type: Boolean,
    default: false
  },
  /** 列表顶部 */
  is_list_top_menu: {
    type: Boolean,
    default: false
  },
  /** item盒子左右padding */
  padding: {
    type: Number,
    default: 15
  },
  /** 当前选中索引 */
  currentIndex: {
    type: Number,
    default: 0
  },
  /** tab展示字段 */
  tab_name_key: {
    type: String,
    default: "tab_name"
  },
  checked: {
    type: Boolean,
    default: true
  },
  /** 是否激活 */
  hasActivity: {
    type: Boolean,
    default: false
  },
  /** 是否可以拖拽 */
  is_drag: {
    type: Boolean,
    default: false
  },
  // 下划线宽度
  line_width: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['onclick'])
/** tab模板文件key */
const key = ref(0)
/** 下划线left */
const left = ref(0)
/** 下划线宽度 */
const width = ref(0)
/** 下划线初始大小 */
const sizes = ref([])
/** item包裹left */
const item_wrap_left = ref(0)
/** item包裹宽度 */
const item_wrap_width = ref(0)
/** 所有item的宽度 */
const item_total_width = ref(0)

/** 鼠标是否按下 */
const is_mousedown = ref(false)

/** 定时器 */
const init_timer = ref(null)
/** 清除定时器函数 */
function clear_init_timer(params) {
  if (init_timer.value) {
    clearTimeout(init_timer.value)
    init_timer.value = null
  }
}
/** 钩子触发 */
onBeforeUnmount(clear_init_timer)
/** 初始化函数 */
function init() {
  clear_init_timer()
  init_timer.value = setTimeout(init_func, 700)
}
/** ref="warp" */
const warp = ref(null)
/** ref="item_wrap" */
const item_wrap = ref(null)
/**
 * @Description:初始化  设置选项初始宽高
 * @return {undefined} undefined
 */
function init_func() {
  let _wrap = warp.value || {}
  let dom = lodash.get(item_wrap.value, 'children', [])
  sizes.value = []
  console.error(dom);
  for (let i = 0; i < dom.length; i++) {
    let { offsetLeft = 0, clientWidth = 0 } = dom[i]
    if (String(dom[i].className).includes('tab-item')) {
      sizes.value.push({
      left: offsetLeft + props.padding,
      width: clientWidth - props.padding * 2
    })
    }
    
  }
  console.log('init_funcinit_funcinit_funcinit_func', sizes.value)
  if (sizes.value.length > 0) {
    let current_index = props.currentIndex == -1 ? 0 : props.currentIndex;
    left.value = lodash.get(sizes.value, `${current_index}.left`, 0)
    width.value = lodash.get(sizes.value, `${current_index}.width`, 0)
    item_wrap_width.value = _wrap.clientWidth
    item_total_width.value = sizes.value[sizes.value.length - 1].left + sizes.value[sizes.value.length - 1].width
  } else {
    width.value = 0
  }
  // 固定下划线宽度
  if (props.line_width) {
    left.value = left.value + (width.value - props.line_width) / 2
    width.value = props.line_width
  }
}

onMounted(() => {
  is_mousedown.value = false
})
/**
 * @Description 鼠标弹起
 * @param {undefined} undefined
*/
function mouseup() {
  if (!props.is_drag) return
  is_mousedown.value = false
}
/**
 * @Description 鼠标移动事件
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
*/
/** 监听 */
onMounted(() => document.addEventListener("mouseup", mouseup))
/** 移除监听 */
onBeforeUnmount(() => document.removeEventListener("mouseup", mouseup))

/**
 * @Description 鼠标移动
 * @param {undefined} undefined
*/
function mousemove(e) {
  if (!props.is_drag || !is_mousedown.value || item_wrap_width.value > item_total_width.value) {
    return
  }
  let left = item_wrap_left.value + (e.clientX - clientX.value)
  if (left > 0) {
    left = 0
  }
  // 最大偏移量
  let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50)
  if (left < max_left) {
    left = max_left
  }
  item_wrap_left.value = left
}
/** 监听 */
onMounted(() => document.addEventListener("mousemove", mousemove))
/** 移除监听 */
onBeforeUnmount(() => document.removeEventListener("mousemove", mousemove))

/** 触发点相对浏览器可视区域左上角距离 */
const clientX = ref(0)
/**
 * @Description 鼠标按下
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
*/
function mousedown(e) {
  clientX.value = e.clientX
  is_mousedown.value = true
}

/** 左边按钮是否显示 */
const left_btn_show = computed(() => item_wrap_left.value < 0)
/** 右边按钮是否显示 */
const right_btn_show = computed(() => item_total_width.value > item_wrap_width.value && item_wrap_left.value > (item_wrap_width.value - item_total_width.value - 50))
/**
 * @Description:切换选项
 * @param {number} index 切换选项的索引
 * @return {undefined} undefined
 */
function onclick(index, item) {
  let num = index - props.currentIndex
  if (!num) return
  if (props.currentIndex > index) {
    if (left_btn_show.value) {
      hand_cilck_move(80 + item_wrap_left.value)
    }
  } else {
    if (right_btn_show.value) {
      hand_cilck_move(-50 + item_wrap_left.value)
    }
  }
  emit('onclick', { index, item })
}
/**
 * @Description: 计算item包裹left
 */
function hand_cilck_move(left) {
  if (!props.is_drag) return
  let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50)
  if (left >= 0) {
    left = 0
  } else if (left < max_left) {
    left = max_left
  }
  item_wrap_left.value = left
}

/**
 * @Description:鼠标移入选项
 * @param {number} index 移入选项的索引
 * @return {undefined} undefined
 */
function tabs_enter(index) {
  tabs_hover(index, 'in')
  
}
/**
 * @Description:鼠标移出选项
 * @param {number} index 移出选项的索引
 * @return {undefined} undefined
 */
function tabs_leave(index) {
  tabs_hover(index, 'out')
}
/**
 * @Description:鼠标移入移出操作
 * @param {number} index 选项的索引
 * @param {string} type  类型 in 移入  out 移出
 * @return {undefined} undefined
 */
const tabs_hover = lodash.debounce((index, type) => {
  // 顶部导航栏的任务中心不展示下划线
  let _index;
  let last_tabitem = props.list[index];
  let activity = props.hasActivity;
  // 如果当前有活动并且当前 index 是最后一个并且当前对象有 path 属性以及 path 值是活动路径，就不展示下划线
  if (activity && (index == sizes.value.length - 1) && last_tabitem.path && last_tabitem.path.indexOf('/activity') != -1) {
    _index = props.currentIndex
  } else {
    _index = index;
  }
  if (type == 'in') {
    if (lodash.get(sizes.value, `[${_index}]`)) {
      left.value = lodash.get(sizes.value, `${_index}.left`)
      width.value = lodash.get(sizes.value, `${_index}.width`)
    }
  }
  if (type == 'out') {
    if (lodash.get(sizes.value, `[${props.currentIndex}]`)) {
      left.value = lodash.get(sizes.value, `${props.currentIndex}.left`)
      width.value = lodash.get(sizes.value, `${props.currentIndex}.width`)
    }
  }
  // 固定下划线宽度
  if (props.line_width) {
    left.value = left.value + (width.value - props.line_width) / 2
    width.value = props.line_width
  }
}, 100)
/** 取消防抖 */
onBeforeUnmount(() => tabs_hover.cancel())

/** stroe仓库 */
const { layoutReducer } = store.getState()
/** 页面宽高信息 */
// const layout_list_size = ref(layoutReducer.layout_list_size)

/** 监听屏幕宽度改变  设置是否显示按钮 */
// watch(
//   () => layout_list_size.value,
//   () => wrap.value.clientWidth
// )
/**
 * list语言变化时
 * 做异步处理防止data数据发生改变，初始化
*/
watch(
  () => props.list.value,
  () => nextTick(init), { deep: true }
)

/** 定时器 */
let timer = null
/** 清除定时器 */
function clear_timer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  };
}
/** 钩子触发 */
onBeforeUnmount(clear_timer)
/** 监听选中改变 */
watch(
  () => props.currentIndex,
  () => {
    clear_timer()
    timer = setTimeout(() => {

      if (!sizes.value[props.currentIndex]) return
      left.value = lodash.get(sizes.value, `${props.currentIndex}.left`)
      width.value = lodash.get(sizes.value, `${props.currentIndex}.width`)
      // 固定下划线宽度
      if (props.line_width) {
        left.value = left.value + (width.value - props.line_width) / 2
        width.value = props.line_width
      }
    })
  },
  {
    immediate: true
  }
)

/**
 * @Description:更新dom数据 解决选项数组改变  dom不更新
 * @return {undefined} undefined
 */
function update_tab_key() {
  key.value++
  nextTick(init)
}
onMounted(update_tab_key)

</script>


<script>
export default defineComponent({
    name: 'tab',
})
</script>

<style lang="scss" scoped>
@import './tab.scss';
.tab-wrap {
  overflow: hidden;

  .item-wrap {
    position: absolute;
    top: 0;
    width: 1000px;
    display: flex;
    height: 100%;
    z-index: 99;
    align-items: center;

    .tab-item {
      cursor: pointer;
      padding: 0 15px;
      text-align: center;
      flex-shrink: 0;
      height: 24px;
      line-height: 24px;
      border-radius: 15px;
      color: var(--q-gb-t-c-5);
      &.active {
        font-weight: 600;
        line-height: 24px;
        border: none !important;
      }

      .match-count {
        opacity: 0.7;
      }
    }

    .line-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 3px;

      .line {
        position: relative;
        width: 30px;
        height: 100%;
        transition: all 0.3s;
        z-index: 10;
        background-color: var(--q-site-header-color-3) !important;
      }

      &.pseudo {
        .line {

          &::before,
          &::after {
            display: none;
          }
        }
      }
    }
  }

  /** 左右切换按钮 -S*/
  .btn {
    height: 98%;
    position: absolute;
    top: 0;
    width: 38px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .left-btn {
    left: 0;
    transform: rotate(180deg);
  }

  .right-btn {
    right: 0;
  }

  /** 左右切换按钮 -E*/
}

.leagues-bg {
  .tab-wrap {
    .item-wrap {
      .line-wrap {
        bottom: 4px !important;
      }
    }
  }
}
</style>
