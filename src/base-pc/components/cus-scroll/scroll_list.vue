<!--
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 自定义列表滚动区域
-->
<template>
  <div class="v-scroll-list relative-position">
    <!-- 滚动区域 -->
    <div
      class="list-scrollbar router_scroll_layout"
      ref="area_ref"
      @scroll="on_scroll"
    >
      <div class="v-scroll-content relative-position">
        <slot name="before"></slot>
        <slot></slot>
        <div :class="{ 'none-thumb': !has_thumb }" ref="after">
          <slot name="after"></slot>
        </div>
        <resize-observer v-if="is_mounted" @resize="scroll_height_change" />
      </div>
    </div>
  </div>
</template>
<script setup>
import resizeObserver from "src/base-pc/components/match-results/resize-observer/resize-observer.vue"
// import {mapGetters,mapActions} from 'vuex'
// import { store } from "src/store/index.js"
import { onMounted, onUnmounted, ref} from "vue";
import { useMittEmit, MITT_TYPES, useMittOn } from "src/core/mitt";
import MatchListCard from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListScrollClass from 'src/core/match-list-pc/match-scroll.js'
const props = defineProps({
  // 吸顶高度
  sticky_height: {
    type: Number,
    default: 0,
  },
});
// 是否显示mid
const test = ref(sessionStorage.getItem("wsl"));
// 加载的赛事索引
const load_match_index = ref(50);
// 底部空盒子高度
const empty_height = ref(sessionStorage.getItem("wsl"));
// 组件是否加载完成
const is_mounted = ref(false);
//是否有滚动条
const has_thumb = ref(false);
// 滚动条位置
const thumb_top = ref(0);
// 滚动内容高度
const scrollHeight = ref(0);

const area_height = ref(0);
const is_bootom_height = ref(0);

const area_ref = ref(null)
let mitt_list = [];


/**
 * @Description 设置滚动条位置
 * @param {number} top 滚动条top值
 * @param {string} type default：直接修改  inc：递增 dec：递减
 * @param {undefined} undefined
 */
 const set_scrollTop = (top, type) => {
  if (!area_ref.value) return;
  if (type == "inc") {
    area_ref.value.scrollTop += top;
  } else if (type == "dec") {
    area_ref.value.scrollTop -= top;
  } else {
    area_ref.value.scrollTop = top;
  }
};
defineExpose({set_scrollTop})

// 设置列表滚动条位置
onUnmounted(() => {
  // 设置列表滚动条位置
  mitt_list.forEach(i=>i())
  MatchListScrollClass.clear_show_mid()
  // this.debounce_throttle_cancel(this.on_bootom);
  // this.debounce_throttle_cancel(this.emit_on_scroll);
  // this.debounce_throttle_cancel(this.update_list_card_offset);
});
onMounted(() => {
  area_height.value = area_ref.value.offsetHeight;
  is_mounted.value = true;
  // 设置列表滚动条位置
  mitt_list = [
    useMittOn(MITT_TYPES.EMIT_SET_MATCH_LIST_SCROLL_TOP, set_scrollTop).off,
  ]
  // let { status, height } = this.get_retain_scroll_obj;
  // if (status) {
  //   nextTick(() => {
  //     set_scrollTop(height);
  //     this.set_retain_scroll_obj({ status: false, height: 0 });
  //   });
  // }
});
// computed:{
//   ...mapGetters({
//    //获取当前主题
//     get_theme: "get_theme",
//     //获取保存的滚动高度
//     get_retain_scroll_obj: "get_retain_scroll_obj",
//     }),
// },
// ...mapActions({
//   //设置保存的滚动高度
//     set_retain_scroll_obj:"set_retain_scroll_obj"
//   }),

/**
 * @Description 滚动到底部
 * @param {undefined} undefined
 */
const on_bootom = lodash.debounce(() => {
  load_match_index.value = load_match_index.value + 20;
}, 300);

/**
 * @Description 列表滚动事件
 * @param {number}
 */
 const emit_on_scroll = lodash.throttle(() => {
  // useMittEmit(MITT_TYPES.EMIT_LIST_ON_SCROLL);
}, 3000);
/**
 * @Description 更新列表卡片偏移量
 * @param {undefined} undefined
 */
 const update_list_card_offset = (e) => {
  MatchListScrollClass.set_scroll_top(e);
  MatchListCard.set_card_show_level();
};
/**
 * @Description 滚动条滚动事件
 * @param {object} e 滚动事件
 * @param {undefined} undefined
 */
const on_scroll = (e) => {
  let scrollTop = e.target.scrollTop;
  if (scrollTop > is_bootom_height.value) {
    on_bootom();
  }
  emit_on_scroll();
  // 设置列表滚动条scrollTop
  MatchListScrollClass.set_scroll_top(scrollTop);
  // 更新列表卡片偏移量
  update_list_card_offset(scrollTop);
};


/**
 * @Description 滚动高度改变事件(容器高度变化回调函数)
 * @param {undefined} undefined
 */
const scroll_height_change = () => {
  scrollHeight.value = area_ref.value.scrollHeight;
  is_bootom_height.value = scrollHeight.value - area_height.value - 500;
  has_thumb.value = scrollHeight.value > area_height.value;
};

/**
 * @Description 设置滚动条位置 兼容 q-scroll-area
 * @param {undefined} undefined
 */
const setScrollPosition = (top) => {
  set_scrollTop(top);
};


</script>
<style lang="scss" scoped>
.v-scroll-list {
  width: 100%;
  height: 100%;
  .list-scrollbar {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 3px;
    scrollbar-width: thin; /* 火狐滚动条无法自定义宽度，只能通过此属性使滚动条宽度变细 */
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
    }
  }
}

/*  滚动条样式 */
.q-scrollarea__bar {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
.q-scrollarea__thumb {
  position: absolute;
  right: 0;
  min-width: 5px;
  cursor: pointer;
  opacity: 1;
  z-index: 300;
}
.test {
  position: absolute;
  color: red;
  font-size: 14px;
  z-index: 999999;
  left: 0;
  bottom: 0;
  user-select: text;
}
</style>