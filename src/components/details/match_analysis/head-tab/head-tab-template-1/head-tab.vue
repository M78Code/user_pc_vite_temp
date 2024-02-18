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
          <div class="tabs-label" ref="label" @click="tab_click(item, i, 'is_click')"> {{ item.name }}</div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "head_tab",
  props:{
    tabList: Array
  },
  data() {
    return {
      tabIndex: 0,
      show_tab: true,
    }
  },
  mounted() {
    this.useMittOn(MITT_TYPES.EVENT_DATA, this.change_show_tab)
    // 初始化标签选中，足球和篮球在简体中文和繁体中文环境下，下标往后挪动一位,未开赛的赛事，再往后挪动一位
    nextTick(()=> {
      let i = 0
      if (['zh', 'tw', 'hk'].includes(this.get_lang)) {
        i++
      }
      if (this.get_detail_data.ms != 1) {
        i++
      }
      this.tab_click(this.tabList[0], 0)
    })
  },
  computed: {
    ...mapGetters([
      // 详情页的数据
      'get_detail_data',
      // 主题
      'get_theme',
      // 当前选中的菜单
      "get_current_menu",
      // 当前语言
      'get_lang'
    ])
  },
  methods: {
    ...mapMutations([
      'set_curr_tab_info',
    ]),
    close_analysis() {
      useMittEmit(MITT_TYPES.EMIT_ANA_SHOW, false)
    },
    tab_click(tab, i, type) {
      this.tabIndex = i
      this.set_curr_tab_info(tab)
      this.$emit('tab_click',[tab, type]);
      // 滚动目标到屏幕显示区域
      nextTick(()=>{
        this.$tab_move(i, this.$refs.tab_ul_scroller, this.$refs.tab_item)
      })
    },
    handle_show_tab(item, index) {
      let show_tab = true
      if (this.get_detail_data.csid === '1' && _.get(item, 'component') === 'highlights' && !this.show_tab) {
        show_tab = false
      }
      return show_tab
    },
    change_show_tab(status) {
      this.show_tab = status
      if (!status) {
        this.tab_click(this.tabList[1], 1)
      }
    }
  },
  beforeUnmount() {
    useMittOn(MITT_TYPES.EVENT_DATA, this.change_show_tab)
  }
}
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
            background-color: var(--q-gb-bd-c-13);
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
