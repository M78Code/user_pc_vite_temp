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
      :style="{ right: `${search_width}px`, paddingRight: `${utils_info.is_iframe ? 10 : 14}px`}"
      :class="{ 'hide-search': show_type == 'none', 'mini': main_menu_toggle == 'mini', 'iframe': utils_info.is_iframe }"
    >
      <!-- <search-input v-model:show_type="show_type" /> -->
      <!-- 遮罩层样式.bottom-wrap -->
      <div class="bottom-wrap col search-result relative-position">
        <div class="sports-tab" ref="tab" v-if="sports_list.length">
          <search-tab-warp 
            :sports_list="sports_list" 
            :sports_tab_index="sports_tab_index"
            @change_tabs="set_sports_tab_index"
          ></search-tab-warp>
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
// import { ref, reactive, onMounted, onUnmounted, defineComponent,watch, defineProps } from "vue";
import { ref, reactive, onMounted, onUnmounted, defineComponent,watch } from "vue";
import lodash from "lodash";
import { utils_info } from 'src/core/utils/common/module/match-list-utils.js'
import { useRoute } from "vue-router";
import { useMittOn, MITT_TYPES } from 'src/core/mitt';
import SearchPCClass from 'src/core/search-class/seach-pc-ouzhou-calss.js';
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
// 搜索初始化组件
import searchInt from "./search-init.vue"
// 搜索tabs组件
import searchTabWarp from "./search_tab_warp.vue"
//搜索赛事组件
import searchSports from "./search-sports.vue"
// 搜索玩法组件
import searchPlay from "./search-play.vue"
// 搜索查询结果组件
import searchResult from "./search-result.vue"
// 搜索模块js
import { api_search } from "src/api/index.js";

import { compute_css_variables } from "src/core/css-var/index.js"

import BUILDIN_CONFIG from "app/job/output/env/index.js";;
const { IS_FOR_NEIBU_TEST } = BUILDIN_CONFIG ;

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
// 搜索关键字
const search_text = ref('')

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

const change_status = (pramas)=>{
  show_type.value = pramas.type
  search_text.value = pramas.text
}
const {off}=useMittOn(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, change_status)

onUnmounted(()=>{
  off()
})

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
      // 内部测试展示所有球种，线上只放开足、篮 网 电足 电篮
      const ls = ["1", "2","5","90","91"];
      // sports_list = IS_FOR_NEIBU_TEST ? list : list.filter(item => ls.includes(item.id))
      sports_list = list;
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
  // useMittEmit(MITT_TYPES.EMIT_SET_SEARCH_CHANGE, {
  //     tab_index: index
  // })
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
  width: 100%;
  bottom: 0;
  z-index: 10001;
  // background-color: pink;
}

.serach-wrap {
  position: absolute;
  top: 10px;
  left: 50%;
  bottom: 0;
  z-index: 999;
  min-width: 1450px;
  transform: translateX(-730px);
  &.iframe {
    // top: 50px !important;
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
    // background: var(--q-header-search-color-2);
    background-color: #e2e2e2;

    :deep(.serach-background) {
      background-color: #e2e2e2;
      // min-height: 400px;
      overflow: hidden;
    }
  }

  .search-result {
    // box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
    margin-top: 9px;
    width: 1450px;
  }

  &.mini {
    top: 60px;
    left: 63px;
  }
}
.sports-tab {
	padding: 9px 20px;
	display: flex;
	border-bottom: 1px solid var(--q-gb-bd-c-1);
	background-color: var(--q-gb-bg-c-4);
	font-size: 14px;
	font-weight: 500;
	width: 100%;
	z-index: 1;
	color: var(--q-gb-t-c-5);
  width: 100%;
}
</style>