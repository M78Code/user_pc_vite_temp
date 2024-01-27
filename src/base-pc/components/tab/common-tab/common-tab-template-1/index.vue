<template>
  <div class="component tab-wrap fit relative-position" ref="wrap" @mousedown="mousedown">
    <div
      class="item-wrap relative-position"
      ref="item_wrap"
      style="color: #ffffff;"
      :key="key"
    >
    <!-- :style="{ left: item_wrap_left + 'px' }" -->

      <div
        class="tab-item yb-flex-center"
        :class="[{ active: currentIndex == index }, val.class]"
        v-for="(val, index) in list"
        :key="index"
        @click.stop="onclick(index, val)"
        @mouseenter="tabs_enter(index)"
        @mouseleave="tabs_leave(index)"
        :id="DOM_ID_SHOW && `top-menu-ids-${val.id}`"
      >
        <img
          v-if="val.img_src"
          v-check-img="{
            src: val.img_src,
            default: `/image/common/activity_banner/gift_package.png`,
          }"
        />
        {{ val[tab_name_key] }}
        <!-- 早盘||串关 主列表顶部日期后显示赛事数量 -->
        <span v-if="is_list_top_menu" class="match-count"
          >({{ val.count }})</span
        >
        <template v-if="val.tab_name2"> <br />{{ val.tab_name2 }} </template>
      </div>
      <template v-if="currentIndex !== -1 && width > 0 && is_show_line">
        <div :class="['line-wrap', { pseudo: line_width }]">
          <div
            class="line"
            :style="{
              transform: 'translateX(' + left + 'px)',
              width: width + 'px',
            }"
          ></div>
        </div>
      </template>
    </div>
    <!-- 左右按钮 -->
    <template v-if="is_show_btn">
      <div
        class="left-btn btn"
        v-show="left_btn_show && !is_drag"
        @click="item_wrap_left += 100"
      >
        <div class="yb-icon-arrow"></div>
      </div>
      <div
        class="right-btn btn"
        v-show="right_btn_show && !is_drag"
        @click="item_wrap_left -= 100"
      >
        <div class="yb-icon-arrow"></div>
      </div>
    </template>
  </div>
</template>

<script setup>

import {
  defineComponent,
  nextTick,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import lodash from "lodash";
// import store from "src/store-redux/index.js";
//-------------------- 对接参数 prop 注册  开始  --------------------
import { useRegistPropsHelper } from "src/composables/regist-props/index.js";
import { component_symbol, need_register_props } from "../config/index.js";
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const props = defineProps({
  //tab列表
  list: {
    type: Array,
    default: () => [],
  },
  //下划线显示
  is_show_line: {
    type: Boolean,
    default: () => false,
  },
  //左右按钮显示
  is_show_btn: {
    type: Boolean,
    default: () => false,
  },
  //列表顶部
  is_list_top_menu: {
    type: Boolean,
    default: () => false,
  },
  //item盒子左右padding
  padding: {
    type: Number,
    default: () => 15,
  },
  //当前选中索引
  currentIndex: {
    type: Number,
    default: () => 0,
  },
  tab_name_key: {
    type: String,
    default: () => "tab_name",
  },
  checked: {
    type: Boolean,
    default: () => true,
  },
  hasActivity: {
    type: Boolean,
    default: () => true,
  },
  is_drag: {
    type: Boolean,
    default: () => true,
  },
  line_width: {
    type: Number,
    default: () => null,
  },
});
//-------------------- 对接参数 prop 注册  结束  --------------------
const last_left = ref("");
const key = ref(0); //tab模板文件key
const left = ref(0); //下划线left
const width = ref(0); //下划线宽度
const sizes = ref([]); //下划线初始大小
const item_wrap_left = ref(0); //item包裹left
const item_wrap_width = ref(0); //item包裹宽度
const item_total_width = ref(0); //所有item的宽度
const timer = ref(null); //定时器
const init_timer = ref(null); //定时器
const wrap = ref(null); //获取组件实例
const item_wrap = ref(null); //获取组件实例
const emit = defineEmits(["onclick"]);
// 显示部分dom ID
const DOM_ID_SHOW = BUILDIN_CONFIG.DOM_ID_SHOW;
// 鼠标是否按下
const is_mousedown = ref(false);
const clientX = ref("");

/**
 * @Description 鼠标移动事件
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
 */
 const mousemove = (e) => {
  if (!is_mousedown.value || item_wrap_width.value > item_total_width.value) {
    return;
  }
  let left = last_left.value + (e.clientX - clientX.value);
  if (left > 0) {
    left = 0;
  }
  // 最大偏移量
  let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50);
  if (left < max_left) {
    left = max_left;
  }
  item_wrap_left.value = left;
};

