<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 复刻版app tab 组件
-->
<template>
  <header class="header">
    <div class="flex justify-between align_items home-tab">
      <ul ref="tab_ul_scroller" style="scroll-behavior: smooth;">
        <li
          ref="tab_item"
          v-for="(item, i) in tabList"
          :key="i"
          :class="{
            'is-active': tabIndex == i,
            'remove-margins': +tabList.length - 1 == i,
            'small-right':
              (UserCtr.lang == 'en' || UserCtr.lang == 'vi') &&
              detail_data.csid == 1,
          }"
          v-show="handle_show_tab(item, i)"
        >
          <div
            class="tabs-label"
            ref="label"
            @click="child_tab_click(item, i, 'is_click')"
          >
            {{ item.name }}
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
// import {mapGetters, mapMutations} from "vuex";
import { ref, nextTick, computed, onUnmounted, onMounted, inject } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import lodash from "lodash";
import TabMove from "src/core/tab-move/tab-move.js";

const props = defineProps({
  tabList: {
    type: Array,
    default: () => [],
  },
  detail_data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["tab_click"]);
const tabIndex = ref(0);
const show_tab = ref(true);
const tab_ul_scroller = ref(null);
const tab_item = ref(null);

const offset = window.screen.availWidth/2
function tabMove(index){
  /** @type {HTMLElement} */ const scrollDom = tab_ul_scroller.value
  /** @type {HTMLElement} */ const activeItem = scrollDom.children[index]
  scrollDom.scrollTo(activeItem.offsetLeft - offset + activeItem.offsetWidth/2,0)
}
onMounted(() => {
  // 初始化标签选中，足球和篮球在简体中文和繁体中文环境下，下标往后挪动一位,未开赛的赛事，再往后挪动一位
  nextTick(() => {
    let i = 0;
    if (["zh", "tw"].includes(UserCtr.lang)) {
      i++;
    }
    if (props.detail_data.ms != 1) {
      i++;
    }
    child_tab_click(props.tabList[0], 0);
  });
});

const close_analysis = () => {
  useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false);
};
const child_tab_click = (tab, i, type, text) => {
  tabIndex.value = i;
  // set_curr_tab_info(tab)
  emit("tab_click", [tab, type]);
  // 滚动目标到屏幕显示区域
  // nextTick(() => {
  //   TabMove.tab_move(i, tab_ul_scroller, tab_item);
  // });
  tabMove(i)
};
const handle_show_tab = (item, index) => {
  let nedw_show_tab = true;
  if (
    props.detail_data.csid === "1" &&
    props.detail_data.ms == 0 &&
    lodash.get(item, "component") === "highlights" &&
    !show_tab.value
  ) {
    nedw_show_tab = false;
  }
  return nedw_show_tab;
};
const change_show_tab = (status) => {
  show_tab.value = status;
  if (!status) {
    tab_click(tabList.value[1], 1);
  }
};
let { off } = useMittOn(MITT_TYPES.EMIT_EVENT_DATA, change_show_tab);
onUnmounted(() => {
  off();
});
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--q-analysis-bd-color-3);
  //background: var(--q-gb-bg-c-21);
  background: var(--q-gb-bg-c-23);
  position: sticky;
  top: 0.82rem;
  width: 100%;
  height: 0.44rem;
  box-sizing: border-box;

  z-index: 100;

  ul {
    list-style: none;
    display: flex;
    position: relative;

    li {
      // margin-right: 0.3rem;
      box-sizing: border-box;
      border-radius: 0.2rem;
      padding: 0 0.12rem;
      // background-color: aqua;
      box-sizing: border-box;
      height: 0.3rem;
      line-height: 0.3rem;
      &.small-right {
        margin-right: 0.15rem;
      }

      &:last-child {
        margin-right: unset;
      }

      &.remove-margins {
        margin-right: unset;
      }

      &.is-active {
        // border-radius: 0.2rem;
        // padding: 0.06rem 0.24rem;
        background-color: var(--q-gb-bg-c-31);
        .tabs-label {
        font-size: 0.14rem;
        color: var(--q-gb-t-c-1);
        font-weight: bold;
      }
        // box-sizing: border-box;
        //       .tabs-label {
        //         font-weight: 700;
        //         position: relative;
        // color: var(--q-gb-t-c-18);

        //         // color: var(--q-gb-bg-c-13);
        //         &:after {
        //           content: "";
        //           display: block;
        //           position: absolute;
        //           left: 0.01rem;
        //           bottom: .05rem;
        //           width: 90%;
        //           text-align: center;
        //           height: 0.03rem;
        //           background-color: var(--q-gb-bg-c-13);
        //           border-radius: 0.08rem;
        //         }
        //       }
      }

      .tabs-label {
        font-size: 0.14rem;
        color: var(--q-gb-t-c-19);
      }
    }
  }

  .close {
    position: absolute;
    right: 0.2rem;
    top: 0.15rem;
    font-size: 14px;

    text-align: center;
  }
}
</style>

