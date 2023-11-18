<!-- @Description: 搜索弹层 -->

<template>
   <div style="display:none">{{SearchPCClass.update_time}}</div>
   <div
    v-if="SearchPCClass.search_isShow"
    class="search-position"
    :style="page_style"
    >
    <div
      v-show="route.params.video_size != 1"
      class="serach-wrap column"
      :style="{ right: `${search_width}px`, paddingRight: `${utils.is_iframe ? 10 : 14}px`}"
      :class="{ 'hide-search': show_type == 'none', 'mini': main_menu_toggle == 'mini', 'iframe': utils.is_iframe }"
    >
      <!-- <search-input v-model:show_type="show_type" /> -->
      <!-- 遮罩层样式.bottom-wrap -->
      <div class="bottom-wrap col search-result relative-position">
        <!-- 球类导航 -->
        <div
          class="sports-tab"
          @click.stop
        >
          <tab
            :list="sports_list"
            :is_show_line="true"
            :is_show_btn="true"
            tab_name_key="sportName"
            :padding="10"
            @onclick="set_sports_tab_index"
            :currentIndex="sports_tab_index"
            ref="tab"
          />
        </div>
        <!-- 初始化 -->
        <search-int
          class="serach-background"
          v-show="show_type == 'init'"
          v-model:show_type="show_type"
        />
        <!-- 搜球类 -->
        <search-sports
          class="serach-background"
          v-show="show_type == 'sports'"
          v-model:show_type="show_type"
          ref="sports"
        />
        <!-- 搜玩法 -->
        <search-play
          class="serach-background"
          v-show="show_type == 'play'"
          v-model:show_type="show_type"
        />
        <!-- 搜索结果 -->
        <search-result
          v-show="show_type == 'result'"
          v-model:show_type="show_type"
          :search_csid="search_csid"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, defineComponent,watch, defineProps } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
import { useMittOn, MITT_TYPES } from 'src/core/mitt';
import SearchPCClass from 'src/core/search-class/seach-pc-ouzhou-calss.js';
import { LayOutMain_pc, utils } from 'src/core/index.js'
// 搜索输入框组件
import searchInput from "./search-input.vue"
// 搜索初始化组件
import searchInt from "./search-init.vue"
//搜索赛事组件
import searchSports from "./search-sports.vue"
// 搜索玩法组件
import searchPlay from "./search-play.vue"
// 搜索查询结果组件
import searchResult from "./search-result.vue"
// 引入tab切换栏组件
import { TabWapper as Tab } from "src/components/common/tab"
// 搜索模块js
import { api_search } from "src/api/index.js";

import { compute_css_variables } from "src/core/css-var/index.js"

//-------------------- 对接参数 prop 注册  开始  -------------------- 
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 
const page_style = ref('')
page_style.value = compute_css_variables({ category: 'component', module: 'header-search' })
/** 左侧列表显示形式 normal：展开 mini：收起 */
const main_menu_toggle = ref('')

/** 显示类型 */
const show_type = ref('init')
/** 球种列表 */
let sports_list = reactive([])
/** 球种tab选中索引 */
const sports_tab_index = ref(0)
/** 搜索球种 */
const search_csid = ref(1)

let search_width = ref(LayOutMain_pc.layout_search_width + 'px')
let main_width = ref(LayOutMain_pc.layout_main_width + 'px')
let mitt_list = []
/* 路由对象 */
const route = useRoute();
/**
 * 是否显示搜索组件 default: false
 * 路径: project_path\src\store\module\search.js
 */
const search_isShow = ref(SearchPCClass.search_isShow)
/* 
  * 监听搜索组件变更获取最新的数据
*/
watch(
  () => SearchPCClass.update_time,
  (val) => {
    if (val) {
      search_isShow.value = SearchPCClass.search_isShow
    }
  },
  { deep: true }
);

onMounted(()=>{
  useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, change_status)
})

const change_status = (pramas)=>{
  show_type.value = pramas.type
  console.log('sss',pramas);
}

/** 保存显示搜索组件状态 */
const set_search_status = (data) =>{
  SearchPCClass.set_search_isShow(data)
}

function show_search_rezult(bool) {
  search_isShow.value = bool
} 

const click_fun = () => set_search_status(false);
// TODO:
// onMounted(() => document.addEventListener('click', click_fun))
// onUnmounted(() => document.removeEventListener('click', click_fun))

/** 
 * 浏览器 宽高等数据 default: object
 * 路径: project_path\src\store\module\layout.js
 */

/** 
* 是否展开多列玩法 default: object
* 路径: project_path\src\store\module\global.js
*/
const is_unfold_multi_column = ref(LayOutMain_pc.is_unfold_multi_column)



// const unsubscribe = store.subscribe(() => {
//   const { searchReducer: new_searchReducer, layoutReducer: new_layoutReducer, globalReducer: new_globalReducer } = store.getState()
// })
// onUnmounted(unsubscribe)

/**
 * @Description:设置搜索球种列表
 * @return {undefined} undefined
 */
function set_sports_list() {
  // let csid = search.back_keyword.csid
  let csid = ''
  api_search.get_search_sport().then(res => {
    if (lodash.get(res, 'code') == 200) {
      const list = lodash.get(res, 'data') || []
      // 根据商户过滤篮球赛事
      sports_list = list
      // 默认第一个 足球被禁用后 默认值不是1
      search_csid.value = (list[0] || {}).id
      if (csid) {
        sports_list.forEach((item, index) => {
          if (csid == item.id) {
            set_sports_tab_index(index)
          }
        })
      }
    } else {
      sports_list = []
    }
  }).catch(err => {
    console.error(err);
    sports_list = []
  });
}

/**
 * @Description 设置球种tab选中索引
 * @param {number} index 索引
 * @param {undefined} undefined
*/
function set_sports_tab_index(index) {
  let index_ = index;
  if (typeof (index) == 'object') {
    index_ = index.index;
  }
  sports_tab_index.value = index_
  search_csid.value = sports_list[index_].id
}


/** 窗口变化 */
function on_resize() {
  LayOutMain_pc.set_layout_main_width()
  LayOutMain_pc.set_layout_search_width()
  search_width.value = LayOutMain_pc.layout_search_width
  main_width.value = LayOutMain_pc.layout_main_width + 'px'
}
onMounted(() => {
  mitt_list = [
    useMittOn(MITT_TYPES.EMIT_LAYOUT_HEADER_SEARCH_ISSHOW, show_search_rezult).off
  ]
  window.addEventListener('resize', on_resize)
  set_sports_list()
})

onUnmounted(() => {
  mitt_list.forEach(i => i());
  window.removeEventListener('resize', on_resize)
})

</script>
<script>
export default defineComponent({
  name: 'search'
})
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
  // background-color: pink;
}

.serach-wrap {
  position: absolute;
  top: 10px;
  left: 240px;
  bottom: 0;
  z-index: 999;
  min-width: 1445px;

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

  .bottom-wrap {
    top: -1px;
    background: var(--q-header-search-color-2);

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
      padding: 10px 0 0 30px;
      z-index: 999;
      /* 修改此值  需注意是否被滚球倒计时遮挡 */
      background-color: var(--q-gb-bg-c-11);
      border-bottom: 1px solid var(--q-header-search-color-5);

      .tab-item {
        height: 38px;
        line-height: 40px;
        padding: 0 10px;
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