/**
 * @Description 鼠标弹起
 * @param {undefined} undefined
 */
 const mouseup = () => {
  is_mousedown.value = false;
};

// 鼠标事件监听
if (props.is_drag) {
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}

// 获取页面宽高信息 --可以废弃，废弃改动较大
const get_layout_list_size = ref({});

/**
 * @Description:左边按钮是否显示
 * @return {boolean}
 */
const left_btn_show = computed(() => {
  return item_wrap_left.value < 0;
});

/**
 * @Description:右边按钮是否显示
 * @return {boolean}
 */
const right_btn_show = computed(() => {
  let total_up = item_total_width.value > item_wrap_width.value;
  let wrap_left_up =
    item_wrap_left.value > item_wrap_width.value - item_total_width.value - 50;
  return total_up && wrap_left_up;
});

/**
 * @Description:切换选项
 * @param {number} index 切换选项的索引
 * @return {undefined} undefined
 */
const onclick = (index, item) => {
  try {
     //展开右侧详情
    //  LayOutMain_pc.set_unfold_multi_column(false)
  } catch (error) {
    console.error(error);
  }
  // return
  let num = index - props.currentIndex;
  if (!num) return;
  if (props.currentIndex > index) {
    if (left_btn_show) {
      hand_cilck_move(80 + item_wrap_left.value);
    }
  } else {
    if (right_btn_show) {
      hand_cilck_move(-50 + item_wrap_left.value);
    }
  }
  emit("onclick", { index, item });
};

const hand_cilck_move = (left) => {
  if (!props.is_drag) return;
  let max_left = 0 - (item_total_width.value - item_wrap_width.value + 50);
  if (left >= 0) {
    left = 0;
  } else if (left < max_left) {
    left = max_left;
  }
  item_wrap_left.value = left;
};

/**
 * @Description:鼠标移入选项
 * @param {number} index 移入选项的索引
 * @return {undefined} undefined
 */
const tabs_enter = (index) => {
  tabs_hover(index, "in");
};

/**
 * @Description:鼠标移出选项
 * @param {number} index 移出选项的索引
 * @return {undefined} undefined
 */
const tabs_leave = (index) => {
  tabs_hover(index, "out");
};

/**
 * @Description:鼠标移入移出操作
 * @param {number} index 选项的索引
 * @param {string} type  类型 in 移入  out 移出
 * @return {undefined} undefined
 */
const tabs_hover = (index, type) => {
  // 顶部导航栏的任务中心不展示下划线
  let _index;
  let last_tabitem = props.list[index];
  let activity = props.hasActivity;
  // 如果当前有活动并且当前 index 是最后一个并且当前对象有 path 属性以及 path 值是活动路径，就不展示下划线
  if (
    activity &&
    index == sizes.value.length - 1 &&
    last_tabitem.path &&
    last_tabitem.path.indexOf("/activity") != -1
  ) {
    _index = props.currentIndex;
  } else {
    _index = index;
  }
  // path 值是活动路径，就不展示下划线
  if (last_tabitem.path && last_tabitem.path.indexOf("/activity") != -1) {
    _index = props.currentIndex;
  }
  if (type == "in") {
    if (lodash.get(sizes.value, `[${_index}]`)) {
      left.value = lodash.get(sizes.value, `${_index}.left`);
      width.value = lodash.get(sizes.value, `${_index}.width`);
    }
  }
  if (type == "out") {
    if (lodash.get(sizes.value, `[${props.currentIndex}]`)) {
      left.value = lodash.get(sizes.value, `${props.currentIndex}.left`);
      width.value = lodash.get(sizes.value, `${props.currentIndex}.width`);
    }
  }
  // 固定下划线宽度
  if (props.line_width) {
    left.value = left.value + (width.value - props.line_width) / 2;
    width.value = props.line_width;
  }
};

