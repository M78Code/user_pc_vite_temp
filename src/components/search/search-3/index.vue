<!-- @Description: 搜索弹层 -->

<template>
   <div style="display:none">{{SearchPCClass.update_time}}</div>
   <div
    v-if="SearchPCClass.search_isShow"
    class="search-position"
    :style="{ right: `${search_width}px`, paddingRight: `${is_iframe ? 10 : 14}px`} "
    :class="{ 'hide-search': store.show_type == 'none', 'mini': main_menu_toggle == 'mini', 'iframe': is_iframe }"
    >
    <div
      v-if="SearchPCClass.search_isShow"
      class="serach-wrap column"
    >
      <search-input />
      <!-- 遮罩层样式.bottom-wrap -->
      <div class="bottom-wrap col search-result relative-position" :style="page_style">
        <!-- 球类导航 -->
        <div
          class="sports-tab"
          @click.stop
        >
          <tab
            :list="store.sports_list"
            :is_show_line="true"
            :is_show_btn="true"
            tab_name_key="sportName"
            :padding="10"
            @onclick="sportHandle"
            :currentIndex="store.sports_tab_index"
            ref="tab"
          />
        </div>
        <!-- 初始化 -->
        <search-int
          class="serach-background"
          v-show="store.show_type == 'init'"
        />
        <!-- 搜球类 -->
        <search-sports
          class="serach-background"
          v-show="store.show_type == 'sports'"
          ref="sports"
        />
        <!-- 搜玩法 -->
        <search-play
          class="serach-background"
          v-show="store.show_type == 'play'"
        />
        <!-- 搜索结果 -->
        <search-result
          v-show="store.show_type == 'result'"
          :search_csid="search_csid"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, defineComponent,watch } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
import { useMittOn, MITT_TYPES } from 'src/core/mitt'
import {  MenuData,  GlobalSwitchClass,SearchPCClass } from 'src/output/index.js'
import { LayOutMain_pc } from "src/output/project/common/pc-common.js";
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
import search from "src/core/search-class/search.js"
import searchInput from "./search-input.vue"
import searchInt from "./search-init.vue"
import searchSports from "./search-sports.vue"
import searchPlay from "./search-play.vue"
import searchResult from "./search-result.vue"
import { TabWapper as Tab } from "src/components/common/tab"
import { api_search } from "src/api/index.js";
import { compute_css_variables } from "src/core/css-var/index.js"
// 响应数据处理 及 兄弟组件业务逻辑处理
import {store, mutations} from './index.js'
// 该组件展示类变量
const page_style = ref('')
const is_iframe = ref(utils_info.is_iframe); /** 是否内嵌 */
const main_menu_toggle = ref(MenuData.main_menu_toggle) /** 左侧列表显示形式 normal：展开 mini：收起 */
const search_width = ref(LayOutMain_pc.layout_search_width)
const main_width = ref(LayOutMain_pc.layout_main_width + 'px')
const search_isShow = ref(SearchPCClass.search_isShow) // 是否显示搜索组件 default: false




// const route = useRoute()

page_style.value = compute_css_variables({ category: 'component', module: 'header-search' })


/** 保存显示搜索组件状态 */
const set_search_status = (data) =>{
  SearchPCClass.set_search_isShow(data)
}
const { off } = useMittOn(MITT_TYPES.EMIT_LAYOUT_HEADER_SEARCH_ISSHOW, (bool) => {
  search_isShow.value = bool
})

const click_fun = () => set_search_status(false);

// 是否展开多列玩法 default: object
const is_unfold_multi_column = ref(LayOutMain_pc.is_unfold_multi_column)

// const change_status = (pramas)=>{
//   show_type.value = pramas.type
//   search_text.value = pramas.text
// }

onMounted(() => {
  // if (search.back_keyword.keyword) {
  //   store.keyword = search.back_keyword.keyword
  // }
  document.addEventListener('click', click_fun)
  window.addEventListener('resize', on_resize)
  // 初始化球种菜单数据
mutations.get_sports_list_handle()
})

onUnmounted(() => {
  document.removeEventListener('click', click_fun)
  window.removeEventListener('resize', on_resize)
  off
})

// watch(
//     () => route.name,
//     (res) => {
//       console.log('route.nameroute.nameroute.nameroute.nameroute.nameroute.name', res)
//     }
// )

/**
 * @Description 设置球种tab选中索引
 * @param {number} index 索引
 * @param {undefined} undefined
*/
function sportHandle(index) {
  mutations.set_sports_handle(index)
}


/** 窗口变化 */
function on_resize() {
  LayOutMain_pc.set_layout_main_width()
  LayOutMain_pc.set_layout_search_width()
  search_width.value = LayOutMain_pc.layout_search_width
  main_width.value = LayOutMain_pc.layout_main_width + 'px'
}
</script>

<style lang="scss" scoped>
@import "./search.scss";
.search-position {
  position: fixed;
  left: 0;
  // width: v-bind(main_width);
  // right: 0;
  top: 60px;
  bottom: 0;
  z-index: 10001;

  &.iframe {
    top: 50px !important;
  }

  &.hide-search {
    height: 40px;
    bottom: auto;

    .bottom-wrap {
      display: none;
    }
  }
  // background-color: pink;
}

.serach-wrap {
  position: absolute;
  top: 0;
  left: 0px;
  bottom: 0;
  z-index: 999;
  width: 100%;

  

  .bottom-wrap {
    top: -1px;
    background: var(--q-header-search-color-6);

    :deep(.serach-background) {
      background-color: var(--q-gb-bg-c-11);
      min-height: 400px;
      overflow: hidden;
    }

    :deep(.sports-tab) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50px;
      padding: 10px 0 0 15px;
      z-index: 999;
      /* 修改此值  需注意是否被滚球倒计时遮挡 */
      background-color: var(--q-gb-bg-c-11);
      border-bottom: 1px solid var(--q-header-search-color-5);

      .tab-item {
        height: 38px;
        line-height: 10px;
        padding: 0 10px;
      }

      .line-wrap {
        transform: none;
      }
    }
  }

  .search-result {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  }

  &.mini {
    top: 60px;
    left: 63px;
  }
}</style>