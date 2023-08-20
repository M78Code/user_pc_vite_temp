<!-- @Description: 搜索弹层 -->

<template>
  <div v-if="search_isShow" v-show="route.params.video_size != 1" class="serach-wrap column"
    :style="{ right: `${(MenuData.is_multi_column && is_unfold_multi_column) ? parseInt(layout_size.main_width * .3) : layout_size.right_width}px`, paddingRight: `${is_iframe ? 10 : 14}px` }"
    :class="{ 'hide-search': show_type == 'none', 'mini': main_menu_toggle == 'mini', 'iframe': is_iframe }">
    <search-input @set_show_type="set_show_type" :show_type="show_type" />
    <div class="bottom-wrap col search-result relative-position">
      <!-- 球类导航 -->
      <div class="sports-tab" @click.stop>
        <tab :list="sports_list" :is_show_line="true" :is_show_btn="true" tab_name_key="sportName" :padding="10"
          @onclick="set_sports_tab_index" :currentIndex="sports_tab_index" ref="tab" />
      </div>
      <!-- 初始化 -->
      <search-int class="serach-background" v-show="show_type == 'init'" @set_show_type="set_show_type"
        :show_type="show_type" />
      <!-- 搜索联想-->
      <!-- <search-related class="serach-background" v-show="show_type == 'related'" @set_show_type="set_show_type" /> -->
      <!-- 搜球类 -->
      <search-sports class="serach-background" v-show="show_type == 'sports'" @set_show_type="set_show_type"
        ref="sports" />
      <!-- 搜玩法 -->
      <search-play class="serach-background" v-show="show_type == 'play'" @set_show_type="set_show_type" />
      <!-- 搜索结果 -->
      <search-result v-show="show_type == 'result'" @set_show_type="set_show_type" :search_csid="search_csid" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import lodash from "lodash";
import { useRoute } from "vue-router";
import { useMittOn, MITT_TYPES } from 'src/core/mitt'
import utils from "src/core/utils/utils.js"

//-------------------- 对接参数 prop 注册  开始  -------------------- 
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "src/components/search/config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
const props = defineProps({})
// const computed_props = useRegistPropsHelper(component_symbol, defineProps(need_register_props));
// const tableClass_computed = useComputed.tableClass_computed(props)
// const title_computed = useComputed.title_computed(props)
//-------------------- 对接参数 prop 注册  结束  -------------------- 

import store from "src/store-redux/index.js";
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
// import search from "src/core/search-class/search.js"
import MenuData from "src/core/menu-pc/menu-data-class.js";

/** 是否内嵌 */
const is_iframe = ref(utils.is_iframe);

/** 显示类型 */
const show_type = ref('init')
/** 球种列表 */
let sports_list = reactive([])
/** 球种tab选中索引 */
const sports_tab_index = ref(0)
/** 搜索球种 */
const search_csid = ref(1)

/* 路由对象 */
const route = useRoute();

/** stroe仓库 */
const store_data = store.getState();
const { searchReducer, userReducer, layoutReducer, menuReducer, globalReducer } = store_data;
/**
 * 是否显示搜索组件 default: false
 * 路径: project_path\src\store\module\search.js
 */
// const search_isShow = ref(searchReducer.search_isShow)
const search_isShow = ref(false)
const { off } = useMittOn(MITT_TYPES.EMIT_LAYOUT_HEADER_SEARCH_ISSHOW, (bool) => {
  console.error('执行了', bool);
  search_isShow.value = bool
})
onUnmounted(off)

/** 
 * 左侧列表显示形式 normal：展开 mini：收起
 * 路径: project_path\src\store\module\menu.js
 */
const { main_menu_toggle } = menuReducer
/** 
 * 用户信息 default: {}
 * 路径: src\store-redux\module\user-info.js
 */
const { user_info } = userReducer
/** 
 * 浏览器 宽高等数据 default: object
 * 路径: project_path\src\store\module\layout.js
 */
const { layout_size } = layoutReducer
/** 
* 是否展开多列玩法 default: object
* 路径: project_path\src\store\module\global.js
*/
const { is_unfold_multi_column } = globalReducer

/**
 * @Description:设置搜索球种列表
 * @return {undefined} undefined
 */
function set_sports_list() {
  // let csid = search.back_keyword.csid
  let csid = ''
  api_search.get_search_sport().then(res => {
    if (lodash.get(res, 'data.code') == 200) {
      const list = lodash.get(res, 'data.data') || []
      // 根据商户过滤篮球赛事
      // if(user_info.mId == '1443742662615240704'){
      //   lodash.remove(sports_list, item => item.id == 2)
      // }
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
onMounted(set_sports_list)

/**
 * @Description:设置显示类型
 * @param {String} type 类型
 * @return {Undefined} Undefined
 */
function set_show_type(type) {
  show_type.value = type
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

</script>

<style lang="scss" scoped>
.serach-wrap {
  position: absolute;
  top: 60px;
  left: 0px;
  bottom: 0;
  z-index: 999;

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
    background: var(--qq--theme-bg-search-mask);

    ::v-deep .serach-background {
      background-color: var(--qq--theme-bg-search-match);
      min-height: 400px;
      overflow: hidden;
    }

    ::v-deep .sports-tab {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50px;
      padding: 10px 0 0 30px;
      z-index: 999;
      /* 修改此值  需注意是否被滚球倒计时遮挡 */
      background-color: var(--qq--theme-bg-search-match);
      border-bottom: 1px solid var(--qq--theme-bd-color-search-pnl);

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
}
</style>