const init = () => {
  if (init_timer.value) {
    clearTimeout(init_timer.value);
  }
  init_timer.value = setTimeout(init_func, 300);
};

/**
 * @Description:初始化  设置选项初始宽高
 * @return {undefined} undefined
 */
const init_func = () => {
  let _wrap = wrap.value;
  let dom = lodash.get(item_wrap.value, "children", []);
  sizes.value = [];
  for (let i = 0; i < dom.length; i++) {
    let { offsetLeft = 0, clientWidth = 0 } = dom[i];
    sizes.value.push({
      left: offsetLeft + props.padding,
      width: clientWidth - props.padding * 2,
    });
  }
  if (sizes.value.length > 0) {
    let current_index = props.currentIndex == -1 ? 0 : props.currentIndex;
    left.value = lodash.get(sizes.value, `${current_index}.left`, 0);
    width.value = lodash.get(sizes.value, `${current_index}.width`, 0);
    item_wrap_width.value = _wrap.clientWidth;
    item_total_width.value =
      sizes.value[sizes.value.length - 1].left +
      sizes.value[sizes.value.length - 1].width;
  } else {
    width.value = 0;
  }
  // 固定下划线宽度
  if (props.line_width) {
    left.value = left.value + (width.value - props.line_width) / 2;
    width.value = props.line_width;
  }
};

/**
 * @Description:更新dom数据 解决选项数组改变  dom不更新
 * @return {undefined} undefined
 */
const update_tab_key = () => {
  key.value = key.value++;
  nextTick(() => {
    init();
  });
};

/**
 * @Description 鼠标按下
 * @param {object} e 鼠标事件
 * @param {undefined} undefined
 */
const mousedown = (e) => {
  clientX.value = e.clientX;
  last_left.value = item_wrap_left.value;
  is_mousedown.value = true;
};





//监听屏幕宽度改变  设置是否显示按钮
// TODO

//监听list长度发生改变
// watch(props.list.length, () => {
//   // 做异步处理防止data数据发生改变
//   nextTick(() => {
//     init();
//   });
// });

//监听list长度发生改变
// watch(props.list[0], () => {
//   // 做异步处理防止data数据发生改变
//   nextTick(() => {
//     init();
//   });
// });

//监听选中改变
// watch(
//   () => props.currentIndex,
//   () => {
//     if (timer.value) {
//       clearTimeout(timer.value);
//       timer.value = null;
//     }
//     timer.value = setTimeout(() => {
//       if (!sizes.value[props.currentIndex]) return;
//       left.value = lodash.get(sizes.value, `${props.currentIndex}.left`);
//       width.value = lodash.get(sizes.value, `${props.currentIndex}.width`);
//       // 固定下划线宽度
//       if (props.line_width) {
//         left.value = left.value + (width.value - props.line_width) / 2;
//         width.value = props.line_width;
//       }
//     });
//   },
//   { immediate: true }
// );
const debounce_throttle_cancel = (fun) => {
  if (fun && fun.cancel && typeof fun.cancel == "function") {
    fun.cancel();
  }
};
let tabs_hover_ = ''
onMounted(() => {
  // 给 tabs 加上防抖
  tabs_hover_ = lodash.debounce(tabs_hover, 100);
  nextTick(() => {
    init();
  });
});

onBeforeUnmount(() => {
  debounce_throttle_cancel(tabs_hover_);
  if (timer.value) {
    clearTimeout(timer.value);
  }
  if (init_timer.value) {
    clearTimeout(init_timer.value);
  }
  // 鼠标事件取消监听
  if (props.is_drag) {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  }
});
</script>

<style lang="scss" scoped>
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
    height: 100%;
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