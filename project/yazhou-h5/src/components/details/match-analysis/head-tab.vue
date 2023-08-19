<!--
 * @Author: ledron
 * @Date: 2020-02-16 18:18:18
 * @Description: 详情页 或者 赛果 赛事分析 公共tab 组件
-->
<template>
  <header class="header">
    <div class="flex justify-between align_items home-tab">
      <ul ref="tab_ul_scroller">
        <li
            ref="tab_item"
            v-for="(item,i) in tabList" :key="i" :class="{
            'is-active' : tabIndex == i,
            'remove-margins': +tabList.length - 1 == i,
            'small-right': (get_lang == 'en' || get_lang == 'vi') && get_detail_data.csid == 1,
          }"
            v-show="handle_show_tab(item, i)"
        >
          <div class="tabs-label" ref="label" @click="child_tab_click(item, i, 'is_click', '点击的')"> {{ item.name }}</div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
// import {mapGetters, mapMutations} from "vuex";
import { ref, nextTick, computed, onUnmounted, onMounted } from "vue"
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/"
import utils from "src/core/utils/utils";

  const props = defineProps({
    tabList: {
      type: Array
    }
  })
  const emit = defineEmits(['tab_click'])
  const tabIndex = ref(0)
  const show_tab = ref(true)
  const tab_ul_scroller = ref(null)
  const tab_item = ref(null)
// TODO: 临时用
let get_detail_data = ref({
      mid: '',
      cds: ''
    })
    let get_theme = ref('')
    let get_lang = ref('zh')
    let get_current_menu = ref('')
  onMounted(() => {
    // useMittOn(MITT_TYPES.EMIT_EVENT_DATA, change_show_tab).on
    // 初始化标签选中，足球和篮球在简体中文和繁体中文环境下，下标往后挪动一位,未开赛的赛事，再往后挪动一位
    nextTick(()=> {
      let i = 0
      if (['zh', 'tw'].includes(get_lang.value)) {
        i++
      }
      if (get_detail_data.value.ms != 1) {
        i++
      }
      child_tab_click(props.tabList[0], 0)
    })
  })
  // computed: {
  //   ...mapGetters([
  //     // 详情页的数据
  //     'get_detail_data',
  //     // 主题
  //     'get_theme',
  //     // 当前选中的菜单
  //     "get_current_menu",
  //     // 当前语言
  //     'get_lang'
  //   ])
  // },
    // ...mapMutations([
    //   'set_curr_tab_info',
    // ]),
  const close_analysis = () => {
      // useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false)
    }
  const child_tab_click = (tab, i, type, text) => {
    console.error(tab, i, type, text);
      tabIndex.value = i
      // set_curr_tab_info(tab)
      emit('tab_click',[tab, type]);
      // 滚动目标到屏幕显示区域
      nextTick(()=>{
        // utils.tab_move(i, tab_ul_scroller, tab_item)
      })
    }
  const handle_show_tab = (item, index) => {
      let nedw_show_tab = true
      if (get_detail_data.csid === '1' && _.get(item, 'component') === 'highlights' && !show_tab.value) {
        nedw_show_tab = false
      }
      return nedw_show_tab
    }
  const change_show_tab = (status) => {
      show_tab.value = status
      if (!status) {
        tab_click(tabList.value[1], 1)
      }
    }
  onUnmounted(() => {
    useMittOn(MITT_TYPES.EMIT_EVENT_DATA, change_show_tab).off
  })

</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;

  position: sticky;
  top: 0.82rem;
  width: 100%;
  height: 0.4rem;

  z-index: 100;

  ul {
    list-style: none;
    display: flex;
    position: relative;

    li {
      margin-right: 0.3rem;

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
        .tabs-label {
          font-weight: 700;
          position: relative;

          &:after {
            content: "";
            display: block;
            position: absolute;
            left: 0.01rem;
            bottom: .05rem;
            width: 90%;
            text-align: center;
            height: 0.03rem;
            background-color: var(--q-color-page-bg-color-50);
            border-radius: 0.08rem;
          }
        }
      }

      .tabs-label {
        font-size: 0.14rem;
        border-width: 20px;
        position: relative;
        height: 0.4rem;
        line-height: .4rem;
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
